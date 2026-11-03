import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PageShell, StatusMark, Button, SheetModal } from '../../components/ui';
import { TopoBackdrop } from '../../components/signature/TopoBackdrop';
import { TicketCard } from '../../components/signature/TicketCard';
import {
  ArrowLeft,
  Calendar,
  UsersThree,
  Money,
  MapPin,
  Plus,
  UserPlus,
  CheckCircle,
  XCircle,
  Clock,
  Warning,
} from '@phosphor-icons/react';
import { Project, Activity, Assignment, AllowanceRequest, User } from '../../types';
import { getProjectById, ProjectDetailView } from '../../api/projects';
import { getAssignments, createAssignment } from '../../api/assignments';
import { prepareAllowance } from '../../api/allowances';
import { store } from '../../api/store';
import { can } from '../../utils/permissions';
import { filterByScope } from '../../utils/scoping';

export const ManagerProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = store.getCurrentUser();

  const [project, setProject] = useState<ProjectDetailView | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  // Assign Volunteer Modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [availableVolunteers, setAvailableVolunteers] = useState<User[]>([]);
  const [teamLeads, setTeamLeads] = useState<User[]>([]);
  const [assignForm, setAssignForm] = useState({
    volunteerId: '',
    supervisorId: '',
    startDate: '',
    endDate: '',
    notes: '',
  });
  const [assignError, setAssignError] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  // Prepare Allowance Modal
  const [isAllowanceModalOpen, setIsAllowanceModalOpen] = useState(false);
  const [allowanceForm, setAllowanceForm] = useState({
    volunteerId: '',
    activityId: '',
    days: 3,
    supervisorId: '',
  });
  const [allowanceError, setAllowanceError] = useState('');
  const [isPreparingAllowance, setIsPreparingAllowance] = useState(false);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getProjectById(id);
      setProject(data);

      const asgns = await getAssignments({ projectId: id });
      setAssignments(asgns);

      // Load scoped volunteers and team leads
      const state = store.getState();
      const scopedUsers = filterByScope(currentUser, state.users || []);
      setAvailableVolunteers(scopedUsers.filter((u) => u.role === 'volunteer'));
      setTeamLeads(scopedUsers.filter((u) => u.role === 'team_lead'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignForm.volunteerId || !assignForm.supervisorId || !assignForm.startDate || !project) {
      setAssignError('Please complete all required fields.');
      return;
    }

    setIsAssigning(true);
    setAssignError('');
    try {
      const vol = availableVolunteers.find((v) => v.id === assignForm.volunteerId);
      const lead = teamLeads.find((l) => l.id === assignForm.supervisorId);

      await createAssignment({
        projectId: project.id,
        projectName: project.name,
        branchId: project.branchId,
        branchName: project.branchName,
        areaId: project.areaId,
        areaName: project.areaName,
        volunteerId: assignForm.volunteerId,
        volunteerName: vol ? `${vol.firstName || ''} ${vol.lastName || ''}`.trim() || vol.username : 'Volunteer',
        supervisorId: assignForm.supervisorId,
        supervisorName: lead ? `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || lead.username : 'Team Lead',
        startDate: assignForm.startDate,
        endDate: assignForm.endDate || undefined,
        notes: assignForm.notes.trim() || undefined,
      });

      setIsAssignModalOpen(false);
      setAssignForm({
        volunteerId: '',
        supervisorId: '',
        startDate: '',
        endDate: '',
        notes: '',
      });
      loadData();
    } catch (err: any) {
      setAssignError(err.message || 'Failed to create assignment');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleAllowanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allowanceForm.volunteerId || !allowanceForm.supervisorId || allowanceForm.days <= 0 || !project) {
      setAllowanceError('Please complete all fields with valid values.');
      return;
    }

    setIsPreparingAllowance(true);
    setAllowanceError('');
    try {
      const lead = teamLeads.find((l) => l.id === allowanceForm.supervisorId);
      const act = project.activities?.find((a) => a.id === allowanceForm.activityId);

      await prepareAllowance({
        projectId: project.id,
        volunteerId: allowanceForm.volunteerId,
        activityId: allowanceForm.activityId || undefined,
        activityTitle: act?.title || undefined,
        days: Number(allowanceForm.days),
        supervisorId: allowanceForm.supervisorId,
        supervisorName: lead ? `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || lead.username : 'Team Lead',
        status: 'submitted',
      });

      setIsAllowanceModalOpen(false);
      setAllowanceForm({
        volunteerId: '',
        activityId: '',
        days: 3,
        supervisorId: '',
      });
      loadData();
    } catch (err: any) {
      setAllowanceError(err.message || 'Failed to prepare allowance');
    } finally {
      setIsPreparingAllowance(false);
    }
  };

  if (loading) {
    return (
      <PageShell page="manager/project-detail" signature="TopoBackdrop">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 text-center text-sm font-sans text-ink-secondary">
          Loading project details...
        </div>
      </PageShell>
    );
  }

  if (!project) {
    return (
      <PageShell page="manager/project-detail" signature="TopoBackdrop">
        <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
          <div className="font-display font-bold text-2xl text-ink-primary">
            Project not found
          </div>
          <p className="font-sans text-sm text-ink-secondary">
            The project does not exist or you do not have permission to view it.
          </p>
          <Link to="/manager/projects" className="inline-flex items-center gap-1 font-semibold text-[#0E6266] hover:underline">
            <ArrowLeft className="w-4 h-4" weight="bold" />
            <span>Back to projects</span>
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell page="manager/project-detail" signature="TopoBackdrop">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Navigation Breadcrumb */}
        <Link
          to="/manager/projects"
          className="inline-flex items-center gap-1.5 text-sm font-sans font-medium text-ink-secondary hover:text-ink-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" weight="bold" />
          <span>Back to projects</span>
        </Link>

        {/* Hero Banner with TopoBackdrop */}
        <div className="relative rounded-[16px] bg-[#0E6266]/5 p-6 sm:p-8 overflow-hidden space-y-6">
          <TopoBackdrop color="#0E6266" opacity={0.07} />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="font-sans text-xs font-semibold px-2.5 py-1 rounded-[6px] bg-white text-ink-primary">
                  {project.branchName || 'Branch'}
                </span>
                <StatusMark
                  status={project.status === 'active' ? 'approved' : project.status === 'completed' ? 'approved' : 'waiting'}
                  label={project.status}
                />
              </div>

              <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink-primary tracking-tight">
                {project.name}
              </h1>
              <p className="font-sans text-base text-ink-secondary">
                {project.description}
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap gap-3">
              {can(currentUser, 'assignments', 'create') && (
                <Button
                  variant="secondary"
                  onClick={() => setIsAssignModalOpen(true)}
                  className="inline-flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" weight="bold" />
                  <span>Assign volunteer</span>
                </Button>
              )}
              {can(currentUser, 'allowances', 'create') && (
                <Button
                  variant="primary"
                  onClick={() => setIsAllowanceModalOpen(true)}
                  className="inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" weight="bold" />
                  <span>Prepare allowance</span>
                </Button>
              )}
            </div>
          </div>

          {/* Budget Figure Highlight (Rule 1: Budget as one large numeral for what is left + inline sentence) */}
          <div className="relative z-10 p-5 rounded-[12px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] space-y-2">
            <div className="font-sans text-xs font-semibold uppercase tracking-wider text-ink-secondary">
              Remaining available budget
            </div>
            <div className="font-display font-bold text-4xl sm:text-5xl text-ink-primary tracking-tight">
              ETB {project.remaining.toLocaleString()}
            </div>
            <div className="font-sans text-sm text-ink-secondary">
              ETB {project.spent.toLocaleString()} spent to date and ETB {project.reserved.toLocaleString()} reserved for approved allowances from total budget of ETB {project.budget.toLocaleString()}.
            </div>
          </div>

          {/* Inline Operational Metadata */}
          <div className="relative z-10 flex flex-wrap items-center gap-6 text-sm font-sans text-ink-secondary pt-1">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4" weight="bold" />
              <span>{project.start} to {project.end}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Money className="w-4 h-4" weight="bold" />
              <span>ETB {project.allowancePerDay} per volunteer day</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <UsersThree className="w-4 h-4" weight="bold" />
              <span>{assignments.length} volunteers assigned</span>
            </span>
          </div>
        </div>

        {/* Section 1: Assigned Volunteers */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="font-display font-bold text-xl text-ink-primary">
                Assigned volunteers ({assignments.length})
              </h2>
              <p className="font-sans text-xs text-ink-secondary">
                Volunteers deployed to this project with their field supervisors.
              </p>
            </div>
            {can(currentUser, 'assignments', 'create') && (
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(true)}
                className="text-xs font-sans font-semibold text-[#0E6266] hover:underline inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" weight="bold" />
                <span>Assign more</span>
              </button>
            )}
          </div>

          {assignments.length === 0 ? (
            <div className="p-8 rounded-[16px] bg-[#F7F8FA] text-center text-sm font-sans text-ink-secondary">
              No volunteers currently assigned to this project.
            </div>
          ) : (
            <div className="rounded-[16px] bg-[#F7F8FA] p-3 space-y-2">
              {assignments.map((asgn) => (
                <div
                  key={asgn.id}
                  className="p-3.5 rounded-[12px] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-sm text-ink-primary">
                        {asgn.volunteerName}
                      </span>
                      <StatusMark
                        status={
                          asgn.status === 'accepted' || asgn.status === 'completed'
                            ? 'approved'
                            : asgn.status === 'declined'
                            ? 'declined'
                            : 'waiting'
                        }
                        label={asgn.status}
                      />
                    </div>
                    <div className="font-sans text-xs text-ink-secondary">
                      Supervisor: <span className="font-medium text-ink-primary">{asgn.supervisorName || 'Team Lead'}</span> • Started: {asgn.startDate}
                      {asgn.declineReason && (
                        <span className="text-red-600 block mt-0.5">Reason: {asgn.declineReason}</span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs font-sans text-ink-secondary self-start sm:self-auto">
                    Assigned by {asgn.assignedByName || 'Manager'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Project Activities (TicketCard) */}
        <div className="space-y-4">
          <div className="space-y-0.5">
            <h2 className="font-display font-bold text-xl text-ink-primary">
              Project activities ({project.activities?.length || 0})
            </h2>
            <p className="font-sans text-xs text-ink-secondary">
              Field tasks and sessions organized under this project charter.
            </p>
          </div>

          {(!project.activities || project.activities.length === 0) ? (
            <div className="p-8 rounded-[16px] bg-[#F7F8FA] text-center text-sm font-sans text-ink-secondary">
              No activities currently linked to this project.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.activities.map((act) => (
                <TicketCard key={act.id} activity={act} />
              ))}
            </div>
          )}
        </div>

        {/* Section 3: Project Allowances */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="font-display font-bold text-xl text-ink-primary">
                Allowances & disbursements ({project.allowances?.length || 0})
              </h2>
              <p className="font-sans text-xs text-ink-secondary">
                Field stipends prepared, verified, approved, and disbursed.
              </p>
            </div>
            {can(currentUser, 'allowances', 'create') && (
              <button
                type="button"
                onClick={() => setIsAllowanceModalOpen(true)}
                className="text-xs font-sans font-semibold text-[#0E6266] hover:underline inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" weight="bold" />
                <span>Prepare allowance</span>
              </button>
            )}
          </div>

          {(!project.allowances || project.allowances.length === 0) ? (
            <div className="p-8 rounded-[16px] bg-[#F7F8FA] text-center text-sm font-sans text-ink-secondary">
              No allowance requests recorded for this project yet.
            </div>
          ) : (
            <div className="rounded-[16px] bg-[#F7F8FA] p-3 space-y-2">
              {project.allowances.map((alw) => (
                <div
                  key={alw.id}
                  className="p-3.5 rounded-[12px] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-xs font-semibold px-2 py-0.5 rounded-[4px] bg-[#F1F3F6] text-ink-secondary">
                        {alw.allowanceNumber}
                      </span>
                      <span className="font-display font-bold text-sm text-ink-primary">
                        {alw.volunteerName}
                      </span>
                      <StatusMark
                        status={
                          alw.status === 'paid'
                            ? 'approved'
                            : alw.status === 'approved'
                            ? 'approved'
                            : alw.status === 'rejected' || alw.status === 'failed'
                            ? 'declined'
                            : 'waiting'
                        }
                        label={alw.status}
                      />
                    </div>

                    <div className="font-sans text-xs text-ink-secondary">
                      {alw.days} days @ ETB {alw.allowancePerDay}/day • Supervisor: {alw.supervisorName || 'Team Lead'}
                      {alw.paymentReference && (
                        <span className="block text-emerald-700 font-medium">Telebirr Ref: {alw.paymentReference}</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right self-end sm:self-auto">
                    <div className="font-display font-bold text-base text-ink-primary">
                      ETB {alw.totalAmount.toLocaleString()}
                    </div>
                    <div className="font-sans text-[11px] text-ink-secondary">
                      {new Date(alw.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal: Assign Volunteer */}
        {isAssignModalOpen && (
          <SheetModal
            isOpen={isAssignModalOpen}
            onClose={() => setIsAssignModalOpen(false)}
            title="Assign volunteer to project"
            subtitle={`Deploy a volunteer to ${project.name} under a supervising Team Lead.`}
          >
            <form onSubmit={handleAssignSubmit} className="space-y-4">
              {assignError && (
                <div className="p-3 rounded-[12px] bg-red-50 text-red-700 text-xs font-sans">
                  {assignError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-sans font-semibold text-ink-secondary">
                  Select Volunteer *
                </label>
                <select
                  required
                  value={assignForm.volunteerId}
                  onChange={(e) => setAssignForm({ ...assignForm, volunteerId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F1F3F6] rounded-[12px] text-sm font-sans text-ink-primary focus:outline-none focus:ring-2 focus:ring-[#0E6266]/30"
                >
                  <option value="">Choose a volunteer...</option>
                  {availableVolunteers.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.firstName} {v.lastName} ({v.username}) - {v.branchName || 'Branch'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-sans font-semibold text-ink-secondary">
                  Field Supervisor (Team Lead) *
                </label>
                <select
                  required
                  value={assignForm.supervisorId}
                  onChange={(e) => setAssignForm({ ...assignForm, supervisorId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F1F3F6] rounded-[12px] text-sm font-sans text-ink-primary focus:outline-none focus:ring-2 focus:ring-[#0E6266]/30"
                >
                  <option value="">Choose a supervisor...</option>
                  {teamLeads.map((tl) => (
                    <option key={tl.id} value={tl.id}>
                      {tl.firstName} {tl.lastName} ({tl.branchName || 'Team Lead'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-sans font-semibold text-ink-secondary">
                    Deployment Start *
                  </label>
                  <input
                    type="date"
                    required
                    value={assignForm.startDate}
                    onChange={(e) => setAssignForm({ ...assignForm, startDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F1F3F6] rounded-[12px] text-sm font-sans text-ink-primary focus:outline-none focus:ring-2 focus:ring-[#0E6266]/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-sans font-semibold text-ink-secondary">
                    Deployment End
                  </label>
                  <input
                    type="date"
                    value={assignForm.endDate}
                    onChange={(e) => setAssignForm({ ...assignForm, endDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F1F3F6] rounded-[12px] text-sm font-sans text-ink-primary focus:outline-none focus:ring-2 focus:ring-[#0E6266]/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-sans font-semibold text-ink-secondary">
                  Assignment Instructions or Role Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail primary shift schedule, equipment required, or reporting point..."
                  value={assignForm.notes}
                  onChange={(e) => setAssignForm({ ...assignForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F1F3F6] rounded-[12px] text-sm font-sans text-ink-primary focus:outline-none focus:ring-2 focus:ring-[#0E6266]/30 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 text-sm font-sans font-medium text-ink-secondary hover:bg-[#F1F3F6] rounded-[8px]"
                >
                  Cancel
                </button>
                <Button variant="primary" type="submit" disabled={isAssigning}>
                  {isAssigning ? 'Assigning...' : 'Dispatch assignment'}
                </Button>
              </div>
            </form>
          </SheetModal>
        )}

        {/* Modal: Prepare Allowance */}
        {isAllowanceModalOpen && (
          <SheetModal
            isOpen={isAllowanceModalOpen}
            onClose={() => setIsAllowanceModalOpen(false)}
            title="Prepare allowance request"
            subtitle={`Calculate field stipend for volunteer on ${project.name}.`}
          >
            <form onSubmit={handleAllowanceSubmit} className="space-y-4">
              {allowanceError && (
                <div className="p-3 rounded-[12px] bg-red-50 text-red-700 text-xs font-sans">
                  {allowanceError}
                </div>
              )}

              {/* Live budget calculation callout */}
              <div className="p-3.5 rounded-[12px] bg-[#F1F3F6] space-y-1 text-xs font-sans">
                <div className="text-ink-secondary">
                  Project remaining available budget: <span className="font-bold text-ink-primary">ETB {project.remaining.toLocaleString()}</span>
                </div>
                <div className="text-ink-secondary">
                  Daily allowance rate: <span className="font-bold text-ink-primary">ETB {project.allowancePerDay}</span>
                </div>
                <div className="text-[#0E6266] font-semibold pt-1">
                  Total calculated request: ETB {(allowanceForm.days * project.allowancePerDay).toLocaleString()}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-sans font-semibold text-ink-secondary">
                  Select Volunteer *
                </label>
                <select
                  required
                  value={allowanceForm.volunteerId}
                  onChange={(e) => setAllowanceForm({ ...allowanceForm, volunteerId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F1F3F6] rounded-[12px] text-sm font-sans text-ink-primary focus:outline-none focus:ring-2 focus:ring-[#0E6266]/30"
                >
                  <option value="">Choose a volunteer...</option>
                  {availableVolunteers.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.firstName} {v.lastName} ({v.username})
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
                  value={allowanceForm.days}
                  onChange={(e) => setAllowanceForm({ ...allowanceForm, days: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-[#F1F3F6] rounded-[12px] text-sm font-sans text-ink-primary focus:outline-none focus:ring-2 focus:ring-[#0E6266]/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-sans font-semibold text-ink-secondary">
                  Linked Activity (optional)
                </label>
                <select
                  value={allowanceForm.activityId}
                  onChange={(e) => setAllowanceForm({ ...allowanceForm, activityId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F1F3F6] rounded-[12px] text-sm font-sans text-ink-primary focus:outline-none focus:ring-2 focus:ring-[#0E6266]/30"
                >
                  <option value="">No specific activity / general project days</option>
                  {(project.activities || []).map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title} ({a.place})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-sans font-semibold text-ink-secondary">
                  Supervising Team Lead (Verifying Officer) *
                </label>
                <select
                  required
                  value={allowanceForm.supervisorId}
                  onChange={(e) => setAllowanceForm({ ...allowanceForm, supervisorId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F1F3F6] rounded-[12px] text-sm font-sans text-ink-primary focus:outline-none focus:ring-2 focus:ring-[#0E6266]/30"
                >
                  <option value="">Choose a team lead...</option>
                  {teamLeads.map((tl) => (
                    <option key={tl.id} value={tl.id}>
                      {tl.firstName} {tl.lastName} ({tl.branchName || 'Team Lead'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAllowanceModalOpen(false)}
                  className="px-4 py-2 text-sm font-sans font-medium text-ink-secondary hover:bg-[#F1F3F6] rounded-[8px]"
                >
                  Cancel
                </button>
                <Button variant="primary" type="submit" disabled={isPreparingAllowance}>
                  {isPreparingAllowance ? 'Submitting...' : 'Submit allowance request'}
                </Button>
              </div>
            </form>
          </SheetModal>
        )}
      </div>
    </PageShell>
  );
};
