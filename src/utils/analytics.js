/**
 * Analytics Utility for Masroofy Tracker (مصروفي)
 * Phase 3A: Dynamic Transaction-Based Analytics Engine
 */

export const ARABIC_MONTH_NAMES = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

export const ENGLISH_MONTH_NAMES = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];

export const ENGLISH_MONTH_SHORT = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
];

export const ENGLISH_MONTH_NAMES_DISPLAY = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const ENGLISH_MONTH_SHORT_DISPLAY = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const PERIOD_OPTIONS = [
  { key: 'current', label: 'الشهر الحالي', labelEn: 'Current Month', labelAr: 'الشهر الحالي' },
  { key: 'last', label: 'الشهر الماضي', labelEn: 'Last Month', labelAr: 'الشهر الماضي' },
  { key: 'all', label: 'كل الفترات', labelEn: 'All Time', labelAr: 'كل الفترات' },
];

/**
 * Safely parses a transaction date string into year and month.
 * Handles:
 *  - "اليوم ، 2:30 م" / "Today, 2:30 PM" -> Reference date year/month
 *  - "أمس ، 7:20 م" / "Yesterday, 7:20 PM" -> Yesterday's year/month
 *  - "12 أكتوبر ، 1:10 م" / "Oct 12, 1:10 PM" -> Month name matching
 *  - "2026-10-15" -> Standard ISO format
 *  - Date.parse compatible strings
 *  - Missing, null, or invalid strings safely
 *
 * @param {string} txDate
 * @param {Date} referenceDate
 * @returns {{ year: number|null, month: number|null, isValid: boolean }}
 */
export function parseTransactionDate(txDate, referenceDate = new Date()) {
  if (!txDate || typeof txDate !== 'string') {
    return { year: null, month: null, isValid: false };
  }

  const str = txDate.trim();
  if (!str) {
    return { year: null, month: null, isValid: false };
  }

  const lowerStr = str.toLowerCase();

  // 1. Relative keywords (Arabic & English)
  if (str.includes('اليوم') || lowerStr.includes('today')) {
    return {
      year: referenceDate.getFullYear(),
      month: referenceDate.getMonth(), // 0-indexed
      isValid: true,
    };
  }

  if (str.includes('أمس') || lowerStr.includes('yesterday')) {
    const yesterday = new Date(referenceDate);
    yesterday.setDate(yesterday.getDate() - 1);
    return {
      year: yesterday.getFullYear(),
      month: yesterday.getMonth(),
      isValid: true,
    };
  }

  // 2. ISO or YYYY-MM-DD / YYYY/MM/DD format
  const isoMatch = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (isoMatch) {
    const y = parseInt(isoMatch[1], 10);
    const m = parseInt(isoMatch[2], 10) - 1;
    if (m >= 0 && m <= 11) {
      return { year: y, month: m, isValid: true };
    }
  }

  // 3. Arabic Month Name detection
  for (let i = 0; i < ARABIC_MONTH_NAMES.length; i++) {
    const monthName = ARABIC_MONTH_NAMES[i];
    if (str.includes(monthName)) {
      const yearMatch = str.match(/\b(20\d\d)\b/);
      const y = yearMatch ? parseInt(yearMatch[1], 10) : referenceDate.getFullYear();
      return { year: y, month: i, isValid: true };
    }
  }

  // 4. English Month Name detection
  for (let i = 0; i < ENGLISH_MONTH_NAMES.length; i++) {
    if (lowerStr.includes(ENGLISH_MONTH_NAMES[i]) || lowerStr.includes(ENGLISH_MONTH_SHORT[i])) {
      const yearMatch = str.match(/\b(20\d\d)\b/);
      const y = yearMatch ? parseInt(yearMatch[1], 10) : referenceDate.getFullYear();
      return { year: y, month: i, isValid: true };
    }
  }

  // 5. Standard JavaScript Date.parse fallback
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return {
      year: parsed.getFullYear(),
      month: parsed.getMonth(),
      isValid: true,
    };
  }

  return { year: null, month: null, isValid: false };
}

/**
 * Determines if a transaction falls within the requested period filter.
 *
 * @param {object} tx
 * @param {'current'|'last'|'all'|string} periodKey
 * @param {Date} referenceDate
 * @returns {boolean}
 */
export function isTransactionInPeriod(tx, periodKey = 'current', referenceDate = new Date()) {
  if (!tx) return false;

  // 'all' includes all valid transactions, even those with unparseable dates
  if (periodKey === 'all' || periodKey === 'كل الفترات') {
    return true;
  }

  const { year, month, isValid } = parseTransactionDate(tx.date, referenceDate);
  if (!isValid) {
    return false;
  }

  const refYear = referenceDate.getFullYear();
  const refMonth = referenceDate.getMonth();

  if (periodKey === 'current' || periodKey === 'الشهر الحالي') {
    return year === refYear && month === refMonth;
  }

  if (periodKey === 'last' || periodKey === 'الشهر الماضي') {
    const prevMonth = refMonth === 0 ? 11 : refMonth - 1;
    const prevYear = refMonth === 0 ? refYear - 1 : refYear;
    return year === prevYear && month === prevMonth;
  }

  return false;
}

/**
 * Calculates dynamic analytics for the given transactions and period.
 *
 * @param {Array} transactions
 * @param {'current'|'last'|'all'|string} periodKey
 * @param {Date} referenceDate
 * @returns {object}
 */
export function calculatePeriodAnalytics(
  transactions = [],
  periodKey = 'current',
  referenceDate = new Date()
) {
  if (!Array.isArray(transactions)) {
    return {
      period: periodKey,
      transactionCount: 0,
      totalIncome: 0,
      totalExpenses: 0,
      netCashFlow: 0,
      categories: [],
      donutSegments: [],
      periodTransactions: [],
    };
  }

  const periodTx = transactions.filter((tx) =>
    isTransactionInPeriod(tx, periodKey, referenceDate)
  );

  let rawIncome = 0;
  let rawExpenses = 0;

  for (const t of periodTx) {
    const amt = Math.round((Number(t.amount) || 0) * 100) / 100;
    if (amt > 0) {
      if (t.type === 'income') {
        rawIncome += amt;
      } else if (t.type === 'expense') {
        rawExpenses += amt;
      }
    }
  }

  const totalIncome = Math.round(rawIncome * 100) / 100;
  const totalExpenses = Math.round(rawExpenses * 100) / 100;
  const netCashFlow = Math.round((totalIncome - totalExpenses) * 100) / 100;

  // Category breakdown: Strictly for expenses (Income must NEVER be included)
  const categoryMap = {};

  for (const t of periodTx) {
    if (t.type !== 'expense') continue;
    const amt = Math.round((Number(t.amount) || 0) * 100) / 100;
    if (amt <= 0) continue;

    const key = t.categoryKey || t.category || 'other';
    const label = t.category || key;

    if (!categoryMap[key]) {
      categoryMap[key] = {
        key,
        label,
        amount: 0,
        icon: t.icon || 'Tag',
        color: t.color || '#475569',
        bg: t.bg || '#F1F5F9',
        count: 0,
      };
    }

    categoryMap[key].amount =
      Math.round((categoryMap[key].amount + amt) * 100) / 100;
    categoryMap[key].count += 1;
  }

  const categories = Object.values(categoryMap).map((cat) => {
    const percentage =
      totalExpenses > 0
        ? Math.round((cat.amount / totalExpenses) * 1000) / 10
        : 0;
    return {
      ...cat,
      percentage,
      formattedPercentage: `${percentage}%`,
    };
  });

  // Sort by highest expense amount descending
  categories.sort((a, b) => b.amount - a.amount);

  // SVG Donut Chart Calculation
  // Circumference for r=38 is ~238.76 (2 * PI * 38)
  const CIRCUMFERENCE = 238.76;
  let runningOffset = 0;

  const donutSegments = categories.map((cat) => {
    const strokeLength =
      totalExpenses > 0
        ? Math.round((cat.amount / totalExpenses) * CIRCUMFERENCE * 100) / 100
        : 0;
    const strokeDasharray = `${strokeLength} ${CIRCUMFERENCE}`;
    const strokeDashoffset = -runningOffset;
    runningOffset += strokeLength;

    return {
      key: cat.key,
      color: cat.color,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return {
    period: periodKey,
    transactionCount: periodTx.length,
    totalIncome,
    totalExpenses,
    netCashFlow,
    categories,
    donutSegments,
    periodTransactions: periodTx,
  };
}

/**
 * Calculates monthly expense and income trends for the past N months.
 *
 * @param {Array} transactions
 * @param {Date} referenceDate
 * @param {number} monthsCount
 * @param {'ar'|'en'|string} lang
 * @returns {Array}
 */
export function calculateMonthlyTrends(
  transactions = [],
  referenceDate = new Date(),
  monthsCount = 6,
  lang = 'ar'
) {
  if (!Array.isArray(transactions)) {
    return [];
  }

  const trends = [];
  const refYear = referenceDate.getFullYear();
  const refMonth = referenceDate.getMonth();
  const isEn = lang === 'en';

  for (let i = monthsCount - 1; i >= 0; i--) {
    let targetMonth = refMonth - i;
    let targetYear = refYear;
    while (targetMonth < 0) {
      targetMonth += 12;
      targetYear -= 1;
    }

    // Filter transactions for targetYear and targetMonth
    const monthTx = transactions.filter((tx) => {
      const { year, month, isValid } = parseTransactionDate(tx.date, referenceDate);
      return isValid && year === targetYear && month === targetMonth;
    });

    let expenses = 0;
    let income = 0;
    for (const t of monthTx) {
      const amt = Math.round((Number(t.amount) || 0) * 100) / 100;
      if (amt > 0) {
        if (t.type === 'expense') expenses += amt;
        else if (t.type === 'income') income += amt;
      }
    }

    expenses = Math.round(expenses * 100) / 100;
    income = Math.round(income * 100) / 100;

    const arabicLabel = ARABIC_MONTH_NAMES[targetMonth];
    const englishShort = ENGLISH_MONTH_SHORT_DISPLAY[targetMonth];
    const englishFull = ENGLISH_MONTH_NAMES_DISPLAY[targetMonth];

    trends.push({
      monthKey: `${targetYear}-${targetMonth + 1}`,
      monthLabel: isEn ? englishShort : arabicLabel,
      monthLabelShort: isEn ? englishShort : arabicLabel,
      monthLabelFull: isEn ? englishFull : arabicLabel,
      monthLabelEn: englishShort,
      monthLabelFullEn: englishFull,
      monthLabelAr: arabicLabel,
      monthLabelFullAr: arabicLabel,
      monthIndex: targetMonth,
      year: targetYear,
      expenses,
      income,
      isActive: targetYear === refYear && targetMonth === refMonth,
      txCount: monthTx.length,
    });
  }

  // Calculate relative bar heights (maximum expense in the window sets 100%)
  const maxExpense = Math.max(...trends.map((t) => t.expenses), 1);
  return trends.map((t) => {
    let heightPercent = 0;
    if (t.expenses > 0) {
      heightPercent = Math.max(12, Math.round((t.expenses / maxExpense) * 90));
    }
    return {
      ...t,
      height: `${heightPercent}%`,
      displayAmount: t.expenses >= 1000
        ? `${(t.expenses / 1000).toFixed(1)}K`
        : `${t.expenses}`,
    };
  });
}
