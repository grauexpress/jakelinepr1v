import { useEffect, useState } from "react";
import { ImageField, SaveBar, TabTitle, Text, setPath, inputCls, Field } from "@/components/admin/Fields";

export default function HeroTab({ cfg, save, saving }) {
  const [local, setLocal] = useState(null);
  useEffect(() => {
    if (cfg) setLocal(cfg);
  }, [cfg]);
  if (!local) return null;

  const set = (p, v) => setLocal((prev) => setPath(prev, p, v));

  return (
    <div data-testid="hero-tab">
      <TabTitle title="Hero" subtitle="Imagem principal e botões da primeira seção." />
      <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <ImageField label="Foto principal" value={local.identity.heroImage} onChange={(v) => set(["identity", "heroImage"], v)} testid="hero-image" />
        </div>
        <Text label="Texto do botão FREE" value={local.hero.ctaFree} onChange={(v) => set(["hero", "ctaFree"], v)} testid="hero-cta-free-text" />
        <Text label="Texto do botão VIP" value={local.hero.ctaVip} onChange={(v) => set(["hero", "ctaVip"], v)} testid="hero-cta-vip-text" />
        <Field label="Ação do botão VIP">
          <select
            className={inputCls}
            value={local.hero.vipAction}
            onChange={(e) => set(["hero", "vipAction"], e.target.value)}
            data-testid="hero-vip-action"
          >
            <option value="scroll">Rolar até os planos</option>
            <option value="whatsapp">Abrir o WhatsApp</option>
          </select>
        </Field>
      </div>
      <SaveBar onSave={() => save(local)} saving={saving} />
    </div>
  );
}
