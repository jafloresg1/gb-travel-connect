import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  BedDouble,
  CalendarDays,
  Check,
  MapPin,
  MessageCircle,
  Plane,
  Sparkles,
  X,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import DeparturesList from "@/components/catalog/DeparturesList";
import PromotionBlock from "@/components/catalog/PromotionBlock";
import { usePageMeta } from "@/hooks/use-page-meta";
import { whatsappLink } from "@/lib/constants";
import { trackMeta } from "@/lib/metaPixel";
import {
  PRICE_DISCLAIMER,
  activePromo,
  departureCityText,
  durationText,
  formatMoney,
  parseItinerary,
  priceFromText,
  programImage,
  roomBasisText,
  todayMX,
  upcomingDepartures,
  usePublicProgram,
  whatsappProgramMessage,
} from "@/lib/catalog";
import { cn } from "@/lib/utils";

const DetailSkeleton = () => (
  <div className="container mx-auto px-4 py-8" role="status" aria-label="Cargando viaje">
    <div className="grid md:grid-cols-2 gap-8">
      <Skeleton className="aspect-[4/3] w-full rounded-xl" />
      <div className="space-y-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    </div>
  </div>
);

const ListBlock = ({ title, items, positive }: { title: string; items: string[]; positive: boolean }) =>
  items.length ? (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="font-heading text-lg font-semibold mb-3">{title}</h3>
      <ul className="space-y-2 text-sm">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            {positive ? (
              <Check className="h-4 w-4 mt-0.5 shrink-0 text-whatsapp" />
            ) : (
              <X className="h-4 w-4 mt-0.5 shrink-0 text-destructive" />
            )}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  ) : null;

const ViajeDetalle = () => {
  const { slug } = useParams();
  const { data: program, isLoading, isError, refetch } = usePublicProgram(slug);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const tracked = useRef<string | null>(null);

  const today = todayMX();
  const promo = program ? activePromo(program, today) : null;
  const departures = program ? upcomingDepartures(program, today) : [];
  const selected = departures.find((d) => d.id === selectedId) ?? null;
  const images = useMemo(
    () => (program ? [programImage(program), ...program.gallery.filter((g) => g && g !== program.image_url)] : []),
    [program],
  );
  const itinerary = program ? parseItinerary(program.itinerary) : [];

  usePageMeta({
    title: program
      ? `${program.title} | GB Travel`
      : isLoading
        ? "Cargando viaje | GB Travel"
        : "Viaje no encontrado | GB Travel",
    description: program
      ? `${program.summary ?? program.title} ${durationText(program.days, program.nights)}. Desde ${priceFromText(
          program.price_from,
          program.taxes_from,
          program.currency,
        )}. ${departureCityText(program.departure_city)}.`.slice(0, 300)
      : undefined,
    image: images[0],
  });

  useEffect(() => {
    if (program && tracked.current !== program.id) {
      tracked.current = program.id;
      trackMeta("ViewContent", { content_name: program.title, content_category: program.region });
    }
  }, [program]);

  const waHref = program ? whatsappLink(whatsappProgramMessage(program.title, selected)) : "#";

  return (
    <>
      <Header />
      <main className="pb-24 md:pb-0">
        <div className="container mx-auto px-4 pt-6">
          <Link
            to="/viajes"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Catálogo de viajes
          </Link>
        </div>

        {isLoading ? (
          <DetailSkeleton />
        ) : isError ? (
          <div className="container mx-auto px-4 py-20 text-center max-w-md" role="alert">
            <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-3" />
            <p className="font-semibold mb-4">No pudimos cargar este viaje.</p>
            <Button onClick={() => refetch()}>Reintentar</Button>
          </div>
        ) : !program ? (
          <div className="container mx-auto px-4 py-20 text-center max-w-md">
            <h1 className="text-2xl font-bold mb-2">Viaje no disponible</h1>
            <p className="text-muted-foreground mb-6">
              Este viaje ya no está publicado o el enlace cambió. Revisa nuestro catálogo actualizado.
            </p>
            <Button asChild>
              <Link to="/viajes">Ver catálogo</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Hero */}
            <section className="container mx-auto px-4 py-6 md:py-8">
              <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-start">
                <div>
                  <div className="relative overflow-hidden rounded-xl bg-muted aspect-[4/3]">
                    <img
                      src={images[activeImage] ?? images[0]}
                      alt={program.title}
                      className="h-full w-full object-cover"
                      width={960}
                      height={720}
                    />
                    {promo && (
                      <span className="absolute top-3 left-3 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground shadow">
                        {promo.badge || promo.promotion.title}
                      </span>
                    )}
                  </div>
                  {images.length > 1 && (
                    <div className="mt-3 grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {images.map((src, i) => (
                        <button
                          key={src + i}
                          type="button"
                          onClick={() => setActiveImage(i)}
                          className={cn(
                            "overflow-hidden rounded-lg aspect-square border-2 transition-colors",
                            i === activeImage ? "border-primary" : "border-transparent hover:border-primary/40",
                          )}
                          aria-label={`Ver foto ${i + 1}`}
                          aria-pressed={i === activeImage}
                        >
                          <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-sm font-semibold text-primary">
                      {program.region}
                      {program.countries.length ? ` · ${program.countries.join(", ")}` : ""}
                    </p>
                    <h1 className="text-3xl md:text-4xl font-bold mt-1">{program.title}</h1>
                  </div>

                  <ul className="flex flex-wrap gap-2 text-sm">
                    {durationText(program.days, program.nights) && (
                      <li className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1">
                        <CalendarDays className="h-4 w-4 text-primary" /> {durationText(program.days, program.nights)}
                      </li>
                    )}
                    <li className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1">
                      <Plane className="h-4 w-4 text-primary" />
                      {program.includes_flight ? "Incluye vuelo" : "Solo terrestre"}
                    </li>
                    <li className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1">
                      <BedDouble className="h-4 w-4 text-primary" /> Habitación {program.room_basis}
                    </li>
                  </ul>

                  <p className="inline-flex items-center gap-1.5 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-primary" /> {departureCityText(program.departure_city)}
                  </p>

                  <div className="rounded-xl border border-border bg-card p-5">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Desde</p>
                    {promo?.promo_price != null && program.price_from != null ? (
                      <>
                        <p className="text-sm text-muted-foreground line-through">
                          {formatMoney(program.price_from, program.currency)}
                        </p>
                        <p className="text-2xl md:text-3xl font-bold text-primary">
                          {priceFromText(promo.promo_price, program.taxes_from, program.currency)}
                        </p>
                      </>
                    ) : (
                      <p className="text-2xl md:text-3xl font-bold text-primary">
                        {priceFromText(program.price_from, program.taxes_from, program.currency)}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">{roomBasisText(program.room_basis)}</p>
                    {!program.includes_flight && (
                      <p className="text-sm font-medium mt-2">Solo terrestre: no incluye vuelo.</p>
                    )}
                  </div>

                  <div className="hidden md:flex flex-col gap-2">
                    <Button asChild size="lg" className="bg-whatsapp hover:bg-whatsapp/90 text-whatsapp-foreground gap-2">
                      <a href={waHref} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-5 w-5" /> Cotizar por WhatsApp
                      </a>
                    </Button>
                    {selected && (
                      <p className="text-xs text-muted-foreground text-center">
                        Incluiremos la salida que elegiste en tu mensaje.
                      </p>
                    )}
                  </div>
                  <Link
                    to="/arma-tu-viaje"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent/80"
                  >
                    <Sparkles className="h-4 w-4" /> ¿Buscas algo diferente? Arma tu viaje
                  </Link>
                </div>
              </div>
            </section>

            <div className="container mx-auto px-4 pb-16 max-w-5xl space-y-10">
              {promo && (
                <PromotionBlock promotion={promo.promotion} badge={promo.badge} notes={promo.promo_notes} />
              )}

              {(program.summary || program.highlights.length > 0 || program.cities.length > 0) && (
                <section aria-labelledby="resumen">
                  <h2 id="resumen" className="text-2xl font-bold mb-3">
                    Resumen del viaje
                  </h2>
                  {program.summary && <p className="text-muted-foreground leading-relaxed">{program.summary}</p>}
                  {program.highlights.length > 0 && (
                    <ul className="mt-4 grid sm:grid-cols-2 gap-2 text-sm">
                      {program.highlights.map((h, i) => (
                        <li key={i} className="flex gap-2">
                          <Sparkles className="h-4 w-4 mt-0.5 shrink-0 text-accent" /> {h}
                        </li>
                      ))}
                    </ul>
                  )}
                  {program.cities.length > 0 && (
                    <div className="mt-5">
                      <h3 className="text-sm font-semibold mb-2">Ciudades que visitas</h3>
                      <ul className="flex flex-wrap gap-2">
                        {program.cities.map((c) => (
                          <li
                            key={c}
                            className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
                          >
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              )}

              {(program.includes.length > 0 || program.not_includes.length > 0) && (
                <section aria-label="Incluye y no incluye" className="grid md:grid-cols-2 gap-4">
                  <ListBlock title="Incluye" items={program.includes} positive />
                  <ListBlock title="No incluye" items={program.not_includes} positive={false} />
                </section>
              )}

              {itinerary.length > 0 && (
                <section aria-labelledby="itinerario">
                  <h2 id="itinerario" className="text-2xl font-bold mb-3">
                    Itinerario
                  </h2>
                  <Accordion type="multiple" className="rounded-xl border border-border bg-card px-4">
                    {itinerary.map((d, i) => (
                      <AccordionItem key={i} value={`dia-${i}`} className={i === itinerary.length - 1 ? "border-b-0" : ""}>
                        <AccordionTrigger className="text-left">
                          <span>
                            <span className="text-primary font-semibold">Día {d.day}</span>
                            {d.title ? ` · ${d.title}` : ""}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground whitespace-pre-line">
                          {d.description}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>
              )}

              <section aria-labelledby="salidas">
                <h2 id="salidas" className="text-2xl font-bold mb-1">
                  Fechas de salida
                </h2>
                {departures.length ? (
                  <>
                    <p className="text-sm text-muted-foreground mb-4">
                      Precios {roomBasisText(program.room_basis)}. Selecciona una fecha para incluirla en tu mensaje.
                    </p>
                    <DeparturesList departures={departures} selectedId={selectedId} onSelect={setSelectedId} />
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Fechas por confirmar. Escríbenos por WhatsApp y te compartimos las próximas salidas.
                  </p>
                )}
              </section>

              <p className="text-xs text-muted-foreground border-t border-border pt-6">{PRICE_DISCLAIMER}</p>
            </div>

            {/* CTA fijo en móvil */}
            <div className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur px-4 py-3">
              <Button asChild size="lg" className="w-full bg-whatsapp hover:bg-whatsapp/90 text-whatsapp-foreground gap-2">
                <a href={waHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" /> Cotizar por WhatsApp
                </a>
              </Button>
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
};

export default ViajeDetalle;
