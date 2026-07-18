#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import sys
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
PAGES_PATH = ROOT / "src" / "config" / "pages.json"
ROUTES_PATH = ROOT / "src" / "config" / "routes.json"
VERCEL_PATH = ROOT / "vercel.json"

IGNORED_HTML_PARTS = {".git", "node_modules"}
EXPECTED_CLEAN_URLS = True
EXPECTED_TRAILING_SLASH = False
SOURCE_REWRITE_PREFIX = "vercel.json rewrite to "


class RouteCoverageError(ValueError):
    pass


@dataclass(frozen=True)
class Rewrite:
    source: str
    destination: str

    @property
    def destination_route(self) -> str:
        return self.destination.split("?", 1)[0]


@dataclass
class AuditResult:
    physical_sources: list[str]
    registered_pages: list[dict[str, Any]]
    route_entries: list[dict[str, Any]]
    rewrites: list[Rewrite]
    valid_pages: list[str] = field(default_factory=list)
    orphan_pages: list[str] = field(default_factory=list)
    missing_registered_sources: list[str] = field(default_factory=list)
    pages_without_public_route: list[str] = field(default_factory=list)
    valid_routes: list[str] = field(default_factory=list)
    orphan_routes: list[str] = field(default_factory=list)
    broken_routes: list[str] = field(default_factory=list)
    duplicate_routes: list[str] = field(default_factory=list)
    conflicting_routes: list[str] = field(default_factory=list)
    intentional_internal_pages: list[str] = field(default_factory=list)
    unknown_requires_review: list[str] = field(default_factory=list)
    trailing_slash_findings: list[str] = field(default_factory=list)
    file_extension_findings: list[str] = field(default_factory=list)

    @property
    def route_declaration_count(self) -> int:
        return len(self.route_entries) + len(self.rewrites)

    @property
    def html_count(self) -> int:
        return len(self.physical_sources)

    @property
    def page_count(self) -> int:
        return len(self.registered_pages)

    @property
    def route_policy_count(self) -> int:
        return len(self.route_entries)

    @property
    def rewrite_count(self) -> int:
        return len(self.rewrites)

    @property
    def failed(self) -> bool:
        return any(
            (
                self.orphan_pages,
                self.missing_registered_sources,
                self.pages_without_public_route,
                self.orphan_routes,
                self.broken_routes,
                self.duplicate_routes,
                self.conflicting_routes,
            )
        )


def fail(message: str) -> None:
    raise RouteCoverageError(message)


def display_path(path: Path) -> str:
    try:
        return path.relative_to(ROOT).as_posix()
    except ValueError:
        return str(path)


def load_json(path: Path) -> dict[str, Any]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        fail(f"missing file: {display_path(path)}")
    except json.JSONDecodeError as exc:
        fail(f"invalid JSON in {display_path(path)}: {exc}")
    if not isinstance(data, dict):
        fail(f"{display_path(path)} must contain a JSON object")
    return data


def html_sources(root: Path = ROOT) -> list[str]:
    sources: list[str] = []
    for path in root.rglob("*.html"):
        if IGNORED_HTML_PARTS & set(path.parts):
            continue
        sources.append(path.relative_to(root).as_posix())
    return sorted(sources)


def route_from_source(source: str) -> str:
    if source == "index.html":
        return "/"
    if source.endswith("/index.html"):
        return "/" + source.removesuffix("/index.html")
    return "/" + source.removesuffix(".html")


def normalize_route(path: str) -> str:
    if path != "/" and path.endswith("/"):
        path = path.rstrip("/")
    if path.endswith(".html"):
        path = path.removesuffix(".html")
    return path or "/"


def route_pattern_to_regex(path: str) -> re.Pattern[str]:
    parts = path.strip("/").split("/")
    if path == "/":
        return re.compile(r"^/$")
    rendered: list[str] = []
    for part in parts:
        if part.startswith(":"):
            rendered.append(r"[^/]+")
        else:
            rendered.append(re.escape(part))
    return re.compile(r"^/" + "/".join(rendered) + r"$")


def routes_conflict(left: str, right: str) -> bool:
    if left == right:
        return False
    left_parts = left.strip("/").split("/")
    right_parts = right.strip("/").split("/")
    if left == "/" or right == "/" or len(left_parts) != len(right_parts):
        return False
    return all(
        left_part == right_part or left_part.startswith(":") or right_part.startswith(":")
        for left_part, right_part in zip(left_parts, right_parts)
    )


def route_paths(routes_data: dict[str, Any]) -> list[str]:
    routes = routes_data.get("routes")
    if not isinstance(routes, list):
        fail("routes.json must contain a routes array")
    paths: list[str] = []
    for item in routes:
        if not isinstance(item, dict):
            fail("each routes.json route must be an object")
        path = item.get("path")
        if not isinstance(path, str) or not path.startswith("/"):
            fail("each routes.json route path must start with /")
        paths.append(path)
    return paths


def page_entries(pages_data: dict[str, Any]) -> list[dict[str, Any]]:
    pages = pages_data.get("pages")
    if not isinstance(pages, list):
        fail("pages.json must contain a pages array")
    for page in pages:
        if not isinstance(page, dict):
            fail("each pages.json page must be an object")
    return pages


def rewrite_entries(vercel_data: dict[str, Any]) -> list[Rewrite]:
    rewrites = vercel_data.get("rewrites", [])
    if not isinstance(rewrites, list):
        fail("vercel.json rewrites must be an array")
    parsed: list[Rewrite] = []
    for item in rewrites:
        if not isinstance(item, dict):
            fail("each vercel.json rewrite must be an object")
        source = item.get("source")
        destination = item.get("destination")
        if not isinstance(source, str) or not source.startswith("/"):
            fail("each vercel.json rewrite source must start with /")
        if not isinstance(destination, str) or not destination.startswith("/"):
            fail("each vercel.json rewrite destination must start with /")
        parsed.append(Rewrite(source=source, destination=destination))
    return parsed


def duplicate_values(values: list[str]) -> list[str]:
    counts = Counter(values)
    return sorted(value for value, count in counts.items() if count > 1)


def audit_route_coverage(
    pages_data: dict[str, Any],
    routes_data: dict[str, Any],
    vercel_data: dict[str, Any],
    physical_sources: list[str] | None = None,
) -> AuditResult:
    sources = physical_sources if physical_sources is not None else html_sources()
    pages = page_entries(pages_data)
    routes = routes_data["routes"]
    rewrites = rewrite_entries(vercel_data)

    result = AuditResult(
        physical_sources=sources,
        registered_pages=pages,
        route_entries=routes,
        rewrites=rewrites,
    )

    source_set = set(sources)
    page_sources = [page.get("source") for page in pages if isinstance(page.get("source"), str)]
    page_routes = [page.get("route") for page in pages if isinstance(page.get("route"), str)]
    route_policy_paths = route_paths(routes_data)
    route_policy_set = set(route_policy_paths)
    page_route_set = set(page_routes)
    source_to_pages: dict[str, list[dict[str, Any]]] = defaultdict(list)
    route_to_pages: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for page in pages:
        source = page.get("source")
        route = page.get("route")
        if isinstance(source, str):
            source_to_pages[source].append(page)
        if isinstance(route, str):
            route_to_pages[route].append(page)

    result.orphan_pages = sorted(source_set - set(page_sources))
    result.missing_registered_sources = sorted(set(page_sources) - source_set)

    for page in pages:
        source = page.get("source")
        route = page.get("route")
        if not isinstance(source, str) or not isinstance(route, str):
            continue
        if source in source_set and route in route_policy_set:
            result.valid_pages.append(f"{route} -> {source}")
        if page.get("public") is False and page.get("indexable") is False:
            access = next(
                (
                    route_entry.get("recommendedAccess")
                    for route_entry in routes
                    if route_entry.get("path") == route
                ),
                "unknown",
            )
            if access in {"restricted", "internal"}:
                result.intentional_internal_pages.append(f"{route} -> {source} ({access})")
        if route not in route_policy_set:
            result.pages_without_public_route.append(f"{route} -> {source}")

    route_dupes = duplicate_values(route_policy_paths)
    rewrite_dupes = duplicate_values([rewrite.source for rewrite in rewrites])
    result.duplicate_routes.extend(f"routes.json duplicate: {path}" for path in route_dupes)
    result.duplicate_routes.extend(f"vercel.json rewrite duplicate: {path}" for path in rewrite_dupes)

    for index, left in enumerate(route_policy_paths):
        for right in route_policy_paths[index + 1 :]:
            if routes_conflict(left, right):
                result.conflicting_routes.append(f"{left} conflicts with {right}")

    route_by_path = {route.get("path"): route for route in routes if isinstance(route.get("path"), str)}
    rewrite_by_source = {rewrite.source: rewrite for rewrite in rewrites}
    route_aliases = {
        alias
        for page in pages
        for alias in page.get("routeAliases", [])
        if isinstance(alias, str)
    }

    for alias in route_aliases:
        if alias not in route_policy_set:
            result.broken_routes.append(f"{alias} page alias is absent from routes.json")
        if alias not in rewrite_by_source:
            result.broken_routes.append(f"{alias} page alias is absent from vercel.json rewrites")

    for route in routes:
        path = route.get("path")
        source = route.get("source")
        if not isinstance(path, str) or not isinstance(source, str):
            continue

        if source == "future-proposed":
            result.unknown_requires_review.append(
                f"{path} has future-proposed policy but no registered source"
            )
            continue

        if source.startswith(SOURCE_REWRITE_PREFIX):
            rewrite = rewrite_by_source.get(path)
            if rewrite is None:
                result.orphan_routes.append(f"{path} is recorded as a rewrite policy but is absent from vercel.json")
                continue
            destination = rewrite.destination_route
            destination_page = route_to_pages.get(destination, [])
            if not destination_page:
                result.broken_routes.append(f"{path} rewrites to {destination}, which has no registered page")
            elif path not in route_aliases:
                result.orphan_routes.append(f"{path} rewrite is not attached to any page routeAliases")
            else:
                result.valid_routes.append(f"{path} -> {destination}")
            continue

        if source not in source_set:
            result.broken_routes.append(f"{path} source does not exist: {source}")
        elif not route_to_pages.get(path):
            result.orphan_routes.append(f"{path} resolves to {source} but is not attached to a registered page")
        else:
            result.valid_routes.append(f"{path} -> {source}")

    for rewrite in rewrites:
        destination = rewrite.destination_route
        if rewrite.source == "/.well-known/apple-app-site-association":
            if not (ROOT / destination.lstrip("/")).exists():
                result.broken_routes.append(f"{rewrite.source} rewrites to missing static file {destination}")
            continue
        if rewrite.source not in route_policy_set:
            result.orphan_routes.append(f"{rewrite.source} rewrite is absent from routes.json")
        if not route_pattern_to_regex(destination).match(destination):
            result.broken_routes.append(f"{rewrite.source} has invalid destination pattern {rewrite.destination}")
        if destination not in page_route_set:
            result.broken_routes.append(f"{rewrite.source} rewrites to {destination}, which has no registered page")

    if vercel_data.get("cleanUrls") != EXPECTED_CLEAN_URLS:
        result.file_extension_findings.append(
            f"vercel.json cleanUrls is {vercel_data.get('cleanUrls')!r}; expected {EXPECTED_CLEAN_URLS!r}"
        )
    else:
        html_route_mismatches = sorted(
            f"{page.get('route')} -> {page.get('source')}"
            for page in pages
            if isinstance(page.get("route"), str)
            and isinstance(page.get("source"), str)
            and page.get("route") != route_from_source(page["source"])
        )
        if html_route_mismatches:
            result.file_extension_findings.extend(html_route_mismatches)

    if vercel_data.get("trailingSlash") != EXPECTED_TRAILING_SLASH:
        result.trailing_slash_findings.append(
            f"vercel.json trailingSlash is {vercel_data.get('trailingSlash')!r}; expected {EXPECTED_TRAILING_SLASH!r}"
        )
    else:
        slash_routes = sorted(path for path in page_routes + route_policy_paths if path != "/" and path.endswith("/"))
        if slash_routes:
            result.trailing_slash_findings.extend(slash_routes)

    normalized_counts = Counter(normalize_route(path) for path in route_policy_paths)
    normalized_dupes = sorted(path for path, count in normalized_counts.items() if count > 1)
    for path in normalized_dupes:
        result.conflicting_routes.append(f"normalized route appears multiple times: {path}")

    result.valid_pages.sort()
    result.valid_routes.sort()
    result.intentional_internal_pages.sort()
    result.unknown_requires_review.sort()
    return result


def load_current_audit() -> AuditResult:
    return audit_route_coverage(
        load_json(PAGES_PATH),
        load_json(ROUTES_PATH),
        load_json(VERCEL_PATH),
    )


def print_list(title: str, values: list[str]) -> None:
    print(f"{title}: {len(values)}")
    for value in values:
        print(f"  - {value}")


def print_summary(result: AuditResult) -> None:
    status = "FAIL" if result.failed else "PASS"
    print(f"Route coverage audit {status}")
    print(f"HTML sources inspected: {result.html_count}")
    print(f"Registered pages inspected: {result.page_count}")
    print(
        "Routes inspected: "
        f"{result.route_policy_count} routes.json entries + "
        f"{result.rewrite_count} vercel rewrites = {result.route_declaration_count}"
    )
    print_list("Valid pages", result.valid_pages)
    print_list("Valid routes", result.valid_routes)
    print_list("Orphan pages", result.orphan_pages)
    print_list("Registered pages with missing source files", result.missing_registered_sources)
    print_list("Pages with no public route policy", result.pages_without_public_route)
    print_list("Orphan routes", result.orphan_routes)
    print_list("Broken routes", result.broken_routes)
    print_list("Duplicate routes", result.duplicate_routes)
    print_list("Conflicting routes", result.conflicting_routes)
    print_list("Intentional internal pages", result.intentional_internal_pages)
    print_list("Unknown cases requiring business review", result.unknown_requires_review)
    print_list("Trailing slash findings", result.trailing_slash_findings)
    print_list("File extension findings", result.file_extension_findings)


def main() -> int:
    try:
        result = load_current_audit()
    except RouteCoverageError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1
    print_summary(result)
    return 1 if result.failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
