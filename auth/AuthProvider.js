"use client";

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: async (_credentials) => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem('nexosur_user') : null;
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.name) setUser(parsed);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (user) window.localStorage.setItem('nexosur_user', JSON.stringify(user));
    else window.localStorage.removeItem('nexosur_user');
  }, [user]);

  const value = useMemo(() => {
    const login = async ({ name, email, artisanSlug, role = artisanSlug ? 'artisan' : 'user' }) => {
      const display = name || email || 'Usuario';
      const u = { name: display, email: email || '', role, artisanSlug: artisanSlug || null };
      setUser(u);
      // set simple cookie for server-side guards
      if (typeof document !== 'undefined') {
        const days = 7;
        const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `nexosur_auth=1; Expires=${expires}; Path=/`;
        try {
          const b64 = btoa(JSON.stringify(u));
          document.cookie = `nexosur_user=${b64}; Expires=${expires}; Path=/`;
        } catch {}
      }
    };
    const logout = () => {
      setUser(null);
      if (typeof document !== 'undefined') {
        document.cookie = `nexosur_auth=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/`;
        document.cookie = `nexosur_user=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/`;
      }
    };
    return { user, isAuthenticated: !!user, login, logout };
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
