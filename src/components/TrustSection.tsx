import { Users, Globe, Heart, Sparkles } from "lucide-react";

const points = [
  { icon: Heart, title: "Atención personalizada", desc: "Te acompañamos en cada paso para que tu viaje sea perfecto." },
  { icon: Globe, title: "Paquetes nacionales e internacionales", desc: "Destinos dentro de México y alrededor del mundo." },
  { icon: Users, title: "Familias, parejas y grupos", desc: "Opciones para cada tipo de viajero y presupuesto." },
  { icon: Sparkles, title: "Promociones actualizadas", desc: "Ofertas nuevas constantemente para que ahorres más." },
];

const TrustSection = () => (
  <section id="confianza" className="py-20 bg-secondary">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        ¿Por qué elegir <span className="text-primary">GB Travel</span>?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {points.map((p) => (
          <div
            key={p.title}
            className="bg-card rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <p.icon className="h-7 w-7" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
            <p className="text-muted-foreground text-sm">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustSection;
