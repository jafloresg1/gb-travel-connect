// ============================================================
// PARTE A — Edge function para el proyecto GESTOR: "Leads Gbtravel"
// Crear en ESE proyecto como: supabase/functions/ingest-lead/index.ts
// Recibe leads desde la landing /arma-tu-viaje (este proyecto) y los
// inserta en public.leads del Gestor. Protegida por token compartido.
// ============================================================
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3.23.8";

// Whitelist de columnas aceptadas (igual al esquema de public.leads).
const IngestSchema = z.object({
  name: z.string().max(200).optional().default(""),
  phone: z.string().max(60).optional().default(""),
  email: z.string().max(255).optional().default(""),
  city: z.string().max(200).optional().default(""),
  country: z.string().max(200).optional().default(""),
  source: z.string().max(120).optional().default("Arma tu viaje ideal"),
  campaign_id: z.string().max(200).optional().nullable(),
  utm_source: z.string().max(200).optional().nullable(),
  utm_medium: z.string().max(200).optional().nullable(),
  utm_campaign: z.string().max(200).optional().nullable(),
  destination_interest: z.string().max(400).optional().default(""),
  travel_type: z.string().max(200).optional().default("Paquete vacacional"),
  departure_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  return_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  flexible_dates: z.boolean().optional().default(false),
  date_notes: z.string().max(2000).optional().default(""),
  adults: z.number().int().min(0).max(50).optional().default(1),
  minors: z.number().int().min(0).max(50).optional().default(0),
  minors_ages: z.string().max(200).optional().default(""),
  client_comments: z.string().max(4000).optional().default(""),
  interest_level: z.string().max(60).optional().default("Frío"),
  status: z.string().max(60).optional().default("Nuevo"),
  internal_notes: z.string().max(2000).optional().default(""),
  original_client_message: z.string().max(8000).optional().default(""),
  ai_extracted_data: z.record(z.unknown()).optional().default({}),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Validación del token compartido.
  const token = req.headers.get("x-ingest-token");
  const expected = Deno.env.get("PUBLIC_INGEST_TOKEN");
  if (!expected || token !== expected) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const parsed = IngestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Genera folio único.
    const { data: folioData, error: folioError } = await supabase.rpc("generate_lead_folio");
    if (folioError || !folioData) {
      console.error("Folio error:", folioError);
      return new Response(JSON.stringify({ error: "No se pudo generar folio." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data, error } = await supabase
      .from("leads")
      .insert({ folio: folioData as string, ...parsed.data })
      .select("id, folio")
      .single();

    if (error) {
      console.error("Insert error:", error);
      return new Response(JSON.stringify({ error: "No se pudo guardar el lead." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, id: data.id, folio: data.folio }), {
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
