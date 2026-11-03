import React, { useState, useEffect } from 'react';
import { PageShell, StatusMark, Button, SheetModal } from '../../components/ui';
import { TopoBackdrop } from '../../components/signature/TopoBackdrop';
import {
  CheckCircle,
  XCircle,
  Clock,
  Money,
  Warning,
  User,
  Calendar,
} from '@phosphor-icons/react';
import { AllowanceRequest } from '../../types';
import { getAllowances, verifyAllowance, rejectAllowance } from '../../api/allowances';
import { store } from '../../api/store';
import { can } from '../../utils/permissions';

export const TeamLeadVerifyAllowancesPage: React.FC = () => {
  const currentUser = store.getCurrentUser();
  const [allowances, setAllowances] = useState<AllowanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Verification modal
  const [selectedAllowance, setSelectedAllowance] = useState<AllowanceRequest | null>(null);
  const [actionType, setActionType] = useState<'verify' | 'reject'>('verify');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      // Get allowances where this team lead is the supervisor
      const list = await getAllowances({ supervisorId: currentUser.id });
      setAllowances(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser?.id]);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAllowance) return;

    if (actionType === 'reject' && !note.trim()) {
      setErrorMsg('A reason is required when declining an allowance.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      if (actionType === 'verify') {
        await verifyAllowance(selectedAllowance.id, note.trim() || undefined);
      } else {
        await rejectAllowance(selectedAllowance.id, note.trim());
      }

      setSelectedAllowance(null);
      setNote('');
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Action failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const waitingAllowances = allowances.filter((a) => a.status === 'submitted');
  const historyAllowances = allowances.filter((a) => a.status !== 'submitted');

  return (
    <PageShell page="team-lead/allowances" signature="TopoBackdrop">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Editorial Header */}
        <div className="space-y-1">
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink-primary tracking-tight">
            Verify allowances
          </h1>
          <p className="font-sans text-base text-ink-secondary">
            Confirm field attendance and completed service days for volunteer stipend disbursements.
          </p>
        </div>

        {/* Section 1: Waiting Verification Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-ink-primary">
              Awaiting your verification ({waitingAllowances.length})
            </h2>
            <span className="text-xs font-sans text-ink-secondary">
              Requests submitted by program managers
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm font-sans text-ink-secondary">
              Loading verification queue...
            </div>
          ) : waitingAllowances.length === 0 ? (
            <div className="p-8 rounded-[16px] bg-[#F7F8FA] text-center space-y-2">
              <CheckCircle className="w-8 h-8 mx-auto text-emerald-600" weight="bold" />
              <div className="font-display font-bold text-base text-ink-primary">
                All caught up
              </div>
              <p className="font-sans text-xs text-ink-secondary">
                No allowance requests currently require supervisor attendance confirmation.
              </p>
            </div>
          ) : (
            <div className="rounded-[16px] bg-[#F7F8FA] p-3 space-y-3">
              {waitingAllowances.map((alw) => (
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
                      <StatusMark status="waiting" label="Submitted" />
                    </div>

                    <div className="font-sans text-xs text-ink-secondary space-y-0.5">
                      <div>
                        Project: <span className="font-medium text-ink-primary">{alw.projectName}</span>
                      </div>
                      <div>
                        Service: {alw.days} days @ ETB {alw.allowancePerDay}/day • Prepared by {alw.preparedByName}
                      </div>
                      {alw.activityTitle && (
                        <div className="text-ink-primary font-medium">
                          Activity note: "{alw.activityTitle}"
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
                    <div className="text-right">
                      <div className="font-display font-bold text-xl text-ink-primary">
                        ETB {alw.totalAmount.toLocaleString()}
                      </div>
                      <div className="font-sans text-[11px] text-ink-secondary">
                        {alw.days} field days
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAllowance(alw);
                          setActionType('reject');
                          setNote('');
                          setErrorMsg('');
                        }}
                        className="px-3 py-2 rounded-[8px] bg-[#F1F3F6] text-xs font-sans font-semibold text-ink-secondary hover:text-red-700 hover:bg-red-50 transition-colors"
                      >
                        Decline
                      </button>
                      <Button
                        variant="primary"
                        onClick={() => {
                          setSelectedAllowance(alw);
                          setActionType('verify');
                          setNote('Attendance confirmed from daily field log sheet.');
                          setErrorMsg('');
                        }}
                        className="inline-flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-4 h-4" weight="bold" />
                        <span>Verify attendance</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Verification History */}
        {historyAllowances.length > 0 && (
          <div className="space-y-4 pt-6">
            <h2 className="font-display font-bold text-xl text-ink-primary">
              Verification history ({historyAllowances.length})
            </h2>

            <div className="rounded-[16px] bg-[#F7F8FA] p-3 space-y-2">
              {historyAllowances.map((alw) => (
                <div
                  key={alw.id}
                  className="p-3.5 rounded-[12px] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-ink-secondary">
                        {alw.allowanceNumber}
                      </span>
                      <span className="font-bold text-ink-primary">
                        {alw.volunteerName}
                      </span>
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
                      {alw.projectName} • {alw.days} days • Verified note: "{alw.supervisorNotes || 'Attendance confirmed'}"
                    </div>
                  </div>

                  <div className="font-display font-bold text-sm text-ink-primary self-end sm:self-auto">
                    ETB {alw.totalAmount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Modal */}
        {selectedAllowance && (
          <SheetModal
            isOpen={!!selectedAllowance}
            onClose={() => setSelectedAllowance(null)}
            title={actionType === 'verify' ? 'Verify volunteer attendance' : 'Decline allowance request'}
            subtitle={`${selectedAllowance.volunteerName} — ${selectedAllowance.allowanceNumber} (ETB ${selectedAllowance.totalAmount.toLocaleString()})`}
          >
            <form onSubmit={handleAction} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-[12px] bg-red-50 text-red-700 text-xs font-sans">
                  {errorMsg}
                </div>
              )}

              <div className="p-3.5 rounded-[12px] bg-[#F1F3F6] space-y-1 text-xs font-sans">
                <div>Project: <span className="font-bold text-ink-primary">{selectedAllowance.projectName}</span></div>
                <div>Service Days: <span className="font-bold text-ink-primary">{selectedAllowance.days} days</span></div>
                <div>Amount: <span className="font-bold text-ink-primary">ETB {selectedAllowance.totalAmount.toLocaleString()}</span></div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-sans font-semibold text-ink-secondary">
                  {actionType === 'verify' ? 'Supervisor Attendance Note (optional)' : 'Decline Reason *'}
                </label>
                <textarea
                  rows={3}
                  required={actionType === 'reject'}
                  placeholder={
                    actionType === 'verify'
                      ? 'e.g. Verified against Kirkos field log sheet and team attendance roster.'
                      : 'State clearly why this request cannot be verified...'
                  }
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F1F3F6] rounded-[12px] text-sm font-sans text-ink-primary focus:outline-none focus:ring-2 focus:ring-[#D63927]/30 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedAllowance(null)}
                  className="px-4 py-2 text-sm font-sans font-medium text-ink-secondary hover:bg-[#F1F3F6] rounded-[8px]"
                >
                  Cancel
                </button>
                <Button
                  variant={actionType === 'verify' ? 'primary' : 'secondary'}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : actionType === 'verify' ? 'Confirm verification' : 'Confirm decline'}
                </Button>
              </div>
            </form>
          </SheetModal>
        )}
      </div>
    </PageShell>
  );
};
