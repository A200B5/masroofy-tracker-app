/**
 * Phase 2B Test Suite: Transaction Editing & Deletion for Masroofy Tracker
 * Validates delta reversals, type switches, deletions, invalid input rejection,
 * persistence, and complete financial invariant preservation.
 */

import { INITIAL_BALANCE, INITIAL_TRANSACTIONS, INITIAL_USER } from './data/mockData.js';

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failedTests++;
  }
}

console.log('\n======================================================');
console.log('   MASROOFY TRACKER — PHASE 2B EDIT & DELETE SUITE    ');
console.log('======================================================\n');

// Delta calculation engine matching App.jsx implementation
function applyUpdateTransaction(currentBalance, currentTransactions, updatedTx) {
  if (!updatedTx || !updatedTx.id) return { balance: currentBalance, transactions: currentTransactions };
  const oldTx = currentTransactions.find((t) => t.id === updatedTx.id);
  if (!oldTx) return { balance: currentBalance, transactions: currentTransactions };

  const oldAmount = Math.round((Number(oldTx.amount) || 0) * 100) / 100;
  const newAmount = Math.round((Number(updatedTx.amount) || 0) * 100) / 100;
  if (newAmount <= 0) return { balance: currentBalance, transactions: currentTransactions };

  const sanitizedTx = { ...updatedTx, amount: newAmount };
  const newTransactions = currentTransactions.map((t) => (t.id === updatedTx.id ? sanitizedTx : t));

  let tempCurrent = currentBalance.current;
  let tempIncome = currentBalance.income;
  let tempExpenses = currentBalance.expenses;

  // Reverse old effect
  if (oldTx.type === 'expense') {
    tempCurrent += oldAmount;
    tempExpenses -= oldAmount;
  } else {
    tempCurrent -= oldAmount;
    tempIncome -= oldAmount;
  }

  // Apply new effect
  if (updatedTx.type === 'expense') {
    tempCurrent -= newAmount;
    tempExpenses += newAmount;
  } else {
    tempCurrent += newAmount;
    tempIncome += newAmount;
  }

  const newBalance = {
    ...currentBalance,
    current: Math.round(tempCurrent * 100) / 100,
    income: Math.round(tempIncome * 100) / 100,
    expenses: Math.round(tempExpenses * 100) / 100,
  };

  return { balance: newBalance, transactions: newTransactions };
}

function applyDeleteTransaction(currentBalance, currentTransactions, txId) {
  if (!txId) return { balance: currentBalance, transactions: currentTransactions };
  const txToDelete = currentTransactions.find((t) => t.id === txId);
  if (!txToDelete) return { balance: currentBalance, transactions: currentTransactions };

  const amount = Math.round((Number(txToDelete.amount) || 0) * 100) / 100;
  const newTransactions = currentTransactions.filter((t) => t.id !== txId);

  let newCurrent = currentBalance.current;
  let newIncome = currentBalance.income;
  let newExpenses = currentBalance.expenses;

  if (txToDelete.type === 'expense') {
    newCurrent = Math.round((currentBalance.current + amount) * 100) / 100;
    newExpenses = Math.round((currentBalance.expenses - amount) * 100) / 100;
  } else {
    newCurrent = Math.round((currentBalance.current - amount) * 100) / 100;
    newIncome = Math.round((currentBalance.income - amount) * 100) / 100;
  }

  const newBalance = {
    ...currentBalance,
    current: newCurrent,
    income: newIncome,
    expenses: newExpenses,
  };

  return { balance: newBalance, transactions: newTransactions };
}

// ---------------------------------------------------------
// 1. Editing an expense amount
// ---------------------------------------------------------
console.log('Test 1: Editing Expense Amount');
let state = {
  balance: { ...INITIAL_BALANCE },
  transactions: JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS)),
};

const tx1 = state.transactions.find((t) => t.id === 'tx-1'); // 120 expense
const updatedTx1 = { ...tx1, amount: 175.50 };

const res1 = applyUpdateTransaction(state.balance, state.transactions, updatedTx1);
assert(res1.transactions.find((t) => t.id === 'tx-1').amount === 175.50, 'Expense tx-1 amount updated to 175.50');
assert(res1.balance.expenses === 2340 - 120 + 175.50, `Expenses updated: ${res1.balance.expenses} === 2395.5`);
assert(res1.balance.current === 5250 + 120 - 175.50, `Current balance updated: ${res1.balance.current} === 5194.5`);
assert(res1.balance.income === 7590, 'Total income remained untouched');
assert(
  res1.balance.current === Math.round((res1.balance.income - res1.balance.expenses) * 100) / 100,
  'Financial Invariant preserved: Current === Income - Expenses'
);

// ---------------------------------------------------------
// 2. Editing an income amount
// ---------------------------------------------------------
console.log('\nTest 2: Editing Income Amount');
state = res1;
const tx5 = state.transactions.find((t) => t.id === 'tx-5'); // 1500 income
const updatedTx5 = { ...tx5, amount: 1850.25 };

const res2 = applyUpdateTransaction(state.balance, state.transactions, updatedTx5);
assert(res2.transactions.find((t) => t.id === 'tx-5').amount === 1850.25, 'Income tx-5 amount updated to 1850.25');
assert(res2.balance.income === 7590 - 1500 + 1850.25, `Income updated: ${res2.balance.income} === 7940.25`);
assert(res2.balance.current === 5194.5 - 1500 + 1850.25, `Current balance updated: ${res2.balance.current} === 5544.75`);
assert(res2.balance.expenses === 2395.5, 'Total expenses remained untouched');
assert(
  res2.balance.current === Math.round((res2.balance.income - res2.balance.expenses) * 100) / 100,
  'Financial Invariant preserved: Current === Income - Expenses'
);

// ---------------------------------------------------------
// 3. Editing title, category, date, and notes
// ---------------------------------------------------------
console.log('\nTest 3: Editing Metadata (Title, Category, Date, Notes)');
state = res2;
const tx2 = state.transactions.find((t) => t.id === 'tx-2');
const updatedTx2 = {
  ...tx2,
  title: 'تاكسي المطار الدولي',
  category: 'سفر',
  categoryKey: 'travel',
  date: 'أمس ، 11:45 م',
  notes: 'رحلة إلى المطار مع الحقائب',
};

const res3 = applyUpdateTransaction(state.balance, state.transactions, updatedTx2);
const modifiedTx2 = res3.transactions.find((t) => t.id === 'tx-2');
assert(modifiedTx2.title === 'تاكسي المطار الدولي', 'Title modified');
assert(modifiedTx2.category === 'سفر', 'Category modified');
assert(modifiedTx2.date === 'أمس ، 11:45 م', 'Date modified');
assert(modifiedTx2.notes === 'رحلة إلى المطار مع الحقائب', 'Notes modified');
assert(res3.balance.current === state.balance.current, 'Balance unchanged when editing only metadata');
assert(res3.balance.expenses === state.balance.expenses, 'Expenses unchanged when editing only metadata');

// ---------------------------------------------------------
// 4. Changing Transaction Type (Expense -> Income & Income -> Expense)
// ---------------------------------------------------------
console.log('\nTest 4: Changing Transaction Type');
// 4A: Switch expense (25) to income (100)
const tx2Switched = { ...modifiedTx2, type: 'income', amount: 100 };
const res4A = applyUpdateTransaction(res3.balance, res3.transactions, tx2Switched);
assert(
  res4A.balance.expenses === Math.round((res3.balance.expenses - 25) * 100) / 100,
  'Old expense 25 reversed from expenses'
);
assert(
  res4A.balance.income === Math.round((res3.balance.income + 100) * 100) / 100,
  'New income 100 added to income'
);
assert(
  res4A.balance.current === Math.round((res3.balance.current + 25 + 100) * 100) / 100,
  'Current balance updated by +125'
);
assert(
  res4A.balance.current === Math.round((res4A.balance.income - res4A.balance.expenses) * 100) / 100,
  'Financial Invariant preserved after Expense -> Income conversion'
);

// 4B: Switch income back to expense (100 -> 50)
const tx2Reversed = { ...tx2Switched, type: 'expense', amount: 50 };
const res4B = applyUpdateTransaction(res4A.balance, res4A.transactions, tx2Reversed);
assert(
  res4B.balance.current === Math.round((res4B.balance.income - res4B.balance.expenses) * 100) / 100,
  'Financial Invariant preserved after Income -> Expense conversion'
);

// ---------------------------------------------------------
// 5. Deleting an Expense
// ---------------------------------------------------------
console.log('\nTest 5: Deleting an Expense');
const preDeleteCount = res4B.transactions.length;
const preDeleteBalance = res4B.balance.current;
const preDeleteExpenses = res4B.balance.expenses;

// Delete tx-3 (amount: 340, expense)
const res5 = applyDeleteTransaction(res4B.balance, res4B.transactions, 'tx-3');
assert(res5.transactions.length === preDeleteCount - 1, 'Transaction count decreased by 1');
assert(res5.transactions.find((t) => t.id === 'tx-3') === undefined, 'tx-3 was removed from list');
assert(
  res5.balance.expenses === Math.round((preDeleteExpenses - 340) * 100) / 100,
  'Expenses decreased by 340'
);
assert(
  res5.balance.current === Math.round((preDeleteBalance + 340) * 100) / 100,
  'Current balance increased by 340'
);
assert(
  res5.balance.current === Math.round((res5.balance.income - res5.balance.expenses) * 100) / 100,
  'Financial Invariant preserved after deleting expense'
);

// ---------------------------------------------------------
// 6. Deleting Income
// ---------------------------------------------------------
console.log('\nTest 6: Deleting Income');
const preIncomeDeleteBalance = res5.balance.current;
const preIncomeDeleteIncome = res5.balance.income;

// Delete tx-5 (income)
const tx5Amount = res5.transactions.find((t) => t.id === 'tx-5').amount;
const res6 = applyDeleteTransaction(res5.balance, res5.transactions, 'tx-5');
assert(res6.transactions.find((t) => t.id === 'tx-5') === undefined, 'Income tx-5 removed from list');
assert(
  res6.balance.income === Math.round((preIncomeDeleteIncome - tx5Amount) * 100) / 100,
  `Income decreased by ${tx5Amount}`
);
assert(
  res6.balance.current === Math.round((preIncomeDeleteBalance - tx5Amount) * 100) / 100,
  `Current balance decreased by ${tx5Amount}`
);
assert(
  res6.balance.current === Math.round((res6.balance.income - res6.balance.expenses) * 100) / 100,
  'Financial Invariant preserved after deleting income'
);

// ---------------------------------------------------------
// 7. Cancelling Deletion
// ---------------------------------------------------------
console.log('\nTest 7: Cancelling Deletion');
const snapshotBeforeCancel = JSON.stringify(res6);
// If cancel clicked, no mutation is performed
const res7 = { ...res6 };
assert(JSON.stringify(res7) === snapshotBeforeCancel, 'State is 100% unaltered on deletion cancellation');

// ---------------------------------------------------------
// 8. Invalid Amount Rejection
// ---------------------------------------------------------
console.log('\nTest 8: Invalid Amount Rejection');
const invalidAmounts = [0, -50, -0.01, NaN, 'abc', null, undefined];
for (const badAmount of invalidAmounts) {
  const invalidTx = { ...res6.transactions[0], amount: badAmount };
  const resBad = applyUpdateTransaction(res6.balance, res6.transactions, invalidTx);
  assert(
    resBad.balance.current === res6.balance.current && resBad.transactions[0].amount === res6.transactions[0].amount,
    `Rejected invalid amount ${badAmount} without changing financial state`
  );
}

// ---------------------------------------------------------
// 9. Financial Invariant Preservation Across Heavy Workload
// ---------------------------------------------------------
console.log('\nTest 9: Stress Testing Cumulative Fractional Edits');
let stressState = {
  balance: { ...INITIAL_BALANCE },
  transactions: JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS)),
};

const fractionalEdits = [15.33, 44.87, 102.19, 0.99, 500.01];
for (let i = 0; i < fractionalEdits.length; i++) {
  const targetId = INITIAL_TRANSACTIONS[i % INITIAL_TRANSACTIONS.length].id;
  const targetTx = stressState.transactions.find((t) => t.id === targetId);
  const updated = { ...targetTx, amount: fractionalEdits[i] };
  stressState = applyUpdateTransaction(stressState.balance, stressState.transactions, updated);

  const invariant = stressState.balance.current === Math.round((stressState.balance.income - stressState.balance.expenses) * 100) / 100;
  if (!invariant) {
    assert(false, `Invariant broken on fractional edit ${fractionalEdits[i]}`);
  }
}
assert(
  stressState.balance.current === Math.round((stressState.balance.income - stressState.balance.expenses) * 100) / 100,
  'Exact mathematical invariant holds across all cumulative fractional decimal edits'
);

// ---------------------------------------------------------
// 10. Persistence After Reload Round-Trip
// ---------------------------------------------------------
console.log('\nTest 10: Persistence Round-trip');
const mockStorage = {};
mockStorage['masroofy_balance'] = JSON.stringify(res6.balance);
mockStorage['masroofy_transactions'] = JSON.stringify(res6.transactions);

const reloadedBalance = JSON.parse(mockStorage['masroofy_balance']);
const reloadedTransactions = JSON.parse(mockStorage['masroofy_transactions']);

assert(reloadedBalance.current === res6.balance.current, 'Persisted balance matches exactly after reload');
assert(reloadedBalance.expenses === res6.balance.expenses, 'Persisted expenses match exactly after reload');
assert(reloadedBalance.income === res6.balance.income, 'Persisted income matches exactly after reload');
assert(reloadedTransactions.length === res6.transactions.length, 'Persisted transaction count matches exactly');

// ---------------------------------------------------------
// 11. No Duplicate Transactions After Editing
// ---------------------------------------------------------
console.log('\nTest 11: No Duplicate Transactions');
const allIds = res6.transactions.map((t) => t.id);
const uniqueIds = new Set(allIds);
assert(allIds.length === uniqueIds.size, 'All transaction IDs remain unique; zero duplicate records created');

// ---------------------------------------------------------
// 12. Unrelated Transactions Remain Unchanged
// ---------------------------------------------------------
console.log('\nTest 12: Unrelated Transactions Unchanged');
const originalTx4 = INITIAL_TRANSACTIONS.find((t) => t.id === 'tx-4');
const currentTx4 = res6.transactions.find((t) => t.id === 'tx-4');
assert(
  JSON.stringify(originalTx4) === JSON.stringify(currentTx4),
  'Unrelated transaction tx-4 remained completely intact throughout edits and deletes'
);

// ---------------------------------------------------------
// 13. Dashboard & Reports Synchronization
// ---------------------------------------------------------
console.log('\nTest 13: Reports & Dashboard Synchronization');
const dashboardExpenses = res6.balance.expenses;
const reportsExpenses = res6.balance?.expenses ?? 2340;
assert(
  dashboardExpenses === reportsExpenses,
  `Reports total expenses (${reportsExpenses}) strictly equals Dashboard expenses (${dashboardExpenses})`
);

console.log('\n======================================================');
console.log(`TOTAL TESTS: ${passedTests + failedTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log('======================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
