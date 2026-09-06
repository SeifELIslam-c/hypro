import { useState, useRef, useCallback } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractivePlanStageProps {
  src: string;
  alt: string;
  unitCode: string;
  unitName: string;
  plans?: Array<{ title: string; src: string; level?: string }>;
  activePlanIndex?: number;
  onPlanIndexChange?: (index: number) => void;
  onOpenFullscreen: () => void;
  className?: string;
  aspectRatio?: string;
}

export function InteractivePlanStage({
  src,
  alt,
  unitCode,
  unitName,
  plans,
  activePlanIndex = 0,
  onPlanIndexChange,
  onOpenFullscreen,
  className,
  aspectRatio = "aspect-[16/10] sm:aspect-[16/11]",
}: InteractivePlanStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Transform states
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Drag tracking refs
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const posStart = useRef({ x: 0, y: 0 });

  // Mobile pinch zoom refs
  const touchStartDist = useRef<number | null>(null);
  const initialTouchScale = useRef<number>(1);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  // Clamping helper: keeps the plan safely visible at all times
  const clampPan = useCallback((x: number, y: number, currentScale: number) => {
    if (!containerRef.current) return { x, y };
    const rect = containerRef.current.getBoundingClientRect();
    const maxPanX = Math.max(30, (rect.width * Math.max(0, currentScale - 0.85)) / 2);
    const maxPanY = Math.max(25, (rect.height * Math.max(0, currentScale - 0.85)) / 2);
    return {
      x: Math.min(Math.max(x, -maxPanX), maxPanX),
      y: Math.min(Math.max(y, -maxPanY), maxPanY),
    };
  }, []);

  // Reset view to center & 100%
  const handleReset = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setScale((prev) => {
      const nextScale = Math.min(Math.max(prev + delta, 0.8), 3.5);
      setPosition((pos) => clampPan(pos.x, pos.y, nextScale));
      return nextScale;
    });
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    posStart.current = { ...position };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    const clamped = clampPan(posStart.current.x + dx, posStart.current.y + dy, scale);
    setPosition(clamped);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Mobile touch handlers (strictly for moving & 2-finger pinch, no conflicting double-tap)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      posStart.current = { ...position };
      setIsDragging(true);
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartDist.current = dist;
      initialTouchScale.current = scale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    if (e.touches.length === 1 && touchStartPos.current && isDragging) {
      const dx = e.touches[0].clientX - touchStartPos.current.x;
      const dy = e.touches[0].clientY - touchStartPos.current.y;
      const clamped = clampPan(posStart.current.x + dx, posStart.current.y + dy, scale);
      setPosition(clamped);
    } else if (e.touches.length === 2 && touchStartDist.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / touchStartDist.current;
      const nextScale = Math.min(Math.max(initialTouchScale.current * ratio, 0.8), 3.5);
      setScale(nextScale);
      setPosition((pos) => clampPan(pos.x, pos.y, nextScale));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      touchStartDist.current = null;
    }
    if (e.touches.length === 0) {
      touchStartPos.current = null;
      setIsDragging(false);
    }
  };

  const zoomIn = () => {
    setScale((s) => {
      const next = Math.min(Number((s + 0.25).toFixed(2)), 3.5);
      setPosition((pos) => clampPan(pos.x, pos.y, next));
      return next;
    });
  };

  const zoomOut = () => {
    setScale((s) => {
      const next = Math.max(Number((s - 0.25).toFixed(2)), 0.8);
      setPosition((pos) => clampPan(pos.x, pos.y, next));
      return next;
    });
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={cn(
        "group/plan relative flex select-none items-center justify-center overflow-hidden rounded-[1.5rem] md:rounded-[2rem] touch-none",
        "border border-[#e8e2d8] bg-gradient-to-b from-[#FAF8F5] via-[#F6F2EC] to-[#F0EBE2]",
        "transition-colors duration-500",
        aspectRatio,
        isDragging ? "cursor-grabbing" : "cursor-grab",
        className
      )}
      style={{ touchAction: "none" }}
    >
      {/* DISCREET ARCHITECTURAL GRID */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(197, 168, 128, 0.35) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* PLAN CONTAINER (BOUNDED PAN & ZOOM) */}
      <div
        className="relative size-full flex items-center justify-center will-change-transform pointer-events-none"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
          transformOrigin: "center center",
          transition: isDragging ? "none" : "transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          loading="lazy"
          decoding="async"
          className="size-full object-contain p-3 select-none pointer-events-none"
        />
      </div>

      {/* TOP-LEFT: DISCREET ARCHITECTURAL PLAN BADGE */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 pointer-events-none flex items-center gap-1.5 rounded-full border border-[#e5dfd5] bg-white/90 px-2.5 py-1 text-[0.65rem] font-medium text-[#2d2a26] shadow-xs backdrop-blur-md">
        <Layers className="size-3 text-[#c5a880]" />
        <span>Plan d'architecte</span>
      </div>

      {/* TOP-RIGHT: AGRANDIR / PLEIN ÉCRAN BUTTON */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpenFullscreen();
        }}
        onPointerDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        title="Agrandir en plein écran"
        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-1.5 rounded-full border border-[#e5dfd5] bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#1a1917] shadow-xs backdrop-blur-md transition-all hover:bg-[#c5a880] hover:text-white hover:border-[#c5a880] active:scale-95"
      >
        <Maximize2 className="size-3.5" />
        <span className="hidden sm:inline">Agrandir</span>
      </button>

      {/* BOTTOM-LEFT: CLEAN ZOOM & RESET CONTROLS (FULL EVENT ISOLATION FROM CANVAS GESTURES) */}
      <div
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 flex items-center gap-1 rounded-full border border-[#e2dcce] bg-white/95 p-1 shadow-sm backdrop-blur-md"
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            zoomOut();
          }}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          title="Zoom arrière (-)"
          className="flex size-7 items-center justify-center rounded-full text-[#4a453e] hover:bg-[#f0ece4] hover:text-[#1a1917] active:scale-90 transition-all"
        >
          <ZoomOut className="size-3.5" />
        </button>

        <span className="px-1.5 font-mono text-[0.65rem] font-medium text-[#6e685f]">
          {Math.round(scale * 100)}%
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            zoomIn();
          }}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          title="Zoom avant (+)"
          className="flex size-7 items-center justify-center rounded-full text-[#4a453e] hover:bg-[#f0ece4] hover:text-[#1a1917] active:scale-90 transition-all"
        >
          <ZoomIn className="size-3.5" />
        </button>

        <span className="h-3.5 w-px bg-[#e0dad0] mx-0.5" />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleReset();
          }}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          title="Recentrer le plan"
          className="flex size-7 items-center justify-center rounded-full text-[#4a453e] hover:bg-[#f0ece4] hover:text-[#1a1917] active:scale-90 transition-all"
        >
          <RotateCcw className="size-3.5" />
        </button>
      </div>

      {/* BOTTOM-RIGHT: MULTI-LEVEL SWITCHER (FOR LOCAL COMMERCIAL RDC & ÉTAGE) */}
      {plans && plans.length > 1 && onPlanIndexChange && (
        <div
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 flex items-center gap-1 rounded-full border border-[#e2dcce] bg-white/95 p-1 shadow-sm backdrop-blur-md"
        >
          {plans.map((_, pIdx) => (
            <button
              key={pIdx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPlanIndexChange(pIdx);
              }}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              className={cn(
                "rounded-full px-2.5 py-1 text-[0.65rem] font-semibold transition-all",
                activePlanIndex === pIdx
                  ? "bg-[#5c242b] text-white shadow-xs"
                  : "text-[#5a544d] hover:text-[#1a1917] hover:bg-[#f4efe8]"
              )}
            >
              {unitCode === "A3" ? (pIdx === 0 ? "1" : "2") : `Niveau ${pIdx + 1}`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
