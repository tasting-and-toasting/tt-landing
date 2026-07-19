from __future__ import annotations

import copy
import importlib.util
import sys
import unittest
from pathlib import Path


TOOLS_DIR = Path(__file__).resolve().parents[1]
ROOT = TOOLS_DIR.parents[0]


def load_audit_module():
    path = TOOLS_DIR / "audit-route-coverage.py"
    spec = importlib.util.spec_from_file_location("audit_route_coverage_test", path)
    if spec is None or spec.loader is None:
        raise RuntimeError("cannot load audit-route-coverage.py")
    module = importlib.util.module_from_spec(spec)
    sys.modules["audit_route_coverage_test"] = module
    spec.loader.exec_module(module)
    return module


class RouteCoverageTest(unittest.TestCase):
    def setUp(self) -> None:
        self.audit = load_audit_module()
        self.pages = self.audit.load_json(ROOT / "src" / "config" / "pages.json")
        self.routes = self.audit.load_json(ROOT / "src" / "config" / "routes.json")
        self.vercel = self.audit.load_json(ROOT / "vercel.json")
        self.sources = self.audit.html_sources()

    def run_audit(
        self,
        pages: dict | None = None,
        routes: dict | None = None,
        vercel: dict | None = None,
        sources: list[str] | None = None,
    ):
        return self.audit.audit_route_coverage(
            pages or self.pages,
            routes or self.routes,
            vercel or self.vercel,
            sources or self.sources,
        )

    def test_current_route_coverage_passes_without_broken_orphans(self) -> None:
        result = self.run_audit()
        self.assertFalse(result.failed)
        self.assertEqual(result.html_count, 26)
        self.assertEqual(result.page_count, 26)
        self.assertEqual(result.route_policy_count, 42)
        self.assertEqual(result.rewrite_count, 4)
        self.assertEqual(result.orphan_pages, [])
        self.assertEqual(result.orphan_routes, [])
        self.assertEqual(result.broken_routes, [])
        self.assertEqual(result.duplicate_routes, [])
        self.assertEqual(result.conflicting_routes, [])
        self.assertEqual(len(result.intentional_internal_pages), 8)
        self.assertEqual(len(result.unknown_requires_review), 13)
        self.assertEqual(result.trailing_slash_findings, [])
        self.assertEqual(result.file_extension_findings, [])

    def test_wine_lovers_route_is_current_public_page(self) -> None:
        page = next(page for page in self.pages["pages"] if page["route"] == "/wine-lovers")
        route = next(route for route in self.routes["routes"] if route["path"] == "/wine-lovers")

        self.assertEqual(page["source"], "wine-lovers.html")
        self.assertEqual(route["source"], "wine-lovers.html")
        self.assertEqual(route["routeType"], "current-public-product-page")
        self.assertEqual(
            route["currentState"],
            "implemented public Wine Lovers page with safe pre-launch fallbacks",
        )
        self.assertEqual(route["recommendedAccess"], "public-indexable")
        self.assertEqual(route["localeStrategy"], "shared-runtime-query-param")
        self.assertNotEqual(route["source"], "future-proposed")
        self.assertNotEqual(route["routeType"], "future-product-page")
        self.assertNotIn("not yet implemented", route["currentState"])

    def test_physical_html_missing_from_page_registry_is_orphan_page(self) -> None:
        pages = copy.deepcopy(self.pages)
        pages["pages"] = [page for page in pages["pages"] if page["source"] != "privacy.html"]
        result = self.run_audit(pages=pages)
        self.assertIn("privacy.html", result.orphan_pages)
        self.assertTrue(result.failed)

    def test_registered_page_with_missing_source_is_reported(self) -> None:
        pages = copy.deepcopy(self.pages)
        pages["pages"][0]["source"] = "missing.html"
        result = self.run_audit(pages=pages)
        self.assertIn("missing.html", result.missing_registered_sources)
        self.assertTrue(result.failed)

    def test_route_with_missing_html_source_is_broken(self) -> None:
        routes = copy.deepcopy(self.routes)
        routes["routes"][0]["source"] = "missing.html"
        result = self.run_audit(routes=routes)
        self.assertIn("/ source does not exist: missing.html", result.broken_routes)
        self.assertTrue(result.failed)

    def test_rewrite_alias_to_missing_destination_is_broken(self) -> None:
        vercel = copy.deepcopy(self.vercel)
        for rewrite in vercel["rewrites"]:
            if rewrite["source"] == "/for/:name":
                rewrite["destination"] = "/missing"
                break
        result = self.run_audit(vercel=vercel)
        self.assertIn("/for/:name rewrites to /missing, which has no registered page", result.broken_routes)
        self.assertTrue(result.failed)

    def test_duplicate_route_policy_is_reported(self) -> None:
        routes = copy.deepcopy(self.routes)
        routes["routes"].append(copy.deepcopy(routes["routes"][0]))
        result = self.run_audit(routes=routes)
        self.assertIn("routes.json duplicate: /", result.duplicate_routes)
        self.assertTrue(result.failed)

    def test_conflicting_dynamic_routes_are_reported(self) -> None:
        routes = copy.deepcopy(self.routes)
        routes["routes"].append(
            {
                "path": "/cap/b/:id",
                "source": "vercel.json rewrite to /bottle-scan?token=:id",
            }
        )
        result = self.run_audit(routes=routes)
        self.assertIn("/cap/b/:token conflicts with /cap/b/:id", result.conflicting_routes)
        self.assertTrue(result.failed)

    def test_trailing_slash_policy_drift_is_reported(self) -> None:
        vercel = copy.deepcopy(self.vercel)
        vercel["trailingSlash"] = True
        result = self.run_audit(vercel=vercel)
        self.assertIn("vercel.json trailingSlash is True; expected False", result.trailing_slash_findings)

    def test_clean_url_policy_drift_is_reported(self) -> None:
        vercel = copy.deepcopy(self.vercel)
        vercel["cleanUrls"] = False
        result = self.run_audit(vercel=vercel)
        self.assertIn("vercel.json cleanUrls is False; expected True", result.file_extension_findings)


if __name__ == "__main__":
    unittest.main()
