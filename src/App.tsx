
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DataTool from "./pages/DataTool";
import Search from "./pages/Search";
import Documents from "./pages/Documents";
import Chat from "./pages/Chat";
import OfficerDetails from "./pages/OfficerDetails";
import ComplaintDetails from "./pages/ComplaintDetails";
import NotFound from "./pages/NotFound";
import Lawsuits from "./pages/Lawsuits";
import Ranking from "./pages/Ranking";
import Resources from "./pages/Resources";
import IntercomChat from "./components/intercom/IntercomChat";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/data" element={<DataTool />} />
          <Route path="/search" element={<Search />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/officers/:id" element={<OfficerDetails />} />
          <Route path="/complaints/:id" element={<ComplaintDetails />} />
          <Route path="/lawsuits" element={<Lawsuits />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
      <Sonner />
      <IntercomChat />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
