
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { SiteProvider } from "@/context/SiteContext";
import Landing from "@/pages/Landing";
import Atendimento from "@/pages/Atendimento";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminPanel from "@/pages/admin/AdminPanel";

const Splash = () => (
  <div className="min-h-screen bg-night flex items-center justify-center" data-testid="loading-splash">
    <span className="font-serif italic text-4xl text-gold animate-pulse">JS</span>
  </div>
);

function RequireAuth({ children }) {
  const { user } = useAuth();
  if (user === undefined) return <Splash />;
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
}

function LandingPage() {
  return (
    <SiteProvider>
      <Landing />
    </SiteProvider>
  );
}

function AtendimentoPage() {
  return (
    <SiteProvider>
      <Atendimento />
    </SiteProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Página principal original */}
          <Route path="/" element={<LandingPage />} />

          {/* Nova página de atendimento */}
          <Route path="/atendimento" element={<AtendimentoPage />} />

          {/* Login do ADM original */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Painel ADM original */}
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <AdminPanel />
              </RequireAuth>
            }
          />

          {/* Rotas desconhecidas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>

      <Toaster theme="dark" position="top-center" richColors />
    </AuthProvider>
  );
}

export default App;
