import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { BrandMark } from "./BrandMark";

/**
 * HYPRO wordmark lockup — architectural glyph + letter-spaced serif wordmark
 * with a gold rule that draws in on hover.
 */
export function Logo({
  className,
  tone = "wine",
  compact = false,
}: {
  className?: string;
  tone?: "wine" | "light";
  compact?: boolean;
}) {
  const light = tone === "light";

  return (
    <Link
      to="/"
      aria-label="HYPRO — accueil"
      className={cn("group inline-flex items-center gap-3", className)}
    >
      <span className="relative grid shrink-0 place-items-center">
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 rounded-full transition-all duration-700 group-hover:scale-110",
            light ? "bg-charcoal-foreground/10" : "bg-wine/[0.07]",
          )}
        />
        <BrandMark
          ring={false}
          className="relative size-9 md:size-10"
          imgClassName="w-[86%] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-rotate-6 group-hover:scale-110"
        />
      </span>

      <span className="flex min-w-0 flex-col leading-none">
        <span
          className={cn(
            "font-display text-[1.6rem] leading-none tracking-[0.2em] transition-[letter-spacing] duration-700 group-hover:tracking-[0.28em] md:text-[1.75rem]",
            light ? "text-charcoal-foreground" : "text-wine",
          )}
        >
          HYPRO
        </span>
        {!compact && (
          <span className="mt-1.5 hidden items-center gap-2 sm:flex">
            <span
              className={cn(
                "block h-px w-4 origin-left bg-gold transition-transform duration-700 group-hover:scale-x-[2.2]",
              )}
            />
            <span
              className={cn(
                "text-[0.5rem] uppercase tracking-[0.36em]",
                light ? "text-charcoal-foreground/55" : "text-muted-foreground",
              )}
            >
              Promotion immobilière
            </span>
          </span>
        )}
      </span>
    </Link>
  );
}
