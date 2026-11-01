import React from 'react';

export type StatusType =
  | 'approved'
  | 'waiting'
  | 'in_progress'
  | 'logged'
  | 'needs_review'
  | 'needs_look'
  | 'declined'
  | 'rejected'
  | 'completed'
  | 'active'
  | 'inactive'
  | 'pending';

export interface StatusDotProps {
  status: StatusType | string;
  label?: string;
  className?: string;
}

export const StatusDot: React.FC<StatusDotProps> = ({
  status,
  label,
  className = '',
}) => {
  const norm = (status || '').toLowerCase();

  let dotColor = 'bg-slate-400';
  let defaultLabel = status;

  if (norm.includes('approv') || norm === 'active' || norm === 'completed') {
    dotColor = 'bg-emerald-500';
    defaultLabel = 'Approved';
  } else if (norm.includes('wait') || norm === 'logged' || norm === 'pending' || norm === 'submitted' || norm === 'in_review') {
    dotColor = 'bg-amber-400';
    defaultLabel = 'Waiting for approval';
  } else if (norm.includes('look') || norm.includes('review') || norm === 'delayed') {
    dotColor = 'bg-amber-500';
    defaultLabel = 'Needs a quick look';
  } else if (norm.includes('declin') || norm.includes('reject') || norm === 'inactive' || norm === 'failed') {
    dotColor = 'bg-rose-500';
    defaultLabel = 'Declined';
  } else if (norm.includes('progress')) {
    dotColor = 'bg-blue-500';
    defaultLabel = 'In progress';
  }

  return (
    <span className={`inline-flex items-center gap-2 text-sm text-ink-primary font-medium ${className} `}>
      <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor} `} />
      <span>{label || defaultLabel}</span>
    </span>
  );
};

