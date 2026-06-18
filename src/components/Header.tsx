import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, MessageCircle, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/constants";
import logo from "@/assets/logo_gbtravel.png";

const WHATSAPP_MESSAGE = "Hola, quiero cotizar un viaje. Mi nombre es:";

const navItems = [
  { label: "Inicio", href: "#inicio" },
  { label: "Destinos", href: "#paquetes" },
  { label: "Promociones", href: "#facebook" },
  { label: "Contacto", href: "#contacto" },
];

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-md border-b border-border/60">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <a href="#inicio" className="flex items-center gap-2">
          <img src={logo} alt="GB Travel" className="h-12 w-auto" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#inicio"
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            Inicio
          </a>
          <Link
            to="/arma-tu-viaje"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Arma tu viaje
          </Link>
          <a
            href="#paquetes"
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            Destinos
          </a>
          <a
            href="#facebook"
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            Promociones
          </a>
          <a
            href="#contacto"
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            Contacto
          </a>
          <Link
            to="/app"
            className="inline-flex items-center text-foreground/50 hover:text-primary transition-colors"
            aria-label="Acceso interno"
          >
            <Lock className="h-4 w-4" />
          </Link>
          <Button asChild className="bg-whatsapp hover:bg-whatsapp/90 text-whatsapp-foreground gap-2">
            <a href={whatsappLink(WHATSAPP_MESSAGE)} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </Button>
        </nav>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)} aria-label="Menú">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="md:hidden bg-card border-t border-border px-4 pb-4 flex flex-col gap-3">
          <a
            href="#inicio"
            onClick={() => setOpen(false)}
            className="text-sm font-medium py-2 text-foreground/80 hover:text-primary transition-colors"
          >
            Inicio
          </a>
          <Link
            to="/arma-tu-viaje"
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-1.5 text-sm font-medium py-2 text-accent hover:text-accent/80 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Arma tu viaje
          </Link>
          {navItems
            .filter((item) => item.label !== "Inicio")
            .map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium py-2 text-foreground/80 hover:text-primary transition-colors"
              >
                {item.label}
              </a>
            ))}
          <Link
            to="/app"
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-1.5 text-sm font-medium py-2 text-foreground/60 hover:text-primary transition-colors"
          >
            <Lock className="h-3.5 w-3.5" />
            Acceso interno
          </Link>
          <Button asChild className="bg-whatsapp hover:bg-whatsapp/90 text-whatsapp-foreground gap-2 w-full">
            <a href={whatsappLink(WHATSAPP_MESSAGE)} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </Button>
        </nav>
      )}
    </header>
  );
};

export default Header;
