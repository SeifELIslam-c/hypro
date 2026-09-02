import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowUpRight, ArrowDown, MapPin } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MediaCarousel } from "@/components/site/MediaCarousel";
import { ProgressRing } from "@/components/site/ProgressRing";
import { Reveal } from "@/components/site/Reveal";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { FeatureGrid } from "@/components/site/FeatureGrid";
import { SurfaceBoard } from "@/components/site/SurfaceBoard";
import { BlockShowcase } from "@/components/site/BlockShowcase";
import { VrButton } from "@/components/site/VrButton";
import { Marquee, Parallax, ScrollText, SplitText } from "@/components/site/Motion";
import { getProject, projects, type Project } from "@/data/projects";
import { cn } from "@/lib/utils";

const SITE_URL = "https://www.hypro-dz.com";
const OG_IMAGE = `${SITE_URL}/og-cover.jpg`;

export const Route = createFileRoute("/projets/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return project;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          {
            title: `${loaderData.name} — Appartements Haut de Gamme à ${loaderData.location} | HYPRO`,
          },
          {
            name: "description",
            content: `${loaderData.name} à ${loaderData.location} : découvrez ce projet résidentiel HYPRO. Appartements F2, F3, F4 avec finitions premium, architecture contemporaine, parking sécurisé et cadre de vie exceptionnel en Algérie.`,
          },
          {
            name: "keywords",
            content: `${loaderData.name}, appartement ${loaderData.location}, résidence ${loaderData.location}, immobilier ${loaderData.location}, HYPRO ${loaderData.location}, achat appartement ${loaderData.location} Algérie, promoteur immobilier ${loaderData.location}, logement neuf ${loaderData.location}`,
          },
          /* Open Graph */
          { property: "og:type", content: "article" },
          { property: "og:url", content: `${SITE_URL}/projets/${loaderData.slug}` },
          {
            property: "og:title",
            content: `${loaderData.name} — HYPRO | Résidence Moderne à ${loaderData.location}`,
          },
          {
            property: "og:description",
            content: `Découvrez ${loaderData.name}, une résidence HYPRO à ${loaderData.location} : appartements modernes, finitions haut de gamme et qualité de vie supérieure en Algérie.`,
          },
          { property: "og:image", content: OG_IMAGE },
          { property: "og:image:width", content: "1200" },
          { property: "og:image:height", content: "630" },
          { property: "og:image:alt", content: `${loaderData.name} — Résidence HYPRO à ${loaderData.location}` },
          /* Twitter / X */
          { name: "twitter:card", content: "summary_large_image" },
          { name: "twitter:title", content: `${loaderData.name} — HYPRO ${loaderData.location}` },
          {
            name: "twitter:description",
            content: `${loaderData.name} à ${loaderData.location} : appartements haut de gamme avec finitions premium. Investissez avec HYPRO.`,
          },
          { name: "twitter:image", content: OG_IMAGE },
          /* JSON-LD Residence */
          {
            "script:ld+json": JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Residence",
              name: loaderData.name,
              url: `${SITE_URL}/projets/${loaderData.slug}`,
              description: `${loaderData.name} à ${loaderData.location} : résidence moderne HYPRO avec appartements F2, F3, F4, finitions premium et parking sécurisé.`,
              address: {
                "@type": "PostalAddress",
                addressLocality: loaderData.location,
                addressCountry: "DZ",
              },
              image: OG_IMAGE,
              brand: {
                "@type": "Brand",
                name: "HYPRO",
                url: SITE_URL,
              },
            }),
          } as Record<string, string>,
        ]
      : [],
  }),
  component: ProjectPage,
});


import { HeroVideoLoader } from "@/components/site/HeroVideoLoader";

/** Full-bleed looping hero video: autoplay, muted, loop, playsinline, cover. */
function HeroLoopVideo({ src }: { src: string }) {
  return <HeroVideoLoader src={src} className="absolute inset-0 size-full" />;
}

function LazyMap({ src, title, className }: { src: string; title: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setIsVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {isVisible ? (
        <iframe
          title={title}
          loading="lazy"
          className="size-full border-0 grayscale-[0.35]"
          src={src}
        />
      ) : (
        <div className="size-full animate-pulse bg-card/40" />
      )}
    </div>
  );
}


function ProjectPage() {
  const project = Route.useLoaderData() as Project;
  const others = projects.filter((p) => p.slug !== project.slug);
  const [introOut, setIntroOut] = useState(false);

  useEffect(() => {
    if (!project.heroVideo) return;
    const t = setTimeout(() => setIntroOut(true), 3000);
    return () => clearTimeout(t);
  }, [project.heroVideo]);

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <SiteHeader transparent />

      {/* HERO — plein écran */}
      <section className="relative h-[100svh] min-h-[560px] overflow-hidden bg-charcoal">
        {project.heroVideo ? (
          <HeroLoopVideo src={project.heroVideo} poster={project.hero} />
        ) : (
          <Parallax speed={90} scale className="absolute inset-0">
            <img
              src={project.hero}
              alt={`${project.name}, ${project.location}`}
              fetchPriority="high"
              className="size-full object-cover"
            />
          </Parallax>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-charcoal/25 to-charcoal/95" />

        <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-14 pt-24 md:px-10 md:pb-20 md:pt-32">
          <div
            className={cn(
              "transition-all duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              introOut ? "-translate-y-4 opacity-0 blur-md" : "translate-y-0 opacity-100 blur-0",
            )}
          >
            <p className="label-xs text-gold">
              {project.index} — {project.district ?? project.location}
            </p>
            <SplitText
              as="h1"
              text={project.name.toUpperCase()}
              className="mt-5 max-w-[14ch] font-display text-[clamp(2.4rem,10vw,3.4rem)] leading-[0.94] tracking-[-0.015em] text-charcoal-foreground sm:text-[clamp(3.2rem,7.5vw,4.8rem)] sm:leading-[0.9] lg:text-[clamp(4.5rem,6.6vw,6.5rem)] lg:leading-[0.88]"
              stagger={80}
            />
            <p className="label-xs mt-5 text-charcoal-foreground/70 md:mt-6">{project.location}</p>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-4 md:mt-12">
            <a
              href="#galerie"
              className="label-xs inline-flex items-center gap-3 rounded-full border border-charcoal-foreground/25 bg-charcoal-foreground/10 px-6 py-4 text-charcoal-foreground backdrop-blur-md transition-colors hover:bg-charcoal-foreground/20"
            >
              Galerie
              <ArrowDown className="size-4 animate-bounce" />
            </a>
          </div>

        </div>
      </section>

      <ScrollText
        text={`${project.shortName.toUpperCase()} · ${project.location.toUpperCase()} · HYPRO · ${project.shortName.toUpperCase()} · ${project.location.toUpperCase()}`}
        distance={320}
        className="relative z-10 bg-charcoal pb-20 pt-10 font-display text-[3rem] leading-none text-charcoal-foreground/10 md:pb-28 md:pt-16 md:text-[8rem]"
      />

      {/* GALERIE */}
      <section
        id="galerie"
        className="relative z-10 -mt-10 rounded-t-[2.5rem] bg-charcoal pb-16 pt-14 text-charcoal-foreground md:-mt-14 md:rounded-t-[3.5rem] md:pb-24 md:pt-20"
      >
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div className="min-w-0">
              <p className="label-xs text-charcoal-foreground/50">Galerie</p>
              <h2 className="mt-4 font-display text-[2.2rem] leading-none md:text-[3.5rem]">
                L'expérience visuelle
              </h2>
            </div>
            {!project.blocks && (
              <VrButton
                href={project.vrUrl}
                poster={project.hero}
                title={project.name}
                variant="glass"
                className="justify-self-start sm:justify-self-end"
              />
            )}

          </div>
          <div className="mt-8">
            <MediaCarousel items={project.media} videoUrl={project.videoUrl} title={project.name} />
          </div>
        </div>
      </section>

      {/* INFO BENTO */}
      <section className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-24">
        <div className="grid gap-4 md:grid-cols-4">
          <Reveal className="bento border border-border bg-card p-8 md:col-span-2">
            <p className="label-xs text-muted-foreground">Localisation</p>
            <p className="mt-5 font-display text-4xl">{project.location}</p>
            {project.district && (
              <p className="mt-3 text-muted-foreground">Quartier · {project.district}</p>
            )}
          </Reveal>
          <Reveal delay={70} className="bento border border-border bg-wine p-8 text-wine-foreground">
            <p className="label-xs text-wine-foreground/60">Livraison</p>
            <p className="mt-5 font-display text-4xl">Programmée</p>
          </Reveal>
          <Reveal
            delay={140}
            className="bento border border-border bg-charcoal p-8 text-charcoal-foreground"
          >
            <p className="label-xs text-charcoal-foreground/60">Configurations</p>
            <p className="mt-5 font-display text-4xl text-gold">2 — 4</p>
            <p className="mt-2 text-sm text-charcoal-foreground/70">chambres</p>
          </Reveal>
        </div>

        {/* DESCRIPTION */}
        <div className="mt-20 grid gap-10 lg:grid-cols-[minmax(0,0.35fr)_minmax(0,1fr)]">
          <Reveal>
            <p className="label-xs text-muted-foreground">Le projet</p>
          </Reveal>
          <Reveal delay={80} className="space-y-6">
            {project.description.map((p, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "font-display text-[1.8rem] leading-tight md:text-[2.6rem]"
                    : "max-w-3xl text-lg leading-relaxed text-muted-foreground"
                }
              >
                {p}
              </p>
            ))}
          </Reveal>
        </div>

        {/* FEATURES */}
        <section className="mt-20">
          <Reveal className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div>
              <p className="label-xs text-muted-foreground">Prestations</p>
              <h2 className="mt-4 font-display text-[2.4rem] leading-[0.95] md:text-[4.5rem]">
                CARACTÉRISTIQUES
              </h2>
            </div>
            <p className="max-w-sm text-muted-foreground">
              Huit engagements techniques livrés de série — pas des options, des standards.
            </p>
          </Reveal>
          <FeatureGrid features={project.features} className="mt-8" />
        </section>

        {/* BLOCKS */}
        {project.blocks && (
          <section className="mt-20">
            <BlockShowcase blocks={project.blocks} slug={project.slug} />
          </section>
        )}

        {/* PROGRESS */}
        {project.completion !== undefined && (
          <Reveal className="mt-20 grid gap-4 md:grid-cols-3">
            <div className="bento grid place-items-center border border-border bg-card p-10">
              <ProgressRing value={project.completion} label="Taux d'achèvement" />
            </div>
            <div className="bento border border-border bg-charcoal p-10 text-charcoal-foreground md:col-span-2">
              <p className="label-xs text-charcoal-foreground/60">Avancement du chantier</p>
              <p className="mt-6 font-display text-[2.4rem] leading-tight md:text-[3.5rem]">
                {project.shortName} avance selon un calendrier maîtrisé, dans le strict respect des
                délais et des procédures.
              </p>
              <div className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-charcoal-foreground/15">
                <div
                  className="h-full rounded-full bg-gold"
                  style={{ width: `${project.completion}%` }}
                />
              </div>
            </div>
          </Reveal>
        )}

        {/* SURFACES */}
        {project.surfaces && project.totals && (
          <section className="mt-20">
            <Reveal>
              <p className="label-xs text-muted-foreground">Plan type</p>
              <h2 className="mt-4 font-display text-[2.4rem] leading-[0.95] md:text-[4.5rem]">
                SURFACES
              </h2>
            </Reveal>
            <SurfaceBoard
              surfaces={project.surfaces}
              totals={project.totals}
              className="mt-8"
            />
          </section>
        )}

        {/* MAP */}
        <Reveal className="mt-20 grid gap-4 md:grid-cols-3">
          <div className="bento border border-border bg-card p-8">
            <MapPin className="size-4 text-wine" />
            <p className="label-xs mt-5 text-muted-foreground">Localisation</p>
            <p className="mt-4 font-display text-3xl">{project.location}</p>
            <a
              href={`https://www.google.com/maps/search/${encodeURIComponent(project.mapQuery)}`}
              target="_blank"
              rel="noreferrer"
              className="label-xs group mt-8 inline-flex items-center gap-2 text-wine"
            >
              Ouvrir dans Maps
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
          <LazyMap
            title={`Carte — ${project.location}`}
            className="bento h-72 overflow-hidden border border-border md:col-span-2 md:h-full"
            src={`https://www.google.com/maps?q=${encodeURIComponent(project.mapQuery)}&output=embed`}
          />
        </Reveal>

        {/* CTA */}
        <Reveal className="bento mt-20 border border-border bg-charcoal p-10 text-charcoal-foreground md:p-16">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div className="min-w-0">
              <h2 className="font-display text-[2.4rem] leading-[0.95] md:text-[4.5rem]">
                NOUS SOUHAITONS
                <br />
                VOUS <span className="text-gold">ENTENDRE</span>
              </h2>
              <p className="mt-6 max-w-lg text-charcoal-foreground/70">
                Vous avez un projet immobilier ou des questions ? Notre équipe est à votre
                disposition pour vous accompagner à chaque étape.
              </p>
            </div>
            <Link
              to="/contact"
              className="label-xs group inline-flex shrink-0 items-center gap-2 rounded-full bg-gold px-8 py-5 text-gold-foreground transition-transform hover:scale-[1.03]"
            >
              Contactez-nous
              <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
            </Link>
          </div>
        </Reveal>

        {/* OTHER PROJECTS */}
        <Reveal className="mt-20">
          <p className="label-xs text-muted-foreground">Poursuivre la visite</p>
          <h2 className="mt-4 font-display text-[2.2rem] md:text-[3.5rem]">Autres projets</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {others.map((p) => (
              <Link
                key={p.slug}
                to="/projets/$slug"
                params={{ slug: p.slug }}
                className="bento group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border border-border bg-card p-8 transition-colors hover:bg-sand"
              >
                <div className="min-w-0">
                  <p className="font-display text-4xl text-wine">{p.index}</p>
                  <p className="mt-4 truncate font-display text-2xl">{p.shortName}</p>
                  <p className="label-xs mt-2 text-muted-foreground">{p.location}</p>
                </div>
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-charcoal text-charcoal-foreground transition-transform group-hover:scale-110">
                  <ArrowUpRight className="size-5" />
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      <Marquee
        items={["HYPRO", "ARCHITECTURE", "PROMOTION", "ALGÉRIE"]}
        speed={30}
        className="border-y border-border py-5"
        itemClassName="label-xs text-muted-foreground"
      />
      <SiteFooter />
    </div>
  );
}
