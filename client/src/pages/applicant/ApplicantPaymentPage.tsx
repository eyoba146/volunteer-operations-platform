import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Payment, Application } from '../../types';
import { Button, Input, StatusMark, Skeleton, VolunteerCard } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { 
  Money, 
  QrCode, 
  DeviceMobile, 
  CheckCircle, 
  Warning, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Receipt,
  ArrowsClockwise,
  WarningCircle,
  Copy
} from '@phosphor-icons/react';

export const ApplicantPaymentPage: React.FC = () => {
  const { user, profile, refreshUser } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [phone, setPhone] = useState('+251 91 123 4567');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulationState, setSimulationState] = useState<'idle' | 'waiting' | 'success' | 'delay' | 'failed' | 'duplicate'>('idle');
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number } | null>(null);

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      if (!application && !payment) setIsLoading(true);
      try {
        const app = await api.getMyApplication(user.id);
        setApplication(app);
        if (app) {
          const pay = await api.getPaymentForApplication(app.id);
          setPayment(pay);
          if (pay?.payerPhone) setPhone(pay.payerPhone);
          if (pay?.status === 'confirmed' || user.role === 'volunteer') {
            setSimulationState('success');
          } else if (pay?.status === 'needs_review') {
            setSimulationState('delay');
          } else if (pay?.status === 'failed') {
            setSimulationState('failed');
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user]);

  // Live countdown timer for payment window
  useEffect(() => {
    if (!application?.paymentDeadline || application.status !== 'accepted') {
      setTimeLeft(null);
      return;
    }

    const updateTimer = () => {
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

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [application]);

  const handleStartPayment = async () => {
    if (!user || !application) return;
    setIsProcessing(true);
    try {
      const newPayment = await api.initiateTelebirrPayment(user.id, application.id, phone);
      setPayment(newPayment);
      setSimulationState('waiting');
      toast.info('Payment request sent to Telebirr. Please authorize on your phone.', 'Telebirr USSD Push');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSimulateOutcome = async (outcome: 'confirm' | 'delay' | 'fail' | 'duplicate') => {
    if (!payment || !user || !application) return;
    setIsProcessing(true);
    try {
      if (outcome === 'duplicate') {
        await api.simulateDuplicatePayment(user.id, application.id);
        setSimulationState('duplicate');
        toast.warning('Duplicate payment detected and queued for Finance review and refund.');
        return;
      }

      const updated = await api.processTelebirrOutcome(payment.id, outcome);
      setPayment(updated);

      if (outcome === 'confirm') {
        setSimulationState('success');
        await refreshUser();
        toast.success('Telebirr payment confirmed! Your Member rank is active.');
      } else if (outcome === 'delay') {
        setSimulationState('delay');
        toast.warning('Payment confirmation is taking longer than usual. Moved to review desk.');
      } else {
        setSimulationState('failed');
        toast.error('The payment authorization failed or was declined on handset.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <Skeleton variant="text" className="h-10 w-1/3" />
        <Skeleton variant="rect" className="h-96" />
      </div>
    );
  }

  // Edge case: acceptance window expired
  if (application?.status === 'expired') {
    return (
      <div className="max-w-xl mx-auto border-4 border-role-teamlead bg-white p-8 md:p-10 shadow-ticket space-y-5 text-center">
        <div className="w-16 h-16 mx-auto bg-role-teamleadLight border-2 border-role-teamlead text-role-teamlead flex items-center justify-center">
          <Clock className="w-8 h-8" weight="bold" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-black text-ink-primary">
            Payment Window Expired
          </h1>
          <p className="font-sans text-xs sm:text-sm text-ink-secondary leading-relaxed">
            The 7-day payment window for your volunteer application has closed. An Admissions Manager can reopen your application with one action if you wish to complete your registration.
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-3">
          <Button
            variant="secondary"
            onClick={() => navigate('/applicant/status')}
          >
            Back to Application Status
          </Button>
        </div>
      </div>
    );
  }

  // Success Moment: Immediate Member Activation, ID Card with QR, Receipt
  if (simulationState === 'success' || payment?.status === 'confirmed' || user?.role === 'volunteer') {
    const activeProfile = profile || {
      userId: user?.id || 'usr-hana',
      fullName: application?.formData?.fullName || user?.username || 'Hana Tesfaye',
      phone: phone,
      dateOfBirth: application?.formData?.dateOfBirth || '2001-04-14',
      area: application?.formData?.area || 'Bole, Addis Ababa',
      bio: application?.formData?.motivation || 'Active community volunteer.',
      skills: application?.formData?.skills || ['Community Outreach', 'First Aid'],
      availability: application?.formData?.availability || ['Weekends'],
      languages: application?.formData?.languages || ['Amharic', 'English'],
      emergencyContact: application?.formData?.emergencyContact || { name: 'Emergency Contact', relationship: 'Parent', phone: '+251 91 100 0000' },
      rank: 'member' as const,
      memberSince: new Date().toISOString().slice(0, 10),
      volunteerNumber: 'VTS-AA-2026-0881',
      photoUrl: application?.formData?.photoUrl,
    };

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
        {/* Celebration Banner */}
        <div className="border-4 border-role-volunteer bg-role-volunteerLight p-8 text-center space-y-4 shadow-float">
          <div className="w-16 h-16 mx-auto bg-white border-2 border-role-volunteer text-role-volunteer flex items-center justify-center">
            <CheckCircle className="w-10 h-10" weight="fill" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <span className="font-display text-lg font-black tracking-wide bg-role-volunteer text-white px-3 py-1 inline-block">
              Payment Confirmed • Member Rank Unlocked
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-ink-primary leading-none">
              Welcome to the Volunteer Corps!
            </h1>
            <p className="font-sans text-xs sm:text-sm text-ink-secondary leading-relaxed">
              Your one-time registration fee of <strong className="font-mono text-ink-primary">ETB 200.00</strong> was received via Telebirr. Your account is now active with Member rank on the Trail.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="grass"
              size="lg"
              onClick={() => navigate('/volunteer')}
              rightIcon={<ArrowRight className="w-5 h-5" weight="bold" />}
            >
              Enter Volunteer Dashboard
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/volunteer/activities')}
            >
              Browse Upcoming Activities
            </Button>
          </div>
        </div>

        {/* Two-Column Grid: Volunteer Pass Card & Receipt */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left: Volunteer ID Card */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h2 className="font-display text-2xl font-black text-ink-primary">
                Your Volunteer Pass
              </h2>
              <span className="font-sans text-xs font-bold text-role-volunteer">
                Issued Today
              </span>
            </div>
            <VolunteerCard
              profile={activeProfile}
              approvedHours={0}
              completedActivities={0}
              className="mx-auto"
            />
          </div>

          {/* Right: Payment Receipt Pass */}
          <div className="border-4 border-ink-primary bg-white p-6 md:p-8 space-y-5 shadow-ticket text-left">
            <div className="flex items-center justify-between border-b-2 border-ink-primary pb-3">
              <div>
                <span className="font-display text-2xl font-black text-ink-primary block leading-none">
                  Payment Receipt
                </span>
                <span className="font-sans text-xs font-bold text-role-volunteer">
                  Official Telebirr Voucher
                </span>
              </div>
              <Receipt className="w-8 h-8 text-ink-primary" />
            </div>

            <div className="space-y-3 font-mono text-xs border-b border-border pb-4">
              <div className="flex justify-between py-1 border-b border-dashed border-border">
                <span className="text-ink-tertiary">Receipt Number:</span>
                <span className="font-bold text-ink-primary">{payment?.receiptNumber || 'REC-2026-98124'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-border">
                <span className="text-ink-tertiary">Telebirr Reference:</span>
                <span className="text-ink-primary font-bold">{payment?.telebirrReference || 'TB-2026-918204'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-border">
                <span className="text-ink-tertiary">Payer Name:</span>
                <span className="text-ink-primary">{payment?.payerName || activeProfile.fullName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-border">
                <span className="text-ink-tertiary">Payer Mobile:</span>
                <span className="text-ink-primary">{payment?.payerPhone || phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-border">
                <span className="text-ink-tertiary">Amount Paid:</span>
                <span className="font-bold text-ink-primary">ETB 200.00</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-ink-tertiary">Payment Date:</span>
                <span className="text-ink-primary">{new Date().toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3 bg-canvas-subdued border border-border text-[13px] font-sans text-ink-secondary">
              A copy of this payment receipt and your volunteer onboarding instructions have been sent to your email.
            </div>

            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => window.print()}
            >
              Print / Save Receipt
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b-2 border-ink-primary pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight text-ink-primary leading-none">
            Registration Fee Payment
          </h1>
          <p className="font-sans text-xs sm:text-sm text-ink-secondary mt-1">
            Ethio Telecom Telebirr Integration • Activate your Member rank on the Trail.
          </p>
        </div>
        {timeLeft && (
          <div className="bg-role-applicantLight border-2 border-role-applicant px-3 py-1.5 flex items-center gap-2">
            <Clock className="w-4 h-4 text-role-applicant" weight="bold" />
            <span className="font-mono text-xs font-bold text-ink-primary">
              Deadline: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m left
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Left Column: What It Covers */}
        <div className="md:col-span-2 space-y-5">
          <div className="border border-[#D5DAE1] bg-white rounded-[10px] p-6 space-y-5">
            <div className="border-b border-[#D5DAE1] pb-3">
              <span className="font-sans text-xs font-bold text-role-applicant block">
                One-time activation fee
              </span>
              <h3 className="font-display text-2xl font-bold text-ink-primary">
                Membership fee
              </h3>
            </div>

            <div className="space-y-1">
              <span className="font-sans text-xs font-semibold text-ink-secondary">Total amount due</span>
              <div className="font-display text-5xl font-black text-ink-primary leading-none">
                ETB 200<span className="text-xl font-sans text-ink-secondary font-normal">.00</span>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-[#D5DAE1] text-[13px] font-sans text-ink-secondary leading-relaxed">
              <span className="font-bold text-ink-primary block">What this covers:</span>
              <ul className="space-y-1.5 list-disc list-inside">
                <li>Volunteer ID pass with verifiable QR code</li>
                <li>Access to open field activity rosters and check-in codes</li>
                <li>Personal service hours recording and verification</li>
                <li>Digital certificate of membership upon activation</li>
              </ul>
            </div>

            <div className="p-3 bg-canvas-subdued border border-border text-[13px] font-mono text-ink-tertiary">
              Merchant: VTS Volunteer Corps<br />
              Shortcode: 884120
            </div>
          </div>
        </div>

        {/* Right Column: Telebirr Payment Rail */}
        <div className="md:col-span-3 space-y-6">
          <div className="border-4 border-ink-primary bg-white p-6 md:p-8 space-y-6 shadow-ticket">
            {/* Telebirr Brand Header */}
            <div className="flex items-center justify-between border-b-2 border-ink-primary pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-role-applicant text-white flex items-center justify-center font-display text-2xl font-black">
                  tb
                </div>
                <div>
                  <h4 className="font-display text-2xl font-black text-ink-primary leading-tight">
                    Telebirr Express Pay
                  </h4>
                  <span className="text-xs font-sans text-ink-secondary block">
                    Ethio Telecom mobile wallet payment
                  </span>
                </div>
              </div>
              <StatusMark status={payment?.status || 'waiting'} size="sm" />
            </div>

            {/* Edge Case: Delay / Checking Payment */}
            {simulationState === 'delay' && (
              <div className="p-5 border-2 border-role-applicant bg-role-applicantLight space-y-3 text-xs font-sans text-ink-primary">
                <div className="flex items-center gap-2 font-bold text-ink-primary">
                  <Clock className="w-5 h-5 text-role-applicant animate-spin" weight="bold" />
                  <span className="text-sm font-display font-black">We are checking your payment</span>
                </div>
                <p className="leading-relaxed">
                  This usually takes less than a minute. Your transaction (Ref: <strong className="font-mono">{payment?.telebirrReference}</strong>) has been queued for verification. If network delay occurs, Finance will resolve it manually.
                </p>
                <div className="pt-2 flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleSimulateOutcome('confirm')}
                  >
                    Confirm Now (Simulate Telecom Callback)
                  </Button>
                </div>
              </div>
            )}

            {/* Edge Case: Failed / Declined */}
            {simulationState === 'failed' && (
              <div className="p-5 border-2 border-role-teamlead bg-role-teamleadLight space-y-3 text-xs font-sans text-ink-primary">
                <div className="flex items-center gap-2 font-bold text-role-teamlead">
                  <WarningCircle className="w-5 h-5 shrink-0" weight="bold" />
                  <span className="text-sm font-display font-black">Payment Could Not Be Completed</span>
                </div>
                <p className="leading-relaxed">
                  The payment request timed out or was cancelled on your mobile handset. Please verify that your Telebirr wallet has sufficient funds (ETB 200.00) and try again.
                </p>
                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setSimulationState('idle')}
                    leftIcon={<ArrowsClockwise className="w-4 h-4" />}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            {/* Edge Case: Duplicate Payment */}
            {simulationState === 'duplicate' && (
              <div className="p-5 border-2 border-role-teamlead bg-role-teamleadLight space-y-3 text-xs font-sans text-ink-primary">
                <div className="flex items-center gap-2 font-bold text-role-teamlead">
                  <WarningCircle className="w-5 h-5 shrink-0" weight="bold" />
                  <span className="text-sm font-display font-black">Duplicate Payment Flagged</span>
                </div>
                <p className="leading-relaxed">
                  A duplicate payment of ETB 200.00 was detected. The system has confirmed your primary membership activation and automatically routed the secondary transaction to Finance for an immediate refund.
                </p>
                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setSimulationState('success')}
                  >
                    View Activated Pass
                  </Button>
                </div>
              </div>
            )}

            {/* Initial Phone Input & Start Payment */}
            {simulationState === 'idle' && (
              <div className="space-y-5">
                <Input
                  label="Registered Telebirr Mobile Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+251 91 123 4567"
                  leftAddon={<DeviceMobile className="w-4 h-4" />}
                  hint="The 09... number where the USSD push confirmation prompt will appear."
                  required
                />

                <div className="p-4 border-2 border-border bg-canvas-subdued flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-display text-lg font-black text-ink-primary block leading-none">
                      Telebirr QR Option
                    </span>
                    <p className="font-sans text-xs text-ink-secondary">
                      Scan with your Telebirr SuperApp camera to authorize payment directly.
                    </p>
                  </div>
                  <div className="w-16 h-16 border-2 border-ink-primary bg-white p-1 flex items-center justify-center shrink-0">
                    <QrCode className="w-full h-full text-ink-primary" />
                  </div>
                </div>

                <Button
                  variant="telebirr"
                  size="xl"
                  className="w-full font-bold"
                  isLoading={isProcessing}
                  onClick={handleStartPayment}
                  leftIcon={<Money className="w-6 h-6" weight="bold" />}
                >
                  Pay with Telebirr (ETB 200.00)
                </Button>
              </div>
            )}

            {/* In-Flight USSD Prompt Simulation */}
            {simulationState === 'waiting' && (
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 mx-auto border-4 border-ink-primary bg-role-applicantLight flex items-center justify-center text-ink-primary">
                  <DeviceMobile className="w-8 h-8 animate-bounce" weight="bold" />
                </div>

                <div className="space-y-2">
                  <h4 className="font-display text-3xl font-black text-ink-primary">
                    Authorizing on Your Phone
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-ink-secondary max-w-sm mx-auto leading-relaxed">
                    A USSD push notification has been sent to <strong className="font-mono text-ink-primary">{phone}</strong>. Enter your Telebirr PIN on your handset to approve the ETB 200.00 fee.
                  </p>
                </div>

                {/* Telebirr Edge Case Simulation Control Panel (Section 12.2 & 4.2) */}
                <div className="p-5 border-2 border-dashed border-ink-primary bg-canvas-subdued text-left space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="font-display text-lg font-black text-ink-primary">
                      Demo Telebirr Gateway Controls
                    </span>
                    <span className="font-mono text-[13px] text-ink-tertiary">
                      Section 4.2 Edge Cases
                    </span>
                  </div>

                  <p className="text-xs font-sans text-ink-secondary leading-relaxed">
                    Choose an outcome to demonstrate the system’s handling of real telecom scenarios:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <Button
                      variant="grass"
                      size="sm"
                      isLoading={isProcessing}
                      onClick={() => handleSimulateOutcome('confirm')}
                      leftIcon={<CheckCircle className="w-4 h-4" weight="bold" />}
                    >
                      1. Succeed (Activate)
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      isLoading={isProcessing}
                      onClick={() => handleSimulateOutcome('delay')}
                      leftIcon={<Clock className="w-4 h-4" />}
                    >
                      2. Delay (Needs Review)
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      isLoading={isProcessing}
                      onClick={() => handleSimulateOutcome('fail')}
                      leftIcon={<WarningCircle className="w-4 h-4" />}
                    >
                      3. Handset Fail / Cancel
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      isLoading={isProcessing}
                      onClick={() => handleSimulateOutcome('duplicate')}
                      leftIcon={<Copy className="w-4 h-4" />}
                    >
                      4. Paid Twice (Flag Refund)
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
