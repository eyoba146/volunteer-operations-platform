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
      className={`border border-border bg-canvas-raised p-8 md:p-12 text-center max-w-xl mx-auto space-y-4 ${className}`}
    >
      {icon && (
        <div className="w-12 h-12 mx-auto flex items-center justify-center border border-border bg-canvas-subdued text-ink-secondary">
          {icon}
        </div>
      )}

      <div className="space-y-1.5">
        <h3 className="font-serif text-lg md:text-xl font-semibold text-ink-primary">
          {title}
        </h3>
        <p className="font-sans text-sm text-ink-secondary leading-relaxed max-w-md mx-auto">
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

