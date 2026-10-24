import { Flame, Gem } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { track, waLink } from "@/lib/api";
import { Reveal, SectionHead, btnGold, btnPrimary } from "./shared";

export default function Pricing() {
  const { data } = useSite();
  const cfg = data.config;
  const plans = cfg.plans || [];

  const choose = (plan) => {
    track("click", `plan_${plan.id}`);
    const msg = plan.message || cfg.whatsapp.messages.default;
    window.open(waLink(cfg.links.whatsappNumber, msg), "_blank", "noopener");
  };

  return (
    <section id="planos" className="relative px-5 md:px-10 py-20 md:py-28" data-testid="pricing-section">
      <div className="max-w-6xl mx-auto">
        <SectionHead
          eyebrow="PLANOS VIP"
          title="Escolha como quer entrar"
          subtitle="Sem checkout complicado: você fala direto comigo no WhatsApp e recebe o acesso pelo Telegram."
          testid="pricing-head"
        />

        <div className="grid md:grid-cols-3 gap-5 md:gap-6 items-stretch" data-testid="plans-grid">
          {plans.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.1} className="h-full">
              <div
                className={`relative h-full rounded-3xl p-7 flex flex-col bg-[var(--c-card)] ${
                  p.highlighted ? "beam-card md:-translate-y-2 glow-gold" : "border border-white/8"
                }`}
                data-testid={`plan-card-${p.id}`}
              >
                {p.badge && (
                  <span
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 text-[10px] font-mono-accent tracking-[0.15em] uppercase ${
                      p.highlighted
                        ? "bg-[var(--c-gold)] text-black"
                        : "bg-[var(--c-card)] border border-[var(--c-rosa)]/40 text-[var(--c-rosa)]"
                    }`}
                    data-testid={`plan-badge-${p.id}`}
                  >
                    {p.highlighted ? <Flame size={11} /> : <Gem size={11} />} {p.badge}
                  </span>
                )}
                <p className="font-mono-accent text-[11px] tracking-[0.25em] uppercase text-white/50 mt-2">
                  {p.name}
                </p>
                <div className="mt-4 flex items-end gap-3">
                  <span className="font-serif-display text-4xl md:text-5xl text-[var(--c-text)]" data-testid={`plan-price-${p.id}`}>
                    {p.price}
                  </span>
                  {p.oldPrice && (
                    <span className="text-sm text-white/35 line-through mb-1.5">{p.oldPrice}</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-[var(--c-muted)]">{p.duration}</p>
                <div className="flex-1" />
                <button
                  onClick={() => choose(p)}
                  className={`${p.highlighted ? btnPrimary : btnGold} mt-8 w-full`}
                  data-testid={`plan-cta-${p.id}`}
                >
                  {p.cta}
                </button>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <p className="mt-8 text-center text-xs text-white/40" data-testid="pricing-note">
            Pagamento e atendimento feitos diretamente comigo, pelo WhatsApp.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
