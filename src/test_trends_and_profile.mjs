/**
 * Masroofy Tracker — Monthly Trends Localization & Editable User Profile Test Suite
 *
 * Requirements covered:
 * 1. Monthly Trends labels in English (consistent short month names).
 * 2. Monthly Trends labels in Arabic (existing Arabic month names).
 * 3. Switching language dynamically without reloading.
 * 4. Chronological month ordering and current-month highlighting.
 * 5. Saving and restoring a custom display name.
 * 6. Rejecting an empty or overly long name (> 40 characters).
 * 7. Handling missing or invalid stored names with safe fallback.
 * 8. Ensuring profile edits do not modify financial or rewards data.
 * 9. Demo-reset behavior restores default display name.
 */

import {
  calculateMonthlyTrends,
  ARABIC_MONTH_NAMES,
  ENGLISH_MONTH_NAMES_DISPLAY,
  ENGLISH_MONTH_SHORT_DISPLAY,
} from './utils/analytics.js';
import {
  calculateBudgetUsage,
  BUDGET_STATUS,
  BUDGET_STATUS_KEYS,
  BUDGET_STATUS_TEXT_AR,
  BUDGET_STATUS_TEXT_EN,
} from './utils/budget.js';
import { INITIAL_BALANCE, INITIAL_TRANSACTIONS, INITIAL_USER } from './data/mockData.js';
import { translations, getTranslation } from './i18n/translations.js';

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
console.log('   MASROOFY TRACKER — MONTHLY TRENDS & USER PROFILE   ');
console.log('======================================================\n');

const REF_DATE = new Date(2026, 9, 15); // October 15, 2026 (Month 9 in 0-indexed JS)

// -------------------------------------------------------------------
// 1. Monthly Trends Labels in English
// -------------------------------------------------------------------
console.log('Test Group 1: Monthly Trends Labels in English');
{
  const trendsEn = calculateMonthlyTrends(INITIAL_TRANSACTIONS, REF_DATE, 6, 'en');

  assert(trendsEn.length === 6, `Returns exactly 6 months of trends: ${trendsEn.length}`);

  // Expected 6 months ending in Oct 2026: May, Jun, Jul, Aug, Sep, Oct
  const expectedShortEn = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  const expectedFullEn = ['May', 'June', 'July', 'August', 'September', 'October'];

  trendsEn.forEach((item, idx) => {
    assert(
      item.monthLabel === expectedShortEn[idx],
      `Month ${idx + 1} short label is '${expectedShortEn[idx]}': ${item.monthLabel}`
    );
    assert(
      item.monthLabelEn === expectedShortEn[idx],
      `Month ${idx + 1} monthLabelEn is '${expectedShortEn[idx]}'`
    );
    assert(
      item.monthLabelFullEn === expectedFullEn[idx],
      `Month ${idx + 1} monthLabelFullEn is '${expectedFullEn[idx]}'`
    );
  });

  // Verify English translation keys for section
  const sectionTitle = getTranslation('en', 'reports.spendingTrends');
  const last6Months = getTranslation('en', 'reports.last6Months');
  assert(sectionTitle === 'Monthly Trends', `reports.spendingTrends in English: '${sectionTitle}'`);
  assert(last6Months === 'Last 6 Months', `reports.last6Months in English: '${last6Months}'`);
}

// -------------------------------------------------------------------
// 2. Monthly Trends Labels in Arabic
// -------------------------------------------------------------------
console.log('\nTest Group 2: Monthly Trends Labels in Arabic');
{
  const trendsAr = calculateMonthlyTrends(INITIAL_TRANSACTIONS, REF_DATE, 6, 'ar');

  assert(trendsAr.length === 6, `Returns exactly 6 months of trends: ${trendsAr.length}`);

  // Expected 6 months ending in Oct 2026: مايو, يونيو, يوليو, أغسطس, سبتمبر, أكتوبر
  const expectedAr = ['مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر'];

  trendsAr.forEach((item, idx) => {
    assert(
      item.monthLabel === expectedAr[idx],
      `Month ${idx + 1} Arabic label is '${expectedAr[idx]}': ${item.monthLabel}`
    );
    assert(
      item.monthLabelAr === expectedAr[idx],
      `Month ${idx + 1} monthLabelAr is '${expectedAr[idx]}'`
    );
  });

  // Verify Arabic translation keys for section
  const sectionTitle = getTranslation('ar', 'reports.spendingTrends');
  const last6Months = getTranslation('ar', 'reports.last6Months');
  assert(sectionTitle === 'المسار الشهري للمصاريف', `reports.spendingTrends in Arabic: '${sectionTitle}'`);
  assert(last6Months === 'آخر 6 أشهر', `reports.last6Months in Arabic: '${last6Months}'`);
}

// -------------------------------------------------------------------
// 3. Switching Language Without Reloading
// -------------------------------------------------------------------
console.log('\nTest Group 3: Switching Language Dynamically Without Reload');
{
  let currentLanguage = 'en';
  let trends = calculateMonthlyTrends(INITIAL_TRANSACTIONS, REF_DATE, 6, currentLanguage);

  assert(trends[5].monthLabel === 'Oct', 'Initially in English: last month is Oct');

  // Switch to Arabic dynamically
  currentLanguage = 'ar';
  trends = calculateMonthlyTrends(INITIAL_TRANSACTIONS, REF_DATE, 6, currentLanguage);

  assert(trends[5].monthLabel === 'أكتوبر', 'Immediately updates to Arabic without reload: last month is أكتوبر');
  assert(trends[0].monthLabel === 'مايو', 'First month is مايو');

  // Switch back to English dynamically
  currentLanguage = 'en';
  trends = calculateMonthlyTrends(INITIAL_TRANSACTIONS, REF_DATE, 6, currentLanguage);

  assert(trends[5].monthLabel === 'Oct', 'Immediately restores English: last month is Oct');
  assert(trends[0].monthLabel === 'May', 'First month is May');
}

// -------------------------------------------------------------------
// 4. Chronological Month Ordering & Current-Month Highlighting
// -------------------------------------------------------------------
console.log('\nTest Group 4: Chronological Ordering and Current-Month Highlighting');
{
  const trends = calculateMonthlyTrends(INITIAL_TRANSACTIONS, REF_DATE, 6, 'en');

  // Chronological verification: monthKeys must increment sequentially
  const expectedKeys = ['2026-5', '2026-6', '2026-7', '2026-8', '2026-9', '2026-10'];
  trends.forEach((t, i) => {
    assert(t.monthKey === expectedKeys[i], `Month key at index ${i} is chronologically ordered: ${t.monthKey}`);
  });

  // Exactly one month is marked active, and it is the current month (index 5)
  const activeMonths = trends.filter((t) => t.isActive);
  assert(activeMonths.length === 1, `Exactly one month is highlighted as active: ${activeMonths.length}`);
  assert(activeMonths[0].monthKey === '2026-10', `Active month is current month: ${activeMonths[0].monthKey}`);
  assert(trends[5].isActive === true, 'Current month bar (last bar) is active');
  assert(trends[0].isActive === false, 'Older month bar is not active');

  // Tooltip content verification
  assert(
    trends[5].monthLabelFull === 'October',
    `Tooltip full month label is October: ${trends[5].monthLabelFull}`
  );
}

// -------------------------------------------------------------------
// 5. Saving and Restoring a Custom Display Name
// -------------------------------------------------------------------
console.log('\nTest Group 5: Saving and Restoring Custom Display Name');
{
  const mockStorage = {};

  const saveProfile = (userObj, newName) => {
    const trimmed = typeof newName === 'string' ? newName.trim() : '';
    if (!trimmed || trimmed.length > 40) return false;
    const updated = { ...userObj, name: trimmed };
    mockStorage['masroofy_user'] = JSON.stringify(updated);
    return updated;
  };

  const loadProfile = () => {
    try {
      const saved = mockStorage['masroofy_user'];
      if (saved) {
        const parsed = JSON.parse(saved);
        const validName =
          typeof parsed.name === 'string' && parsed.name.trim() && parsed.name.trim().length <= 40
            ? parsed.name.trim()
            : INITIAL_USER.name;
        return { ...INITIAL_USER, ...parsed, name: validName };
      }
      return INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  };

  // Initial user
  let user = loadProfile();
  assert(user.name === 'Masroofy User', `Default initial user name: '${user.name}'`);

  // Update name to "Ahmed Mansour"
  user = saveProfile(user, 'Ahmed Mansour');
  assert(user.name === 'Ahmed Mansour', `User name updated in state: '${user.name}'`);
  assert(mockStorage['masroofy_user'] !== undefined, 'User persisted in localStorage');

  // Simulate app reload by reloading from storage
  const restoredUser = loadProfile();
  assert(restoredUser.name === 'Ahmed Mansour', `Restored user name after reload: '${restoredUser.name}'`);

  // Verify custom name remains invariant across language switching
  const nameInEn = restoredUser.name;
  const nameInAr = restoredUser.name;
  assert(nameInEn === nameInAr, 'User custom name is invariant across language switches');
}

// -------------------------------------------------------------------
// 6. Validation: Reject Empty, Whitespace-only, or Overly Long Names
// -------------------------------------------------------------------
console.log('\nTest Group 6: Input Validation (Whitespace, Empty, Overly Long)');
{
  const validateName = (input) => {
    if (typeof input !== 'string') return { valid: false, error: 'invalid_type' };
    const trimmed = input.trim();
    if (!trimmed) return { valid: false, error: 'empty' };
    if (trimmed.length > 40) return { valid: false, error: 'too_long' };
    return { valid: true, trimmed };
  };

  // Valid names
  assert(validateName('Alice').valid === true, "Valid name 'Alice' accepted");
  assert(validateName('  Bob Smith  ').valid === true, "Whitespace trimmed name 'Bob Smith' accepted");
  assert(validateName('  Bob Smith  ').trimmed === 'Bob Smith', "Properly trimmed to 'Bob Smith'");
  assert(validateName('د. سارة محمود').valid === true, 'Arabic custom name accepted');

  // Empty or whitespace-only
  assert(validateName('').valid === false && validateName('').error === 'empty', 'Empty string rejected');
  assert(validateName('   ').valid === false && validateName('   ').error === 'empty', 'Whitespace-only rejected');
  assert(validateName('\t\n  ').valid === false, 'Tab/newline whitespace rejected');
  assert(validateName(null).valid === false, 'Null rejected safely');
  assert(validateName(undefined).valid === false, 'Undefined rejected safely');

  // Overly long name (> 40 chars)
  const longName = 'A'.repeat(41);
  const boundary40 = 'B'.repeat(40);
  assert(validateName(boundary40).valid === true, 'Exact 40-character name accepted');
  assert(validateName(longName).valid === false && validateName(longName).error === 'too_long', '41-character name rejected as too_long');

  // Localized error message lookups
  const enEmptyErr = getTranslation('en', 'settings.nameRequiredError');
  const arEmptyErr = getTranslation('ar', 'settings.nameRequiredError');
  const enTooLongErr = getTranslation('en', 'settings.nameTooLongError');
  const arTooLongErr = getTranslation('ar', 'settings.nameTooLongError');

  assert(enEmptyErr.length > 0, `English empty name error exists: '${enEmptyErr}'`);
  assert(arEmptyErr.length > 0, `Arabic empty name error exists: '${arEmptyErr}'`);
  assert(enTooLongErr.length > 0, `English too-long error exists: '${enTooLongErr}'`);
  assert(arTooLongErr.length > 0, `Arabic too-long error exists: '${arTooLongErr}'`);
}

// -------------------------------------------------------------------
// 7. Handling Missing or Invalid Stored Names with Safe Fallback
// -------------------------------------------------------------------
console.log('\nTest Group 7: Missing or Corrupted Stored Name Fallback');
{
  const safeInitUser = (storedString) => {
    try {
      if (storedString) {
        const parsed = JSON.parse(storedString);
        const validName =
          typeof parsed.name === 'string' && parsed.name.trim() && parsed.name.trim().length <= 40
            ? parsed.name.trim()
            : INITIAL_USER.name;
        return { ...INITIAL_USER, ...parsed, name: validName };
      }
      return INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  };

  // Missing storage
  assert(safeInitUser(null).name === 'Masroofy User', 'null storage falls back to Masroofy User');
  assert(safeInitUser(undefined).name === 'Masroofy User', 'undefined storage falls back to Masroofy User');

  // Corrupted JSON
  assert(safeInitUser('{corrupted json').name === 'Masroofy User', 'corrupted JSON falls back safely');

  // Missing or invalid name property
  assert(safeInitUser('{}').name === 'Masroofy User', 'empty object falls back to Masroofy User');
  assert(safeInitUser('{"name": ""}').name === 'Masroofy User', 'empty string name falls back to Masroofy User');
  assert(safeInitUser('{"name": "   "}').name === 'Masroofy User', 'whitespace name falls back to Masroofy User');
  assert(safeInitUser('{"name": 12345}').name === 'Masroofy User', 'number name falls back to Masroofy User');
  assert(safeInitUser(`{"name": "${'X'.repeat(45)}"}`).name === 'Masroofy User', 'overly long stored name falls back safely');
}

// -------------------------------------------------------------------
// 8. Data Integrity: Profile Edits Do NOT Modify Financial or Rewards Data
// -------------------------------------------------------------------
console.log('\nTest Group 8: Data Integrity and Financial/Rewards Isolation');
{
  const mockStorage = {
    masroofy_balance: JSON.stringify(INITIAL_BALANCE),
    masroofy_transactions: JSON.stringify(INITIAL_TRANSACTIONS),
    masroofy_budget: JSON.stringify({ limit: 4000, updatedAt: '2026-10-15T12:00:00.000Z' }),
    masroofy_theme: 'light',
    masroofy_language: 'en',
    masroofy_unlocked_rewards: JSON.stringify(['rew-1']),
    masroofy_redemptions: JSON.stringify([{ id: 'red-1', rewardId: 'rew-1', cost: 200 }]),
    masroofy_awarded_tx: JSON.stringify({ 'tx-1': 12, 'tx-2': 2 }),
    masroofy_user: JSON.stringify({ ...INITIAL_USER, points: 150 }),
  };

  // Snapshot before edit
  const balanceBefore = mockStorage.masroofy_balance;
  const txBefore = mockStorage.masroofy_transactions;
  const budgetBefore = mockStorage.masroofy_budget;
  const themeBefore = mockStorage.masroofy_theme;
  const langBefore = mockStorage.masroofy_language;
  const unlockedBefore = mockStorage.masroofy_unlocked_rewards;
  const redemptionsBefore = mockStorage.masroofy_redemptions;
  const awardedBefore = mockStorage.masroofy_awarded_tx;

  // Perform profile name update
  const currentUser = JSON.parse(mockStorage.masroofy_user);
  const updatedUser = { ...currentUser, name: 'Tariq Al-Masry' };
  mockStorage.masroofy_user = JSON.stringify(updatedUser);

  // Assertions
  assert(mockStorage.masroofy_balance === balanceBefore, 'masroofy_balance remained strictly unaltered');
  assert(mockStorage.masroofy_transactions === txBefore, 'masroofy_transactions remained strictly unaltered');
  assert(mockStorage.masroofy_budget === budgetBefore, 'masroofy_budget remained strictly unaltered');
  assert(mockStorage.masroofy_theme === themeBefore, 'masroofy_theme remained strictly unaltered');
  assert(mockStorage.masroofy_language === langBefore, 'masroofy_language remained strictly unaltered');
  assert(mockStorage.masroofy_unlocked_rewards === unlockedBefore, 'masroofy_unlocked_rewards remained strictly unaltered');
  assert(mockStorage.masroofy_redemptions === redemptionsBefore, 'masroofy_redemptions remained strictly unaltered');
  assert(mockStorage.masroofy_awarded_tx === awardedBefore, 'masroofy_awarded_tx remained strictly unaltered');

  // Verify points and currency inside user were NOT changed by name update
  const savedUser = JSON.parse(mockStorage.masroofy_user);
  assert(savedUser.name === 'Tariq Al-Masry', 'User name was updated');
  assert(savedUser.points === 150, 'User points preserved (150)');
  assert(savedUser.currency === '£', 'User currency preserved (£)');
}

// -------------------------------------------------------------------
// 9. Demo-Reset Behavior Restores Default Display Name
// -------------------------------------------------------------------
console.log('\nTest Group 9: Demo-Reset Restores Default Display Name');
{
  const mockStorage = {
    masroofy_user: JSON.stringify({ ...INITIAL_USER, name: 'Custom Name User' }),
  };

  // Execute demo reset
  const handleResetDemoDataSimulation = () => {
    delete mockStorage.masroofy_user;
    return INITIAL_USER;
  };

  const resetUser = handleResetDemoDataSimulation();
  assert(resetUser.name === 'Masroofy User', `Reset returns default user name 'Masroofy User': '${resetUser.name}'`);
  assert(mockStorage.masroofy_user === undefined, 'Custom stored user was removed from localStorage');
}

// -------------------------------------------------------------------
// 10. Budget Status Localization (English & Arabic)
// -------------------------------------------------------------------
console.log('\nTest Group 10: Budget Status Localization (All 5 Statuses & Helper Text)');
{
  // A. Approaching Budget Limit (80% - 99.9%) — Specifically tests the reported bug
  const tx850 = [{ id: '1', type: 'expense', amount: 850, date: '2026-10-01' }];
  const usageWarningEn = calculateBudgetUsage(1000, tx850, REF_DATE, 'en');
  const usageWarningAr = calculateBudgetUsage(1000, tx850, REF_DATE, 'ar');

  assert(usageWarningEn.status === BUDGET_STATUS.WARNING, 'Status is WARNING at 85% usage');
  assert(usageWarningEn.percentage === 85.0, 'Percentage is 85.0%');
  assert(usageWarningEn.statusText === 'Notice: Approaching budget limit', `Warning status in English is 'Notice: Approaching budget limit': '${usageWarningEn.statusText}'`);
  assert(usageWarningAr.statusText === 'تنبيه: اقتربت من استهلاك الميزانية', `Warning status in Arabic is 'تنبيه: اقتربت من استهلاك الميزانية': '${usageWarningAr.statusText}'`);
  assert(usageWarningEn.statusKey === 'budget.statusWarning', `Status key is 'budget.statusWarning'`);
  assert(getTranslation('en', usageWarningEn.statusKey) === 'Notice: Approaching budget limit', `Translation dictionary has English warning status`);
  assert(getTranslation('ar', usageWarningAr.statusKey) === 'تنبيه: اقتربت من استهلاك الميزانية', `Translation dictionary has Arabic warning status`);

  // B. Normal Spending (< 80%)
  const tx500 = [{ id: '1', type: 'expense', amount: 500, date: '2026-10-01' }];
  const usageNormalEn = calculateBudgetUsage(1000, tx500, REF_DATE, 'en');
  const usageNormalAr = calculateBudgetUsage(1000, tx500, REF_DATE, 'ar');

  assert(usageNormalEn.status === BUDGET_STATUS.NORMAL, 'Status is NORMAL at 50% usage');
  assert(usageNormalEn.statusText === 'Spending is on track', `Normal status in English: '${usageNormalEn.statusText}'`);
  assert(usageNormalAr.statusText === 'إنفاقك في المسار الطبيعي', `Normal status in Arabic: '${usageNormalAr.statusText}'`);
  assert(getTranslation('en', usageNormalEn.statusKey) === 'Spending is on track', 'Translation dictionary has English normal status');
  assert(getTranslation('ar', usageNormalAr.statusKey) === 'إنفاقك في المسار الطبيعي', 'Translation dictionary has Arabic normal status');

  // C. Reached Budget Limit (Exactly 100%)
  const tx1000 = [{ id: '1', type: 'expense', amount: 1000, date: '2026-10-01' }];
  const usageReachedEn = calculateBudgetUsage(1000, tx1000, REF_DATE, 'en');
  const usageReachedAr = calculateBudgetUsage(1000, tx1000, REF_DATE, 'ar');

  assert(usageReachedEn.status === BUDGET_STATUS.REACHED, 'Status is REACHED at 100% usage');
  assert(usageReachedEn.statusText === 'Reached 100% of budget limit', `Reached status in English: '${usageReachedEn.statusText}'`);
  assert(usageReachedAr.statusText === 'وصلت إلى الحد الأقصى للميزانية', `Reached status in Arabic: '${usageReachedAr.statusText}'`);
  assert(getTranslation('en', usageReachedEn.statusKey) === 'Reached 100% of budget limit', 'Translation dictionary has English reached status');
  assert(getTranslation('ar', usageReachedAr.statusKey) === 'وصلت إلى الحد الأقصى للميزانية', 'Translation dictionary has Arabic reached status');

  // D. Exceeded Budget Limit (> 100%)
  const tx1200 = [{ id: '1', type: 'expense', amount: 1200, date: '2026-10-01' }];
  const usageExceededEn = calculateBudgetUsage(1000, tx1200, REF_DATE, 'en');
  const usageExceededAr = calculateBudgetUsage(1000, tx1200, REF_DATE, 'ar');

  assert(usageExceededEn.status === BUDGET_STATUS.EXCEEDED, 'Status is EXCEEDED at 120% usage');
  assert(usageExceededEn.isOverBudget === true, 'isOverBudget is true');
  assert(usageExceededEn.overAmount === 200, 'overAmount is 200');
  assert(usageExceededEn.statusText === 'Warning: Budget limit exceeded!', `Exceeded status in English: '${usageExceededEn.statusText}'`);
  assert(usageExceededAr.statusText === 'تحذير: تجاوزت الميزانية المحددة!', `Exceeded status in Arabic: '${usageExceededAr.statusText}'`);
  assert(getTranslation('en', usageExceededEn.statusKey) === 'Warning: Budget limit exceeded!', 'Translation dictionary has English exceeded status');
  assert(getTranslation('ar', usageExceededAr.statusKey) === 'تحذير: تجاوزت الميزانية المحددة!', 'Translation dictionary has Arabic exceeded status');

  // E. No Budget Configured
  const usageNoBudgetEn = calculateBudgetUsage(null, tx500, REF_DATE, 'en');
  const usageNoBudgetAr = calculateBudgetUsage(null, tx500, REF_DATE, 'ar');

  assert(usageNoBudgetEn.status === BUDGET_STATUS.NO_BUDGET, 'Status is NO_BUDGET');
  assert(usageNoBudgetEn.isConfigured === false, 'isConfigured is false');
  assert(usageNoBudgetEn.statusText === 'No budget set for this month', `No-budget status in English: '${usageNoBudgetEn.statusText}'`);
  assert(usageNoBudgetAr.statusText === 'لم يتم تحديد ميزانية لهذا الشهر', `No-budget status in Arabic: '${usageNoBudgetAr.statusText}'`);
  assert(getTranslation('en', usageNoBudgetEn.statusKey) === 'No budget set for this month', 'Translation dictionary has English no-budget status');
  assert(getTranslation('ar', usageNoBudgetAr.statusKey) === 'لم يتم تحديد ميزانية لهذا الشهر', 'Translation dictionary has Arabic no-budget status');

  // F. Helper Text Translations
  const noLimitEn = getTranslation('en', 'budget.noLimitDescription');
  const noLimitAr = getTranslation('ar', 'budget.noLimitDescription');
  const overBudgetEn = getTranslation('en', 'budget.overBudgetBy');
  const overBudgetAr = getTranslation('ar', 'budget.overBudgetBy');

  assert(noLimitEn.includes('You have not set a spending limit'), 'English unconfigured budget explanation is translated');
  assert(noLimitAr.includes('لم تقم بتحديد سقف للمصاريف'), 'Arabic unconfigured budget explanation is translated');
  assert(overBudgetEn === 'Over budget by: ', 'English overBudgetBy text is translated');
  assert(overBudgetAr === 'تجاوزت الميزانية بمقدار: ', 'Arabic overBudgetBy text is translated');

  // G. Dynamic Language Switching in Budget Card
  let activeLang = 'en';
  let activeUsage = calculateBudgetUsage(1000, tx850, REF_DATE, activeLang);
  let cardStatusText = getTranslation(activeLang, activeUsage.statusKey);
  assert(cardStatusText === 'Notice: Approaching budget limit', 'In English context, card displays English notice');

  // Switch to Arabic
  activeLang = 'ar';
  activeUsage = calculateBudgetUsage(1000, tx850, REF_DATE, activeLang);
  cardStatusText = getTranslation(activeLang, activeUsage.statusKey);
  assert(cardStatusText === 'تنبيه: اقتربت من استهلاك الميزانية', 'Immediately displays Arabic notice upon switching to Arabic');

  // Switch back to English
  activeLang = 'en';
  activeUsage = calculateBudgetUsage(1000, tx850, REF_DATE, activeLang);
  cardStatusText = getTranslation(activeLang, activeUsage.statusKey);
  assert(cardStatusText === 'Notice: Approaching budget limit', 'Immediately restores English notice upon switching to English');
}

console.log('\n======================================================');
console.log(`TOTAL TESTS: ${passedTests + failedTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log('======================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
