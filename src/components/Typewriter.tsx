"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const RM = "(prefers-reduced-motion: reduce)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(RM);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
/** true = animate, false = reduced motion, null = not hydrated yet. */
const useMotion = () =>
  useSyncExternalStore(
    subscribe,
    () => !window.matchMedia(RM).matches,
    () => null,
  );

type Title = { a: string; b: string };

/**
 * The hero title types itself behind an orange caret. When the text changes
 * (switching language) it erases the current title and types the new one.
 * The full sentence is always in aria-label, and the untyped part stays in
 * the layout as transparent text, so nothing jumps around. With reduced
 * motion or without JS it shows at once.
 */
export function Typewriter({ a, b }: { a: string; b: string }) {
  const motion = useMotion();
  const [shown, setShown] = useState<Title>({ a, b });
  const [n, setN] = useState(0);
  const nRef = useRef(0);
  const typedOnce = useRef(false);

  useEffect(() => {
    if (motion !== true) return;
    let timer: ReturnType<typeof setTimeout>;
    const set = (v: number) => {
      nRef.current = v;
      setN(v);
    };

    if (shown.a !== a || shown.b !== b) {
      // Erase what is on screen, then switch to the new title (typed faster).
      typedOnce.current = true;
      const erase = () => {
        const next = Math.max(0, nRef.current - 3);
        set(next);
        if (next > 0) timer = setTimeout(erase, 14);
        else timer = setTimeout(() => setShown({ a, b }), 120);
      };
      timer = setTimeout(erase, 0);
      return () => clearTimeout(timer);
    }

    const full = a + b;
    if (nRef.current >= full.length) return;
    const retype = typedOnce.current;
    const step = () => {
      const i = nRef.current + 1;
      set(i);
      if (i >= full.length) {
        typedOnce.current = true;
        return;
      }
      const ch = full[i - 1];
      const pause = i === a.length ? (retype ? 140 : 280) : ch === "," ? (retype ? 100 : 200) : 0;
      timer = setTimeout(step, (retype ? 16 + Math.random() * 20 : 28 + Math.random() * 34) + pause);
    };
    timer = setTimeout(step, retype ? 60 : 450);
    return () => clearTimeout(timer);
  }, [motion, a, b, shown]);

  const src = motion ? shown : { a, b };
  const full = src.a + src.b;
  const count = motion ? Math.min(n, full.length) : full.length;
  const typedA = src.a.slice(0, Math.min(count, src.a.length));
  const typedB = count > src.a.length ? src.b.slice(0, count - src.a.length) : "";
  const done = count >= full.length;

  return (
    <h1 className={`hero-title${motion !== null ? " tw-ready" : ""}`} aria-label={(a + b).trim()}>
      <span aria-hidden="true">
        {typedA}
        <span className="tw-b">{typedB}</span>
        <span className={`caret${done ? " is-done" : ""}`} />
        <span className="tw-ghost">{src.a.slice(typedA.length)}</span>
        <span className="tw-ghost">{src.b.slice(typedB.length)}</span>
      </span>
    </h1>
  );
}
