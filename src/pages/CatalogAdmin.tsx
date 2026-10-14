import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BadgePercent, LogOut, Map, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StaffGate from "@/components/catalog/admin/StaffGate";
import ProgramsAdmin from "@/components/catalog/admin/ProgramsAdmin";
import ProgramForm from "@/components/catalog/admin/ProgramForm";
import PromotionsAdmin from "@/components/catalog/admin/PromotionsAdmin";
import ImportPanel from "@/components/catalog/admin/ImportPanel";
import { usePageMeta } from "@/hooks/use-page-meta";
import { emptyProgramDraft, type ProgramDraft } from "@/lib/catalog";
import logo from "@/assets/logo_gbtravel.png";

type Editor = { draft: ProgramDraft; heading: string; key: number };

const CatalogAdmin = () => {
  const [tab, setTab] = useState("programas");
  const [editor, setEditor] = useState<Editor | null>(null);

  usePageMeta({ title: "Catálogo · Portal interno GB Travel" });

  const openEditor = (draft: ProgramDraft, heading: string) => {
    setEditor({ draft, heading, key: Date.now() });
    setTab("programas");
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background flex flex-col">
      <header className="border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <a href="/" className="flex items-center gap-2">
            <img src={logo} alt="GB Travel" className="h-10 w-auto" />
          </a>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link to="/app">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Portal interno</span>
              <span className="sm:hidden">Portal</span>
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 md:py-10">
        <StaffGate>
          {(session, signOut) => (
            <>
              <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-semibold">Catálogo de viajes</h1>
                  <p className="text-sm text-muted-foreground">
                    Programas, salidas y promociones de gbtravel.mx/viajes
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="hidden sm:inline">{session.user.email}</span>
                  <Button variant="ghost" size="sm" onClick={signOut} className="gap-1">
                    <LogOut className="h-4 w-4" /> Salir
                  </Button>
                </div>
              </div>

              <Tabs value={tab} onValueChange={setTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="programas" className="gap-1.5">
                    <Map className="h-4 w-4" /> Programas
                  </TabsTrigger>
                  <TabsTrigger value="promociones" className="gap-1.5">
                    <BadgePercent className="h-4 w-4" /> Promociones
                  </TabsTrigger>
                  <TabsTrigger value="importar" className="gap-1.5">
                    <Wand2 className="h-4 w-4" /> <span className="hidden sm:inline">Importar rápido</span>
                    <span className="sm:hidden">Importar</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="programas">
                  {editor ? (
                    <ProgramForm
                      key={editor.key}
                      initial={editor.draft}
                      heading={editor.heading}
                      onDone={() => setEditor(null)}
                    />
                  ) : (
                    <ProgramsAdmin
                      onOpenEditor={openEditor}
                      onNew={() => openEditor(emptyProgramDraft(), "Nuevo programa")}
                    />
                  )}
                </TabsContent>
                <TabsContent value="promociones">
                  <PromotionsAdmin />
                </TabsContent>
                <TabsContent value="importar">
                  <ImportPanel onImport={(draft) => openEditor(draft, "Nuevo programa (importado)")} />
                </TabsContent>
              </Tabs>
            </>
          )}
        </StaffGate>
      </main>

      <footer className="border-t border-border py-5">
        <p className="text-center text-xs text-muted-foreground px-4">
          Portal interno exclusivo para operación de GB Travel
        </p>
      </footer>
    </div>
  );
};

export default CatalogAdmin;
