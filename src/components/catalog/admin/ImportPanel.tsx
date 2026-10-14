import { useState } from "react";
import { ClipboardCopy, FileJson, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { IMPORT_EXAMPLE, draftFromImport, type ProgramDraft } from "@/lib/catalog";

type Props = { onImport: (draft: ProgramDraft) => void };

/** Pega JSON (preparado por Claude u otra herramienta) y precarga el formulario de "nuevo programa". */
const ImportPanel = ({ onImport }: Props) => {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    try {
      const draft = draftFromImport(text);
      setError(null);
      onImport(draft);
      toast.success("Datos cargados. Revisa cada pestaña y guarda.");
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const copyExample = async () => {
    try {
      await navigator.clipboard.writeText(IMPORT_EXAMPLE);
      toast.success("Ejemplo copiado");
    } catch {
      setText(IMPORT_EXAMPLE);
    }
  };

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-6">
      <div className="space-y-3">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-accent" /> Importar rápido
          </h2>
          <p className="text-sm text-muted-foreground">
            Pega aquí el JSON de un programa con sus salidas (por ejemplo, el que prepara Claude a partir de un PDF o
            de la página del operador). Se abrirá el formulario de “Nuevo programa” precargado para revisarlo antes
            de guardar. Nada se guarda hasta que presiones “Guardar”.
          </p>
        </div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={18}
          className="font-mono text-xs"
          placeholder='{ "title": "…", "region": "Europa", "departures": [ … ] }'
          aria-label="JSON del programa"
          aria-invalid={!!error}
        />
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <Button onClick={load} disabled={!text.trim()} className="gap-2">
            <FileJson className="h-4 w-4" /> Cargar en formulario
          </Button>
          <Button variant="ghost" onClick={() => setText("")} disabled={!text}>
            Limpiar
          </Button>
        </div>
      </div>

      <aside className="rounded-xl border border-border bg-secondary/50 p-4 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Formato esperado</h3>
          <Button size="sm" variant="outline" className="gap-1" onClick={copyExample}>
            <ClipboardCopy className="h-4 w-4" /> Copiar ejemplo
          </Button>
        </div>
        <ul className="list-disc pl-5 space-y-1 text-xs text-muted-foreground">
          <li>
            Obligatorio: <code>title</code>. Lo demás es opcional.
          </li>
          <li>
            Fechas en formato <code>AAAA-MM-DD</code>.
          </li>
          <li>
            <code>departures</code>: lista de salidas con <code>start_date</code>, <code>price_base</code>,{" "}
            <code>taxes</code>, <code>supplement</code>, <code>availability</code>.
          </li>
          <li>
            <code>internal</code>: operador, clave y liga (solo staff).
          </li>
          <li>Si falta “price_from”, se toma de la salida más barata.</li>
          <li>Se importa como oculto (no publicado) salvo que indiques <code>"is_published": true</code>.</li>
        </ul>
        <pre className="max-h-80 overflow-auto rounded-lg bg-background p-3 text-[11px] leading-snug">{IMPORT_EXAMPLE}</pre>
      </aside>
    </div>
  );
};

export default ImportPanel;
