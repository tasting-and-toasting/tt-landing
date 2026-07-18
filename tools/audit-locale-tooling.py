#!/usr/bin/env python3
"""Audit Python translation tooling against the canonical locale registry."""
from __future__ import annotations

import ast
import importlib.util
import sys
from dataclasses import dataclass
from pathlib import Path
from types import ModuleType
from typing import Any

from locale_registry import (
    LocaleRegistryError,
    get_canonical_locale_codes,
    get_default_locale,
    get_editorial_master_locale,
    get_fallback_locale,
    get_non_default_locale_codes,
    get_rtl_locale_codes,
    load_locale_registry,
    validate_locale_subset,
)


ROOT = Path(__file__).resolve().parents[1]


@dataclass(frozen=True)
class ToolSpec:
    path: str
    classification: str
    import_metadata: bool = True


@dataclass(frozen=True)
class ToolReport:
    path: str
    classification: str
    mode: str
    targets: tuple[str, ...]
    target_groups: dict[str, tuple[str, ...]]
    reason: str


KNOWN_TOOLS: tuple[ToolSpec, ...] = (
    ToolSpec("tools/merge-all-translations.py", "ACTIVE TOOL"),
    ToolSpec("tools/translate-index-claude.py", "ACTIVE TOOL"),
    ToolSpec("tools/translate-proto-gameflow-8langs.py", "SPECIALIZED TOOL"),
    ToolSpec("tools/translate-via-claude.py", "SPECIALIZED TOOL"),
    ToolSpec("tools/make-chatgpt-prompts.py", "LEGACY TOOL", import_metadata=False),
)


def _import_script(path: Path) -> ModuleType:
    module_name = "_locale_tooling_" + path.stem.replace("-", "_")
    spec = importlib.util.spec_from_file_location(module_name, path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"cannot import {path.relative_to(ROOT)}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[module_name] = module
    spec.loader.exec_module(module)
    return module


def _tuple_of_strings(value: Any) -> tuple[str, ...]:
    if not isinstance(value, (tuple, list)):
        raise RuntimeError(f"expected tuple/list locale metadata, got {type(value).__name__}")
    if not all(isinstance(item, str) for item in value):
        raise RuntimeError("locale metadata must contain only strings")
    return tuple(value)


def _groups_of_strings(value: Any) -> dict[str, tuple[str, ...]]:
    if value is None:
        return {}
    if not isinstance(value, dict):
        raise RuntimeError("TOOL_TARGET_GROUPS must be a dict when present")
    groups: dict[str, tuple[str, ...]] = {}
    for key, locales in value.items():
        if not isinstance(key, str):
            raise RuntimeError("TOOL_TARGET_GROUPS keys must be strings")
        groups[key] = _tuple_of_strings(locales)
    return groups


def _legacy_langs_from_ast(path: Path) -> tuple[str, ...]:
    tree = ast.parse(path.read_text(encoding="utf-8"), filename=str(path))
    for node in tree.body:
        if not isinstance(node, ast.Assign):
            continue
        names = [target.id for target in node.targets if isinstance(target, ast.Name)]
        if "LANGS" not in names:
            continue
        value = ast.literal_eval(node.value)
        if isinstance(value, str):
            return tuple(part.lower() for part in value.split())
        return _tuple_of_strings(value)
    return ()


def build_tool_reports() -> list[ToolReport]:
    reports: list[ToolReport] = []
    for spec in KNOWN_TOOLS:
        path = ROOT / spec.path
        if not path.is_file():
            raise RuntimeError(f"known tool is missing: {spec.path}")

        if spec.import_metadata:
            module = _import_script(path)
            mode = getattr(module, "TOOL_LOCALE_MODE", "unknown")
            targets = _tuple_of_strings(getattr(module, "TOOL_TARGET_LOCALES", ()))
            groups = _groups_of_strings(getattr(module, "TOOL_TARGET_GROUPS", None))
            reason = str(getattr(module, "TOOL_SPECIALIZATION_REASON", ""))
        else:
            mode = "legacy"
            targets = _legacy_langs_from_ast(path)
            groups = {}
            reason = "Legacy prompt-emitter; not modified in this task's permitted file set."

        reports.append(
            ToolReport(
                path=spec.path,
                classification=spec.classification,
                mode=mode,
                targets=targets,
                target_groups=groups,
                reason=reason,
            )
        )
    return reports


def validate_tool_reports(reports: list[ToolReport]) -> list[str]:
    registry = load_locale_registry()
    canonical = get_canonical_locale_codes(registry)
    non_default = get_non_default_locale_codes(registry)
    errors: list[str] = []

    for report in reports:
        declared_sets = [(f"{report.path} target locales", report.targets)]
        declared_sets.extend(
            (f"{report.path} {group} locales", group_targets)
            for group, group_targets in report.target_groups.items()
        )
        for label, locales in declared_sets:
            try:
                validate_locale_subset(locales, registry, label=label)
            except LocaleRegistryError as exc:
                errors.append(str(exc))

        if report.mode == "canonical" and report.targets != canonical:
            errors.append(
                f"{report.path} canonical targets must be: {', '.join(canonical)}"
            )
        elif report.mode == "non-default" and report.targets != non_default:
            errors.append(
                f"{report.path} non-default targets must be: {', '.join(non_default)}"
            )
        elif report.mode == "specialized" and not report.targets and not report.target_groups:
            errors.append(f"{report.path} specialized tool must declare targets")
        elif report.mode not in {"canonical", "non-default", "specialized", "legacy"}:
            errors.append(f"{report.path} has unknown locale mode: {report.mode}")

    return errors


def _fmt(codes: tuple[str, ...]) -> str:
    return ", ".join(codes) if codes else "(none)"


def main() -> int:
    registry = load_locale_registry()
    canonical = get_canonical_locale_codes(registry)
    reports = build_tool_reports()
    errors = validate_tool_reports(reports)

    print(f"Canonical locale count: {len(canonical)}")
    print(f"Canonical locale order: {_fmt(canonical)}")
    print(f"Default locale: {get_default_locale(registry)}")
    print(f"Fallback locale: {get_fallback_locale(registry)}")
    print(f"Editorial master locale: {get_editorial_master_locale(registry)}")
    print(f"RTL locales: {_fmt(get_rtl_locale_codes(registry))}")
    print("")
    print("Translation tools:")
    for report in reports:
        print(f"- {report.path}")
        print(f"  classification: {report.classification}")
        print(f"  mode: {report.mode}")
        print(f"  target locales: {_fmt(report.targets)}")
        if report.target_groups:
            for group, locales in report.target_groups.items():
                print(f"  {group} locales: {_fmt(locales)}")
        if report.reason:
            print(f"  note: {report.reason}")

    if errors:
        print("")
        print("ERRORS:")
        for error in errors:
            print(f"- {error}")
        return 1

    print("")
    print("Locale tooling audit: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
