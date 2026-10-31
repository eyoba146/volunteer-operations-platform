import React, { useState, useEffect } from 'react';
import * as api from '../../api';
import { ActivityLogEntry } from '../../types';
import { LedgerTable, LedgerColumn, Input, Skeleton } from '../../components/ui';
import { MagnifyingGlass, Scroll, ArrowLeft } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

export const AdminActivityHistoryPage: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const list = await api.getActivityLog(search || undefined);
        setLogs(list);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [search]);

  const columns: LedgerColumn<ActivityLogEntry>[] = [
    {
      header: 'Timestamp',
      cell: (entry) => (
        <span className="font-mono text-xs text-ink-tertiary">
          {new Date(entry.createdAt).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Actor & Role',
      cell: (entry) => (
        <div className="space-y-0.5">
          <span className="font-sans font-bold text-ink-primary block">
            {entry.actorName}
          </span>
          <span className="font-mono text-[10px] uppercase text-ink-tertiary block">
            {entry.actorRole}
          </span>
        </div>
      ),
    },
    {
      header: 'Action Taken',
      cell: (entry) => (
        <span className="font-sans text-xs text-ink-primary font-medium">
          {entry.action}
        </span>
      ),
    },
    {
      header: 'Subject / Entity',
      cell: (entry) => (
        <span className="font-mono text-xs text-ink-secondary">
          {entry.subject}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-ink-tertiary hover:text-ink-primary transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to administration overview</span>
      </button>

      <div className="border-b border-border pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary block">
            PERMANENT SYSTEM TRAIL
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-primary">
            Activity History
          </h1>
          <p className="font-sans text-xs sm:text-sm text-ink-secondary">
            Permanent, searchable record of all administrative changes, reviews, promotions, and refunds.
          </p>
        </div>

        <span className="font-mono text-xs text-ink-tertiary bg-canvas-raised border border-border px-3 py-1.5 self-start sm:self-auto">
          Logged Entries: <strong className="text-ink-primary font-bold">{logs.length}</strong>
        </span>
      </div>

      <div className="border border-border bg-canvas-raised p-4">
        <Input
          placeholder="Search by action, actor, or subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftAddon={<MagnifyingGlass className="w-4 h-4" />}
        />
      </div>

      <LedgerTable
        data={logs}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
      />
    </div>
  );
};

