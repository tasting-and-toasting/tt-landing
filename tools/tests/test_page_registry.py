from __future__ import annotations

import copy
import importlib.util
import sys
import tempfile
import unittest
from pathlib import Path


TOOLS_DIR = Path(__file__).resolve().parents[1]
ROOT = TOOLS_DIR.parents[0]


def load_validator_module():
    path = TOOLS_DIR / "validate-page-registry.py"
    spec = importlib.util.spec_from_file_location("validate_page_registry_test", path)
    if spec is None or spec.loader is None:
        raise RuntimeError("cannot load validate-page-registry.py")
    module = importlib.util.module_from_spec(spec)
    sys.modules["validate_page_registry_test"] = module
    spec.loader.exec_module(module)
    return module


class PageRegistryTest(unittest.TestCase):
    def setUp(self) -> None:
        self.validator = load_validator_module()
        self.pages = self.validator.load_json(ROOT / "src" / "config" / "pages.json")
        self.products = self.validator.load_json(ROOT / "src" / "config" / "products.json")
        self.routes = self.validator.load_json(ROOT / "src" / "config" / "routes.json")
        self.deployment = self.validator.load_json(ROOT / "vercel.json")

    def validate(self, pages: dict) -> list[str]:
        return self.validator.validate_pages(
            pages,
            self.products,
            self.routes,
            self.deployment,
        )

    def page_by_route(self, route: str) -> dict:
        for page in self.pages["pages"]:
            if page["route"] == route:
                return page
        raise AssertionError(f"missing page route: {route}")

    def test_all_html_sources_are_registered(self) -> None:
        sources = self.validate(self.pages)
        self.assertEqual(len(self.pages["pages"]), 26)
        self.assertEqual(set(sources), self.validator.html_sources())

    def test_required_foundation_page_facts(self) -> None:
        home = self.page_by_route("/")
        self.assertEqual(home["id"], "home")
        self.assertEqual(home["title"], "Tasting & Toasting | Wine Discovery And Bottle Passport Context")
        self.assertEqual(home["product"], "wine-lovers")
        self.assertTrue(home["public"])
        self.assertTrue(home["localized"])
        self.assertTrue(home["indexable"])

        access = self.page_by_route("/access")
        self.assertFalse(access["public"])
        self.assertTrue(access["localized"])
        self.assertFalse(access["indexable"])

        bottle_scan = self.page_by_route("/bottle-scan")
        self.assertIn("/cap/b/:token", bottle_scan["routeAliases"])

    def test_wine_lovers_page_is_registered_as_public_implementation(self) -> None:
        wine_lovers = self.page_by_route("/wine-lovers")
        self.assertEqual(wine_lovers["id"], "wine-lovers")
        self.assertEqual(wine_lovers["source"], "wine-lovers.html")
        self.assertEqual(
            wine_lovers["title"],
            "Wine Lovers | Learn, Taste, And Remember Wine | Tasting & Toasting",
        )
        self.assertEqual(wine_lovers["product"], "wine-lovers")
        self.assertEqual(
            wine_lovers["productIds"],
            [
                "wine-lovers",
                "blind-tasting",
                "tasting-notes",
                "taste-profile",
                "toasts",
                "wine-library",
                "cap-passport",
            ],
        )
        self.assertTrue(wine_lovers["public"])
        self.assertTrue(wine_lovers["localized"])
        self.assertTrue(wine_lovers["indexable"])
        self.assertEqual(wine_lovers["routeAliases"], [])
        self.assertEqual(wine_lovers["titleSource"], "html-title")

    def test_design_pages_use_filename_derived_titles(self) -> None:
        design_pages = [
            page for page in self.pages["pages"] if page["source"].startswith("_design/")
        ]
        self.assertEqual(len(design_pages), 4)
        for page in design_pages:
            self.assertEqual(page["titleSource"], "filename-derived")
            self.assertFalse(page["public"])
            self.assertFalse(page["localized"])
            self.assertFalse(page["indexable"])

    def test_malformed_json_fails_clearly(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "pages.json"
            path.write_text("{", encoding="utf-8")
            with self.assertRaises(self.validator.PageRegistryError):
                self.validator.load_json(path)

    def test_duplicate_page_id_fails(self) -> None:
        pages = copy.deepcopy(self.pages)
        pages["pages"][1]["id"] = pages["pages"][0]["id"]
        with self.assertRaises(self.validator.PageRegistryError):
            self.validate(pages)

    def test_unknown_product_fails(self) -> None:
        pages = copy.deepcopy(self.pages)
        pages["pages"][0]["product"] = "unknown-product"
        pages["pages"][0]["productIds"] = ["unknown-product"]
        with self.assertRaises(self.validator.PageRegistryError):
            self.validate(pages)

    def test_missing_html_source_fails(self) -> None:
        pages = copy.deepcopy(self.pages)
        pages["pages"] = pages["pages"][:-1]
        with self.assertRaises(self.validator.PageRegistryError):
            self.validate(pages)

    def test_title_drift_fails(self) -> None:
        pages = copy.deepcopy(self.pages)
        pages["pages"][0]["title"] = "Wrong title"
        with self.assertRaises(self.validator.PageRegistryError):
            self.validate(pages)

    def test_public_must_be_boolean(self) -> None:
        pages = copy.deepcopy(self.pages)
        pages["pages"][0]["public"] = "public"
        with self.assertRaises(self.validator.PageRegistryError):
            self.validate(pages)

    def test_route_aliases_must_match_rewrites(self) -> None:
        pages = copy.deepcopy(self.pages)
        self.page_by_route("/bottle-scan")
        for page in pages["pages"]:
            if page["route"] == "/bottle-scan":
                page["routeAliases"] = []
                break
        with self.assertRaises(self.validator.PageRegistryError):
            self.validate(pages)


if __name__ == "__main__":
    unittest.main()
