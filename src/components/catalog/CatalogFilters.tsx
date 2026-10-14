import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BUDGET_OPTIONS, DURATION_OPTIONS, monthLabel, type CatalogFilters as Filters } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const ALL = "__all";

type Props = {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  onClear: () => void;
  regions: string[];
  countries: string[];
  months: string[];
  activeCount: number;
};

type SelectFilterProps = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
};

const SelectFilter = ({ id, label, value, placeholder, options, onChange }: SelectFilterProps) => (
  <div className="flex flex-col gap-1.5">
    <Label htmlFor={id} className="text-xs font-semibold text-muted-foreground">
      {label}
    </Label>
    <Select value={value || ALL} onValueChange={(v) => onChange(v === ALL ? "" : v)}>
      <SelectTrigger id={id} className="bg-background">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>{placeholder}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const CatalogFilters = ({ filters, onChange, onClear, regions, countries, months, activeCount }: Props) => {
  const [showMobile, setShowMobile] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-card p-4 md:p-5 shadow-sm">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={filters.q}
            onChange={(e) => onChange({ q: e.target.value })}
            placeholder="Buscar destino, país o ciudad…"
            className="pl-9 bg-background"
            aria-label="Buscar viajes"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          className="md:hidden gap-2 shrink-0"
          onClick={() => setShowMobile((s) => !s)}
          aria-expanded={showMobile}
          aria-controls="catalog-filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtros{activeCount ? ` (${activeCount})` : ""}
        </Button>
      </div>

      <div
        id="catalog-filters"
        className={cn("mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3", !showMobile && "hidden md:grid")}
      >
        <SelectFilter
          id="f-region"
          label="Región"
          value={filters.region}
          placeholder="Todas las regiones"
          options={regions.map((r) => ({ value: r, label: r }))}
          onChange={(region) => onChange({ region })}
        />
        <SelectFilter
          id="f-pais"
          label="País"
          value={filters.pais}
          placeholder="Todos los países"
          options={countries.map((c) => ({ value: c, label: c }))}
          onChange={(pais) => onChange({ pais })}
        />
        <SelectFilter
          id="f-duracion"
          label="Duración"
          value={filters.duracion}
          placeholder="Cualquier duración"
          options={DURATION_OPTIONS}
          onChange={(duracion) => onChange({ duracion })}
        />
        <SelectFilter
          id="f-mes"
          label="Mes de salida"
          value={filters.mes}
          placeholder="Cualquier mes"
          options={months.map((m) => ({ value: m, label: monthLabel(m) }))}
          onChange={(mes) => onChange({ mes })}
        />
        <SelectFilter
          id="f-presupuesto"
          label="Presupuesto (con impuestos)"
          value={filters.presupuesto}
          placeholder="Cualquier presupuesto"
          options={BUDGET_OPTIONS}
          onChange={(presupuesto) => onChange({ presupuesto })}
        />
      </div>

      <div
        className={cn(
          "mt-4 flex flex-wrap items-center justify-between gap-3",
          !showMobile && "hidden md:flex",
        )}
      >
        <div className="flex items-center gap-2">
          <Switch id="f-promo" checked={filters.promo} onCheckedChange={(promo) => onChange({ promo })} />
          <Label htmlFor="f-promo" className="cursor-pointer">
            Solo promociones
          </Label>
        </div>
        {activeCount > 0 && (
          <Button type="button" variant="ghost" size="sm" onClick={onClear} className="gap-1">
            <X className="h-4 w-4" /> Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  );
};

export default CatalogFilters;
