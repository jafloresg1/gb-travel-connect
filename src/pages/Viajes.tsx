import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle, Compass, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import CatalogFilters from "@/components/catalog/CatalogFilters";
import ProgramCard, { ProgramGridSkeleton } from "@/components/catalog/ProgramCard";
import { usePageMeta } from "@/hooks/use-page-meta";
import {
  FILTER_KEYS,
  PRICE_DISCLAIMER,
  filtersFromParams,
  matchesFilters,
  sortPrograms,
  todayMX,
  upcomingDepartures,
  usePublicPrograms,
  type CatalogFilters as Filters,
} from "@/lib/catalog";

const Viajes = () => {
  const [params, setParams] = useSearchParams();
  const filters = filtersFromParams(params);
  const { data, isLoading, isError, refetch } = usePublicPrograms();

  usePageMeta({
    title: "Catálogo de viajes | GB Travel",
    description:
      "Circuitos y paquetes por Europa, Asia, Medio Oriente, Canadá, el Caribe y México con salidas confirmadas y promociones vigentes. Cotiza por WhatsApp con GB Travel.",
  });

  const today = todayMX();
  const programs = useMemo(() => data ?? [], [data]);

  const options = useMemo(() => {
    const regions = new Set<string>();
    const countries = new Set<string>();
    const months = new Set<string>();
    for (const p of programs) {
      regions.add(p.region);
      p.countries.forEach((c) => countries.add(c));
      upcomingDepartures(p, today).forEach((d) => months.add(d.start_date.slice(0, 7)));
    }
    const es = (a: string, b: string) => a.localeCompare(b, "es");
    return { regions: [...regions].sort(es), countries: [...countries].sort(es), months: [...months].sort() };
  }, [programs, today]);

  const results = useMemo(
    () => sortPrograms(programs.filter((p) => matchesFilters(p, filters, today)), today),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [programs, params.toString(), today],
  );

  const activeCount = FILTER_KEYS.filter((k) => k !== "q" && params.get(k)).length + (filters.q ? 1 : 0);

  const update = (patch: Partial<Filters>) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(patch)) {
      if (key === "promo") {
        if (value) next.set("promo", "1");
        else next.delete("promo");
      } else if (value) next.set(key, String(value));
      else next.delete(key);
    }
    setParams(next, { replace: true });
  };

  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-b from-secondary to-background pt-12 pb-8 md:pt-16">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold mb-4">
              <Compass className="h-3.5 w-3.5" /> Catálogo GB Travel
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-3">
              Encuentra tu próximo <span className="text-primary">viaje</span>
            </h1>
            <p className="text-muted-foreground">
              Circuitos con salidas programadas y precios por persona. Filtra por destino, fecha o presupuesto y
              cotiza directo por WhatsApp.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-20">
          <CatalogFilters
            filters={filters}
            onChange={update}
            onClear={() => setParams(new URLSearchParams(), { replace: true })}
            regions={options.regions}
            countries={options.countries}
            months={options.months}
            activeCount={activeCount}
          />

          <div className="mt-8">
            {isLoading ? (
              <ProgramGridSkeleton />
            ) : isError ? (
              <div className="text-center py-16 max-w-md mx-auto" role="alert">
                <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-3" />
                <p className="font-semibold mb-1">No pudimos cargar el catálogo.</p>
                <p className="text-sm text-muted-foreground mb-4">Revisa tu conexión e inténtalo de nuevo.</p>
                <Button onClick={() => refetch()}>Reintentar</Button>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-16 max-w-md mx-auto">
                <p className="font-semibold mb-1">No encontramos viajes con esos filtros.</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Prueba con otros filtros o cuéntanos qué buscas y armamos tu viaje a la medida.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  {activeCount > 0 && (
                    <Button variant="outline" onClick={() => setParams(new URLSearchParams(), { replace: true })}>
                      Ver todos los viajes
                    </Button>
                  )}
                  <Button asChild className="gap-2">
                    <Link to="/arma-tu-viaje">
                      <Sparkles className="h-4 w-4" /> Arma tu viaje
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4" aria-live="polite">
                  {results.length} {results.length === 1 ? "viaje encontrado" : "viajes encontrados"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((p) => (
                    <ProgramCard key={p.id} program={p} />
                  ))}
                </div>
                <p className="mt-8 text-xs text-muted-foreground text-center">{PRICE_DISCLAIMER}</p>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Viajes;
