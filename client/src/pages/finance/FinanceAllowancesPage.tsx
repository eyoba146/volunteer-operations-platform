import React, { useState, useEffect } from 'react';
import { PageShell, StatusMark, Button, SheetModal } from '../../components/ui';
import { TopoBackdrop } from '../../components/signature/TopoBackdrop';
import { JourneyLog, JourneyLogItem } from '../../components/signature/JourneyLog';
import {
  Wallet,
  Money,
  CheckCircle,
  Warning,
  ArrowsClockwise,
  Clock,
  Phone,
  DeviceMobile,
  ArrowRight,
} from '@phosphor-icons/react';
import { AllowanceRequest } from '../../types';
import { getAllowances, disburseAllowance, retryDisbursement, computeProjectBudgetMetrics } from '../../api/allowances';
import { store } from '../../api/store';

export const FinanceAllowancesPage: React.FC = () => {
  const [allowances, setAllowances] = useState<AllowanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Telebirr Disbursement Modal
  const [selectedAllowance, setSelectedAllowance] = useState<AllowanceRequest | null>(null);
  const [simulationMode, setSimulationMode] = useState<'success' | 'failure' | 'delay'>('success');
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalError, setModalError] = useState('');

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

  const handleDisburse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAllowance) return;

    setIsProcessing(true);
    setModalError('');
    try {
      await disburseAllowance(selectedAllowance.id, simulationMode);
      setSelectedAllowance(null);
      loadData();
    } catch (err: any) {
      setModalError(err.message || 'Disbursement failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = async (id: string) => {
    try {
      const retried = await retryDisbursement(id);
      setSelectedAllowance(retried);
      setSimulationMode('success');
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const approvedQueue = allowances.filter((a) => a.status === 'approved');
  const failedQueue = allowances.filter((a) => a.status === 'failed');
  const paidHistory = allowances.filter((a) => a.status === 'paid');

  const totalDisbursed = paidHistory.reduce((sum, a) => sum + (a.totalAmount || 0), 0);
  const totalReservedWaiting = approvedQueue.reduce((sum, a) => sum + (a.totalAmount || 0), 0);

  // Convert paid allowances to JourneyLog items
  const journeyItems: JourneyLogItem[] = paidHistory.map((a) => ({
    id: a.id,
    date: a.paidAt || a.createdAt,
    title: `${a.volunteerName} — ${a.projectName}`,
    subtitle: `${a.days} days field service • Telebirr Ref: ${a.paymentReference || 'TB-OUT-PENDING'}`,
    status: 'approved',
    statusLabel: 'Disbursed',
    primaryNumeral: `ETB ${a.totalAmount.toLocaleString()}`,
    details: [
      { label: 'Allowance Number', value: a.allowanceNumber },
      { label: 'Volunteer Recipient', value: `${a.volunteerName} (${a.volunteerPhone || '+251 92 345 6789'})` },
      { label: 'Project Charter', value: a.projectName || 'Field Project' },
      { label: 'Operating Branch', value: a.branchName || 'Branch' },
      { label: 'Service Duration', value: `${a.days} days @ ETB ${a.allowancePerDay}/day` },
      { label: 'Supervisor Verification', value: a.verifiedByName ? `${a.verifiedByName} ("${a.supervisorNotes || 'Attendance confirmed'}")` : 'Verified' },
      { label: 'Budget Authorization', value: a.approvedByName || 'Super Admin' },
      { label: 'Telebirr Transaction', value: a.paymentReference || 'Confirmed' },
    ],
  }));

  return (
    <PageShell page="finance/allowances" signature="TopoBackdrop">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Editorial Header */}
        <div className="space-y-1">
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink-primary tracking-tight">
            Pay volunteer allowances
          </h1>
          <p className="font-sans text-base text-ink-secondary">
            Process field stipend payouts via Telebirr bulk wallet disbursement and manage transaction history.
          </p>
        </div>

        {/* Lead Figure Summary Banner */}
        <div className="p-6 rounded-[16px] bg-[#F7F8FA] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="font-sans text-xs font-semibold uppercase tracking-wider text-ink-secondary">
              Total Volunteer Stipends Disbursed
            </div>
            <div className="font-display font-bold text-4xl sm:text-5xl text-ink-primary tracking-tight">
              ETB {totalDisbursed.toLocaleString()}
            </div>
            <div className="font-sans text-sm text-ink-secondary">
              ETB {totalReservedWaiting.toLocaleString()} currently reserved across {approvedQueue.length} approved requests awaiting Telebirr transfer.
            </div>
          </div>

          <div className="p-4 rounded-[12px] bg-white text-xs font-sans space-y-1.5 self-start md:self-auto">
            <div className="text-ink-secondary">Disbursement Partner:</div>
            <div className="font-display font-bold text-base text-amber-700 flex items-center gap-1.5">
              <DeviceMobile className="w-4 h-4" weight="bold" />
              <span>Telebirr Bulk Payouts</span>
            </div>
            <div className="text-ink-secondary">Shortcode: 884120 • Merchant VTS</div>
          </div>
        </div>

        {/* Section 1: Ready to Disburse Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-ink-primary">
              Ready for Telebirr disbursement ({approvedQueue.length})
            </h2>
            <span className="text-xs font-sans text-ink-secondary">
              Budget authority approved
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm font-sans text-ink-secondary">
              Loading approved disbursement queue...
            </div>
          ) : approvedQueue.length === 0 ? (
            <div className="p-8 rounded-[16px] bg-[#F7F8FA] text-center space-y-2">
              <CheckCircle className="w-8 h-8 mx-auto text-emerald-600" weight="bold" />
              <div className="font-display font-bold text-base text-ink-primary">
                All approved allowances paid
              </div>
              <p className="font-sans text-xs text-ink-secondary">
                No allowance requests currently awaiting Finance disbursement.
              </p>
            </div>
          ) : (
            <div className="rounded-[16px] bg-[#F7F8FA] p-3 space-y-3">
              {approvedQueue.map((alw) => (
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
                      <StatusMark status="approved" label="Approved" />
                    </div>

                    <div className="font-sans text-xs text-ink-secondary space-y-1">
                      <div>
                        Project: <span className="font-medium text-ink-primary">{alw.projectName}</span> • {alw.branchName}
                      </div>
                      <div>
                        Mobile wallet: <span className="font-semibold text-ink-primary">{alw.volunteerPhone || '+251 92 345 6789'}</span>
                      </div>
                      <div>
                        Authorized by: {alw.approvedByName || 'Budget Authority'} • Supervisor: {alw.supervisorName || 'Team Lead'}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
                    <div className="text-right">
                      <div className="font-display font-bold text-2xl text-ink-primary">
                        ETB {alw.totalAmount.toLocaleString()}
                      </div>
                      <div className="font-sans text-xs text-ink-secondary">
                        {alw.days} days @ ETB {alw.allowancePerDay}/day
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      onClick={() => {
                        setSelectedAllowance(alw);
                        setSimulationMode('success');
                        setModalError('');
                      }}
                      className="inline-flex items-center gap-1.5"
                    >
                      <Wallet className="w-4 h-4" weight="bold" />
                      <span>Disburse via Telebirr</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Failed Disbursements Queue (Retry Available) */}
        {failedQueue.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-xl text-red-700 flex items-center gap-2">
                <Warning className="w-5 h-5" weight="bold" />
                <span>Failed disbursements ({failedQueue.length})</span>
              </h2>
              <span className="text-xs font-sans text-ink-secondary">
                Action required: retry transfer
              </span>
            </div>

            <div className="rounded-[16px] bg-red-50/60 p-3 space-y-3">
              {failedQueue.map((alw) => (
                <div
                  key={alw.id}
                  className="p-4 rounded-[12px] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-ink-secondary">{alw.allowanceNumber}</span>
                      <span className="font-bold text-sm text-ink-primary">{alw.volunteerName}</span>
                      <StatusMark status="declined" label="Failed" />
                    </div>
                    <div className="text-xs font-sans text-red-700 font-medium">
                      Issue: {alw.failureReason || 'Telebirr core gateway timeout.'}
                    </div>
                    <div className="text-xs font-sans text-ink-secondary">
                      {alw.projectName} • Wallet: {alw.volunteerPhone || '+251 92 345 6789'}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="font-display font-bold text-lg text-ink-primary">
                      ETB {alw.totalAmount.toLocaleString()}
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => handleRetry(alw.id)}
                      className="inline-flex items-center gap-1 text-xs"
                    >
                      <ArrowsClockwise className="w-3.5 h-3.5" weight="bold" />
                      <span>Retry</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Disbursement Payment History (JourneyLog) */}
        <div className="space-y-4 pt-4">
          <div className="space-y-0.5">
            <h2 className="font-display font-bold text-xl text-ink-primary">
              Disbursement payment history
            </h2>
            <p className="font-sans text-xs text-ink-secondary">
              Chronological log of completed Telebirr stipend transfers and reference vouchers.
            </p>
          </div>

          {paidHistory.length === 0 ? (
            <div className="p-8 rounded-[16px] bg-[#F7F8FA] text-center text-sm font-sans text-ink-secondary">
              No completed allowance payments recorded yet.
            </div>
          ) : (
            <JourneyLog
              items={journeyItems}
              leadSummary={{
                leadNumeral: `ETB ${totalDisbursed.toLocaleString()}`,
                label: 'Total Paid Out',
                inlineSentence: `${paidHistory.length} successful allowance disbursements via Telebirr bulk wallet.`,
              }}
            />
          )}
        </div>

        {/* Telebirr Simulation Modal */}
        {selectedAllowance && (
          <SheetModal
            isOpen={!!selectedAllowance}
            onClose={() => setSelectedAllowance(null)}
            title="Telebirr bulk disbursement"
            subtitle={`Authorize voucher payout to ${selectedAllowance.volunteerName}.`}
          >
            <form onSubmit={handleDisburse} className="space-y-5">
              {modalError && (
                <div className="p-3 rounded-[12px] bg-red-50 text-red-700 text-xs font-sans">
                  {modalError}
                </div>
              )}

              {/* Saffron Telebirr Voucher Card */}
              <div className="p-5 rounded-[16px] bg-gradient-to-br from-[#FFF8E7] to-[#FFF1D0] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-display font-bold text-sm text-amber-900 flex items-center gap-1.5">
                    <DeviceMobile className="w-4 h-4" weight="bold" />
                    <span>Telebirr Disbursement Voucher</span>
                  </div>
                  <span className="font-sans text-xs font-semibold px-2 py-0.5 rounded-[4px] bg-amber-200/60 text-amber-900">
                    {selectedAllowance.allowanceNumber}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <div className="font-sans text-xs text-amber-800">Transfer Amount</div>
                  <div className="font-display font-bold text-3xl sm:text-4xl text-amber-950 tracking-tight">
                    ETB {selectedAllowance.totalAmount.toLocaleString()}
                  </div>
                </div>

                <div className="pt-2 text-xs font-sans text-amber-900 space-y-1">
                  <div>Recipient: <span className="font-bold">{selectedAllowance.volunteerName}</span></div>
                  <div>Mobile Wallet: <span className="font-bold">{selectedAllowance.volunteerPhone || '+251 92 345 6789'}</span></div>
                  <div>Project: <span className="font-bold">{selectedAllowance.projectName}</span></div>
                  <div>Covering: <span className="font-bold">{selectedAllowance.days} service days</span></div>
                </div>
              </div>

              {/* Simulation Mode Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-sans font-semibold text-ink-secondary">
                  Telebirr Gateway Simulation Outcome (Prototype Control)
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'success', label: 'Success — instant wallet credit with transaction ref' },
                    { value: 'failure', label: 'Failure — simulated network timeout (enables retry)' },
                    { value: 'delay', label: 'Delayed — operator pending verification' },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-3 p-3 rounded-[12px] cursor-pointer transition-colors ${
                        simulationMode === opt.value ? 'bg-[#F1F3F6] font-semibold text-ink-primary' : 'bg-white hover:bg-[#F7F8FA] text-ink-secondary'
                      }`}
                    >
                      <input
                        type="radio"
                        name="simMode"
                        value={opt.value}
                        checked={simulationMode === opt.value}
                        onChange={() => setSimulationMode(opt.value as any)}
                        className="text-amber-600 focus:ring-0"
                      />
                      <span className="text-xs font-sans">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedAllowance(null)}
                  className="px-4 py-2 text-sm font-sans font-medium text-ink-secondary hover:bg-[#F1F3F6] rounded-[8px]"
                >
                  Cancel
                </button>
                <Button variant="primary" type="submit" disabled={isProcessing}>
                  {isProcessing ? 'Communicating with Telebirr...' : 'Confirm disbursement'}
                </Button>
              </div>
            </form>
          </SheetModal>
        )}
      </div>
    </PageShell>
  );
};
