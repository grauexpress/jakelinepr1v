import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Flame,
  Gem,
  MessageCircle,
  Users,
} from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { api } from "@/lib/api";

const pickIcon = (kind) => {
  if (kind === "click_whatsapp") {
    return <MessageCircle size={13} className="text-[#25D366]" />;
  }

  if (kind === "click_vip" || kind === "click_plan") {
    return <Gem size={13} className="text-[var(--c-gold)]" />;
  }

  if (kind === "click_free") {
    return <Flame size={13} className="text-[var(--c-accent)]" />;
  }

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

  const ncfg = useMemo(
    () => data?.config?.notifications || {},
    [data?.config?.notifications]
  );

  const [pool, setPool] = useState(null);
  const [current, setCurrent] = useState(null);

  const shown = useRef(0);
  const idx = useRef(0);
  const timers = useRef([]);

  useEffect(() => {
    if (!ncfg.enabled) return;

    let cancelled = false;

    const load = () => {
      api
        .get("/activity")
        .then((r) => {
          if (!cancelled) {
            setPool(r.data);
          }
        })
        .catch(() => {});
    };

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
          text: (t.visit || "{online} pessoa(s) vendo esta página agora").replace(
            "{online}",
            pool.online || 1
          ),
          time: "agora",
        };
      }

      const ev =
        pool.events[Math.floor(i / 3) % pool.events.length];

      const kind = kindFor(ev.target);

      return {
        kind,
        text: t[kind] || "Atividade na página",
        time: ev.minutes_ago <= 0 ? "agora mesmo" : "h� " + ev.minutes_ago + " min",
      };
    };

    const show = () => {
      if (shown.current >= (ncfg.maxPerSession || 6)) {
        return;
      }

      setCurrent(buildNext());
      shown.current += 1;

      const hide = setTimeout(() => {
        setCurrent(null);

        const min = (ncfg.intervalMin || 20) * 1000;
        const max = (ncfg.intervalMax || 45) * 1000;

        const nextTimer = setTimeout(
          show,
          min + Math.random() * (max - min)
        );

        timers.current.push(nextTimer);
      }, (ncfg.duration || 4) * 1000);

      timers.current.push(hide);
    };

    const initialTimer = setTimeout(show, 8000);

    timers.current.push(initialTimer);

    return () => {
      const activeTimers = timers.current;

      timers.current = [];

      activeTimers.forEach(clearTimeout);
    };
  }, [pool, ncfg]);

  if (!ncfg.enabled || !current) {
    return null;
  }

  const side = ncfg.position === "right" ? "right-4" : "left-4";

  return (
    <div
      className={"fixed " + side + " top-20 sm:top-6 z-50 pointer-events-none"}
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="flex max-w-sm items-center gap-3 rounded-xl border border-white/10 bg-black/80 px-4 py-3 shadow-xl backdrop-blur-md"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5">
            {pickIcon(current.kind)}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-medium text-white">
              <Activity size={12} />
              <span>{current.text}</span>
            </div>

            <div className="mt-1 text-[10px] text-white/50">
              {current.time}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
