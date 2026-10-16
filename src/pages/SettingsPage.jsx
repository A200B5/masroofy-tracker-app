import React, { useState } from 'react';
import {
  User,
  Moon,
  Sun,
  Globe,
  Coins,
  CloudDownload,
  Info,
  RotateCcw,
  Download,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Lock,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import EditProfileModal from '../components/EditProfileModal';

const AVAILABLE_CURRENCIES = [
  { code: '£', nameEn: 'Egyptian Pound', nameAr: 'جنيه مصري' },
  { code: 'SAR', nameEn: 'Saudi Riyal', nameAr: 'ريال سعودي' },
  { code: 'AED', nameEn: 'UAE Dirham', nameAr: 'درهم إماراتي' },
  { code: '$', nameEn: 'US Dollar', nameAr: 'دولار أمريكي' },
  { code: 'KWD', nameEn: 'Kuwaiti Dinar', nameAr: 'دينار كويتي' },
  { code: '€', nameEn: 'Euro', nameAr: 'يورو' },
];

export default function SettingsPage({
  user,
  theme,
  isDarkModeUnlocked = false,
  onToggleTheme,
  onChangeCurrency,
  onResetDemoData,
  onUpdateProfile,
  installPrompt,
  onInstallApp,
}) {
  const { language, setLanguage, isRTL, t } = useLanguage();
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  const handleSelectCurrency = (cur) => {
    const localizedName = language === 'ar' ? cur.nameAr : cur.nameEn;
    if (onChangeCurrency) {
      onChangeCurrency(cur.code, localizedName);
    }
    setShowCurrencyModal(false);
  };

  const handleSelectLanguage = (newLang) => {
    setLanguage(newLang);
    setShowLanguageModal(false);
  };

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className="settings-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('settings.title', {}, 'Settings')}</h1>
      </div>

      {/* User Profile Card */}
      <div
        className="summary-card"
        id="user-profile-card"
        style={{
          marginBottom: '20px',
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            className="user-avatar-badge"
            style={{ width: '54px', height: '54px', fontSize: '1.3rem' }}
          >
            {user.name ? user.name.trim().charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div
              id="user-display-name"
              style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}
            >
              {user.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</span>
              <span
                className="demo-account-badge"
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: 'var(--primary-700)',
                  background: 'var(--primary-50)',
                  border: '1px solid var(--primary-200)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-pill)',
                }}
              >
                {t('settings.demoAccountBadge', {}, 'Demo Account')}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          id="btn-edit-profile"
          onClick={() => setShowEditProfileModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--primary-50)',
            color: 'var(--primary-700)',
            border: '1px solid var(--primary-200)',
            padding: '8px 14px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          aria-label={t('settings.editProfile', {}, 'Edit Profile')}
        >
          <User size={15} />
          <span>{t('settings.editProfile', {}, 'Edit Profile')}</span>
        </button>
      </div>

      {/* Settings Group 1: Preferences */}
      <div className="settings-group">
        {/* Theme Toggle */}
        <div
          className="settings-item"
          onClick={onToggleTheme}
          id="setting-theme-toggle"
          style={{ cursor: 'pointer' }}
        >
          <div className="settings-item-info">
            <div className="settings-icon">
              {theme === 'dark' ? (
                <Moon size={20} color="#818CF8" />
              ) : isDarkModeUnlocked ? (
                <Sun size={20} color="#F59E0B" />
              ) : (
                <Lock size={20} color="#EF4444" />
              )}
            </div>
            <div>
              <div className="settings-item-title">
                {t('settings.themeTitle', {}, 'Theme (Dark Mode)')}
              </div>
              <div className="settings-item-value">
                {theme === 'dark'
                  ? t('settings.themeValueDark', {}, 'Enabled (Dark)')
                  : isDarkModeUnlocked
                  ? t('settings.themeValueLight', {}, 'Disabled (Light)')
                  : t('settings.themeLockedHint', {}, 'Locked (Unlock in Rewards for 200 pts)')}
              </div>
            </div>
          </div>
          {!isDarkModeUnlocked && theme !== 'dark' ? (
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#EF4444',
                background: '#FEE2E2',
                padding: '4px 8px',
                borderRadius: 'var(--radius-pill)',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <Lock size={11} />
              <span>{t('locked', {}, 'Locked')}</span>
            </span>
          ) : (
            <ChevronIcon size={18} color="var(--text-muted)" />
          )}
        </div>

        {/* Language Selector */}
        <div
          className="settings-item"
          onClick={() => setShowLanguageModal(true)}
          id="setting-language-selector"
          style={{ cursor: 'pointer' }}
        >
          <div className="settings-item-info">
            <div className="settings-icon">
              <Globe size={20} color="#0D9488" />
            </div>
            <div>
              <div className="settings-item-title">
                {t('settings.languageTitle', {}, 'Language')}
              </div>
              <div className="settings-item-value">
                {language === 'ar' ? 'العربية' : 'English (Default)'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-600)' }}>
              {isRTL ? 'RTL' : 'LTR'}
            </span>
            <ChevronIcon size={18} color="var(--text-muted)" />
          </div>
        </div>

        {/* Currency Selector */}
        <div
          className="settings-item"
          onClick={() => setShowCurrencyModal(true)}
          id="setting-currency-selector"
          style={{ cursor: 'pointer' }}
        >
          <div className="settings-item-info">
            <div className="settings-icon">
              <Coins size={20} color="#D97706" />
            </div>
            <div>
              <div className="settings-item-title">
                {t('settings.currencyTitle', {}, 'Base Currency')}
              </div>
              <div className="settings-item-value">
                {user.currencyName || 'EGP'} ({user.currency})
              </div>
            </div>
          </div>
          <ChevronIcon size={18} color="var(--text-muted)" />
        </div>
      </div>

      {/* Settings Group 2: PWA & Data */}
      <div className="settings-group">
        {/* Install PWA - Always accessible */}
        <div className="settings-item" onClick={onInstallApp} id="setting-install-pwa">
          <div className="settings-item-info">
            <div
              className="settings-icon"
              style={{ background: 'var(--primary-100)', color: 'var(--primary-700)' }}
            >
              <Download size={20} />
            </div>
            <div>
              <div className="settings-item-title">
                {t('settings.pwaTitle', {}, 'Install App (PWA)')}
              </div>
              <div className="settings-item-value">
                {installPrompt
                  ? t('settings.pwaReady', {}, 'Ready for instant install')
                  : t('settings.pwaDesc', {}, 'Add Masroofy to home screen')}
              </div>
            </div>
          </div>
          <button
            type="button"
            style={{
              background: 'var(--primary-700)',
              color: 'white',
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {t('settings.pwaBtn', {}, 'Install')}
          </button>
        </div>

        {/* Local Storage Info */}
        <div className="settings-item">
          <div className="settings-item-info">
            <div className="settings-icon">
              <CloudDownload size={20} color="#2563EB" />
            </div>
            <div>
              <div className="settings-item-title">
                {t('settings.backupTitle', {}, 'Local Data Storage')}
              </div>
              <div className="settings-item-value">
                {t('settings.backupDesc', {}, 'All transactions and settings are stored locally on your device')}
              </div>
            </div>
          </div>
        </div>

        {/* Demo Reset */}
        <div
          className="settings-item"
          onClick={onResetDemoData}
          id="setting-reset-demo"
          style={{ cursor: 'pointer' }}
        >
          <div className="settings-item-info">
            <div className="settings-icon" style={{ background: '#FEE2E2', color: '#DC2626' }}>
              <RotateCcw size={20} />
            </div>
            <div>
              <div className="settings-item-title" style={{ color: '#DC2626' }}>
                {t('settings.resetTitle', {}, 'Reset Demo Data')}
              </div>
              <div className="settings-item-value">
                {t(
                  'settings.resetDesc',
                  {},
                  'Restore initial demo transactions, balance, and lock Dark Mode'
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            style={{
              background: 'transparent',
              color: '#DC2626',
              border: '1px solid #FECACA',
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            {t('settings.resetBtn', {}, 'Reset')}
          </button>
        </div>
      </div>

      {/* Language Selection Modal */}
      {showLanguageModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowLanguageModal(false)}
          role="dialog"
          aria-modal="true"
          style={{ zIndex: 300 }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '380px',
              padding: '24px 20px',
              animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                {t('settings.languageSelectorTitle', {}, 'Select Application Language')}
              </h3>
              <button
                type="button"
                onClick={() => setShowLanguageModal(false)}
                style={{ padding: '6px', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                id="btn-lang-en"
                onClick={() => handleSelectLanguage('en')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: '16px',
                  border: language === 'en' ? '2px solid var(--primary-600)' : '1px solid var(--border-light)',
                  background: language === 'en' ? 'var(--primary-50)' : 'var(--bg-card)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--text-primary)' }}>
                    English (Default)
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    Left-to-Right layout (LTR)
                  </div>
                </div>
                {language === 'en' && <Check size={18} color="var(--primary-600)" />}
              </button>

              <button
                type="button"
                id="btn-lang-ar"
                onClick={() => handleSelectLanguage('ar')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: '16px',
                  border: language === 'ar' ? '2px solid var(--primary-600)' : '1px solid var(--border-light)',
                  background: language === 'ar' ? 'var(--primary-50)' : 'var(--bg-card)',
                  cursor: 'pointer',
                  textAlign: 'right',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--text-primary)' }}>
                    العربية
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    تخطيط من اليمين إلى اليسار (RTL)
                  </div>
                </div>
                {language === 'ar' && <Check size={18} color="var(--primary-600)" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Currency Selection Modal */}
      {showCurrencyModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCurrencyModal(false)}
          role="dialog"
          aria-modal="true"
          style={{ zIndex: 300 }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '380px',
              padding: '24px 20px',
              animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                {t('settings.currencyTitle', {}, 'Base Currency')}
              </h3>
              <button
                type="button"
                onClick={() => setShowCurrencyModal(false)}
                style={{ padding: '6px', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {AVAILABLE_CURRENCIES.map((cur) => {
                const isSelected = user.currency === cur.code;
                const curName = language === 'ar' ? cur.nameAr : cur.nameEn;
                return (
                  <button
                    key={cur.code}
                    type="button"
                    onClick={() => handleSelectCurrency(cur)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: '14px',
                      border: isSelected ? '2px solid var(--primary-600)' : '1px solid var(--border-light)',
                      background: isSelected ? 'var(--primary-50)' : 'var(--bg-card)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: '1rem',
                          fontFamily: 'var(--font-numbers)',
                          color: 'var(--primary-700)',
                        }}
                      >
                        {cur.code}
                      </span>
                      <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{curName}</span>
                    </div>
                    {isSelected && <Check size={18} color="var(--primary-600)" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditProfileModal}
        currentName={user?.name || ''}
        onClose={() => setShowEditProfileModal(false)}
        onSave={(newName) => {
          if (onUpdateProfile) {
            return onUpdateProfile(newName);
          }
          return true;
        }}
      />
    </div>
  );
}
