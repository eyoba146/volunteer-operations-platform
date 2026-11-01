import React, { useState } from 'react';
import { CaretDown, CaretUp } from '@phosphor-icons/react';

export interface DataListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  limit?: number;
  emptyState?: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}

export function DataList<T>({
  items,
  renderItem,
  keyExtractor,
  limit = 8,
  emptyState,
  header,
  className = '',
}: DataListProps<T>) {
  const [expanded, setExpanded] = useState(false);

  if (!items || items.length === 0) {
    return <>{emptyState || null}</>;
  }

  const displayedItems = expanded || items.length <= limit ? items : items.slice(0, limit);
  const hasMore = items.length > limit;

  return (
    <div className={`w-full ${className}`}>
      {header && <div className="pb-3 border-b border-[#EDEFF2]">{header}</div>}
      <div className="divide-y divide-[#EDEFF2]">
        {displayedItems.map((item, idx) => (
          <div key={keyExtractor(item, idx)} className="py-4 first:pt-2 last:pb-2">
            {renderItem(item, idx)}
          </div>
        ))}
      </div>
      {hasMore && (
        <div className="pt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-ink-primary bg-[#F1F3F6] hover:bg-[#E8EBEF] rounded-[8px] border-none transition-colors cursor-pointer"
          >
            <span>{expanded ? 'Show less' : `Show all ${items.length}`}</span>
            {expanded ? <CaretUp className="w-4 h-4" /> : <CaretDown className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
}

