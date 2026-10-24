import { useEffect, useState } from "react";
import { Area, ImageField, ListEditor, SaveBar, TabTitle, Text, setPath } from "@/components/admin/Fields";

export default function ContentTab({ cfg, save, saving }) {
  const [local, setLocal] = useState(null);
  useEffect(() => {
    if (cfg) setLocal(cfg);
  }, [cfg]);
  if (!local) return null;

  const set = (p, v) => setLocal((prev) => setPath(prev, p, v));

  return (
    <div data-testid="content-tab">
      <TabTitle title="Conteúdo" subtitle="Seções FREE, VIP, Como Funciona e CTA final." />

      <p className="mb-3 text-[11px] font-mono-accent tracking-[0.18em] uppercase text-white/45">Grupo FREE</p>
      <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2">
        <Text label="Título" value={local.free.title} onChange={(v) => set(["free", "title"], v)} testid="free-title" />
        <Text label="Texto do botão" value={local.free.cta} onChange={(v) => set(["free", "cta"], v)} testid="free-cta" />
        <div className="sm:col-span-2">
          <Area label="Texto" value={local.free.text} onChange={(v) => set(["free", "text"], v)} testid="free-text" />
        </div>
        <div className="sm:col-span-2">
          <ImageField label="Imagem" value={local.free.image} onChange={(v) => set(["free", "image"], v)} testid="free-image" />
        </div>
        <div className="sm:col-span-2">
          <ListEditor label="Benefícios" items={local.free.benefits} onChange={(v) => set(["free", "benefits"], v)} testid="free-benefits" />
        </div>
      </div>

      <p className="mb-3 mt-8 text-[11px] font-mono-accent tracking-[0.18em] uppercase text-white/45">Grupo VIP</p>
      <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2">
        <Text label="Título" value={local.vip.title} onChange={(v) => set(["vip", "title"], v)} testid="vip-title" />
        <Text label="Subtítulo" value={local.vip.subtitle} onChange={(v) => set(["vip", "subtitle"], v)} testid="vip-subtitle" />
        <div className="sm:col-span-2">
          <ListEditor label="Benefícios" items={local.vip.benefits} onChange={(v) => set(["vip", "benefits"], v)} testid="vip-benefits" />
        </div>
      </div>

      <p className="mb-3 mt-8 text-[11px] font-mono-accent tracking-[0.18em] uppercase text-white/45">Como funciona</p>
      <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2">
        {local.howItWorks.map((s, i) => (
          <div key={i} className="grid grid-cols-[80px_1fr] gap-3">
            <Text label="Nº" value={s.n} onChange={(v) => set(["howItWorks", i, "n"], v)} testid={`how-n-${i}`} />
            <Text label={`Passo ${i + 1}`} value={s.text} onChange={(v) => set(["howItWorks", i, "text"], v)} testid={`how-text-${i}`} />
          </div>
        ))}
      </div>

      <p className="mb-3 mt-8 text-[11px] font-mono-accent tracking-[0.18em] uppercase text-white/45">CTA final</p>
      <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Area label="Título" value={local.finalCta.title} onChange={(v) => set(["finalCta", "title"], v)} testid="final-title" />
        </div>
        <div className="sm:col-span-2">
          <Area label="Texto" rows={2} value={local.finalCta.text} onChange={(v) => set(["finalCta", "text"], v)} testid="final-text" />
        </div>
        <Text label="Botão FREE" value={local.finalCta.ctaFree} onChange={(v) => set(["finalCta", "ctaFree"], v)} testid="final-cta-free" />
        <Text label="Botão WhatsApp" value={local.finalCta.ctaVip} onChange={(v) => set(["finalCta", "ctaVip"], v)} testid="final-cta-vip" />
      </div>

      <SaveBar onSave={() => save(local)} saving={saving} />
    </div>
  );
}
