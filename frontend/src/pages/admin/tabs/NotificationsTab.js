import { useEffect, useState } from "react";
import { Field, Num, SaveBar, SwitchRow, TabTitle, Text, inputCls, setPath } from "@/components/admin/Fields";

const TEMPLATE_FIELDS = [
  ["visit", "Visitantes online ({online} = número real)"],
  ["click_free", "Clique no grupo FREE"],
  ["click_whatsapp", "Clique no WhatsApp"],
  ["click_vip", "Clique no VIP"],
  ["click_plan", "Clique em um plano"],
];

export default function NotificationsTab({ cfg, save, saving }) {
  const [local, setLocal] = useState(null);
  useEffect(() => {
    if (cfg) setLocal(cfg);
  }, [cfg]);
  if (!local) return null;

  const set = (p, v) => setLocal((prev) => setPath(prev, p, v));
  const n = local.notifications;

  return (
    <div data-testid="notifications-tab">
      <TabTitle
        title="Notificações ao vivo"
        subtitle="Avisos discretos no canto da tela, alimentados somente por eventos reais registrados pelo site (visitas e cliques)."
      />

      <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2">
        <SwitchRow label="Ativar notificações" checked={n.enabled} onChange={(v) => set(["notifications", "enabled"], v)} testid="notif-enabled" />
        <Field label="Posição">
          <select className={inputCls} value={n.position} onChange={(e) => set(["notifications", "position"], e.target.value)} data-testid="notif-position">
            <option value="left">Inferior esquerdo</option>
            <option value="right">Inferior direito</option>
          </select>
        </Field>
        <Num label="Duração na tela (segundos)" value={n.duration} onChange={(v) => set(["notifications", "duration"], v)} testid="notif-duration" />
        <Num label="Máximo por sessão" value={n.maxPerSession} onChange={(v) => set(["notifications", "maxPerSession"], v)} testid="notif-max" />
        <Num label="Intervalo mínimo (segundos)" value={n.intervalMin} onChange={(v) => set(["notifications", "intervalMin"], v)} testid="notif-interval-min" />
        <Num label="Intervalo máximo (segundos)" value={n.intervalMax} onChange={(v) => set(["notifications", "intervalMax"], v)} testid="notif-interval-max" />
      </div>

      <p className="mb-3 mt-8 text-[11px] font-mono-accent tracking-[0.18em] uppercase text-white/45">
        Textos das notificações
      </p>
      <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        {TEMPLATE_FIELDS.map(([key, label]) => (
          <Text
            key={key}
            label={label}
            value={n.templates[key]}
            onChange={(v) => set(["notifications", "templates", key], v)}
            testid={`notif-tpl-${key}`}
          />
        ))}
      </div>

      <SaveBar onSave={() => save(local)} saving={saving} />
    </div>
  );
}
