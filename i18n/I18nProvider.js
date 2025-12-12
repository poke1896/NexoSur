"use client";

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const translations = {
  es: {
    brandTagline: 'Apoyando el talento local',
    homeTitle: 'Artesanos y microempresas',
    homeSubtitle: 'Descubre el talento local de la Zona Sur de Costa Rica.',
    discoverVentures: 'Descubre nuestros emprendimientos',
    handicraft: 'Artesanía',
    viewCatalog: 'Ver catálogo →',
    back: '← Volver',
    catalog: 'Catálogo',
    dashboard: 'Panel',
    monitorVenture: 'Monitorear este emprendimiento',
    manageProducts: 'Administrar productos',
    langShort: 'ES',
    langFull: 'Español',
    login: 'Iniciar sesión',
    logout: 'Cerrar sesión',
    username: 'Nombre o correo',
    password: 'Contraseña',
    signIn: 'Entrar',
    redirecting: 'Redirigiendo…',
    mustLogin: 'Debes iniciar sesión para ver este producto.',
    contactWhatsApp: 'Contactar por WhatsApp',
    backToArtisan: 'Volver al artesano',
  },
  en: {
    brandTagline: 'Supporting local talent',
    homeTitle: 'Artisans and microbusinesses',
    homeSubtitle: 'Discover local talent from Costa Rica's Southern Zone.',
    discoverVentures: 'Discover our ventures',
    handicraft: 'Handicraft',
    viewCatalog: 'View catalog →',
    back: '← Back',
    catalog: 'Catalog',
    dashboard: 'Dashboard',
    monitorVenture: 'Monitor this venture',
    manageProducts: 'Manage products',
    langShort: 'EN',
    langFull: 'English',
    login: 'Sign in',
    logout: 'Sign out',
    username: 'Name or email',
    password: 'Password',
    signIn: 'Enter',
    redirecting: 'Redirecting…',
    mustLogin: 'You must sign in to view this product.',
    contactWhatsApp: 'Contact via WhatsApp',
    backToArtisan: 'Back to artisan',
  },
};

const I18nContext = createContext({
  lang: 'es',
  t: (key) => key,
  toggleLang: () => {},
  setLang: () => {},
  formatPrice: (value) => String(value),
});

export function I18nProvider({ children }) {
  const [lang, setLang] = useState('es');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('nexosur_lang') : null;
    if (stored === 'es' || stored === 'en') setLang(stored);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('nexosur_lang', lang);
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const value = useMemo(() => {
    const dict = translations[lang] || translations.es;
    const t = (key) => dict[key] ?? key;
    const toggleLang = () => setLang((prev) => (prev === 'es' ? 'en' : 'es'));
    const lx = (obj, baseKey) => {
      if (!obj || !baseKey) return '';
      const keyLang = `${baseKey}_${lang}`;
      return obj[keyLang] ?? obj[baseKey] ?? '';
    };
    const formatPrice = (amount) => {
      try {
        return new Intl.NumberFormat(lang === 'es' ? 'es-CR' : 'en-US', {
          style: 'currency',
          currency: 'CRC',
          currencyDisplay: 'symbol',
          maximumFractionDigits: 0,
        }).format(amount);
      } catch {
        // fallback: symbol + thousand separators
        const formatted = amount.toLocaleString(lang === 'es' ? 'es-CR' : 'en-US');
        return `₡${formatted}`;
      }
    };
    return { lang, setLang, t, toggleLang, formatPrice, lx };
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
