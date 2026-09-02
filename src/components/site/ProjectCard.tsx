import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/data/projects";

export function ProjectCard({
  project,
  className,
  size = "sm",
}: {
  project: Project;
  className?: string;
  size?: "lg" | "sm";
}) {
  return (
    <Link
      to="/projets/$slug"
      params={{ slug: project.slug }}
      className={cn(
        "bento group block border border-border bg-card transition-shadow duration-500 hover:shadow-[var(--shadow-lift)]",
        className,
      )}
    >
      <div
        className={cn(
          "relative h-full w-full overflow-hidden",
          size === "lg" ? "min-h-[340px] md:min-h-[520px]" : "min-h-[280px] md:min-h-[300px]",
        )}
      >
        <img
          src={project.hero}
          alt={`${project.name} — ${project.location}`}
          loading="lazy"
          className="size-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />

        <span className="label-xs absolute left-5 top-5 rounded-full bg-charcoal-foreground/15 px-3 py-1.5 text-charcoal-foreground backdrop-blur-md">
          {project.index}
        </span>
        {project.completion !== undefined && (
          <span className="label-xs absolute right-5 top-5 rounded-full bg-gold px-3 py-1.5 text-gold-foreground">
            {project.completion}%
          </span>
        )}

        <div className="absolute inset-x-5 bottom-5 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0 text-charcoal-foreground transition-transform duration-500 group-hover:-translate-y-1">
            <h3
              className={cn(
                "font-display leading-none",
                size === "lg" ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl",
              )}
            >
              {project.shortName}
            </h3>
            <p className="label-xs mt-3 text-charcoal-foreground/70">{project.location}</p>

          </div>
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-charcoal-foreground text-charcoal transition-all duration-500 group-hover:bg-gold group-hover:text-gold-foreground">
            <ArrowUpRight className="size-5 transition-transform duration-500 group-hover:rotate-45" />
          </span>
        </div>
      </div>
    </Link>
  );
}
