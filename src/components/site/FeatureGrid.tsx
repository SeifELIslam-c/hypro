import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  BedDouble,
  Car,
  Cctv,
  CookingPot,
  Flame,
  House,
  Snowflake,
  TreePine,
  Sparkles,
  Check,
  X,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

const CATEGORIES: { title: string; match: RegExp }[] = [
  { title: "Confort & Climatisation", match: /climatisation|chauffage/i },
  { title: "Domotique & Sécurité", match: /intelligent|smart|caméra|surveillance/i },
  { title: "Agencement & Finitions", match: /cuisine|bain|chambre/i },
  { title: "Stationnement & Espaces Communs", match: /parking|jeux/i },
];

const ICONS: { match: RegExp; icon: LucideIcon; note: string; detail: string }[] = [
  {
    match: /intelligent|smart/i,
    icon: House,
    note: "Domotique intégrée",
    detail: "Éclairage, volets et accès pilotés depuis votre téléphone.",
  },
  {
    match: /climatisation/i,
    icon: Snowflake,
    note: "Confort d'été",
    detail: "Unités centralisées et gaines encastrées dans chaque pièce de vie.",
  },
  {
    match: /chauffage/i,
    icon: Flame,
    note: "Confort d'hiver",
    detail: "Chaudière collective, radiateurs dimensionnés pièce par pièce.",
  },
  {
    match: /cuisine|bain/i,
    icon: CookingPot,
    note: "Livré équipé",
    detail: "Plans de travail, meubles et sanitaires posés avant remise des clés.",
  },
  {
    match: /caméra|surveillance/i,
    icon: Cctv,
    note: "Sécurité 24/7",
    detail: "Vidéosurveillance des accès, halls et parkings, enregistrement continu.",
  },
  {
    match: /parking/i,
    icon: Car,
    note: "Accès privatif",
    detail: "Places couvertes en sous-sol avec portail commandé à distance.",
  },
  {
    match: /jeux/i,
    icon: TreePine,
    note: "Aire de jeux",
    detail: "Espace sécurisé et paysagé spécialement aménagé pour les jeux d'enfants.",
  },
  {
    match: /chambre/i,
    icon: BedDouble,
    note: "Volumes généreux",
    detail: "Chambres de 11 à 18 m², rangements et double exposition.",
  },
];

function resolve(label: string) {
  return (
    ICONS.find((i) => i.match.test(label)) ?? {
      icon: Sparkles,
      note: "Signature HYPRO",
      detail: "Un standard appliqué à l'ensemble de nos résidences.",
    }
  );
}

export function FeatureGrid({ features, className }: { features: string[]; className?: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  // Group features for the Airbnb modal
  const groupedCategories = useMemo(() => {
    const groups = CATEGORIES.map((c) => ({
      title: c.title,
      items: features.filter((f) => c.match.test(f)),
    })).filter((g) => g.items.length > 0);

    const matched = new Set(groups.flatMap((g) => g.items));
    const others = features.filter((f) => !matched.has(f));
    if (others.length > 0) {
      groups.push({ title: "Autres prestations", items: others });
    }
    return groups;
  }, [features]);

  // Mobile list: show top 6 items (matching Airbnb's layout)
  const mobileFeatures = features.slice(0, 6);

  return (
    <>
      {/* ========================================================================= */}
      {/* AIRBNB-STYLE EQUIPMENT LIST (RESPONSIVE: 1 COL MOBILE, 2 COLS DESKTOP)    */}
      {/* ========================================================================= */}
      <div className={cn("space-y-6", className)}>
        {/* CLEAN RESPONSIVE EQUIPMENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-24 gap-y-4 sm:gap-y-5 py-1">
          {mobileFeatures.map((f, i) => {
            const { icon: Icon, detail } = resolve(f);
            return (
              <div key={f + i} className="flex items-center gap-4">
                <Icon className="size-6 text-foreground/85 shrink-0" strokeWidth={1.5} />
                <div className="min-w-0 flex-1">
                  <p className="text-[0.98rem] md:text-base font-medium text-foreground leading-snug">
                    {f}
                  </p>
                  {detail && (
                    <p className="text-xs md:text-sm text-muted-foreground mt-0.5 line-clamp-1 leading-normal">
                      {detail}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* AIRBNB ACTION BUTTON */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto rounded-xl border border-foreground/30 bg-card py-3.5 px-7 text-sm font-semibold text-foreground text-center transition-all duration-300 active:scale-[0.98] hover:border-foreground hover:bg-sand/30 shadow-sm"
          >
            Afficher les {features.length} caractéristiques
          </button>
        </div>

        {/* AIRBNB SECTION DIVIDER */}
        <div className="pt-4 border-b border-border/80" />
      </div>

      {/* ========================================================================= */}
      {/* 3. AIRBNB-STYLE AMENITIES MODAL (FULL CATEGORIZED DETAILS)                 */}
      {/* ========================================================================= */}
      {mounted && isModalOpen && createPortal(
        <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center bg-charcoal/70 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setIsModalOpen(false)}
            aria-hidden="true"
          />

          <div className="relative z-10 w-full max-h-[88vh] sm:max-h-[82vh] rounded-t-[1.8rem] sm:rounded-2xl sm:max-w-2xl bg-card border border-border flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Mobile Drag Indicator */}
            <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-border sm:hidden" />

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/80 px-6 py-4 shrink-0">
              <div>
                <h3 className="font-display text-xl sm:text-2xl text-foreground font-normal">
                  Ce que propose la résidence
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {features.length} prestations et équipements livrés de série
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Fermer"
                className="grid size-9 place-items-center rounded-full bg-sand/60 text-foreground hover:bg-sand transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body: Categorized Amenities */}
            <div className="flex-1 overflow-y-auto p-6 space-y-7">
              {groupedCategories.map((group) => (
                <div key={group.title} className="space-y-3">
                  <h4 className="label-xs text-wine font-semibold tracking-wider uppercase">
                    {group.title}
                  </h4>
                  <div className="divide-y divide-border/60">
                    {group.items.map((item) => {
                      const { icon: Icon, note, detail } = resolve(item);
                      return (
                        <div key={item} className="flex items-start gap-4 py-3.5">
                          <div className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-sand/40 text-wine border border-border/60">
                            <Icon className="size-5" strokeWidth={1.5} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline justify-between gap-2">
                              <p className="text-[0.98rem] font-medium text-foreground leading-snug">
                                {item}
                              </p>
                              <span className="label-xs text-[0.62rem] text-gold font-mono uppercase tracking-wider shrink-0">
                                {note}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                              {detail}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-border/80 px-6 py-3.5 bg-card/80 backdrop-blur-sm flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl bg-charcoal text-charcoal-foreground px-6 py-2.5 text-xs font-semibold hover:bg-gold hover:text-charcoal transition-colors shadow-sm"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
