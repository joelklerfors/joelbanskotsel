import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const Ctx = createContext<{ me: string | null; setMe: (n: string | null) => void }>({ me: null, setMe: () => {} });

export function MeProvider({ children }: { children: ReactNode }) {
  const [me, setMeState] = useState<string | null>(null);
  useEffect(() => {
    setMeState(localStorage.getItem("gk-me"));
  }, []);
  const setMe = (n: string | null) => {
    if (n) localStorage.setItem("gk-me", n);
    else localStorage.removeItem("gk-me");
    setMeState(n);
  };
  return <Ctx.Provider value={{ me, setMe }}>{children}</Ctx.Provider>;
}

export const useMe = () => useContext(Ctx);
