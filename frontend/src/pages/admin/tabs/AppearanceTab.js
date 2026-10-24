import { useEffect, useState } from "react";
import { Color, SaveBar, TabTitle, setPath } from "@/components/admin/Fields";

const FIELDS = [
  ["background", "Fundo da página"],
  ["card", "Fundo dos cards"],
  ["accent", "Cor de destaque (botões)"],
  ["gold", "Dourado (VIP)"],
  ["rosa", "Rosa queimado (detalhes)"],
  ["text", "Texto principal"],
  ["textMuted", "Texto secundário"],
  ["whatsapp", "Verde do WhatsApp"],
];

export default function AppearanceTab({ cfg, save, saving }) {
  const [local, setLocal] = useState(null);
  useEffect(() => {
    if (cfg) setLocal(cfg);
  }, [cfg]);
  if (!local) return null;

  const set = (p, v) => setLocal((prev) => setPath(prev, p, v));

  return (
    <div data-testid="appearance-tab">
      <TabTitle title="Aparência" subtitle="Paleta de cores aplicada em toda a página." />
      <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2">
        {FIELDS.map(([key, label]) => (
          <Color key={key} label={label} value={local.theme[key]} onChange={(v) => set(["theme", key], v)} testid={`theme-${key}`} />
        ))}
      </div>
      <SaveBar onSave={() => save(local)} saving={saving} />
    </div>
  );
}
