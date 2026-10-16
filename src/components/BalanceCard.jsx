import React, { useState } from 'react';
import { Eye, EyeOff, TrendingUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function BalanceCard({ balance, currency = '£' }) {
  const [showBalance, setShowBalance] = useState(true);
  const { t, language } = useLanguage();

  return (
    <section className="balance-card" aria-label={t('dashboard.currentBalance', {}, 'Current Balance')}>
      <div className="balance-info">
        <div className="balance-header-row">
          <span className="balance-label">
            {t('dashboard.currentBalance', {}, 'Current Balance')}
          </span>
          <button
            type="button"
            className="visibility-toggle"
            onClick={() => setShowBalance(!showBalance)}
            title={showBalance ? (language === 'ar' ? 'إخفاء الرصيد' : 'Hide balance') : (language === 'ar' ? 'إظهار الرصيد' : 'Show balance')}
            aria-label="Toggle Balance Visibility"
          >
            {showBalance ? <Eye size={17} /> : <EyeOff size={17} />}
          </button>
        </div>

        <div className="balance-amount">
          {showBalance ? (
            <>
              <span className="balance-currency">{currency}</span>
              <span>{(balance?.current || 0).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}</span>
            </>
          ) : (
            <span style={{ letterSpacing: '4px', fontSize: '1.8rem' }}>••••••••</span>
          )}
        </div>

        <div className="balance-trend-badge">
          <TrendingUp size={15} className="trend-arrow" />
          <span>
            {language === 'ar'
              ? `النمو هذا الشهر ${balance?.growthPercent || 0}% ↑`
              : `Growth this month ${balance?.growthPercent || 0}% ↑`}
          </span>
        </div>
      </div>

      {/* Mini Bar Graphic matching reference mockup */}
      <div className="balance-chart-graphic" aria-hidden="true" title="Balance chart trend">
        <div className="chart-bar" style={{ height: '18px' }} />
        <div className="chart-bar" style={{ height: '32px' }} />
        <div className="chart-bar" style={{ height: '24px' }} />
        <div className="chart-bar" style={{ height: '42px' }} />
        <div className="chart-bar highlight" style={{ height: '52px' }} />
      </div>
    </section>
  );
}
