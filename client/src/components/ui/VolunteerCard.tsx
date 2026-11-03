import React from 'react';
import { VolunteerProfile, Rank } from '../../types';
import { Avatar } from './Avatar';
import { StatusMark } from './StatusMark';
import { QrCode, CheckCircle } from '@phosphor-icons/react';
import { TopoBackdrop } from '../signature/TopoBackdrop';

interface VolunteerCardProps {
  profile: VolunteerProfile;
  approvedHours?: number;
  completedActivities?: number;
  className?: string;
}

export const VolunteerCard: React.FC<VolunteerCardProps> = ({
  profile,
  approvedHours = 16.5,
  completedActivities = 4,
  className = '',
}) => {
  const rank: Rank = profile.rank || 'volunteer';
  const displayName = profile.fullName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Volunteer';

  return (
    <div
      className={`relative max-w-sm w-full bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] rounded-[16px] p-6 sm:p-7 space-y-5 text-left select-none overflow-hidden ${className} `}
      id="printable-volunteer-id-card"
    >
      <TopoBackdrop color="#16A34A" opacity={0.07} />

      <div className="relative z-10 space-y-5">
        {/* Top Header */}
      <div className="flex items-start justify-between pb-4">
        <div>
          <span className="font-display text-2xl font-bold text-ink-primary tracking-tight block">
            VTS trail pass
          </span>
          <span className="font-sans text-[13px] font-semibold text-role-volunteer">
            Verified community volunteer
          </span>
        </div>
        <div className="w-10 h-10 bg-role-volunteer text-white rounded-full flex items-center justify-center shadow-xs">
          <CheckCircle className="w-6 h-6" weight="fill" />
        </div>
      </div>

      {/* Profile & Photo section */}
      <div className="flex items-center gap-4">
        <Avatar
          name={displayName}
          photoUrl={profile.photoUrl}
          avatarUrl={profile.avatarUrl}
          rank={rank}
          size="lg"
          showRankBadge
        />
        <div className="space-y-1">
          <h3 className="font-display text-2xl font-black text-ink-primary leading-tight">
            {displayName}
          </h3>
          <div className="pt-0.5">
            <StatusMark status={rank} size="sm" />
          </div>
          <p className="font-sans text-[13px] font-medium text-ink-secondary">{profile.area}</p>
        </div>
      </div>

      {/* Verification Data Grid */}
      <div className="grid grid-cols-2 gap-3 p-4 bg-[#F7F8FA] rounded-[12px] text-sm font-sans">
        <div>
          <span className="text-[13px] text-ink-secondary font-medium block">Pass ID</span>
          <span className="font-sans text-[13px] font-bold text-ink-primary">{profile.volunteerNumber || 'VTS-AA-2026-084'}</span>
        </div>
        <div>
          <span className="text-[13px] text-ink-secondary font-medium block">Approved hours</span>
          <span className="font-display text-xl font-black text-ink-primary leading-none">{approvedHours} hrs</span>
        </div>
        <div>
          <span className="text-[13px] text-ink-secondary font-medium block">Community area</span>
          <span className="font-bold text-ink-primary truncate block">{profile.area}</span>
        </div>
        <div>
          <span className="text-[13px] text-ink-secondary font-medium block">Activities</span>
          <span className="font-display text-xl font-black text-ink-primary leading-none">{completedActivities} completed</span>
        </div>
      </div>

        {/* Perforated Stub Bottom */}
        <div className="pt-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[13px] font-sans text-ink-secondary font-medium block">
              Scan to verify on trail
            </span>
            <span className="font-sans text-[13px] font-bold text-ink-primary">
              {profile.volunteerNumber || 'VTS-AA-2026-084'}
            </span>
          </div>
          <div className="w-12 h-12 p-1.5 bg-[#F7F8FA] rounded-[10px] flex items-center justify-center">
            <QrCode className="w-full h-full text-ink-primary" weight="bold" />
          </div>
        </div>
      </div>
    </div>
  );
};
