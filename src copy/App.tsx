import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import Dashboard from "./pages/Dashboard";
import Trends from "./pages/Trends";
import Alerts from "./pages/Alerts";
import Chat from "./pages/Chat";
import Sources from "./pages/Sources";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import PrivateRoute from "./components/PrivateRoute";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/trends"
              element={
                <PrivateRoute>
                  <Trends />
                </PrivateRoute>
              }
            />
            <Route
              path="/alerts"
              element={
                <PrivateRoute>
                  <Alerts />
                </PrivateRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              }
            />
            <Route
              path="/sources"
              element={
                <PrivateRoute>
                  <Sources />
                </PrivateRoute>
              }
            />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
