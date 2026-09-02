import { Ruler } from "lucide-react";
import type { SurfaceRow } from "@/data/projects";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

/**
 * Surfaces board — an architectural ledger: numbered rows with a proportional
 * bar for each space, plus a headline total. Single readable column on mobile.
 */
export function SurfaceBoard({
  surfaces,
  totals,
  className,
}: {
  surfaces: SurfaceRow[];
  totals: SurfaceRow[];
  className?: string;
}) {
  const nums = surfaces.map((s) => parseFloat(s.value.replace(",", ".")) || 0);
  const max = Math.max(...nums, 1);
  const headline = totals[totals.length - 1];
  const rest = totals.slice(0, -1);

  return (
    <div className={cn("grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]", className)}>
      <Reveal className="bento border border-border bg-card p-5 md:p-8">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-wine/[0.07] text-wine">
            <Ruler className="size-4" />
          </span>
          <p className="label-xs text-muted-foreground">Répartition des espaces</p>
        </div>

        <ul className="mt-6 divide-y divide-border">
          {surfaces.map((s, i) => (
            <li key={s.label + i} className="group py-3.5">
              <div className="flex items-baseline justify-between gap-4">
                <span className="flex min-w-0 items-baseline gap-3">
                  <span className="shrink-0 font-display text-sm text-wine/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate text-base">{s.label}</span>
                </span>
                <span className="shrink-0 font-display text-xl md:text-2xl">{s.value}</span>
              </div>
              <span className="mt-2.5 block h-[3px] w-full overflow-hidden rounded-full bg-sand">
                <span
                  className="block h-full rounded-full bg-gradient-to-r from-wine to-gold transition-[width] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ width: `${Math.max(8, ((nums[i] ?? 0) / max) * 100)}%` }}
                />
              </span>
            </li>
          ))}
        </ul>
      </Reveal>

      <div className="grid content-start gap-4">
        <Reveal
          delay={90}
          className="bento relative overflow-hidden border border-border bg-wine p-6 text-wine-foreground md:p-9"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-gold/20 blur-3xl"
          />
          <p className="label-xs relative text-wine-foreground/60">
            {headline?.label ?? "Surface totale"}
          </p>
          <p className="relative mt-5 font-display text-[3rem] leading-[0.9] md:text-[5rem]">
            {headline?.value}
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {rest.map((t, i) => (
            <Reveal
              key={t.label + i}
              delay={140 + i * 80}
              className="bento hover-lift border border-border bg-sand p-6"
            >
              <p className="label-xs text-muted-foreground">{t.label}</p>
              <p className="mt-4 font-display text-3xl text-wine md:text-4xl">{t.value}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
