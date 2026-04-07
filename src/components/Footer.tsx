import { Facebook, Mail, Phone, MapPin } from "lucide-react";
import { FACEBOOK_URL, EMAIL, PHONE, ADDRESS } from "@/lib/constants";
import logo from "@/assets/logo_gbtravel.png";

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <img src={logo} alt="GB Travel" className="h-14 w-auto brightness-0 invert" />
          <p className="text-primary-foreground/70 text-sm text-center md:text-left">
            Tu agencia de viajes de confianza en México.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col items-center md:items-start gap-2 text-sm">
          <h4 className="font-semibold mb-1">Navegación</h4>
          {["Inicio", "Paquetes", "Promociones", "Nosotros", "Contacto"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="text-primary-foreground/70 hover:text-accent transition-colors">
              {l}
            </a>
          ))}
        </div>

        {/* Contact */}
        <div className="flex flex-col items-center md:items-start gap-3 text-sm">
          <h4 className="font-semibold mb-1">Contacto</h4>
          <a href={`tel:${PHONE}`} className="flex items-center gap-2 text-primary-foreground/70 hover:text-accent transition-colors">
            <Phone className="h-4 w-4" /> {PHONE}
          </a>
          <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 text-primary-foreground/70 hover:text-accent transition-colors">
            <Mail className="h-4 w-4" /> {EMAIL}
          </a>
          <span className="flex items-center gap-2 text-primary-foreground/70">
            <MapPin className="h-4 w-4" /> {ADDRESS}
          </span>
          <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-foreground/70 hover:text-accent transition-colors">
            <Facebook className="h-4 w-4" /> Facebook
          </a>
        </div>
      </div>

      <div className="border-t border-primary-foreground/20 pt-6 text-center text-xs text-primary-foreground/50">
        GB Travel © 2026. Todos los derechos reservados.
      </div>
    </div>
  </footer>
);

export default Footer;
