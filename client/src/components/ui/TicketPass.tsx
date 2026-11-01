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
    neutral: 'bg-[#F1F3F6] text-ink-primary',
  }[variant];

  return (
    <div
      onClick={onClick}
      className={`relative bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] rounded-[16px] transition-all duration-150 select-none overflow-hidden ${
        onClick ? 'cursor-pointer hover:shadow-[0_1px_3px_rgba(16,24,40,0.08),0_12px_32px_-4px_rgba(16,24,40,0.12)] hover:-translate-y-0.5' : ''
      } ${className}`}
    >
      {/* Top Banner with Badge */}
      <div className={`px-5 py-3 flex items-center justify-between ${headerAccent}`}>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-current shrink-0 rounded-full" />
          <span className="font-display text-base font-bold tracking-tight">
            {subtitle || 'VTS pass'}
          </span>
        </div>
        {badge && (
          <span className="font-sans text-[13px] px-2.5 py-0.5 bg-ink-primary text-white font-bold rounded-full">
            {badge}
          </span>
        )}
      </div>

      {/* Main Ticket Body */}
      <div className="p-6 sm:p-7 space-y-3">
        <div>
          {meta && <span className="font-sans text-[13px] font-medium text-ink-secondary block mb-1">{meta}</span>}
          <h3 className="font-display text-2xl sm:text-3xl font-black text-ink-primary tracking-tight leading-tight">
            {title}
          </h3>
        </div>

        {children && <div className="font-sans text-base text-ink-secondary leading-relaxed">{children}</div>}
      </div>

      {/* Perforated Stub Divider */}
      <div className="relative border-t border-dashed border-[#EDEFF2] flex items-center justify-between px-5 py-3.5 bg-[#F7F8FA]">
        {/* Left and Right Notches */}
        <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-white shadow-inner" />
        <div className="absolute -right-3 -top-3 w-6 h-6 rounded-full bg-white shadow-inner" />

        <div className="font-sans text-[13px] font-semibold text-ink-primary">
          {stubCode ? `Pass # ${stubCode}` : 'VTS trail pass'}
        </div>

        {footer ? (
          <div>{footer}</div>
        ) : (
          <div className="flex gap-1 items-center opacity-40">
            <span className="w-1.5 h-3.5 bg-ink-primary rounded-xs" />
            <span className="w-0.5 h-3.5 bg-ink-primary rounded-xs" />
            <span className="w-2 h-3.5 bg-ink-primary rounded-xs" />
            <span className="w-1 h-3.5 bg-ink-primary rounded-xs" />
          </div>
        )}
      </div>
    </div>
  );
};
