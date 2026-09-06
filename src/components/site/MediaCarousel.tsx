import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Maximize2, Play, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MediaItem } from "@/data/projects";

export function MediaCarousel({
  items,
  videoUrl,
  title,
}: {
  items: MediaItem[];
  videoUrl?: string | undefined;
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
  const [zoom, setZoom] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef(0);
  const rafRef = useRef(0);

  const scrollTo = useCallback((i: number) => {
    const el = trackRef.current;
    const child = el?.children[i] as HTMLElement | undefined;
    if (!el || !child) return;
    lockRef.current = Date.now() + 700; // ignore scroll sync while animating
    el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: "smooth" });
    setIndex(i);
  }, []);

  const go = useCallback(
    (dir: number) => {
      const next = (index + dir + items.length) % items.length;
      scrollTo(next);
    },
    [index, items.length, scrollTo],
  );

  // keep index in sync with native/touch scrolling, rAF-throttled
  const onScroll = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const el = trackRef.current;
      if (!el || Date.now() < lockRef.current) return;
      const children = Array.from(el.children) as HTMLElement[];
      let best = 0;
      let bestD = Infinity;
      children.forEach((c, i) => {
        const d = Math.abs(c.offsetLeft - el.offsetLeft - el.scrollLeft);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      setIndex((prev) => (prev === best ? prev : best));
    });
  }, []);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  // keyboard navigation
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [go]);

  const current = items[index];

  /* ---- pointer / mouse drag to swipe (touch uses native scroll) ---- */
  const drag = useRef<{ id: number; x: number; left: number; moved: boolean } | null>(null);
  const [dragging, setDragging] = useState(false);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return; // native momentum scroll on touch
    const el = trackRef.current;
    if (!el) return;
    drag.current = { id: e.pointerId, x: e.clientX, left: el.scrollLeft, moved: false };
    setDragging(true);
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const el = trackRef.current;
    if (!d || !el || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 3) d.moved = true;
    lockRef.current = Date.now() + 120;
    el.scrollLeft = d.left - dx;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const el = trackRef.current;
    if (!d || !el) return;
    drag.current = null;
    setDragging(false);
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    // settle on the nearest slide
    const children = Array.from(el.children) as HTMLElement[];
    let best = 0;
    let bestD = Infinity;
    children.forEach((c, i) => {
      const dist = Math.abs(c.offsetLeft - el.offsetLeft - el.scrollLeft);
      if (dist < bestD) {
        bestD = dist;
        best = i;
      }
    });
    scrollTo(best);
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDragStart={(e) => e.preventDefault()}
        tabIndex={0}
        role="group"
        aria-label={`${title} — galerie (glissez pour naviguer)`}
        className={cn(
          "no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 outline-none select-none md:gap-6",
          dragging ? "cursor-grabbing snap-none scroll-auto" : "cursor-grab scroll-smooth",
        )}
      >
        {items.map((m, i) => (
          <figure
            key={i}
            className="group relative aspect-[4/5] w-[88%] shrink-0 snap-center overflow-hidden rounded-[1.5rem] bg-sand sm:aspect-[4/3] sm:w-[80%] md:aspect-[16/10] md:w-[78%] md:rounded-[2.5rem]"
          >
            <img
              src={m.src}
              alt={m.alt}
              draggable={false}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              className={cn(
                "size-full object-cover transition-transform duration-[1200ms] ease-out will-change-transform",
                i === index ? "scale-100" : "scale-[1.07]",
              )}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/55 via-transparent to-transparent" />
            <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 p-5 md:p-8">
              <span className="label-xs text-charcoal-foreground/80 font-mono">
                {String(i + 1).padStart(2, "0")}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <span className="label-xs shrink-0 text-muted-foreground">
            {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>
          <div className="flex shrink-0 items-center gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`Aller à l'image ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  i === index ? "w-7 bg-gold" : "w-2 bg-current opacity-30 hover:opacity-60",
                )}
              />
            ))}
          </div>
          <p className="hidden truncate text-sm opacity-60 sm:block">{current?.alt}</p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setZoom(true)}
            aria-label="Afficher en plein écran"
            className="grid size-11 place-items-center rounded-full border border-current/25 transition-transform hover:scale-105"
          >
            <Maximize2 className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Image précédente"
            className="grid size-11 place-items-center rounded-full border border-current/25 transition-transform hover:scale-105"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Image suivante"
            className="grid size-11 place-items-center rounded-full bg-gold text-gold-foreground transition-transform hover:scale-105"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>

      {zoom && current && (
        <Overlay onClose={() => setZoom(false)} label={`${title} — image plein écran`}>
          <img
            src={current.src}
            alt={current.alt}
            className="max-h-[82vh] w-full rounded-[1.5rem] object-contain md:rounded-[2rem]"
          />
        </Overlay>
      )}

      {videoOpen && videoUrl && (
        <Overlay onClose={() => setVideoOpen(false)} label={`${title} — vidéo`}>
          <video
            src={videoUrl}
            controls
            autoPlay
            playsInline
            className="max-h-[82vh] w-full rounded-[1.5rem] bg-charcoal object-contain md:rounded-[2rem]"
          />
        </Overlay>
      )}
    </div>
  );
}

function Overlay({
  children,
  onClose,
  label,
}: {
  children: React.ReactNode;
  onClose: () => void;
  label: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-[80] flex animate-fade-in items-center justify-center bg-charcoal/92 p-4 backdrop-blur-sm md:p-10"
      onClick={onClose}
    >
      <div className="w-full max-w-5xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer"
        className="absolute right-4 top-4 grid size-12 place-items-center rounded-full bg-charcoal-foreground/15 text-charcoal-foreground backdrop-blur-md transition-colors hover:bg-charcoal-foreground/30 md:right-5 md:top-5"
      >
        <X className="size-5" />
      </button>
    </div>
  );
}
