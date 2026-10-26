#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LOCALES_PATH = ROOT / "src" / "config" / "locales.json"
PRODUCTS_PATH = ROOT / "src" / "config" / "products.json"
ROUTES_PATH = ROOT / "src" / "config" / "routes.json"

APPROVED_LOCALES = ["en", "fr", "ru", "es", "uk", "it", "de", "he", "pt", "ka", "ro", "pl"]
SUPPORTED_PRODUCT_STATUSES = {"live", "preview", "preparing", "planned", "partner-pilot", "internal"}
SUPPORTED_CTA_STATUSES = {
    "live",
    "demo",
    "preview",
    "waitlist",
    "request-access",
    "partner-inquiry",
    "internal",
    "disabled",
}
SUPPORTED_EVIDENCE_LEVELS = {
    "exists-in-code",
    "wired",
    "reachable",
    "deployment-configured",
    "live-verified",
    "unknown",
}
SUPPORTED_PRICING_STATUSES = {
    "unpublished",
    "prototype-only",
    "provisional-owner-supplied",
    "not-applicable",
}
SUPPORTED_ROUTE_ACCESS = {
    "public-indexable",
    "public-noindex",
    "restricted",
    "internal",
    "legacy-review",
}
REQUIRED_LOCALE_TOP_LEVEL = {
    "schemaVersion",
    "defaultLocale",
    "editorialMasterLocale",
    "fallbackLocale",
    "localeCount",
    "translationStatusVocabulary",
    "locales",
}
REQUIRED_LOCALE_FIELDS = {
    "code",
    "englishName",
    "nativeName",
    "direction",
    "publicEnabled",
    "fallbackLocale",
    "translationStatus",
    "canonicalPublicLocale",
    "sharedRuntimeAvailable",
    "capRuntimeAvailable",
    "standalonePageConsistency",
    "toolingConsistency",
    "notes",
}
REQUIRED_PRODUCT_TOP_LEVEL = {
    "schemaVersion",
    "statusVocabulary",
    "ctaStatusVocabulary",
    "evidenceLevelVocabulary",
    "pricingStatusVocabulary",
    "products",
}
REQUIRED_PRODUCT_FIELDS = {
    "id",
    "publicName",
    "category",
    "audiences",
    "publicStatus",
    "evidenceLevel",
    "currentRoute",
    "futureRoute",
    "primaryCtaStatus",
    "pricingStatus",
    "indexabilityRecommendation",
    "existingEvidence",
    "safePublicClaim",
    "unsafePublicClaim",
    "ownerReviewRequired",
    "notes",
}
REQUIRED_ROUTE_TOP_LEVEL = {"schemaVersion", "accessVocabulary", "routes"}
REQUIRED_ROUTE_FIELDS = {
    "path",
    "source",
    "routeType",
    "currentState",
    "recommendedAccess",
    "recommendedIndexability",
    "localeStrategy",
    "productIds",
    "containsPrototypeCommerce",
    "containsPersonalOrPartnerData",
    "requiresOwnerReview",
    "notes",
}


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def load_json(path: Path) -> dict:
    try:
        with path.open("r", encoding="utf-8") as fh:
            data = json.load(fh)
    except FileNotFoundError:
        fail(f"missing file: {path.relative_to(ROOT)}")
    except json.JSONDecodeError as exc:
        fail(f"invalid JSON in {path.relative_to(ROOT)}: {exc}")
    if not isinstance(data, dict):
        fail(f"{path.relative_to(ROOT)} must contain a JSON object")
    return data


def duplicates(values: list[str]) -> list[str]:
    seen: set[str] = set()
    dupes: list[str] = []
    for value in values:
        if value in seen and value not in dupes:
            dupes.append(value)
        seen.add(value)
    return dupes


def require_fields(name: str, item: dict, required: set[str]) -> None:
    missing = sorted(required - set(item))
    if missing:
        fail(f"{name} missing required field(s): {', '.join(missing)}")


def validate_vocabulary(name: str, values: object, expected: set[str]) -> None:
    if not isinstance(values, list) or not all(isinstance(value, str) for value in values):
        fail(f"{name} must be an array of strings")
    if set(values) != expected:
        fail(f"{name} must exactly match supported values: {', '.join(sorted(expected))}")


def validate_locales(data: dict) -> list[str]:
    require_fields("locales.json", data, REQUIRED_LOCALE_TOP_LEVEL)
    validate_vocabulary(
        "locales.json translationStatusVocabulary",
        data.get("translationStatusVocabulary"),
        {"complete-shared-runtime", "partial-standalone-pages", "requires-audit"},
    )

    locales = data.get("locales")
    if not isinstance(locales, list):
        fail("locales.json must contain a locales array")
    if data.get("localeCount") != len(APPROVED_LOCALES):
        fail(f"localeCount must be {len(APPROVED_LOCALES)}")

    codes: list[str] = []
    for item in locales:
        if not isinstance(item, dict):
            fail("each locale entry must be an object")
        require_fields("locale entry", item, REQUIRED_LOCALE_FIELDS)
        code = item.get("code")
        if not isinstance(code, str) or not code:
            fail("each locale entry must include a non-empty code")
        codes.append(code)
        if item.get("translationStatus") not in data["translationStatusVocabulary"]:
            fail(f"unsupported translation status for {code}: {item.get('translationStatus')}")
        if item.get("fallbackLocale") not in APPROVED_LOCALES:
            fail(f"unsupported fallback locale for {code}: {item.get('fallbackLocale')}")
        for bool_field in ("publicEnabled", "canonicalPublicLocale", "sharedRuntimeAvailable", "capRuntimeAvailable"):
            if not isinstance(item.get(bool_field), bool):
                fail(f"locale {code} field {bool_field} must be boolean")

    dupes = duplicates(codes)
    if dupes:
        fail(f"duplicate locale codes: {', '.join(dupes)}")

    if codes != APPROVED_LOCALES:
        fail(f"locales must exactly match approved order: {', '.join(APPROVED_LOCALES)}")

    default_locale = data.get("defaultLocale")
    fallback_locale = data.get("fallbackLocale")
    editorial_master = data.get("editorialMasterLocale")
    if default_locale not in codes:
        fail("default locale is absent from locales array")
    if fallback_locale not in codes:
        fail("fallback locale is absent from locales array")
    if editorial_master not in codes:
        fail("editorial master locale is absent from locales array")

    by_code = {item["code"]: item for item in locales}
    if by_code["he"].get("direction") != "rtl":
        fail("Hebrew must be marked rtl")
    for code, item in by_code.items():
        if code != "he" and item.get("direction") == "rtl":
            fail(f"non-Hebrew locale marked rtl: {code}")

    return codes


def validate_products(data: dict) -> set[str]:
    require_fields("products.json", data, REQUIRED_PRODUCT_TOP_LEVEL)
    validate_vocabulary("products.json statusVocabulary", data.get("statusVocabulary"), SUPPORTED_PRODUCT_STATUSES)
    validate_vocabulary("products.json ctaStatusVocabulary", data.get("ctaStatusVocabulary"), SUPPORTED_CTA_STATUSES)
    validate_vocabulary(
        "products.json evidenceLevelVocabulary",
        data.get("evidenceLevelVocabulary"),
        SUPPORTED_EVIDENCE_LEVELS,
    )
    validate_vocabulary(
        "products.json pricingStatusVocabulary",
        data.get("pricingStatusVocabulary"),
        SUPPORTED_PRICING_STATUSES,
    )

    products = data.get("products")
    if not isinstance(products, list):
        fail("products.json must contain a products array")

    ids: list[str] = []
    for item in products:
        if not isinstance(item, dict):
            fail("each product entry must be an object")
        require_fields("product entry", item, REQUIRED_PRODUCT_FIELDS)
        product_id = item.get("id")
        if not isinstance(product_id, str) or not product_id:
            fail("each product entry must include a non-empty id")
        ids.append(product_id)
        if not isinstance(item.get("audiences"), list) or not all(
            isinstance(audience, str) and audience for audience in item.get("audiences", [])
        ):
            fail(f"audiences must be a non-empty string array for {product_id}")
        if not (item.get("currentRoute") is None or isinstance(item.get("currentRoute"), str)):
            fail(f"currentRoute must be a string or null for {product_id}")

        status = item.get("publicStatus")
        if status not in SUPPORTED_PRODUCT_STATUSES:
            fail(f"unsupported product status for {product_id}: {status}")

        evidence = item.get("evidenceLevel")
        if evidence not in SUPPORTED_EVIDENCE_LEVELS:
            fail(f"unsupported evidence level for {product_id}: {evidence}")

        cta = item.get("primaryCtaStatus")
        if cta not in SUPPORTED_CTA_STATUSES:
            fail(f"unsupported CTA status for {product_id}: {cta}")

        pricing = item.get("pricingStatus")
        if pricing not in SUPPORTED_PRICING_STATUSES:
            fail(f"unsupported pricing status for {product_id}: {pricing}")

        if not isinstance(item.get("ownerReviewRequired"), bool):
            fail(f"ownerReviewRequired must be boolean for {product_id}")

    dupes = duplicates(ids)
    if dupes:
        fail(f"duplicate product IDs: {', '.join(dupes)}")

    return set(ids)


def validate_routes(data: dict, product_ids: set[str]) -> list[str]:
    require_fields("routes.json", data, REQUIRED_ROUTE_TOP_LEVEL)
    validate_vocabulary("routes.json accessVocabulary", data.get("accessVocabulary"), SUPPORTED_ROUTE_ACCESS)

    routes = data.get("routes")
    if not isinstance(routes, list):
        fail("routes.json must contain a routes array")

    paths: list[str] = []
    for item in routes:
        if not isinstance(item, dict):
            fail("each route entry must be an object")
        require_fields("route entry", item, REQUIRED_ROUTE_FIELDS)
        path = item.get("path")
        if not isinstance(path, str) or not path.startswith("/"):
            fail("each route entry must include a path starting with /")
        paths.append(path)

        access = item.get("recommendedAccess")
        if access not in SUPPORTED_ROUTE_ACCESS:
            fail(f"unsupported access classification for {path}: {access}")

        route_product_ids = item.get("productIds")
        if not isinstance(route_product_ids, list):
            fail(f"route productIds must be an array for {path}")
        for product_id in route_product_ids:
            if not isinstance(product_id, str):
                fail(f"route {path} productIds must contain only strings")
            if product_id not in product_ids:
                fail(f"route {path} references unknown product ID: {product_id}")
        for bool_field in (
            "containsPrototypeCommerce",
            "containsPersonalOrPartnerData",
            "requiresOwnerReview",
        ):
            if not isinstance(item.get(bool_field), bool):
                fail(f"route {path} field {bool_field} must be boolean")

    dupes = duplicates(paths)
    if dupes:
        fail(f"duplicate route paths: {', '.join(dupes)}")

    return paths


def main() -> None:
    locales = load_json(LOCALES_PATH)
    products = load_json(PRODUCTS_PATH)
    routes = load_json(ROUTES_PATH)

    locale_codes = validate_locales(locales)
    product_ids = validate_products(products)
    route_paths = validate_routes(routes, product_ids)

    print(
        "Foundation config OK: "
        f"{len(locale_codes)} locales, {len(product_ids)} products, {len(route_paths)} routes validated."
    )


if __name__ == "__main__":
    main()
