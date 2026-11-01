import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../../api';
import { ActivityLogEntry } from '../../types';
import { LedgerTable, LedgerColumn, Input, Select, Skeleton } from '../../components/ui';
import { MagnifyingGlass, ArrowLeft } from '@phosphor-icons/react';

export const AdminActivityHistoryPage: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
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

  const filteredLogs = logs.filter((entry) => {
    if (roleFilter !== 'all' && !entry.actorRole.toLowerCase().includes(roleFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  const columns: LedgerColumn<ActivityLogEntry>[] = [
    {
      header: 'Timestamp',
      cell: (entry) => (
        <span className="font-mono text-[13px] text-ink-tertiary">
          {new Date(entry.createdAt).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Actor and role',
      cell: (entry) => (
        <div className="space-y-0.5">
          <span className="font-sans font-semibold text-ink-primary block text-[13px]">
            {entry.actorName}
          </span>
          <span className="font-mono text-[13px] font-medium px-1.5 py-0.5 bg-canvas-subdued border border-[#D5DAE1] rounded-[4px] text-ink-secondary inline-block">
            {entry.actorRole}
          </span>
        </div>
      ),
    },
    {
      header: 'Action taken',
      cell: (entry) => (
        <span className="font-sans text-[13px] text-ink-primary font-medium">
          {entry.action}
        </span>
      ),
    },
    {
      header: 'Subject / Entity',
      cell: (entry) => (
        <span className="font-mono text-[13px] text-ink-secondary bg-canvas-subdued/40 px-2 py-0.5 border border-[#D5DAE1] rounded-[4px] inline-block">
          {entry.subject}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <button
        onClick={() => navigate('/admin/overview')}
        className="inline-flex items-center gap-1.5 text-[13px] font-mono font-medium text-ink-tertiary hover:text-ink-primary transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to administration overview</span>
      </button>

      {/* Header Card */}
      <div className="border border-[#D5DAE1] rounded-[10px] bg-white p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D5DAE1] pb-4">
          <div className="space-y-1">
            <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-ink-primary leading-tight">
              System activity history
            </h1>
            <p className="font-sans text-sm text-ink-secondary mt-1">
              Searchable chronological record of administrative actions, promotion decisions, fee changes, and Telebirr reconciliations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[13px] font-medium text-ink-primary bg-canvas-subdued border border-[#D5DAE1] px-3 py-1.5 rounded-[8px]">
              Total entries: {filteredLogs.length}
            </span>
          </div>
        </div>

        {/* Search & Filter Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="sm:col-span-2">
            <Input
              placeholder="Search by action, actor name, or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftAddon={<MagnifyingGlass className="w-4 h-4" />}
            />
          </div>

          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All roles' },
              { value: 'Admin', label: 'Super Admin' },
              { value: 'Manager', label: 'Program Manager' },
              { value: 'Team Lead', label: 'Team Lead' },
              { value: 'Finance', label: 'Finance Officer' },
              { value: 'System', label: 'System Automated' },
            ]}
          />
        </div>
      </div>

      <LedgerTable
        data={filteredLogs}
        columns={columns}
        keyExtractor={(entry) => entry.id}
        isLoading={isLoading}
      />
    </div>
  );
};
