import React from 'react';
import {
  Utensils,
  Car,
  ShoppingCart,
  Receipt,
  ArrowDownLeft,
  ChevronLeft,
  ChevronRight,
  Tag,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ICON_MAP = {
  Utensils,
  Car,
  ShoppingCart,
  Receipt,
  ArrowDownLeft,
  Tag,
};

export default function RecentTransactions({
  transactions = [],
  currency = '£',
  onViewAll,
  onSelectTransaction,
}) {
  const { t, language, isRTL } = useLanguage();
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <section className="recent-transactions-section" aria-label="Recent Transactions">
      <div className="section-header">
        <h2 className="section-title">
          {t('dashboard.recentTransactions', {}, 'Recent Transactions')}
        </h2>
        <button
          type="button"
          className="section-link"
          onClick={onViewAll}
          id="btn-view-all-tx"
        >
          <span>{t('dashboard.viewAll', {}, 'View All')}</span>
          <ChevronIcon size={16} />
        </button>
      </div>

      <div className="transactions-list">
        {transactions.length === 0 ? (
          <div
            style={{
              padding: '24px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.88rem',
            }}
          >
            {t('dashboard.noTransactions', {}, 'No transactions recorded yet.')}
          </div>
        ) : (
          transactions.map((tx) => {
            const IconComponent = ICON_MAP[tx.icon] || Tag;
            const isExpense = tx.type === 'expense';
            const txTitle = language === 'ar' ? tx.titleAr || tx.title : tx.titleEn || tx.title;
            const txCategory =
              language === 'ar'
                ? tx.categoryAr || tx.category
                : tx.categoryEn || tx.category;
            const txDate = language === 'ar' ? tx.date : tx.dateEn || tx.date;

            return (
              <article
                key={tx.id}
                className="transaction-card"
                onClick={() => onSelectTransaction?.(tx)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectTransaction?.(tx);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${txTitle} amount ${tx.amount} ${currency}`}
                id={`tx-card-${tx.id}`}
              >
                <div className="transaction-info">
                  <div
                    className="transaction-icon-box"
                    style={{
                      backgroundColor: tx.bg || '#F1F5F9',
                      color: tx.color || '#475569',
                    }}
                  >
                    <IconComponent size={22} />
                  </div>
                  <div className="transaction-meta">
                    <span className="transaction-title">{txTitle}</span>
                    <span className="transaction-date">{txDate}</span>
                  </div>
                </div>

                <div className="transaction-amount-box">
                  <span className={`transaction-amount ${isExpense ? 'expense' : 'income'}`}>
                    {isExpense ? '-' : '+'}
                    {Number(tx.amount).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}{' '}
                    {currency}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {txCategory}
                  </span>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
