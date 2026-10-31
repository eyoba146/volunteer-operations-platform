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
  const roleDot = {
    applicant: 'bg-role-applicant',
    volunteer: 'bg-role-volunteer',
    teamlead:  'bg-role-teamlead',
    manager:   'bg-role-manager',
    finance:   'bg-slate-900',
    neutral:   'bg-brand',
  }[variant];

  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-[24px] shadow-soft hover:shadow-soft-hover transition-all duration-200 border border-slate-100 overflow-hidden ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      } ${className}`}
    >
      {/* Top Banner with Badge */}
      <div className="px-5 py-3.5 flex items-center justify-between border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full shrink-0 ${roleDot}`} />
          <span className="font-sans text-xs font-semibold text-slate-700">
            {subtitle || 'Volunteer Pass'}
          </span>
        </div>
        {badge && (
          <span className="font-sans text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white border border-slate-200/80 text-slate-700 shadow-sm">
            {badge}
          </span>
        )}
      </div>

      {/* Main Ticket Body */}
      <div className="p-6 space-y-3">
        <div>
          {meta && <span className="font-sans text-xs text-slate-500 block mb-1">{meta}</span>}
          <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
            {title}
          </h3>
        </div>

        {children && <div className="font-sans text-sm text-slate-600 leading-relaxed">{children}</div>}
      </div>

      {/* Perforated Stub Divider */}
      <div className="relative border-t border-dashed border-slate-200 flex items-center justify-between px-5 py-3.5 bg-slate-50/50">
        {/* Left and Right Notches */}
        <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-canvas border border-slate-100" />
        <div className="absolute -right-3 -top-3 w-6 h-6 rounded-full bg-canvas border border-slate-100" />

        <div className="font-mono text-xs font-medium text-slate-500">
          {stubCode ? `#${stubCode}` : 'VTS PASS'}
        </div>

        {footer ? (
          <div>{footer}</div>
        ) : (
          <div className="flex gap-1 items-center opacity-60">
            <span className="w-1 h-3.5 bg-slate-800 rounded-full" />
            <span className="w-0.5 h-3.5 bg-slate-800 rounded-full" />
            <span className="w-1.5 h-3.5 bg-slate-800 rounded-full" />
            <span className="w-0.5 h-3.5 bg-slate-800 rounded-full" />
            <span className="w-1 h-3.5 bg-slate-800 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};
