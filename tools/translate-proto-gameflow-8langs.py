#!/usr/bin/env python3
"""
Translate proto + gameflow into 8 languages (es, uk, it, de, he, pt, ka, ro)
via Anthropic Messages API. Uses curl HTTP/1.1 + chunked key batches like
tools/translate-via-claude.py (urllib single-shot tends to RST here).

Writes:
  tools/proto-part1-8langs-translated.json
  tools/proto-part2-8langs-translated.json
  tools/gameflow-8langs-translated.json

Requires: ANTHROPIC_API_KEY env, or ~/projects/tt-stack/.env (or sibling ../tt-stack/.env).

Then: python3 tools/merge-all-translations.py
"""
from __future__ import annotations

import json
import os
import re
import subprocess
import tempfile
import time
from pathlib import Path

try:
    import json_repair as _json_repair
except ImportError:
    _json_repair = None

ROOT = Path(__file__).resolve().parents[1]
SRC_EN_PATH = ROOT / "src" / "i18n" / "all-pages-en.json"

RULES = """Informal pronouns. Tasting & Toasting never translated.
HE=Hebrew RTL. KA=Georgian script. RO=Moldovan Romanian.
Return clean JSON only, no markdown. Same keys as English source, translate values only.
Outer keys MUST be lowercase language codes: es, uk, it, de, he, pt, ka, ro."""

MODEL = "claude-haiku-4-5-20251001"

# Two API calls per key-slice × 8 langs (nested JSON stays smaller than single 8‑lang blobs).
LANG_SETS: tuple[tuple[str, ...], ...] = (
    ("es", "uk", "it", "de"),
    ("he", "pt", "ka", "ro"),
)

# ~22 keys × 4 langs per request — similar to wave1 chunking.
CHUNK_KEYS = 22

MAX_HTTP_RETRIES = 5
RETRY_SLEEP_BASE_S = 12

ALL_LANGS_8 = ("es", "uk", "it", "de", "he", "pt", "ka", "ro")


def load_api_key() -> str:
    raw = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    if raw:
        return raw
    for cand in (
        ROOT.parent / "tt-stack" / ".env",
        Path.home() / "projects" / "tt-stack" / ".env",
    ):
        if cand.is_file():
            for line in cand.read_text(encoding="utf-8").splitlines():
                if line.strip().startswith("ANTHROPIC_API_KEY="):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")
    raise SystemExit(
        "ANTHROPIC_API_KEY missing — export it or add to tt-stack/.env"
    )


def extract_json_object(text: str) -> dict:
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s*```\s*$", "", text)
    try:
        return dict(json.loads(text))
    except json.JSONDecodeError:
        if _json_repair is None:
            raise
        r = _json_repair.loads(text)
        return dict(r) if isinstance(r, dict) else {}


API_KEY = load_api_key()


def call_claude(prompt: str, max_tokens: int = 8192) -> str:
    payload = json.dumps(
        {
            "model": MODEL,
            "max_tokens": max_tokens,
            "messages": [{"role": "user", "content": prompt}],
        },
        ensure_ascii=False,
    ).encode("utf-8")

    fd, tmp_path = tempfile.mkstemp(prefix="anthropic-proto-gf-", suffix=".json")
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


def _validate_nested(
    part: dict,
    langs: tuple[str, ...],
    expected_keys: set[str],
    label: str,
) -> None:
    for lc in langs:
        if lc not in part:
            raise RuntimeError(f"{label}: missing lang {lc}, got {list(part)}")
        if set(part[lc].keys()) != expected_keys:
            ek = sorted(expected_keys - set(part[lc]))
            xv = sorted(set(part[lc]) - expected_keys)
            raise RuntimeError(
                f"{label} [{lc}] key mismatch: missing={ek[:10]} extra={xv[:10]}"
            )


def translate_to_8_langs(
    keys_dict: dict[str, str],
    out_relative: str,
    *,
    chunk_size: int = CHUNK_KEYS,
    skip_if_complete: bool = False,
) -> Path:
    out_path = ROOT / "tools" / out_relative
    total = len(keys_dict)
    if skip_if_complete and out_path.is_file():
        try:
            chk = json.loads(out_path.read_text(encoding="utf-8"))
            if isinstance(chk, dict) and all(
                isinstance(chk.get(lc), dict) and len(chk[lc]) == total for lc in ALL_LANGS_8
            ):
                print(f"Skip (already complete): {out_path.relative_to(ROOT)}")
                return out_path
        except (json.JSONDecodeError, KeyError, TypeError):
            pass

    merged: dict[str, dict[str, str]] = {lc: {} for lc in ALL_LANGS_8}

    for si, subset in enumerate(_chunks_dict(keys_dict, chunk_size)):
        nk = len(subset)
        src = json.dumps(subset, ensure_ascii=False, indent=2)
        expected = set(subset.keys())
        for langs in LANG_SETS:
            langs_up = ", ".join(x.upper() for x in langs)
            skeleton = ",".join(
                f'"{lc}":{{...exactly {nk} keys, {lc.upper()} values...}}' for lc in langs
            )
            prompt = f"""Translate ALL strings to ONLY these languages: {langs_up}.

{RULES}

Slice {si + 1} ({nk} keys of {total} total in this batch):

{src}

Return ONLY nested JSON — no prose, no markdown:
{{{skeleton}}}

Inner object keys MUST match the English keys exactly."""

            exc: RuntimeError | None = None
            for attempt in range(1, 4):
                try:
                    raw = call_claude_retry(prompt, max_tokens=16384)
                    part = extract_json_object(raw)
                    _validate_nested(
                        part,
                        langs,
                        expected,
                        f"{out_relative} slice{si + 1} att{attempt}",
                    )
                    for lc in langs:
                        merged[lc].update(part[lc])
                    exc = None
                    break
                except RuntimeError as e:
                    exc = e
                    print(f"  … slice {si + 1} attempt {attempt} failed: {e}")
                    time.sleep(8 + attempt * 6)
            if exc is not None:
                raise exc
            time.sleep(2)

        print(f"  … chunk slice {si + 1} done ({nk} keys)")

    missing = [(lc, len(merged[lc])) for lc in ALL_LANGS_8 if len(merged[lc]) != total]
    if missing:
        raise RuntimeError(f"Incomplete merge vs {total} keys: {missing}")

    out_path.write_text(
        json.dumps(merged, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Saved: {out_path.relative_to(ROOT)}")
    return out_path


def main() -> None:
    import sys

    resume = "--resume" in sys.argv
    gf_only = "--gameflow-only" in sys.argv
    # Gameflow strings are longer — smaller chunks reduce truncation misses.
    chunk_gf = 12

    data = json.loads(SRC_EN_PATH.read_text(encoding="utf-8"))
    proto: dict[str, str] = dict(data["proto"])
    gameflow: dict[str, str] = dict(data["gameflow"])

    if not gf_only:
        items = list(proto.items())
        half = len(items) // 2
        p1 = dict(items[:half])
        p2 = dict(items[half:])

        print(f"Proto part1 ({len(p1)} keys)…")
        translate_to_8_langs(
            p1, "proto-part1-8langs-translated.json", skip_if_complete=resume
        )
        time.sleep(5)

        print(f"Proto part2 ({len(p2)} keys)…")
        translate_to_8_langs(
            p2, "proto-part2-8langs-translated.json", skip_if_complete=resume
        )
        time.sleep(5)

    print(f"Gameflow ({len(gameflow)} keys), chunk={chunk_gf}…")
    translate_to_8_langs(
        gameflow,
        "gameflow-8langs-translated.json",
        chunk_size=chunk_gf,
        skip_if_complete=resume,
    )

    print("Done.")
    print("Merge: python3 tools/merge-all-translations.py")


if __name__ == "__main__":
    main()
