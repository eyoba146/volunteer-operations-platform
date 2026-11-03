import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageShell, StatusMark, Button, SheetModal } from '../../components/ui';
import { TopoBackdrop } from '../../components/signature/TopoBackdrop';
import {
  FolderSimple,
  Plus,
  MagnifyingGlass,
  Calendar,
  UsersThree,
  Money,
  MapPin,
  Buildings,
} from '@phosphor-icons/react';
import { Project, ProjectStatus, OrgUnit } from '../../types';
import { getProjects, createProject, getProjectById } from '../../api/projects';
import { getOrgUnits } from '../../api/organisation';
import { store } from '../../api/store';
import { can } from '../../utils/permissions';
import { getScopeLabel } from '../../utils/scoping';

export const ManagerProjectsPage: React.FC = () => {
  const currentUser = store.getCurrentUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectMetrics, setProjectMetrics] = useState<Record<string, { spent: number; reserved: number; remaining: number }>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [branches, setBranches] = useState<OrgUnit[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    branchId: '',
    start: '',
    end: '',
    budget: 100000,
    allowancePerDay: 350,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const list = await getProjects({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: search || undefined,
      });
      setProjects(list);

      // Compute metrics for each project
      const metricsMap: Record<string, { spent: number; reserved: number; remaining: number }> = {};
      for (const p of list) {
        const detail = await getProjectById(p.id);
        if (detail) {
          metricsMap[p.id] = {
            spent: detail.spent,
            reserved: detail.reserved,
            remaining: detail.remaining,
          };
        }
      }
      setProjectMetrics(metricsMap);

      const units = await getOrgUnits();
      setBranches(units.filter((u) => u.type === 'branch' && u.status !== 'archived'));
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.branchId || !formData.start || !formData.end) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const selectedBranch = branches.find((b) => b.id === formData.branchId);
      const managerName = currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.username : 'Manager';
      
      await createProject({
        name: formData.name.trim(),
        description: formData.description.trim(),
        branchId: formData.branchId,
        branchName: selectedBranch?.name || 'Local Branch',
        areaId: selectedBranch?.parentId || undefined,
        start: formData.start,
        end: formData.end,
        budget: Number(formData.budget),
        allowancePerDay: Number(formData.allowancePerDay),
        managerId: currentUser?.id || 'usr-marta',
        managerName,
      });

      setIsModalOpen(false);
      setFormData({
        name: '',
        description: '',
        branchId: '',
        start: '',
        end: '',
        budget: 100000,
        allowancePerDay: 350,
      });
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell page="manager/projects" signature="TopoBackdrop">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink-primary tracking-tight">
              Projects
            </h1>
            <p className="font-sans text-base text-ink-secondary">
              Community initiatives, operational funds, and volunteer deployments in {getScopeLabel(currentUser)}.
            </p>
          </div>
          {can(currentUser, 'projects', 'create') && (
            <Button
              variant="primary"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 self-start md:self-auto"
            >
              <Plus className="w-4 h-4" weight="bold" />
              <span>Charter project</span>
            </Button>
          )}
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'active', 'planning', 'completed', 'paused'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-[8px] text-sm font-sans font-medium capitalize transition-colors select-none ${
                  statusFilter === st
                    ? 'bg-ink-primary text-white'
                    : 'text-ink-secondary hover:bg-[#F1F3F6]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search Field */}
          <div className="relative w-full sm:w-72">
            <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-secondary" weight="bold" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-[#F1F3F6] rounded-[12px] text-sm font-sans text-ink-primary placeholder:text-ink-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#0E6266]/30"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="p-12 text-center text-sm font-sans text-ink-secondary">
            Loading scoped projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 rounded-[16px] bg-[#F7F8FA] text-center space-y-3">
            <FolderSimple className="w-10 h-10 mx-auto text-ink-secondary/50" weight="bold" />
            <div className="font-display font-bold text-lg text-ink-primary">
              No projects found
            </div>
            <p className="font-sans text-sm text-ink-secondary max-w-md mx-auto">
              There are no projects matching your active scope and filters. Charter a new project to start organizing activities.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p) => {
              const m = projectMetrics[p.id] || { spent: 0, reserved: 0, remaining: p.budget };
              return (
                <div
                  key={p.id}
                  className="rounded-[16px] bg-[#F7F8FA] p-6 space-y-5 hover:bg-[#F1F3F6]/70 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-sans text-xs font-semibold px-2.5 py-1 rounded-[6px] bg-white text-ink-primary">
                        {p.branchName || 'Branch'}
                      </span>
                      <StatusMark
                        status={p.status === 'active' ? 'approved' : p.status === 'completed' ? 'approved' : 'waiting'}
                        label={p.status}
                      />
                    </div>

                    <div className="space-y-1">
                      <h2 className="font-display font-bold text-xl text-ink-primary">
                        {p.name}
                      </h2>
                      <p className="font-sans text-sm text-ink-secondary line-clamp-2">
                        {p.description}
                      </p>
                    </div>
                  </div>

                  {/* Budget Highlight */}
                  <div className="p-4 rounded-[12px] bg-white space-y-2">
                    <div className="font-sans text-xs text-ink-secondary">
                      Remaining available budget
                    </div>
                    <div className="font-display font-bold text-2xl text-ink-primary tracking-tight">
                      ETB {m.remaining.toLocaleString()}
                    </div>
                    <div className="font-sans text-xs text-ink-secondary">
                      ETB {m.spent.toLocaleString()} spent and ETB {m.reserved.toLocaleString()} reserved from ETB {p.budget.toLocaleString()} total
                    </div>
                  </div>

                  {/* Operational Details */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans text-ink-secondary">
                    <div className="flex items-center gap-4">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" weight="bold" />
                        {p.start} to {p.end}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Money className="w-3.5 h-3.5" weight="bold" />
                        ETB {p.allowancePerDay}/day
                      </span>
                    </div>

                    <Link
                      to={`/manager/projects/${p.id}`}
                      className="font-semibold text-[#0E6266] hover:underline inline-flex items-center gap-1 self-end sm:self-auto"
                    >
                      <span>Project details</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Charter Project Modal */}
        {isModalOpen && (
          <SheetModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Charter new project"
            subtitle="Define operational timeline, branch location, and volunteer budget."
          >
            <form onSubmit={handleCreate} className="space-y-5">
              {errorMsg && (
                <div className="p-3.5 rounded-[12px] bg-red-50 text-red-700 text-sm font-sans">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-sans font-semibold text-ink-secondary">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kirkos Youth Tree Canopy & Composting"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F1F3F6] rounded-[12px] text-sm font-sans text-ink-primary focus:outline-none focus:ring-2 focus:ring-[#0E6266]/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-sans font-semibold text-ink-secondary">
                  Operating Branch *
                </label>
                <select
                  required
                  value={formData.branchId}
                  onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F1F3F6] rounded-[12px] text-sm font-sans text-ink-primary focus:outline-none focus:ring-2 focus:ring-[#0E6266]/30"
                >
                  <option value="">Select a branch...</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-sans font-semibold text-ink-secondary">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.start}
                    onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F1F3F6] rounded-[12px] text-sm font-sans text-ink-primary focus:outline-none focus:ring-2 focus:ring-[#0E6266]/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-sans font-semibold text-ink-secondary">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.end}
                    onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F1F3F6] rounded-[12px] text-sm font-sans text-ink-primary focus:outline-none focus:ring-2 focus:ring-[#0E6266]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-sans font-semibold text-ink-secondary">
                    Total Project Budget (ETB) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1000}
                    step={1000}
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#F1F3F6] rounded-[12px] text-sm font-sans text-ink-primary focus:outline-none focus:ring-2 focus:ring-[#0E6266]/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-sans font-semibold text-ink-secondary">
                    Allowance Per Volunteer Day (ETB) *
                  </label>
                  <input
                    type="number"
                    required
                    min={100}
                    step={50}
                    value={formData.allowancePerDay}
                    onChange={(e) => setFormData({ ...formData, allowancePerDay: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#F1F3F6] rounded-[12px] text-sm font-sans text-ink-primary focus:outline-none focus:ring-2 focus:ring-[#0E6266]/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-sans font-semibold text-ink-secondary">
                  Project Description & Goals
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline key community objectives, volunteer scope, and measurable outcomes..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F1F3F6] rounded-[12px] text-sm font-sans text-ink-primary focus:outline-none focus:ring-2 focus:ring-[#0E6266]/30 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-sans font-medium text-ink-secondary hover:bg-[#F1F3F6] rounded-[8px] transition-colors"
                >
                  Cancel
                </button>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Confirm charter'}
                </Button>
              </div>
            </form>
          </SheetModal>
        )}
      </div>
    </PageShell>
  );
};
