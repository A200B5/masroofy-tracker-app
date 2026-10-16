import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AddIncomeModal({ isOpen, onClose, onSaveIncome, currency = '£' }) {
  const { t, language } = useLanguage();
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState(() => (language === 'ar' ? 'راتب شهري' : 'Monthly Salary'));

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      alert(
        t('txModal.amountRequired', {}, 'Please enter a valid amount greater than zero.')
      );
      return;
    }
    const cleanAmount = Math.round(parsedAmount * 100) / 100;

    const timeFormatted = new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const defaultTitle = language === 'ar' ? 'دخل إضافي' : 'Extra Income';
    const chosenTitle = source.trim() || defaultTitle;
    const formattedDate =
      language === 'ar' ? `اليوم ، ${timeFormatted}` : `Today, ${timeFormatted}`;

    onSaveIncome({
      id: `tx-${Date.now()}`,
      title: chosenTitle,
      titleEn: chosenTitle,
      titleAr: chosenTitle,
      category: language === 'ar' ? 'دخل' : 'Income',
      categoryEn: 'Income',
      categoryAr: 'دخل',
      categoryKey: 'income',
      type: 'income',
      amount: cleanAmount,
      date: formattedDate,
      dateEn: formattedDate,
      icon: 'ArrowDownLeft',
      bg: '#DCFCE7',
      color: '#16A34A',
    });

    setAmount('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {t('txModal.addIncomeTitle', {}, 'Add New Income')}
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
          <div className="amount-input-box">
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16A34A' }}>
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

          <div className="form-group">
            <label className="form-label" htmlFor="income-source">
              {t('txModal.titleLabel', {}, 'Description / Source')}
            </label>
            <input
              id="income-source"
              type="text"
              placeholder={
                language === 'ar'
                  ? 'مثال: راتب شهري، عمل إضافي، بيع أصول...'
                  : 'e.g. Monthly salary, freelance, side hustle...'
              }
              className="form-input"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary-action"
            style={{ backgroundColor: '#16A34A' }}
            id="btn-save-income"
          >
            <Check size={20} />
            <span>{t('txModal.saveTransaction', {}, 'Save Transaction')}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
