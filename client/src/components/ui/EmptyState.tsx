import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionVariant?: 'primary' | 'secondary' | 'telebirr';
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionVariant = 'primary',
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-[24px] shadow-soft border border-slate-100 p-8 md:p-12 text-center max-w-xl mx-auto space-y-5 ${className}`}
    >
      {icon && (
        <div className="w-11 h-11 rounded-[14px] mx-auto flex items-center justify-center bg-brand text-white shadow-sm">
          {icon}
        </div>
      )}

      <div className="space-y-1.5">
        <h3 className="font-display text-xl font-bold text-slate-900 tracking-tight">
          {title}
        </h3>
        <p className="font-sans text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <div className="pt-2">
          <Button variant={actionVariant} onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
