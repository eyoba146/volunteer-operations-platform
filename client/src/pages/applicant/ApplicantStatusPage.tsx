import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Application, Payment } from '../../types';
import { PageShell, Button, StatusMark, Timeline, TimelineItem, Skeleton, SheetModal, TopoBackdrop, TrailMeter, ApplicantStage, Raised, Panel } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { 
  Money, 
  Clock, 
  Warning, 
  CheckCircle, 
  ArrowRight, 
  UserCircle,
  XCircle,
  PencilSimple
} from '@phosphor-icons/react';

export const ApplicantStatusPage: React.FC = () => {
  const { user } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number } | null>(null);

  const navigate = useNavigate();
  const toast = useToast();

  const loadData = async () => {
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

  useEffect(() => {
    loadData();
  }, [user]);

  // Live countdown calculation for payment deadline
  useEffect(() => {
    if (!application?.paymentDeadline || application.status !== 'accepted') {
      setTimeLeft(null);
      return;
    }

    const calculateTime = () => {
      const diff = new Date(application.paymentDeadline!).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft({ days, hours, minutes });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 60000);
    return () => clearInterval(timer);
  }, [application]);

  const handleWithdraw = async () => {
    if (!application) return;
    setIsWithdrawing(true);
    try {
      await api.withdrawApplication(application.id);
      toast.info('Your volunteer application has been withdrawn.');
      setShowWithdrawModal(false);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Could not withdraw application.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  if (isLoading) {
    return (
      <PageShell page="applicant/status" signature="TrailMeter, TopoBackdrop">
        <div className="space-y-6 max-w-3xl mx-auto">
          <Skeleton variant="text" className="h-10 w-1/3" />
          <Skeleton variant="rect" className="h-48" />
          <Skeleton variant="rect" className="h-64" />
        </div>
      </PageShell>
    );
  }

  if (!application) {
    return (
      <PageShell page="applicant/status" signature="TrailMeter, TopoBackdrop">
        <Raised className="p-8 md:p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 mx-auto rounded-[8px] bg-canvas-subdued flex items-center justify-center text-ink-primary">
            <UserCircle className="w-8 h-8" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink-primary">
            Start your application
          </h2>
          <p className="font-sans text-sm text-ink-secondary leading-relaxed">
            Your account is active. To become an active volunteer, please complete the enrollment form detailing your skills, region, and availability.
          </p>
          <div className="pt-2">
            <Button
              variant="primary"
              onClick={() => navigate('/applicant/apply')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Start application form
            </Button>
          </div>
        </Raised>
      </PageShell>
    );
  }

  // Calculate timeline states
  const isSubmitted = application.status !== 'draft';
  const isInReview = application.status === 'in_review' || isSubmitted;
  const isAccepted = application.status === 'accepted';
  const isPaid = payment?.status === 'confirmed';
  const isWithdrawn = application.status === 'withdrawn';
  const isRejected = application.status === 'rejected';

  // Map to ApplicantStage for TrailMeter
  let applicantStage: ApplicantStage = 'applied';
  if (isPaid || user?.role === 'volunteer') {
    applicantStage = 'volunteer';
  } else if (isAccepted) {
    applicantStage = 'accepted';
  } else if (isInReview) {
    applicantStage = 'reviewed';
  }

  const timelineItems: TimelineItem[] = [
    {
      id: 'step-1',
      title: 'Email verified and account created',
      timestamp: 'Completed',
      status: 'completed',
      description: 'Your login credentials and email address have been verified.',
    },
    {
      id: 'step-2',
      title: 'Volunteer application submitted',
      timestamp: application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : undefined,
      status: isSubmitted ? 'completed' : 'current',
      description: isSubmitted
        ? 'Your profile, skills, and emergency contact details have been submitted to admissions.'
        : 'Please fill and submit your application form.',
    },
    {
      id: 'step-3',
      title: 'Admissions review and evaluation',
      status: isAccepted || isPaid
        ? 'completed'
        : application.status === 'more_info_needed' || isRejected || isWithdrawn
        ? 'current'
        : isInReview
        ? 'current'
        : 'pending',
      description: isAccepted || isPaid
        ? `Accepted on ${new Date(application.reviewedAt || '').toLocaleDateString()}. ${application.decisionReason || ''}`
        : application.status === 'more_info_needed'
        ? `Clarification needed: ${application.decisionReason}`
        : isRejected
        ? `Application declined: ${application.decisionReason}`
        : isWithdrawn
        ? 'Application was withdrawn by you.'
        : 'A Program Manager is evaluating regional volunteer capacity and skill alignment.',
    },
    {
      id: 'step-4',
      title: 'Telebirr registration fee payment',
      status: isPaid ? 'completed' : isAccepted ? 'current' : 'pending',
      description: isPaid
        ? 'Registration fee of ETB 200 received and confirmed via Telebirr.'
        : isAccepted
        ? 'One-time registration fee of ETB 200 due within 7 days to activate Volunteer rank.'
        : 'Payment becomes available after application acceptance.',
    },
    {
      id: 'step-5',
      title: 'Activation and volunteer pass issued',
      status: isPaid ? 'completed' : 'pending',
      description: isPaid
        ? 'Account upgraded to Volunteer rank. Volunteer ID and activity roster unlocked.'
        : 'Volunteer ID pass and activity access issued immediately upon confirmed payment.',
    },
  ];

  return (
    <PageShell page="applicant/status" signature="TrailMeter, TopoBackdrop">
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-ink-primary leading-tight">
            Application status
          </h1>
          <p className="font-sans text-sm text-ink-secondary mt-1">
            Track your volunteer application review, admissions decisions, and Telebirr activation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusMark status={application.status} size="md" />
          {/* Withdraw option before payment */}
          {application.status !== 'withdrawn' && application.status !== 'rejected' && !isPaid && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowWithdrawModal(true)}
              leftIcon={<XCircle className="w-4 h-4 text-role-teamlead" />}
            >
              Withdraw
            </Button>
          )}
        </div>
      </div>

      {/* Applicant Trail Route Progress Signature */}
      <div className="rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] p-6 sm:p-8 space-y-4 relative overflow-hidden">
        <TopoBackdrop color="#D97706" opacity={0.06} />
        <div className="relative z-10">
          <div className="flex items-center justify-between pb-4">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-ink-primary">
                Your journey to volunteer activation
              </h2>
              <p className="font-sans text-sm text-ink-secondary mt-0.5">
                Follow your milestones from submission to active Volunteer rank.
              </p>
            </div>
            <span className="font-sans text-[13px] font-semibold text-role-applicant bg-[#FEF3C7] px-2.5 py-1 rounded-[6px]">
              {applicantStage === 'volunteer' ? 'Volunteer pass active' : 'Step ' + (['applied', 'reviewed', 'accepted', 'paid', 'volunteer'].indexOf(applicantStage) + 1) + ' of 5'}
            </span>
          </div>

          <TrailMeter
            mode="applicant"
            applicantStage={applicantStage}
            avatarUrl={user?.avatarUrl}
            userName={application.formData?.fullName || user?.username}
            variant="full"
            className="pt-10 pb-4"
          />
        </div>
      </div>

      {/* Urgent Payment Callout if Accepted */}
      {isAccepted && !isPaid && (
        <div className="bg-role-applicantLight rounded-[16px] p-6 md:p-8 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-sans text-[13px] font-bold tracking-tight text-ink-primary px-2.5 py-0.5 bg-role-applicant text-ink-primary font-bold rounded-[4px]">
                  Action required
                </span>
                {timeLeft && (
                  <span className="font-sans text-[13px] font-bold text-ink-primary flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" weight="bold" />
                    <span>
                      {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m remaining
                    </span>
                  </span>
                )}
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink-primary leading-tight">
                Your application has been accepted
              </h2>

              <p className="font-sans text-sm text-ink-secondary leading-relaxed max-w-2xl">
                Please complete your one-time registration fee of{' '}
                <strong className="font-bold text-ink-primary">ETB 200.00</strong> using Telebirr. Your payment window closes on{' '}
                <strong className="font-bold text-ink-primary">
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
              variant="telebirr"
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
        <div className="bg-role-applicantLight rounded-[10px] p-6 space-y-3">
          <div className="flex items-start gap-3">
            <Warning className="w-6 h-6 text-role-applicant shrink-0 mt-0.5" weight="bold" />
            <div className="space-y-2 text-sm font-sans text-ink-primary">
              <h3 className="font-display text-xl font-bold text-ink-primary">
                Clarification requested by admissions
              </h3>
              <p className="leading-relaxed bg-white p-3 rounded-[8px]">
                "{application.decisionReason}"
              </p>
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/applicant/apply')}
                  leftIcon={<PencilSimple className="w-4 h-4" />}
                >
                  Update application details
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection notice */}
      {isRejected && (
        <div className="bg-role-teamleadLight rounded-[10px] p-6 space-y-2">
          <div className="flex items-start gap-3">
            <XCircle className="w-6 h-6 text-role-teamlead shrink-0 mt-0.5" weight="bold" />
            <div className="space-y-1 text-sm font-sans text-ink-primary">
              <h3 className="font-display text-xl font-bold text-role-teamlead">
                Application not accepted at this time
              </h3>
              <p className="leading-relaxed">
                {application.decisionReason || 'Our regional capacity for the current cycle has been reached.'}
              </p>
              <p className="text-ink-secondary pt-1">
                You are welcome to re-apply during the next intake cycle.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawn notice */}
      {isWithdrawn && (
        <div className="bg-canvas-subdued rounded-[10px] p-6 space-y-2">
          <h3 className="font-display text-xl font-bold text-ink-secondary">
            Application withdrawn
          </h3>
          <p className="text-sm font-sans text-ink-secondary">
            You withdrew your volunteer application. Whenever you are ready to participate, you may fill out a new application form.
          </p>
          <div className="pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/applicant/apply')}
            >
              Start new application
            </Button>
          </div>
        </div>
      )}

      {/* Two-Track Layout: Timeline & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline Column */}
        <Raised className="lg:col-span-2 space-y-6">
          <h2 className="font-display text-2xl font-bold text-ink-primary pb-3">
            Recruitment milestones
          </h2>
          <Timeline items={timelineItems} />
        </Raised>

        {/* Application Summary Card */}
        <Panel className="space-y-5 h-fit">
          <div className="pb-3 flex items-center justify-between">
            <h3 className="font-display text-xl font-bold text-ink-primary">
              Submitted details
            </h3>
            <span className="font-sans text-[13px] text-ink-secondary font-medium">
              #{application.id.slice(-6)}
            </span>
          </div>

          <div className="space-y-4 text-sm font-sans">
            <div>
              <span className="text-[13px] font-bold text-ink-secondary block">
                Applicant name
              </span>
              <span className="text-sm font-bold text-ink-primary">
                {application.formData?.fullName || user?.username}
              </span>
            </div>

            <div>
              <span className="text-[13px] font-bold text-ink-secondary block">
                Mobile contact
              </span>
              <span className="text-sm font-medium text-ink-primary">
                {application.formData?.phone || '—'}
              </span>
            </div>

            <div>
              <span className="text-[13px] font-bold text-ink-secondary block">
                Community area
              </span>
              <span className="text-sm font-medium text-ink-primary">
                {application.formData?.area || '—'}
              </span>
            </div>

            <div>
              <span className="text-[13px] font-bold text-ink-secondary block">
                Skills offered
              </span>
              <div className="flex flex-wrap gap-1 pt-1">
                {application.formData?.skills.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 bg-white rounded-[6px] text-[13px] font-sans text-ink-primary shadow-none"
                  >
                    {s}
                  </span>
                )) || '—'}
              </div>
            </div>

            {application.formData?.emergencyContact && (
              <div className="pt-2">
                <span className="text-[13px] font-bold text-ink-secondary block">
                  Emergency contact
                </span>
                <span className="text-ink-secondary font-medium text-sm">
                  {application.formData.emergencyContact.name} ({application.formData.emergencyContact.relationship})
                </span>
              </div>
            )}

            <div className="pt-2">
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => navigate('/applicant/apply')}
              >
                Edit or view full form
              </Button>
            </div>
          </div>
        </Panel>
      </div>

      {/* Withdraw Confirmation Modal */}
      <SheetModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        title="Withdraw your application?"
        subtitle="You can re-apply in the future if your availability changes."
        mode="modal"
      >
        <div className="space-y-4 text-sm font-sans text-left">
          <p className="text-ink-secondary leading-relaxed">
            Withdrawing your application will remove your file from the current review queue. Any pending admissions decision will be cancelled.
          </p>

          <div className="p-3 bg-role-teamleadLight rounded-[8px] text-role-teamlead font-semibold">
            Are you sure you want to withdraw?
          </div>

          <div className="pt-3 flex items-center justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowWithdrawModal(false)}
            >
              Keep my application
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isWithdrawing}
              onClick={handleWithdraw}
            >
              Yes, withdraw application
            </Button>
          </div>
        </div>
      </SheetModal>
    </div>
    </PageShell>
  );
};
