import { useEffect, useState } from "react";
import { Crud } from "@/components/admin/Crud";
import { Num, SaveBar, SwitchRow, TabTitle, setPath } from "@/components/admin/Fields";

export const TestimonialsTab = () => (
  <Crud
    resource="testimonials"
    title="Depoimentos"
    subtitle="Substitua os placeholders pelos depoimentos reais dos seus assinantes."
    testid="crud-testimonials"
    itemLabel={(t) => t.name || "Sem nome"}
    makeNew={() => ({
      name: "", username: "", avatar: "", stars: 5,
      date: new Date().toISOString().slice(0, 10),
      text: "", plan: "", isVip: false, verified: false, featured: false, active: true,
    })}
    fields={[
      { key: "name", label: "Nome (ou nome abreviado)" },
      { key: "username", label: "Username (opcional)" },
      { key: "avatar", label: "Foto de perfil", type: "image" },
      { key: "stars", label: "Estrelas (1 a 5)" },
      { key: "date", label: "Data (ex: 24/10/2026)" },
      { key: "plan", label: "Plano (opcional)" },
      { key: "text", label: "Depoimento", type: "textarea" },
      { key: "isVip", label: "Selo ASSINANTE VIP", type: "switch" },
      { key: "verified", label: "Cliente verificado", type: "switch" },
      { key: "featured", label: "Destacar no início", type: "switch" },
      { key: "active", label: "Ativo na página", type: "switch" },
    ]}
  />
);

export const PrintsTab = () => (
  <Crud
    resource="prints"
    title="Prints de conversas"
    subtitle="Suba prints reais de conversas. Sempre oculte dados pessoais dos clientes antes de publicar."
    testid="crud-prints"
    itemLabel={(p) => p.title || "Print"}
    makeNew={() => ({
      image: "", title: "", caption: "",
      date: new Date().toISOString().slice(0, 10),
      featured: false, active: true,
    })}
    fields={[
      { key: "image", label: "Imagem do print", type: "image" },
      { key: "title", label: "Título" },
      { key: "date", label: "Data" },
      { key: "caption", label: "Legenda", type: "textarea" },
      { key: "featured", label: "Destaque", type: "switch" },
      { key: "active", label: "Ativo na página", type: "switch" },
    ]}
  />
);

export const PreviewsTab = ({ cfg, save, saving }) => {
  const [local, setLocal] = useState(null);
  useEffect(() => {
    if (cfg) setLocal(cfg);
  }, [cfg]);
  if (!local) return null;

  const set = (p, v) => setLocal((prev) => setPath(prev, p, v));

  return (
    <div>
      <div className="mb-8 grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-3">
        <div className="sm:col-span-3">
          <p className="text-[11px] font-mono-accent tracking-[0.18em] uppercase text-white/45">
            Configurações do carrossel
          </p>
        </div>
        <SwitchRow
          label="Autoplay"
          checked={local.previewsSettings.autoplay}
          onChange={(v) => set(["previewsSettings", "autoplay"], v)}
          testid="previews-autoplay"
        />
        <Num
          label="Intervalo (segundos)"
          value={local.previewsSettings.interval}
          onChange={(v) => set(["previewsSettings", "interval"], v)}
          testid="previews-interval"
        />
        <div className="sm:col-span-3">
          <SaveBar onSave={() => save(local)} saving={saving} />
        </div>
      </div>

      <Crud
        resource="previews"
        title="Prévias"
        subtitle="Imagens do carrossel 'Um gostinho do que te espera'. Não publique o conteúdo completo aqui."
        testid="crud-previews"
        itemLabel={(p) => p.caption || "Prévia"}
        makeNew={() => ({ image: "", caption: "", category: "", main: false, active: true })}
        fields={[
          { key: "image", label: "Imagem", type: "image" },
          { key: "caption", label: "Legenda" },
          { key: "category", label: "Categoria (opcional)" },
          { key: "main", label: "Imagem principal", type: "switch" },
          { key: "active", label: "Ativa na página", type: "switch" },
        ]}
      />
    </div>
  );
};

export const FaqTab = () => (
  <Crud
    resource="faqs"
    title="FAQ"
    subtitle="Perguntas e respostas exibidas no accordion da página."
    testid="crud-faqs"
    itemLabel={(f) => f.question || "Pergunta"}
    makeNew={() => ({ question: "", answer: "", active: true })}
    fields={[
      { key: "question", label: "Pergunta" },
      { key: "answer", label: "Resposta", type: "textarea" },
      { key: "active", label: "Ativa na página", type: "switch" },
    ]}
  />
);

export const PreviewsTabTitle = () => <TabTitle title="Prévias" />;
