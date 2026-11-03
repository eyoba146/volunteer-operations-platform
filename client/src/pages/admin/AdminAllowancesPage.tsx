import React, { useState, useEffect } from 'react';
import { PageShell, StatusMark, Button, SheetModal } from '../../components/ui';
import { TopoBackdrop } from '../../components/signature/TopoBackdrop';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  Money,
  Warning,
  Building,
} from '@phosphor-icons/react';
import { AllowanceRequest } from '../../types';
import { getAllowances, approveAllowance, rejectAllowance, computeProjectBudgetMetrics } from '../../api/allowances';
import { store } from '../../api/store';
import { can } from '../../utils/permissions';

export const AdminAllowancesPage: React.FC = () => {
  const currentUser = store.getCurrentUser();
  const [allowances, setAllowances] = useState<AllowanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Approval / Decline Modal
  const [selectedAllowance, setSelectedAllowance] = useState<AllowanceRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [declineReason, setDeclineReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const list = await getAllowances();
      setAllowances(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAllowance) return;

    if (actionType === 'reject' && !declineReason.trim()) {
      setErrorMsg('A reason is required to decline an allowance.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      if (actionType === 'approve') {
        await approveAllowance(selectedAllowance.id);
      } else {
        await rejectAllowance(selectedAllowance.id, declineReason.trim());
      }

      setSelectedAllowance(null);
      setDeclineReason('');
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Action failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifiedQueue = allowances.filter((a) => a.status === 'verified');
  const otherAllowances = allowances.filter((a) => a.status !== 'verified');

  return (
    <PageShell page="admin/allowances" signature="TopoBackdrop">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Editorial Header */}
        <div className="space-y-1">
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink-primary tracking-tight">
            Budget authority approvals
          </h1>
          <p className="font-sans text-base text-ink-secondary">
            National budget authority queue. Review verified field requests and reserve project funds for Telebirr disbursement.
          </p>
        </div>

        {/* Section 1: Verified Queue Awaiting Budget Authority */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-ink-primary">
              Awaiting budget approval ({verifiedQueue.length})
            </h2>
            <span className="text-xs font-sans text-ink-secondary">
              Supervisor attendance verified
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm font-sans text-ink-secondary">
              Loading budget approval queue...
            </div>
          ) : verifiedQueue.length === 0 ? (
            <div className="p-8 rounded-[16px] bg-[#F7F8FA] text-center space-y-2">
              <CheckCircle className="w-8 h-8 mx-auto text-emerald-600" weight="bold" />
              <div className="font-display font-bold text-base text-ink-primary">
                Queue cleared
              </div>
              <p className="font-sans text-xs text-ink-secondary">
                No verified allowance requests currently awaiting budget approval.
              </p>
            </div>
          ) : (
            <div className="rounded-[16px] bg-[#F7F8FA] p-3 space-y-3">
              {verifiedQueue.map((alw) => {
                const metrics = computeProjectBudgetMetrics(alw.projectId);
                const isOverBudget = alw.totalAmount > metrics.remaining;
                const isSelfPrepared = alw.preparedBy === currentUser?.id;

                return (
                  <div
                    key={alw.id}
                    className="p-5 rounded-[12px] bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 max-w-xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-sans text-xs font-semibold px-2 py-0.5 rounded-[4px] bg-[#F1F3F6] text-ink-secondary">
                          {alw.allowanceNumber}
                        </span>
                        <span className="font-display font-bold text-base text-ink-primary">
                          {alw.volunteerName}
                        </span>
                        <StatusMark status="waiting" label="Verified by supervisor" />
                        {isSelfPrepared && (
                          <span className="px-2 py-0.5 rounded-[4px] bg-amber-50 text-amber-700 text-[11px] font-sans font-semibold">
                            Self-prepared (approval blocked)
                          </span>
                        )}
                        {isOverBudget && (
                          <span className="px-2 py-0.5 rounded-[4px] bg-red-50 text-red-700 text-[11px] font-sans font-semibold">
                            Exceeds remaining budget
                          </span>
                        )}
                      </div>

                      <div className="font-sans text-xs text-ink-secondary space-y-1">
                        <div>
                          Project: <span className="font-medium text-ink-primary">{alw.projectName}</span> • {alw.branchName}
                        </div>
                        <div>
                          Supervisor note ({alw.verifiedByName}): "{alw.supervisorNotes || 'Attendance confirmed'}"
                        </div>
                        <div className="text-ink-secondary">
                          Remaining available project funds: <span className="font-bold text-ink-primary">ETB {metrics.remaining.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
                      <div className="text-right">
                        <div className="font-display font-bold text-2xl text-ink-primary">
                          ETB {alw.totalAmount.toLocaleString()}
                        </div>
                        <div className="font-sans text-xs text-ink-secondary">
                          {alw.days} field days @ ETB {alw.allowancePerDay}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAllowance(alw);
                            setActionType('reject');
                            setDeclineReason('');
                            setErrorMsg('');
                          }}
                          className="px-3 py-2 rounded-[8px] bg-[#F1F3F6] text-xs font-sans font-semibold text-ink-secondary hover:text-red-700 hover:bg-red-50 transition-colors"
                        >
                          Decline
                        </button>
                        <Button
                          variant="primary"
                          disabled={isSelfPrepared || isOverBudget}
                          onClick={() => {
                            setSelectedAllowance(alw);
                            setActionType('approve');
                            setErrorMsg('');
                          }}
                          className="inline-flex items-center gap-1.5"
                        >
                          <ShieldCheck className="w-4 h-4" weight="bold" />
                          <span>Approve budget</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 2: All Other Allowances Across the System */}
        <div className="space-y-4 pt-6">
          <h2 className="font-display font-bold text-xl text-ink-primary">
            All system allowances ({otherAllowances.length})
          </h2>

          <div className="rounded-[16px] bg-[#F7F8FA] p-3 space-y-2">
            {otherAllowances.map((alw) => (
              <div
                key={alw.id}
                className="p-3.5 rounded-[12px] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-ink-secondary">{alw.allowanceNumber}</span>
                    <span className="font-bold text-ink-primary">{alw.volunteerName}</span>
                    <StatusMark
                      status={
                        alw.status === 'paid' || alw.status === 'approved'
                          ? 'approved'
                          : alw.status === 'rejected' || alw.status === 'failed'
                          ? 'declined'
                          : 'waiting'
                      }
                      label={alw.status}
                    />
                  </div>
                  <div className="text-ink-secondary">
                    {alw.projectName} • {alw.days} days • Prepared by {alw.preparedByName}
                    {alw.paymentReference && (
                      <span className="block text-emerald-800 font-semibold">Ref: {alw.paymentReference}</span>
                    )}
                  </div>
                </div>

                <div className="font-display font-bold text-base text-ink-primary self-end sm:self-auto">
                  ETB {alw.totalAmount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal: Confirmation */}
        {selectedAllowance && (
          <SheetModal
            isOpen={!!selectedAllowance}
            onClose={() => setSelectedAllowance(null)}
            title={actionType === 'approve' ? 'Approve project budget reservation' : 'Decline allowance request'}
            subtitle={`${selectedAllowance.volunteerName} — ${selectedAllowance.allowanceNumber}`}
          >
            <form onSubmit={handleAction} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-[12px] bg-red-50 text-red-700 text-xs font-sans">
                  {errorMsg}
                </div>
              )}

              <div className="p-4 rounded-[12px] bg-[#F1F3F6] space-y-1.5 text-xs font-sans">
                <div>Project: <span className="font-bold text-ink-primary">{selectedAllowance.projectName}</span></div>
                <div>Amount to reserve: <span className="font-bold text-ink-primary">ETB {selectedAllowance.totalAmount.toLocaleString()}</span></div>
                <div>Supervisor: <span className="font-bold text-ink-primary">{selectedAllowance.supervisorName || 'Team Lead'}</span></div>
                <div>Supervisor Note: <span className="text-ink-primary">"{selectedAllowance.supervisorNotes || 'Attendance confirmed'}"</span></div>
              </div>

              {actionType === 'approve' ? (
                <p className="text-xs font-sans text-ink-secondary">
                  Approving this request reserves ETB {selectedAllowance.totalAmount.toLocaleString()} from the project budget and notifies Finance to disburse funds via Telebirr.
                </p>
              ) : (
                <div className="space-y-1.5">
                  <label className="block text-xs font-sans font-semibold text-ink-secondary">
                    Reason for decline *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide a clear, plain explanation..."
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F1F3F6] rounded-[12px] text-sm font-sans text-ink-primary focus:outline-none focus:ring-2 focus:ring-[#202328]/30 resize-none"
                  />
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedAllowance(null)}
                  className="px-4 py-2 text-sm font-sans font-medium text-ink-secondary hover:bg-[#F1F3F6] rounded-[8px]"
                >
                  Cancel
                </button>
                <Button
                  variant={actionType === 'approve' ? 'primary' : 'secondary'}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : actionType === 'approve' ? 'Confirm budget approval' : 'Confirm decline'}
                </Button>
              </div>
            </form>
          </SheetModal>
        )}
      </div>
    </PageShell>
  );
};
