import { useState, useEffect } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Loader triggers ONCE when app launches
    const timeout = setTimeout(() => setShowLoader(false), 2000);
    return () => clearTimeout(timeout);
  }, []);

  if (showLoader) {
    return <LoadingScreen onComplete={() => setShowLoader(false)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
