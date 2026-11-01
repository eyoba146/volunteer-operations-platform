import React from 'react';
import { TopoBackdrop } from '../signature/TopoBackdrop';

export interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  roleColor?: string;
  withTopo?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  action,
  roleColor,
  withTopo = false,
  className = '',
  children,
}) => {
  return (
    <header className={`relative mb-8 ${className}`}>
      {withTopo && roleColor && (
        <TopoBackdrop color={roleColor} opacity={0.07} className="rounded-[16px] pointer-events-none" />
      )}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 font-sans text-sm sm:text-base text-ink-secondary leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0 flex items-center gap-3">{action}</div>}
      </div>
      {children && <div className="mt-6 relative z-10">{children}</div>}
    </header>
  );
};

