import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { User, Role, AccountStatus } from '../../types';
import { LedgerTable, LedgerColumn, Button, StatusMark, Select, SheetModal, Input } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { 
  ArrowLeft, 
  UserPlus, 
  MagnifyingGlass, 
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
      header: 'Username and email',
      cell: (u) => (
        <div className="space-y-0.5">
          <span className="font-sans font-semibold text-ink-primary block text-[13px]">
            {u.username}
          </span>
          <span className="font-mono text-[13px] text-ink-tertiary block">
            {u.email}
          </span>
        </div>
      ),
    },
    {
      header: 'Assigned role',
      cell: (u) => (
        <select
          value={u.role}
          onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
          className="bg-white border border-[#475569] py-1 px-2.5 text-[13px] font-sans font-medium rounded-[6px] cursor-pointer outline-none focus:ring-1 focus:ring-ink-primary"
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
      header: 'Account status',
      cell: (u) => <StatusMark status={u.accountStatus} size="sm" />,
    },
    {
      header: 'Created date',
      cell: (u) => (
        <span className="font-mono text-[13px] text-ink-tertiary">
          {new Date(u.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Account action',
      align: 'right',
      cell: (u) => (
        <Button
          variant={u.accountStatus === 'suspended' ? 'secondary' : 'danger'}
          size="sm"
          onClick={() => handleToggleStatus(u.id, u.accountStatus)}
          leftIcon={u.accountStatus === 'suspended' ? <LockKeyOpen className="w-3.5 h-3.5" /> : <Prohibit className="w-3.5 h-3.5" />}
        >
          {u.accountStatus === 'suspended' ? 'Reinstate' : 'Pause access'}
        </Button>
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
            <span className="font-sans text-[13px] font-semibold text-amber-600 tracking-tight block">
              Access control and permissions
            </span>
            <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-ink-primary leading-tight">
              User accounts and role permissions
            </h1>
            <p className="font-sans text-sm text-ink-secondary mt-1">
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
              Create account
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
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
              { value: 'all', label: 'All roles' },
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
              { value: 'all', label: 'All statuses' },
              { value: 'active', label: 'Active access' },
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
        title="Provision new staff account"
        subtitle="Create an internal staff account with direct role permissions."
        mode="modal"
        maxWidth="md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-left font-sans text-sm">
          <Input
            label="Full name"
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
              label="Email address"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="e.g. b.desta@example.et"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Phone number"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="+251 91 100 0000"
              required
            />

            <Select
              label="Operational area"
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
            <label className="block text-[13px] font-semibold text-ink-primary">
              Assigned role
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

          <div className="pt-3 border-t border-[#D5DAE1] flex items-center justify-end gap-3">
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
              Provision account
            </Button>
          </div>
        </form>
      </SheetModal>
    </div>
  );
};
