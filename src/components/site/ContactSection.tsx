import { useState } from "react";
import { toast } from "sonner";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { contact } from "@/data/projects";
import { Reveal } from "./Reveal";
import { SplitText, Magnetic } from "./Motion";

const services = [
  "Achat d'un bien",
  "Location",
  "Investissement / partenariat",
  "Information sur un projet",
  "Autre demande",
];

export function ContactSection() {
  const [sending, setSending] = useState(false);

  return (
    <section
      id="contact"
      className="relative mx-auto max-w-[1600px] overflow-hidden px-5 py-20 md:px-10 md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-10 size-[28rem] rounded-full bg-[radial-gradient(circle,var(--gold)_0%,transparent_65%)] opacity-[0.14] float-slow"
      />
      <div className="relative grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="label-xs text-muted-foreground">05 — Contact</p>
          </Reveal>
          <div className="mt-6">
            <SplitText
              as="h2"
              text="NOUS SOUHAITONS"
              stagger={80}
              className="font-display text-[2.75rem] leading-[0.95] md:text-[5rem]"
            />
            <SplitText
              as="h2"
              text="VOUS ENTENDRE"
              delay={220}
              stagger={80}
              className="font-display text-[2.75rem] leading-[0.95] text-wine md:text-[5rem]"
            />
          </div>
          <Reveal delay={260}>
            <span className="mt-7 block h-px w-0 animate-[line-draw_1.2s_cubic-bezier(0.22,1,0.36,1)_forwards] bg-gradient-to-r from-gold to-transparent" />
          </Reveal>
          <Reveal delay={320}>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-muted-foreground">
              Vous avez un projet immobilier ou des questions ? Notre équipe est à votre disposition
              pour vous accompagner à chaque étape. Prenez contact avec nous.
            </p>
          </Reveal>
          <Reveal delay={380} className="mt-10 grid gap-3 sm:grid-cols-2">
            <div className="bento hover-lift border border-border bg-card p-6">
              <Phone className="size-4 text-wine" />
              <p className="label-xs mt-4 text-muted-foreground">Téléphone</p>
              <ul className="mt-3 space-y-1 text-sm">
                {contact.phones.map((p) => (
                  <li key={p}>
                    <a href={`tel:${p.replace(/\s/g, "")}`} className="hover:text-wine">
                      {p}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-3">
              <a
                href={`mailto:${contact.email.toLowerCase()}`}
                className="bento block border border-border bg-card p-6 transition-colors hover:bg-sand"
              >
                <Mail className="size-4 text-wine" />
                <p className="label-xs mt-4 text-muted-foreground">Email</p>
                <p className="mt-2 break-all text-sm">{contact.email}</p>
              </a>
              <div className="bento border border-border bg-wine p-6 text-wine-foreground">
                <MapPin className="size-4 text-gold" />
                <p className="label-xs mt-4 text-wine-foreground/60">Adresse</p>
                <p className="mt-2 text-sm">{contact.address}</p>
              </div>
            </div>
          </Reveal>
        </div>


        <Reveal delay={120}>
          <form
            className="bento border border-border bg-card p-6 md:p-10"
            onSubmit={(e) => {
              e.preventDefault();
              setSending(true);
              const form = e.currentTarget;
              setTimeout(() => {
                setSending(false);
                form.reset();
                toast.success("Merci ! Votre demande a bien été enregistrée.", {
                  description: "Notre équipe vous recontactera très prochainement.",
                });
              }, 700);
            }}
          >
            <div className="grid gap-5">
              <Field label="Nom complet" name="nom" type="text" autoComplete="name" />
              <Field label="Adresse Mail" name="email" type="email" autoComplete="email" />
              <Field label="Numéro de téléphone" name="tel" type="tel" autoComplete="tel" />

              <div>
                <label htmlFor="service" className="label-xs text-muted-foreground">
                  Service de sélection
                </label>
                <select
                  id="service"
                  name="service"
                  required
                  className="mt-2 w-full rounded-2xl border border-border bg-background px-5 py-4 text-base outline-none transition-colors focus:border-wine focus:ring-2 focus:ring-wine/20"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Choisissez un service
                  </option>
                  {services.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="label-xs text-muted-foreground">
                  Entrez votre message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="mt-2 w-full resize-none rounded-2xl border border-border bg-background px-5 py-4 text-base outline-none transition-colors focus:border-wine focus:ring-2 focus:ring-wine/20"
                />
              </div>

              <Magnetic className="self-start" strength={0.2}>
                <button
                  type="submit"
                  disabled={sending}
                  className="label-xs group inline-flex items-center justify-center gap-3 rounded-full bg-wine px-8 py-5 text-wine-foreground transition-colors duration-500 hover:bg-charcoal disabled:opacity-60"
                >
                  {sending ? "Envoi en cours…" : "Envoyer ma demande"}
                  <span className="grid size-7 place-items-center rounded-full bg-wine-foreground/10 transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight className="size-4" />
                  </span>
                </button>
              </Magnetic>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
}: {
  label: string;
  name: string;
  type: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="label-xs text-muted-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-2xl border border-border bg-background px-5 py-4 text-base outline-none transition-colors focus:border-wine focus:ring-2 focus:ring-wine/20"
      />
    </div>
  );
}
