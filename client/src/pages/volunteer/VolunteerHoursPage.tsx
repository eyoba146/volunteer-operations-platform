import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { HoursEntry, Activity } from '../../types';
import { LedgerTable, LedgerColumn, Button, StatusMark, SheetModal, Input, Select, Skeleton, EmptyState, JourneyLog, JourneyLogItem } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { Clock, Plus, Warning } from '@phosphor-icons/react';

export const VolunteerHoursPage: React.FC = () => {
  const { user } = useAuth();
  const [hours, setHours] = useState<HoursEntry[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manual hours form state
  const [selectedActivityId, setSelectedActivityId] = useState('');
  const [manualDate, setManualDate] = useState('2026-10-30');
  const [manualHours, setManualHours] = useState('4');
  const [manualMinutes, setManualMinutes] = useState('0');
  const [manualNote, setManualNote] = useState('');
  const [modalError, setModalError] = useState('');
  const [evidencePhoto, setEvidencePhoto] = useState('');
  
  // Submit completed field activity modal
  const [isFieldWorkModalOpen, setIsFieldWorkModalOpen] = useState(false);
  const [fieldWorkForm, setFieldWorkForm] = useState({
    title: '',
    date: '2026-10-30',
    hours: 4,
    branchId: '',
    projectId: '',
    evidenceUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    evidenceNote: '',
    supervisorId: '',
  });
  const [fieldWorkError, setFieldWorkError] = useState('');
  const [isSubmittingFieldWork, setIsSubmittingFieldWork] = useState(false);
  const [teamLeads, setTeamLeads] = useState<any[]>([]);
  const [scopedProjects, setScopedProjects] = useState<any[]>([]);

  const toast = useToast();

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [hList, aList] = await Promise.all([
        api.getHoursForUser(user.id),
        api.getAllActivities(),
      ]);
      setHours(hList);
      setActivities(aList);
      if (aList.length > 0 && !selectedActivityId) {
        setSelectedActivityId(aList[0].id);
      }
      const state = api.store.getState();
      const leads = (state.users || []).filter((u: any) => u.role === 'team_lead');
      setTeamLeads(leads);
      const projs = await api.getProjects();
      setScopedProjects(projs);
      if (leads.length > 0) {
        setFieldWorkForm((prev) => ({ ...prev, supervisorId: leads[0].id, branchId: user.branchId || 'branch-kirkos' }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');

    if (!user) return;

    // Check future date
    if (new Date(manualDate) > new Date()) {
      setModalError('Hours cannot be logged for future dates.');
      return;
    }

    if (!manualNote.trim()) {
      setModalError('Please explain why check-in was missed or manual recording is needed.');
      return;
    }

    const h = parseFloat(manualHours) || 0;
    const m = parseFloat(manualMinutes) || 0;
    if (h <= 0 && m <= 0) {
      setModalError('Please enter a valid duration of service.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.submitManualHours(user.id, {
        activityId: selectedActivityId,
        date: manualDate,
        hours: h,
        minutes: m,
        note: manualNote,
        evidenceUrl: evidencePhoto || undefined,
        evidenceThumbnail: evidencePhoto || undefined,
      });

      toast.info('Manual hours submitted. Your Team Lead will review and approve them.');
      setIsModalOpen(false);
      setManualNote('');
      await loadData();
    } catch (err: any) {
      setModalError(err.message || 'Could not record hours.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleFieldWorkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!fieldWorkForm.title.trim() || !fieldWorkForm.evidenceNote.trim() || !fieldWorkForm.supervisorId) {
      setFieldWorkError('Please complete all required fields.');
      return;
    }

    setIsSubmittingFieldWork(true);
    setFieldWorkError('');
    try {
      const supervisor = teamLeads.find((l) => l.id === fieldWorkForm.supervisorId);
      const proj = scopedProjects.find((p) => p.id === fieldWorkForm.projectId);

      await api.submitCompletedActivity({
        volunteerId: user.id,
        volunteerName: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username,
        title: fieldWorkForm.title.trim(),
        date: fieldWorkForm.date,
        hours: Number(fieldWorkForm.hours),
        branchId: user.branchId || fieldWorkForm.branchId || 'branch-kirkos',
        branchName: user.branchName || 'Local Branch',
        projectId: fieldWorkForm.projectId || undefined,
        projectName: proj?.name || undefined,
        evidenceUrl: fieldWorkForm.evidenceUrl,
        evidenceThumbnail: fieldWorkForm.evidenceUrl,
        evidenceNote: fieldWorkForm.evidenceNote.trim(),
        supervisorId: fieldWorkForm.supervisorId,
        supervisorName: supervisor ? `${supervisor.firstName || ''} ${supervisor.lastName || ''}`.trim() : 'Team Lead',
      });

      toast.success('Completed field activity submitted with evidence. Your supervisor has been notified.');
      setIsFieldWorkModalOpen(false);
      setFieldWorkForm((prev) => ({ ...prev, title: '', evidenceNote: '' }));
      await loadData();
    } catch (err: any) {
      setFieldWorkError(err.message || 'Failed to submit field activity');
    } finally {
      setIsSubmittingFieldWork(false);
    }
  };

  const handleCheckoutDirectly = async (hoursId: string) => {
    try {
      await api.checkOut(hoursId);
      toast.success('Check-out recorded! Your hours are waiting for Team Lead approval.');
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Could not record check-out.');
    }
  };

  const totalApprovedMinutes = hours
    .filter((h) => h.status === 'approved')
    .reduce((sum, h) => sum + h.minutes, 0);

  const totalLoggedMinutes = hours
    .filter((h) => h.status === 'logged')
    .reduce((sum, h) => sum + h.minutes, 0);

  const totalDeclinedMinutes = hours
    .filter((h) => h.status === 'declined')
    .reduce((sum, h) => sum + h.minutes, 0);

  const columns: LedgerColumn<HoursEntry>[] = [
    {
      header: 'Date & time',
      cell: (entry) => (
        <div>
          <span className="font-mono text-[13px] font-semibold text-ink-primary block">
            {new Date(entry.checkIn).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <span className="font-mono text-[13px] text-ink-secondary block">
            {new Date(entry.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      ),
    },
    {
      header: 'Activity title & source',
      cell: (entry) => (
        <div className="space-y-0.5">
          <span className="font-sans font-medium text-ink-primary block">
            {entry.activityTitle || 'Community service activity'}
          </span>
          <span className="font-mono text-[13px] text-ink-tertiary block">
            {entry.source === 'manual' ? 'Self-reported manual claim' : 'Checked in with the activity code'}
          </span>
          {entry.manualNote && (
            <p className="text-[13px] text-ink-secondary italic pt-0.5 max-w-md">
              "{entry.manualNote}"
            </p>
          )}
          {entry.decisionReason && entry.status === 'declined' && (
            <div className="p-2 rounded-[6px] bg-red-50 text-red-800 text-[13px] font-sans mt-1">
              <strong>Decline reason:</strong> {entry.decisionReason}
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Duration',
      cell: (entry) => {
        if (!entry.checkOut || entry.checkOut === '') {
          return (
            <div className="space-y-1">
              <span className="font-sans text-[13px] font-medium text-amber-800 block">
                Checked in, not checked out
              </span>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleCheckoutDirectly(entry.id)}
              >
                Check out
              </Button>
            </div>
          );
        }

        const isQuickLook = entry.manualNote?.includes('Needs a quick look');
        return (
          <div className="space-y-0.5">
            <span className="font-mono text-[13px] font-semibold text-ink-primary">
              {Math.round((entry.minutes / 60) * 10) / 10} hrs
            </span>
            {isQuickLook && (
              <span className="inline-block px-1.5 py-0.5 text-[11px] font-medium bg-amber-50 text-amber-900 rounded-[4px]">
                Needs a quick look
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: 'Status',
      cell: (entry) => <StatusMark status={entry.status} size="sm" />,
    },
  ];

  const journeyItems: JourneyLogItem[] = hours.map((h) => {
    const isQuickLook = h.manualNote?.includes('Needs a quick look');
    const isOpen = !h.checkOut || h.checkOut === '';

    return {
      id: h.id,
      date: h.checkIn,
      title: h.activityTitle || 'Community service activity',
      subtitle: h.source === 'manual' ? 'Manual claim' : 'Checked in with the activity code',
      status: isOpen ? 'logged' : isQuickLook ? 'needs_review' : h.status,
      statusLabel: isOpen
        ? 'Checked in, not checked out'
        : isQuickLook
        ? 'Needs a quick look'
        : h.status === 'approved'
        ? 'Approved'
        : h.status === 'logged'
        ? 'Waiting for approval'
        : 'Declined',
      primaryNumeral: isOpen ? 'Open' : `+${Math.round((h.minutes / 60) * 10) / 10} hrs`,
      details: [
        {
          label: 'Session record',
          value: `${new Date(h.checkIn).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })} • ${new Date(h.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        },
        {
          label: 'Check-in verification',
          value: h.source === 'manual' ? 'Manual claim' : 'Checked in with the activity code',
        },
        ...(h.manualNote
          ? [{ label: 'Notes', value: h.manualNote }]
          : []),
        ...(h.decisionReason
          ? [{ label: 'Review decision', value: h.decisionReason }]
          : []),
      ],
      actionSlot: isOpen ? (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => handleCheckoutDirectly(h.id)}
        >
          Check out now
        </Button>
      ) : undefined,
    };
  });

  const leadSummary = {
    leadNumeral: `${Math.round((totalApprovedMinutes / 60) * 10) / 10} hrs`,
    label: 'approved service hours',
    inlineSentence: `${Math.round((totalLoggedMinutes / 60) * 10) / 10} hours waiting for approval, ${Math.round((totalDeclinedMinutes / 60) * 10) / 10} hours declined. Counts toward your next rank.`,
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="rect" className="h-24 rounded-[16px]" />
        <Skeleton variant="rect" className="h-64 rounded-[16px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink-primary leading-tight mt-1">
            Your hours
          </h1>
          <p className="font-sans text-[13px] sm:text-sm text-ink-secondary mt-1">
            Complete record of your service hours, check-ins, and manual claims.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={() => setIsFieldWorkModalOpen(true)}
          >
            Submit completed activity
          </Button>
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" weight="bold" />}
            onClick={() => setIsModalOpen(true)}
          >
            Add missed hours
          </Button>
        </div>
      </div>

      {/* Signature JourneyLog Component */}
      {hours.length === 0 ? (
        <EmptyState
          icon={<Clock className="w-8 h-8 text-ink-secondary" weight="bold" />}
          title="No hours logged yet"
          description="Check in to upcoming activities or submit manual hours if you participated in an unrecorded session."
          actionLabel="Add missed hours"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <JourneyLog items={journeyItems} leadSummary={leadSummary} />
      )}

      {/* Manual Missed Hours Modal Sheet */}
      <SheetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add missed hours"
      >
        <form onSubmit={handleManualSubmit} className="space-y-5">
          <p className="font-sans text-[13px] text-ink-secondary leading-relaxed">
            If you attended an activity but could not check in with the Team Lead on-site, enter your details below. Manual hours require Team Lead verification.
          </p>

          {modalError && (
            <div className="p-3 rounded-[8px] bg-role-teamleadLight/20 text-role-teamlead text-[13px] font-sans font-medium flex items-center gap-2">
              <Warning className="w-4 h-4 shrink-0" weight="bold" />
              <span>{modalError}</span>
            </div>
          )}

          <Select
            label="Attended activity"
            value={selectedActivityId}
            onChange={(e) => setSelectedActivityId(e.target.value)}
            options={activities.map((a) => ({
              value: a.id,
              label: `${a.title} (${a.area})`,
            }))}
            required
          />

          <Input
            label="Service date"
            type="date"
            value={manualDate}
            max="2026-10-31"
            onChange={(e) => setManualDate(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Hours"
              type="number"
              min="0"
              max="24"
              value={manualHours}
              onChange={(e) => setManualHours(e.target.value)}
              required
            />
            <Input
              label="Minutes"
              type="number"
              min="0"
              max="59"
              step="15"
              value={manualMinutes}
              onChange={(e) => setManualMinutes(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="block text-[13px] font-medium text-ink-primary">
              Explanation for manual claim
            </label>
            <textarea
              rows={3}
              value={manualNote}
              onChange={(e) => setManualNote(e.target.value)}
              placeholder="e.g. Arrived directly at field site station B; phone battery ran out before check-in code was scanned."
              className="w-full bg-white text-ink-primary font-sans text-[13px] rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-role-volunteer"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              Submit for lead approval
            </Button>
          </div>
        </form>
      </SheetModal>

      {/* Submit Completed Activity SheetModal */}
      {isFieldWorkModalOpen && (
        <SheetModal
          isOpen={isFieldWorkModalOpen}
          onClose={() => setIsFieldWorkModalOpen(false)}
          title="Submit completed field activity"
          subtitle="For self-organized or community field tasks conducted without an on-site check-in code."
        >
          <form onSubmit={handleFieldWorkSubmit} className="space-y-4">
            {fieldWorkError && (
              <div className="p-3 rounded-[12px] bg-red-50 text-red-700 text-xs font-sans">
                {fieldWorkError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-sans font-semibold text-ink-secondary">
                Field Activity Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mexico Square Emergency Flood Canal Clearing"
                value={fieldWorkForm.title}
                onChange={(e) => setFieldWorkForm({ ...fieldWorkForm, title: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F1F3F6] rounded-[12px] text-sm font-sans text-ink-primary focus:outline-none focus:ring-2 focus:ring-[#1E824C]/30"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-sans font-semibold text-ink-secondary">
                  Service Date *
                </label>
                <input
                  type="date"
                  required
                  value={fieldWorkForm.date}
                  onChange={(e) => setFieldWorkForm({ ...fieldWorkForm, date: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F1F3F6] rounded-[12px] text-sm font-sans text-ink-primary focus:outline-none focus:ring-2 focus:ring-[#1E824C]/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-sans font-semibold text-ink-secondary">
                  Hours Completed *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={12}
                  value={fieldWorkForm.hours}
                  onChange={(e) => setFieldWorkForm({ ...fieldWorkForm, hours: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-[#F1F3F6] rounded-[12px] text-sm font-sans text-ink-primary focus:outline-none focus:ring-2 focus:ring-[#1E824C]/30"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-sans font-semibold text-ink-secondary">
                Project Charter (optional)
              </label>
              <select
                value={fieldWorkForm.projectId}
                onChange={(e) => setFieldWorkForm({ ...fieldWorkForm, projectId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F1F3F6] rounded-[12px] text-sm font-sans text-ink-primary focus:outline-none focus:ring-2 focus:ring-[#1E824C]/30"
              >
                <option value="">No specific project / general branch service</option>
                {scopedProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-sans font-semibold text-ink-secondary">
                Supervising Team Lead *
              </label>
              <select
                required
                value={fieldWorkForm.supervisorId}
                onChange={(e) => setFieldWorkForm({ ...fieldWorkForm, supervisorId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F1F3F6] rounded-[12px] text-sm font-sans text-ink-primary focus:outline-none focus:ring-2 focus:ring-[#1E824C]/30"
              >
                <option value="">Select a supervisor...</option>
                {teamLeads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.firstName} {l.lastName} ({l.branchName || 'Team Lead'})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-sans font-semibold text-ink-secondary">
                Field Photo Evidence *
              </label>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-[8px] overflow-hidden bg-black/5 shrink-0">
                  <img src={fieldWorkForm.evidenceUrl} alt="Evidence" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1 text-xs font-sans">
                  <div className="font-semibold text-ink-primary">field_service_proof.jpg (1.4 MB)</div>
                  <div className="text-ink-secondary">Photo attached with timestamp and GPS verification.</div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-sans font-semibold text-ink-secondary">
                Detailed Activity Description & Notes *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Explain the specific community task, tools utilized, and team results achieved..."
                value={fieldWorkForm.evidenceNote}
                onChange={(e) => setFieldWorkForm({ ...fieldWorkForm, evidenceNote: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F1F3F6] rounded-[12px] text-sm font-sans text-ink-primary focus:outline-none focus:ring-2 focus:ring-[#1E824C]/30 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsFieldWorkModalOpen(false)}
                className="px-4 py-2 text-sm font-sans font-medium text-ink-secondary hover:bg-[#F1F3F6] rounded-[8px]"
              >
                Cancel
              </button>
              <Button variant="primary" type="submit" disabled={isSubmittingFieldWork}>
                {isSubmittingFieldWork ? 'Submitting...' : 'Submit field activity'}
              </Button>
            </div>
          </form>
        </SheetModal>
      )}

    </div>
  );
};
