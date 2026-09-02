import { useEffect, useRef, useState } from "react";

interface HeroVideoLoaderProps {
  src: string;
  className?: string;
  onVideoLoop?: () => void;
  children?: React.ReactNode;
}

export function HeroVideoLoader({ src, className = "", onVideoLoop, children }: HeroVideoLoaderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    setIsReady(false);
    lastTimeRef.current = 0;

    if (v.readyState >= 3) {
      setIsReady(true);
    }

    const handleReady = () => {
      setIsReady(true);
    };

    const handleTimeUpdate = () => {
      if (lastTimeRef.current > 3 && v.currentTime < 1) {
        onVideoLoop?.();
      }
      lastTimeRef.current = v.currentTime;
    };

    v.addEventListener("canplay", handleReady);
    v.addEventListener("playing", handleReady);
    v.addEventListener("timeupdate", handleTimeUpdate);

    void v.play().catch(() => {});

    return () => {
      v.removeEventListener("canplay", handleReady);
      v.removeEventListener("playing", handleReady);
      v.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [src, onVideoLoop]);

  return (
    <div className={`relative size-full overflow-hidden bg-charcoal ${className}`}>
      {/* VIDEO */}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
        onCanPlay={() => setIsReady(true)}
        onPlaying={() => setIsReady(true)}
        className={`size-full object-cover transition-opacity duration-1000 ease-out ${
          isReady ? "opacity-100" : "opacity-0"
        }`}
        style={{ transform: "translateZ(0)" }}
      />

      {/* LUXURY ARCHITECTURAL ILLUSTRATION LOADER */}
      <div
        className={`absolute inset-0 z-10 flex flex-col items-center justify-center bg-charcoal transition-opacity duration-1000 ease-out ${
          isReady ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {/* Soft background aura */}
        <div className="pointer-events-none absolute size-72 rounded-full bg-gold/10 blur-3xl animate-pulse" />

        {/* Elegant Architectural SVG Illustration (Arch & Geometry) */}
        <div className="relative flex flex-col items-center gap-6">
          <svg
            className="h-24 w-24 text-gold/85"
            viewBox="0 0 100 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Arch */}
            <path
              d="M10 110 V50 A40 40 0 0 1 90 50 V110"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            {/* Inner Arch */}
            <path
              d="M25 110 V55 A25 25 0 0 1 75 55 V110"
              stroke="currentColor"
              strokeWidth="1"
              strokeOpacity="0.6"
            />
            {/* Central Pillar */}
            <line x1="50" y1="20" x2="50" y2="110" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.5" />
            {/* Horizon Base Line */}
            <line x1="0" y1="110" x2="100" y2="110" stroke="currentColor" strokeWidth="1.5" />
            {/* Top Sun / Focal Circle - strictly bounded */}
            <circle cx="50" cy="20" r="5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" className="animate-pulse" />
            <circle cx="50" cy="20" r="3" fill="currentColor" className="animate-pulse" />
          </svg>

          {/* HYPRO Brand Logo Mark */}
          <div className="flex items-center gap-3">
            <span className="font-display text-xs tracking-[0.35em] text-gold/90">
              HYPRO ARCHITECTURE
            </span>
          </div>

          {/* Animated luxury progress bar line */}
          <div className="h-0.5 w-28 overflow-hidden rounded-full bg-charcoal-foreground/15">
            <div className="h-full w-full bg-gold/80 animate-pulse" />
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
