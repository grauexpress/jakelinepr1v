import { motion } from "framer-motion";
import { Star } from "lucide-react";

export const Reveal = ({ children, delay = 0, y = 28, className = "", testid }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
    data-testid={testid}
  >
    {children}
  </motion.div>
);

export const SectionHead = ({ eyebrow, title, subtitle, align = "center", testid }) => (
  <Reveal
    className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""} mb-10 md:mb-14`}
    testid={testid}
  >
    {eyebrow && (
      <p className="font-mono-accent text-[11px] tracking-[0.25em] uppercase text-[var(--c-rosa)] mb-4">
        {eyebrow}
      </p>
    )}
    <h2 className="font-serif-display text-3xl md:text-5xl leading-[1.08] text-[var(--c-text)]">{title}</h2>
    {subtitle && <p className="mt-4 text-base md:text-lg text-[var(--c-muted)]">{subtitle}</p>}
  </Reveal>
);

export const Stars = ({ n = 5, size = 14, testid }) => (
  <div className="flex gap-0.5" data-testid={testid}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={size}
        className={i <= n ? "fill-[var(--c-gold)] text-[var(--c-gold)]" : "text-white/15"}
      />
    ))}
  </div>
);

export const Marquee = ({ items }) => (
  <div
    className="relative overflow-hidden border-y border-white/5 bg-black/40 py-3.5 select-none"
    data-testid="editorial-marquee"
  >
    <div className="marquee-track">
      {[0, 1].map((k) => (
        <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
          {items.map((it, i) => (
            <span key={i} className="flex items-center whitespace-nowrap">
              <span className="font-serif-display italic text-lg md:text-xl text-[var(--c-text)]/80 px-6">
                {it}
              </span>
              <span className="text-[var(--c-gold)] text-[10px]">✦</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const btnPrimary =
  "group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--c-accent)] px-7 py-4 text-sm font-semibold tracking-wide text-white transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(255,42,112,0.5)] active:translate-y-0 cursor-pointer";

export const btnGold =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[var(--c-gold)]/60 text-[var(--c-gold)] px-7 py-4 text-sm font-semibold tracking-wide bg-black/30 backdrop-blur-sm transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-0.5 hover:bg-[var(--c-gold)]/10 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] cursor-pointer";

export const btnWhatsapp =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[var(--c-wa)] px-7 py-4 text-sm font-semibold tracking-wide text-white transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(37,211,102,0.45)] active:translate-y-0 cursor-pointer";
