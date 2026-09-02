import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ContactSection } from "@/components/site/ContactSection";
import { ProjectCard } from "@/components/site/ProjectCard";
import { Reveal } from "@/components/site/Reveal";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { ManifestoSection } from "@/components/site/ManifestoSection";
import { HeroVideoLoader } from "@/components/site/HeroVideoLoader";
import { initConsoleSignature } from "@/lib/console-signature";
import { Marquee, Parallax, SplitText, Magnetic, Tilt, ScrollText } from "@/components/site/Motion";
import { projects, images } from "@/data/projects";
import { cn } from "@/lib/utils";

const SITE_URL = "https://hy-promotion.netlify.app";
const OG_IMAGE = `${SITE_URL}/og-cover.png`;
const HOMEPAGE_VIDEO = "https://res.cloudinary.com/nyuasexa/video/upload/v1787929180/homepage.mp4";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: `${SITE_URL}/`,
  name: "HYPRO — Promotion Immobilière Algérie",
  description:
    "HYPRO conçoit et développe des résidences modernes en Algérie : Chéraga, Blida, Hamma. Qualité architecturale, finitions haut de gamme et accompagnement personnalisé.",
  inLanguage: "fr-DZ",
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HYPRO — Promotion immobilière & construction en Algérie" },
      {
        name: "description",
        content:
          "HYPRO conçoit et développe des résidences modernes en Algérie : Cheraga, Blida, Hamma. Qualité architecturale, finitions haut de gamme et accompagnement personnalisé.",
      },
      {
        name: "keywords",
        content:
          "promoteur immobilier Algérie, appartement Alger, résidence Chéraga, immobilier Blida, appartement Hamma, promotion immobilière, achat appartement Algérie, résidence moderne Algérie, HYPRO",
      },
      /* Open Graph */
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:title", content: "HYPRO — Construire les espaces de demain" },
      {
        property: "og:description",
        content:
          "Promotion et développement immobilier en Algérie. Découvrez les résidences HYPRO : architecture, confort et innovation.",
      },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:alt", content: "HYPRO — Construire les espaces de demain" },
      /* Twitter / X */
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "HYPRO — Construire les espaces de demain" },
      {
        name: "twitter:description",
        content:
          "Promotion et développement immobilier en Algérie. Découvrez les résidences HYPRO : architecture, confort et innovation.",
      },
      { name: "twitter:image", content: OG_IMAGE },
      /* JSON-LD */
      { "script:ld+json": JSON.stringify(websiteJsonLd) } as Record<string, string>,
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
  }),
  component: Home,
});

const steps = [
  {
    n: "01",
    t: "Explorez nos projets",
    d: "Parcourez notre sélection de biens immobiliers soigneusement choisis.",
  },
  {
    n: "02",
    t: "Trouvez votre propriété",
    d: "Trouvez l'appartement ou la maison qui correspond parfaitement à vos besoins.",
  },
  {
    n: "03",
    t: "Échangez avec notre équipe",
    d: "Notre équipe vous accompagne dans votre projet.",
  },
  {
    n: "04",
    t: "Concrétisez votre projet",
    d: "Bénéficiez d'un accompagnement personnalisé.",
  },
];

const advantages = [
  {
    n: "01",
    t: "Conception architecturale",
    d: "Des plans pensés pour la lumière, l'usage et la matière — chaque mètre carré a une raison d'être.",
  },
  {
    n: "02",
    t: "Exécution maîtrisée",
    d: "Chantiers suivis au quotidien, normes respectées, délais tenus.",
  },
  {
    n: "03",
    t: "Finitions haut de gamme",
    d: "Matériaux sélectionnés, détails soignés, durabilité assurée.",
  },
  {
    n: "04",
    t: "Accompagnement client",
    d: "Un interlocuteur dédié, de la première visite à la remise des clés.",
  },
  {
    n: "05",
    t: "Emplacements choisis",
    d: "Des adresses sélectionnées pour leur accessibilité, leurs services et leur potentiel de valeur.",
  },
  {
    n: "06",
    t: "Transparence totale",
    d: "Avancement des chantiers, échéances et documents : tout est communiqué clairement, sans zone d'ombre.",
  },
];

function Home() {
  const [loaded, setLoaded] = useState(false);
  const [textFaded, setTextFaded] = useState(false);
  const heroBgRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const textTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startTextTimer = useCallback(() => {
    setTextFaded(false);
    if (textTimerRef.current) clearTimeout(textTimerRef.current);
    textTimerRef.current = setTimeout(() => {
      setTextFaded(true);
    }, 9000);
  }, []);

  useEffect(() => {
    initConsoleSignature();
    setLoaded(true);
    startTextTimer();

    let raf = 0;
    const apply = () => {
      raf = 0;
      const y = window.scrollY;
      if (y > window.innerHeight * 1.2) return;
      if (heroBgRef.current)
        heroBgRef.current.style.transform = `translate3d(0,${(y * 0.25).toFixed(1)}px,0)`;
      if (heroContentRef.current) {
        heroContentRef.current.style.opacity = String(Math.max(0, 1 - y / 620));
        heroContentRef.current.style.transform = `translate3d(0,${(y * -0.08).toFixed(1)}px,0)`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (textTimerRef.current) clearTimeout(textTimerRef.current);
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [startTextTimer]);

  const [first, ...rest] = projects;

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <SiteHeader transparent />

      {/* HERO */}
      <section className="relative h-[100svh] min-h-[560px] overflow-hidden bg-charcoal">
        <div ref={heroBgRef} className="absolute inset-0 will-change-transform">
          <HeroVideoLoader src={HOMEPAGE_VIDEO} onVideoLoop={startTextTimer} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-charcoal/35 to-charcoal/95" />

        <div
          ref={heroContentRef}
          className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-10 pt-24 will-change-transform md:px-10 md:pb-16 md:pt-32"
        >
          <div
            className={cn(
              "transition-all duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              textFaded
                ? "max-md:-translate-y-4 max-md:opacity-0 max-md:blur-md max-md:pointer-events-none"
                : "translate-y-0 opacity-100 blur-0",
            )}
          >
            <p
              className={`label-xs text-gold transition-all duration-1000 ${loaded ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
            >
              Immobilier • Construction • Promotion
            </p>

            <h1
              className={`mt-5 max-w-[16ch] font-display text-[clamp(2.6rem,11vw,3.6rem)] leading-[0.94] tracking-[-0.015em] text-charcoal-foreground transition-all delay-150 duration-1000 sm:text-[clamp(3.5rem,8vw,5rem)] sm:leading-[0.9] lg:text-[clamp(5rem,7.4vw,7.5rem)] lg:leading-[0.88] ${loaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              CONSTRUIRE
              <br />
              LES ESPACES
              <br />
              DE DEMAIN.
            </h1>

            <p className="mt-6 max-w-sm text-base leading-relaxed text-charcoal-foreground/80 md:mt-8 md:text-lg">
              Concevoir aujourd'hui.
              <br />
              Construire pour demain.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-6 md:mt-10">
            <div className="flex flex-wrap gap-3">
              <Magnetic>
                <Link
                  to="/projets"
                  className="label-xs group inline-flex items-center gap-2 rounded-full bg-charcoal-foreground px-6 py-3.5 text-charcoal transition-colors hover:bg-gold md:px-7 md:py-4"
                >
                  Découvrir nos projets
                  <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  to="/a-propos"
                  className="label-xs inline-flex items-center gap-2 rounded-full border border-charcoal-foreground/30 bg-charcoal-foreground/10 px-6 py-3.5 text-charcoal-foreground backdrop-blur-md transition-colors hover:bg-charcoal-foreground/20 md:px-7 md:py-4"
                >
                  À propos de HYPRO
                </Link>
              </Magnetic>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-3 text-charcoal-foreground/60">
            <span className="label-xs">Découvrir</span>
            <ArrowDown className="size-4 animate-bounce" />
          </div>
        </div>
      </section>


      {/* INTRO */}
      <section className="relative z-10 -mt-10 rounded-t-[2.5rem] bg-background md:-mt-14 md:rounded-t-[3.5rem]">
      <Marquee
        items={["PROMOTION IMMOBILIÈRE", "CONSTRUCTION", "ARCHITECTURE", "ALGÉRIE"]}
        speed={34}
        className="border-b border-border py-5"
        itemClassName="label-xs text-muted-foreground"
      />
      <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-32">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.35fr)_minmax(0,1fr)]">
          <Reveal>
            <p className="label-xs text-muted-foreground">01 — L'entreprise</p>
            <p className="mt-6 font-display text-3xl leading-tight text-wine">NOUS SOMMES HYPRO</p>
          </Reveal>
          <div>
            <SplitText
              as="h2"
              text="Nous concevons et développons des projets résidentiels et commerciaux avec expertise et innovation."
              className="font-display text-[2.2rem] leading-[1.05] md:text-[4rem]"
              stagger={28}
            />
            <Reveal delay={140}>
              <p className="mt-10 max-w-2xl text-lg leading-relaxed text-muted-foreground lg:ml-auto">
                Notre engagement : offrir des espaces de vie alliant qualité architecturale, confort
                moderne et respect des normes les plus exigeantes.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
      </section>

      {/* PROJECTS BENTO */}
      <section className="mx-auto max-w-[1600px] px-5 pb-20 md:px-10 md:pb-32">
        <Reveal className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <p className="label-xs text-muted-foreground">02 — Nos projets</p>
            <h2 className="mt-5 font-display text-[2.75rem] leading-[0.95] md:text-[5.5rem]">
              NOS PROJETS
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground">
            Découvrez nos projets résidentiels conçus pour offrir confort, modernité et qualité de
            vie.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
          {first && (
            <Reveal className="h-full lg:col-span-2 lg:row-span-2">
              <ProjectCard project={first} size="lg" className="h-full" />
            </Reveal>
          )}
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={100 + i * 80} className="h-full">
              <ProjectCard project={p} className="h-full" />
            </Reveal>
          ))}
        </div>

        {/* stats bento */}
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <Reveal className="bento border border-border bg-wine p-8 text-wine-foreground md:col-span-2">
            <p className="label-xs text-wine-foreground/60">Résidences en développement</p>
            <p className="mt-6 font-display text-[4.5rem] leading-none">03</p>
            <p className="mt-4 max-w-xs text-wine-foreground/75">
              Cheraga, Blida et Hamma — trois adresses pensées pour la vie de famille comme pour
              l'investissement.
            </p>
          </Reveal>
          <Reveal delay={80} className="bento flex flex-col border border-border bg-card p-8">
            <p className="label-xs text-muted-foreground">Surface habitable</p>
            <p className="mt-6 font-display text-5xl leading-none">63,72 — 124,94</p>
            <p className="mt-3 text-sm text-muted-foreground">m² par appartement</p>
            <p className="mt-auto pt-8 font-display text-2xl leading-tight text-wine">
              2 à 4 chambres, balcons et cours privées.
            </p>
          </Reveal>
          <Reveal delay={140} className="bento relative border border-border">
            <Parallax speed={50} scale className="size-full min-h-48">
              <img
                src={images.detailImg}
                alt="Détail architectural d'une résidence HYPRO"
                loading="lazy"
                className="size-full min-h-48 object-cover"
              />
            </Parallax>
          </Reveal>
        </div>
      </section>

      {/* WHY HYPRO */}
      <section className="overflow-hidden bg-sand/60 py-20 md:py-32">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <Reveal>
            <p className="label-xs text-muted-foreground">03 — Savoir-faire</p>
            <h2 className="mt-5 max-w-3xl font-display text-[2.4rem] leading-[0.98] md:text-[4.5rem]">
              POURQUOI <span className="italic text-wine">HYPRO</span>
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:mt-8 md:text-lg">
              De l'étude du terrain à la remise des clés, nous maîtrisons chaque étape : conception
              architecturale, exécution technique et suivi client.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 md:mt-12 md:gap-4 lg:grid-cols-4">
            {advantages.map((a, i) => (
              <Reveal
                key={a.t}
                delay={i * 80}
                className={cn(
                  "h-full",
                  i === 0 && "sm:col-span-2 lg:col-span-2",
                  i === 5 && "sm:col-span-2 lg:col-span-2",
                )}
              >
                <Tilt className="h-full">
                  <article
                    className={cn(
                      "bento group relative flex h-full flex-col justify-between overflow-hidden border p-7 transition-all duration-500 hover:-translate-y-1 md:p-9",
                      i === 0
                        ? "border-charcoal/40 bg-charcoal text-charcoal-foreground"
                        : "border-border bg-card hover:border-wine/25 hover:shadow-[var(--shadow-soft)]",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "pointer-events-none absolute -right-20 -top-20 size-56 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100",
                        i === 0 ? "bg-gold/25" : "bg-wine/10",
                      )}
                    />
                    <span
                      aria-hidden
                      className={cn(
                        "pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100",
                        i === 0 ? "bg-gold/70" : "bg-wine/40",
                      )}
                    />

                    <div className="relative flex items-start justify-between gap-4">
                      <p
                        className={cn(
                          "font-display text-4xl leading-none md:text-5xl",
                          i === 0 ? "text-gold" : "text-wine",
                        )}
                      >
                        {a.n}
                      </p>
                      <span
                        className={cn(
                          "grid size-10 place-items-center rounded-full border transition-all duration-500 group-hover:rotate-45",
                          i === 0
                            ? "border-gold/30 text-gold"
                            : "border-wine/15 text-wine group-hover:bg-wine group-hover:text-wine-foreground",
                        )}
                      >
                        <ArrowUpRight className="size-4" />
                      </span>
                    </div>

                    <div className="relative mt-12 md:mt-20">
                      <h3 className="font-display text-2xl leading-tight md:text-[2rem]">{a.t}</h3>
                      <p
                        className={cn(
                          "mt-3 max-w-sm text-sm leading-relaxed",
                          i === 0 ? "text-charcoal-foreground/65" : "text-muted-foreground",
                        )}
                      >
                        {a.d}
                      </p>
                      <span
                        className={cn(
                          "mt-6 block h-px w-8 origin-left transition-transform duration-700 group-hover:scale-x-[3]",
                          i === 0 ? "bg-gold" : "bg-wine/40",
                        )}
                      />
                    </div>
                  </article>
                </Tilt>
              </Reveal>
            ))}
          </div>


          <ScrollText
            text="QUALITÉ · DÉLAIS · TRANSPARENCE · QUALITÉ · DÉLAIS · TRANSPARENCE"
            distance={280}
            className="mt-14 font-display text-[3rem] leading-none text-wine/15 md:mt-20 md:text-[8rem]"
          />
        </div>
      </section>


      <ManifestoSection />

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-32">
        <Reveal>
          <p className="label-xs text-muted-foreground">04 — Méthode</p>
        </Reveal>
        <SplitText
          as="h2"
          text="COMMENT ÇA MARCHE ?"
          className="mt-5 font-display text-[2.4rem] leading-[0.98] md:text-[4.5rem]"
        />
        <Reveal delay={120}>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Trouvez votre propriété idéale en quelques étapes simples. Nous facilitons votre
            recherche pour louer, acheter ou vendre en toute sérénité.
          </p>
        </Reveal>

        <div className="relative mt-12 grid gap-4 md:grid-cols-4">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-8 top-[4.5rem] hidden h-px bg-gradient-to-r from-wine/25 via-wine/10 to-transparent md:block"
          />
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 90} className="h-full">
              <article
                className={cn(
                  "bento group relative flex h-full flex-col overflow-hidden border p-8 transition-all duration-500 hover:-translate-y-1.5 md:p-9",
                  i === 1
                    ? "border-charcoal/40 bg-charcoal text-charcoal-foreground"
                    : "border-border bg-card hover:border-wine/25 hover:shadow-[var(--shadow-soft)]",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute -right-16 -bottom-16 size-52 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100",
                    i === 1 ? "bg-gold/25" : "bg-wine/10",
                  )}
                />
                <div className="relative flex items-center gap-4">
                  <span
                    className={cn(
                      "grid size-14 shrink-0 place-items-center rounded-full border font-display text-2xl transition-transform duration-500 group-hover:scale-105",
                      i === 1
                        ? "border-gold/30 bg-gold/10 text-gold"
                        : "border-wine/15 bg-wine/[0.05] text-wine",
                    )}
                  >
                    {s.n}
                  </span>
                  <span
                    className={cn(
                      "h-px flex-1 origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100",
                      i === 1 ? "bg-gold/60" : "bg-wine/30",
                    )}
                  />
                </div>
                <h3 className="relative mt-8 font-display text-2xl leading-tight md:text-[1.9rem]">
                  {s.t}
                </h3>
                <p
                  className={cn(
                    "relative mt-3 text-sm leading-relaxed",
                    i === 1 ? "text-charcoal-foreground/65" : "text-muted-foreground",
                  )}
                >
                  {s.d}
                </p>
                <span
                  className={cn(
                    "relative mt-auto pt-8 text-[0.66rem] uppercase tracking-[0.22em]",
                    i === 1 ? "text-charcoal-foreground/45" : "text-muted-foreground/70",
                  )}
                >
                  Étape {s.n}
                </span>
              </article>
            </Reveal>
          ))}
        </div>

      </section>

      <ContactSection />
      <SiteFooter />
    </div>
  );
}
