import { Link } from "react-router-dom";
import { AlertCircle, BadgePercent } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProgramCard, { ProgramGridSkeleton } from "@/components/catalog/ProgramCard";
import PromotionBlock from "@/components/catalog/PromotionBlock";
import { usePageMeta } from "@/hooks/use-page-meta";
import { PRICE_DISCLAIMER, groupActiveCampaigns, usePublicPrograms } from "@/lib/catalog";

const Promociones = () => {
  const { data, isLoading, isError, refetch } = usePublicPrograms();
  const campaigns = groupActiveCampaigns(data ?? []);

  usePageMeta({
    title: "Promociones vigentes | GB Travel",
    description:
      "Descuentos y tarifas especiales en circuitos por Europa, Medio Oriente, Canadá, el Caribe y México. Promociones vigentes de GB Travel.",
  });

  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-b from-accent/10 to-background pt-12 pb-8 md:pt-16">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold mb-4">
              <BadgePercent className="h-3.5 w-3.5 text-accent" /> Ofertas por tiempo limitado
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-3">
              Promociones <span className="text-primary">vigentes</span>
            </h1>
            <p className="text-muted-foreground">
              Tarifas especiales y descuentos en salidas seleccionadas. Aparta tu lugar antes de que termine la
              vigencia.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 pb-20 space-y-14">
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-40 w-full rounded-xl" />
              <ProgramGridSkeleton count={3} />
            </div>
          ) : isError ? (
            <div className="text-center py-16 max-w-md mx-auto" role="alert">
              <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-3" />
              <p className="font-semibold mb-4">No pudimos cargar las promociones.</p>
              <Button onClick={() => refetch()}>Reintentar</Button>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-16 max-w-md mx-auto">
              <p className="font-semibold mb-1">Por ahora no hay promociones vigentes.</p>
              <p className="text-sm text-muted-foreground mb-5">
                Muy pronto publicaremos nuevas ofertas. Mientras tanto, revisa nuestro catálogo de viajes.
              </p>
              <Button asChild>
                <Link to="/viajes">Ver catálogo de viajes</Link>
              </Button>
            </div>
          ) : (
            <>
              {campaigns.map(({ promotion, items }) => (
                <section key={promotion.id} aria-label={promotion.title} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-[1fr_auto] items-start">
                    <PromotionBlock promotion={promotion} collapsibleClauses />
                    {promotion.image_url && (
                      <img
                        src={promotion.image_url}
                        alt={promotion.title}
                        loading="lazy"
                        className="w-full md:w-72 rounded-xl object-cover aspect-[4/3]"
                      />
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(({ program, link }) => (
                      <ProgramCard key={program.id} program={program} promo={link} />
                    ))}
                  </div>
                </section>
              ))}
              <p className="text-xs text-muted-foreground text-center">{PRICE_DISCLAIMER}</p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Promociones;
