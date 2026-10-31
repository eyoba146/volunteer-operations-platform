import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { HoursEntry, Activity } from '../../types';
import { LedgerTable, LedgerColumn, Button, StatusMark, SheetModal, Input, Select, Skeleton } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { Clock, Plus, CheckCircle, Warning, FileText } from '@phosphor-icons/react';

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

  const columns: LedgerColumn<HoursEntry>[] = [
    {
      header: 'Date & Time',
      cell: (entry) => (
        <div>
          <span className="font-mono text-xs text-ink-primary block">
            {new Date(entry.checkIn).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <span className="font-mono text-[11px] text-ink-tertiary block">
            {new Date(entry.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      ),
    },
    {
      header: 'Activity Title',
      cell: (entry) => (
        <div className="space-y-0.5">
          <span className="font-sans font-semibold text-ink-primary block">
            {entry.activityTitle || 'Community Service'}
          </span>
          <span className="font-mono text-[10px] uppercase text-ink-tertiary block">
            Source: {entry.source === 'manual' ? 'Manual claim' : 'Session code'}
          </span>
          {entry.manualNote && (
            <p className="text-[11px] text-ink-secondary italic pt-0.5 max-w-md">
              "{entry.manualNote}"
            </p>
          )}
          {entry.decisionReason && entry.status === 'declined' && (
            <p className="text-[11px] text-civic-rust font-sans font-medium pt-0.5">
              Reason declined: {entry.decisionReason}
            </p>
          )}
        </div>
      ),
    },
    {
      header: 'Duration',
      align: 'right',
      cell: (entry) => (
        <div className="font-mono text-xs">
          <span className="font-bold text-ink-primary">
            {Math.floor(entry.minutes / 60)}h {entry.minutes % 60}m
          </span>
          <span className="text-ink-tertiary block text-[10px]">
            {entry.minutes} minutes
          </span>
        </div>
      ),
    },
    {
      header: 'Audit Status',
      align: 'right',
      cell: (entry) => <StatusMark status={entry.status} size="sm" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-border pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary block">
            VERIFIED SERVICE RECORD
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-primary">
            Service Hours Ledger
          </h1>
          <p className="font-sans text-xs sm:text-sm text-ink-secondary">
            Every minute of community duty logged, approved by Team Leads, or declined with reasons.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Missed Hours Manually
        </Button>
      </div>

      {/* Aggregate Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="border border-border bg-canvas-raised p-4 space-y-1">
          <span className="font-mono text-xs text-ink-tertiary uppercase">Approved Service</span>
          <div className="font-mono text-2xl font-bold text-civic-green">
            {Math.round((totalApprovedMinutes / 60) * 10) / 10} <span className="text-sm font-normal text-ink-tertiary">hours</span>
          </div>
          <span className="text-[11px] font-sans text-ink-secondary block">
            Counted toward rank thresholds
          </span>
        </div>

        <div className="border border-border bg-canvas-raised p-4 space-y-1">
          <span className="font-mono text-xs text-ink-tertiary uppercase">Pending Review</span>
          <div className="font-mono text-2xl font-bold text-[#784E0B]">
            {Math.round((totalLoggedMinutes / 60) * 10) / 10} <span className="text-sm font-normal text-ink-tertiary">hours</span>
          </div>
          <span className="text-[11px] font-sans text-ink-secondary block">
            Awaiting Team Lead sign-off
          </span>
        </div>

        <div className="border border-border bg-canvas-raised p-4 space-y-1">
          <span className="font-mono text-xs text-ink-tertiary uppercase">Total Recorded</span>
          <div className="font-mono text-2xl font-bold text-ink-primary">
            {hours.length} <span className="text-sm font-normal text-ink-tertiary">sessions</span>
          </div>
          <span className="text-[11px] font-sans text-ink-secondary block">
            Across active civic assignments
          </span>
        </div>
      </div>

      {/* Ledger Table */}
      <LedgerTable
        data={hours}
        columns={columns}
        keyExtractor={(item) => item.id}
        emptyMessage="No hours logged yet. Attend activities and check in to record service credit."
        isLoading={isLoading}
      />

      {/* Manual Hours Claim Sheet Modal */}
      <SheetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Missed Service Hours"
        subtitle="Submit manual attendance for Team Lead review"
        mode="modal"
        maxWidth="lg"
      >
        <form onSubmit={handleManualSubmit} className="space-y-4 text-left">
          {modalError && (
            <div className="p-3 border border-civic-rust bg-civic-rustLight text-civic-rust text-xs leading-normal font-sans">
              {modalError}
            </div>
          )}

          <div className="p-3 border border-civic-gold/60 bg-civic-goldLight text-xs font-sans text-ink-primary">
            <strong>Manual Hours Policy:</strong> Manual submissions always require written justification and verification by the assigned Team Lead.
          </div>

          <Select
            label="Activity"
            value={selectedActivityId}
            onChange={(e) => setSelectedActivityId(e.target.value)}
            options={activities.map((a) => ({
              value: a.id,
              label: `${a.title} (${a.area})`,
            }))}
            required
          />

          <Input
            label="Date of Service"
            type="date"
            value={manualDate}
            onChange={(e) => setManualDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
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
              step="5"
              value={manualMinutes}
              onChange={(e) => setManualMinutes(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-secondary">
              Reason for Manual Claim
            </label>
            <textarea
              rows={3}
              value={manualNote}
              onChange={(e) => setManualNote(e.target.value)}
              placeholder="e.g. Phone battery drained on site; team lead Yonas confirmed my attendance at 08:30..."
              className="w-full bg-canvas-raised text-ink-primary font-sans text-sm rounded border border-border p-2.5 focus:border-ink-primary focus:ring-1 focus:ring-ink-primary outline-none"
              required
            />
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-end gap-3">
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
              Submit Hours for Approval
            </Button>
          </div>
        </form>
      </SheetModal>
    </div>
  );
};

