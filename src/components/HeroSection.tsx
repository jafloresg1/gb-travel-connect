import { MessageCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/constants";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => (
  <section
    id="inicio"
    className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
  >
    {/* Background image */}
    <img
      src={heroBg}
      alt="Playa tropical"
      className="absolute inset-0 w-full h-full object-cover"
      width={1920}
      height={1024}
    />
    {/* Overlay */}
    <div className="absolute inset-0 bg-foreground/55" />

    <div className="relative z-10 container mx-auto px-4 py-32 text-center max-w-3xl">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
        Viaja fácil, seguro y al mejor precio con{" "}
        <span className="text-accent">GB Travel</span>
      </h1>
      <p className="text-lg md:text-xl text-primary-foreground/90 mb-10 font-light max-w-2xl mx-auto">
        Paquetes nacionales e internacionales, atención personalizada y
        promociones exclusivas para que tu próximo viaje sea inolvidable.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg" className="text-base gap-2">
          <a href="#paquetes">Ver paquetes</a>
        </Button>
        <Button
          asChild
          size="lg"
          className="bg-whatsapp hover:bg-whatsapp/90 text-whatsapp-foreground text-base gap-2"
        >
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-5 w-5" />
            Cotizar ahora
          </a>
        </Button>
      </div>
    </div>

    {/* Scroll indicator */}
    <a
      href="#confianza"
      className="absolute bottom-6 left-1/2 -translate-x-1/2 text-primary-foreground/70 animate-bounce"
      aria-label="Desplazar hacia abajo"
    >
      <ChevronDown className="h-8 w-8" />
    </a>
  </section>
);

export default HeroSection;
