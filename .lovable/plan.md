## Estado actual

✅ Backend ya preparado (Lovable Cloud activo, tabla `leads`, roles y RLS).

## Decisión de integración (confirmada)

- El **Gestor de Leads** es una app Lovable independiente: `https://leads.gbtravel.co/` (aún no recibe leads externos).
- **No** se crea `/app/leads` ni un gestor paralelo en este proyecto.
- Este proyecto actúa solo como **fuente de captación**: guarda los leads y los expone vía API para que el Gestor existente los consuma.

## Lo que se construirá en modo build

### 1. Captura de leads
- Edge function `submit-lead`: valida con Zod e inserta el lead (service_role). Campos:
  - `fuente` = "Arma tu viaje ideal", `campaña`/contexto = "Landing interactiva", `estado` = "Nuevo".
  - Todos los campos del test en columnas propias.
  - Además, un resumen legible + `metadata` JSON con todas las respuestas, para que cualquier gestor pueda mostrarlo aunque no tenga columnas específicas.
- Se añade columna `metadata jsonb` y `resumen text` a la tabla `leads` (migración).

### 2. Endpoint para el Gestor existente
- Edge function `get-leads` protegida con una **API key** (secret `LEADS_API_KEY`): devuelve los leads en JSON para que `leads.gbtravel.co` los importe desde su propio proyecto. Soporta filtro por fecha/estado.

### 3. Landing pública `/arma-tu-viaje`
Hero + 8 pasos + resultado + feedback + contacto + resumen + confirmación. Mobile-first, barra de progreso, botones Atrás/Continuar, transiciones suaves.

```text
Hero → 1 servicio → 2 destino → 3 origen → 4 fechas → 5 pasajeros (contadores)
→ 6 estilos → 7 presupuesto → 8 urgencia → Resultado → Feedback → Contacto
→ Resumen → Confirmación (botón seguimiento WhatsApp 8182105791)
```
- Componentes: `StepShell`, `SelectableCard`, `Chip`, `Counter`, selector meses/quincena, calendario.
- `src/lib/recommend.ts`: lógica de recomendación (sin precios ni disponibilidad).
- `src/lib/armaViaje.ts`: constantes editables (destinos, orígenes, estilos, textos).
- Contacto: WhatsApp o correo (al menos uno), nombre opcional, preferencia de contacto.

### 4. Accesos en el sitio
- `Header.tsx`: enlace "Arma tu viaje ideal" (desktop + hamburguesa).
- `HeroSection.tsx`: botón destacado "Arma tu viaje ideal".
- `App.tsx`: ruta `/arma-tu-viaje`.
- `InternalPortal.tsx` + `internalApps.ts`: la tarjeta "Gestor de Leads" enlaza a `https://leads.gbtravel.co/`.

### 5. Imágenes
✅ Ya generadas (Punta Cana, Los Cabos, Orlando, Japón, Colombia, Crucero) + existentes.

## Notas
- Cuando quieras, en el proyecto de `leads.gbtravel.co` se consume el endpoint `get-leads` con la API key para importar automáticamente; eso se hace en ese otro proyecto.
- Alternativa futura: si prefieres push en lugar de pull, cuando `leads.gbtravel.co` tenga un webhook, agrego un POST directo desde `submit-lead`.