import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Check,
  Utensils,
  Car,
  ShoppingCart,
  Receipt,
  Heart,
  ShieldPlus,
  GraduationCap,
  LayoutGrid,
  ArrowDownLeft,
  ArrowDownRight,
  ArrowUpRight,
} from 'lucide-react';
import { EXPENSE_CATEGORIES } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

const CATEGORY_ICONS = {
  Utensils,
  Car,
  ShoppingCart,
  Receipt,
  Heart,
  ShieldPlus,
  GraduationCap,
  LayoutGrid,
  ArrowDownLeft,
};

export default function EditTransactionModal({
  isOpen,
  transaction,
  onClose,
  onSave,
  currency = '£',
}) {
  const { t, language } = useLanguage();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [selectedCategory, setSelectedCategory] = useState('food');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const closeButtonRef = useRef(null);

  // Prefill fields when transaction changes or modal opens
  useEffect(() => {
    if (transaction) {
      const initialTitle =
        language === 'ar'
          ? transaction.titleAr || transaction.title
          : transaction.titleEn || transaction.title;
      setTitle(initialTitle || '');
      setAmount(transaction.amount !== undefined ? String(transaction.amount) : '');
      setType(transaction.type || 'expense');
      setSelectedCategory(transaction.categoryKey || 'food');
      setDate(
        language === 'ar'
          ? transaction.date
          : transaction.dateEn || transaction.date || ''
      );
      setNotes(transaction.notes || '');
    }
  }, [transaction, isOpen, language]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !transaction) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      alert(t('txModal.amountRequired', {}, 'Please enter a valid amount greater than zero.'));
      return;
    }

    const cleanAmount = Math.round(parsedAmount * 100) / 100;

    let categoryObj;
    if (type === 'income') {
      categoryObj = {
        label: language === 'ar' ? 'دخل' : 'Income',
        labelEn: 'Income',
        labelAr: 'دخل',
        key: 'income',
        icon: 'ArrowDownLeft',
        bg: '#DCFCE7',
        color: '#16A34A',
      };
    } else {
      categoryObj =
        EXPENSE_CATEGORIES.find((c) => c.key === selectedCategory) || EXPENSE_CATEGORIES[0];
    }

    const catLabel =
      language === 'ar' ? categoryObj.label : categoryObj.labelEn || categoryObj.label;

    const updatedTx = {
      ...transaction, // Preserves id and other metadata
      title: title.trim() || catLabel,
      titleEn: title.trim() || categoryObj.labelEn || catLabel,
      titleAr: title.trim() || categoryObj.labelAr || catLabel,
      category: catLabel,
      categoryEn: categoryObj.labelEn || catLabel,
      categoryAr: categoryObj.labelAr || catLabel,
      categoryKey: categoryObj.key,
      type,
      amount: cleanAmount,
      date: date.trim() || transaction.date,
      notes: notes.trim() || null,
      icon: categoryObj.icon,
      bg: categoryObj.bg,
      color: categoryObj.color,
    };

    onSave(updatedTx);
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-tx-title"
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title" id="edit-tx-title">
            {type === 'expense'
              ? t('txModal.editExpenseTitle', {}, 'Edit Expense')
              : t('txModal.editIncomeTitle', {}, 'Edit Income')}
          </h3>
          <button
            ref={closeButtonRef}
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close"
            id="btn-close-edit-modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Type Toggle: Expense vs Income */}
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label">{t('txModal.typeLabel', {}, 'Type')}</label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                background: 'var(--bg-input)',
                padding: '4px',
                borderRadius: '16px',
              }}
            >
              <button
                type="button"
                className={`type-toggle-btn ${type === 'expense' ? 'active-expense' : ''}`}
                onClick={() => setType('expense')}
                id="btn-toggle-type-expense"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  background: type === 'expense' ? '#DC2626' : 'transparent',
                  color: type === 'expense' ? '#FFFFFF' : 'var(--text-secondary)',
                  transition: 'all 0.2s',
                }}
              >
                <ArrowDownRight size={16} />
                <span>{t('txModal.expense', {}, 'Expense')}</span>
              </button>

              <button
                type="button"
                className={`type-toggle-btn ${type === 'income' ? 'active-income' : ''}`}
                onClick={() => setType('income')}
                id="btn-toggle-type-income"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  background: type === 'income' ? '#16A34A' : 'transparent',
                  color: type === 'income' ? '#FFFFFF' : 'var(--text-secondary)',
                  transition: 'all 0.2s',
                }}
              >
                <ArrowUpRight size={16} />
                <span>{t('txModal.income', {}, 'Income')}</span>
              </button>
            </div>
          </div>

          {/* Amount input */}
          <div className="amount-input-box" style={{ marginBottom: '20px' }}>
            <span
              style={{
                fontSize: '1.8rem',
                fontWeight: 800,
                color: type === 'expense' ? '#DC2626' : '#16A34A',
              }}
            >
              {currency}
            </span>
            <input
              type="number"
              step="any"
              min="0"
              placeholder="0.00"
              className="amount-input-field"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              id="input-edit-amount"
              required
            />
          </div>

          {/* Title input */}
          <div className="form-group">
            <label className="form-label" htmlFor="input-edit-title">
              {t('txModal.titleLabel', {}, 'Description / Title')}
            </label>
            <input
              id="input-edit-title"
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('txModal.titlePlaceholder', {}, 'Description...')}
              required
            />
          </div>

          {/* Category selection (visible when type is expense) */}
          {type === 'expense' && (
            <div className="form-group">
              <label className="form-label">{t('txModal.categoryLabel', {}, 'Category')}</label>
              <div className="category-selection-grid" style={{ marginBottom: '16px' }}>
                {EXPENSE_CATEGORIES.map((cat) => {
                  const Icon = CATEGORY_ICONS[cat.icon] || LayoutGrid;
                  const isSelected = selectedCategory === cat.key;
                  const catLabel =
                    language === 'ar' ? cat.label : cat.labelEn || cat.label;

                  return (
                    <button
                      key={cat.key}
                      type="button"
                      className={`category-choice-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedCategory(cat.key)}
                      id={`edit-cat-${cat.key}`}
                    >
                      <div
                        className="category-choice-icon"
                        style={{ backgroundColor: cat.bg, color: cat.color }}
                      >
                        <Icon size={20} />
                      </div>
                      <span className="category-choice-name">{catLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Date field */}
          <div className="form-group">
            <label className="form-label" htmlFor="input-edit-date">
              {t('txModal.dateLabel', {}, 'Date')}
            </label>
            <input
              id="input-edit-date"
              type="text"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Notes field */}
          <div className="form-group">
            <label className="form-label" htmlFor="input-edit-notes">
              {t('txModal.notesLabel', {}, 'Notes (Optional)')}
            </label>
            <input
              id="input-edit-notes"
              type="text"
              className="form-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('txModal.notesPlaceholder', {}, 'Add any details...')}
            />
          </div>

          {/* Action buttons: Save & Cancel */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              marginTop: '22px',
            }}
          >
            <button
              type="button"
              className="settings-item"
              onClick={onClose}
              id="btn-cancel-edit-tx"
              style={{
                width: '100%',
                borderRadius: '16px',
                padding: '14px',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-card)',
                color: 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {t('cancel', {}, 'Cancel')}
            </button>

            <button
              type="submit"
              className="btn-primary-action"
              id="btn-save-edit-tx"
              style={{
                marginTop: 0,
                borderRadius: '16px',
                padding: '14px',
                fontSize: '0.95rem',
              }}
            >
              <Check size={18} />
              <span>{t('save', {}, 'Save Changes')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
