import { Marquee, SplitText, Parallax } from "./Motion";
import { Reveal } from "./Reveal";
import manifestoIllustration from "@/assets/manifesto-illustration.webp";

export function ManifestoSection() {
  return (
    <section className="relative overflow-hidden bg-sand py-20 md:py-32">
      <div className="mx-auto grid max-w-[1600px] items-start gap-10 px-5 md:px-10 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] lg:gap-16">
        <Reveal>
          <figure className="relative mx-auto w-full max-w-[26rem] lg:mx-0">
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-6 rounded-full bg-gold/15 blur-3xl"
            />
            <div className="relative aspect-square overflow-hidden rounded-full border-[6px] border-charcoal shadow-[var(--shadow-lift)]">
              <Parallax speed={60} scale className="size-full">
                <img
                  src={manifestoIllustration}
                  alt="Illustration architecturale des arcades d'une résidence HYPRO au couchant"
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover"
                />
              </Parallax>
              <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-wine/35 via-transparent to-transparent" />
            </div>
          </figure>
        </Reveal>


        <div className="lg:pt-6">
          <p className="label-xs text-wine/70">Notre manifeste</p>
          <SplitText
            as="h2"
            text="La beauté n'est pas"
            className="mt-6 font-display text-[2.8rem] leading-[0.95] md:text-[5.5rem]"
          />
          <SplitText
            as="p"
            delay={180}
            text="un supplément."
            className="font-display text-[2.8rem] italic leading-[0.95] text-gold md:text-[5.5rem]"
          />
          <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            Elle est la précision d'une ombre, la chaleur d'un seuil, le silence entre deux murs.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              { k: "Ombre", v: "Précision" },
              { k: "Seuil", v: "Chaleur" },
              { k: "Mur", v: "Silence" },
            ].map((x, i) => (
              <Reveal key={x.k} delay={120 + i * 90}>
                <div className="bento hover-lift border border-wine/10 bg-card/70 p-5 backdrop-blur-sm">
                  <p className="label-xs text-muted-foreground">{x.k}</p>
                  <p className="mt-4 font-display text-2xl text-wine">{x.v}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <Marquee
        items={["LUMIÈRE", "USAGE", "MATIÈRE", "DURÉE"]}
        speed={30}
        className="mt-14 select-none md:mt-20"
        itemClassName="font-display text-[18vw] leading-[0.8] text-charcoal/10 md:text-[13vw]"
      />
    </section>
  );
}
