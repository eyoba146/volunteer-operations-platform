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
        {/* Solid neutral backdrop */}
        <div
          className="fixed inset-0 bg-ink-primary/50 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Drawer pane */}
        <div className="relative w-full max-w-xl h-full bg-white border-l border-[#D5DAE1] shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
          <div className="flex items-start justify-between p-5 border-b border-[#D5DAE1] bg-canvas-subdued">
            <div>
              {title && (
                <h3 className="font-display text-2xl font-bold text-ink-primary tracking-tight leading-tight">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="font-sans text-sm text-ink-secondary mt-0.5 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-ink-primary hover:bg-canvas-inset border border-[#D5DAE1] rounded-[8px] transition-colors cursor-pointer"
              aria-label="Close pane"
            >
              <X className="w-5 h-5" weight="bold" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">{children}</div>
        </div>
      </div>
    );
  }

  // Centered modal
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink-primary/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full ${maxWidthClass} bg-white border border-[#D5DAE1] rounded-[10px] shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150 overflow-hidden`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between p-5 border-b border-[#D5DAE1] bg-canvas-subdued">
          <div>
            {title && (
              <h3 className="font-display text-2xl font-bold text-ink-primary tracking-tight leading-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="font-sans text-sm text-ink-secondary mt-0.5 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-ink-primary hover:bg-canvas-inset border border-[#D5DAE1] rounded-[8px] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" weight="bold" />
          </button>
        </div>

        <div className="p-5 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
