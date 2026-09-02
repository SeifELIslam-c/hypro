import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Facebook, Instagram } from "lucide-react";
import { contact } from "@/data/projects";
import detailImg from "@/assets/detail-1.webp";
import { BrandMark } from "./BrandMark";
import { Reveal } from "./Reveal";
import { Marquee, Magnetic, Parallax, SplitText } from "./Motion";

const navLinks = [
  { to: "/", label: "Accueil", n: "01" },
  { to: "/projets", label: "Projets", n: "02" },
  { to: "/a-propos", label: "À propos", n: "03" },
  { to: "/contact", label: "Contact", n: "04" },
] as const;

function DeveloperStar() {
  const [active, setActive] = useState(false);

  const handleClick = async () => {
    setActive(true);
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        if (ctx.state === "suspended") {
          await ctx.resume();
        }

        // 4-Note Sparkling Chime (C5 -> E5 -> G5 -> C6)
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);

          gain.gain.setValueAtTime(0.22, ctx.currentTime + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.28);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(ctx.currentTime + idx * 0.07);
          osc.stop(ctx.currentTime + idx * 0.07 + 0.28);
        });
      }
    } catch {
      // Audio context fallback
    }

    setTimeout(() => setActive(false), 5000);
  };

  return (
    <div className="relative inline-flex items-center gap-2">
      {/* Click Me Badge */}
      <button
        type="button"
        onClick={handleClick}
        className="group relative inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[0.65rem] font-medium tracking-wider uppercase text-emerald-400 backdrop-blur-sm transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-500/20 active:scale-95"
      >
        <span className="inline-block animate-bounce">Click me</span>
        {/* Custom Green Star Illustration */}
        <svg
          className={`size-3.5 text-emerald-400 transition-transform duration-700 ${
            active ? "rotate-[180deg] scale-125" : "group-hover:rotate-45"
          }`}
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
        </svg>
      </button>

      {/* Pop-up Credit Card Badge */}
      <div
        className={`absolute bottom-full left-1/2 mb-3 -translate-x-1/2 whitespace-nowrap rounded-2xl border border-emerald-500/40 bg-charcoal/95 px-4 py-2.5 text-xs text-emerald-200 shadow-[0_8px_30px_rgba(16,185,129,0.3)] backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          active
            ? "translate-y-0 opacity-100 scale-100"
            : "pointer-events-none translate-y-3 opacity-0 scale-90"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="relative flex size-2.5 items-center justify-center">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-sans font-medium text-emerald-100">
            Designed & Developed by <strong className="font-semibold text-emerald-400">Seif El Islam</strong>
          </span>
        </div>
        {/* Arrow pointer */}
        <div className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 border-b border-r border-emerald-500/40 bg-charcoal/95" />
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden rounded-t-[2.5rem] bg-charcoal text-charcoal-foreground md:rounded-t-[3.5rem]">
      <Parallax speed={80} className="pointer-events-none absolute inset-0">
        <img
          src={detailImg}
          alt=""
          aria-hidden
          loading="lazy"
          className="size-full scale-110 object-cover opacity-[0.08]"
        />
      </Parallax>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-charcoal/60 via-transparent to-charcoal" />

      <div className="relative mx-auto max-w-[1600px] px-5 pb-10 pt-16 md:px-10 md:pt-24">
        <Reveal className="flex items-center gap-4">
          <BrandMark ring={false} className="size-12 md:size-14" imgClassName="w-full" />
          <span className="font-display text-3xl tracking-[0.14em]">HYPRO</span>
        </Reveal>

        <SplitText
          as="h2"
          text="CONSTRUISONS L'AVENIR ENSEMBLE."
          stagger={90}
          className="mt-10 max-w-[13ch] font-display text-[clamp(2.6rem,12vw,3.4rem)] leading-[0.94] md:text-[clamp(4rem,7vw,7rem)] md:leading-[0.92]"
        />

        <Reveal delay={120} className="mt-10">
          <Magnetic>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-4 rounded-full bg-gold px-7 py-4 text-gold-foreground transition-colors duration-500 hover:bg-charcoal-foreground"
            >
              <span className="label-xs">Démarrer une conversation</span>
              <span className="grid size-8 place-items-center rounded-full bg-gold-foreground/10 transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight className="size-4" />
              </span>
            </Link>
          </Magnetic>
        </Reveal>

        <div className="mt-16 grid gap-12 border-t border-charcoal-foreground/15 pt-12 md:mt-20 md:grid-cols-3">
          <div>
            <p className="label-xs text-charcoal-foreground/40">Navigation</p>
            <ul className="mt-6 space-y-1">
              {navLinks.map((l, i) => (
                <Reveal as="li" key={l.to} delay={i * 70}>
                  <Link
                    to={l.to}
                    className="group flex items-baseline gap-4 border-b border-charcoal-foreground/10 py-3 transition-colors hover:border-gold/40"
                  >
                    <span className="label-xs text-charcoal-foreground/30 transition-colors group-hover:text-gold">
                      {l.n}
                    </span>
                    <span className="relative overflow-hidden font-display text-2xl leading-none md:text-3xl">
                      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
                        {l.label}
                      </span>
                      <span className="absolute inset-0 block translate-y-full text-gold transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0">
                        {l.label}
                      </span>
                    </span>
                    <ArrowUpRight className="ml-auto size-4 -translate-x-1 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal delay={100}>
            <p className="label-xs text-charcoal-foreground/40">Contact</p>
            <ul className="mt-6 space-y-2 text-charcoal-foreground/80">
              {contact.phones.map((p) => (
                <li key={p}>
                  <a
                    href={`tel:${p.replace(/\s/g, "")}`}
                    className="relative inline-block after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-500 hover:text-gold hover:after:w-full"
                  >
                    {p}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href={`mailto:${contact.email.toLowerCase()}`}
                  className="relative inline-block break-all after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-500 hover:text-gold hover:after:w-full"
                >
                  {contact.email}
                </a>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={180}>
            <p className="label-xs text-charcoal-foreground/40">Adresse</p>
            <p className="mt-6 max-w-xs text-lg leading-relaxed text-charcoal-foreground/80">
              {contact.address}
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { href: contact.facebook, Icon: Facebook, label: "Facebook HYPRO" },
                { href: contact.instagram, Icon: Instagram, label: "Instagram HYPRO" },
              ].map(({ href, Icon, label }) => (
                <Magnetic key={label} strength={0.35}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="grid size-11 place-items-center rounded-full border border-charcoal-foreground/20 transition-colors duration-500 hover:border-gold hover:bg-gold hover:text-gold-foreground"
                  >
                    <Icon className="size-4" />
                  </a>
                </Magnetic>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <Marquee
        items={["HYPRO", "IMMOBILIER", "CONSTRUCTION", "ALGÉRIE"]}
        speed={42}
        className="relative select-none py-2"
        itemClassName="font-display text-[16vw] leading-[0.85] text-charcoal-foreground/[0.06] md:text-[10vw]"
      />

      <div className="relative mx-auto flex max-w-[1600px] flex-col gap-2 border-t border-charcoal-foreground/15 px-5 py-6 text-xs text-charcoal-foreground/45 sm:flex-row sm:items-center sm:justify-between md:px-10">
        <div className="flex items-center gap-2">
          <p>© 2026 HYPRO — Tous droits réservés</p>
          <DeveloperStar />
        </div>
        <p className="label-xs">El Alia · Alger</p>
      </div>
    </footer>
  );
}
