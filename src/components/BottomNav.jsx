import React from 'react';
import { Home, PieChart, Trophy, Settings } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function BottomNav({ activeTab, onTabChange }) {
  const { t } = useLanguage();

  const tabs = [
    { id: 'dashboard', label: t('nav.dashboard', {}, 'Home'), icon: Home },
    { id: 'reports', label: t('nav.reports', {}, 'Reports'), icon: PieChart },
    { id: 'rewards', label: t('nav.rewards', {}, 'Rewards'), icon: Trophy },
    { id: 'settings', label: t('nav.settings', {}, 'Settings'), icon: Settings },
  ];

  return (
    <nav className="bottom-nav" aria-label="Bottom Navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            className={`nav-tab-btn ${isActive ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            id={`nav-tab-${tab.id}`}
            aria-selected={isActive}
            role="tab"
          >
            {isActive && <div className="nav-tab-indicator" />}
            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span className="nav-tab-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
