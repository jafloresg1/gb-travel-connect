import { promotionStatus, type CatalogPromotion } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const STYLES = {
  Vigente: "bg-whatsapp/15 text-whatsapp",
  Programada: "bg-primary/10 text-primary",
  Vencida: "bg-muted text-muted-foreground",
  Borrador: "bg-accent/20 text-foreground",
} as const;

const PromotionStatusBadge = ({ promotion }: { promotion: CatalogPromotion }) => {
  const status = promotionStatus(promotion);
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", STYLES[status])}>{status}</span>
  );
};

export default PromotionStatusBadge;
