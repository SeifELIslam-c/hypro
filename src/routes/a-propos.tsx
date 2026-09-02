import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ContactSection } from "@/components/site/ContactSection";
import { Reveal } from "@/components/site/Reveal";
import { Marquee, Parallax, SplitText, Magnetic } from "@/components/site/Motion";
import { ManifestoSection } from "@/components/site/ManifestoSection";
import { images } from "@/data/projects";

const SITE_URL = "https://www.hypro-dz.com";
const PAGE_URL = `${SITE_URL}/a-propos`;
const OG_IMAGE = `${SITE_URL}/og-cover.jpg`;

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url: PAGE_URL,
  name: "À propos de HYPRO — Promoteur Immobilier en Algérie",
  description:
    "Découvrez l'histoire, les valeurs et l'expertise de HYPRO, promoteur immobilier algérien. Depuis sa création, HYPRO s'engage à livrer des résidences de qualité architecturale exceptionnelle à Chéraga, Blida et Hamma.",
  inLanguage: "fr-DZ",
  isPartOf: { "@type": "WebSite", url: SITE_URL, name: "HYPRO" },
};

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos de HYPRO — Promoteur Immobilier Engagé en Algérie" },
      {
        name: "description",
        content:
          "HYPRO est un promoteur immobilier algérien engagé dans la qualité architecturale, les finitions haut de gamme et le respect des délais. Découvrez notre vision, nos valeurs et nos projets à Chéraga, Blida et Hamma.",
      },
      {
        name: "keywords",
        content:
          "à propos HYPRO, promoteur immobilier Algérie, histoire HYPRO, valeurs immobilier, expertise construction Algérie, résidences de qualité, promoteur sérieux Alger, architecture contemporaine Algérie",
      },
      /* Open Graph */
      { property: "og:type", content: "website" },
      { property: "og:url", content: PAGE_URL },
      { property: "og:title", content: "À propos de HYPRO — Bâtir avec Excellence en Algérie" },
      {
        property: "og:description",
        content:
          "HYPRO : un promoteur immobilier algérien qui transforme votre rêve en réalité. Qualité, rigueur et excellence architecturale à Chéraga, Blida et Hamma.",
      },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "HYPRO — Équipe et vision du promoteur immobilier" },
      /* Twitter / X */
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "À propos de HYPRO — Promoteur Immobilier Algérie" },
      {
        name: "twitter:description",
        content: "Qualité, rigueur et excellence architecturale. Découvrez l'histoire et les valeurs de HYPRO.",
      },
      { name: "twitter:image", content: OG_IMAGE },
      /* JSON-LD */
      { "script:ld+json": JSON.stringify(aboutJsonLd) } as Record<string, string>,
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
  }),
  component: AboutPage,
});


const services = [
  "Résidences individuelles et collectives",
  "Projets commerciaux",
  "Villas",
  "Terrains",
  "Investissements et partenariats",
];

const why = [
  "Architecture de qualité",
  "Finitions haut de gamme",
  "Emplacements stratégiques",
  "Accompagnement personnalisé",
  "Transactions rapides et sécurisées",
  "Habitat durable",
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-[1600px] px-5 pb-20 pt-32 md:px-10 md:pb-32 md:pt-44">
        <Reveal>
          <p className="label-xs text-muted-foreground">L'entreprise</p>
          <h1 className="mt-5 font-display text-[3rem] leading-[0.9] md:text-[7rem]">
            À PROPOS
            <br />
            DE HYPRO
          </h1>
          <p className="mt-10 max-w-2xl font-display text-[1.6rem] leading-tight text-wine md:text-[2.4rem]">
            « Le partenaire qui transforme votre rêve immobilier en réalité. »
          </p>
        </Reveal>

        <Reveal delay={100} className="bento mt-12 border border-border">
          <Parallax speed={90} scale className="h-[46vh] md:h-[62vh]">
            <img
              src={images.heroImg}
              alt="Réalisation architecturale HYPRO"
              loading="lazy"
              className="h-[52vh] w-full object-cover md:h-[70vh]"
            />
          </Parallax>
        </Reveal>

        <Marquee
          items={["QUALITÉ", "DURABILITÉ", "PRÉCISION", "CONFIANCE"]}
          speed={32}
          reverse
          className="mt-12 border-y border-border py-5"
          itemClassName="label-xs text-muted-foreground"
        />

        {/* COMPANY */}
        <section className="mt-20 grid gap-10 lg:grid-cols-[minmax(0,0.35fr)_minmax(0,1fr)]">
          <Reveal>
            <p className="label-xs text-muted-foreground">01 — À propos de l'entreprise</p>
          </Reveal>
          <Reveal delay={80}>
            <SplitText
              as="h2"
              stagger={30}
              text="L'opérateur qui œuvre pour rendre votre « Rêve Logement », une réalité bien réelle."
              className="font-display text-[1.9rem] leading-tight md:text-[3.2rem]"
            />
            <div className="mt-8 max-w-3xl space-y-5 text-lg leading-relaxed text-muted-foreground">
              <p>
                HYPRO intervient dans la promotion et le développement de l'immobilier à travers des
                projets résidentiels conçus avec art et intelligence, et réalisés avec
                professionnalisme et beaucoup d'attention.
              </p>
              <p>
                La qualité architecturale, le haut niveau des finitions et l'intégration des
                nouvelles technologies sont suivis également par le strict respect des délais et des
                procédures.
              </p>
              <p>
                HYPRO est doté d'un personnel de haute qualité et d'un panel de partenaires bien
                sélectionnés.
              </p>
            </div>
            <Magnetic className="mt-10">
            <Link
              to="/contact"
              className="label-xs group inline-flex items-center gap-2 rounded-full bg-wine px-7 py-4 text-wine-foreground transition-colors hover:bg-charcoal"
            >
              Contactez-nous aujourd'hui
              <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
            </Link>
            </Magnetic>
          </Reveal>
        </section>

        {/* MISSION */}
        <section className="mt-20 grid gap-4 md:grid-cols-5">
          <Reveal className="bento border border-border bg-wine p-10 text-wine-foreground md:col-span-3">
            <p className="label-xs text-wine-foreground/60">02 — Notre mission</p>
            <p className="mt-8 font-display text-[1.9rem] leading-tight md:text-[3rem]">
              Offrir des services immobiliers sur mesure et de qualité, en plaçant la satisfaction
              client au cœur de nos priorités, tout en créant des espaces alliant confort, modernité
              et respect de l'environnement.
            </p>
          </Reveal>
          <Reveal delay={80} className="bento border border-border md:col-span-2">
            <Parallax speed={70} scale className="size-full min-h-64">
              <img
                src={images.interiorImg}
                alt="Intérieur d'une résidence HYPRO"
                loading="lazy"
                className="size-full min-h-64 object-cover"
              />
            </Parallax>
          </Reveal>
        </section>

        {/* SERVICES */}
        <section className="mt-20">
          <Reveal>
            <p className="label-xs text-muted-foreground">03 — Nos services</p>
            <h2 className="mt-4 font-display text-[2.4rem] md:text-[4.5rem]">NOS SERVICES</h2>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-6">
            {services.map((s, i) => (
              <Reveal
                key={s}
                delay={i * 70}
                className={`h-full ${i < 2 ? "md:col-span-3" : "md:col-span-2"}`}
              >
                <article className="bento group relative flex h-full flex-col justify-between overflow-hidden border border-border bg-card p-8 transition-all duration-500 hover:-translate-y-1 hover:border-wine/25 hover:shadow-[var(--shadow-soft)] md:p-9">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-wine/10 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                  />
                  <div className="relative flex items-start justify-between gap-4">
                    <p className="font-display text-4xl leading-none text-wine">0{i + 1}</p>
                    <span className="grid size-10 place-items-center rounded-full border border-wine/15 text-wine transition-all duration-500 group-hover:rotate-45 group-hover:bg-wine group-hover:text-wine-foreground">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                  <h3 className="relative mt-14 font-display text-2xl leading-tight md:text-[1.9rem]">
                    {s}
                  </h3>
                  <span className="relative mt-6 block h-px w-8 origin-left bg-wine/40 transition-transform duration-700 group-hover:scale-x-[3]" />
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* VISION */}
        <Reveal className="bento mt-20 border border-border bg-charcoal p-10 text-charcoal-foreground md:p-16">
          <p className="label-xs text-charcoal-foreground/60">04 — Notre vision</p>
          <p className="mt-8 max-w-5xl font-display text-[2rem] leading-tight md:text-[3.6rem]">
            Devenir une référence incontournable en immobilier, en offrant des solutions innovantes
            et durables, adaptées aux besoins des clients, tout en contribuant au{" "}
            <span className="text-gold">bien-être des communautés</span>.
          </p>
        </Reveal>

        {/* WHY */}
        <section className="mt-20">
          <Reveal>
            <p className="label-xs text-muted-foreground">05 — Nos engagements</p>
            <h2 className="mt-4 font-display text-[2.4rem] md:text-[4.5rem]">POURQUOI HYPRO ?</h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {why.map((w, i) => (
              <Reveal
                key={w}
                delay={i * 70}
                className={`h-full ${i === 2 || i === 5 ? "sm:col-span-2 md:col-span-2" : ""}`}
              >
                <article
                  className={`bento group relative flex h-full flex-col justify-between overflow-hidden border border-border p-8 transition-all duration-500 hover:-translate-y-1 md:p-9 ${
                    i === 0 ? "bg-charcoal text-charcoal-foreground" : "bg-card hover:border-wine/25"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute -bottom-16 -right-16 size-48 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100 ${
                      i === 0 ? "bg-gold/25" : "bg-wine/10"
                    }`}
                  />
                  <p
                    className={`relative font-display text-4xl leading-none ${i === 0 ? "text-gold" : "text-wine"}`}
                  >
                    0{i + 1}
                  </p>
                  <div className="relative mt-14">
                    <h3 className="font-display text-2xl leading-tight md:text-[1.9rem]">{w}</h3>
                    <span
                      className={`mt-5 block h-px w-8 origin-left transition-transform duration-700 group-hover:scale-x-[3] ${
                        i === 0 ? "bg-gold" : "bg-wine/40"
                      }`}
                    />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

      </main>

      <ManifestoSection />

      <ContactSection />
      <SiteFooter />
    </div>
  );
}
