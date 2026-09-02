import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Block } from "@/data/projects";
import { Reveal } from "./Reveal";
import { SplitText } from "./Motion";
import { cn } from "@/lib/utils";

/** Two large architectural block cards — click opens the dedicated block page. */
export function BlockShowcase({ blocks, slug }: { blocks: Block[]; slug: string }) {
  return (
    <div>
      <Reveal className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div className="min-w-0">
          <p className="label-xs text-muted-foreground">Architecture</p>
          <SplitText
            as="h2"
            text="LES BLOCS"
            stagger={70}
            className="mt-4 font-display text-[2.6rem] leading-[0.95] md:text-[4.5rem]"
          />
        </div>
        <p className="max-w-sm text-muted-foreground">
          La résidence comprend deux blocs principaux. Ouvrez un bloc pour découvrir ses typologies,
          ses surfaces et sa visite immersive.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        {blocks.map((b, i) => {
          return (
            <Reveal key={b.id} delay={i * 110} className="h-full">
              <Link
                to="/blocs/$slug/$blockId"
                params={{ slug, blockId: b.id }}
                className="bento group relative flex h-full flex-col justify-between overflow-hidden border border-border bg-card p-8 text-foreground transition-all duration-700 hover:border-charcoal/50 hover:bg-charcoal hover:text-charcoal-foreground md:p-12"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-gold/25 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                />

                <div className="relative flex items-start justify-between gap-6">
                  <div>
                    <p className="label-xs text-muted-foreground transition-colors duration-700 group-hover:text-charcoal-foreground/50">
                      Bloc {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-5 font-display text-[3rem] leading-[0.9] text-foreground transition-colors duration-700 group-hover:text-charcoal-foreground md:text-[4.5rem]">
                      {b.name}
                    </h3>
                  </div>
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-gold text-gold-foreground transition-all duration-500 group-hover:rotate-45 group-hover:scale-110">
                    <ArrowUpRight className="size-5" />
                  </span>
                </div>

                <p className="relative mt-8 max-w-md leading-relaxed text-muted-foreground transition-colors duration-700 group-hover:text-charcoal-foreground/70">
                  {b.headline}
                </p>

                {/* stacked unit bars — the "floor plan" rhythm */}
                <div className="relative mt-10 grid gap-1.5">
                  {[0, 1, 2, 3].map((row) => (
                    <div key={row} className="grid grid-cols-6 gap-1.5">
                      {Array.from({ length: 6 }).map((_, c) => (
                        <span
                          key={c}
                          className="h-4 rounded-md bg-wine/[0.08] transition-all duration-700 group-hover:bg-charcoal-foreground/10"
                          style={{
                            transitionDelay: `${(row * 6 + c) * 18}ms`,
                            opacity: 0.55 + ((row + c) % 3) * 0.2,
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                <div className="relative mt-10 grid grid-cols-3 gap-4 border-t border-border pt-6 transition-colors duration-700 group-hover:border-charcoal-foreground/15">
                  {b.stats.map((s) => (
                    <div key={s.label}>
                      <p className="font-display text-3xl leading-none text-foreground transition-colors duration-700 group-hover:text-charcoal-foreground md:text-4xl">
                        {s.value}
                      </p>
                      <p className="label-xs mt-2 text-muted-foreground transition-colors duration-700 group-hover:text-charcoal-foreground/50">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>

                <span className="label-xs relative mt-8 inline-flex items-center gap-2 text-wine transition-colors duration-700 group-hover:text-gold">
                  Découvrir le bloc
                  <span className="block h-px w-8 origin-left bg-wine transition-all duration-500 group-hover:bg-gold group-hover:scale-x-[2.2]" />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
