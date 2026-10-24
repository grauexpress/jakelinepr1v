import { useRef, useState } from "react";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { api, imgUrl } from "@/lib/api";

export const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-colors focus:border-[#FF2A70]/60 focus:ring-1 focus:ring-[#FF2A70]/30";

export const setPath = (obj, path, value) => {
  const copy = structuredClone(obj);
  let o = copy;
  for (let i = 0; i < path.length - 1; i++) o = o[path[i]];
  o[path[path.length - 1]] = value;
  return copy;
};

export const Field = ({ label, hint, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-[11px] font-mono-accent tracking-[0.18em] uppercase text-white/45">
      {label}
    </span>
    {children}
    {hint && <span className="mt-1 block text-[11px] text-white/30">{hint}</span>}
  </label>
);

export const Text = ({ label, value, onChange, placeholder, hint, testid }) => (
  <Field label={label} hint={hint}>
    <input
      className={inputCls}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      data-testid={testid}
    />
  </Field>
);

export const Area = ({ label, value, onChange, rows = 3, hint, testid }) => (
  <Field label={label} hint={hint}>
    <textarea
      rows={rows}
      className={inputCls}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      data-testid={testid}
    />
  </Field>
);

export const Num = ({ label, value, onChange, testid }) => (
  <Field label={label}>
    <input
      type="number"
      className={inputCls}
      value={value ?? 0}
      onChange={(e) => onChange(Number(e.target.value))}
      data-testid={testid}
    />
  </Field>
);

export const Color = ({ label, value, onChange, testid }) => (
  <Field label={label}>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value || "#000000"}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-12 shrink-0 rounded-lg border border-white/10 bg-transparent cursor-pointer"
        data-testid={testid}
      />
      <input className={inputCls} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </div>
  </Field>
);

export const SwitchRow = ({ label, checked, onChange, testid }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:border-white/20"
    data-testid={testid}
  >
    <span className="text-sm text-white/80 text-left">{label}</span>
    <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? "bg-[#FF2A70]" : "bg-white/15"}`}>
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-[left] duration-200 ${
          checked ? "left-[18px]" : "left-0.5"
        }`}
      />
    </span>
  </button>
);

export const ImageField = ({ label, value, onChange, testid }) => {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const upload = async (file) => {
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await api.post("/admin/upload", fd);
      onChange(r.data.url);
      toast.success("Imagem enviada");
    } catch {
      toast.error("Falha no upload");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Field label={label}>
      <div className="flex items-start gap-3">
        {value ? (
          <img src={imgUrl(value)} alt="" className="h-14 w-14 shrink-0 rounded-xl border border-white/10 object-cover" />
        ) : (
          <div className="h-14 w-14 shrink-0 rounded-xl border border-dashed border-white/15" />
        )}
        <div className="flex-1 space-y-2">
          <input
            className={inputCls}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... ou envie um arquivo"
            data-testid={testid}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-white/30"
            data-testid={testid ? `${testid}-upload` : undefined}
          >
            {busy ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />} Enviar imagem
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
        </div>
      </div>
    </Field>
  );
};

export const ListEditor = ({ label, items, onChange, testid }) => (
  <Field label={label}>
    <div className="space-y-2" data-testid={testid}>
      {(items || []).map((it, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            className={inputCls}
            value={it}
            onChange={(e) => onChange(items.map((x, k) => (k === i ? e.target.value : x)))}
            data-testid={testid ? `${testid}-${i}` : undefined}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, k) => k !== i))}
            className="p-2 text-white/40 transition-colors hover:text-red-400"
            aria-label="Remover"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...(items || []), ""])}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-white/20 px-3 py-2 text-xs text-white/60 transition-colors hover:border-white/40"
        data-testid={testid ? `${testid}-add` : undefined}
      >
        <Plus size={12} /> Adicionar item
      </button>
    </div>
  </Field>
);

export const SaveBar = ({ onSave, saving }) => (
  <div className="sticky bottom-4 z-10 mt-8 flex justify-end">
    <button
      onClick={onSave}
      disabled={saving}
      className="inline-flex items-center gap-2 rounded-full bg-[#FF2A70] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(255,42,112,0.35)] transition-opacity disabled:opacity-50"
      data-testid="tab-save"
    >
      {saving && <Loader2 size={15} className="animate-spin" />}
      Salvar alterações
    </button>
  </div>
);

export const TabTitle = ({ title, subtitle }) => (
  <div className="mb-6">
    <h2 className="font-serif-display text-2xl text-white">{title}</h2>
    {subtitle && <p className="mt-1 text-sm text-white/40">{subtitle}</p>}
  </div>
);
