import { Link } from "react-router-dom";
import { useSite } from "@/context/SiteContext";

const DEFAULT_CHAT = {
  enabled: true,
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
      <main className="flex min-h-screen items-center justify-center bg-[#111] p-6 text-white">
        Não foi possível carregar o atendimento.
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#111] p-6 text-white">
        Carregando atendimento...
      </main>
    );
  }

  const chat = { ...DEFAULT_CHAT, ...(data.config?.chat || {}) };

  if (!chat.enabled) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#111] p-6 text-white">
        <p>O atendimento está temporariamente indisponível.</p>
        <Link to="/" className="underline">Voltar ao site</Link>
      </main>
    );
  }

  if (!validEmbedUrl(chat.typebotUrl)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#111] p-6 text-white">
        O endereço do atendimento está inválido. Entre em contato com o suporte.
      </main>
    );
  }

  // Typebot ocupa toda a janela: sem cabeçalho, cartão, boas-vindas ou rodapé.
  return (
    <main className="fixed inset-0 h-[100dvh] w-full overflow-hidden bg-[#111]">
      <iframe
        title="Atendimento"
        src={chat.typebotUrl}
        className="block h-full w-full border-0"
        allow="clipboard-read; clipboard-write"
        loading="eager"
      />
    </main>
  );
}
