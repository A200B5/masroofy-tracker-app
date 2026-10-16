import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Utensils,
  Car,
  ShoppingCart,
  Receipt,
  ArrowDownLeft,
  ArrowDownRight,
  ArrowUpRight,
  Heart,
  ShieldPlus,
  GraduationCap,
  LayoutGrid,
  Calendar,
  Tag,
  FileText,
  Hash,
  CheckCircle2,
  Pencil,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import EditTransactionModal from './EditTransactionModal';
import { useLanguage } from '../context/LanguageContext';

const ICON_MAP = {
  Utensils,
  Car,
  ShoppingCart,
  Receipt,
  ArrowDownLeft,
  Heart,
  ShieldPlus,
  GraduationCap,
  LayoutGrid,
  Tag,
};

export default function TransactionDetailModal({
  transaction,
  onClose,
  onUpdate,
  onDelete,
  currency = '£',
}) {
  const { t, language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const closeButtonRef = useRef(null);

  // Close on Escape key press
  useEffect(() => {
    if (!transaction) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showDeleteConfirm) {
          setShowDeleteConfirm(false);
        } else if (isEditing) {
          setIsEditing(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    if (closeButtonRef.current && !isEditing && !showDeleteConfirm) {
      closeButtonRef.current.focus();
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [transaction, isEditing, showDeleteConfirm, onClose]);

  if (!transaction) return null;

  const isExpense = transaction.type === 'expense';
  const IconComponent = ICON_MAP[transaction.icon] || Tag;

  const txTitle =
    language === 'ar' ? transaction.titleAr || transaction.title : transaction.titleEn || transaction.title;
  const txCategory =
    language === 'ar'
      ? transaction.categoryAr || transaction.category
      : transaction.categoryEn || transaction.category;
  const txDate =
    language === 'ar' ? transaction.date : transaction.dateEn || transaction.date;

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(transaction.id);
    }
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleSaveEdit = (updatedTx) => {
    if (onUpdate) {
      onUpdate(updatedTx);
    }
    setIsEditing(false);
  };

  return (
    <>
      <div
        className="modal-overlay"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tx-detail-title"
      >
        <div
          className="modal-content tx-detail-content"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="modal-header">
            <h3 className="modal-title" id="tx-detail-title">
              {t('txModal.transactionDetailsTitle', {}, 'Transaction Details')}
            </h3>
            <button
              ref={closeButtonRef}
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close"
              id="btn-close-tx-detail"
            >
              <X size={20} />
            </button>
          </div>

          {/* Hero Section */}
          <div className={`tx-detail-hero ${isExpense ? 'expense-hero' : 'income-hero'}`}>
            <div
              className="tx-detail-icon-wrap"
              style={{
                backgroundColor: transaction.bg || (isExpense ? '#FEE2E2' : '#DCFCE7'),
                color: transaction.color || (isExpense ? '#DC2626' : '#16A34A'),
              }}
            >
              <IconComponent size={32} />
            </div>

            <div className="tx-detail-amount">
              <span className="tx-detail-sign">{isExpense ? '-' : '+'}</span>
              <span>{Number(transaction.amount).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}</span>
              <span className="tx-detail-currency">{currency}</span>
            </div>

            <div className={`tx-detail-type-badge ${isExpense ? 'expense-badge' : 'income-badge'}`}>
              {isExpense ? (
                <>
                  <ArrowDownRight size={14} />
                  <span>{t('txModal.expense', {}, 'Expense')}</span>
                </>
              ) : (
                <>
                  <ArrowUpRight size={14} />
                  <span>{t('txModal.income', {}, 'Income')}</span>
                </>
              )}
            </div>
          </div>

          {/* Details List */}
          <div className="tx-detail-list">
            {/* 1. Title */}
            <div className="tx-detail-row">
              <div className="tx-detail-row-label">
                <Tag size={17} className="tx-detail-row-icon" />
                <span>{t('txModal.titleLabel', {}, 'Title')}</span>
              </div>
              <div className="tx-detail-row-val">{txTitle}</div>
            </div>

            {/* 2. Category */}
            <div className="tx-detail-row">
              <div className="tx-detail-row-label">
                <LayoutGrid size={17} className="tx-detail-row-icon" />
                <span>{t('txModal.categoryLabel', {}, 'Category')}</span>
              </div>
              <div className="tx-detail-row-val category-tag">
                <span
                  className="category-dot"
                  style={{ backgroundColor: transaction.color || '#0D9488' }}
                />
                <span>{txCategory}</span>
              </div>
            </div>

            {/* 3. Date & Time */}
            <div className="tx-detail-row">
              <div className="tx-detail-row-label">
                <Calendar size={17} className="tx-detail-row-icon" />
                <span>{t('txModal.dateLabel', {}, 'Date')}</span>
              </div>
              <div className="tx-detail-row-val">{txDate}</div>
            </div>

            {/* 4. Notes if available */}
            {transaction.notes && (
              <div className="tx-detail-row">
                <div className="tx-detail-row-label">
                  <FileText size={17} className="tx-detail-row-icon" />
                  <span>{t('txModal.notesLabel', {}, 'Notes')}</span>
                </div>
                <div className="tx-detail-row-val notes-val">{transaction.notes}</div>
              </div>
            )}

            {/* 5. Transaction Identifier */}
            <div className="tx-detail-row">
              <div className="tx-detail-row-label">
                <Hash size={17} className="tx-detail-row-icon" />
                <span>{language === 'ar' ? 'رقم المعرف' : 'ID'}</span>
              </div>
              <div className="tx-detail-row-val code-val">{transaction.id}</div>
            </div>

            {/* 6. Verification Status */}
            <div className="tx-detail-row">
              <div className="tx-detail-row-label">
                <CheckCircle2 size={17} className="tx-detail-row-icon" />
                <span>{language === 'ar' ? 'حالة التسجيل' : 'Status'}</span>
              </div>
              <div className="tx-detail-row-val" style={{ color: '#16A34A', fontWeight: 700 }}>
                {language === 'ar' ? 'تم الحفظ بنجاح' : 'Saved Successfully'}
              </div>
            </div>
          </div>

          {/* Action Buttons: Edit, Delete, Close */}
          <div className="tx-actions-footer">
            <button
              type="button"
              className="btn-edit-action"
              onClick={() => setIsEditing(true)}
              id="btn-edit-tx"
              aria-label="Edit transaction"
            >
              <Pencil size={17} />
              <span>{t('edit', {}, 'Edit')}</span>
            </button>

            <button
              type="button"
              className="btn-delete-action"
              onClick={() => setShowDeleteConfirm(true)}
              id="btn-delete-tx"
              aria-label="Delete transaction"
            >
              <Trash2 size={17} />
              <span>{t('delete', {}, 'Delete')}</span>
            </button>

            <button
              type="button"
              className="btn-close-action"
              onClick={onClose}
              id="btn-close-action"
            >
              <span>{t('close', {}, 'Close')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Transaction Modal */}
      {isEditing && (
        <EditTransactionModal
          isOpen={isEditing}
          transaction={transaction}
          onClose={() => setIsEditing(false)}
          onSave={handleSaveEdit}
          currency={currency}
        />
      )}

      {/* Confirmation Dialog for Delete */}
      {showDeleteConfirm && (
        <div
          className="modal-overlay"
          onClick={() => setShowDeleteConfirm(false)}
          role="dialog"
          aria-modal="true"
          style={{ zIndex: 250 }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '380px',
              textAlign: 'center',
              padding: '24px 20px',
              animation: 'slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: '#FEE2E2',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}
            >
              <AlertTriangle size={28} />
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>
              {t('txModal.deleteConfirmTitle', {}, 'Confirm Delete')}
            </h3>

            <p
              style={{
                fontSize: '0.86rem',
                color: 'var(--text-secondary)',
                marginBottom: '20px',
                lineHeight: 1.5,
              }}
            >
              {t(
                'txModal.deleteConfirmMessage',
                {},
                'Are you sure you want to permanently delete this transaction? This action cannot be undone.'
              )}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                id="btn-cancel-delete"
                style={{
                  padding: '11px',
                  borderRadius: '14px',
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
                onClick={handleConfirmDelete}
                id="btn-confirm-delete"
                style={{
                  padding: '11px',
                  borderRadius: '14px',
                  border: 'none',
                  background: '#DC2626',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
                }}
              >
                {t('delete', {}, 'Delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
