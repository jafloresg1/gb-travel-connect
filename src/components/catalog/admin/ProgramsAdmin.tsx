import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Copy, ExternalLink, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  deleteProgram,
  durationText,
  errorMessage,
  loadProgramDraft,
  priceFromText,
  programImage,
  useAdminPrograms,
  type ProgramDraft,
} from "@/lib/catalog";
import ConfirmButton from "./ConfirmButton";

const ALL = "__all";

type Props = {
  onOpenEditor: (draft: ProgramDraft, heading: string) => void;
  onNew: () => void;
};

const ProgramsAdmin = ({ onOpenEditor, onNew }: Props) => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useAdminPrograms();
  const [q, setQ] = useState("");
  const [region, setRegion] = useState(ALL);
  const [operator, setOperator] = useState(ALL);
  const [published, setPublished] = useState(ALL);
  const [busyId, setBusyId] = useState<string | null>(null);

  const programs = useMemo(() => data ?? [], [data]);
  const regions = useMemo(() => [...new Set(programs.map((p) => p.region))].sort(), [programs]);
  const operators = useMemo(
    () => [...new Set(programs.map((p) => p.internal?.operator).filter((o): o is string => !!o))].sort(),
    [programs],
  );

  const filtered = programs.filter((p) => {
    if (region !== ALL && p.region !== region) return false;
    if (operator !== ALL && (p.internal?.operator ?? "") !== operator) return false;
    if (published === "si" && !p.is_published) return false;
    if (published === "no" && p.is_published) return false;
    if (q.trim()) {
      const hay = [p.title, p.slug, p.region, ...p.countries, ...p.cities, p.internal?.operator_code ?? "", p.internal?.operator ?? ""]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q.trim().toLowerCase())) return false;
    }
    return true;
  });

  const open = async (id: string, duplicate: boolean) => {
    setBusyId(id);
    try {
      const draft = await loadProgramDraft(id);
      if (duplicate) {
        onOpenEditor(
          { ...draft, id: undefined, title: `${draft.title} (copia)`, slug: `${draft.slug}-copia`, is_published: false },
          "Duplicar programa",
        );
      } else {
        onOpenEditor(draft, "Editar programa");
      }
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string, title: string) => {
    setBusyId(id);
    try {
      await deleteProgram(id);
      await queryClient.invalidateQueries({ queryKey: ["catalog"] });
      toast.success(`“${title}” eliminado`);
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por título, país, clave…"
            className="pl-9"
            aria-label="Buscar programas"
          />
        </div>
        <div className="grid grid-cols-3 gap-2 lg:w-[480px]">
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger aria-label="Filtrar por región">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Región: todas</SelectItem>
              {regions.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={operator} onValueChange={setOperator}>
            <SelectTrigger aria-label="Filtrar por operador">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Operador: todos</SelectItem>
              {operators.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={published} onValueChange={setPublished}>
            <SelectTrigger aria-label="Filtrar por publicado">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Estado: todos</SelectItem>
              <SelectItem value="si">Publicados</SelectItem>
              <SelectItem value="no">Ocultos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={onNew} className="gap-2">
          <Plus className="h-4 w-4" /> Nuevo programa
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-10" role="alert">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="mb-3">No se pudieron cargar los programas.</p>
          <Button variant="outline" onClick={() => refetch()}>
            Reintentar
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">
          {programs.length ? "Ningún programa coincide con los filtros." : "Aún no hay programas. Crea el primero."}
        </p>
      ) : (
        <ul className="space-y-3">
          <li className="text-xs text-muted-foreground">{filtered.length} programas</li>
          {filtered.map((p) => (
            <li key={p.id} className="rounded-xl border border-border bg-card p-3 flex flex-col sm:flex-row gap-3">
              <img
                src={programImage(p)}
                alt=""
                loading="lazy"
                className="w-full sm:w-28 h-32 sm:h-20 object-cover rounded-lg shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{p.title}</p>
                  <Badge variant={p.is_published ? "default" : "secondary"}>
                    {p.is_published ? "Publicado" : "Oculto"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {p.region}
                  {p.countries.length ? ` · ${p.countries.join(", ")}` : ""}
                  {durationText(p.days, p.nights) ? ` · ${durationText(p.days, p.nights)}` : ""} ·{" "}
                  {p.departures_count} salidas · orden {p.sort_order}
                </p>
                <p className="text-sm mt-1">{priceFromText(p.price_from, p.taxes_from, p.currency)}</p>
                {(p.internal?.operator || p.internal?.operator_code) && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {p.internal?.operator}
                    {p.internal?.operator_code ? ` · ${p.internal.operator_code}` : ""}
                  </p>
                )}
              </div>
              <div className="flex sm:flex-col lg:flex-row items-start gap-1 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  disabled={busyId === p.id}
                  onClick={() => open(p.id, false)}
                >
                  {busyId === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />}
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-1"
                  disabled={busyId === p.id}
                  onClick={() => open(p.id, true)}
                >
                  <Copy className="h-4 w-4" /> Duplicar
                </Button>
                {p.is_published && (
                  <Button asChild size="icon" variant="ghost" className="h-9 w-9" aria-label="Ver página pública">
                    <a href={`/viajes/${p.slug}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                <ConfirmButton
                  title="¿Eliminar programa?"
                  description={`Se borrará “${p.title}” con sus salidas, datos internos y ligas a promociones. Esta acción no se puede deshacer.`}
                  onConfirm={() => remove(p.id, p.title)}
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 text-destructive hover:text-destructive"
                    aria-label={`Eliminar ${p.title}`}
                    disabled={busyId === p.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </ConfirmButton>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProgramsAdmin;
