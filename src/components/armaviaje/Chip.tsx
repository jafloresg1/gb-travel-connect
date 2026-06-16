import { cn } from "@/lib/utils";

interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const Chip = ({ label, selected, onClick }: ChipProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "rounded-full border-2 px-4 py-2 text-sm font-medium transition-all duration-150",
      selected
        ? "bg-primary border-primary text-primary-foreground shadow-sm"
        : "bg-card border-border text-foreground hover:border-primary/50",
    )}
  >
    {label}
  </button>
);

export default Chip;
