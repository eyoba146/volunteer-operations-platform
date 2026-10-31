import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Application, Payment } from '../../types';
import { Button, StatusMark, Timeline, TimelineItem, Skeleton } from '../../components/ui';
import { Money, Clock, Warning, CheckCircle, ArrowRight, UserCircle } from '@phosphor-icons/react';

export const ApplicantStatusPage: React.FC = () => {
  const { user } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const app = await api.getMyApplication(user.id);
        setApplication(app);
        if (app) {
          const pay = await api.getPaymentForApplication(app.id);
          setPayment(pay);
        }
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="rect" className="h-48" />
        <Skeleton variant="rect" className="h-64" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="border border-border bg-canvas-raised p-8 text-center space-y-4 max-w-lg mx-auto">
        <div className="w-12 h-12 mx-auto border border-border bg-canvas-subdued flex items-center justify-center text-ink-primary">
          <UserCircle className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-ink-primary">
          Complete Your Application
        </h2>
        <p className="font-sans text-xs sm:text-sm text-ink-secondary leading-relaxed">
          Your account is active. To become an active volunteer, please submit your volunteer profile detailing your skills and availability.
        </p>
        <Button
          variant="primary"
          onClick={() => navigate('/applicant/apply')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Start Application Form
        </Button>
      </div>
    );
  }

  // Calculate timeline
  const isSubmitted = application.status !== 'draft';
  const isInReview = application.status === 'in_review' || isSubmitted;
  const isAccepted = application.status === 'accepted';
  const isPaid = payment?.status === 'confirmed';

  const timelineItems: TimelineItem[] = [
    {
      id: 'step-1',
      title: 'Email Verified & Account Created',
      timestamp: 'Completed',
      status: 'completed',
      description: 'Your login has been verified and confirmed.',
    },
    {
      id: 'step-2',
      title: 'Volunteer Application Submitted',
      timestamp: application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : undefined,
      status: isSubmitted ? 'completed' : 'current',
      description: isSubmitted
        ? 'Your profile, skills, and emergency contact details have been logged.'
        : 'Please fill and submit your application form.',
    },
    {
      id: 'step-3',
      title: 'Program Review Board Evaluation',
      status: isAccepted
        ? 'completed'
        : application.status === 'more_info_needed' || application.status === 'rejected'
        ? 'current'
        : isInReview
        ? 'current'
        : 'pending',
      description: isAccepted
        ? `Accepted on ${new Date(application.reviewedAt || '').toLocaleDateString()}. ${application.decisionReason || ''}`
        : application.status === 'more_info_needed'
        ? `Clarification needed: ${application.decisionReason}`
        : application.status === 'rejected'
        ? `Application declined: ${application.decisionReason}`
        : 'A program manager is evaluating regional capacity and skills alignment.',
    },
    {
      id: 'step-4',
      title: 'Telebirr Registration Fee Payment',
      status: isPaid ? 'completed' : isAccepted ? 'current' : 'pending',
      description: isPaid
        ? 'Registration fee of ETB 200 received and confirmed via Telebirr.'
        : isAccepted
        ? 'One-time registration fee of ETB 200 is due within 7 days to activate Member rank.'
        : 'Payment becomes available after application acceptance.',
    },
    {
      id: 'step-5',
      title: 'Activation & Member Credential Issued',
      status: isPaid ? 'completed' : 'pending',
      description: isPaid
        ? 'Account upgraded to Member rank. Volunteer ID and activity roster unlocked.'
        : 'Membership certificate and ID card issued immediately upon confirmed payment.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b-2 border-ink-primary pb-5 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <h1 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-ink-primary leading-none">
              Application Status
            </h1>
            <p className="font-sans text-xs sm:text-sm text-ink-secondary">
              Track your volunteer application review and Telebirr activation.
            </p>
          </div>
          <div>
            <StatusMark status={application.status} size="md" />
          </div>
        </div>
      </div>

      {/* Urgent Payment Banner if Accepted (Section 4 & 12.1) */}
      {isAccepted && !isPaid && (
        <div className="border-2 border-ink-primary bg-role-applicantLight p-6 space-y-4 shadow-ticket">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-sans text-xs uppercase font-bold text-ink-primary block">
                Next Step: Membership Activation
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-ink-primary leading-tight">
                Congratulations! Your Application Has Been Accepted
              </h2>
              <p className="font-sans text-xs sm:text-sm text-ink-secondary leading-relaxed max-w-2xl">
                Please complete your one-time registration fee of <strong className="font-mono text-ink-primary">ETB 200.00</strong> using Telebirr. Your payment window closes on{' '}
                <strong className="font-mono text-ink-primary">
                  {application.paymentDeadline
                    ? new Date(application.paymentDeadline).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'in 7 days'}
                </strong>.
              </p>
            </div>
            <Button
              variant="saffron"
              size="lg"
              onClick={() => navigate('/applicant/payment')}
              leftIcon={<Money className="w-5 h-5" weight="bold" />}
              className="shrink-0 font-bold"
            >
              Pay with Telebirr (ETB 200)
            </Button>
          </div>
        </div>
      )}

      {/* Clarification Alert if More Info Needed */}
      {application.status === 'more_info_needed' && (
        <div className="border border-civic-gold bg-civic-goldLight p-5 space-y-3">
          <div className="flex items-start gap-3">
            <Warning className="w-5 h-5 text-civic-gold shrink-0 mt-0.5" weight="bold" />
            <div className="space-y-1 text-xs font-sans text-ink-primary">
              <h3 className="font-bold">Clarification Requested by Program Manager</h3>
              <p className="leading-relaxed">{application.decisionReason}</p>
              <div className="pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/applicant/apply')}
                >
                  Update Application Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Two-Track Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline Column */}
        <div className="lg:col-span-2 border border-border bg-canvas-raised p-6 md:p-8 space-y-6">
          <h2 className="font-serif text-xl font-bold text-ink-primary border-b border-border pb-3">
            Recruitment Milestones
          </h2>
          <Timeline items={timelineItems} />
        </div>

        {/* Application Summary Box */}
        <div className="border border-border bg-canvas-subdued/40 p-6 space-y-5 h-fit">
          <h3 className="font-serif text-base font-bold text-ink-primary border-b border-border pb-3">
            Submission Details
          </h3>

          <div className="space-y-3 text-xs font-sans">
            <div>
              <span className="font-mono text-[10px] uppercase text-ink-tertiary block">
                Applicant Name
              </span>
              <span className="font-semibold text-ink-primary">
                {application.formData?.fullName || user?.username}
              </span>
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase text-ink-tertiary block">
                Primary Phone
              </span>
              <span className="font-mono text-ink-primary">
                {application.formData?.phone || '—'}
              </span>
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase text-ink-tertiary block">
                Operational Area
              </span>
              <span className="text-ink-primary">
                {application.formData?.area || '—'}
              </span>
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase text-ink-tertiary block">
                Skills Offered
              </span>
              <div className="flex flex-wrap gap-1 pt-1">
                {application.formData?.skills.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 bg-canvas-raised border border-border font-mono text-[11px] text-ink-secondary"
                  >
                    {s}
                  </span>
                )) || '—'}
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => navigate('/applicant/apply')}
              >
                Review Full Application Form
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
