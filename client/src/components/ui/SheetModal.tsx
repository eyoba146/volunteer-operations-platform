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
          className="fixed inset-0 bg-ink-primary/40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Drawer pane */}
        <div className="relative w-full max-w-xl h-full bg-canvas-raised border-l border-border-strong shadow-modal flex flex-col z-10 animate-in slide-in-from-right duration-200">
          <div className="flex items-start justify-between p-5 border-b border-border bg-canvas-subdued">
            <div>
              {title && (
                <h3 className="font-serif text-xl font-semibold text-ink-primary">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="font-sans text-xs text-ink-secondary mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-ink-secondary hover:text-ink-primary hover:bg-canvas-inset border border-transparent hover:border-border transition-colors cursor-pointer"
              aria-label="Close pane"
            >
              <X className="w-5 h-5" />
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
        className={`relative w-full ${maxWidthClass} bg-canvas-raised border border-border-strong shadow-modal z-10 animate-in fade-in zoom-in-95 duration-150`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between p-5 border-b border-border bg-canvas-subdued">
          <div>
            {title && (
              <h3 className="font-serif text-xl font-semibold text-ink-primary">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="font-sans text-xs text-ink-secondary mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-ink-secondary hover:text-ink-primary hover:bg-canvas-inset border border-transparent hover:border-border transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

