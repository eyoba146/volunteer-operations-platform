import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Payment, Application } from '../../types';
import { Button, Input, StatusMark, Skeleton } from '../../components/ui';
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
  Receipt
} from '@phosphor-icons/react';

export const ApplicantPaymentPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [phone, setPhone] = useState('+251 91 123 4567');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulationState, setSimulationState] = useState<'idle' | 'waiting' | 'success' | 'delay' | 'failed'>('idle');

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
          if (pay?.status === 'confirmed') setSimulationState('success');
          else if (pay?.status === 'needs_review') setSimulationState('delay');
          else if (pay?.status === 'failed') setSimulationState('failed');
        }
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user]);

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

  const handleSimulateOutcome = async (outcome: 'confirm' | 'delay' | 'fail') => {
    if (!payment) return;
    setIsProcessing(true);
    try {
      const updated = await api.processTelebirrOutcome(payment.id, outcome);
      setPayment(updated);

      if (outcome === 'confirm') {
        setSimulationState('success');
        await refreshUser();
        toast.success('Telebirr payment confirmed! Your Member rank is active.');
      } else if (outcome === 'delay') {
        setSimulationState('delay');
        toast.warning('Payment is taking longer than expected. Moved to Finance review queue.');
      } else {
        setSimulationState('failed');
        toast.error('The payment authorization failed or was cancelled by the user.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="rect" className="h-64" />
      </div>
    );
  }

  // If applicant is already activated as Member or payment confirmed!
  if (simulationState === 'success' || payment?.status === 'confirmed') {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-[28px] shadow-soft border border-slate-100 p-8 md:p-10 space-y-6 text-center animate-in zoom-in-95 duration-200">
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <CheckCircle className="w-8 h-8" weight="fill" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Payment Confirmed • Welcome to the Trail
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            You are now an Active Member!
          </h1>
          <p className="font-sans text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
            Your registration fee of <strong className="font-semibold text-slate-900">ETB 200.00</strong> was received via Telebirr. Your volunteer ID pass and upcoming activities are now unlocked.
          </p>
        </div>

        {/* Receipt Box */}
        <div className="bg-slate-50 rounded-[18px] border border-slate-100 p-5 space-y-2.5 text-xs text-left">
          <div className="flex justify-between">
            <span className="text-slate-400">Receipt Number:</span>
            <span className="font-semibold font-mono text-slate-900">{payment?.receiptNumber || 'REC-2026-00084'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Telebirr Ref:</span>
            <span className="font-mono text-slate-900">{payment?.telebirrReference}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Amount Paid:</span>
            <span className="font-semibold text-slate-900">ETB 200.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Rank Unlocked:</span>
            <span className="font-semibold text-emerald-600">Member (Basecamp)</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            onClick={() => navigate('/volunteer/id-card')}
            leftIcon={<Receipt className="w-4 h-4" weight="bold" />}
          >
            View My Volunteer Pass
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/volunteer/activities')}
            rightIcon={<ArrowRight className="w-4 h-4" weight="bold" />}
          >
            Browse Volunteer Activities
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b-2 border-ink-primary pb-5 space-y-1">
        <h1 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-ink-primary leading-none">
          Volunteer Registration Fee
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink-secondary">
          Ethio Telecom Telebirr Integration • One-time activation fee of ETB 200.00
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Left Column: What It Covers */}
        <div className="md:col-span-2 space-y-5">
          <div className="bg-white rounded-[24px] shadow-soft border border-slate-100 p-6 space-y-4">
            <h3 className="font-display text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
              Registration Fee
            </h3>

            <div className="space-y-1">
              <span className="font-sans text-xs text-slate-400">Total Amount Due</span>
              <div className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900 leading-none">
                ETB 200<span className="text-xl font-sans text-slate-400 font-normal">.00</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-sans text-slate-500 leading-relaxed">
              <span className="font-semibold text-slate-800 block">What this covers:</span>
              <ul className="space-y-1.5 list-disc list-inside">
                <li>Printable Volunteer ID Pass with verification code</li>
                <li>Duty insurance coverage on field assignments</li>
                <li>Access to regional activity rosters & check-in pins</li>
                <li>Member rank pass and activity qualification</li>
              </ul>
            </div>

            <div className="p-3 bg-slate-50 rounded-[12px] border border-slate-100 text-[11px] font-mono text-slate-500">
              Merchant: VTS Volunteer Corps<br />
              Shortcode: 884120
            </div>
          </div>
        </div>

        {/* Right Column: Telebirr Payment Rail */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white rounded-[24px] shadow-soft border border-slate-100 p-6 sm:p-8 space-y-6">
            {/* Top Telebirr brand accent */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                  tb
                </div>
                <div>
                  <h4 className="font-sans text-sm font-semibold text-slate-900">
                    Telebirr SuperApp / USSD
                  </h4>
                  <span className="text-[11px] font-sans text-slate-400">
                    Ethio Telecom payment rail
                  </span>
                </div>
              </div>
              <StatusMark status={payment?.status || 'waiting'} size="sm" />
            </div>

            {/* Delay/Waiting notification */}
            {simulationState === 'delay' && (
              <div className="p-4 rounded-[16px] border border-amber-200 bg-amber-50 space-y-2 text-xs font-sans text-slate-900">
                <div className="flex items-center gap-2 font-bold text-[#784E0B]">
                  <Clock className="w-4 h-4" />
                  <span>We are checking your payment</span>
                </div>
                <p className="leading-relaxed">
                  This usually takes less than a minute. Your transaction (Ref: {payment?.telebirrReference}) has been queued for automatic verification. If network latency delays the telecom confirmation, our Finance Officer will resolve it manually.
                </p>
              </div>
            )}

            {/* Failure notification */}
            {simulationState === 'failed' && (
              <div className="p-4 border border-civic-rust bg-civic-rustLight space-y-2 text-xs font-sans text-ink-primary">
                <div className="flex items-center gap-2 font-bold text-civic-rust">
                  <Warning className="w-4 h-4" />
                  <span>Payment could not be completed</span>
                </div>
                <p className="leading-relaxed">
                  The payment request timed out or was declined on the mobile handset. Please ensure your Telebirr wallet has sufficient balance and try again.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSimulationState('idle')}
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Normal Phone Input & QR */}
            {simulationState === 'idle' && (
              <div className="space-y-5">
                <Input
                  label="Registered Telebirr Mobile Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+251 91 123 4567"
                  leftAddon={<DeviceMobile className="w-4 h-4" />}
                  hint="The 09... number where the USSD push confirmation prompt will appear."
                  required
                />

                <div className="p-4 border border-border bg-canvas-subdued/40 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-semibold text-ink-primary block">
                      Desktop Scan Alternative
                    </span>
                    <p className="font-sans text-[11px] text-ink-secondary">
                      Open Telebirr SuperApp and scan the QR code to approve.
                    </p>
                  </div>
                  <div className="w-16 h-16 border border-border-strong bg-canvas-raised p-1 flex items-center justify-center shrink-0">
                    <QrCode className="w-full h-full text-ink-primary" />
                  </div>
                </div>

                <Button
                  variant="telebirr"
                  size="lg"
                  className="w-full font-bold"
                  isLoading={isProcessing}
                  onClick={handleStartPayment}
                  leftIcon={<Money className="w-5 h-5" weight="bold" />}
                >
                  Pay with Telebirr (ETB 200.00)
                </Button>
              </div>
            )}

            {/* In-Flight Simulation State */}
            {simulationState === 'waiting' && (
              <div className="space-y-6 text-center py-4">
                <div className="w-12 h-12 mx-auto border border-border bg-canvas-subdued flex items-center justify-center text-civic-gold">
                  <Clock className="w-6 h-6 animate-spin" />
                </div>

                <div className="space-y-1">
                  <h4 className="font-serif text-lg font-bold text-ink-primary">
                    Confirm Prompt on Your Phone
                  </h4>
                  <p className="font-sans text-xs text-ink-secondary max-w-sm mx-auto leading-relaxed">
                    A USSD push notification has been sent to <strong className="font-mono text-ink-primary">{phone}</strong>. Enter your Telebirr PIN to approve the ETB 200 fee.
                  </p>
                </div>

                {/* Evaluator Simulation Control Panel (Section 12.2) */}
                <div className="p-5 rounded-[18px] border border-amber-200 bg-amber-50/70 space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs font-semibold text-slate-800">
                      Demo Telebirr Simulator
                    </span>
                    <span className="font-sans text-[11px] text-slate-400">
                      Test outcome states
                    </span>
                  </div>

                  <p className="text-xs font-sans text-slate-600 leading-relaxed">
                    Choose an outcome to demonstrate the system’s handling of telecom transactions:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <Button
                      variant="primary"
                      size="sm"
                      isLoading={isProcessing}
                      onClick={() => handleSimulateOutcome('confirm')}
                    >
                      1. Succeed (Activate)
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      isLoading={isProcessing}
                      onClick={() => handleSimulateOutcome('delay')}
                    >
                      2. Delay (Needs Review)
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      isLoading={isProcessing}
                      onClick={() => handleSimulateOutcome('fail')}
                    >
                      3. Cancel / Fail
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
