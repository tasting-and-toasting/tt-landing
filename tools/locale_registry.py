#!/usr/bin/env python3
"""Shared loader for the canonical landing locale registry."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_REGISTRY_PATH = ROOT / "src" / "config" / "locales.json"

_REQUIRED_TOP_LEVEL = {
    "defaultLocale",
    "editorialMasterLocale",
    "fallbackLocale",
    "localeCount",
    "locales",
}
_REQUIRED_LOCALE_FIELDS = {
    "code",
    "direction",
    "publicEnabled",
    "canonicalPublicLocale",
    "sharedRuntimeAvailable",
    "capRuntimeAvailable",
}


class LocaleRegistryError(ValueError):
    """Raised when src/config/locales.json cannot be used by tooling."""


def _fail(message: str) -> None:
    raise LocaleRegistryError(message)


def _ensure_bool(locale_code: str, item: dict[str, Any], field: str) -> None:
    if not isinstance(item.get(field), bool):
        _fail(f"locale {locale_code!r} field {field!r} must be boolean")


def load_locale_registry(path: Path | str | None = None) -> dict[str, Any]:
    """Load and validate the canonical locale registry."""
    registry_path = Path(path) if path is not None else DEFAULT_REGISTRY_PATH
    try:
        data = json.loads(registry_path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        _fail(f"locale registry is missing: {registry_path}")
    except json.JSONDecodeError as exc:
        _fail(f"locale registry is malformed JSON: {registry_path}: {exc}")

    if not isinstance(data, dict):
        _fail("locale registry must contain a JSON object")

    missing_top = sorted(_REQUIRED_TOP_LEVEL - set(data))
    if missing_top:
        _fail(f"locale registry missing required field(s): {', '.join(missing_top)}")

    locales = data.get("locales")
    if not isinstance(locales, list) or not locales:
        _fail("locale registry must contain a non-empty locales array")

    codes: list[str] = []
    for idx, item in enumerate(locales):
        if not isinstance(item, dict):
            _fail(f"locale entry {idx} must be an object")
        missing = sorted(_REQUIRED_LOCALE_FIELDS - set(item))
        if missing:
            _fail(
                f"locale entry {idx} missing required field(s): "
                f"{', '.join(missing)}"
            )
        code = item.get("code")
        if not isinstance(code, str) or not code:
            _fail(f"locale entry {idx} must include a non-empty code")
        codes.append(code)

        direction = item.get("direction")
        if direction not in {"ltr", "rtl"}:
            _fail(f"locale {code!r} has unsupported direction: {direction!r}")

        fallback = item.get("fallbackLocale")
        if fallback is not None and not isinstance(fallback, str):
            _fail(f"locale {code!r} fallbackLocale must be a string when present")

        for field in (
            "publicEnabled",
            "canonicalPublicLocale",
            "sharedRuntimeAvailable",
            "capRuntimeAvailable",
        ):
            _ensure_bool(code, item, field)

    seen: set[str] = set()
    duplicates: list[str] = []
    for code in codes:
        if code in seen and code not in duplicates:
            duplicates.append(code)
        seen.add(code)
    if duplicates:
        _fail(f"duplicate locale code(s): {', '.join(duplicates)}")

    locale_count = data.get("localeCount")
    if not isinstance(locale_count, int) or locale_count != len(codes):
        _fail(
            "localeCount must be an integer matching locales length "
            f"({len(codes)})"
        )

    for field in ("defaultLocale", "fallbackLocale", "editorialMasterLocale"):
        value = data.get(field)
        if not isinstance(value, str) or not value:
            _fail(f"{field} must be a non-empty string")
        if value not in codes:
            _fail(f"{field} {value!r} is absent from locales array")

    by_code = {item["code"]: item for item in locales}
    for item in locales:
        fallback = item.get("fallbackLocale")
        if fallback is not None and fallback not in by_code:
            _fail(
                f"locale {item['code']!r} fallbackLocale {fallback!r} "
                "is absent from locales array"
            )

    return data


def _locale_entries(
    registry: dict[str, Any] | None = None,
    *,
    public_enabled: bool | None = None,
    shared_runtime_available: bool | None = None,
    cap_runtime_available: bool | None = None,
) -> list[dict[str, Any]]:
    data = registry if registry is not None else load_locale_registry()
    entries = list(data["locales"])
    filters = (
        ("publicEnabled", public_enabled),
        ("sharedRuntimeAvailable", shared_runtime_available),
        ("capRuntimeAvailable", cap_runtime_available),
    )
    for field, expected in filters:
        if expected is not None:
            entries = [item for item in entries if item.get(field) is expected]
    return entries


def get_canonical_locale_codes(
    registry: dict[str, Any] | None = None,
    *,
    public_enabled: bool | None = None,
    shared_runtime_available: bool | None = None,
    cap_runtime_available: bool | None = None,
) -> tuple[str, ...]:
    """Return canonical locale codes in registry order."""
    return tuple(
        item["code"]
        for item in _locale_entries(
            registry,
            public_enabled=public_enabled,
            shared_runtime_available=shared_runtime_available,
            cap_runtime_available=cap_runtime_available,
        )
    )


def get_default_locale(registry: dict[str, Any] | None = None) -> str:
    data = registry if registry is not None else load_locale_registry()
    return str(data["defaultLocale"])


def get_fallback_locale(registry: dict[str, Any] | None = None) -> str:
    data = registry if registry is not None else load_locale_registry()
    return str(data["fallbackLocale"])


def get_editorial_master_locale(registry: dict[str, Any] | None = None) -> str:
    data = registry if registry is not None else load_locale_registry()
    return str(data["editorialMasterLocale"])


def get_non_default_locale_codes(
    registry: dict[str, Any] | None = None,
    *,
    public_enabled: bool | None = None,
    shared_runtime_available: bool | None = None,
    cap_runtime_available: bool | None = None,
) -> tuple[str, ...]:
    data = registry if registry is not None else load_locale_registry()
    default_locale = get_default_locale(data)
    return tuple(
        code
        for code in get_canonical_locale_codes(
            data,
            public_enabled=public_enabled,
            shared_runtime_available=shared_runtime_available,
            cap_runtime_available=cap_runtime_available,
        )
        if code != default_locale
    )


def get_rtl_locale_codes(registry: dict[str, Any] | None = None) -> tuple[str, ...]:
    data = registry if registry is not None else load_locale_registry()
    return tuple(item["code"] for item in data["locales"] if item["direction"] == "rtl")


def validate_locale_subset(
    locale_codes: tuple[str, ...] | list[str],
    registry: dict[str, Any] | None = None,
    *,
    label: str = "locale subset",
) -> tuple[str, ...]:
    """Validate a specialized tool subset against canonical locale codes."""
    data = registry if registry is not None else load_locale_registry()
    canonical = set(get_canonical_locale_codes(data))
    if not isinstance(locale_codes, (tuple, list)):
        _fail(f"{label} must be a list or tuple")
    codes = tuple(locale_codes)
    if not all(isinstance(code, str) and code for code in codes):
        _fail(f"{label} must contain only non-empty locale code strings")

    seen: set[str] = set()
    duplicates: list[str] = []
    for code in codes:
        if code in seen and code not in duplicates:
            duplicates.append(code)
        seen.add(code)
    if duplicates:
        _fail(f"{label} contains duplicate locale code(s): {', '.join(duplicates)}")

    unknown = [code for code in codes if code not in canonical]
    if unknown:
        _fail(f"{label} contains unknown locale code(s): {', '.join(unknown)}")
    return codes


def chunk_locale_codes(locale_codes: tuple[str, ...], size: int) -> tuple[tuple[str, ...], ...]:
    if size <= 0:
        _fail("locale chunk size must be positive")
    return tuple(
        tuple(locale_codes[idx : idx + size])
        for idx in range(0, len(locale_codes), size)
    )
