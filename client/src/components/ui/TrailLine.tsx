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
  strokeColor = '#111315',
}) => {
  return (
    <div className={`relative w-full select-none py-6 ${className}`}>
      {/* SVG Canvas for Trail Path */}
      <div className="relative w-full h-24 overflow-visible">
        <svg
          viewBox="0 0 1000 100"
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Background guide dotted trail */}
          <path
            d="M 50 70 Q 250 20, 500 60 T 950 30"
            fill="none"
            stroke="#DDE1E5"
            strokeWidth="4"
            strokeDasharray="6 6"
            strokeLinecap="round"
          />

          {/* Animated drawn active trail line */}
          <motion.path
            d="M 50 70 Q 250 20, 500 60 T 950 30"
            fill="none"
            stroke={strokeColor}
            strokeWidth="5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: currentWaypointIndex / (waypoints.length - 1) }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Waypoint Coordinates along the path */}
          {[
            { cx: 50, cy: 70 },
            { cx: 275, cy: 38 },
            { cx: 500, cy: 60 },
            { cx: 725, cy: 45 },
            { cx: 950, cy: 30 },
          ].map((pt, i) => {
            const isPassed = i <= currentWaypointIndex;
            const isCurrent = i === currentWaypointIndex;
            return (
              <g key={i}>
                {isCurrent && (
                  <motion.circle
                    cx={pt.cx}
                    cy={pt.cy}
                    r="16"
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="2"
                    initial={{ scale: 0.8, opacity: 0.4 }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 2.2 }}
                  />
                )}
                <circle
                  cx={pt.cx}
                  cy={pt.cy}
                  r={isCurrent ? 9 : 7}
                  fill={isPassed ? strokeColor : '#FFFFFF'}
                  stroke={strokeColor}
                  strokeWidth="3"
                />
              </g>
            );
          })}
        </svg>

        {/* HTML Labels Placed Along Waypoints */}
        {showLabels && (
          <div className="flex justify-between w-full pt-4 px-2">
            {waypoints.map((wp, idx) => {
              const isPassed = idx <= currentWaypointIndex;
              const isCurrent = idx === currentWaypointIndex;

              return (
                <div
                  key={wp.id}
                  className={`flex flex-col ${
                    idx === 0
                      ? 'items-start text-left'
                      : idx === waypoints.length - 1
                      ? 'items-end text-right'
                      : 'items-center text-center'
                  } max-w-[120px]`}
                >
                  <span
                    className={`font-display text-lg tracking-tight font-black leading-none uppercase ${
                      isCurrent
                        ? 'text-ink-primary'
                        : isPassed
                        ? 'text-ink-primary opacity-80'
                        : 'text-ink-tertiary'
                    }`}
                  >
                    {wp.label}
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-ink-secondary mt-0.5">
                    {wp.altitude}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

