import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Payment } from '../../types';
import { LedgerTable, LedgerColumn, Button, StatusMark, SheetModal, Skeleton, EmptyState } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { Warning, Check, ArrowCounterClockwise, ShieldCheck, UserCheck } from '@phosphor-icons/react';

export const FinanceNeedsReviewPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Resolution modal state
  const [targetPayment, setTargetPayment] = useState<Payment | null>(null);
  const [actionType, setActionType] = useState<'match' | 'refund'>('match');
  const [actionNote, setActionNote] = useState('');

  const toast = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const list = await api.getNeedsReviewPayments();
      setPayments(list);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !targetPayment) return;

    setIsProcessing(true);
    try {
      await api.resolveNeedsReviewPayment(
        targetPayment.id,
        actionType,
        undefined,
        actionNote.trim(),
        user.id,
        profile?.fullName || user.username
      );

      if (actionType === 'match') {
        toast.success(`Payment matched! Reference ${targetPayment.telebirrReference} is confirmed and account activated.`);
      } else {
        toast.info(`Refund of ETB ${targetPayment.amount} processed for reference ${targetPayment.telebirrReference}.`);
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
      header: 'Telebirr Reference',
      cell: (p) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs font-bold text-ink-primary block">
            {p.telebirrReference}
          </span>
          <span className="font-mono text-[10px] text-ink-tertiary block">
            {new Date(p.createdAt).toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      header: 'Payer & Phone',
      cell: (p) => (
        <div className="space-y-0.5 font-sans text-xs">
          <span className="font-semibold text-ink-primary block">{p.payerName || 'Unknown Payer'}</span>
          <span className="font-mono text-ink-tertiary text-[11px] block">{p.payerPhone || '—'}</span>
        </div>
      ),
    },
    {
      header: 'Flagged Exception Reason',
      cell: (p) => (
        <div className="space-y-0.5 max-w-sm">
          <span className="text-xs text-civic-rust font-sans font-medium block">
            {p.refundReason || 'Handshake timeout awaiting Finance audit.'}
          </span>
          <span className="font-mono text-[10px] text-ink-tertiary block">
            Linked App ID: {p.applicationId}
          </span>
        </div>
      ),
    },
    {
      header: 'Amount',
      align: 'right',
      cell: (p) => (
        <span className="font-mono text-xs font-bold text-ink-primary">
          ETB {p.amount}.00
        </span>
      ),
    },
    {
      header: 'Resolve Action',
      align: 'right',
      cell: (p) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setTargetPayment(p);
              setActionType('match');
              setActionNote('Manual phone audit confirmed by Finance.');
            }}
            leftIcon={<Check className="w-3.5 h-3.5" weight="bold" />}
          >
            Match & Activate
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              setTargetPayment(p);
              setActionType('refund');
              setActionNote('Duplicate payment or applicant requested refund.');
            }}
            leftIcon={<ArrowCounterClockwise className="w-3.5 h-3.5" />}
          >
            Refund
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-border pb-5 space-y-1">
        <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary block">
          FINANCIAL EXCEPTION DESK
        </span>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-primary">
          Payments Needing Review
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink-secondary">
          Investigate incoming Telebirr settlements where phone numbers or timing caused automatic reconciliation delays.
        </p>
      </div>

      {payments.length === 0 && !isLoading ? (
        <EmptyState
          icon={<ShieldCheck className="w-6 h-6 text-civic-green" />}
          title="Review queue clear"
          description="Every incoming Telebirr registration payment has been matched and reconciled with applicant profiles."
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
        title={actionType === 'match' ? 'Confirm & Match Payment' : 'Process Telebirr Refund'}
        subtitle={`Ref: ${targetPayment?.telebirrReference || ''} • Amount: ETB ${targetPayment?.amount}.00`}
        mode="modal"
        maxWidth="md"
      >
        <form onSubmit={handleResolveSubmit} className="space-y-4 text-left">
          <p className="font-sans text-xs text-ink-secondary leading-relaxed">
            {actionType === 'match'
              ? 'This will force-match the incoming settlement to the applicant record, confirm the payment, generate a tax receipt, and immediately activate their Member rank.'
              : 'This will return ETB 200 to the payer’s Telebirr wallet and update the transaction ledger.'}
          </p>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-secondary">
              Resolution Audit Reason
            </label>
            <input
              type="text"
              value={actionNote}
              onChange={(e) => setActionNote(e.target.value)}
              placeholder="e.g. Verified by phone call with applicant; kebele ID matches..."
              className="w-full bg-canvas-raised text-ink-primary font-sans text-xs rounded border border-border p-2.5 focus:border-ink-primary outline-none"
              required
            />
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-end gap-3">
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
              {actionType === 'match' ? 'Confirm Matching & Activate' : 'Confirm Telebirr Refund'}
            </Button>
          </div>
        </form>
      </SheetModal>
    </div>
  );
};

