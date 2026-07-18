# Landing I18N Tooling Migration 01

## Summary

Python translation tooling now has a shared standard-library loader for the canonical locale registry at `src/config/locales.json`. The registry remains the single source of truth for canonical locale order, default locale, editorial master locale, RTL locales, and runtime-availability filters.

## Tools Audited

- `tools/merge-all-translations.py` previously contained a hard-coded 11-locale merge list: `en`, `fr`, `ru`, `es`, `uk`, `it`, `de`, `he`, `pt`, `ka`, `ro`.
- `tools/translate-index-claude.py` previously contained a hard-coded 10-locale target list that omitted `pl`.
- `tools/translate-proto-gameflow-8langs.py` contains an intentional 8-locale subset for historical proto/gameflow batch generation.
- `tools/translate-via-claude.py` contains intentional historical subsets: wave1 uses the original 10 non-English locales, and ops uses the 7 locales missing from the existing ops ChatGPT export.
- `tools/make-chatgpt-prompts.py` still contains a legacy 10-locale prompt string. It was inspected and documented, but not modified because it is outside this task's permitted modified file list.

## Registry-Driven Tools

- `tools/merge-all-translations.py` now consumes `get_canonical_locale_codes()` and recognizes all 12 canonical locales in registry order.
- `tools/translate-index-claude.py` now consumes `get_non_default_locale_codes()` and targets all 11 non-English canonical locales in registry order.
- `tools/audit-locale-tooling.py` reports canonical locale facts and validates the declared target sets for known translation tools without calling translation APIs.

## Intentionally Specialized Tools

- `tools/translate-proto-gameflow-8langs.py` remains an 8-locale tool for `es`, `uk`, `it`, `de`, `he`, `pt`, `ka`, and `ro`. It complements earlier proto/gameflow translation material rather than regenerating every canonical locale.
- `tools/translate-via-claude.py` remains specialized for historical wave1 and ops batch files. Wave1 covers the original 10 non-English locales, while ops-missing7 covers only `uk`, `it`, `de`, `he`, `pt`, `ka`, and `ro`.

Both specialized scripts now validate their subset locale codes against the canonical registry and fail clearly if a subset references an unknown locale.

## Polish Behavior

Polish was previously omitted by older Python tooling because those scripts kept hard-coded 10- or 11-locale lists that predated the canonical 12-locale registry. The merge tool now recognizes `pl`, and the index translation tool now includes `pl` in its non-default target set. No Polish translation payload was generated or changed in this migration.

## Canonical Locale Order

`en`, `fr`, `ru`, `es`, `uk`, `it`, `de`, `he`, `pt`, `ka`, `ro`, `pl`

## Locale Roles

- `en` is the technical default and fallback locale.
- `ru` is the editorial master locale for future rewrite work.
- `he` is the only RTL locale.

The editorial master locale does not replace English as the technical default or fallback.

## Not Modified

- Browser runtime JavaScript was not modified.
- CAP runtime JavaScript was not modified.
- Standalone HTML dictionaries were not modified.
- Translation payload content was not modified.
- HTML pages were not modified.
- Deployment, pricing, and legal files were not modified.

## Recommended Next PR

Audit or retire `tools/make-chatgpt-prompts.py`, then decide whether it should become registry-driven, be replaced by the active Claude tooling, or remain as archived legacy prompt-generation material.
