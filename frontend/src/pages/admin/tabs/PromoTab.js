import { useEffect, useState } from "react";
import { Field, SaveBar, SwitchRow, TabTitle, Text, inputCls, setPath } from "@/components/admin/Fields";

const toLocalInput = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function PromoTab({ cfg, save, saving }) {
  const [local, setLocal] = useState(null);
  useEffect(() => {
    if (cfg) setLocal(cfg);
  }, [cfg]);
  if (!local) return null;

  const set = (p, v) => setLocal((prev) => setPath(prev, p, v));
  const promo = local.promotion;

  return (
    <div data-testid="promo-tab">
      <TabTitle
        title="Promoção"
        subtitle="Oferta com contador regressivo real. Quando a data expira, a seção pode ser escondida automaticamente."
      />
      <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2">
        <SwitchRow label="Exibir promoção na página" checked={promo.enabled} onChange={(v) => set(["promotion", "enabled"], v)} testid="promo-enabled" />
        <SwitchRow label="Esconder após expirar" checked={promo.hideAfterExpiry} onChange={(v) => set(["promotion", "hideAfterExpiry"], v)} testid="promo-hide-expired" />
        <Text label="Título" value={promo.title} onChange={(v) => set(["promotion", "title"], v)} testid="promo-title" />
        <Text label="Subtítulo" value={promo.subtitle} onChange={(v) => set(["promotion", "subtitle"], v)} testid="promo-subtitle" />
        <Text label="Preço antigo" value={promo.oldPrice} onChange={(v) => set(["promotion", "oldPrice"], v)} testid="promo-old-price" />
        <Text label="Preço promocional" value={promo.newPrice} onChange={(v) => set(["promotion", "newPrice"], v)} testid="promo-new-price" />
        <Text label="Texto do botão" value={promo.cta} onChange={(v) => set(["promotion", "cta"], v)} testid="promo-cta" />
        <Field label="Data e hora final">
          <input
            type="datetime-local"
            className={inputCls}
            value={toLocalInput(promo.endsAt)}
            onChange={(e) => set(["promotion", "endsAt"], e.target.value ? new Date(e.target.value).toISOString() : "")}
            data-testid="promo-ends-at"
          />
        </Field>
      </div>
      <SaveBar onSave={() => save(local)} saving={saving} />
    </div>
  );
}
