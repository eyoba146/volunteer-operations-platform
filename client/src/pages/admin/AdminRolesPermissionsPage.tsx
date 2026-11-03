import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import {
  Role,
  RolePermissionConfig,
  PermissionModule,
  PermissionAction,
  ScopeLevel,
  User,
} from '../../types';
import { Button, Skeleton, TopoBackdrop } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { can } from '../../utils/permissions';
import { getScopeLabel } from '../../utils/scoping';
import {
  ShieldCheck,
  Check,
  X,
  ArrowCounterClockwise,
  User as UserIcon,
  MagnifyingGlass,
  Info,
  ShieldWarning,
} from '@phosphor-icons/react';

const ALL_MODULES: { id: PermissionModule; label: string; description: string }[] = [
  { id: 'applications', label: 'Applications', description: 'Prospective volunteer applications and vetting queue' },
  { id: 'volunteers', label: 'Volunteers', description: 'Volunteer profiles, rosters, and directory' },
  { id: 'activities', label: 'Activities', description: 'Community service events, schedules, and check-ins' },
  { id: 'hours', label: 'Hours', description: 'Volunteer hours logging, review, and verification' },
  { id: 'ratings', label: 'Ratings', description: 'Participant ratings and performance feedback' },
  { id: 'promotions', label: 'Promotions', description: 'Rank promotions, recommendations, and criteria' },
  { id: 'payments', label: 'Payments', description: 'Registration fees, Telebirr receipts, and refunds' },
  { id: 'announcements', label: 'Announcements', description: 'Broadcast notices to volunteers, teams, and areas' },
  { id: 'reports', label: 'Reports', description: 'Operational reports, metrics, and document export' },
  { id: 'settings', label: 'Settings', description: 'System configuration, rank rules, and templates' },
  { id: 'organisation', label: 'Organisation', description: 'Operational units, areas, branches, and locations' },
  { id: 'accounts', label: 'Accounts', description: 'User login accounts, status, and role assignments' },
];

const ALL_ACTIONS: { id: PermissionAction; label: string }[] = [
  { id: 'view', label: 'View' },
  { id: 'create', label: 'Create' },
  { id: 'edit', label: 'Edit' },
  { id: 'delete', label: 'Delete' },
  { id: 'submit', label: 'Submit' },
  { id: 'review', label: 'Review' },
  { id: 'verify', label: 'Verify' },
  { id: 'approve', label: 'Approve' },
  { id: 'reject', label: 'Reject' },
  { id: 'export', label: 'Export' },
];

const ROLE_OPTIONS: { role: Role; label: string; color: string; description: string }[] = [
  {
    role: 'applicant',
    label: 'Applicant',
    color: '#E58B05',
    description: 'Candidates applying for service with submitted documents awaiting admission and payment.',
  },
  {
    role: 'volunteer',
    label: 'Volunteer',
    color: '#1E824C',
    description: 'Active program volunteers participating in community activities and tracking service hours.',
  },
  {
    role: 'team_lead',
    label: 'Team Lead',
    color: '#D63927',
    description: 'Field supervisors coordinating activities, roster attendance, and submitting recommendations.',
  },
  {
    role: 'manager',
    label: 'Manager',
    color: '#0E6266',
    description: 'Regional coordinators overseeing applications, activities, volunteer directory, and rank promotions.',
  },
  {
    role: 'finance',
    label: 'Finance Officer',
    color: '#111315',
    description: 'Settlement officers managing fee payments, Telebirr reconciliation, and payment receipts.',
  },
  {
    role: 'admin',
    label: 'Super Admin',
    color: '#202328',
    description: 'Platform administrators managing system settings, rank criteria, accounts, and organisation units.',
  },
];

export const AdminRolesPermissionsPage: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [roleConfigs, setRoleConfigs] = useState<RolePermissionConfig[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role>('manager');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Person lookup tool
  const [lookupUserId, setLookupUserId] = useState<string>('usr-marta');
  const [testModule, setTestModule] = useState<PermissionModule>('promotions');
  const [testAction, setTestAction] = useState<PermissionAction>('approve');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [configs, state] = await Promise.all([
        api.getRolePermissions(),
        api.store.getState(),
      ]);
      setRoleConfigs(configs);
      setAllUsers(state.users || []);
    } catch {
      toast.error('Could not load role permissions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentRoleConfig = useMemo(() => {
    return roleConfigs.find((rc) => rc.role === selectedRole);
  }, [roleConfigs, selectedRole]);

  const selectedRoleMeta = useMemo(() => {
    return ROLE_OPTIONS.find((r) => r.role === selectedRole) || ROLE_OPTIONS[3];
  }, [selectedRole]);

  const handleTogglePermission = async (module: PermissionModule, action: PermissionAction) => {
    if (!currentRoleConfig) return;

    const currentActions = currentRoleConfig.permissions[module] || [];
    const isAllowed = currentActions.includes(action);

    const newActions = isAllowed
      ? currentActions.filter((a) => a !== action)
      : [...currentActions, action];

    try {
      const updated = await api.updateRolePermission(selectedRole, module, newActions);
      setRoleConfigs((prev) => prev.map((rc) => (rc.role === selectedRole ? updated : rc)));
      toast.success(
        isAllowed
          ? `Removed ${action} from ${module} for ${selectedRoleMeta.label}`
          : `Granted ${action} on ${module} for ${selectedRoleMeta.label}`
      );
    } catch (err: any) {
      toast.error(err.message || 'Failed to update permission');
    }
  };

  const handleScopeChange = async (scopeLevel: ScopeLevel) => {
    if (!currentRoleConfig) return;
    try {
      const updated = await api.updateRoleScope(selectedRole, scopeLevel);
      setRoleConfigs((prev) => prev.map((rc) => (rc.role === selectedRole ? updated : rc)));
      toast.success(`Updated scope level for ${selectedRoleMeta.label} to "${scopeLevel}"`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update scope');
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset all roles and permissions back to the initial baseline?')) return;
    try {
      const reset = await api.resetRolePermissions();
      setRoleConfigs(reset);
      toast.success('All roles and permissions reset to standard baseline');
    } catch (err: any) {
      toast.error(err.message || 'Reset failed');
    }
  };

  // Lookup evaluation
  const lookupUser = useMemo(() => {
    return allUsers.find((u) => u.id === lookupUserId) || allUsers[0] || null;
  }, [allUsers, lookupUserId]);

  const testResult = useMemo(() => {
    if (!lookupUser) return false;
    return can(lookupUser, testModule, testAction);
  }, [lookupUser, testModule, testAction]);

  if (isLoading) {
    return (
      <div className="space-y-6" data-page="admin-roles-permissions" data-signature="trail-grid">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="rect" className="h-44" />
        <Skeleton variant="rect" className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left" data-page="admin-roles-permissions" data-signature="trail-grid">
      {/* Editorial Header */}
      <div className="relative overflow-hidden rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] p-6 sm:p-8 space-y-6">
        <TopoBackdrop color="#202328" opacity={0.05} />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4">
          <div className="space-y-1">
            <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-ink-primary">
              Roles and permissions authority matrix
            </h1>
            <p className="text-sm text-ink-secondary mt-1 max-w-xl leading-relaxed">
              Configure module actions, geographic operational boundaries, and system-wide separation-of-duties invariants.
            </p>
          </div>

          <div className="shrink-0">
            <Button
              variant="secondary"
              onClick={handleReset}
              className="text-xs"
            >
              <ArrowCounterClockwise className="w-4 h-4 mr-1.5 inline-block" weight="bold" />
              Reset to baseline
            </Button>
          </div>
        </div>

        {/* Separation of Duties Safety Callout */}
        <div className="relative z-10 p-4 rounded-[12px] bg-[#F7F8FA] space-y-2">
          <div className="flex items-center gap-2 text-ink-primary font-semibold text-xs uppercase tracking-wider">
            <ShieldWarning className="w-4 h-4 text-[#D63927]" weight="bold" />
            <span>Separation of duties & security safety rules</span>
          </div>
          <p className="text-xs text-ink-secondary leading-relaxed">
            <strong>No self-approval:</strong> Users cannot verify or approve hours, payments, or rank promotions for activities they created or for themselves. 
            <strong> Finance isolation:</strong> Admin accounts alone cannot verify payments or issue settlement receipts without Finance delegation.
          </p>
        </div>
      </div>

      {/* Role Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {ROLE_OPTIONS.map((item) => {
          const isSelected = item.role === selectedRole;
          return (
            <button
              key={item.role}
              onClick={() => setSelectedRole(item.role)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-[12px] text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#111315] text-white shadow-[0_1px_2px_rgba(16,24,40,0.08)]'
                  : 'bg-[#F7F8FA] text-ink-secondary hover:text-ink-primary hover:bg-[#E8EBEF]'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Role Authority Card */}
      <div className="p-6 rounded-[16px] bg-[#F7F8FA] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: selectedRoleMeta.color }}
              />
              <h2 className="text-lg font-bold text-ink-primary">
                {selectedRoleMeta.label} Authority
              </h2>
            </div>
            <p className="text-xs text-ink-secondary">
              {selectedRoleMeta.description}
            </p>
          </div>

          {/* Scope Level Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <label className="text-xs font-semibold text-ink-secondary whitespace-nowrap">
              Operational Scope:
            </label>
            <select
              value={currentRoleConfig?.scopeLevel || 'own'}
              onChange={(e) => handleScopeChange(e.target.value as ScopeLevel)}
              className="px-3 py-2 bg-white rounded-[10px] text-xs font-medium text-ink-primary focus:outline-none shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
            >
              <option value="all">Head Office (All Island / National)</option>
              <option value="area">Regional Area Boundary</option>
              <option value="branch">Local Branch Boundary</option>
              <option value="own">Self Only (Personal Items)</option>
            </select>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto rounded-[12px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F1F3F6] text-ink-secondary select-none">
              <tr>
                <th className="py-3 px-4 font-semibold text-ink-primary w-48">Module</th>
                {ALL_ACTIONS.map((action) => (
                  <th key={action.id} className="py-3 px-2 text-center font-semibold uppercase tracking-wider text-[11px]">
                    {action.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F6]">
              {ALL_MODULES.map((mod) => {
                const activeActions = currentRoleConfig?.permissions[mod.id] || [];

                return (
                  <tr key={mod.id} className="hover:bg-[#F7F8FA]/60 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-ink-primary">
                      <div className="font-semibold">{mod.label}</div>
                      <div className="text-[11px] text-ink-tertiary leading-tight mt-0.5 max-w-xs">
                        {mod.description}
                      </div>
                    </td>

                    {ALL_ACTIONS.map((action) => {
                      const isAllowed = activeActions.includes(action.id);

                      return (
                        <td key={action.id} className="py-3.5 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleTogglePermission(mod.id, action.id)}
                            className={`w-6 h-6 rounded-[6px] inline-flex items-center justify-center transition-all cursor-pointer ${
                              isAllowed
                                ? 'bg-role-volunteer text-white shadow-xs'
                                : 'bg-[#F1F3F6] text-ink-tertiary hover:bg-[#E8EBEF]'
                            }`}
                            title={`${isAllowed ? 'Revoke' : 'Grant'} ${action.label} on ${mod.label} for ${selectedRoleMeta.label}`}
                            aria-label={`${action.label} on ${mod.label}`}
                          >
                            {isAllowed ? (
                              <Check className="w-3.5 h-3.5" weight="bold" />
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-ink-tertiary/40" />
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Person Authority Lookup & Simulator */}
      <div className="p-6 rounded-[16px] bg-[#F7F8FA] space-y-4">
        <div className="flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-ink-primary" weight="bold" />
          <h2 className="text-base font-bold text-ink-primary">
            Person authority lookup & policy checker
          </h2>
        </div>
        <p className="text-xs text-ink-secondary">
          Verify effective access rights and scope boundaries for any staff member or volunteer in the system.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Person Selector */}
          <div>
            <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
              Select person
            </label>
            <select
              value={lookupUserId}
              onChange={(e) => setLookupUserId(e.target.value)}
              className="w-full px-3 py-2.5 bg-white rounded-[10px] text-xs text-ink-primary focus:outline-none shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
            >
              {allUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.firstName} {u.lastName} ({u.role}) — {getScopeLabel(u)}
                </option>
              ))}
            </select>
          </div>

          {/* Module Selector */}
          <div>
            <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
              Module
            </label>
            <select
              value={testModule}
              onChange={(e) => setTestModule(e.target.value as PermissionModule)}
              className="w-full px-3 py-2.5 bg-white rounded-[10px] text-xs text-ink-primary focus:outline-none shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
            >
              {ALL_MODULES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Action Selector */}
          <div>
            <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
              Action
            </label>
            <select
              value={testAction}
              onChange={(e) => setTestAction(e.target.value as PermissionAction)}
              className="w-full px-3 py-2.5 bg-white rounded-[10px] text-xs text-ink-primary focus:outline-none shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
            >
              {ALL_ACTIONS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Resolved Check Result Banner */}
        {lookupUser && (
          <div className="p-4 rounded-[12px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2">
            <div className="flex items-center gap-3">
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  testResult ? 'bg-role-volunteer/15 text-role-volunteer' : 'bg-[#D63927]/15 text-[#D63927]'
                }`}
              >
                {testResult ? (
                  <Check className="w-5 h-5" weight="bold" />
                ) : (
                  <X className="w-5 h-5" weight="bold" />
                )}
              </span>

              <div>
                <div className="text-sm font-semibold text-ink-primary">
                  {lookupUser.firstName} {lookupUser.lastName} is{' '}
                  <span className={testResult ? 'text-role-volunteer' : 'text-[#D63927]'}>
                    {testResult ? 'PERMITTED' : 'NOT PERMITTED'}
                  </span>{' '}
                  to {testAction} on {testModule}
                </div>
                <div className="text-xs text-ink-secondary mt-0.5">
                  Role: <span className="font-semibold">{lookupUser.role}</span> &bull; Scope:{' '}
                  <span className="font-semibold">{getScopeLabel(lookupUser)}</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-ink-tertiary">
              Evaluated by central <code className="bg-[#F1F3F6] px-1.5 py-0.5 rounded text-ink-primary font-mono">can()</code> policy engine
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
