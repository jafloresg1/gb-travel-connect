import { CalendarDays, Check, MapPin } from "lucide-react";
import { departureTotal, formatDate, formatMoney, formatShortDate, type CatalogDeparture } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const AVAILABILITY_STYLES: Record<string, string> = {
  Disponible: "bg-whatsapp/15 text-whatsapp",
  Limitada: "bg-accent/20 text-foreground",
  "Últimos espacios": "bg-destructive/15 text-destructive",
  Agotado: "bg-muted text-muted-foreground line-through",
  "Por confirmar": "bg-secondary text-muted-foreground",
};

type Props = {
  departures: CatalogDeparture[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
};

const DeparturesList = ({ departures, selectedId, onSelect }: Props) => (
  <div role="radiogroup" aria-label="Fechas de salida" className="grid gap-3">
    {departures.map((d) => {
      const soldOut = d.availability === "Agotado";
      const selected = selectedId === d.id;
      const total = departureTotal(d);
      return (
        <button
          key={d.id}
          type="button"
          role="radio"
          aria-checked={selected}
          disabled={soldOut}
          onClick={() => onSelect(selected ? null : d.id)}
          className={cn(
            "text-left rounded-xl border bg-card p-4 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            selected ? "border-primary ring-2 ring-primary/30 shadow-sm" : "border-border hover:border-primary/50",
            soldOut && "opacity-60 cursor-not-allowed hover:border-border",
          )}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-semibold inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-primary" />
                <span className="sm:hidden">
                  {formatShortDate(d.start_date)}
                  {d.end_date ? ` – ${formatShortDate(d.end_date)}` : ""}
                </span>
                <span className="hidden sm:inline">
                  {formatDate(d.start_date)}
                  {d.end_date ? ` al ${formatDate(d.end_date)}` : ""}
                </span>
              </p>
              {d.departure_city && (
                <p className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" /> Sale desde {d.departure_city}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {d.availability && (
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    AVAILABILITY_STYLES[d.availability] ?? "bg-secondary text-foreground",
                  )}
                >
                  {d.availability}
                </span>
              )}
              <span
                aria-hidden
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border",
                  selected ? "bg-primary border-primary text-primary-foreground" : "border-border",
                )}
              >
                {selected && <Check className="h-3 w-3" />}
              </span>
            </div>
          </div>
          {d.price_base != null && (
            <dl className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-xs">
              <div>
                <dt className="text-muted-foreground">Base</dt>
                <dd className="font-medium">{formatMoney(d.price_base, d.currency)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Impuestos</dt>
                <dd className="font-medium">{formatMoney(d.taxes ?? 0, d.currency)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Suplemento</dt>
                <dd className="font-medium">{formatMoney(d.supplement ?? 0, d.currency)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Total</dt>
                <dd className="font-bold text-primary text-sm">{formatMoney(total, d.currency)}</dd>
              </div>
            </dl>
          )}
          {d.notes && <p className="mt-2 text-xs text-muted-foreground">{d.notes}</p>}
        </button>
      );
    })}
  </div>
);

export default DeparturesList;
