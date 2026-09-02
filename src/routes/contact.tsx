import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ContactSection } from "@/components/site/ContactSection";
import { Reveal } from "@/components/site/Reveal";
import { contact } from "@/data/projects";

const SITE_URL = "https://www.hypro-dz.com";
const PAGE_URL = `${SITE_URL}/contact`;
const OG_IMAGE = `${SITE_URL}/og-cover.jpg`;

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  url: PAGE_URL,
  name: "Contactez HYPRO — Promoteur Immobilier en Algérie",
  description:
    "Contactez l'équipe HYPRO pour toute demande d'information sur nos résidences à Chéraga, Blida et Hamma. Nous vous accompagnons dans votre projet immobilier en Algérie.",
  inLanguage: "fr-DZ",
  isPartOf: { "@type": "WebSite", url: SITE_URL, name: "HYPRO" },
  mainEntity: {
    "@type": "RealEstateAgent",
    name: "HYPRO — Promotion Immobilière",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Cité Makoudi 2",
      addressLocality: "El Alia",
      addressRegion: "Alger",
      addressCountry: "DZ",
    },
    email: "contact@hypro-dz.com",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      opens: "08:30",
      closes: "17:30",
    },
  },
};

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact HYPRO — Parlons de Votre Projet Immobilier en Algérie" },
      {
        name: "description",
        content:
          "Contactez HYPRO, promoteur immobilier à Alger. Notre équipe est disponible pour répondre à toutes vos questions sur nos résidences à Chéraga, Blida et Hamma. Téléphone, email, formulaire en ligne.",
      },
      {
        name: "keywords",
        content:
          "contact HYPRO, promoteur immobilier Alger, agence immobilière Algérie, renseignements appartement, projet immobilier Alger, El Alia Alger, achat appartement Algérie, investissement immobilier",
      },
      /* Open Graph */
      { property: "og:type", content: "website" },
      { property: "og:url", content: PAGE_URL },
      { property: "og:title", content: "Contactez HYPRO — Votre Projet Immobilier Commence Ici" },
      {
        property: "og:description",
        content:
          "Vous avez un projet immobilier ? L'équipe HYPRO est à votre écoute. Renseignements, visites et accompagnement personnalisé à Alger.",
      },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "HYPRO — Contactez notre équipe immobilière" },
      /* Twitter / X */
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Contact HYPRO — Promoteur Immobilier en Algérie" },
      {
        name: "twitter:description",
        content: "Parlez-nous de votre projet. Notre équipe HYPRO vous répond rapidement.",
      },
      { name: "twitter:image", content: OG_IMAGE },
      /* JSON-LD */
      { "script:ld+json": JSON.stringify(contactJsonLd) } as Record<string, string>,
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
  }),
  component: ContactPage,
});


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

function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="page-in mx-auto max-w-[1600px] px-5 pt-32 md:px-10 md:pt-44">
        <Reveal>
          <p className="label-xs text-muted-foreground">Contact</p>
          <h1 className="mt-5 font-display text-[3rem] leading-[0.9] md:text-[7rem]">
            PARLONS DE
            <br />
            VOTRE PROJET
          </h1>
        </Reveal>

        <Reveal delay={80} className="mt-12">
          <LazyMap
            title="Carte — Cité Makoudi 2, El Alia, Alger"
            className="bento h-72 w-full overflow-hidden border border-border md:h-96"
            src={`https://www.google.com/maps?q=${encodeURIComponent(contact.address)}&output=embed`}
          />
        </Reveal>
      </main>
      <ContactSection />
      <SiteFooter />
    </div>
  );
}
