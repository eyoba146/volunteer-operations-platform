import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Payment, PaymentStatus, Application } from '../../types';
import { LedgerTable, LedgerColumn, Input, Select, Button, StatusMark, SheetModal, JourneyLog, JourneyItem, TopoBackdrop } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { 
  MagnifyingGlass, 
  Eye, 
  Plus,
  Check,
} from '@phosphor-icons/react';

export const FinancePaymentsPage: React.FC = () => {
  const { user, profile } = useAuth();
  const toast = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [waitingApps, setWaitingApps] = useState<Application[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [inspecting, setInspecting] = useState<Payment | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'log'>('log');

  // Record a payment modal
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [recordAppId, setRecordAppId] = useState('');
  const [recordAmount, setRecordAmount] = useState(200);
  const [recordRef, setRecordRef] = useState('');
  const [recordNote, setRecordNote] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [list, apps] = await Promise.all([
        api.getAllPayments({
          status: selectedStatus,
          search: search || undefined,
        }),
        api.getAllApplications(),
      ]);
      setPayments(list);
      // Filter applications that are accepted or submitted
      const unconfirmed = apps.filter((a) => a.status === 'accepted' || a.status === 'submitted');
      setWaitingApps(unconfirmed);
      if (unconfirmed.length > 0 && !recordAppId) {
        setRecordAppId(unconfirmed[0].id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedStatus, search]);

  const handleOpenRecordModal = () => {
    setRecordRef(`TB-MAN-${Date.now().toString().slice(-6)}`);
    setRecordAmount(200);
    setRecordNote('');
    setShowRecordModal(true);
  };

  const handleRecordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordAppId) {
      toast.error('Please select an applicant.');
      return;
    }
    if (!recordRef.trim()) {
      toast.error('Payment reference number is required.');
      return;
    }

    setIsRecording(true);
    try {
      await api.recordPayment({
        applicationId: recordAppId,
        amount: Number(recordAmount),
        referenceNumber: recordRef.trim(),
        note: recordNote.trim() || undefined,
        recordedBy: user?.id || 'usr-abel',
        recordedByName: profile?.fullName || user?.username || 'Abel Hailu',
      });
      toast.success('Payment recorded and Volunteer account activated successfully!');
      setShowRecordModal(false);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to record payment.');
    } finally {
      setIsRecording(false);
    }
  };

  const columns: LedgerColumn<Payment>[] = [
    {
      header: 'Settlement date',
      cell: (p) => (
        <span className="font-mono text-[13px] text-ink-primary">
          {new Date(p.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Reference and receipt',
      cell: (p) => (
        <div className="space-y-0.5">
          <span className="font-mono text-[13px] font-semibold text-ink-primary block">
            {p.telebirrReference}
          </span>
          {p.receiptNumber && (
            <span className="font-mono text-[13px] text-ink-tertiary block">
              Receipt: {p.receiptNumber}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Payer and phone',
      cell: (p) => (
        <div className="space-y-0.5 font-sans text-[13px]">
          <span className="font-semibold text-ink-primary block">{p.payerName || 'Applicant'}</span>
          <span className="font-mono text-ink-tertiary text-[13px] block">{p.payerPhone || '—'}</span>
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
      header: 'Status',
      cell: (p) => <StatusMark status={p.status} size="sm" />,
    },
    {
      header: 'Action',
      align: 'right',
      cell: (p) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setInspecting(p)}
          leftIcon={<Eye className="w-3.5 h-3.5" />}
        >
          View timeline
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] p-6 space-y-4">
        <TopoBackdrop color="#059669" opacity={0.06} />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4">
          <div className="space-y-1">
            <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-ink-primary leading-tight">
              Telebirr payments ledger
            </h1>
            <p className="font-sans text-sm text-ink-secondary mt-1">
              Settlement log of registration fees, timestamps, receipts, and resolution history.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              onClick={handleOpenRecordModal}
              className="bg-[#111315] hover:bg-black text-white text-xs"
              leftIcon={<Plus className="w-4 h-4" weight="bold" />}
            >
              Record a payment
            </Button>
            <span className="font-mono text-[13px] font-medium text-ink-primary bg-canvas-subdued px-3 py-1.5 rounded-[8px]">
              Total records: {payments.length}
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <Input
            placeholder="Search by Telebirr ref, receipt number, phone, or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftAddon={<MagnifyingGlass className="w-4 h-4" />}
          />

          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            options={[
              { value: 'all', label: 'All payment statuses' },
              { value: 'confirmed', label: 'Confirmed (Active)' },
              { value: 'waiting', label: 'Waiting for handshake' },
              { value: 'needs_review', label: 'Needs review' },
              { value: 'refund_requested', label: 'Refund requested' },
              { value: 'refunded', label: 'Refunded' },
              { value: 'failed', label: 'Failed' },
            ]}
          />
        </div>
      </div>

      <LedgerTable
        data={payments}
        columns={columns}
        keyExtractor={(p) => p.id}
        isLoading={isLoading}
      />

      {/* Payment Detail Drawer with Visual Timeline */}
      <SheetModal
        isOpen={inspecting !== null}
        onClose={() => setInspecting(null)}
        title="Transaction and settlement record"
        subtitle={`Reference: ${inspecting?.telebirrReference || ''}`}
        mode="sheet"
      >
        {inspecting && (
          <div className="space-y-6 text-left font-sans text-sm">
            {/* Amount & Status Card */}
            <div className="p-4 rounded-[16px] bg-white shadow-xs bg-white shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[13px] text-ink-tertiary block font-mono">Current status</span>
                <StatusMark status={inspecting.status} size="md" />
              </div>
              <div className="text-right">
                <span className="text-[13px] text-ink-tertiary block font-mono">Settlement amount</span>
                <span className="font-display text-2xl font-black text-ink-primary block leading-none">
                  ETB {inspecting.amount}.00
                </span>
              </div>
            </div>

            {/* Visual Settlement Timeline (Trail route step style) */}
            <div className="p-4 rounded-[16px] bg-white shadow-xs bg-white shadow-sm space-y-4">
              <span className="font-display text-lg font-bold text-ink-primary block pb-2">
                Settlement lifecycle timeline
              </span>

              <div className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#EDEFF2]">
                {/* Step 1: Session Dispatched */}
                <div className="relative space-y-0.5">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-ink-primary" />
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold text-[13px] text-ink-primary">1. Payment session initiated</span>
                    <span className="font-mono text-[13px] text-ink-tertiary">{new Date(inspecting.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-ink-secondary text-[13px]">
                    Applicant {inspecting.payerName || 'Candidate'} requested Telebirr prompt for ETB {inspecting.amount}.00 via phone {inspecting.payerPhone || 'recorded'}.
                  </p>
                </div>

                {/* Step 2: Telebirr Gateway Request */}
                <div className="relative space-y-0.5">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-ink-primary" />
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold text-[13px] text-ink-primary">2. Phone prompt dispatched</span>
                    <span className="font-mono text-[13px] text-ink-tertiary">Merchant #884120</span>
                  </div>
                  <p className="text-ink-secondary text-[13px]">
                    Telebirr network rail dispatched interactive PIN confirmation to subscriber wallet.
                  </p>
                </div>

                {/* Step 3: Transaction Outcome */}
                <div className="relative space-y-0.5">
                  <div className={`absolute -left-6 top-1 w-3 h-3 rounded-full ${
                    inspecting.status === 'confirmed' ? 'bg-role-volunteer' : inspecting.status === 'needs_review' ? 'bg-role-applicant' : 'bg-red-500'
                  } `} />
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold text-[13px] text-ink-primary">
                      {inspecting.status === 'confirmed' ? '3. Telebirr reference confirmed' : inspecting.status === 'needs_review' ? '3. Exception flagged for review' : '3. Transaction state'}
                    </span>
                    <span className="font-mono text-[13px] text-ink-tertiary">
                      {inspecting.confirmedAt ? new Date(inspecting.confirmedAt).toLocaleTimeString() : 'Pending'}
                    </span>
                  </div>
                  <p className="text-ink-secondary text-[13px] font-mono">
                    Ref: <strong className="text-ink-primary">{inspecting.telebirrReference}</strong>
                  </p>
                </div>

                {/* Step 4: Final Settlement / Receipt */}
                <div className="relative space-y-0.5">
                  <div className={`absolute -left-6 top-1 w-3 h-3 rounded-full ${
                    inspecting.receiptNumber ? 'bg-role-volunteer' : inspecting.refundedAt ? 'bg-red-500' : 'bg-[#CBD2DA]'
                  } `} />
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold text-[13px] text-ink-primary">
                      {inspecting.receiptNumber ? '4. Payment receipt issued' : inspecting.refundedAt ? '4. Refund processed' : '4. Awaiting resolution'}
                    </span>
                    {inspecting.receiptNumber && (
                      <span className="font-mono text-[13px] font-bold text-role-volunteer">{inspecting.receiptNumber}</span>
                    )}
                  </div>
                  <p className="text-ink-secondary text-[13px]">
                    {inspecting.receiptNumber
                      ? 'Volunteer rank credential generated and welcome orientation materials issued.'
                      : inspecting.refundReason
                      ? `Note: "${inspecting.refundReason}"`
                      : 'Transaction is undergoing manual reconciliation.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Payer Meta Information */}
            <div className="p-4 rounded-[16px] bg-white shadow-xs bg-canvas-subdued/40 space-y-2.5 font-mono text-[13px]">
              <div className="flex justify-between pb-1.5">
                <span className="text-ink-tertiary">Payer name:</span>
                <span className="font-bold text-ink-primary font-sans">{inspecting.payerName || 'Applicant'}</span>
              </div>
              <div className="flex justify-between pb-1.5">
                <span className="text-ink-tertiary">Payer phone:</span>
                <span className="font-bold text-ink-primary">{inspecting.payerPhone || '—'}</span>
              </div>
              <div className="flex justify-between pb-1.5">
                <span className="text-ink-tertiary">Telebirr reference:</span>
                <span className="font-bold text-ink-primary">{inspecting.telebirrReference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-tertiary">Created timestamp:</span>
                <span className="text-ink-primary">{new Date(inspecting.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </SheetModal>

      {/* Record a Payment Modal */}
      {showRecordModal && (
        <SheetModal
          isOpen={showRecordModal}
          onClose={() => setShowRecordModal(false)}
          title="Record a registration payment"
        >
          <form onSubmit={handleRecordSubmit} className="space-y-4 text-left">
            <p className="text-xs text-ink-secondary">
              Record a direct Telebirr, cash, or bank deposit settlement for an applicant. This immediately issues an official receipt and activates their account with Volunteer rank.
            </p>

            <div>
              <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                Select applicant *
              </label>
              {waitingApps.length === 0 ? (
                <div className="p-3 rounded-[8px] bg-[#F1F3F6] text-xs text-ink-tertiary">
                  No applicants awaiting payment found.
                </div>
              ) : (
                <select
                  value={recordAppId}
                  onChange={(e) => setRecordAppId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#F1F3F6] rounded-[10px] text-sm text-ink-primary focus:outline-none"
                  required
                >
                  {waitingApps.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.formData?.fullName || 'Applicant'} ({app.formData?.phone || 'No phone'}) — {app.status}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                Amount (ETB) *
              </label>
              <input
                type="number"
                value={recordAmount}
                onChange={(e) => setRecordAmount(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-[#F1F3F6] rounded-[10px] text-sm text-ink-primary font-mono focus:outline-none"
                required
                min={1}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                Reference number (Telebirr / Bank transaction ID) *
              </label>
              <input
                type="text"
                placeholder="e.g. TB-2026-987123"
                value={recordRef}
                onChange={(e) => setRecordRef(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#F1F3F6] rounded-[10px] text-sm text-ink-primary font-mono focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                Accounting note (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Manual branch deposit verified at Kirkos desk"
                value={recordNote}
                onChange={(e) => setRecordNote(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#F1F3F6] rounded-[10px] text-sm text-ink-primary focus:outline-none"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowRecordModal(false)} disabled={isRecording}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isRecording || waitingApps.length === 0}
                className="bg-[#111315] hover:bg-black text-white"
              >
                {isRecording ? 'Recording...' : 'Record and activate volunteer'}
              </Button>
            </div>
          </form>
        </SheetModal>
      )}
    </div>
  );
};
