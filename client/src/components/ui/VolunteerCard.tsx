import React from 'react';
import { VolunteerProfile, Rank } from '../../types';
import { Avatar } from './Avatar';
import { StatusMark } from './StatusMark';
import { QrCode, CheckCircle } from '@phosphor-icons/react';

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
  const rank: Rank = profile.rank || 'member';
  const displayName = profile.fullName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Volunteer';

  return (
    <div
      className={`relative max-w-sm w-full bg-white border-4 border-ink-primary p-6 shadow-[6px_6px_0_#111111] space-y-5 text-left select-none ${className}`}
      id="printable-volunteer-id-card"
      style={{
        clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)',
      }}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between border-b-2 border-ink-primary pb-4">
        <div>
          <span className="font-display text-2xl font-black text-ink-primary tracking-tight block">
            VTS Trail Pass
          </span>
          <span className="font-sans text-xs font-bold text-role-volunteer">
            Verified Community Volunteer
          </span>
        </div>
        <div className="w-10 h-10 bg-role-volunteer text-white border-2 border-ink-primary flex items-center justify-center font-bold">
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
          <p className="font-sans text-xs font-bold text-ink-secondary">{profile.area}</p>
        </div>
      </div>

      {/* Verification Data Grid */}
      <div className="grid grid-cols-2 gap-3 p-3 bg-canvas-subdued border-2 border-ink-primary text-xs font-sans">
        <div>
          <span className="text-[13px] text-ink-secondary font-bold block">Pass ID</span>
          <span className="font-sans text-xs font-bold text-ink-primary">{profile.volunteerNumber || 'VTS-AA-2026-084'}</span>
        </div>
        <div>
          <span className="text-[13px] text-ink-secondary font-bold block">Approved Hours</span>
          <span className="font-display text-xl font-black text-ink-primary leading-none">{approvedHours} hrs</span>
        </div>
        <div>
          <span className="text-[13px] text-ink-secondary font-bold block">Duty Region</span>
          <span className="font-bold text-ink-primary truncate block">{profile.area}</span>
        </div>
        <div>
          <span className="text-[13px] text-ink-secondary font-bold block">Activities</span>
          <span className="font-display text-xl font-black text-ink-primary leading-none">{completedActivities} completed</span>
        </div>
      </div>

      {/* Perforated Stub Bottom */}
      <div className="pt-4 border-t-2 border-dashed border-ink-primary flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[13px] font-sans text-ink-secondary font-bold block">
            Scan to Verify on Trail
          </span>
          <span className="font-sans text-xs font-bold text-ink-primary">
            {profile.volunteerNumber || 'VTS-AA-2026-084'}
          </span>
        </div>
        <div className="w-12 h-12 border-2 border-ink-primary p-0.5 bg-white flex items-center justify-center shadow-[2px_2px_0_#111111]">
          <QrCode className="w-full h-full text-ink-primary" weight="bold" />
        </div>
      </div>
    </div>
  );
};
