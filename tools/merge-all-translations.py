#!/usr/bin/env python3
"""
Merge ChatGPT exports + Claude JSON into src/i18n/tt141-features.json.
Loads English UI strings from all-pages-en.json into base[\"en\"] for proto/gameflow/wave1/ops.

Duplicates the shared key \"doc_title\" into per-page keys so prototype.html /
game-flow.html / wave1.html / operations.html titles do not clobber each other.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

try:
    import json_repair as _json_repair
except ImportError:
    _json_repair = None

ROOT = Path(__file__).resolve().parents[1]
OUT_PATH = ROOT / "src" / "i18n" / "tt141-features.json"
SRC_EN = ROOT / "src" / "i18n" / "all-pages-en.json"

LANGS = ["en", "fr", "ru", "es", "uk", "it", "de", "he", "pt", "ka", "ro"]

# Each section exposes doc_title under a unique key used by matching HTML pages.
SECTION_DOC_TITLE_KEY: dict[str, str] = {
    "proto": "prototype_doc_title",
    "gameflow": "gameflow_doc_title",
    "ops": "operations_doc_title",
    "wave1": "wave1_doc_title",
}

# Preserve merge order inside each bucket.
SECTION_FILES: tuple[tuple[str, tuple[str, ...]], ...] = (
    ("proto", (
        "tools/chatgpt-proto_chatgpt.txt",
        "tools/proto-part1-8langs-translated.json",
        "tools/proto-part2-8langs-translated.json",
    )),
    ("gameflow", (
        "tools/chatgpt-gameflow_chatgpt.txt",
        "tools/gameflow-8langs-translated.json",
    )),
    (
        "ops",
        ("tools/chatgpt-ops_chatgpt.txt", "tools/ops-missing7-translated.json"),
    ),
    (
        "wave1",
        (
            "tools/wave1-group1-translated.json",
            "tools/wave1-group2-translated.json",
            "tools/wave1-group3-translated.json",
            "tools/wave1-group4-translated.json",
            "tools/wave1-group5-translated.json",
            "tools/chatgpt-wave1-batch1-fr-ru_chatgpt.txt",
        ),
    ),
)


def load_json_any(path: Path) -> dict:
    raw = path.read_text(encoding="utf-8").strip()
    raw = re.sub(r"^```(?:json)?\s*", "", raw, flags=re.IGNORECASE).strip()
    raw = re.sub(r"\s*```\s*$", "", raw).strip()
    raw = raw.replace("\u201c", '"').replace("\u201d", '"').replace("\u2018", "'").replace("\u2019", "'")
    try:
        return dict(json.loads(raw))
    except json.JSONDecodeError:
        if _json_repair is None:
            raise
        repaired = _json_repair.loads(raw)
        return dict(repaired) if isinstance(repaired, dict) else {}


def merge_english_sections(base: dict, all_pages_en: dict) -> None:
    base.setdefault("en", {})
    for section in ("proto", "gameflow", "wave1", "ops"):
        block = dict(all_pages_en.get(section) or {})
        alias = SECTION_DOC_TITLE_KEY.get(section)
        if alias and isinstance(block.get("doc_title"), str):
            base["en"][alias] = block["doc_title"]
        for key, val in block.items():
            base["en"][key] = val


def ingest_translation_file(
    base: dict, section: str, abs_path: Path
) -> None:
    data = load_json_any(abs_path)
    alias_key = SECTION_DOC_TITLE_KEY.get(section, "")

    for lang in LANGS:
        if lang == "en":
            continue
        if lang not in data:
            continue
        blob = data[lang]
        if not isinstance(blob, dict):
            continue
        base.setdefault(lang, {})
        dt = blob.get("doc_title")
        if alias_key and isinstance(dt, str):
            base[lang][alias_key] = dt

        for k, v in blob.items():
            if isinstance(v, str):
                base[lang][k] = v


def main() -> None:
    base = json.loads(OUT_PATH.read_text(encoding="utf-8"))

    merge_english_sections(base, json.loads(SRC_EN.read_text(encoding="utf-8")))

    for section, paths in SECTION_FILES:
        for rel in paths:
            abs_path = ROOT / rel
            if not abs_path.is_file():
                print(f"MISSING: {rel}")
                continue
            try:
                ingest_translation_file(
                    base,
                    section,
                    abs_path,
                )
            except Exception as e:
                print(f"ERROR loading {rel}: {e}")
                continue
            print(f"Merged: {rel}")

    OUT_PATH.write_text(json.dumps(base, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Saved {OUT_PATH.relative_to(ROOT)}")

    for lang in LANGS:
        print(f"{lang}: {len(base.get(lang, {}))} keys")


if __name__ == "__main__":
    main()
