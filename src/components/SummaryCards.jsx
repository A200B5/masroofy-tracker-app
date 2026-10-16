import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function SummaryCards({
  income = 0,
  expenses = 0,
  currency = '£',
  incomeGrowth = 0,
  expenseChange = 0,
}) {
  const { t, language } = useLanguage();

  return (
    <section className="summary-grid" aria-label="Income and expense summary">
      {/* Income Card */}
      <div className="summary-card income">
        <div className="summary-label-row">
          <span className="summary-label">{t('dashboard.totalIncome', {}, 'Total Income')}</span>
          <ArrowUpRight size={18} color="#15803d" />
        </div>
        <div className="summary-amount">
          <span>{currency}</span>
          <span>{(income || 0).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}</span>
        </div>
        {incomeGrowth !== 0 ? (
          <div className="summary-badge">
            <span>{incomeGrowth > 0 ? `↑ ${incomeGrowth}%` : `↓ ${Math.abs(incomeGrowth)}%`}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {language === 'ar' ? 'مقارنة بالشهر الماضي' : 'vs last month'}
            </span>
          </div>
        ) : (
          <div className="summary-badge" style={{ opacity: 0.75 }}>
            <span>0%</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {language === 'ar' ? 'هذا الشهر' : 'this month'}
            </span>
          </div>
        )}
      </div>

      {/* Expenses Card */}
      <div className="summary-card expense">
        <div className="summary-label-row">
          <span className="summary-label">{t('dashboard.totalExpenses', {}, 'Total Expenses')}</span>
          <ArrowDownRight size={18} color="#be123c" />
        </div>
        <div className="summary-amount">
          <span>{currency}</span>
          <span>{(expenses || 0).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}</span>
        </div>
        {expenseChange !== 0 ? (
          <div className="summary-badge">
            <span>{expenseChange > 0 ? `↑ ${expenseChange}%` : `↓ ${Math.abs(expenseChange)}%`}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {language === 'ar' ? 'مقارنة بالشهر الماضي' : 'vs last month'}
            </span>
          </div>
        ) : (
          <div className="summary-badge" style={{ opacity: 0.75 }}>
            <span>0%</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {language === 'ar' ? 'هذا الشهر' : 'this month'}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
