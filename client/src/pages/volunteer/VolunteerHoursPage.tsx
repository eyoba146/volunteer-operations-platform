import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { HoursEntry, Activity } from '../../types';
import { LedgerTable, LedgerColumn, Button, StatusMark, SheetModal, Input, Select, Skeleton, EmptyState } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { Clock, Plus, CheckCircle, Warning, FileText, CalendarBlank } from '@phosphor-icons/react';

export const VolunteerHoursPage: React.FC = () => {
  const { user } = useAuth();
  const [hours, setHours] = useState<HoursEntry[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manual hours form state
  const [selectedActivityId, setSelectedActivityId] = useState('');
  const [manualDate, setManualDate] = useState('2026-10-30');
  const [manualHours, setManualHours] = useState('4');
  const [manualMinutes, setManualMinutes] = useState('0');
  const [manualNote, setManualNote] = useState('');
  const [modalError, setModalError] = useState('');

  const toast = useToast();

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [hList, aList] = await Promise.all([
        api.getHoursForUser(user.id),
        api.getAllActivities(),
      ]);
      setHours(hList);
      setActivities(aList);
      if (aList.length > 0 && !selectedActivityId) {
        setSelectedActivityId(aList[0].id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');

    if (!user) return;

    // Check future date
    if (new Date(manualDate) > new Date()) {
      setModalError('Hours cannot be logged for future dates.');
      return;
    }

    if (!manualNote.trim()) {
      setModalError('Please explain why check-in was missed or manual recording is needed.');
      return;
    }

    const h = parseFloat(manualHours) || 0;
    const m = parseFloat(manualMinutes) || 0;
    if (h <= 0 && m <= 0) {
      setModalError('Please enter a valid duration of service.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.submitManualHours(user.id, {
        activityId: selectedActivityId,
        date: manualDate,
        hours: h,
        minutes: m,
        note: manualNote,
      });

      toast.info('Manual hours submitted. Your Team Lead will review and approve them.');
      setIsModalOpen(false);
      setManualNote('');
      await loadData();
    } catch (err: any) {
      setModalError(err.message || 'Could not record hours.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalApprovedMinutes = hours
    .filter((h) => h.status === 'approved')
    .reduce((sum, h) => sum + h.minutes, 0);

  const totalLoggedMinutes = hours
    .filter((h) => h.status === 'logged')
    .reduce((sum, h) => sum + h.minutes, 0);

  const totalDeclinedMinutes = hours
    .filter((h) => h.status === 'declined')
    .reduce((sum, h) => sum + h.minutes, 0);

  const columns: LedgerColumn<HoursEntry>[] = [
    {
      header: 'Date & Time',
      cell: (entry) => (
        <div>
          <span className="font-mono text-xs font-bold text-ink-primary block">
            {new Date(entry.checkIn).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <span className="font-mono text-[11px] text-ink-secondary block">
            {new Date(entry.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      ),
    },
    {
      header: 'Activity Title & Source',
      cell: (entry) => (
        <div className="space-y-0.5">
          <span className="font-sans font-bold text-ink-primary block">
            {entry.activityTitle || 'Community Service Activity'}
          </span>
          <span className="font-mono text-[10px] uppercase font-bold text-ink-tertiary block">
            Source: {entry.source === 'manual' ? 'Manual claim' : 'Session code verified'}
          </span>
          {entry.manualNote && (
            <p className="text-xs text-ink-secondary italic pt-0.5 max-w-md">
              "{entry.manualNote}"
            </p>
          )}
          {entry.decisionReason && entry.status === 'declined' && (
            <div className="p-2 border border-role-teamlead bg-role-teamleadLight text-role-teamlead text-xs font-sans mt-1">
              <strong>Decline Reason:</strong> {entry.decisionReason}
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Duration',
      cell: (entry) => (
        <span className="font-mono text-xs font-bold text-ink-primary">
          {Math.round((entry.minutes / 60) * 10) / 10} hrs{' '}
          <span className="text-[11px] text-ink-tertiary font-normal">({entry.minutes}m)</span>
        </span>
      ),
    },
    {
      header: 'Decision Status',
      cell: (entry) => <StatusMark status={entry.status} size="sm" />,
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="rect" className="h-24" />
        <Skeleton variant="rect" className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="border-b-2 border-border pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="font-sans text-xs font-bold text-role-volunteer uppercase tracking-tight block">
            Service Record
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-ink-primary leading-none mt-1">
            Logged Hours Ledger
          </h1>
          <p className="font-sans text-xs sm:text-sm text-ink-secondary mt-1">
            Complete record of your volunteer hours, attendance check-ins, and manual claims.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" weight="bold" />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Missed Hours
        </Button>
      </div>

      {/* Connected Metric Strip (Never floating 4-cards) */}
      <div className="border-2 border-ink-primary bg-white shadow-ticket grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x-2 divide-ink-primary font-mono">
        <div className="p-5 space-y-1">
          <span className="text-xs font-bold uppercase text-ink-tertiary block">
            Approved Service Hours
          </span>
          <div className="font-display text-4xl sm:text-5xl font-black text-role-volunteer leading-none">
            {Math.round((totalApprovedMinutes / 60) * 10) / 10}{' '}
            <span className="font-mono text-sm font-normal text-ink-secondary">hrs</span>
          </div>
          <span className="text-[11px] text-ink-secondary block font-sans">
            Counts directly toward rank promotion
          </span>
        </div>

        <div className="p-5 space-y-1">
          <span className="text-xs font-bold uppercase text-ink-tertiary block">
            Hours Awaiting Approval
          </span>
          <div className="font-display text-4xl sm:text-5xl font-black text-role-applicant leading-none">
            {Math.round((totalLoggedMinutes / 60) * 10) / 10}{' '}
            <span className="font-mono text-sm font-normal text-ink-secondary">hrs</span>
          </div>
          <span className="text-[11px] text-ink-secondary block font-sans">
            Submitted to Team Lead for review
          </span>
        </div>

        <div className="p-5 space-y-1">
          <span className="text-xs font-bold uppercase text-ink-tertiary block">
            Declined Hours
          </span>
          <div className="font-display text-4xl sm:text-5xl font-black text-ink-primary leading-none">
            {Math.round((totalDeclinedMinutes / 60) * 10) / 10}{' '}
            <span className="font-mono text-sm font-normal text-ink-secondary">hrs</span>
          </div>
          <span className="text-[11px] text-ink-secondary block font-sans">
            Includes feedback reasons
          </span>
        </div>
      </div>

      {/* Ledger Table */}
      {hours.length === 0 ? (
        <EmptyState
          icon={<Clock className="w-8 h-8 text-ink-secondary" weight="bold" />}
          title="No hours logged yet"
          description="Check in to upcoming activities or submit manual hours if you participated in an unrecorded session."
          actionLabel="Add Missed Hours"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="border-2 border-ink-primary bg-white shadow-ticket">
          <LedgerTable
            columns={columns}
            data={hours}
            keyExtractor={(h) => h.id}
          />
        </div>
      )}

      {/* Manual Missed Hours Modal Sheet */}
      <SheetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Missed Hours"
      >
        <form onSubmit={handleManualSubmit} className="space-y-5">
          <p className="font-sans text-xs text-ink-secondary leading-relaxed">
            If you attended an activity but could not check in with the Team Lead on-site, enter your details below. Manual hours require Team Lead verification.
          </p>

          {modalError && (
            <div className="p-3 border-2 border-role-teamlead bg-role-teamleadLight text-role-teamlead text-xs font-sans font-bold flex items-center gap-2">
              <Warning className="w-4 h-4 shrink-0" weight="bold" />
              <span>{modalError}</span>
            </div>
          )}

          <Select
            label="Attended Activity"
            value={selectedActivityId}
            onChange={(e) => setSelectedActivityId(e.target.value)}
            options={activities.map((a) => ({
              value: a.id,
              label: `${a.title} (${a.area})`,
            }))}
            required
          />

          <Input
            label="Service Date"
            type="date"
            value={manualDate}
            max="2026-10-31"
            onChange={(e) => setManualDate(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Hours"
              type="number"
              min="0"
              max="24"
              value={manualHours}
              onChange={(e) => setManualHours(e.target.value)}
              required
            />
            <Input
              label="Minutes"
              type="number"
              min="0"
              max="59"
              step="15"
              value={manualMinutes}
              onChange={(e) => setManualMinutes(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-bold uppercase text-ink-primary">
              Explanation for Manual Claim
            </label>
            <textarea
              rows={3}
              value={manualNote}
              onChange={(e) => setManualNote(e.target.value)}
              placeholder="e.g. Arrived directly at field site station B; phone battery ran out before check-in code was scanned."
              className="w-full bg-canvas text-ink-primary font-sans text-xs border-2 border-ink-primary p-2.5 focus:outline-none focus:ring-2 focus:ring-role-volunteer"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              Submit for Lead Approval
            </Button>
          </div>
        </form>
      </SheetModal>
    </div>
  );
};
