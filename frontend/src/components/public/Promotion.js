import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { track, waLink } from "@/lib/api";
import { Reveal, btnWhatsapp } from "./shared";

const pad = (n) => String(n).padStart(2, "0");

export default function Promotion() {
  const { data } = useSite();
  const promo = data.config.promotion;
  const cfg = data.config;
  const [left, setLeft] = useState(null);

  useEffect(() => {
    if (!promo?.enabled || !promo.endsAt) return;
    const end = new Date(promo.endsAt).getTime();
    const tick = () => {
      const diff = end - Date.now();
      if (diff <= 0) {
        setLeft({ expired: true });
        return;
      }
      setLeft({
        expired: false,
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [promo?.enabled, promo?.endsAt]);

  if (!promo?.enabled || !promo.endsAt) return null;
  if (left?.expired && promo.hideAfterExpiry) return null;

  const units = left && !left.expired
    ? [
        { v: pad(left.d), l: "dias" },
        { v: pad(left.h), l: "horas" },
        { v: pad(left.m), l: "min" },
        { v: pad(left.s), l: "seg" },
      ]
    : [];

  const claim = () => {
    track("click", "promo");
    window.open(waLink(cfg.links.whatsappNumber, cfg.whatsapp.messages.promocao), "_blank", "noopener");
  };

  return (
    <section className="relative px-5 md:px-10 py-16 md:py-24" data-testid="promo-section">
      <Reveal>
        <div className="max-w-3xl mx-auto rounded-[2rem] border border-[var(--c-accent)]/30 bg-[radial-gradient(ellipse_at_top,rgba(255,42,112,0.14),transparent_70%)] bg-[var(--c-card)] p-8 md:p-12 text-center glow-accent">
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--c-accent)] px-4 py-1.5 font-mono-accent text-[10px] tracking-[0.25em] uppercase text-white">
            <Zap size={12} /> {promo.title}
          </span>
          {promo.subtitle && <p className="mt-4 text-sm text-[var(--c-muted)]">{promo.subtitle}</p>}

          <div className="mt-6 flex items-center justify-center gap-4">
            {promo.oldPrice && (
              <span className="text-xl text-white/35 line-through" data-testid="promo-old-price">{promo.oldPrice}</span>
            )}
            <span className="font-serif-display text-5xl md:text-6xl text-[var(--c-text)]" data-testid="promo-new-price">
              {promo.newPrice}
            </span>
          </div>

          {units.length > 0 && (
            <div className="mt-8 flex justify-center gap-3" data-testid="promo-countdown">
              {units.map((u) => (
                <div key={u.l} className="w-16 md:w-20 rounded-2xl border border-white/10 bg-black/40 py-3">
                  <div className="font-mono-accent text-2xl md:text-3xl text-[var(--c-gold)]">{u.v}</div>
                  <div className="mt-1 text-[9px] font-mono-accent tracking-[0.2em] uppercase text-white/45">{u.l}</div>
                </div>
              ))}
            </div>
          )}
          {left?.expired && (
            <p className="mt-6 text-sm text-white/50" data-testid="promo-expired">Esta oferta terminou.</p>
          )}

          <button onClick={claim} className={`${btnWhatsapp} mt-8`} data-testid="promo-cta">
            {promo.cta || "QUERO A PROMOÇÃO"}
          </button>
        </div>
      </Reveal>
    </section>
  );
}
