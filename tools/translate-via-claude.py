#!/usr/bin/env python3
"""
Translate wave1 (5 batches) + ops (7 langs) via Anthropic Messages API.
Requires: ANTHROPIC_API_KEY in environment.
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
RULES = """Informal pronouns. Tasting & Toasting never translated.
HE=Hebrew RTL. KA=Georgian script. RO=Moldovan Romanian.
Return clean JSON only. Same keys as EN, translate values only."""

MODEL = "claude-haiku-4-5-20251001"

# Nested JSON stays smaller when we slice source keys — avoids curl 52 on huge completions.
CHUNK_KEYS = 21

LANG_SETS_FOR_WAVE1: tuple[tuple[str, ...], ...] = (
    ("fr", "ru", "es", "uk", "it"),
    ("de", "he", "pt", "ka", "ro"),
)

LANG_SETS_FOR_OPS: tuple[tuple[str, ...], ...] = (
    ("uk", "it", "de", "he"),
    ("pt", "ka", "ro"),
)

ALL_WAVE1_LANG_CODES: tuple[str, ...] = (
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

MAX_HTTP_RETRIES = 5
RETRY_SLEEP_BASE_S = 12


def extract_json_object(text: str) -> dict:
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s*```\s*$", "", text)
    return json.loads(text)


def call_claude(prompt: str, max_tokens: int = 8192) -> str:
    """POST via curl (urllib intermittently RSTs long requests in this env)."""
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


def _validate_partial_nested(
    part: dict,
    langs: tuple[str, ...],
    expected_keys: set[str],
    label: str,
) -> None:
    for lang in langs:
        if lang not in part:
            raise RuntimeError(
                f"{label}: missing language {lang}; got {list(part.keys())}"
            )
        if set(part[lang].keys()) != expected_keys:
            ek = sorted(expected_keys - set(part[lang].keys()))
            xv = sorted(set(part[lang].keys()) - expected_keys)
            raise RuntimeError(
                f"{label} {lang}: key mismatch ({len(expected_keys)} expected) "
                f"missing_sample={ek[:6]} extra_sample={xv[:6]}"
            )


def translate_wave1_batch(keys_dict: dict, batch_name: str) -> tuple[str, bool]:
    """Keyed slices × two 5-language Claude calls each; merges into wave1-{batch}.json."""
    out_file = ROOT / "tools" / f"wave1-{batch_name}-translated.json"
    merged: dict[str, dict[str, str]] = {lc: {} for lc in ALL_WAVE1_LANG_CODES}
    total = len(keys_dict)
    try:
        for si, subset in enumerate(_chunks_dict(keys_dict, CHUNK_KEYS)):
            nk = len(subset)
            src = json.dumps(subset, ensure_ascii=False, indent=2)
            expected = set(subset.keys())
            for langs in LANG_SETS_FOR_WAVE1:
                langs_up = ", ".join(x.upper() for x in langs)
                skeleton = ",".join(
                    f'"{lc}":{{...exactly {nk} keys ({lc.upper()} values)...}}'
                    for lc in langs
                )
                prompt = f"""Translate ALL strings to ONLY these languages: {langs_up}

{RULES}

Slice {si + 1} of wave1-{batch_name} ({nk} keys of {total} total):

{src}

Return ONLY this nested JSON shape, no markdown:
{{{skeleton}}}

Outer keys MUST be lowercase language codes: {", ".join(langs)}.
Inner keys MUST match the source keys exactly."""

                raw = call_claude_retry(prompt, max_tokens=12000)
                part = extract_json_object(raw)
                _validate_partial_nested(
                    part, langs, expected, f"wave1-{batch_name} slice{si + 1}"
                )
                for lc in langs:
                    merged[lc].update(part[lc])
                time.sleep(2)

        if any(len(merged[c]) != total for c in ALL_WAVE1_LANG_CODES):
            bad = [(c, len(merged[c])) for c in ALL_WAVE1_LANG_CODES]
            raise RuntimeError(f"Incomplete merge key counts vs {total}: {bad}")

        data = merged
        out_file.write_text(
            json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        print(f"Saved {batch_name}: {out_file}")
        return str(out_file), True
    except Exception as e:
        err = ROOT / "tools" / f"wave1-{batch_name}-translated.ERROR.txt"
        err.write_text(str(e) + "\n", encoding="utf-8")
        print(f"ERROR wave1-{batch_name}: {e} → {err}")
        return str(err), False


def split_wave1_groups(items: list[tuple[str, str]], num_groups: int = 5) -> list[tuple[str, dict[str, str]]]:
    """Equal split with remainder distributed to first buckets."""
    n = len(items)
    base, extra = divmod(n, num_groups)
    out = []
    start = 0
    for i in range(num_groups):
        sz = base + (1 if i < extra else 0)
        chunk = dict(items[start : start + sz])
        out.append((f"group{i + 1}", chunk))
        start += sz
    return out


def main() -> None:
    if not API_KEY:
        print("ANTHROPIC_API_KEY missing — export it or source from tt-stack/.env")
        raise SystemExit(1)

    src_path = ROOT / "src" / "i18n" / "all-pages-en.json"
    data = json.loads(src_path.read_text(encoding="utf-8"))
    wave1 = data["wave1"]
    items = list(wave1.items())
    groups = split_wave1_groups(items, 5)

    results_wave1: list[tuple[str, str]] = []
    for name, batch in groups:
        if not batch:
            print(f"skip empty {name}")
            continue
        print(f"Translating {name} ({len(batch)} keys)...")
        path, ok = translate_wave1_batch(batch, name)
        results_wave1.append((name, "done" if ok else "error"))
        time.sleep(5)

    ops = data["ops"]
    ops_out = ROOT / "tools" / "ops-missing7-translated.json"
    ops_ok = False
    try:
        print("Translating ops (7 langs, chunked)...")
        n_ops_total = len(ops)
        merged_ops: dict[str, dict[str, str]] = {}
        for si, ops_subset in enumerate(_chunks_dict(ops, CHUNK_KEYS)):
            nk = len(ops_subset)
            src_ops = json.dumps(ops_subset, ensure_ascii=False, indent=2)
            expected = set(ops_subset.keys())
            for langs in LANG_SETS_FOR_OPS:
                langs_up = ", ".join(x.upper() for x in langs)
                skeleton = ",".join(
                    f'"{lc}":{{...exactly {nk} keys ({lc.upper()} values)...}}'
                    for lc in langs
                )
                ops_prompt = f"""Translate ALL strings to ONLY these languages: {langs_up}

{RULES}

Slice {si + 1} of ops ({nk} keys of {n_ops_total}):

{src_ops}

Return ONLY this nested JSON shape, no markdown:
{{{skeleton}}}
"""
                raw = call_claude_retry(ops_prompt, max_tokens=12000)
                part = extract_json_object(raw)
                _validate_partial_nested(part, langs, expected, f"ops slice{si + 1}")
                for lc in langs:
                    merged_ops.setdefault(lc, {}).update(part[lc])
                time.sleep(2)

        if sorted(merged_ops.keys()) != sorted(
            {lc for tup in LANG_SETS_FOR_OPS for lc in tup}
        ):
            raise RuntimeError(f"ops merge missing langs: got {sorted(merged_ops)}")
        for lc, blob in merged_ops.items():
            if len(blob) != n_ops_total:
                raise RuntimeError(
                    f"ops {lc}: incomplete merge ({len(blob)} vs {n_ops_total})"
                )

        parsed = merged_ops
        ops_out.write_text(
            json.dumps(parsed, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        print(f"Saved ops-missing7: {ops_out}")
        ops_ok = True
    except Exception as e:
        err = ROOT / "tools" / "ops-missing7-translated.ERROR.txt"
        err.write_text(str(e) + "\n", encoding="utf-8")
        print(f"ERROR ops-missing7: {e} → {err}")

    print("All stages finished.")


if __name__ == "__main__":
    main()
