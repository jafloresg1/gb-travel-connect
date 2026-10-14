import { Link } from "react-router-dom";
import { CalendarDays, MapPin, Plane, Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  activePromo,
  departureCityText,
  durationText,
  formatMoney,
  programImage,
  type PromoLink,
  type PublicProgram,
} from "@/lib/catalog";

type Props = { program: PublicProgram; promo?: PromoLink | null };

const ProgramCard = ({ program, promo }: Props) => {
  const link = promo === undefined ? activePromo(program) : promo;
  const hasPromoPrice = link?.promo_price != null && program.price_from != null;
  const places = program.countries.length ? program.countries.join(" · ") : program.cities.join(" · ");

  return (
    <article className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col h-full border border-border/60">
      <Link to={`/viajes/${program.slug}`} className="relative block h-52 overflow-hidden" tabIndex={-1} aria-hidden>
        <img
          src={programImage(program)}
          alt=""
          loading="lazy"
          width={640}
          height={416}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {link && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground shadow">
            <Tag className="h-3 w-3" />
            {link.badge || link.promotion.title}
          </span>
        )}
        <span className="absolute bottom-3 left-3 rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-semibold text-foreground">
          {program.region}
        </span>
      </Link>
      <div className="p-5 flex flex-col gap-2 flex-1">
        <h3 className="font-heading text-xl font-semibold leading-snug">
          <Link to={`/viajes/${program.slug}`} className="hover:text-primary transition-colors">
            {program.title}
          </Link>
        </h3>
        {places && <p className="text-sm text-muted-foreground line-clamp-1">{places}</p>}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {durationText(program.days, program.nights) && (
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" /> {durationText(program.days, program.nights)}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Plane className="h-3.5 w-3.5" /> {program.includes_flight ? "Incluye vuelo" : "Solo terrestre"}
          </span>
        </div>
        <p className="inline-flex items-start gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 mt-px shrink-0" /> {departureCityText(program.departure_city)}
        </p>
        <div className="mt-auto pt-3">
          {program.price_from == null ? (
            <p className="text-primary font-bold text-lg">Precio por confirmar</p>
          ) : (
            <>
              <p className="text-xs text-muted-foreground">Desde</p>
              <p className="text-primary font-bold text-lg leading-tight">
                {hasPromoPrice && (
                  <span className="mr-2 text-sm font-medium text-muted-foreground line-through">
                    {formatMoney(program.price_from, program.currency)}
                  </span>
                )}
                {formatMoney(hasPromoPrice ? link!.promo_price : program.price_from, program.currency)}
                {program.taxes_from ? <span className="text-sm font-medium"> + imp.</span> : null}
              </p>
              <p className="text-xs text-muted-foreground">por persona en habitación {program.room_basis}</p>
            </>
          )}
          <Link
            to={`/viajes/${program.slug}`}
            className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            aria-label={`Ver detalles de ${program.title}`}
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </article>
  );
};

export const ProgramCardSkeleton = () => (
  <div className="bg-card rounded-xl overflow-hidden border border-border/60" aria-hidden>
    <Skeleton className="h-52 w-full rounded-none" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-7 w-1/2 mt-4" />
      <Skeleton className="h-9 w-full" />
    </div>
  </div>
);

export const ProgramGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="status" aria-label="Cargando viajes">
    {Array.from({ length: count }).map((_, i) => (
      <ProgramCardSkeleton key={i} />
    ))}
  </div>
);

export default ProgramCard;
