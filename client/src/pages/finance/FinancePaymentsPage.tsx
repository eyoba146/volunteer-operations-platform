import React, { useState, useEffect } from 'react';
import * as api from '../../api';
import { Payment, PaymentStatus } from '../../types';
import { LedgerTable, LedgerColumn, Input, Select, Button, StatusMark, SheetModal, JourneyLog, JourneyItem, TopoBackdrop } from '../../components/ui';
import { 
  MagnifyingGlass, 
  Eye, 
} from '@phosphor-icons/react';

export const FinancePaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [inspecting, setInspecting] = useState<Payment | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'log'>('log');

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
                      ? 'Member rank credential generated and welcome orientation materials issued.'
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
    </div>
  );
};
