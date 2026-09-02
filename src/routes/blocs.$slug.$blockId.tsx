import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Layers } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ContactSection } from "@/components/site/ContactSection";
import { Reveal } from "@/components/site/Reveal";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { VrButton } from "@/components/site/VrButton";
import { SplitText, ScrollText } from "@/components/site/Motion";
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

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <SiteHeader />

      <main className="page-in mx-auto max-w-[1600px] px-5 pb-20 pt-28 md:px-10 md:pb-32 md:pt-40">
        <Reveal>
          <Link
            to="/projets/$slug"
            params={{ slug: project.slug }}
            className="label-xs group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-wine"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            {project.shortName}
          </Link>
        </Reveal>

        {/* BLOC HEADER */}
        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
          <Reveal className="bento grain-gold relative overflow-hidden border border-border bg-charcoal p-8 text-charcoal-foreground md:p-14">
            <span className="label-xs inline-flex items-center gap-2 rounded-full bg-charcoal-foreground/10 px-4 py-2">
              <Layers className="size-3.5 text-gold" /> Architecture
            </span>
            <SplitText
              as="h1"
              text={block.name.toUpperCase()}
              stagger={80}
              className="mt-8 font-display text-[3.4rem] leading-[0.9] md:text-[7rem]"
            />
            <p className="mt-6 max-w-xl font-display text-[1.6rem] leading-tight text-gold md:text-[2.4rem]">
              {block.headline}
            </p>
            <p className="mt-6 max-w-2xl leading-relaxed text-charcoal-foreground/70">
              {block.desc}
            </p>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {block.stats.map((s, i) => (
              <Reveal
                key={s.label}
                delay={100 + i * 80}
                className={cn(
                  "bento hover-lift flex items-baseline justify-between gap-4 border border-border p-6 md:p-8",
                  i === 0 ? "bg-wine text-wine-foreground" : "bg-card",
                )}
              >
                <p
                  className={cn(
                    "label-xs",
                    i === 0 ? "text-wine-foreground/60" : "text-muted-foreground",
                  )}
                >
                  {s.label}
                </p>
                <p className="font-display text-4xl leading-none md:text-5xl">{s.value}</p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* UNIT TYPES */}
        <section className="mt-16 md:mt-24">
          <Reveal className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div>
              <p className="label-xs text-muted-foreground">Typologies</p>
              <h2 className="mt-4 font-display text-[2.4rem] leading-[0.95] md:text-[4.5rem]">
                LES TYPES
              </h2>
            </div>
            <p className="max-w-sm text-muted-foreground">
              Chaque typologie dispose de sa propre visite immersive 360° et de son relevé de
              surfaces.
            </p>
          </Reveal>

          <div className="mt-10 space-y-4">
            {block.units.map((u, i) => (
              <Reveal key={u.code} delay={i * 90}>
                <article className="bento group relative overflow-hidden border border-border bg-card transition-colors duration-700 hover:border-wine/30">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-32 -top-32 size-80 rounded-full bg-wine/[0.07] opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                  />
                  <div className="relative grid gap-8 p-7 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:p-10">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="label-xs rounded-full bg-charcoal px-3 py-1.5 text-charcoal-foreground">
                          {u.code}
                        </span>
                        <span className="label-xs text-wine">{u.tag}</span>
                      </div>
                      <h3 className="mt-6 font-display text-[2.4rem] leading-[0.95] md:text-[3.4rem]">
                        {u.name}
                      </h3>
                      <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
                        {u.desc}
                      </p>
                      <VrButton
                        href={project.vrUrl}
                        poster={u.poster}
                        title={`${u.name} — ${block.name}`}
                        variant="outline"
                        className="mt-8"
                        label={`Visite VR — ${u.name}`}
                      />
                    </div>

                    {u.surfaces && (
                      <div className="min-w-0">
                        <div className="rounded-[1.4rem] border border-border bg-sand/50 p-6 md:p-7">
                          <div className="flex items-baseline justify-between gap-3">
                            <p className="label-xs text-muted-foreground">Relevé de surfaces</p>
                            <p className="label-xs text-wine">m²</p>
                          </div>
                          <ul className="mt-5 grid gap-x-8 gap-y-1 sm:grid-cols-2">
                            {u.surfaces.map((s, j) => (
                              <li
                                key={s.label + j}
                                className="flex items-baseline justify-between gap-4 border-b border-border/70 py-2.5 last:border-0"
                              >
                                <span className="truncate text-sm text-muted-foreground">
                                  {s.label}
                                </span>
                                <span className="shrink-0 font-display text-lg">{s.value}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {u.totals && (
                          <div className="mt-4 grid gap-3 sm:grid-cols-3">
                            {u.totals.map((t, k) => (
                              <div
                                key={t.label}
                                className={cn(
                                  "rounded-[1.2rem] border border-border p-5",
                                  k === u.totals!.length - 1
                                    ? "bg-wine text-wine-foreground"
                                    : "bg-card",
                                )}
                              >
                                <p
                                  className={cn(
                                    "label-xs",
                                    k === u.totals!.length - 1
                                      ? "text-wine-foreground/60"
                                      : "text-muted-foreground",
                                  )}
                                >
                                  {t.label}
                                </p>
                                <p className="mt-3 font-display text-[1.8rem] leading-none">
                                  {t.value}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <ScrollText
          text={`${block.name.toUpperCase()} · ${project.shortName.toUpperCase()} · HYPRO`}
          distance={240}
          className="mt-16 font-display text-[12vw] leading-none text-wine/10 md:mt-24 md:text-[8vw]"
        />

        {siblings.length > 0 && (
          <Reveal className="mt-8 grid gap-4 md:grid-cols-2">
            {siblings.map((b) => (
              <Link
                key={b.id}
                to="/blocs/$slug/$blockId"
                params={{ slug: project.slug, blockId: b.id }}
                className="bento group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border border-border bg-card p-8 transition-colors hover:bg-sand"
              >
                <div className="min-w-0">
                  <p className="label-xs text-muted-foreground">Bloc suivant</p>
                  <p className="mt-4 font-display text-3xl">{b.name}</p>
                </div>
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-charcoal text-charcoal-foreground transition-transform group-hover:rotate-45">
                  <ArrowUpRight className="size-5" />
                </span>
              </Link>
            ))}
          </Reveal>
        )}
      </main>

      <ContactSection />
      <SiteFooter />
    </div>
  );
}
