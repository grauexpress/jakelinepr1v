import { Instagram, Send } from "lucide-react";
import { useSite } from "@/context/SiteContext";

export default function Footer() {
  const { data } = useSite();
  const cfg = data.config;

  return (
    <footer className="border-t border-white/5 bg-black/40 px-5 md:px-10 pt-10 pb-24 sm:pb-28 md:pb-10" data-testid="footer">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <span className="font-serif-display italic text-2xl text-[var(--c-gold)]">{cfg.identity.logoText || "JS"}</span>
          <p className="mt-1 text-xs text-white/40">{cfg.identity.name} · {cfg.identity.username}</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={cfg.links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors hover:border-[var(--c-accent)] hover:text-[var(--c-accent)]"
            data-testid="footer-instagram"
            aria-label="Instagram"
          >
            <Instagram size={16} />
          </a>
          <a
            href={cfg.links.telegramFree}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors hover:border-[var(--c-accent)] hover:text-[var(--c-accent)]"
            data-testid="footer-telegram"
            aria-label="Telegram"
          >
            <Send size={16} />
          </a>
        </div>
        <p className="text-[10px] font-mono-accent tracking-[0.15em] uppercase text-white/30 text-center md:text-right">
          18+ · {cfg.identity.ageNotice}
          <br />© {new Date().getFullYear()} {cfg.identity.name}
        </p>
      </div>
    </footer>
  );
}
