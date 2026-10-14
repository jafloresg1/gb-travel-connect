import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const Field = ({
  id,
  label,
  hint,
  children,
  className,
}: {
  id: string;
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) => (
  <div className={cn("space-y-1.5", className)}>
    <Label htmlFor={id}>{label}</Label>
    {children}
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
);

export const parseNum = (v: string): number | null => {
  if (v.trim() === "") return null;
  const n = Number(v.replace(/[$,\s]/g, ""));
  return Number.isFinite(n) ? n : null;
};

export const NumberInput = ({
  value,
  onChange,
  ...rest
}: {
  value: number | null;
  onChange: (v: number | null) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) => (
  <Input
    type="number"
    inputMode="decimal"
    step="any"
    value={value ?? ""}
    onChange={(e) => onChange(parseNum(e.target.value))}
    {...rest}
  />
);
