import React from 'react';

export type AnyStatus = 
  | 'active'
  | 'unverified'
  | 'suspended'
  | 'draft'
  | 'submitted'
  | 'in_review'
  | 'more_info_needed'
  | 'accepted'
  | 'rejected'
  | 'expired'
  | 'withdrawn'
  | 'not_started'
  | 'waiting'
  | 'confirmed'
  | 'failed'
  | 'needs_review'
  | 'refunded'
  | 'logged'
  | 'approved'
  | 'declined'
  | 'not_eligible'
  | 'eligible'
  | 'recommended'
  | 'open'
  | 'full'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'member'
  | 'senior_member'
  | 'team_lead'
  | 'manager'
  | 'admin'
  | 'finance'
  | 'applicant'
  | 'volunteer';

interface StatusMarkProps {
  status: AnyStatus;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusMark: React.FC<StatusMarkProps> = ({
  status,
  label,
  size = 'md',
  className = '',
}) => {
  const getDescriptor = (): { text: string; dotClass: string } => {
    switch (status) {
      case 'active':
      case 'confirmed':
      case 'accepted':
      case 'approved':
      case 'completed':
        return { text: label || status.replace('_', ' '), dotClass: 'bg-emerald-500' };

      case 'waiting':
      case 'submitted':
      case 'in_review':
      case 'in_progress':
      case 'logged':
        return { text: label || status.replace('_', ' '), dotClass: 'bg-amber-500' };

      case 'needs_review':
      case 'more_info_needed':
      case 'recommended':
        return { text: label || (status === 'needs_review' ? 'Needs review' : status.replace('_', ' ')), dotClass: 'bg-orange-500' };

      case 'failed':
      case 'rejected':
      case 'declined':
      case 'cancelled':
      case 'suspended':
        return { text: label || status.replace('_', ' '), dotClass: 'bg-rose-500' };

      case 'member':
        return { text: label || 'Member', dotClass: 'bg-emerald-600' };
      case 'senior_member':
        return { text: label || 'Senior Member', dotClass: 'bg-teal-600' };
      case 'team_lead':
        return { text: label || 'Team Lead', dotClass: 'bg-rose-600' };
      case 'manager':
        return { text: label || 'Manager', dotClass: 'bg-teal-700' };
      case 'volunteer':
        return { text: label || 'Volunteer', dotClass: 'bg-emerald-600' };
      case 'applicant':
        return { text: label || 'Applicant', dotClass: 'bg-amber-500' };
      case 'finance':
        return { text: label || 'Finance', dotClass: 'bg-slate-900' };
      case 'admin':
        return { text: label || 'Administrator', dotClass: 'bg-slate-700' };

      case 'open':
        return { text: label || 'Open', dotClass: 'bg-emerald-500' };
      case 'full':
        return { text: label || 'Full', dotClass: 'bg-slate-400' };
      case 'eligible':
        return { text: label || 'Eligible', dotClass: 'bg-emerald-500' };
      case 'not_eligible':
        return { text: label || 'Not Eligible', dotClass: 'bg-slate-400' };

      default:
        return { text: label || status.replace('_', ' '), dotClass: 'bg-slate-400' };
    }
  };

  const { text, dotClass } = getDescriptor();
  const textSize = size === 'sm' ? 'text-[11px]' : 'text-xs';

  return (
    <span className={`inline-flex items-center gap-2 ${textSize} font-medium text-slate-700 select-none ${className}`}>
      <span className={`w-2 h-2 rounded-full shrink-0 ${dotClass}`} />
      <span className="capitalize">{text}</span>
    </span>
  );
};
