import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { api } from "@/lib/api";
import { TabTitle } from "@/components/admin/Fields";

const StatCard = ({ label, value, sub, testid }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5" data-testid={testid}>
    <p className="text-[10px] font-mono-accent tracking-[0.2em] uppercase text-white/40">{label}</p>
    <p className="mt-2 font-serif-display text-3xl text-white">{value}</p>
    {sub && <p className="mt-1 text-[11px] text-white/35">{sub}</p>}
  </div>
);

export default function AnalyticsTab() {
  const [data, setData] = useState(null);

  const load = () => api.get("/admin/analytics").then((r) => setData(r.data)).catch(() => {});
  useEffect(() => {
    load();
  }, []);

  if (!data)
    return (
      <div className="py-16 text-center text-sm text-white/40" data-testid="analytics-loading">
        Carregando dados reais...
      </div>
    );

  const maxDaily = Math.max(1, ...data.daily.map((d) => d.count));
  const clicks = data.clicks || {};

  return (
    <div data-testid="analytics-tab">
      <div className="mb-6 flex items-center justify-between">
        <TabTitle title="Visão Geral" subtitle="Dados reais coletados pelo site. Nada aqui é simulado." />
        <button
          onClick={load}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-xs text-white/70 transition-colors hover:border-white/35"
          data-testid="analytics-refresh"
        >
          <RefreshCw size={12} /> Atualizar
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Visitas" value={data.totalVisits} sub={`${data.uniqueVisitors} visitantes únicos (por IP)`} testid="stat-visits" />
        <StatCard label="Cliques no WhatsApp" value={clicks.whatsapp || 0} testid="stat-whatsapp" />
        <StatCard label="Cliques no FREE" value={clicks.free || 0} testid="stat-free" />
        <StatCard label="Cliques no VIP" value={clicks.vip || 0} testid="stat-vip" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Plano mais clicado" value={data.mostClickedPlan || "—"} testid="stat-top-plan" />
        <StatCard label="Diário" value={clicks.plan_diario || 0} testid="stat-plan-diario" />
        <StatCard label="Semanal" value={clicks.plan_semanal || 0} testid="stat-plan-semanal" />
        <StatCard label="Mensal" value={clicks.plan_mensal || 0} testid="stat-plan-mensal" />
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5" data-testid="analytics-daily">
        <p className="mb-4 text-[10px] font-mono-accent tracking-[0.2em] uppercase text-white/40">
          Visitas · últimos 14 dias
        </p>
        <div className="flex h-28 items-end gap-1.5">
          {data.daily.map((d) => (
            <div key={d.date} className="group relative flex-1">
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-bordeaux to-neon/70 transition-all"
                style={{ height: `${Math.max(3, (d.count / maxDaily) * 100)}%` }}
              />
              <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/90 px-2 py-0.5 text-[9px] text-white/80 opacity-0 transition-opacity group-hover:opacity-100">
                {d.date.slice(5)} · {d.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5" data-testid="analytics-referrers">
          <p className="mb-3 text-[10px] font-mono-accent tracking-[0.2em] uppercase text-white/40">Origem do tráfego</p>
          {data.referrers.length === 0 ? (
            <p className="text-xs text-white/35">Nenhuma origem registrada ainda.</p>
          ) : (
            <ul className="space-y-2">
              {data.referrers.map((r, i) => (
                <li key={i} className="flex items-center justify-between gap-3 text-xs">
                  <span className="truncate text-white/70">{r.source}</span>
                  <span className="shrink-0 font-mono-accent text-white/40">{r.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5" data-testid="analytics-recent">
          <p className="mb-3 text-[10px] font-mono-accent tracking-[0.2em] uppercase text-white/40">Eventos recentes</p>
          {data.recent.length === 0 ? (
            <p className="text-xs text-white/35">Nenhum evento ainda.</p>
          ) : (
            <ul className="max-h-64 space-y-2 overflow-y-auto">
              {data.recent.map((e, i) => (
                <li key={i} className="flex items-center justify-between gap-3 text-[11px]">
                  <span className="font-mono-accent text-white/45">{e.ip}</span>
                  <span className="truncate text-white/70">
                    {e.type === "visit" ? "visita" : `clique: ${e.target}`}
                  </span>
                  <span className="shrink-0 text-white/30">{(e.ts || "").slice(5, 16).replace("T", " ")}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
