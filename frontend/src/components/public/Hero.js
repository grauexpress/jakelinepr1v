import { motion, useScroll, useTransform } from "framer-motion";
import { Flame, Gem, ShieldCheck } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { imgUrl, track, waLink } from "@/lib/api";
import { btnGold, btnPrimary } from "./shared";

export default function Hero() {
  const { data } = useSite();
  const cfg = data.config;
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, 150]);
  const scale = useTransform(scrollY, [0, 700], [1.06, 1.2]);

  const goFree = () => {
    track("click", "free");
    window.open(cfg.links.telegramFree, "_blank", "noopener");
  };

  const goVip = () => {
    track("click", "vip");
    if (cfg.hero.vipAction === "whatsapp") {
      window.open(waLink(cfg.links.whatsappNumber, cfg.whatsapp.messages.default), "_blank", "noopener");
    } else {
      document.getElementById("planos")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const words = cfg.identity.headline.split(" ");

  return (
    <section className="relative min-h-[94svh] overflow-hidden flex flex-col" data-testid="hero-section">
      <motion.div style={{ y, scale }} className="absolute inset-0" aria-hidden>
        <img
          src={imgUrl(cfg.identity.heroImage)}
          alt={cfg.identity.name}
          className="h-full w-full object-cover object-center"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0508] via-[#0A0508]/55 to-[#0A0508]/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(92,22,46,0.6),transparent_62%)]" />

      <div className="relative z-10 flex items-center justify-between px-5 md:px-10 pt-5">
        <span className="font-serif-display italic text-2xl text-[var(--c-gold)]" data-testid="hero-logo">
          {cfg.identity.logoText || "JS"}
        </span>
        <span
          className="font-mono-accent text-[10px] tracking-[0.22em] text-white/75 uppercase flex items-center gap-2 border border-white/15 rounded-full px-3.5 py-1.5 bg-black/50 backdrop-blur-md"
          data-testid="age-badge"
        >
          <span className="text-[var(--c-accent)] font-semibold">18+</span>
          <span className="hidden sm:inline">{cfg.identity.ageNotice}</span>
          <span className="sm:hidden">ADULTO</span>
        </span>
      </div>

      <div className="relative z-10 mt-auto px-5 md:px-10 pb-14 md:pb-20 max-w-4xl">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-mono-accent text-[11px] tracking-[0.3em] uppercase text-[var(--c-rosa)] mb-4"
          data-testid="hero-username"
        >
          {cfg.identity.username}
        </motion.p>

        <h1
          className="font-serif-display text-4xl sm:text-5xl lg:text-7xl leading-[1.05] text-[var(--c-text)]"
          data-testid="hero-headline"
        >
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom pb-1 -mb-1">
              <motion.span
                className="inline-block"
                initial={{ y: "115%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.35 + i * 0.05, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                {w}
                {i < words.length - 1 ? "\u00A0" : ""}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.7 }}
          className="mt-5 text-base md:text-lg text-white/75 max-w-xl"
          data-testid="hero-subheadline"
        >
          {cfg.identity.subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center"
        >
          <button onClick={goFree} className={btnPrimary} data-testid="hero-cta-free">
            <Flame size={18} /> {cfg.hero.ctaFree}
          </button>
          <button onClick={goVip} className={btnGold} data-testid="hero-cta-vip">
            <Gem size={18} /> {cfg.hero.ctaVip}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-7 flex items-center gap-2 text-white/50 text-xs tracking-wide"
        >
          <ShieldCheck size={14} className="text-[var(--c-gold)]" />
          <span>Comunidade real · Atendimento direto comigo · Acesso pelo Telegram</span>
        </motion.div>
      </div>
    </section>
  );
}
