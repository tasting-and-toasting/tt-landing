#!/usr/bin/env python3
"""Try to parse ChatGPT translation exports as JSON; report errors."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FILES = [
    ROOT / "tools" / "chatgpt-proto-response.txt",
    ROOT / "tools" / "chatgpt-gameflow-response.txt",
    ROOT / "tools" / "chatgpt-ops-response.txt",
]


def strip_markdown_fence(raw: str) -> str:
    raw = raw.strip()
    if not raw.startswith("```"):
        return raw
    raw = re.sub(r"^```(?:json)?\s*", "", raw, count=1)
    raw = re.sub(r"\s*```\s*$", "", raw, count=1)
    return raw.strip()


def fix_json(path: Path):
    raw = path.read_text(encoding="utf-8")
    raw = strip_markdown_fence(raw)
    # Apostrophe-like smart quotes → ASCII single quote
    raw = raw.replace("\u2018", "'").replace("\u2019", "'")

    attempts: list[tuple[str, str]] = [
        ("as-is", raw),
        (
            "smart_double_to_straight",
            raw.replace("\u201c", '"').replace("\u201d", '"'),
        ),
        (
            "smart_double_to_backslash_quote",
            raw.replace("\u201c", '\\"').replace("\u201d", '\\"'),
        ),
    ]
    seen: set[str] = set()
    last_err: json.JSONDecodeError | None = None
    for label, body in attempts:
        if body in seen:
            continue
        seen.add(body)
        try:
            return json.loads(body)
        except json.JSONDecodeError as e:
            last_err = e

    if last_err:
        print(f"Error in {path}: line {last_err.lineno}, col {last_err.colno}: {last_err.msg}")
        last_body = attempts[-1][1]
        lines = last_body.split("\n")
        lo = max(0, last_err.lineno - 2)
        hi = min(len(lines), last_err.lineno + 1)
        print("Context:")
        for j in range(lo, hi):
            marker = ">>" if j == last_err.lineno - 1 else "  "
            print(f"{marker} {j + 1}: {lines[j][:240]}")
    return None


def main() -> int:
    for f in FILES:
        if not f.exists():
            print(f"{f}: missing — cp your upload here first")
            continue
        d = fix_json(f)
        if isinstance(d, dict):
            print(f"{f}: OK — langs: {list(d.keys())}")
        else:
            print(f"{f}: needs manual fix")
    return 0


if __name__ == "__main__":
    sys.exit(main())
