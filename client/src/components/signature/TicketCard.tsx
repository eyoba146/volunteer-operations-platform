import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity } from '../../types';
import { StatusMark } from '../ui/StatusMark';
import { Button } from '../ui/Button';
import { MapPin, UsersThree, ArrowRight, ShieldCheck } from '@phosphor-icons/react';

export interface TicketCardProps {
  activity: Activity;
  onClick?: () => void;
  actionLabel?: string;
  enrolledStatus?: string;
  actionSlot?: React.ReactNode;
  className?: string;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  activity,
  onClick,
  actionLabel = 'View details & join',
  enrolledStatus,
  actionSlot,
  className = '',
}) => {
  const navigate = useNavigate();
  const dateObj = new Date(activity.startsAt);
  const dayNum = dateObj.getDate();
  const monthStr = dateObj.toLocaleDateString('en-US', { month: 'short' });
  const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Spots remaining calculation
  const capacity = activity.capacity || 20;
  // Assume enrolled count or estimate
  const spotsLeft = activity.status === 'full' ? 0 : Math.max(1, Math.round(capacity * 0.3));
  const spotsPercent = Math.min(100, Math.round(((capacity - spotsLeft) / capacity) * 100));

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/volunteer/activities/${activity.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex flex-col md:flex-row items-stretch overflow-hidden ${className}`}
    >
      {/* Left Date Stub */}
      <div className="relative shrink-0 md:w-36 bg-[#F7F8FA] p-5 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-dashed border-[#EDEFF2]">
        {/* Concave Notches on Separator (Top & Bottom) */}
        <div className="hidden md:block absolute -top-3 -right-3 w-6 h-6 rounded-full bg-white z-10" />
        <div className="hidden md:block absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-white z-10" />

        <span className="font-mono text-[12px] font-bold text-role-volunteer tracking-wider block">
          {monthStr}
        </span>
        <span className="font-display font-black text-4xl text-ink-primary leading-none my-1">
          {dayNum}
        </span>
        <span className="font-mono text-[12px] text-ink-secondary">
          {timeStr}
        </span>
      </div>

      {/* Main Ticket Body */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between gap-4">
        <div className="space-y-2">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[12px] font-medium px-2 py-0.5 bg-[#F1F3F6] rounded-[4px] text-ink-primary capitalize">
              {activity.type.replace('_', ' ')}
            </span>
            <StatusMark status={activity.status} size="sm" />
            {enrolledStatus && (
              <span className="font-sans text-[12px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-[4px]">
                {enrolledStatus}
              </span>
            )}
            {activity.minRank && (
              <span className="font-mono text-[12px] text-ink-tertiary flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-role-volunteer" weight="bold" />
                <span>{activity.minRank.replace('_', ' ')} required</span>
              </span>
            )}
          </div>

          {/* Activity Title */}
          <h3 className="font-display text-xl sm:text-2xl font-bold text-ink-primary group-hover:text-role-volunteer transition-colors leading-tight">
            {activity.title}
          </h3>

          {/* Description */}
          <p className="font-sans text-[13px] text-ink-secondary line-clamp-2 leading-relaxed">
            {activity.description}
          </p>
        </div>

        {/* Footer info: Location, Capacity & Action */}
        <div className="pt-2 border-t border-[#EDEFF2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 text-[13px] font-sans text-ink-secondary">
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-ink-tertiary" />
              <span>{activity.place}, {activity.area}</span>
            </span>

            {/* Spots Left Meter */}
            <div className="flex items-center gap-2">
              <UsersThree className="w-4 h-4 text-ink-tertiary" />
              <span className="font-medium text-ink-secondary">
                {activity.status === 'full' ? (
                  <span className="text-red-700 font-semibold">Roster full</span>
                ) : (
                  <span><strong>{spotsLeft}</strong> spots left</span>
                )}
              </span>
              <div className="w-16 h-1.5 bg-[#E5E8EB] rounded-full overflow-hidden hidden sm:block">
                <div
                  className="h-full bg-role-volunteer rounded-full"
                  style={{ width: `${spotsPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action Slot or Default Tonal Button */}
          <div className="shrink-0 flex items-center" onClick={(e) => e.stopPropagation()}>
            {actionSlot ? (
              actionSlot
            ) : (
              <Button
                variant="secondary"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" weight="bold" />}
                onClick={handleClick}
              >
                {actionLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
