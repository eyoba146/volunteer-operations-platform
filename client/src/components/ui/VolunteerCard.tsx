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

  return (
    <div
      className={`relative max-w-sm w-full bg-white rounded-[24px] shadow-soft border border-slate-100 p-6 space-y-5 text-left select-none overflow-hidden ${className}`}
      id="printable-volunteer-id-card"
    >
      {/* Top Header */}
      <div className="flex items-start justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="font-display text-xl font-bold text-slate-900 tracking-tight block">
            Volunteer ID Pass
          </span>
          <span className="font-sans text-xs font-medium text-emerald-600">
            Verified Active Member
          </span>
        </div>
        <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
          <CheckCircle className="w-5 h-5" weight="fill" />
        </div>
      </div>

      {/* Profile & Photo section */}
      <div className="flex items-center gap-4">
        <Avatar
          name={profile.fullName}
          photoUrl={profile.photoUrl}
          rank={rank}
          size="xl"
          showRankBadge
        />
        <div className="space-y-1">
          <h3 className="font-display text-xl font-bold text-slate-900 leading-tight">
            {profile.fullName}
          </h3>
          <div className="pt-0.5">
            <StatusMark status={rank} size="sm" />
          </div>
          <span className="font-mono text-xs font-semibold text-slate-500 block">
            {profile.volunteerNumber || 'VTS-ET-2026-0042'}
          </span>
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-slate-50 rounded-[16px] text-xs font-sans">
        <div>
          <span className="text-slate-400 block text-[11px]">Primary Area</span>
          <span className="font-semibold text-slate-800">{profile.area}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Member Since</span>
          <span className="font-semibold text-slate-800">{profile.memberSince}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Verified Hours</span>
          <span className="font-semibold text-slate-800">{approvedHours} hrs</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Completed Tasks</span>
          <span className="font-semibold text-slate-800">{completedActivities} duties</span>
        </div>
      </div>

      {/* Pass Footer / QR */}
      <div className="flex items-center justify-between pt-3 border-t border-dashed border-slate-200">
        <div className="space-y-0.5">
          <span className="text-[11px] font-sans text-slate-400 block">Digital Verification</span>
          <span className="text-xs font-mono font-medium text-slate-600">vts.et/verify</span>
        </div>
        <div className="p-1.5 bg-slate-50 rounded-[10px] border border-slate-100">
          <QrCode className="w-8 h-8 text-slate-800" />
        </div>
      </div>
    </div>
  );
};
