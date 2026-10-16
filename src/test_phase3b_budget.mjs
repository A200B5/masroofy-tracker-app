/**
 * Phase 3B: Budget Management Verification Suite for Masroofy Tracker
 *
 * Verifies all 18 requirements:
 * 1. Creating a valid budget.
 * 2. Rejecting zero, negative, non-numeric, and infinite budget amounts.
 * 3. Calculating monthly recorded expenses correctly.
 * 4. Excluding income from budget usage.
 * 5. Calculating remaining budget.
 * 6. Calculating usage percentages accurately.
 * 7. Handling an exceeded budget.
 * 8. Handling a month with no expenses.
 * 9. Filtering transactions by calendar month and year.
 * 10. Updating usage after adding a transaction.
 * 11. Updating usage after editing an amount.
 * 12. Updating usage after changing transaction type.
 * 13. Updating usage after changing transaction date.
 * 14. Updating usage after deleting a transaction.
 * 15. Persisting the budget after reload.
 * 16. Handling invalid or corrupted stored budget data.
 * 17. Avoiding division-by-zero and invalid progress values.
 * 18. Preserving existing financial integrity.
 */

import {
  validateBudgetAmount,
  parseStoredBudget,
  calculateCurrentMonthExpenses,
  calculateBudgetUsage,
  BUDGET_STATUS,
} from './utils/budget.js';
import { INITIAL_BALANCE, INITIAL_TRANSACTIONS, INITIAL_USER } from './data/mockData.js';

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
console.log('   MASROOFY TRACKER — PHASE 3B BUDGET MANAGEMENT      ');
console.log('======================================================\n');

// Reference date for testing: October 15, 2026
const REF_DATE = new Date('2026-10-15T12:00:00Z');

// -------------------------------------------------------------------
// 1. Creating a Valid Budget
// -------------------------------------------------------------------
console.log('Test 1: Creating a Valid Budget');
{
  const valInt = validateBudgetAmount(1000);
  assert(valInt.isValid && valInt.cleanAmount === 1000, 'Valid integer budget accepted: 1000');

  const valDec = validateBudgetAmount(2500.75);
  assert(valDec.isValid && valDec.cleanAmount === 2500.75, 'Decimal budget accepted: 2500.75');

  const valStr = validateBudgetAmount('1500.50');
  assert(valStr.isValid && valStr.cleanAmount === 1500.5, 'String numeric budget parsed: 1500.50');

  const parsed = parseStoredBudget({ limit: 1200 });
  assert(parsed && parsed.limit === 1200, 'Parsed stored budget object successfully: 1200');
}

// -------------------------------------------------------------------
// 2. Rejecting Zero, Negative, Non-numeric, and Infinite Amounts
// -------------------------------------------------------------------
console.log('\nTest 2: Rejecting Invalid Budget Amounts');
{
  const invalidInputs = [
    { input: 0, reason: 'zero' },
    { input: -100, reason: 'negative integer' },
    { input: -0.01, reason: 'negative decimal' },
    { input: NaN, reason: 'NaN' },
    { input: 'abc', reason: 'non-numeric string' },
    { input: '', reason: 'empty string' },
    { input: null, reason: 'null' },
    { input: undefined, reason: 'undefined' },
    { input: Infinity, reason: 'positive infinity' },
    { input: -Infinity, reason: 'negative infinity' },
  ];

  for (const { input, reason } of invalidInputs) {
    const res = validateBudgetAmount(input);
    assert(res.isValid === false && res.cleanAmount === null, `Rejected ${reason} (${input})`);
    assert(typeof res.error === 'string' && res.error.length > 0, `Error message provided for ${reason}`);
  }
}

// -------------------------------------------------------------------
// 3. Calculating Monthly Recorded Expenses Correctly
// -------------------------------------------------------------------
console.log('\nTest 3: Calculating Monthly Recorded Expenses');
{
  // In demo data, October expenses are:
  // tx-1: 120, tx-2: 25, tx-3: 340, tx-4: 180 = 665
  const spent = calculateCurrentMonthExpenses(INITIAL_TRANSACTIONS, REF_DATE);
  assert(spent === 665, `Monthly recorded expenses calculated accurately: 665 === ${spent}`);
}

// -------------------------------------------------------------------
// 4. Excluding Income from Budget Usage
// -------------------------------------------------------------------
console.log('\nTest 4: Excluding Income from Budget Usage');
{
  const txWithIncome = [
    { id: '1', type: 'expense', amount: 400, date: '2026-10-01' },
    { id: '2', type: 'income', amount: 5000, date: '2026-10-02' },
    { id: '3', type: 'income', amount: 1500, date: '2026-10-03' },
  ];
  const spent = calculateCurrentMonthExpenses(txWithIncome, REF_DATE);
  assert(spent === 400, `Income of 6500 strictly excluded from expenses: 400 === ${spent}`);

  const usage = calculateBudgetUsage(1000, txWithIncome, REF_DATE);
  assert(usage.spent === 400, 'Budget usage spent reflects only expense transactions (400)');
  assert(usage.remaining === 600, 'Remaining budget unaffected by income (600)');
}

// -------------------------------------------------------------------
// 5. Calculating Remaining Budget
// -------------------------------------------------------------------
console.log('\nTest 5: Calculating Remaining Budget');
{
  const usage1 = calculateBudgetUsage(1000, INITIAL_TRANSACTIONS, REF_DATE);
  assert(usage1.remaining === 335, `Remaining: 1000 - 665 = 335 strictly (${usage1.remaining})`);

  const txDecimal = [
    { id: '1', type: 'expense', amount: 1200.25, date: '2026-10-01' },
  ];
  const usage2 = calculateBudgetUsage(2500.5, txDecimal, REF_DATE);
  assert(usage2.remaining === 1300.25, `Decimal remaining: 2500.50 - 1200.25 = 1300.25 strictly (${usage2.remaining})`);
}

// -------------------------------------------------------------------
// 6. Calculating Usage Percentages Accurately
// -------------------------------------------------------------------
console.log('\nTest 6: Calculating Usage Percentages');
{
  const usage = calculateBudgetUsage(1000, INITIAL_TRANSACTIONS, REF_DATE);
  // 665 / 1000 = 66.5%
  assert(usage.percentage === 66.5, `Usage percentage calculated accurately: 66.5% === ${usage.percentage}%`);
  assert(usage.progressBarWidth === 66.5, `Progress bar width matches percentage: 66.5%`);
  assert(usage.status === BUDGET_STATUS.NORMAL, `Status is NORMAL (< 80%): ${usage.status}`);

  // Test 85% threshold
  const tx850 = [{ id: '1', type: 'expense', amount: 850, date: '2026-10-01' }];
  const usage85 = calculateBudgetUsage(1000, tx850, REF_DATE);
  assert(usage85.percentage === 85.0, `85.0% usage`);
  assert(usage85.status === BUDGET_STATUS.WARNING, `Status is WARNING (>= 80% and < 100%)`);
}

// -------------------------------------------------------------------
// 7. Handling an Exceeded Budget
// -------------------------------------------------------------------
console.log('\nTest 7: Handling an Exceeded Budget');
{
  // Limit = 500, spent = 665
  const usage = calculateBudgetUsage(500, INITIAL_TRANSACTIONS, REF_DATE);
  assert(usage.isOverBudget === true, 'isOverBudget flag is true');
  assert(usage.overAmount === 165, `Over-budget amount clearly calculated: 165 === ${usage.overAmount}`);
  assert(usage.remaining === 0, 'Remaining is 0 (not a misleading negative number without explanation)');
  assert(usage.percentage === 133.0, `Percentage is 133.0% === ${usage.percentage}%`);
  assert(usage.progressBarWidth === 100, 'Progress bar width is clamped at 100% max');
  assert(usage.status === BUDGET_STATUS.EXCEEDED, `Status is EXCEEDED: ${usage.status}`);
  assert(usage.statusText.includes('تجاوزت'), 'Arabic warning message clearly communicates over-budget state');
}

// -------------------------------------------------------------------
// 8. Handling a Month with No Expenses
// -------------------------------------------------------------------
console.log('\nTest 8: Handling a Month with No Expenses');
{
  const usage = calculateBudgetUsage(1000, [], REF_DATE);
  assert(usage.spent === 0, 'Spent is 0');
  assert(usage.remaining === 1000, 'Remaining is 1000 (full limit)');
  assert(usage.percentage === 0, 'Percentage is 0%');
  assert(usage.progressBarWidth === 0, 'Progress bar width is 0%');
  assert(usage.isOverBudget === false, 'Not over budget');
  assert(usage.status === BUDGET_STATUS.NORMAL, 'Status is NORMAL');
}

// -------------------------------------------------------------------
// 9. Filtering Transactions by Calendar Month and Year
// -------------------------------------------------------------------
console.log('\nTest 9: Filtering Transactions by Calendar Month and Year');
{
  const multiMonthTx = [
    { id: '1', type: 'expense', amount: 100, date: '2026-10-01' }, // Current month (Oct 2026)
    { id: '2', type: 'expense', amount: 200, date: '2026-09-15' }, // Sep 2026 (last month)
    { id: '3', type: 'expense', amount: 300, date: '2025-10-01' }, // Oct 2025 (last year)
    { id: '4', type: 'expense', amount: 400, date: '2026-11-01' }, // Nov 2026 (future month)
  ];
  const spent = calculateCurrentMonthExpenses(multiMonthTx, REF_DATE);
  assert(spent === 100, `Only October 2026 transactions counted in budget: 100 === ${spent}`);
}

// -------------------------------------------------------------------
// 10. Updating Usage After Adding a Transaction
// -------------------------------------------------------------------
console.log('\nTest 10: Updating Usage After Adding a Transaction');
{
  let txList = [...INITIAL_TRANSACTIONS];
  const beforeAdd = calculateBudgetUsage(1000, txList, REF_DATE);
  assert(beforeAdd.spent === 665, 'Spent before add: 665');

  // Add 150 expense in current month
  txList = [{ id: 'tx-new', type: 'expense', amount: 150, date: '2026-10-15' }, ...txList];
  const afterAdd = calculateBudgetUsage(1000, txList, REF_DATE);
  assert(afterAdd.spent === 815, `Spent updated after add: 815 === ${afterAdd.spent}`);
  assert(afterAdd.remaining === 185, `Remaining updated: 185 === ${afterAdd.remaining}`);
  assert(afterAdd.percentage === 81.5, `Percentage updated: 81.5%`);
  assert(afterAdd.status === BUDGET_STATUS.WARNING, `Status escalated to WARNING (81.5%)`);
}

// -------------------------------------------------------------------
// 11. Updating Usage After Editing an Amount
// -------------------------------------------------------------------
console.log('\nTest 11: Updating Usage After Editing an Amount');
{
  let txList = [...INITIAL_TRANSACTIONS];
  // Edit tx-1 (food) from 120 to 320 (+200)
  txList = txList.map((t) => (t.id === 'tx-1' ? { ...t, amount: 320 } : t));

  const usage = calculateBudgetUsage(1000, txList, REF_DATE);
  assert(usage.spent === 865, `Spent updated after amount edit: 865 === ${usage.spent}`);
  assert(usage.remaining === 135, `Remaining updated: 135 === ${usage.remaining}`);
  assert(usage.percentage === 86.5, `Percentage updated: 86.5%`);
}

// -------------------------------------------------------------------
// 12. Updating Usage After Changing Transaction Type
// -------------------------------------------------------------------
console.log('\nTest 12: Updating Usage After Changing Transaction Type');
{
  let txList = [...INITIAL_TRANSACTIONS];
  // Change tx-4 (180 expense) into income
  txList = txList.map((t) => (t.id === 'tx-4' ? { ...t, type: 'income' } : t));

  const usageAfterTypeChange = calculateBudgetUsage(1000, txList, REF_DATE);
  assert(usageAfterTypeChange.spent === 485, `Spent decreased by 180 to 485 === ${usageAfterTypeChange.spent}`);

  // Change tx-5 (1500 income) into expense
  txList = txList.map((t) => (t.id === 'tx-5' ? { ...t, type: 'expense' } : t));
  const usageAfterIncomeToExpense = calculateBudgetUsage(1000, txList, REF_DATE);
  assert(usageAfterIncomeToExpense.spent === 1985, `Spent increased by 1500 to 1985 === ${usageAfterIncomeToExpense.spent}`);
  assert(usageAfterIncomeToExpense.isOverBudget === true, 'Exceeded budget flagged');
}

// -------------------------------------------------------------------
// 13. Updating Usage After Changing Transaction Date
// -------------------------------------------------------------------
console.log('\nTest 13: Updating Usage After Changing Transaction Date');
{
  let txList = [...INITIAL_TRANSACTIONS];
  // Move tx-3 (340 expense) from October into September
  txList = txList.map((t) => (t.id === 'tx-3' ? { ...t, date: '2026-09-20' } : t));

  const usageMovedOut = calculateBudgetUsage(1000, txList, REF_DATE);
  assert(usageMovedOut.spent === 325, `Spent reduced by 340 when moved out of month: 325 === ${usageMovedOut.spent}`);

  // Move it back into October
  txList = txList.map((t) => (t.id === 'tx-3' ? { ...t, date: '2026-10-14' } : t));
  const usageMovedBack = calculateBudgetUsage(1000, txList, REF_DATE);
  assert(usageMovedBack.spent === 665, `Spent restored to 665 when moved into month: ${usageMovedBack.spent}`);
}

// -------------------------------------------------------------------
// 14. Updating Usage After Deleting a Transaction
// -------------------------------------------------------------------
console.log('\nTest 14: Updating Usage After Deleting a Transaction');
{
  let txList = [...INITIAL_TRANSACTIONS];
  // Delete tx-3 (340 expense)
  txList = txList.filter((t) => t.id !== 'tx-3');

  const usage = calculateBudgetUsage(1000, txList, REF_DATE);
  assert(usage.spent === 325, `Spent reduced to 325 after deleting tx-3: ${usage.spent}`);
  assert(usage.remaining === 675, `Remaining increased to 675: ${usage.remaining}`);
}

// -------------------------------------------------------------------
// 15. Persisting the Budget After Reload
// -------------------------------------------------------------------
console.log('\nTest 15: Persisting the Budget After Reload');
{
  const mockStorage = {};
  const budgetObj = { limit: 1500, updatedAt: '2026-10-15T12:00:00Z' };
  mockStorage['masroofy_budget'] = JSON.stringify(budgetObj);

  const restored = parseStoredBudget(mockStorage['masroofy_budget']);
  assert(restored !== null, 'Restored budget is not null');
  assert(restored.limit === 1500, `Restored budget limit is 1500 === ${restored.limit}`);

  // Calculate usage with restored budget
  const usage = calculateBudgetUsage(restored, INITIAL_TRANSACTIONS, REF_DATE);
  assert(usage.isConfigured === true, 'Usage shows budget is configured');
  assert(usage.limit === 1500, 'Usage limit is 1500');
  assert(usage.remaining === 835, `Remaining is 1500 - 665 = 835 === ${usage.remaining}`);
}

// -------------------------------------------------------------------
// 16. Handling Invalid or Corrupted Stored Budget Data
// -------------------------------------------------------------------
console.log('\nTest 16: Handling Invalid or Corrupted Stored Budget Data');
{
  const corruptedSamples = [
    null,
    undefined,
    '',
    '{ bad json }',
    '{"limit": -100}',
    '{"limit": "invalid"}',
    '{"limit": 0}',
    '{"limit": null}',
    '{"otherKey": 123}',
    12345, // direct number supported if > 0, but what about negative?
    -500,
  ];

  for (const sample of corruptedSamples) {
    if (typeof sample === 'number' && sample > 0) continue; // positive numbers are valid
    const parsed = parseStoredBudget(sample);
    if (parsed !== null) {
      assert(false, `Expected null for corrupted sample: ${JSON.stringify(sample)}`);
    } else {
      assert(parsed === null, `Safely returned null for: ${JSON.stringify(sample)}`);
    }
  }

  // When corrupted, calculateBudgetUsage returns unconfigured setup state without crashing
  const safeUsage = calculateBudgetUsage('{ corrupted json }', INITIAL_TRANSACTIONS, REF_DATE);
  assert(safeUsage.isConfigured === false, 'Corrupted data yields isConfigured: false');
  assert(safeUsage.status === BUDGET_STATUS.NO_BUDGET, 'Status is NO_BUDGET');
  assert(safeUsage.statusText.includes('لم يتم تحديد'), 'Appropriate setup text returned');
}

// -------------------------------------------------------------------
// 17. Avoiding Division-by-Zero and Invalid Progress Values
// -------------------------------------------------------------------
console.log('\nTest 17: Avoiding Division-by-Zero and Invalid Progress Values');
{
  // Zero limit (unconfigured)
  const zeroUsage = calculateBudgetUsage(0, INITIAL_TRANSACTIONS, REF_DATE);
  assert(zeroUsage.percentage === 0, 'Zero limit returns 0 percentage without division by zero');
  assert(!isNaN(zeroUsage.percentage), 'No NaN percentage');

  // Huge spending clamp
  const hugeTx = [{ id: '1', type: 'expense', amount: 50000, date: '2026-10-01' }];
  const hugeUsage = calculateBudgetUsage(1000, hugeTx, REF_DATE);
  assert(hugeUsage.percentage === 5000.0, 'Calculates actual percentage: 5000%');
  assert(hugeUsage.progressBarWidth === 100, 'Progress bar width is clamped at exactly 100%');
}

// -------------------------------------------------------------------
// 18. Preserving Existing Financial Integrity
// -------------------------------------------------------------------
console.log('\nTest 18: Preserving Existing Financial Integrity');
{
  // Setting a budget does not touch INITIAL_BALANCE or INITIAL_TRANSACTIONS
  const balanceSnapshot = JSON.stringify(INITIAL_BALANCE);
  const txSnapshot = JSON.stringify(INITIAL_TRANSACTIONS);
  const userSnapshot = JSON.stringify(INITIAL_USER);

  // Perform multiple budget calculations
  calculateBudgetUsage(500, INITIAL_TRANSACTIONS, REF_DATE);
  calculateBudgetUsage(2000, INITIAL_TRANSACTIONS, REF_DATE);
  calculateCurrentMonthExpenses(INITIAL_TRANSACTIONS, REF_DATE);

  assert(JSON.stringify(INITIAL_BALANCE) === balanceSnapshot, 'INITIAL_BALANCE is 100% unaltered');
  assert(JSON.stringify(INITIAL_TRANSACTIONS) === txSnapshot, 'INITIAL_TRANSACTIONS is 100% unaltered');
  assert(JSON.stringify(INITIAL_USER) === userSnapshot, 'INITIAL_USER is 100% unaltered');

  // Verify core financial equation remains untouched
  assert(
    INITIAL_BALANCE.current === INITIAL_BALANCE.income - INITIAL_BALANCE.expenses,
    'Core balance equation 5250 === 7590 - 2340 perfectly intact'
  );
}

console.log('\n======================================================');
console.log(`TOTAL TESTS: ${passedTests + failedTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log('======================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
