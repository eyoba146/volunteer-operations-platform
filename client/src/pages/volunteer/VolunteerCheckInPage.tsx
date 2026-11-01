import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Activity, HoursEntry } from '../../types';
import { Button, Select, Skeleton } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import {
  QrCode,
  CheckCircle,
  Clock,
  Warning,
  ArrowRight,
  Key,
  Camera,
  SignOut,
  MapPin
} from '@phosphor-icons/react';

export const VolunteerCheckInPage: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [method, setMethod] = useState<'code' | 'qr'>('code');
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSession, setActiveSession] = useState<HoursEntry | null>(null);
  const [checkoutComplete, setCheckoutComplete] = useState<HoursEntry | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const toast = useToast();

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [allActs, userHours] = await Promise.all([
        api.getAllActivities(),
        api.getHoursForUser(user.id),
      ]);

      const openActs = allActs.filter(
        (a) => a.status === 'in_progress' || a.status === 'open'
      );
      setActivities(openActs);
      if (openActs.length > 0 && !selectedActivityId) {
        setSelectedActivityId(openActs[0].id);
      }

      // Check if user currently has an active logged checkin session today
      const active = userHours.find(
        (h) => h.status === 'logged' && h.source === 'checkin'
      );
      setActiveSession(active || null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const selectedActivity = activities.find((a) => a.id === selectedActivityId);

  const handleCheckInWithCode = async (codeToSubmit?: string) => {
    setErrorMessage('');
    const code = codeToSubmit || inputCode.trim();
    if (!user || !selectedActivityId || !code) {
      setErrorMessage('Please enter the 4-digit code shown by the Team Lead.');
      return;
    }

    setIsSubmitting(true);
    try {
      const entry = await api.checkInWithCode(user.id, selectedActivityId, code);
      setActiveSession(entry);
      toast.success(`Check-in confirmed for ${entry.activityTitle}!`);
      setInputCode('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Check-in code could not be verified.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimulateQRScan = async () => {
    if (!selectedActivity) {
      setErrorMessage('Please select an active activity first.');
      return;
    }
    setIsScanning(true);
    setTimeout(async () => {
      setIsScanning(false);
      await handleCheckInWithCode(selectedActivity.checkInCode);
    }, 1200);
  };

  const handleCheckOut = async () => {
    if (!activeSession) return;
    setIsSubmitting(true);
    try {
      const updated = await api.checkOut(activeSession.id);
      setCheckoutComplete(updated);
      setActiveSession(null);
      toast.success('Check-out recorded! Your hours have been submitted for Team Lead approval.');
      await loadData();
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not record check-out.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-lg mx-auto">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="rect" className="h-64 rounded-[10px]" />
      </div>
    );
  }

  // CHECKOUT COMPLETE CONFIRMATION TICKET
  if (checkoutComplete) {
    return (
      <div className="max-w-md mx-auto border border-[#D5DAE1] rounded-[10px] bg-white p-6 sm:p-8 text-center space-y-6 shadow-sm">
        <div className="w-16 h-16 mx-auto bg-role-volunteer text-white flex items-center justify-center rounded-[8px]">
          <CheckCircle className="w-10 h-10" weight="fill" />
        </div>

        <div className="space-y-1">
          <span className="font-sans text-[13px] font-semibold text-role-volunteer block">
            Attendance logged
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink-primary">
            Session completed
          </h2>
          <p className="font-sans text-[13px] text-ink-secondary">
            Your attendance for <strong>{checkoutComplete.activityTitle}</strong> has been logged and sent to your Team Lead for approval.
          </p>
        </div>

        <div className="border border-[#D5DAE1] rounded-[8px] bg-canvas-subdued/30 p-4 font-mono text-[13px] text-left space-y-2">
          <div className="flex justify-between">
            <span className="text-ink-secondary">Logged duration:</span>
            <span className="font-semibold text-ink-primary">
              {checkoutComplete.minutes} minutes ({Math.round((checkoutComplete.minutes / 60) * 10) / 10} hrs)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-secondary">Check-in time:</span>
            <span className="text-ink-primary">
              {new Date(checkoutComplete.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-secondary">Check-out time:</span>
            <span className="text-ink-primary">
              {new Date(checkoutComplete.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="flex justify-between border-t border-[#D5DAE1] pt-2">
            <span className="text-ink-secondary">Review status:</span>
            <span className="font-semibold text-role-applicant">Logged • Awaiting lead decision</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button
            variant="primary"
            onClick={() => navigate('/volunteer/hours')}
            rightIcon={<ArrowRight className="w-4 h-4" weight="bold" />}
          >
            Inspect hours ledger
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setCheckoutComplete(null);
            }}
          >
            Check in to another activity
          </Button>
        </div>
      </div>
    );
  }

  // ACTIVE CHECK-IN SESSION (VOLUNTEER IS CURRENTLY ON-SITE)
  if (activeSession) {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="border-b border-[#D5DAE1] pb-4 text-center">
          <span className="font-sans text-[13px] font-semibold text-role-volunteer block">
            On-site active session
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink-primary leading-tight mt-1">
            Checked in
          </h1>
        </div>

        <div className="border border-[#D5DAE1] rounded-[10px] bg-white p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#D5DAE1] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-role-volunteer rounded-full animate-ping" />
              <span className="font-sans text-[13px] font-semibold text-role-volunteer">
                Active on duty
              </span>
            </div>
            <span className="font-mono text-[13px] text-ink-secondary">
              Since {new Date(activeSession.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-ink-primary leading-tight">
              {activeSession.activityTitle}
            </h3>
            <p className="font-sans text-[13px] text-ink-secondary">
              Your attendance is recorded. When your duty shift concludes, tap below to check out and finalize your hours.
            </p>
          </div>

          <div className="border border-[#D5DAE1] rounded-[8px] bg-canvas-subdued/30 p-4 font-mono text-[13px] space-y-1.5">
            <div className="flex justify-between">
              <span className="text-ink-secondary">Volunteer:</span>
              <span className="font-semibold text-ink-primary">{activeSession.userName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-secondary">Scheduled hours:</span>
              <span className="text-ink-primary">~{Math.round((activeSession.minutes / 60) * 10) / 10} hours</span>
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full justify-center"
              leftIcon={<SignOut className="w-5 h-5" weight="bold" />}
              onClick={handleCheckOut}
              isLoading={isSubmitting}
            >
              Check out now & record hours
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // CHECK-IN FORM (ENTER SHORT CODE OR SCAN QR)
  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-[#D5DAE1] pb-4 text-center">
        <span className="font-sans text-[13px] font-semibold text-role-volunteer block">
          On-site attendance
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink-primary leading-tight mt-1">
          Activity check-in
        </h1>
        <p className="font-sans text-[13px] sm:text-sm text-ink-secondary mt-1 max-w-md mx-auto">
          Scan the QR pass displayed by your Team Lead or enter the 4-digit session code.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex border border-[#D5DAE1] rounded-[8px] bg-canvas-subdued/40 p-1">
        <button
          onClick={() => {
            setMethod('code');
            setErrorMessage('');
          }}
          className={`flex-1 py-2 rounded-[6px] font-sans text-[13px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${method === 'code'
              ? 'bg-white text-ink-primary shadow-sm border border-[#D5DAE1]'
              : 'text-ink-secondary hover:text-ink-primary'
            }`}
        >
          <Key className="w-4 h-4" weight="bold" />
          <span>4-Digit short code</span>
        </button>
        <button
          onClick={() => {
            setMethod('qr');
            setErrorMessage('');
          }}
          className={`flex-1 py-2 rounded-[6px] font-sans text-[13px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${method === 'qr'
              ? 'bg-white text-ink-primary shadow-sm border border-[#D5DAE1]'
              : 'text-ink-secondary hover:text-ink-primary'
            }`}
        >
          <QrCode className="w-4 h-4" weight="bold" />
          <span>Scan QR pass</span>
        </button>
      </div>

      {/* Main Check-In Box */}
      <div className="border border-[#D5DAE1] rounded-[10px] bg-white p-6 sm:p-8 shadow-sm space-y-6">
        {errorMessage && (
          <div className="p-3 border border-role-teamlead/30 rounded-[8px] bg-role-teamleadLight/20 text-role-teamlead text-[13px] font-sans font-medium flex items-center gap-2">
            <Warning className="w-4 h-4 shrink-0" weight="bold" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Activity Selection */}
        <div className="space-y-1">
          <Select
            label="Select active activity"
            value={selectedActivityId}
            onChange={(e) => setSelectedActivityId(e.target.value)}
            options={activities.map((a) => ({
              value: a.id,
              label: `${a.title} (${a.area})`,
            }))}
            required
          />
          {selectedActivity && (
            <div className="text-[13px] font-mono text-ink-secondary pt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-ink-tertiary" />
              <span>{selectedActivity.place}, {selectedActivity.area}</span>
            </div>
          )}
        </div>

        {/* Method 1: Short Code Input */}
        {method === 'code' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCheckInWithCode();
            }}
            className="space-y-5"
          >
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-ink-primary">
                4-Digit session code
              </label>
              <input
                type="text"
                maxLength={4}
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 5291"
                className="w-full text-center font-mono text-3xl font-bold tracking-[0.5em] p-3 border-[1.5px] border-[#475569] rounded-[8px] bg-white text-ink-primary focus:outline-none focus:ring-2 focus:ring-role-volunteer"
                required
              />
              <span className="font-sans text-[13px] text-ink-secondary block text-center">
                Ask your Team Lead for the active 4-digit code.
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center"
              isLoading={isSubmitting}
              disabled={!inputCode || inputCode.length < 4}
            >
              Confirm check-in
            </Button>
          </form>
        )}

        {/* Method 2: QR Scanner Simulation */}
        {method === 'qr' && (
          <div className="space-y-5 text-center">
            {/* Viewfinder Reticle */}
            <div className="relative w-64 h-64 mx-auto border border-dashed border-[#CBD2DA] rounded-[16px] bg-canvas-subdued/20 flex flex-col items-center justify-center p-4 overflow-hidden">
              <svg className="absolute inset-0 w-full h-full pointer-events-none p-3" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                <path d="M 5 20 V 5 H 20" strokeWidth="2.5" className="text-role-volunteer" strokeLinecap="round" />
                <path d="M 80 5 H 95 V 20" strokeWidth="2.5" className="text-role-volunteer" strokeLinecap="round" />
                <path d="M 5 80 V 95 H 20" strokeWidth="2.5" className="text-role-volunteer" strokeLinecap="round" />
                <path d="M 80 95 H 95 V 80" strokeWidth="2.5" className="text-role-volunteer" strokeLinecap="round" />
              </svg>

              {isScanning ? (
                <div className="space-y-2">
                  <Camera className="w-10 h-10 text-role-volunteer mx-auto animate-bounce" weight="bold" />
                  <span className="font-mono text-[13px] font-semibold text-role-volunteer block">
                    Scanning session QR...
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <QrCode className="w-16 h-16 text-ink-tertiary mx-auto" />
                  <span className="font-sans text-[13px] text-ink-secondary block">
                    Aim camera at the activity badge
                  </span>
                </div>
              )}
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full justify-center"
              onClick={handleSimulateQRScan}
              isLoading={isScanning || isSubmitting}
              leftIcon={<Camera className="w-5 h-5" weight="bold" />}
            >
              {isScanning ? 'Verifying QR code...' : 'Simulate scan activity QR'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
