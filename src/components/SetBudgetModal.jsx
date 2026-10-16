import React, { useState, useEffect, useRef } from 'react';
import { X, Target, Check, Trash2, AlertCircle } from 'lucide-react';
import { validateBudgetAmount } from '../utils/budget';
import { useLanguage } from '../context/LanguageContext';

export default function SetBudgetModal({
  isOpen,
  currentBudget,
  onClose,
  onSaveBudget,
  onRemoveBudget,
  currency = '£',
}) {
  const { t, language } = useLanguage();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (currentBudget && currentBudget.limit) {
        setAmount(String(currentBudget.limit));
      } else {
        setAmount('');
      }
      setError(null);
    }
  }, [isOpen, currentBudget]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    if (inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateBudgetAmount(amount);

    if (!validation.isValid) {
      setError(
        language === 'ar'
          ? validation.error
          : t('budget.amountRequired', {}, 'Please enter a valid positive budget amount.')
      );
      return;
    }

    onSaveBudget(validation.cleanAmount);
    onClose();
  };

  const handleRemove = () => {
    if (
      window.confirm(
        t('budget.removeConfirm', {}, 'Are you sure you want to remove your monthly budget goal?')
      )
    ) {
      onRemoveBudget();
      onClose();
    }
  };

  const isEditing = Boolean(currentBudget && currentBudget.limit);

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="set-budget-title"
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'var(--primary-50)',
                color: 'var(--primary-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Target size={18} />
            </div>
            <h3 className="modal-title" id="set-budget-title">
              {isEditing
                ? t('budget.modalTitleEdit', {}, 'Edit Monthly Budget')
                : t('budget.modalTitleSet', {}, 'Set Monthly Budget')}
            </h3>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close"
            id="btn-close-set-budget-modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Subtitle / Explanation */}
          <p
            style={{
              fontSize: '0.84rem',
              color: 'var(--text-secondary)',
              marginBottom: '16px',
              lineHeight: 1.5,
            }}
          >
            {t(
              'budget.modalSubtitle',
              {},
              'Set a maximum spending limit to help control your monthly expenses'
            )}
          </p>

          {/* Amount input box */}
          <div
            className="amount-input-box"
            style={{
              borderColor: error ? '#DC2626' : undefined,
              marginBottom: error ? '8px' : '18px',
            }}
          >
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-600)' }}>
              {currency}
            </span>
            <input
              ref={inputRef}
              type="number"
              step="any"
              min="0"
              placeholder="0.00"
              className="amount-input-field"
              id="input-budget-amount"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (error) setError(null);
              }}
            />
          </div>

          {/* Validation Error Message */}
          {error && (
            <div
              id="budget-input-error"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#DC2626',
                fontSize: '0.82rem',
                fontWeight: 600,
                marginBottom: '16px',
              }}
            >
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="submit"
              className="btn-primary-action"
              id="btn-save-budget-amount"
              style={{ width: '100%' }}
            >
              <Check size={18} />
              <span>
                {isEditing
                  ? t('save', {}, 'Save')
                  : t('budget.saveLimit', {}, 'Save Budget Limit')}
              </span>
            </button>

            {isEditing && (
              <button
                type="button"
                id="btn-remove-budget"
                onClick={handleRemove}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-light)',
                  borderRadius: '16px',
                  padding: '11px',
                  color: '#DC2626',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                <Trash2 size={15} />
                <span>{t('budget.removeBudget', {}, 'Remove Budget')}</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
