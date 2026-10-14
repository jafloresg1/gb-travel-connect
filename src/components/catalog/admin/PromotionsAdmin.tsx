import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  deletePromotion,
  emptyPromotionDraft,
  errorMessage,
  formatDate,
  promotionToDraft,
  useAdminPromotions,
  type PromotionDraft,
} from "@/lib/catalog";
import ConfirmButton from "./ConfirmButton";
import PromotionForm from "./PromotionForm";
import PromotionStatusBadge from "./PromotionStatusBadge";

const PromotionsAdmin = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useAdminPromotions();
  const [editing, setEditing] = useState<{ draft: PromotionDraft; key: number } | null>(null);

  if (editing) {
    return <PromotionForm key={editing.key} initial={editing.draft} onDone={() => setEditing(null)} />;
  }

  const remove = async (id: string, title: string) => {
    try {
      await deletePromotion(id);
      await queryClient.invalidateQueries({ queryKey: ["catalog"] });
      toast.success(`“${title}” eliminada`);
    } catch (e) {
      toast.error(errorMessage(e));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-3">
        <p className="text-sm text-muted-foreground">
          Las promociones vencidas se ocultan solas en la página pública; los programas siguen con su precio normal.
        </p>
        <Button className="gap-2 shrink-0" onClick={() => setEditing({ draft: emptyPromotionDraft(), key: Date.now() })}>
          <Plus className="h-4 w-4" /> Nueva promoción
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      ) : isError ? (
        <div className="text-center py-10" role="alert">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="mb-3">No se pudieron cargar las promociones.</p>
          <Button variant="outline" onClick={() => refetch()}>
            Reintentar
          </Button>
        </div>
      ) : !data?.length ? (
        <p className="text-center text-muted-foreground py-10">Aún no hay promociones.</p>
      ) : (
        <ul className="space-y-3">
          {data.map((p) => (
            <li
              key={p.id}
              className="rounded-xl border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{p.title}</p>
                  <PromotionStatusBadge promotion={p} />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {p.valid_from ? formatDate(p.valid_from) : "Sin fecha inicial"} →{" "}
                  {p.valid_to ? formatDate(p.valid_to) : "sin fecha final"} · {p.links.length} programas
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  onClick={() => setEditing({ draft: promotionToDraft(p), key: Date.now() })}
                >
                  <Pencil className="h-4 w-4" /> Editar
                </Button>
                <ConfirmButton
                  title="¿Eliminar promoción?"
                  description={`Se borrará “${p.title}” y sus ligas con programas. Los programas no se borran.`}
                  onConfirm={() => remove(p.id, p.title)}
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 text-destructive hover:text-destructive"
                    aria-label={`Eliminar ${p.title}`}
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

export default PromotionsAdmin;
