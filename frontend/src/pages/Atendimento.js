import { Link } from "react-router-dom";
import { useSite } from "@/context/SiteContext";

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

function validEmbedUrl(value) {
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

export default function Atendimento() {
  const { data, failed } = useSite();

  if (failed) {
    return (
      <main className="min-h-screen bg-[#111111] p-6 text-white">
        Não foi possível carregar o atendimento.
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#111111] p-6 text-white">
        Carregando atendimento...
      </main>
    );
  }

  const chat = { ...DEFAULT_CHAT, ...(data.config?.chat || {}) };

  if (!chat.enabled) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#111111] p-6 text-white">
        <p>O atendimento está temporariamente indisponível.</p>
        <Link to="/" className="underline">Voltar ao site</Link>
      </main>
    );
  }

  const embedIsValid = validEmbedUrl(chat.typebotUrl);

  return (
    <main
      className="flex min-h-screen flex-col text-white"
      style={{ background: chat.background || "#111111" }}
    >
      <header className="flex items-center gap-3 border-b border-white/10 bg-black/40 p-4">
        <Link to="/" className="shrink-0 rounded-lg bg-white/10 px-3 py-2 text-sm">
          ← Voltar
        </Link>

        {chat.avatar ? (
          <img
            src={chat.avatar}
            alt=""
            className="h-11 w-11 rounded-full object-cover"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        ) : (
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white"
            style={{ background: chat.accent || "#25D366" }}
          >
            {chat.name?.slice(0, 1)?.toUpperCase() || "A"}
          </div>
        )}

        <div className="min-w-0">
          <h1 className="truncate font-semibold">{chat.name || "Atendimento"}</h1>
          <p className="text-xs text-white/60">{chat.subtitle}</p>
        </div>

        <span className="ml-auto hidden text-xs sm:block" style={{ color: chat.accent }}>
          ● Atendimento
        </span>
      </header>

      <section className="mx-auto w-full max-w-4xl flex-1 px-3 py-4 sm:px-5">
        <div className="mb-4 flex items-start gap-3">
          <div
            className="max-w-[92%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.07] px-4 py-3 text-sm leading-relaxed sm:text-base"
            style={{ borderLeftColor: chat.accent, borderLeftWidth: 3 }}
          >
            {chat.welcome || "Oii! Seja bem-vindo(a). Como posso te ajudar?"}
          </div>
        </div>

        {embedIsValid ? (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
            <iframe
              title="Conversa de atendimento"
              src={chat.typebotUrl}
              className="block h-[min(72dvh,760px)] min-h-[480px] w-full border-0"
              allow="clipboard-read; clipboard-write"
              loading="eager"
            />
          </div>
        ) : (
          <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-5 text-sm text-white">
            O endereço do atendimento está inválido. Entre em contato com o suporte.
          </div>
        )}

        <p className="mt-3 text-center text-xs text-white/40">
          Atendimento interativo
        </p>
      </section>
    </main>
  );
}
