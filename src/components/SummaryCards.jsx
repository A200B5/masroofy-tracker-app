import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function SummaryCards({ income, expenses, currency = '£' }) {
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
          <span>{income.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}</span>
        </div>
        <div className="summary-badge">
          <span>↑ 5%</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {language === 'ar' ? 'مقارنة بالشهر الماضي' : 'vs last month'}
          </span>
        </div>
      </div>

      {/* Expenses Card */}
      <div className="summary-card expense">
        <div className="summary-label-row">
          <span className="summary-label">{t('dashboard.totalExpenses', {}, 'Total Expenses')}</span>
          <ArrowDownRight size={18} color="#be123c" />
        </div>
        <div className="summary-amount">
          <span>{currency}</span>
          <span>{expenses.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}</span>
        </div>
        <div className="summary-badge">
          <span>↓ 8%</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {language === 'ar' ? 'أقل من المعتاد' : 'less than usual'}
          </span>
        </div>
      </div>
    </section>
  );
}
