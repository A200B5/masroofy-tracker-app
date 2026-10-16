import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  PieChart as PieIcon,
  ArrowDownRight,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Scale,
  Calendar,
  Layers,
  Info,
  Utensils,
  Car,
  ShoppingCart,
  Receipt,
  Heart,
  ShieldPlus,
  GraduationCap,
  LayoutGrid,
  Tag,
  ArrowDownLeft,
  Check,
} from 'lucide-react';
import {
  PERIOD_OPTIONS,
  calculatePeriodAnalytics,
  calculateMonthlyTrends,
} from '../utils/analytics';
import { useLanguage } from '../context/LanguageContext';

const ICON_MAP = {
  Utensils,
  Car,
  ShoppingCart,
  Receipt,
  Heart,
  ShieldPlus,
  GraduationCap,
  LayoutGrid,
  Tag,
  ArrowDownLeft,
};

export default function ReportsPage({ balance, transactions = [], currency = '£' }) {
  const { t, language } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Derive dynamic analytics for the selected period
  const analytics = useMemo(() => {
    return calculatePeriodAnalytics(transactions, selectedPeriod, new Date());
  }, [transactions, selectedPeriod]);

  // Derive dynamic 6-month comparison based on recorded transactions
  const monthlyBars = useMemo(() => {
    return calculateMonthlyTrends(transactions, new Date(), 6, language);
  }, [transactions, language]);

  const currentPeriodOption =
    PERIOD_OPTIONS.find((p) => p.key === selectedPeriod) || PERIOD_OPTIONS[0];

  const currentPeriodLabel =
    language === 'ar'
      ? currentPeriodOption.labelAr || currentPeriodOption.label
      : currentPeriodOption.labelEn || currentPeriodOption.label;

  const netPositive = analytics.netCashFlow >= 0;

  return (
    <div className="reports-page animate-fade-in">
      {/* Page Header with Interactive Period Selector */}
      <div className="page-header" style={{ position: 'relative' }}>
        <div>
          <h1 className="page-title">{t('reports.title', {}, 'Financial Reports')}</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {t('reports.subtitle', {}, 'Dynamic analytics derived from recorded transactions')}
          </p>
        </div>

        {/* Period Dropdown Button */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            id="btn-period-dropdown"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            aria-expanded={isDropdownOpen}
            aria-label="Select report time period"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              padding: '8px 14px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              color: 'var(--text-primary)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Calendar size={14} color="var(--primary-600)" />
            <span>{currentPeriodLabel}</span>
            <ChevronDown
              size={14}
              style={{
                transform: isDropdownOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s',
              }}
            />
          </button>

          {/* Period Dropdown Menu */}
          {isDropdownOpen && (
            <div
              className="period-dropdown-menu"
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-md)',
                zIndex: 100,
                minWidth: '150px',
                padding: '6px',
                animation: 'fadeIn 0.15s ease-out',
              }}
            >
              {PERIOD_OPTIONS.map((opt) => {
                const optLabel =
                  language === 'ar' ? opt.labelAr || opt.label : opt.labelEn || opt.label;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    id={`period-opt-${opt.key}`}
                    onClick={() => {
                      setSelectedPeriod(opt.key);
                      setIsDropdownOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: selectedPeriod === opt.key ? 'var(--primary-50)' : 'transparent',
                      color:
                        selectedPeriod === opt.key ? 'var(--primary-600)' : 'var(--text-primary)',
                      fontWeight: selectedPeriod === opt.key ? 700 : 500,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      textAlign: language === 'ar' ? 'right' : 'left',
                    }}
                  >
                    <span>{optLabel}</span>
                    {selectedPeriod === opt.key && <Check size={14} color="var(--primary-600)" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Segmented Period Tabs for quick 1-tap navigation */}
      <div
        className="period-tabs-bar"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '6px',
          background: 'var(--bg-card)',
          padding: '4px',
          borderRadius: '16px',
          border: '1px solid var(--border-light)',
          marginBottom: '18px',
        }}
      >
        {PERIOD_OPTIONS.map((opt) => {
          const isActive = selectedPeriod === opt.key;
          const optLabel =
            language === 'ar' ? opt.labelAr || opt.label : opt.labelEn || opt.label;
          return (
            <button
              key={opt.key}
              type="button"
              id={`tab-period-${opt.key}`}
              onClick={() => setSelectedPeriod(opt.key)}
              style={{
                padding: '8px 10px',
                borderRadius: '12px',
                border: 'none',
                background: isActive ? 'var(--primary-600)' : 'transparent',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {optLabel}
            </button>
          );
        })}
      </div>

      {/* Primary Analytics Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '14px',
        }}
      >
        {/* Total Expenses Card */}
        <div
          className="summary-card expense"
          id="reports-expenses-card"
          style={{ padding: '16px', borderRadius: '20px' }}
        >
          <div className="summary-label-row">
            <span className="summary-label" style={{ fontSize: '0.8rem' }}>
              {t('reports.totalPeriodExpenses', {}, 'Total Expenses')}
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'var(--accent-purple-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-purple)',
              }}
            >
              <PieIcon size={16} />
            </div>
          </div>
          <div className="summary-amount" style={{ fontSize: '1.45rem', margin: '8px 0 4px 0' }}>
            <span>{currency}</span>
            <span id="reports-total-expenses">
              {analytics.totalExpenses.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}
            </span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {currentPeriodLabel}
          </div>
        </div>

        {/* Total Income Card */}
        <div
          className="summary-card income"
          id="reports-income-card"
          style={{ padding: '16px', borderRadius: '20px' }}
        >
          <div className="summary-label-row">
            <span className="summary-label" style={{ fontSize: '0.8rem' }}>
              {t('reports.totalPeriodIncome', {}, 'Total Income')}
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: '#DCFCE7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#16A34A',
              }}
            >
              <ArrowDownLeft size={16} />
            </div>
          </div>
          <div
            className="summary-amount"
            style={{ fontSize: '1.45rem', margin: '8px 0 4px 0', color: '#16A34A' }}
          >
            <span>{currency}</span>
            <span id="reports-total-income">
              {analytics.totalIncome.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}
            </span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {currentPeriodLabel}
          </div>
        </div>
      </div>

      {/* Net Cash Flow & Transaction Count Banner */}
      <div
        id="reports-cashflow-banner"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: '20px',
          padding: '16px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '14px',
              background: netPositive ? '#DCFCE7' : '#FEE2E2',
              color: netPositive ? '#16A34A' : '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {netPositive ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {t('reports.netCashFlow', {}, 'Net Cash Flow')}
            </div>
            <div
              id="reports-net-cashflow"
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: netPositive ? '#16A34A' : '#DC2626',
                direction: 'ltr',
                display: 'inline-block',
                fontFamily: 'var(--font-numbers)',
              }}
            >
              {netPositive ? '+' : ''}
              {analytics.netCashFlow.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}{' '}
              {currency}
            </div>
          </div>
        </div>

        <div style={{ textAlign: language === 'ar' ? 'left' : 'right' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {t('reports.transactionCount', {}, 'Transactions')}
          </div>
          <span
            id="reports-tx-count-badge"
            style={{
              fontSize: '0.85rem',
              fontWeight: 800,
              background: 'var(--bg-primary)',
              padding: '4px 10px',
              borderRadius: '10px',
              display: 'inline-block',
              marginTop: '4px',
              color: 'var(--text-primary)',
            }}
          >
            {analytics.transactionCount}
          </span>
        </div>
      </div>

      {/* Expense Breakdown by Category Section */}
      <div className="donut-chart-container" id="reports-category-breakdown-section">
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
            {t('reports.categoryBreakdown', {}, 'Spending by Category')}
          </h2>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            ({analytics.categories.length} {language === 'ar' ? 'فئات' : 'categories'})
          </span>
        </div>

        {/* Dynamic State vs Empty State */}
        {analytics.totalExpenses > 0 ? (
          <>
            {/* SVG Donut Chart */}
            <div
              style={{
                position: 'relative',
                width: '190px',
                height: '190px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '8px 0 16px 0',
              }}
            >
              <svg
                viewBox="0 0 100 100"
                width="100%"
                height="100%"
                style={{ transform: 'rotate(-90deg)' }}
              >
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="var(--border-light)"
                  strokeWidth="14"
                />

                {analytics.donutSegments.map((seg) => (
                  <circle
                    key={seg.key}
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="14"
                    strokeDasharray={seg.strokeDasharray}
                    strokeDashoffset={seg.strokeDashoffset}
                    style={{
                      transition: 'stroke-dasharray 0.4s ease, stroke-dashoffset 0.4s ease',
                    }}
                  />
                ))}
              </svg>

              {/* Center Total Text */}
              <div style={{ position: 'absolute', textAlign: 'center', direction: 'ltr' }}>
                <div
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-numbers)',
                  }}
                >
                  {analytics.totalExpenses.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}{' '}
                  {currency}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {currentPeriodLabel}
                </div>
              </div>
            </div>

            {/* Dynamic Category List with Progress Bars */}
            <div
              className="category-breakdown-list"
              style={{ width: '100%', marginTop: '10px' }}
            >
              {analytics.categories.map((cat) => {
                const IconComponent = ICON_MAP[cat.icon] || Tag;
                const catLabel =
                  language === 'ar'
                    ? cat.label
                    : t(`categories.${cat.key}`, {}, cat.labelEn || cat.label);

                return (
                  <div
                    key={cat.key}
                    className="category-item-row"
                    style={{
                      padding: '10px 0',
                      borderBottom: '1px solid var(--border-light)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '6px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            background: cat.bg,
                            color: cat.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <IconComponent size={15} />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{catLabel}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          ({cat.count})
                        </span>
                      </div>

                      <div style={{ textAlign: language === 'ar' ? 'left' : 'right', direction: 'ltr' }}>
                        <span
                          style={{
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            fontFamily: 'var(--font-numbers)',
                          }}
                        >
                          {cat.amount.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}{' '}
                          {currency}
                        </span>
                        <span
                          style={{
                            marginLeft: '8px',
                            marginRight: '8px',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            color: cat.color,
                          }}
                        >
                          {cat.formattedPercentage}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div
                      style={{
                        width: '100%',
                        height: '6px',
                        background: 'var(--bg-primary)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${cat.percentage}%`,
                          height: '100%',
                          background: cat.color,
                          borderRadius: '4px',
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Empty State */
          <div
            id="reports-empty-expenses-state"
            style={{
              padding: '36px 20px',
              textAlign: 'center',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'var(--bg-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                marginBottom: '12px',
              }}
            >
              <PieIcon size={28} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>
              {t('reports.noDataForPeriod', {}, 'No transactions found for the selected time period.')}
            </h3>
          </div>
        )}
      </div>

      {/* Monthly Comparison */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
        }}
      >
        <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
          {t('reports.spendingTrends', {}, 'Monthly Trends')}
        </h2>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          ({t('reports.last6Months', {}, 'Last 6 Months')})
        </span>
      </div>

      <div
        className="monthly-bar-chart"
        id="reports-monthly-chart"
        role="region"
        aria-label={t('reports.spendingTrends', {}, 'Monthly Trends')}
      >
        {monthlyBars.map((b) => (
          <div
            key={b.monthKey}
            className={`bar-col ${b.isActive ? 'active' : ''}`}
            id={`trend-bar-${b.monthKey}`}
          >
            <span className="bar-val">{b.displayAmount}</span>
            <div
              className="bar-fill"
              style={{ height: b.height }}
              title={`${b.monthLabelFull || b.monthLabel} ${b.year}: ${b.expenses} ${currency}`}
            />
            <span className="bar-label">{b.monthLabel}</span>
          </div>
        ))}
      </div>

      {/* Account Balance Context Card */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px dashed var(--border-light)',
          borderRadius: '16px',
          padding: '12px 16px',
          fontSize: '0.78rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginTop: '10px',
          marginBottom: '24px',
        }}
      >
        <Info size={18} color="var(--primary-600)" style={{ flexShrink: 0 }} />
        <div>
          <span>{t('reports.totalAccountBalance', {}, 'Total Account Balance: ')}</span>
          <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-numbers)' }}>
            {(balance?.current ?? 0).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}{' '}
            {currency}
          </strong>
          <span> • {t('reports.totalCumulativeExpenses', {}, 'Total Cumulative Expenses: ')}</span>
          <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-numbers)' }}>
            {(balance?.expenses ?? 0).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}{' '}
            {currency}
          </strong>
        </div>
      </div>
    </div>
  );
}
