import React from 'react';
import { Rank } from '../../types';

interface AvatarProps {
  name: string;
  photoUrl?: string;
  rank?: Rank;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showRankBadge?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  photoUrl,
  rank,
  size = 'md',
  className = '',
  showRankBadge = false,
}) => {
  const getInitials = (str: string) => {
    const parts = str.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  const sizeStyles = {
    sm: 'w-7 h-7 text-[11px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-base',
  }[size];

  const getRankDot = () => {
    switch (rank) {
      case 'manager':
        return 'bg-role-manager';
      case 'team_lead':
        return 'bg-role-teamlead';
      case 'senior_member':
        return 'bg-amber-500';
      case 'member':
        return 'bg-role-volunteer';
      default:
        return 'bg-slate-400';
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`${sizeStyles} rounded-full bg-slate-100 border border-slate-200/80 flex items-center justify-center font-sans font-semibold text-slate-700 select-none overflow-hidden`}
      >
        {photoUrl ? (
          <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>

      {showRankBadge && rank && (
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getRankDot()}`}
          title={rank.replace('_', ' ')}
        />
      )}
    </div>
  );
};
