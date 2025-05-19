
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as React from "react";
import { ThemeProvider } from "@/context/theme/ThemeContext";
import Index from "./pages/Index";
import BoardView from "./pages/BoardView";
import NotFound from "./pages/NotFound";

// Create QueryClient instance outside the component
const queryClient = new QueryClient();

// Separate App component from the StrictMode wrapper
const AppContent = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/board/:boardId" element={<BoardView />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

// Wrap the app with StrictMode at the top level
const App = () => (
  <React.StrictMode>
    <AppContent />
  </React.StrictMode>
);

export default App;
