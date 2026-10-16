import React from 'react';
import { Plus, Wallet, Target } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function QuickActions({ onAddExpense, onAddIncome, onAddBudget }) {
  const { t } = useLanguage();

  return (
    <section className="quick-actions-grid" aria-label="Quick Action Buttons">
      {/* 1. Add Expense */}
      <button
        type="button"
        className="action-btn-item btn-expense"
        onClick={onAddExpense}
        id="btn-quick-add-expense"
      >
        <div className="action-icon-wrap">
          <Plus size={22} strokeWidth={2.5} />
        </div>
        <span className="action-title">+ {t('dashboard.addExpense', {}, 'Add Expense')}</span>
      </button>

      {/* 2. Add Income */}
      <button
        type="button"
        className="action-btn-item btn-income"
        onClick={onAddIncome}
        id="btn-quick-add-income"
      >
        <div className="action-icon-wrap">
          <Wallet size={20} strokeWidth={2.2} />
        </div>
        <span className="action-title">{t('dashboard.addIncome', {}, 'Add Income')}</span>
      </button>

      {/* 3. Add Budget */}
      <button
        type="button"
        className="action-btn-item btn-budget"
        onClick={onAddBudget}
        id="btn-quick-add-budget"
      >
        <div className="action-icon-wrap">
          <Target size={20} strokeWidth={2.2} />
        </div>
        <span className="action-title">{t('dashboard.setBudget', {}, 'Set Budget')}</span>
      </button>
    </section>
  );
}
