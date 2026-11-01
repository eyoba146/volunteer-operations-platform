import React from 'react';

export interface TimelineItem {
  id: string;
  title: string;
  timestamp?: string;
  description?: string;
  status?: 'completed' | 'current' | 'pending';
  badge?: React.ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ items, className = '' }) => {
  return (
    <div className={`relative pl-4 space-y-6 ${className}`}>
      {/* Vertical connecting rule */}
      <div className="absolute left-[7px] top-2 bottom-2 w-[1.5px] bg-[#EDEFF2]" />

      {items.map((item, index) => {
        const isCurrent = item.status === 'current';
        const isCompleted = item.status === 'completed';

        return (
          <div key={item.id || index} className="relative flex items-start gap-3.5 group">
            {/* Clean Rounded Node */}
            <div
              className={`relative z-10 w-3.5 h-3.5 shrink-0 mt-1 rounded-full border-none ${
                isCompleted
                  ? 'bg-role-volunteer'
                  : isCurrent
                  ? 'bg-role-applicant ring-4 ring-role-applicant/20'
                  : 'bg-slate-300'
              }`}
            />

            {/* Content */}
            <div className="flex-1 space-y-1 text-left">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-sans text-sm font-bold text-ink-primary">
                  {item.title}
                </span>
                {item.timestamp && (
                  <span className="font-sans text-[13px] text-ink-secondary">
                    {item.timestamp}
                  </span>
                )}
              </div>

              {item.description && (
                <p className="font-sans text-sm text-ink-secondary leading-relaxed">
                  {item.description}
                </p>
              )}

              {item.badge && <div className="pt-1">{item.badge}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
};
