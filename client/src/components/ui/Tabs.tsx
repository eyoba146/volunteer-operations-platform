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
  accentColor?: string;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  accentColor = '#111111',
  className = '',
}) => {
  return (
    <div
      className={`flex items-center gap-6 border-b border-[#EDEFF2] overflow-x-auto no-scrollbar select-none ${className}`}
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
            className={`relative flex items-center gap-2 py-3 px-1 text-sm font-sans tracking-tight transition-colors whitespace-nowrap cursor-pointer ${
              isActive
                ? 'font-bold text-ink-primary'
                : 'font-medium text-ink-secondary hover:text-ink-primary'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[13px] px-2 py-0.5 rounded-full font-bold leading-none ${
                  isActive
                    ? 'bg-ink-primary text-white'
                    : 'bg-[#F1F3F6] text-ink-secondary'
                }`}
              >
                {tab.count}
              </span>
            )}
            {/* 2px Underline indicator */}
            {isActive && (
              <span
                className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                style={{ backgroundColor: accentColor }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
