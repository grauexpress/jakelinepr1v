import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    api
      .get("/config")
      .then((r) => setData(r.data))
      .catch(() => setFailed(true));
  }, []);

  return <SiteContext.Provider value={{ data, failed }}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);
