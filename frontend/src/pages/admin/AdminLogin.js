import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatApiError } from "@/lib/api";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(email, password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(formatApiError(err, "E-mail ou senha incorretos"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-night px-5" data-testid="admin-login-page">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(92,22,46,0.4),transparent_60%)]" />
      <div className="grain-overlay" aria-hidden />
      <form
        onSubmit={submit}
        className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-winecard/80 p-8 backdrop-blur-xl"
        data-testid="admin-login-form"
      >
        <div className="mb-8 text-center">
          <span className="font-serif-display italic text-4xl text-gold">JS</span>
          <h1 className="mt-3 font-serif-display text-xl text-white">Painel Administrativo</h1>
          <p className="mt-1 text-xs text-white/40">Acesso restrito</p>
        </div>

        <label className="mb-4 block">
          <span className="mb-1.5 block text-[11px] font-mono-accent tracking-[0.18em] uppercase text-white/45">E-mail</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-3 text-sm text-white outline-none transition-colors focus:border-neon/60"
            placeholder="seu@email.com"
            data-testid="login-email"
          />
        </label>
        <label className="mb-5 block">
          <span className="mb-1.5 block text-[11px] font-mono-accent tracking-[0.18em] uppercase text-white/45">Senha</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-3 text-sm text-white outline-none transition-colors focus:border-neon/60"
            placeholder="••••••••"
            data-testid="login-password"
          />
        </label>

        {error && (
          <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-300" data-testid="login-error">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-neon py-3.5 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
          data-testid="login-submit"
        >
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Lock size={15} />}
          Entrar
        </button>

        <a href="/" className="mt-5 block text-center text-[11px] text-white/30 transition-colors hover:text-white/60" data-testid="login-back">
          ← Voltar para o site
        </a>
      </form>
    </div>
  );
}
