import React, { useEffect } from 'react';
import { X } from '@phosphor-icons/react';

interface SheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  mode?: 'modal' | 'sheet'; // modal = centered dialog, sheet = right drawer
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const SheetModal: React.FC<SheetModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  mode = 'modal',
  maxWidth = 'lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }[maxWidth];

  if (mode === 'sheet') {
    return (
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Soft backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Drawer pane */}
        <div className="relative w-full max-w-xl h-full bg-white border-l border-slate-100 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
          <div className="flex items-start justify-between p-6 border-b border-slate-100 bg-slate-50/60">
            <div>
              {title && (
                <h3 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="font-sans text-xs text-slate-500 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close pane"
            >
              <X className="w-4 h-4" weight="bold" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Soft backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full ${maxWidthClass} bg-white rounded-[24px] shadow-soft border border-slate-100 overflow-hidden z-10 animate-in zoom-in-95 duration-200`}
        role="dialog"
        aria-modal="true"
      >
        {(title || subtitle) && (
          <div className="flex items-start justify-between p-6 border-b border-slate-100 bg-slate-50/60">
            <div>
              {title && (
                <h3 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="font-sans text-xs text-slate-500 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" weight="bold" />
            </button>
          </div>
        )}

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
