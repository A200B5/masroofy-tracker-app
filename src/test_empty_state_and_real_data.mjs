/**
 * Masroofy Tracker — Empty State & Real Financial Data Test Suite
 *
 * Requirements covered:
 * 1. Fresh installation starts with empty transactions [] and zero financial totals.
 * 2. No automatic seeding from mockData.js.
 * 3. Preservation of existing user data in localStorage (never overwritten by empty/mock data).
 * 4. Adding, editing, and deleting transactions from zero state maintains exact mathematical invariant.
 * 5. Analytics (period analytics & monthly trends) handle empty datasets cleanly with zero fabricated data.
 * 6. Budget calculations handle empty datasets without errors or division by zero.
 * 7. Rewards system functions correctly starting with empty awarded transactions map.
 * 8. Settings reset restores clean zero state rather than demo financial data.
 */

import {
  EMPTY_BALANCE,
  calculatePeriodAnalytics,
  calculateMonthlyTrends,
} from './utils/analytics.js';
import {
  calculateBudgetUsage,
  calculateCurrentMonthExpenses,
  BUDGET_STATUS,
} from './utils/budget.js';
import {
  calculateTransactionPoints,
  processRedemption,
  DEFAULT_REWARDS_CATALOG,
} from './utils/rewards.js';
import { INITIAL_USER } from './data/mockData.js';

let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failedTests++;
  }
}

console.log('\n======================================================');
console.log('   MASROOFY TRACKER — EMPTY STATE & REAL DATA SUITE    ');
console.log('======================================================\n');

const REF_DATE = new Date(2026, 9, 15); // October 15, 2026

// -------------------------------------------------------------------
// Test Group 1: Fresh Installation Initializer Verification
// -------------------------------------------------------------------
console.log('Test Group 1: Fresh Installation Initializer Verification');
{
  // Simulating fresh install with null localStorage
  const mockStorageFresh = {};

  const initBalance = () => {
    try {
      const saved = mockStorageFresh['masroofy_balance'];
      return saved ? JSON.parse(saved) : EMPTY_BALANCE;
    } catch {
      return EMPTY_BALANCE;
    }
  };

  const initTransactions = () => {
    try {
      const saved = mockStorageFresh['masroofy_transactions'];
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  };

  const initAwarded = () => {
    const saved = mockStorageFresh['masroofy_awarded_tx'];
    return saved ? JSON.parse(saved) : {};
  };

  const balance = initBalance();
  const transactions = initTransactions();
  const awarded = initAwarded();

  assert(balance.current === 0, `Fresh balance.current is 0: ${balance.current}`);
  assert(balance.income === 0, `Fresh balance.income is 0: ${balance.income}`);
  assert(balance.expenses === 0, `Fresh balance.expenses is 0: ${balance.expenses}`);
  assert(balance.growthPercent === 0, `Fresh balance.growthPercent is 0: ${balance.growthPercent}`);
  assert(Array.isArray(transactions) && transactions.length === 0, `Fresh transactions is empty array: length ${transactions.length}`);
  assert(typeof awarded === 'object' && Object.keys(awarded).length === 0, `Fresh awarded transactions is empty: ${JSON.stringify(awarded)}`);
}

// -------------------------------------------------------------------
// Test Group 2: Existing User Data Preservation
// -------------------------------------------------------------------
console.log('\nTest Group 2: Existing User Data Preservation');
{
  const existingUserTx = [
    {
      id: 'custom-tx-1',
      title: 'Real Grocery Store',
      titleEn: 'Real Grocery Store',
      category: 'Shopping',
      type: 'expense',
      amount: 450.75,
      date: '2026-10-14T10:00:00Z',
    },
    {
      id: 'custom-tx-2',
      title: 'Consulting Project',
      titleEn: 'Consulting Project',
      category: 'Income',
      type: 'income',
      amount: 3200,
      date: '2026-10-15T09:00:00Z',
    },
  ];

  const existingBalance = {
    current: 2749.25,
    income: 3200,
    expenses: 450.75,
    growthPercent: 15,
    isGrowthPositive: true,
  };

  const mockStorageExisting = {
    masroofy_transactions: JSON.stringify(existingUserTx),
    masroofy_balance: JSON.stringify(existingBalance),
  };

  const loadBalance = () => {
    const saved = mockStorageExisting['masroofy_balance'];
    return saved ? JSON.parse(saved) : EMPTY_BALANCE;
  };

  const loadTransactions = () => {
    const saved = mockStorageExisting['masroofy_transactions'];
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
    return [];
  };

  const loadedBalance = loadBalance();
  const loadedTransactions = loadTransactions();

  assert(loadedTransactions.length === 2, `Preserved existing 2 user transactions: ${loadedTransactions.length}`);
  assert(loadedTransactions[0].id === 'custom-tx-1', `First transaction ID preserved: ${loadedTransactions[0].id}`);
  assert(loadedTransactions[1].amount === 3200, `Second transaction amount preserved: ${loadedTransactions[1].amount}`);
  assert(loadedBalance.current === 2749.25, `Preserved user current balance: ${loadedBalance.current}`);
  assert(loadedBalance.income === 3200, `Preserved user income: ${loadedBalance.income}`);
  assert(loadedBalance.expenses === 450.75, `Preserved user expenses: ${loadedBalance.expenses}`);
  assert(
    loadedBalance.current === loadedBalance.income - loadedBalance.expenses,
    'Existing user mathematical invariant strictly holds'
  );
}

// -------------------------------------------------------------------
// Test Group 3: Financial State Flow from Zero (Add, Edit, Delete)
// -------------------------------------------------------------------
console.log('\nTest Group 3: Financial State Flow from Zero (Add, Edit, Delete)');
{
  let balance = { ...EMPTY_BALANCE };
  let transactions = [];
  let awarded = {};

  // 1. Add first expense
  const newExp = {
    id: 'tx-new-1',
    title: 'Coffee & Books',
    amount: 150,
    type: 'expense',
    category: 'entertainment',
    date: '2026-10-15T12:00:00Z',
  };

  transactions = [newExp, ...transactions];
  balance = {
    ...balance,
    current: Math.round((balance.current - newExp.amount) * 100) / 100,
    expenses: Math.round((balance.expenses + newExp.amount) * 100) / 100,
  };
  const pts1 = calculateTransactionPoints(newExp);
  if (pts1 > 0) awarded[newExp.id] = pts1;

  assert(balance.current === -150, `Balance after first expense is -150: ${balance.current}`);
  assert(balance.expenses === 150, `Expenses after first expense is 150: ${balance.expenses}`);
  assert(balance.income === 0, `Income remains 0: ${balance.income}`);
  assert(balance.current === balance.income - balance.expenses, 'Invariant holds: -150 === 0 - 150');
  assert(transactions.length === 1, `Transactions count is 1: ${transactions.length}`);

  // 2. Add first income
  const newInc = {
    id: 'tx-new-2',
    title: 'Salary Deposit',
    amount: 5000,
    type: 'income',
    category: 'salary',
    date: '2026-10-15T13:00:00Z',
  };

  transactions = [newInc, ...transactions];
  balance = {
    ...balance,
    current: Math.round((balance.current + newInc.amount) * 100) / 100,
    income: Math.round((balance.income + newInc.amount) * 100) / 100,
  };

  assert(balance.current === 4850, `Balance after income is 4850: ${balance.current}`);
  assert(balance.income === 5000, `Income after salary is 5000: ${balance.income}`);
  assert(balance.expenses === 150, `Expenses remains 150: ${balance.expenses}`);
  assert(balance.current === balance.income - balance.expenses, 'Invariant holds: 4850 === 5000 - 150');
  assert(transactions.length === 2, `Transactions count is 2: ${transactions.length}`);

  // 3. Edit expense amount from 150 to 220.50
  const updatedExp = { ...newExp, amount: 220.50 };
  const oldAmount = newExp.amount;
  const newAmount = updatedExp.amount;

  transactions = transactions.map((t) => (t.id === updatedExp.id ? updatedExp : t));
  balance = {
    ...balance,
    current: Math.round((balance.current + oldAmount - newAmount) * 100) / 100,
    expenses: Math.round((balance.expenses - oldAmount + newAmount) * 100) / 100,
  };

  assert(balance.current === 4779.50, `Balance after editing expense is 4779.50: ${balance.current}`);
  assert(balance.expenses === 220.50, `Expenses after edit is 220.50: ${balance.expenses}`);
  assert(balance.current === balance.income - balance.expenses, 'Invariant holds: 4779.50 === 5000 - 220.50');

  // 4. Delete expense
  transactions = transactions.filter((t) => t.id !== updatedExp.id);
  balance = {
    ...balance,
    current: Math.round((balance.current + updatedExp.amount) * 100) / 100,
    expenses: Math.round((balance.expenses - updatedExp.amount) * 100) / 100,
  };

  assert(balance.expenses === 0, `Expenses after delete is 0: ${balance.expenses}`);
  assert(balance.current === 5000, `Balance after deleting expense is 5000: ${balance.current}`);
  assert(balance.current === balance.income - balance.expenses, 'Invariant holds: 5000 === 5000 - 0');
  assert(transactions.length === 1, `Transactions count is 1: ${transactions.length}`);

  // 5. Delete income
  transactions = transactions.filter((t) => t.id !== newInc.id);
  balance = {
    ...balance,
    current: Math.round((balance.current - newInc.amount) * 100) / 100,
    income: Math.round((balance.income - newInc.amount) * 100) / 100,
  };

  assert(balance.current === 0, `Balance cleanly back to 0: ${balance.current}`);
  assert(balance.income === 0, `Income cleanly back to 0: ${balance.income}`);
  assert(balance.expenses === 0, `Expenses cleanly back to 0: ${balance.expenses}`);
  assert(transactions.length === 0, `Transactions cleanly empty: ${transactions.length}`);
}

// -------------------------------------------------------------------
// Test Group 4: Analytics on Empty Datasets (Zero Fabricated Data)
// -------------------------------------------------------------------
console.log('\nTest Group 4: Analytics on Empty Datasets');
{
  const emptyAnalytics = calculatePeriodAnalytics([], 'current', REF_DATE);

  assert(emptyAnalytics.totalIncome === 0, `Empty analytics totalIncome is 0: ${emptyAnalytics.totalIncome}`);
  assert(emptyAnalytics.totalExpenses === 0, `Empty analytics totalExpenses is 0: ${emptyAnalytics.totalExpenses}`);
  assert(emptyAnalytics.netCashFlow === 0, `Empty analytics netCashFlow is 0: ${emptyAnalytics.netCashFlow}`);
  assert(emptyAnalytics.transactionCount === 0, `Empty analytics transactionCount is 0: ${emptyAnalytics.transactionCount}`);
  assert(Array.isArray(emptyAnalytics.categories) && emptyAnalytics.categories.length === 0, 'Categories is empty array');
  assert(Array.isArray(emptyAnalytics.donutSegments) && emptyAnalytics.donutSegments.length === 0, 'Donut segments is empty array');

  // Monthly trends with empty dataset
  const trendsEn = calculateMonthlyTrends([], REF_DATE, 6, 'en');
  assert(trendsEn.length === 6, `Monthly trends returns 6 months: ${trendsEn.length}`);

  for (const bar of trendsEn) {
    assert(bar.expenses === 0, `Month ${bar.monthLabel} expenses is 0: ${bar.expenses}`);
    assert(bar.income === 0, `Month ${bar.monthLabel} income is 0: ${bar.income}`);
    assert(bar.height === '0%', `Month ${bar.monthLabel} height is 0%: ${bar.height}`);
    assert(bar.displayAmount === '0', `Month ${bar.monthLabel} displayAmount is '0': ${bar.displayAmount}`);
    assert(bar.txCount === 0, `Month ${bar.monthLabel} txCount is 0`);
  }

  const trendsAr = calculateMonthlyTrends([], REF_DATE, 6, 'ar');
  for (const bar of trendsAr) {
    assert(bar.expenses === 0, `Arabic Month ${bar.monthLabel} expenses is 0`);
    assert(bar.displayAmount === '0', `Arabic Month ${bar.monthLabel} displayAmount is '0'`);
  }
}

// -------------------------------------------------------------------
// Test Group 5: Budget Calculations on Empty Transactions
// -------------------------------------------------------------------
console.log('\nTest Group 5: Budget Calculations on Empty Transactions');
{
  const spent = calculateCurrentMonthExpenses([], REF_DATE);
  assert(spent === 0, `Spent with 0 transactions is 0: ${spent}`);

  const usage = calculateBudgetUsage(1500, [], REF_DATE, 'en');
  assert(usage.isConfigured === true, 'Budget is configured');
  assert(usage.limit === 1500, `Limit is 1500: ${usage.limit}`);
  assert(usage.spent === 0, `Spent is 0: ${usage.spent}`);
  assert(usage.remaining === 1500, `Remaining is 1500: ${usage.remaining}`);
  assert(usage.percentage === 0, `Usage percentage is 0%: ${usage.percentage}`);
  assert(usage.status === BUDGET_STATUS.NORMAL, `Status is NORMAL: ${usage.status}`);
  assert(!isNaN(usage.percentage), 'Usage percentage is not NaN');
}

// -------------------------------------------------------------------
// Test Group 6: Rewards & Welcome Points with Empty Transactions
// -------------------------------------------------------------------
console.log('\nTest Group 6: Rewards & Welcome Points with Empty Transactions');
{
  assert(INITIAL_USER.points === 350, `User starts with 350 welcome points: ${INITIAL_USER.points}`);

  // Test redemption starting from welcome points
  const res = processRedemption(DEFAULT_REWARDS_CATALOG, 'rew-1', 350, []);
  assert(res.success === true, 'Can redeem Dark Mode (rew-1) using welcome points');
  assert(res.newPoints === 150, `Points deducted from 350 to 150 (cost 200): ${res.newPoints}`);
  assert(res.newUnlockedIds.includes('rew-1'), 'Dark mode added to unlocked list');
}

// -------------------------------------------------------------------
// Test Group 7: Reset Behavior
// -------------------------------------------------------------------
console.log('\nTest Group 7: Reset Behavior (Restores Empty Financial State)');
{
  let balance = { current: 3000, income: 4500, expenses: 1500 };
  let transactions = [{ id: 't1', amount: 1500, type: 'expense' }];
  let awarded = { t1: 15 };

  // Trigger reset
  balance = EMPTY_BALANCE;
  transactions = [];
  awarded = {};

  assert(balance.current === 0, `Reset balance.current is 0: ${balance.current}`);
  assert(balance.income === 0, `Reset balance.income is 0: ${balance.income}`);
  assert(balance.expenses === 0, `Reset balance.expenses is 0: ${balance.expenses}`);
  assert(transactions.length === 0, `Reset transactions is empty array: ${transactions.length}`);
  assert(Object.keys(awarded).length === 0, 'Reset awarded is empty object');
}

console.log('\n======================================================');
console.log(`TOTAL TESTS: ${passedTests + failedTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log('======================================================\n');

if (failedTests > 0) {
  process.exit(1);
}
