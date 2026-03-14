import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AIChatWidget } from "@/components/AIChatWidget";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import HotelsPage from "./pages/Hotels.tsx";
import HotelDetail from "./pages/HotelDetail.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Wishlist from "./pages/Wishlist.tsx";
import FlightsPage from "./pages/Flights.tsx";
import PackagesPage from "./pages/Packages.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/hotels" element={<HotelsPage />} />
          <Route path="/hotel/:id" element={<HotelDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/flights" element={<FlightsPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AIChatWidget />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
