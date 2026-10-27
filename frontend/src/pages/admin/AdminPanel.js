
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  BarChart3,
  Bell,
  CreditCard,
  ExternalLink,
  Eye,
  FileText,
  Fingerprint,
  HelpCircle,
  Image as ImageIcon,
  LayoutList,
  Loader2,
  LogOut,
  Menu,
  MessageCircle,
  MessageSquareQuote,
  Palette,
  Sparkles,
  Star,
  Tag,
  X,
} from "lucide-react";

import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

import AnalyticsTab from "./tabs/AnalyticsTab";
import IdentityTab from "./tabs/IdentityTab";
import AppearanceTab from "./tabs/AppearanceTab";
import HeroTab from "./tabs/HeroTab";
import SocialTab from "./tabs/SocialTab";
import PlansTab from "./tabs/PlansTab";
import PromoTab from "./tabs/PromoTab";
import ContentTab from "./tabs/ContentTab";
import SectionsTab from "./tabs/SectionsTab";
import NotificationsTab from "./tabs/NotificationsTab";
import ChatTab from "./tabs/ChatTab";

import {
  FaqTab,
  PreviewsTab,
  PrintsTab,
  TestimonialsTab,
} from "./tabs/ListTabs";

const TABS = [
  {
    id: "analytics",
    label: "Visão Geral",
    icon: BarChart3,
    comp: AnalyticsTab,
  },
  {
    id: "identity",
    label: "Identidade & Links",
    icon: Fingerprint,
    comp: IdentityTab,
  },
  {
    id: "chat",
    label: "Chat / Atendimento",
    icon: MessageCircle,
    comp: ChatTab,
  },
  {
    id: "appearance",
    label: "Aparência",
    icon: Palette,
    comp: AppearanceTab,
  },
  {
    id: "hero",
    label: "Hero",
    icon: Sparkles,
    comp: HeroTab,
  },
  {
    id: "social",
    label: "Prova Social",
    icon: Star,
    comp: SocialTab,
  },
  {
    id: "testimonials",
    label: "Depoimentos",
    icon: MessageSquareQuote,
    comp: TestimonialsTab,
  },
  {
    id: "prints",
    label: "Prints",
    icon: ImageIcon,
    comp: PrintsTab,
  },
  {
    id: "previews",
    label: "Prévias",
    icon: Eye,
    comp: PreviewsTab,
  },
  {
    id: "plans",
    label: "Planos",
    icon: CreditCard,
    comp: PlansTab,
  },
  {
    id: "promo",
    label: "Promoção",
    icon: Tag,
    comp: PromoTab,
  },
  {
    id: "content",
    label: "Conteúdo",
    icon: FileText,
    comp: ContentTab,
  },
  {
    id: "faq",
    label: "FAQ",
    icon: HelpCircle,
    comp: FaqTab,
  },
  {
    id: "sections",
    label: "Seções",
    icon: LayoutList,
    comp: SectionsTab,
  },
  {
    id: "notifications",
    label: "Notificações",
    icon: Bell,
    comp: NotificationsTab,
  },
];

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState("analytics");
  const [menuOpen, setMenuOpen] = useState(false);
  const [payload, setPayload] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    api
      .get("/admin/config")
      .then((r) => {
        if (mounted) {
          setPayload(r.data);
        }
      })
      .catch(() => {
        if (mounted) {
          toast.error("Erro ao carregar configurações");
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const saveConfig = async (newConfig) => {
    setSaving(true);

    try {
      await api.put("/admin/config", newConfig);

      setPayload((prev) => ({
        ...prev,
        config: newConfig,
      }));

      toast.success("Configurações salvas");
    } catch {
      toast.error("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const doLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  const active = TABS.find((t) => t.id === tab) || TABS[0];
  const Active = active.comp;
  const cfg = payload?.config;

  const nav = (
    <nav className="space-y-1" data-testid="admin-nav">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => {
            setTab(t.id);
            setMenuOpen(false);
          }}
          className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors ${
            tab === t.id
              ? "bg-neon/15 text-neon"
              : "text-white/55 hover:bg-white/5 hover:text-white"
          }`}
          data-testid={`admin-tab-${t.id}`}
        >
          <t.icon size={15} />
          {t.label}
        </button>
      ))}
    </nav>
  );

  return (
    <div
      className="min-h-screen bg-night text-white"
      data-testid="admin-panel"
    >
      <div className="grain-overlay" aria-hidden="true" />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-night/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3.5 md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="p-2 text-white/70 lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu"
              data-testid="admin-menu-open"
            >
              <Menu size={18} />
            </button>

            <span className="font-serif-display text-xl italic text-gold">
              JS
            </span>

            <span className="text-sm text-white/60">
              Painel · {active.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-xs text-white/70 transition-colors hover:border-white/35"
              data-testid="admin-view-site"
            >
              <ExternalLink size={12} />
              Ver site
            </a>

            <button
              type="button"
              onClick={doLogout}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-xs text-white/70 transition-colors hover:border-red-400/50 hover:text-red-300"
              data-testid="admin-logout"
            >
              <LogOut size={12} />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="sticky top-[57px] hidden h-[calc(100vh-57px)] w-60 shrink-0 overflow-y-auto border-r border-white/10 p-4 lg:block">
          {nav}
        </aside>

        {menuOpen && (
          <div
            className="fixed inset-0 z-50 lg:hidden"
            data-testid="admin-mobile-menu"
          >
            <div
              className="absolute inset-0 bg-black/70"
              onClick={() => setMenuOpen(false)}
            />

            <div className="absolute left-0 top-0 h-full w-64 border-r border-white/10 bg-night p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-serif-display text-lg italic text-gold">
                  Menu
                </span>

                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="p-2 text-white/60"
                  aria-label="Fechar menu"
                  data-testid="admin-menu-close"
                >
                  <X size={16} />
                </button>
              </div>

              {nav}
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 px-4 py-8 md:px-8">
          <div className="mx-auto max-w-4xl">
            {!cfg ? (
              <div className="flex justify-center py-24">
                <Loader2 className="animate-spin text-white/40" />
              </div>
            ) : (
              <Active
                cfg={cfg}
                save={saveConfig}
                saving={saving}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
