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
      className={`flex items-center gap-2 p-1.5 bg-canvas-subdued border-2 border-ink-primary overflow-x-auto no-scrollbar ${className}`}
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
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold tracking-tight transition-all duration-100 whitespace-nowrap cursor-pointer rounded-none select-none ${
              isActive
                ? 'bg-white border-2 border-ink-primary shadow-[3px_3px_0_#111111] text-ink-primary -translate-x-[1px] -translate-y-[1px]'
                : 'border-2 border-transparent text-ink-secondary hover:text-ink-primary hover:border-ink-primary/30'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-xs px-2 py-0.5 border font-display font-black leading-none ${
                  isActive
                    ? 'border-ink-primary bg-ink-primary text-white'
                    : 'border-ink-primary/40 bg-white text-ink-secondary'
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
