import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  Maximize2,
  Minimize2,
  Columns2,
  Layers,
  Map as MapIcon,
  ArrowLeft,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Optimized WebP transparent plans
import f4TerrasseImg from "@/assets/f4-terrasse.webp";
import f4EtageImg from "@/assets/f4-etage.webp";
import localCommercial1Img from "@/assets/local-commercial-1.webp";
import localCommercial2Img from "@/assets/local-commercial-2.webp";
import f3TerrasseBlocBImg from "@/assets/f3-terrasse-bloc-b.webp";
import interiorImg from "@/assets/interior-1.webp";
import cheragaImg from "@/assets/cheraga-1.webp";
import heroImg from "@/assets/hero.webp";

export interface PlanItem {
  title: string;
  level: string;
  src: string;
}

export interface UnitGroup {
  id: string;
  category: "BLOC A" | "BLOC B";
  code: string;
  name: string;
  surface: string;
  plans: PlanItem[];
}

// Complete Cheraga Residence Structure
export const CHERAGA_STRUCTURE: UnitGroup[] = [
  // BLOC A
  {
    id: "a1",
    category: "BLOC A",
    code: "A1",
    name: "F4 avec terrasse",
    surface: "105 m²",
    plans: [{ title: "Plan F4 Terrasse", level: "RDC plein ciel", src: f4TerrasseImg }],
  },
  {
    id: "a2",
    category: "BLOC A",
    code: "A2",
    name: "F4 étage courant",
    surface: "107 m²",
    plans: [{ title: "Plan F4 Étage", level: "Étages 1 à 5", src: f4EtageImg }],
  },
  {
    id: "a3",
    category: "BLOC A",
    code: "A3",
    name: "Local commercial",
    surface: "128 m²",
    plans: [
      { title: "Local Commercial — 1", level: "Niveau 1", src: localCommercial1Img },
      { title: "Local Commercial — 2", level: "Niveau 2", src: localCommercial2Img },
    ],
  },
  // BLOC B
  {
    id: "b1",
    category: "BLOC B",
    code: "B1",
    name: "F3 avec cours",
    surface: "106 m²",
    plans: [{ title: "Plan F3 avec cours", level: "Cour privative", src: f3TerrasseBlocBImg }],
  },
  {
    id: "b2",
    category: "BLOC B",
    code: "B2",
    name: "F4 Simplex",
    surface: "107 m²",
    plans: [{ title: "Plan F4 Simplex", level: "Étages 1 à 5", src: f4EtageImg }],
  },
];

interface ArchitecturalPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  isCheraga?: boolean;
  currentPlanSrc: string;
  currentPlanName: string;
  currentPlanCode: string;
  currentPlanCategory?: string;
  currentPlanSurface?: string;
}

export function ArchitecturalPlanModal({
  isOpen,
  onClose,
  isCheraga = true,
  currentPlanSrc,
  currentPlanName,
  currentPlanCode,
  currentPlanCategory = "BLOC A",
  currentPlanSurface,
}: ArchitecturalPlanModalProps) {
  const [viewMode, setViewMode] = useState<"focus" | "map">("focus");

  // Selected unit
  const [selectedUnit, setSelectedUnit] = useState<UnitGroup>(() => {
    const found = CHERAGA_STRUCTURE.find((u) => u.code === currentPlanCode);
    return (
      found || {
        id: currentPlanCode,
        category: (currentPlanCategory as "BLOC A" | "BLOC B") || "BLOC A",
        code: currentPlanCode,
        name: currentPlanName,
        surface: currentPlanSurface || "",
        plans: [{ title: currentPlanName, level: currentPlanCategory, src: currentPlanSrc }],
      }
    );
  });

  // Dual view for units with multiple plans (e.g. Local commercial)
  const [dualMode, setDualMode] = useState<boolean>(true);
  const [activeSingleIndex, setActiveSingleIndex] = useState<number>(0);

  // Pan & Zoom states (pure, responsive 2D)
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const posStart = useRef({ x: 0, y: 0 });

  // Native Fullscreen
  const [isNativeFs, setIsNativeFs] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Boundary clamping helper: keeps plan visible at all times
  const clampPan = useCallback((x: number, y: number, currentScale: number) => {
    if (!containerRef.current) return { x, y };
    const rect = containerRef.current.getBoundingClientRect();
    const maxPanX = Math.max(50, (rect.width * Math.max(0, currentScale - 0.75)) / 2);
    const maxPanY = Math.max(50, (rect.height * Math.max(0, currentScale - 0.75)) / 2);
    return {
      x: Math.min(Math.max(x, -maxPanX), maxPanX),
      y: Math.min(Math.max(y, -maxPanY), maxPanY),
    };
  }, []);

  // Reset view to center & 100%
  const resetView = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  }, []);

  // Zoom helpers
  const zoomIn = useCallback(() => {
    setScale((s) => {
      const next = Math.min(Number((s + 0.25).toFixed(2)), 4);
      setPosition((pos) => clampPan(pos.x, pos.y, next));
      return next;
    });
  }, [clampPan]);

  const zoomOut = useCallback(() => {
    setScale((s) => {
      const next = Math.max(Number((s - 0.25).toFixed(2)), 0.6);
      setPosition((pos) => clampPan(pos.x, pos.y, next));
      return next;
    });
  }, [clampPan]);

  // When opening, reset to center
  useEffect(() => {
    if (isOpen) {
      const found = CHERAGA_STRUCTURE.find((u) => u.code === currentPlanCode);
      const unit =
        found || {
          id: currentPlanCode,
          category: (currentPlanCategory as "BLOC A" | "BLOC B") || "BLOC A",
          code: currentPlanCode,
          name: currentPlanName,
          surface: currentPlanSurface || "",
          plans: [{ title: currentPlanName, level: currentPlanCategory, src: currentPlanSrc }],
        };

      setSelectedUnit(unit);
      setViewMode("focus");
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      setDualMode(!isMobile && unit.plans.length > 1);
      setActiveSingleIndex(0);
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setRotation(0);
    }
  }, [isOpen, currentPlanCode, currentPlanName, currentPlanSrc, currentPlanCategory, currentPlanSurface]);

  // Lock scroll & keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (viewMode === "map") {
          setViewMode("focus");
        } else {
          if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
          }
          onClose();
        }
      } else if (e.key.toLowerCase() === "f") {
        toggleNativeFullscreen();
      } else if (e.key === "+" || e.key === "=") {
        zoomIn();
      } else if (e.key === "-") {
        zoomOut();
      } else if (e.key === "0") {
        resetView();
      } else if (e.key.toLowerCase() === "r") {
        setRotation((r) => (r + 90) % 360);
      }
    };

    const handleFsChange = () => {
      setIsNativeFs(
        !!document.fullscreenElement ||
          !!(document as unknown as { webkitFullscreenElement: Element | null }).webkitFullscreenElement,
      );
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("webkitfullscreenchange", handleFsChange);
    };
  }, [isOpen, viewMode, onClose, resetView, zoomIn, zoomOut]);

  // Native Fullscreen API
  const toggleNativeFullscreen = useCallback(async () => {
    const el = containerRef.current;
    if (!el) return;

    if (!document.fullscreenElement && !(document as unknown as { webkitFullscreenElement: Element | null }).webkitFullscreenElement) {
      try {
        if (el.requestFullscreen) {
          await el.requestFullscreen();
        } else if ((el as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen) {
          await (el as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
        }
        setIsNativeFs(true);
      } catch {
        setIsNativeFs(true);
      }
    } else {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as unknown as { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen) {
          await (document as unknown as { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen();
        }
      } catch {}
      setIsNativeFs(false);
    }
  }, []);

  // Mobile Touch handlers (pure pan & pinch zoom, NO double-tap jumping)
  const touchStartDist = useRef<number | null>(null);
  const initialTouchScale = useRef<number>(1);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      posStart.current = { ...position };
      setIsDragging(true);
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
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
        e.touches[0].clientY - e.touches[1].clientY,
      );
      const ratio = dist / touchStartDist.current;
      const nextScale = Math.min(Math.max(Number((initialTouchScale.current * ratio).toFixed(2)), 0.6), 4);
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

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    posStart.current = { ...position };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    const clamped = clampPan(posStart.current.x + dx, posStart.current.y + dy, scale);
    setPosition(clamped);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setScale((s) => {
      const next = Math.min(Math.max(Number((s + delta).toFixed(2)), 0.6), 4);
      setPosition((pos) => clampPan(pos.x, pos.y, next));
      return next;
    });
  };

  if (!isOpen || typeof document === "undefined") return null;

  const blocAUnits = CHERAGA_STRUCTURE.filter((u) => u.category === "BLOC A");
  const blocBUnits = CHERAGA_STRUCTURE.filter((u) => u.category === "BLOC B");

  return createPortal(
    <div
      ref={containerRef}
      className={cn(
        "fixed inset-0 z-[999999] flex size-full select-none flex-col overflow-hidden bg-[#FAF8F5] text-[#1a1917] transition-all duration-300",
        isNativeFs ? "h-screen w-screen" : "h-[100svh] w-[100vw]",
      )}
    >
      {/* LUXURY CREAMY ARCHITECTURAL DOT GRID */}
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(197, 168, 128, 0.4) 1.2px, transparent 1.2px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* TOP HEADER — CREAMY WHITE LUXURY STYLE */}
      <header
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        className="relative z-30 flex flex-col border-b border-[#e5dfd5] bg-white/90 px-4 py-2.5 backdrop-blur-md sm:px-6 sm:py-3.5 shadow-xs"
      >
        <div className="flex items-center justify-between w-full">
          {/* TITLE & UNIT INFO */}
          <div className="flex items-center gap-3">
            <span className="flex size-7 items-center justify-center rounded-full bg-[#5c242b] text-white shadow-xs">
              <Layers className="size-3.5 text-[#c5a880]" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#8d6937] tracking-wider uppercase">
                  {selectedUnit.category} · {selectedUnit.code}
                </span>
                <span className="text-[0.68rem] text-[#8a8278] hidden sm:inline">•</span>
                <span className="text-[0.68rem] font-mono text-[#8a8278] hidden sm:inline">
                  {selectedUnit.surface}
                </span>
              </div>
              <h2 className="font-serif text-base sm:text-xl font-normal text-[#1a1917] leading-tight">
                {selectedUnit.name}
              </h2>
            </div>
          </div>

          {/* RIGHT ACTIONS: FULLSCREEN & CLOSE */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleNativeFullscreen}
              title={isNativeFs ? "Quitter plein écran (F)" : "Plein écran (F)"}
              className="hidden sm:flex size-9 items-center justify-center rounded-full border border-[#e5dfd5] bg-[#faf8f5] text-[#4a453e] hover:bg-white hover:text-[#1a1917] transition-all"
            >
              {isNativeFs ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
            </button>

            <button
              type="button"
              onClick={() => {
                if (document.fullscreenElement) {
                  document.exitFullscreen().catch(() => {});
                }
                onClose();
              }}
              title="Fermer (Échap)"
              className="flex size-9 items-center justify-center rounded-full border border-[#e5dfd5] bg-[#faf8f5] text-[#4a453e] hover:bg-[#5c242b] hover:text-white hover:border-[#5c242b] transition-all"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* SUB-BAR: CARTE DU PROJET + DUAL MODE TOGGLES */}
        <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#f0ebe2] w-full">
          {/* SWITCH BETWEEN FOCUS VIEW & MAP VIEW */}
          {isCheraga && (
            <button
              type="button"
              onClick={() => setViewMode(viewMode === "focus" ? "map" : "focus")}
              className="text-xs inline-flex items-center gap-1.5 rounded-full border border-[#c5a880]/50 bg-[#faf6f0] px-3 py-1.5 text-[#8d6937] font-medium transition-all hover:bg-[#c5a880] hover:text-white shadow-xs"
            >
              {viewMode === "focus" ? (
                <>
                  <MapIcon className="size-3.5 text-[#c5a880]" />
                  Carte du projet
                </>
              ) : (
                <>
                  <ArrowLeft className="size-3.5" />
                  Retour au plan
                </>
              )}
            </button>
          )}

          {/* DUAL MODE TOGGLE (FOR LOCAL COMMERCIAL: 1 & 2) */}
          {viewMode === "focus" && selectedUnit.plans.length > 1 && (
            <div className="flex items-center rounded-full border border-[#e0dad0] bg-[#f8f5f0] p-0.5">
              <button
                type="button"
                onClick={() => setDualMode(true)}
                className={cn(
                  "text-[0.65rem] sm:text-xs rounded-full px-2.5 py-1 transition-all font-medium",
                  dualMode ? "bg-[#5c242b] text-white shadow-xs" : "text-[#5e5850]"
                )}
              >
                <Columns2 className="inline-block size-3 mr-1" />
                1 & 2
              </button>
              <button
                type="button"
                onClick={() => {
                  setDualMode(false);
                  setActiveSingleIndex(0);
                }}
                className={cn(
                  "text-[0.65rem] sm:text-xs rounded-full px-2.5 py-1 transition-all font-medium",
                  !dualMode && activeSingleIndex === 0 ? "bg-[#5c242b] text-white shadow-xs" : "text-[#5e5850]"
                )}
              >
                1
              </button>
              <button
                type="button"
                onClick={() => {
                  setDualMode(false);
                  setActiveSingleIndex(1);
                }}
                className={cn(
                  "text-[0.65rem] sm:text-xs rounded-full px-2.5 py-1 transition-all font-medium",
                  !dualMode && activeSingleIndex === 1 ? "bg-[#5c242b] text-white shadow-xs" : "text-[#5e5850]"
                )}
              >
                2
              </button>
            </div>
          )}
        </div>
      </header>

      {/* VIEWPORT CONTENT */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden p-2 sm:p-6 md:p-8">
        {/* ========================================================================= */}
        {/* 1. FOCUS VIEW (DIRECT CRISP PLAN PREVIEW WITH SMOOTH PAN & ZOOM)          */}
        {/* ========================================================================= */}
        {viewMode === "focus" && (
          <div
            className="relative size-full overflow-hidden touch-none flex items-center justify-center"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
            style={{
              cursor: isDragging ? "grabbing" : "grab",
            }}
          >
            {/* DUAL MODE (LOCAL COMMERCIAL: RDC & ÉTAGE) */}
            {selectedUnit.plans.length > 1 && dualMode ? (
              <div
                style={{
                  transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale}) rotate(${rotation}deg)`,
                  transformOrigin: "center center",
                  transition: isDragging ? "none" : "transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                className="absolute inset-0 flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-8 p-3 sm:p-6 will-change-transform"
              >
                {selectedUnit.plans.map((p) => (
                  <div
                    key={p.title}
                    className="relative flex h-[38vh] md:h-[78vh] w-full md:w-1/2 flex-col items-center justify-between rounded-3xl border border-[#e2dcce] bg-white/85 p-3 md:p-5 backdrop-blur-md shadow-lg shrink-0"
                  >
                    <div className="flex w-full items-center justify-between pb-2 border-b border-[#ece5da]">
                      <span className="text-xs font-semibold text-[#8d6937]">{p.title}</span>
                      <span className="text-xs text-[#7a746b] font-medium">{p.level}</span>
                    </div>

                    <div className="relative flex flex-1 w-full items-center justify-center overflow-hidden p-2">
                      <img
                        src={p.src}
                        alt={p.title}
                        draggable={false}
                        className="max-h-[28vh] md:max-h-[64vh] w-auto max-w-full object-contain select-none pointer-events-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* SINGLE APARTMENT PLAN VIEW (CENTERED, RESPONSIVE, BOUNDED) */
              <div
                style={{
                  transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale}) rotate(${rotation}deg)`,
                  transformOrigin: "center center",
                  transition: isDragging ? "none" : "transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                className="relative size-full flex items-center justify-center will-change-transform p-3 sm:p-6"
              >
                <img
                  src={
                    selectedUnit.plans.length > 1
                      ? selectedUnit.plans[activeSingleIndex]?.src
                      : selectedUnit.plans[0]?.src
                  }
                  alt={selectedUnit.name}
                  draggable={false}
                  className="size-full max-h-[82vh] object-contain select-none pointer-events-none"
                />
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. CHERAGA INHERITED CATEGORY ARCHITECTURAL MAP TREE (CREAMY WHITE)       */}
        {/* ========================================================================= */}
        {viewMode === "map" && isCheraga && (
          <div className="relative mx-auto my-auto flex max-w-7xl flex-col gap-10 py-6 overflow-y-auto max-h-full px-2">
            {/* BLOC A CATEGORY BRANCH */}
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="text-xs tracking-wider rounded-full bg-[#5c242b] px-4 py-1.5 text-white font-semibold shadow-xs">
                  BLOC A
                </span>
                <span className="text-xs text-[#7a746b] font-medium">Unités résidentielles & commerciales</span>
              </div>

              {/* HIERARCHICAL BRANCHING CONNECTOR */}
              <div className="relative mt-6 pt-4">
                <svg className="pointer-events-none absolute -top-4 left-6 right-6 h-8 w-[calc(100%-3rem)] hidden md:block overflow-visible">
                  <path
                    d="M 10 0 L 10 16 L 98% 16"
                    fill="none"
                    stroke="#c5a880"
                    strokeOpacity="0.55"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <line x1="16%" y1="16" x2="16%" y2="30" stroke="#c5a880" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="50%" y1="16" x2="50%" y2="30" stroke="#c5a880" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="84%" y1="16" x2="84%" y2="30" stroke="#c5a880" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="4 4" />
                </svg>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  {blocAUnits.map((u) => {
                    const isSelected = selectedUnit.code === u.code;
                    const isCommercial = u.code === "A3";

                    return (
                      <div
                        key={u.id}
                        onClick={() => {
                          setSelectedUnit(u);
                          setDualMode(u.plans.length > 1);
                          resetView();
                          setViewMode("focus");
                        }}
                        className={cn(
                          "group relative cursor-pointer rounded-2xl border bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                          isSelected
                            ? "border-[#c5a880] ring-2 ring-[#c5a880]/50 shadow-[0_12px_36px_rgba(197,168,128,0.25)]"
                            : "border-[#e5dfd5] hover:border-[#c5a880]",
                        )}
                      >
                        <div className="flex items-center justify-between pb-2.5 border-b border-[#f0eae1]">
                          <div>
                            <span className="text-xs font-semibold text-[#1a1917] block font-serif">{u.name}</span>
                            <span className="text-[0.68rem] text-[#8a8278]">{u.code}</span>
                          </div>
                          <span className="text-xs text-[#8d6937] font-mono font-medium">{u.surface}</span>
                        </div>

                        {/* COMMERCIAL: 2 SUB-PLANS */}
                        {isCommercial ? (
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            {u.plans.map((p, pIdx) => (
                              <div key={p.title} className="flex flex-col gap-1">
                                <span className="text-[0.62rem] text-[#7a746b] font-medium">
                                  {pIdx === 0 ? "1" : "2"}
                                </span>
                                <div className="relative aspect-[16/11] overflow-hidden rounded-xl bg-[#FAF8F5] p-2 border border-[#e8e2d8]">
                                  <img
                                    src={p.src}
                                    alt={p.title}
                                    className="size-full object-contain transition-transform duration-500 group-hover:scale-105"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="relative mt-3 aspect-[16/11] overflow-hidden rounded-xl bg-[#FAF8F5] p-2 border border-[#e8e2d8]">
                            <img
                              src={u.plans[0]?.src}
                              alt={u.name}
                              className="size-full object-contain transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* BLOC B CATEGORY BRANCH */}
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="text-xs tracking-wider rounded-full bg-[#5c242b] px-4 py-1.5 text-white font-semibold shadow-xs">
                  BLOC B
                </span>
                <span className="text-xs text-[#7a746b] font-medium">Unités résidentielles</span>
              </div>

              <div className="relative mt-6 pt-4">
                <svg className="pointer-events-none absolute -top-4 left-6 right-6 h-8 w-[calc(100%-3rem)] hidden md:block overflow-visible">
                  <path
                    d="M 10 0 L 10 16 L 75% 16"
                    fill="none"
                    stroke="#c5a880"
                    strokeOpacity="0.55"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <line x1="25%" y1="16" x2="25%" y2="30" stroke="#c5a880" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="75%" y1="16" x2="75%" y2="30" stroke="#c5a880" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="4 4" />
                </svg>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 max-w-3xl">
                  {blocBUnits.map((u) => {
                    const isSelected = selectedUnit.code === u.code;

                    return (
                      <div
                        key={u.id}
                        onClick={() => {
                          setSelectedUnit(u);
                          setDualMode(false);
                          resetView();
                          setViewMode("focus");
                        }}
                        className={cn(
                          "group relative cursor-pointer rounded-2xl border bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                          isSelected
                            ? "border-[#c5a880] ring-2 ring-[#c5a880]/50 shadow-[0_12px_36px_rgba(197,168,128,0.25)]"
                            : "border-[#e5dfd5] hover:border-[#c5a880]",
                        )}
                      >
                        <div className="flex items-center justify-between pb-2.5 border-b border-[#f0eae1]">
                          <div>
                            <span className="text-xs font-semibold text-[#1a1917] block font-serif">{u.name}</span>
                            <span className="text-[0.68rem] text-[#8a8278]">{u.code}</span>
                          </div>
                          <span className="text-xs text-[#8d6937] font-mono font-medium">{u.surface}</span>
                        </div>

                        <div className="relative mt-3 aspect-[16/11] overflow-hidden rounded-xl bg-[#FAF8F5] p-2 border border-[#e8e2d8]">
                          <img
                            src={u.plans[0]?.src}
                            alt={u.name}
                            className="size-full object-contain transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM TOOLBAR — WHITE CREAMY LUXURY CONTROLS */}
      {viewMode === "focus" && (
        <footer
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          className="relative z-30 flex items-center justify-between border-t border-[#e5dfd5] bg-white/95 px-3 py-2 sm:px-6 sm:py-2.5 backdrop-blur-md shadow-sm"
        >
          {/* ZOOM INDICATOR */}
          <span className="text-xs text-[#7a746b]">
            Zoom : <strong className="text-[#8d6937] font-mono">{Math.round(scale * 100)}%</strong>
          </span>

          {/* CONTROLS PILL */}
          <div className="flex items-center gap-1 sm:gap-1.5 rounded-full border border-[#e0dad0] bg-[#f8f5f0] p-1 shadow-xs">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                zoomOut();
              }}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              title="Zoom arrière (-)"
              className="flex size-8 items-center justify-center rounded-full text-[#4a453e] hover:bg-white hover:text-[#1a1917] active:scale-90 transition-all"
            >
              <ZoomOut className="size-3.5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                resetView();
              }}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              title="Recentrer le plan (0)"
              className="px-2.5 py-1 text-xs font-medium text-[#4a453e] hover:bg-white hover:text-[#1a1917] active:scale-90 rounded-full transition-all flex items-center gap-1"
            >
              <RotateCcw className="size-3" />
              <span>Recentrer</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                zoomIn();
              }}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              title="Zoom avant (+)"
              className="flex size-8 items-center justify-center rounded-full text-[#4a453e] hover:bg-white hover:text-[#1a1917] active:scale-90 transition-all"
            >
              <ZoomIn className="size-3.5" />
            </button>

            <span className="h-4 w-px bg-[#ded7cc] mx-0.5" />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setRotation((r) => (r + 90) % 360);
              }}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              title="Pivoter 90° (R)"
              className="flex size-8 items-center justify-center rounded-full text-[#4a453e] hover:bg-white hover:text-[#1a1917] active:scale-90 transition-all"
            >
              <RotateCw className="size-3.5" />
            </button>
          </div>

          {/* RIGHT SWITCH TO MAP LINK */}
          <div className="hidden sm:block">
            {isCheraga && (
              <button
                type="button"
                onClick={() => setViewMode("map")}
                className="text-xs font-medium text-[#8d6937] hover:text-[#5c242b] transition-colors"
              >
                Carte du projet →
              </button>
            )}
          </div>
        </footer>
      )}
    </div>,
    document.body,
  );
}
