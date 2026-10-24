import { useEffect, useState } from "react";
import { Area, SaveBar, SwitchRow, TabTitle, Text, setPath } from "@/components/admin/Fields";

export default function PlansTab({ cfg, save, saving }) {
  const [local, setLocal] = useState(null);
  useEffect(() => {
    if (cfg) setLocal(cfg);
  }, [cfg]);
  if (!local) return null;

  const set = (p, v) => setLocal((prev) => setPath(prev, p, v));

  return (
    <div data-testid="plans-tab">
      <TabTitle title="Planos" subtitle="Preços, textos e mensagens de cada plano. Cada botão abre o WhatsApp com a mensagem do plano." />
      <div className="space-y-4">
        {local.plans.map((p, i) => (
          <div key={p.id} className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2" data-testid={`plan-edit-${p.id}`}>
            <div className="flex items-center justify-between sm:col-span-2">
              <span className="font-mono-accent text-[11px] tracking-[0.2em] uppercase text-neon">{p.id}</span>
              <div className="flex gap-2">
                <SwitchRow label="Ativo" checked={p.active} onChange={(v) => set(["plans", i, "active"], v)} testid={`plan-active-${p.id}`} />
                <SwitchRow label="Destaque" checked={p.highlighted} onChange={(v) => set(["plans", i, "highlighted"], v)} testid={`plan-highlight-${p.id}`} />
              </div>
            </div>
            <Text label="Nome" value={p.name} onChange={(v) => set(["plans", i, "name"], v)} testid={`plan-name-${p.id}`} />
            <Text label="Duração (texto)" value={p.duration} onChange={(v) => set(["plans", i, "duration"], v)} testid={`plan-duration-${p.id}`} />
            <Text label="Preço" value={p.price} onChange={(v) => set(["plans", i, "price"], v)} testid={`plan-price-${p.id}`} />
            <Text label="Preço antigo (opcional)" value={p.oldPrice} onChange={(v) => set(["plans", i, "oldPrice"], v)} testid={`plan-oldprice-${p.id}`} />
            <Text label="Badge (opcional)" value={p.badge} onChange={(v) => set(["plans", i, "badge"], v)} testid={`plan-badge-${p.id}`} />
            <Text label="Texto do botão" value={p.cta} onChange={(v) => set(["plans", i, "cta"], v)} testid={`plan-cta-${p.id}`} />
            <div className="sm:col-span-2">
              <Area label="Mensagem do WhatsApp" rows={2} value={p.message} onChange={(v) => set(["plans", i, "message"], v)} testid={`plan-message-${p.id}`} />
            </div>
          </div>
        ))}
      </div>
      <SaveBar onSave={() => save(local)} saving={saving} />
    </div>
  );
}
