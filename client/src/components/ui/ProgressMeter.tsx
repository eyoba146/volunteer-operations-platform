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
  color,
  roleColor = '#1E824C',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((current / (target || 1)) * 100)));
  const isCompleted = current >= target;

  const effectiveColor = roleColor || (color === 'green' ? '#1E824C' : color === 'gold' ? '#E58B05' : '#111315');

  return (
    <div className={`space-y-2.5 ${className}`}>
      <div className="flex items-end justify-between">
        <div>
          <span className="font-sans text-xs font-bold uppercase tracking-tight text-ink-secondary block">
            {label}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-display text-4xl font-black text-ink-primary tracking-tight leading-none">
              {current}
            </span>
            <span className="font-display text-xl font-bold text-ink-secondary">
              / {target} {unit}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="font-display text-3xl font-black text-ink-primary leading-none">
            {percentage}%
          </span>
          <span className="font-sans text-xs text-ink-tertiary block">
            {isCompleted ? 'Station reached' : `${Math.max(0, target - current)} ${unit} remaining`}
          </span>
        </div>
      </div>

      {/* SVG Trail Route Segment */}
      <div className="relative w-full h-3.5 bg-canvas-inset overflow-hidden border border-border">
        {/* Animated Drawing Trail Route Line */}
        <motion.div
          className="h-full relative"
          style={{ backgroundColor: effectiveColor }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Waypoint marker head */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-3.5 bg-ink-primary" />
        </motion.div>
      </div>
    </div>
  );
};
