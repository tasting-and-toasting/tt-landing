from __future__ import annotations

import importlib.util
import sys
import unittest
from pathlib import Path


TOOLS_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(TOOLS_DIR))

from locale_registry import (  # noqa: E402
    LocaleRegistryError,
    get_canonical_locale_codes,
    get_non_default_locale_codes,
    load_locale_registry,
    validate_locale_subset,
)


def load_audit_module():
    path = TOOLS_DIR / "audit-locale-tooling.py"
    spec = importlib.util.spec_from_file_location("audit_locale_tooling_test", path)
    if spec is None or spec.loader is None:
        raise RuntimeError("cannot load audit-locale-tooling.py")
    module = importlib.util.module_from_spec(spec)
    sys.modules["audit_locale_tooling_test"] = module
    spec.loader.exec_module(module)
    return module


class LocaleToolingTest(unittest.TestCase):
    def setUp(self) -> None:
        self.registry = load_locale_registry()
        self.audit = load_audit_module()

    def test_specialized_subsets_cannot_contain_unknown_locales(self) -> None:
        with self.assertRaises(LocaleRegistryError):
            validate_locale_subset(("fr", "zz"), self.registry, label="bad subset")

    def test_canonical_tools_expose_complete_expected_set(self) -> None:
        reports = self.audit.build_tool_reports()
        canonical = get_canonical_locale_codes(self.registry)
        canonical_reports = [report for report in reports if report.mode == "canonical"]
        self.assertTrue(canonical_reports)
        for report in canonical_reports:
            self.assertEqual(report.targets, canonical)

    def test_non_default_tools_expose_all_except_default(self) -> None:
        reports = self.audit.build_tool_reports()
        expected = get_non_default_locale_codes(self.registry)
        non_default_reports = [report for report in reports if report.mode == "non-default"]
        self.assertTrue(non_default_reports)
        for report in non_default_reports:
            self.assertEqual(report.targets, expected)

    def test_audit_reports_are_valid(self) -> None:
        reports = self.audit.build_tool_reports()
        self.assertEqual(self.audit.validate_tool_reports(reports), [])

    def test_audit_fails_when_canonical_tool_omits_locale(self) -> None:
        report = self.audit.ToolReport(
            path="tools/example.py",
            classification="ACTIVE TOOL",
            mode="canonical",
            targets=get_canonical_locale_codes(self.registry)[:-1],
            target_groups={},
            reason="",
        )
        errors = self.audit.validate_tool_reports([report])
        self.assertTrue(any("canonical targets must be" in error for error in errors))

    def test_audit_fails_when_non_default_tool_has_wrong_targets(self) -> None:
        report = self.audit.ToolReport(
            path="tools/example.py",
            classification="ACTIVE TOOL",
            mode="non-default",
            targets=("en",) + get_non_default_locale_codes(self.registry),
            target_groups={},
            reason="",
        )
        errors = self.audit.validate_tool_reports([report])
        self.assertTrue(any("non-default targets must be" in error for error in errors))

    def test_audit_fails_when_specialized_tool_has_unknown_locale(self) -> None:
        report = self.audit.ToolReport(
            path="tools/example.py",
            classification="SPECIALIZED TOOL",
            mode="specialized",
            targets=("fr", "zz"),
            target_groups={},
            reason="",
        )
        errors = self.audit.validate_tool_reports([report])
        self.assertTrue(any("unknown locale code" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
