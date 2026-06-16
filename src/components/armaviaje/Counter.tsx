import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CounterProps {
  label: string;
  hint?: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
}

const Counter = ({ label, hint, value, min = 0, max = 30, onChange }: CounterProps) => (
  <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
    <div>
      <p className="font-semibold text-foreground">{label}</p>
      {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
    </div>
    <div className="flex items-center gap-4">
      <button
        type="button"
        aria-label={`Quitar ${label}`}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-full border-2 transition-colors",
          value <= min
            ? "border-muted text-muted-foreground/40 cursor-not-allowed"
            : "border-primary text-primary hover:bg-primary/10",
        )}
      >
        <Minus className="h-5 w-5" />
      </button>
      <span className="w-8 text-center text-2xl font-bold tabular-nums text-foreground">{value}</span>
      <button
        type="button"
        aria-label={`Agregar ${label}`}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-full border-2 transition-colors",
          value >= max
            ? "border-muted text-muted-foreground/40 cursor-not-allowed"
            : "border-primary text-primary hover:bg-primary/10",
        )}
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  </div>
);

export default Counter;
