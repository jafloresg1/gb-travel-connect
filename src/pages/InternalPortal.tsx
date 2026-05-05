import { ArrowLeft, Calculator, Wallet, ListChecks, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { INTERNAL_APP_URLS } from "@/lib/internalApps";
import logo from "@/assets/logo_gbtravel.png";

const apps = [
  {
    icon: Calculator,
    title: "Cotizador GB Travel",
    description: "Crea, guarda y administra cotizaciones profesionales para clientes.",
    cta: "Entrar al Cotizador",
    url: INTERNAL_APP_URLS.cotizador,
  },
  {
    icon: Wallet,
    title: "Gestor Financiero",
    description:
      "Control de ingresos, egresos, comprobantes, pagos, saldos y movimientos de la agencia.",
    cta: "Entrar al Gestor Financiero",
    url: INTERNAL_APP_URLS.gestorFinanciero,
  },
  {
    icon: ListChecks,
    title: "Tareas Diarias",
    description:
      "Organización de pendientes, actividades operativas y seguimiento diario del equipo.",
    cta: "Entrar a Tareas",
    url: INTERNAL_APP_URLS.tareasDiarias,
  },
  {
    icon: Users,
    title: "Gestor de Leads",
    description:
      "Seguimiento de prospectos, WhatsApp, redes sociales y oportunidades comerciales.",
    cta: "Próximamente",
    url: INTERNAL_APP_URLS.gestorLeads,
    soon: true,
  },
];

const InternalPortal = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background flex flex-col">
      <header className="border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <a href="/" className="flex items-center gap-2">
            <img src={logo} alt="GB Travel" className="h-10 w-auto" />
          </a>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <a href="/">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Volver a GB Travel</span>
              <span className="sm:hidden">Volver</span>
            </a>
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-10 md:py-16">
        <div className="max-w-2xl mx-auto text-center mb-10 md:mb-14">
          <h1 className="text-3xl md:text-5xl font-semibold text-foreground mb-3">
            Portal Interno GB Travel
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Acceso a herramientas operativas de la agencia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-5xl mx-auto">
          {apps.map(({ icon: Icon, title, description, cta, url, soon }) => (
            <Card
              key={title}
              className={`flex flex-col transition-all hover:shadow-lg ${
                soon ? "opacity-75" : "hover:-translate-y-0.5"
              }`}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div
                    className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                      soon ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl md:text-2xl">{title}</CardTitle>
                </div>
                <CardDescription className="pt-2 text-sm md:text-base">
                  {description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                {soon ? (
                  <Button disabled className="w-full" variant="secondary">
                    {cta}
                  </Button>
                ) : (
                  <Button asChild className="w-full">
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {cta}
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <footer className="border-t border-border py-5">
        <p className="text-center text-xs text-muted-foreground px-4">
          Portal interno exclusivo para operación de GB Travel
        </p>
      </footer>
    </div>
  );
};

export default InternalPortal;
