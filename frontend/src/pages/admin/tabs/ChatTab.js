import { useEffect, useState } from "react";
import { SaveBar, TabTitle } from "@/components/admin/Fields";

const DEFAULT_CHAT = {
  enabled: true,
  name: "Jakeline",
  subtitle: "Atendimento online",
  avatar: "",
  welcome: "Oii! Seja bem-vindo(a). Como posso te ajudar?",
  background: "#111111",
  accent: "#25D366",
  typebotUrl: "https://typebot.co/my-typebot-7crzz70",
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-emerald-400";

function safeChatConfig(chat = {}) {
  return { ...DEFAULT_CHAT, ...chat };
}

function isValidTypebotUrl(value) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      (url.hostname === "typebot.co" ||
        url.hostname.endsWith(".typebot.co") ||
        url.hostname === "typebot.io" ||
        url.hostname.endsWith(".typebot.io"))
    );
  } catch {
    return false;
  }
}

export default function ChatTab({ cfg, save, saving }) {
  const [local, setLocal] = useState(null);
  const [urlError, setUrlError] = useState("");

  useEffect(() => {
    if (cfg) setLocal(safeChatConfig(cfg.chat));
  }, [cfg]);

  if (!local) return null;

  const update = (key, value) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
    if (key === "typebotUrl") setUrlError("");
  };

  const openAttendance = () => {
    window.open("/atendimento", "_blank", "noopener,noreferrer");
  };

  const testTypebot = () => {
    if (!isValidTypebotUrl(local.typebotUrl)) {
      setUrlError("Informe um endereço HTTPS válido do Typebot (typebot.co ou typebot.io).");
      return;
    }
    window.open(local.typebotUrl, "_blank", "noopener,noreferrer");
  };

  const saveChat = () => {
    if (!isValidTypebotUrl(local.typebotUrl)) {
      setUrlError("Informe um endereço HTTPS válido do Typebot (typebot.co ou typebot.io).");
      return;
    }
    setUrlError("");
    // Mantém todos os demais campos da configuração principal.
    save({
      ...cfg,
      chat: safeChatConfig(local),
    });
  };

  return (
    <div data-testid="chat-tab" className="space-y-6">
      <TabTitle
        title="Chat / Atendimento"
        subtitle="Personalize a página de atendimento e teste a experiência do cliente."
      />

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={openAttendance}
          className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black hover:bg-emerald-400"
        >
          Abrir atendimento
        </button>
        <button
          type="button"
          onClick={testTypebot}
          className="rounded-xl border border-white/15 px-4 py-3 text-sm text-white hover:bg-white/5"
        >
          Testar Typebot
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-medium text-white">Atendimento {local.enabled ? "ativado" : "desativado"}</h3>
            <p className="mt-1 text-xs text-white/50">
              {local.enabled
                ? "A página /atendimento pode ser acessada pelos visitantes."
                : "A página /atendimento exibirá o aviso de indisponibilidade."}
            </p>
          </div>
          <input
            type="checkbox"
            checked={Boolean(local.enabled)}
            onChange={(e) => update("enabled", e.target.checked)}
            className="h-5 w-5 accent-emerald-500"
            aria-label="Ativar atendimento"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-white/70">Nome do cabeçalho</label>
          <input className={inputClass} value={local.name} onChange={(e) => update("name", e.target.value)} maxLength={80} />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-white/70">Subtítulo</label>
          <input className={inputClass} value={local.subtitle} onChange={(e) => update("subtitle", e.target.value)} maxLength={120} />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-white/70">URL da foto de perfil</label>
          <input className={inputClass} value={local.avatar} onChange={(e) => update("avatar", e.target.value)} placeholder="https://..." maxLength={2048} />
          <p className="text-xs text-white/40">Use uma imagem sua ou autorizada.</p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-white/70">Mensagem de boas-vindas</label>
          <textarea className={inputClass} value={local.welcome} onChange={(e) => update("welcome", e.target.value)} rows={4} maxLength={2000} />
          <p className="text-xs text-white/40">Essa mensagem aparece acima do Typebot na página de atendimento.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm text-white/70">Cor do fundo</label>
            <div className="flex items-center gap-3">
              <input type="color" value={local.background} onChange={(e) => update("background", e.target.value)} className="h-10 w-12 cursor-pointer rounded" />
              <span className="text-sm text-white/70">{local.background}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm text-white/70">Cor de destaque</label>
            <div className="flex items-center gap-3">
              <input type="color" value={local.accent} onChange={(e) => update("accent", e.target.value)} className="h-10 w-12 cursor-pointer rounded" />
              <span className="text-sm text-white/70">{local.accent}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-white/70">Endereço do Typebot publicado</label>
          <input
            className={inputClass}
            value={local.typebotUrl}
            onChange={(e) => update("typebotUrl", e.target.value)}
            placeholder="https://typebot.co/seu-bot"
            maxLength={2048}
            inputMode="url"
          />
          <p className="text-xs text-white/40">Aceita endereços HTTPS de typebot.co ou typebot.io. Use o link público do bot.</p>
          {urlError && <p role="alert" className="text-sm text-red-400">{urlError}</p>}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10" style={{ background: local.background }}>
        <div className="flex items-center gap-3 border-b border-white/10 p-4">
          {local.avatar ? (
            <img
              src={local.avatar}
              alt=""
              className="h-11 w-11 rounded-full object-cover"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white">
              {local.name?.slice(0, 1)?.toUpperCase() || "A"}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-medium text-white">{local.name || "Atendimento"}</p>
            <p className="text-xs text-white/60">{local.subtitle}</p>
          </div>
          <span className="ml-auto text-xs" style={{ color: local.accent }}>
            {local.enabled ? "● Disponível" : "● Indisponível"}
          </span>
        </div>
        <div className="space-y-3 p-4">
          <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-white/10 p-3 text-sm text-white">
            {local.welcome || "Sua mensagem de boas-vindas aparecerá aqui."}
          </div>
          <div className="rounded-xl border border-white/10 p-3 text-xs text-white/60">
            O Typebot será exibido abaixo desta mensagem na página real.
          </div>
          <div className="rounded-full px-4 py-3 text-sm font-medium text-white" style={{ background: local.accent }}>
            Prévia do atendimento
          </div>
        </div>
      </div>

      <p className="text-xs text-white/40">
        Prévia ilustrativa. Use “Abrir atendimento” para conferir a página real. Salve suas alterações antes de testar.
      </p>

      <SaveBar onSave={saveChat} saving={saving} />
    </div>
  );
}
