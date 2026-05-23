#!/usr/bin/env python3
"""Add data-i18n tags to standalone prototype HTML pages (text match vs all-pages-en)."""
from __future__ import annotations

import json
from collections import defaultdict, deque
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src" / "i18n" / "all-pages-en.json"

PAGES: list[tuple[str, str]] = [
    ("prototype.html", "proto"),
    ("game-flow.html", "gameflow"),
    ("wave1.html", "wave1"),
    ("operations.html", "ops"),
]

SKIP_TAGS = frozenset({"script", "style", "noscript"})


def norm(s: str) -> str:
    return " ".join(s.split())


def build_lookup(kv: dict[str, str]) -> dict[str, deque[str]]:
    m: dict[str, deque[str]] = defaultdict(deque)
    for key, val in kv.items():
        if isinstance(val, str):
            n = norm(val)
            if n:
                m[n].append(key)
    return dict(m)


def depth(el) -> int:
    d = 0
    cur = el
    while getattr(cur, "parent", None) is not None:
        d += 1
        cur = cur.parent
    return d


def tag_file(path: Path, section_keys: dict[str, str]) -> int:
    lu = build_lookup(section_keys)
    soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")

    elems = [
        e
        for e in soup.find_all(True)
        if e.name and e.name.lower() not in SKIP_TAGS
    ]
    elems.sort(
        key=lambda e: (-depth(e), getattr(e, "sourceline", 0) or 0, str(e)),
    )

    hits = 0
    for el in elems:
        if el.has_attr("data-i18n") or el.has_attr("data-i18n-html"):
            continue
        txt = norm(el.get_text(" ", strip=True))
        if not txt:
            continue
        dq = lu.get(txt)
        if not dq:
            continue
        el["data-i18n"] = dq.popleft()
        hits += 1

    tt = soup.find("title")
    if tt is not None and "doc_title" in section_keys and not tt.has_attr("data-i18n"):
        tt["data-i18n"] = "doc_title"

    path.write_text(str(soup), encoding="utf-8")
    return hits


def summarize(path_rel: str, kv: dict[str, str]) -> None:
    soup = BeautifulSoup((ROOT / path_rel).read_text(encoding="utf-8"), "html.parser")
    tagged = [
        el
        for el in soup.find_all(True)
        if el.has_attr("data-i18n") or el.has_attr("data-i18n-html")
    ]
    used = {el["data-i18n"] for el in tagged if el.has_attr("data-i18n")}
    unused = sorted(set(kv) - used)
    print(
        f"{path_rel}: {len(tagged)} elements with data-i18n (+html); "
        f"{len(used)} unique keys matched; EN keys unmatched: {len(unused)}"
    )


def main() -> None:
    all_en = json.loads(SOURCE.read_text(encoding="utf-8"))
    for fname, sect in PAGES:
        kv = dict(all_en.get(sect) or {})
        tag_file(ROOT / fname, kv)
        summarize(fname, kv)


if __name__ == "__main__":
    main()
