import React from 'react';
import { motion } from 'motion/react';

export interface Waypoint {
  id: string;
  label: string;
  altitude: string; // e.g. "0m", "60m / 60 hrs"
  description?: string;
  isCompleted?: boolean;
  isCurrent?: boolean;
}

interface TrailLineProps {
  waypoints?: Waypoint[];
  currentWaypointIndex?: number;
  className?: string;
  showLabels?: boolean;
  strokeColor?: string;
}

export const TrailLine: React.FC<TrailLineProps> = ({
  waypoints = [
    { id: 'start', label: 'Start Trail', altitude: 'Base 0m', isCompleted: true },
    { id: 'member', label: 'Member', altitude: '0 hrs • Activated', isCompleted: true },
    { id: 'senior', label: 'Senior Member', altitude: '60 hrs • 8 Acts', isCurrent: true },
    { id: 'lead', label: 'Team Lead', altitude: '150 hrs • 20 Acts' },
    { id: 'manager', label: 'Manager', altitude: 'Summit 300 hrs' },
  ],
  currentWaypointIndex = 2,
  className = '',
  showLabels = true,
  strokeColor = '#0D5C46',
}) => {
  return (
    <div className={`relative w-full select-none py-4 ${className}`}>
      {/* SVG Canvas for Trail Path */}
      <div className="relative w-full h-20 overflow-visible">
        <svg
          viewBox="0 0 1000 100"
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Background guide dotted trail */}
          <path
            d="M 50 70 Q 250 20, 500 60 T 950 30"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="3"
            strokeDasharray="6 6"
            strokeLinecap="round"
          />

          {/* Animated drawn active trail line */}
          <motion.path
            d="M 50 70 Q 250 20, 500 60 T 950 30"
            fill="none"
            stroke={strokeColor}
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: Math.min(1, Math.max(0.1, (currentWaypointIndex + 0.5) / waypoints.length)) }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>

        {/* Waypoint stations */}
        <div className="absolute inset-0 flex justify-between items-center px-4 sm:px-8 pointer-events-none">
          {waypoints.map((wp, index) => {
            const isCompleted = wp.isCompleted || index < currentWaypointIndex;
            const isCurrent = wp.isCurrent || index === currentWaypointIndex;

            return (
              <div
                key={wp.id}
                className="relative flex flex-col items-center pointer-events-auto"
                style={{
                  transform: `translateY(${index % 2 === 0 ? '10px' : '-10px'})`,
                }}
              >
                {/* Station circle badge */}
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-sans text-xs font-bold transition-all shadow-soft border ${
                    isCurrent
                      ? 'bg-brand text-white border-brand ring-4 ring-brand/15 scale-110'
                      : isCompleted
                      ? 'bg-white text-brand border-brand/50'
                      : 'bg-white text-slate-400 border-slate-200'
                  }`}
                  whileHover={{ scale: 1.15 }}
                >
                  {isCompleted && !isCurrent ? '✓' : index + 1}
                </motion.div>

                {showLabels && (
                  <div className="absolute top-10 flex flex-col items-center text-center w-28 -left-10">
                    <span className="font-display text-xs font-bold text-slate-800 tracking-tight leading-tight">
                      {wp.label}
                    </span>
                    <span className="font-sans text-[10px] text-slate-500 mt-0.5">
                      {wp.altitude}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
