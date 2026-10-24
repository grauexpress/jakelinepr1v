import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Area, ImageField, SwitchRow, Text } from "./Fields";

export function Crud({ resource, title, subtitle, fields, makeNew, itemLabel, testid }) {
  const [items, setItems] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [savingId, setSavingId] = useState(null);

  const load = () =>
    api
      .get(`/admin/${resource}`)
      .then((r) => setItems(r.data))
      .catch(() => toast.error("Erro ao carregar"));

  useEffect(() => {
    load();
  }, [resource]);

  const patch = (id, key, value) =>
    setItems((arr) => arr.map((it) => (it.id === id ? { ...it, [key]: value } : it)));

  const save = async (item) => {
    setSavingId(item.id);
    try {
      await api.put(`/admin/${resource}/${item.id}`, item);
      toast.success("Item salvo");
    } catch {
      toast.error("Erro ao salvar");
    } finally {
      setSavingId(null);
    }
  };

  const add = async () => {
    try {
      const r = await api.post(`/admin/${resource}`, makeNew());
      setItems((arr) => [...arr, r.data]);
      setOpenId(r.data.id);
      toast.success("Item criado");
    } catch {
      toast.error("Erro ao criar");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Remover este item?")) return;
    try {
      await api.delete(`/admin/${resource}/${id}`);
      setItems((arr) => arr.filter((it) => it.id !== id));
      toast.success("Removido");
    } catch {
      toast.error("Erro ao remover");
    }
  };

  const move = async (index, dir) => {
    const arr = [...items];
    const j = index + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[index], arr[j]] = [arr[j], arr[index]];
    const reordered = arr.map((it, k) => ({ ...it, order: k }));
    setItems(reordered);
    try {
      await Promise.all([
        api.put(`/admin/${resource}/${reordered[index].id}`, reordered[index]),
        api.put(`/admin/${resource}/${reordered[j].id}`, reordered[j]),
      ]);
    } catch {
      toast.error("Erro ao reordenar");
    }
  };

  if (!items)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-white/40" />
      </div>
    );

  return (
    <div data-testid={testid}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif-display text-2xl text-white">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-white/40">{subtitle}</p>}
        </div>
        <button
          onClick={add}
          className="inline-flex items-center gap-2 rounded-full border border-[#FF2A70]/50 bg-[#FF2A70]/10 px-4 py-2 text-xs font-semibold text-[#FF2A70] transition-colors hover:bg-[#FF2A70]/20"
          data-testid={`${testid}-add`}
        >
          <Plus size={14} /> Adicionar
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.03]" data-testid={`${testid}-item-${i}`}>
            <div className="flex items-center gap-1.5 px-4 py-3">
              <button
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                className="flex flex-1 items-center gap-2 text-left text-sm text-white/85"
                data-testid={`${testid}-toggle-${i}`}
              >
                {openId === item.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                <span className="truncate">{itemLabel(item)}</span>
              </button>
              {!item.active && (
                <span className="rounded-full border border-white/10 px-2 py-0.5 text-[9px] font-mono-accent uppercase tracking-widest text-white/30">
                  inativo
                </span>
              )}
              <button onClick={() => move(i, -1)} className="p-1.5 text-white/40 transition-colors hover:text-white" aria-label="Mover para cima" data-testid={`${testid}-up-${i}`}>
                <ChevronUp size={14} />
              </button>
              <button onClick={() => move(i, 1)} className="p-1.5 text-white/40 transition-colors hover:text-white" aria-label="Mover para baixo" data-testid={`${testid}-down-${i}`}>
                <ChevronDown size={14} />
              </button>
              <button onClick={() => remove(item.id)} className="p-1.5 text-white/40 transition-colors hover:text-red-400" aria-label="Remover" data-testid={`${testid}-delete-${i}`}>
                <Trash2 size={14} />
              </button>
            </div>

            {openId === item.id && (
              <div className="grid gap-4 border-t border-white/10 p-4 sm:grid-cols-2">
                {fields.map((f) => {
                  const val = item[f.key] ?? "";
                  if (f.type === "textarea")
                    return <Area key={f.key} label={f.label} value={val} onChange={(v) => patch(item.id, f.key, v)} testid={`${testid}-${f.key}-${i}`} />;
                  if (f.type === "image")
                    return <ImageField key={f.key} label={f.label} value={val} onChange={(v) => patch(item.id, f.key, v)} testid={`${testid}-${f.key}-${i}`} />;
                  if (f.type === "switch")
                    return <SwitchRow key={f.key} label={f.label} checked={!!item[f.key]} onChange={(v) => patch(item.id, f.key, v)} testid={`${testid}-${f.key}-${i}`} />;
                  return <Text key={f.key} label={f.label} value={val} onChange={(v) => patch(item.id, f.key, v)} testid={`${testid}-${f.key}-${i}`} />;
                })}
                <div className="flex justify-end sm:col-span-2">
                  <button
                    onClick={() => save(item)}
                    disabled={savingId === item.id}
                    className="rounded-full bg-[#FF2A70] px-5 py-2 text-xs font-semibold text-white transition-opacity disabled:opacity-50"
                    data-testid={`${testid}-save-${i}`}
                  >
                    {savingId === item.id ? "Salvando..." : "Salvar item"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <p className="rounded-2xl border border-dashed border-white/10 py-10 text-center text-sm text-white/35">
            Nenhum item ainda. Clique em Adicionar.
          </p>
        )}
      </div>
    </div>
  );
}
