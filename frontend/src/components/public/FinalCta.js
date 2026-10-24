import { Flame, MessageCircle } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { track, waLink } from "@/lib/api";
import { Reveal, btnGold, btnPrimary } from "./shared";

export default function FinalCta() {
  const { data } = useSite();
  const cfg = data.config;
  const cta = cfg.finalCta;

  const goFree = () => {
    track("click", "free");
    window.open(cfg.links.telegramFree, "_blank", "noopener");
  };
  const goWa = () => {
    track("click", "whatsapp");
    window.open(waLink(cfg.links.whatsappNumber, cfg.whatsapp.messages.default), "_blank", "noopener");
  };

  return (
    <section className="relative px-5 md:px-10 py-24 md:py-36 overflow-hidden" data-testid="final-cta-section">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(92,22,46,0.55),transparent_65%)] pointer-events-none" />
      <div className="relative max-w-3xl mx-auto text-center">
        <Reveal>
          <h2 className="font-serif-display text-3xl md:text-5xl leading-[1.1] text-[var(--c-text)]" data-testid="final-cta-title">
            {cta.title}
          </h2>
          <p className="mt-5 text-base md:text-lg text-[var(--c-muted)]" data-testid="final-cta-text">
            {cta.text}
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="mt-9 flex flex-col sm:flex-row justify-center gap-3">
            <button onClick={goFree} className={btnPrimary} data-testid="final-cta-free">
              <Flame size={18} /> {cta.ctaFree}
            </button>
            <button onClick={goWa} className={btnGold} data-testid="final-cta-whatsapp">
              <MessageCircle size={18} /> {cta.ctaVip}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
