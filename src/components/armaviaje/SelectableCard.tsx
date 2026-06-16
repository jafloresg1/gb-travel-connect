import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectableCardProps {
  label: string;
  descripcion?: string;
  imagen?: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

const SelectableCard = ({ label, descripcion, imagen, selected, onClick, icon }: SelectableCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "relative w-full text-left rounded-xl border-2 overflow-hidden transition-all duration-200 group",
      selected
        ? "border-primary ring-2 ring-primary/30 shadow-md"
        : "border-border hover:border-primary/50 hover:shadow-sm",
    )}
  >
    {imagen && (
      <div className="relative h-28 sm:h-32 w-full overflow-hidden">
        <img
          src={imagen}
          alt={label}
          loading="lazy"
          width={1024}
          height={1024}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <span className="absolute bottom-2 left-3 right-3 text-primary-foreground font-semibold text-base drop-shadow">
          {label}
        </span>
      </div>
    )}

    <div className={cn("flex items-start gap-3 p-3", imagen && "pt-2")}>
      {icon && !imagen && (
        <span
          className={cn(
            "shrink-0 flex h-10 w-10 items-center justify-center rounded-lg",
            selected ? "bg-primary text-primary-foreground" : "bg-secondary text-primary",
          )}
        >
          {icon}
        </span>
      )}
      <div className="flex-1 min-w-0">
        {!imagen && <p className="font-semibold text-foreground leading-tight">{label}</p>}
        {descripcion && (
          <p className="text-sm text-muted-foreground mt-0.5 leading-snug">{descripcion}</p>
        )}
      </div>
      <span
        className={cn(
          "shrink-0 flex h-5 w-5 items-center justify-center rounded-full border-2 mt-0.5 transition-colors",
          selected ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/40",
        )}
      >
        {selected && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
    </div>
  </button>
);

export default SelectableCard;
