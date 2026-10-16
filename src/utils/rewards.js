/**
 * Rewards & Redemption Utility for Masroofy Tracker (مصروفي)
 * Phase 4 & Product Refinements:
 * - English default & Arabic support
 * - 350 Welcome Points with Dark Mode LOCKED by default (costs 200 pts to redeem)
 * - Future Partner Discounts Coming Soon Catalog (Gaming, Fashion, Cafés)
 * - Safe points accounting & reverse-redemption protection
 */

export const POINTS_POLICY = {
  STARTING_DEMO_POINTS: 350,
  CURRENCY_PER_POINT: 10, // 1 point for every 10 units of currency spent
  MIN_POINTS_PER_EXPENSE: 1, // Any valid expense >= 1 currency gets at least 1 point
};

/**
 * Functional and Achievement In-App Rewards Catalog.
 * Note: Dark Mode (rew-1) starts LOCKED (unlockedByDefault: false).
 * User must explicitly spend 200 points to unlock it.
 */
export const DEFAULT_REWARDS_CATALOG = [
  {
    id: 'rew-1',
    title: 'فتح الثيم الداكن (Dark Mode)',
    titleEn: 'Unlock Dark Mode',
    titleAr: 'فتح الثيم الداكن (Dark Mode)',
    description: 'إمكانية التبديل إلى المظهر الليلي الهادئ والمريح للعين.',
    descriptionEn: 'Allows switching to eye-comfort dark mode across the entire app.',
    descriptionAr: 'إمكانية التبديل إلى المظهر الليلي الهادئ والمريح للعين.',
    pointsCost: 200,
    icon: 'Moon',
    color: '#6366F1',
    bg: '#1E1B4B',
    isFeature: true,
    repeatable: false,
    unlockedByDefault: false, // Explicitly locked by default!
  },
  {
    id: 'rew-2',
    title: 'وسام محلل البيانات المالي',
    titleEn: 'Financial Analyst Digital Badge',
    titleAr: 'وسام محلل البيانات المالي',
    description: 'وسام رقمي تذكاري تكريماً لمتابعتك المستمرة لتحليلات وتقارير المصاريف.',
    descriptionEn: 'Collectible digital achievement badge honoring your financial reports review.',
    descriptionAr: 'وسام رقمي تذكاري تكريماً لمتابعتك المستمرة لتحليلات وتقارير المصاريف.',
    pointsCost: 300,
    icon: 'BarChart3',
    color: '#F59E0B',
    bg: '#FEF3C7',
    isFeature: false,
    repeatable: false,
    unlockedByDefault: false,
  },
  {
    id: 'rew-3',
    title: 'شارة بطل الميزانية (VIP Badge)',
    titleEn: 'Budget Champion VIP Badge',
    titleAr: 'شارة بطل الميزانية (VIP Badge)',
    description: 'وسام تميز رقمي تكريماً لالتزامك بالخطة المالية للشهر.',
    descriptionEn: 'Cosmetic VIP achievement badge honoring your discipline with monthly budget goals.',
    descriptionAr: 'وسام تميز رقمي تكريماً لالتزامك بالخطة المالية للشهر.',
    pointsCost: 150,
    icon: 'Trophy',
    color: '#10B981',
    bg: '#D1FAE5',
    isFeature: false,
    repeatable: false,
    unlockedByDefault: false,
  },
  {
    id: 'rew-4',
    title: 'وسام منظم التصنيفات الرقمي',
    titleEn: 'Category Master Collector Badge',
    titleAr: 'وسام منظم التصنيفات الرقمي',
    description: 'وسام رقمي تكريماً للتنظيم المتقن لتصنيفات المصاريف.',
    descriptionEn: 'Collectible digital badge celebrating structured expense organization.',
    descriptionAr: 'وسام رقمي تكريماً للتنظيم المتقن لتصنيفات المصاريف.',
    pointsCost: 100,
    icon: 'Palette',
    color: '#EC4899',
    bg: '#FCE7F3',
    isFeature: false,
    repeatable: false,
    unlockedByDefault: false,
  },
  {
    id: 'rew-5',
    title: 'نصيحة مالية ذكية مخصصة',
    titleEn: 'Smart Financial Advice Perk',
    titleAr: 'نصيحة مالية ذكية مخصصة',
    description: 'استشارة وتلميحة مالية ذكية مقترحة لتنمية عادات التوفير.',
    descriptionEn: 'Receive an actionable smart financial tip based on healthy budgeting habits.',
    descriptionAr: 'استشارة وتلميحة مالية ذكية مقترحة لتنمية عادات التوفير.',
    pointsCost: 50,
    icon: 'Sparkles',
    color: '#8B5CF6',
    bg: '#EDE9FE',
    isFeature: false,
    repeatable: true,
    unlockedByDefault: false,
  },
];

/**
 * Future Partner Discounts Catalog (Coming Soon).
 * Grouped into 3 distinct categories:
 * 1. Gaming Rewards: Valorant, PUBG Mobile.
 * 2. Fashion & Clothing: Apparel store discounts.
 * 3. Cafés & Coffee: Participating local cafés.
 *
 * NOTE: These items are strictly planned rewards and cannot be redeemed.
 * No confirmed partners, discount codes, or fake percentages are fabricated.
 */
export const COMING_SOON_REWARDS = [
  {
    categoryKey: 'gaming',
    categoryTitleEn: 'Gaming Rewards',
    categoryTitleAr: 'مكافآت الألعاب',
    items: [
      {
        id: 'cs-val',
        titleEn: 'Valorant Points & In-Game Discounts',
        titleAr: 'خصومات نقاط ومظاهر فالورانت (Valorant)',
        descriptionEn: 'Upcoming promotional discounts on official Valorant points vouchers.',
        descriptionAr: 'عروض وخصومات مستقبلية على شحن بطاقات ونقاط لعبة فالورانت.',
        icon: 'Gamepad2',
        color: '#EF4444',
        bg: '#FEE2E2',
        isComingSoon: true,
      },
      {
        id: 'cs-pubg',
        titleEn: 'PUBG Mobile UC Vouchers',
        titleAr: 'خصومات شحن شدات ببجي (PUBG Mobile)',
        descriptionEn: 'Planned discount offers on official PUBG Mobile UC game vouchers.',
        descriptionAr: 'خصومات مرتقبة على قسائم شحن شدات لعبة ببجي موبايل الرسمية.',
        icon: 'Flame',
        color: '#F97316',
        bg: '#FFEDD5',
        isComingSoon: true,
      },
    ],
  },
  {
    categoryKey: 'fashion',
    categoryTitleEn: 'Fashion & Clothing',
    categoryTitleAr: 'الأزياء والملابس',
    items: [
      {
        id: 'cs-fashion',
        titleEn: 'Selected Clothing Brands & Retail Stores',
        titleAr: 'متاجر أزياء وملابس شريكة',
        descriptionEn: 'Future discounts at selected clothing, apparel, and fashion outlets.',
        descriptionAr: 'خصومات مستقبلية لدى متاجر ملابس وأزياء مختارة للمتسوقين.',
        icon: 'Shirt',
        color: '#8B5CF6',
        bg: '#EDE9FE',
        isComingSoon: true,
      },
    ],
  },
  {
    categoryKey: 'cafes',
    categoryTitleEn: 'Cafés & Coffee',
    categoryTitleAr: 'المقاهي والكافيهات',
    items: [
      {
        id: 'cs-coffee',
        titleEn: 'Participating Specialty Cafés',
        titleAr: 'مقاهي وكافيهات مختارة',
        descriptionEn: 'Future offers and seasonal perks at participating local coffee shops.',
        descriptionAr: 'عروض وخصومات مرتقبة لدى مقاهي وكافيهات محلية مشاركة.',
        icon: 'Coffee',
        color: '#D97706',
        bg: '#FEF3C7',
        isComingSoon: true,
      },
    ],
  },
];

/**
 * Calculates reward points earned from a transaction.
 *
 * Rules:
 * - Strictly for 'expense' transactions. Income earns 0 points.
 * - Amount must be a valid number >= 1.
 * - 1 point per 10 currency units spent, with minimum 1 point for any valid expense.
 *
 * @param {object} tx
 * @returns {number} points earned (integer >= 0)
 */
export function calculateTransactionPoints(tx) {
  if (!tx || typeof tx !== 'object') return 0;
  if (tx.type !== 'expense') return 0; // Income strictly excluded

  const amount = Number(tx.amount);
  if (isNaN(amount) || !isFinite(amount) || amount <= 0) return 0;

  if (amount < 1) return 0;
  return Math.max(
    POINTS_POLICY.MIN_POINTS_PER_EXPENSE,
    Math.floor(amount / POINTS_POLICY.CURRENCY_PER_POINT)
  );
}

/**
 * Safely parses persisted redemptions history from localStorage.
 *
 * @param {any} rawData
 * @returns {Array<object>}
 */
export function parseStoredRedemptions(rawData) {
  if (!rawData) return [];
  try {
    const parsed = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Safely parses unlocked reward IDs from localStorage.
 * Note: rew-1 starts locked, so defaultUnlocked is [] unless previously unlocked.
 *
 * @param {any} rawData
 * @returns {Array<string>}
 */
export function parseStoredUnlockedRewards(rawData) {
  const defaultUnlocked = DEFAULT_REWARDS_CATALOG.filter((r) => r.unlockedByDefault).map((r) => r.id);
  if (!rawData) return defaultUnlocked;
  try {
    const parsed = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
    if (Array.isArray(parsed)) {
      return Array.from(new Set([...defaultUnlocked, ...parsed]));
    }
    return defaultUnlocked;
  } catch {
    return defaultUnlocked;
  }
}

/**
 * Safely parses awarded transactions map from localStorage.
 *
 * @param {any} rawData
 * @returns {Record<string, number>}
 */
export function parseStoredAwardedTransactions(rawData) {
  if (!rawData) return {};
  try {
    const parsed = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return parsed;
    }
    return {};
  } catch {
    return {};
  }
}

/**
 * Validates and executes a reward redemption.
 *
 * Prevents:
 * - Redeeming Coming Soon rewards (strictly blocked).
 * - Redeeming nonexistent rewards.
 * - Duplicate redemption of non-repeatable rewards.
 * - Redeeming with insufficient points.
 * - Corrupted state or points dropping below zero.
 *
 * @param {Array} catalog
 * @param {string} rewardId
 * @param {number} currentPoints
 * @param {Array<string>} unlockedRewardIds
 * @param {string} [lang] 'en' | 'ar'
 * @returns {object} result of redemption
 */
export function processRedemption(
  catalog = DEFAULT_REWARDS_CATALOG,
  rewardId,
  currentPoints = 0,
  unlockedRewardIds = [],
  lang = 'ar'
) {
  const isArabic = lang === 'ar';

  if (!rewardId || typeof rewardId !== 'string') {
    return {
      success: false,
      error: isArabic ? 'معرّف المكافأة غير صحيح' : 'Invalid reward identifier',
    };
  }

  // Reject any Coming Soon partner discounts
  if (rewardId.startsWith('cs-')) {
    return {
      success: false,
      error: isArabic
        ? 'هذه المكافأة مخصصة للشركاء المستقبليين وقيد التجهيز (قريباً). لا يمكن استبدالها حالياً.'
        : 'This partner discount is planned for future updates and cannot be redeemed yet.',
    };
  }

  // Find reward in catalog
  const reward = catalog.find((r) => r.id === rewardId);
  if (!reward) {
    return {
      success: false,
      error: isArabic
        ? 'المكافأة المطلوبة غير موجودة في الكتالوج'
        : 'Requested reward was not found in catalog',
    };
  }

  if (reward.isComingSoon) {
    return {
      success: false,
      error: isArabic
        ? 'هذه المكافأة مخصصة للشركاء المستقبليين وقيد التجهيز (قريباً). لا يمكن استبدالها حالياً.'
        : 'This partner discount is planned for future updates and cannot be redeemed yet.',
    };
  }

  if (typeof reward.pointsCost !== 'number' || reward.pointsCost <= 0) {
    return {
      success: false,
      error: isArabic ? 'تكلفة المكافأة غير صالحة' : 'Invalid reward point cost',
    };
  }

  // Check if non-repeatable reward is already unlocked
  const isAlreadyUnlocked = unlockedRewardIds.includes(rewardId);
  if (isAlreadyUnlocked && !reward.repeatable) {
    return {
      success: false,
      error: isArabic
        ? 'تم استبدال هذه المكافأة وتفعيلها مسبقاً'
        : 'This reward has already been redeemed and activated',
    };
  }

  // Validate points balance
  const points = Number(currentPoints);
  if (isNaN(points) || points < 0) {
    return {
      success: false,
      error: isArabic ? 'رصيد النقاط الحالي غير صالح' : 'Current point balance is invalid',
    };
  }

  if (points < reward.pointsCost) {
    return {
      success: false,
      error: isArabic
        ? `عذراً، رصيدك الحالي (${points} نقطة) لا يكفي. تحتاج إلى ${reward.pointsCost} نقطة.`
        : `Sorry, your current balance of ${points} points is not enough. You need ${reward.pointsCost} points.`,
    };
  }

  // Deduct points exactly once
  const newPoints = points - reward.pointsCost;
  const newUnlockedIds = isAlreadyUnlocked ? unlockedRewardIds : [...unlockedRewardIds, rewardId];

  const now = new Date();
  const timeFormatted = now.toLocaleTimeString(isArabic ? 'ar-EG' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const dateFormatted = isArabic ? `اليوم ، ${timeFormatted}` : `Today, ${timeFormatted}`;

  const localizedTitle = isArabic ? reward.titleAr || reward.title : reward.titleEn || reward.title;

  const redemptionRecord = {
    id: `red-${now.getTime()}-${Math.random().toString(36).substr(2, 5)}`,
    rewardId: reward.id,
    rewardTitle: localizedTitle,
    pointsSpent: reward.pointsCost,
    timestamp: now.toISOString(),
    dateFormatted,
  };

  return {
    success: true,
    reward,
    newPoints,
    pointsSpent: reward.pointsCost,
    newUnlockedIds,
    redemptionRecord,
  };
}
