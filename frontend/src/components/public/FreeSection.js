import { Eye, Send } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { imgUrl, track } from "@/lib/api";
import { Reveal, btnPrimary } from "./shared";

export default function FreeSection() {
  const { data } = useSite();
  const cfg = data.config;
  const free = cfg.free;

  const goFree = () => {
    track("click", "free");
    window.open(cfg.links.telegramFree, "_blank", "noopener");
  };

  return (
    <section className="relative px-5 md:px-10 py-20 md:py-28" data-testid="free-section">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <Reveal className="relative order-2 md:order-1">
          <div className="absolute -inset-4 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,rgba(255,42,112,0.15),transparent_65%)] pointer-events-none" />
          <div className="relative rounded-[2rem] overflow-hidden border border-white/10 aspect-[4/5] max-w-md mx-auto">
            <img
              src={imgUrl(free.image)}
              alt="Grupo FREE"
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0508]/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 px-4 py-3">
              <Eye size={15} className="text-[var(--c-accent)]" />
              <span className="text-xs text-white/80">Prévias gratuitas toda semana</span>
            </div>
          </div>
        </Reveal>

        <div className="order-1 md:order-2">
          <Reveal>
            <p className="font-mono-accent text-[11px] tracking-[0.25em] uppercase text-[var(--c-rosa)] mb-4">
              GRUPO FREE
            </p>
            <h2 className="font-serif-display text-3xl md:text-5xl leading-[1.08] text-[var(--c-text)]" data-testid="free-title">
              {free.title}
            </h2>
            <p className="mt-5 text-base md:text-lg text-[var(--c-muted)] leading-relaxed" data-testid="free-text">
              {free.text}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="mt-6 space-y-3" data-testid="free-benefits">
              {(free.benefits || []).map((b, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--c-accent)]" />
                  {b}
                </li>
              ))}
            </ul>
            <button onClick={goFree} className={`${btnPrimary} mt-8`} data-testid="free-cta">
              <Send size={17} /> {free.cta}
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
