import { useEffect, useRef, useState } from "react";
import { useCountUp } from "./Reveal";

export function ProgressRing({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const shown = useCountUp(value, active);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => e?.isIntersecting && setActive(true), {
      threshold: 0.4,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const r = 84;
  const c = 2 * Math.PI * r;

  return (
    <div ref={ref} className="flex flex-col items-center gap-4">
      <div className="relative size-48">
        <svg viewBox="0 0 200 200" className="size-full -rotate-90">
          <circle cx="100" cy="100" r={r} fill="none" strokeWidth="6" className="stroke-border" />
          <circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            className="stroke-wine"
            style={{
              strokeDasharray: c,
              strokeDashoffset: c - (c * shown) / 100,
              transition: "stroke-dashoffset 0.2s linear",
            }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <span className="font-display text-5xl text-wine">{shown}%</span>
        </div>
      </div>
      <span className="label-xs text-muted-foreground">{label}</span>
    </div>
  );
}
