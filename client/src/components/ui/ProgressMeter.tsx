import React from 'react';
import { motion } from 'motion/react';

export interface ProgressMeterProps {
  label: string;
  current: number;
  target: number;
  unit?: string;
  color?: string;
  roleColor?: string;
  className?: string;
}

export const ProgressMeter: React.FC<ProgressMeterProps> = ({
  label,
  current,
  target,
  unit = 'hrs',
  roleColor = '#0D5C46',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((current / (target || 1)) * 100)));
  const isCompleted = current >= target;

  return (
    <div className={`space-y-2.5 ${className}`}>
      <div className="flex items-end justify-between">
        <div>
          <span className="font-sans text-xs font-semibold text-slate-500 block">
            {label}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
              {current}
            </span>
            <span className="font-display text-lg font-semibold text-slate-400">
              / {target} {unit}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none">
            {percentage}%
          </span>
          <span className="font-sans text-xs text-slate-500 block mt-0.5">
            {isCompleted ? 'Goal completed' : `${Math.max(0, target - current)} ${unit} remaining`}
          </span>
        </div>
      </div>

      {/* Soft Pill Progress Track */}
      <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: roleColor }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
};
