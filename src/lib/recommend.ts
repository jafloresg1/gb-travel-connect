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

// Nombre legible del destino para usar en los títulos/textos.
const DESTINO_NOMBRES: Record<string, string> = {
  cancun: "Cancún",
  "riviera-maya": "Riviera Maya",
  "punta-cana": "Punta Cana",
  "los-cabos": "Los Cabos",
  orlando: "Orlando / Disney",
  europa: "Europa",
  japon: "Japón",
  colombia: "Colombia",
  "crucero-caribe": "el Caribe",
};

const destinoNombre = (q: QuoteState): string => {
  if (q.destino === "otro" && q.otroDestino.trim()) return q.otroDestino.trim();
  if (q.destino && DESTINO_NOMBRES[q.destino]) return DESTINO_NOMBRES[q.destino];
  return "tu destino";
};

const totalPasajeros = (q: QuoteState) => q.adultos + q.menores + q.bebes;

const pasajerosTexto = (q: QuoteState) => {
  const total = totalPasajeros(q);
  return total === 1 ? "1 pasajero" : `${total} pasajeros`;
};

const viajaConNinos = (q: QuoteState) =>
  q.menores > 0 || q.bebes > 0 || has(q.estilos, "Familiar", "Con niños");

// Nivel sugerido coherente con el presupuesto elegido.
const nivelSugerido = (q: QuoteState): string => {
  switch (q.nivelPresupuesto) {
    case "lujo":
      return "Superior / lujo";
    case "superior":
      return "Superior / cómodo";
    case "economico":
      return "Económico";
    default:
      return "Intermedio / cómodo";
  }
};

export function recommend(q: QuoteState): Recommendation {
  const estilos = q.estilos;
  const servicios = q.servicios;
  const destino = destinoNombre(q);
  const conNinos = viajaConNinos(q);

  // 1) Asesoría / no estoy seguro (lo pide explícitamente)
  if (servicios.includes("asesoria") || q.respuestaCliente === "asesor") {
    return {
      titulo: "Asesoría personalizada para encontrar tu mejor opción",
      descripcion:
        "Por lo que nos cuentas, lo mejor es que un asesor de GB Travel te acompañe para definir el viaje ideal según tus prioridades y presupuesto.",
      incluye: [
        "Asesoría sin compromiso",
        "Comparación de destinos y fechas",
        "Opciones según el servicio que prefieras",
        "Alternativas de pago",
      ],
      nivelSugerido: "A definir contigo",
      prioridad: "Claridad y acompañamiento",
      siguiente: "Un asesor revisará tus respuestas y te propondrá 2 o 3 alternativas.",
    };
  }

  // 2) SOLO VUELO — la recomendación se enfoca únicamente en el vuelo
  if (servicios.includes("solo-vuelo")) {
    if (conNinos) {
      return {
        titulo: `Vuelo redondo para tu familia a ${destino}`,
        descripcion:
          `Pediste solo vuelo, así que te buscamos los mejores vuelos redondos a ${destino} para ${pasajerosTexto(q)}, con horarios cómodos para viajar en familia.`,
        incluye: [
          `Vuelo redondo para ${pasajerosTexto(q)}`,
          "Horarios cómodos para viajar con niños",
          "Opciones con y sin equipaje documentado",
          "Comparación de aerolíneas y fechas",
          "Alternativas de pago en algunas tarifas",
        ],
        nivelSugerido: nivelSugerido(q),
        prioridad: "Horarios cómodos y buen precio para la familia",
        siguiente: "Comparar tarifas en fechas cercanas para el mejor precio.",
      };
    }
    return {
      titulo: `Vuelo redondo a ${destino} al mejor precio`,
      descripcion:
        `Pediste solo vuelo: te buscamos el vuelo redondo a ${destino} con la mejor combinación de precio y horario para ${pasajerosTexto(q)}.`,
      incluye: [
        `Vuelo redondo para ${pasajerosTexto(q)}`,
        "Comparación de tarifas y horarios",
        "Opciones con y sin equipaje documentado",
        "Alternativas de aerolíneas",
        "Comparación de fechas cercanas",
      ],
      nivelSugerido: nivelSugerido(q),
      prioridad: "Precio y flexibilidad de fechas",
      siguiente: "Comparar tarifas en fechas cercanas para el mejor precio.",
    };
  }

  // 3) SOLO HOTEL — la recomendación se enfoca únicamente en el hospedaje
  if (servicios.includes("solo-hotel")) {
    if (has(estilos, "Negocios")) {
      return {
        titulo: `Hotel práctico en ${destino} para tu viaje de negocios`,
        descripcion:
          "Pediste solo hotel: te buscamos un hospedaje bien ubicado y eficiente, pensado para un viaje de trabajo.",
        incluye: [
          "Hotel bien ubicado",
          "Buena conexión a zonas de negocio",
          "Opciones con desayuno",
          "Tarifas con flexibilidad de cambios",
        ],
        nivelSugerido: nivelSugerido(q),
        prioridad: "Ubicación y practicidad",
        siguiente: "Comparar 2 o 3 hoteles por ubicación y servicios.",
      };
    }
    if (conNinos) {
      return {
        titulo: `Hotel familiar en ${destino}`,
        descripcion:
          `Pediste solo hotel: te buscamos un hospedaje cómodo para ${pasajerosTexto(q)}, ideal para disfrutar en familia.`,
        incluye: [
          `Hotel para ${pasajerosTexto(q)}`,
          "Hoteles con actividades para niños",
          "Opciones con desayuno o todo incluido",
          "Buena ubicación y comodidad",
          "Opciones con pagos flexibles",
        ],
        nivelSugerido: nivelSugerido(q),
        prioridad: "Comodidad familiar y buena ubicación",
        siguiente: "Comparar 2 o 3 hoteles antes de reservar.",
      };
    }
    return {
      titulo: `Hotel a tu medida en ${destino}`,
      descripcion:
        "Pediste solo hotel: te buscamos el hospedaje que mejor se adapte a tu estilo y presupuesto.",
      incluye: [
        "Hotel acorde a tu estilo",
        "Buena ubicación",
        "Opciones con desayuno o todo incluido",
        "Tarifas con opciones de pago",
      ],
      nivelSugerido: nivelSugerido(q),
      prioridad: "Comodidad y relación precio-beneficio",
      siguiente: "Comparar 2 o 3 hoteles antes de reservar.",
    };
  }

  // 4) Crucero
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

  // 5) Circuito internacional / cultural
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

  // ----- Servicios completos (vuelo+hotel, paquete, grupo): se afina por estilo -----

  // Luna de miel / pareja / lujo playa
  if (has(estilos, "Luna de miel") || (has(estilos, "Pareja") && has(estilos, "Lujo", "Playa"))) {
    return {
      titulo: `Escapada romántica de playa a ${destino}`,
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
    return {
      titulo: `Paquete familiar todo incluido a ${destino}`,
      descripcion:
        `Según tus respuestas, te conviene una opción que incluya vuelo redondo, hotel familiar, traslados aeropuerto-hotel-aeropuerto y plan todo incluido para ${pasajerosTexto(q)}.`,
      incluye: [
        `Vuelo redondo para ${pasajerosTexto(q)}`,
        "Hotel familiar",
        "Traslados incluidos",
        "Plan todo incluido",
        "Opciones con pagos flexibles",
        "Hoteles con actividades para niños",
      ],
      nivelSugerido: nivelSugerido(q),
      prioridad: "Comodidad + buena relación precio-beneficio",
      siguiente: "Comparar 2 o 3 hoteles antes de reservar.",
    };
  }

  // Negocios (con servicio completo)
  if (has(estilos, "Negocios")) {
    return {
      titulo: `Viaje de negocios práctico a ${destino}`,
      descripcion:
        "Por tus respuestas, lo ideal es una combinación práctica y bien ubicada, pensada para un viaje eficiente.",
      incluye: [
        "Vuelo con buenos horarios",
        "Hotel bien ubicado",
        "Traslados opcionales",
        "Tarifas con flexibilidad de cambios",
      ],
      nivelSugerido: "Intermedio",
      prioridad: "Ubicación y practicidad",
      siguiente: "Comparar 2 o 3 opciones por ubicación y servicios.",
    };
  }

  // Por defecto: paquete vacacional a la medida
  return {
    titulo: `Paquete vacacional a tu medida en ${destino}`,
    descripcion:
      "Con tus respuestas armamos un paquete vacacional que combine vuelo, hotel y traslados según lo que buscas.",
    incluye: [
      `Vuelo redondo para ${pasajerosTexto(q)}`,
      "Hotel acorde a tu estilo",
      "Traslados opcionales",
      "Opciones de tours y experiencias",
      "Alternativas de pago",
    ],
    nivelSugerido: nivelSugerido(q),
    prioridad: "Equilibrio entre precio, comodidad y experiencia",
    siguiente: "Comparar 2 o 3 combinaciones de hotel y vuelo antes de reservar.",
  };
}
