ALTER TABLE public.leads
  ADD COLUMN campana TEXT NOT NULL DEFAULT 'Landing interactiva',
  ADD COLUMN resumen TEXT,
  ADD COLUMN metadata JSONB NOT NULL DEFAULT '{}'::jsonb;