import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  hint?: string;
};

/** Editor de arreglos de texto: agregar / editar / quitar líneas. */
const ListEditor = ({ label, items, onChange, placeholder, hint }: Props) => {
  const [draft, setDraft] = useState("");
  const add = () => {
    const values = draft
      .split("\n")
      .map((v) => v.trim())
      .filter(Boolean);
    if (!values.length) return;
    onChange([...items, ...values]);
    setDraft("");
  };

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">{label}</legend>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={item}
            aria-label={`${label} ${i + 1}`}
            onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Quitar ${item || "línea"}`}
            onClick={() => onChange(items.filter((_, j) => j !== i))}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <div className="flex gap-2">
        <Label className="sr-only" htmlFor={`add-${label}`}>
          Agregar a {label}
        </Label>
        <Input
          id={`add-${label}`}
          value={draft}
          placeholder={placeholder ?? "Escribe y presiona Enter"}
          onChange={(e) => setDraft(e.target.value)}
          onPaste={(e) => {
            const text = e.clipboardData.getData("text");
            if (text.includes("\n")) {
              e.preventDefault();
              const values = text
                .split("\n")
                .map((v) => v.replace(/^[-•*·\s]+/, "").trim())
                .filter(Boolean);
              onChange([...items, ...values]);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button type="button" variant="outline" size="icon" onClick={add} aria-label={`Agregar a ${label}`}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </fieldset>
  );
};

export default ListEditor;
