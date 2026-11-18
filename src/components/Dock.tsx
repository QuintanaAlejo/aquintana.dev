"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Dictionary, SectionKey } from "@/content/types";
import { Chevron, Moon, Sun } from "./icons";

type Theme = "light" | "dark";
type Active = SectionKey | "home";

type DockProps = {
  homeId: string;
  sections: Dictionary["sections"];
  nav: Dictionary["nav"];
  /** Section ids of the other language, so switching keeps you in the same section. */
  altHomeId: string;
  altIds: Record<SectionKey, string>;
};

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
export function Dock({ homeId, sections, nav, altHomeId, altIds }: DockProps) {
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
  const menuRef = useRef<HTMLElement>(null);

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
    const fotoImg = foto?.querySelector("img") ?? null;
    let raf = 0;

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
        setFilled(st > 260);
        return;
      }
      const f = foto.getBoundingClientRect();
      const k = slot.getBoundingClientRect();
      const dist = Math.max(260, f.height * 0.75);
      const p = clamp01(st / dist);
      const t = p * p * (3 - 2 * p);
      const flying = !reduce && p > 0.002 && p < 1;

      setFilled(reduce ? p > 0.5 : p >= 1);
      foto.style.opacity = reduce || p <= 0.002 ? "1" : "0";

      if (!flying) {
        fly.style.display = "none";
        return;
      }
      const lerp = (a: number, b: number) => a + (b - a) * t;
      const w = lerp(f.width, k.width);
      const h = lerp(f.height, k.height);
      const round = Math.min(1, t * 3);
      const img = flyImgRef.current;
      if (img && fotoImg && !img.getAttribute("src")) img.src = fotoImg.currentSrc || fotoImg.src;
      fly.style.display = "block";
      fly.style.width = `${w}px`;
      fly.style.height = `${h}px`;
      fly.style.transform = `translate3d(${lerp(f.left, k.left)}px, ${lerp(f.top, k.top)}px, 0)`;
      fly.style.borderRadius = `${36 + (Math.min(w, h) / 2 - 36) * round}px`;
      const ao = String(clamp01((t - 0.45) / 0.4));
      if (flyMonoRef.current) {
        flyMonoRef.current.style.opacity = ao;
        flyMonoRef.current.style.fontSize = `${Math.max(10, Math.round(h * 0.36))}px`;
      }
      if (flyRingRef.current) flyRingRef.current.style.opacity = ao;
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
  const other = nav.otherLocale;
  const langHref = `${other.path}#${active === "home" ? altHomeId : altIds[active]}`;

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
                {s.label}
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
            {current ? current.label : nav.home}
            <Chevron size={16} />
          </button>

          <div className="well">
            <div role="group" aria-label={nav.language} style={{ display: "flex", alignItems: "center" }}>
              <span className="seg is-on" aria-current="true">
                {nav.currentCode}
              </span>
              <a href={langHref} hrefLang={other.lang} lang={other.lang} aria-label={other.name} className="seg tool">
                {other.code}
              </a>
            </div>
          </div>
        </div>

        <div className="pill pill-theme">
          <span className="rim" aria-hidden="true" />
          <div role="group" aria-label={nav.theme} style={{ display: "flex", alignItems: "center" }}>
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
        </div>
      </div>

      {menuOpen && (
        <nav ref={menuRef} id="dock-menu" aria-label={nav.sections} className="pill menu">
          <span className="rim" aria-hidden="true" />
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
                {s.label}
              </span>
              <span className="num">{s.num}</span>
            </a>
          ))}
        </nav>
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
