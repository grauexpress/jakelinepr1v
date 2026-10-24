import { useEffect, useState } from "react";
import { Area, SaveBar, SwitchRow, TabTitle, Text, setPath } from "@/components/admin/Fields";

export default function IdentityTab({ cfg, save, saving }) {
  const [local, setLocal] = useState(null);
  useEffect(() => {
    if (cfg) setLocal(cfg);
  }, [cfg]);
  if (!local) return null;

  const set = (p, v) => setLocal((prev) => setPath(prev, p, v));

  return (
    <div data-testid="identity-tab">
      <TabTitle title="Identidade & Links" subtitle="Nome, textos principais, contatos e mensagens do WhatsApp." />

      <div className="space-y-6">
        <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2">
          <Text label="Nome" value={local.identity.name} onChange={(v) => set(["identity", "name"], v)} testid="identity-name" />
          <Text label="@username" value={local.identity.username} onChange={(v) => set(["identity", "username"], v)} testid="identity-username" />
          <Text label="Logo (texto)" value={local.identity.logoText} onChange={(v) => set(["identity", "logoText"], v)} testid="identity-logo" />
          <Text label="Aviso +18" value={local.identity.ageNotice} onChange={(v) => set(["identity", "ageNotice"], v)} testid="identity-age" />
          <div className="sm:col-span-2">
            <Area label="Headline" value={local.identity.headline} onChange={(v) => set(["identity", "headline"], v)} testid="identity-headline" />
          </div>
          <div className="sm:col-span-2">
            <Area label="Subheadline" rows={2} value={local.identity.subheadline} onChange={(v) => set(["identity", "subheadline"], v)} testid="identity-subheadline" />
          </div>
          <div className="sm:col-span-2">
            <Area label="Bio / descrição" rows={2} value={local.identity.bio} onChange={(v) => set(["identity", "bio"], v)} testid="identity-bio" />
          </div>
        </div>

        <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2">
          <Text label="Número do WhatsApp (com DDI+DDD)" hint="Ex: 5511999998888" value={local.links.whatsappNumber} onChange={(v) => set(["links", "whatsappNumber"], v)} testid="links-whatsapp" />
          <Text label="Link do grupo FREE (Telegram)" value={local.links.telegramFree} onChange={(v) => set(["links", "telegramFree"], v)} testid="links-telegram" />
          <Text label="Instagram" value={local.links.instagram} onChange={(v) => set(["links", "instagram"], v)} testid="links-instagram" />
        </div>

        <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-[11px] font-mono-accent tracking-[0.18em] uppercase text-white/45">Mensagens do WhatsApp</p>
          <Area label="Mensagem padrão" rows={2} value={local.whatsapp.messages.default} onChange={(v) => set(["whatsapp", "messages", "default"], v)} testid="wa-msg-default" />
          <Area label="Mensagem — plano diário" rows={2} value={local.whatsapp.messages.diario} onChange={(v) => set(["whatsapp", "messages", "diario"], v)} testid="wa-msg-diario" />
          <Area label="Mensagem — plano semanal" rows={2} value={local.whatsapp.messages.semanal} onChange={(v) => set(["whatsapp", "messages", "semanal"], v)} testid="wa-msg-semanal" />
          <Area label="Mensagem — plano mensal" rows={2} value={local.whatsapp.messages.mensal} onChange={(v) => set(["whatsapp", "messages", "mensal"], v)} testid="wa-msg-mensal" />
          <Area label="Mensagem — promoção" rows={2} value={local.whatsapp.messages.promocao} onChange={(v) => set(["whatsapp", "messages", "promocao"], v)} testid="wa-msg-promocao" />
        </div>

        <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2">
          <p className="text-[11px] font-mono-accent tracking-[0.18em] uppercase text-white/45 sm:col-span-2">Botão flutuante do WhatsApp</p>
          <SwitchRow label="Exibir botão flutuante" checked={local.whatsapp.floatingEnabled} onChange={(v) => set(["whatsapp", "floatingEnabled"], v)} testid="wa-float-enabled" />
          <Text label="Texto do botão" value={local.whatsapp.floatingText} onChange={(v) => set(["whatsapp", "floatingText"], v)} testid="wa-float-text" />
        </div>
      </div>

      <SaveBar onSave={() => save(local)} saving={saving} />
    </div>
  );
}
