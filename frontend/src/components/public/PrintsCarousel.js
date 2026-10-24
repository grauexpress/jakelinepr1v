import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, MessageCircleHeart } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { imgUrl } from "@/lib/api";
import { Reveal, SectionHead } from "./shared";

export default function PrintsCarousel() {
  const { data } = useSite();
  const items = (data.prints || []).filter((p) => p.image);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  if (!items.length) return null;

  return (
    <section className="relative py-20 md:py-28 overflow-hidden" data-testid="prints-section">
      <div className="px-5 md:px-10 max-w-6xl mx-auto">
        <SectionHead
          eyebrow="MENSAGENS REAIS"
          title="Algumas mensagens que recebo de quem já entrou"
          subtitle="Prints de conversas com assinantes — sempre com dados pessoais ocultados."
          testid="prints-head"
        />
      </div>

      <Reveal>
        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden px-5" ref={emblaRef} data-testid="prints-carousel">
            <div className="flex gap-4">
              {items.map((p) => (
                <div key={p.id} className="min-w-0 shrink-0 grow-0 basis-[75%] sm:basis-[45%] lg:basis-[30%]">
                  <div className="rounded-3xl border border-white/8 bg-[var(--c-card)] overflow-hidden">
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={imgUrl(p.image)}
                        alt={p.title || "Print de conversa"}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 text-[var(--c-rosa)]">
                        <MessageCircleHeart size={13} />
                        <span className="text-[10px] font-mono-accent tracking-[0.15em] uppercase">
                          {p.title} {p.date ? `· ${p.date}` : ""}
                        </span>
                      </div>
                      {p.caption && <p className="mt-1.5 text-xs text-white/65 leading-relaxed">{p.caption}</p>}
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
              data-testid="prints-prev"
              aria-label="Anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-1.5" data-testid="prints-dots">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  aria-label={`Ir para print ${i + 1}`}
                  className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                    i === selected ? "w-6 bg-[var(--c-gold)]" : "w-1.5 bg-white/20"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => emblaApi?.scrollNext()}
              className="hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-[var(--c-gold)] hover:text-[var(--c-gold)]"
              data-testid="prints-next"
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
