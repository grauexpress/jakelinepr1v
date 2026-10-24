import { useEffect, useState } from "react";
import { Reorder } from "framer-motion";
import { Eye, EyeOff, GripVertical } from "lucide-react";
import { SaveBar, TabTitle, setPath } from "@/components/admin/Fields";

export default function SectionsTab({ cfg, save, saving }) {
  const [local, setLocal] = useState(null);
  useEffect(() => {
    if (cfg) setLocal(cfg);
  }, [cfg]);
  if (!local) return null;

  const set = (p, v) => setLocal((prev) => setPath(prev, p, v));

  const toggle = (id) =>
    set(
      ["sections"],
      local.sections.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s))
    );

  return (
    <div data-testid="sections-tab">
      <TabTitle
        title="Ordem & Visibilidade"
        subtitle="Arraste para reordenar as seções da página. Use o olho para ativar ou ocultar."
      />
      <Reorder.Group
        axis="y"
        values={local.sections}
        onReorder={(v) => set(["sections"], v)}
        className="space-y-2"
        data-testid="sections-list"
      >
        {local.sections.map((s) => (
          <Reorder.Item
            key={s.id}
            value={s}
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 ${
              s.visible ? "border-white/10 bg-white/[0.03]" : "border-white/5 bg-white/[0.01] opacity-50"
            }`}
            data-testid={`section-row-${s.id}`}
          >
            <GripVertical size={15} className="shrink-0 cursor-grab text-white/30 active:cursor-grabbing" />
            <span className="flex-1 text-sm text-white/85">{s.label}</span>
            <button
              onClick={() => toggle(s.id)}
              className="p-1.5 text-white/45 transition-colors hover:text-white"
              aria-label={s.visible ? "Ocultar seção" : "Mostrar seção"}
              data-testid={`section-toggle-${s.id}`}
            >
              {s.visible ? <Eye size={15} /> : <EyeOff size={15} />}
            </button>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <SaveBar onSave={() => save(local)} saving={saving} />
    </div>
  );
}
