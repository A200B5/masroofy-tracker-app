import React from 'react';
import Logo from './Logo';
import { useLanguage } from '../context/LanguageContext';

export default function WelcomeSplash({ onGetStarted }) {
  const { language } = useLanguage();

  return (
    <div
      className="welcome-splash-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(180deg, #E6FBF5 0%, #D1F4EC 45%, #FFFFFF 100%)',
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '60px 24px 40px 24px',
        textAlign: 'center',
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      {/* Decorative Mint Wave Background element */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '60%',
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(45, 212, 191, 0.35), transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 'auto',
          marginBottom: 'auto',
        }}
      >
        <Logo size={130} />

        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            color: '#064E3B',
            marginTop: '24px',
            marginBottom: '8px',
            letterSpacing: '-0.02em',
          }}
        >
          {language === 'ar' ? 'مصروفي' : 'Masroofy Tracker'}
        </h1>

        <p
          style={{
            fontSize: '1.15rem',
            color: '#065F46',
            fontWeight: 600,
            letterSpacing: '-0.01em',
          }}
        >
          {language === 'ar' ? 'مصاريفك .. تحت السيطرة' : 'Your finances .. under control'}
        </p>

        <div
          style={{
            marginTop: '16px',
            padding: '4px 12px',
            borderRadius: '9999px',
            background: 'rgba(6, 95, 70, 0.1)',
            color: '#047857',
            fontSize: '0.78rem',
            fontWeight: 700,
          }}
        >
          {language === 'ar' ? 'المتتبع المالي الذكي ✨' : 'Smart Personal Finance ✨'}
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '360px', zIndex: 2 }}>
        <button
          type="button"
          onClick={onGetStarted}
          id="btn-splash-start"
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '22px',
            backgroundColor: '#042F2E',
            color: '#FFFFFF',
            fontSize: '1.15rem',
            fontWeight: 800,
            boxShadow: '0 10px 25px rgba(4, 47, 46, 0.35)',
            marginBottom: '14px',
            cursor: 'pointer',
          }}
        >
          {language === 'ar' ? 'ابدأ الآن' : 'Get Started'}
        </button>

        <button
          type="button"
          onClick={onGetStarted}
          style={{
            background: 'none',
            border: 'none',
            color: '#0D9488',
            fontSize: '0.92rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {language === 'ar' ? 'لدي حساب بالفعل' : 'Explore Dashboard'}
        </button>
      </div>
    </div>
  );
}
