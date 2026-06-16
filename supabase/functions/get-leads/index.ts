import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

// ============================================================
// get-leads — endpoint de solo lectura para el Gestor de Leads
// existente (leads.gbtravel.co). Protegido con API key.
//
// Uso desde el otro proyecto:
//   GET /functions/v1/get-leads?since=2026-01-01&estado=Nuevo
//   Header:  x-api-key: <LEADS_API_KEY>
// ============================================================

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: { ...corsHeaders, "Access-Control-Allow-Headers": "x-api-key, content-type, authorization" },
    });
  }

  const headers = { ...corsHeaders, "Content-Type": "application/json" };

  const apiKey = req.headers.get("x-api-key");
  const expected = Deno.env.get("LEADS_API_KEY");
  if (!expected) {
    return new Response(JSON.stringify({ error: "Servidor no configurado." }), { status: 500, headers });
  }
  if (!apiKey || apiKey !== expected) {
    return new Response(JSON.stringify({ error: "No autorizado." }), { status: 401, headers });
  }

  try {
    const url = new URL(req.url);
    const since = url.searchParams.get("since");
    const estado = url.searchParams.get("estado");
    const limitParam = parseInt(url.searchParams.get("limit") ?? "200", 10);
    const limit = Math.min(Math.max(isNaN(limitParam) ? 200 : limitParam, 1), 1000);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    let query = supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (since) query = query.gte("created_at", since);
    if (estado) query = query.eq("estado", estado);

    const { data, error } = await query;
    if (error) {
      console.error("Query error:", error);
      return new Response(JSON.stringify({ error: "No se pudieron leer los leads." }), { status: 500, headers });
    }

    return new Response(JSON.stringify({ count: data.length, leads: data }), { status: 200, headers });
  } catch (e) {
    console.error("Unexpected error:", e);
    return new Response(JSON.stringify({ error: "Solicitud inválida." }), { status: 400, headers });
  }
});
