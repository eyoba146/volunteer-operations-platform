import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Application, Payment, VolunteerProfile } from '../../types';
import { PageShell, Panel, Raised, Button, StatusMark, VolunteerCard, Skeleton, Input, TopoBackdrop, MomentOverlay } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { 
  Money, 
  CheckCircle, 
  DeviceMobile, 
  Clock, 
  Receipt, 
  ArrowsClockwise, 
  WarningCircle, 
  Copy, 
  ArrowRight,
  QrCode
} from '@phosphor-icons/react';

export const ApplicantPaymentPage: React.FC = () => {
  const { user, profile, refreshUser } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [phone, setPhone] = useState(user?.phone || '+251 91 234 5678');
  const [simulationState, setSimulationState] = useState<'idle' | 'waiting' | 'success' | 'delay' | 'failed' | 'duplicate'>('idle');
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number } | null>(null);
  const [showMoment, setShowMoment] = useState(false);

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
        if (pay && pay.status === 'confirmed') {
          setSimulationState('success');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Countdown timer calculation
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

  // Telebirr simulation trigger
  const handleStartPayment = async () => {
    if (!application || !user) return;
    setIsProcessing(true);
    setSimulationState('waiting');
    try {
      const initiated = await api.initiateTelebirrPayment(user.id, application.id, phone);
      setPayment(initiated);
    } catch (err: any) {
      toast.error(err.message || 'Payment initiation failed.');
      setSimulationState('idle');
    } finally {
      setIsProcessing(false);
    }
  };

  // Outcome simulator dispatcher
  const handleSimulateOutcome = async (outcome: 'confirm' | 'delay' | 'fail' | 'duplicate') => {
    if (!payment) return;
    setIsProcessing(true);

    try {
      if (outcome === 'confirm') {
        const updated = await api.processTelebirrOutcome(payment.id, 'confirm');
        setPayment(updated);
        await refreshUser();
        setSimulationState('success');
        setShowMoment(true);
        toast.success('Telebirr payment confirmed! Your member pass is active.');
      } else if (outcome === 'delay') {
        const updated = await api.processTelebirrOutcome(payment.id, 'delay');
        setPayment(updated);
        setSimulationState('delay');
        toast.info('Payment received and is currently being verified.');
      } else if (outcome === 'fail') {
        const updated = await api.processTelebirrOutcome(payment.id, 'fail');
        setPayment(updated);
        setSimulationState('failed');
        toast.error('Telebirr payment cancelled on mobile device.');
      } else if (outcome === 'duplicate') {
        await api.processTelebirrOutcome(payment.id, 'confirm');
        await refreshUser();
        setSimulationState('duplicate');
        toast.info('Duplicate payment detected. System routed to finance for refund.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <Skeleton variant="text" className="h-10 w-1/3" />
        <Skeleton variant="rect" className="h-64" />
      </div>
    );
  }

  const activeProfile: VolunteerProfile = profile || {
    userId: user?.id || 'temp',
    fullName: application?.formData?.fullName || user?.username || 'Hana Tesfaye',
    phone: phone,
    dateOfBirth: '2001-01-01',
    area: application?.formData?.area || 'Bole, Addis Ababa',
    bio: 'Active volunteer',
    rank: 'member',
    volunteerNumber: 'VTS-AA-2026-084',
    photoUrl: application?.formData?.photoUrl || user?.avatarUrl,
    skills: application?.formData?.skills || ['Community outreach'],
    availability: ['Saturday mornings'],
    languages: ['Amharic', 'English'],
    emergencyContact: {
      name: 'Tesfaye Wolde',
      relationship: 'Parent',
      phone: '+251 91 123 4567',
    },
  };

  // SUCCESS / UPGRADE CELEBRATION MOMENT
  if (simulationState === 'success') {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
        {/* Celebration Banner */}
        <MomentOverlay
          show={showMoment}
          onDismiss={() => setShowMoment(false)}
          type="payment"
          title="Welcome to the trail!"
          subtitle="Your registration fee is confirmed. You are now an active Member."
          primaryActionLabel="Explore activities →"
          onPrimaryAction={() => {
            setShowMoment(false);
            navigate('/volunteer/activities');
          }}
        />

        <div className="relative overflow-hidden rounded-[16px] bg-[#F7F8FA] p-8 text-center space-y-3 border-none">
          <TopoBackdrop color="#16A34A" opacity={0.08} />
          <div className="relative z-10 space-y-3">
            <div className="w-16 h-16 mx-auto bg-role-volunteer text-white rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10" weight="fill" />
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink-primary tracking-tight">
              Welcome to the trail!
            </h1>
            <p className="font-sans text-base text-ink-secondary max-w-lg mx-auto leading-relaxed">
              Your registration fee of <strong className="font-bold text-ink-primary">ETB 200.00</strong> has been confirmed. You are now an active <strong className="text-role-volunteer">Member</strong> of the Volunteer Tracking System.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/volunteer/home')}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Open my volunteer space
              </Button>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Volunteer Pass Card & Receipt */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left: Volunteer ID Card */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#EDEFF2] pb-2">
              <h2 className="font-display text-2xl font-bold text-ink-primary">
                Your volunteer pass
              </h2>
              <span className="font-sans text-[13px] font-bold text-role-volunteer">
                Issued today
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
          <div className="relative overflow-hidden bg-white p-6 md:p-8 space-y-5 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] rounded-[16px] text-left border-none">
            <div className="flex items-center justify-between border-b border-[#EDEFF2] pb-3">
              <div>
                <span className="font-display text-2xl font-bold text-ink-primary block leading-none">
                  Payment receipt
                </span>
                <span className="font-sans text-[13px] font-bold text-role-volunteer">
                  Telebirr payment voucher
                </span>
              </div>
              <Receipt className="w-8 h-8 text-ink-primary" />
            </div>

            <div className="space-y-3 font-sans text-sm border-b border-[#EDEFF2] pb-4">
              <div data-allow="perforation" className="flex justify-between py-1 border-b border-dashed border-[#EDEFF2]">
                <span className="text-ink-secondary">Receipt number:</span>
                <span className="font-bold text-ink-primary">{payment?.receiptNumber || 'REC-2026-98124'}</span>
              </div>
              <div data-allow="perforation" className="flex justify-between py-1 border-b border-dashed border-[#EDEFF2]">
                <span className="text-ink-secondary">Telebirr reference:</span>
                <span className="text-ink-primary font-bold">{payment?.telebirrReference || 'TB-2026-918204'}</span>
              </div>
              <div data-allow="perforation" className="flex justify-between py-1 border-b border-dashed border-[#EDEFF2]">
                <span className="text-ink-secondary">Payer name:</span>
                <span className="text-ink-primary font-medium">{payment?.payerName || activeProfile.fullName}</span>
              </div>
              <div data-allow="perforation" className="flex justify-between py-1 border-b border-dashed border-[#EDEFF2]">
                <span className="text-ink-secondary">Payer mobile:</span>
                <span className="text-ink-primary font-medium">{payment?.payerPhone || phone}</span>
              </div>
              <div data-allow="perforation" className="flex justify-between py-1 border-b border-dashed border-[#EDEFF2]">
                <span className="text-ink-secondary">Amount paid:</span>
                <span className="font-bold text-ink-primary">ETB 200.00</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-ink-secondary">Payment date:</span>
                <span className="text-ink-primary font-medium">{new Date().toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3 bg-canvas-subdued border-none bg-[#F1F3F6] rounded-[6px] text-sm font-sans text-ink-secondary">
              A copy of this payment receipt and your volunteer onboarding instructions have been sent to your email.
            </div>

            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => window.print()}
            >
              Print or save receipt
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageShell page="applicant/payment" signature="MomentOverlay, TopoBackdrop">
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-[#EDEFF2] pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-ink-primary leading-tight">
            Registration fee payment
          </h1>
          <p className="font-sans text-sm text-ink-secondary mt-1">
            Ethio Telecom Telebirr integration • Activate your member pass on the trail.
          </p>
        </div>
        {timeLeft && (
          <div className="bg-amber-100 rounded-[8px] px-3 py-1.5 flex items-center gap-2 border-none">
            <Clock className="w-4 h-4 text-role-applicant" weight="bold" />
            <span className="font-sans text-[13px] font-bold text-ink-primary">
              Deadline: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m left
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Left Column: What It Covers */}
        <div className="md:col-span-2 space-y-5">
          <div className="rounded-[16px] bg-[#F7F8FA] p-6 space-y-5 border-none">
            <div className="border-b border-[#EDEFF2] pb-3">
              <span className="font-sans text-[13px] font-bold text-role-applicant block">
                One-time activation fee
              </span>
              <h3 className="font-display text-2xl font-bold text-ink-primary">
                Membership fee
              </h3>
            </div>

            <div className="space-y-1">
              <span className="font-sans text-sm font-semibold text-ink-secondary">Total amount due</span>
              <div className="font-display text-4xl sm:text-5xl font-black text-ink-primary leading-none">
                ETB 200<span className="text-xl font-sans text-ink-secondary font-normal">.00</span>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-[#EDEFF2] text-sm font-sans text-ink-secondary leading-relaxed">
              <span className="font-bold text-ink-primary block">What this covers:</span>
              <ul className="space-y-1.5 list-disc list-inside">
                <li>Volunteer ID pass with verifiable QR code</li>
                <li>Access to open field activity rosters and check-in codes</li>
                <li>Personal service hours recording and verification</li>
                <li>Digital certificate of membership upon activation</li>
              </ul>
            </div>

            <div className="p-3 bg-canvas-subdued border-none bg-[#F1F3F6] rounded-[6px] text-[13px] font-sans text-ink-secondary">
              Merchant: Volunteer Tracking System<br />
              Shortcode: 884120
            </div>
          </div>
        </div>

        {/* Right Column: Telebirr Payment Rail */}
        <div className="md:col-span-3 space-y-6">
          <div className="rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] p-6 md:p-8 space-y-6 border-none">
            {/* Telebirr Brand Header */}
            <div className="flex items-center justify-between border-b border-[#EDEFF2] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[8px] bg-role-applicant text-white flex items-center justify-center font-display text-2xl font-black">
                  tb
                </div>
                <div>
                  <h4 className="font-display text-2xl font-bold text-ink-primary leading-tight">
                    Telebirr express pay
                  </h4>
                  <span className="text-sm font-sans text-ink-secondary block">
                    Ethio Telecom mobile wallet payment
                  </span>
                </div>
              </div>
              <StatusMark status={payment?.status || 'waiting'} size="sm" />
            </div>

            {/* Edge Case: Delay / Checking Payment */}
            {simulationState === 'delay' && (
              <div className="p-5 bg-amber-50 rounded-[8px] border-none space-y-3 text-sm font-sans text-ink-primary">
                <div className="flex items-center gap-2 font-bold text-ink-primary">
                  <Clock className="w-5 h-5 text-role-applicant animate-spin" weight="bold" />
                  <span className="text-base font-bold">We are checking your payment</span>
                </div>
                <p className="leading-relaxed">
                  This usually takes less than a minute. Your transaction (Ref: <strong className="font-bold">{payment?.telebirrReference}</strong>) has been queued for verification. If network delay occurs, Finance will resolve it manually.
                </p>
                <div className="pt-2 flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleSimulateOutcome('confirm')}
                  >
                    Confirm now (simulate telecom callback)
                  </Button>
                </div>
              </div>
            )}

            {/* Edge Case: Failed / Declined */}
            {simulationState === 'failed' && (
              <div className="p-5 bg-rose-50 rounded-[8px] border-none space-y-3 text-sm font-sans text-ink-primary">
                <div className="flex items-center gap-2 font-bold text-role-teamlead">
                  <WarningCircle className="w-5 h-5 shrink-0" weight="bold" />
                  <span className="text-base font-bold">Payment could not be completed</span>
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
                    Try again
                  </Button>
                </div>
              </div>
            )}

            {/* Edge Case: Duplicate Payment */}
            {simulationState === 'duplicate' && (
              <div className="p-5 bg-rose-50 rounded-[8px] border-none space-y-3 text-sm font-sans text-ink-primary">
                <div className="flex items-center gap-2 font-bold text-role-teamlead">
                  <WarningCircle className="w-5 h-5 shrink-0" weight="bold" />
                  <span className="text-base font-bold">Duplicate payment flagged</span>
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
                    View activated pass
                  </Button>
                </div>
              </div>
            )}

            {/* Initial Phone Input & Start Payment */}
            {simulationState === 'idle' && (
              <div className="space-y-5">
                <Input
                  label="Registered Telebirr mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+251 91 123 4567"
                  leftAddon={<DeviceMobile className="w-4 h-4" />}
                  hint="The 09... number where the USSD push confirmation prompt will appear."
                  required
                />

                <div className="p-4 border-none bg-[#F1F3F6] rounded-[8px] bg-canvas-subdued flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-display text-lg font-bold text-ink-primary block leading-none">
                      Telebirr QR option
                    </span>
                    <p className="font-sans text-sm text-ink-secondary">
                      Scan with your Telebirr SuperApp camera to authorize payment directly.
                    </p>
                  </div>
                  <div className="w-16 h-16 border-none bg-[#F1F3F6] rounded-[6px] bg-white p-1 flex items-center justify-center shrink-0">
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
                <div className="w-16 h-16 mx-auto border-none bg-[#F1F3F6] rounded-full bg-role-applicantLight flex items-center justify-center text-ink-primary">
                  <DeviceMobile className="w-8 h-8 animate-bounce text-role-applicant" weight="bold" />
                </div>

                <div className="space-y-2">
                  <h4 className="font-display text-2xl sm:text-3xl font-bold text-ink-primary">
                    Authorizing on your phone
                  </h4>
                  <p className="font-sans text-sm text-ink-secondary max-w-sm mx-auto leading-relaxed">
                    A USSD push notification has been sent to <strong className="font-bold text-ink-primary">{phone}</strong>. Enter your Telebirr PIN on your handset to approve the ETB 200.00 fee.
                  </p>
                </div>

                {/* Telebirr Edge Case Simulation Control Panel */}
                <div className="p-5 border-none bg-[#F1F3F6] rounded-[8px] bg-canvas-subdued text-left space-y-4">
                  <div className="flex items-center justify-between border-b border-[#EDEFF2] pb-2">
                    <span className="font-display text-lg font-bold text-ink-primary">
                      Demo Telebirr gateway controls
                    </span>
                    <span className="font-sans text-[13px] text-ink-secondary">
                      Section 4.2 edge cases
                    </span>
                  </div>

                  <p className="text-sm font-sans text-ink-secondary leading-relaxed">
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
                      1. Succeed (activate)
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      isLoading={isProcessing}
                      onClick={() => handleSimulateOutcome('delay')}
                      leftIcon={<Clock className="w-4 h-4" />}
                    >
                      2. Delay (needs review)
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      isLoading={isProcessing}
                      onClick={() => handleSimulateOutcome('fail')}
                      leftIcon={<WarningCircle className="w-4 h-4" />}
                    >
                      3. Handset cancel
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      isLoading={isProcessing}
                      onClick={() => handleSimulateOutcome('duplicate')}
                      leftIcon={<Copy className="w-4 h-4" />}
                    >
                      4. Paid twice (flag refund)
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </PageShell>
  );
};
