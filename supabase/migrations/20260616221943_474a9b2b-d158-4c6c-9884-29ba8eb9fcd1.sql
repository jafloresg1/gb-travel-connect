CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fuente TEXT NOT NULL DEFAULT 'Arma tu viaje ideal',
  estado TEXT NOT NULL DEFAULT 'Nuevo',
  servicio TEXT,
  destino TEXT,
  otro_destino TEXT,
  origen TEXT,
  otro_origen TEXT,
  tipo_fechas TEXT,
  fecha_salida DATE,
  fecha_regreso DATE,
  mes_aprox TEXT,
  quincena TEXT,
  flexibilidad TEXT[] DEFAULT '{}',
  adultos INTEGER NOT NULL DEFAULT 1,
  menores INTEGER NOT NULL DEFAULT 0,
  edades_menores INTEGER[] DEFAULT '{}',
  bebes INTEGER NOT NULL DEFAULT 0,
  estilos TEXT[] DEFAULT '{}',
  moneda TEXT,
  nivel_presupuesto TEXT,
  urgencia TEXT,
  resultado_titulo TEXT,
  resultado_descripcion TEXT,
  resultado_incluye TEXT[] DEFAULT '{}',
  nivel_sugerido TEXT,
  prioridad TEXT,
  respuesta_cliente TEXT,
  ajustes TEXT[] DEFAULT '{}',
  comentario_cambio TEXT,
  whatsapp TEXT,
  correo TEXT,
  nombre TEXT,
  preferencia_contacto TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated advisors can view leads"
  ON public.leads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated advisors can update leads"
  ON public.leads FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated advisors can delete leads"
  ON public.leads FOR DELETE
  TO authenticated
  USING (true);