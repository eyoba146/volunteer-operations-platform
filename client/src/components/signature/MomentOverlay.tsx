import React, { useEffect } from 'react';
import { Check, Confetti, Sparkle, ShieldCheck, ArrowRight, X } from '@phosphor-icons/react';
import { Button } from '../ui/Button';

export interface MomentOverlayProps {
  isOpen?: boolean;
  show?: boolean;
  onClose?: () => void;
  onDismiss?: () => void;
  title: string;
  subtitle?: string;
  type?: 'payment_success' | 'hours_approved' | 'promotion_approved' | 'payment' | 'hours' | 'promotion';
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  detailsSlot?: React.ReactNode;
}

export const MomentOverlay: React.FC<MomentOverlayProps> = ({
  isOpen,
  show,
  onClose,
  onDismiss,
  title,
  subtitle,
  type = 'payment_success',
  primaryActionLabel = 'Continue →',
  onPrimaryAction,
  detailsSlot,
}) => {
  const isVisible = show ?? isOpen ?? false;
  const handleClose = onDismiss || onClose || (() => {});

  // ESC key to dismiss
  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, handleClose]);

  if (!isVisible) return null;

  const renderIcon = () => {
    switch (type) {
      case 'payment_success':
        return (
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-role-volunteer flex items-center justify-center animate-in zoom-in-75 duration-300">
            <Check className="w-8 h-8" weight="bold" />
          </div>
        );
      case 'promotion_approved':
        return (
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center animate-in zoom-in-75 duration-300">
            <ShieldCheck className="w-8 h-8" weight="fill" />
          </div>
        );
      case 'hours_approved':
      default:
        return (
          <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center animate-in zoom-in-75 duration-300">
            <Sparkle className="w-8 h-8" weight="fill" />
          </div>
        );
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-[20px] bg-white p-6 sm:p-8 shadow-[0_12px_40px_-12px_rgba(16,24,40,0.25)] text-center space-y-6 animate-in zoom-in-95 duration-200"
      >
        {/* Dismiss Button */}
        <button
          onClick={handleClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 text-ink-tertiary hover:text-ink-primary rounded-full hover:bg-[#F1F3F6] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" weight="bold" />
        </button>

        {/* Celebration Icon */}
        <div className="flex justify-center pt-2">
          {renderIcon()}
        </div>

        {/* Text Copy */}
        <div className="space-y-2">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-ink-primary tracking-tight leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="font-sans text-[14px] text-ink-secondary leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Optional Custom Details Slot */}
        {detailsSlot && (
          <div className="text-left bg-[#F7F8FA] rounded-[12px] p-4 text-[13px] font-sans">
            {detailsSlot}
          </div>
        )}

        {/* Primary Action Button */}
        <div className="pt-2">
          <Button
            variant="primary"
            size="lg"
            className="w-full justify-center"
            onClick={() => {
              if (onPrimaryAction) onPrimaryAction();
              handleClose();
            }}
          >
            {primaryActionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
