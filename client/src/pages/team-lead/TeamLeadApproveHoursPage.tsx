import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { HoursEntry } from '../../types';
import { LedgerTable, LedgerColumn, Button, SheetModal, Skeleton, EmptyState } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { Check, CheckCircle, X, Clock, Warning } from '@phosphor-icons/react';

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
      toast.info('Hours record marked as declined.');
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
      header: (
        <input
          type="checkbox"
          checked={pendingHours.length > 0 && selectedIds.length === pendingHours.length}
          onChange={selectAll}
          className="w-4 h-4 cursor-pointer accent-ink-primary"
          title="Select all"
        />
      ),
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
      header: 'Volunteer name & date',
      cell: (entry) => (
        <div className="space-y-0.5">
          <span className="font-sans font-semibold text-ink-primary block">
            {entry.userName || 'Volunteer'}
          </span>
          <span className="font-mono text-[13px] text-ink-secondary block">
            Date: {new Date(entry.checkIn).toLocaleDateString()} (
            {new Date(entry.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
          </span>
        </div>
      ),
    },
    {
      header: 'Activity assignment & claim notes',
      cell: (entry) => (
        <div className="space-y-1">
          <span className="font-sans text-[13px] font-semibold text-ink-primary block">
            {entry.activityTitle}
          </span>
          <span className="font-mono text-[13px] font-medium text-ink-tertiary block">
            Source: {entry.source === 'manual' ? 'Manual claim' : 'On-site code scan'}
          </span>
          {entry.manualNote && (
            <p className="text-[13px] text-ink-secondary italic max-w-md bg-canvas-subdued/30 p-2 border border-[#D5DAE1] rounded-[6px]">
              "{entry.manualNote}"
            </p>
          )}
        </div>
      ),
    },
    {
      header: 'Duration',
      cell: (entry) => {
        if (!entry.checkOut || entry.checkOut === '') {
          return (
            <span className="font-sans text-[13px] font-medium text-amber-800 block">
              Checked in, not checked out
            </span>
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
      header: 'Review actions',
      cell: (entry) => (
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Check className="w-3.5 h-3.5 text-role-volunteer" weight="bold" />}
            onClick={() => handleApproveSingle(entry.id)}
            disabled={isProcessing}
          >
            Approve
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<X className="w-3.5 h-3.5" weight="bold" />}
            onClick={() => {
              setDeclineTarget(entry);
              setDeclineReason('');
              setDeclineError('');
            }}
            disabled={isProcessing}
          >
            Decline
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="rect" className="h-20 rounded-[10px]" />
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
            Approve volunteer hours
          </h1>
          <p className="font-sans text-[13px] sm:text-sm text-ink-secondary mt-1">
            Verify volunteer session claims. Approved hours count toward rank advancement; declining requires a written explanation.
          </p>
        </div>

        {selectedIds.length > 0 && (
          <Button
            variant="primary"
            size="md"
            leftIcon={<CheckCircle className="w-4 h-4" weight="bold" />}
            onClick={handleBulkApprove}
            isLoading={isProcessing}
          >
            Approve selected ({selectedIds.length})
          </Button>
        )}
      </div>

      {/* Ledger Table */}
      {pendingHours.length === 0 ? (
        <EmptyState
          icon={<Clock className="w-8 h-8 text-ink-secondary" weight="bold" />}
          title="All hours verified"
          description="There are currently no volunteer hours awaiting your review."
        />
      ) : (
        <div className="border border-[#D5DAE1] rounded-[10px] bg-white shadow-sm overflow-hidden">
          <LedgerTable
            columns={columns}
            data={pendingHours}
            keyExtractor={(h) => h.id}
          />
        </div>
      )}

      {/* Decline Reason Modal Sheet */}
      <SheetModal
        isOpen={Boolean(declineTarget)}
        onClose={() => setDeclineTarget(null)}
        title="Decline volunteer hours"
      >
        {declineTarget && (
          <form onSubmit={handleDeclineSubmit} className="space-y-5">
            <p className="font-sans text-[13px] text-ink-secondary leading-relaxed">
              To decline hours for <strong className="text-ink-primary">{declineTarget.userName}</strong> on <em>{declineTarget.activityTitle}</em>, you must provide a constructive written explanation. The volunteer will read this feedback directly.
            </p>

            {declineError && (
              <div className="p-3 border border-role-teamlead/30 rounded-[8px] bg-role-teamleadLight/20 text-role-teamlead text-[13px] font-sans font-medium flex items-center gap-2">
                <Warning className="w-4 h-4 shrink-0" weight="bold" />
                <span>{declineError}</span>
              </div>
            )}

            <div className="border border-[#D5DAE1] rounded-[8px] bg-canvas-subdued/30 p-3 font-mono text-[13px] space-y-1">
              <div>Claim duration: <strong>{Math.round((declineTarget.minutes / 60) * 10) / 10} hours</strong></div>
              <div>Date: {new Date(declineTarget.checkIn).toLocaleDateString()}</div>
              <div>Source: {declineTarget.source === 'manual' ? 'Manual submission' : 'Session check-in'}</div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="block text-[13px] font-medium text-ink-primary">
                Mandatory reason for decline
              </label>
              <textarea
                rows={4}
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="e.g. Attendance was not verified at duty station A. Please contact team lead to verify logbook records."
                className="w-full bg-white text-ink-primary font-sans text-[13px] border-[1.5px] border-[#475569] rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-role-teamlead"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#D5DAE1]">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setDeclineTarget(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isProcessing}
              >
                Confirm decline & notify volunteer
              </Button>
            </div>
          </form>
        )}
      </SheetModal>
    </div>
  );
};
