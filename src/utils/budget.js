/**
 * Budget Management Utility for Masroofy Tracker (مصروفي)
 * Phase 3B: Monthly Spending Budget Engine
 */

import { parseTransactionDate, isTransactionInPeriod } from './analytics.js';

export const BUDGET_THRESHOLDS = {
  NORMAL_MAX: 80, // < 80% usage
  WARNING_MAX: 100, // 80% to < 100% usage
};

export const BUDGET_STATUS = {
  NORMAL: 'normal', // < 80%
  WARNING: 'warning', // 80% <= usage < 100%
  REACHED: 'reached', // usage === 100%
  EXCEEDED: 'exceeded', // usage > 100%
  NO_BUDGET: 'no_budget',
};

export const BUDGET_STATUS_KEYS = {
  [BUDGET_STATUS.NORMAL]: 'budget.statusNormal',
  [BUDGET_STATUS.WARNING]: 'budget.statusWarning',
  [BUDGET_STATUS.REACHED]: 'budget.statusReached',
  [BUDGET_STATUS.EXCEEDED]: 'budget.statusExceeded',
  [BUDGET_STATUS.NO_BUDGET]: 'budget.statusNoBudget',
};

export const BUDGET_STATUS_TEXT_AR = {
  [BUDGET_STATUS.NORMAL]: 'إنفاقك في المسار الطبيعي',
  [BUDGET_STATUS.WARNING]: 'تنبيه: اقتربت من استهلاك الميزانية',
  [BUDGET_STATUS.REACHED]: 'وصلت إلى الحد الأقصى للميزانية',
  [BUDGET_STATUS.EXCEEDED]: 'تحذير: تجاوزت الميزانية المحددة!',
  [BUDGET_STATUS.NO_BUDGET]: 'لم يتم تحديد ميزانية لهذا الشهر',
};

export const BUDGET_STATUS_TEXT_EN = {
  [BUDGET_STATUS.NORMAL]: 'Spending is on track',
  [BUDGET_STATUS.WARNING]: 'Notice: Approaching budget limit',
  [BUDGET_STATUS.REACHED]: 'Reached 100% of budget limit',
  [BUDGET_STATUS.EXCEEDED]: 'Warning: Budget limit exceeded!',
  [BUDGET_STATUS.NO_BUDGET]: 'No budget set for this month',
};

/**
 * Validates a user-provided budget amount.
 *
 * @param {any} input
 * @returns {{ isValid: boolean, error: string|null, cleanAmount: number|null }}
 */
export function validateBudgetAmount(input, lang = 'ar') {
  const isEn = lang === 'en';
  if (input === null || input === undefined || input === '') {
    return {
      isValid: false,
      error: isEn ? 'Please enter a budget amount' : 'الرجاء إدخال مبلغ الميزانية',
      errorKey: 'budget.errorRequired',
      cleanAmount: null,
    };
  }

  const num = typeof input === 'string' ? parseFloat(input.trim()) : Number(input);

  if (isNaN(num)) {
    return {
      isValid: false,
      error: isEn ? 'Please enter a valid numerical value' : 'الرجاء إدخال قيمة رقمية صحيحة',
      errorKey: 'budget.errorInvalid',
      cleanAmount: null,
    };
  }

  if (!isFinite(num)) {
    return {
      isValid: false,
      error: isEn ? 'Budget amount must be a finite number' : 'قيمة الميزانية يجب أن تكون رقماً محدوداً',
      errorKey: 'budget.errorFinite',
      cleanAmount: null,
    };
  }

  if (num <= 0) {
    return {
      isValid: false,
      error: isEn ? 'Budget amount must be greater than zero' : 'مبلغ الميزانية يجب أن يكون أكبر من الصفر',
      errorKey: 'budget.errorPositive',
      cleanAmount: null,
    };
  }

  const cleanAmount = Math.round(num * 100) / 100;
  return { isValid: true, error: null, cleanAmount };
}

/**
 * Safely parses budget data from localStorage or raw state.
 * Returns null if data is missing, corrupted, or invalid.
 *
 * @param {any} rawData
 * @returns {{ limit: number, updatedAt: string } | null}
 */
export function parseStoredBudget(rawData) {
  if (!rawData) return null;

  try {
    let parsed = rawData;
    if (typeof rawData === 'string') {
      parsed = JSON.parse(rawData);
    }

    if (typeof parsed === 'number') {
      const validation = validateBudgetAmount(parsed);
      return validation.isValid ? { limit: validation.cleanAmount, updatedAt: new Date().toISOString() } : null;
    }

    if (typeof parsed === 'object' && parsed !== null) {
      const validation = validateBudgetAmount(parsed.limit);
      if (validation.isValid) {
        return {
          limit: validation.cleanAmount,
          updatedAt: parsed.updatedAt || new Date().toISOString(),
        };
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Calculates current month recorded expenses.
 * Strictly excludes income and transactions outside the calendar month.
 *
 * @param {Array} transactions
 * @param {Date} referenceDate
 * @returns {number}
 */
export function calculateCurrentMonthExpenses(transactions = [], referenceDate = new Date()) {
  if (!Array.isArray(transactions)) return 0;

  let totalExpenses = 0;
  for (const t of transactions) {
    if (t.type === 'expense' && isTransactionInPeriod(t, 'current', referenceDate)) {
      const amt = Math.round((Number(t.amount) || 0) * 100) / 100;
      if (amt > 0) {
        totalExpenses += amt;
      }
    }
  }

  return Math.round(totalExpenses * 100) / 100;
}

/**
 * Calculates budget usage metrics and status.
 *
 * @param {number|object|null} budget
 * @param {Array} transactions
 * @param {Date} referenceDate
 * @param {'ar'|'en'|string} lang
 * @returns {object}
 */
export function calculateBudgetUsage(
  budget,
  transactions = [],
  referenceDate = new Date(),
  lang = 'ar'
) {
  const parsedBudget = parseStoredBudget(budget);
  const isEn = lang === 'en';

  if (!parsedBudget) {
    const currentExpenses = calculateCurrentMonthExpenses(transactions, referenceDate);
    const statusTextAr = BUDGET_STATUS_TEXT_AR[BUDGET_STATUS.NO_BUDGET];
    const statusTextEn = BUDGET_STATUS_TEXT_EN[BUDGET_STATUS.NO_BUDGET];
    return {
      isConfigured: false,
      limit: 0,
      spent: currentExpenses,
      remaining: 0,
      overAmount: 0,
      isOverBudget: false,
      percentage: 0,
      progressBarWidth: 0,
      status: BUDGET_STATUS.NO_BUDGET,
      statusKey: BUDGET_STATUS_KEYS[BUDGET_STATUS.NO_BUDGET],
      statusText: isEn ? statusTextEn : statusTextAr,
      statusTextAr,
      statusTextEn,
      statusColor: '#64748B',
      statusBg: '#F1F5F9',
    };
  }

  const limit = parsedBudget.limit;
  const spent = calculateCurrentMonthExpenses(transactions, referenceDate);

  let remaining = 0;
  let overAmount = 0;
  let isOverBudget = false;

  if (spent <= limit) {
    remaining = Math.round((limit - spent) * 100) / 100;
  } else {
    overAmount = Math.round((spent - limit) * 100) / 100;
    isOverBudget = true;
    remaining = 0;
  }

  // Prevent division by zero (guaranteed by limit > 0)
  const rawPercentage = (spent / limit) * 100;
  const percentage = Math.round(rawPercentage * 10) / 10;
  // Progress bar clamped between 0 and 100%
  const progressBarWidth = Math.min(100, Math.max(0, percentage));

  let status = BUDGET_STATUS.NORMAL;
  let statusColor = '#10B981';
  let statusBg = '#ECFDF5';

  if (percentage > 100) {
    status = BUDGET_STATUS.EXCEEDED;
    statusColor = '#DC2626';
    statusBg = '#FEF2F2';
  } else if (percentage === 100) {
    status = BUDGET_STATUS.REACHED;
    statusColor = '#EA580C';
    statusBg = '#FFF7ED';
  } else if (percentage >= 80) {
    status = BUDGET_STATUS.WARNING;
    statusColor = '#F59E0B';
    statusBg = '#FFFBEB';
  }

  const statusTextAr = BUDGET_STATUS_TEXT_AR[status];
  const statusTextEn = BUDGET_STATUS_TEXT_EN[status];
  const statusKey = BUDGET_STATUS_KEYS[status];
  const statusText = isEn ? statusTextEn : statusTextAr;

  return {
    isConfigured: true,
    limit,
    spent,
    remaining,
    overAmount,
    isOverBudget,
    percentage,
    progressBarWidth,
    status,
    statusKey,
    statusText,
    statusTextAr,
    statusTextEn,
    statusColor,
    statusBg,
  };
}
