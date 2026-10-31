import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Application, ApplicationStatus } from '../../types';
import { LedgerTable, LedgerColumn, Button, StatusMark, SheetModal, Input, Select, Skeleton } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { 
  ClipboardText, 
  MagnifyingGlass, 
  Check, 
  X, 
  Warning, 
  Eye, 
  ChatText,
  UserCircle 
} from '@phosphor-icons/react';

const STATUS_FILTERS: { value: ApplicationStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Application Statuses' },
  { value: 'submitted', label: 'Submitted (Awaiting Review)' },
  { value: 'in_review', label: 'In Review' },
  { value: 'more_info_needed', label: 'More Information Needed' },
  { value: 'accepted', label: 'Accepted (Awaiting Payment)' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'expired', label: 'Window Expired' },
  { value: 'withdrawn', label: 'Withdrawn' },
];

export const ManagerApplicationsPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Inspector / Review Drawer
  const [inspectingApp, setInspectingApp] = useState<Application | null>(null);
  const [decisionReason, setDecisionReason] = useState('');
  const [privateNote, setPrivateNote] = useState('');
  const [decisionType, setDecisionType] = useState<'accepted' | 'more_info_needed' | 'rejected'>('accepted');

  const toast = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const list = await api.getAllApplications({
        status: selectedStatus,
        search: search || undefined,
      });
      setApplications(list);
      setSelectedIds([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedStatus, search]);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDecision = async (decision: 'accepted' | 'more_info_needed' | 'rejected') => {
    if (!user || !inspectingApp) return;

    if ((decision === 'more_info_needed' || decision === 'rejected') && !decisionReason.trim()) {
      toast.error('A clear explanation is required when declining or requesting more information.');
      return;
    }

    setIsProcessing(true);
    try {
      const updated = await api.reviewApplication(
        inspectingApp.id,
        decision,
        decisionReason.trim() || undefined,
        user.id,
        profile?.fullName || user.username,
        privateNote.trim() || undefined
      );

      toast.success(`Application marked as ${decision}. Notification sent to applicant.`);
      setInspectingApp(null);
      setDecisionReason('');
      setPrivateNote('');
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Could not update application decision.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkAccept = async () => {
    if (!user || selectedIds.length === 0) return;
    if (!window.confirm(`Accept ${selectedIds.length} selected applications?`)) return;

    setIsProcessing(true);
    try {
      await api.bulkReviewApplications(selectedIds, 'accepted', 'Bulk review acceptance.', user.id);
      toast.success(`Accepted ${selectedIds.length} applications and invited them to pay registration fee.`);
      await loadData();
    } finally {
      setIsProcessing(false);
    }
  };

  const columns: LedgerColumn<Application>[] = [
    {
      header: 'Select',
      cell: (app) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(app.id)}
          onChange={() => toggleSelect(app.id)}
          className="w-4 h-4 cursor-pointer accent-ink-primary"
        />
      ),
    },
    {
      header: 'Applicant',
      cell: (app) => (
        <div className="space-y-0.5">
          <span className="font-sans font-bold text-ink-primary block">
            {app.formData?.fullName || 'Applicant'}
          </span>
          <span className="font-mono text-[11px] text-ink-tertiary block">
            Phone: {app.formData?.phone || '—'}
          </span>
        </div>
      ),
    },
    {
      header: 'Region & Skills',
      cell: (app) => (
        <div className="space-y-1">
          <span className="font-sans text-xs text-ink-secondary block">
            {app.formData?.area || '—'}
          </span>
          <div className="flex flex-wrap gap-1">
            {app.formData?.skills.slice(0, 3).map((s) => (
              <span key={s} className="px-1.5 py-0.2 bg-canvas-subdued border border-border font-mono text-[10px] text-ink-tertiary">
                {s}
              </span>
            ))}
            {(app.formData?.skills.length || 0) > 3 && (
              <span className="font-mono text-[10px] text-ink-tertiary">
                +{(app.formData?.skills.length || 0) - 3} more
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Submission Date',
      cell: (app) => (
        <span className="font-mono text-xs text-ink-tertiary">
          {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Draft'}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (app) => <StatusMark status={app.status} size="sm" />,
    },
    {
      header: 'Action',
      align: 'right',
      cell: (app) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setInspectingApp(app);
            setDecisionReason(app.decisionReason || '');
          }}
          leftIcon={<Eye className="w-3.5 h-3.5" />}
        >
          Review
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-border pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary block">
            ADMISSIONS BOARD
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-primary">
            Applicant Intake Queue
          </h1>
          <p className="font-sans text-xs sm:text-sm text-ink-secondary">
            Screen applicant qualifications, request regional clarification, or issue registration fee invitations.
          </p>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              isLoading={isProcessing}
              onClick={handleBulkAccept}
            >
              Bulk Accept ({selectedIds.length})
            </Button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="border border-border bg-canvas-raised p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            placeholder="Search by name, phone, area or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftAddon={<MagnifyingGlass className="w-4 h-4" />}
          />

          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            options={STATUS_FILTERS}
          />
        </div>
      </div>

      {/* Table */}
      <LedgerTable
        data={applications}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
      />

      {/* Detail & Decision Drawer Sheet */}
      <SheetModal
        isOpen={inspectingApp !== null}
        onClose={() => setInspectingApp(null)}
        title={inspectingApp?.formData?.fullName || 'Application Review'}
        subtitle={`Submitted: ${inspectingApp?.submittedAt ? new Date(inspectingApp.submittedAt).toLocaleString() : 'In draft'}`}
        mode="sheet"
      >
        {inspectingApp && (
          <div className="space-y-6 text-left font-sans text-xs">
            {/* Applicant details */}
            <div className="p-4 border border-border bg-canvas-subdued/40 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="font-mono text-[10px] uppercase text-ink-tertiary block">Phone</span>
                  <span className="font-mono text-sm font-bold text-ink-primary">{inspectingApp.formData?.phone || '—'}</span>
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase text-ink-tertiary block">Date of Birth</span>
                  <span className="font-mono text-sm font-bold text-ink-primary">{inspectingApp.formData?.dateOfBirth || '—'}</span>
                </div>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-ink-tertiary block">Service Region</span>
                <span className="text-sm font-semibold text-ink-primary">{inspectingApp.formData?.area || '—'}</span>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-ink-tertiary block">Motivation Statement</span>
                <p className="text-xs text-ink-secondary leading-relaxed bg-canvas-raised p-2.5 border border-border mt-1">
                  "{inspectingApp.formData?.motivation || 'No motivation statement provided.'}"
                </p>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-ink-tertiary block">Skills & Availability</span>
                <div className="flex flex-wrap gap-1 pt-1">
                  {inspectingApp.formData?.skills.map((s) => (
                    <span key={s} className="px-2 py-0.5 bg-canvas-raised border border-border font-mono text-[11px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {inspectingApp.formData?.emergencyContact && (
                <div className="pt-2 border-t border-border">
                  <span className="font-mono text-[10px] uppercase text-ink-tertiary block">Emergency Contact</span>
                  <span className="text-ink-secondary font-medium">
                    {inspectingApp.formData.emergencyContact.name} ({inspectingApp.formData.emergencyContact.relationship}) •{' '}
                    <span className="font-mono">{inspectingApp.formData.emergencyContact.phone}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Decision Form */}
            <div className="border border-border bg-canvas-raised p-5 space-y-4">
              <h4 className="font-serif text-base font-bold text-ink-primary">
                Review Decision
              </h4>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-secondary">
                  Applicant Explanation (Included in notice email)
                </label>
                <textarea
                  rows={2}
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  placeholder="e.g. Verified residence in Bole; strong youth outreach background..."
                  className="w-full bg-canvas-subdued text-ink-primary font-sans text-xs rounded border border-border p-2.5 focus:border-ink-primary outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-secondary">
                  Private Internal Staff Note
                </label>
                <input
                  type="text"
                  value={privateNote}
                  onChange={(e) => setPrivateNote(e.target.value)}
                  placeholder="Notes visible only to Manager and Director..."
                  className="w-full bg-canvas-subdued text-ink-primary font-sans text-xs rounded border border-border p-2 focus:border-ink-primary outline-none"
                />
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <Button
                  variant="primary"
                  isLoading={isProcessing}
                  onClick={() => handleDecision('accepted')}
                  leftIcon={<Check className="w-4 h-4" weight="bold" />}
                >
                  Accept & Invite to Pay (ETB 200)
                </Button>
                <Button
                  variant="secondary"
                  isLoading={isProcessing}
                  onClick={() => handleDecision('more_info_needed')}
                  leftIcon={<Warning className="w-4 h-4" />}
                >
                  Request More Info
                </Button>
                <Button
                  variant="danger"
                  isLoading={isProcessing}
                  onClick={() => handleDecision('rejected')}
                  leftIcon={<X className="w-4 h-4" />}
                >
                  Reject
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetModal>
    </div>
  );
};

