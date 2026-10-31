import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Application, ApplicationStatus } from '../../types';
import { 
  LedgerTable, 
  LedgerColumn, 
  Button, 
  StatusMark, 
  SheetModal, 
  Input, 
  Select, 
  Skeleton,
  EmptyState
} from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { 
  ClipboardText, 
  MagnifyingGlass, 
  Check, 
  X, 
  Warning, 
  Eye, 
  ChatText,
  User,
  IdentificationCard,
  ShieldCheck,
  ArrowsClockwise,
  EnvelopeSimple,
  Trash
} from '@phosphor-icons/react';

const STATUS_FILTERS: { value: ApplicationStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'submitted', label: 'Submitted (Awaiting Review)' },
  { value: 'in_review', label: 'In Review' },
  { value: 'more_info_needed', label: 'More Information Needed' },
  { value: 'accepted', label: 'Accepted (Awaiting Payment)' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'expired', label: 'Window Expired' },
  { value: 'withdrawn', label: 'Withdrawn' },
];

const AREA_FILTERS = [
  { value: 'all', label: 'All Regions' },
  { value: 'Bole', label: 'Bole, Addis Ababa' },
  { value: 'Kazanchis', label: 'Kazanchis, Addis Ababa' },
  { value: 'Piassa', label: 'Piassa, Addis Ababa' },
  { value: 'Arada', label: 'Arada, Addis Ababa' },
  { value: 'Lideta', label: 'Lideta, Addis Ababa' },
  { value: 'Yeka', label: 'Yeka, Addis Ababa' },
  { value: 'Adama', label: 'Adama, Oromia' },
  { value: 'Bishoftu', label: 'Bishoftu, Oromia' },
  { value: 'Hawassa', label: 'Hawassa, Sidama' },
  { value: 'Bahir Dar', label: 'Bahir Dar, Amhara' },
];

const SKILL_FILTERS = [
  { value: 'all', label: 'All Skills' },
  { value: 'First Aid', label: 'First Aid' },
  { value: 'Community Outreach', label: 'Community Outreach' },
  { value: 'Event Coordination', label: 'Event Coordination' },
  { value: 'Documentation', label: 'Documentation' },
  { value: 'Logistics', label: 'Logistics' },
  { value: 'Teaching', label: 'Teaching' },
  { value: 'Tree Planting', label: 'Tree Planting' },
  { value: 'IT Support', label: 'IT Support' },
];

const SORT_OPTIONS: { value: 'newest' | 'oldest' | 'name'; label: string }[] = [
  { value: 'newest', label: 'Newest Submissions First' },
  { value: 'oldest', label: 'Oldest Submissions First' },
  { value: 'name', label: 'Applicant Name (A–Z)' },
];

export const ManagerApplicationsPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | 'all'>('all');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Inspector / Review Drawer
  const [inspectingApp, setInspectingApp] = useState<Application | null>(null);
  const [decisionReason, setDecisionReason] = useState('');
  const [privateNote, setPrivateNote] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showBulkRejectModal, setShowBulkRejectModal] = useState(false);
  const [bulkRejectReason, setBulkRejectReason] = useState('');

  const toast = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const list = await api.getAllApplications({
        status: selectedStatus,
        area: selectedArea !== 'all' ? selectedArea : undefined,
        skill: selectedSkill !== 'all' ? selectedSkill : undefined,
        search: search.trim() || undefined,
        sortBy: sortBy,
      });
      setApplications(list);
      setSelectedIds([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedStatus, selectedArea, selectedSkill, sortBy, search]);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === applications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(applications.map((a) => a.id));
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
      await api.reviewApplication(
        inspectingApp.id,
        decision,
        decisionReason.trim() || undefined,
        user.id,
        profile?.fullName || user.username,
        privateNote.trim() || undefined
      );

      if (decision === 'accepted') {
        toast.success(`Accepted ${inspectingApp.formData?.fullName || 'Applicant'}. Payment invitation email sent to demo inbox!`);
      } else if (decision === 'more_info_needed') {
        toast.info('Clarification request sent to applicant.');
      } else {
        toast.warning('Application rejected and applicant notified.');
      }

      setInspectingApp(null);
      setDecisionReason('');
      setPrivateNote('');
      setShowRejectModal(false);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Could not update application decision.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReopen = async () => {
    if (!user || !inspectingApp) return;
    setIsProcessing(true);
    try {
      await api.reopenApplication(
        inspectingApp.id,
        user.id,
        profile?.fullName || user.username
      );
      toast.success('Expired application reopened with a fresh 7-day payment window.');
      setInspectingApp(null);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Could not reopen application.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddPrivateNote = async () => {
    if (!user || !inspectingApp || !privateNote.trim()) return;
    setIsProcessing(true);
    try {
      const updated = await api.addApplicationNote(
        inspectingApp.id,
        user.id,
        profile?.fullName || user.username,
        privateNote.trim()
      );
      setInspectingApp(updated);
      setPrivateNote('');
      toast.success('Internal note added.');
    } catch (err: any) {
      toast.error(err.message || 'Could not save note.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkAccept = async () => {
    if (!user || selectedIds.length === 0) return;
    if (!window.confirm(`Accept ${selectedIds.length} selected applications and send payment invitations?`)) return;

    setIsProcessing(true);
    try {
      await api.bulkReviewApplications(selectedIds, 'accepted', 'Bulk review acceptance.', user.id);
      toast.success(`Accepted ${selectedIds.length} applications. Payment invitations sent to demo inbox!`);
      await loadData();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkReject = async () => {
    if (!user || selectedIds.length === 0 || !bulkRejectReason.trim()) {
      toast.error('A rejection reason is required for bulk actions.');
      return;
    }

    setIsProcessing(true);
    try {
      await api.bulkReviewApplications(selectedIds, 'rejected', bulkRejectReason.trim(), user.id);
      toast.warning(`Rejected ${selectedIds.length} applications with reason provided.`);
      setShowBulkRejectModal(false);
      setBulkRejectReason('');
      await loadData();
    } finally {
      setIsProcessing(false);
    }
  };

  const columns: LedgerColumn<Application>[] = [
    {
      header: (
        <input
          type="checkbox"
          checked={applications.length > 0 && selectedIds.length === applications.length}
          onChange={handleSelectAll}
          className="w-4 h-4 cursor-pointer accent-ink-primary"
          title="Select all applications"
        />
      ),
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
      header: 'Region & Capacities',
      cell: (app) => (
        <div className="space-y-1">
          <span className="font-sans text-xs text-ink-secondary block font-semibold">
            {app.formData?.area || '—'}
          </span>
          <div className="flex flex-wrap gap-1">
            {app.formData?.skills?.slice(0, 3).map((s) => (
              <span key={s} className="px-1.5 py-0.5 bg-canvas-subdued border border-border text-[11px] font-sans text-ink-primary">
                {s}
              </span>
            ))}
            {(app.formData?.skills?.length || 0) > 3 && (
              <span className="text-[11px] text-ink-tertiary">
                +{(app.formData?.skills?.length || 0) - 3} more
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
            setPrivateNote('');
          }}
          leftIcon={<Eye className="w-3.5 h-3.5" />}
        >
          Review
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b-2 border-ink-primary pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-ink-primary leading-none">
            Admissions Board
          </h1>
          <p className="font-sans text-xs sm:text-sm text-ink-secondary mt-1">
            Review applicant qualifications, issue Telebirr registration fee invitations, or request clarification.
          </p>
        </div>

        {/* Bulk Action Controls */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 bg-role-managerLight border-2 border-role-manager p-2">
            <span className="font-mono text-xs font-bold text-ink-primary px-2">
              {selectedIds.length} Selected
            </span>
            <Button
              variant="teal"
              size="sm"
              isLoading={isProcessing}
              onClick={handleBulkAccept}
              leftIcon={<Check className="w-4 h-4" weight="bold" />}
            >
              Bulk Accept
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isProcessing}
              onClick={() => setShowBulkRejectModal(true)}
              leftIcon={<X className="w-4 h-4" />}
            >
              Bulk Reject
            </Button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="border-2 border-ink-primary bg-white p-5 space-y-4 shadow-ticket">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <Input
              placeholder="Search by name, phone, area, or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftAddon={<MagnifyingGlass className="w-4 h-4" />}
            />
          </div>

          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            options={STATUS_FILTERS}
          />

          <Select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            options={AREA_FILTERS}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border">
          <Select
            label="Filter by Specific Skill"
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            options={SKILL_FILTERS}
          />

          <Select
            label="Sort Application Queue"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            options={SORT_OPTIONS}
          />
        </div>
      </div>

      {/* Ledger Table */}
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
            {/* Status & ID Banner */}
            <div className="flex items-center justify-between p-3 bg-canvas-subdued border border-border">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-ink-tertiary">
                  ID: #{inspectingApp.id}
                </span>
              </div>
              <StatusMark status={inspectingApp.status} size="sm" />
            </div>

            {/* Photos (Simulated Uploads) */}
            {(inspectingApp.formData?.photoUrl || inspectingApp.formData?.idPhotoUrl) && (
              <div className="p-4 border-2 border-ink-primary bg-white space-y-3">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <h4 className="font-display text-lg font-black uppercase text-ink-primary">
                    Uploaded Verification Images
                  </h4>
                  <span className="text-[11px] font-bold text-role-manager bg-role-managerLight px-2 py-0.5 border border-role-manager">
                    Admissions Secure View
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {inspectingApp.formData?.photoUrl && (
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-ink-tertiary block">
                        Volunteer Profile Photo
                      </span>
                      <div className="w-24 h-24 border border-border bg-canvas-subdued overflow-hidden">
                        <img
                          src={inspectingApp.formData.photoUrl}
                          alt="Profile Headshot"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {inspectingApp.formData?.idPhotoUrl && (
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-ink-tertiary block">
                        Kebele / National ID Card
                      </span>
                      <div className="w-36 h-24 border border-border bg-canvas-subdued overflow-hidden">
                        <img
                          src={inspectingApp.formData.idPhotoUrl}
                          alt="ID Document"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Applicant details */}
            <div className="p-4 border-2 border-ink-primary bg-white space-y-3 shadow-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] font-bold text-ink-tertiary block">Mobile Phone</span>
                  <span className="font-mono text-xs font-bold text-ink-primary">{inspectingApp.formData?.phone || '—'}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-ink-tertiary block">Date of Birth</span>
                  <span className="font-mono text-xs font-bold text-ink-primary">{inspectingApp.formData?.dateOfBirth || '—'}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-ink-tertiary block">Service Region</span>
                <span className="text-xs font-bold text-ink-primary">{inspectingApp.formData?.area || '—'}</span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-ink-tertiary block">Languages</span>
                <span className="text-xs text-ink-secondary">{inspectingApp.formData?.languages?.join(', ') || '—'}</span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-ink-tertiary block">Motivation Statement</span>
                <p className="text-xs text-ink-secondary leading-relaxed bg-canvas-subdued p-3 border border-border mt-1 italic">
                  "{inspectingApp.formData?.motivation || 'No motivation statement provided.'}"
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-ink-tertiary block">Skills & Capacities</span>
                <div className="flex flex-wrap gap-1 pt-1">
                  {inspectingApp.formData?.skills?.map((s) => (
                    <span key={s} className="px-2 py-0.5 bg-canvas-subdued border border-border text-[11px] font-sans text-ink-primary">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {inspectingApp.formData?.emergencyContact && (
                <div className="pt-2 border-t border-border">
                  <span className="text-[11px] font-bold text-ink-tertiary block">Emergency Contact</span>
                  <span className="text-ink-secondary font-medium">
                    {inspectingApp.formData.emergencyContact.name} ({inspectingApp.formData.emergencyContact.relationship}) •{' '}
                    <span className="font-mono">{inspectingApp.formData.emergencyContact.phone}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Internal Staff Notes */}
            <div className="p-4 border-2 border-border bg-canvas-subdued space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h4 className="font-display text-base font-black uppercase text-ink-primary">
                  Internal Private Notes
                </h4>
                <span className="text-[11px] text-ink-tertiary">
                  Visible to Managers only
                </span>
              </div>

              {inspectingApp.notes?.length === 0 ? (
                <p className="text-xs text-ink-tertiary">No private notes recorded yet.</p>
              ) : (
                <div className="space-y-2">
                  {inspectingApp.notes?.map((n) => (
                    <div key={n.id} className="p-2.5 bg-white border border-border space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-ink-primary">{n.authorName}</span>
                        <span className="font-mono text-[10px] text-ink-tertiary">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-ink-secondary">{n.content}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add a private admissions note..."
                  value={privateNote}
                  onChange={(e) => setPrivateNote(e.target.value)}
                  className="flex-1 bg-white text-xs border border-border p-2 focus:border-ink-primary outline-none"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleAddPrivateNote}
                  isLoading={isProcessing}
                >
                  Add Note
                </Button>
              </div>
            </div>

            {/* Decision Actions */}
            <div className="border-4 border-ink-primary bg-white p-5 space-y-4 shadow-ticket">
              <h4 className="font-display text-xl font-black uppercase text-ink-primary">
                Admissions Board Action
              </h4>

              {/* Expired case: Reopen option */}
              {inspectingApp.status === 'expired' && (
                <div className="p-3 bg-role-applicantLight border border-role-applicant space-y-2">
                  <p className="text-xs text-ink-primary font-semibold">
                    This applicant's payment deadline has expired. You can reopen the window with a fresh 7-day period.
                  </p>
                  <Button
                    variant="telebirr"
                    size="sm"
                    onClick={handleReopen}
                    isLoading={isProcessing}
                    leftIcon={<ArrowsClockwise className="w-4 h-4" />}
                  >
                    Reopen Acceptance (7-Day Extension)
                  </Button>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-ink-primary">
                  Decision Message (Included in notice email to applicant)
                </label>
                <textarea
                  rows={2}
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  placeholder="e.g. Strong youth outreach background in Bole; candidate profile confirmed..."
                  className="w-full bg-canvas-subdued text-ink-primary font-sans text-xs border border-border p-2.5 focus:border-ink-primary outline-none"
                />
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <Button
                  variant="teal"
                  size="sm"
                  isLoading={isProcessing}
                  onClick={() => handleDecision('accepted')}
                  leftIcon={<Check className="w-4 h-4" weight="bold" />}
                >
                  Accept & Send Telebirr Invite (ETB 200)
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  isLoading={isProcessing}
                  onClick={() => handleDecision('more_info_needed')}
                  leftIcon={<Warning className="w-4 h-4" />}
                >
                  Request More Info
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  isLoading={isProcessing}
                  onClick={() => handleDecision('rejected')}
                  leftIcon={<X className="w-4 h-4" />}
                >
                  Reject Application
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetModal>

      {/* Bulk Reject Modal */}
      <SheetModal
        isOpen={showBulkRejectModal}
        onClose={() => setShowBulkRejectModal(false)}
        title={`Reject ${selectedIds.length} Applications?`}
        subtitle="Every applicant will receive a written explanation notice."
        mode="modal"
      >
        <div className="space-y-4 text-xs font-sans text-left">
          <p className="text-ink-secondary leading-relaxed">
            Please provide a respectful, transparent reason for declining these applications. This text will be included in the automated notice email sent to each candidate.
          </p>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-ink-primary">
              Rejection Reason (Required)
            </label>
            <textarea
              rows={3}
              value={bulkRejectReason}
              onChange={(e) => setBulkRejectReason(e.target.value)}
              placeholder="e.g. Regional volunteer quotas for this cycle have reached full capacity..."
              className="w-full bg-white text-xs border border-border p-2.5 focus:border-ink-primary outline-none"
              required
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-border">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowBulkRejectModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isProcessing}
              onClick={handleBulkReject}
            >
              Confirm Bulk Reject
            </Button>
          </div>
        </div>
      </SheetModal>
    </div>
  );
};
