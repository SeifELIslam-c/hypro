import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ScanEye, X } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_VR_URL = "https://kuula.co/share/collection/710cN?logo=1&info=1&fs=1&vr=0&zoom=1&thumbs=0";

/**
 * VR 360 entry point — opens interactive 360° Kuula VR tour in full-screen overlay.
 */
export function VrButton({
  href,
  poster,
  title,
  className,
  variant = "gold",
  label = "Visite VR 360°",
}: {
  href?: string | undefined;
  poster?: string;
  title: string;
  className?: string;
  variant?: "gold" | "glass" | "outline";
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const vrTargetUrl = href && href.trim() !== "" ? href : DEFAULT_VR_URL;

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => {
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "label-xs group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-6 py-3.5 transition-all duration-500 hover:-translate-y-0.5",
          variant === "gold" && "bg-gold text-gold-foreground shadow-[var(--shadow-soft)]",
          variant === "glass" &&
            "border border-charcoal-foreground/25 bg-charcoal-foreground/10 text-charcoal-foreground backdrop-blur-md",
          variant === "outline" && "border border-wine/25 bg-wine/[0.04] text-wine hover:bg-wine/10",
          className,
        )}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-full w-full bg-gradient-to-r from-transparent via-current/25 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-[200%]"
        />
        <span className="relative grid size-6 place-items-center rounded-full bg-current/15">
          <ScanEye className="size-3.5 transition-transform duration-700 group-hover:rotate-[18deg]" />
        </span>
        <span className="relative">{label}</span>
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${title} — visite VR 360°`}
            className="fixed inset-0 z-[99999] flex flex-col bg-black"
          >
            {/* Top-Center Luxury HUD Pill Dock (Dynamic Island style) — zero overlap with Kuula icons */}
            <div className="pointer-events-none fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-[99999] flex w-full max-w-full justify-center px-4">
              <div className="pointer-events-auto flex items-center gap-2.5 sm:gap-3.5 rounded-full border border-white/20 bg-charcoal/90 text-charcoal-foreground backdrop-blur-2xl px-4 py-2 sm:px-5 sm:py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.65)] transition-all duration-300 hover:border-gold/40">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gold/15">
                  <ScanEye className="size-3.5 text-gold" />
                </span>
                <span className="font-display text-xs sm:text-sm tracking-wide text-white truncate max-w-[130px] sm:max-w-[280px] md:max-w-[420px]">
                  {title}
                </span>
                <span className="hidden sm:inline-block label-xs text-gold/90 text-[0.65rem] uppercase tracking-widest shrink-0">
                  VR 360°
                </span>
                <span className="h-4 w-px bg-white/20 shrink-0" />
                <button
                  type="button"
                  onClick={close}
                  aria-label="Fermer la visite VR"
                  className="grid size-7 sm:size-8 shrink-0 place-items-center rounded-full bg-white/10 text-white/90 transition-all duration-300 hover:bg-gold hover:text-gold-foreground hover:scale-105"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Full Screen VR iframe environment across entire window */}
            <iframe
              src={vrTargetUrl}
              title={`${title} — Visite Virtual Reality 360°`}
              className="size-full border-0"
              allow="xr-spatial-tracking; gyroscope; accelerometer"
              allowFullScreen
            />
          </div>,
          document.body,
        )}
    </>
  );
}
