-- ============================================================
-- PARTE A — Aplicar en el proyecto GESTOR: "Leads Gbtravel"
-- (NO en este proyecto). Usar el panel de migraciones de ese proyecto.
-- ============================================================

-- Generador de folio único para leads entrantes desde la landing.
-- Formato: AV-YYYYMMDD-XXXX (XXXX aleatorio en base36).
CREATE OR REPLACE FUNCTION public.generate_lead_folio()
RETURNS text
LANGUAGE plpgsql
VOLATILE
SET search_path = public
AS $$
DECLARE
  candidate text;
BEGIN
  LOOP
    candidate := 'AV-' || to_char(now(), 'YYYYMMDD') || '-' ||
                 upper(substr(md5(random()::text || clock_timestamp()::text), 1, 4));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.leads WHERE folio = candidate);
  END LOOP;
  RETURN candidate;
END;
$$;
