import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { imgUrl } from "@/lib/api";
import { Reveal, SectionHead } from "./shared";

export default function PreviewCarousel() {
  const { data } = useSite();
  const settings = data.config.previewsSettings || {};
  const items = (data.previews || []).filter((p) => p.image);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);
  const paused = useRef(false);

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || !settings.autoplay) return;
    const id = setInterval(() => {
      if (!paused.current) emblaApi.scrollNext();
    }, Math.max(2, settings.interval || 4) * 1000);
    return () => clearInterval(id);
  }, [emblaApi, settings.autoplay, settings.interval]);

  if (!items.length) return null;

  return (
    <section
      className="relative py-20 md:py-28 overflow-hidden"
      data-testid="previews-section"
      onPointerEnter={() => (paused.current = true)}
      onPointerLeave={() => (paused.current = false)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(92,22,46,0.3),transparent_60%)] pointer-events-none" />
      <div className="px-5 md:px-10 max-w-6xl mx-auto">
        <SectionHead
          eyebrow="PRÉVIAS"
          title="Um gostinho do que te espera..."
          subtitle="Aqui é só o começo. O conteúdo completo fica no VIP."
          testid="previews-head"
        />
      </div>

      <Reveal>
        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden px-5" ref={emblaRef} data-testid="previews-carousel">
            <div className="flex gap-4">
              {items.map((p) => (
                <div key={p.id} className="min-w-0 shrink-0 grow-0 basis-[72%] sm:basis-[42%] lg:basis-[31%]">
                  <div className="group relative rounded-3xl overflow-hidden border border-white/8 aspect-[3/4]">
                    <img
                      src={imgUrl(p.image)}
                      alt={p.caption || "Prévia"}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0508]/85 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <span className="text-xs text-white/85">{p.caption || "Prévia"}</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md border border-[var(--c-gold)]/30 px-2.5 py-1 text-[9px] font-mono-accent tracking-[0.15em] text-[var(--c-gold)]">
                        <Lock size={9} /> VIP
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-[var(--c-gold)] hover:text-[var(--c-gold)]"
              data-testid="previews-prev"
              aria-label="Anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-1.5" data-testid="previews-dots">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  aria-label={`Ir para prévia ${i + 1}`}
                  className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                    i === selected ? "w-6 bg-[var(--c-accent)]" : "w-1.5 bg-white/20"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => emblaApi?.scrollNext()}
              className="hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-[var(--c-gold)] hover:text-[var(--c-gold)]"
              data-testid="previews-next"
              aria-label="Próximo"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
