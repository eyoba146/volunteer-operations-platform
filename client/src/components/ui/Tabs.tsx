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
      className={`flex items-center gap-1.5 p-1.5 bg-canvas-subdued border border-[#D5DAE1] rounded-[10px] overflow-x-auto no-scrollbar ${className}`}
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
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold tracking-tight transition-all duration-150 whitespace-nowrap cursor-pointer rounded-[8px] select-none ${
              isActive
                ? 'bg-white border border-[#D5DAE1] text-ink-primary shadow-sm font-bold'
                : 'border border-transparent text-ink-secondary hover:text-ink-primary hover:bg-white/60'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[13px] px-2 py-0.5 rounded-full font-bold leading-none ${
                  isActive
                    ? 'bg-ink-primary text-white'
                    : 'bg-canvas-subdued text-ink-secondary border border-[#D5DAE1]'
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
