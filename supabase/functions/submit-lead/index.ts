import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3.23.8";

const LeadSchema = z
  .object({
    servicio: z.string().max(400).optional().nullable(),
    destino: z.string().max(120).optional().nullable(),
    otro_destino: z.string().max(200).optional().nullable(),
    origen: z.string().max(120).optional().nullable(),
    otro_origen: z.string().max(200).optional().nullable(),
    tipo_fechas: z.string().max(120).optional().nullable(),
    fecha_salida: z.string().max(20).optional().nullable(),
    fecha_regreso: z.string().max(20).optional().nullable(),
    mes_aprox: z.string().max(40).optional().nullable(),
    quincena: z.string().max(60).optional().nullable(),
    flexibilidad: z.array(z.string().max(60)).max(20).optional(),
    adultos: z.number().int().min(1).max(50),
    menores: z.number().int().min(0).max(50),
    edades_menores: z.array(z.number().int().min(0).max(17)).max(50).optional(),
    bebes: z.number().int().min(0).max(50),
    estilos: z.array(z.string().max(60)).max(40).optional(),
    moneda: z.string().max(10).optional().nullable(),
    nivel_presupuesto: z.string().max(60).optional().nullable(),
    urgencia: z.string().max(200).optional().nullable(),
    resultado_titulo: z.string().max(200).optional().nullable(),
    resultado_descripcion: z.string().max(2000).optional().nullable(),
    resultado_incluye: z.array(z.string().max(200)).max(40).optional(),
    nivel_sugerido: z.string().max(120).optional().nullable(),
    prioridad: z.string().max(200).optional().nullable(),
    respuesta_cliente: z.string().max(200).optional().nullable(),
    ajustes: z.array(z.string().max(120)).max(40).optional(),
    comentario_cambio: z.string().max(1000).optional().nullable(),
    whatsapp: z.string().max(40).optional().nullable(),
    correo: z.string().max(255).optional().nullable(),
    nombre: z.string().max(120).optional().nullable(),
    preferencia_contacto: z.string().max(40).optional().nullable(),
    resumen: z.string().max(4000).optional().nullable(),
    metadata: z.record(z.unknown()).optional(),
  })
  .refine(
    (d) => (d.whatsapp && d.whatsapp.trim().length > 0) || (d.correo && d.correo.trim().length > 0),
    { message: "Debes proporcionar al menos un WhatsApp o un correo." },
  );

type LeadData = z.infer<typeof LeadSchema>;

// Mapea urgencia del test al nivel de interés del Gestor.
function mapInterestLevel(urgencia?: string | null): string {
  const u = (urgencia ?? "").toLowerCase();
  if (/antes|urg|ya|inmediat|este mes|próx|prox/.test(u)) return "Caliente";
  if (/1-3|1 a 3|mes|pronto|trimestre/.test(u)) return "Tibio";
  return "Frío";
}

// Construye el payload con la forma EXACTA de la tabla `leads` del Gestor.
function buildGestorPayload(d: LeadData) {
  const destino = (d.otro_destino?.trim() || d.destino || "").trim();
  const origen = (d.otro_origen?.trim() || d.origen || "").trim();

  const dateNotes: string[] = [];
  if (d.tipo_fechas) dateNotes.push(`Tipo de fechas: ${d.tipo_fechas}`);
  if (d.mes_aprox) dateNotes.push(`Mes aprox: ${d.mes_aprox}`);
  if (d.quincena) dateNotes.push(`Quincena: ${d.quincena}`);
  if (d.flexibilidad?.length) dateNotes.push(`Flexibilidad: ${d.flexibilidad.join(", ")}`);
  if (d.bebes && d.bebes > 0) dateNotes.push(`Bebés: ${d.bebes}`);

  const comments: string[] = [];
  if (d.servicio) comments.push(`Servicio: ${d.servicio}`);
  if (d.estilos?.length) comments.push(`Estilos: ${d.estilos.join(", ")}`);
  if (d.moneda) comments.push(`Moneda: ${d.moneda}`);
  if (d.nivel_presupuesto) comments.push(`Nivel de presupuesto: ${d.nivel_presupuesto}`);
  if (d.urgencia) comments.push(`Urgencia: ${d.urgencia}`);
  if (d.respuesta_cliente) comments.push(`Reacción al resultado: ${d.respuesta_cliente}`);
  if (d.ajustes?.length) comments.push(`Ajustes solicitados: ${d.ajustes.join(", ")}`);
  if (d.comentario_cambio) comments.push(`Comentario de cambio: ${d.comentario_cambio}`);

  const internal: string[] = [];
  if (d.preferencia_contacto) internal.push(`Preferencia de contacto: ${d.preferencia_contacto}`);

  const isDate = (s?: string | null) => !!s && /^\d{4}-\d{2}-\d{2}$/.test(s);

  return {
    name: d.nombre?.trim() || "",
    phone: d.whatsapp?.trim() || "",
    email: d.correo?.trim() || "",
    city: origen,
    source: "Arma tu viaje ideal",
    campaign_id: "Landing interactiva",
    utm_source: "arma-tu-viaje",
    utm_medium: "landing-interactiva",
    utm_campaign: "Arma tu viaje ideal",
    destination_interest: destino,
    travel_type: d.servicio?.trim() || "Paquete vacacional",
    departure_date: isDate(d.fecha_salida) ? d.fecha_salida : null,
    return_date: isDate(d.fecha_regreso) ? d.fecha_regreso : null,
    flexible_dates: !!(d.flexibilidad?.length || d.tipo_fechas?.toLowerCase().includes("flex")),
    date_notes: dateNotes.join("\n"),
    adults: d.adultos,
    minors: d.menores,
    minors_ages: (d.edades_menores ?? []).join(", "),
    client_comments: comments.join("\n"),
    interest_level: mapInterestLevel(d.urgencia),
    status: "Nuevo",
    internal_notes: internal.join("\n"),
    original_client_message: d.resumen ?? "",
    ai_extracted_data: { ...d, metadata: d.metadata ?? {} },
  };
}

// Envía el lead al Gestor de Leads (proyecto Leads Gbtravel). No bloquea si falla.
async function pushToGestor(payload: ReturnType<typeof buildGestorPayload>) {
  const url = Deno.env.get("GESTOR_INGEST_URL");
  const token = Deno.env.get("GESTOR_INGEST_TOKEN");
  if (!url || !token) {
    console.warn("Gestor sync skipped: GESTOR_INGEST_URL/GESTOR_INGEST_TOKEN no configurados.");
    return { synced: false, reason: "not_configured" as const };
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-ingest-token": token },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("Gestor ingest error:", res.status, text);
      return { synced: false, reason: "ingest_error" as const };
    }
    const result = await res.json().catch(() => ({}));
    console.log("Gestor ingest ok:", result);
    return { synced: true as const, id: result?.id ?? null, folio: result?.folio ?? null };
  } catch (e) {
    console.error("Gestor ingest fetch failed:", e);
    return { synced: false, reason: "network_error" as const };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const parsed = LeadSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({
          error: parsed.error.flatten().fieldErrors,
          message: parsed.error.errors[0]?.message ?? "Datos inválidos.",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { metadata, ...rest } = parsed.data;

    // 1) Respaldo local (no se pierde ningún lead aunque el Gestor falle).
    const { data, error } = await supabase
      .from("leads")
      .insert({
        ...rest,
        fuente: "Arma tu viaje ideal",
        campana: "Landing interactiva",
        estado: "Nuevo",
        metadata: metadata ?? {},
      })
      .select("id")
      .single();

    if (error) {
      console.error("Insert error:", error);
      return new Response(JSON.stringify({ error: "No se pudo guardar la solicitud." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2) Envío al Gestor de Leads existente.
    const gestor = await pushToGestor(buildGestorPayload(parsed.data));

    return new Response(JSON.stringify({ success: true, id: data.id, gestor }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Unexpected error:", e);
    return new Response(JSON.stringify({ error: "Solicitud inválida." }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
