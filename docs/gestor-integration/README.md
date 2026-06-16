# Integración: landing "Arma tu viaje ideal" → Gestor de Leads (Leads Gbtravel)

La landing `/arma-tu-viaje` (este proyecto) envía cada solicitud como **lead nuevo**
directamente a la base de datos del Gestor de Leads existente (proyecto **Leads Gbtravel**),
sin crear un gestor paralelo.

```
/arma-tu-viaje  →  submit-lead (este proyecto)  →  ingest-lead (Gestor)  →  public.leads del Gestor
```

`submit-lead` también guarda una copia local de respaldo en este proyecto, por si el Gestor
está temporalmente inaccesible (ningún lead se pierde).

## Pasos para activar la sincronización

### 1. En el proyecto GESTOR ("Leads Gbtravel")

1. Aplicar la migración `docs/gestor-integration/01_migration.sql` (crea `generate_lead_folio()`).
2. Crear la edge function `ingest-lead` con el contenido de `docs/gestor-integration/ingest-lead.ts`
   (ruta en ese proyecto: `supabase/functions/ingest-lead/index.ts`).
3. Agregar el secreto **`PUBLIC_INGEST_TOKEN`** con un valor secreto a tu elección
   (una cadena larga y aleatoria).
4. Copiar la URL pública de la función: `https://<ref-del-gestor>.supabase.co/functions/v1/ingest-lead`.

### 2. En ESTE proyecto (landing)

Agregar dos secretos:

- **`GESTOR_INGEST_URL`** = la URL de `ingest-lead` del paso anterior.
- **`GESTOR_INGEST_TOKEN`** = el MISMO valor que `PUBLIC_INGEST_TOKEN` del Gestor.

Listo: al terminar el test, el lead aparece en el Gestor como **Nuevo**, fuente
**"Arma tu viaje ideal"**, campaña **"Landing interactiva"**, con todo el detalle del test
en `ai_extracted_data` y un resumen legible en `original_client_message`.

## Mapeo de campos (test → columnas del Gestor)

| Test | Columna del Gestor |
|---|---|
| Fuente | `source` = "Arma tu viaje ideal" |
| Campaña | `campaign_id` = "Landing interactiva" (+ utm_*) |
| Estado | `status` = "Nuevo" |
| Servicio | `travel_type` |
| Destino | `destination_interest` |
| Origen | `city` |
| Fechas/mes/quincena/flexibilidad/bebés | `departure_date`, `return_date`, `flexible_dates`, `date_notes` |
| Adultos | `adults` |
| Menores | `minors` |
| Edades de menores | `minors_ages` |
| Estilos / moneda / presupuesto / reacción / ajustes / comentario | `client_comments` |
| Urgencia | `interest_level` |
| Resultado generado | `original_client_message` |
| WhatsApp | `phone` |
| Correo | `email` |
| Nombre | `name` |
| Preferencia de contacto | `internal_notes` |
| **Todo el test completo (JSON)** | `ai_extracted_data` |
