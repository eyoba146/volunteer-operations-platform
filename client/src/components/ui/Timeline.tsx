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
      {/* Vertical connecting spine */}
      <div className="absolute left-[5px] top-2 bottom-2 w-[2px] bg-slate-200" />

      {items.map((item, index) => {
        const isCurrent = item.status === 'current';
        const isCompleted = item.status === 'completed';

        return (
          <div key={item.id || index} className="relative flex items-start gap-4 group">
            {/* Circular Node */}
            <div
              className={`relative z-10 w-3 h-3 rounded-full shrink-0 mt-1 transition-all ${
                isCompleted
                  ? 'bg-emerald-500 ring-2 ring-emerald-100'
                  : isCurrent
                  ? 'bg-brand ring-4 ring-brand/15 scale-110'
                  : 'bg-slate-300'
              }`}
            />

            {/* Content */}
            <div className="flex-1 space-y-1 text-left">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-sans text-sm font-semibold text-slate-800">
                  {item.title}
                </span>
                {item.timestamp && (
                  <span className="font-sans text-xs text-slate-400">
                    {item.timestamp}
                  </span>
                )}
              </div>

              {item.description && (
                <p className="font-sans text-xs text-slate-500 leading-relaxed">
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
