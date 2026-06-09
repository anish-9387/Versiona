import { useState, useEffect } from "react";
import { AuthContext } from "./authContext";
import api from "../api/axios";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      const id = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      if (!id || !token) {
        if (!cancelled) { setUser(null); setLoading(false); }
        return;
      }
      try {
        const { data } = await api.get(`/user/${id}`);
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

  const login = (token, userId) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    api.get(`/user/${userId}`)
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
