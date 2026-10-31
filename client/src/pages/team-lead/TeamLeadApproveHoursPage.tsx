import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { HoursEntry } from '../../types';
import { LedgerTable, LedgerColumn, Button, StatusMark, SheetModal, Skeleton, EmptyState } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { Check, CheckCircle, X, CheckSquare, Clock, Warning } from '@phosphor-icons/react';

export const TeamLeadApproveHoursPage: React.FC = () => {
  const { user } = useAuth();
  const [pendingHours, setPendingHours] = useState<HoursEntry[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Decline modal state
  const [declineTarget, setDeclineTarget] = useState<HoursEntry | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [declineError, setDeclineError] = useState('');

  const toast = useToast();

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const list = await api.getPendingHours(user.id);
      setPendingHours(list);
      setSelectedIds([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectAll = () => {
    if (selectedIds.length === pendingHours.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingHours.map((h) => h.id));
    }
  };

  const handleApproveSingle = async (hoursId: string) => {
    if (!user) return;
    setIsProcessing(true);
    try {
      await api.approveHours(hoursId, user.id);
      toast.success('Hours approved and added to volunteer service record.');
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Could not approve hours.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkApprove = async () => {
    if (!user || selectedIds.length === 0) return;
    setIsProcessing(true);
    try {
      await api.bulkApproveHours(selectedIds, user.id);
      toast.success(`Successfully approved ${selectedIds.length} volunteer service records.`);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Could not approve hours in bulk.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeclineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !declineTarget) return;

    if (!declineReason.trim()) {
      setDeclineError('Please provide a constructive reason for declining these hours.');
      return;
    }

    setIsProcessing(true);
    try {
      await api.declineHours(declineTarget.id, declineReason.trim(), user.id);
      toast.info('Hours entry marked as declined.');
      setDeclineTarget(null);
      setDeclineReason('');
      await loadData();
    } catch (err: any) {
      setDeclineError(err.message || 'Could not decline hours.');
    } finally {
      setIsProcessing(false);
    }
  };

  const columns: LedgerColumn<HoursEntry>[] = [
    {
      header: 'Select',
      cell: (entry) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(entry.id)}
          onChange={() => toggleSelect(entry.id)}
          className="w-4 h-4 cursor-pointer accent-ink-primary"
        />
      ),
    },
    {
      header: 'Volunteer',
      cell: (entry) => (
        <div className="space-y-0.5">
          <span className="font-sans font-bold text-ink-primary block">
            {entry.userName || 'Volunteer'}
          </span>
          <span className="font-mono text-[11px] text-ink-tertiary block">
            Date: {new Date(entry.checkIn).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      header: 'Activity & Source',
      cell: (entry) => (
        <div className="space-y-0.5">
          <span className="font-sans text-xs font-semibold text-ink-primary block">
            {entry.activityTitle}
          </span>
          <span className="font-mono text-[10px] uppercase text-ink-tertiary block">
            Source: {entry.source === 'manual' ? 'Manual claim' : 'Check-in code verified'}
          </span>
          {entry.manualNote && (
            <p className="text-[11px] text-ink-secondary italic pt-0.5 max-w-sm">
              "{entry.manualNote}"
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
            {Math.round((entry.minutes / 60) * 10) / 10} hrs
          </span>
          <span className="block text-[10px] text-ink-tertiary">
            {entry.minutes} mins
          </span>
        </div>
      ),
    },
    {
      header: 'Decide Action',
      align: 'right',
      cell: (entry) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleApproveSingle(entry.id)}
            leftIcon={<Check className="w-3.5 h-3.5" weight="bold" />}
          >
            Approve
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              setDeclineTarget(entry);
              setDeclineReason('');
              setDeclineError('');
            }}
          >
            Decline
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-border pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary block">
            FIELD AUDIT QUEUE
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-primary">
            Approve Volunteer Hours
          </h1>
          <p className="font-sans text-xs sm:text-sm text-ink-secondary">
            Verify attendance records for participants in your volunteer activities. Approved credit counts toward promotions.
          </p>
        </div>

        {pendingHours.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={selectAll}
            >
              {selectedIds.length === pendingHours.length ? 'Deselect All' : 'Select All'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={selectedIds.length === 0}
              isLoading={isProcessing}
              onClick={handleBulkApprove}
            >
              Approve Selected ({selectedIds.length})
            </Button>
          </div>
        )}
      </div>

      {/* Ledger Table */}
      {pendingHours.length === 0 && !isLoading ? (
        <EmptyState
          icon={<CheckCircle className="w-6 h-6 text-civic-green" />}
          title="All hours approved"
          description="There are currently no attendance entries waiting for your decision."
        />
      ) : (
        <LedgerTable
          data={pendingHours}
          columns={columns}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
        />
      )}

      {/* Decline Reason Modal */}
      <SheetModal
        isOpen={declineTarget !== null}
        onClose={() => setDeclineTarget(null)}
        title="Decline Hours Entry"
        subtitle={`Volunteer: ${declineTarget?.userName || ''}`}
        mode="modal"
        maxWidth="md"
      >
        <form onSubmit={handleDeclineSubmit} className="space-y-4 text-left">
          {declineError && (
            <div className="p-3 border border-civic-rust bg-civic-rustLight text-civic-rust text-xs leading-normal font-sans">
              {declineError}
            </div>
          )}

          <p className="font-sans text-xs text-ink-secondary leading-relaxed">
            Please provide a clear and respectful explanation so the volunteer understands why their attendance was declined.
          </p>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-secondary">
              Reason for Declining (Required)
            </label>
            <textarea
              rows={3}
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="e.g. Attendance was not recorded at check-in station or roster sheet..."
              className="w-full bg-canvas-raised text-ink-primary font-sans text-sm rounded border border-border p-2.5 focus:border-ink-primary focus:ring-1 focus:ring-ink-primary outline-none"
              required
            />
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDeclineTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              isLoading={isProcessing}
            >
              Confirm Decline
            </Button>
          </div>
        </form>
      </SheetModal>
    </div>
  );
};
