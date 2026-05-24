#!/usr/bin/env python3
"""
Translate index landing prototype section strings (EN → fr, ru, es, uk, it, de, he, pt, ka, ro)
via Anthropic Messages API (curl HTTP/1.1, retries like translate-via-claude.py).

Requires: ANTHROPIC_API_KEY
Output: tools/index-landing-translated.json
"""
from __future__ import annotations

import json
import os
import re
import subprocess
import tempfile
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

API_KEY = os.environ.get("ANTHROPIC_API_KEY", "").strip()
RULES = """Informal pronouns. Tasting & Toasting never translated as a phrase.
Preserve ALL HTML tags and HTML attributes (<span>, <strong>, class=\"em\") exactly — translate only plain text nodes.
Preserve numbers like 01, 02 inside strings. Spanish legal context may stay formal where needed for notices.
HE=Hebrew RTL. KA=Georgian script. RO=Moldovan Romanian.
Return clean JSON only. Same keys as EN, translate values only."""

MODEL = "claude-haiku-4-5-20251001"

ALL_LANG_CODES: tuple[str, ...] = (
    "fr",
    "ru",
    "es",
    "uk",
    "it",
    "de",
    "he",
    "pt",
    "ka",
    "ro",
)

LANG_SETS: tuple[tuple[str, ...], ...] = (
    ("fr", "ru", "es", "uk", "it"),
    ("de", "he", "pt", "ka", "ro"),
)

CHUNK_KEYS = 21
MAX_HTTP_RETRIES = 5
RETRY_SLEEP_BASE_S = 12


def extract_json_object(text: str) -> dict:
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s*```\s*$", "", text)
    return json.loads(text)


def call_claude(prompt: str, max_tokens: int = 8192) -> str:
    payload = json.dumps(
        {
            "model": MODEL,
            "max_tokens": max_tokens,
            "messages": [{"role": "user", "content": prompt}],
        },
        ensure_ascii=False,
    ).encode("utf-8")

    fd, tmp_path = tempfile.mkstemp(prefix="anthropic-req-", suffix=".json")
    try:
        os.write(fd, payload)
        os.close(fd)
        result = subprocess.run(
            [
                "curl",
                "-sS",
                "--http1.1",
                "--fail-with-body",
                "--max-time",
                "900",
                "-X",
                "POST",
                "https://api.anthropic.com/v1/messages",
                "-H",
                "content-type: application/json; charset=utf-8",
                "-H",
                f"x-api-key: {API_KEY}",
                "-H",
                "anthropic-version: 2023-06-01",
                "--data-binary",
                f"@{tmp_path}",
            ],
            capture_output=True,
            text=True,
        )
    finally:
        try:
            os.unlink(tmp_path)
        except OSError:
            pass

    stdout = (result.stdout or "").strip()
    stderr = (result.stderr or "").strip()
    if result.returncode != 0:
        msg = stderr or stdout or "curl failed"
        raise RuntimeError(f"Anthropic HTTP error (curl {result.returncode}): {msg[:2000]}")
    try:
        resp = json.loads(stdout)
    except json.JSONDecodeError as e:
        raise RuntimeError(f"Non-JSON response: {stdout[:800]} … ({e})") from e
    parts = resp.get("content") or []
    if not parts:
        raise RuntimeError("Empty content from API")
    return parts[0]["text"]


def call_claude_retry(prompt: str, max_tokens: int = 8192) -> str:
    last_err: RuntimeError | None = None
    for attempt in range(1, MAX_HTTP_RETRIES + 1):
        try:
            return call_claude(prompt, max_tokens=max_tokens)
        except RuntimeError as e:
            msg = str(e).lower()
            last_err = e
            transient = (
                "curl 52" in msg
                or "empty reply" in msg
                or "timed out" in msg
                or "connection reset" in msg
            )
            if not transient or attempt == MAX_HTTP_RETRIES:
                raise
            wait = RETRY_SLEEP_BASE_S * attempt
            print(f"  retry {attempt}/{MAX_HTTP_RETRIES} after {wait}s … ({e})")
            time.sleep(wait)
    assert last_err is not None
    raise last_err


def _chunks_dict(d: dict[str, str], size: int) -> list[dict[str, str]]:
    items = list(d.items())
    return [dict(items[i : i + size]) for i in range(0, len(items), size)]


def main() -> None:
    if not API_KEY:
        raise SystemExit("Set ANTHROPIC_API_KEY")

    src_path = ROOT / "src" / "i18n" / "all-pages-en.json"
    out_file = ROOT / "tools" / "index-landing-translated.json"
    all_pages = json.loads(src_path.read_text(encoding="utf-8"))
    index_blob = all_pages.get("index") or {}
    keys_dict = {k: v for k, v in index_blob.items() if isinstance(v, str)}
    total = len(keys_dict)

    merged: dict[str, dict[str, str]] = {lc: {} for lc in ALL_LANG_CODES}
    print(f"index landing: {total} EN keys …")

    for si, subset in enumerate(_chunks_dict(keys_dict, CHUNK_KEYS)):
        nk = len(subset)
        src = json.dumps(subset, ensure_ascii=False, indent=2)
        expected = set(subset.keys())

        for langs in LANG_SETS:
            langs_up = ", ".join(x.upper() for x in langs)
            skeleton = ",".join(
                f'"{lc}":{{...exactly {nk} keys ({lc.upper()} values)...}}'
                for lc in langs
            )
            prompt = f"""Translate ALL strings to ONLY these languages: {langs_up}

{RULES}

Slice {si + 1} of index-landing ({nk} keys of {total} total):

{src}

Return ONLY this nested JSON shape, no markdown:
{{{skeleton}}}

Outer keys MUST be lowercase language codes: {", ".join(langs)}.
Inner keys MUST match the source keys exactly."""

            raw = call_claude_retry(prompt, max_tokens=12000)
            part = extract_json_object(raw)

            for lang in langs:
                blob = part.get(lang)
                if not isinstance(blob, dict):
                    raise RuntimeError(f"missing inner dict for {lang}")
                if set(blob.keys()) != expected:
                    ek = sorted(expected - set(blob.keys()))
                    xv = sorted(set(blob.keys()) - expected)
                    raise RuntimeError(
                        f"slice {si + 1} {lang}: key mismatch missing={ek[:5]} extra={xv[:5]}"
                    )
                merged[lang].update(blob)

    out_file.write_text(json.dumps(merged, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {out_file.relative_to(ROOT)} ({total} keys × {len(ALL_LANG_CODES)} langs)")


if __name__ == "__main__":
    main()
