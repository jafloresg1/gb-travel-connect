import { useState } from "react";
import { BadgePercent, CalendarClock, ChevronDown, Wallet } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { clauseList, formatValidUntil, type CatalogPromotion } from "@/lib/catalog";
import { cn } from "@/lib/utils";

type Props = {
  promotion: CatalogPromotion;
  badge?: string | null;
  notes?: string | null;
  /** Cláusulas visibles por defecto (detalle) o colapsadas (listado de promociones). */
  collapsibleClauses?: boolean;
  className?: string;
};

const PromotionBlock = ({ promotion, badge, notes, collapsibleClauses = false, className }: Props) => {
  const clauses = clauseList(promotion.clauses);
  const [open, setOpen] = useState(!collapsibleClauses);

  return (
    <section
      className={cn("rounded-xl border-2 border-accent/60 bg-accent/5 p-5 md:p-6", className)}
      aria-label={`Promoción ${promotion.title}`}
    >
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
          <BadgePercent className="h-3.5 w-3.5" /> {badge || "Promoción"}
        </span>
        {promotion.valid_to && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground/80">
            <CalendarClock className="h-3.5 w-3.5" /> Válido hasta el {formatValidUntil(promotion.valid_to)}
          </span>
        )}
      </div>
      <h3 className="font-heading text-xl md:text-2xl font-semibold">{promotion.title}</h3>
      {promotion.description && <p className="text-sm text-muted-foreground mt-1">{promotion.description}</p>}
      {notes && <p className="text-sm font-medium mt-3">{notes}</p>}
      {promotion.deposit_text && (
        <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-background px-3 py-2 text-sm font-semibold text-primary">
          <Wallet className="h-4 w-4" /> {promotion.deposit_text}
        </p>
      )}
      {clauses.length > 0 && (
        <Collapsible open={open} onOpenChange={setOpen} className="mt-4">
          {collapsibleClauses && (
            <CollapsibleTrigger className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              {open ? "Ocultar condiciones" : "Ver condiciones"}
              <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
            </CollapsibleTrigger>
          )}
          <CollapsibleContent>
            {!collapsibleClauses && <p className="text-sm font-semibold mb-1">Condiciones</p>}
            <ul className="mt-2 list-disc pl-5 space-y-1 text-xs md:text-sm text-muted-foreground">
              {clauses.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      )}
    </section>
  );
};

export default PromotionBlock;
