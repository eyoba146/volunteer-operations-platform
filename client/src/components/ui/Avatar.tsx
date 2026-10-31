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
    lg: 'w-14 h-14 text-sm',
    xl: 'w-20 h-20 text-lg',
  }[size];

  const getRankBorder = () => {
    switch (rank) {
      case 'manager':
        return 'border-ink-primary';
      case 'team_lead':
        return 'border-civic-navy';
      case 'senior_member':
        return 'border-civic-gold';
      case 'member':
        return 'border-civic-green';
      default:
        return 'border-border';
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`${sizeStyles} ${getRankBorder()} rounded-none border bg-canvas-subdued flex items-center justify-center font-mono font-semibold text-ink-primary select-none overflow-hidden`}
      >
        {photoUrl ? (
          <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="tracking-tighter">{getInitials(name)}</span>
        )}
      </div>

      {showRankBadge && rank && (
        <span
          title={rank.replace('_', ' ')}
          className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border border-canvas-raised flex items-center justify-center text-[9px] font-bold ${
            rank === 'manager'
              ? 'bg-ink-primary text-canvas'
              : rank === 'team_lead'
              ? 'bg-civic-navy text-canvas'
              : rank === 'senior_member'
              ? 'bg-civic-gold text-ink-primary'
              : 'bg-civic-green text-canvas'
          }`}
        >
          {rank === 'manager' ? 'M' : rank === 'team_lead' ? 'L' : rank === 'senior_member' ? 'S' : 'V'}
        </span>
      )}
    </div>
  );
};

