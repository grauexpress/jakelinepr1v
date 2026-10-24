import { useSite } from "@/context/SiteContext";
import { Reveal } from "./shared";

export default function Stats() {
  const { data } = useSite();
  const stats = data.config.stats || [];
  if (!stats.length) return null;

  return (
    <section className="border-y border-white/5 bg-black/30" data-testid="stats-section">
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-10 md:py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <Reveal key={i} delay={i * 0.08} className="text-center" testid={`stat-${i}`}>
            <div className="font-serif-display text-3xl md:text-5xl text-[var(--c-gold)]">{s.value}</div>
            <div className="mt-2 font-mono-accent text-[10px] tracking-[0.22em] uppercase text-white/50">
              {s.label}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
