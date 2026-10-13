import { Link } from "react-router-dom";
import { EMAIL } from "@/lib/constants";

const Privacidad = () => (
  <main className="container mx-auto max-w-2xl px-4 py-16 space-y-4 text-foreground">
    <h1 className="text-3xl font-bold text-primary">Aviso de privacidad</h1>
    <p>
      GB Travel usa el Píxel de Meta (Meta Platforms, Inc.) para medir visitas a este sitio y acciones como
      enviar el formulario "Arma tu viaje" o hacer clic en WhatsApp, y para mejorar nuestros anuncios en
      Facebook e Instagram. Meta puede recibir datos de navegación (páginas visitadas, dirección IP,
      identificadores del navegador y cookies).
    </p>
    <p>
      Los datos que nos envías en los formularios (nombre, teléfono, correo y detalles del viaje) se usan
      solo para darte seguimiento y cotizar tu viaje; no se comparten con Meta.
    </p>
    <p>
      En regiones donde se requiere consentimiento (como la Unión Europea y Reino Unido) el píxel no se carga.
      Puedes limitar este seguimiento desde la configuración de anuncios de tu cuenta de Meta o bloqueando
      cookies de terceros en tu navegador. Para dudas o para ejercer tus derechos ARCO escribe a {EMAIL}.
    </p>
    <Link to="/" className="text-primary underline">Volver a GB Travel</Link>
  </main>
);

export default Privacidad;
