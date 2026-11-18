"use client";

import { useLayoutEffect, useRef } from "react";

const GLYPHS = "abcdefghijklmnopqrstuvwxyz0123456789#%&*+=/<>";
const SCRAMBLE = 3;

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function inViewport(el: Element) {
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight;
}

/**
 * Animates an element's text from `from` to `to`, left to right, with a few
 * scrambled characters at the writing edge, as if the text were being
 * rewritten. Returns a function that stops it and leaves the final text.
 */
export function rewrite(el: HTMLElement, from: string, to: string): () => void {
  const duration = Math.min(900, Math.max(280, Math.max(from.length, to.length) * 9));
  const tail = from.length >= to.length ? from : from + to.slice(from.length);
  const start = performance.now();
  let raf = 0;

  const tick = (now: number) => {
    const q = Math.min(1, (now - start) / duration);
    if (q >= 1) {
      el.textContent = to;
      return;
    }
    const len = Math.round(from.length + (to.length - from.length) * q);
    const settled = Math.floor(to.length * q);
    let out = to.slice(0, settled);
    for (let j = settled; j < Math.min(len, settled + SCRAMBLE); j++) {
      const c = to[j] ?? from[j] ?? " ";
      out += c === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    out += tail.slice(out.length, len);
    el.textContent = out;
    raf = requestAnimationFrame(tick);
  };

  el.textContent = from;
  raf = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(raf);
    el.textContent = to;
  };
}

/**
 * Text that rewrites itself when it changes (e.g. switching language).
 * Only text on screen animates; the rest swaps instantly, and so does
 * everything when the visitor prefers reduced motion.
 */
export function Rw({ children }: { children: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(children);

  useLayoutEffect(() => {
    const from = prev.current;
    prev.current = children;
    const el = ref.current;
    if (!el || from === children || prefersReducedMotion() || !inViewport(el)) return;
    return rewrite(el, from, children);
  }, [children]);

  return <span ref={ref}>{children}</span>;
}
