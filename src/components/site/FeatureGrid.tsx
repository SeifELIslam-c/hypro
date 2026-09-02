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
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

const ICONS: { match: RegExp; icon: LucideIcon; note: string; detail: string }[] = [
  {
    match: /intelligent/i,
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
    note: "Espace enfants",
    detail: "Aire paysagée protégée, visible depuis les logements du bloc.",
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
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-4 md:gap-4", className)}>
      {features.map((f, i) => {
        const { icon: Icon, note, detail } = resolve(f);
        const dark = i === 0 || i === 5;
        return (
          <Reveal key={f + i} delay={i * 60} className="h-full">
            <article
              className={cn(
                "bento group relative flex h-full flex-col overflow-hidden border p-6 transition-all duration-500 hover:-translate-y-1 md:p-7",
                dark
                  ? "border-charcoal/40 bg-charcoal text-charcoal-foreground hover:shadow-[var(--shadow-lift)]"
                  : "border-border bg-card hover:border-wine/25 hover:shadow-[var(--shadow-soft)]",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none absolute -right-16 -top-16 size-44 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100",
                  dark ? "bg-gold/30" : "bg-wine/12",
                )}
              />

              <div className="relative flex items-start justify-between gap-4">
                <span
                  className={cn(
                    "grid size-14 shrink-0 place-items-center rounded-2xl border transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:scale-105",
                    dark
                      ? "border-gold/25 bg-gold/12 text-gold"
                      : "border-wine/12 bg-wine/[0.05] text-wine",
                  )}
                >
                  <Icon className="size-6" strokeWidth={1.5} />
                </span>
                <span
                  className={cn(
                    "label-xs inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
                    dark
                      ? "bg-charcoal-foreground/10 text-charcoal-foreground/70"
                      : "bg-sand text-wine",
                  )}
                >
                  <Check className="size-3" /> Inclus
                </span>
              </div>

              <h3 className="relative mt-7 text-[1.15rem] font-medium leading-snug tracking-[-0.01em]">
                {f}
              </h3>
              <p
                className={cn(
                  "relative mt-2.5 text-sm leading-relaxed",
                  dark ? "text-charcoal-foreground/60" : "text-muted-foreground",
                )}
              >
                {detail}
              </p>

              <div
                className={cn(
                  "relative mt-auto flex items-center gap-3 border-t pt-5",
                  dark ? "border-charcoal-foreground/12 mt-6" : "border-border mt-6",
                )}
              >
                <span
                  className={cn(
                    "block h-px w-5 origin-left transition-transform duration-500 group-hover:scale-x-[2.4]",
                    dark ? "bg-gold" : "bg-wine/40",
                  )}
                />
                <p
                  className={cn(
                    "text-[0.66rem] uppercase tracking-[0.22em]",
                    dark ? "text-charcoal-foreground/55" : "text-muted-foreground",
                  )}
                >
                  {note}
                </p>
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
