import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/constants";

import cancun from "@/assets/cancun.jpg";
import rivieraMaya from "@/assets/riviera-maya.jpg";
import europa from "@/assets/europa.jpg";
import familiar from "@/assets/familiar.jpg";
import salidasEspeciales from "@/assets/salidas-especiales.jpg";
import escapada from "@/assets/escapada.jpg";

// ============================================================
// EDITABLE: Update each package's details below.
// ============================================================
const packages = [
  {
    image: cancun,
    title: "Cancún Todo Incluido",
    desc: "Playas de ensueño, resorts de lujo y actividades para toda la familia.",
    price: "Desde $X,XXX MXN",
  },
  {
    image: rivieraMaya,
    title: "Riviera Maya",
    desc: "Descubre cenotes, ruinas mayas y la mejor gastronomía del Caribe.",
    price: "Desde $X,XXX MXN",
  },
  {
    image: europa,
    title: "Europa en Vacaciones",
    desc: "Recorre las ciudades más icónicas de Europa con un paquete a tu medida.",
    price: "Desde $XX,XXX MXN",
  },
  {
    image: familiar,
    title: "Paquetes Familiares",
    desc: "Diversión asegurada para chicos y grandes con hospedaje y actividades incluidas.",
    price: "Desde $X,XXX MXN",
  },
  {
    image: salidasEspeciales,
    title: "Salidas Especiales",
    desc: "Cruceros y experiencias únicas con fechas exclusivas todo el año.",
    price: "Desde $XX,XXX MXN",
  },
  {
    image: escapada,
    title: "Escapadas de Fin de Semana",
    desc: "Relájate y desconéctate con una escapada corta a destinos cercanos.",
    price: "Desde $X,XXX MXN",
  },
];

const PackagesSection = () => (
  <section id="paquetes" className="py-20">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Nuestros <span className="text-primary">Paquetes</span>
      </h2>
      <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
        Explora nuestros destinos más populares y encuentra el viaje perfecto para ti.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <article
            key={pkg.title}
            className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="relative h-52 overflow-hidden">
              <img
                src={pkg.image}
                alt={pkg.title}
                loading="lazy"
                width={640}
                height={512}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 flex flex-col gap-2">
              <h3 className="font-heading text-xl font-semibold">{pkg.title}</h3>
              <p className="text-muted-foreground text-sm flex-1">{pkg.desc}</p>
              <p className="text-primary font-bold text-lg">{pkg.price}</p>
              <Button
                asChild
                className="bg-whatsapp hover:bg-whatsapp/90 text-whatsapp-foreground gap-2 mt-2"
              >
                <a
                  href={whatsappLink(`Hola, me interesa el paquete: ${pkg.title}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4" />
                  Quiero cotizar
                </a>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default PackagesSection;
