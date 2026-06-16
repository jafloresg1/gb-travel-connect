import { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface StepShellProps {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  hideNext?: boolean;
}

const StepShell = ({
  step,
  total,
  title,
  subtitle,
  children,
  onBack,
  onNext,
  nextLabel = "Continuar",
  nextDisabled,
  hideNext,
}: StepShellProps) => {
  const pct = Math.round((step / total) * 100);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto max-w-2xl px-4 py-3">
          <div className="flex items-center gap-3 mb-2">
            {onBack ? (
              <button
                onClick={onBack}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Regresar"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            ) : (
              <span className="w-5" />
            )}
            <Progress value={pct} className="h-2 flex-1" />
            <span className="text-xs font-medium text-muted-foreground tabular-nums">
              {step}/{total}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto max-w-2xl px-4 py-6 animate-fade-in">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">{title}</h2>
        {subtitle && <p className="text-muted-foreground mb-6">{subtitle}</p>}
        <div className={subtitle ? "" : "mt-6"}>{children}</div>
      </div>

      {!hideNext && (
        <div className="sticky bottom-0 z-10 bg-background/95 backdrop-blur-md border-t border-border">
          <div className="container mx-auto max-w-2xl px-4 py-3">
            <Button
              size="lg"
              className="w-full gap-2 text-base"
              onClick={onNext}
              disabled={nextDisabled}
            >
              {nextLabel}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepShell;
