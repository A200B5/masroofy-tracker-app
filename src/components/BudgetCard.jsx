import React from 'react';
import {
  Target,
  Pencil,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  TrendingDown,
} from 'lucide-react';
import { BUDGET_STATUS, calculateBudgetUsage } from '../utils/budget';
import { useLanguage } from '../context/LanguageContext';

export default function BudgetCard({
  budget,
  transactions = [],
  currency = '£',
  onOpenSetBudget,
}) {
  const { t, language } = useLanguage();
  const usage = calculateBudgetUsage(budget, transactions, new Date(), language);

  if (!usage.isConfigured) {
    return (
      <div
        className="budget-setup-card animate-fade-in"
        id="budget-setup-card"
        style={{
          background: 'var(--bg-card)',
          border: '1.5px dashed var(--border-light)',
          borderRadius: '24px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            background: 'var(--primary-50)',
            color: 'var(--primary-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Target size={24} strokeWidth={2.2} />
        </div>

        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '4px' }}>
            {t('dashboard.monthlyBudget', {}, 'Monthly Budget')}
          </h3>
          <p
            style={{
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              maxWidth: '300px',
              lineHeight: 1.5,
            }}
          >
            {t(
              'budget.noLimitDescription',
              {},
              'You have not set a spending limit this month. Set a monthly budget to monitor expenses and stay on track.'
            )}
          </p>
        </div>

        <button
          type="button"
          id="btn-setup-monthly-budget"
          className="btn-primary-action"
          onClick={onOpenSetBudget}
          style={{
            padding: '10px 22px',
            fontSize: '0.88rem',
            borderRadius: 'var(--radius-pill)',
            marginTop: '4px',
          }}
        >
          <Target size={16} />
          <span>{t('dashboard.setBudget', {}, 'Set Budget')}</span>
        </button>
      </div>
    );
  }

  // Active Budget View
  const StatusIcon =
    usage.status === BUDGET_STATUS.EXCEEDED
      ? AlertCircle
      : usage.status === BUDGET_STATUS.WARNING || usage.status === BUDGET_STATUS.REACHED
      ? AlertTriangle
      : CheckCircle2;

  const statusText = t(
    usage.statusKey,
    {},
    language === 'ar'
      ? usage.statusTextAr || usage.statusText
      : usage.statusTextEn || usage.statusText
  );

  return (
    <div
      className="budget-active-card animate-fade-in"
      id="budget-active-card"
      style={{
        background: 'var(--bg-card)',
        border: `1.5px solid ${usage.isOverBudget ? '#FCA5A5' : 'var(--border-light)'}`,
        borderRadius: '24px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: usage.isOverBudget
          ? '0 6px 20px rgba(220, 38, 38, 0.12)'
          : 'var(--shadow-sm)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'var(--primary-50)',
              color: 'var(--primary-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Target size={18} strokeWidth={2.4} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 800, margin: 0 }}>
              {t('dashboard.monthlyBudget', {}, 'Monthly Budget')}
            </h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {t('reports.periods.current', {}, 'Current Month')}
            </span>
          </div>
        </div>

        <button
          type="button"
          id="btn-edit-monthly-budget"
          onClick={onOpenSetBudget}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-light)',
            padding: '5px 10px',
            borderRadius: '10px',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          <Pencil size={12} />
          <span>{t('edit', {}, 'Edit')}</span>
        </button>
      </div>

      {/* Main Metric Row: Spent vs Limit */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '8px',
        }}
      >
        <div>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block' }}>
            {t('dashboard.budgetSpent', {}, 'Spent')}
          </span>
          <div
            style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              fontFamily: 'var(--font-numbers)',
            }}
          >
            <span id="budget-spent-amount">
              {usage.spent.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 4px' }}>
              /
            </span>
            <span
              id="budget-limit-amount"
              style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}
            >
              {usage.limit.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')} {currency}
            </span>
          </div>
        </div>

        <div
          id="budget-percentage-badge"
          style={{
            background: usage.statusBg,
            color: usage.statusColor,
            fontWeight: 800,
            fontSize: '0.85rem',
            padding: '4px 10px',
            borderRadius: '12px',
            fontFamily: 'var(--font-numbers)',
          }}
        >
          {usage.percentage}%
        </div>
      </div>

      {/* Consumption Progress Bar */}
      <div
        id="budget-progress-track"
        style={{
          width: '100%',
          height: '10px',
          background: 'var(--bg-primary)',
          borderRadius: '8px',
          overflow: 'hidden',
          marginBottom: '12px',
        }}
      >
        <div
          id="budget-progress-fill"
          style={{
            width: `${usage.progressBarWidth}%`,
            height: '100%',
            background: usage.statusColor,
            borderRadius: '8px',
            transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>

      {/* Remaining or Over-budget Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.82rem',
          marginBottom: '12px',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--border-light)',
        }}
      >
        {usage.isOverBudget ? (
          <div
            style={{
              color: '#DC2626',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <TrendingDown size={14} />
            <span>
              {t('budget.overBudgetBy', {}, 'Over budget by: ')}
            </span>
            <strong id="budget-over-amount" style={{ fontFamily: 'var(--font-numbers)' }}>
              {usage.overAmount.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')} {currency}
            </strong>
          </div>
        ) : (
          <div style={{ color: 'var(--text-secondary)' }}>
            <span>{t('dashboard.budgetRemaining', {}, 'Remaining')}: </span>
            <strong
              id="budget-remaining-amount"
              style={{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-numbers)',
                fontWeight: 800,
              }}
            >
              {usage.remaining.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')} {currency}
            </strong>
          </div>
        )}

        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
          {t('dashboard.monthlyBudget', {}, 'Monthly Budget')}
        </span>
      </div>

      {/* Status Warning Banner */}
      <div
        id="budget-status-banner"
        style={{
          background: usage.statusBg,
          color: usage.statusColor,
          padding: '8px 12px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.82rem',
          fontWeight: 700,
        }}
      >
        <StatusIcon size={16} style={{ flexShrink: 0 }} />
        <span id="budget-status-text">{statusText}</span>
      </div>
    </div>
  );
}
