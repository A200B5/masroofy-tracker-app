import React, { useState } from 'react';
import {
  Trophy,
  Moon,
  BarChart3,
  Palette,
  Sparkles,
  Gift,
  Check,
  CheckCircle2,
  Clock,
  History,
  HelpCircle,
  Info,
  Lock,
  Gamepad2,
  Flame,
  Shirt,
  Coffee,
  Sparkle,
} from 'lucide-react';
import {
  DEFAULT_REWARDS_CATALOG,
  COMING_SOON_REWARDS,
} from '../utils/rewards';
import ConfirmRedeemModal from '../components/ConfirmRedeemModal';
import { useLanguage } from '../context/LanguageContext';

const ICON_MAP = {
  Moon,
  BarChart3,
  Palette,
  Sparkles,
  Trophy,
  Gift,
  Gamepad2,
  Flame,
  Shirt,
  Coffee,
};

export default function RewardsPage({
  points = 350,
  onToggleTheme,
  theme,
  unlockedRewardIds = [],
  redemptionsHistory = [],
  onRedeemReward,
}) {
  const { t, language, isRTL } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState('available'); // 'available' | 'history' | 'policy'
  const [selectedRewardToRedeem, setSelectedRewardToRedeem] = useState(null);
  const [successToast, setSuccessToast] = useState(null);
  const [comingSoonInfoModal, setComingSoonInfoModal] = useState(null);
  const [adviceModal, setAdviceModal] = useState(null);

  const handleSelectReward = (item) => {
    // If it's Dark Mode reward and already unlocked, toggle theme directly!
    if (item.id === 'rew-1' && unlockedRewardIds.includes('rew-1')) {
      if (onToggleTheme) onToggleTheme();
      return;
    }

    // Check if non-repeatable reward is already unlocked
    if (unlockedRewardIds.includes(item.id) && !item.repeatable) {
      return;
    }

    if (points < item.pointsCost) {
      alert(
        t(
          'rewards.insufficientPointsError',
          { points, cost: item.pointsCost },
          `Sorry, your current balance of ${points} points is not enough. You need ${item.pointsCost} points.`
        )
      );
      return;
    }

    setSelectedRewardToRedeem(item);
  };

  const handleConfirmRedeem = () => {
    if (!selectedRewardToRedeem) return;

    if (onRedeemReward) {
      const result = onRedeemReward(selectedRewardToRedeem.id);
      if (result && result.success) {
        const itemTitle =
          language === 'ar'
            ? selectedRewardToRedeem.titleAr || selectedRewardToRedeem.title
            : selectedRewardToRedeem.titleEn || selectedRewardToRedeem.title;

        setSuccessToast(
          t('rewards.redeemSuccessToast', { title: itemTitle }, `Successfully redeemed "${itemTitle}"! 🎉`)
        );
        setTimeout(() => setSuccessToast(null), 3800);

        // If it was the dark mode unlock, toggle it immediately
        if (selectedRewardToRedeem.id === 'rew-1' && onToggleTheme) {
          onToggleTheme();
        }

        // If it was smart financial advice, display an actionable tip
        if (selectedRewardToRedeem.id === 'rew-5') {
          const tips =
            language === 'ar'
              ? [
                  '💡 نصيحة ذكية: اتبع قاعدة 50/30/20 — 50% للاحتياجات الأساسية، 30% للرغبات، و 20% للادخار وصندوق الطوارئ.',
                  '💡 نصيحة ذكية: تحديد سقف ميزانية شهري يساعد على تقليص المشتريات الاندفاعية بنسبة تصل إلى 25%.',
                  '💡 نصيحة ذكية: راجع اشتراكاتك والخدمات الدورية شهرياً لإلغاء ما لا تستخدمه بانتظام.',
                  '💡 نصيحة ذكية: الاحتفاظ بصندوق طوارئ يغطي نفقات 3 أشهر يمنحك استقراراً مالياً وراحة بال.',
                  '💡 نصيحة ذكية: تسجيل كل مصروف صغير يومياً هو الخطوة الأولى نحو الحرية المالية!',
                ]
              : [
                  '💡 Smart Tip: Follow the 50/30/20 rule — 50% for needs, 30% for wants, and 20% for savings.',
                  '💡 Smart Tip: Setting a monthly budget limit helps curb impulse buying by up to 25%.',
                  '💡 Smart Tip: Review recurring bills and subscriptions monthly to cancel unused services.',
                  '💡 Smart Tip: Building an emergency buffer covering 3 months of expenses brings peace of mind.',
                  '💡 Smart Tip: Tracking every small daily expense is the first step to financial freedom!',
                ];
          const randomTip = tips[Math.floor(Math.random() * tips.length)];
          setAdviceModal(randomTip);
        }
      } else if (result && result.error) {
        alert(result.error);
      }
    }

    setSelectedRewardToRedeem(null);
  };

  const handleComingSoonClick = (item) => {
    // Shows informational dialog without deducting any points or calling redemption
    const itemTitle = language === 'ar' ? item.titleAr : item.titleEn;
    const itemDesc = language === 'ar' ? item.descriptionAr : item.descriptionEn;
    setComingSoonInfoModal({
      title: itemTitle,
      description: itemDesc,
    });
  };

  return (
    <div className="rewards-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('rewards.title', {}, 'Rewards & Achievements')}</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {t('rewards.subtitle', {}, 'Interactive reward system to encourage financial discipline')}
          </p>
        </div>
      </div>

      {/* Rewards Hero Card */}
      <div className="rewards-hero-card" id="rewards-hero-card">
        <div className="trophy-badge">
          <Trophy size={36} strokeWidth={2.4} />
        </div>
        <div
          id="rewards-points-balance"
          style={{
            fontSize: '2.1rem',
            fontWeight: 800,
            color: '#92400E',
            fontFamily: 'var(--font-numbers)',
            margin: '6px 0 2px 0',
          }}
        >
          {points}{' '}
          <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            {t('rewards.heroPointsLabel', {}, 'points')}
          </span>
        </div>
        <p style={{ fontSize: '0.84rem', color: '#B45309', fontWeight: 600 }}>
          {t(
            'rewards.heroSubtitle',
            {},
            '350 Welcome Points + Points earned from recorded expenses'
          )}
        </p>
      </div>

      {/* Success Feedback Toast */}
      {successToast && (
        <div
          id="rewards-success-toast"
          style={{
            background: '#DCFCE7',
            color: '#16A34A',
            border: '1px solid #86EFAC',
            borderRadius: '16px',
            padding: '12px 16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 700,
            fontSize: '0.86rem',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '6px',
          marginBottom: '18px',
          background: 'var(--bg-card)',
          padding: '4px',
          borderRadius: '16px',
          border: '1px solid var(--border-light)',
        }}
      >
        <button
          type="button"
          id="tab-rewards-available"
          onClick={() => setActiveSubTab('available')}
          style={{
            padding: '8px 4px',
            borderRadius: '12px',
            border: 'none',
            background: activeSubTab === 'available' ? 'var(--primary-600)' : 'transparent',
            color: activeSubTab === 'available' ? '#FFFFFF' : 'var(--text-secondary)',
            fontWeight: activeSubTab === 'available' ? 800 : 600,
            fontSize: '0.82rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {t('rewards.tabAvailable', {}, 'Available Rewards')}
        </button>

        <button
          type="button"
          id="tab-rewards-history"
          onClick={() => setActiveSubTab('history')}
          style={{
            padding: '8px 4px',
            borderRadius: '12px',
            border: 'none',
            background: activeSubTab === 'history' ? 'var(--primary-600)' : 'transparent',
            color: activeSubTab === 'history' ? '#FFFFFF' : 'var(--text-secondary)',
            fontWeight: activeSubTab === 'history' ? 800 : 600,
            fontSize: '0.82rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {t('rewards.tabHistory', {}, 'Redemption History')} ({redemptionsHistory.length})
        </button>

        <button
          type="button"
          id="tab-rewards-policy"
          onClick={() => setActiveSubTab('policy')}
          style={{
            padding: '8px 4px',
            borderRadius: '12px',
            border: 'none',
            background: activeSubTab === 'policy' ? 'var(--primary-600)' : 'transparent',
            color: activeSubTab === 'policy' ? '#FFFFFF' : 'var(--text-secondary)',
            fontWeight: activeSubTab === 'policy' ? 800 : 600,
            fontSize: '0.82rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {t('rewards.tabPolicy', {}, 'Earning Policy')}
        </button>
      </div>

      {/* View 1: Available Rewards Catalog & Coming Soon Section */}
      {activeSubTab === 'available' && (
        <div className="rewards-list" id="rewards-available-list">
          {/* Section 1: In-App Functional Rewards & Badges */}
          <div style={{ marginBottom: '24px' }}>
            <h2
              style={{
                fontSize: '0.98rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: '12px',
              }}
            >
              {t('rewards.tabAvailable', {}, 'Available Rewards')}
            </h2>

            {DEFAULT_REWARDS_CATALOG.map((item) => {
              const isUnlocked = unlockedRewardIds.includes(item.id);
              const canAfford = points >= item.pointsCost;
              const IconComp = ICON_MAP[item.icon] || Gift;
              const itemTitle =
                language === 'ar' ? item.titleAr || item.title : item.titleEn || item.title;
              const itemDesc =
                language === 'ar'
                  ? item.descriptionAr || item.description
                  : item.descriptionEn || item.description;

              return (
                <div
                  key={item.id}
                  className="reward-item-card"
                  id={`reward-card-${item.id}`}
                  style={{
                    padding: '16px',
                    borderRadius: '20px',
                    border: isUnlocked
                      ? '1.5px solid var(--border-light)'
                      : '1px solid var(--border-light)',
                    background: 'var(--bg-card)',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '16px',
                        backgroundColor: item.bg,
                        color: item.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <IconComp size={22} />
                    </div>

                    <div>
                      <div style={{ fontSize: '0.94rem', fontWeight: 800, marginBottom: '2px' }}>
                        {itemTitle}
                      </div>
                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--text-secondary)',
                          marginBottom: '4px',
                          lineHeight: 1.35,
                        }}
                      >
                        {itemDesc}
                      </div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: '#D97706',
                          fontWeight: 800,
                          fontFamily: 'var(--font-numbers)',
                        }}
                      >
                        {item.pointsCost} {t('points', {}, 'points')}
                      </div>
                    </div>
                  </div>

                  {/* Redeem / Action Button */}
                  <div>
                    {isUnlocked && !item.repeatable ? (
                      <button
                        type="button"
                        id={`btn-unlocked-${item.id}`}
                        onClick={() => handleSelectReward(item)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: 'var(--radius-pill)',
                          background: 'var(--primary-50)',
                          color: 'var(--primary-700)',
                          border: '1px solid var(--primary-300)',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: item.id === 'rew-1' ? 'pointer' : 'default',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          whiteSpace: 'nowrap',
                        }}
                        title={
                          item.id === 'rew-1'
                            ? t('rewards.toggleThemeBtn', {}, 'Switch Theme')
                            : t('rewards.unlockedBtn', {}, 'Active ✓')
                        }
                      >
                        <Check size={14} />
                        <span>
                          {item.id === 'rew-1'
                            ? t('rewards.toggleThemeBtn', {}, 'Switch Theme')
                            : t('rewards.unlockedBtn', {}, 'Active ✓')}
                        </span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        id={`btn-redeem-${item.id}`}
                        onClick={() => handleSelectReward(item)}
                        disabled={!canAfford}
                        style={{
                          padding: '8px 16px',
                          borderRadius: 'var(--radius-pill)',
                          background: canAfford ? 'var(--primary-600)' : 'var(--bg-primary)',
                          color: canAfford ? '#ffffff' : 'var(--text-muted)',
                          border: canAfford ? 'none' : '1px solid var(--border-light)',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: canAfford ? 'pointer' : 'not-allowed',
                          whiteSpace: 'nowrap',
                          boxShadow: canAfford ? '0 4px 12px rgba(13, 148, 136, 0.25)' : 'none',
                        }}
                      >
                        {canAfford
                          ? t('rewards.redeemBtn', {}, 'Redeem')
                          : t('rewards.insufficientPointsBtn', {}, 'Insufficient Points')}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section 2: Future Partner Discounts (Coming Soon Catalog) */}
          <div id="coming-soon-catalog-section" style={{ marginTop: '24px' }}>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Gift size={20} color="var(--primary-600)" />
                <h2
                  style={{
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}
                >
                  {t('rewards.comingSoonHeading', {}, 'Future Partner Discounts')}
                </h2>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                {t(
                  'rewards.comingSoonSubheading',
                  {},
                  'Planned external partner perks and promotional discount vouchers'
                )}
              </p>
            </div>

            {COMING_SOON_REWARDS.map((category) => {
              const catTitle =
                language === 'ar' ? category.categoryTitleAr : category.categoryTitleEn;

              return (
                <div key={category.categoryKey} style={{ marginBottom: '18px' }}>
                  <div
                    style={{
                      fontSize: '0.86rem',
                      fontWeight: 800,
                      color: 'var(--text-secondary)',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>{catTitle}</span>
                  </div>

                  {category.items.map((csItem) => {
                    const IconComp = ICON_MAP[csItem.icon] || Gift;
                    const itemTitle = language === 'ar' ? csItem.titleAr : csItem.titleEn;
                    const itemDesc = language === 'ar' ? csItem.descriptionAr : csItem.descriptionEn;

                    return (
                      <div
                        key={csItem.id}
                        id={`reward-card-${csItem.id}`}
                        onClick={() => handleComingSoonClick(csItem)}
                        style={{
                          padding: '14px 16px',
                          borderRadius: '18px',
                          border: '1px dashed var(--border-light)',
                          background: 'var(--bg-card)',
                          marginBottom: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          cursor: 'pointer',
                          transition: 'transform 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                          <div
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '14px',
                              backgroundColor: csItem.bg,
                              color: csItem.color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <IconComp size={20} />
                          </div>

                          <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '2px' }}>
                              {itemTitle}
                            </div>
                            <div
                              style={{
                                fontSize: '0.76rem',
                                color: 'var(--text-muted)',
                                lineHeight: 1.35,
                              }}
                            >
                              {itemDesc}
                            </div>
                          </div>
                        </div>

                        {/* Prominent Coming Soon Badge */}
                        <div
                          style={{
                            background: '#FEF3C7',
                            color: '#B45309',
                            border: '1px solid #FCD34D',
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-pill)',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Clock size={12} />
                          <span>{t('comingSoon', {}, 'Coming Soon')}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View 2: Redemptions History */}
      {activeSubTab === 'history' && (
        <div id="rewards-history-section">
          {redemptionsHistory.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {redemptionsHistory.map((rec) => (
                <div
                  key={rec.id}
                  id={`redemption-record-${rec.id}`}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '18px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '12px',
                        background: '#DCFCE7',
                        color: '#16A34A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Gift size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{rec.rewardTitle}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {rec.dateFormatted || rec.timestamp}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      color: '#DC2626',
                      fontWeight: 800,
                      fontFamily: 'var(--font-numbers)',
                      fontSize: '0.92rem',
                      direction: 'ltr',
                    }}
                  >
                    -{rec.pointsSpent} {t('points', {}, 'points')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              id="rewards-history-empty"
              style={{
                background: 'var(--bg-card)',
                border: '1.5px dashed var(--border-light)',
                borderRadius: '20px',
                padding: '36px 20px',
                textAlign: 'center',
                color: 'var(--text-muted)',
              }}
            >
              <History size={32} style={{ margin: '0 auto 10px auto', display: 'block' }} />
              <h3
                style={{
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '4px',
                }}
              >
                {t('rewards.emptyHistoryTitle', {}, 'No Redemptions Yet')}
              </h3>
              <p style={{ fontSize: '0.82rem', margin: 0 }}>
                {t(
                  'rewards.emptyHistorySubtitle',
                  {},
                  'When you redeem any reward, it will be permanently recorded here with date and points spent.'
                )}
              </p>
            </div>
          )}

          {/* Starting Points Audit Note */}
          <div
            style={{
              marginTop: '16px',
              padding: '12px 16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
            }}
          >
            <Clock size={16} color="var(--primary-600)" style={{ flexShrink: 0 }} />
            <div>
              <span>{t('rewards.welcomeBonusAudit', {}, 'Initial Welcome Bonus: +350 points (granted to explore the application).')}</span>
            </div>
          </div>
        </div>
      )}

      {/* View 3: Points Earning Policy */}
      {activeSubTab === 'policy' && (
        <div
          id="rewards-policy-section"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: '22px',
            padding: '20px',
            lineHeight: 1.6,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <HelpCircle size={20} color="var(--primary-600)" />
            <h3 style={{ fontSize: '1.02rem', fontWeight: 800, margin: 0 }}>
              {t('rewards.policyHeading', {}, 'Points Rules & Earning Policy')}
            </h3>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              fontSize: '0.86rem',
              color: 'var(--text-secondary)',
            }}
          >
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--primary-600)', fontWeight: 800 }}>•</span>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>
                  {t('rewards.policyRule1Title', {}, '1 Point per 10 currency spent:')}
                </strong>{' '}
                {t(
                  'rewards.policyRule1Desc',
                  {},
                  'Earn 1 reward point for every 10 currency units spent on valid expenses (minimum 1 point for any valid expense).'
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--primary-600)', fontWeight: 800 }}>•</span>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>
                  {t('rewards.policyRule2Title', {}, 'Income Excluded:')}
                </strong>{' '}
                {t(
                  'rewards.policyRule2Desc',
                  {},
                  'Income transactions do not earn reward points, keeping rewards focused on spending awareness.'
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--primary-600)', fontWeight: 800 }}>•</span>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>
                  {t('rewards.policyRule3Title', {}, 'Automatic Adjustments:')}
                </strong>{' '}
                {t(
                  'rewards.policyRule3Desc',
                  {},
                  'Editing an expense automatically recalculates points. Deleting an expense safely deducts its awarded points without going below zero.'
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--primary-600)', fontWeight: 800 }}>•</span>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>
                  {t('rewards.policyRule4Title', {}, 'Academic & In-App Perks:')}
                </strong>{' '}
                {t(
                  'rewards.policyRule4Desc',
                  {},
                  'All rewards shown are local in-app software features and digital badges for educational demonstration.'
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmRedeemModal
        isOpen={Boolean(selectedRewardToRedeem)}
        reward={selectedRewardToRedeem}
        currentPoints={points}
        onClose={() => setSelectedRewardToRedeem(null)}
        onConfirm={handleConfirmRedeem}
      />

      {/* Coming Soon Informational Modal */}
      {comingSoonInfoModal && (
        <div
          className="modal-overlay"
          onClick={() => setComingSoonInfoModal(null)}
          role="dialog"
          aria-modal="true"
          style={{ zIndex: 300 }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '380px',
              padding: '24px 20px',
              textAlign: 'center',
              animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: '#FEF3C7',
                color: '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px auto',
              }}
            >
              <Clock size={28} />
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px' }}>
              {comingSoonInfoModal.title}
            </h3>

            <div
              style={{
                display: 'inline-block',
                background: '#FEF3C7',
                color: '#B45309',
                padding: '4px 12px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.78rem',
                fontWeight: 800,
                marginBottom: '12px',
              }}
            >
              {t('rewards.comingSoonNoticeBadge', {}, 'Planned / Coming Soon')}
            </div>

            <p
              style={{
                fontSize: '0.86rem',
                color: 'var(--text-secondary)',
                marginBottom: '14px',
                lineHeight: 1.5,
              }}
            >
              {comingSoonInfoModal.description}
            </p>

            <p
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                marginBottom: '20px',
                lineHeight: 1.4,
              }}
            >
              {t(
                'rewards.comingSoonInfoDesc',
                {},
                'This external partner offer is currently in preparation for future app releases. No points will be deducted.'
              )}
            </p>

            <button
              type="button"
              onClick={() => setComingSoonInfoModal(null)}
              className="btn-primary-action"
              style={{ width: '100%', padding: '12px' }}
            >
              {t('close', {}, 'Close')}
            </button>
          </div>
        </div>
      )}

      {/* Smart Tip Advisory Modal (when rew-5 is redeemed) */}
      {adviceModal && (
        <div
          className="modal-overlay"
          onClick={() => setAdviceModal(null)}
          role="dialog"
          aria-modal="true"
          style={{ zIndex: 300 }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '380px',
              padding: '24px 20px',
              textAlign: 'center',
              animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: '#EDE9FE',
                color: '#8B5CF6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px auto',
              }}
            >
              <Sparkles size={28} />
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>
              {language === 'ar' ? 'نصيحتك المالية الذكية' : 'Your Smart Financial Tip'}
            </h3>

            <p
              style={{
                fontSize: '0.9rem',
                color: 'var(--text-primary)',
                lineHeight: 1.6,
                padding: '12px 14px',
                background: 'var(--bg-primary)',
                borderRadius: '16px',
                marginBottom: '20px',
                fontWeight: 600,
              }}
            >
              {adviceModal}
            </p>

            <button
              type="button"
              onClick={() => setAdviceModal(null)}
              className="btn-primary-action"
              style={{ width: '100%', padding: '12px' }}
            >
              {t('close', {}, 'Close')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
