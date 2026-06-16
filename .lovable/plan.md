# Integrar "Arma tu viaje ideal" con el Gestor de Leads existente

## Contexto confirmado

El Gestor de Leads es el proyecto **Leads Gbtravel** (mismo workspace, base de datos propia). NO se creará ningún gestor nuevo ni la ruta `/app/leads`. La landing solo será una **fuente de captación** que inserta el lead en la tabla `leads` del Gestor.

Su tabla `leads` ya tiene casi todos los campos que pides, más dos campos ideales para el detalle extra:
- `original_client_message` (texto) → resumen legible del test
- `ai_extracted_data` (JSON) → toda la información del test sin perder nada

Como ese proyecto no expone hoy ninguna forma de recibir datos externos, hay que crear un **punto de entrada protegido por token** en el Gestor y luego apuntar la landing hacia él. Por eso el trabajo ocurre en **dos proyectos**.

## Arquitectura

```text
Cliente termina el test en /arma-tu-viaje (este proyecto)
        |
        v
 submit-lead (edge function de este proyecto)
   - guarda copia local de respaldo (tabla leads de este proyecto)
   - hace POST con token -> ingest-lead del Gestor
        |
        v
 ingest-lead (edge function del Gestor "Leads Gbtravel")
   - valida token compartido
   - genera folio
   - inserta en public.leads del Gestor (source/status/campaña + ai_extracted_data)
        |
        v
 Lead aparece en el Gestor de Leads existente como "Nuevo"
```

## Parte A — En el proyecto Gestor (Leads Gbtravel)

Estas piezas deben aplicarse dentro de ese proyecto (cambiaré a él durante el build, o se aplican en su propio chat):

1. **Migración**: función `generate_lead_folio()` que produce folios únicos para leads entrantes (formato `AV-YYYYMMDD-XXXX`).
2. **Edge function `ingest-lead`** (`verify_jwt = false`):
   - Valida header `x-ingest-token` contra el secreto `PUBLIC_INGEST_TOKEN`.
   - Valida el cuerpo con Zod.
   - Inserta en `public.leads` usando service role, generando folio.
3. **Secreto** `PUBLIC_INGEST_TOKEN` en el Gestor.

## Parte B — En este proyecto (landing)

1. **Actualizar `submit-lead`**:
   - Mantiene el guardado local actual como respaldo.
   - Tras guardar, hace `POST` al `ingest-lead` del Gestor con el token y el payload mapeado.
   - Si el Gestor responde error, el lead local queda igual (no se pierde) y se registra en logs.
2. **Secretos en este proyecto**: `GESTOR_INGEST_URL` y `GESTOR_INGEST_TOKEN` (mismo valor que en el Gestor).
3. Sin cambios en la UI del test; la landing ya captura todos los campos.

## Mapeo de campos (test → Gestor `leads`)

| Dato del test | Columna en el Gestor |
|---|---|
| Fuente | `source` = "Arma tu viaje ideal" |
| Campaña | `campaign_id` = "Landing interactiva" + `utm_source`="arma-tu-viaje" |
| Estado inicial | `status` = "Nuevo" |
| Servicio | `travel_type` |
| Destino (+ otro) | `destination_interest` |
| Origen (+ otro) | `city` |
| Fechas / mes / quincena / flexibilidad | `departure_date`, `return_date`, `flexible_dates`, `date_notes` |
| Adultos | `adults` |
| Menores | `minors` |
| Edades de menores | `minors_ages` |
| Bebés | dentro de `date_notes` + `ai_extracted_data` |
| Estilos de viaje | `client_comments` + `ai_extracted_data` |
| Moneda / nivel presupuesto | `client_comments` + `ai_extracted_data` |
| Urgencia | `interest_level` (Caliente/Tibio/Frío) |
| Resultado generado (título, descripción, incluye, nivel, prioridad) | `original_client_message` (resumen) + `ai_extracted_data` |
| Reacción del cliente | `client_comments` + `ai_extracted_data` |
| Ajustes solicitados + comentario de cambio | `client_comments` + `ai_extracted_data` |
| WhatsApp | `phone` |
| Correo | `email` |
| Nombre | `name` |
| Preferencia de contacto | `internal_notes` + `ai_extracted_data` |

Todo el detalle completo del test queda además íntegro en `ai_extracted_data` (JSON), así no se pierde ningún dato aunque una columna no exista.

## Limpieza

- Se retira el endpoint `get-leads` con API key externa (ya no aplica: la integración es push directo dentro del workspace).
- La tarjeta de `/app` sigue abriendo el Gestor existente.

## Notas técnicas

- El folio se genera en el servidor del Gestor para garantizar unicidad.
- El token compartido protege el endpoint contra inserciones no autorizadas; no se expone en el frontend (vive solo en las edge functions).
- El guardado local de respaldo evita pérdida de leads si el Gestor está temporalmente inaccesible.
- Orden de build recomendado: primero Parte A (Gestor) para obtener la URL del `ingest-lead`, luego Parte B (esta landing) con esa URL y el token.
