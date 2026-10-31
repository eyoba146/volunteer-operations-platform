import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { User, Role, AccountStatus } from '../../types';
import { LedgerTable, LedgerColumn, Button, StatusMark, Select, SheetModal, Input, Skeleton } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { 
  UsersThree, 
  ArrowLeft, 
  UserPlus, 
  MagnifyingGlass, 
  ShieldCheck, 
  LockKeyOpen, 
  Prohibit 
} from '@phosphor-icons/react';

export const AdminAccountsPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Create Account Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('+251 91 100 0000');
  const [newArea, setNewArea] = useState('Addis Ababa');
  const [newRole, setNewRole] = useState<Role>('team_lead');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleRoleChange = (userId: string, targetRole: Role) => {
    api.store.setState((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === userId ? { ...u, role: targetRole } : u)),
      activityLog: [
        {
          id: `log-${Date.now()}`,
          actorId: user?.id || 'usr-ruth',
          actorName: profile?.fullName || user?.username || 'Ruth Mengistu',
          actorRole: 'Super Admin',
          action: `Reassigned account ${userId} role to "${targetRole}"`,
          subject: `User #${userId}`,
          createdAt: new Date().toISOString(),
        },
        ...prev.activityLog,
      ],
    }));
    toast.success(`Role updated to ${targetRole}. Activity history logged.`);
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
          actorId: user?.id || 'usr-ruth',
          actorName: profile?.fullName || user?.username || 'Ruth Mengistu',
          actorRole: 'Super Admin',
          action: `${nextStatus === 'suspended' ? 'Suspended' : 'Reinstated'} account ${userId}`,
          subject: `User #${userId}`,
          createdAt: new Date().toISOString(),
        },
        ...prev.activityLog,
      ],
    }));
    toast.info(`Account status changed to ${nextStatus}.`);
    loadData();
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newEmail.trim() || !newFullName.trim()) return;

    setIsSubmitting(true);
    try {
      await api.createStaffAccount({
        fullName: newFullName.trim(),
        username: newUsername.trim(),
        email: newEmail.trim(),
        phone: newPhone.trim(),
        area: newArea.trim(),
        role: newRole,
        actorId: user?.id,
        actorName: profile?.fullName || user?.username,
      });

      toast.success(`Staff account for ${newFullName} created with role ${newRole}.`);
      setShowCreateModal(false);
      setNewFullName('');
      setNewUsername('');
      setNewEmail('');
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Could not create account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (statusFilter !== 'all' && u.accountStatus !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

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
          className="bg-white border-2 border-ink-primary py-1 px-2 text-xs font-mono font-bold rounded-none cursor-pointer"
        >
          <option value="applicant">Applicant</option>
          <option value="volunteer">Volunteer (Member)</option>
          <option value="team_lead">Team Lead</option>
          <option value="manager">Program Manager</option>
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
      header: 'Created Date',
      cell: (u) => (
        <span className="font-mono text-xs text-ink-tertiary">
          {new Date(u.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Account Action',
      align: 'right',
      cell: (u) => (
        <Button
          variant={u.accountStatus === 'suspended' ? 'secondary' : 'danger'}
          size="sm"
          onClick={() => handleToggleStatus(u.id, u.accountStatus)}
          leftIcon={u.accountStatus === 'suspended' ? <LockKeyOpen className="w-3.5 h-3.5" /> : <Prohibit className="w-3.5 h-3.5" />}
        >
          {u.accountStatus === 'suspended' ? 'Reinstate' : 'Pause Access'}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <button
        onClick={() => navigate('/admin/overview')}
        className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-ink-tertiary hover:text-ink-primary transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to administration overview</span>
      </button>

      {/* Header */}
      <div
        className="border-4 border-ink-primary bg-white p-6 sm:p-8 space-y-4 shadow-ticket"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-ink-primary pb-5">
          <div className="space-y-1">
            <span className="font-sans text-xs font-bold text-amber-600 tracking-tight block">
              Access Control & Permissions
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tight text-ink-primary leading-none">
              User Accounts & Role Permissions
            </h1>
            <p className="font-sans text-xs sm:text-sm text-ink-secondary mt-1">
              Provision new company staff accounts, pause volunteer access, and reassign roles across Manager, Finance, and Lead desks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<UserPlus className="w-4 h-4" weight="bold" />}
              onClick={() => setShowCreateModal(true)}
            >
              Create Account
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <Input
            placeholder="Search username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftAddon={<MagnifyingGlass className="w-4 h-4" />}
          />

          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Roles' },
              { value: 'applicant', label: 'Applicant' },
              { value: 'volunteer', label: 'Volunteer' },
              { value: 'team_lead', label: 'Team Lead' },
              { value: 'manager', label: 'Program Manager' },
              { value: 'finance', label: 'Finance Officer' },
              { value: 'admin', label: 'Super Admin' },
            ]}
          />

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'active', label: 'Active Access' },
              { value: 'suspended', label: 'Paused / Suspended' },
            ]}
          />
        </div>
      </div>

      <LedgerTable
        data={filteredUsers}
        columns={columns}
        keyExtractor={(u) => u.id}
        isLoading={isLoading}
      />

      {/* Create Account Modal */}
      <SheetModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Provision New Staff Account"
        subtitle="Create an internal staff account with direct role permissions."
        mode="modal"
        maxWidth="md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-left font-sans text-xs">
          <Input
            label="Full Name"
            value={newFullName}
            onChange={(e) => setNewFullName(e.target.value)}
            placeholder="e.g. Bethlehem Desta"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="e.g. bethlehem.desta"
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="e.g. b.desta@example.et"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Phone Number"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="+251 91 100 0000"
              required
            />

            <Select
              label="Operational Hub Area"
              value={newArea}
              onChange={(e) => setNewArea(e.target.value)}
              options={[
                { value: 'Addis Ababa', label: 'Addis Ababa' },
                { value: 'Adama', label: 'Adama' },
                { value: 'Bishoftu', label: 'Bishoftu' },
                { value: 'Hawassa', label: 'Hawassa' },
                { value: 'Bahir Dar', label: 'Bahir Dar' },
              ]}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold tracking-tight text-ink-primary">
              Assigned Role
            </label>
            <Select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as Role)}
              options={[
                { value: 'team_lead', label: 'Team Lead' },
                { value: 'manager', label: 'Program Manager' },
                { value: 'finance', label: 'Finance Officer' },
                { value: 'admin', label: 'Super Admin' },
                { value: 'volunteer', label: 'Volunteer' },
              ]}
            />
          </div>

          <p className="text-ink-tertiary text-[13px] pt-1 font-mono">
            Password defaults to <strong>Demo@1234</strong>. Email verification is marked active immediately.
          </p>

          <div className="pt-3 border-t-2 border-border flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              Provision Account
            </Button>
          </div>
        </form>
      </SheetModal>
    </div>
  );
};
