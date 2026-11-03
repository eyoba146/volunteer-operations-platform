import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { OrgUnit, OrgUnitType, User, VolunteerProfile, Activity } from '../../types';
import { Button, Input, Select, SheetModal, Skeleton, StatusMark, TopoBackdrop } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import {
  Buildings,
  CaretRight,
  CaretDown,
  Plus,
  PencilSimple,
  ArrowsOutCardinal,
  Archive,
  ArrowCounterClockwise,
  MagnifyingGlass,
  MapPin,
  Users,
  TreeStructure,
} from '@phosphor-icons/react';

export const AdminOrganisationPage: React.FC = () => {
  const { user, profile } = useAuth();
  const toast = useToast();

  const [orgUnits, setOrgUnits] = useState<OrgUnit[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [profiles, setProfiles] = useState<VolunteerProfile[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('active');

  // Expanded nodes state
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'unit-ho': true,
    'unit-area-addis': true,
    'unit-area-adama': true,
  });

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);

  // Form states
  const [selectedUnit, setSelectedUnit] = useState<OrgUnit | null>(null);
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formType, setFormType] = useState<OrgUnitType>('branch');
  const [formParentId, setFormParentId] = useState<string>('unit-area-addis');
  const [formStatus, setFormStatus] = useState<'active' | 'archived'>('active');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const state = api.store.getState();
      setOrgUnits(state.orgUnits || []);
      setUsers(state.users || []);
      setProfiles(state.profiles || []);
      setActivities(state.activities || []);
    } catch {
      toast.error('Could not load organisation structure');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    orgUnits.forEach((u) => {
      all[u.id] = true;
    });
    setExpandedNodes(all);
  };

  const collapseAll = () => {
    setExpandedNodes({});
  };

  // Unit metrics calculations
  const unitStats = useMemo(() => {
    const stats: Record<string, { volunteers: number; staff: number; activities: number }> = {};

    orgUnits.forEach((u) => {
      // Find all descendant unit IDs including self
      const descendantIds = new Set<string>([u.id]);
      let added = true;
      while (added) {
        added = false;
        orgUnits.forEach((child) => {
          if (child.parentId && descendantIds.has(child.parentId) && !descendantIds.has(child.id)) {
            descendantIds.add(child.id);
            added = true;
          }
        });
      }

      // Count volunteers
      const volCount = profiles.filter((p) => {
        if (p.branchId && descendantIds.has(p.branchId)) return true;
        if (p.areaId && descendantIds.has(p.areaId)) return true;
        return false;
      }).length;

      // Count staff
      const staffCount = users.filter((usr) => {
        if (usr.role === 'applicant' || usr.role === 'volunteer') return false;
        if (usr.branchId && descendantIds.has(usr.branchId)) return true;
        if (usr.areaId && descendantIds.has(usr.areaId)) return true;
        if (u.type === 'head_office' && (!usr.areaId || usr.scope?.level === 'all')) return true;
        return false;
      }).length;

      // Count activities
      const actCount = activities.filter((a) => {
        if (a.branchId && descendantIds.has(a.branchId)) return true;
        if (a.areaId && descendantIds.has(a.areaId)) return true;
        return false;
      }).length;

      stats[u.id] = {
        volunteers: volCount,
        staff: staffCount,
        activities: actCount,
      };
    });

    return stats;
  }, [orgUnits, users, profiles, activities]);

  // Overall counts
  const summaryCounts = useMemo(() => {
    const areas = orgUnits.filter((u) => u.type === 'area' && u.status === 'active').length;
    const branches = orgUnits.filter((u) => u.type === 'branch' && u.status === 'active').length;
    const locations = orgUnits.filter((u) => u.type === 'location' && u.status === 'active').length;
    const totalVolunteers = profiles.length;
    const totalStaff = users.filter((u) => u.role !== 'applicant' && u.role !== 'volunteer').length;
    return { areas, branches, locations, totalVolunteers, totalStaff };
  }, [orgUnits, profiles, users]);

  // Tree structure
  const rootUnits = useMemo(() => {
    return orgUnits.filter((u) => !u.parentId || u.type === 'head_office');
  }, [orgUnits]);

  const getChildren = (parentId: string) => {
    return orgUnits.filter((u) => u.parentId === parentId);
  };

  // Handlers for Modals
  const openAddModal = (parent?: OrgUnit) => {
    if (parent) {
      setFormParentId(parent.id);
      if (parent.type === 'head_office') setFormType('area');
      else if (parent.type === 'area') setFormType('branch');
      else if (parent.type === 'branch') setFormType('location');
      else setFormType('location');
    } else {
      setFormParentId('unit-ho');
      setFormType('area');
    }
    setFormName('');
    setFormCode('');
    setFormStatus('active');
    setShowAddModal(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error('Unit name is required');
      return;
    }
    setIsSubmitting(true);
    try {
      const code = formCode.trim() || formName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '-').slice(0, 10);
      await api.createOrgUnit({
        name: formName.trim(),
        code,
        type: formType,
        parentId: formParentId || null,
        status: formStatus,
      });
      toast.success(`Created ${formType.replace('_', ' ')}: "${formName}"`);
      setShowAddModal(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create unit');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (unit: OrgUnit) => {
    setSelectedUnit(unit);
    setFormName(unit.name);
    setFormCode(unit.code || '');
    setFormStatus(unit.status || 'active');
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnit) return;
    if (!formName.trim()) {
      toast.error('Unit name is required');
      return;
    }
    setIsSubmitting(true);
    try {
      await api.updateOrgUnit(selectedUnit.id, {
        name: formName.trim(),
        code: formCode.trim(),
        status: formStatus,
      });
      toast.success(`Updated unit "${formName}"`);
      setShowEditModal(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update unit');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openMoveModal = (unit: OrgUnit) => {
    setSelectedUnit(unit);
    setFormParentId(unit.parentId || '');
    setShowMoveModal(true);
  };

  const handleMoveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnit) return;
    setIsSubmitting(true);
    try {
      await api.moveOrgUnit(selectedUnit.id, formParentId || null);
      toast.success(`Moved "${selectedUnit.name}" to new parent unit`);
      setShowMoveModal(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to move unit');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchiveToggle = async (unit: OrgUnit) => {
    const nextStatus = unit.status === 'archived' ? 'active' : 'archived';
    try {
      await api.updateOrgUnit(unit.id, { status: nextStatus });
      toast.success(
        nextStatus === 'archived'
          ? `Archived "${unit.name}"`
          : `Restored "${unit.name}" to active status`
      );
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Action failed');
    }
  };

  // Node Component for recursive Tree render
  const renderUnitNode = (unit: OrgUnit, depth: number = 0) => {
    // Filter check
    if (statusFilter !== 'all' && unit.status !== statusFilter) {
      // Check if any child matches
      const hasMatchingChild = getChildren(unit.id).some((c) => c.status === statusFilter);
      if (!hasMatchingChild) return null;
    }

    if (typeFilter !== 'all' && unit.type !== typeFilter) {
      const hasMatchingChild = getChildren(unit.id).some((c) => c.type === typeFilter);
      if (!hasMatchingChild) return null;
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchSelf = unit.name.toLowerCase().includes(q) || (unit.code ? unit.code.toLowerCase().includes(q) : false);
      const matchChild = getChildren(unit.id).some(
        (c) => c.name.toLowerCase().includes(q) || (c.code ? c.code.toLowerCase().includes(q) : false)
      );
      if (!matchSelf && !matchChild) return null;
    }

    const children = getChildren(unit.id);
    const hasChildren = children.length > 0;
    const isExpanded = !!expandedNodes[unit.id];
    const stats = unitStats[unit.id] || { volunteers: 0, staff: 0, activities: 0 };

    const typeMeta: Record<OrgUnitType, { label: string; bg: string; text: string }> = {
      head_office: { label: 'Head Office', bg: 'bg-[#111315]', text: 'text-white' },
      area: { label: 'Regional Area', bg: 'bg-[#EBF5FB]', text: 'text-[#1B4F72]' },
      branch: { label: 'Local Branch', bg: 'bg-[#E8F8F5]', text: 'text-[#0E6266]' },
      location: { label: 'Venue Location', bg: 'bg-[#FEF9E7]', text: 'text-[#7D6608]' },
    };

    const meta = typeMeta[unit.type] || typeMeta.branch;

    return (
      <div key={unit.id} className="space-y-1">
        <div
          className={`flex items-center justify-between p-3 sm:p-4 rounded-[12px] transition-colors ${
            unit.status === 'archived'
              ? 'bg-[#F1F3F6] opacity-60'
              : 'bg-white hover:bg-[#F7F8FA] shadow-[0_1px_2px_rgba(16,24,40,0.04)]'
          }`}
          style={{ marginLeft: `${Math.min(depth * 20, 80)}px` }}
        >
          {/* Left: Expand toggle, icon, and title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {hasChildren ? (
              <button
                onClick={() => toggleNode(unit.id)}
                className="w-7 h-7 flex items-center justify-center rounded-[6px] hover:bg-[#E8EBEF] text-ink-secondary cursor-pointer shrink-0"
                aria-label={isExpanded ? 'Collapse node' : 'Expand node'}
              >
                {isExpanded ? (
                  <CaretDown className="w-4 h-4" weight="bold" />
                ) : (
                  <CaretRight className="w-4 h-4" weight="bold" />
                )}
              </button>
            ) : (
              <span className="w-7 h-7 shrink-0 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-ink-tertiary" />
              </span>
            )}

            <div className="shrink-0">
              {unit.type === 'head_office' ? (
                <Buildings className="w-5 h-5 text-ink-primary" weight="bold" />
              ) : unit.type === 'area' ? (
                <TreeStructure className="w-5 h-5 text-[#1B4F72]" weight="bold" />
              ) : unit.type === 'branch' ? (
                <Buildings className="w-4 h-4 text-[#0E6266]" weight="bold" />
              ) : (
                <MapPin className="w-4 h-4 text-[#7D6608]" weight="bold" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm text-ink-primary truncate">
                  {unit.name}
                </span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-[4px] ${meta.bg} ${meta.text}`}>
                  {meta.label}
                </span>
                <span className="font-mono text-[11px] text-ink-tertiary">
                  {unit.code}
                </span>
                {unit.status === 'archived' && (
                  <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-[4px] bg-[#E5E7EB] text-ink-tertiary">
                    Archived
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Metrics & Actions */}
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            {/* Live Counts */}
            <div className="hidden md:flex items-center gap-4 text-xs text-ink-secondary">
              <span title="Active Volunteers in this unit and children">
                <strong className="text-ink-primary font-semibold">{stats.volunteers}</strong> volunteers
              </span>
              <span title="Staff assigned to this unit">
                <strong className="text-ink-primary font-semibold">{stats.staff}</strong> staff
              </span>
              <span title="Activities hosted in this unit">
                <strong className="text-ink-primary font-semibold">{stats.activities}</strong> activities
              </span>
            </div>

            {/* Actions Menu */}
            <div className="flex items-center gap-1">
              {unit.type !== 'location' && unit.status === 'active' && (
                <button
                  onClick={() => openAddModal(unit)}
                  className="p-1.5 rounded-[6px] hover:bg-[#E8EBEF] text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer"
                  title="Add child unit"
                >
                  <Plus className="w-4 h-4" weight="bold" />
                </button>
              )}
              <button
                onClick={() => openEditModal(unit)}
                className="p-1.5 rounded-[6px] hover:bg-[#E8EBEF] text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer"
                title="Edit unit name and code"
              >
                <PencilSimple className="w-4 h-4" weight="bold" />
              </button>
              {unit.type !== 'head_office' && (
                <button
                  onClick={() => openMoveModal(unit)}
                  className="p-1.5 rounded-[6px] hover:bg-[#E8EBEF] text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer"
                  title="Move unit under a new parent"
                >
                  <ArrowsOutCardinal className="w-4 h-4" weight="bold" />
                </button>
              )}
              {unit.type !== 'head_office' && (
                <button
                  onClick={() => handleArchiveToggle(unit)}
                  className="p-1.5 rounded-[6px] hover:bg-[#E8EBEF] text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer"
                  title={unit.status === 'archived' ? 'Restore unit' : 'Archive unit'}
                >
                  {unit.status === 'archived' ? (
                    <ArrowCounterClockwise className="w-4 h-4" weight="bold" />
                  ) : (
                    <Archive className="w-4 h-4" weight="bold" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Child units if expanded */}
        {hasChildren && isExpanded && (
          <div className="space-y-1">
            {children.map((child) => renderUnitNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6" data-page="admin-organisation" data-signature="trail-grid">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="rect" className="h-44" />
        <div className="space-y-3">
          <Skeleton variant="rect" className="h-16" />
          <Skeleton variant="rect" className="h-16" />
          <Skeleton variant="rect" className="h-16" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left" data-page="admin-organisation" data-signature="trail-grid">
      {/* Editorial Header */}
      <div className="relative overflow-hidden rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] p-6 sm:p-8 space-y-6">
        <TopoBackdrop color="#1B4F72" opacity={0.05} />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6">
          <div className="space-y-1">
            <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-ink-primary">
              Organisation units and regional structure
            </h1>
            <p className="text-sm text-ink-secondary mt-1 max-w-xl leading-relaxed">
              Manage the 4-tier operational hierarchy: Head Office, regional Areas, local Branches, and service Locations.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <Button
              variant="primary"
              onClick={() => openAddModal()}
              className="bg-[#111315] hover:bg-black text-white"
            >
              <Plus className="w-4 h-4 mr-2 inline-block" weight="bold" />
              Add organisation unit
            </Button>
          </div>
        </div>

        {/* Summary Metrics Row */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4">
          <div className="p-3.5 rounded-[12px] bg-[#F7F8FA]">
            <span className="text-xs text-ink-tertiary uppercase tracking-wider block font-medium">Areas</span>
            <span className="font-mono text-2xl font-bold text-ink-primary mt-1 block">
              {summaryCounts.areas}
            </span>
          </div>
          <div className="p-3.5 rounded-[12px] bg-[#F7F8FA]">
            <span className="text-xs text-ink-tertiary uppercase tracking-wider block font-medium">Branches</span>
            <span className="font-mono text-2xl font-bold text-ink-primary mt-1 block">
              {summaryCounts.branches}
            </span>
          </div>
          <div className="p-3.5 rounded-[12px] bg-[#F7F8FA]">
            <span className="text-xs text-ink-tertiary uppercase tracking-wider block font-medium">Locations</span>
            <span className="font-mono text-2xl font-bold text-ink-primary mt-1 block">
              {summaryCounts.locations}
            </span>
          </div>
          <div className="p-3.5 rounded-[12px] bg-[#F7F8FA]">
            <span className="text-xs text-ink-tertiary uppercase tracking-wider block font-medium">Volunteers</span>
            <span className="font-mono text-2xl font-bold text-ink-primary mt-1 block">
              {summaryCounts.totalVolunteers}
            </span>
          </div>
          <div className="p-3.5 rounded-[12px] bg-[#F7F8FA] col-span-2 sm:col-span-1">
            <span className="text-xs text-ink-tertiary uppercase tracking-wider block font-medium">Active Staff</span>
            <span className="font-mono text-2xl font-bold text-ink-primary mt-1 block">
              {summaryCounts.totalStaff}
            </span>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters, Search, Expand/Collapse */}
      <div className="p-4 rounded-[16px] bg-[#F7F8FA] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
            <input
              type="text"
              placeholder="Search units by name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white rounded-[10px] text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-ink-primary/20"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-white rounded-[10px] text-sm text-ink-primary focus:outline-none"
          >
            <option value="all">All tiers</option>
            <option value="area">Regional areas</option>
            <option value="branch">Branches</option>
            <option value="location">Locations</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-white rounded-[10px] text-sm text-ink-primary focus:outline-none"
          >
            <option value="active">Active units</option>
            <option value="archived">Archived units</option>
            <option value="all">All statuses</option>
          </select>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={expandAll}
            className="px-3 py-1.5 rounded-[8px] bg-white hover:bg-[#E8EBEF] text-xs font-semibold text-ink-secondary transition-colors cursor-pointer"
          >
            Expand all
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1.5 rounded-[8px] bg-white hover:bg-[#E8EBEF] text-xs font-semibold text-ink-secondary transition-colors cursor-pointer"
          >
            Collapse all
          </button>
        </div>
      </div>

      {/* Organisation Units Tree View */}
      <div className="p-4 sm:p-6 rounded-[16px] bg-[#F7F8FA] space-y-2">
        {rootUnits.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Buildings className="w-10 h-10 text-ink-tertiary mx-auto" />
            <p className="text-base font-semibold text-ink-primary">No organisation units found</p>
            <p className="text-sm text-ink-secondary max-w-sm mx-auto">
              Get started by creating your top-level operational unit or adjusting your active filters.
            </p>
          </div>
        ) : (
          rootUnits.map((root) => renderUnitNode(root, 0))
        )}
      </div>

      {/* MODAL 1: Add Unit */}
      {showAddModal && (
        <SheetModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add organisation unit"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                Unit tier
              </label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as OrgUnitType)}
                className="w-full px-3 py-2.5 bg-[#F1F3F6] rounded-[10px] text-sm text-ink-primary focus:outline-none"
              >
                <option value="area">Regional area</option>
                <option value="branch">Local branch</option>
                <option value="location">Service location</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                Unit name
              </label>
              <input
                type="text"
                placeholder="e.g. Kirkos Branch, Adama Youth Center"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#F1F3F6] rounded-[10px] text-sm text-ink-primary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                Unit short code
              </label>
              <input
                type="text"
                placeholder="e.g. AA-KIRKOS, AD-CENTRAL"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#F1F3F6] rounded-[10px] text-sm text-ink-primary font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                Parent unit
              </label>
              <select
                value={formParentId}
                onChange={(e) => setFormParentId(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#F1F3F6] rounded-[10px] text-sm text-ink-primary focus:outline-none"
              >
                <option value="unit-ho">Head Office (top level)</option>
                {orgUnits
                  .filter((u) => u.type !== 'location' && u.id !== 'unit-ho')
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.type})
                    </option>
                  ))}
              </select>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create unit'}
              </Button>
            </div>
          </form>
        </SheetModal>
      )}

      {/* MODAL 2: Edit Unit */}
      {showEditModal && selectedUnit && (
        <SheetModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title={`Edit ${selectedUnit.name}`}
        >
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                Unit name
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#F1F3F6] rounded-[10px] text-sm text-ink-primary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                Unit short code
              </label>
              <input
                type="text"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#F1F3F6] rounded-[10px] text-sm text-ink-primary font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                Operating status
              </label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-[#F1F3F6] rounded-[10px] text-sm text-ink-primary focus:outline-none"
              >
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </form>
        </SheetModal>
      )}

      {/* MODAL 3: Move Unit */}
      {showMoveModal && selectedUnit && (
        <SheetModal
          isOpen={showMoveModal}
          onClose={() => setShowMoveModal(false)}
          title={`Move ${selectedUnit.name}`}
        >
          <form onSubmit={handleMoveSubmit} className="space-y-4">
            <p className="text-sm text-ink-secondary">
              Select the new parent unit for <strong>{selectedUnit.name}</strong>. All nested branches, locations, and volunteer assignments will remain intact.
            </p>

            <div>
              <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                New parent unit
              </label>
              <select
                value={formParentId}
                onChange={(e) => setFormParentId(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#F1F3F6] rounded-[10px] text-sm text-ink-primary focus:outline-none"
              >
                {selectedUnit.type === 'area' && <option value="unit-ho">Head Office (national)</option>}
                {orgUnits
                  .filter(
                    (u) =>
                      u.id !== selectedUnit.id &&
                      u.type !== 'location' &&
                      u.status === 'active'
                  )
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.type.replace('_', ' ')})
                    </option>
                  ))}
              </select>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowMoveModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Moving...' : 'Confirm move'}
              </Button>
            </div>
          </form>
        </SheetModal>
      )}
    </div>
  );
};
