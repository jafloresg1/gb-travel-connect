// ============================================================
// GB Travel — "Arma tu viaje ideal"
// Constantes editables del flujo interactivo.
// Cambia textos, opciones e imágenes aquí sin tocar la lógica.
// ============================================================

import cancun from "@/assets/cancun.jpg";
import rivieraMaya from "@/assets/riviera-maya.jpg";
import europa from "@/assets/europa.jpg";
import puntaCana from "@/assets/punta-cana.jpg";
import losCabos from "@/assets/los-cabos.jpg";
import orlando from "@/assets/orlando.jpg";
import japon from "@/assets/japon.jpg";
import colombia from "@/assets/colombia.jpg";
import crucero from "@/assets/crucero.jpg";

export const HERO = {
  titulo: "Arma tu viaje ideal en menos de 1 minuto",
  subtitulo:
    "Responde unas preguntas rápidas y te diremos qué tipo de viaje va mejor contigo. Después un asesor de GB Travel te enviará opciones reales y personalizadas.",
  cta: "Empezar ahora",
  confianza: "Sin compromiso · Atención personalizada · Más de 15 años de experiencia",
  nota: "Ideal si vienes de Facebook, Instagram o WhatsApp y quieres cotizar sin llenar formularios largos.",
};

export interface OptionCard {
  id: string;
  label: string;
  descripcion?: string;
  imagen?: string;
  icon?: string;
}

// Paso 1 — ¿Qué quieres cotizar?
export const SERVICIOS: OptionCard[] = [
  { id: "solo-vuelo", label: "Solo vuelo", descripcion: "Vuelos nacionales o internacionales.", icon: "Plane" },
  { id: "vuelo-hotel", label: "Vuelo + hotel", descripcion: "Ideal para encontrar una buena combinación.", icon: "PlaneTakeoff" },
  { id: "vuelo-hotel-traslados", label: "Vuelo + hotel + traslados", descripcion: "Tu viaje más completo y cómodo.", icon: "Luggage" },
  { id: "solo-hotel", label: "Solo hotel", descripcion: "Hospedaje para vacaciones, escapadas o negocios.", icon: "Hotel" },
  { id: "crucero", label: "Crucero", descripcion: "Caribe, Europa y otros destinos.", icon: "Ship" },
  { id: "paquete", label: "Paquete vacacional", descripcion: "Vuelo, hotel, tours, traslados y experiencias.", icon: "Palmtree" },
  { id: "grupo", label: "Viaje en grupo", descripcion: "Familias, amigos, empresas, XV años, bodas o grupos especiales.", icon: "Users" },
  { id: "circuito", label: "Circuito internacional", descripcion: "Europa, Japón, Turquía y viajes organizados.", icon: "Globe" },
  { id: "asesoria", label: "No estoy seguro, quiero asesoría", descripcion: "Te ayudamos a elegir la mejor opción.", icon: "HelpCircle" },
];

// Paso 2 — ¿A dónde quieres viajar?
export const DESTINOS: OptionCard[] = [
  { id: "cancun", label: "Cancún", imagen: cancun },
  { id: "riviera-maya", label: "Riviera Maya", imagen: rivieraMaya },
  { id: "punta-cana", label: "Punta Cana", imagen: puntaCana },
  { id: "los-cabos", label: "Los Cabos", imagen: losCabos },
  { id: "orlando", label: "Orlando / Disney", imagen: orlando },
  { id: "europa", label: "Europa", imagen: europa },
  { id: "japon", label: "Japón", imagen: japon },
  { id: "colombia", label: "Colombia", imagen: colombia },
  { id: "crucero-caribe", label: "Crucero Caribe", imagen: crucero },
  { id: "otro", label: "Otro destino", icon: "MapPin" },
  { id: "no-se", label: "Aún no sé", icon: "HelpCircle" },
];

// Paso 3 — ¿Desde dónde sales?
export const ORIGENES: OptionCard[] = [
  { id: "monterrey", label: "Monterrey" },
  { id: "cdmx", label: "Ciudad de México" },
  { id: "guadalajara", label: "Guadalajara" },
  { id: "bogota", label: "Bogotá" },
  { id: "medellin", label: "Medellín" },
  { id: "cancun", label: "Cancún" },
  { id: "otro", label: "Otro origen" },
];

// Paso 4 — Fechas
export const TIPO_FECHAS: OptionCard[] = [
  { id: "tengo-fechas", label: "Ya tengo fechas", icon: "CalendarCheck" },
  { id: "aproximadas", label: "Tengo fechas aproximadas", icon: "CalendarClock" },
  { id: "flexible", label: "Soy flexible", icon: "CalendarRange" },
  { id: "recomienden", label: "Quiero que me recomienden la mejor fecha", icon: "Sparkles" },
];

export const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export const QUINCENAS = ["Primera quincena", "Segunda quincena", "Cualquier fecha del mes"];

export const FLEXIBILIDAD = [
  "Entre semana", "Fin de semana", "Temporada baja", "Vacaciones escolares", "Puentes / festivos",
];

// Paso 6 — Estilos de viaje
export const ESTILOS = [
  "Económico", "Familiar", "Pareja", "Luna de miel", "Lujo", "Todo incluido",
  "Aventura", "Relax", "Compras", "Cultural", "Fiesta", "Negocios",
  "Celebración especial", "Con niños", "Solo adultos", "Naturaleza", "Playa",
];

// Paso 7 — Presupuesto
export const MONEDAS: OptionCard[] = [
  { id: "MXN", label: "MXN" },
  { id: "COP", label: "COP" },
  { id: "USD", label: "USD" },
];

export const NIVELES_PRESUPUESTO: OptionCard[] = [
  { id: "economico", label: "Económico" },
  { id: "intermedio", label: "Intermedio" },
  { id: "superior", label: "Superior" },
  { id: "lujo", label: "Lujo" },
  { id: "indefinido", label: "No tengo presupuesto definido" },
];

// Paso 8 — Urgencia
export const URGENCIAS: OptionCard[] = [
  { id: "listo", label: "Estoy listo para reservar si me gusta la propuesta", icon: "Rocket" },
  { id: "comparando", label: "Estoy comparando opciones", icon: "Scale" },
  { id: "idea", label: "Solo quiero darme una idea", icon: "Lightbulb" },
  { id: "mas-adelante", label: "Es para más adelante", icon: "Clock" },
];

// Feedback
export const FEEDBACK_OPCIONES: OptionCard[] = [
  { id: "me-gusta", label: "Sí, me gusta esta idea", icon: "ThumbsUp" },
  { id: "ajustar", label: "Me gusta, pero quiero ajustar algo", icon: "Pencil" },
  { id: "diferente", label: "No, quiero algo diferente", icon: "RefreshCw" },
  { id: "asesor", label: "Quiero que un asesor me recomiende", icon: "Headset" },
];

export const AJUSTES = [
  "Quiero algo más económico", "Quiero algo más cómodo", "Quiero mejor hotel",
  "Quiero mejores horarios de vuelo", "Quiero agregar traslados", "Quiero quitar traslados",
  "Quiero otra zona", "Quiero otra fecha", "Quiero pagos flexibles",
  "Quiero equipaje incluido", "Quiero vuelos directos",
];

export const PREFERENCIA_CONTACTO: OptionCard[] = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "correo", label: "Correo" },
  { id: "cualquiera", label: "Cualquiera" },
];

export const TEXTOS = {
  presupuestoApoyo:
    "No necesitamos un monto exacto. Esto solo nos ayuda a buscar opciones más adecuadas para ti.",
  contactoAyuda:
    "Puedes dejar solo tu WhatsApp o solo tu correo. Te contactaremos por el medio que prefieras.",
  disclaimer:
    "Un asesor de GB Travel buscará opciones reales según disponibilidad y tarifas vigentes.",
  confirmacionTitulo: "¡Listo! Ya tenemos la idea de tu viaje",
  confirmacionTexto:
    "Un asesor de GB Travel revisará tus respuestas y preparará opciones reales y personalizadas para ti.",
  confirmacionTiempo: "Tiempo estimado de respuesta: 24 a 48 horas hábiles.",
  seguimientoMsg:
    'Hola, acabo de llenar mi solicitud en "Arma tu viaje ideal" y quiero dar seguimiento a mi cotización.',
};
