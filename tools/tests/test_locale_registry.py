from __future__ import annotations

import copy
import json
import tempfile
import unittest
from pathlib import Path
import sys


TOOLS_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(TOOLS_DIR))

from locale_registry import (  # noqa: E402
    LocaleRegistryError,
    get_canonical_locale_codes,
    get_default_locale,
    get_editorial_master_locale,
    get_fallback_locale,
    get_non_default_locale_codes,
    get_rtl_locale_codes,
    load_locale_registry,
)


EXPECTED = ("en", "fr", "ru", "es", "uk", "it", "de", "he", "pt", "ka", "ro", "pl")


class LocaleRegistryTest(unittest.TestCase):
    def setUp(self) -> None:
        self.registry = load_locale_registry()

    def test_canonical_locale_order_and_count(self) -> None:
        self.assertEqual(get_canonical_locale_codes(self.registry), EXPECTED)
        self.assertEqual(len(get_canonical_locale_codes(self.registry)), 12)

    def test_default_editorial_rtl_and_presence(self) -> None:
        self.assertEqual(get_default_locale(self.registry), "en")
        self.assertEqual(get_fallback_locale(self.registry), "en")
        self.assertEqual(get_editorial_master_locale(self.registry), "ru")
        self.assertEqual(get_rtl_locale_codes(self.registry), ("he",))
        self.assertIn("pl", get_canonical_locale_codes(self.registry))
        self.assertIn("fr", get_canonical_locale_codes(self.registry))

    def test_non_default_locales(self) -> None:
        non_default = get_non_default_locale_codes(self.registry)
        self.assertEqual(len(non_default), 11)
        self.assertEqual(non_default, EXPECTED[1:])

    def test_malformed_registry_fails(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "locales.json"
            path.write_text("{", encoding="utf-8")
            with self.assertRaises(LocaleRegistryError):
                load_locale_registry(path)

    def test_duplicate_locale_code_fails(self) -> None:
        data = copy.deepcopy(self.registry)
        data["locales"][1]["code"] = "en"
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "locales.json"
            path.write_text(json.dumps(data), encoding="utf-8")
            with self.assertRaises(LocaleRegistryError):
                load_locale_registry(path)

    def test_missing_default_locale_fails(self) -> None:
        data = copy.deepcopy(self.registry)
        data["defaultLocale"] = "zz"
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "locales.json"
            path.write_text(json.dumps(data), encoding="utf-8")
            with self.assertRaises(LocaleRegistryError):
                load_locale_registry(path)

    def test_missing_fallback_locale_fails(self) -> None:
        data = copy.deepcopy(self.registry)
        data["fallbackLocale"] = "zz"
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "locales.json"
            path.write_text(json.dumps(data), encoding="utf-8")
            with self.assertRaises(LocaleRegistryError):
                load_locale_registry(path)

    def test_missing_editorial_master_locale_fails(self) -> None:
        data = copy.deepcopy(self.registry)
        data["editorialMasterLocale"] = "zz"
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "locales.json"
            path.write_text(json.dumps(data), encoding="utf-8")
            with self.assertRaises(LocaleRegistryError):
                load_locale_registry(path)


if __name__ == "__main__":
    unittest.main()
