import axios from "axios";

export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
  withCredentials: true,
});

export const imgUrl = (u) => {
  if (!u) return "";
  if (u.startsWith("/api")) return `${process.env.REACT_APP_BACKEND_URL}${u}`;
  return u;
};

export const waLink = (number, message) =>
  `https://wa.me/${(number || "").replace(/\D/g, "")}?text=${encodeURIComponent(message || "")}`;

export const track = (event_type, target = null) => {
  try {
    const referrer = document.referrer || "";
    const payload = JSON.stringify({ event_type, target, referrer });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(`${API}/track`, new Blob([payload], { type: "application/json" }));
      return;
    }
    api.post("/track", { event_type, target, referrer }).catch(() => {});
  } catch (e) {
    /* noop */
  }
};

export function formatApiError(err, fallback = "Algo deu errado. Tente novamente.") {
  const detail = err?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).join(" ");
  return fallback;
}
