import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Payment, Application } from '../../types';
import { LedgerTable, LedgerColumn, Button, StatusMark, SheetModal, Input, EmptyState } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { 
  Check, 
  ArrowCounterClockwise, 
  ShieldCheck, 
} from '@phosphor-icons/react';

export const FinanceNeedsReviewPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [waitingApplications, setWaitingApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Resolution modal state
  const [targetPayment, setTargetPayment] = useState<Payment | null>(null);
  const [actionType, setActionType] = useState<'match' | 'refund'>('match');
  const [selectedApplicantUserId, setSelectedApplicantUserId] = useState<string>('');
  const [manualTelebirrRef, setManualTelebirrRef] = useState('');
  const [actionNote, setActionNote] = useState('');

  const toast = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [reviewList, appList] = await Promise.all([
        api.getNeedsReviewPayments(),
        api.getAllApplications(),
      ]);
      setPayments(reviewList);
      // Find applicants who are accepted but payment is not confirmed yet
      const unconfirmed = appList.filter(
        (a) => a.status === 'accepted' || a.status === 'submitted'
      );
      setWaitingApplications(unconfirmed);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenResolve = (payment: Payment, mode: 'match' | 'refund') => {
    setTargetPayment(payment);
    setActionType(mode);
    setManualTelebirrRef(payment.telebirrReference);
    setSelectedApplicantUserId(payment.userId || (waitingApplications[0]?.userId || ''));
    setActionNote(
      mode === 'match'
        ? `Manual phone verification confirmed by finance. Matched to applicant ${payment.payerName || 'record'}.`
        : 'Applicant requested refund or double payment return.'
    );
  };

  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !targetPayment) return;

    if (!actionNote.trim()) {
      toast.error('A written explanation is required for adjustments.');
      return;
    }

    setIsProcessing(true);
    try {
      await api.resolveNeedsReviewPayment(
        targetPayment.id,
        actionType,
        actionType === 'match' ? (selectedApplicantUserId || targetPayment.userId) : undefined,
        actionNote.trim(),
        user.id,
        profile?.fullName || user.username
      );

      if (actionType === 'match') {
        toast.success(`Payment matched! Reference ${targetPayment.telebirrReference} is confirmed and Volunteer rank activated.`);
      } else {
        toast.info(`Refund of ETB ${targetPayment.amount}.00 processed for reference ${targetPayment.telebirrReference}.`);
      }

      setTargetPayment(null);
      setActionNote('');
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Could not resolve payment.');
    } finally {
      setIsProcessing(false);
    }
  };

  const columns: LedgerColumn<Payment>[] = [
    {
      header: 'Telebirr reference',
      cell: (p) => (
        <div className="space-y-0.5">
          <span className="font-mono text-[13px] font-semibold text-ink-primary block">
            {p.telebirrReference}
          </span>
          <span className="font-mono text-[13px] text-ink-tertiary block">
            {new Date(p.createdAt).toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      header: 'Payer and phone',
      cell: (p) => (
        <div className="space-y-0.5 font-sans text-[13px]">
          <span className="font-semibold text-ink-primary block">{p.payerName || 'Unknown payer'}</span>
          <span className="font-mono text-ink-tertiary text-[13px] block">{p.payerPhone || '—'}</span>
        </div>
      ),
    },
    {
      header: 'Exception reason',
      cell: (p) => (
        <div className="space-y-0.5 max-w-sm">
          <span className="text-[13px] text-role-applicant font-sans font-medium block">
            {p.refundReason || 'Handshake timeout awaiting verification.'}
          </span>
          <span className="font-mono text-[13px] text-ink-tertiary block">
            Linked application: {p.applicationId || 'Unlinked'}
          </span>
        </div>
      ),
    },
    {
      header: 'Amount',
      align: 'right',
      cell: (p) => (
        <span className="font-mono text-[13px] font-semibold text-ink-primary">
          ETB {p.amount}.00
        </span>
      ),
    },
    {
      header: 'Resolution action',
      align: 'right',
      cell: (p) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleOpenResolve(p, 'match')}
            leftIcon={<Check className="w-3.5 h-3.5" weight="bold" />}
          >
            Match and activate
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleOpenResolve(p, 'refund')}
            leftIcon={<ArrowCounterClockwise className="w-3.5 h-3.5" />}
          >
            Refund
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Top Header Card */}
      <div className="rounded-[10px] bg-white p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4">
          <div className="space-y-1">
            <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-ink-primary leading-tight">
              Payments needing review
            </h1>
            <p className="font-sans text-sm text-ink-secondary mt-1">
              Reconcile incoming Telebirr settlements where phone numbers, duplicate transfers, or network delays required manual verification.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`font-mono text-[13px] font-medium px-3 py-1.5 rounded-[8px] ${
              payments.length > 0 
                ? 'bg-amber-50 text-role-applicant border-amber-200' 
                : 'bg-emerald-50 text-role-volunteer border-emerald-200'
            } `}>
              Exceptions in queue: {payments.length}
            </span>
          </div>
        </div>
      </div>

      {payments.length === 0 && !isLoading ? (
        <EmptyState
          icon={<ShieldCheck className="w-8 h-8 text-role-volunteer" weight="fill" />}
          title="Review queue is clear"
          description="Every incoming Telebirr registration fee has been matched and reconciled with applicant profiles."
        />
      ) : (
        <LedgerTable
          data={payments}
          columns={columns}
          keyExtractor={(p) => p.id}
          isLoading={isLoading}
        />
      )}

      {/* Resolution Confirmation Modal */}
      <SheetModal
        isOpen={targetPayment !== null}
        onClose={() => setTargetPayment(null)}
        title={actionType === 'match' ? 'Match payment by Telebirr reference' : 'Process Telebirr refund'}
        subtitle={`Ref: ${targetPayment?.telebirrReference || ''} • Amount: ETB ${targetPayment?.amount}.00`}
        mode="modal"
        maxWidth="md"
      >
        <form onSubmit={handleResolveSubmit} className="space-y-4 text-left font-sans text-sm">
          <p className="text-ink-secondary leading-relaxed text-[13px]">
            {actionType === 'match'
              ? 'This action force-matches the incoming Telebirr reference to the selected applicant record, generates a payment receipt, and immediately activates their Volunteer rank.'
              : 'This action initiates a refund of ETB 200.00 to the payer’s Telebirr wallet. A written explanation is required.'}
          </p>

          {/* Reference Input */}
          <div className="space-y-1">
            <label className="block text-[13px] font-semibold text-ink-primary">
              Telebirr reference number
            </label>
            <Input
              value={manualTelebirrRef}
              onChange={(e) => setManualTelebirrRef(e.target.value)}
              required
            />
          </div>

          {/* Matching Target Applicant */}
          {actionType === 'match' && (
            <div className="space-y-1">
              <label className="block text-[13px] font-semibold text-ink-primary">
                Match to applicant record
              </label>
              <select
                value={selectedApplicantUserId}
                onChange={(e) => setSelectedApplicantUserId(e.target.value)}
                className="w-full bg-white text-ink-primary font-sans text-sm rounded-[8px] p-2.5 focus:ring-1 focus:ring-ink-primary"
                required
              >
                {targetPayment?.payerName && (
                  <option value={targetPayment.userId}>
                    {targetPayment.payerName} ({targetPayment.payerPhone || 'Recorded'})
                  </option>
                )}
                {waitingApplications.map((app) => (
                  <option key={app.id} value={app.userId}>
                    {app.formData?.fullName || 'Applicant'} ({app.formData?.phone || 'No phone'}) • {app.formData?.area || 'Addis Ababa'}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Written Reason */}
          <div className="space-y-1">
            <label className="block text-[13px] font-semibold text-ink-primary">
              Written verification reason
            </label>
            <textarea
              rows={3}
              value={actionNote}
              onChange={(e) => setActionNote(e.target.value)}
              placeholder="e.g. Phone confirmed with applicant; Telebirr transaction receipt verified..."
              className="w-full bg-white text-ink-primary font-sans text-sm rounded-[8px] p-2.5 focus:ring-1 focus:ring-ink-primary"
              required
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setTargetPayment(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={actionType === 'match' ? 'primary' : 'danger'}
              isLoading={isProcessing}
            >
              {actionType === 'match' ? 'Confirm match and activate volunteer' : 'Confirm Telebirr refund'}
            </Button>
          </div>
        </form>
      </SheetModal>
    </div>
  );
};
