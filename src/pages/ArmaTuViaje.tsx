import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Plane, PlaneTakeoff, Luggage, Hotel, Ship, Palmtree, Users, Globe, HelpCircle,
  MapPin, CalendarCheck, CalendarClock, CalendarRange, Sparkles, Rocket, Scale,
  Lightbulb, Clock, ThumbsUp, Pencil, RefreshCw, Headset, ArrowLeft, ArrowRight,
  MessageCircle, CheckCircle2, Compass, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { whatsappLink } from "@/lib/constants";
import StepShell from "@/components/armaviaje/StepShell";
import SelectableCard from "@/components/armaviaje/SelectableCard";
import Chip from "@/components/armaviaje/Chip";
import Counter from "@/components/armaviaje/Counter";
import { initialQuote, QuoteState, recommend, Recommendation } from "@/lib/recommend";
import {
  HERO, SERVICIOS, DESTINOS, ORIGENES, TIPO_FECHAS, MESES, QUINCENAS, FLEXIBILIDAD,
  ESTILOS, MONEDAS, NIVELES_PRESUPUESTO, URGENCIAS, FEEDBACK_OPCIONES, AJUSTES,
  PREFERENCIA_CONTACTO, TEXTOS, OptionCard, DURACIONES,
} from "@/lib/armaViaje";
import logo from "@/assets/logo_gbtravel.png";

const SEGUIMIENTO_NUMERO = "8182105791";

const ICONS: Record<string, React.ElementType> = {
  Plane, PlaneTakeoff, Luggage, Hotel, Ship, Palmtree, Users, Globe, HelpCircle,
  MapPin, CalendarCheck, CalendarClock, CalendarRange, Sparkles, Rocket, Scale,
  Lightbulb, Clock, ThumbsUp, Pencil, RefreshCw, Headset,
};
const renderIcon = (name?: string) => {
  if (!name) return null;
  const Icon = ICONS[name];
  return Icon ? <Icon className="h-5 w-5" /> : null;
};

const TOTAL_STEPS = 9;

const labelFromId = (list: OptionCard[], id: string | null) =>
  list.find((o) => o.id === id)?.label ?? id ?? "";

const ArmaTuViaje = () => {
  const { toast } = useToast();
  const [phase, setPhase] = useState(0); // 0 hero, 1-8 steps, 9 resultado, 10 feedback, 11 contacto, 12 resumen, 13 confirmacion
  const [q, setQ] = useState<QuoteState>(initialQuote);
  const [submitting, setSubmitting] = useState(false);

  const set = (patch: Partial<QuoteState>) => setQ((prev) => ({ ...prev, ...patch }));

  const recommendation: Recommendation = useMemo(() => recommend(q), [q]);

  const toggle = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

  const goBack = () => setPhase((p) => Math.max(0, p - 1));
  const goNext = () => setPhase((p) => p + 1);

  // ---------- HERO ----------
  if (phase === 0) {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-b from-secondary via-background to-background flex flex-col">
        <header className="container mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <img src={logo} alt="GB Travel" className="h-11 w-auto" />
          <Button asChild variant="ghost" size="sm" className="gap-1.5">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" /> Inicio
            </Link>
          </Button>
        </header>
        <main className="flex-1 flex items-center">
          <div className="container mx-auto max-w-2xl px-4 py-8 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 text-accent-foreground/90 px-3 py-1 text-xs font-semibold mb-5">
              <Compass className="h-3.5 w-3.5 text-accent" /> Experiencia interactiva GB Travel
            </span>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              {HERO.titulo}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              {HERO.subtitulo}
            </p>
            <Button size="lg" className="text-base gap-2 px-8" onClick={() => setPhase(1)}>
              {HERO.cta} <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="text-sm text-muted-foreground mt-5 flex flex-wrap items-center justify-center gap-x-2">
              {HERO.confianza}
            </p>
            <p className="text-xs text-muted-foreground/80 mt-3 max-w-md mx-auto">{HERO.nota}</p>
          </div>
        </main>
      </div>
    );
  }

  // ---------- STEP 1: Servicio ----------
  if (phase === 1) {
    return (
      <StepShell
        step={1}
        total={TOTAL_STEPS}
        title="¿Qué quieres cotizar?"
        subtitle="Selecciona al menos una opción."
        onBack={goBack}
        onNext={goNext}
        nextDisabled={q.servicios.length === 0}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SERVICIOS.map((s) => (
            <SelectableCard
              key={s.id}
              label={s.label}
              descripcion={s.descripcion}
              icon={renderIcon(s.icon)}
              selected={q.servicios.includes(s.id)}
              onClick={() => set({ servicios: toggle(q.servicios, s.id) })}
            />
          ))}
        </div>
      </StepShell>
    );
  }

  // ---------- STEP 2: Destino ----------
  if (phase === 2) {
    return (
      <StepShell
        step={2}
        total={TOTAL_STEPS}
        title="¿A dónde quieres viajar?"
        subtitle="Elige un destino popular o cuéntanos el tuyo."
        onBack={goBack}
        onNext={goNext}
        nextDisabled={!q.destino || (q.destino === "otro" && !q.otroDestino.trim())}
      >
        <div className="grid grid-cols-2 gap-3">
          {DESTINOS.map((d) => (
            <SelectableCard
              key={d.id}
              label={d.label}
              imagen={d.imagen}
              icon={renderIcon(d.icon)}
              selected={q.destino === d.id}
              onClick={() => set({ destino: d.id })}
            />
          ))}
        </div>
        {q.destino === "otro" && (
          <Input
            className="mt-4"
            placeholder="Escribe el destino que tienes en mente"
            value={q.otroDestino}
            onChange={(e) => set({ otroDestino: e.target.value })}
          />
        )}
      </StepShell>
    );
  }

  // ---------- STEP 3: Origen ----------
  if (phase === 3) {
    return (
      <StepShell
        step={3}
        total={TOTAL_STEPS}
        title="¿Desde dónde sales?"
        onBack={goBack}
        onNext={goNext}
        nextDisabled={!q.origen || (q.origen === "otro" && !q.otroOrigen.trim())}
      >
        <div className="flex flex-wrap gap-2.5">
          {ORIGENES.map((o) => (
            <Chip
              key={o.id}
              label={o.label}
              selected={q.origen === o.id}
              onClick={() => set({ origen: o.id })}
            />
          ))}
        </div>
        {q.origen === "otro" && (
          <Input
            className="mt-4"
            placeholder="Escribe tu ciudad de salida"
            value={q.otroOrigen}
            onChange={(e) => set({ otroOrigen: e.target.value })}
          />
        )}
      </StepShell>
    );
  }

  // ---------- STEP 4: Fechas ----------
  if (phase === 4) {
    const tf = q.tipoFechas;
    let nextDisabled = !tf;
    if (tf === "tengo-fechas") nextDisabled = !q.fechaSalida;
    if (tf === "aproximadas") nextDisabled = !q.mes;
    if (tf === "flexible") nextDisabled = q.flexibilidad.length === 0;
    return (
      <StepShell
        step={4}
        total={TOTAL_STEPS}
        title="¿Cuándo quieres viajar?"
        onBack={goBack}
        onNext={goNext}
        nextDisabled={nextDisabled}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TIPO_FECHAS.map((t) => (
            <SelectableCard
              key={t.id}
              label={t.label}
              icon={renderIcon(t.icon)}
              selected={q.tipoFechas === t.id}
              onClick={() => set({ tipoFechas: t.id })}
            />
          ))}
        </div>

        {tf === "tengo-fechas" && (
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-2">
              <p className="text-sm font-semibold text-center py-2">Fecha de salida</p>
              <Calendar
                mode="single"
                selected={q.fechaSalida ? new Date(q.fechaSalida) : undefined}
                onSelect={(d) => set({ fechaSalida: d ? d.toISOString().slice(0, 10) : null })}
                locale={es}
                className="p-0 pointer-events-auto mx-auto"
              />
            </div>
            <div className="rounded-xl border border-border bg-card p-2">
              <p className="text-sm font-semibold text-center py-2">Fecha de regreso</p>
              <Calendar
                mode="single"
                selected={q.fechaRegreso ? new Date(q.fechaRegreso) : undefined}
                onSelect={(d) => set({ fechaRegreso: d ? d.toISOString().slice(0, 10) : null })}
                locale={es}
                className="p-0 pointer-events-auto mx-auto"
              />
            </div>
          </div>
        )}

        {tf === "aproximadas" && (
          <div className="mt-5 space-y-4">
            <div>
              <p className="text-sm font-semibold mb-2">¿Qué mes?</p>
              <div className="flex flex-wrap gap-2">
                {MESES.map((m) => (
                  <Chip key={m} label={m} selected={q.mes === m} onClick={() => set({ mes: m })} />
                ))}
              </div>
            </div>
            {q.mes && (
              <div>
                <p className="text-sm font-semibold mb-2">¿Qué parte del mes?</p>
                <div className="flex flex-wrap gap-2">
                  {QUINCENAS.map((qz) => (
                    <Chip key={qz} label={qz} selected={q.quincena === qz} onClick={() => set({ quincena: qz })} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tf === "flexible" && (
          <div className="mt-5">
            <p className="text-sm font-semibold mb-2">Selecciona lo que aplique</p>
            <div className="flex flex-wrap gap-2">
              {FLEXIBILIDAD.map((f) => (
                <Chip
                  key={f}
                  label={f}
                  selected={q.flexibilidad.includes(f)}
                  onClick={() => set({ flexibilidad: toggle(q.flexibilidad, f) })}
                />
              ))}
            </div>
          </div>
        )}
      </StepShell>
    );
  }

  // ---------- STEP 5: Duración ----------
  if (phase === 5) {
    return (
      <StepShell
        step={5}
        total={TOTAL_STEPS}
        title="¿Por cuántas noches quieres viajar?"
        subtitle="Elige una opción o escribe la tuya."
        onBack={goBack}
        onNext={goNext}
        nextDisabled={!q.duracion || (q.duracion === "otra" && !q.duracionOtra.trim())}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DURACIONES.map((d) => (
            <SelectableCard
              key={d.id}
              label={d.label}
              icon={renderIcon(d.icon)}
              selected={q.duracion === d.id}
              onClick={() => set({ duracion: d.id })}
            />
          ))}
        </div>
        {q.duracion === "otra" && (
          <Input
            className="mt-4"
            placeholder="Ej. 10 días / 9 noches"
            value={q.duracionOtra}
            onChange={(e) => set({ duracionOtra: e.target.value })}
          />
        )}
      </StepShell>
    );
  }

  // ---------- STEP 6: Pasajeros ----------
  if (phase === 6) {
    const setEdad = (i: number, val: number) => {
      const next = [...q.edadesMenores];
      next[i] = val;
      set({ edadesMenores: next });
    };
    const syncEdades = (menores: number) => {
      const next = [...q.edadesMenores];
      next.length = menores;
      for (let i = 0; i < menores; i++) if (next[i] === undefined) next[i] = 0;
      set({ menores, edadesMenores: next });
    };
    return (
      <StepShell step={6} total={TOTAL_STEPS} title="¿Cuántas personas viajan?" onBack={goBack} onNext={goNext}>
        <div className="space-y-3">
          <Counter label="Adultos" value={q.adultos} min={1} onChange={(v) => set({ adultos: v })} />
          <Counter label="Menores" hint="2 a 17 años" value={q.menores} min={0} onChange={syncEdades} />
          <Counter label="Bebés" hint="Menores de 2 años" value={q.bebes} min={0} onChange={(v) => set({ bebes: v })} />
        </div>

        {q.menores > 0 && (
          <div className="mt-5">
            <p className="text-sm font-semibold mb-2">¿Qué edades tienen los menores?</p>
            <div className="space-y-3">
              {Array.from({ length: q.menores }).map((_, i) => (
                <div key={i}>
                  <p className="text-xs text-muted-foreground mb-1.5">Menor {i + 1}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from({ length: 18 }).map((__, age) => (
                      <Chip
                        key={age}
                        label={String(age)}
                        selected={q.edadesMenores[i] === age}
                        onClick={() => setEdad(i, age)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </StepShell>
    );
  }

  // ---------- STEP 7: Estilos ----------
  if (phase === 7) {
    return (
      <StepShell
        step={7}
        total={TOTAL_STEPS}
        title="¿Qué estilo de viaje buscas?"
        subtitle="Puedes elegir varias opciones."
        onBack={goBack}
        onNext={goNext}
        nextDisabled={q.estilos.length === 0}
      >
        <div className="flex flex-wrap gap-2.5">
          {ESTILOS.map((e) => (
            <Chip key={e} label={e} selected={q.estilos.includes(e)} onClick={() => set({ estilos: toggle(q.estilos, e) })} />
          ))}
        </div>
      </StepShell>
    );
  }

  // ---------- STEP 8: Presupuesto ----------
  if (phase === 8) {
    return (
      <StepShell
        step={8}
        total={TOTAL_STEPS}
        title="¿Qué nivel de presupuesto tienes en mente?"
        onBack={goBack}
        onNext={goNext}
        nextDisabled={!q.moneda || !q.nivelPresupuesto}
      >
        <p className="text-sm font-semibold mb-2">Moneda</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {MONEDAS.map((m) => (
            <Chip key={m.id} label={m.label} selected={q.moneda === m.id} onClick={() => set({ moneda: m.id })} />
          ))}
        </div>
        <p className="text-sm font-semibold mb-2">Nivel de presupuesto</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {NIVELES_PRESUPUESTO.map((n) => (
            <SelectableCard
              key={n.id}
              label={n.label}
              selected={q.nivelPresupuesto === n.id}
              onClick={() => set({ nivelPresupuesto: n.id })}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">{TEXTOS.presupuestoApoyo}</p>
      </StepShell>
    );
  }

  // ---------- STEP 9: Urgencia ----------
  if (phase === 9) {
    return (
      <StepShell
        step={9}
        total={TOTAL_STEPS}
        title="¿Qué tan pronto quieres reservar?"
        onBack={goBack}
        onNext={goNext}
        nextLabel="Ver mi recomendación"
        nextDisabled={!q.urgencia}
      >
        <div className="grid grid-cols-1 gap-3">
          {URGENCIAS.map((u) => (
            <SelectableCard
              key={u.id}
              label={u.label}
              icon={renderIcon(u.icon)}
              selected={q.urgencia === u.id}
              onClick={() => set({ urgencia: u.id })}
            />
          ))}
        </div>
      </StepShell>
    );
  }

  // ---------- RESULTADO ----------
  if (phase === 10) {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-b from-secondary via-background to-background flex flex-col">
        <div className="flex-1 container mx-auto max-w-2xl px-4 py-8 animate-fade-in">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold mb-4">
            <Star className="h-3.5 w-3.5 text-accent" /> Tu recomendación personalizada
          </span>
          <p className="text-muted-foreground mb-1">Tu viaje ideal parece ser:</p>
          <h1 className="text-2xl md:text-4xl font-bold mb-4">{recommendation.titulo}</h1>
          <p className="text-muted-foreground mb-6">{recommendation.descripcion}</p>

          <div className="rounded-xl border border-border bg-card p-5 mb-5">
            <p className="font-semibold mb-3">Qué debería incluir</p>
            <ul className="space-y-2">
              {recommendation.incluye.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-3 mb-6">
            <div className="rounded-lg bg-secondary p-3 text-sm">
              <span className="font-semibold">Nivel sugerido:</span> {recommendation.nivelSugerido}
            </div>
            <div className="rounded-lg bg-secondary p-3 text-sm">
              <span className="font-semibold">Prioridad detectada:</span> {recommendation.prioridad}
            </div>
            <div className="rounded-lg bg-secondary p-3 text-sm">
              <span className="font-semibold">Siguiente paso recomendado:</span> {recommendation.siguiente}
            </div>
          </div>

          <p className="text-xs text-muted-foreground italic mb-6">{TEXTOS.disclaimer}</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="gap-2" onClick={goBack}>
              <ArrowLeft className="h-4 w-4" /> Ajustar respuestas
            </Button>
            <Button className="flex-1 gap-2" onClick={goNext}>
              Continuar <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- FEEDBACK ----------
  if (phase === 11) {
    const canContinue =
      !!q.respuestaCliente &&
      (q.respuestaCliente !== "ajustar" || q.ajustes.length > 0);
    return (
      <StepShell
        step={9}
        total={TOTAL_STEPS}
        title="¿Este resultado se parece a lo que estás buscando?"
        onBack={goBack}
        onNext={goNext}
        nextDisabled={!canContinue}
        hideNext={!q.respuestaCliente}
      >
        <div className="grid grid-cols-1 gap-3">
          {FEEDBACK_OPCIONES.map((f) => (
            <SelectableCard
              key={f.id}
              label={f.label}
              icon={renderIcon(f.icon)}
              selected={q.respuestaCliente === f.id}
              onClick={() => set({ respuestaCliente: f.id })}
            />
          ))}
        </div>

        {q.respuestaCliente === "ajustar" && (
          <div className="mt-5">
            <p className="text-sm font-semibold mb-2">¿Qué te gustaría ajustar?</p>
            <div className="flex flex-wrap gap-2">
              {AJUSTES.map((a) => (
                <Chip key={a} label={a} selected={q.ajustes.includes(a)} onClick={() => set({ ajustes: toggle(q.ajustes, a) })} />
              ))}
            </div>
          </div>
        )}

        {q.respuestaCliente === "diferente" && (
          <Textarea
            className="mt-5"
            placeholder="Cuéntanos qué cambiarías de esta idea"
            rows={3}
            value={q.comentarioCambio}
            onChange={(e) => set({ comentarioCambio: e.target.value })}
          />
        )}
      </StepShell>
    );
  }

  // ---------- CONTACTO ----------
  if (phase === 12) {
    const hasContact = q.whatsapp.trim().length > 0 || q.correo.trim().length > 0;
    return (
      <StepShell
        step={9}
        total={TOTAL_STEPS}
        title="¿A dónde te enviamos opciones reales para este viaje?"
        onBack={goBack}
        onNext={goNext}
        nextLabel="Revisar mi solicitud"
        nextDisabled={!hasContact}
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold">WhatsApp</label>
            <Input
              className="mt-1.5"
              inputMode="tel"
              placeholder="Tu número de WhatsApp"
              value={q.whatsapp}
              onChange={(e) => set({ whatsapp: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Correo electrónico</label>
            <Input
              className="mt-1.5"
              type="email"
              placeholder="tu@correo.com"
              value={q.correo}
              onChange={(e) => set({ correo: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Nombre <span className="text-muted-foreground font-normal">(opcional)</span></label>
            <Input
              className="mt-1.5"
              placeholder="¿Cómo te llamas?"
              value={q.nombre}
              onChange={(e) => set({ nombre: e.target.value })}
            />
          </div>
          <p className="text-xs text-muted-foreground">{TEXTOS.contactoAyuda}</p>

          <div>
            <p className="text-sm font-semibold mb-2">Prefiero que me contacten por:</p>
            <div className="flex flex-wrap gap-2">
              {PREFERENCIA_CONTACTO.map((p) => (
                <Chip
                  key={p.id}
                  label={p.label}
                  selected={q.preferenciaContacto === p.id}
                  onClick={() => set({ preferenciaContacto: p.id })}
                />
              ))}
            </div>
          </div>
        </div>
      </StepShell>
    );
  }

  // ---------- RESUMEN ----------
  if (phase === 13) {
    const destinoLabel = q.destino === "otro" ? q.otroDestino : labelFromId(DESTINOS, q.destino);
    const origenLabel = q.origen === "otro" ? q.otroOrigen : labelFromId(ORIGENES, q.origen);
    const fechasLabel =
      q.tipoFechas === "tengo-fechas"
        ? `${q.fechaSalida ? format(new Date(q.fechaSalida), "d MMM yyyy", { locale: es }) : "?"}${q.fechaRegreso ? " → " + format(new Date(q.fechaRegreso), "d MMM yyyy", { locale: es }) : ""}`
        : q.tipoFechas === "aproximadas"
          ? `${q.mes ?? ""}${q.quincena ? " · " + q.quincena : ""}`
          : q.tipoFechas === "flexible"
            ? q.flexibilidad.join(", ")
            : "Quiere recomendación de fecha";

    const duracionLabel = q.duracion === "otra" ? q.duracionOtra : labelFromId(DURACIONES, q.duracion);

    const rows: [string, string][] = [
      ["Servicio", q.servicios.map((s) => labelFromId(SERVICIOS, s)).join(", ")],
      ["Destino", destinoLabel || "—"],
      ["Ciudad de salida", origenLabel || "—"],
      ["Fechas", fechasLabel || "—"],
      ["Duración", duracionLabel || "—"],
      ["Adultos", String(q.adultos)],
      ["Menores", q.menores ? `${q.menores} (edades: ${q.edadesMenores.join(", ")})` : "0"],
      ["Bebés", String(q.bebes)],
      ["Estilo de viaje", q.estilos.join(", ") || "—"],
      ["Presupuesto", `${labelFromId(NIVELES_PRESUPUESTO, q.nivelPresupuesto)}${q.moneda ? " (" + q.moneda + ")" : ""}`],
      ["Urgencia", labelFromId(URGENCIAS, q.urgencia)],
      ["Resultado", recommendation.titulo],
      ["Tu respuesta", labelFromId(FEEDBACK_OPCIONES, q.respuestaCliente)],
      ...(q.ajustes.length ? [["Ajustes", q.ajustes.join(", ")] as [string, string]] : []),
      ...(q.comentarioCambio ? [["Comentario", q.comentarioCambio] as [string, string]] : []),
      ["Contacto", [q.whatsapp && `WhatsApp: ${q.whatsapp}`, q.correo && `Correo: ${q.correo}`].filter(Boolean).join(" · ")],
    ];

    return (
      <StepShell
        step={9}
        total={TOTAL_STEPS}
        title="Revisa tu solicitud"
        onBack={goBack}
        hideNext
      >
        <div className="rounded-xl border border-border bg-card divide-y divide-border">
          {rows.map(([k, v]) => (
            <div key={k} className="flex gap-3 px-4 py-2.5 text-sm">
              <span className="w-32 shrink-0 text-muted-foreground">{k}</span>
              <span className="font-medium break-words">{v || "—"}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button variant="outline" className="gap-2" onClick={() => setPhase(1)}>
            <Pencil className="h-4 w-4" /> Editar
          </Button>
          <Button className="flex-1 gap-2" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Enviando..." : "Enviar solicitud"}
            {!submitting && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </StepShell>
    );
  }

  // ---------- CONFIRMACIÓN ----------
  const destinoLabel = q.destino === "otro" ? q.otroDestino : labelFromId(DESTINOS, q.destino);
  const origenLabel = q.origen === "otro" ? q.otroOrigen : labelFromId(ORIGENES, q.origen);
  const fechasLabel =
    q.tipoFechas === "tengo-fechas"
      ? `${q.fechaSalida ? format(new Date(q.fechaSalida), "d MMM yyyy", { locale: es }) : "?"}${q.fechaRegreso ? " → " + format(new Date(q.fechaRegreso), "d MMM yyyy", { locale: es }) : ""}`
      : q.tipoFechas === "aproximadas"
        ? `${q.mes ?? ""}${q.quincena ? " · " + q.quincena : ""}`
        : q.tipoFechas === "flexible"
          ? q.flexibilidad.join(", ")
          : "Quiere recomendación de fecha";

  const pasajerosLabel = [
    `${q.adultos} adulto${q.adultos > 1 ? "s" : ""}`,
    q.menores > 0 ? `${q.menores} menor${q.menores > 1 ? "es" : ""} (${q.edadesMenores.join(", ")} años)` : null,
    q.bebes > 0 ? `${q.bebes} bebé${q.bebes > 1 ? "s" : ""}` : null,
  ].filter(Boolean).join(" · ");

  const presupuestoLabel = `${labelFromId(NIVELES_PRESUPUESTO, q.nivelPresupuesto)}${q.moneda ? " (" + q.moneda + ")" : ""}`;

  const ajustesLabel = [
    ...(q.ajustes.length ? [q.ajustes.join(", ")] : []),
    ...(q.comentarioCambio ? [q.comentarioCambio] : []),
  ].filter(Boolean).join(" · ") || "Ninguno";

  const duracionLabel = q.duracion === "otra" ? q.duracionOtra : labelFromId(DURACIONES, q.duracion);

  const whatsappMessage = [
    'Hola, acabo de llenar "Arma tu viaje ideal" en GB Travel y quiero dar seguimiento a mi cotización.',
    "",
    "Resumen de mi viaje:",
    `Servicio: ${q.servicios.map((s) => labelFromId(SERVICIOS, s)).join(", ") || "—"}`,
    `Destino: ${destinoLabel || "—"}`,
    `Origen: ${origenLabel || "—"}`,
    `Fechas: ${fechasLabel || "—"}`,
    `Duración: ${duracionLabel || "—"}`,
    `Pasajeros: ${pasajerosLabel || "—"}`,
    `Estilo de viaje: ${q.estilos.join(", ") || "—"}`,
    `Presupuesto: ${presupuestoLabel || "—"}`,
    `Resultado sugerido: ${recommendation.titulo || "—"}`,
    `Ajustes o comentarios: ${ajustesLabel}`,
  ].join("\n");

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-secondary via-background to-background flex items-center">
      <div className="container mx-auto max-w-lg px-4 py-12 text-center animate-fade-in">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-whatsapp/15">
          <CheckCircle2 className="h-11 w-11 text-whatsapp" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-3">{TEXTOS.confirmacionTitulo}</h1>
        <p className="text-muted-foreground mb-2">{TEXTOS.confirmacionTexto}</p>
        <p className="text-sm font-medium mb-8">{TEXTOS.confirmacionTiempo}</p>
        <Button
          asChild
          size="lg"
          className="bg-whatsapp hover:bg-whatsapp/90 text-whatsapp-foreground gap-2 w-full sm:w-auto px-8"
        >
          <a
            href={`https://wa.me/52${SEGUIMIENTO_NUMERO}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="h-5 w-5" /> Dar seguimiento por WhatsApp
          </a>
        </Button>
        <div className="mt-6">
          <Button asChild variant="ghost" size="sm">
            <Link to="/">Volver a GB Travel</Link>
          </Button>
        </div>
      </div>
    </div>
  );

  // ---------- SUBMIT ----------
  function handleSubmit() {
    void doSubmit();
  }

  async function doSubmit() {
    setSubmitting(true);
    try {
      const destinoLabel = q.destino === "otro" ? q.otroDestino : labelFromId(DESTINOS, q.destino);
      const resumen = [
        `Solicitud generada desde: Arma tu viaje ideal`,
        `Resultado sugerido: ${recommendation.titulo}`,
        `Cliente respondió: ${labelFromId(FEEDBACK_OPCIONES, q.respuestaCliente)}`,
        q.ajustes.length ? `Ajustes: ${q.ajustes.join(", ")}` : null,
        q.comentarioCambio ? `Comentario: ${q.comentarioCambio}` : null,
        `Urgencia: ${labelFromId(URGENCIAS, q.urgencia)}`,
      ]
        .filter(Boolean)
        .join("\n");

      const payload = {
        servicio: q.servicios.map((s) => labelFromId(SERVICIOS, s)).join(", "),
        destino: destinoLabel || null,
        otro_destino: q.destino === "otro" ? q.otroDestino : null,
        origen: q.origen === "otro" ? q.otroOrigen : labelFromId(ORIGENES, q.origen) || null,
        otro_origen: q.origen === "otro" ? q.otroOrigen : null,
        tipo_fechas: labelFromId(TIPO_FECHAS, q.tipoFechas) || null,
        fecha_salida: q.fechaSalida,
        fecha_regreso: q.fechaRegreso,
        mes_aprox: q.mes,
        quincena: q.quincena,
        flexibilidad: q.flexibilidad,
        adultos: q.adultos,
        menores: q.menores,
        edades_menores: q.edadesMenores,
        bebes: q.bebes,
        estilos: q.estilos,
        moneda: q.moneda,
        nivel_presupuesto: labelFromId(NIVELES_PRESUPUESTO, q.nivelPresupuesto) || null,
        urgencia: labelFromId(URGENCIAS, q.urgencia) || null,
        resultado_titulo: recommendation.titulo,
        resultado_descripcion: recommendation.descripcion,
        resultado_incluye: recommendation.incluye,
        nivel_sugerido: recommendation.nivelSugerido,
        prioridad: recommendation.prioridad,
        respuesta_cliente: labelFromId(FEEDBACK_OPCIONES, q.respuestaCliente) || null,
        ajustes: q.ajustes,
        comentario_cambio: q.comentarioCambio || null,
        whatsapp: q.whatsapp.trim() || null,
        correo: q.correo.trim() || null,
        nombre: q.nombre.trim() || null,
        preferencia_contacto: q.preferenciaContacto,
        resumen,
        metadata: { ...q, recomendacion: recommendation },
      };

      const { data, error } = await supabase.functions.invoke("submit-lead", { body: payload });
      if (error || (data && (data as { error?: unknown }).error)) {
        throw new Error("submit failed");
      }
      setPhase(13);
    } catch (e) {
      toast({
        title: "No se pudo enviar",
        description: "Revisa tu conexión e inténtalo de nuevo. Si continúa, escríbenos por WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }
};

export default ArmaTuViaje;
