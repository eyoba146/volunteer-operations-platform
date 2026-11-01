import React, { useState } from 'react';
import { CaretDown, CaretUp, Check, X, Clock, Warning } from '@phosphor-icons/react';

export interface JourneyLogDetail {
  label: string;
  value: React.ReactNode;
}

export type JourneyItem = JourneyLogItem;

export interface JourneyLogItem {
  id: string;
  date: string;
  title: string;
  subtitle?: string;
  status: 'approved' | 'logged' | 'needs_review' | 'declined' | 'confirmed' | 'failed' | 'review' | string;
  statusLabel?: string;
  primaryNumeral?: string;
  leadValue?: string;
  details?: JourneyLogDetail[] | { fields?: Array<{ label: string; value: React.ReactNode }>; notes?: string };
  actionSlot?: React.ReactNode;
}

export interface JourneyLogLeadSummary {
  leadNumeral: string | number;
  label: string;
  inlineSentence: string;
}

export interface JourneyLogProps {
  items: JourneyLogItem[];
  leadSummary?: JourneyLogLeadSummary | string;
  className?: string;
}

export const JourneyLog: React.FC<JourneyLogProps> = ({
  items,
  leadSummary,
  className = '',
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Group items by month/year for chronological spine storytelling
  const groupedByMonth = React.useMemo(() => {
    const groups: { [key: string]: JourneyLogItem[] } = {};
    items.forEach((item) => {
      const d = new Date(item.date);
      const monthKey = !isNaN(d.getTime())
        ? d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'Recent entries';
      if (!groups[monthKey]) groups[monthKey] = [];
      groups[monthKey].push(item);
    });
    return Object.entries(groups);
  }, [items]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const renderStatusNode = (status: string) => {
    switch (status) {
      case 'approved':
      case 'confirmed':
        return (
          <div className="w-5 h-5 rounded-full bg-role-volunteer text-white flex items-center justify-center ring-4 ring-white">
            <Check className="w-3 h-3" weight="bold" />
          </div>
        );
      case 'logged':
      case 'waiting':
        return (
          <div className="w-5 h-5 rounded-full bg-white border border-slate-300 flex items-center justify-center ring-4 ring-white">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          </div>
        );
      case 'needs_review':
        return (
          <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center ring-4 ring-white">
            <Warning className="w-3 h-3" weight="bold" />
          </div>
        );
      case 'declined':
      case 'failed':
      case 'rejected':
        return (
          <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center ring-4 ring-white">
            <X className="w-3 h-3" weight="bold" />
          </div>
        );
      default:
        return (
          <div className="w-5 h-5 rounded-full bg-slate-400 text-white flex items-center justify-center ring-4 ring-white">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
        );
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Editorial Lead Summary (Replaces 3 equal stat boxes with 1 large lead numeral) */}
      {leadSummary && (
        typeof leadSummary === 'string' ? (
          <div className="rounded-[16px] bg-[#F7F8FA] p-5 sm:p-6 border-none font-sans text-sm text-ink-secondary">
            {leadSummary}
          </div>
        ) : (
          <div className="rounded-[16px] bg-[#F7F8FA] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-baseline gap-4 sm:gap-6 border-none">
            <div className="flex items-baseline gap-2">
              <span className="font-display font-black text-5xl sm:text-6xl text-ink-primary tracking-tight leading-none">
                {leadSummary.leadNumeral}
              </span>
              <span className="font-sans text-lg font-semibold text-ink-secondary">
                {leadSummary.label}
              </span>
            </div>
            <div className="font-sans text-[14px] text-ink-secondary border-t sm:border-t-0 sm:border-l border-[#EDEFF2] pt-3 sm:pt-0 sm:pl-6 leading-relaxed">
              {leadSummary.inlineSentence}
            </div>
          </div>
        )
      )}

      {/* Vertical Spine Chronological Feed */}
      <div className="space-y-8">
        {groupedByMonth.map(([monthLabel, monthItems]) => (
          <div key={monthLabel} className="space-y-3">
            {/* Month Separator Label */}
            <div className="flex items-center gap-3">
              <span className="font-sans font-bold text-[13px] text-ink-secondary">
                {monthLabel}
              </span>
              <div className="flex-1 h-px bg-[#EDEFF2]" />
            </div>

            {/* Spine Container */}
            <div className="relative pl-6 space-y-3 before:content-[''] before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#EDEFF2]">
              {monthItems.map((item) => {
                const isExpanded = expandedId === item.id;
                const dateFormatted = !isNaN(new Date(item.date).getTime())
                  ? new Date(item.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })
                  : item.date;

                return (
                  <div
                    key={item.id}
                    className="relative rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.08)] transition-all overflow-hidden"
                  >
                    {/* Spine Node Marker */}
                    <div className="absolute -left-6 top-5 -translate-x-1/2 z-10">
                      {renderStatusNode(item.status)}
                    </div>

                    {/* Main Row Head */}
                    <div
                      onClick={() => toggleExpand(item.id)}
                      className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F7F8FA]/50 transition-colors"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[13px] text-ink-tertiary">
                            {dateFormatted}
                          </span>
                          {item.statusLabel && (
                            <span className="font-sans text-[13px] font-semibold px-2 py-0.5 bg-[#F1F3F6] text-ink-secondary rounded-full">
                              {item.statusLabel}
                            </span>
                          )}
                        </div>

                        <h4 className="font-display font-bold text-base sm:text-lg text-ink-primary truncate">
                          {item.title}
                        </h4>

                        {item.subtitle && (
                          <p className="font-sans text-[13px] text-ink-secondary truncate">
                            {item.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Right Numerals and Caret */}
                      <div className="shrink-0 flex items-center gap-3 text-right">
                        <span className="font-mono font-bold text-lg sm:text-xl text-ink-primary">
                          {item.primaryNumeral || item.leadValue || ''}
                        </span>
                        <div className="text-ink-tertiary">
                          {isExpanded ? (
                            <CaretUp className="w-4 h-4" weight="bold" />
                          ) : (
                            <CaretDown className="w-4 h-4" weight="bold" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Story Details */}
                    {isExpanded && (
                      <div className="border-t border-[#EDEFF2] bg-[#F7F8FA] p-4 sm:p-5 space-y-3 animate-in fade-in duration-150">
                        {(() => {
                          const detailsList: JourneyLogDetail[] = Array.isArray(item.details)
                            ? item.details
                            : item.details?.fields
                            ? item.details.fields
                            : [];
                          return detailsList.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px] font-sans">
                              {detailsList.map((d, idx) => (
                              <div key={idx} className="space-y-0.5">
                                <span className="text-ink-tertiary block font-medium">
                                  {d.label}
                                </span>
                                <div className="text-ink-primary font-semibold">
                                  {d.value}
                                </div>
                              </div>
                            ))}
                            </div>
                          ) : null;
                        })()}

                        {item.actionSlot && (
                          <div className="pt-2 flex justify-end">
                            {item.actionSlot}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
