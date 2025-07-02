import { Toaster } from "@/presentation/components/components/ui/toaster";
import { Toaster as Sonner } from "@/presentation/components/components/ui/sonner";
import { TooltipProvider } from "@/presentation/components/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/presentation/pages/pages/Index";
import Dashboard from "@/presentation/pages/pages/Dashboard";
import Labels from "@/presentation/pages/pages/Labels";
import Users from "@/presentation/pages/pages/Users";
import Logs from "@/presentation/pages/pages/Logs";
import NotFound from "@/presentation/pages/pages/NotFound";
import { UnitProvider } from "@/presentation/components/components/UnitContext";
import ProductImport from "./pages/pages/ProductImport";

const App = () => (
  <QueryClientProvider client={new QueryClient()}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UnitProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/labels" element={<Labels />} />
            <Route path="/users" element={<Users />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/product-import" element={<ProductImport />} />
          </Routes>
        </BrowserRouter>
      </UnitProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App; 