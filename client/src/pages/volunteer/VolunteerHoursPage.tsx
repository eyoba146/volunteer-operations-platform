import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { HoursEntry, Activity } from '../../types';
import { LedgerTable, LedgerColumn, Button, StatusMark, SheetModal, Input, Select, Skeleton, EmptyState } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { Clock, Plus, Warning } from '@phosphor-icons/react';

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

  const handleCheckoutDirectly = async (hoursId: string) => {
    try {
      await api.checkOut(hoursId);
      toast.success('Check-out recorded! Your hours are waiting for Team Lead approval.');
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Could not record check-out.');
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
      header: 'Date & time',
      cell: (entry) => (
        <div>
          <span className="font-mono text-[13px] font-semibold text-ink-primary block">
            {new Date(entry.checkIn).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <span className="font-mono text-[13px] text-ink-secondary block">
            {new Date(entry.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      ),
    },
    {
      header: 'Activity title & source',
      cell: (entry) => (
        <div className="space-y-0.5">
          <span className="font-sans font-medium text-ink-primary block">
            {entry.activityTitle || 'Community service activity'}
          </span>
          <span className="font-mono text-[13px] text-ink-tertiary block">
            Source: {entry.source === 'manual' ? 'Manual claim' : 'Session code verified'}
          </span>
          {entry.manualNote && (
            <p className="text-[13px] text-ink-secondary italic pt-0.5 max-w-md">
              "{entry.manualNote}"
            </p>
          )}
          {entry.decisionReason && entry.status === 'declined' && (
            <div className="p-2 rounded-[6px] bg-red-50 text-red-800 text-[13px] font-sans mt-1">
              <strong>Decline reason:</strong> {entry.decisionReason}
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Duration',
      cell: (entry) => {
        if (!entry.checkOut || entry.checkOut === '') {
          return (
            <div className="space-y-1">
              <span className="font-sans text-[13px] font-medium text-amber-800 block">
                Checked in, not checked out
              </span>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleCheckoutDirectly(entry.id)}
              >
                Check out
              </Button>
            </div>
          );
        }

        const isQuickLook = entry.manualNote?.includes('Needs a quick look');
        return (
          <div className="space-y-0.5">
            <span className="font-mono text-[13px] font-semibold text-ink-primary">
              {Math.round((entry.minutes / 60) * 10) / 10} hrs
            </span>
            {isQuickLook && (
              <span className="inline-block px-1.5 py-0.5 text-[11px] font-medium bg-amber-50 text-amber-900 rounded-[4px]">
                Needs a quick look
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: 'Decision status',
      cell: (entry) => <StatusMark status={entry.status} size="sm" />,
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="rect" className="h-24 rounded-[10px]" />
        <Skeleton variant="rect" className="h-64 rounded-[10px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="border-b border-[#D5DAE1] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink-primary leading-tight mt-1">
            Logged hours ledger
          </h1>
          <p className="font-sans text-[13px] sm:text-sm text-ink-secondary mt-1">
            Complete record of your volunteer hours, attendance check-ins, and manual claims.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" weight="bold" />}
          onClick={() => setIsModalOpen(true)}
        >
          Add missed hours
        </Button>
      </div>

      {/* Connected Metric Strip */}
      <div className="border border-[#D5DAE1] rounded-[10px] bg-white shadow-sm grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#D5DAE1] font-mono">
        <div className="p-5 space-y-1">
          <span className="text-[13px] font-medium text-ink-tertiary block">
            Approved service hours
          </span>
          <div className="font-display text-3xl sm:text-4xl font-bold text-role-volunteer leading-none">
            {Math.round((totalApprovedMinutes / 60) * 10) / 10}{' '}
            <span className="font-mono text-sm font-normal text-ink-secondary">hrs</span>
          </div>
          <span className="text-[13px] text-ink-secondary block font-sans">
            Counts directly toward rank promotion
          </span>
        </div>

        <div className="p-5 space-y-1">
          <span className="text-[13px] font-medium text-ink-tertiary block">
            Hours awaiting approval
          </span>
          <div className="font-display text-3xl sm:text-4xl font-bold text-role-applicant leading-none">
            {Math.round((totalLoggedMinutes / 60) * 10) / 10}{' '}
            <span className="font-mono text-sm font-normal text-ink-secondary">hrs</span>
          </div>
          <span className="text-[13px] text-ink-secondary block font-sans">
            Submitted to Team Lead for review
          </span>
        </div>

        <div className="p-5 space-y-1">
          <span className="text-[13px] font-medium text-ink-tertiary block">
            Declined hours
          </span>
          <div className="font-display text-3xl sm:text-4xl font-bold text-ink-primary leading-none">
            {Math.round((totalDeclinedMinutes / 60) * 10) / 10}{' '}
            <span className="font-mono text-sm font-normal text-ink-secondary">hrs</span>
          </div>
          <span className="text-[13px] text-ink-secondary block font-sans">
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
          actionLabel="Add missed hours"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="border border-[#D5DAE1] rounded-[10px] bg-white shadow-sm overflow-hidden">
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
        title="Add missed hours"
      >
        <form onSubmit={handleManualSubmit} className="space-y-5">
          <p className="font-sans text-[13px] text-ink-secondary leading-relaxed">
            If you attended an activity but could not check in with the Team Lead on-site, enter your details below. Manual hours require Team Lead verification.
          </p>

          {modalError && (
            <div className="p-3 border border-role-teamlead/30 rounded-[8px] bg-role-teamleadLight/20 text-role-teamlead text-[13px] font-sans font-medium flex items-center gap-2">
              <Warning className="w-4 h-4 shrink-0" weight="bold" />
              <span>{modalError}</span>
            </div>
          )}

          <Select
            label="Attended activity"
            value={selectedActivityId}
            onChange={(e) => setSelectedActivityId(e.target.value)}
            options={activities.map((a) => ({
              value: a.id,
              label: `${a.title} (${a.area})`,
            }))}
            required
          />

          <Input
            label="Service date"
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
            <label className="block text-[13px] font-medium text-ink-primary">
              Explanation for manual claim
            </label>
            <textarea
              rows={3}
              value={manualNote}
              onChange={(e) => setManualNote(e.target.value)}
              placeholder="e.g. Arrived directly at field site station B; phone battery ran out before check-in code was scanned."
              className="w-full bg-white text-ink-primary font-sans text-[13px] border-[1.5px] border-[#475569] rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-role-volunteer"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#D5DAE1]">
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
              Submit for lead approval
            </Button>
          </div>
        </form>
      </SheetModal>
    </div>
  );
};
