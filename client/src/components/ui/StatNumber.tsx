import React from 'react';

interface StatNumberProps {
  number: string | number;
  unit?: string;
  label: string;
  sublabel?: string;
  color?: string;
  className?: string;
}

export const StatNumber: React.FC<StatNumberProps> = ({
  number,
  unit,
  label,
  sublabel,
  color = 'text-ink-primary',
  className = '',
}) => {
  return (
    <div className={`space-y-1 ${className} `}>
      <div className="flex items-baseline">
        <span className={`font-display text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none ${color} `}>
          {number}
        </span>
        {unit && (
          <span className="font-display text-2xl sm:text-3xl font-bold text-ink-secondary ml-1.5">
            {unit}
          </span>
        )}
      </div>
      <div>
        <span className="font-sans text-sm font-bold text-ink-primary tracking-tight block">
          {label}
        </span>
        {sublabel && (
          <span className="font-sans text-[13px] text-ink-secondary block mt-0.5">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
