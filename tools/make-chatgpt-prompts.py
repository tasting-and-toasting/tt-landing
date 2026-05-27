#!/usr/bin/env python3
"""Emit tools/chatgpt-{proto,gameflow,wave1,ops}.txt for LLM translation prep."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src" / "i18n" / "all-pages-en.json"

LANGS = "FR RU ES UK IT DE HE PT KA RO"
RULES = """RULES:
- Informal pronouns (tu/ты/du/shen/tu)
- Tasting & Toasting = never translated
- HE = right-to-left Hebrew
- KA = Georgian script
- RO = Moldovan Romanian
- Return clean JSON only, no markdown
- Keep all keys identical to EN
- Translate values only"""


def main() -> None:
    data = json.loads(SRC.read_text(encoding="utf-8"))
    for section in ["proto", "gameflow", "wave1", "ops"]:
        n = len(data[section])
        en_json = json.dumps(data[section], ensure_ascii=False, indent=2)
        prompt = f"""Translate ALL strings below to these 10 languages: {LANGS}

{RULES}

Source EN strings:
{en_json}

Return format:
{{
  "fr": {{ ...all {n} keys in French... }},
  "ru": {{ ...all {n} keys in Russian... }},
  "es": {{ ...all {n} keys in Spanish... }},
  "uk": {{ ...all {n} keys in Ukrainian... }},
  "it": {{ ...all {n} keys in Italian... }},
  "de": {{ ...all {n} keys in German... }},
  "he": {{ ...all {n} keys in Hebrew... }},
  "pt": {{ ...all {n} keys in Portuguese pt-PT... }},
  "ka": {{ ...all {n} keys in Georgian... }},
  "ro": {{ ...all {n} keys in Moldovan Romanian... }}
}}"""
        out = ROOT / "tools" / f"chatgpt-{section}.txt"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(prompt, encoding="utf-8")
        print(f"{section}: {n} keys → {out} ({len(prompt)} chars)")


if __name__ == "__main__":
    main()
