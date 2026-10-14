import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProgramCard from "@/components/catalog/ProgramCard";
import { activePromo, sortPrograms, usePublicPrograms } from "@/lib/catalog";

/** Sección de la home: hasta 6 viajes con promoción vigente. Se oculta si no hay. */
const PromotionsHomeSection = () => {
  const { data } = usePublicPrograms();
  const items = sortPrograms(data ?? [])
    .filter((p) => activePromo(p))
    .slice(0, 6);
  if (!items.length) return null;

  return (
    <section id="promociones" className="py-20 bg-accent/5">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Promociones <span className="text-primary">vigentes</span>
        </h2>
        <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
          Aprovecha las tarifas especiales de esta temporada antes de que terminen.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p) => (
            <ProgramCard key={p.id} program={p} />
          ))}
        </div>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link to="/promociones">
              Ver todas las promociones <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/viajes">Ver catálogo de viajes</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PromotionsHomeSection;
