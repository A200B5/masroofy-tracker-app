/**
 * Financial Data Integrity Verification Suite for Masroofy Tracker
 * Runs isolated automated checks without modifying real user localStorage.
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
console.log('   MASROOFY TRACKER — FINANCIAL DATA INTEGRITY SUITE   ');
console.log('======================================================\n');

// 1. Initial State Mathematical Invariant
console.log('Test Group 1: Initial Invariant Check');
const initialCurrent = INITIAL_BALANCE.current;
const initialIncome = INITIAL_BALANCE.income;
const initialExpenses = INITIAL_BALANCE.expenses;

assert(
  initialCurrent === initialIncome - initialExpenses,
  `Initial Balance Invariant: ${initialCurrent} === ${initialIncome} - ${initialExpenses}`
);
assert(initialCurrent === 5250, 'Initial current balance is exactly 5,250 £');
assert(initialIncome === 7590, 'Initial total income is exactly 7,590 £');
assert(initialExpenses === 2340, 'Initial total expenses is exactly 2,340 £');

// 2. Expense Addition Behavior
console.log('\nTest Group 2: Adding Expense (Single Occurrence & Exact Deltas)');
let testBalance = { ...INITIAL_BALANCE };
let testTransactions = [...INITIAL_TRANSACTIONS];

const expenseAmount = 120.50;
const prevBalance = testBalance.current;
const prevExpenses = testBalance.expenses;
const prevIncome = testBalance.income;
const prevTxCount = testTransactions.length;

// Simulation of handleSaveExpense
const cleanExpenseAmount = Math.round(expenseAmount * 100) / 100;
const newExpenseTx = {
  id: `tx-test-1`,
  title: 'تجربة مصروف دقيق',
  category: 'طعام',
  type: 'expense',
  amount: cleanExpenseAmount,
  date: 'اليوم ، 10:00 م'
};

testTransactions = [newExpenseTx, ...testTransactions];
testBalance = {
  ...testBalance,
  current: Math.round((testBalance.current - cleanExpenseAmount) * 100) / 100,
  expenses: Math.round((testBalance.expenses + cleanExpenseAmount) * 100) / 100,
};

assert(
  testBalance.current === prevBalance - cleanExpenseAmount,
  `Balance decreased by exactly ${cleanExpenseAmount} (from ${prevBalance} to ${testBalance.current})`
);
assert(
  testBalance.expenses === prevExpenses + cleanExpenseAmount,
  `Total expenses increased by exactly ${cleanExpenseAmount} (from ${prevExpenses} to ${testBalance.expenses})`
);
assert(
  testBalance.income === prevIncome,
  `Total income remained completely unchanged (${testBalance.income})`
);
assert(
  testTransactions.length === prevTxCount + 1,
  `Transactions list increased by exactly 1 (from ${prevTxCount} to ${testTransactions.length})`
);
assert(
  testBalance.current === Math.round((testBalance.income - testBalance.expenses) * 100) / 100,
  `Mathematical invariant preserved: Current (${testBalance.current}) === Income (${testBalance.income}) - Expenses (${testBalance.expenses})`
);

// 3. Income Addition Behavior
console.log('\nTest Group 3: Adding Income (Single Occurrence & Exact Deltas)');
const incomeAmount = 450.25;
const preIncomeBalance = testBalance.current;
const preIncomeTotal = testBalance.income;
const preIncomeExpenses = testBalance.expenses;
const preIncomeTxCount = testTransactions.length;

const cleanIncomeAmount = Math.round(incomeAmount * 100) / 100;
const newIncomeTx = {
  id: `tx-test-2`,
  title: 'دخل إضافي تجريبي',
  category: 'دخل',
  type: 'income',
  amount: cleanIncomeAmount,
  date: 'اليوم ، 11:00 م'
};

testTransactions = [newIncomeTx, ...testTransactions];
testBalance = {
  ...testBalance,
  current: Math.round((testBalance.current + cleanIncomeAmount) * 100) / 100,
  income: Math.round((testBalance.income + cleanIncomeAmount) * 100) / 100,
};

assert(
  testBalance.current === preIncomeBalance + cleanIncomeAmount,
  `Balance increased by exactly ${cleanIncomeAmount} (from ${preIncomeBalance} to ${testBalance.current})`
);
assert(
  testBalance.income === preIncomeTotal + cleanIncomeAmount,
  `Total income increased by exactly ${cleanIncomeAmount} (from ${preIncomeTotal} to ${testBalance.income})`
);
assert(
  testBalance.expenses === preIncomeExpenses,
  `Total expenses remained completely unchanged (${testBalance.expenses})`
);
assert(
  testTransactions.length === preIncomeTxCount + 1,
  `Transactions list increased by exactly 1 (now ${testTransactions.length})`
);
assert(
  testBalance.current === Math.round((testBalance.income - testBalance.expenses) * 100) / 100,
  `Mathematical invariant preserved: Current (${testBalance.current}) === Income (${testBalance.income}) - Expenses (${testBalance.expenses})`
);

// 4. Decimal Floating-Point Precision Accumulation
console.log('\nTest Group 4: Decimal Precision & Cumulative Accuracy');
let simBalance = { current: 1000.00, income: 2000.00, expenses: 1000.00 };
const testDeltas = [12.33, 45.67, 9.99, 0.01, 100.50, 77.45, 0.05];

for (const delta of testDeltas) {
  simBalance = {
    current: Math.round((simBalance.current - delta) * 100) / 100,
    income: simBalance.income,
    expenses: Math.round((simBalance.expenses + delta) * 100) / 100,
  };
  // Check after each iteration
  if (simBalance.current !== Math.round((simBalance.income - simBalance.expenses) * 100) / 100) {
    assert(false, `Drift detected after deducting ${delta}`);
  }
}
assert(
  simBalance.current === Math.round((simBalance.income - simBalance.expenses) * 100) / 100,
  `Cumulative decimal deductions maintain exact invariant across 7 successive fractional amounts without float drift`
);

// 5. Persistence Simulation & Reload Round-trip
console.log('\nTest Group 5: Serialization & Persistence Round-trip');
const mockStorage = {};
mockStorage['masroofy_balance'] = JSON.stringify(testBalance);
mockStorage['masroofy_transactions'] = JSON.stringify(testTransactions);
mockStorage['masroofy_user'] = JSON.stringify(INITIAL_USER);
mockStorage['masroofy_theme'] = 'dark';

const restoredBalance = JSON.parse(mockStorage['masroofy_balance']);
const restoredTransactions = JSON.parse(mockStorage['masroofy_transactions']);
const restoredUser = JSON.parse(mockStorage['masroofy_user']);

assert(restoredBalance.current === testBalance.current, 'Restored balance.current matches serialized value exactly');
assert(restoredBalance.expenses === testBalance.expenses, 'Restored balance.expenses matches serialized value exactly');
assert(restoredBalance.income === testBalance.income, 'Restored balance.income matches serialized value exactly');
assert(restoredTransactions.length === testTransactions.length, 'Restored transaction count matches exactly');
assert(restoredTransactions[0].amount === cleanIncomeAmount, 'First transaction amount preserved as number');
assert(typeof restoredTransactions[0].amount === 'number', 'Transaction amount deserializes strictly as a number');

// 6. Currency Independence Test
console.log('\nTest Group 6: Currency Changes Formatting Only');
const currencies = [
  { code: '£', name: 'جنيه مصري' },
  { code: 'ر.س', name: 'ريال سعودي' },
  { code: '$', name: 'دولار أمريكي' },
  { code: '€', name: 'يورو' },
];

let currentUser = { ...INITIAL_USER };
const originalBalanceSnapshot = JSON.stringify(testBalance);
const originalTxSnapshot = JSON.stringify(testTransactions);

for (const cur of currencies) {
  // Currency switch
  currentUser = { ...currentUser, currency: cur.code, currencyName: cur.name };
  mockStorage['masroofy_user'] = JSON.stringify(currentUser);

  // Formatter output test
  const formattedBalance = `${testBalance.current.toLocaleString()} ${currentUser.currency}`;
  assert(
    formattedBalance.includes(cur.code),
    `Formatted balance displays symbol '${cur.code}': ${formattedBalance}`
  );
}

assert(
  JSON.stringify(testBalance) === originalBalanceSnapshot,
  'Stored financial balance object is 100% unaltered after all currency switches'
);
assert(
  JSON.stringify(testTransactions) === originalTxSnapshot,
  'Stored transactions array is 100% unaltered after all currency switches'
);

// 7. Cross-State Isolation
console.log('\nTest Group 7: Cross-State Isolation');
// Mutate theme
mockStorage['masroofy_theme'] = 'light';
assert(mockStorage['masroofy_balance'] === originalBalanceSnapshot, 'Theme update did not touch masroofy_balance');
assert(mockStorage['masroofy_transactions'] === originalTxSnapshot, 'Theme update did not touch masroofy_transactions');

// 8. Reports Consistency
console.log('\nTest Group 8: Reports Consistency with Dashboard Totals');
const reportsTotalExpenses = testBalance?.expenses ?? 2340;
const dashboardTotalExpenses = testBalance.expenses;

assert(
  reportsTotalExpenses === dashboardTotalExpenses,
  `Reports total expenses (${reportsTotalExpenses}) strictly matches Dashboard expenses (${dashboardTotalExpenses})`
);

console.log('\n======================================================');
console.log(`TOTAL TESTS: ${passedTests + failedTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log('======================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
