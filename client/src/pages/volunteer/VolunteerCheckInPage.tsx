import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Activity, HoursEntry } from '../../types';
import { Button, Select, Skeleton } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { QrCode, CheckCircle, Clock, Warning, ArrowRight } from '@phosphor-icons/react';

export const VolunteerCheckInPage: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recordedEntry, setRecordedEntry] = useState<HoursEntry | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const list = await api.getAllActivities();
        // filter for active/in-progress or today's open activities
        const activeList = list.filter(
          (a) => a.status === 'in_progress' || a.status === 'open'
        );
        setActivities(activeList);
        if (activeList.length > 0) {
          setSelectedActivityId(activeList[0].id);
        }
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!user || !selectedActivityId || !code.trim()) return;

    setIsSubmitting(true);
    try {
      const entry = await api.checkInWithCode(user.id, selectedActivityId, code.trim());
      setRecordedEntry(entry);
      toast.success('Check-in confirmed! Your service hours have been logged.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Check-in code could not be verified.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedActivity = activities.find((a) => a.id === selectedActivityId);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-lg mx-auto">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="rect" className="h-64" />
      </div>
    );
  }

  if (recordedEntry) {
    return (
      <div className="max-w-md mx-auto border-2 border-civic-green bg-canvas-raised p-8 text-center space-y-6 shadow-modal animate-in zoom-in-95 duration-150">
        <div className="w-16 h-16 mx-auto border-2 border-civic-green bg-civic-greenLight text-civic-green flex items-center justify-center">
          <CheckCircle className="w-10 h-10" weight="fill" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-civic-green font-bold block">
            DUTY CHECK-IN CONFIRMED
          </span>
          <h2 className="font-serif text-2xl font-bold text-ink-primary">
            Attendance Verified
          </h2>
          <p className="font-sans text-xs text-ink-secondary leading-relaxed">
            You are checked in to <strong className="text-ink-primary">{recordedEntry.activityTitle}</strong>.
          </p>
        </div>

        <div className="border border-border bg-canvas-subdued p-4 font-mono text-xs text-left space-y-2">
          <div className="flex justify-between">
            <span className="text-ink-tertiary">Logged Minutes:</span>
            <span className="font-bold text-ink-primary">{recordedEntry.minutes} min ({recordedEntry.minutes / 60} hrs)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-tertiary">Session Timestamp:</span>
            <span className="text-ink-primary">
              {new Date(recordedEntry.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-tertiary">Hours Status:</span>
            <span className="font-bold text-[#784E0B] uppercase">Logged (Pending Team Lead Approval)</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="primary"
            onClick={() => navigate('/volunteer/hours')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Inspect My Hours Ledger
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setRecordedEntry(null);
              setCode('');
            }}
          >
            Check in to another session
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="border-b border-border pb-5 text-center space-y-1">
        <div className="w-12 h-12 mx-auto border border-border bg-canvas-subdued flex items-center justify-center text-ink-primary mb-2">
          <QrCode className="w-6 h-6" />
        </div>
        <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary block">
          ON-SITE VERIFICATION
        </span>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-primary">
          Check In to Activity
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink-secondary">
          Enter the 4-digit code shown by your Team Lead or scan the on-site clipboard QR code.
        </p>
      </div>

      <div className="border border-border bg-canvas-raised p-6 md:p-8 space-y-6 shadow-subtle">
        {errorMessage && (
          <div className="p-3 border border-civic-rust bg-civic-rustLight text-civic-rust text-xs leading-normal font-sans">
            {errorMessage}
          </div>
        )}

        {/* Demo Hint Helper */}
        {selectedActivity && (
          <div className="border border-civic-gold/60 bg-civic-goldLight p-3.5 space-y-1 text-xs font-sans text-ink-primary">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-[#784E0B] font-mono text-[11px]">
                Active Session Demo Hint
              </span>
              <span className="font-mono text-[10px] text-ink-tertiary">
                Team Lead: {selectedActivity.leadName || 'Yonas'}
              </span>
            </div>
            <p className="text-ink-secondary">
              Session code for <strong className="text-ink-primary">{selectedActivity.title}</strong> is:{' '}
              <button
                type="button"
                onClick={() => setCode(selectedActivity.checkInCode)}
                className="font-mono font-bold text-base px-2 py-0.5 bg-canvas-raised border border-border text-ink-primary hover:border-ink-primary cursor-pointer"
              >
                {selectedActivity.checkInCode}
              </button>{' '}
              (click to auto-fill)
            </p>
          </div>
        )}

        <form onSubmit={handleCheckIn} className="space-y-5">
          <Select
            label="Select Activity Session"
            value={selectedActivityId}
            onChange={(e) => setSelectedActivityId(e.target.value)}
            options={activities.map((a) => ({
              value: a.id,
              label: `${a.title} (${a.area})`,
            }))}
            hint="Choose the activity you are currently attending on site."
            required
          />

          <div className="space-y-2 text-center pt-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-secondary">
              4-Digit Session Code
            </label>
            <div className="flex justify-center">
              <input
                type="text"
                maxLength={4}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="----"
                className="w-40 text-center font-mono text-3xl tracking-[0.4em] font-bold py-2.5 px-4 bg-canvas-subdued border border-border focus:border-ink-primary focus:ring-1 focus:ring-ink-primary outline-none"
                autoFocus
              />
            </div>
            <p className="text-[11px] font-sans text-ink-tertiary">
              Displayed on the Team Lead’s dispatch device.
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isSubmitting}
            leftIcon={<QrCode className="w-4 h-4" />}
          >
            Confirm Attendance
          </Button>
        </form>
      </div>
    </div>
  );
};

