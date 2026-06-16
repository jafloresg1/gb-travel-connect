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

    return new Response(JSON.stringify({ success: true, id: data.id }), {
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
