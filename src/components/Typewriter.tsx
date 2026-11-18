"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

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

/**
 * The hero title types itself behind an orange caret. The full sentence is
 * always in the DOM (and in aria-label) so layout, SEO and screen readers never
 * depend on the animation. With reduced motion or without JS it shows at once.
 */
export function Typewriter({ a, b }: { a: string; b: string }) {
  const full = a + b;
  const motion = useMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (motion !== true) return;
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      i += 1;
      setN(i);
      if (i >= full.length) return;
      const ch = full[i - 1];
      const pause = i === a.length ? 280 : ch === "," ? 200 : 0;
      timer = setTimeout(step, 28 + Math.random() * 34 + pause);
    };
    timer = setTimeout(step, 450);
    return () => clearTimeout(timer);
  }, [motion, a, full]);

  const count = motion ? Math.min(n, full.length) : full.length;
  const typedA = a.slice(0, Math.min(count, a.length));
  const typedB = count > a.length ? b.slice(0, count - a.length) : "";
  const done = count >= full.length;

  return (
    <h1 className={`hero-title${motion !== null ? " tw-ready" : ""}`} aria-label={full.trim()}>
      <span aria-hidden="true">
        {typedA}
        <span className="tw-b">{typedB}</span>
        <span className={`caret${done ? " is-done" : ""}`} />
        <span className="tw-ghost">{a.slice(typedA.length)}</span>
        <span className="tw-ghost">{b.slice(typedB.length)}</span>
      </span>
    </h1>
  );
}
