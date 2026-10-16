import React, { useEffect, useRef, useState } from 'react';
import { Gift } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ConfirmRedeemModal({
  isOpen,
  reward,
  currentPoints,
  onClose,
  onConfirm,
}) {
  const { t, language } = useLanguage();
  const closeButtonRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsSubmitting(false);
      return;
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    if (closeButtonRef.current) {
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !reward) return null;

  const pointsAfter = currentPoints - reward.pointsCost;
  const rewardTitle =
    language === 'ar' ? reward.titleAr || reward.title : reward.titleEn || reward.title;

  const handleConfirmClick = () => {
    if (isSubmitting) return; // Prevent double clicks
    setIsSubmitting(true);
    onConfirm();
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-redeem-title"
      style={{ zIndex: 300 }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '400px',
          padding: '24px 20px',
          textAlign: 'center',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header Icon */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '18px',
            background: reward.bg || 'var(--primary-50)',
            color: reward.color || 'var(--primary-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
          }}
        >
          <Gift size={28} />
        </div>

        <h3
          id="confirm-redeem-title"
          style={{ fontSize: '1.18rem', fontWeight: 800, marginBottom: '6px' }}
        >
          {t('rewards.confirmRedeemTitle', {}, 'Confirm Reward Redemption')}
        </h3>

        <p
          style={{
            fontSize: '0.86rem',
            color: 'var(--text-secondary)',
            marginBottom: '18px',
            lineHeight: 1.5,
          }}
        >
          {t(
            'rewards.confirmRedeemQuestion',
            { title: rewardTitle, cost: reward.pointsCost },
            `Would you like to redeem "${rewardTitle}" for ${reward.pointsCost} points?`
          )}
        </p>

        {/* Points Summary Box */}
        <div
          style={{
            background: 'var(--bg-primary)',
            borderRadius: '16px',
            padding: '12px 16px',
            marginBottom: '20px',
            fontSize: '0.84rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            textAlign: language === 'ar' ? 'right' : 'left',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>
              {t('rewards.currentBalanceLabel', {}, 'Current Balance:')}
            </span>
            <strong style={{ fontFamily: 'var(--font-numbers)' }}>
              {currentPoints} {t('points', {}, 'points')}
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#DC2626' }}>
            <span>{t('rewards.redemptionCostLabel', {}, 'Redemption Cost:')}</span>
            <strong style={{ fontFamily: 'var(--font-numbers)' }}>
              -{reward.pointsCost} {t('points', {}, 'points')}
            </strong>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '6px',
              borderTop: '1px dashed var(--border-light)',
              fontWeight: 800,
            }}
          >
            <span>{t('rewards.remainingAfterLabel', {}, 'Remaining Balance After Redemption:')}</span>
            <strong style={{ color: 'var(--primary-600)', fontFamily: 'var(--font-numbers)' }}>
              {pointsAfter} {t('points', {}, 'points')}
            </strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            id="btn-cancel-redeem"
            disabled={isSubmitting}
            style={{
              padding: '12px',
              borderRadius: '16px',
              border: '1px solid var(--border-light)',
              background: 'var(--bg-card)',
              color: 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            {t('cancel', {}, 'Cancel')}
          </button>

          <button
            type="button"
            onClick={handleConfirmClick}
            id="btn-confirm-redeem"
            className="btn-primary-action"
            disabled={isSubmitting}
            style={{
              padding: '12px',
              borderRadius: '16px',
              fontWeight: 700,
              fontSize: '0.9rem',
              gap: '6px',
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
          >
            {t('confirm', {}, 'Confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
