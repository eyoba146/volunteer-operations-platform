import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center gap-1 border-b border-border overflow-x-auto no-scrollbar ${className}`}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-150 border-b-2 -mb-[1px] whitespace-nowrap cursor-pointer ${
              isActive
                ? 'border-ink-primary text-ink-primary bg-canvas-raised'
                : 'border-transparent text-ink-tertiary hover:text-ink-primary hover:border-border'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`font-mono text-[11px] px-1.5 py-0.2 rounded-none border ${
                  isActive
                    ? 'border-ink-primary bg-canvas-inset text-ink-primary font-bold'
                    : 'border-border bg-canvas-subdued text-ink-secondary'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

