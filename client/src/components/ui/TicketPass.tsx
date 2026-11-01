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
    teamlead: 'bg-role-teamlead text-white',
    manager: 'bg-role-manager text-white',
    finance: 'bg-role-finance text-role-financeAccent',
    neutral: 'bg-canvas-subdued text-ink-primary',
  }[variant];

  return (
    <div
      onClick={onClick}
      className={`relative bg-white border-2 border-ink-primary shadow-[4px_4px_0_#111111] transition-all duration-150 select-none overflow-hidden ${
        onClick ? 'cursor-pointer hover:shadow-[6px_6px_0_#111111] hover:-translate-x-[1px] hover:-translate-y-[1px]' : ''
      } ${className}`}
      style={{
        clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
      }}
    >
      {/* Top Banner with Badge */}
      <div className={`px-4 py-2.5 flex items-center justify-between border-b-2 border-ink-primary ${headerAccent}`}>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-current shrink-0 rounded-full" />
          <span className="font-display text-base font-bold tracking-tight">
            {subtitle || 'VTS pass'}
          </span>
        </div>
        {badge && (
          <span className="font-sans text-[13px] px-2 py-0.5 bg-ink-primary text-white font-bold rounded-[4px]">
            {badge}
          </span>
        )}
      </div>

      {/* Main Ticket Body */}
      <div className="p-5 sm:p-6 space-y-3">
        <div>
          {meta && <span className="font-sans text-[13px] font-bold text-ink-secondary block mb-1">{meta}</span>}
          <h3 className="font-display text-2xl sm:text-3xl font-black text-ink-primary tracking-tight leading-tight">
            {title}
          </h3>
        </div>

        {children && <div className="font-sans text-base text-ink-secondary leading-relaxed">{children}</div>}
      </div>

      {/* Perforated Stub Divider */}
      <div className="relative border-t-2 border-dashed border-ink-primary flex items-center justify-between px-4 py-3 bg-canvas-subdued/50">
        {/* Left and Right Notches */}
        <div className="absolute -left-2.5 -top-2.5 w-5 h-5 rounded-full bg-canvas border-2 border-ink-primary" />
        <div className="absolute -right-2.5 -top-2.5 w-5 h-5 rounded-full bg-canvas border-2 border-ink-primary" />

        <div className="font-sans text-[13px] font-bold text-ink-primary">
          {stubCode ? `Pass # ${stubCode}` : 'VTS trail pass'}
        </div>

        {footer ? (
          <div>{footer}</div>
        ) : (
          <div className="flex gap-1 items-center">
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
