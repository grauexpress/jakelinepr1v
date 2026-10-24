import { motion } from "framer-motion";
import { BadgeCheck, Gem } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { imgUrl } from "@/lib/api";
import { Reveal, SectionHead, Stars } from "./shared";

const DistBar = ({ label, value, delay }) => (
  <div className="flex items-center gap-3" data-testid={`dist-bar-${label}`}>
    <span className="font-mono-accent text-[10px] text-white/50 w-10 shrink-0">{label}★</span>
    <div className="h-1.5 flex-1 rounded-full bg-white/8 overflow-hidden">
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-[var(--c-gold)] to-[var(--c-accent)]"
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
    <span className="font-mono-accent text-[10px] text-white/60 w-9 text-right">{value}%</span>
  </div>
);

export default function SocialProof() {
  const { data } = useSite();
  const cfg = data.config;
  const sp = cfg.socialProof;
  const items = data.testimonials || [];
  const featured = [...items].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  return (
    <section className="relative px-5 md:px-10 py-20 md:py-28" data-testid="social-proof-section">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(92,22,46,0.35),transparent_55%)] pointer-events-none" />
      <div className="relative max-w-6xl mx-auto">
        <SectionHead eyebrow="PROVA SOCIAL" title={sp.title} subtitle={sp.subtitle} testid="social-proof-head" />

        <Reveal className="mb-12 md:mb-16">
          <div className="rounded-3xl border border-white/8 bg-[var(--c-card)] p-6 md:p-10 grid md:grid-cols-[auto_1fr] gap-8 md:gap-14 items-center">
            <div className="text-center md:text-left">
              <div className="font-serif-display text-6xl md:text-7xl text-[var(--c-text)]" data-testid="rating-value">
                {sp.rating}
                <span className="text-2xl md:text-3xl text-white/40">/5</span>
              </div>
              <div className="mt-3 flex justify-center md:justify-start">
                <Stars n={5} size={18} testid="rating-stars" />
              </div>
              <p className="mt-3 text-xs text-[var(--c-muted)]" data-testid="rating-count">
                Baseado em {sp.totalReviews} avaliações
              </p>
            </div>
            <div className="space-y-2.5" data-testid="rating-distribution">
              {(sp.distribution || []).map((v, i) => (
                <DistBar key={i} label={5 - i} value={v} delay={i * 0.08} />
              ))}
            </div>
          </div>
        </Reveal>

        <div
          className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2 md:grid md:grid-cols-3 md:overflow-visible"
          data-testid="testimonials-list"
        >
          {featured.map((t, i) => (
            <Reveal
              key={t.id}
              delay={i * 0.06}
              className="snap-start shrink-0 w-[82vw] max-w-[320px] md:w-auto md:max-w-none"
              testid={`testimonial-card-${t.id}`}
            >
              <div className="h-full rounded-3xl border border-white/8 bg-[var(--c-card)] p-6 flex flex-col transition-[border-color,transform] duration-300 hover:border-[var(--c-rosa)]/30 hover:-translate-y-1">
                <div className="flex items-center gap-3">
                  <img
                    src={imgUrl(t.avatar)}
                    alt={t.name}
                    loading="lazy"
                    className="h-11 w-11 rounded-full object-cover border border-[var(--c-gold)]/30"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-[var(--c-text)] truncate">{t.name}</p>
                    {t.username && <p className="text-[11px] text-[var(--c-muted)] truncate">{t.username}</p>}
                  </div>
                  {t.isVip && (
                    <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-[var(--c-gold)]/40 bg-[var(--c-gold)]/10 px-2.5 py-1 text-[9px] font-mono-accent tracking-[0.15em] text-[var(--c-gold)]">
                      <Gem size={10} /> VIP
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <Stars n={t.stars} />
                  <span className="text-[10px] font-mono-accent text-white/40">{t.date}</span>
                  {t.verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400">
                      <BadgeCheck size={12} /> verificado
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/75 flex-1">“{t.text}”</p>
                {t.plan && (
                  <p className="mt-4 text-[10px] font-mono-accent tracking-[0.15em] uppercase text-[var(--c-rosa)]">
                    {t.plan}
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
