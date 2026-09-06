import { useState, useCallback, useEffect, useRef } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowDown, ArrowUpRight, Layers, Sparkles, Building2 } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ContactSection } from "@/components/site/ContactSection";
import { Reveal, BlurReveal } from "@/components/site/Reveal";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { SplitText, ScrollText, Parallax } from "@/components/site/Motion";
import { UnitTypeCard } from "@/components/site/UnitTypeCard";
import { getProject, type Project, type Block } from "@/data/projects";
import { cn } from "@/lib/utils";

const SITE_URL = "https://www.hypro-dz.com";
const OG_IMAGE = `${SITE_URL}/og-cover.jpg`;

export const Route = createFileRoute("/blocs/$slug/$blockId")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    const block = project?.blocks?.find((b) => b.id === params.blockId);
    if (!project || !block) throw notFound();
    return { project, block };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          {
            title: `${loaderData.block.name} — ${loaderData.project.name} | Appartements HYPRO ${loaderData.project.location}`,
          },
          {
            name: "description",
            content: `${loaderData.block.name} de la ${loaderData.project.name} à ${loaderData.project.location} : ${loaderData.block.desc}. Découvrez les plans, surfaces et équipements de ce bloc résidentiel HYPRO.`,
          },
          {
            name: "keywords",
            content: `${loaderData.block.name}, ${loaderData.project.name}, appartement ${loaderData.project.location}, bloc résidentiel Algérie, HYPRO ${loaderData.project.location}, type appartement Algérie, F2 F3 F4 ${loaderData.project.location}, plan appartement neuf Algérie`,
          },
          /* Open Graph */
          { property: "og:type", content: "article" },
          { property: "og:url", content: `${SITE_URL}/blocs/${loaderData.project.slug}/${loaderData.block.id}` },
          {
            property: "og:title",
            content: `${loaderData.block.name} — ${loaderData.project.name} | HYPRO`,
          },
          {
            property: "og:description",
            content: loaderData.block.headline ?? `${loaderData.block.name} de la ${loaderData.project.name} à ${loaderData.project.location} — résidence HYPRO.`,
          },
          { property: "og:image", content: OG_IMAGE },
          { property: "og:image:width", content: "1200" },
          { property: "og:image:height", content: "630" },
          { property: "og:image:alt", content: `${loaderData.block.name} — ${loaderData.project.name}` },
          /* Twitter / X */
          { name: "twitter:card", content: "summary_large_image" },
          {
            name: "twitter:title",
            content: `${loaderData.block.name} — ${loaderData.project.name} | HYPRO`,
          },
          {
            name: "twitter:description",
            content: `Découvrez ${loaderData.block.name} dans la ${loaderData.project.name} à ${loaderData.project.location}. Plans, surfaces et visite VR 360°.`,
          },
          { name: "twitter:image", content: OG_IMAGE },
          /* JSON-LD Apartment */
          {
            "script:ld+json": JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Apartment",
              name: `${loaderData.block.name} — ${loaderData.project.name}`,
              url: `${SITE_URL}/blocs/${loaderData.project.slug}/${loaderData.block.id}`,
              description: `${loaderData.block.desc}`,
              containedInPlace: {
                "@type": "Residence",
                name: loaderData.project.name,
                address: {
                  "@type": "PostalAddress",
                  addressLocality: loaderData.project.location,
                  addressCountry: "DZ",
                },
              },
              brand: { "@type": "Brand", name: "HYPRO", url: SITE_URL },
            }),
          } as Record<string, string>,
        ]
      : [],
  }),
  component: BlockPage,
});

function BlockPage() {
  const { project, block } = Route.useLoaderData() as { project: Project; block: Block };
  const siblings = (project.blocks ?? []).filter((b) => b.id !== block.id);

  const [heroIndex, setHeroIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const heroImages =
    block.heroImages && block.heroImages.length > 0
      ? block.heroImages
      : block.heroImage
        ? [{ src: block.heroImage, title: "Vue Principale" }]
        : [{ src: project.hero, title: "Vue Principale" }];

  const [activePlayingCode, setActivePlayingCode] = useState<string | null>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Automatic slow cinematic cycling between the hero images
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Video playback synchronization:
  // Stops video when user scrolls, and plays ONLY when user stops scrolling on a visible unit
  useEffect(() => {
    const checkVisibleUnit = () => {
      const elements = document.querySelectorAll<HTMLElement>("[data-unit-code]");
      if (!elements.length) return;

      const vh = window.innerHeight;
      const centerY = vh / 2;
      let closestCode: string | null = null;
      let minDistance = Infinity;

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // Element is visible within viewport range
        if (rect.bottom > 120 && rect.top < vh - 120) {
          const elementCenter = (rect.top + rect.bottom) / 2;
          const dist = Math.abs(elementCenter - centerY);
          if (dist < minDistance) {
            minDistance = dist;
            closestCode = el.getAttribute("data-unit-code");
          }
        }
      });

      setActivePlayingCode(closestCode);
    };

    const onScroll = () => {
      // Immediately stop video playback while scrolling
      setActivePlayingCode(null);

      // When the user stops scrolling (debounced), find the unit in view and play
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        checkVisibleUnit();
      }, 420);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    const initialTimer = setTimeout(checkVisibleUnit, 900);

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      clearTimeout(initialTimer);
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (typeof window === "undefined") return;
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
    const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
    setMousePos({ x, y });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <SiteHeader transparent />

      {/* ULTRA-MINIMALIST FULL-BLEED PARALLAX HERO WITH DYNAMIC MOTION */}
      <section
        onMouseMove={handleMouseMove}
        className="relative h-[100svh] min-h-[640px] overflow-hidden bg-charcoal"
      >
        {/* PARALLAX BACKGROUND WITH SMOOTH MOTION & IMAGE CROSS-FADE */}
        <Parallax speed={80} scale className="absolute inset-0 size-full">
          <div
            className="size-full will-change-transform transition-transform duration-700 ease-out"
            style={{
              transform: `scale(1.06) translate3d(${mousePos.x * -12}px, ${mousePos.y * -12}px, 0)`,
            }}
          >
            {heroImages.map((img, idx) => (
              <img
                key={img.src}
                src={img.src}
                alt={`${block.name} — Perspective ${idx + 1}`}
                fetchPriority={idx === 0 ? "high" : "low"}
                decoding="async"
                className={cn(
                  "absolute inset-0 size-full object-cover transition-all duration-[1400ms] ease-out will-change-transform",
                  heroIndex === idx
                    ? "opacity-100 scale-105"
                    : "opacity-0 scale-100 pointer-events-none",
                )}
              />
            ))}
          </div>
        </Parallax>

        {/* LUXURY ARCHITECTURAL GRADIENT OVERLAYS */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/20 to-charcoal/90" />
        <div className="pointer-events-none absolute inset-0 bg-radial from-transparent via-transparent to-charcoal/70" />

        {/* HERO FOREGROUND CONTENT (CLEAN & MINIMALIST) */}
        <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-6 pb-12 pt-28 md:px-12 md:pb-16 md:pt-36">
          {/* DISCREET BREADCRUMB */}
          <div>
            <Link
              to="/projets/$slug"
              params={{ slug: project.slug }}
              className="label-xs group inline-flex items-center gap-2 text-charcoal-foreground/75 transition-colors hover:text-gold"
            >
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
              {project.shortName}
            </Link>
          </div>

          {/* MONUMENTAL MINIMALIST TITLE */}
          <div className="mt-6">
            <SplitText
              as="h1"
              text={block.name.toUpperCase()}
              stagger={80}
              className="font-display text-[clamp(4.2rem,13vw,9.5rem)] leading-[0.88] tracking-[-0.02em] text-charcoal-foreground"
            />
            <p className="mt-3 font-display text-[clamp(1.4rem,3vw,2.2rem)] text-gold/90 tracking-wide">
              RÉSIDENCE HYPRO · CHÉRAGA
            </p>
          </div>

          {/* BOTTOM CONTROLS: MINIMALIST SWITCHER & SCROLL PROMPT */}
          <div className="mt-12 flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-charcoal-foreground/15">
            {/* MINIMALIST IMAGE INDICATORS (01 / 02) */}
            {heroImages.length > 1 ? (
              <div className="flex items-center gap-4">
                {heroImages.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setHeroIndex(i)}
                    className="group flex items-center gap-2.5 py-1 text-left transition-all"
                  >
                    <span
                      className={cn(
                        "label-xs text-[0.7rem] transition-colors",
                        heroIndex === i
                          ? "text-gold font-semibold"
                          : "text-charcoal-foreground/50 group-hover:text-charcoal-foreground/80",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "block h-0.5 transition-all duration-500 rounded-full",
                        heroIndex === i ? "w-10 bg-gold" : "w-4 bg-charcoal-foreground/30 group-hover:w-6",
                      )}
                    />
                  </button>
                ))}
              </div>
            ) : (
              <div />
            )}

            {/* ACTION & DISCOVERY */}
            <div className="flex items-center gap-3">

              <a
                href="#typologies"
                className="label-xs inline-flex items-center gap-2.5 rounded-full border border-charcoal-foreground/20 bg-charcoal/60 px-6 py-3.5 text-charcoal-foreground backdrop-blur-md transition-all hover:bg-gold hover:text-charcoal hover:border-gold"
              >
                Découvrir
                <ArrowDown className="size-3.5 animate-bounce" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CONTINUOUS DRIFTING MARQUEE BANNER */}
      <ScrollText
        text={`${block.name.toUpperCase()} · HYPRO CHERAGA · LUXURY LIVING · 3D PLANS · RESIDENCE HYPRO · `}
        distance={280}
        className="relative z-10 bg-charcoal pb-14 pt-8 font-display text-[clamp(2.5rem,6.5vw,5.5rem)] leading-none text-charcoal-foreground/10 md:pb-20 md:pt-12"
      />

      {/* MAIN CONTENT: UNIT TYPOLOGIES WITH SOFT BLUR REVEAL */}
      <main className="mx-auto max-w-[1600px] px-4 pb-16 pt-8 sm:px-6 sm:pb-24 sm:pt-12 md:px-10 md:pb-36 md:pt-16">
        <section id="typologies" className="scroll-mt-28">
          <Reveal className="flex flex-col gap-2 sm:gap-3">
            <span className="label-xs text-wine font-semibold tracking-widest">
              {block.name} · Typologies
            </span>
            <h2 className="font-display text-[2.2rem] leading-[0.92] text-foreground sm:text-[2.8rem] md:text-[4.8rem]">
              LES TYPES
            </h2>
          </Reveal>

          {/* UNIT CARDS WITH CRISP, SMOOTH REVEAL ANIMATION */}
          <div className="mt-6 space-y-6 sm:mt-10 sm:space-y-8 md:mt-12 md:space-y-12">
            {block.units.map((unit, i) => (
              <Reveal key={unit.code} delay={i * 100}>
                <UnitTypeCard
                  unit={unit}
                  blockName={block.name}
                  projectVrUrl={project.vrUrl}
                  index={i}
                  isPlaying={activePlayingCode === unit.code}
                  projectSlug={project.slug}
                />
              </Reveal>
            ))}
          </div>
        </section>

        {/* SIBLING BLOCKS NAVIGATION */}
        {siblings.length > 0 && (
          <section className="mt-24 md:mt-36">
            <Reveal>
              <p className="label-xs text-muted-foreground mb-3">Poursuivre la découverte</p>
              <h3 className="font-display text-3xl md:text-4xl mb-8">Autres blocs de la résidence</h3>
            </Reveal>

            <Reveal className="grid gap-6 md:grid-cols-2">
              {siblings.map((b) => (
                <Link
                  key={b.id}
                  to="/blocs/$slug/$blockId"
                  params={{ slug: project.slug, blockId: b.id }}
                  className="bento group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-6 border border-border bg-card p-8 transition-all duration-500 hover:border-gold/50 hover:bg-sand/40 md:p-10"
                >
                  <div className="min-w-0">
                    <p className="label-xs text-muted-foreground group-hover:text-wine transition-colors">
                      Découvrir
                    </p>
                    <p className="mt-3 font-display text-3xl md:text-4xl">{b.name}</p>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{b.headline}</p>
                  </div>
                  <span className="grid size-14 shrink-0 place-items-center rounded-full bg-charcoal text-charcoal-foreground transition-all duration-500 group-hover:bg-gold group-hover:text-charcoal group-hover:rotate-45 group-hover:scale-110">
                    <ArrowUpRight className="size-6" />
                  </span>
                </Link>
              ))}
            </Reveal>
          </section>
        )}
      </main>

      <ContactSection />
      <SiteFooter />
    </div>
  );
}

