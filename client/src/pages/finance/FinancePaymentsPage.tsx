import React, { useState, useEffect } from 'react';
import * as api from '../../api';
import { Payment, PaymentStatus } from '../../types';
import { LedgerTable, LedgerColumn, Input, Select, Button, StatusMark, SheetModal, Skeleton } from '../../components/ui';
import { MagnifyingGlass, Money, Eye, DownloadSimple } from '@phosphor-icons/react';

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
            <span className="font-mono text-[11px] text-ink-tertiary block">
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
          <span className="font-mono text-ink-tertiary text-[11px] block">{p.payerPhone || '—'}</span>
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
          Details
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-border pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary block">
            FINANCIAL AUDIT TRAIL
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-primary">
            Telebirr Transactions Ledger
          </h1>
          <p className="font-sans text-xs sm:text-sm text-ink-secondary">
            Immutable settlement log of registration fees, timestamps, and payment statuses.
          </p>
        </div>

        <span className="font-mono text-xs text-ink-tertiary bg-canvas-raised border border-border px-3 py-1.5 self-start sm:self-auto">
          Total Transactions: <strong className="text-ink-primary font-bold">{payments.length}</strong>
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="border border-border bg-canvas-raised p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

      {/* Detail Drawer */}
      <SheetModal
        isOpen={inspecting !== null}
        onClose={() => setInspecting(null)}
        title="Transaction Record"
        subtitle={`Reference: ${inspecting?.telebirrReference || ''}`}
        mode="sheet"
      >
        {inspecting && (
          <div className="space-y-6 text-left font-sans text-xs">
            <div className="p-4 border border-border bg-canvas-subdued space-y-2">
              <span className="font-mono text-[10px] uppercase text-ink-tertiary block">Status</span>
              <StatusMark status={inspecting.status} size="md" />
            </div>

            <div className="p-4 border border-border bg-canvas-raised space-y-3 font-mono">
              <div className="flex justify-between border-b border-border/60 pb-2">
                <span className="text-ink-tertiary">Amount:</span>
                <span className="font-bold text-ink-primary text-sm">ETB {inspecting.amount}.00</span>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-2">
                <span className="text-ink-tertiary">Telebirr Ref:</span>
                <span className="text-ink-primary font-bold">{inspecting.telebirrReference}</span>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-2">
                <span className="text-ink-tertiary">Receipt Number:</span>
                <span className="text-ink-primary">{inspecting.receiptNumber || '—'}</span>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-2">
                <span className="text-ink-tertiary">Payer Name:</span>
                <span className="text-ink-primary font-sans">{inspecting.payerName || 'Applicant'}</span>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-2">
                <span className="text-ink-tertiary">Payer Phone:</span>
                <span className="text-ink-primary">{inspecting.payerPhone || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-tertiary">Created At:</span>
                <span className="text-ink-primary">{new Date(inspecting.createdAt).toLocaleString()}</span>
              </div>
              {inspecting.confirmedAt && (
                <div className="flex justify-between">
                  <span className="text-ink-tertiary">Confirmed At:</span>
                  <span className="text-civic-green font-bold">{new Date(inspecting.confirmedAt).toLocaleString()}</span>
                </div>
              )}
            </div>

            {inspecting.refundReason && (
              <div className="p-4 border border-border bg-canvas-subdued space-y-1">
                <span className="font-mono text-[10px] uppercase text-ink-tertiary block">Audit Note</span>
                <p className="text-ink-secondary">{inspecting.refundReason}</p>
              </div>
            )}
          </div>
        )}
      </SheetModal>
    </div>
  );
};

