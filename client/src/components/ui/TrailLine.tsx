import React from 'react';
import { motion } from 'motion/react';

export interface Waypoint {
  id: string;
  label: string;
  threshold?: string;
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
  onSelectWaypoint?: (index: number) => void;
}

export const TrailLine: React.FC<TrailLineProps> = ({
  waypoints = [
    { id: 'start', label: 'Start', threshold: 'Registration', isCompleted: true },
    { id: 'member', label: 'Member', threshold: '0 hrs • Verified', isCompleted: true },
    { id: 'senior', label: 'Senior Member', threshold: '60 hrs • 8 acts', isCurrent: true },
    { id: 'lead', label: 'Team Lead', threshold: '150 hrs • 20 acts' },
    { id: 'manager', label: 'Manager', threshold: '300 hrs • 30 acts' },
  ],
  currentWaypointIndex = 2,
  className = '',
  showLabels = true,
  strokeColor = '#111315',
  onSelectWaypoint,
}) => {
  // Coordinate distribution depending on waypoints count
  const points = waypoints.map((_, i) => {
    const fraction = i / Math.max(1, waypoints.length - 1);
    const cx = 50 + fraction * 900;
    // Gentle curve
    const cy = 60 - Math.sin(fraction * Math.PI) * 25;
    return { cx, cy };
  });

  return (
    <div className={`relative w-full select-none py-6 ${className} `}>
      {/* SVG Canvas for Trail Path */}
      <div className="relative w-full h-24 overflow-visible">
        <svg
          viewBox="0 0 1000 100"
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Background guide dotted trail */}
          <path
            d={`M 50 60 Q 500 20, 950 40`}
            fill="none"
            stroke="#D5DAE1"
            strokeWidth="3"
            strokeDasharray="6 6"
            strokeLinecap="round"
          />

          {/* Animated drawn active trail line */}
          <motion.path
            d={`M 50 60 Q 500 20, 950 40`}
            fill="none"
            stroke={strokeColor}
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: currentWaypointIndex / Math.max(1, waypoints.length - 1) }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Waypoint Coordinates along the path */}
          {points.map((pt, i) => {
            const isPassed = i <= currentWaypointIndex;
            const isCurrent = i === currentWaypointIndex;
            return (
              <g
                key={i}
                onClick={() => onSelectWaypoint && onSelectWaypoint(i)}
                className={onSelectWaypoint ? 'cursor-pointer' : ''}
              >
                {isCurrent && (
                  <motion.circle
                    cx={pt.cx}
                    cy={pt.cy}
                    r="15"
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="2"
                    initial={{ scale: 0.8, opacity: 0.4 }}
                    animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0.1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 2.2 }}
                  />
                )}
                <circle
                  cx={pt.cx}
                  cy={pt.cy}
                  r={isCurrent ? 8 : 6}
                  fill={isPassed ? strokeColor : '#FFFFFF'}
                  stroke={strokeColor}
                  strokeWidth="2.5"
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
                <button
                  type="button"
                  key={wp.id}
                  onClick={() => onSelectWaypoint && onSelectWaypoint(idx)}
                  className={`flex flex-col ${
                    idx === 0
                      ? 'items-start text-left'
                      : idx === waypoints.length - 1
                      ? 'items-end text-right'
                      : 'items-center text-center'
                  } max-w-[140px] ${onSelectWaypoint ? 'cursor-pointer hover:opacity-80' : ''} `}
                >
                  <span
                    className={`font-display text-base tracking-tight font-bold leading-tight ${
                      isCurrent
                        ? 'text-ink-primary font-black underline decoration-2 decoration-role-volunteer underline-offset-4'
                        : isPassed
                        ? 'text-ink-primary font-bold'
                        : 'text-ink-tertiary'
                    } `}
                  >
                    {wp.label}
                  </span>
                  <span className="font-sans text-[13px] font-medium text-ink-secondary mt-1">
                    {wp.threshold}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
