import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, MessageCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/constants";
import logo from "@/assets/logo_gbtravel.png";

const navItems = [
  { label: "Inicio", href: "#inicio" },
  { label: "Paquetes", href: "#paquetes" },
  { label: "Promociones", href: "#facebook" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Contacto", href: "#contacto" },
];

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <a href="#inicio" className="flex items-center gap-2">
          <img src={logo} alt="GB Travel" className="h-12 w-auto" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          ))}
          <Link
            to="/app"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/60 hover:text-primary transition-colors"
          >
            <Lock className="h-3.5 w-3.5" />
            Acceso interno
          </Link>
          <Button asChild className="bg-whatsapp hover:bg-whatsapp/90 text-whatsapp-foreground gap-2">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              Cotiza por WhatsApp
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
          {navItems.map((item) => (
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
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              Cotiza por WhatsApp
            </a>
          </Button>
        </nav>
      )}
    </header>
  );
};

export default Header;
