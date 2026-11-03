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
  actionVariant = 'secondary',
  className = '',
}) => {
  return (
    <div
      className={`rounded-[16px] bg-[#F7F8FA] p-8 md:p-12 text-center max-w-xl mx-auto space-y-4 relative overflow-hidden ${className} `}
    >
      {/* Topo and Trail Route Custom Illustration */}
      <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
        <svg viewBox="0 0 80 80" className="w-full h-full text-role-volunteer" fill="none">
          {/* Topo contours */}
          <ellipse cx="40" cy="40" rx="36" ry="24" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.2" />
          <ellipse cx="40" cy="40" rx="26" ry="16" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          <ellipse cx="40" cy="40" rx="16" ry="9" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
          {/* Trail path */}
          <path d="M 16 55 Q 32 30, 40 40 T 64 25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          {/* Waypoint destination */}
          <circle cx="64" cy="25" r="4.5" fill="currentColor" />
          <circle cx="64" cy="25" r="2" fill="white" />
        </svg>
        {icon && (
          <div className="absolute inset-0 flex items-center justify-center text-ink-primary">
            {icon}
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <h3 className="font-display text-lg md:text-xl font-bold text-ink-primary">
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
