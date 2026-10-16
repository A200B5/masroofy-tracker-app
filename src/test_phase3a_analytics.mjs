/**
 * Phase 3A: Dynamic Analytics Verification Suite for Masroofy Tracker
 *
 * Verifies all 16 dynamic analytics requirements:
 * 1. Income aggregation.
 * 2. Expense aggregation.
 * 3. Net cash flow.
 * 4. Expense category totals.
 * 5. Correct category percentages.
 * 6. Income exclusion from expense breakdowns.
 * 7. Current-month filtering.
 * 8. Previous-month filtering.
 * 9. All-period filtering.
 * 10. Empty transaction lists.
 * 11. Periods with income but no expenses.
 * 12. Zero values and decimal precision.
 * 13. Missing or invalid transaction dates.
 * 14. Analytics updates after editing a transaction.
 * 15. Analytics updates after deleting a transaction.
 * 16. Analytics updates after changing a transaction's type or category.
 */

import {
  parseTransactionDate,
  isTransactionInPeriod,
  calculatePeriodAnalytics,
  calculateMonthlyTrends,
} from './utils/analytics.js';
import { INITIAL_TRANSACTIONS } from './data/mockData.js';

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
console.log('   MASROOFY TRACKER — PHASE 3A DYNAMIC ANALYTICS       ');
console.log('======================================================\n');

// Fixed test reference date: October 15, 2026 (Month index 9, Year 2026)
// Current month = October 2026
// Previous month = September 2026
const REF_DATE = new Date('2026-10-15T14:30:00Z');

// -------------------------------------------------------------------
// 1. Income Aggregation
// -------------------------------------------------------------------
console.log('Test 1: Income Aggregation');
{
  const txList = [
    { id: '1', type: 'income', amount: 1500, date: '2026-10-01' },
    { id: '2', type: 'income', amount: 350.25, date: '2026-10-05' },
    { id: '3', type: 'income', amount: 49.75, date: '2026-10-10' },
    { id: '4', type: 'expense', amount: 500, date: '2026-10-08' }, // should be ignored in income
  ];
  const res = calculatePeriodAnalytics(txList, 'all', REF_DATE);
  assert(res.totalIncome === 1900.0, `Total income aggregated correctly: 1900 === ${res.totalIncome}`);
}

// -------------------------------------------------------------------
// 2. Expense Aggregation
// -------------------------------------------------------------------
console.log('\nTest 2: Expense Aggregation');
{
  const txList = [
    { id: '1', type: 'expense', amount: 120.5, category: 'طعام', date: '2026-10-01' },
    { id: '2', type: 'expense', amount: 25.0, category: 'مواصلات', date: '2026-10-02' },
    { id: '3', type: 'expense', amount: 340.25, category: 'مشتريات', date: '2026-10-03' },
    { id: '4', type: 'expense', amount: 180.0, category: 'فواتير', date: '2026-10-04' },
    { id: '5', type: 'income', amount: 1500, date: '2026-10-05' }, // should be ignored in expenses
  ];
  const res = calculatePeriodAnalytics(txList, 'all', REF_DATE);
  assert(res.totalExpenses === 665.75, `Total expenses aggregated correctly: 665.75 === ${res.totalExpenses}`);
}

// -------------------------------------------------------------------
// 3. Net Cash Flow
// -------------------------------------------------------------------
console.log('\nTest 3: Net Cash Flow');
{
  // Surplus
  const surplusTx = [
    { id: '1', type: 'income', amount: 2000, date: '2026-10-01' },
    { id: '2', type: 'expense', amount: 800, date: '2026-10-02' },
  ];
  const resSurplus = calculatePeriodAnalytics(surplusTx, 'all', REF_DATE);
  assert(resSurplus.netCashFlow === 1200, `Surplus net cash flow is +1200: ${resSurplus.netCashFlow}`);

  // Deficit
  const deficitTx = [
    { id: '1', type: 'income', amount: 500, date: '2026-10-01' },
    { id: '2', type: 'expense', amount: 1200, date: '2026-10-02' },
  ];
  const resDeficit = calculatePeriodAnalytics(deficitTx, 'all', REF_DATE);
  assert(resDeficit.netCashFlow === -700, `Deficit net cash flow is -700: ${resDeficit.netCashFlow}`);

  // Balanced
  const balancedTx = [
    { id: '1', type: 'income', amount: 450.75, date: '2026-10-01' },
    { id: '2', type: 'expense', amount: 450.75, date: '2026-10-02' },
  ];
  const resBalanced = calculatePeriodAnalytics(balancedTx, 'all', REF_DATE);
  assert(resBalanced.netCashFlow === 0, `Balanced net cash flow is 0: ${resBalanced.netCashFlow}`);
}

// -------------------------------------------------------------------
// 4. Expense Category Totals
// -------------------------------------------------------------------
console.log('\nTest 4: Expense Category Totals');
{
  const txList = [
    { id: '1', type: 'expense', amount: 120, category: 'طعام', categoryKey: 'food', date: '2026-10-01' },
    { id: '2', type: 'expense', amount: 80, category: 'طعام', categoryKey: 'food', date: '2026-10-02' },
    { id: '3', type: 'expense', amount: 50, category: 'مواصلات', categoryKey: 'transport', date: '2026-10-03' },
    { id: '4', type: 'expense', amount: 300, category: 'مشتريات', categoryKey: 'shopping', date: '2026-10-04' },
  ];
  const res = calculatePeriodAnalytics(txList, 'all', REF_DATE);
  const foodCat = res.categories.find((c) => c.key === 'food');
  const transCat = res.categories.find((c) => c.key === 'transport');
  const shopCat = res.categories.find((c) => c.key === 'shopping');

  assert(foodCat && foodCat.amount === 200, `Food category total aggregated: 200 === ${foodCat?.amount}`);
  assert(transCat && transCat.amount === 50, `Transport category total aggregated: 50 === ${transCat?.amount}`);
  assert(shopCat && shopCat.amount === 300, `Shopping category total aggregated: 300 === ${shopCat?.amount}`);
}

// -------------------------------------------------------------------
// 5. Correct Category Percentages
// -------------------------------------------------------------------
console.log('\nTest 5: Correct Category Percentages');
{
  // Total expenses = 200 (food) + 50 (transport) + 300 (shopping) = 550
  // food: 200 / 550 = 36.36% -> 36.4%
  // transport: 50 / 550 = 9.09% -> 9.1%
  // shopping: 300 / 550 = 54.54% -> 54.5%
  const txList = [
    { id: '1', type: 'expense', amount: 200, category: 'طعام', categoryKey: 'food', date: '2026-10-01' },
    { id: '2', type: 'expense', amount: 50, category: 'مواصلات', categoryKey: 'transport', date: '2026-10-02' },
    { id: '3', type: 'expense', amount: 300, category: 'مشتريات', categoryKey: 'shopping', date: '2026-10-03' },
  ];
  const res = calculatePeriodAnalytics(txList, 'all', REF_DATE);
  const food = res.categories.find((c) => c.key === 'food');
  const transport = res.categories.find((c) => c.key === 'transport');
  const shopping = res.categories.find((c) => c.key === 'shopping');

  assert(food.percentage === 36.4, `Food percentage: 36.4% === ${food.percentage}%`);
  assert(transport.percentage === 9.1, `Transport percentage: 9.1% === ${transport.percentage}%`);
  assert(shopping.percentage === 54.5, `Shopping percentage: 54.5% === ${shopping.percentage}%`);

  const sumPct = Math.round((food.percentage + transport.percentage + shopping.percentage) * 10) / 10;
  assert(sumPct === 100.0, `Sum of percentages totals 100%: ${sumPct}%`);
}

// -------------------------------------------------------------------
// 6. Income Exclusion from Expense Breakdowns
// -------------------------------------------------------------------
console.log('\nTest 6: Income Exclusion from Expense Breakdowns');
{
  const txList = [
    { id: '1', type: 'expense', amount: 150, category: 'طعام', categoryKey: 'food', date: '2026-10-01' },
    { id: '2', type: 'income', amount: 5000, category: 'دخل', categoryKey: 'income', date: '2026-10-02' },
    { id: '3', type: 'income', amount: 2000, category: 'راتب', categoryKey: 'salary', date: '2026-10-03' },
  ];
  const res = calculatePeriodAnalytics(txList, 'all', REF_DATE);

  assert(res.categories.length === 1, `Categories contains only 1 expense category (actual: ${res.categories.length})`);
  assert(res.categories[0].key === 'food', 'Only food expense category is present');
  assert(!res.categories.some((c) => c.key === 'income' || c.key === 'salary'), 'No income categories appear in expense breakdown');
  assert(res.categories[0].percentage === 100, 'Expense percentage is 100% of recorded expenses, unpolluted by income');
}

// -------------------------------------------------------------------
// 7. Current-Month Filtering
// -------------------------------------------------------------------
console.log('\nTest 7: Current-Month Filtering');
{
  const txList = [
    { id: '1', type: 'expense', amount: 100, date: '2026-10-05' }, // Current month (Oct 2026)
    { id: '2', type: 'expense', amount: 200, date: 'اليوم ، 2:30 م' }, // Relative current
    { id: '3', type: 'expense', amount: 150, date: '12 أكتوبر ، 1:10 م' }, // Arabic current month
    { id: '4', type: 'expense', amount: 300, date: '2026-09-20' }, // Previous month (Sep 2026)
    { id: '5', type: 'expense', amount: 400, date: '2026-08-15' }, // 2 months ago (Aug 2026)
  ];
  const res = calculatePeriodAnalytics(txList, 'current', REF_DATE);
  assert(res.transactionCount === 3, `Current month contains 3 transactions (actual: ${res.transactionCount})`);
  assert(res.totalExpenses === 450, `Current month total expenses is 450 === ${res.totalExpenses}`);
}

// -------------------------------------------------------------------
// 8. Previous-Month Filtering
// -------------------------------------------------------------------
console.log('\nTest 8: Previous-Month Filtering');
{
  const txList = [
    { id: '1', type: 'expense', amount: 100, date: '2026-10-05' }, // Oct 2026
    { id: '2', type: 'expense', amount: 250, date: '2026-09-15' }, // Sep 2026
    { id: '3', type: 'expense', amount: 120, date: '18 سبتمبر ، 3:00 م' }, // Sep 2026 (Arabic)
    { id: '4', type: 'expense', amount: 400, date: '2026-08-15' }, // Aug 2026
  ];
  const res = calculatePeriodAnalytics(txList, 'last', REF_DATE);
  assert(res.transactionCount === 2, `Last month contains 2 transactions (actual: ${res.transactionCount})`);
  assert(res.totalExpenses === 370, `Last month total expenses is 370 === ${res.totalExpenses}`);
}

// -------------------------------------------------------------------
// 9. All-Period Filtering
// -------------------------------------------------------------------
console.log('\nTest 9: All-Period Filtering');
{
  const txList = [
    { id: '1', type: 'expense', amount: 100, date: '2026-10-05' },
    { id: '2', type: 'expense', amount: 200, date: '2026-09-15' },
    { id: '3', type: 'expense', amount: 300, date: '2026-08-15' },
    { id: '4', type: 'income', amount: 1000, date: '2026-07-01' },
    { id: '5', type: 'expense', amount: 50, date: 'غير محدد' }, // unparseable date
  ];
  const res = calculatePeriodAnalytics(txList, 'all', REF_DATE);
  assert(res.transactionCount === 5, `All periods contains all 5 transactions (actual: ${res.transactionCount})`);
  assert(res.totalExpenses === 650, `All periods total expenses is 650 === ${res.totalExpenses}`);
  assert(res.totalIncome === 1000, `All periods total income is 1000 === ${res.totalIncome}`);
}

// -------------------------------------------------------------------
// 10. Empty Transaction Lists
// -------------------------------------------------------------------
console.log('\nTest 10: Empty Transaction Lists');
{
  const res = calculatePeriodAnalytics([], 'current', REF_DATE);
  assert(res.transactionCount === 0, 'Empty transaction list returns 0 count');
  assert(res.totalIncome === 0, 'Empty transaction list returns 0 income');
  assert(res.totalExpenses === 0, 'Empty transaction list returns 0 expenses');
  assert(res.netCashFlow === 0, 'Empty transaction list returns 0 net cash flow');
  assert(Array.isArray(res.categories) && res.categories.length === 0, 'Empty transaction list returns empty categories array');
  assert(Array.isArray(res.donutSegments) && res.donutSegments.length === 0, 'Empty transaction list returns empty donut segments array');
  assert(!isNaN(res.netCashFlow), 'No NaN values in empty state results');
}

// -------------------------------------------------------------------
// 11. Periods with Income but No Expenses
// -------------------------------------------------------------------
console.log('\nTest 11: Periods with Income but No Expenses');
{
  const txList = [
    { id: '1', type: 'income', amount: 3000, date: '2026-10-01' },
    { id: '2', type: 'income', amount: 1200, date: '2026-10-10' },
  ];
  const res = calculatePeriodAnalytics(txList, 'current', REF_DATE);
  assert(res.totalIncome === 4200, 'Total income is 4200');
  assert(res.totalExpenses === 0, 'Total expenses is strictly 0');
  assert(res.netCashFlow === 4200, 'Net cash flow equals total income (4200)');
  assert(res.categories.length === 0, 'Categories array is empty (no division by zero or NaN)');
  assert(res.donutSegments.length === 0, 'Donut segments array is empty');
}

// -------------------------------------------------------------------
// 12. Zero Values and Decimal Precision
// -------------------------------------------------------------------
console.log('\nTest 12: Zero Values and Decimal Precision');
{
  // Test accumulation without IEEE-754 binary float drift
  const txList = [
    { id: '1', type: 'expense', amount: 0.1, category: 'طعام', categoryKey: 'food', date: '2026-10-01' },
    { id: '2', type: 'expense', amount: 0.2, category: 'طعام', categoryKey: 'food', date: '2026-10-02' },
    { id: '3', type: 'expense', amount: 0.05, category: 'طعام', categoryKey: 'food', date: '2026-10-03' },
    { id: '4', type: 'income', amount: 10.99, date: '2026-10-04' },
    { id: '5', type: 'income', amount: 0.01, date: '2026-10-05' },
  ];
  const res = calculatePeriodAnalytics(txList, 'current', REF_DATE);
  assert(res.totalExpenses === 0.35, `Expenses 0.1 + 0.2 + 0.05 = 0.35 strictly without float drift (${res.totalExpenses})`);
  assert(res.totalIncome === 11.0, `Income 10.99 + 0.01 = 11.00 strictly (${res.totalIncome})`);
  assert(res.netCashFlow === 10.65, `Net cash flow 11.00 - 0.35 = 10.65 strictly (${res.netCashFlow})`);
}

// -------------------------------------------------------------------
// 13. Missing or Invalid Transaction Dates
// -------------------------------------------------------------------
console.log('\nTest 13: Missing or Invalid Transaction Dates');
{
  const invalidTxs = [
    { id: '1', type: 'expense', amount: 100, date: null },
    { id: '2', type: 'expense', amount: 100, date: undefined },
    { id: '3', type: 'expense', amount: 100, date: '' },
    { id: '4', type: 'expense', amount: 100, date: 'invalid-date-string' },
    { id: '5', type: 'expense', amount: 100, date: 12345 },
  ];

  // Each should parse safely without throwing
  for (const tx of invalidTxs) {
    const parsed = parseTransactionDate(tx.date, REF_DATE);
    assert(parsed.isValid === false, `Date ${JSON.stringify(tx.date)} safely returns isValid: false`);
    assert(isTransactionInPeriod(tx, 'current', REF_DATE) === false, `Excluded from 'current'`);
    assert(isTransactionInPeriod(tx, 'last', REF_DATE) === false, `Excluded from 'last'`);
    assert(isTransactionInPeriod(tx, 'all', REF_DATE) === true, `Safely included in 'all'`);
  }

  const resAll = calculatePeriodAnalytics(invalidTxs, 'all', REF_DATE);
  assert(resAll.transactionCount === 5, 'All-period filter handles invalid dates cleanly');
  assert(resAll.totalExpenses === 500, 'Aggregates amounts cleanly in all-period');
}

// -------------------------------------------------------------------
// 14. Analytics Updates After Editing a Transaction
// -------------------------------------------------------------------
console.log('\nTest 14: Analytics Updates After Editing a Transaction');
{
  let stateTransactions = [
    { id: 'tx-1', type: 'expense', amount: 100, category: 'طعام', categoryKey: 'food', date: '2026-10-01' },
    { id: 'tx-2', type: 'expense', amount: 50, category: 'مواصلات', categoryKey: 'transport', date: '2026-10-02' },
  ];
  const initialAnalytics = calculatePeriodAnalytics(stateTransactions, 'current', REF_DATE);
  assert(initialAnalytics.totalExpenses === 150, 'Initial total expenses: 150');

  // Edit tx-1: increase amount from 100 to 250
  stateTransactions = stateTransactions.map((t) =>
    t.id === 'tx-1' ? { ...t, amount: 250, title: 'عشاء فاخر' } : t
  );

  const updatedAnalytics = calculatePeriodAnalytics(stateTransactions, 'current', REF_DATE);
  assert(updatedAnalytics.totalExpenses === 300, `Updated total expenses: 300 === ${updatedAnalytics.totalExpenses}`);
  const foodCat = updatedAnalytics.categories.find((c) => c.key === 'food');
  assert(foodCat.amount === 250, `Food category updated: 250 === ${foodCat.amount}`);
  assert(foodCat.percentage === 83.3, `Food percentage updated: 83.3% === ${foodCat.percentage}%`);
}

// -------------------------------------------------------------------
// 15. Analytics Updates After Deleting a Transaction
// -------------------------------------------------------------------
console.log('\nTest 15: Analytics Updates After Deleting a Transaction');
{
  let stateTransactions = [
    { id: 'tx-1', type: 'expense', amount: 120, category: 'طعام', categoryKey: 'food', date: '2026-10-01' },
    { id: 'tx-2', type: 'income', amount: 1500, category: 'دخل', categoryKey: 'income', date: '2026-10-02' },
  ];
  const beforeDelete = calculatePeriodAnalytics(stateTransactions, 'current', REF_DATE);
  assert(beforeDelete.totalIncome === 1500, 'Before delete income: 1500');
  assert(beforeDelete.transactionCount === 2, 'Before delete count: 2');

  // Delete income tx-2
  stateTransactions = stateTransactions.filter((t) => t.id !== 'tx-2');

  const afterDelete = calculatePeriodAnalytics(stateTransactions, 'current', REF_DATE);
  assert(afterDelete.totalIncome === 0, 'After deleting income, total income is 0');
  assert(afterDelete.transactionCount === 1, 'Transaction count decremented to 1');
  assert(afterDelete.netCashFlow === -120, 'Net cash flow reflects deletion (-120)');
}

// -------------------------------------------------------------------
// 16. Analytics Updates After Changing Transaction Type or Category
// -------------------------------------------------------------------
console.log('\nTest 16: Analytics Updates After Changing Transaction Type or Category');
{
  let stateTransactions = [
    { id: 'tx-1', type: 'expense', amount: 200, category: 'طعام', categoryKey: 'food', date: '2026-10-01' },
    { id: 'tx-2', type: 'expense', amount: 100, category: 'مواصلات', categoryKey: 'transport', date: '2026-10-02' },
  ];

  // A. Change category of tx-1 from food to transport
  stateTransactions = stateTransactions.map((t) =>
    t.id === 'tx-1' ? { ...t, category: 'مواصلات', categoryKey: 'transport' } : t
  );

  let analyticsCatChange = calculatePeriodAnalytics(stateTransactions, 'current', REF_DATE);
  assert(analyticsCatChange.categories.length === 1, 'Now only 1 category exists (transport)');
  assert(analyticsCatChange.categories[0].key === 'transport', 'Transport is the sole category');
  assert(analyticsCatChange.categories[0].amount === 300, 'Transport total aggregated to 300');
  assert(analyticsCatChange.totalExpenses === 300, 'Total expenses remains 300');

  // B. Change type of tx-2 from expense to income
  stateTransactions = stateTransactions.map((t) =>
    t.id === 'tx-2' ? { ...t, type: 'income', category: 'دخل', categoryKey: 'income' } : t
  );

  let analyticsTypeChange = calculatePeriodAnalytics(stateTransactions, 'current', REF_DATE);
  assert(analyticsTypeChange.totalExpenses === 200, 'Total expenses decreased by 100 to 200');
  assert(analyticsTypeChange.totalIncome === 100, 'Total income increased by 100 to 100');
  assert(analyticsTypeChange.netCashFlow === -100, 'Net cash flow recalculated to 100 - 200 = -100');
  assert(!analyticsTypeChange.categories.some((c) => c.key === 'income'), 'Income is excluded from categories');
}

// -------------------------------------------------------------------
// 17. Monthly Trend Calculations Verification
// -------------------------------------------------------------------
console.log('\nTest 17: Monthly Trend Calculations Verification');
{
  const txList = [
    { id: '1', type: 'expense', amount: 300, date: '2026-10-05' },
    { id: '2', type: 'expense', amount: 500, date: '2026-09-15' },
    { id: '3', type: 'expense', amount: 200, date: '2026-08-20' },
  ];
  const trends = calculateMonthlyTrends(txList, REF_DATE, 6);
  assert(trends.length === 6, `Trends returns exactly 6 months (actual: ${trends.length})`);

  const currentMonthTrend = trends.find((t) => t.isActive);
  assert(currentMonthTrend && currentMonthTrend.expenses === 300, `Current month expenses in trend: 300 === ${currentMonthTrend?.expenses}`);

  const sepTrend = trends.find((t) => t.monthKey === '2026-9');
  assert(sepTrend && sepTrend.expenses === 500, `September expenses in trend: 500 === ${sepTrend?.expenses}`);
}

// -------------------------------------------------------------------
// 18. Initial Demo Transactions Baseline Verification
// -------------------------------------------------------------------
console.log('\nTest 18: Initial Demo Transactions Baseline Verification');
{
  // In demo data, tx-1 (120), tx-2 (25), tx-3 (340), tx-4 (180), tx-5 (1500 income)
  const resDemo = calculatePeriodAnalytics(INITIAL_TRANSACTIONS, 'current', REF_DATE);
  assert(resDemo.transactionCount === 5, `Demo contains 5 transactions in current month: ${resDemo.transactionCount}`);
  assert(resDemo.totalExpenses === 665, `Demo recorded expenses: 665 === ${resDemo.totalExpenses}`);
  assert(resDemo.totalIncome === 1500, `Demo recorded income: 1500 === ${resDemo.totalIncome}`);
  assert(resDemo.netCashFlow === 835, `Demo net cash flow: 835 === ${resDemo.netCashFlow}`);
}

console.log('\n======================================================');
console.log(`TOTAL TESTS: ${passedTests + failedTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log('======================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
