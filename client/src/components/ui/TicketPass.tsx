import React from 'react';

export interface TicketPassProps {
  variant?: 'applicant' | 'volunteer' | 'teamlead' | 'manager' | 'finance' | 'neutral';
  title: string;
  subtitle?: string;
  meta?: string;
  stubCode?: string;
  badge?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const TicketPass: React.FC<TicketPassProps> = ({
  variant = 'neutral',
  title,
  subtitle,
  meta,
  stubCode,
  badge,
  children,
  footer,
  onClick,
  className = '',
}) => {
  const headerAccent = {
    applicant: 'bg-role-applicant text-ink-primary',
    volunteer: 'bg-role-volunteer text-white',
    teamlead:  'bg-role-teamlead text-white',
    manager:   'bg-role-manager text-white',
    finance:   'bg-role-finance text-role-financeAccent',
    neutral:   'bg-canvas-subdued text-ink-primary',
  }[variant];

  return (
    <div
      onClick={onClick}
      className={`relative bg-white border-2 border-ink-primary shadow-ticket transition-all duration-200 select-none ${
        onClick ? 'cursor-pointer hover:-rotate-1 hover:-translate-y-1' : ''
      } ${className}`}
      style={{
        clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
      }}
    >
      {/* Top Banner with Badge */}
      <div className={`px-4 py-2.5 flex items-center justify-between border-b-2 border-ink-primary ${headerAccent}`}>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-current shrink-0" />
          <span className="font-display text-base font-black tracking-tight uppercase">
            {subtitle || 'VTS PASS'}
          </span>
        </div>
        {badge && (
          <span className="font-mono text-xs px-2 py-0.5 bg-ink-primary text-white font-bold">
            {badge}
          </span>
        )}
      </div>

      {/* Main Ticket Body */}
      <div className="p-5 space-y-3">
        <div>
          {meta && <span className="font-mono text-xs text-ink-tertiary block mb-1">{meta}</span>}
          <h3 className="font-display text-2xl sm:text-3xl font-black text-ink-primary tracking-tight leading-none uppercase">
            {title}
          </h3>
        </div>

        {children && <div className="font-sans text-sm text-ink-secondary">{children}</div>}
      </div>

      {/* Perforated Stub Divider */}
      <div className="relative border-t-2 border-dashed border-border flex items-center justify-between px-4 py-3 bg-canvas-subdued/40">
        {/* Left and Right Notches */}
        <div className="absolute -left-2.5 -top-2.5 w-5 h-5 rounded-full bg-canvas border border-ink-primary" />
        <div className="absolute -right-2.5 -top-2.5 w-5 h-5 rounded-full bg-canvas border border-ink-primary" />

        <div className="font-mono text-xs font-bold text-ink-secondary">
          {stubCode ? `PASS # ${stubCode}` : 'VTS TRAIL PASS'}
        </div>

        {footer ? (
          <div>{footer}</div>
        ) : (
          <div className="flex gap-1">
            <span className="w-1.5 h-4 bg-ink-primary" />
            <span className="w-0.5 h-4 bg-ink-primary" />
            <span className="w-2 h-4 bg-ink-primary" />
            <span className="w-1 h-4 bg-ink-primary" />
          </div>
        )}
      </div>
    </div>
  );
};

