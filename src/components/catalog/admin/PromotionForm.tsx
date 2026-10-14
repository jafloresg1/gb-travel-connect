import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  errorMessage,
  formatMoney,
  savePromotionDraft,
  slugify,
  useAdminPrograms,
  type PromotionDraft,
} from "@/lib/catalog";
import ImageUploadButton from "./ImageUploadButton";
import PromotionStatusBadge from "./PromotionStatusBadge";
import { Field, NumberInput } from "./fields";

type Props = { initial: PromotionDraft; onDone: () => void };

const PromotionForm = ({ initial, onDone }: Props) => {
  const queryClient = useQueryClient();
  const { data: programs = [] } = useAdminPrograms();
  const [draft, setDraft] = useState<PromotionDraft>(initial);
  const [slugTouched, setSlugTouched] = useState(!!initial.id);
  const [saving, setSaving] = useState(false);
  const [toAdd, setToAdd] = useState("");

  const set = (patch: Partial<PromotionDraft>) => setDraft((d) => ({ ...d, ...patch }));
  const linked = new Set(draft.links.map((l) => l.program_id));
  const available = programs.filter((p) => !linked.has(p.id));
  const programById = new Map(programs.map((p) => [p.id, p]));

  const save = async () => {
    if (!draft.title.trim()) {
      toast.error("El título es obligatorio.");
      return;
    }
    if (draft.valid_from && draft.valid_to && draft.valid_to < draft.valid_from) {
      toast.error("La fecha final debe ser posterior a la inicial.");
      return;
    }
    setSaving(true);
    try {
      await savePromotionDraft(draft);
      await queryClient.invalidateQueries({ queryKey: ["catalog"] });
      toast.success(initial.id ? "Promoción actualizada" : "Promoción creada");
      onDone();
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const statusPreview = {
    id: "",
    slug: draft.slug,
    title: draft.title,
    description: null,
    valid_from: draft.valid_from || null,
    valid_to: draft.valid_to || null,
    clauses: null,
    deposit_text: null,
    image_url: null,
    is_published: draft.is_published,
    created_at: "",
    updated_at: "",
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onDone} aria-label="Volver a la lista">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl md:text-2xl font-semibold">{initial.id ? "Editar promoción" : "Nueva promoción"}</h2>
          <PromotionStatusBadge promotion={statusPreview} />
        </div>
        <Button onClick={save} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Guardar
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 md:p-6 space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <Field id="pr-title" label="Título *">
            <Input
              id="pr-title"
              value={draft.title}
              onChange={(e) =>
                set({ title: e.target.value, ...(slugTouched ? {} : { slug: slugify(e.target.value) }) })
              }
            />
          </Field>
          <Field id="pr-slug" label="Slug">
            <Input
              id="pr-slug"
              value={draft.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set({ slug: e.target.value.toLowerCase().replace(/\s+/g, "-") });
              }}
              onBlur={() => set({ slug: slugify(draft.slug || draft.title) })}
            />
          </Field>
          <Field id="pr-from" label="Vigente desde">
            <Input id="pr-from" type="date" value={draft.valid_from} onChange={(e) => set({ valid_from: e.target.value })} />
          </Field>
          <Field id="pr-to" label="Vigente hasta" hint="Al pasar esta fecha se oculta sola en la página pública.">
            <Input id="pr-to" type="date" value={draft.valid_to} onChange={(e) => set({ valid_to: e.target.value })} />
          </Field>
        </div>
        <Field id="pr-desc" label="Descripción">
          <Textarea id="pr-desc" rows={2} value={draft.description} onChange={(e) => set({ description: e.target.value })} />
        </Field>
        <Field id="pr-deposit" label="Texto de apartado">
          <Input
            id="pr-deposit"
            value={draft.deposit_text}
            placeholder="Aparta con 99 USD (no reembolsable)"
            onChange={(e) => set({ deposit_text: e.target.value })}
          />
        </Field>
        <Field id="pr-clauses" label="Cláusulas" hint="Una cláusula por línea.">
          <Textarea id="pr-clauses" rows={6} value={draft.clauses} onChange={(e) => set({ clauses: e.target.value })} />
        </Field>
        <div className="grid md:grid-cols-[200px_1fr] gap-4 items-start">
          {draft.image_url ? (
            <img src={draft.image_url} alt="Imagen de la promoción" className="w-full aspect-[4/3] object-cover rounded-lg" />
          ) : (
            <div className="w-full aspect-[4/3] rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">
              Sin imagen
            </div>
          )}
          <div className="space-y-2">
            <Field id="pr-image" label="Foto (URL)">
              <Input id="pr-image" value={draft.image_url} onChange={(e) => set({ image_url: e.target.value })} />
            </Field>
            <ImageUploadButton
              folder={`promociones/${draft.slug || slugify(draft.title) || "promo"}`}
              onUploaded={([url]) => set({ image_url: url })}
            />
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
          <Switch id="pr-published" checked={draft.is_published} onCheckedChange={(is_published) => set({ is_published })} />
          <Label htmlFor="pr-published" className="cursor-pointer">
            Publicada
          </Label>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 md:p-6 space-y-4">
        <h3 className="font-semibold">Programas en esta promoción ({draft.links.length})</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={toAdd} onValueChange={setToAdd}>
            <SelectTrigger className="sm:max-w-md" aria-label="Programa a ligar">
              <SelectValue placeholder={available.length ? "Selecciona un programa" : "Todos los programas ya están ligados"} />
            </SelectTrigger>
            <SelectContent>
              {available.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.title} {p.is_published ? "" : "(oculto)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            className="gap-1"
            disabled={!toAdd}
            onClick={() => {
              set({ links: [...draft.links, { program_id: toAdd, badge: "", promo_price: null, promo_notes: "" }] });
              setToAdd("");
            }}
          >
            <Plus className="h-4 w-4" /> Ligar programa
          </Button>
        </div>

        {draft.links.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aún no hay programas ligados.</p>
        ) : (
          <ul className="space-y-3">
            {draft.links.map((l, i) => {
              const p = programById.get(l.program_id);
              const update = (patch: Partial<typeof l>) =>
                set({ links: draft.links.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
              return (
                <li key={l.program_id} className="rounded-lg border border-border p-3 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{p?.title ?? "Programa no encontrado"}</p>
                      {p && (
                        <p className="text-xs text-muted-foreground">
                          Precio normal: {formatMoney(p.price_from, p.currency) || "—"}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Quitar programa de la promoción"
                      onClick={() => set({ links: draft.links.filter((_, j) => j !== i) })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <Field id={`l-badge-${i}`} label="Badge">
                      <Input
                        id={`l-badge-${i}`}
                        value={l.badge}
                        placeholder="−200 USD"
                        onChange={(e) => update({ badge: e.target.value })}
                      />
                    </Field>
                    <Field id={`l-price-${i}`} label={`Precio promo${p ? ` (${p.currency})` : ""}`} hint="Opcional; reemplaza el “Desde”.">
                      <NumberInput id={`l-price-${i}`} value={l.promo_price} onChange={(promo_price) => update({ promo_price })} />
                    </Field>
                    <Field id={`l-notes-${i}`} label="Nota">
                      <Input id={`l-notes-${i}`} value={l.promo_notes} onChange={(e) => update({ promo_notes: e.target.value })} />
                    </Field>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onDone}>
          Cancelar
        </Button>
        <Button onClick={save} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Guardar
        </Button>
      </div>
    </div>
  );
};

export default PromotionForm;
