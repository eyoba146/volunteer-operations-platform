import React from 'react';
import { 
  Check, 
  Clock, 
  Warning, 
  X, 
  Minus, 
  ArrowClockwise,
  ShieldCheck,
  Star
} from '@phosphor-icons/react';

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
  | 'refund_requested'
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
  | 'joined'
  | 'left'
  | 'attended'
  | 'no-show'
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
  // Architectural status definitions: high contrast, solid micro-dots, structural borders
  const getDescriptor = () => {
    switch (status) {
      // Success / Verified
      case 'confirmed':
        return {
          text: label || 'Confirmed',
          icon: <Check className="w-3 h-3 text-civic-green" weight="bold" />,
          classes: 'border-civic-green/40 bg-civic-greenLight text-civic-green',
        };
      case 'approved':
        return {
          text: label || 'Approved',
          icon: <Check className="w-3 h-3 text-civic-green" weight="bold" />,
          classes: 'border-civic-green/40 bg-civic-greenLight text-civic-green',
        };
      case 'accepted':
        return {
          text: label || 'Accepted',
          icon: <Check className="w-3 h-3 text-civic-green" weight="bold" />,
          classes: 'border-civic-green/40 bg-civic-greenLight text-civic-green',
        };
      case 'active':
        return {
          text: label || 'Active',
          icon: <span className="w-1.5 h-1.5 rounded-none bg-civic-green" />,
          classes: 'border-civic-green/40 bg-civic-greenLight text-civic-green',
        };
      case 'completed':
        return {
          text: label || 'Completed',
          icon: <Check className="w-3 h-3 text-ink-primary" weight="bold" />,
          classes: 'border-border-strong bg-canvas-subdued text-ink-primary',
        };

      // Review / Pending / Caution
      case 'needs_review':
        return {
          text: label || 'Needs Review',
          icon: <Warning className="w-3 h-3 text-civic-rust" weight="bold" />,
          classes: 'border-civic-rust/50 bg-civic-rustLight text-civic-rust',
        };
      case 'refund_requested':
        return {
          text: label || 'Refund Requested',
          icon: <Warning className="w-3 h-3 text-[#784E0B]" weight="bold" />,
          classes: 'border-amber-400 bg-amber-50 text-amber-900',
        };
      case 'attended':
        return {
          text: label || 'Attended',
          icon: <Check className="w-3 h-3 text-civic-green" weight="bold" />,
          classes: 'border-civic-green/40 bg-civic-greenLight text-civic-green',
        };
      case 'joined':
        return {
          text: label || 'Enrolled',
          icon: <span className="w-1.5 h-1.5 bg-civic-navy" />,
          classes: 'border-civic-navy/40 bg-civic-navyLight text-civic-navy',
        };
      case 'left':
      case 'no-show':
        return {
          text: label || (status === 'left' ? 'Withdrawn' : 'No-Show'),
          icon: <X className="w-3 h-3 text-civic-rust" weight="bold" />,
          classes: 'border-civic-rust/40 bg-civic-rustLight text-civic-rust',
        };
      case 'more_info_needed':
        return {
          text: label || 'More Info Needed',
          icon: <Warning className="w-3 h-3 text-civic-gold" weight="bold" />,
          classes: 'border-civic-gold/60 bg-civic-goldLight text-[#784E0B]',
        };
      case 'in_review':
        return {
          text: label || 'In Review',
          icon: <Clock className="w-3 h-3 text-[#784E0B]" weight="bold" />,
          classes: 'border-civic-gold/50 bg-civic-goldLight text-[#784E0B]',
        };
      case 'submitted':
        return {
          text: label || 'Submitted',
          icon: <Clock className="w-3 h-3 text-civic-navy" weight="bold" />,
          classes: 'border-civic-navy/40 bg-civic-navyLight text-civic-navy',
        };
      case 'waiting':
        return {
          text: label || 'Waiting',
          icon: <ArrowClockwise className="w-3 h-3 text-civic-navy animate-spin" />,
          classes: 'border-civic-navy/40 bg-civic-navyLight text-civic-navy',
        };
      case 'logged':
        return {
          text: label || 'Logged (Pending)',
          icon: <Clock className="w-3 h-3 text-ink-secondary" weight="bold" />,
          classes: 'border-border bg-canvas-subdued text-ink-secondary',
        };
      case 'recommended':
        return {
          text: label || 'Recommended',
          icon: <Star className="w-3 h-3 text-civic-gold" weight="fill" />,
          classes: 'border-civic-gold bg-civic-goldLight text-[#784E0B]',
        };
      case 'eligible':
        return {
          text: label || 'Eligible for Promotion',
          icon: <ShieldCheck className="w-3 h-3 text-civic-green" weight="bold" />,
          classes: 'border-civic-green bg-civic-greenLight text-civic-green',
        };
      case 'open':
        return {
          text: label || 'Open for Sign-up',
          icon: <span className="w-1.5 h-1.5 bg-civic-green" />,
          classes: 'border-civic-green/40 bg-civic-greenLight text-civic-green',
        };
      case 'in_progress':
        return {
          text: label || 'In Progress',
          icon: <span className="w-1.5 h-1.5 bg-civic-gold animate-pulse" />,
          classes: 'border-civic-gold/50 bg-civic-goldLight text-[#784E0B]',
        };
      case 'full':
        return {
          text: label || 'Roster Full',
          icon: <Minus className="w-3 h-3 text-ink-secondary" />,
          classes: 'border-border bg-canvas-subdued text-ink-secondary',
        };

      // Inactive / Negative / Terminated
      case 'rejected':
      case 'declined':
        return {
          text: label || (status === 'rejected' ? 'Rejected' : 'Declined'),
          icon: <X className="w-3 h-3 text-civic-rust" weight="bold" />,
          classes: 'border-civic-rust/40 bg-civic-rustLight text-civic-rust',
        };
      case 'failed':
        return {
          text: label || 'Payment Failed',
          icon: <X className="w-3 h-3 text-civic-rust" weight="bold" />,
          classes: 'border-civic-rust/40 bg-civic-rustLight text-civic-rust',
        };
      case 'refunded':
        return {
          text: label || 'Refunded',
          icon: <ArrowClockwise className="w-3 h-3 text-ink-secondary" weight="bold" />,
          classes: 'border-border bg-canvas-subdued text-ink-secondary',
        };
      case 'expired':
        return {
          text: label || 'Window Expired',
          icon: <X className="w-3 h-3 text-ink-tertiary" />,
          classes: 'border-border bg-canvas-subdued text-ink-tertiary',
        };
      case 'cancelled':
        return {
          text: label || 'Cancelled',
          icon: <X className="w-3 h-3 text-ink-tertiary" />,
          classes: 'border-border bg-canvas-subdued text-ink-tertiary',
        };
      case 'withdrawn':
        return {
          text: label || 'Withdrawn',
          icon: <Minus className="w-3 h-3 text-ink-tertiary" />,
          classes: 'border-border bg-canvas-subdued text-ink-tertiary',
        };
      case 'suspended':
        return {
          text: label || 'Suspended',
          icon: <X className="w-3 h-3 text-civic-rust" weight="bold" />,
          classes: 'border-civic-rust bg-civic-rustLight text-civic-rust',
        };
      case 'unverified':
        return {
          text: label || 'Email Unverified',
          icon: <Clock className="w-3 h-3 text-ink-secondary" />,
          classes: 'border-border bg-canvas-subdued text-ink-secondary',
        };

      // Ranks
      case 'member':
        return {
          text: label || 'Member',
          icon: <span className="w-1.5 h-1.5 bg-civic-green" />,
          classes: 'border-civic-green/40 bg-canvas-raised text-civic-green font-semibold',
        };
      case 'senior_member':
        return {
          text: label || 'Senior Member',
          icon: <Star className="w-3 h-3 text-civic-gold" weight="fill" />,
          classes: 'border-civic-gold bg-canvas-raised text-[#784E0B] font-semibold',
        };
      case 'team_lead':
        return {
          text: label || 'Team Lead',
          icon: <ShieldCheck className="w-3 h-3 text-civic-navy" weight="fill" />,
          classes: 'border-civic-navy bg-canvas-raised text-civic-navy font-semibold',
        };
      case 'manager':
        return {
          text: label || 'Manager',
          icon: <ShieldCheck className="w-3 h-3 text-ink-primary" weight="fill" />,
          classes: 'border-ink-primary bg-canvas-raised text-ink-primary font-semibold',
        };

      default:
        return {
          text: label || status,
          icon: <Minus className="w-3 h-3 text-ink-tertiary" />,
          classes: 'border-border bg-canvas-subdued text-ink-secondary',
        };
    }
  };

  const { text, icon, classes } = getDescriptor();
  const sizeClasses =
    size === 'sm'
      ? 'text-[13px] px-2 py-0.5 gap-1.5'
      : 'text-[13px] px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-sans font-bold text-[13px] tracking-tight border rounded-[6px] ${sizeClasses} ${classes} ${className}`}
    >
      {icon}
      <span>{text}</span>
    </span>
  );
};
