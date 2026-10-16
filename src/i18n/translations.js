/**
 * Masroofy Tracker — Bilingual Translation Dictionary (i18n)
 * Default: English ('en')
 * Optional: Arabic ('ar')
 */

export const translations = {
  en: {
    // App Branding & Meta
    appName: 'Masroofy Tracker',
    appTagline: 'Smart personal finance & expense tracker',

    // Common Actions & Labels
    cancel: 'Cancel',
    save: 'Save',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    back: 'Back',
    today: 'Today',
    yesterday: 'Yesterday',
    points: 'points',
    point: 'point',
    pts: 'pts',
    comingSoon: 'Coming Soon',
    comingSoonBadge: 'Coming Soon',
    all: 'All',
    success: 'Success',
    error: 'Error',
    info: 'Information',
    active: 'Active',
    locked: 'Locked',
    unlocked: 'Unlocked',

    // Navigation Tabs
    nav: {
      dashboard: 'Home',
      reports: 'Reports',
      rewards: 'Rewards',
      settings: 'Settings',
    },

    // Header
    header: {
      goodMorning: 'Good morning',
      goodEvening: 'Good evening',
      overviewSub: "Here's your spending overview today",
      toggleTheme: 'Toggle Theme',
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode',
      notifications: 'Notifications',
      noNotifications: 'No new notifications at this time',
      profileTooltip: 'Profile & Settings',
    },

    // Dashboard Page
    dashboard: {
      greeting: 'Welcome back',
      currentBalance: 'Current Balance',
      totalIncome: 'Total Income',
      totalExpenses: 'Total Expenses',
      addExpense: 'Add Expense',
      addIncome: 'Add Income',
      setBudget: 'Set Budget',
      monthlyBudget: 'Monthly Budget',
      budgetStatus: 'Budget Status',
      budgetRemaining: 'Remaining',
      budgetSpent: 'Spent',
      budgetExceeded: 'Budget limit exceeded!',
      budgetNearLimit: 'Approaching budget limit (over 80%)',
      budgetHealthy: 'Spending is within healthy budget',
      recentTransactions: 'Recent Transactions',
      viewAll: 'View All',
      noTransactions: 'No transactions recorded yet.',
      noTransactionsSub: 'Tap "Add Expense" or "Add Income" to start tracking your finances.',
    },

    // Transaction Modals
    txModal: {
      addExpenseTitle: 'Add New Expense',
      addIncomeTitle: 'Add New Income',
      editExpenseTitle: 'Edit Expense',
      editIncomeTitle: 'Edit Income',
      transactionDetailsTitle: 'Transaction Details',
      amountLabel: 'Amount',
      titleLabel: 'Description / Title',
      titlePlaceholder: 'e.g. Grocery shopping, Uber ride...',
      categoryLabel: 'Category',
      dateLabel: 'Date',
      notesLabel: 'Notes (Optional)',
      notesPlaceholder: 'Add any optional details or notes...',
      typeLabel: 'Type',
      expense: 'Expense',
      income: 'Income',
      saveTransaction: 'Save Transaction',
      updateTransaction: 'Update Transaction',
      deleteTransaction: 'Delete Transaction',
      deleteConfirmTitle: 'Confirm Delete',
      deleteConfirmMessage: 'Are you sure you want to permanently delete this transaction? This action cannot be undone.',
      amountRequired: 'Please enter a valid amount greater than zero.',
      titleRequired: 'Please enter a description for this transaction.',
    },

    // Reports Page
    reports: {
      title: 'Financial Reports',
      subtitle: 'Dynamic analytics derived from recorded transactions',
      periodSelectorAria: 'Select time period for reports',
      periods: {
        current: 'Current Month',
        last30: 'Last 30 Days',
        last90: 'Last 3 Months',
        last180: 'Last 6 Months',
        all: 'All Time',
      },
      netCashFlow: 'Net Cash Flow',
      incomeVsExpense: 'Cash Flow Comparison',
      categoryBreakdown: 'Spending by Category',
      spendingTrends: 'Monthly Trends',
      monthlyTrendsTitle: 'Monthly Trends',
      last6Months: 'Last 6 Months',
      totalAccountBalance: 'Total Account Balance: ',
      totalCumulativeExpenses: 'Total Cumulative Expenses: ',
      noDataForPeriod: 'No transactions found for the selected time period.',
      totalPeriodIncome: 'Total Income',
      totalPeriodExpenses: 'Total Expenses',
      positiveSavings: 'Net Savings',
      negativeDeficit: 'Net Deficit',
      topSpendingCategory: 'Top Spending Category',
      transactionCount: 'Transactions Count',
    },

    // Budget Management
    budget: {
      modalTitleSet: 'Set Monthly Budget',
      modalTitleEdit: 'Edit Monthly Budget',
      modalSubtitle: 'Set a maximum spending limit to help control your monthly expenses',
      limitLabel: 'Monthly Spending Limit',
      saveLimit: 'Save Budget Limit',
      removeBudget: 'Remove Budget',
      removeConfirm: 'Are you sure you want to remove your monthly budget goal?',
      amountRequired: 'Please enter a valid positive budget amount.',
      // Statuses & Warning Banners
      statusNormal: 'Spending is on track',
      statusWarning: 'Notice: Approaching budget limit',
      statusReached: 'Reached 100% of budget limit',
      statusExceeded: 'Warning: Budget limit exceeded!',
      statusNoBudget: 'No budget set for this month',
      noLimitDescription: 'You have not set a spending limit this month. Set a monthly budget to monitor expenses and stay on track.',
      overBudgetBy: 'Over budget by: ',
    },

    // Rewards Page
    rewards: {
      title: 'Rewards & Achievements',
      subtitle: 'Interactive reward system to encourage financial discipline',
      heroPointsLabel: 'points',
      heroSubtitle: '350 Welcome Points + Points earned from recorded expenses',
      tabAvailable: 'Available Rewards',
      tabHistory: 'Redemption History',
      tabPolicy: 'Earning Policy',
      redeemBtn: 'Redeem',
      insufficientPointsBtn: 'Insufficient Points',
      unlockedBtn: 'Active ✓',
      toggleThemeBtn: 'Switch Theme',
      confirmRedeemTitle: 'Confirm Reward Redemption',
      confirmRedeemQuestion: 'Would you like to redeem "{title}" for {cost} points?',
      currentBalanceLabel: 'Current Balance:',
      redemptionCostLabel: 'Redemption Cost:',
      remainingAfterLabel: 'Remaining Balance After Redemption:',
      redeemSuccessToast: 'Successfully redeemed "{title}"! 🎉',
      alreadyUnlockedError: 'This reward has already been redeemed and activated.',
      insufficientPointsError: 'Sorry, your current balance of {points} points is not enough. You need {cost} points.',
      emptyHistoryTitle: 'No Redemptions Yet',
      emptyHistorySubtitle: 'When you redeem any reward, it will be permanently recorded here with date and points spent.',
      welcomeBonusAudit: 'Initial Welcome Bonus: +350 points (granted to explore the application).',

      // Dark Mode Lock Protection
      darkModeLockedAlert: 'Dark Mode is locked! You can unlock it for 200 points in the Rewards page. 🎁',
      darkModeUnlockedToast: 'Dark Mode unlocked and activated! You can now switch themes anytime.',

      // Coming Soon Section
      comingSoonHeading: 'Future Partner Discounts',
      comingSoonSubheading: 'Planned external partner perks and promotional discount vouchers',
      comingSoonInfoTitle: 'Partner Reward — Coming Soon',
      comingSoonInfoDesc: 'This external partner offer is currently in preparation for future app releases. No points will be deducted.',
      comingSoonNoticeBadge: 'Planned / Coming Soon',

      // Categories for Coming Soon
      catGaming: 'Gaming Rewards',
      catFashion: 'Fashion & Clothing',
      catCafes: 'Cafés & Coffee',

      // Policy Tab
      policyHeading: 'Points Rules & Earning Policy',
      policyRule1Title: '1 Point per 10 currency spent:',
      policyRule1Desc: 'Earn 1 reward point for every 10 currency units spent on valid expenses (minimum 1 point for any valid expense).',
      policyRule2Title: 'Income Excluded:',
      policyRule2Desc: 'Income transactions do not earn reward points, keeping rewards focused on spending awareness.',
      policyRule3Title: 'Automatic Adjustments:',
      policyRule3Desc: 'Editing an expense automatically recalculates points. Deleting an expense safely deducts its awarded points without going below zero.',
      policyRule4Title: 'Academic & In-App Perks:',
      policyRule4Desc: 'All rewards shown are local in-app software features and digital badges for educational demonstration.',
    },

    // Settings Page
    settings: {
      title: 'Settings',
      themeTitle: 'Theme (Dark Mode)',
      themeValueDark: 'Enabled (Dark)',
      themeValueLight: 'Disabled (Light)',
      themeLockedHint: 'Locked (Unlock in Rewards for 200 pts)',
      languageTitle: 'Language',
      languageValue: 'English (Default)',
      languageSelectorTitle: 'Select Application Language',
      languageOptionEn: 'English (Default - LTR)',
      languageOptionAr: 'العربية (Arabic - RTL)',
      currencyTitle: 'Base Currency',
      pwaTitle: 'Install App (PWA)',
      pwaReady: 'Ready for instant install',
      pwaDesc: 'Add Masroofy to home screen for fast offline access',
      pwaBtn: 'Install',
      backupTitle: 'Local Data Storage',
      backupDesc: 'All transactions and settings are stored locally on your device',
      resetTitle: 'Reset Financial Data',
      resetDesc: 'Clear all transactions, reset balance to zero, and lock Dark Mode',
      resetBtn: 'Reset Data',
      resetConfirm: 'Are you sure you want to reset all financial data? This will clear all transactions, reset your balance to zero, and restore 350 welcome points.',
      resetSuccess: 'Financial data has been reset to zero successfully!',
      installInstructions: 'To install Masroofy Tracker:\n\n• On iOS (Safari): Tap the Share button, then select "Add to Home Screen".\n• On Android/Chrome: Tap the browser menu (⋮), then select "Install App".',
      // Profile editing
      editProfile: 'Edit Profile',
      editProfileModalTitle: 'Edit Display Name',
      editProfileModalSub: 'Update your display name across the application',
      nameLabel: 'Display Name',
      namePlaceholder: 'Enter display name...',
      nameRequiredError: 'Display name cannot be empty.',
      nameTooLongError: 'Display name cannot exceed 40 characters.',
      profileSavedSuccess: 'Display name updated successfully!',
      demoAccountBadge: 'Demo Account',
      profileLocalNotice: 'This display name is stored locally on this device. No login, password, or backend server is used.',
    },

    // Categories
    categories: {
      food: 'Food & Dining',
      transport: 'Transportation',
      shopping: 'Shopping',
      bills: 'Bills & Utilities',
      health: 'Healthcare',
      education: 'Education',
      entertainment: 'Entertainment',
      salary: 'Salary & Income',
      freelance: 'Freelancing',
      investment: 'Investments',
      other: 'Other',
    },

    // Smart Financial Advice Tip strings (for rew-5)
    smartTips: [
      '💡 Smart Tip: Follow the 50/30/20 rule — 50% for needs, 30% for wants, and 20% for emergency savings.',
      '💡 Smart Tip: Setting a monthly budget limit helps reduce impulse purchases by up to 25%.',
      '💡 Smart Tip: Review recurring bills and subscriptions once a month to cancel unused services.',
      '💡 Smart Tip: Building an emergency fund covering 3 months of expenses provides peace of mind.',
      '💡 Smart Tip: Tracking every small daily expense is the first step toward long-term financial freedom!',
    ],
  },

  ar: {
    // App Branding & Meta
    appName: 'مصروفي Tracker',
    appTagline: 'تطبيق متابعة المصاريف الشخصية والميزانية الذكية',

    // Common Actions & Labels
    cancel: 'إلغاء',
    save: 'حفظ',
    confirm: 'تأكيد',
    delete: 'حذف',
    edit: 'تعديل',
    close: 'إغلاق',
    back: 'رجوع',
    today: 'اليوم',
    yesterday: 'أمس',
    points: 'نقطة',
    point: 'نقطة',
    pts: 'نقطة',
    comingSoon: 'قريباً',
    comingSoonBadge: 'قريباً',
    all: 'الكل',
    success: 'نجاح',
    error: 'خطأ',
    info: 'معلومات',
    active: 'مفعل',
    locked: 'مقفل',
    unlocked: 'متاح',

    // Navigation Tabs
    nav: {
      dashboard: 'الرئيسية',
      reports: 'التقارير',
      rewards: 'المكافآت',
      settings: 'الإعدادات',
    },

    // Header
    header: {
      goodMorning: 'صباح الخير',
      goodEvening: 'مساء الخير',
      overviewSub: 'نظرة على مصاريفك اليوم',
      toggleTheme: 'تبديل المظهر',
      lightMode: 'الوضع الفاتح',
      darkMode: 'الوضع الداكن',
      notifications: 'الإشعارات',
      noNotifications: 'لا توجد إشعارات جديدة حالياً',
      profileTooltip: 'الملف الشخصي والإعدادات',
    },

    // Dashboard Page
    dashboard: {
      greeting: 'أهلاً بك',
      currentBalance: 'الرصيد الحالي',
      totalIncome: 'إجمالي الدخل',
      totalExpenses: 'إجمالي المصاريف',
      addExpense: 'إضافة مصروف',
      addIncome: 'إضافة دخل',
      setBudget: 'تحديد ميزانية',
      monthlyBudget: 'الميزانية الشهرية',
      budgetStatus: 'حالة الميزانية',
      budgetRemaining: 'المتبقي',
      budgetSpent: 'المصروف',
      budgetExceeded: 'تم تجاوز سقف الميزانية المحدد!',
      budgetNearLimit: 'اقتربت من سقف الميزانية (أكثر من 80%)',
      budgetHealthy: 'الإنفاق ضمن المعدل الآمن للميزانية',
      recentTransactions: 'آخر العمليات',
      viewAll: 'عرض الكل',
      noTransactions: 'لا توجد عمليات مسجلة حتى الآن.',
      noTransactionsSub: 'اضغط على "إضافة مصروف" أو "إضافة دخل" لبدء تنظيم مصاريفك.',
    },

    // Transaction Modals
    txModal: {
      addExpenseTitle: 'إضافة مصروف جديد',
      addIncomeTitle: 'إضافة دخل جديد',
      editExpenseTitle: 'تعديل المصروف',
      editIncomeTitle: 'تعديل الدخل',
      transactionDetailsTitle: 'تفاصيل العملية',
      amountLabel: 'المبلغ',
      titleLabel: 'الوصف / العنوان',
      titlePlaceholder: 'مثال: مشتريات سوبرماركت، بنزين...',
      categoryLabel: 'التصنيف',
      dateLabel: 'التاريخ',
      notesLabel: 'ملاحظات (اختياري)',
      notesPlaceholder: 'أضف أي تفاصيل أو ملاحظات إضافية...',
      typeLabel: 'النوع',
      expense: 'مصروف',
      income: 'دخل',
      saveTransaction: 'حفظ العملية',
      updateTransaction: 'تحديث العملية',
      deleteTransaction: 'حذف العملية',
      deleteConfirmTitle: 'تأكيد الحذف',
      deleteConfirmMessage: 'هل أنت متأكد من رغبتك في حذف هذه العملية نهائياً؟ لا يمكن التراجع عن هذا الإجراء.',
      amountRequired: 'يرجى إدخال مبلغ صحيح أكبر من الصفر.',
      titleRequired: 'يرجى كتابة عنوان أو وصف للعملية.',
    },

    // Reports Page
    reports: {
      title: 'التقارير المالية',
      subtitle: 'تحليل ديناميكي مبني على العمليات المسجلة',
      periodSelectorAria: 'تحديد الفترة الزمنية للتقارير',
      periods: {
        current: 'الشهر الحالي',
        last30: 'آخر 30 يوم',
        last90: 'آخر 3 أشهر',
        last180: 'آخر 6 أشهر',
        all: 'كل الفترات',
      },
      netCashFlow: 'صافي التدفق النقدي',
      incomeVsExpense: 'مقارنة الدخل والمصاريف',
      categoryBreakdown: 'توزيع المصاريف حسب التصنيف',
      spendingTrends: 'المسار الشهري للمصاريف',
      monthlyTrendsTitle: 'المسار الشهري للمصاريف',
      last6Months: 'آخر 6 أشهر',
      totalAccountBalance: 'رصيد الحساب الإجمالي الحالي: ',
      totalCumulativeExpenses: 'إجمالي المصاريف التراكمية: ',
      noDataForPeriod: 'لا توجد عمليات مسجلة خلال الفترة المحددة.',
      totalPeriodIncome: 'إجمالي الدخل',
      totalPeriodExpenses: 'إجمالي المصاريف',
      positiveSavings: 'صافي توفير',
      negativeDeficit: 'عجز نقدي',
      topSpendingCategory: 'أعلى تصنيف إنفاقاً',
      transactionCount: 'عدد العمليات',
    },

    // Budget Management
    budget: {
      modalTitleSet: 'تحديد ميزانية شهرية',
      modalTitleEdit: 'تعديل الميزانية الشهرية',
      modalSubtitle: 'حدد حداً أقصى للمصاريف الشهرية للتحكم بالإنفاق',
      limitLabel: 'سقف المصاريف للشهر',
      saveLimit: 'حفظ سقف الميزانية',
      removeBudget: 'حذف الميزانية',
      removeConfirm: 'هل أنت متأكد من رغبتك في إلغاء سقف الميزانية المحدد؟',
      amountRequired: 'يرجى إدخال مبلغ ميزانية صحيح أكبر من الصفر.',
      // Statuses & Warning Banners
      statusNormal: 'إنفاقك في المسار الطبيعي',
      statusWarning: 'تنبيه: اقتربت من استهلاك الميزانية',
      statusReached: 'وصلت إلى الحد الأقصى للميزانية',
      statusExceeded: 'تحذير: تجاوزت الميزانية المحددة!',
      statusNoBudget: 'لم يتم تحديد ميزانية لهذا الشهر',
      noLimitDescription: 'لم تقم بتحديد سقف للمصاريف هذا الشهر. حدد ميزانية شهرية لتتبع إنفاقك والحفاظ على استقرارك المالي.',
      overBudgetBy: 'تجاوزت الميزانية بمقدار: ',
    },

    // Rewards Page
    rewards: {
      title: 'المكافآت والإنجازات',
      subtitle: 'نظام مكافآت تجريبي لتشجيع الانضباط المالي',
      heroPointsLabel: 'نقطة',
      heroSubtitle: '350 نقطة ترحيبية تجريبية + نقاط المصاريف المسجلة',
      tabAvailable: 'المكافآت المتاحة',
      tabHistory: 'سجل الاستبدال',
      tabPolicy: 'طريقة الكسب',
      redeemBtn: 'استبدال',
      insufficientPointsBtn: 'نقاط غير كافية',
      unlockedBtn: 'مفعّل ✓',
      toggleThemeBtn: 'تبديل الثيم',
      confirmRedeemTitle: 'تأكيد استبدال المكافأة',
      confirmRedeemQuestion: 'هل ترغب في استبدال "{title}" مقابل {cost} نقطة؟',
      currentBalanceLabel: 'رصيدك الحالي:',
      redemptionCostLabel: 'تكلفة الاستبدال:',
      remainingAfterLabel: 'الرصيد المتبقي بعد الاستبدال:',
      redeemSuccessToast: 'تم استبدال "{title}" بنجاح! 🎉',
      alreadyUnlockedError: 'تم استبدال هذه المكافأة وتفعيلها مسبقاً.',
      insufficientPointsError: 'عذراً، رصيدك الحالي ({points} نقطة) لا يكفي. تحتاج إلى {cost} نقطة.',
      emptyHistoryTitle: 'لا توجد مكافآت مستبدلة بعد',
      emptyHistorySubtitle: 'عند استبدال أي مكافأة، سيتم توثيقها في هذا السجل مع التاريخ وعدد النقاط.',
      welcomeBonusAudit: 'الرصيد الافتتاحي التجريبي: +350 نقطة (ممنوحة كهدية ترحيبية لتقييم التطبيق الأكاديمي).',

      // Dark Mode Lock Protection
      darkModeLockedAlert: 'المظهر الداكن مقفل! يمكنك فتحه مقابل 200 نقطة من صفحة المكافآت. 🎁',
      darkModeUnlockedToast: 'تم فتح وتفعيل المظهر الداكن بنجاح! يمكنك التبديل بحرية الآن.',

      // Coming Soon Section
      comingSoonHeading: 'خصومات الشركاء المستقبلية',
      comingSoonSubheading: 'عروض وقسائم خصم مرتقبة مع شركاء خارجيين',
      comingSoonInfoTitle: 'مكافأة شريك — قريباً',
      comingSoonInfoDesc: 'هذه العروض الخارجية قيد التجهيز والتخطيط للإصدارات القادمة للتطبيق. لن يتم خصم أي نقاط.',
      comingSoonNoticeBadge: 'مخطط لها / قريباً',

      // Categories for Coming Soon
      catGaming: 'مكافآت الألعاب',
      catFashion: 'الأزياء والملابس',
      catCafes: 'المقاهي والكافيهات',

      // Policy Tab
      policyHeading: 'قواعد وسياسة كسب النقاط',
      policyRule1Title: '1 نقطة لكل 10 جنيه مصروف:',
      policyRule1Desc: 'يُمنح المستخدم نقطة واحدة مقابل كل 10 وحدات نقدية يتم تسجيلها كمصروف فعلي، بحد أدنى نقطة واحدة لأي مصروف صالح.',
      policyRule2Title: 'استبعاد الدخل:',
      policyRule2Desc: 'حركات الدخل لا تمنح نقاطاً لضمان تركيز المكافآت على التوثيق المستمر للنفقات والحد من التبذير.',
      policyRule3Title: 'التعديل والحذف التلقائي:',
      policyRule3Desc: 'عند تعديل مبلغ المصروف يُعاد احتساب النقاط تلقائياً، وعند حذف العملية يتم استرجاع نقاطها الممنوحة بدقة دون أن تقل النقاط عن الصفر.',
      policyRule4Title: 'طبيعة المكافآت:',
      policyRule4Desc: 'جميع المكافآت المعروضة هي مزايا برمجية تجريبية وأوسمة رقمية داخل التطبيق للأغراض التعليمية والأكاديمية.',
    },

    // Settings Page
    settings: {
      title: 'الإعدادات',
      themeTitle: 'المظهر (الوضع الداكن)',
      themeValueDark: 'مفعل (داكن)',
      themeValueLight: 'معطل (فاتح)',
      themeLockedHint: 'مقفل (يمكن فتحه في المكافآت بـ 200 نقطة)',
      languageTitle: 'اللغة',
      languageValue: 'العربية',
      languageSelectorTitle: 'اختيار لغة التطبيق',
      languageOptionEn: 'English (الافتراضية - LTR)',
      languageOptionAr: 'العربية (Arabic - RTL)',
      currencyTitle: 'العملة الأساسية',
      pwaTitle: 'تثبيت التطبيق على جهازك (PWA)',
      pwaReady: 'جاهز للتثبيت الفوري',
      pwaDesc: 'إضافة مصروفي للشاشة الرئيسية للوصول السريع بدون إنترنت',
      pwaBtn: 'تثبيت',
      backupTitle: 'التخزين المحلي للبيانات',
      backupDesc: 'جميع العمليات والإعدادات محفوظة محلياً على جهازك',
      resetTitle: 'إعادة ضبط البيانات المالية',
      resetDesc: 'مسح كافة العمليات وتصفير الرصيد وقفل المظهر الداكن مجدداً',
      resetBtn: 'إعادة الضبط',
      resetConfirm: 'هل ترغب حقاً في إعادة ضبط البيانات المالية؟ سيؤدي ذلك إلى مسح كافة المعاملات وتصفير الرصيد واستعادة 350 نقطة ترحيبية.',
      resetSuccess: 'تمت إعادة ضبط البيانات المالية بنجاح!',
      installInstructions: 'لتثبيت تطبيق مصروفي (PWA):\n\n• على هواتف iPhone (Safari): اضغط على زر المشاركة ثم اختر "إضافة إلى الشاشة الرئيسية" (Add to Home Screen).\n• على متصفحات Chrome/Edge/Android: اضغط على القائمة (⋮) ثم اختر "تثبيت التطبيق" (Install App).',
      // Profile editing
      editProfile: 'تعديل الملف الشخصي',
      editProfileModalTitle: 'تعديل الاسم المعروض',
      editProfileModalSub: 'تحديث اسمك المعروض في التطبيق',
      nameLabel: 'الاسم المعروض',
      namePlaceholder: 'أدخل الاسم هنا...',
      nameRequiredError: 'يرجى إدخال اسم صحيح غير فارغ.',
      nameTooLongError: 'يجب ألا يتجاوز الاسم 40 حرفاً.',
      profileSavedSuccess: 'تم تحديث الاسم المعروض بنجاح!',
      demoAccountBadge: 'حساب تجريبي',
      profileLocalNotice: 'يُحفظ هذا الاسم محلياً فقط على هذا الجهاز. لا يوجد تسجيل دخول أو خادم سحابي.',
    },

    // Categories
    categories: {
      food: 'طعام ومشروبات',
      transport: 'المواصلات',
      shopping: 'التسوق',
      bills: 'الفواتير والالتزامات',
      health: 'الصحة والطب',
      education: 'التعليم والتطوير',
      entertainment: 'الترفيه',
      salary: 'الراتب والدخل',
      freelance: 'عمل حر',
      investment: 'استثمارات',
      other: 'أخرى',
    },

    // Smart Financial Advice Tip strings (for rew-5)
    smartTips: [
      '💡 نصيحة ذكية: اتبع قاعدة 50/30/20 — 50% للاحتياجات الأساسية، 30% للرغبات، و 20% للادخار وصندوق الطوارئ.',
      '💡 نصيحة ذكية: تحديد سقف ميزانية شهري يساعد على تقليص المشتريات الاندفاعية بنسبة تصل إلى 25%.',
      '💡 نصيحة ذكية: راجع اشتراكاتك والخدمات الدورية شهرياً لإلغاء ما لا تستخدمه بانتظام.',
      '💡 نصيحة ذكية: الاحتفاظ بصندوق طوارئ يغطي نفقات 3 أشهر يمنحك استقراراً مالياً وراحة بال.',
      '💡 نصيحة ذكية: تسجيل كل مصروف صغير يومياً هو الخطوة الأولى لتحقيق أهدافك المالية الكبرى!',
    ],
  },
};

/**
 * Helper to translate keys with parameter interpolation.
 * Supports dot notation: e.g. getTranslation('en', 'nav.dashboard')
 *
 * @param {string} lang 'en' | 'ar'
 * @param {string} keyPath dot-separated path
 * @param {object} [params] interpolation params
 * @param {string} [fallback] fallback if not found
 * @returns {string}
 */
export function getTranslation(lang, keyPath, params = {}, fallback = '') {
  const dictionary = translations[lang] || translations.en;
  const parts = keyPath.split('.');
  let current = dictionary;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      current = null;
      break;
    }
  }

  // Fallback to English dictionary if key missing in Arabic
  if (current === null && lang !== 'en') {
    let enCurrent = translations.en;
    for (const part of parts) {
      if (enCurrent && typeof enCurrent === 'object' && part in enCurrent) {
        enCurrent = enCurrent[part];
      } else {
        enCurrent = null;
        break;
      }
    }
    if (enCurrent !== null) {
      current = enCurrent;
    }
  }

  if (current === null || typeof current !== 'string') {
    return fallback || keyPath;
  }

  let text = current;
  if (params && typeof params === 'object') {
    for (const [pKey, pVal] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
    }
  }

  return text;
}
