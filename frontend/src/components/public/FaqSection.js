import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSite } from "@/context/SiteContext";
import { Reveal, SectionHead } from "./shared";

export default function FaqSection() {
  const { data } = useSite();
  const faqs = data.faqs || [];
  if (!faqs.length) return null;

  return (
    <section className="relative px-5 md:px-10 py-20 md:py-28" data-testid="faq-section">
      <div className="max-w-3xl mx-auto">
        <SectionHead
          eyebrow="DÚVIDAS"
          title="Perguntas frequentes"
          subtitle="Tudo o que você precisa saber antes de entrar."
          testid="faq-head"
        />
        <Reveal>
          <Accordion type="single" collapsible className="space-y-3" data-testid="faq-accordion">
            {faqs.map((f, i) => (
              <AccordionItem
                key={f.id}
                value={f.id}
                className="rounded-2xl border border-white/8 bg-[var(--c-card)] px-5 data-[state=open]:border-[var(--c-rosa)]/30"
              >
                <AccordionTrigger
                  className="text-left text-sm md:text-base font-medium text-[var(--c-text)] hover:no-underline py-5"
                  data-testid={`faq-question-${i}`}
                >
                  {f.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-[var(--c-muted)] leading-relaxed pb-5">
                  {f.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
