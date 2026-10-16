import React from 'react';
import { Sun, Moon, Bell, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Header({
  user,
  theme,
  isDarkModeUnlocked = false,
  onToggleTheme,
  onOpenSettings,
}) {
  const { t, language } = useLanguage();

  // Determine greeting based on local hour
  const hour = new Date().getHours();
  const isMorning = hour >= 5 && hour < 14;
  const greetingText = isMorning
    ? t('header.goodMorning', {}, 'Good morning')
    : t('header.goodEvening', {}, 'Good evening');
  const greetingEmoji = isMorning ? '☀️' : '🌙';

  const themeButtonTitle =
    theme === 'dark'
      ? t('header.lightMode', {}, 'Light Mode')
      : isDarkModeUnlocked
      ? t('header.darkMode', {}, 'Dark Mode')
      : language === 'ar'
      ? 'الوضع الداكن (مقفل - 200 نقطة في المكافآت)'
      : 'Dark Mode (Locked - 200 pts in Rewards)';

  return (
    <header className="app-header">
      <div className="greeting-meta">
        <div className="greeting-title">
          <span>{greetingText}</span>
          <span>{greetingEmoji}</span>
        </div>
        <div className="greeting-sub">
          {t('header.overviewSub', {}, "Here's your spending overview today")}
        </div>
      </div>

      <div className="header-actions">
        <button
          className="icon-btn"
          id="header-theme-toggle"
          onClick={onToggleTheme}
          aria-label={themeButtonTitle}
          title={themeButtonTitle}
          style={{ position: 'relative' }}
        >
          {theme === 'dark' ? (
            <Sun size={19} color="#FBBF24" />
          ) : (
            <>
              <Moon size={19} />
              {!isDarkModeUnlocked && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: '#EF4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                  }}
                >
                  <Lock size={8} strokeWidth={3} />
                </div>
              )}
            </>
          )}
        </button>

        <button
          className="icon-btn"
          onClick={() => alert(t('header.noNotifications', {}, 'No new notifications at this time'))}
          aria-label={t('header.notifications', {}, 'Notifications')}
          title={t('header.notifications', {}, 'Notifications')}
        >
          <Bell size={19} />
        </button>

        <div
          className="user-avatar-badge"
          onClick={onOpenSettings}
          title={t('header.profileTooltip', {}, 'Profile & Settings')}
          id="header-avatar-btn"
        >
          {user?.name ? user.name.trim().charAt(0).toUpperCase() : (language === 'ar' ? 'م' : 'M')}
        </div>
      </div>
    </header>
  );
}
