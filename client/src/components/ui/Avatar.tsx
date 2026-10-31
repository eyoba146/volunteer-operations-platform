import React from 'react';
import { Rank } from '../../types';

interface AvatarProps {
  name: string;
  photoUrl?: string;
  avatarUrl?: string;
  rank?: Rank;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showRankBadge?: boolean;
}

const BOLD_COLORS = [
  'bg-role-volunteer text-white',
  'bg-role-manager text-white',
  'bg-role-teamlead text-white',
  'bg-role-applicant text-ink-primary',
  'bg-role-admin text-white',
  'bg-[#2B4C7E] text-white',
  'bg-[#8B3A3A] text-white',
  'bg-[#1B4332] text-white',
];

export const Avatar: React.FC<AvatarProps> = ({
  name,
  photoUrl,
  avatarUrl,
  rank,
  size = 'md',
  className = '',
  showRankBadge = false,
}) => {
  const effectivePhoto = avatarUrl || photoUrl;

  const getInitials = (str: string) => {
    if (!str) return 'VT';
    const parts = str.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  // Deterministic color assignment from name string hash
  const getColorClass = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % BOLD_COLORS.length;
    return BOLD_COLORS[idx];
  };

  const sizeStyles = {
    sm: 'w-8 h-8 text-[13px]',
    md: 'w-11 h-11 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-xl',
  }[size];

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`${sizeStyles} rounded-none border-2 border-ink-primary flex items-center justify-center font-display font-black select-none overflow-hidden ${
          effectivePhoto ? 'bg-canvas-subdued' : getColorClass(name || 'Volunteer')
        }`}
      >
        {effectivePhoto ? (
          <img src={effectivePhoto} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="tracking-tight">{getInitials(name)}</span>
        )}
      </div>

      {showRankBadge && rank && (
        <span
          title={rank.replace('_', ' ')}
          className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-ink-primary flex items-center justify-center text-[13px] font-display font-black ${
            rank === 'manager'
              ? 'bg-role-manager text-white'
              : rank === 'team_lead'
              ? 'bg-role-teamlead text-white'
              : rank === 'senior_member'
              ? 'bg-role-applicant text-ink-primary'
              : 'bg-role-volunteer text-white'
          }`}
        >
          {rank === 'manager' ? 'M' : rank === 'team_lead' ? 'L' : rank === 'senior_member' ? 'S' : 'V'}
        </span>
      )}
    </div>
  );
};
