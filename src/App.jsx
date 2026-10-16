import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import AddExpenseModal from './components/AddExpenseModal';
import AddIncomeModal from './components/AddIncomeModal';
import SetBudgetModal from './components/SetBudgetModal';
import TransactionDetailModal from './components/TransactionDetailModal';
import WelcomeSplash from './components/WelcomeSplash';

import DashboardPage from './pages/DashboardPage';
import ReportsPage from './pages/ReportsPage';
import RewardsPage from './pages/RewardsPage';
import SettingsPage from './pages/SettingsPage';

import {
  INITIAL_USER,
} from './data/mockData';
import { parseStoredBudget } from './utils/budget';
import { EMPTY_BALANCE } from './utils/analytics';
import {
  calculateTransactionPoints,
  processRedemption,
  parseStoredRedemptions,
  parseStoredUnlockedRewards,
  parseStoredAwardedTransactions,
  DEFAULT_REWARDS_CATALOG,
} from './utils/rewards';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { t, language } = useLanguage();

  // Rewards states (Phase 4 & Product Refinements)
  // Dark Mode starts LOCKED (unlockedRewards defaults to empty array)
  const [unlockedRewards, setUnlockedRewards] = useState(() => {
    const saved = localStorage.getItem('masroofy_unlocked_rewards');
    return parseStoredUnlockedRewards(saved);
  });

  // Theme state with local storage persistence
  // Guard: if saved theme was 'dark' but rew-1 is not in unlockedRewards, fallback to 'light'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('masroofy_theme') || 'light';
    const savedUnlocked = parseStoredUnlockedRewards(
      localStorage.getItem('masroofy_unlocked_rewards')
    );
    if (savedTheme === 'dark' && !savedUnlocked.includes('rew-1')) {
      return 'light';
    }
    return savedTheme;
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Splash screen state (can be re-opened from settings or shown on initial visit)
  const [showSplash, setShowSplash] = useState(() => {
    return !localStorage.getItem('masroofy_has_seen_splash');
  });

  // User state (starts with 350 welcome points)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('masroofy_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        const validName =
          typeof parsed.name === 'string' && parsed.name.trim() && parsed.name.trim().length <= 40
            ? parsed.name.trim()
            : INITIAL_USER.name;
        return {
          ...INITIAL_USER,
          ...parsed,
          name: validName,
        };
      }
      return INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  // Balance state (starts at zero for fresh installations, loads and preserves saved user data)
  const [balance, setBalance] = useState(() => {
    try {
      const saved = localStorage.getItem('masroofy_balance');
      return saved ? JSON.parse(saved) : EMPTY_BALANCE;
    } catch {
      return EMPTY_BALANCE;
    }
  });

  // Transactions state (starts empty [] for fresh installations, loads and preserves saved user data)
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('masroofy_transactions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  // Budget state (Phase 3B)
  const [budget, setBudget] = useState(() => {
    try {
      const saved = localStorage.getItem('masroofy_budget');
      return parseStoredBudget(saved);
    } catch {
      return null;
    }
  });

  const [redemptionsHistory, setRedemptionsHistory] = useState(() => {
    const saved = localStorage.getItem('masroofy_redemptions');
    return parseStoredRedemptions(saved);
  });

  const [awardedTransactions, setAwardedTransactions] = useState(() => {
    const saved = localStorage.getItem('masroofy_awarded_tx');
    return saved ? parseStoredAwardedTransactions(saved) : {};
  });

  // Modal states
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // PWA Install prompt event
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Sync theme with document attribute & localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('masroofy_theme', theme);
  }, [theme]);

  // Sync transactions & balance with localStorage
  useEffect(() => {
    localStorage.setItem('masroofy_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('masroofy_balance', JSON.stringify(balance));
  }, [balance]);

  // Sync budget with localStorage
  useEffect(() => {
    if (budget) {
      localStorage.setItem('masroofy_budget', JSON.stringify(budget));
    } else {
      localStorage.removeItem('masroofy_budget');
    }
  }, [budget]);

  // Sync rewards state with localStorage
  useEffect(() => {
    localStorage.setItem('masroofy_unlocked_rewards', JSON.stringify(unlockedRewards));
  }, [unlockedRewards]);

  useEffect(() => {
    localStorage.setItem('masroofy_redemptions', JSON.stringify(redemptionsHistory));
  }, [redemptionsHistory]);

  useEffect(() => {
    localStorage.setItem('masroofy_awarded_tx', JSON.stringify(awardedTransactions));
  }, [awardedTransactions]);

  // Listen for PWA beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const isDarkModeUnlocked = unlockedRewards.includes('rew-1');

  /**
   * Theme toggle handler with reward guard.
   * Prevents switching to dark mode unless rew-1 is unlocked!
   */
  const toggleTheme = () => {
    if (theme === 'light') {
      if (!isDarkModeUnlocked) {
        alert(
          t(
            'rewards.darkModeLockedAlert',
            {},
            'Dark Mode is locked! You can unlock it for 200 points in the Rewards page. 🎁'
          )
        );
        return false;
      }
      setTheme('dark');
    } else {
      setTheme('light');
    }
    return true;
  };

  const handleDismissSplash = () => {
    localStorage.setItem('masroofy_has_seen_splash', 'true');
    setShowSplash(false);
  };

  const handleSaveExpense = (newExpense) => {
    const amount = Math.round((Number(newExpense.amount) || 0) * 100) / 100;
    if (amount <= 0) return;

    setTransactions((prev) => [newExpense, ...prev]);
    setBalance((prev) => {
      const updatedCurrent = Math.round((prev.current - amount) * 100) / 100;
      const updatedExpenses = Math.round((prev.expenses + amount) * 100) / 100;
      return {
        ...prev,
        current: updatedCurrent,
        expenses: updatedExpenses,
      };
    });

    // Award reward points for eligible expense (Phase 4)
    const pts = calculateTransactionPoints(newExpense);
    if (pts > 0) {
      setUser((prev) => {
        const updated = { ...prev, points: (prev.points ?? 350) + pts };
        localStorage.setItem('masroofy_user', JSON.stringify(updated));
        return updated;
      });
      setAwardedTransactions((prev) => ({ ...prev, [newExpense.id]: pts }));
    }
  };

  const handleSaveIncome = (newIncome) => {
    const amount = Math.round((Number(newIncome.amount) || 0) * 100) / 100;
    if (amount <= 0) return;

    setTransactions((prev) => [newIncome, ...prev]);
    setBalance((prev) => {
      const updatedCurrent = Math.round((prev.current + amount) * 100) / 100;
      const updatedIncome = Math.round((prev.income + amount) * 100) / 100;
      return {
        ...prev,
        current: updatedCurrent,
        income: updatedIncome,
      };
    });
  };

  const handleUpdateTransaction = (updatedTx) => {
    if (!updatedTx || !updatedTx.id) return;
    const oldTx = transactions.find((t) => t.id === updatedTx.id);
    if (!oldTx) return;

    const oldAmount = Math.round((Number(oldTx.amount) || 0) * 100) / 100;
    const newAmount = Math.round((Number(updatedTx.amount) || 0) * 100) / 100;
    if (newAmount <= 0) return;

    const sanitizedUpdatedTx = {
      ...updatedTx,
      amount: newAmount,
    };

    // 1. Update transactions list in place preserving order and ID
    setTransactions((prev) =>
      prev.map((t) => (t.id === updatedTx.id ? sanitizedUpdatedTx : t))
    );

    // 2. Reverse old transaction effect and apply new transaction effect
    setBalance((prev) => {
      let tempCurrent = prev.current;
      let tempIncome = prev.income;
      let tempExpenses = prev.expenses;

      // Reverse old
      if (oldTx.type === 'expense') {
        tempCurrent += oldAmount;
        tempExpenses -= oldAmount;
      } else {
        tempCurrent -= oldAmount;
        tempIncome -= oldAmount;
      }

      // Apply new
      if (updatedTx.type === 'expense') {
        tempCurrent -= newAmount;
        tempExpenses += newAmount;
      } else {
        tempCurrent += newAmount;
        tempIncome += newAmount;
      }

      return {
        ...prev,
        current: Math.round(tempCurrent * 100) / 100,
        income: Math.round(tempIncome * 100) / 100,
        expenses: Math.round(tempExpenses * 100) / 100,
      };
    });

    // 3. Keep selectedTransaction synchronized to avoid stale modal state
    setSelectedTransaction(sanitizedUpdatedTx);

    // 4. Adjust points awarded if amount or type changed (floored at 0)
    const oldPts = awardedTransactions[updatedTx.id] || 0;
    const newPts = calculateTransactionPoints(sanitizedUpdatedTx);
    const deltaPts = newPts - oldPts;
    if (deltaPts !== 0) {
      setUser((prev) => {
        const updated = {
          ...prev,
          points: Math.max(0, (prev.points ?? 350) + deltaPts),
        };
        localStorage.setItem('masroofy_user', JSON.stringify(updated));
        return updated;
      });
      setAwardedTransactions((prev) => ({ ...prev, [updatedTx.id]: newPts }));
    }
  };

  const handleDeleteTransaction = (txId) => {
    if (!txId) return;
    const txToDelete = transactions.find((t) => t.id === txId);
    if (!txToDelete) return;

    const amount = Math.round((Number(txToDelete.amount) || 0) * 100) / 100;

    // 1. Remove from transactions list
    setTransactions((prev) => prev.filter((t) => t.id !== txId));

    // 2. Reverse its effect on balance
    setBalance((prev) => {
      let newCurrent = prev.current;
      let newIncome = prev.income;
      let newExpenses = prev.expenses;

      if (txToDelete.type === 'expense') {
        newCurrent = Math.round((prev.current + amount) * 100) / 100;
        newExpenses = Math.round((prev.expenses - amount) * 100) / 100;
      } else {
        newCurrent = Math.round((prev.current - amount) * 100) / 100;
        newIncome = Math.round((prev.income - amount) * 100) / 100;
      }

      return {
        ...prev,
        current: newCurrent,
        income: newIncome,
        expenses: newExpenses,
      };
    });

    // 3. Close the modal
    setSelectedTransaction(null);

    // 4. Revert points awarded for the deleted transaction (floored at 0)
    const oldPts = awardedTransactions[txId] || 0;
    if (oldPts > 0) {
      setUser((prev) => {
        const updated = {
          ...prev,
          points: Math.max(0, (prev.points ?? 350) - oldPts),
        };
        localStorage.setItem('masroofy_user', JSON.stringify(updated));
        return updated;
      });
      setAwardedTransactions((prev) => {
        const copy = { ...prev };
        delete copy[txId];
        return copy;
      });
    }
  };

  const handleAddBudget = () => {
    setIsBudgetModalOpen(true);
  };

  const handleSaveBudget = (cleanAmount) => {
    setBudget({
      limit: cleanAmount,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleRemoveBudget = () => {
    setBudget(null);
  };

  const handleChangeCurrency = (newCurrency, newCurrencyName) => {
    setUser((prev) => {
      const updated = { ...prev, currency: newCurrency, currencyName: newCurrencyName };
      localStorage.setItem('masroofy_user', JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateProfile = (newName) => {
    const trimmed = typeof newName === 'string' ? newName.trim() : '';
    if (!trimmed || trimmed.length > 40) return false;

    setUser((prev) => {
      const updated = {
        ...prev,
        name: trimmed,
      };
      localStorage.setItem('masroofy_user', JSON.stringify(updated));
      return updated;
    });
    return true;
  };

  const handleRedeemReward = (rewardId) => {
    const result = processRedemption(
      DEFAULT_REWARDS_CATALOG,
      rewardId,
      user.points ?? 350,
      unlockedRewards,
      language
    );

    if (result.success) {
      setUser((prev) => {
        const updated = { ...prev, points: result.newPoints };
        localStorage.setItem('masroofy_user', JSON.stringify(updated));
        return updated;
      });
      setUnlockedRewards(result.newUnlockedIds);
      setRedemptionsHistory((prev) => [result.redemptionRecord, ...prev]);

      // If user unlocked Dark Mode, immediately activate theme
      if (rewardId === 'rew-1') {
        setTheme('dark');
      }
    }
    return result;
  };

  const handleResetDemoData = () => {
    if (
      window.confirm(
        t(
          'settings.resetConfirm',
          {},
          'Are you sure you want to reset all financial data? This will clear all transactions, reset your balance to zero, and restore 350 welcome points.'
        )
      )
    ) {
      setBalance(EMPTY_BALANCE);
      setTransactions([]);
      setUser(INITIAL_USER);
      setBudget(null);
      setTheme('light');
      setUnlockedRewards([]); // Dark mode starts locked!
      setRedemptionsHistory([]);
      setAwardedTransactions({});
      localStorage.removeItem('masroofy_transactions');
      localStorage.removeItem('masroofy_balance');
      localStorage.removeItem('masroofy_user');
      localStorage.removeItem('masroofy_budget');
      localStorage.removeItem('masroofy_unlocked_rewards');
      localStorage.removeItem('masroofy_redemptions');
      localStorage.removeItem('masroofy_awarded_tx');
      localStorage.setItem('masroofy_theme', 'light');
      alert(t('settings.resetSuccess', {}, 'Financial data has been reset to zero successfully!'));
    }
  };

  const handleInstallApp = async () => {
    if (!deferredPrompt) {
      alert(t('settings.installInstructions', {}, 'To install Masroofy Tracker:\n\n• On Safari (iOS): Tap Share -> Add to Home Screen.\n• On Chrome/Edge (Android): Tap menu (⋮) -> Install App.'));
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="app-container">
      <div className="ambient-bg" />

      {/* Optional First-time Welcome Splash */}
      {showSplash && <WelcomeSplash onGetStarted={handleDismissSplash} />}

      <div className="app-viewport">
        {/* Header with greeting, lock-aware dark mode & Masroofy Identity */}
        <Header
          user={user}
          theme={theme}
          isDarkModeUnlocked={isDarkModeUnlocked}
          onToggleTheme={toggleTheme}
          onOpenSettings={() => setActiveTab('settings')}
        />

        {/* Main Content Pages */}
        <main className="main-content">
          {activeTab === 'dashboard' && (
            <DashboardPage
              balance={balance}
              transactions={transactions}
              budget={budget}
              currency={user.currency}
              onAddExpense={() => setIsExpenseModalOpen(true)}
              onAddIncome={() => setIsIncomeModalOpen(true)}
              onAddBudget={handleAddBudget}
              onViewAllTransactions={() => setActiveTab('reports')}
              onSelectTransaction={(tx) => setSelectedTransaction(tx)}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsPage balance={balance} transactions={transactions} currency={user.currency} />
          )}

          {activeTab === 'rewards' && (
            <RewardsPage
              points={user.points ?? 350}
              theme={theme}
              onToggleTheme={toggleTheme}
              unlockedRewardIds={unlockedRewards}
              redemptionsHistory={redemptionsHistory}
              onRedeemReward={handleRedeemReward}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPage
              user={user}
              theme={theme}
              isDarkModeUnlocked={isDarkModeUnlocked}
              onToggleTheme={toggleTheme}
              onChangeCurrency={handleChangeCurrency}
              onResetDemoData={handleResetDemoData}
              onUpdateProfile={handleUpdateProfile}
              installPrompt={deferredPrompt}
              onInstallApp={handleInstallApp}
            />
          )}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Interactive Add Expense Modal */}
        <AddExpenseModal
          isOpen={isExpenseModalOpen}
          onClose={() => setIsExpenseModalOpen(false)}
          onSaveExpense={handleSaveExpense}
          currency={user.currency}
        />

        {/* Interactive Add Income Modal */}
        <AddIncomeModal
          isOpen={isIncomeModalOpen}
          onClose={() => setIsIncomeModalOpen(false)}
          onSaveIncome={handleSaveIncome}
          currency={user.currency}
        />

        {/* Monthly Budget Modal (Phase 3B) */}
        <SetBudgetModal
          isOpen={isBudgetModalOpen}
          currentBudget={budget}
          onClose={() => setIsBudgetModalOpen(false)}
          onSaveBudget={handleSaveBudget}
          onRemoveBudget={handleRemoveBudget}
          currency={user.currency}
        />

        {/* Transaction Detail Modal with Edit & Delete (Phase 2B) */}
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onUpdate={handleUpdateTransaction}
          onDelete={handleDeleteTransaction}
          currency={user.currency}
        />
      </div>
    </div>
  );
}
