import { useRef, useState, useCallback } from "react";
import { Compass, Video } from "lucide-react";
import type { UnitType } from "@/data/projects";
import { DirectVideoPreview } from "./DirectVideoPreview";
import { ArchitecturalPlanModal } from "./ArchitecturalPlanModal";
import { InteractivePlanStage } from "./InteractivePlanStage";
import { cn } from "@/lib/utils";

interface UnitTypeCardProps {
  unit: UnitType;
  blockName: string;
  projectVrUrl?: string;
  index: number;
  isPlaying?: boolean;
  projectSlug?: string;
}

export function UnitTypeCard({
  unit,
  blockName,
  projectVrUrl,
  index,
  isPlaying = false,
  projectSlug = "residence-hypro-cheraga",
}: UnitTypeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [activePlanIndex, setActivePlanIndex] = useState(0);
  const [isPlanZoomed, setIsPlanZoomed] = useState(false);
  const [hoveredSurface, setHoveredSurface] = useState<string | null>(null);

  // Mouse spotlight and subtle 3D tilt
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0, opacity: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setSpotlightPos({ x, y, opacity: 1 });

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = -((y - centerY) / centerY) * 1.8;
    const rotateY = ((x - centerX) / centerX) * 1.8;
    setTilt({ x: rotateX, y: rotateY });
  }, []);

  const handlePointerLeave = useCallback(() => {
    setSpotlightPos((prev) => ({ ...prev, opacity: 0 }));
    setTilt({ x: 0, y: 0 });
    setHoveredSurface(null);
  }, []);

  const plans = unit.plans && unit.plans.length > 0 ? unit.plans : [unit.poster];
  const currentPlan = plans[activePlanIndex] || unit.poster;

  return (
    <>
      <article
        ref={cardRef}
        data-unit-code={unit.code}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        className={cn(
          "bento group relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-border bg-card p-4 sm:p-6 lg:p-7 xl:p-8 transition-all duration-500 hover:border-gold/40 hover:shadow-[var(--shadow-lift)]",
        )}
      >
        {/* DYNAMIC MOUSE-FOLLOWING SPOTLIGHT AURA */}
        <div
          className="pointer-events-none absolute -inset-px rounded-[1.5rem] sm:rounded-[2rem] transition-opacity duration-500"
          style={{
            opacity: spotlightPos.opacity,
            background: `radial-gradient(650px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(212, 175, 55, 0.12), transparent 50%)`,
          }}
        />

        {/* ========================================================================= */}
        {/* DESKTOP VIEW: VIDEO CENTERED IN MIDDLE-LEFT, PLAN ON RIGHT, LESS TYPINGS   */}
        {/* ========================================================================= */}
        <div className="relative z-10 hidden lg:grid gap-8 xl:gap-10 lg:grid-cols-[1.1fr_1fr] xl:grid-cols-[1.15fr_1fr] lg:items-center">
          {/* LEFT: MEDIA STAGE (VIDEO IN THE MIDDLE-LEFT) */}
          <div className="w-full">
            {(unit.youtubeId || unit.videoUrl) ? (
              <div className="space-y-3">
                <DirectVideoPreview
                  youtubeId={unit.youtubeId}
                  videoUrl={unit.videoUrl}
                  poster={unit.poster}
                  title={`${unit.name} — ${blockName}`}
                  aspectRatio="aspect-[16/10]"
                  isPlaying={isPlaying}
                  className="shadow-lg ring-1 ring-border/80"
                />

                {/* GALLERY THUMBNAILS IF AVAILABLE */}
                {unit.code !== "A3" && unit.images && unit.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pt-0.5">
                    {unit.images.map((img, imgIdx) => (
                      <button
                        key={imgIdx}
                        type="button"
                        onClick={() => {
                          setActivePlanIndex(imgIdx);
                          setIsPlanZoomed(true);
                        }}
                        className="group/thumb relative aspect-[16/10] w-20 shrink-0 overflow-hidden rounded-lg border border-border/80 bg-card shadow-2xs transition-all hover:scale-105 hover:border-gold/50"
                      >
                        <img
                          src={img}
                          alt={`${unit.name} vue ${imgIdx + 1}`}
                          className="size-full object-cover transition-transform duration-500 group-hover/thumb:scale-110"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* UNIT WITHOUT VIDEO: SHOWS PLAN DIRECTLY IN THE MIDDLE-LEFT */
              <div className="w-full">
                <InteractivePlanStage
                  src={currentPlan}
                  alt={`Plan 3D — ${unit.name}`}
                  unitCode={unit.code}
                  unitName={unit.name}
                  plans={
                    plans.length > 1
                      ? plans.map((p, idx) => ({
                          title: p,
                          src: p,
                          level: unit.code === "A3" ? (idx === 0 ? "1" : "2") : `Niveau ${idx + 1}`,
                        }))
                      : undefined
                  }
                  activePlanIndex={activePlanIndex}
                  onPlanIndexChange={setActivePlanIndex}
                  onOpenFullscreen={() => setIsPlanZoomed(true)}
                  aspectRatio="aspect-[16/10]"
                />
              </div>
            )}
          </div>

          {/* RIGHT: ESSENTIALS (TITLE, PICTURE/PLAN ABOVE DESCRIPTION, SURFACES & METRICS) */}
          <div className="flex flex-col space-y-4 w-full">
            {/* CODE, TAG & NAME */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="label-xs rounded-full bg-charcoal px-2.5 py-0.5 text-charcoal-foreground font-semibold text-[0.68rem]">
                  {unit.code}
                </span>
                <span className="label-xs text-wine font-medium tracking-wider text-[0.7rem] uppercase">
                  {unit.tag}
                </span>
              </div>
              <h3 className="font-display text-2xl xl:text-[1.85rem] leading-tight text-foreground font-normal">
                {unit.name}
              </h3>
            </div>

            {/* PICTURE / PLAN ABOVE DESCRIPTION (FOR UNITS WITH VIDEO) */}
            {(unit.youtubeId || unit.videoUrl) && (
              <InteractivePlanStage
                src={currentPlan}
                alt={`Plan 3D — ${unit.name}`}
                unitCode={unit.code}
                unitName={unit.name}
                plans={
                  plans.length > 1
                    ? plans.map((p, idx) => ({
                        title: p,
                        src: p,
                        level: unit.code === "A3" ? (idx === 0 ? "1" : "2") : `Niveau ${idx + 1}`,
                      }))
                    : undefined
                }
                activePlanIndex={activePlanIndex}
                onPlanIndexChange={setActivePlanIndex}
                onOpenFullscreen={() => setIsPlanZoomed(true)}
                aspectRatio="aspect-[16/9]"
                className="shadow-sm"
              />
            )}

            {/* DESCRIPTION */}
            {unit.desc && (
              <p className="text-xs sm:text-[0.84rem] text-muted-foreground leading-relaxed">
                {unit.desc}
              </p>
            )}

            {/* DETAILED ROOM SURFACES */}
            {unit.surfaces && unit.surfaces.length > 0 && (
              <div className="rounded-xl border border-border/80 bg-sand/30 p-3.5 space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-border/50">
                  <span className="label-xs text-[0.65rem] text-wine font-semibold uppercase tracking-wider">
                    Surfaces détaillées
                  </span>
                  <span className="text-[0.62rem] text-muted-foreground">
                    {unit.surfaces.length} espaces
                  </span>
                </div>
                <ul className="grid grid-cols-2 gap-1.5">
                  {unit.surfaces.map((s, sIdx) => (
                    <li
                      key={s.label + sIdx}
                      className="flex items-baseline justify-between gap-1.5 rounded-lg bg-card/85 px-2.5 py-1.5 border border-border/40 text-xs shadow-2xs transition-all hover:bg-card hover:border-gold/40"
                    >
                      <span className="truncate text-[0.7rem] text-muted-foreground">{s.label}</span>
                      <span className="shrink-0 font-display text-[0.72rem] font-semibold text-foreground">
                        {s.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* TOTALS & SUMMARY */}
            {unit.totals && (
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                {unit.totals.map((tot, tIdx) => {
                  const isLast = tIdx === unit.totals!.length - 1;
                  return (
                    <div
                      key={tot.label}
                      className={cn(
                        "rounded-xl px-3.5 py-1.5 flex items-baseline gap-2 transition-all",
                        isLast
                          ? "bg-wine text-wine-foreground font-semibold shadow-xs"
                          : "bg-sand/40 border border-border/80 text-foreground",
                      )}
                    >
                      <span className="label-xs text-[0.62rem] uppercase tracking-wider opacity-80">{tot.label}</span>
                      <span className="font-display text-sm font-semibold">{tot.value}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE VIEW (IMMERSIVE EXPERIENCE: VIDEO FIRST, PLAN, DESC & SURFACES)    */}
        {/* ========================================================================= */}
        <div className="relative z-10 flex flex-col gap-6 lg:hidden">
          {/* HEADER: CODE, TAG & TITLE */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="label-xs rounded-full bg-wine px-3 py-1 text-wine-foreground font-medium shadow-sm">
                {unit.code}
              </span>
              <span className="label-xs text-muted-foreground uppercase tracking-wider">
                {unit.tag}
              </span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl text-foreground font-normal leading-tight">
              {unit.name}
            </h3>
          </div>

          {/* 1. VIDEO (UP / FIRST) */}
          {(unit.youtubeId || unit.videoUrl) && (
            <div className="overflow-hidden rounded-2xl border border-border bg-charcoal shadow-sm transition-shadow duration-500">
              <DirectVideoPreview
                youtubeId={unit.youtubeId}
                videoUrl={unit.videoUrl}
                poster={unit.poster}
                title={`${unit.name} — ${blockName}`}
                aspectRatio="aspect-[16/10]"
                isPlaying={isPlaying}
              />
            </div>
          )}

          {/* 2. PLAN (SECOND / DIRECTLY UNDER VIDEO — INTERACTIVE DIRECT PAN & ZOOM) */}
          <div className="space-y-2">
            <InteractivePlanStage
              src={currentPlan}
              alt={`Plan 3D — ${unit.name}`}
              unitCode={unit.code}
              unitName={unit.name}
              plans={
                plans.length > 1
                  ? plans.map((p, idx) => ({
                      title: p,
                      src: p,
                      level: unit.code === "A3" ? (idx === 0 ? "1" : "2") : `Plan ${idx + 1}`,
                    }))
                  : undefined
              }
              activePlanIndex={activePlanIndex}
              onPlanIndexChange={setActivePlanIndex}
              onOpenFullscreen={() => setIsPlanZoomed(true)}
              aspectRatio="aspect-[16/10]"
            />
          </div>

          {/* 3. OPTIONAL GALLERY REEL (IF IMAGES AVAILABLE) */}
          {unit.code !== "A3" && unit.images && unit.images.length > 1 && (
            <div className="no-scrollbar flex gap-2.5 overflow-x-auto pb-1">
              {unit.images.map((img, imgIdx) => (
                <div
                  key={imgIdx}
                  className="relative aspect-[16/10] w-[65%] shrink-0 overflow-hidden rounded-xl border border-border bg-card shadow-sm"
                >
                  <img
                    src={img}
                    alt={`${unit.name} aperçu ${imgIdx + 1}`}
                    className="size-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}

          {/* 4. DESCRIPTION */}
          {unit.desc && (
            <p className="text-sm text-muted-foreground leading-relaxed px-0.5">
              {unit.desc}
            </p>
          )}

          {/* 5. SURFACES & TOTAL METRICS */}
          {unit.surfaces && (
            <div className="rounded-2xl border border-border bg-card/60 p-4 space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-border/60">
                <span className="label-xs text-[0.65rem] text-wine font-semibold uppercase tracking-wider">
                  Surfaces détaillées
                </span>
                <span className="text-[0.65rem] text-muted-foreground">
                  {unit.surfaces.length} espaces
                </span>
              </div>
              <ul className="grid grid-cols-2 gap-2">
                {unit.surfaces.map((s, sIdx) => (
                  <li
                    key={s.label + sIdx}
                    className="flex items-baseline justify-between gap-2 rounded-xl bg-sand/25 px-3 py-2 border border-border/50"
                  >
                    <span className="truncate text-xs text-muted-foreground">{s.label}</span>
                    <span className="shrink-0 font-display text-xs font-semibold text-foreground">
                      {s.value}
                    </span>
                  </li>
                ))}
              </ul>

              {unit.totals && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                  {unit.totals.map((tot, tIdx) => {
                    const isLast = tIdx === unit.totals!.length - 1;
                    return (
                      <div
                        key={tot.label}
                        className={cn(
                          "rounded-xl px-3.5 py-2 flex-1 min-w-[120px]",
                          isLast
                            ? "bg-wine text-wine-foreground font-semibold shadow-sm"
                            : "bg-sand/30 border border-border text-foreground",
                        )}
                      >
                        <span className="label-xs text-[0.62rem] block opacity-80">{tot.label}</span>
                        <span className="font-display text-base sm:text-lg leading-none mt-0.5 block">{tot.value}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </article>

      {/* PROFESSIONAL ARCHITECTURAL PLAN VIEWER WITH NATIVE WHOLE-SCREEN FULLSCREEN & CAD TOOLS */}
      <ArchitecturalPlanModal
        isOpen={isPlanZoomed}
        onClose={() => setIsPlanZoomed(false)}
        isCheraga={projectSlug.includes("cheraga")}
        currentPlanSrc={currentPlan}
        currentPlanName={unit.name}
        currentPlanCode={unit.code}
        currentPlanCategory={blockName}
        currentPlanSurface={unit.totals?.find((t) => t.label.toLowerCase().includes("totale"))?.value}
      />
    </>
  );
}
