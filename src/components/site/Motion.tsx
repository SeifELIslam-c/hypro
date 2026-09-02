import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/* ---------------- shared rAF scroll ticker ---------------- */
type Sub = () => void;
const subs = new Set<Sub>();
let ticking = false;
let bound = false;

function flush() {
  ticking = false;
  subs.forEach((s) => s());
}

function onScrollGlobal() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(flush);
  }
}

function subscribe(fn: Sub) {
  subs.add(fn);
  if (!bound && typeof window !== "undefined") {
    bound = true;
    window.addEventListener("scroll", onScrollGlobal, { passive: true });
    window.addEventListener("resize", onScrollGlobal);
  }
  return () => {
    subs.delete(fn);
  };
}

export function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ---------------- visibility gate ---------------- */
export function useInView<T extends HTMLElement>(rootMargin = "200px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setInView(!!e?.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}

/**
 * Scroll progress (0 -> 1) of an element across the viewport.
 * Writes directly to the DOM through `apply` — no React state, no re-render.
 */
function useProgressEffect<T extends HTMLElement>(
  apply: (p: number, el: T) => void,
  enabled = true,
) {
  const ref = useRef<T>(null);
  const applyRef = useRef(apply);
  applyRef.current = apply;

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    if (prefersReducedMotion()) {
      applyRef.current(0.5, el);
      return;
    }

    let visible = false;
    let last = -1;

    const update = () => {
      if (!visible) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      if (Math.abs(p - last) < 0.0015) return;
      last = p;
      applyRef.current(p, el);
    };

    let unsub: (() => void) | undefined;
    let io: IntersectionObserver | undefined;

    if (typeof IntersectionObserver === "undefined") {
      visible = true;
      unsub = subscribe(update);
      update();
    } else {
      io = new IntersectionObserver(
        ([e]) => {
          visible = !!e?.isIntersecting;
          if (visible) {
            if (!unsub) unsub = subscribe(update);
            update();
          } else if (unsub) {
            unsub();
            unsub = undefined;
          }
        },
        { rootMargin: "150px" },
      );
      io.observe(el);
    }

    return () => {
      io?.disconnect();
      unsub?.();
    };
  }, [enabled]);

  return ref;
}

/* kept for backwards compatibility */
export function useElementProgress<T extends HTMLElement>() {
  const [p, setP] = useState(0);
  const ref = useProgressEffect<T>((v) => setP(v));
  return { ref, p };
}

/* ---------------- parallax wrapper ---------------- */
export function Parallax({
  children,
  speed = 60,
  className,
  scale = false,
}: {
  children: ReactNode;
  /** px of travel across the full viewport pass */
  speed?: number;
  className?: string;
  scale?: boolean;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const ref = useProgressEffect<HTMLDivElement>((p) => {
    const node = innerRef.current;
    if (!node) return;
    const shift = (p - 0.5) * speed;
    node.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)${
      scale ? ` scale(${(1.12 - p * 0.08).toFixed(4)})` : ""
    }`;
  });

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <div ref={innerRef} className="size-full will-change-transform [backface-visibility:hidden]">
        {children}
      </div>
    </div>
  );
}

/* ---------------- infinite marquee band ---------------- */
export function Marquee({
  items,
  speed = 38,
  reverse = false,
  className,
  itemClassName,
  separator = "·",
}: {
  items: string[];
  speed?: number;
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
  separator?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>("120px");
  const loop = [...items, ...items, ...items];
  const style = {
    animation: `marquee ${speed}s linear infinite${reverse ? " reverse" : ""}`,
    animationPlayState: inView ? "running" : "paused",
    willChange: "transform",
  } as CSSProperties;

  return (
    <div ref={ref} className={cn("marquee-mask relative flex overflow-hidden", className)}>
      {[0, 1].map((band) => (
        <div
          key={band}
          aria-hidden={band === 1}
          className="flex shrink-0 items-center gap-8 whitespace-nowrap pr-8 md:gap-14 md:pr-14"
          style={style}
        >
          {loop.map((it, i) => (
            <span
              key={`${band}-${it}-${i}`}
              className={cn("flex items-center gap-8 md:gap-14", itemClassName)}
            >
              {it}
              <span className="opacity-40">{separator}</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ---------------- horizontally drifting text driven by scroll ---------------- */
export function ScrollText({
  text,
  className,
  distance = 260,
  reverse = false,
}: {
  text: string;
  className?: string;
  distance?: number;
  reverse?: boolean;
}) {
  const innerRef = useRef<HTMLSpanElement>(null);
  const ref = useProgressEffect<HTMLDivElement>((p) => {
    const node = innerRef.current;
    if (!node) return;
    const x = (reverse ? -1 : 1) * (p - 0.5) * distance;
    node.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
  });

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <span
        ref={innerRef}
        className="block whitespace-nowrap will-change-transform [backface-visibility:hidden]"
      >
        {text}
      </span>
    </div>
  );
}

/* ---------------- word-by-word headline reveal ---------------- */
export function SplitText({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 55,
  as: As = "h2",
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <As ref={ref as never} className={className}>
      {text.split(" ").map((w, i) => (
        <span
          key={`${w}-${i}`}
          className="inline-block overflow-hidden align-bottom pb-[0.16em] -mb-[0.16em]"
        >
          <span
            className={cn(
              "inline-block will-change-transform",
              shown ? "translate-y-0 opacity-100" : "translate-y-[110%] opacity-0",
              wordClassName,
            )}
            style={{
              transition:
                "transform 0.9s cubic-bezier(0.22,1,0.36,1), opacity 0.9s cubic-bezier(0.22,1,0.36,1)",
              transitionDelay: `${delay + i * stagger}ms`,
            }}
          >
            {w}
          </span>
          <span className="inline-block">&nbsp;</span>
        </span>
      ))}
    </As>
  );
}

/* ---------------- letter-by-letter shuffle-in headline ---------------- */
export function LetterReveal({
  text,
  className,
  stagger = 26,
}: {
  text: string;
  className?: string;
  stagger?: number;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>("0px");
  return (
    <span ref={ref} className={cn("inline-block", className)} aria-label={text}>
      {text.split("").map((c, i) => (
        <span
          key={`${c}-${i}`}
          aria-hidden
          className={cn(
            "inline-block will-change-transform",
            inView ? "translate-y-0 opacity-100 blur-0" : "translate-y-[0.4em] opacity-0 blur-[6px]",
          )}
          style={{
            transition: "transform .7s cubic-bezier(.22,1,.36,1), opacity .7s ease, filter .7s ease",
            transitionDelay: `${i * stagger}ms`,
          }}
        >
          {c === " " ? "\u00A0" : c}
        </span>
      ))}
    </span>
  );
}

/* ---------------- magnetic hover button/link ---------------- */
export function Magnetic({
  children,
  className,
  strength = 0.28,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const frame = useRef(0);

  const move = (cx: number, cy: number) => {
    const el = ref.current;
    if (!el) return;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const r = el.getBoundingClientRect();
      const x = (cx - (r.left + r.width / 2)) * strength;
      const y = (cy - (r.top + r.height / 2)) * strength;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    });
  };

  useEffect(() => () => { if (frame.current) cancelAnimationFrame(frame.current); }, []);

  return (
    <span
      ref={ref}
      className={cn("inline-block will-change-transform", className)}
      onMouseMove={(e) => move(e.clientX, e.clientY)}
      onMouseLeave={() => {
        const el = ref.current;
        if (el) el.style.transform = "translate3d(0,0,0)";
      }}
      style={{ transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)" }}
    >
      {children}
    </span>
  );
}

/* ---------------- 3D tilt card ---------------- */
export function Tilt({
  children,
  className,
  max = 6,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // pointer-fine only: no tilt on touch devices (avoids jank on mobile)
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setEnabled(mq.matches && !prefersReducedMotion());
    const onChange = () => setEnabled(mq.matches && !prefersReducedMotion());
    mq.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div
      ref={outer}
      className={cn("[perspective:1200px]", className)}
      onMouseMove={
        enabled
          ? (e) => {
              const el = outer.current;
              const node = inner.current;
              if (!el || !node) return;
              const cx = e.clientX;
              const cy = e.clientY;
              if (frame.current) cancelAnimationFrame(frame.current);
              frame.current = requestAnimationFrame(() => {
                frame.current = 0;
                const b = el.getBoundingClientRect();
                const px = (cx - b.left) / b.width - 0.5;
                const py = (cy - b.top) / b.height - 0.5;
                node.style.transform = `rotateX(${(-py * max * 2).toFixed(2)}deg) rotateY(${(px * max * 2).toFixed(2)}deg)`;
              });
            }
          : undefined
      }
      onMouseLeave={() => {
        const node = inner.current;
        if (node) node.style.transform = "rotateX(0deg) rotateY(0deg)";
      }}
    >
      <div
        ref={inner}
        className="size-full will-change-transform"
        style={{
          transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ---------------- scroll-driven cinematic video ---------------- */
export function ScrollVideo({
  src,
  poster,
  className,
  overlayClassName,
}: {
  src: string;
  poster?: string;
  className?: string;
  overlayClassName?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const target = useRef(0);
  const raf = useRef(0);

  const ref = useProgressEffect<HTMLDivElement>((p) => {
    const v = videoRef.current;
    if (!v || !v.duration || Number.isNaN(v.duration)) return;
    // hero occupies the first pass: map 0.5 -> 1 of the progress onto the clip
    target.current = Math.min(0.999, Math.max(0, (p - 0.45) / 0.55)) * v.duration;
    if (!raf.current) {
      const tick = () => {
        const vid = videoRef.current;
        if (!vid) {
          raf.current = 0;
          return;
        }
        const diff = target.current - vid.currentTime;
        if (Math.abs(diff) < 0.012) {
          raf.current = 0;
          return;
        }
        vid.currentTime += diff * 0.18; // eased seek = cinematic
        raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    }
  });

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div ref={ref} className={cn("absolute inset-0", className)}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        playsInline
        preload="auto"
        aria-hidden
        className="size-full object-cover"
      />
      {overlayClassName && <div className={cn("absolute inset-0", overlayClassName)} />}
    </div>
  );
}
