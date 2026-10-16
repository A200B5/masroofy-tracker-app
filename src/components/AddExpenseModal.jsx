import React, { useState } from 'react';
import {
  X,
  Calendar,
  Utensils,
  Car,
  ShoppingCart,
  Receipt,
  Heart,
  ShieldPlus,
  GraduationCap,
  LayoutGrid,
  Check,
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
};

export default function AddExpenseModal({ isOpen, onClose, onSaveExpense, currency = '£' }) {
  const { t, language } = useLanguage();
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(EXPENSE_CATEGORIES[0].key);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      alert(
        t(
          'txModal.amountRequired',
          {},
          'Please enter a valid amount greater than zero.'
        )
      );
      return;
    }
    const cleanAmount = Math.round(parsedAmount * 100) / 100;

    const categoryObj =
      EXPENSE_CATEGORIES.find((c) => c.key === selectedCategory) || EXPENSE_CATEGORIES[0];
    const todayStr = new Date().toISOString().split('T')[0];
    const isToday = date === todayStr;
    const timeFormatted = new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const formattedDate = isToday
      ? language === 'ar'
        ? `اليوم ، ${timeFormatted}`
        : `Today, ${timeFormatted}`
      : date;

    const catLabel =
      language === 'ar' ? categoryObj.label : categoryObj.labelEn || categoryObj.label;

    const newExpense = {
      id: `tx-${Date.now()}`,
      title: notes.trim() || catLabel,
      titleEn: notes.trim() || categoryObj.labelEn || catLabel,
      titleAr: notes.trim() || categoryObj.labelAr || catLabel,
      category: catLabel,
      categoryEn: categoryObj.labelEn || catLabel,
      categoryAr: categoryObj.labelAr || catLabel,
      categoryKey: categoryObj.key,
      type: 'expense',
      amount: cleanAmount,
      date: formattedDate,
      dateEn: formattedDate,
      notes: notes.trim() || null,
      icon: categoryObj.icon,
      bg: categoryObj.bg,
      color: categoryObj.color,
    };

    onSaveExpense(newExpense);
    setAmount('');
    setNotes('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {t('txModal.addExpenseTitle', {}, 'Add New Expense')}
          </h3>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Amount input */}
          <div className="amount-input-box">
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-600)' }}>
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
              autoFocus
              required
            />
          </div>

          {/* Category Selection Grid */}
          <div
            style={{
              marginBottom: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--text-secondary)',
            }}
          >
            {t('txModal.categoryLabel', {}, 'Category')}
          </div>
          <div className="category-selection-grid">
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
                >
                  <div
                    className="category-choice-icon"
                    style={{ backgroundColor: cat.bg, color: cat.color }}
                  >
                    <Icon size={22} />
                  </div>
                  <span className="category-choice-name">{catLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Date Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="expense-date">
              {t('txModal.dateLabel', {}, 'Date')}
            </label>
            <input
              id="expense-date"
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Notes Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="expense-notes">
              {t('txModal.notesLabel', {}, 'Notes (Optional)')}
            </label>
            <input
              id="expense-notes"
              type="text"
              placeholder={
                language === 'ar'
                  ? 'مثال: غداء مع الزملاء، مشتريات للمنزل...'
                  : 'e.g. Lunch with colleagues, grocery items...'
              }
              className="form-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-primary-action" id="btn-save-expense">
            <Check size={20} />
            <span>{t('txModal.saveTransaction', {}, 'Save Transaction')}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
