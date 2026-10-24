import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Flame, Gem, MessageCircle, Users } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { api } from "@/lib/api";

const pickIcon = (kind) => {
  if (kind === "click_whatsapp") return <MessageCircle size={13} className="text-[#25D366]" />;
  if (kind === "click_vip" || kind === "click_plan") return <Gem size={13} className="text-[var(--c-gold)]" />;
  if (kind === "click_free") return <Flame size={13} className="text-[var(--c-accent)]" />;
  return <Users size={13} className="text-[var(--c-rosa)]" />;
};

const kindFor = (target) => {
  if (target === "free") return "click_free";
  if (target === "whatsapp") return "click_whatsapp";
  if (target === "vip") return "click_vip";
  if ((target || "").startsWith("plan_")) return "click_plan";
  return "visit";
};

export default function LiveNotifications() {
  const { data } = useSite();
  const ncfg = data.config.notifications || {};
  const [pool, setPool] = useState(null);
  const [current, setCurrent] = useState(null);
  const shown = useRef(0);
  const idx = useRef(0);
  const timers = useRef([]);

  useEffect(() => {
    if (!ncfg.enabled) return;
    let cancelled = false;
    const load = () =>
      api
        .get("/activity")
        .then((r) => !cancelled && setPool(r.data))
        .catch(() => {});
    load();
    const id = setInterval(load, 60000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [ncfg.enabled]);

  useEffect(() => {
    if (!ncfg.enabled || !pool) return;

    const buildNext = () => {
      const i = idx.current++;
      const t = ncfg.templates || {};
      if (i % 3 === 0 || !(pool.events || []).length) {
        return {
          kind: "visit",
          text: (t.visit || "{online} pessoa(s) vendo esta página agora").replace("{online}", pool.online || 1),
          time: "agora",
        };
      }
      const ev = pool.events[Math.floor(i / 3) % pool.events.length];
      const kind = kindFor(ev.target);
      return {
        kind,
        text: t[kind] || "Atividade na página",
        time: ev.minutes_ago <= 0 ? "agora mesmo" : `há ${ev.minutes_ago} min`,
      };
    };

    const show = () => {
      if (shown.current >= (ncfg.maxPerSession || 6)) return;
      setCurrent(buildNext());
      shown.current += 1;
      const hide = setTimeout(() => {
        setCurrent(null);
        const min = (ncfg.intervalMin || 20) * 1000;
        const max = (ncfg.intervalMax || 45) * 1000;
        timers.current.push(setTimeout(show, min + Math.random() * (max - min)));
      }, (ncfg.duration || 4) * 1000);
      timers.current.push(hide);
    };

    timers.current.push(setTimeout(show, 8000));
    return () => timers.current.forEach(clearTimeout);
  }, [pool, ncfg]);

  if (!ncfg.enabled) return null;
  const side = ncfg.position === "right" ? "right-4" : "left-4";

  return (
    <div className={`fixed bottom-24 ${side} z-40 pointer-events-none`} data-testid="live-notifications">
      <AnimatePresence>
        {current && (
          <motion.div
            key={`${current.kind}-${idx.current}`}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/70 backdrop-blur-xl px-4 py-3 shadow-2xl max-w-[300px]"
            data-testid="live-notification"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="shrink-0">{pickIcon(current.kind)}</span>
            <div className="min-w-0">
              <p className="text-xs text-white/90 leading-snug">{current.text}</p>
              <p className="text-[10px] text-white/40 mt-0.5 flex items-center gap-1">
                <Activity size={9} /> {current.time}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
