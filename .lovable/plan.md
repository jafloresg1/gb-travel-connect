# Corregir y mejorar la recomendación de "Arma tu viaje ideal"

## El problema

En las capturas se ve la incongruencia: el cliente eligió **Solo vuelo · Colombia · Familiar**, pero la pantalla de resultado le sugiere un **"Paquete familiar todo incluido"** con hotel, traslados y plan todo incluido. Eso contradice lo que pidió ("solo vuelo").

La causa está en `src/lib/recommend.ts`: el orden de las reglas hace que el **estilo de viaje** (Familiar) se evalúe **antes** que el **servicio** (Solo vuelo). Como hay menores y estilo familiar, entra primero a la regla de "paquete familiar" y nunca llega a la regla de "solo vuelo".

## La solución

Reordenar y reescribir la lógica para que **el servicio elegido mande**, y que el estilo (familiar, lujo, pareja, etc.) sólo ajuste el tono y los detalles dentro de ese servicio. Además, dejar la pantalla de resultado con aspecto de "plan ideal para ti".

### 1. Prioridad del servicio (en `recommend.ts`)

El nuevo orden de decisión será:

```text
1. Asesoría explícita        -> el cliente pidió asesor / "no estoy seguro"
2. Servicio = Solo vuelo     -> plan enfocado SOLO en vuelo
3. Servicio = Solo hotel     -> plan enfocado SOLO en hotel
4. Servicio = Crucero        -> crucero
5. Servicio = Circuito       -> circuito internacional
6. Resto (vuelo+hotel,
   paquete, grupo, etc.)     -> se afina por estilo (familiar, luna de miel, lujo...)
```

Así, "Solo vuelo" siempre devuelve una recomendación de vuelo, aunque el estilo sea Familiar.

### 2. Que cada servicio se adapte al estilo y a los pasajeros

Dentro de cada servicio, el texto se personaliza con los datos reales:

- **Solo vuelo + Familiar / con menores** → "Vuelo redondo para tu familia a {destino}", incluye: vuelo redondo para {n} pasajeros, opciones con/sin equipaje, mejores horarios para viajar con niños, alternativas de aerolíneas y fechas. Nivel y prioridad acordes (familiar = comodidad de horarios; económico = mejor precio).
- **Solo vuelo + pareja/individual** → enfoque en mejor tarifa y horarios.
- **Solo hotel + estilo** → hotel acorde (familiar, romántico, negocios) sin meter vuelo ni traslados.
- Los servicios completos (vuelo+hotel, paquete, grupo) sí incluyen hotel/traslados y se afinan por estilo como hoy.

El resultado siempre será coherente: nunca aparecerá "hotel" o "traslados" si el cliente pidió solo vuelo.

### 3. Mejorar la presentación del resultado (en `ArmaTuViaje.tsx`, fase 10)

Para que se vea como "el plan ideal para ti":

- Encabezado más destacado con el destino y el tipo de viaje (ej. "Tu viaje ideal: Vuelo a Colombia para tu familia").
- Resumen rápido en chips/badges con los datos clave elegidos (destino, fechas/mes, duración, pasajeros, presupuesto) para reforzar que la propuesta concuerda con lo que pidió.
- Mantener la tarjeta "Qué debería incluir" y las cajas de Nivel / Prioridad / Siguiente paso, con un poco más de jerarquía visual (íconos y acentos del sistema de diseño, sin colores hardcodeados).
- Conservar intactos los botones "Ajustar respuestas" y "Continuar", el guardado del lead y el envío al Gestor.

## Alcance

- `src/lib/recommend.ts` — reescritura del orden y del contenido de las reglas (función pura, sin precios ni promesas).
- `src/pages/ArmaTuViaje.tsx` — sólo la presentación de la fase 10 (resultado). Sin tocar la lógica de guardado, WhatsApp ni el envío al Gestor.

## Qué NO cambia

- Pasos del flujo, preguntas y opciones.
- Guardado del lead local y envío al Gestor de Leads.
- Mensaje de WhatsApp ni número oficial.
- Sistema de diseño (se usan tokens existentes, nada de colores fijos).
