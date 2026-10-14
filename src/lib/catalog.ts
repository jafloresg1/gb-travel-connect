// ============================================================
// GB Travel — Catálogo de viajes y promociones
// Tipos, reglas de negocio y acceso a datos (Supabase + react-query).
// ============================================================
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

import europaImg from "@/assets/europa.jpg";
import japonImg from "@/assets/japon.jpg";
import puntaCanaImg from "@/assets/punta-cana.jpg";
import cancunImg from "@/assets/cancun.jpg";
import rivieraMayaImg from "@/assets/riviera-maya.jpg";
import orlandoImg from "@/assets/orlando.jpg";
import colombiaImg from "@/assets/colombia.jpg";
import cruceroImg from "@/assets/crucero.jpg";
import internacionalImg from "@/assets/card-internacional.jpg";

// ---------- Tipos ----------
export type CatalogProgram = Tables<"catalog_programs">;
export type CatalogDeparture = Tables<"catalog_departures">;
export type CatalogPromotion = Tables<"catalog_promotions">;
export type CatalogProgramPromotion = Tables<"catalog_program_promotions">;
export type CatalogProgramInternal = Tables<"catalog_program_internal">;

export type ItineraryDay = { day: number; title: string; description: string };

export type PromoLink = CatalogProgramPromotion & { promotion: CatalogPromotion };

/** Programa público: SIN datos internos (operador, clave, ligas). */
export type PublicProgram = CatalogProgram & {
  departures: CatalogDeparture[];
  promos: PromoLink[];
};

export const REGIONS = [
  "Europa",
  "Asia",
  "Medio Oriente",
  "Norteamérica",
  "Sudamérica",
  "Centroamérica",
  "Caribe",
  "México",
  "Cruceros",
  "África",
  "Oceanía",
];

export const AVAILABILITY_OPTIONS = [
  "Disponible",
  "Limitada",
  "Últimos espacios",
  "Agotado",
  "Por confirmar",
];

export const ROOM_BASIS_OPTIONS = ["sencilla", "doble", "triple", "cuádruple"];
export const CURRENCIES = ["USD", "MXN"];

export const PRICE_DISCLAIMER =
  "Precios por persona, sujetos a disponibilidad y cambios sin previo aviso. Vuelo desde Monterrey se cotiza aparte.";

// ---------- Fechas (zona America/Mexico_City) ----------
/** Hoy en Ciudad de México como YYYY-MM-DD. */
export const todayMX = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

export const formatDate = (iso: string | null | undefined, pattern = "d 'de' MMMM 'de' yyyy") =>
  iso ? format(parseISO(iso), pattern, { locale: es }) : "";

export const formatShortDate = (iso: string | null | undefined) => formatDate(iso, "d MMM yyyy");

/** "17 de octubre" (agrega el año si no es el actual). */
export const formatValidUntil = (iso: string | null | undefined) => {
  if (!iso) return "";
  const sameYear = iso.slice(0, 4) === todayMX().slice(0, 4);
  return formatDate(iso, sameYear ? "d 'de' MMMM" : "d 'de' MMMM 'de' yyyy");
};

export const monthLabel = (ym: string) => {
  const label = format(parseISO(`${ym}-01`), "MMMM yyyy", { locale: es });
  return label.charAt(0).toUpperCase() + label.slice(1);
};

// ---------- Promociones ----------
export type PromotionStatus = "Vigente" | "Programada" | "Vencida" | "Borrador";

export const promotionStatus = (p: CatalogPromotion, today = todayMX()): PromotionStatus => {
  if (!p.is_published) return "Borrador";
  if (p.valid_from && today < p.valid_from) return "Programada";
  if (p.valid_to && today > p.valid_to) return "Vencida";
  return "Vigente";
};

export const isPromotionActive = (p: CatalogPromotion | null | undefined, today = todayMX()) =>
  !!p && promotionStatus(p, today) === "Vigente";

/** Primera promoción vigente ligada al programa (o null). */
export const activePromo = (program: PublicProgram, today = todayMX()): PromoLink | null =>
  program.promos.find((l) => isPromotionActive(l.promotion, today)) ?? null;

export const clauseList = (clauses: string | null | undefined) =>
  (clauses ?? "")
    .split("\n")
    .map((c) => c.trim())
    .filter(Boolean);

// ---------- Precios y textos ----------
export const formatMoney = (amount: number | null | undefined, currency: string) =>
  amount == null
    ? ""
    : `$${Number(amount).toLocaleString("es-MX", { maximumFractionDigits: 2 })} ${currency}`;

/** "$999 USD + $899 USD de impuestos" */
export const priceFromText = (price: number | null, taxes: number | null, currency: string) => {
  if (price == null) return "Precio por confirmar";
  const base = formatMoney(price, currency);
  return taxes ? `${base} + ${formatMoney(taxes, currency)} de impuestos` : base;
};

export const departureTotal = (d: Pick<CatalogDeparture, "price_base" | "taxes" | "supplement">) =>
  d.price_base == null ? null : Number(d.price_base) + Number(d.taxes ?? 0) + Number(d.supplement ?? 0);

export const roomBasisText = (roomBasis: string) => `por persona en habitación ${roomBasis}`;

export const departureCityText = (city: string | null | undefined) =>
  city ? `Sale desde ${city}` : "Ciudad de salida por confirmar";

export const durationText = (days: number | null, nights: number | null) => {
  const parts: string[] = [];
  if (days) parts.push(`${days} ${days === 1 ? "día" : "días"}`);
  if (nights) parts.push(`${nights} ${nights === 1 ? "noche" : "noches"}`);
  return parts.join(" / ");
};

export const parseItinerary = (value: unknown): ItineraryDay[] =>
  Array.isArray(value)
    ? value
        .filter((d): d is Record<string, unknown> => !!d && typeof d === "object")
        .map((d, i) => ({
          day: Number(d.day ?? i + 1) || i + 1,
          title: String(d.title ?? ""),
          description: String(d.description ?? ""),
        }))
    : [];

// ---------- Imágenes ----------
const REGION_IMAGES: Record<string, string> = {
  europa: europaImg,
  asia: japonImg,
  caribe: puntaCanaImg,
  méxico: rivieraMayaImg,
  mexico: rivieraMayaImg,
  norteamérica: orlandoImg,
  norteamerica: orlandoImg,
  sudamérica: colombiaImg,
  sudamerica: colombiaImg,
  centroamérica: cancunImg,
  cruceros: cruceroImg,
};

export const regionImage = (region: string | null | undefined) =>
  REGION_IMAGES[(region ?? "").trim().toLowerCase()] ?? internacionalImg;

export const programImage = (p: Pick<CatalogProgram, "image_url" | "region">) =>
  p.image_url || regionImage(p.region);

// ---------- WhatsApp ----------
export const whatsappProgramMessage = (title: string, departure?: CatalogDeparture | null) => {
  const salida = departure ? ` (salida del ${formatDate(departure.start_date)})` : "";
  return `Hola, me interesa el viaje *${title}*${salida}. ¿Me pueden dar información?`;
};

// ---------- Slugs ----------
export const slugify = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

// ---------- Filtros del catálogo ----------
export type DurationFilter = "corta" | "media" | "larga";
export const DURATION_OPTIONS: { value: DurationFilter; label: string }[] = [
  { value: "corta", label: "Hasta 7 días" },
  { value: "media", label: "8 a 12 días" },
  { value: "larga", label: "13 días o más" },
];

export const BUDGET_OPTIONS: { value: string; label: string; currency: string; min: number; max: number | null }[] = [
  { value: "usd-0-1000", label: "Hasta $1,000 USD", currency: "USD", min: 0, max: 1000 },
  { value: "usd-1000-2000", label: "$1,000 a $2,000 USD", currency: "USD", min: 1000, max: 2000 },
  { value: "usd-2000", label: "Más de $2,000 USD", currency: "USD", min: 2000, max: null },
  { value: "mxn-0-15000", label: "Hasta $15,000 MXN", currency: "MXN", min: 0, max: 15000 },
  { value: "mxn-15000-30000", label: "$15,000 a $30,000 MXN", currency: "MXN", min: 15000, max: 30000 },
  { value: "mxn-30000", label: "Más de $30,000 MXN", currency: "MXN", min: 30000, max: null },
];

export type CatalogFilters = {
  q: string;
  region: string;
  pais: string;
  duracion: string;
  mes: string;
  presupuesto: string;
  promo: boolean;
};

export const FILTER_KEYS = ["q", "region", "pais", "duracion", "mes", "presupuesto", "promo"] as const;

export const filtersFromParams = (params: URLSearchParams): CatalogFilters => ({
  q: params.get("q") ?? "",
  region: params.get("region") ?? "",
  pais: params.get("pais") ?? "",
  duracion: params.get("duracion") ?? "",
  mes: params.get("mes") ?? "",
  presupuesto: params.get("presupuesto") ?? "",
  promo: params.get("promo") === "1",
});

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

/** Salidas a futuro (hoy en adelante), ordenadas por fecha. */
export const upcomingDepartures = (p: PublicProgram, today = todayMX()) =>
  p.departures.filter((d) => d.start_date >= today).sort((a, b) => a.start_date.localeCompare(b.start_date));

export const matchesFilters = (p: PublicProgram, f: CatalogFilters, today = todayMX()) => {
  if (f.promo && !activePromo(p, today)) return false;
  if (f.region && p.region !== f.region) return false;
  if (f.pais && !p.countries.includes(f.pais)) return false;
  if (f.duracion) {
    const d = p.days ?? 0;
    if (f.duracion === "corta" && !(d > 0 && d <= 7)) return false;
    if (f.duracion === "media" && !(d >= 8 && d <= 12)) return false;
    if (f.duracion === "larga" && !(d >= 13)) return false;
  }
  if (f.mes && !upcomingDepartures(p, today).some((d) => d.start_date.startsWith(f.mes))) return false;
  if (f.presupuesto) {
    const b = BUDGET_OPTIONS.find((o) => o.value === f.presupuesto);
    if (b) {
      if (p.currency !== b.currency || p.price_from == null) return false;
      const total = Number(p.price_from) + Number(p.taxes_from ?? 0);
      if (total < b.min || (b.max != null && total > b.max)) return false;
    }
  }
  if (f.q.trim()) {
    const haystack = normalize(
      [p.title, p.region, p.summary ?? "", ...p.countries, ...p.cities, ...p.tags, ...p.highlights].join(" "),
    );
    if (!normalize(f.q.trim()).split(/\s+/).every((t) => haystack.includes(t))) return false;
  }
  return true;
};

/** Promos vigentes primero, luego sort_order y título. */
export const sortPrograms = (list: PublicProgram[], today = todayMX()) =>
  [...list].sort((a, b) => {
    const pa = activePromo(a, today) ? 0 : 1;
    const pb = activePromo(b, today) ? 0 : 1;
    if (pa !== pb) return pa - pb;
    if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
    return a.title.localeCompare(b.title, "es");
  });

// ---------- Consultas públicas ----------
const PUBLIC_SELECT =
  "*, catalog_departures(*), catalog_program_promotions(*, catalog_promotions(*))";

type RawPublicProgram = CatalogProgram & {
  catalog_departures: CatalogDeparture[] | null;
  catalog_program_promotions: (CatalogProgramPromotion & { catalog_promotions: CatalogPromotion | null })[] | null;
};

const toPublicProgram = (row: RawPublicProgram): PublicProgram => {
  const { catalog_departures, catalog_program_promotions, ...program } = row;
  return {
    ...program,
    departures: [...(catalog_departures ?? [])].sort((a, b) => a.start_date.localeCompare(b.start_date)),
    promos: (catalog_program_promotions ?? [])
      .filter((l) => l.catalog_promotions)
      .map(({ catalog_promotions, ...link }) => ({ ...link, promotion: catalog_promotions as CatalogPromotion })),
  };
};

export const fetchPublicPrograms = async (): Promise<PublicProgram[]> => {
  const { data, error } = await supabase
    .from("catalog_programs")
    .select(PUBLIC_SELECT)
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data as unknown as RawPublicProgram[]).map(toPublicProgram);
};

export const usePublicPrograms = () =>
  useQuery({ queryKey: ["catalog", "public-programs"], queryFn: fetchPublicPrograms, staleTime: 5 * 60 * 1000 });

export const usePublicProgram = (slug: string | undefined) =>
  useQuery({
    queryKey: ["catalog", "public-program", slug],
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("catalog_programs")
        .select(PUBLIC_SELECT)
        .eq("slug", slug as string)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw error;
      return data ? toPublicProgram(data as unknown as RawPublicProgram) : null;
    },
  });

/** Campañas vigentes con sus programas publicados. */
export type ActiveCampaign = { promotion: CatalogPromotion; items: { program: PublicProgram; link: PromoLink }[] };

export const groupActiveCampaigns = (programs: PublicProgram[], today = todayMX()): ActiveCampaign[] => {
  const map = new Map<string, ActiveCampaign>();
  for (const program of sortPrograms(programs, today)) {
    for (const link of program.promos) {
      if (!isPromotionActive(link.promotion, today)) continue;
      const entry = map.get(link.promotion.id) ?? { promotion: link.promotion, items: [] };
      entry.items.push({ program, link });
      map.set(link.promotion.id, entry);
    }
  }
  return [...map.values()].sort((a, b) =>
    (a.promotion.valid_to ?? "9999").localeCompare(b.promotion.valid_to ?? "9999"),
  );
};

// ---------- Panel interno (staff) ----------
export type AdminProgram = CatalogProgram & {
  internal: CatalogProgramInternal | null;
  departures_count: number;
};

export const ADMIN_KEYS = {
  programs: ["catalog", "admin", "programs"] as const,
  promotions: ["catalog", "admin", "promotions"] as const,
};

export const fetchAdminPrograms = async (): Promise<AdminProgram[]> => {
  const { data, error } = await supabase
    .from("catalog_programs")
    .select("*, catalog_program_internal(*), catalog_departures(id)")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  type Raw = CatalogProgram & {
    catalog_program_internal: CatalogProgramInternal | CatalogProgramInternal[] | null;
    catalog_departures: { id: string }[] | null;
  };
  return (data as unknown as Raw[]).map(({ catalog_program_internal, catalog_departures, ...p }) => ({
    ...p,
    internal: Array.isArray(catalog_program_internal)
      ? catalog_program_internal[0] ?? null
      : catalog_program_internal ?? null,
    departures_count: catalog_departures?.length ?? 0,
  }));
};

export const useAdminPrograms = () => useQuery({ queryKey: ADMIN_KEYS.programs, queryFn: fetchAdminPrograms });

export type AdminPromotion = CatalogPromotion & { links: CatalogProgramPromotion[] };

export const fetchAdminPromotions = async (): Promise<AdminPromotion[]> => {
  const { data, error } = await supabase
    .from("catalog_promotions")
    .select("*, catalog_program_promotions(*)")
    .order("valid_to", { ascending: false, nullsFirst: true });
  if (error) throw error;
  type Raw = CatalogPromotion & { catalog_program_promotions: CatalogProgramPromotion[] | null };
  return (data as unknown as Raw[]).map(({ catalog_program_promotions, ...p }) => ({
    ...p,
    links: catalog_program_promotions ?? [],
  }));
};

export const useAdminPromotions = () => useQuery({ queryKey: ADMIN_KEYS.promotions, queryFn: fetchAdminPromotions });

// ---------- Formulario de programa (crear/editar/duplicar/importar) ----------
export type DepartureDraft = {
  start_date: string;
  end_date: string;
  departure_city: string;
  currency: string;
  price_base: number | null;
  taxes: number | null;
  supplement: number | null;
  availability: string;
  notes: string;
};

export type InternalDraft = {
  operator: string;
  operator_code: string;
  operator_url: string;
  internal_notes: string;
};

export type ProgramDraft = {
  id?: string;
  slug: string;
  title: string;
  region: string;
  countries: string[];
  cities: string[];
  days: number | null;
  nights: number | null;
  departure_city: string;
  includes_flight: boolean;
  room_basis: string;
  currency: string;
  price_from: number | null;
  taxes_from: number | null;
  summary: string;
  highlights: string[];
  includes: string[];
  not_includes: string[];
  itinerary: ItineraryDay[];
  image_url: string;
  gallery: string[];
  tags: string[];
  is_published: boolean;
  sort_order: number;
  departures: DepartureDraft[];
  internal: InternalDraft;
};

export const emptyDeparture = (base?: Partial<ProgramDraft>): DepartureDraft => ({
  start_date: "",
  end_date: "",
  departure_city: base?.departure_city ?? "Ciudad de México (MEX)",
  currency: base?.currency ?? "USD",
  price_base: null,
  taxes: base?.taxes_from ?? null,
  supplement: null,
  availability: "Disponible",
  notes: "",
});

export const emptyProgramDraft = (): ProgramDraft => ({
  slug: "",
  title: "",
  region: "Europa",
  countries: [],
  cities: [],
  days: null,
  nights: null,
  departure_city: "Ciudad de México (MEX)",
  includes_flight: true,
  room_basis: "doble",
  currency: "USD",
  price_from: null,
  taxes_from: null,
  summary: "",
  highlights: [],
  includes: [],
  not_includes: [],
  itinerary: [],
  image_url: "",
  gallery: [],
  tags: [],
  is_published: true,
  sort_order: 100,
  departures: [],
  internal: { operator: "", operator_code: "", operator_url: "", internal_notes: "" },
});

const strArray = (v: unknown): string[] =>
  Array.isArray(v)
    ? v.map((x) => String(x ?? "").trim()).filter(Boolean)
    : typeof v === "string"
      ? v
          .split(/[\n,]/)
          .map((x) => x.trim())
          .filter(Boolean)
      : [];

const numOrNull = (v: unknown): number | null => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(String(v).replace(/[$,\s]/g, ""));
  return Number.isFinite(n) ? n : null;
};

const str = (v: unknown, fallback = "") => (v === null || v === undefined ? fallback : String(v));

const dateStr = (v: unknown) => {
  const s = str(v).trim();
  return /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : "";
};

const departureFromUnknown = (d: Record<string, unknown>, base: ProgramDraft): DepartureDraft => ({
  start_date: dateStr(d.start_date ?? d.fecha_salida ?? d.salida),
  end_date: dateStr(d.end_date ?? d.fecha_regreso ?? d.regreso),
  departure_city: str(d.departure_city, base.departure_city),
  currency: str(d.currency, base.currency).toUpperCase() || base.currency,
  price_base: numOrNull(d.price_base ?? d.precio),
  taxes: numOrNull(d.taxes ?? d.impuestos),
  supplement: numOrNull(d.supplement ?? d.suplemento),
  availability: str(d.availability ?? d.disponibilidad, "Disponible"),
  notes: str(d.notes ?? d.notas),
});

/** Convierte JSON pegado (de un PDF u operador) en un borrador de programa. Lanza Error si no es válido. */
export const draftFromImport = (raw: string): ProgramDraft => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("El texto no es JSON válido. Revisa comas, comillas y llaves.");
  }
  const obj = (Array.isArray(parsed) ? parsed[0] : parsed) as Record<string, unknown> | undefined;
  if (!obj || typeof obj !== "object") throw new Error("Se esperaba un objeto con los datos del programa.");
  const src = (obj.program && typeof obj.program === "object" ? obj.program : obj) as Record<string, unknown>;
  const title = str(src.title ?? src.titulo).trim();
  if (!title) throw new Error('Falta el campo "title" (título del programa).');

  const base = emptyProgramDraft();
  const draft: ProgramDraft = {
    ...base,
    title,
    slug: str(src.slug).trim() || slugify(title),
    region: str(src.region, base.region) || base.region,
    countries: strArray(src.countries ?? src.paises),
    cities: strArray(src.cities ?? src.ciudades),
    days: numOrNull(src.days ?? src.dias),
    nights: numOrNull(src.nights ?? src.noches),
    departure_city: str(src.departure_city, base.departure_city),
    includes_flight: typeof src.includes_flight === "boolean" ? src.includes_flight : base.includes_flight,
    room_basis: str(src.room_basis, base.room_basis) || base.room_basis,
    currency: (str(src.currency, base.currency) || base.currency).toUpperCase(),
    price_from: numOrNull(src.price_from),
    taxes_from: numOrNull(src.taxes_from),
    summary: str(src.summary ?? src.resumen),
    highlights: strArray(src.highlights),
    includes: strArray(src.includes ?? src.incluye),
    not_includes: strArray(src.not_includes ?? src.no_incluye),
    itinerary: parseItinerary(src.itinerary ?? src.itinerario),
    image_url: str(src.image_url),
    gallery: strArray(src.gallery),
    tags: strArray(src.tags),
    is_published: typeof src.is_published === "boolean" ? src.is_published : false,
    sort_order: numOrNull(src.sort_order) ?? base.sort_order,
  };
  const deps = (obj.departures ?? obj.salidas ?? src.departures ?? src.salidas) as unknown;
  draft.departures = Array.isArray(deps)
    ? deps
        .filter((d): d is Record<string, unknown> => !!d && typeof d === "object")
        .map((d) => departureFromUnknown(d, draft))
    : [];
  const internal = (obj.internal ?? src.internal ?? {}) as Record<string, unknown>;
  draft.internal = {
    operator: str(internal.operator ?? src.operator),
    operator_code: str(internal.operator_code ?? src.operator_code),
    operator_url: str(internal.operator_url ?? src.operator_url),
    internal_notes: str(internal.internal_notes ?? src.internal_notes),
  };
  if (draft.price_from == null && draft.departures.length) {
    const prices = draft.departures.map((d) => d.price_base).filter((n): n is number => n != null);
    if (prices.length) {
      const min = Math.min(...prices);
      draft.price_from = min;
      draft.taxes_from = draft.departures.find((d) => d.price_base === min)?.taxes ?? null;
    }
  }
  return draft;
};

export const IMPORT_EXAMPLE = JSON.stringify(
  {
    title: "Europa Clásica",
    region: "Europa",
    countries: ["España", "Francia", "Italia"],
    cities: ["Madrid", "París", "Roma"],
    days: 14,
    nights: 12,
    departure_city: "Ciudad de México (MEX)",
    includes_flight: true,
    room_basis: "doble",
    currency: "USD",
    price_from: 1299,
    taxes_from: 899,
    summary: "Recorrido por las capitales más icónicas de Europa.",
    highlights: ["Torre Eiffel", "Coliseo Romano"],
    includes: ["Vuelo redondo", "Hoteles 4*", "Desayunos"],
    not_includes: ["Propinas", "Gastos personales"],
    itinerary: [{ day: 1, title: "México – Madrid", description: "Salida en vuelo trasatlántico." }],
    tags: ["circuito"],
    departures: [
      {
        start_date: "2027-03-10",
        end_date: "2027-03-23",
        price_base: 1299,
        taxes: 899,
        supplement: 0,
        availability: "Disponible",
      },
    ],
    internal: { operator: "Mega Travel", operator_code: "MT-00000", operator_url: "", internal_notes: "" },
  },
  null,
  2,
);

/** Carga un programa completo (con salidas e interno) como borrador editable. */
export const loadProgramDraft = async (id: string): Promise<ProgramDraft> => {
  const [{ data: p, error }, { data: deps, error: depErr }, { data: internal, error: intErr }] = await Promise.all([
    supabase.from("catalog_programs").select("*").eq("id", id).single(),
    supabase.from("catalog_departures").select("*").eq("program_id", id).order("start_date"),
    supabase.from("catalog_program_internal").select("*").eq("program_id", id).maybeSingle(),
  ]);
  if (error) throw error;
  if (depErr) throw depErr;
  if (intErr) throw intErr;
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    region: p.region,
    countries: p.countries ?? [],
    cities: p.cities ?? [],
    days: p.days,
    nights: p.nights,
    departure_city: p.departure_city ?? "",
    includes_flight: p.includes_flight,
    room_basis: p.room_basis,
    currency: p.currency,
    price_from: p.price_from,
    taxes_from: p.taxes_from,
    summary: p.summary ?? "",
    highlights: p.highlights ?? [],
    includes: p.includes ?? [],
    not_includes: p.not_includes ?? [],
    itinerary: parseItinerary(p.itinerary),
    image_url: p.image_url ?? "",
    gallery: p.gallery ?? [],
    tags: p.tags ?? [],
    is_published: p.is_published,
    sort_order: p.sort_order,
    departures: (deps ?? []).map((d) => ({
      start_date: d.start_date,
      end_date: d.end_date ?? "",
      departure_city: d.departure_city ?? "",
      currency: d.currency,
      price_base: d.price_base,
      taxes: d.taxes,
      supplement: d.supplement,
      availability: d.availability ?? "",
      notes: d.notes ?? "",
    })),
    internal: {
      operator: internal?.operator ?? "",
      operator_code: internal?.operator_code ?? "",
      operator_url: internal?.operator_url ?? "",
      internal_notes: internal?.internal_notes ?? "",
    },
  };
};

const nullIfEmpty = (s: string) => (s.trim() ? s.trim() : null);
const cleanList = (list: string[]) => list.map((s) => s.trim()).filter(Boolean);

/** Guarda programa + salidas (reemplaza) + datos internos. Devuelve el id. */
export const saveProgramDraft = async (draft: ProgramDraft): Promise<string> => {
  const row = {
    slug: slugify(draft.slug || draft.title),
    title: draft.title.trim(),
    region: draft.region.trim(),
    countries: cleanList(draft.countries),
    cities: cleanList(draft.cities),
    days: draft.days,
    nights: draft.nights,
    departure_city: nullIfEmpty(draft.departure_city),
    includes_flight: draft.includes_flight,
    room_basis: draft.room_basis.trim() || "doble",
    currency: draft.currency,
    price_from: draft.price_from,
    taxes_from: draft.taxes_from,
    summary: nullIfEmpty(draft.summary),
    highlights: cleanList(draft.highlights),
    includes: cleanList(draft.includes),
    not_includes: cleanList(draft.not_includes),
    itinerary: draft.itinerary
      .filter((d) => d.title.trim() || d.description.trim())
      .map((d, i) => ({ day: d.day || i + 1, title: d.title.trim(), description: d.description.trim() })),
    image_url: nullIfEmpty(draft.image_url),
    gallery: cleanList(draft.gallery),
    tags: cleanList(draft.tags),
    is_published: draft.is_published,
    sort_order: draft.sort_order,
    updated_at: new Date().toISOString(),
  };

  let id = draft.id;
  if (id) {
    const { error } = await supabase.from("catalog_programs").update(row).eq("id", id);
    if (error) throw error;
  } else {
    const { data, error } = await supabase.from("catalog_programs").insert(row).select("id").single();
    if (error) throw error;
    id = data.id;
  }

  const { error: delErr } = await supabase.from("catalog_departures").delete().eq("program_id", id);
  if (delErr) throw delErr;
  const deps = draft.departures
    .filter((d) => d.start_date)
    .map((d) => ({
      program_id: id as string,
      start_date: d.start_date,
      end_date: d.end_date || null,
      departure_city: nullIfEmpty(d.departure_city),
      currency: d.currency || draft.currency,
      price_base: d.price_base,
      taxes: d.taxes,
      supplement: d.supplement,
      availability: nullIfEmpty(d.availability),
      notes: nullIfEmpty(d.notes),
    }));
  if (deps.length) {
    const { error } = await supabase.from("catalog_departures").insert(deps);
    if (error) throw error;
  }

  const { error: intErr } = await supabase.from("catalog_program_internal").upsert(
    {
      program_id: id,
      operator: nullIfEmpty(draft.internal.operator),
      operator_code: nullIfEmpty(draft.internal.operator_code),
      operator_url: nullIfEmpty(draft.internal.operator_url),
      internal_notes: nullIfEmpty(draft.internal.internal_notes),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "program_id" },
  );
  if (intErr) throw intErr;
  return id as string;
};

export const deleteProgram = async (id: string) => {
  const { error } = await supabase.from("catalog_programs").delete().eq("id", id);
  if (error) throw error;
};

// ---------- Formulario de promoción ----------
export type PromoLinkDraft = {
  program_id: string;
  badge: string;
  promo_price: number | null;
  promo_notes: string;
};

export type PromotionDraft = {
  id?: string;
  slug: string;
  title: string;
  description: string;
  valid_from: string;
  valid_to: string;
  clauses: string;
  deposit_text: string;
  image_url: string;
  is_published: boolean;
  links: PromoLinkDraft[];
};

export const emptyPromotionDraft = (): PromotionDraft => ({
  slug: "",
  title: "",
  description: "",
  valid_from: todayMX(),
  valid_to: "",
  clauses: "",
  deposit_text: "",
  image_url: "",
  is_published: true,
  links: [],
});

export const promotionToDraft = (p: AdminPromotion): PromotionDraft => ({
  id: p.id,
  slug: p.slug,
  title: p.title,
  description: p.description ?? "",
  valid_from: p.valid_from ?? "",
  valid_to: p.valid_to ?? "",
  clauses: p.clauses ?? "",
  deposit_text: p.deposit_text ?? "",
  image_url: p.image_url ?? "",
  is_published: p.is_published,
  links: p.links.map((l) => ({
    program_id: l.program_id,
    badge: l.badge ?? "",
    promo_price: l.promo_price,
    promo_notes: l.promo_notes ?? "",
  })),
});

export const savePromotionDraft = async (draft: PromotionDraft): Promise<string> => {
  const row = {
    slug: slugify(draft.slug || draft.title),
    title: draft.title.trim(),
    description: nullIfEmpty(draft.description),
    valid_from: draft.valid_from || null,
    valid_to: draft.valid_to || null,
    clauses: nullIfEmpty(draft.clauses),
    deposit_text: nullIfEmpty(draft.deposit_text),
    image_url: nullIfEmpty(draft.image_url),
    is_published: draft.is_published,
    updated_at: new Date().toISOString(),
  };
  let id = draft.id;
  if (id) {
    const { error } = await supabase.from("catalog_promotions").update(row).eq("id", id);
    if (error) throw error;
  } else {
    const { data, error } = await supabase.from("catalog_promotions").insert(row).select("id").single();
    if (error) throw error;
    id = data.id;
  }
  const { error: delErr } = await supabase.from("catalog_program_promotions").delete().eq("promotion_id", id);
  if (delErr) throw delErr;
  const seen = new Set<string>();
  const links = draft.links
    .filter((l) => l.program_id && !seen.has(l.program_id) && seen.add(l.program_id))
    .map((l) => ({
      promotion_id: id as string,
      program_id: l.program_id,
      badge: nullIfEmpty(l.badge),
      promo_price: l.promo_price,
      promo_notes: nullIfEmpty(l.promo_notes),
    }));
  if (links.length) {
    const { error } = await supabase.from("catalog_program_promotions").insert(links);
    if (error) throw error;
  }
  return id as string;
};

export const deletePromotion = async (id: string) => {
  const { error } = await supabase.from("catalog_promotions").delete().eq("id", id);
  if (error) throw error;
};

// ---------- Fotos (bucket público "catalog") ----------
export const uploadCatalogImage = async (file: File, folder: string) => {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "foto";
  const path = `${slugify(folder) || "general"}/${Date.now()}-${base}.${ext}`;
  const { error } = await supabase.storage
    .from("catalog")
    .upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type || undefined });
  if (error) throw error;
  return supabase.storage.from("catalog").getPublicUrl(path).data.publicUrl;
};

/** Mensaje legible para errores de Supabase. */
export const errorMessage = (e: unknown) => {
  const err = e as { code?: string; message?: string };
  if (err?.code === "23505") return "Ya existe un registro con ese slug. Cambia el slug e intenta de nuevo.";
  if (err?.code === "42501") return "No tienes permiso para esta acción (se requiere rol admin o asesor).";
  return err?.message || "Ocurrió un error inesperado.";
};
