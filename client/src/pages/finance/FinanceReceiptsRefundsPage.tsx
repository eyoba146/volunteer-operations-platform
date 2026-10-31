import React, { useState, useEffect } from 'react';
import * as api from '../../api';
import { Payment } from '../../types';
import { LedgerTable, LedgerColumn, Tabs, Button, StatusMark, Skeleton } from '../../components/ui';
import { Receipt, ArrowCounterClockwise, Printer } from '@phosphor-icons/react';

export const FinanceReceiptsRefundsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [activeTab, setActiveTab] = useState('receipts');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const list = await api.getAllPayments();
        setPayments(list);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const receipts = payments.filter((p) => p.receiptNumber);
  const refunds = payments.filter((p) => p.status === 'refunded');

  const currentList = activeTab === 'receipts' ? receipts : refunds;

  const receiptColumns: LedgerColumn<Payment>[] = [
    {
      header: 'Receipt Number',
      cell: (p) => (
        <span className="font-mono text-xs font-bold text-ink-primary">
          {p.receiptNumber}
        </span>
      ),
    },
    {
      header: 'Telebirr Reference',
      cell: (p) => (
        <span className="font-mono text-xs text-ink-secondary">
          {p.telebirrReference}
        </span>
      ),
    },
    {
      header: 'Issued To',
      cell: (p) => (
        <div className="font-sans text-xs">
          <span className="font-semibold text-ink-primary block">{p.payerName || 'Applicant'}</span>
          <span className="font-mono text-ink-tertiary text-[11px] block">{p.payerPhone || '—'}</span>
        </div>
      ),
    },
    {
      header: 'Date Confirmed',
      cell: (p) => (
        <span className="font-mono text-xs text-ink-tertiary">
          {p.confirmedAt ? new Date(p.confirmedAt).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      header: 'Amount',
      align: 'right',
      cell: (p) => (
        <span className="font-mono text-xs font-bold text-civic-green">
          ETB {p.amount}.00
        </span>
      ),
    },
  ];

  const refundColumns: LedgerColumn<Payment>[] = [
    {
      header: 'Telebirr Reference',
      cell: (p) => (
        <span className="font-mono text-xs font-bold text-ink-primary">
          {p.telebirrReference}
        </span>
      ),
    },
    {
      header: 'Refunded To',
      cell: (p) => (
        <span className="font-sans text-xs text-ink-primary font-semibold">
          {p.payerName}
        </span>
      ),
    },
    {
      header: 'Reason for Reimbursement',
      cell: (p) => (
        <span className="font-sans text-xs text-civic-rust">
          {p.refundReason || 'Refund processed by Finance.'}
        </span>
      ),
    },
    {
      header: 'Refund Date',
      cell: (p) => (
        <span className="font-mono text-xs text-ink-tertiary">
          {p.refundedAt ? new Date(p.refundedAt).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      header: 'Amount Refunded',
      align: 'right',
      cell: (p) => (
        <span className="font-mono text-xs font-bold text-ink-primary">
          - ETB {p.amount}.00
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-border pb-5 space-y-1">
        <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary block">
          FINANCIAL PROOF & ADJUSTMENTS
        </span>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-primary">
          Official Receipts & Refunds
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink-secondary">
          Track official receipt numbers and record reasons for Telebirr reimbursements.
        </p>
      </div>

      <Tabs
        tabs={[
          { id: 'receipts', label: 'Issued Receipts', count: receipts.length },
          { id: 'refunds', label: 'Refunds & Reversals', count: refunds.length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <LedgerTable
        data={currentList}
        columns={activeTab === 'receipts' ? receiptColumns : refundColumns}
        keyExtractor={(p) => p.id}
        isLoading={isLoading}
      />
    </div>
  );
};

