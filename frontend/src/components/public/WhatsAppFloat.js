```jsx
import { MessageCircle } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { track, waLink } from "@/lib/api";

export default function WhatsAppFloat() {
  const { data } = useSite();
  const cfg = data.config;
  const wa = cfg.whatsapp;
  if (!wa?.floatingEnabled) return null;

  const side = wa.floatingPosition === "left" ? "left-4" : "right-4";

  const open = () => {
    track("click", "whatsapp");
    window.open(waLink(cfg.links.whatsappNumber, wa.messages.default), "_blank", "noopener");
  };

  return (
    <button
      onClick={open}
      className={`fixed bottom-20 sm:bottom-5 ${side} z-50 pulse-ring group flex items-center gap-0 sm:gap-2.5 rounded-full bg-[var(--c-wa)] p-4 sm:pl-4 sm:pr-5 text-white shadow-[0_8px_30px_rgba(37,211,102,0.35)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1`}
      data-testid="whatsapp-float"
      aria-label={wa.floatingText}
    >
      <MessageCircle size={22} className="shrink-0" />
      <span className="hidden sm:block text-sm font-semibold whitespace-nowrap">{wa.floatingText}</span>
    </button>
  );
}
```