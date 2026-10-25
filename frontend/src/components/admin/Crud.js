import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Area, ImageField, SwitchRow, Text } from "./Fields";

export function Crud({
  resource,
  title,
  subtitle,
  fields,
  makeNew,
  itemLabel,
  testid,
}) {
  const [items, setItems] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    api
      .get(`/admin/${resource}`)
      .then((r) => setItems(r.data))
      .catch(() => toast.error("Erro ao carregar"));
  }, [resource]);

  const patch = (id, key, value) =>
    setItems((arr) =>
      arr.map((it) => (it.id === id ? { ...it, [key]: value } : it))
    );

  const save = async (item) => {
    setSavingId(item.id);

    try {
      await api.put(`/admin/${resource}/${item.id}`, item);
      toast.success("Salvo com sucesso");
    } catch {
      toast.error("Erro ao salvar");
    } finally {
      setSavingId(null);
    }
  };

  const create = async () => {
    try {
      const item = makeNew();
      const response = await api.post(`/admin/${resource}`, item);

      setItems((arr) => [...arr, response.data]);
      setOpenId(response.data.id);

      toast.success("Criado com sucesso");
    } catch {
      toast.error("Erro ao criar");
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Excluir ${itemLabel(item)}?`)) return;

    try {
      await api.delete(`/admin/${resource}/${item.id}`);

      setItems((arr) => arr.filter((it) => it.id !== item.id));

      if (openId === item.id) {
        setOpenId(null);
      }

      toast.success("Excluído com sucesso");
    } catch {
      toast.error("Erro ao excluir");
    }
  };

  if (items === null) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  return (
    <div data-testid={testid} className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>

          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <button
          type="button"
          onClick={create}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium"
        >
          <Plus size={16} />
          Adicionar
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const isOpen = openId === item.id;

          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border bg-background"
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 p-4 text-left"
              >
                <div className="min-w-0">
                  <div className="truncate font-medium">
                    {itemLabel(item)}
                  </div>

                  <div className="mt-1 text-xs text-muted-foreground">
                    ID: {item.id}
                  </div>
                </div>

                {isOpen ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>

              {isOpen && (
                <div className="space-y-5 border-t p-4">
                  {fields.map((field) => {
                    const value = item[field.key];

                    if (field.type === "switch") {
                      return (
                        <SwitchRow
                          key={field.key}
                          label={field.label}
                          checked={Boolean(value)}
                          onChange={(checked) =>
                            patch(item.id, field.key, checked)
                          }
                        />
                      );
                    }

                    if (field.type === "image") {
                      return (
                        <ImageField
                          key={field.key}
                          label={field.label}
                          value={value || ""}
                          onChange={(next) =>
                            patch(item.id, field.key, next)
                          }
                        />
                      );
                    }

                    if (field.type === "area") {
                      return (
                        <Area
                          key={field.key}
                          label={field.label}
                          value={value || ""}
                          onChange={(next) =>
                            patch(item.id, field.key, next)
                          }
                        />
                      );
                    }

                    return (
                      <Text
                        key={field.key}
                        label={field.label}
                        value={value ?? ""}
                        type={field.type || "text"}
                        placeholder={field.placeholder}
                        onChange={(next) =>
                          patch(item.id, field.key, next)
                        }
                      />
                    );
                  })}

                  <div className="flex justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => remove(item)}
                      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                    >
                      <Trash2 size={16} />
                      Excluir
                    </button>

                    <button
                      type="button"
                      onClick={() => save(item)}
                      disabled={savingId === item.id}
                      className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium"
                    >
                      {savingId === item.id && (
                        <Loader2 size={16} className="animate-spin" />
                      )}

                      Salvar
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}