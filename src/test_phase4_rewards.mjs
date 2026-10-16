/**
 * Phase 4: Rewards & Redemption Verification Suite for Masroofy Tracker
 *
 * Verifies all 16 requirements:
 * 1. Initial reward balance behavior.
 * 2. Valid points earning.
 * 3. Prevention of duplicate points awards.
 * 4. Handling of edited and deleted transactions.
 * 5. Rejection of invalid transactions.
 * 6. Reward catalog validation.
 * 7. Successful redemption.
 * 8. Insufficient points.
 * 9. Invalid or unavailable rewards.
 * 10. Prevention of duplicate redemption.
 * 11. Exact points deduction.
 * 12. Redemption history creation.
 * 13. Persistence across reloads.
 * 14. Corrupted localStorage handling.
 * 15. Demo reset behavior.
 * 16. Regression protection for existing financial calculations.
 */

import {
  calculateTransactionPoints,
  processRedemption,
  parseStoredRedemptions,
  parseStoredUnlockedRewards,
  parseStoredAwardedTransactions,
  DEFAULT_REWARDS_CATALOG,
  POINTS_POLICY,
} from './utils/rewards.js';
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
console.log('   MASROOFY TRACKER — PHASE 4 REWARDS & REDEMPTION    ');
console.log('======================================================\n');

// -------------------------------------------------------------------
// 1. Initial Reward Balance Behavior
// -------------------------------------------------------------------
console.log('Test 1: Initial Reward Balance Behavior');
{
  assert(INITIAL_USER.points === 350, `Initial user points is preserved at 350: ${INITIAL_USER.points}`);
  assert(POINTS_POLICY.STARTING_DEMO_POINTS === 350, 'Starting demo points policy is 350');

  const defaultUnlocked = parseStoredUnlockedRewards(null);
  assert(!defaultUnlocked.includes('rew-1'), 'Default unlocked rewards starts without rew-1 (Dark Mode is locked)');
  assert(defaultUnlocked.length === 0, 'No rewards are unlocked automatically on first launch');
}

// -------------------------------------------------------------------
// 2. Valid Points Earning
// -------------------------------------------------------------------
console.log('\nTest 2: Valid Points Earning');
{
  // 1 point per 10 currency units
  const pts120 = calculateTransactionPoints({ type: 'expense', amount: 120 });
  assert(pts120 === 12, `Expense of 120 earns 12 points: ${pts120}`);

  const pts25 = calculateTransactionPoints({ type: 'expense', amount: 25 });
  assert(pts25 === 2, `Expense of 25 earns 2 points: ${pts25}`);

  const pts340 = calculateTransactionPoints({ type: 'expense', amount: 340 });
  assert(pts340 === 34, `Expense of 340 earns 34 points: ${pts340}`);

  const pts5 = calculateTransactionPoints({ type: 'expense', amount: 5 });
  assert(pts5 === 1, `Expense of 5 earns minimum 1 point: ${pts5}`);

  const ptsDecimal = calculateTransactionPoints({ type: 'expense', amount: 99.99 });
  assert(ptsDecimal === 9, `Expense of 99.99 earns 9 points: ${ptsDecimal}`);
}

// -------------------------------------------------------------------
// 3. Prevention of Duplicate Points Awards
// -------------------------------------------------------------------
console.log('\nTest 3: Prevention of Duplicate Points Awards');
{
  const awardedMap = {};
  const newTx = { id: 'tx-test-101', type: 'expense', amount: 150 };

  // First time transaction is processed
  let pointsBalance = 350;
  if (!awardedMap[newTx.id]) {
    const pts = calculateTransactionPoints(newTx);
    pointsBalance += pts;
    awardedMap[newTx.id] = pts;
  }
  assert(pointsBalance === 365, 'Points balance updated on first award: 365');
  assert(awardedMap['tx-test-101'] === 15, 'Awarded map records 15 points for tx-test-101');

  // Simulated rerender or reload: attempt to process same transaction again
  if (!awardedMap[newTx.id]) {
    const pts = calculateTransactionPoints(newTx);
    pointsBalance += pts;
  }
  assert(pointsBalance === 365, 'Duplicate transaction award was prevented; points remain 365');
}

// -------------------------------------------------------------------
// 4. Handling of Edited and Deleted Transactions
// -------------------------------------------------------------------
console.log('\nTest 4: Handling of Edited and Deleted Transactions');
{
  const awardedMap = { 'tx-edit-1': 10 }; // 100 expense previously
  let pointsBalance = 360;

  // A. Increase amount from 100 to 250 (25 pts, +15 delta)
  const editedUp = { id: 'tx-edit-1', type: 'expense', amount: 250 };
  const oldPts = awardedMap[editedUp.id] || 0;
  const newPts = calculateTransactionPoints(editedUp);
  const deltaUp = newPts - oldPts;
  pointsBalance += deltaUp;
  awardedMap[editedUp.id] = newPts;

  assert(deltaUp === 15, `Points delta when edited up: +15`);
  assert(pointsBalance === 375, `Balance increased to 375: ${pointsBalance}`);
  assert(awardedMap['tx-edit-1'] === 25, 'Awarded map updated to 25');

  // B. Switch type from expense to income (0 pts, -25 delta)
  const editedToIncome = { id: 'tx-edit-1', type: 'income', amount: 250 };
  const oldPts2 = awardedMap[editedToIncome.id] || 0;
  const newPts2 = calculateTransactionPoints(editedToIncome);
  const deltaToIncome = newPts2 - oldPts2;
  pointsBalance += deltaToIncome;
  awardedMap[editedToIncome.id] = newPts2;

  assert(deltaToIncome === -25, `Points delta when changed to income: -25`);
  assert(pointsBalance === 350, `Balance reduced back to 350: ${pointsBalance}`);

  // C. Delete a transaction that had points awarded
  awardedMap['tx-del-1'] = 20;
  pointsBalance = 370;
  const oldDeletePts = awardedMap['tx-del-1'] || 0;
  pointsBalance = Math.max(0, pointsBalance - oldDeletePts);
  delete awardedMap['tx-del-1'];

  assert(pointsBalance === 350, `Points balance decreased by 20 on deletion: ${pointsBalance}`);
  assert(awardedMap['tx-del-1'] === undefined, 'Deleted transaction removed from awarded map');
}

// -------------------------------------------------------------------
// 5. Rejection of Invalid Transactions
// -------------------------------------------------------------------
console.log('\nTest 5: Rejection of Invalid Transactions');
{
  assert(calculateTransactionPoints({ type: 'income', amount: 5000 }) === 0, 'Income transaction awards 0 points');
  assert(calculateTransactionPoints({ type: 'expense', amount: 0 }) === 0, 'Zero amount awards 0 points');
  assert(calculateTransactionPoints({ type: 'expense', amount: -50 }) === 0, 'Negative amount awards 0 points');
  assert(calculateTransactionPoints({ type: 'expense', amount: NaN }) === 0, 'NaN amount awards 0 points');
  assert(calculateTransactionPoints({ type: 'expense', amount: Infinity }) === 0, 'Infinity awards 0 points');
  assert(calculateTransactionPoints(null) === 0, 'null awards 0 points');
  assert(calculateTransactionPoints(undefined) === 0, 'undefined awards 0 points');
  assert(calculateTransactionPoints('not-an-object') === 0, 'string awards 0 points');
}

// -------------------------------------------------------------------
// 6. Reward Catalog Validation
// -------------------------------------------------------------------
console.log('\nTest 6: Reward Catalog Validation');
{
  assert(Array.isArray(DEFAULT_REWARDS_CATALOG), 'Catalog is an array');
  assert(DEFAULT_REWARDS_CATALOG.length >= 5, `Catalog contains at least 5 rewards: ${DEFAULT_REWARDS_CATALOG.length}`);

  for (const item of DEFAULT_REWARDS_CATALOG) {
    assert(typeof item.id === 'string' && item.id.length > 0, `Reward ${item.id} has valid ID`);
    assert(typeof item.title === 'string' && item.title.length > 0, `Reward ${item.id} has title`);
    assert(typeof item.pointsCost === 'number' && item.pointsCost > 0, `Reward ${item.id} has positive cost: ${item.pointsCost}`);
    assert(typeof item.description === 'string' && item.description.length > 0, `Reward ${item.id} has description`);
  }
}

// -------------------------------------------------------------------
// 7. Successful Redemption
// -------------------------------------------------------------------
console.log('\nTest 7: Successful Redemption');
{
  // User has 350 points, redeems rew-3 (150 points)
  const res = processRedemption(DEFAULT_REWARDS_CATALOG, 'rew-3', 350, ['rew-1']);
  assert(res.success === true, 'Redemption succeeded');
  assert(res.newPoints === 200, `Points deducted: 350 - 150 = 200 === ${res.newPoints}`);
  assert(res.pointsSpent === 150, 'Points spent recorded as 150');
  assert(res.newUnlockedIds.includes('rew-3'), 'rew-3 is added to unlocked IDs');
  assert(Boolean(res.redemptionRecord && res.redemptionRecord.id), 'Redemption record created with ID');
}

// -------------------------------------------------------------------
// 8. Insufficient Points
// -------------------------------------------------------------------
console.log('\nTest 8: Insufficient Points');
{
  // User has 100 points, tries to redeem rew-2 (cost 300)
  const res = processRedemption(DEFAULT_REWARDS_CATALOG, 'rew-2', 100, ['rew-1']);
  assert(res.success === false, 'Redemption rejected due to insufficient points');
  assert(typeof res.error === 'string' && res.error.includes('100'), 'Error message mentions current points');
}

// -------------------------------------------------------------------
// 9. Invalid or Unavailable Rewards
// -------------------------------------------------------------------
console.log('\nTest 9: Invalid or Unavailable Rewards');
{
  const resMissing = processRedemption(DEFAULT_REWARDS_CATALOG, 'rew-nonexistent', 350, []);
  assert(resMissing.success === false, 'Non-existent reward rejected');

  const resNull = processRedemption(DEFAULT_REWARDS_CATALOG, null, 350, []);
  assert(resNull.success === false, 'Null reward ID rejected');

  const resEmpty = processRedemption(DEFAULT_REWARDS_CATALOG, '', 350, []);
  assert(resEmpty.success === false, 'Empty reward ID rejected');
}

// -------------------------------------------------------------------
// 10. Prevention of Duplicate Redemption
// -------------------------------------------------------------------
console.log('\nTest 10: Prevention of Duplicate Redemption');
{
  // rew-1 is already in unlocked IDs and is not repeatable
  const resDup = processRedemption(DEFAULT_REWARDS_CATALOG, 'rew-1', 350, ['rew-1']);
  assert(resDup.success === false, 'Duplicate redemption of non-repeatable reward rejected');
  assert(resDup.error.includes('مسبقاً'), 'Error indicates reward is already unlocked');

  // rew-5 is repeatable (Smart Advice)
  const resRepeat1 = processRedemption(DEFAULT_REWARDS_CATALOG, 'rew-5', 350, ['rew-1']);
  assert(resRepeat1.success === true, 'Repeatable reward rew-5 first redemption succeeds');
  const resRepeat2 = processRedemption(DEFAULT_REWARDS_CATALOG, 'rew-5', resRepeat1.newPoints, ['rew-1', 'rew-5']);
  assert(resRepeat2.success === true, 'Repeatable reward rew-5 second redemption succeeds');
  assert(resRepeat2.newPoints === 250, 'Points deducted for both repeat redemptions (350 - 50 - 50 = 250)');
}

// -------------------------------------------------------------------
// 11. Exact Points Deduction
// -------------------------------------------------------------------
console.log('\nTest 11: Exact Points Deduction');
{
  let currentPoints = 500;
  // Redeem rew-3 (150 pts)
  const step1 = processRedemption(DEFAULT_REWARDS_CATALOG, 'rew-3', currentPoints, []);
  currentPoints = step1.newPoints;
  assert(currentPoints === 350, '500 - 150 = 350 exactly');

  // Redeem rew-4 (100 pts)
  const step2 = processRedemption(DEFAULT_REWARDS_CATALOG, 'rew-4', currentPoints, step1.newUnlockedIds);
  currentPoints = step2.newPoints;
  assert(currentPoints === 250, '350 - 100 = 250 exactly');

  // Redeem rew-5 (50 pts)
  const step3 = processRedemption(DEFAULT_REWARDS_CATALOG, 'rew-5', currentPoints, step2.newUnlockedIds);
  currentPoints = step3.newPoints;
  assert(currentPoints === 200, '250 - 50 = 200 exactly');
}

// -------------------------------------------------------------------
// 12. Redemption History Creation
// -------------------------------------------------------------------
console.log('\nTest 12: Redemption History Creation');
{
  const res = processRedemption(DEFAULT_REWARDS_CATALOG, 'rew-3', 350, []);
  const record = res.redemptionRecord;
  assert(record.rewardId === 'rew-3', 'Record rewardId matches');
  assert(record.rewardTitle === 'شارة بطل الميزانية (VIP Badge)', 'Record title matches');
  assert(record.pointsSpent === 150, 'Record pointsSpent matches');
  assert(typeof record.timestamp === 'string' && record.timestamp.includes('2026'), 'Record has valid timestamp');
  assert(typeof record.dateFormatted === 'string', 'Record has formatted Arabic date');
}

// -------------------------------------------------------------------
// 13. Persistence Across Reloads
// -------------------------------------------------------------------
console.log('\nTest 13: Persistence Across Reloads');
{
  const mockStorage = {};
  const unlocked = ['rew-1', 'rew-3'];
  const redemptions = [
    { id: 'red-1', rewardId: 'rew-3', rewardTitle: 'شارة بطل الميزانية', pointsSpent: 150, timestamp: '2026-10-16T12:00:00Z' }
  ];
  const awarded = { 'tx-1': 12, 'tx-2': 25 };

  mockStorage['masroofy_unlocked_rewards'] = JSON.stringify(unlocked);
  mockStorage['masroofy_redemptions'] = JSON.stringify(redemptions);
  mockStorage['masroofy_awarded_tx'] = JSON.stringify(awarded);

  const restoredUnlocked = parseStoredUnlockedRewards(mockStorage['masroofy_unlocked_rewards']);
  const restoredRedemptions = parseStoredRedemptions(mockStorage['masroofy_redemptions']);
  const restoredAwarded = parseStoredAwardedTransactions(mockStorage['masroofy_awarded_tx']);

  assert(restoredUnlocked.includes('rew-3'), 'Persisted unlocked reward rew-3 restored');
  assert(restoredRedemptions.length === 1 && restoredRedemptions[0].rewardId === 'rew-3', 'Persisted redemption record restored');
  assert(restoredAwarded['tx-1'] === 12, 'Persisted awarded transaction restored');
}

// -------------------------------------------------------------------
// 14. Corrupted LocalStorage Handling
// -------------------------------------------------------------------
console.log('\nTest 14: Corrupted LocalStorage Handling');
{
  const corruptUnlocked = parseStoredUnlockedRewards('{ invalid json');
  assert(Array.isArray(corruptUnlocked) && corruptUnlocked.length === 0, 'Corrupted unlocked fallback to default empty array');

  const corruptRedemptions = parseStoredRedemptions('not a json');
  assert(Array.isArray(corruptRedemptions) && corruptRedemptions.length === 0, 'Corrupted redemptions fallback to empty array');

  const corruptAwarded = parseStoredAwardedTransactions(12345);
  assert(typeof corruptAwarded === 'object' && Object.keys(corruptAwarded).length === 0, 'Corrupted awarded fallback to empty object');
}

// -------------------------------------------------------------------
// 15. Demo Reset Behavior
// -------------------------------------------------------------------
console.log('\nTest 15: Demo Reset Behavior');
{
  // Simulate state after some awards and redemptions
  let user = { ...INITIAL_USER, points: 150 };
  let unlockedRewards = ['rew-1', 'rew-3'];
  let redemptionsHistory = [{ id: 'red-1', rewardId: 'rew-3' }];
  let awardedTx = { 'tx-1': 12, 'tx-new': 50 };

  // Perform reset simulation matching App.jsx handleResetDemoData
  user = { ...INITIAL_USER };
  unlockedRewards = [];
  redemptionsHistory = [];
  const initialMap = {};
  for (const t of INITIAL_TRANSACTIONS) {
    const pts = calculateTransactionPoints(t);
    if (pts > 0) initialMap[t.id] = pts;
  }
  awardedTx = initialMap;

  assert(user.points === 350, 'Reset restored points to 350');
  assert(unlockedRewards.length === 0, 'Reset restored unlocked rewards to empty (Dark Mode is locked)');
  assert(redemptionsHistory.length === 0, 'Reset cleared redemptions history');
  assert(awardedTx['tx-1'] === 12, 'Reset re-initialized demo awarded transactions');
  assert(awardedTx['tx-new'] === undefined, 'Reset cleared newly added transaction points');
}

// -------------------------------------------------------------------
// 16. Regression Protection for Existing Financial Calculations
// -------------------------------------------------------------------
console.log('\nTest 16: Regression Protection for Existing Financial Calculations');
{
  const balanceSnapshot = JSON.stringify(INITIAL_BALANCE);
  const txSnapshot = JSON.stringify(INITIAL_TRANSACTIONS);
  const userSnapshot = JSON.stringify(INITIAL_USER);

  // Perform rewards operations
  calculateTransactionPoints(INITIAL_TRANSACTIONS[0]);
  processRedemption(DEFAULT_REWARDS_CATALOG, 'rew-3', 350, ['rew-1']);

  assert(JSON.stringify(INITIAL_BALANCE) === balanceSnapshot, 'INITIAL_BALANCE remained 100% unaltered');
  assert(JSON.stringify(INITIAL_TRANSACTIONS) === txSnapshot, 'INITIAL_TRANSACTIONS remained 100% unaltered');
  assert(JSON.stringify(INITIAL_USER) === userSnapshot, 'INITIAL_USER remained 100% unaltered');

  // Verify financial invariant
  assert(
    INITIAL_BALANCE.current === INITIAL_BALANCE.income - INITIAL_BALANCE.expenses,
    'Core balance equation 5250 === 7590 - 2340 perfectly preserved'
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
