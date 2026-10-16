import React from 'react';
import BalanceCard from '../components/BalanceCard';
import SummaryCards from '../components/SummaryCards';
import QuickActions from '../components/QuickActions';
import BudgetCard from '../components/BudgetCard';
import RecentTransactions from '../components/RecentTransactions';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function DashboardPage({
  balance,
  transactions,
  budget,
  currency,
  onAddExpense,
  onAddIncome,
  onAddBudget,
  onViewAllTransactions,
  onSelectTransaction,
}) {
  const { language } = useLanguage();

  return (
    <div className="dashboard-page animate-fade-in">
      {/* Demonstration Data Banner for Academic Context */}
      <div
        className="demo-badge-pill"
        title={language === 'ar' ? 'مشروع أكاديمي تعليمي' : 'Academic Demonstration Project'}
      >
        <Sparkles size={14} color="#0D9488" />
        <span>
          {language === 'ar'
            ? 'بيانات تجريبية توضيحية لتقييم المشروع'
            : 'Demonstration data for project evaluation'}
        </span>
      </div>

      {/* 1. Current Balance Card */}
      <BalanceCard balance={balance} currency={currency} />

      {/* 2. Income & Expense Summary Cards */}
      <SummaryCards
        income={balance.income}
        expenses={balance.expenses}
        currency={currency}
      />

      {/* 3. Quick Action Buttons */}
      <QuickActions
        onAddExpense={onAddExpense}
        onAddIncome={onAddIncome}
        onAddBudget={onAddBudget}
      />

      {/* 4. Monthly Spending Budget Card (Phase 3B) */}
      <BudgetCard
        budget={budget}
        transactions={transactions}
        currency={currency}
        onOpenSetBudget={onAddBudget}
      />

      {/* 5. Recent Transactions */}
      <RecentTransactions
        transactions={transactions}
        currency={currency}
        onViewAll={onViewAllTransactions}
        onSelectTransaction={onSelectTransaction}
      />
    </div>
  );
}
