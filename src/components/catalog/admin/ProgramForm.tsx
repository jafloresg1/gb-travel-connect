import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AVAILABILITY_OPTIONS,
  CURRENCIES,
  REGIONS,
  ROOM_BASIS_OPTIONS,
  departureTotal,
  emptyDeparture,
  errorMessage,
  formatMoney,
  regionImage,
  saveProgramDraft,
  slugify,
  type DepartureDraft,
  type ProgramDraft,
} from "@/lib/catalog";
import ListEditor from "./ListEditor";
import ImageUploadButton from "./ImageUploadButton";
import { Field, NumberInput } from "./fields";

type Props = {
  initial: ProgramDraft;
  heading: string;
  onDone: () => void;
};

const SimpleSelect = ({
  id,
  value,
  options,
  onChange,
}: {
  id: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) => {
  const all = value && !options.includes(value) ? [value, ...options] : options;
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id}>
        <SelectValue placeholder="Selecciona" />
      </SelectTrigger>
      <SelectContent>
        {all.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const ProgramForm = ({ initial, heading, onDone }: Props) => {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<ProgramDraft>(initial);
  const [slugTouched, setSlugTouched] = useState(!!initial.id || !!initial.slug);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("general");

  const set = (patch: Partial<ProgramDraft>) => setDraft((d) => ({ ...d, ...patch }));
  const setDeparture = (i: number, patch: Partial<DepartureDraft>) =>
    set({ departures: draft.departures.map((d, j) => (j === i ? { ...d, ...patch } : d)) });

  const folder = draft.slug || slugify(draft.title) || "programa";

  const save = async () => {
    if (!draft.title.trim()) {
      setTab("general");
      toast.error("El título es obligatorio.");
      return;
    }
    if (!draft.region.trim()) {
      setTab("general");
      toast.error("Selecciona la región.");
      return;
    }
    setSaving(true);
    try {
      const id = await saveProgramDraft(draft);
      setDraft((d) => ({ ...d, id, slug: slugify(d.slug || d.title) }));
      await queryClient.invalidateQueries({ queryKey: ["catalog"] });
      toast.success(initial.id ? "Programa actualizado" : "Programa creado");
      onDone();
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const fillPriceFromDepartures = () => {
    const priced = draft.departures.filter((d) => d.price_base != null);
    if (!priced.length) {
      toast.info("Agrega salidas con precio base primero.");
      return;
    }
    const min = priced.reduce((a, b) => ((b.price_base ?? 0) < (a.price_base ?? 0) ? b : a));
    set({ price_from: min.price_base, taxes_from: min.taxes });
    toast.success("Precio “Desde” actualizado con la salida más barata.");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Button variant="ghost" size="icon" onClick={onDone} aria-label="Volver a la lista">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <h2 className="text-xl md:text-2xl font-semibold truncate">{heading}</h2>
            {draft.title && <p className="text-sm text-muted-foreground truncate">{draft.title}</p>}
          </div>
        </div>
        <div className="flex gap-2">
          {initial.id && draft.is_published && (
            <Button asChild variant="outline" className="gap-2">
              <a href={`/viajes/${initial.slug}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" /> <span className="hidden sm:inline">Ver público</span>
              </a>
            </Button>
          )}
          <Button onClick={save} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Guardar
          </Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <div className="overflow-x-auto -mx-1 px-1">
          <TabsList className="w-max">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="precios">Precios y salidas</TabsTrigger>
            <TabsTrigger value="incluye">Incluye / No incluye</TabsTrigger>
            <TabsTrigger value="itinerario">Itinerario</TabsTrigger>
            <TabsTrigger value="fotos">Fotos</TabsTrigger>
            <TabsTrigger value="interno">Interno</TabsTrigger>
          </TabsList>
        </div>

        <div className="mt-4 rounded-xl border border-border bg-card p-4 md:p-6">
          {/* ---------- General ---------- */}
          <TabsContent value="general" className="mt-0 space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <Field id="p-title" label="Título *">
                <Input
                  id="p-title"
                  value={draft.title}
                  onChange={(e) =>
                    set({ title: e.target.value, ...(slugTouched ? {} : { slug: slugify(e.target.value) }) })
                  }
                />
              </Field>
              <Field id="p-slug" label="Slug (URL)" hint={`gbtravel.mx/viajes/${draft.slug || "…"}`}>
                <Input
                  id="p-slug"
                  value={draft.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set({ slug: e.target.value.toLowerCase().replace(/\s+/g, "-") });
                  }}
                  onBlur={() => set({ slug: slugify(draft.slug || draft.title) })}
                />
              </Field>
              <Field id="p-region" label="Región *">
                <SimpleSelect id="p-region" value={draft.region} options={REGIONS} onChange={(region) => set({ region })} />
              </Field>
              <Field id="p-sort" label="Orden" hint="Menor número aparece primero.">
                <NumberInput
                  id="p-sort"
                  value={draft.sort_order}
                  onChange={(v) => set({ sort_order: v == null ? 0 : Math.round(v) })}
                />
              </Field>
              <Field id="p-days" label="Días">
                <NumberInput id="p-days" min={0} value={draft.days} onChange={(days) => set({ days })} />
              </Field>
              <Field id="p-nights" label="Noches">
                <NumberInput id="p-nights" min={0} value={draft.nights} onChange={(nights) => set({ nights })} />
              </Field>
              <Field id="p-city" label="Ciudad de salida" className="md:col-span-2">
                <Input
                  id="p-city"
                  value={draft.departure_city}
                  placeholder="Ciudad de México (MEX)"
                  onChange={(e) => set({ departure_city: e.target.value })}
                />
              </Field>
            </div>
            <Field id="p-summary" label="Resumen">
              <Textarea
                id="p-summary"
                rows={4}
                value={draft.summary}
                onChange={(e) => set({ summary: e.target.value })}
              />
            </Field>
            <div className="grid md:grid-cols-2 gap-6">
              <ListEditor
                label="Países"
                items={draft.countries}
                onChange={(countries) => set({ countries })}
                placeholder="Ej. España"
              />
              <ListEditor
                label="Ciudades"
                items={draft.cities}
                onChange={(cities) => set({ cities })}
                placeholder="Ej. Madrid"
              />
              <ListEditor
                label="Highlights"
                items={draft.highlights}
                onChange={(highlights) => set({ highlights })}
                placeholder="Ej. Paseo en góndola"
              />
              <ListEditor
                label="Etiquetas"
                items={draft.tags}
                onChange={(tags) => set({ tags })}
                placeholder="Ej. circuito"
                hint="Sirven para la búsqueda del catálogo."
              />
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
              <Switch
                id="p-published"
                checked={draft.is_published}
                onCheckedChange={(is_published) => set({ is_published })}
              />
              <Label htmlFor="p-published" className="cursor-pointer">
                Publicado (visible en gbtravel.mx/viajes)
              </Label>
            </div>
          </TabsContent>

          {/* ---------- Precios y salidas ---------- */}
          <TabsContent value="precios" className="mt-0 space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Field id="p-currency" label="Moneda">
                <SimpleSelect
                  id="p-currency"
                  value={draft.currency}
                  options={CURRENCIES}
                  onChange={(currency) => set({ currency })}
                />
              </Field>
              <Field id="p-room" label="Base de habitación">
                <SimpleSelect
                  id="p-room"
                  value={draft.room_basis}
                  options={ROOM_BASIS_OPTIONS}
                  onChange={(room_basis) => set({ room_basis })}
                />
              </Field>
              <Field id="p-price" label="Precio desde">
                <NumberInput id="p-price" min={0} value={draft.price_from} onChange={(price_from) => set({ price_from })} />
              </Field>
              <Field id="p-taxes" label="Impuestos desde">
                <NumberInput id="p-taxes" min={0} value={draft.taxes_from} onChange={(taxes_from) => set({ taxes_from })} />
              </Field>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <Switch
                  id="p-flight"
                  checked={draft.includes_flight}
                  onCheckedChange={(includes_flight) => set({ includes_flight })}
                />
                <Label htmlFor="p-flight" className="cursor-pointer">
                  Incluye vuelo {draft.includes_flight ? "" : "(se mostrará “Solo terrestre”)"}
                </Label>
              </div>
              <Button type="button" variant="link" className="px-0" onClick={fillPriceFromDepartures}>
                Tomar “Desde” de la salida más barata
              </Button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Salidas ({draft.departures.length})</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => set({ departures: [...draft.departures, emptyDeparture(draft)] })}
                >
                  <Plus className="h-4 w-4" /> Agregar salida
                </Button>
              </div>
              {draft.departures.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin salidas. Agrega al menos una fecha.</p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full min-w-[1100px] text-sm">
                    <thead className="bg-secondary text-left text-xs text-muted-foreground">
                      <tr>
                        <th className="p-2 font-medium">Salida *</th>
                        <th className="p-2 font-medium">Regreso</th>
                        <th className="p-2 font-medium">Ciudad de salida</th>
                        <th className="p-2 font-medium">Moneda</th>
                        <th className="p-2 font-medium">Base</th>
                        <th className="p-2 font-medium">Impuestos</th>
                        <th className="p-2 font-medium">Suplemento</th>
                        <th className="p-2 font-medium">Total</th>
                        <th className="p-2 font-medium">Disponibilidad</th>
                        <th className="p-2 font-medium">Notas</th>
                        <th className="p-2" />
                      </tr>
                    </thead>
                    <tbody>
                      {draft.departures.map((d, i) => (
                        <tr key={i} className="border-t border-border align-top">
                          <td className="p-1.5">
                            <Input
                              type="date"
                              aria-label="Fecha de salida"
                              value={d.start_date}
                              onChange={(e) => setDeparture(i, { start_date: e.target.value })}
                            />
                          </td>
                          <td className="p-1.5">
                            <Input
                              type="date"
                              aria-label="Fecha de regreso"
                              value={d.end_date}
                              onChange={(e) => setDeparture(i, { end_date: e.target.value })}
                            />
                          </td>
                          <td className="p-1.5">
                            <Input
                              aria-label="Ciudad de salida"
                              value={d.departure_city}
                              onChange={(e) => setDeparture(i, { departure_city: e.target.value })}
                            />
                          </td>
                          <td className="p-1.5 w-24">
                            <SimpleSelect
                              id={`d-cur-${i}`}
                              value={d.currency}
                              options={CURRENCIES}
                              onChange={(currency) => setDeparture(i, { currency })}
                            />
                          </td>
                          <td className="p-1.5 w-28">
                            <NumberInput
                              aria-label="Precio base"
                              value={d.price_base}
                              onChange={(price_base) => setDeparture(i, { price_base })}
                            />
                          </td>
                          <td className="p-1.5 w-28">
                            <NumberInput
                              aria-label="Impuestos"
                              value={d.taxes}
                              onChange={(taxes) => setDeparture(i, { taxes })}
                            />
                          </td>
                          <td className="p-1.5 w-28">
                            <NumberInput
                              aria-label="Suplemento"
                              value={d.supplement}
                              onChange={(supplement) => setDeparture(i, { supplement })}
                            />
                          </td>
                          <td className="p-2 whitespace-nowrap font-medium">
                            {formatMoney(departureTotal(d), d.currency) || "—"}
                          </td>
                          <td className="p-1.5 w-40">
                            <SimpleSelect
                              id={`d-av-${i}`}
                              value={d.availability}
                              options={AVAILABILITY_OPTIONS}
                              onChange={(availability) => setDeparture(i, { availability })}
                            />
                          </td>
                          <td className="p-1.5">
                            <Input
                              aria-label="Notas"
                              value={d.notes}
                              onChange={(e) => setDeparture(i, { notes: e.target.value })}
                            />
                          </td>
                          <td className="p-1.5">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label="Borrar salida"
                              onClick={() => set({ departures: draft.departures.filter((_, j) => j !== i) })}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                Las salidas pasadas se ocultan solas en la página pública. Los cambios se aplican al guardar.
              </p>
            </div>
          </TabsContent>

          {/* ---------- Incluye ---------- */}
          <TabsContent value="incluye" className="mt-0 grid md:grid-cols-2 gap-6">
            <ListEditor
              label="Incluye"
              items={draft.includes}
              onChange={(includes) => set({ includes })}
              hint="Puedes pegar varias líneas a la vez."
            />
            <ListEditor
              label="No incluye"
              items={draft.not_includes}
              onChange={(not_includes) => set({ not_includes })}
              hint="Puedes pegar varias líneas a la vez."
            />
          </TabsContent>

          {/* ---------- Itinerario ---------- */}
          <TabsContent value="itinerario" className="mt-0 space-y-4">
            {draft.itinerary.length === 0 && (
              <p className="text-sm text-muted-foreground">Sin itinerario. Es opcional.</p>
            )}
            {draft.itinerary.map((d, i) => (
              <div key={i} className="rounded-lg border border-border p-3 space-y-2">
                <div className="flex gap-2 items-end">
                  <Field id={`it-day-${i}`} label="Día" className="w-20">
                    <NumberInput
                      id={`it-day-${i}`}
                      value={d.day}
                      onChange={(v) =>
                        set({ itinerary: draft.itinerary.map((x, j) => (j === i ? { ...x, day: v ?? i + 1 } : x)) })
                      }
                    />
                  </Field>
                  <Field id={`it-title-${i}`} label="Título" className="flex-1">
                    <Input
                      id={`it-title-${i}`}
                      value={d.title}
                      onChange={(e) =>
                        set({
                          itinerary: draft.itinerary.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)),
                        })
                      }
                    />
                  </Field>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Quitar día ${d.day}`}
                    onClick={() => set({ itinerary: draft.itinerary.filter((_, j) => j !== i) })}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea
                  aria-label={`Descripción del día ${d.day}`}
                  rows={3}
                  value={d.description}
                  onChange={(e) =>
                    set({
                      itinerary: draft.itinerary.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)),
                    })
                  }
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="gap-1"
              onClick={() =>
                set({
                  itinerary: [
                    ...draft.itinerary,
                    {
                      day: (draft.itinerary[draft.itinerary.length - 1]?.day ?? 0) + 1,
                      title: "",
                      description: "",
                    },
                  ],
                })
              }
            >
              <Plus className="h-4 w-4" /> Agregar día
            </Button>
          </TabsContent>

          {/* ---------- Fotos ---------- */}
          <TabsContent value="fotos" className="mt-0 space-y-6">
            <div className="grid md:grid-cols-[240px_1fr] gap-4 items-start">
              <img
                src={draft.image_url || regionImage(draft.region)}
                alt="Foto principal"
                className="w-full aspect-[4/3] object-cover rounded-lg border border-border"
              />
              <div className="space-y-3">
                <Field
                  id="p-image"
                  label="Foto principal (URL)"
                  hint={draft.image_url ? undefined : "Sin foto: se usa una imagen genérica según la región."}
                >
                  <Input
                    id="p-image"
                    value={draft.image_url}
                    placeholder="https://…"
                    onChange={(e) => set({ image_url: e.target.value })}
                  />
                </Field>
                <div className="flex flex-wrap gap-2">
                  <ImageUploadButton
                    folder={folder}
                    label="Subir foto principal"
                    onUploaded={([url]) => set({ image_url: url })}
                  />
                  {draft.image_url && (
                    <Button type="button" variant="ghost" onClick={() => set({ image_url: "" })}>
                      Quitar
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <h3 className="font-semibold">Galería ({draft.gallery.length})</h3>
                <ImageUploadButton
                  folder={folder}
                  multiple
                  label="Subir fotos a la galería"
                  onUploaded={(urls) => setDraft((d) => ({ ...d, gallery: [...d.gallery, ...urls] }))}
                />
              </div>
              {draft.gallery.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {draft.gallery.map((url, i) => (
                    <div key={url + i} className="relative group">
                      <img src={url} alt={`Galería ${i + 1}`} className="w-full aspect-square object-cover rounded-lg" />
                      <div className="absolute inset-x-1 bottom-1 flex justify-between gap-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="h-7 px-2 text-xs"
                          onClick={() => set({ image_url: url })}
                        >
                          Principal
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="h-7 w-7"
                          aria-label={`Quitar foto ${i + 1}`}
                          onClick={() => set({ gallery: draft.gallery.filter((_, j) => j !== i) })}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4">
                <ListEditor
                  label="URLs de la galería"
                  items={draft.gallery}
                  onChange={(gallery) => set({ gallery })}
                  placeholder="https://… (pega una URL de imagen)"
                />
              </div>
            </div>
          </TabsContent>

          {/* ---------- Interno ---------- */}
          <TabsContent value="interno" className="mt-0 space-y-4">
            <p className="text-sm rounded-lg bg-accent/10 border border-accent/40 p-3">
              Solo visible para el equipo. Nunca se muestra en la página pública.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Field id="i-operator" label="Operador">
                <Input
                  id="i-operator"
                  value={draft.internal.operator}
                  placeholder="Mega Travel, Euromundo…"
                  onChange={(e) => set({ internal: { ...draft.internal, operator: e.target.value } })}
                />
              </Field>
              <Field id="i-code" label="Clave del operador">
                <Input
                  id="i-code"
                  value={draft.internal.operator_code}
                  placeholder="MT-12585"
                  onChange={(e) => set({ internal: { ...draft.internal, operator_code: e.target.value } })}
                />
              </Field>
              <Field id="i-url" label="Liga del operador" className="md:col-span-2">
                <div className="flex gap-2">
                  <Input
                    id="i-url"
                    type="url"
                    value={draft.internal.operator_url}
                    placeholder="https://…"
                    onChange={(e) => set({ internal: { ...draft.internal, operator_url: e.target.value } })}
                  />
                  {draft.internal.operator_url && (
                    <Button asChild variant="outline" size="icon" aria-label="Abrir liga del operador">
                      <a href={draft.internal.operator_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </Field>
            </div>
            <Field id="i-notes" label="Notas internas">
              <Textarea
                id="i-notes"
                rows={5}
                value={draft.internal.internal_notes}
                onChange={(e) => set({ internal: { ...draft.internal, internal_notes: e.target.value } })}
              />
            </Field>
          </TabsContent>
        </div>
      </Tabs>

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

export default ProgramForm;
