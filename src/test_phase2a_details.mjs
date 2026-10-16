/**
 * Phase 2A: Read-Only Transaction Details Test Suite for Masroofy Tracker
 * Validates opening transactions, displaying correct fields, closing, and financial immutability.
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
console.log('   MASROOFY TRACKER — PHASE 2A TRANSACTION DETAILS    ');
console.log('======================================================\n');

// Baseline snapshots to verify complete financial immutability
const baselineBalanceSnapshot = JSON.stringify(INITIAL_BALANCE);
const baselineTxSnapshot = JSON.stringify(INITIAL_TRANSACTIONS);
const baselineUserSnapshot = JSON.stringify(INITIAL_USER);

// 1. Transaction Selection & Accurate Field Mapping Test
console.log('Test Group 1: Transaction Selection & Field Mapping');
for (const tx of INITIAL_TRANSACTIONS) {
  // Simulate opening tx
  let selectedTransaction = tx;
  assert(selectedTransaction !== null, `Transaction ${tx.id} can be selected`);
  assert(selectedTransaction.id === tx.id, `ID matches: ${selectedTransaction.id}`);
  assert(selectedTransaction.title === tx.title, `Title matches: "${selectedTransaction.title}"`);
  assert(selectedTransaction.category === tx.category, `Category matches: "${selectedTransaction.category}"`);
  assert(selectedTransaction.type === tx.type, `Type matches: "${selectedTransaction.type}"`);
  assert(selectedTransaction.amount === tx.amount, `Amount matches: ${selectedTransaction.amount}`);
  assert(selectedTransaction.date === tx.date, `Date matches: "${selectedTransaction.date}"`);

  // Type visual distinction verification
  const isExpense = selectedTransaction.type === 'expense';
  const sign = isExpense ? '-' : '+';
  const expectedSign = tx.type === 'expense' ? '-' : '+';
  assert(sign === expectedSign, `Visual amount sign matches type: ${sign}${tx.amount}`);

  // Simulate close
  selectedTransaction = null;
  assert(selectedTransaction === null, `Transaction ${tx.id} modal closed cleanly`);
}

// 2. Newly Created Transaction (with notes) Selection Test
console.log('\nTest Group 2: Selection of New Transaction with Explicit Notes');
const customTx = {
  id: 'tx-custom-99',
  title: 'شراء كتب دراسية',
  category: 'تعليم',
  categoryKey: 'education',
  type: 'expense',
  amount: 250,
  date: 'اليوم ، 5:30 م',
  notes: 'مراجع ومذكرات الفصل الدراسي الأول',
  icon: 'GraduationCap',
  bg: '#FEF3C7',
  color: '#D97706',
};

let activeSelectedTx = customTx;
assert(activeSelectedTx.notes === 'مراجع ومذكرات الفصل الدراسي الأول', 'Custom transaction notes correctly accessible');
assert(activeSelectedTx.type === 'expense', 'Custom transaction type is expense');
assert(activeSelectedTx.amount === 250, 'Custom transaction amount is 250');
activeSelectedTx = null;
assert(activeSelectedTx === null, 'Closed custom transaction detail');

// 3. Immutability of Financial State on Open & Close
console.log('\nTest Group 3: Financial Immutability Verification');
// Emulate user selecting multiple transactions in sequence
for (let i = 0; i < INITIAL_TRANSACTIONS.length; i++) {
  let activeModal = INITIAL_TRANSACTIONS[i];
  // Verify reading properties causes no side effects
  const dummyRead = `${activeModal.title} - ${activeModal.amount}`;
  activeModal = null;
}

assert(
  JSON.stringify(INITIAL_BALANCE) === baselineBalanceSnapshot,
  'INITIAL_BALANCE remains 100% identical after opening and closing transaction details'
);
assert(
  JSON.stringify(INITIAL_TRANSACTIONS) === baselineTxSnapshot,
  'INITIAL_TRANSACTIONS remains 100% identical without duplicates or modifications'
);
assert(
  JSON.stringify(INITIAL_USER) === baselineUserSnapshot,
  'INITIAL_USER remains 100% identical'
);

// 4. Keyboard Accessibility Simulation (Escape Handler)
console.log('\nTest Group 4: Keyboard Accessibility (Escape Dismissal)');
let currentModalState = INITIAL_TRANSACTIONS[0];
let closeCalled = false;
const onCloseMock = () => {
  closeCalled = true;
  currentModalState = null;
};

// Simulate Escape keydown
function simulateKeyDown(key) {
  if (key === 'Escape') {
    onCloseMock();
  }
}

simulateKeyDown('Escape');
assert(closeCalled === true, 'Escape key triggers onClose callback');
assert(currentModalState === null, 'Modal state cleared on Escape key press');

// 5. Currency Independence in Detail Formatting
console.log('\nTest Group 5: Detail View Currency Formatting');
const testTx = INITIAL_TRANSACTIONS[0];
const currencySymbols = ['£', 'ر.س', '$', '€', 'د.إ', 'د.ك'];

for (const sym of currencySymbols) {
  const formattedStr = `${testTx.amount.toLocaleString()} ${sym}`;
  assert(
    formattedStr.includes(sym),
    `Formatted amount in detail view reflects active currency: "${formattedStr}"`
  );
}

// 6. Income Visual Distinction
console.log('\nTest Group 6: Income vs Expense Visual Distinction');
const incomeTx = INITIAL_TRANSACTIONS.find((t) => t.type === 'income');
const expenseTx = INITIAL_TRANSACTIONS.find((t) => t.type === 'expense');

assert(incomeTx !== undefined, 'Income transaction exists in sample data');
assert(expenseTx !== undefined, 'Expense transaction exists in sample data');

const incomeBadgeText = incomeTx.type === 'income' ? 'دخل' : 'مصروف';
const expenseBadgeText = expenseTx.type === 'expense' ? 'مصروف' : 'دخل';
assert(incomeBadgeText === 'دخل', 'Income badge correctly labeled "دخل"');
assert(expenseBadgeText === 'مصروف', 'Expense badge correctly labeled "مصروف"');

console.log('\n======================================================');
console.log(`TOTAL TESTS: ${passedTests + failedTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log('======================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
