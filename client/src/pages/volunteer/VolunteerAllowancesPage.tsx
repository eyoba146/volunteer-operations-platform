import React, { useState, useEffect } from 'react';
import { PageShell, StatusMark, Button } from '../../components/ui';
import { TopoBackdrop } from '../../components/signature/TopoBackdrop';
import { JourneyLog, JourneyLogItem } from '../../components/signature/JourneyLog';
import { MomentOverlay } from '../../components/signature/MomentOverlay';
import {
  Money,
  CheckCircle,
  Clock,
  DeviceMobile,
  Sparkle,
  Calendar,
  Warning,
  Info,
} from '@phosphor-icons/react';
import { AllowanceRequest } from '../../types';
import { getAllowances } from '../../api/allowances';
import { store } from '../../api/store';

export const VolunteerAllowancesPage: React.FC = () => {
  const currentUser = store.getCurrentUser();
  const [allowances, setAllowances] = useState<AllowanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [latestPaidAllowance, setLatestPaidAllowance] = useState<AllowanceRequest | null>(null);

  const loadData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const list = await getAllowances({ volunteerId: currentUser.id });
      setAllowances(list);

      // Check if there is a recently paid allowance to celebrate
      const paid = list.find((a) => a.status === 'paid');
      if (paid) {
        setLatestPaidAllowance(paid);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser?.id]);

  const paidTotal = allowances
    .filter((a) => a.status === 'paid')
    .reduce((sum, a) => sum + (a.totalAmount || 0), 0);

  const pendingTotal = allowances
    .filter((a) => a.status === 'submitted' || a.status === 'verified' || a.status === 'approved')
    .reduce((sum, a) => sum + (a.totalAmount || 0), 0);

  // Map to JourneyLog items
  const journeyItems: JourneyLogItem[] = allowances.map((a) => ({
    id: a.id,
    date: a.paidAt || a.createdAt,
    title: a.projectName || 'Community Project',
    subtitle: `${a.days} field days • Status: ${a.status}`,
    status:
      a.status === 'paid' || a.status === 'approved'
        ? 'approved'
        : a.status === 'rejected' || a.status === 'failed'
        ? 'declined'
        : 'logged',
    statusLabel: a.status === 'paid' ? 'Paid via Telebirr' : a.status === 'approved' ? 'Approved for payment' : a.status === 'verified' ? 'Verified by supervisor' : a.status === 'submitted' ? 'In review' : a.status,
    primaryNumeral: `ETB ${a.totalAmount.toLocaleString()}`,
    details: [
      { label: 'Allowance Reference', value: a.allowanceNumber },
      { label: 'Project Charter', value: a.projectName || 'Project' },
      { label: 'Operating Branch', value: a.branchName || 'Branch' },
      { label: 'Duration Covered', value: `${a.days} days @ ETB ${a.allowancePerDay}/day` },
      { label: 'Field Supervisor', value: a.supervisorName || 'Team Lead' },
      { label: 'Supervisor Note', value: a.supervisorNotes || 'Attendance confirmed' },
      ...(a.paymentReference ? [{ label: 'Telebirr Transaction Ref', value: a.paymentReference }] : []),
      ...(a.rejectionReason ? [{ label: 'Decline Note', value: a.rejectionReason }] : []),
    ],
  }));

  return (
    <PageShell page="volunteer/allowances" signature="TopoBackdrop">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Editorial Header */}
        <div className="space-y-1">
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink-primary tracking-tight">
            My allowances
          </h1>
          <p className="font-sans text-base text-ink-secondary">
            Field service stipends, verification progress, and Telebirr mobile wallet disbursements.
          </p>
        </div>

        {/* Lead Figure Summary Banner */}
        <div className="relative rounded-[16px] bg-[#1E824C]/5 p-6 sm:p-8 overflow-hidden space-y-6">
          <TopoBackdrop color="#1E824C" opacity={0.06} />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="font-sans text-xs font-semibold uppercase tracking-wider text-ink-secondary">
                Total Stipends Received
              </div>
              <div className="font-display font-bold text-4xl sm:text-5xl text-ink-primary tracking-tight">
                ETB {paidTotal.toLocaleString()}
              </div>
              <div className="font-sans text-sm text-ink-secondary">
                ETB {pendingTotal.toLocaleString()} currently in preparation or awaiting budget authority approval.
              </div>
            </div>

            {latestPaidAllowance && (
              <Button
                variant="secondary"
                onClick={() => setShowCelebration(true)}
                className="inline-flex items-center gap-1.5 self-start sm:self-auto text-xs"
              >
                <Sparkle className="w-4 h-4 text-emerald-600" weight="bold" />
                <span>View receipt moment</span>
              </Button>
            )}
          </div>
        </div>

        {/* Allowances Timeline (JourneyLog) */}
        <div className="space-y-4">
          <div className="space-y-0.5">
            <h2 className="font-display font-bold text-xl text-ink-primary">
              Stipend timeline & vouchers
            </h2>
            <p className="font-sans text-xs text-ink-secondary">
              Chronological status of all prepared, verified, and paid allowances.
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm font-sans text-ink-secondary">
              Loading your allowances...
            </div>
          ) : allowances.length === 0 ? (
            <div className="p-12 rounded-[16px] bg-[#F7F8FA] text-center space-y-3">
              <Money className="w-10 h-10 mx-auto text-ink-secondary/50" weight="bold" />
              <div className="font-display font-bold text-lg text-ink-primary">
                No allowance requests yet
              </div>
              <p className="font-sans text-sm text-ink-secondary max-w-md mx-auto">
                Allowances are prepared by your territory Manager when you serve on funded community projects.
              </p>
            </div>
          ) : (
            <JourneyLog
              items={journeyItems}
              leadSummary={{
                leadNumeral: `ETB ${paidTotal.toLocaleString()}`,
                label: 'Disbursed To Date',
                inlineSentence: `${allowances.filter((a) => a.status === 'paid').length} payments confirmed to your mobile wallet.`,
              }}
            />
          )}
        </div>

        {/* Celebratory MomentOverlay (Requirement 5) */}
        {latestPaidAllowance && (
          <MomentOverlay
            isOpen={showCelebration}
            onClose={() => setShowCelebration(false)}
            title="Allowance payment disbursed"
            subtitle={`ETB ${latestPaidAllowance.totalAmount.toLocaleString()} has been transferred to your Telebirr wallet for ${latestPaidAllowance.projectName}.`}
            type="payment_success"
            primaryActionLabel="View allowance timeline →"
            onPrimaryAction={() => setShowCelebration(false)}
            detailsSlot={
              <div className="p-4 rounded-[12px] bg-emerald-50 text-xs font-sans text-emerald-900 space-y-1">
                <div>Reference: <span className="font-bold">{latestPaidAllowance.paymentReference}</span></div>
                <div>Days covered: <span className="font-bold">{latestPaidAllowance.days} service days</span></div>
                <div>Project: <span className="font-bold">{latestPaidAllowance.projectName}</span></div>
              </div>
            }
          />
        )}
      </div>
    </PageShell>
  );
};
