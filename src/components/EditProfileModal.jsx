import React, { useState, useEffect, useRef } from 'react';
import { User, X, Check, AlertCircle, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function EditProfileModal({
  isOpen,
  currentName = '',
  onClose,
  onSave,
}) {
  const { t, isRTL } = useLanguage();
  const [name, setName] = useState(currentName || '');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  // Sync internal name state with currentName when modal opens
  useEffect(() => {
    if (isOpen) {
      setName(currentName || '');
      setError('');
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 50);
    }
  }, [isOpen, currentName]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    const trimmed = (name || '').trim();

    if (!trimmed) {
      setError(t('settings.nameRequiredError', {}, 'Display name cannot be empty.'));
      if (inputRef.current) inputRef.current.focus();
      return;
    }

    if (trimmed.length > 40) {
      setError(t('settings.nameTooLongError', {}, 'Display name cannot exceed 40 characters.'));
      if (inputRef.current) inputRef.current.focus();
      return;
    }

    const success = onSave(trimmed);
    if (success) {
      onClose();
    }
  };

  const isOverLimit = name.length > 40;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-modal-title"
      style={{ zIndex: 300 }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '400px',
          padding: '24px 20px',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Modal Header */}
        <div className="modal-header" style={{ marginBottom: '14px' }}>
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
              <User size={18} />
            </div>
            <h3 className="modal-title" id="edit-profile-modal-title">
              {t('settings.editProfileModalTitle', {}, 'Edit Display Name')}
            </h3>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label={t('close', {}, 'Close')}
            id="btn-close-edit-profile-modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Subtitle / Explanation */}
        <p
          style={{
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            marginBottom: '16px',
            lineHeight: 1.45,
          }}
        >
          {t(
            'settings.editProfileModalSub',
            {},
            'Update your display name across the application'
          )}
        </p>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px',
              }}
            >
              <label
                htmlFor="input-profile-name"
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                {t('settings.nameLabel', {}, 'Display Name')}
              </label>
              <span
                style={{
                  fontSize: '0.72rem',
                  color: isOverLimit ? '#DC2626' : 'var(--text-muted)',
                  fontWeight: isOverLimit ? 800 : 500,
                  fontFamily: 'var(--font-numbers)',
                }}
              >
                {name.length} / 40
              </span>
            </div>

            <input
              ref={inputRef}
              id="input-profile-name"
              type="text"
              value={name}
              maxLength={40}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder={t('settings.namePlaceholder', {}, 'Enter display name...')}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '14px',
                border: error
                  ? '1.5px solid #DC2626'
                  : '1.5px solid var(--border-light)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                fontWeight: 600,
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease',
              }}
            />

            {/* Validation Error Message */}
            {error && (
              <div
                id="edit-profile-error"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#DC2626',
                  fontSize: '0.78rem',
                  marginTop: '6px',
                  fontWeight: 600,
                }}
              >
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Local Storage & Non-authenticated notice */}
          <div
            style={{
              background: 'var(--bg-primary)',
              borderRadius: '12px',
              padding: '10px 12px',
              marginBottom: '20px',
              border: '1px dashed var(--border-light)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
            }}
          >
            <ShieldAlert
              size={15}
              color="var(--primary-600)"
              style={{ flexShrink: 0, marginTop: '2px' }}
            />
            <p
              style={{
                fontSize: '0.74rem',
                color: 'var(--text-muted)',
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              {t(
                'settings.profileLocalNotice',
                {},
                'This display name is stored locally on this device. No login, password, or backend server is used.'
              )}
            </p>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              direction: isRTL ? 'rtl' : 'ltr',
            }}
          >
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              id="btn-cancel-edit-profile"
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-card)',
                color: 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              {t('cancel', {}, 'Cancel')}
            </button>

            <button
              type="submit"
              className="btn-primary"
              id="btn-save-edit-profile"
              style={{
                flex: 1.5,
                padding: '12px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: 'var(--primary-600)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <Check size={16} />
              <span>{t('save', {}, 'Save')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
