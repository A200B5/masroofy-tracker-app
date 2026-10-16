import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, getTranslation } from '../i18n/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  // English default on fresh install with no saved preference
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('masroofy_language');
      return saved === 'ar' || saved === 'en' ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  const isRTL = language === 'ar';

  // Synchronize document attributes on language change
  useEffect(() => {
    try {
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      localStorage.setItem('masroofy_language', language);
    } catch (e) {
      console.warn('Failed to update language attributes', e);
    }
  }, [language]);

  const setLanguage = (newLang) => {
    if (newLang !== 'en' && newLang !== 'ar') return;
    setLanguageState(newLang);
    try {
      localStorage.setItem('masroofy_language', newLang);
      document.documentElement.lang = newLang;
      document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    } catch (e) {
      console.warn('Failed to save language preference', e);
    }
  };

  const t = (keyPath, params = {}, fallback = '') => {
    return getTranslation(language, keyPath, params, fallback);
  };

  const formatNumber = (num) => {
    const n = Number(num);
    if (isNaN(n)) return '0';
    return n.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US');
  };

  const formatDate = (dateInput, options = {}) => {
    try {
      const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
      if (isNaN(d.getTime())) return String(dateInput);
      return d.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', options);
    } catch {
      return String(dateInput);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        isRTL,
        setLanguage,
        t,
        formatNumber,
        formatDate,
        translations: translations[language] || translations.en,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Provide a safe fallback if accessed outside Provider
    return {
      language: 'en',
      isRTL: false,
      setLanguage: () => {},
      t: (keyPath, params = {}, fallback = '') => getTranslation('en', keyPath, params, fallback),
      formatNumber: (n) => String(n),
      formatDate: (d) => String(d),
      translations: translations.en,
    };
  }
  return context;
}
