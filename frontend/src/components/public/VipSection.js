import { Check, Gem } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { Reveal } from "./shared";

export default function VipSection() {
  const { data } = useSite();
  const vip = data.config.vip;

  return (
    <section className="relative px-5 md:px-10 py-20 md:py-28" data-testid="vip-section">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.07),transparent_55%)] pointer-events-none" />
      <div className="relative max-w-5xl mx-auto text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--c-gold)]/40 bg-[var(--c-gold)]/10 px-4 py-1.5 font-mono-accent text-[10px] tracking-[0.25em] uppercase text-[var(--c-gold)]">
            <Gem size={12} /> Acesso exclusivo
          </span>
          <h2 className="mt-6 font-serif-display text-4xl md:text-6xl text-[var(--c-text)]" data-testid="vip-title">
            {vip.title}
          </h2>
          <p className="mt-5 max-w-2xl mx-auto text-base md:text-lg text-[var(--c-muted)]" data-testid="vip-subtitle">
            {vip.subtitle}
          </p>
        </Reveal>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-left" data-testid="vip-benefits">
          {(vip.benefits || []).map((b, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-[var(--c-card)] px-4 py-3.5 transition-colors hover:border-[var(--c-gold)]/30">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--c-gold)]/12 text-[var(--c-gold)]">
                  <Check size={14} />
                </span>
                <span className="text-sm text-white/85">{b}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
