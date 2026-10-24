import { useSite } from "@/context/SiteContext";
import { Reveal, SectionHead } from "./shared";

export default function HowItWorks() {
  const { data } = useSite();
  const steps = data.config.howItWorks || [];

  return (
    <section className="relative px-5 md:px-10 py-20 md:py-28" data-testid="how-it-works-section">
      <div className="max-w-5xl mx-auto">
        <SectionHead
          eyebrow="PROCESSO"
          title="Como funciona"
          subtitle="Simples, direto e com atendimento humano do começo ao fim."
          testid="how-head"
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6" data-testid="how-steps">
          {steps.map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="relative rounded-3xl border border-white/8 bg-[var(--c-card)] p-6 h-full transition-colors hover:border-[var(--c-gold)]/25">
                <span className="font-serif-display italic text-4xl md:text-5xl text-[var(--c-gold)]/80">{s.n}</span>
                <p className="mt-4 text-sm md:text-base text-white/85 leading-snug">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
