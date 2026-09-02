import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ContactSection } from "@/components/site/ContactSection";
import { ProjectCard } from "@/components/site/ProjectCard";
import { Reveal } from "@/components/site/Reveal";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { Marquee, SplitText, ScrollText } from "@/components/site/Motion";
import { projects } from "@/data/projects";

const SITE_URL = "https://www.hypro-dz.com";
const PAGE_URL = `${SITE_URL}/projets`;
const OG_IMAGE = `${SITE_URL}/og-cover.jpg`;

const projetsJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  url: PAGE_URL,
  name: "Nos Projets Résidentiels — HYPRO Algérie",
  description:
    "Découvrez les projets résidentiels HYPRO : Résidence Chéraga, Résidence Blida et Résidence Hamma. Appartements modernes avec finitions premium, équipements de qualité et cadre de vie exceptionnel.",
  inLanguage: "fr-DZ",
  isPartOf: { "@type": "WebSite", url: SITE_URL, name: "HYPRO" },
  hasPart: [
    {
      "@type": "Residence",
      name: "Résidence HYPRO Chéraga",
      url: `${SITE_URL}/projets/cheraga`,
      address: { "@type": "PostalAddress", addressLocality: "Chéraga", addressRegion: "Alger", addressCountry: "DZ" },
    },
    {
      "@type": "Residence",
      name: "Résidence HYPRO Blida",
      url: `${SITE_URL}/projets/blida`,
      address: { "@type": "PostalAddress", addressLocality: "Blida", addressRegion: "Blida", addressCountry: "DZ" },
    },
    {
      "@type": "Residence",
      name: "Résidence HYPRO Hamma",
      url: `${SITE_URL}/projets/hamma`,
      address: { "@type": "PostalAddress", addressLocality: "Hamma", addressRegion: "Alger", addressCountry: "DZ" },
    },
  ],
};

export const Route = createFileRoute("/projets/")({
  head: () => ({
    meta: [
      { title: "Nos Projets Résidentiels — Appartements Haut de Gamme | HYPRO Algérie" },
      {
        name: "description",
        content:
          "Explorez les projets résidentiels HYPRO en Algérie : Résidence Chéraga, Résidence Blida et Résidence Hamma. Appartements F2, F3, F4 avec finitions premium, parking sécurisé et espaces de vie soignés.",
      },
      {
        name: "keywords",
        content:
          "projets immobiliers Algérie, résidence Chéraga, résidence Blida, résidence Hamma, appartements neufs Alger, F2 F3 F4 Algérie, immobilier neuf Alger, achat appartement neuf Algérie, promoteur HYPRO projets",
      },
      /* Open Graph */
      { property: "og:type", content: "website" },
      { property: "og:url", content: PAGE_URL },
      { property: "og:title", content: "Nos Projets Résidentiels HYPRO — Chéraga, Blida & Hamma" },
      {
        property: "og:description",
        content:
          "Trois résidences d'exception en Algérie : Chéraga, Blida et Hamma. Découvrez les appartements HYPRO — modernité, confort et qualité architecturale.",
      },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "HYPRO — Nos résidences en Algérie" },
      /* Twitter / X */
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Projets Résidentiels HYPRO — Algérie" },
      {
        name: "twitter:description",
        content: "Chéraga, Blida, Hamma : trois résidences modernes signées HYPRO. Découvrez nos appartements haut de gamme.",
      },
      { name: "twitter:image", content: OG_IMAGE },
      /* JSON-LD */
      { "script:ld+json": JSON.stringify(projetsJsonLd) } as Record<string, string>,
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
  }),
  component: ProjectsPage,
});


function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <SiteHeader />
      <main className="page-in mx-auto max-w-[1600px] px-5 pb-20 pt-32 md:px-10 md:pb-32 md:pt-44">
        <Reveal>
          <p className="label-xs text-muted-foreground">Portfolio</p>
          <SplitText
            as="h1"
            text="NOS PROJETS"
            className="mt-5 font-display text-[3rem] leading-[0.92] md:text-[7rem]"
          />
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Découvrez nos projets résidentiels conçus pour offrir confort, modernité et qualité de
            vie.
          </p>
        </Reveal>

        <Marquee
          items={["CHERAGA", "BLIDA", "HAMMA"]}
          speed={26}
          className="mt-10 select-none"
          itemClassName="font-display text-[14vw] leading-[0.85] text-wine/10 md:text-[9vw]"
        />

        <div className="mt-14 space-y-4">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80} className="grid items-stretch gap-4 md:grid-cols-3">
              <div className="bento hover-lift flex flex-col justify-between border border-border bg-card p-8">
                <p className="font-display text-[5rem] leading-none text-wine">{p.index}</p>
                <div>
                  <h2 className="font-display text-3xl">{p.name}</h2>
                  <p className="label-xs mt-3 text-muted-foreground">{p.location}</p>
                  {p.completion !== undefined && (
                    <p className="mt-6 text-sm text-muted-foreground">
                      Taux d'achèvement · <span className="text-wine">{p.completion}%</span>
                    </p>
                  )}
                </div>
              </div>
              <ProjectCard project={p} size="lg" className="md:col-span-2" />
            </Reveal>
          ))}
        </div>
        <ScrollText
          text="CONSTRUIRE · HABITER · DURER"
          distance={220}
          className="mt-16 font-display text-[12vw] leading-none text-charcoal/10 md:text-[8vw]"
        />
      </main>
      <ContactSection />
      <SiteFooter />
    </div>
  );
}
