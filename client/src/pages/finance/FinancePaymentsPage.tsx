import React, { useState, useEffect } from 'react';
import * as api from '../../api';
import { Payment, PaymentStatus } from '../../types';
import { LedgerTable, LedgerColumn, Input, Select, Button, StatusMark, SheetModal, Skeleton } from '../../components/ui';
import { 
  MagnifyingGlass, 
  Money, 
  Eye, 
  DownloadSimple, 
  CheckCircle, 
  Clock, 
  Receipt, 
  ArrowCounterClockwise,
  Warning
} from '@phosphor-icons/react';

export const FinancePaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [inspecting, setInspecting] = useState<Payment | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const list = await api.getAllPayments({
          status: selectedStatus,
          search: search || undefined,
        });
        setPayments(list);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [selectedStatus, search]);

  const columns: LedgerColumn<Payment>[] = [
    {
      header: 'Settlement Date',
      cell: (p) => (
        <span className="font-mono text-xs text-ink-primary">
          {new Date(p.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Reference & Receipt',
      cell: (p) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs font-bold text-ink-primary block">
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
      header: 'Payer & Phone',
      cell: (p) => (
        <div className="space-y-0.5 font-sans text-xs">
          <span className="font-semibold text-ink-primary block">{p.payerName || 'Applicant'}</span>
          <span className="font-mono text-ink-tertiary text-[13px] block">{p.payerPhone || '—'}</span>
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
          View Timeline
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div
        className="border-4 border-ink-primary bg-white p-6 sm:p-8 space-y-4 shadow-ticket"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-ink-primary pb-5">
          <div className="space-y-1">
            <span className="font-sans text-xs font-bold text-ink-primary tracking-tight block">
              Ethio Telecom Settlement Records
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tight text-ink-primary leading-none">
              Telebirr Payments Ledger
            </h1>
            <p className="font-sans text-xs sm:text-sm text-ink-secondary mt-1">
              Complete settlement log of registration fees, timestamps, receipts, and resolution audit trails.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-white bg-ink-primary px-3 py-1.5 shadow-sm">
              Total Records: {payments.length}
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
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
              { value: 'all', label: 'All Payment Statuses' },
              { value: 'confirmed', label: 'Confirmed (Active)' },
              { value: 'waiting', label: 'Waiting for Handshake' },
              { value: 'needs_review', label: 'Needs Review' },
              { value: 'refund_requested', label: 'Refund Requested' },
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
        title="Transaction & Settlement Record"
        subtitle={`Reference: ${inspecting?.telebirrReference || ''}`}
        mode="sheet"
      >
        {inspecting && (
          <div className="space-y-6 text-left font-sans text-xs">
            {/* Amount & Status Card */}
            <div className="p-4 border-2 border-ink-primary bg-white shadow-ticket flex items-center justify-between">
              <div>
                <span className="text-[13px] text-ink-tertiary block font-mono">Current Status</span>
                <StatusMark status={inspecting.status} size="md" />
              </div>
              <div className="text-right">
                <span className="text-[13px] text-ink-tertiary block font-mono">Settlement Amount</span>
                <span className="font-display text-3xl font-black text-ink-primary block leading-none">
                  ETB {inspecting.amount}.00
                </span>
              </div>
            </div>

            {/* Visual Settlement Timeline (Trail route step style) */}
            <div className="p-4 border-2 border-ink-primary bg-white shadow-ticket space-y-4">
              <span className="font-display text-lg font-black text-ink-primary block border-b-2 border-border pb-2">
                Settlement Lifecycle Timeline
              </span>

              <div className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-ink-primary">
                {/* Step 1: Session Dispatched */}
                <div className="relative space-y-0.5">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-ink-primary border-2 border-white ring-2 ring-ink-primary" />
                  <div className="flex items-baseline justify-between">
                    <span className="font-bold text-xs text-ink-primary">1. Payment Session Initiated</span>
                    <span className="font-mono text-[13px] text-ink-tertiary">{new Date(inspecting.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-ink-secondary text-xs">
                    Applicant {inspecting.payerName || 'Candidate'} requested Telebirr prompt for ETB {inspecting.amount}.00 via phone {inspecting.payerPhone || 'recorded'}.
                  </p>
                </div>

                {/* Step 2: Telebirr Gateway Request */}
                <div className="relative space-y-0.5">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-ink-primary border-2 border-white ring-2 ring-ink-primary" />
                  <div className="flex items-baseline justify-between">
                    <span className="font-bold text-xs text-ink-primary">2. USSD & Handset Prompt Dispatched</span>
                    <span className="font-mono text-[13px] text-ink-tertiary">Merchant #884120</span>
                  </div>
                  <p className="text-ink-secondary text-xs">
                    Ethio Telecom payment rail dispatched interactive PIN confirmation to subscriber wallet.
                  </p>
                </div>

                {/* Step 3: Transaction Outcome */}
                <div className="relative space-y-0.5">
                  <div className={`absolute -left-6 top-1 w-3 h-3 rounded-full border-2 border-white ring-2 ${
                    inspecting.status === 'confirmed' ? 'bg-civic-green ring-civic-green' : inspecting.status === 'needs_review' ? 'bg-amber-500 ring-amber-500' : 'bg-red-500 ring-red-500'
                  }`} />
                  <div className="flex items-baseline justify-between">
                    <span className="font-bold text-xs text-ink-primary">
                      {inspecting.status === 'confirmed' ? '3. Telebirr Reference Confirmed' : inspecting.status === 'needs_review' ? '3. Exception Flagged for Review' : '3. Transaction State'}
                    </span>
                    <span className="font-mono text-[13px] text-ink-tertiary">
                      {inspecting.confirmedAt ? new Date(inspecting.confirmedAt).toLocaleTimeString() : 'Pending'}
                    </span>
                  </div>
                  <p className="text-ink-secondary text-xs font-mono">
                    Ref: <strong className="text-ink-primary">{inspecting.telebirrReference}</strong>
                  </p>
                </div>

                {/* Step 4: Final Settlement / Receipt */}
                <div className="relative space-y-0.5">
                  <div className={`absolute -left-6 top-1 w-3 h-3 rounded-full border-2 border-white ring-2 ${
                    inspecting.receiptNumber ? 'bg-civic-green ring-civic-green' : inspecting.refundedAt ? 'bg-red-500 ring-red-500' : 'bg-gray-400 ring-gray-400'
                  }`} />
                  <div className="flex items-baseline justify-between">
                    <span className="font-bold text-xs text-ink-primary">
                      {inspecting.receiptNumber ? '4. Official Tax Receipt Issued' : inspecting.refundedAt ? '4. Refund Processed' : '4. Awaiting Resolution'}
                    </span>
                    {inspecting.receiptNumber && (
                      <span className="font-mono text-[13px] font-bold text-civic-green">{inspecting.receiptNumber}</span>
                    )}
                  </div>
                  <p className="text-ink-secondary text-xs">
                    {inspecting.receiptNumber
                      ? 'Member rank credential generated and welcome orientation materials issued.'
                      : inspecting.refundReason
                      ? `Audit note: "${inspecting.refundReason}"`
                      : 'Transaction is undergoing manual reconciliation.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Payer Meta Information */}
            <div className="p-4 border-2 border-border bg-canvas-subdued space-y-2.5 font-mono text-xs">
              <div className="flex justify-between border-b border-border pb-1.5">
                <span className="text-ink-tertiary">Payer Name:</span>
                <span className="font-bold text-ink-primary font-sans">{inspecting.payerName || 'Applicant'}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-1.5">
                <span className="text-ink-tertiary">Payer Phone:</span>
                <span className="font-bold text-ink-primary">{inspecting.payerPhone || '—'}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-1.5">
                <span className="text-ink-tertiary">Telebirr Reference:</span>
                <span className="font-bold text-ink-primary">{inspecting.telebirrReference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-tertiary">Created Timestamp:</span>
                <span className="text-ink-primary">{new Date(inspecting.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </SheetModal>
    </div>
  );
};
