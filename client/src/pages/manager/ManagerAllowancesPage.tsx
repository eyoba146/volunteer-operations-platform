import React, { useState, useEffect } from 'react';
import { PageShell, StatusMark, Button, SheetModal } from '../../components/ui';
import { TopoBackdrop } from '../../components/signature/TopoBackdrop';
import {
  Money,
  Plus,
  MagnifyingGlass,
  CheckCircle,
  Warning,
  Clock,
  User,
  FolderSimple,
} from '@phosphor-icons/react';
import { AllowanceRequest, AllowanceStatus, Project, User as UserType } from '../../types';
import { getAllowances, prepareAllowance, computeProjectBudgetMetrics } from '../../api/allowances';
import { getProjects } from '../../api/projects';
import { store } from '../../api/store';
import { can } from '../../utils/permissions';
import { filterByScope, getScopeLabel } from '../../utils/scoping';

export const ManagerAllowancesPage: React.FC = () => {
  const currentUser = store.getCurrentUser();
  const [allowances, setAllowances] = useState<AllowanceRequest[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [scopedVolunteers, setScopedVolunteers] = useState<UserType[]>([]);
  const [scopedTeamLeads, setScopedTeamLeads] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState<AllowanceStatus | 'all'>('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Prepare Allowance Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({
    projectId: '',
    volunteerId: '',
    days: 3,
    supervisorId: '',
    activityTitle: '',
  });
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const list = await getAllowances({
        status: statusFilter === 'all' ? undefined : statusFilter,
        projectId: projectFilter === 'all' ? undefined : projectFilter,
      });
      setAllowances(list);

      const projs = await getProjects();
      setProjects(projs);

      const state = store.getState();
      const scopedUsers = filterByScope(currentUser, state.users || []);
      setScopedVolunteers(scopedUsers.filter((u) => u.role === 'volunteer'));
      setScopedTeamLeads(scopedUsers.filter((u) => u.role === 'team_lead'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, projectFilter]);

  const selectedProject = projects.find((p) => p.id === formState.projectId);
  const budgetMetrics = formState.projectId ? computeProjectBudgetMetrics(formState.projectId) : null;
  const calculatedTotal = selectedProject ? formState.days * (selectedProject.allowancePerDay || 350) : 0;
  const isBudgetExceeded = budgetMetrics ? calculatedTotal > budgetMetrics.remaining : false;

  const handlePrepare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.projectId || !formState.volunteerId || !formState.supervisorId || formState.days <= 0) {
      setSubmitError('Please complete all fields with valid values.');
      return;
    }

    if (isBudgetExceeded) {
      setSubmitError(
        `Requested total (ETB ${calculatedTotal.toLocaleString()}) exceeds the project remaining budget (ETB ${budgetMetrics?.remaining.toLocaleString()}).`
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    try {
      const lead = scopedTeamLeads.find((l) => l.id === formState.supervisorId);

      await prepareAllowance({
        projectId: formState.projectId,
        volunteerId: formState.volunteerId,
        days: Number(formState.days),
        supervisorId: formState.supervisorId,
        supervisorName: lead ? `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || lead.username : 'Team Lead',
        activityTitle: formState.activityTitle.trim() || undefined,
        status: 'submitted',
      });

      setIsModalOpen(false);
      setFormState({
        projectId: '',
        volunteerId: '',
        days: 3,
        supervisorId: '',
        activityTitle: '',
      });
      loadData();
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to prepare allowance request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAllowances = allowances.filter((a) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      a.allowanceNumber.toLowerCase().includes(q) ||
      a.volunteerName.toLowerCase().includes(q) ||
      (a.projectName && a.projectName.toLowerCase().includes(q))
    );
  });

  return (
    <PageShell page="manager/allowances" signature="TopoBackdrop">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink-primary tracking-tight">
              Allowances
            </h1>
            <p className="font-sans text-base text-ink-secondary">
              Prepare field stipends, verify project budget ceilings, and track disbursement progress in {getScopeLabel(currentUser)}.
            </p>
          </div>
          {can(currentUser, 'allowances', 'create') && (
            <Button
              variant="primary"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 self-start md:self-auto"
            >
              <Plus className="w-4 h-4" weight="bold" />
              <span>Prepare allowance</span>
            </Button>
          )}
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'submitted', 'verified', 'approved', 'paid', 'rejected', 'failed'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-[8px] text-xs font-sans font-medium capitalize transition-colors select-none ${
                  statusFilter === st
                    ? 'bg-ink-primary text-white'
                    : 'text-ink-secondary hover:bg-[#F1F3F6]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Project Filter */}
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="px-3 py-2 bg-[#F1F3F6] rounded-[12px] text-xs font-sans text-ink-primary focus:outline-none focus:ring-2 focus:ring-[#0E6266]/30"
            >
              <option value="all">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* Search */}
            <div className="relative w-48 sm:w-56">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-secondary" weight="bold" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-[#F1F3F6] rounded-[12px] text-xs font-sans text-ink-primary placeholder:text-ink-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#0E6266]/30"
              />
            </div>
          </div>
        </div>

        {/* Allowances Ledger */}
        {loading ? (
          <div className="p-12 text-center text-sm font-sans text-ink-secondary">
            Loading allowances...
          </div>
        ) : filteredAllowances.length === 0 ? (
          <div className="p-12 rounded-[16px] bg-[#F7F8FA] text-center space-y-3">
            <Money className="w-10 h-10 mx-auto text-ink-secondary/50" weight="bold" />
            <div className="font-display font-bold text-lg text-ink-primary">
              No allowance requests found
            </div>
            <p className="font-sans text-sm text-ink-secondary max-w-md mx-auto">
              There are no allowance requests matching your filters. Prepare a new request to disburse field service stipends.
            </p>
          </div>
        ) : (
          <div className="rounded-[16px] bg-[#F7F8FA] p-3 space-y-2">
            {filteredAllowances.map((alw) => {
              const proj = projects.find((p) => p.id === alw.projectId);
              const m = proj ? computeProjectBudgetMetrics(proj.id) : null;
              const isOver = m ? alw.totalAmount > m.remaining && alw.status !== 'approved' && alw.status !== 'paid' : false;

              return (
                <div
                  key={alw.id}
                  className="p-4 rounded-[12px] bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-sans text-xs font-semibold px-2 py-0.5 rounded-[4px] bg-[#F1F3F6] text-ink-secondary">
                        {alw.allowanceNumber}
                      </span>
                      <span className="font-display font-bold text-base text-ink-primary">
                        {alw.volunteerName}
                      </span>
                      <StatusMark
                        status={
                          alw.status === 'paid' || alw.status === 'approved'
                            ? 'approved'
                            : alw.status === 'rejected' || alw.status === 'failed'
                            ? 'declined'
                            : 'waiting'
                        }
                        label={alw.status}
                      />
                      {isOver && (
                        <span className="px-2 py-0.5 rounded-[4px] bg-amber-50 text-amber-700 text-[11px] font-sans font-semibold inline-flex items-center gap-1">
                          <Warning className="w-3 h-3" weight="bold" />
                          <span>Budget ceiling warning</span>
                        </span>
                      )}
                    </div>

                    <div className="font-sans text-xs text-ink-secondary space-y-0.5">
                      <div>
                        Project: <span className="font-medium text-ink-primary">{alw.projectName}</span> • {alw.branchName}
                      </div>
                      <div>
                        Service: {alw.days} days @ ETB {alw.allowancePerDay}/day • Prepared by {alw.preparedByName} • Supervisor: {alw.supervisorName || 'Team Lead'}
                      </div>
                      {alw.verifiedByName && (
                        <div className="text-indigo-700">
                          Verified by {alw.verifiedByName}: "{alw.supervisorNotes || 'Attendance confirmed'}"
                        </div>
                      )}
                      {alw.approvedByName && (
                        <div className="text-emerald-700 font-medium">
                          Approved by {alw.approvedByName}
                        </div>
                      )}
                      {alw.paymentReference && (
                        <div className="text-emerald-800 font-semibold">
                          Disbursed via Telebirr (Ref: {alw.paymentReference})
                        </div>
                      )}
                      {alw.rejectionReason && (
                        <div className="text-red-600">
                          Decline reason: {alw.rejectionReason}
                        </div>
                      )}
                      {alw.failureReason && (
                        <div className="text-amber-700">
                          Issue: {alw.failureReason}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex md:flex-col items-center md:items-end justify-between md:justify-center">
                    <div className="font-display font-bold text-xl text-ink-primary">
                      ETB {alw.totalAmount.toLocaleString()}
                    </div>
                    <div className="font-sans text-xs text-ink-secondary">
                      {new Date(alw.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: Prepare Allowance */}
        {isModalOpen && (
          <SheetModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Prepare allowance request"
            subtitle="Calculate volunteer stipend based on project allowance per day and remaining funds."
          >
            <form onSubmit={handlePrepare} className="space-y-4">
              {submitError && (
                <div className="p-3 rounded-[12px] bg-red-50 text-red-700 text-xs font-sans">
                  {submitError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-sans font-semibold text-ink-secondary">
                  Project Charter *
                </label>
                <select
                  required
                  value={formState.projectId}
                  onChange={(e) => setFormState({ ...formState, projectId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F1F3F6] rounded-[12px] text-sm font-sans text-ink-primary focus:outline-none focus:ring-2 focus:ring-[#0E6266]/30"
                >
                  <option value="">Select a project...</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.branchName}) - ETB {p.allowancePerDay}/day
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Project Budget Panel */}
              {selectedProject && budgetMetrics && (
                <div className="p-4 rounded-[12px] bg-[#F1F3F6] space-y-2">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="text-ink-secondary">Remaining Available Budget</span>
                    <span className="font-bold text-ink-primary">ETB {budgetMetrics.remaining.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="text-ink-secondary">Daily Allowance Rate</span>
                    <span className="font-bold text-ink-primary">ETB {selectedProject.allowancePerDay} / day</span>
                  </div>
                  <div className="pt-2 flex items-center justify-between text-sm font-sans">
                    <span className="font-semibold text-ink-primary">Total Request:</span>
                    <span className={`font-bold ${isBudgetExceeded ? 'text-red-600' : 'text-[#0E6266]'}`}>
                      ETB {calculatedTotal.toLocaleString()}
                    </span>
                  </div>
                  {isBudgetExceeded && (
                    <div className="p-2 rounded-[8px] bg-red-100 text-red-700 text-[11px] font-sans">
                      Request exceeds project remaining funds! Cannot submit until days or budget are adjusted.
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-sans font-semibold text-ink-secondary">
                  Volunteer *
                </label>
                <select
                  required
                  value={formState.volunteerId}
                  onChange={(e) => setFormState({ ...formState, volunteerId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F1F3F6] rounded-[12px] text-sm font-sans text-ink-primary focus:outline-none focus:ring-2 focus:ring-[#0E6266]/30"
                >
                  <option value="">Select volunteer...</option>
                  {scopedVolunteers.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.firstName} {v.lastName} ({v.username}) - {v.branchName || 'Branch'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-sans font-semibold text-ink-secondary">
                  Number of Service Days *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={60}
                  value={formState.days}
                  onChange={(e) => setFormState({ ...formState, days: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-[#F1F3F6] rounded-[12px] text-sm font-sans text-ink-primary focus:outline-none focus:ring-2 focus:ring-[#0E6266]/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-sans font-semibold text-ink-secondary">
                  Supervising Team Lead (Attendance Verifier) *
                </label>
                <select
                  required
                  value={formState.supervisorId}
                  onChange={(e) => setFormState({ ...formState, supervisorId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F1F3F6] rounded-[12px] text-sm font-sans text-ink-primary focus:outline-none focus:ring-2 focus:ring-[#0E6266]/30"
                >
                  <option value="">Select team lead...</option>
                  {scopedTeamLeads.map((tl) => (
                    <option key={tl.id} value={tl.id}>
                      {tl.firstName} {tl.lastName} ({tl.branchName || 'Team Lead'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-sans font-semibold text-ink-secondary">
                  Activity Reference or Field Note (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Meskel Square Clean-up attendance"
                  value={formState.activityTitle}
                  onChange={(e) => setFormState({ ...formState, activityTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F1F3F6] rounded-[12px] text-sm font-sans text-ink-primary focus:outline-none focus:ring-2 focus:ring-[#0E6266]/30"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-sans font-medium text-ink-secondary hover:bg-[#F1F3F6] rounded-[8px]"
                >
                  Cancel
                </button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting || isBudgetExceeded}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit to supervisor'}
                </Button>
              </div>
            </form>
          </SheetModal>
        )}
      </div>
    </PageShell>
  );
};
