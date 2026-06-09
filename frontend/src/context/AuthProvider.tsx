import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./authContext";
import type { User } from "./useAuth";
import api from "../api/axios";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      const id = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      if (!id || !token) {
        if (!cancelled) setLoading(false);
        return;
      }
      try {
        const { data } = await api.get<User>(`/user/${id}`);
        if (!cancelled) setUser(data);
      } catch {
        if (!cancelled) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    init();
    return () => { cancelled = true; };
  }, []);

  const login = (token: string, userId: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    api.get<User>(`/user/${userId}`)
      .then(({ data }) => setUser(data))
      .catch(() => { localStorage.removeItem("token"); localStorage.removeItem("userId"); setUser(null); });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
