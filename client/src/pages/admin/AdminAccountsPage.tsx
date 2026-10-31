import React, { useState, useEffect } from 'react';
import * as api from '../../api';
import { User, Role, AccountStatus } from '../../types';
import { LedgerTable, LedgerColumn, Button, StatusMark, Select, Skeleton } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { UsersThree, ArrowLeft } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

export const AdminAccountsPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const state = api.store.getState();
      setUsers([...state.users]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRoleChange = (userId: string, newRole: Role) => {
    api.store.setState((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      activityLog: [
        {
          id: `log-${Date.now()}`,
          actorId: 'usr-ruth',
          actorName: 'Ruth Mengistu',
          actorRole: 'Super Admin',
          action: `Assigned new role "${newRole}" to user ${userId}`,
          subject: `User #${userId}`,
          createdAt: new Date().toISOString(),
        },
        ...prev.activityLog,
      ],
    }));
    toast.success('User role updated and logged to activity history.');
    loadData();
  };

  const handleToggleStatus = (userId: string, currentStatus: AccountStatus) => {
    const nextStatus: AccountStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    api.store.setState((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === userId ? { ...u, accountStatus: nextStatus } : u)),
      activityLog: [
        {
          id: `log-${Date.now()}`,
          actorId: 'usr-ruth',
          actorName: 'Ruth Mengistu',
          actorRole: 'Super Admin',
          action: `${nextStatus === 'suspended' ? 'Suspended' : 'Reinstated'} account ${userId}`,
          subject: `User #${userId}`,
          createdAt: new Date().toISOString(),
        },
        ...prev.activityLog,
      ],
    }));
    toast.info(`Account status set to ${nextStatus}.`);
    loadData();
  };

  const columns: LedgerColumn<User>[] = [
    {
      header: 'Username & Email',
      cell: (u) => (
        <div className="space-y-0.5">
          <span className="font-sans font-bold text-ink-primary block">
            {u.username}
          </span>
          <span className="font-mono text-xs text-ink-tertiary block">
            {u.email}
          </span>
        </div>
      ),
    },
    {
      header: 'Assigned Role',
      cell: (u) => (
        <select
          value={u.role}
          onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
          className="bg-canvas-subdued border border-border py-1 px-2 text-xs font-mono rounded cursor-pointer"
        >
          <option value="applicant">Applicant</option>
          <option value="volunteer">Volunteer</option>
          <option value="team_lead">Team Lead</option>
          <option value="manager">Manager</option>
          <option value="finance">Finance Officer</option>
          <option value="admin">Super Admin</option>
        </select>
      ),
    },
    {
      header: 'Account Status',
      cell: (u) => <StatusMark status={u.accountStatus} size="sm" />,
    },
    {
      header: 'Account Actions',
      align: 'right',
      cell: (u) => (
        <Button
          variant={u.accountStatus === 'suspended' ? 'secondary' : 'danger'}
          size="sm"
          onClick={() => handleToggleStatus(u.id, u.accountStatus)}
        >
          {u.accountStatus === 'suspended' ? 'Reinstate' : 'Pause Access'}
        </Button>
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

      <div className="border-b border-border pb-5 space-y-1">
        <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary block">
          IDENTITY & ACCESS
        </span>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-primary">
          User Accounts & Role Permissions
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink-secondary">
          Assign company staff roles, manage volunteer access, or pause accounts.
        </p>
      </div>

      <LedgerTable
        data={users}
        columns={columns}
        keyExtractor={(u) => u.id}
        isLoading={isLoading}
      />
    </div>
  );
};

