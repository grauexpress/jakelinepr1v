import { useEffect, useState } from "react";
import { Num, SaveBar, TabTitle, Text, setPath } from "@/components/admin/Fields";

export default function SocialTab({ cfg, save, saving }) {
  const [local, setLocal] = useState(null);
  useEffect(() => {
    if (cfg) setLocal(cfg);
  }, [cfg]);
  if (!local) return null;

  const set = (p, v) => setLocal((prev) => setPath(prev, p, v));

  return (
    <div data-testid="social-tab">
      <TabTitle
        title="Prova Social"
        subtitle="Resumo de reputação e números de credibilidade. Atualize com seus dados reais."
      />

      <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2">
        <Text label="Título" value={local.socialProof.title} onChange={(v) => set(["socialProof", "title"], v)} testid="sp-title" />
        <Text label="Subtítulo" value={local.socialProof.subtitle} onChange={(v) => set(["socialProof", "subtitle"], v)} testid="sp-subtitle" />
        <Text label="Nota média" hint="Ex: 4.9" value={local.socialProof.rating} onChange={(v) => set(["socialProof", "rating"], v)} testid="sp-rating" />
        <Text label="Total de avaliações" value={local.socialProof.totalReviews} onChange={(v) => set(["socialProof", "totalReviews"], v)} testid="sp-total" />
      </div>

      <div className="mt-4 grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-5">
        {[5, 4, 3, 2, 1].map((star, i) => (
          <Num
            key={star}
            label={`${star} estrelas (%)`}
            value={local.socialProof.distribution[i]}
            onChange={(v) => set(["socialProof", "distribution", i], v)}
            testid={`sp-dist-${star}`}
          />
        ))}
      </div>

      <p className="mt-6 mb-3 text-[11px] font-mono-accent tracking-[0.18em] uppercase text-white/45">
        Números de credibilidade
      </p>
      <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2">
        {local.stats.map((s, i) => (
          <div key={i} className="grid grid-cols-2 gap-3">
            <Text label={`Valor ${i + 1}`} value={s.value} onChange={(v) => set(["stats", i, "value"], v)} testid={`stat-value-${i}`} />
            <Text label={`Rótulo ${i + 1}`} value={s.label} onChange={(v) => set(["stats", i, "label"], v)} testid={`stat-label-${i}`} />
          </div>
        ))}
      </div>

      <SaveBar onSave={() => save(local)} saving={saving} />
    </div>
  );
}
