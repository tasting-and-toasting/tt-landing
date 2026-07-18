#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
PAGES_PATH = ROOT / "src" / "config" / "pages.json"
PRODUCTS_PATH = ROOT / "src" / "config" / "products.json"
ROUTES_PATH = ROOT / "src" / "config" / "routes.json"
VERCEL_PATH = ROOT / "vercel.json"

SUPPORTED_TITLE_SOURCES = {"html-title", "filename-derived"}
REQUIRED_TOP_LEVEL = {
    "schemaVersion",
    "titleSourceVocabulary",
    "pages",
}
REQUIRED_PAGE_FIELDS = {
    "id",
    "route",
    "source",
    "title",
    "product",
    "productIds",
    "public",
    "localized",
    "indexable",
    "routeAliases",
    "titleSource",
    "notes",
}


class PageRegistryError(ValueError):
    pass


class HtmlFactsParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self._in_title = False
        self._title_parts: list[str] = []
        self.data_i18n_count = 0
        self.script_sources: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr = {key: value or "" for key, value in attrs}
        if tag == "title":
            self._in_title = True
        if any(
            key in attr
            for key in (
                "data-i18n",
                "data-i18n-html",
                "data-i18n-title",
                "data-i18n-placeholder",
                "data-i18n-value",
                "data-i18n-ph",
            )
        ):
            self.data_i18n_count += 1
        if tag == "script" and attr.get("src"):
            self.script_sources.append(attr["src"])

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self._in_title = False

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self._title_parts.append(data)

    @property
    def title(self) -> str:
        return " ".join("".join(self._title_parts).split())

    @property
    def localized(self) -> bool:
        runtime_scripts = {
            "src/i18n/apply-tt141.js",
            "/src/i18n/apply-tt141.js",
            "src/i18n/cap-i18n.js",
            "/src/i18n/cap-i18n.js",
        }
        return self.data_i18n_count > 0 or any(
            src in runtime_scripts
            or src.endswith("/apply-tt141.js")
            or src.endswith("/cap-i18n.js")
            for src in self.script_sources
        )


def fail(message: str) -> None:
    raise PageRegistryError(message)


def display_path(path: Path) -> str:
    try:
        return path.relative_to(ROOT).as_posix()
    except ValueError:
        return str(path)


def load_json(path: Path) -> dict[str, Any]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        fail(f"missing file: {display_path(path)}")
    except json.JSONDecodeError as exc:
        fail(f"invalid JSON in {display_path(path)}: {exc}")
    if not isinstance(data, dict):
        fail(f"{display_path(path)} must contain a JSON object")
    return data


def duplicates(values: list[str]) -> list[str]:
    seen: set[str] = set()
    dupes: list[str] = []
    for value in values:
        if value in seen and value not in dupes:
            dupes.append(value)
        seen.add(value)
    return dupes


def require_fields(name: str, item: dict[str, Any], required: set[str]) -> None:
    missing = sorted(required - set(item))
    if missing:
        fail(f"{name} missing required field(s): {', '.join(missing)}")


def html_sources() -> set[str]:
    sources: set[str] = set()
    for path in ROOT.rglob("*.html"):
        if ".git" in path.parts or "node_modules" in path.parts:
            continue
        sources.add(path.relative_to(ROOT).as_posix())
    return sources


def html_facts(source: str) -> HtmlFactsParser:
    path = ROOT / source
    parser = HtmlFactsParser()
    parser.feed(path.read_text(encoding="utf-8"))
    return parser


def route_policy_maps(routes_data: dict[str, Any]) -> tuple[dict[str, dict[str, Any]], set[str]]:
    routes = routes_data.get("routes")
    if not isinstance(routes, list):
        fail("routes.json must contain a routes array")
    by_path: dict[str, dict[str, Any]] = {}
    future_paths: set[str] = set()
    for item in routes:
        if not isinstance(item, dict):
            fail("each routes.json route must be an object")
        path = item.get("path")
        if not isinstance(path, str) or not path.startswith("/"):
            fail("each routes.json route path must start with /")
        by_path[path] = item
        if str(item.get("source")) == "future-proposed":
            future_paths.add(path)
    return by_path, future_paths


def rewrite_aliases_by_destination(deployment_data: dict[str, Any]) -> dict[str, set[str]]:
    rewrites = deployment_data.get("rewrites")
    if not isinstance(rewrites, list):
        fail("vercel.json must contain a rewrites array")
    aliases: dict[str, set[str]] = {}
    for item in rewrites:
        if not isinstance(item, dict):
            fail("each vercel.json rewrite must be an object")
        source = item.get("source")
        destination = item.get("destination")
        if not isinstance(source, str) or not source.startswith("/"):
            fail("each vercel.json rewrite source must start with /")
        if not isinstance(destination, str) or not destination.startswith("/"):
            fail("each vercel.json rewrite destination must start with /")
        destination_route = destination.split("?", 1)[0]
        aliases.setdefault(destination_route, set()).add(source)
    return aliases


def validate_pages(
    pages_data: dict[str, Any],
    products_data: dict[str, Any],
    routes_data: dict[str, Any],
    deployment_data: dict[str, Any] | None = None,
) -> list[str]:
    require_fields("pages.json", pages_data, REQUIRED_TOP_LEVEL)
    if set(pages_data.get("titleSourceVocabulary", [])) != SUPPORTED_TITLE_SOURCES:
        fail("pages.json titleSourceVocabulary must exactly match supported values")

    products = products_data.get("products")
    if not isinstance(products, list):
        fail("products.json must contain a products array")
    product_ids = {
        product.get("id")
        for product in products
        if isinstance(product, dict) and isinstance(product.get("id"), str)
    }

    route_by_path, future_paths = route_policy_maps(routes_data)
    deployment = deployment_data if deployment_data is not None else load_json(VERCEL_PATH)
    rewrite_aliases = rewrite_aliases_by_destination(deployment)
    pages = pages_data.get("pages")
    if not isinstance(pages, list):
        fail("pages.json must contain a pages array")

    declared_ids: list[str] = []
    declared_sources: list[str] = []
    declared_routes: list[str] = []
    declared_aliases: list[str] = []

    for item in pages:
        if not isinstance(item, dict):
            fail("each page entry must be an object")
        require_fields("page entry", item, REQUIRED_PAGE_FIELDS)

        page_id = item.get("id")
        route = item.get("route")
        source = item.get("source")
        title = item.get("title")
        product = item.get("product")
        product_ids_for_page = item.get("productIds")
        route_aliases = item.get("routeAliases")
        title_source = item.get("titleSource")

        if not isinstance(page_id, str) or not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", page_id):
            fail(f"page {route} id must be a kebab-case string")
        declared_ids.append(page_id)

        if not isinstance(route, str) or not route.startswith("/"):
            fail("each page route must start with /")
        if route in future_paths:
            fail(f"page registry must not include future proposed route: {route}")
        if route not in route_by_path:
            fail(f"page route is absent from routes.json: {route}")
        declared_routes.append(route)

        if not isinstance(source, str) or not source.endswith(".html"):
            fail(f"page {route} source must be an HTML file path")
        if not (ROOT / source).is_file():
            fail(f"page {route} source does not exist: {source}")
        declared_sources.append(source)

        if not isinstance(title, str) or not title:
            fail(f"page {route} title must be a non-empty string")
        if not isinstance(product, str) or not product:
            fail(f"page {route} product must be a non-empty string")
        if product != "none" and product not in product_ids:
            fail(f"page {route} references unknown product: {product}")
        if not isinstance(product_ids_for_page, list):
            fail(f"page {route} productIds must be an array")
        if product == "none" and product_ids_for_page:
            fail(f"page {route} product must not be none when productIds are present")
        if product != "none" and product not in product_ids_for_page:
            fail(f"page {route} product must be present in productIds")
        for product_id in product_ids_for_page:
            if not isinstance(product_id, str) or product_id not in product_ids:
                fail(f"page {route} references unknown productId: {product_id}")

        if not isinstance(item.get("public"), bool):
            fail(f"page {route} public must be boolean")
        if not isinstance(item.get("localized"), bool):
            fail(f"page {route} localized must be boolean")
        if not isinstance(item.get("indexable"), bool):
            fail(f"page {route} indexable must be boolean")
        if title_source not in SUPPORTED_TITLE_SOURCES:
            fail(f"page {route} has unsupported titleSource: {title_source}")
        if not isinstance(route_aliases, list) or not all(
            isinstance(alias, str) and alias.startswith("/") for alias in route_aliases
        ):
            fail(f"page {route} routeAliases must be route strings")
        declared_aliases.extend(route_aliases)
        if not isinstance(item.get("notes"), str) or not item["notes"]:
            fail(f"page {route} notes must be a non-empty string")

        policy = route_by_path[route]
        recommended_access = policy.get("recommendedAccess")
        expected_public = recommended_access not in {"restricted", "internal"}
        if item["public"] != expected_public:
            fail(f"page {route} public flag disagrees with routes.json")
        if item["indexable"] != (recommended_access == "public-indexable"):
            fail(f"page {route} indexable disagrees with routes.json")

        expected_aliases = rewrite_aliases.get(route, set())
        if set(route_aliases) != expected_aliases:
            fail(
                f"page {route} routeAliases disagree with vercel.json rewrites: "
                f"expected={sorted(expected_aliases)} got={sorted(route_aliases)}"
            )
        for alias in route_aliases:
            if alias not in route_by_path:
                fail(f"page {route} alias is absent from routes.json: {alias}")
            if route_by_path[alias].get("recommendedAccess") != recommended_access:
                fail(f"page {route} alias access disagrees with page route: {alias}")

        facts = html_facts(source)
        if item["localized"] != facts.localized:
            fail(f"page {route} localized flag disagrees with HTML signals")
        if title_source == "html-title" and title != facts.title:
            fail(f"page {route} title disagrees with HTML title")
        if title_source == "filename-derived" and facts.title:
            fail(f"page {route} titleSource should be html-title")

    id_dupes = duplicates(declared_ids)
    if id_dupes:
        fail(f"duplicate page id(s): {', '.join(id_dupes)}")
    source_dupes = duplicates(declared_sources)
    if source_dupes:
        fail(f"duplicate page source(s): {', '.join(source_dupes)}")
    route_dupes = duplicates(declared_routes)
    if route_dupes:
        fail(f"duplicate page route(s): {', '.join(route_dupes)}")
    alias_dupes = duplicates(declared_aliases)
    if alias_dupes:
        fail(f"duplicate page route alias(es): {', '.join(alias_dupes)}")
    route_alias_overlap = sorted(set(declared_routes) & set(declared_aliases))
    if route_alias_overlap:
        fail(f"route aliases overlap primary routes: {', '.join(route_alias_overlap)}")

    source_set = set(declared_sources)
    actual_sources = html_sources()
    missing = sorted(actual_sources - source_set)
    extra = sorted(source_set - actual_sources)
    if missing or extra:
        fail(
            "page registry source mismatch: "
            f"missing={missing[:10]} extra={extra[:10]}"
        )

    return declared_sources


def main() -> int:
    try:
        pages = load_json(PAGES_PATH)
        products = load_json(PRODUCTS_PATH)
        routes = load_json(ROUTES_PATH)
        deployment = load_json(VERCEL_PATH)
        sources = validate_pages(pages, products, routes, deployment)
    except PageRegistryError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1
    aliases = sum(len(page.get("routeAliases", [])) for page in pages["pages"])
    print(
        "Page registry OK: "
        f"{len(pages['pages'])} pages, {len(sources)} HTML sources, {aliases} route aliases validated."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
