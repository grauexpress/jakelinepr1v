import { useEffect } from "react";
import Lenis from "lenis";
import { useSite } from "@/context/SiteContext";
import { track } from "@/lib/api";
import { Marquee } from "@/components/public/shared";
import Hero from "@/components/public/Hero";
import SocialProof from "@/components/public/SocialProof";
import PrintsCarousel from "@/components/public/PrintsCarousel";
import Stats from "@/components/public/Stats";
import FreeSection from "@/components/public/FreeSection";
import PreviewCarousel from "@/components/public/PreviewCarousel";
import VipSection from "@/components/public/VipSection";
import Pricing from "@/components/public/Pricing";
import Promotion from "@/components/public/Promotion";
import HowItWorks from "@/components/public/HowItWorks";
import FaqSection from "@/components/public/FaqSection";
import FinalCta from "@/components/public/FinalCta";
import Footer from "@/components/public/Footer";
import WhatsAppFloat from "@/components/public/WhatsAppFloat";
import LiveNotifications from "@/components/public/LiveNotifications";

const SECTION_COMPONENTS = {
  hero: Hero,
  social: SocialProof,
  prints: PrintsCarousel,
  stats: Stats,
  free: FreeSection,
  previews: PreviewCarousel,
  vip: VipSection,
  plans: Pricing,
  promo: Promotion,
  how: HowItWorks,
  faq: FaqSection,
  cta: FinalCta,
  footer: Footer,
};

const MARQUEE_ITEMS = [
  "Conteúdo exclusivo",
  "Comunidade real",
  "Acesso VIP",
  "Prévias toda semana",
  "Atendimento direto comigo",
];

export default function Landing() {
  const { data, failed } = useSite();

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (!sessionStorage.getItem("jk_visit")) {
      sessionStorage.setItem("jk_visit", "1");
      track("visit", "site");
    }
  }, []);

  if (failed) {
    return (
      <div className="min-h-screen bg-night flex items-center justify-center px-6 text-center" data-testid="load-error">
        <p className="text-white/60 text-sm">Não foi possível carregar a página. Atualize em alguns instantes.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-night flex items-center justify-center" data-testid="loading-splash">
        <span className="font-serif-display italic text-4xl text-gold animate-pulse">JS</span>
      </div>
    );
  }

  const cfg = data.config;
  const t = cfg.theme || {};
  const sections = (cfg.sections || []).filter((s) => s.visible && SECTION_COMPONENTS[s.id]);

  return (
    <div
      className="relative min-h-screen font-sans"
      data-testid="landing-page"
      style={{
        background: t.background,
        color: t.text,
        "--c-bg": t.background,
        "--c-card": t.card,
        "--c-accent": t.accent,
        "--c-gold": t.gold,
        "--c-rosa": t.rosa,
        "--c-text": t.text,
        "--c-muted": t.textMuted,
        "--c-wa": t.whatsapp,
      }}
    >
      <div className="grain-overlay" aria-hidden />
      {sections.map((s, i) => {
        const C = SECTION_COMPONENTS[s.id];
        return (
          <div key={s.id} data-section={s.id}>
            <C />
            {s.id === "hero" && <Marquee items={MARQUEE_ITEMS} />}
          </div>
        );
      })}
      <WhatsAppFloat />
      <LiveNotifications />
    </div>
  );
}
