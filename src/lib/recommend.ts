// ============================================================
// GB Travel — Lógica de recomendación de "Arma tu viaje ideal"
// Función pura: NO genera precios ni promete disponibilidad.
// ============================================================

export interface QuoteState {
  servicios: string[];
  destino: string | null;
  otroDestino: string;
  origen: string | null;
  otroOrigen: string;
  tipoFechas: string | null;
  fechaSalida: string | null;
  fechaRegreso: string | null;
  mes: string | null;
  quincena: string | null;
  flexibilidad: string[];
  adultos: number;
  menores: number;
  edadesMenores: number[];
  bebes: number;
  estilos: string[];
  moneda: string | null;
  nivelPresupuesto: string | null;
  urgencia: string | null;
  duracion: string | null;
  duracionOtra: string;
  respuestaCliente: string | null;
  ajustes: string[];
  comentarioCambio: string;
  whatsapp: string;
  correo: string;
  nombre: string;
  preferenciaContacto: string;
}

export const initialQuote: QuoteState = {
  servicios: [],
  destino: null,
  otroDestino: "",
  origen: null,
  otroOrigen: "",
  tipoFechas: null,
  fechaSalida: null,
  fechaRegreso: null,
  mes: null,
  quincena: null,
  flexibilidad: [],
  adultos: 1,
  menores: 0,
  edadesMenores: [],
  bebes: 0,
  estilos: [],
  moneda: null,
  nivelPresupuesto: null,
  urgencia: null,
  duracion: null,
  duracionOtra: "",
  respuestaCliente: null,
  ajustes: [],
  comentarioCambio: "",
  whatsapp: "",
  correo: "",
  nombre: "",
  preferenciaContacto: "cualquiera",
};

export interface Recommendation {
  titulo: string;
  descripcion: string;
  incluye: string[];
  nivelSugerido: string;
  prioridad: string;
  siguiente: string;
}

const has = (arr: string[], ...vals: string[]) =>
  vals.some((v) => arr.some((a) => a.toLowerCase() === v.toLowerCase()));

const destinoEs = (q: QuoteState, ...ids: string[]) =>
  q.destino ? ids.includes(q.destino) : false;

export function recommend(q: QuoteState): Recommendation {
  const estilos = q.estilos;
  const servicios = q.servicios;

  // Asesoría / no estoy seguro
  if (servicios.includes("asesoria") || q.respuestaCliente === "asesor") {
    return {
      titulo: "Asesoría personalizada para encontrar tu mejor opción",
      descripcion:
        "Por lo que nos cuentas, lo mejor es que un asesor de GB Travel te acompañe para definir el viaje ideal según tus prioridades y presupuesto.",
      incluye: [
        "Asesoría sin compromiso",
        "Comparación de destinos y fechas",
        "Opciones de vuelo, hotel y traslados",
        "Alternativas de pago",
      ],
      nivelSugerido: "A definir contigo",
      prioridad: "Claridad y acompañamiento",
      siguiente: "Un asesor revisará tus respuestas y te propondrá 2 o 3 alternativas.",
    };
  }

  // Crucero
  if (servicios.includes("crucero") || destinoEs(q, "crucero-caribe")) {
    return {
      titulo: "Crucero por el Caribe",
      descripcion:
        "Según tus respuestas, un crucero es una excelente opción: varios destinos en un solo viaje, con todo a bordo.",
      incluye: [
        "Camarote a bordo",
        "Comidas incluidas en el crucero",
        "Múltiples destinos",
        "Actividades y entretenimiento a bordo",
        "Opciones con vuelos al puerto de salida",
      ],
      nivelSugerido: q.nivelPresupuesto === "lujo" ? "Superior / lujo" : "Intermedio / cómodo",
      prioridad: "Variedad de destinos y comodidad",
      siguiente: "Comparar navieras, itinerarios y fechas antes de reservar.",
    };
  }

  // Circuito internacional / cultural
  if (
    servicios.includes("circuito") ||
    (has(estilos, "Cultural") && destinoEs(q, "europa", "japon"))
  ) {
    return {
      titulo: "Circuito internacional organizado",
      descripcion:
        "Lo tuyo es un circuito internacional bien organizado para aprovechar al máximo cada destino con todo coordinado.",
      incluye: [
        "Vuelos internacionales",
        "Hoteles por ciudad",
        "Traslados y transporte entre ciudades",
        "Itinerario y visitas guiadas",
        "Asistencia durante el viaje",
      ],
      nivelSugerido: "Intermedio / superior",
      prioridad: "Organización y experiencia cultural",
      siguiente: "Revisar itinerarios y fechas de salida disponibles.",
    };
  }

  // Luna de miel / pareja / lujo playa
  if (has(estilos, "Luna de miel") || (has(estilos, "Pareja") && has(estilos, "Lujo", "Playa"))) {
    return {
      titulo: "Escapada romántica de playa",
      descripcion:
        "Por tus respuestas, te conviene una escapada romántica de playa, pensada para disfrutar en pareja con todo resuelto.",
      incluye: [
        "Vuelo redondo",
        "Hotel para parejas (solo adultos disponible)",
        "Traslados aeropuerto-hotel-aeropuerto",
        "Plan todo incluido",
        "Detalles románticos según el hotel",
      ],
      nivelSugerido: has(estilos, "Lujo") ? "Superior / lujo" : "Intermedio / cómodo",
      prioridad: "Romance, descanso y buena ubicación",
      siguiente: "Comparar 2 o 3 hoteles para parejas antes de reservar.",
    };
  }

  // Familiar / con niños / todo incluido playa
  if (
    has(estilos, "Familiar", "Con niños") ||
    (q.menores > 0 && destinoEs(q, "cancun", "riviera-maya", "punta-cana"))
  ) {
    const playaFam = destinoEs(q, "cancun", "riviera-maya") ? "Cancún o Riviera Maya" : "destino de playa";
    return {
      titulo: `Paquete familiar todo incluido a ${playaFam}`,
      descripcion:
        "Según tus respuestas, te conviene una opción que incluya vuelo redondo, hotel familiar, traslados aeropuerto-hotel-aeropuerto y plan todo incluido.",
      incluye: [
        "Vuelo redondo",
        "Hotel familiar",
        "Traslados incluidos",
        "Plan todo incluido",
        "Opciones con pagos flexibles",
        "Hoteles con actividades para niños",
      ],
      nivelSugerido: "Intermedio / cómodo",
      prioridad: "Comodidad + buena relación precio-beneficio",
      siguiente: "Comparar 2 o 3 hoteles antes de reservar.",
    };
  }

  // Negocios / solo hotel
  if (has(estilos, "Negocios") || servicios.includes("solo-hotel")) {
    return {
      titulo: "Hotel práctico para viaje de negocios",
      descripcion:
        "Por tus respuestas, lo ideal es un hotel práctico y bien ubicado, pensado para un viaje eficiente.",
      incluye: [
        "Hotel bien ubicado",
        "Buena conexión a zonas de negocio",
        "Opciones con desayuno",
        "Tarifas con flexibilidad de cambios",
      ],
      nivelSugerido: "Intermedio",
      prioridad: "Ubicación y practicidad",
      siguiente: "Comparar 2 o 3 hoteles por ubicación y servicios.",
    };
  }

  // Económico / solo vuelo
  if (servicios.includes("solo-vuelo") || (has(estilos, "Económico") && servicios.length === 0)) {
    return {
      titulo: "Vuelo económico con fechas flexibles",
      descripcion:
        "Buscas lo esencial al mejor precio: te conviene un vuelo económico aprovechando fechas flexibles.",
      incluye: [
        "Vuelo al mejor precio disponible",
        "Comparación de fechas y horarios",
        "Opciones con y sin equipaje",
        "Alternativas de aerolíneas",
      ],
      nivelSugerido: "Económico",
      prioridad: "Precio y flexibilidad de fechas",
      siguiente: "Comparar tarifas en fechas cercanas para el mejor precio.",
    };
  }

  // Por defecto: paquete vacacional a la medida
  return {
    titulo: "Paquete vacacional a tu medida",
    descripcion:
      "Con tus respuestas armamos un paquete vacacional que combine vuelo, hotel y traslados según lo que buscas.",
    incluye: [
      "Vuelo redondo",
      "Hotel acorde a tu estilo",
      "Traslados opcionales",
      "Opciones de tours y experiencias",
      "Alternativas de pago",
    ],
    nivelSugerido:
      q.nivelPresupuesto === "lujo"
        ? "Superior / lujo"
        : q.nivelPresupuesto === "economico"
          ? "Económico"
          : "Intermedio / cómodo",
    prioridad: "Equilibrio entre precio, comodidad y experiencia",
    siguiente: "Comparar 2 o 3 combinaciones de hotel y vuelo antes de reservar.",
  };
}
