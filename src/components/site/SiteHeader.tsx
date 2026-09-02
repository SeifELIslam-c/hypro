import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

const links = [
  { to: "/", label: "Accueil", mobile: "Accueil" },
  { to: "/projets", label: "Projets", mobile: "Nos projets" },
  { to: "/a-propos", label: "À propos", mobile: "À propos de nous" },
  { to: "/contact", label: "Contact", mobile: "Contact" },
] as const;

export function SiteHeader({ transparent = false }: { transparent?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const hideLogo = transparent && !scrolled;
  const solid = scrolled || !transparent;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          solid
            ? "border-b border-border/70 bg-background/80 backdrop-blur-xl"
            : "border-b border-transparent",
        )}
      >
        <div className="mx-auto grid max-w-[1600px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 md:px-10 lg:grid-cols-[1fr_auto_1fr]">
          <div className="flex min-w-0 items-center">
            <div
              className={cn(
                "transition-all duration-500",
                hideLogo ? "pointer-events-none opacity-0" : "opacity-100",
              )}
            >
              <Logo tone={solid ? "wine" : "light"} />
            </div>
          </div>

          <nav className="hidden justify-center gap-9 lg:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                className={cn(
                  "label-xs relative py-1 transition-colors",
                  solid ? "text-foreground/70 hover:text-wine" : "text-charcoal-foreground/80 hover:text-charcoal-foreground",
                )}
                activeProps={{ className: solid ? "text-wine" : "text-charcoal-foreground" }}
              >
                {l.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold transition-all duration-500 data-[status=active]:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-3">
            <Link
              to="/contact"
              className={cn(
                "label-xs hidden items-center gap-2 rounded-full px-5 py-3 transition-all duration-300 lg:inline-flex",
                solid
                  ? "bg-wine text-wine-foreground hover:bg-charcoal"
                  : "bg-charcoal-foreground/12 text-charcoal-foreground backdrop-blur-md hover:bg-charcoal-foreground/25",
              )}
            >
              Parlons de votre projet
              <ArrowUpRight className="size-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Ouvrir le menu"
              className={cn(
                "grid size-11 shrink-0 place-items-center rounded-full border transition-colors lg:hidden",
                solid
                  ? "border-border bg-card text-foreground"
                  : "border-charcoal-foreground/30 bg-charcoal-foreground/10 text-charcoal-foreground backdrop-blur-md",
              )}
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-[60] flex flex-col bg-wine text-wine-foreground transition-all duration-500 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <span className="font-display text-2xl tracking-[0.14em]">HYPRO</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
            className="grid size-11 place-items-center rounded-full border border-wine-foreground/25 bg-wine-foreground/10"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col justify-center gap-2 px-6 pb-16">
          {links.map((l, i) => (
            <Link
              key={l.to}
              to={l.to}
              className="group flex items-baseline justify-between border-b border-wine-foreground/15 py-5"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <span className="font-display text-[2.6rem] leading-none">{l.mobile}</span>
              <span className="label-xs text-wine-foreground/50">0{i + 1}</span>
            </Link>
          ))}
        </nav>

        <div className="px-6 pb-10 text-sm text-wine-foreground/70">
          <p>HYPROMOTION16@GMAIL.COM</p>
          <p className="mt-1">+213 556 331 688</p>
        </div>
      </div>
    </>
  );
}
