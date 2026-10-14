import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import InternalPortal from "./pages/InternalPortal.tsx";
import ArmaTuViaje from "./pages/ArmaTuViaje.tsx";
import Viajes from "./pages/Viajes.tsx";
import ViajeDetalle from "./pages/ViajeDetalle.tsx";
import Promociones from "./pages/Promociones.tsx";
import CatalogAdmin from "./pages/CatalogAdmin.tsx";
import NotFound from "./pages/NotFound.tsx";
import Privacidad from "./pages/Privacidad.tsx";
import MetaPixelTracker from "./components/MetaPixelTracker";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MetaPixelTracker />
        <Routes>
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/" element={<Index />} />
          <Route path="/app" element={<InternalPortal />} />
          <Route path="/app/catalogo" element={<CatalogAdmin />} />
          <Route path="/arma-tu-viaje" element={<ArmaTuViaje />} />
          <Route path="/viajes" element={<Viajes />} />
          <Route path="/viajes/:slug" element={<ViajeDetalle />} />
          <Route path="/promociones" element={<Promociones />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
