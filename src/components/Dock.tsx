"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type MouseEvent } from "react";
import type { Dictionary, Locale, SectionKey } from "@/content/types";
import { Chevron, Moon, Sun } from "./icons";
import { Rw } from "./Rewrite";

type Theme = "light" | "dark";
type Active = SectionKey | "home";

type DockProps = {
  t: Dictionary;
  /** Switches language in place (no reload). */
  onSwitchLocale: (locale: Locale) => void;
};

const LOCALES: { locale: Locale; code: string; name: string; path: string }[] = [
  { locale: "es", code: "ES", name: "Español", path: "/" },
  { locale: "en", code: "EN", name: "English", path: "/en" },
];

/** A two-option switch whose highlight slides to the selected option. */
const thumbStyle = (i: number | null) => ({ "--i": i ?? 0 }) as CSSProperties;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// Theme lives on <html data-theme>; without it the OS preference applies.
const DARK = "(prefers-color-scheme: dark)";
const subscribeTheme = (cb: () => void) => {
  const mq = window.matchMedia(DARK);
  mq.addEventListener("change", cb);
  window.addEventListener("aq-theme", cb);
  return () => {
    mq.removeEventListener("change", cb);
    window.removeEventListener("aq-theme", cb);
  };
};
const readTheme = (): Theme => {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "dark" || attr === "light") return attr;
  return window.matchMedia(DARK).matches ? "dark" : "light";
};

/**
 * Floating glass navigation. While the visitor scrolls, the hero portrait
 * shrinks, turns round and flies into the first slot of the capsule, where it
 * becomes the "AQ" monogram. The flight is driven straight from the scroll
 * position (no timers) and is skipped entirely with reduced motion.
 */
export function Dock({ t, onSwitchLocale }: DockProps) {
  const { homeId, sections, nav, locale } = t;
  const [active, setActive] = useState<Active>("home");
  const [up, setUp] = useState(false);
  const [filled, setFilled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => null);

  const slotRef = useRef<HTMLAnchorElement>(null);
  const flyRef = useRef<HTMLDivElement>(null);
  const flyImgRef = useRef<HTMLImageElement>(null);
  const flyMonoRef = useRef<HTMLDivElement>(null);
  const flyRingRef = useRef<HTMLSpanElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const applyTheme = useCallback((t: Theme) => {
    document.documentElement.setAttribute("data-theme", t);
    try {
      // Only for this visit (e.g. when switching language), never across visits.
      sessionStorage.setItem("aq-theme", t);
    } catch {}
    window.dispatchEvent(new Event("aq-theme"));
  }, []);

  // Scroll-driven state: active section, deeper shadow, portrait flight.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const foto = document.getElementById("hero-foto");
    const photoBox = document.getElementById("hero-photo");
    const fotoImg = foto?.querySelector("img") ?? null;
    let raf = 0;
    let r0 = 36;

    const measure = () => {
      raf = 0;
      const st = window.scrollY;
      const vh = window.innerHeight || 800;

      let next: Active = "home";
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && st > 0 && el.getBoundingClientRect().top < vh * 0.45) next = s.key;
      }
      setActive(next);
      setUp(st > 8);

      const slot = slotRef.current;
      const fly = flyRef.current;
      if (!foto || !slot || !fly) {
        setFilled(st > 180);
        return;
      }
      const f = foto.getBoundingClientRect();
      const k = slot.getBoundingClientRect();
      const dist = Math.max(180, f.height * 0.75);
      const p = clamp01(st / dist);
      const t = p * p * (3 - 2 * p);
      const flying = !reduce && p > 0.002 && p < 1;

      setFilled(reduce ? p > 0.5 : p >= 1);
      foto.style.opacity = reduce || p <= 0.002 ? "1" : "0";
      // The glass frame and glow fade out as the portrait lifts off.
      photoBox?.style.setProperty("--fade", reduce ? "1" : String(1 - clamp01(t * 1.6)));

      if (!flying) {
        fly.style.visibility = "hidden";
        return;
      }

      // The clone keeps the photo's size and only moves with transform (GPU),
      // while clip-path crops it to a square and rounds it into a circle.
      const W = f.width;
      const H = f.height;
      if (fly.dataset.size !== `${W}x${H}`) {
        fly.dataset.size = `${W}x${H}`;
        fly.style.width = `${W}px`;
        fly.style.height = `${H}px`;
        r0 = parseFloat(getComputedStyle(foto).borderTopLeftRadius) || 36;
        if (flyMonoRef.current) flyMonoRef.current.style.fontSize = `${(15 * W) / k.width}px`;
      }
      const img = flyImgRef.current;
      if (img && fotoImg && !img.getAttribute("src")) img.src = fotoImg.currentSrc || fotoImg.src;

      const lerp = (a: number, b: number) => a + (b - a) * t;
      const s = lerp(1, k.width / W);
      const inset = (Math.max(0, H - W) / 2) * clamp01(t * 1.5);
      const radius = r0 + (W / 2 - r0) * Math.min(1, t * 3);
      const cx = lerp(f.left + W / 2, k.left + k.width / 2);
      const cy = lerp(f.top + H / 2, k.top + k.height / 2);

      fly.style.transform = `translate3d(${cx - (s * W) / 2}px, ${cy - (s * H) / 2}px, 0) scale(${s})`;
      fly.style.clipPath = `inset(${inset}px 0 round ${radius}px)`;
      fly.style.visibility = "visible";

      const ao = String(clamp01((t - 0.45) / 0.4));
      if (flyMonoRef.current) flyMonoRef.current.style.opacity = ao;
      const ring = flyRingRef.current;
      if (ring) {
        ring.style.opacity = ao;
        ring.style.top = ring.style.bottom = `${inset}px`;
        ring.style.borderRadius = `${radius}px`;
        ring.style.borderWidth = `${2 / s}px`;
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [sections]);

  // Close the compact menu with Escape or a click outside it.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuBtnRef.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!menuRef.current?.contains(t) && !menuBtnRef.current?.contains(t)) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [menuOpen]);

  const current = sections.find((s) => s.key === active);

  const onLocaleClick = (e: MouseEvent<HTMLAnchorElement>, next: Locale) => {
    // Let modified clicks (new tab, etc.) behave like a normal link.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    onSwitchLocale(next);
  };

  const themeIndex = theme === null ? null : theme === "light" ? 0 : 1;
  const themeSwitch = (
    <div
      role="group"
      aria-label={nav.theme}
      className={`theme-pair seg-group${themeIndex === null ? " is-unset" : ""}`}
      style={thumbStyle(themeIndex)}
    >
      <span className="seg-thumb" aria-hidden="true" />
      <button
        type="button"
        className={`seg seg-icon tool${theme === "light" ? " is-on" : ""}`}
        aria-pressed={theme === "light"}
        aria-label={nav.light}
        title={nav.light}
        onClick={() => applyTheme("light")}
      >
        <Sun />
      </button>
      <button
        type="button"
        className={`seg seg-icon tool${theme === "dark" ? " is-on" : ""}`}
        aria-pressed={theme === "dark"}
        aria-label={nav.dark}
        title={nav.dark}
        onClick={() => applyTheme("dark")}
      >
        <Moon />
      </button>
    </div>
  );

  return (
    <div className={`dock${up ? " is-up" : ""}`}>
      <div className="dock-row">
        <div className="pill pill-main">
          <span className="rim" aria-hidden="true" />
          <a ref={slotRef} href={`#${homeId}`} aria-label={nav.backToTop} className={`slot${filled ? " is-filled" : ""}`}>
            <span className="slot-dot" aria-hidden="true" />
            <span className="slot-mono" aria-hidden="true">
              AQ
            </span>
            <span className="slot-ring" aria-hidden="true" />
          </a>

          <nav aria-label={nav.sections} className="nav-links">
            {sections.map((s) => (
              <a
                key={s.key}
                href={`#${s.id}`}
                className={`navi${active === s.key ? " is-on" : ""}`}
                aria-current={active === s.key ? "location" : undefined}
              >
                <span className="navi-dot" aria-hidden="true" />
                <Rw>{s.label}</Rw>
              </a>
            ))}
          </nav>

          <button
            ref={menuBtnRef}
            type="button"
            className="menu-btn tool"
            aria-expanded={menuOpen}
            aria-controls="dock-menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="num">{current ? current.num : "00"}</span>
            <span className="menu-label">
              <Rw>{current ? current.label : nav.home}</Rw>
            </span>
            <Chevron size={16} />
          </button>

          <div className="well">
            <div
              role="group"
              aria-label={nav.language}
              className="seg-group"
              style={thumbStyle(LOCALES.findIndex((l) => l.locale === locale))}
            >
              <span className="seg-thumb" aria-hidden="true" />
              {LOCALES.map((l) => (
                <a
                  key={l.locale}
                  href={l.path}
                  hrefLang={l.locale}
                  lang={l.locale}
                  aria-label={l.name}
                  aria-current={l.locale === locale ? "true" : undefined}
                  className={`seg tool${l.locale === locale ? " is-on" : ""}`}
                  onClick={(e) => onLocaleClick(e, l.locale)}
                >
                  {l.code}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop: theme switch in its own capsule. On smaller screens it lives in the menu. */}
        <div className="pill pill-theme">
          <span className="rim" aria-hidden="true" />
          {themeSwitch}
        </div>
      </div>

      {menuOpen && (
        <div ref={menuRef} id="dock-menu" className="pill menu">
          <span className="rim" aria-hidden="true" />
          <nav aria-label={nav.sections} className="menu-links">
            {sections.map((s) => (
              <a
                key={s.key}
                href={`#${s.id}`}
                onClick={() => setMenuOpen(false)}
                className={`navi${active === s.key ? " is-on" : ""}`}
                aria-current={active === s.key ? "location" : undefined}
              >
                <span style={{ display: "inline-flex", alignItems: "center" }}>
                  <span className="navi-dot" aria-hidden="true" />
                  <Rw>{s.label}</Rw>
                </span>
                <span className="num">{s.num}</span>
              </a>
            ))}
          </nav>
          <div className="menu-theme">
            <span className="label">
              <Rw>{nav.theme}</Rw>
            </span>
            <div className="well">{themeSwitch}</div>
          </div>
        </div>
      )}

      <div ref={flyRef} className="fly" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- reuses the hero image already in cache */}
        <img ref={flyImgRef} alt="" />
        <div ref={flyMonoRef} className="fly-mono" style={{ opacity: 0 }}>
          AQ
        </div>
        <span ref={flyRingRef} className="fly-ring" style={{ opacity: 0 }} />
      </div>
    </div>
  );
}
