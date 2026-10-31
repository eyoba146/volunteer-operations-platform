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
  color = 'text-slate-900',
  className = '',
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-baseline">
        <span className={`font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none ${color}`}>
          {number}
        </span>
        {unit && (
          <span className="font-display text-xl sm:text-2xl font-semibold text-slate-500 ml-1.5">
            {unit}
          </span>
        )}
      </div>
      <div>
        <span className="font-sans text-sm font-semibold text-slate-700 block">
          {label}
        </span>
        {sublabel && (
          <span className="font-sans text-xs text-slate-500 block mt-0.5">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};

