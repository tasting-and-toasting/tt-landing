#!/usr/bin/env python3
"""Generate src/i18n/all-pages-en.json from prototype HTML shells (extract only).

  python3 tools/gen-all-pages-en.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path

from bs4 import BeautifulSoup, Tag


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src" / "i18n" / "all-pages-en.json"

SKIP = frozenset({"script", "style", "svg", "noscript", "template"})

# Tags harvested as single joined text nodes (no walk into children separately)
CONTENT_TAGS = frozenset({"h1", "h2", "h3", "h4", "button", "a", "label", "th", "td", "li", "p", "textarea", "option"})


def snake(s: str) -> str:
    s = s.strip().lower()
    s = re.sub(r"[^a-z0-9]+", "_", s)
    return re.sub(r"_+", "_", s).strip("_") or "x"


def segment_for(el: Tag | None) -> str:
    if el is None:
        return "page"
    sec = el.find_parent("section")
    if sec and sec.get("id"):
        return snake(sec["id"])
    if el.find_parent("div", class_=lambda x: x and "section-divider" in x.split()):
        dv = el.find_parent("div", class_=lambda x: x and "section-divider" in x.split())
        if dv and dv.get("id"):
            return snake(str(dv.get("id")))
    if el.find_parent("div", class_=lambda x: x and "hero-banner" in x.split()):
        return "hero_banner"
    if el.find_parent("nav"):
        return "nav"
    if el.find_parent("footer"):
        return "footer"
    return "page"


def primary_class(classes: object) -> str:
    if not classes:
        return ""
    pts = classes.split() if isinstance(classes, str) else list(classes)
    noisy = frozenset(
        {
            "active",
            "screen",
            "btn",
            "btn-primary",
            "btn-gold",
            "btn-sm",
            "btn-arrow",
            "btn-ghost",
            "mob-btn",
            "mob-btn-primary",
            "mob-btn-gold",
            "mob-btn-ghost",
            "mob-btn-text",
            "glyph",
            "selected",
            "filled",
            "pending",
            "correct",
            "wrong",
            "live",
            "muted",
            "today",
            "featured",
            "scroll",
            "right",
            "advance",
            "you",
            "first",
            "locked",
            "placed",
            "has-guess",
            "dash",
            "cursor",
            "empty",
            "jump-btn",
        }
    )
    for p in pts:
        if p and p not in noisy:
            return snake(p.replace("-", "_"))
    return snake(str(pts[0])) if pts else ""


def join_text(tag: Tag) -> str:
    return re.sub(r"\s+", " ", " ".join(tag.stripped_strings)).strip()


SPAN_CLASSES = frozenset(
    {
        "proto-tab",
        "jump-btn",
        "tier-name",
        "tier-period",
        "tier-credits",
        "tier-tagline",
        "proto-brand",
        "tag",
        "gold",
        "filter-pill",
        "cat-chip",
        "preference-chip",
        "descriptor-chip",
        "wine-pill",
        "pair-chip",
        "filter-label",
        "event-tile-badge",
        "event-tile-status",
        "event-tile-meta",
        "event-tile-cta",
        "cal-event",
        "cal-event-more",
        "cal-month",
        "cal-legend-item",
        "pour-step-num",
        "pour-headline",
        "ritual-num",
        "welcome-brand",
        "event-tile-decor",
        "somm-tag",
        "phone-status",
        "pay-icon",
        "name",
        "region",
        "label-full",
    }
)

DIV_HOOK_CLASSES = frozenset(
    {
        "num",
        "title",
        "desc",
        "subtitle",
        "cta-link",
        "flow-label",
        "vintage",
        "name",
        "region",
        "lbl",
        "val",
        "delta",
        "label",
        "meta",
        "kicker",
        "pour-num",
        "welcome-headline",
        "welcome-sub",
        "lobby-code",
        "lobby-title",
        "lobby-sub",
        "ritual-num",
        "ritual-text",
        "ritual-instruction",
        "tap-prompt",
        "lobby-waiting",
        "waiting-h",
        "waiting-sub",
        "center",
        "reveal-kicker",
        "reveal-of",
        "reveal-msg",
        "guess-h-block",
        "confirm-warning",
        "tier-name",
        "tier-tagline",
        "tier-price",
        "tier-period",
        "tier-credits",
        "tier-cta",
        "tier-features",
        "credit-cost",
        "page-subtitle",
        "event-program-h",
        "invite-code-help",
        "kit-arrived-kicker",
        "kit-arrived-h",
        "kit-arrived-sub",
        "pour-step-num",
        "pour-headline",
        "sub-pitch-h",
        "sub-pitch-kicker",
        "h-text",
        "h-meta",
    }
)


def span_ok(tag: Tag) -> bool:
    cl = tag.get("class") or []
    cs = set(cl) if isinstance(cl, list) else {cl}
    return bool(cs & SPAN_CLASSES)


def assign_key(pref: str, seg: str, cls: str, tag: str, ctr: dict[tuple[str, str], int]) -> str:
    base = snake(f"{seg}_{cls or tag}")[:104]
    t = (base, pref)
    ctr[t] = ctr.get(t, 0) + 1
    n = ctr[t]
    inner = base if n == 1 else f"{base}_{n}"
    # remove duplicate segment prefix noise (e.g. landing_landing_…)
    return inner


def extract_page(html_path: Path, inner_prefix: str) -> dict[str, str]:
    soup = BeautifulSoup(html_path.read_text(encoding="utf-8"), "html.parser")
    flat: dict[str, str] = {}
    ctr: dict[tuple[str, str], int] = {}

    if soup.title and soup.title.string:
        flat["doc_title"] = soup.title.string.strip()
    meta = soup.find("meta", attrs={"name": "description"})
    if meta and meta.get("content"):
        flat["meta_description"] = meta["content"].strip()

    body = soup.body
    if not body:
        return flat

    for bad in body.find_all(SKIP):
        bad.decompose()

    hook_div_tags: list[Tag] = []
    for dv in body.find_all("div", class_=True):
        pts = dv.get("class") or []
        if isinstance(pts, str):
            pts = pts.split()
        if DIV_HOOK_CLASSES.intersection(set(pts)):
            if len(join_text(dv)) > 420:
                continue
            hook_div_tags.append(dv)

    candidates: list[Tag] = []

    def add_tag(tag: Tag) -> None:
        txt = join_text(tag)
        if len(txt) == 1 and txt in "+→←‹›,·−":
            return
        if not txt.strip():
            return
        # avoid duplicating parent already collected (same tag nested)
        p = tag.parent
        while isinstance(p, Tag):
            if p.name == tag.name and p in candidates:
                return
            p = p.parent
        candidates.append(tag)

    for tag in body.find_all(CONTENT_TAGS):
        if isinstance(tag, Tag) and tag.name not in SKIP:
            add_tag(tag)

    for tag in body.find_all("span"):
        if isinstance(tag, Tag) and span_ok(tag):
            add_tag(tag)

    for tag in body.select(".landing-meta span"):
        if isinstance(tag, Tag):
            add_tag(tag)

    for tag in body.select(".press-strip span"):
        if isinstance(tag, Tag):
            add_tag(tag)

    for tag in hook_div_tags:
        add_tag(tag)

    # Link title attributes shown on hover/focus (not child text alone)
    for a in body.find_all("a", title=True):
        if not isinstance(a, Tag):
            continue
        ttl = str(a["title"]).strip()
        if not ttl:
            continue
        seg = segment_for(a)
        nk = assign_key(inner_prefix, seg, "link_title_attr", "a", ctr)
        m = 1
        kk = nk
        while kk in flat:
            m += 1
            kk = f"{nk}__dup{m}"
        flat[kk] = ttl

    # Placeholders and visible preset values on inputs (no secrets)
    for inp in body.find_all("input"):
        if inp.get("placeholder"):
            t = inp["placeholder"].strip()
            ph = inp.get("id") or primary_class(inp.get("class")) or "input_placeholder"
            seg = segment_for(inp)
            ik = assign_key(inner_prefix, seg, snake(ph), "placeholder", ctr)
            m = 1
            kk = ik
            while kk in flat:
                m += 1
                kk = f"{ik}__dup{m}"
            flat[kk] = t
        if inp.get("value") and inp.get("type") in {"text", "tel", "email", None}:
            t = inp["value"].strip()
            if len(t) > 1:
                vx = inp.get("id") or primary_class(inp.get("class")) or "input_value"
                seg = segment_for(inp)
                ik = assign_key(inner_prefix, seg, snake(vx), "value", ctr)
                m = 1
                kk = ik
                while kk in flat:
                    m += 1
                    kk = f"{ik}__dup{m}"
                flat[kk] = t

    for tag in candidates:
        text = join_text(tag)
        if not text.strip():
            continue

        seg = segment_for(tag)
        cls = primary_class(tag.get("class"))
        nk = assign_key(inner_prefix, seg, cls, tag.name, ctr)

        ik = nk
        m = 1
        while ik in flat:
            m += 1
            ik = f"{nk}__dup{m}"

        flat[ik] = text

    return flat


def main() -> None:
    suites = [
        (ROOT / "prototype.html", "proto"),
        (ROOT / "game-flow.html", "gameflow"),
        (ROOT / "wave1.html", "wave1"),
        (ROOT / "operations.html", "ops"),
    ]
    out: dict[str, dict[str, str]] = {}
    for path, nest in suites:
        if not path.exists():
            raise SystemExit(f"Missing {path}")
        out[nest] = extract_page(path, nest)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    cnt = {k: len(v) for k, v in out.items()}
    print(json.dumps({"wrote": str(OUT), **cnt}, indent=2))


if __name__ == "__main__":
    main()
