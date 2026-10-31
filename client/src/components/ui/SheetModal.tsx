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
          className="fixed inset-0 bg-black/60 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Drawer pane */}
        <div className="relative w-full max-w-xl h-full bg-white border-l-2 border-ink-primary shadow-[8px_8px_0_#111111] flex flex-col z-10 animate-in slide-in-from-right duration-200">
          <div className="flex items-start justify-between p-5 border-b-2 border-ink-primary bg-canvas-subdued">
            <div>
              {title && (
                <h3 className="font-display text-2xl font-black text-ink-primary tracking-tight leading-tight">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="font-sans text-xs text-ink-secondary mt-0.5 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-ink-primary hover:bg-canvas-inset border-2 border-ink-primary transition-colors cursor-pointer shadow-[2px_2px_0_#111111] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
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
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full ${maxWidthClass} bg-white border-2 border-ink-primary shadow-[8px_8px_0_#111111] z-10 animate-in fade-in zoom-in-95 duration-150 rounded-none`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between p-5 border-b-2 border-ink-primary bg-canvas-subdued">
          <div>
            {title && (
              <h3 className="font-display text-2xl font-black text-ink-primary tracking-tight leading-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="font-sans text-xs text-ink-secondary mt-0.5 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-ink-primary hover:bg-canvas-inset border-2 border-ink-primary transition-colors cursor-pointer shadow-[2px_2px_0_#111111] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
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
