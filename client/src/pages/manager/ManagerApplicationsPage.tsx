import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Application, ApplicationStatus, ApplicationSource } from '../../types';
import { 
  LedgerTable, 
  LedgerColumn, 
  Button, 
  StatusMark, 
  SheetModal, 
  Input, 
  Select
} from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { 
  MagnifyingGlass, 
  Check, 
  X, 
  Warning, 
  Eye, 
  ArrowsClockwise,
  UserPlus,
  Buildings,
} from '@phosphor-icons/react';

const SOURCE_FILTERS: { value: ApplicationSource | 'all'; label: string }[] = [
  { value: 'all', label: 'All sources' },
  { value: 'self_registered', label: 'Self-registered' },
  { value: 'staff_assisted', label: 'Staff-assisted' },
];

const STATUS_FILTERS: { value: ApplicationStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'submitted', label: 'Submitted (awaiting review)' },
  { value: 'in_review', label: 'In review' },
  { value: 'more_info_needed', label: 'More information needed' },
  { value: 'accepted', label: 'Accepted (awaiting payment)' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'expired', label: 'Window expired' },
  { value: 'withdrawn', label: 'Withdrawn' },
];

const AREA_FILTERS = [
  { value: 'all', label: 'All areas' },
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
  { value: 'all', label: 'All skills' },
  { value: 'First Aid', label: 'First aid' },
  { value: 'Community Outreach', label: 'Community outreach' },
  { value: 'Event Coordination', label: 'Event coordination' },
  { value: 'Documentation', label: 'Documentation' },
  { value: 'Logistics', label: 'Logistics' },
  { value: 'Teaching', label: 'Teaching' },
  { value: 'Tree Planting', label: 'Tree planting' },
  { value: 'IT Support', label: 'IT support' },
];

const SORT_OPTIONS: { value: 'newest' | 'oldest' | 'name'; label: string }[] = [
  { value: 'newest', label: 'Newest submissions first' },
  { value: 'oldest', label: 'Oldest submissions first' },
  { value: 'name', label: 'Applicant name (A–Z)' },
];

export const ManagerApplicationsPage: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | 'all'>('all');
  const [selectedSource, setSelectedSource] = useState<ApplicationSource | 'all'>('all');
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
  const [showBulkRejectModal, setShowBulkRejectModal] = useState(false);
  const [bulkRejectReason, setBulkRejectReason] = useState('');

  const toast = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const list = await api.getAllApplications({
        status: selectedStatus,
        source: selectedSource !== 'all' ? selectedSource : undefined,
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
  }, [selectedStatus, selectedSource, selectedArea, selectedSkill, sortBy, search]);

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
      toast.success(
        decision === 'accepted'
          ? 'Application accepted. Telebirr payment voucher invitation sent.'
          : decision === 'more_info_needed'
          ? 'Candidate notified that additional information is needed.'
          : 'Application marked as declined.'
      );
      setInspectingApp(null);
      setDecisionReason('');
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Could not update application status.');
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
      toast.success('Private admissions note recorded.');
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Could not record note.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkAccept = async () => {
    if (!user || selectedIds.length === 0) return;
    if (!window.confirm(`Accept ${selectedIds.length} candidate applications?`)) return;

    setIsProcessing(true);
    try {
      await api.bulkReviewApplications(selectedIds, 'accepted', 'Bulk review acceptance.', user.id);
      toast.success(`Accepted ${selectedIds.length} candidates. Telebirr fee invitations issued.`);
      setSelectedIds([]);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Could not complete bulk acceptance.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkReject = async () => {
    if (!user || selectedIds.length === 0) return;
    if (!bulkRejectReason.trim()) {
      toast.error('Please specify a rejection reason.');
      return;
    }

    setIsProcessing(true);
    try {
      await api.bulkReviewApplications(selectedIds, 'rejected', bulkRejectReason.trim(), user.id);
      toast.info(`${selectedIds.length} applications marked as rejected.`);
      setSelectedIds([]);
      setShowBulkRejectModal(false);
      setBulkRejectReason('');
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Could not complete bulk rejection.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReopen = async () => {
    if (!user || !inspectingApp) return;
    setIsProcessing(true);
    try {
      const updated = await api.reopenApplication(
        inspectingApp.id,
        user.id,
        profile?.fullName || user.username
      );
      setInspectingApp(updated);
      toast.success('Payment window extended for 7 additional days.');
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Could not reopen application window.');
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
          title="Select all"
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
      header: 'Applicant name & contact',
      cell: (app) => (
        <div className="space-y-0.5">
          <span className="font-sans font-semibold text-ink-primary block">
            {app.formData?.fullName || 'Untitled applicant'}
          </span>
          <span className="font-mono text-[13px] text-ink-secondary block">
            {app.formData?.phone || 'No phone provided'}
          </span>
        </div>
      ),
    },
    {
      header: 'Area & key skills',
      cell: (app) => (
        <div className="space-y-1">
          <span className="font-sans text-[13px] font-semibold text-ink-primary block">
            {app.formData?.area || 'Addis Ababa'}
          </span>
          <div className="flex flex-wrap gap-1">
            {app.formData?.skills?.slice(0, 2).map((s) => (
              <span key={s} className="px-2 py-0.5 bg-canvas-subdued/50 rounded-[4px] text-[13px] font-mono text-ink-primary">
                {s}
              </span>
            ))}
            {(app.formData?.skills?.length || 0) > 2 && (
              <span className="text-[13px] text-ink-tertiary">
                +{(app.formData?.skills?.length || 0) - 2} more
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Intake source',
      cell: (app) => (
        <div>
          {app.source === 'staff_assisted' ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-[#E8F8F5] text-xs font-semibold text-[#0E6266]">
              <Buildings className="w-3 h-3" weight="bold" />
              <span>Registered by {app.createdByName || 'Staff'}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-[#F1F3F6] text-xs font-medium text-ink-secondary">
              Self-registered
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Submission date',
      cell: (app) => (
        <span className="font-mono text-[13px] text-ink-secondary">
          {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Draft'}
        </span>
      ),
    },
    {
      header: 'Status & decisions',
      cell: (app) => (
        <div className="flex items-center gap-3">
          <StatusMark status={app.status} size="sm" />
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
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink-primary leading-tight mt-1">
            Candidate applications
          </h1>
          <p className="font-sans text-[13px] sm:text-sm text-ink-secondary mt-1">
            Review applicant profiles, issue Telebirr registration fee invitations, or request clarification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="teal"
            onClick={() => navigate('/manager/register-volunteer')}
            leftIcon={<UserPlus className="w-4 h-4" weight="bold" />}
          >
            Register a volunteer
          </Button>

          {/* Bulk Action Controls */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 bg-role-managerLight/30 rounded-[8px] p-2">
              <span className="font-mono text-[13px] font-semibold text-ink-primary px-2">
                {selectedIds.length} selected
              </span>
              <Button
                variant="teal"
                size="sm"
                isLoading={isProcessing}
                onClick={handleBulkAccept}
                leftIcon={<Check className="w-4 h-4" weight="bold" />}
              >
                Bulk accept
              </Button>
              <Button
                variant="danger"
                size="sm"
                isLoading={isProcessing}
                onClick={() => setShowBulkRejectModal(true)}
                leftIcon={<X className="w-4 h-4" />}
              >
                Bulk reject
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-[10px] bg-white p-5 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
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
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value as any)}
            options={SOURCE_FILTERS}
          />

          <Select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            options={AREA_FILTERS}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Select
            label="Filter by specific skill"
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            options={SKILL_FILTERS}
          />

          <Select
            label="Sort application queue"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            options={SORT_OPTIONS}
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-[10px] bg-white shadow-sm overflow-hidden">
        <LedgerTable
          data={applications}
          columns={columns}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
        />
      </div>

      {/* Detail & Decision Drawer Sheet */}
      <SheetModal
        isOpen={inspectingApp !== null}
        onClose={() => setInspectingApp(null)}
        title={inspectingApp?.formData?.fullName || 'Application review'}
        subtitle={`Submitted: ${inspectingApp?.submittedAt ? new Date(inspectingApp.submittedAt).toLocaleString() : 'In draft'}`}
      >
        {inspectingApp && (
          <div className="space-y-6 text-left font-sans text-[13px]">
            {/* Status & ID Banner */}
            <div className="flex items-center justify-between p-3 bg-canvas-subdued/30 rounded-[8px]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[13px] font-semibold text-ink-tertiary">
                  ID: #{inspectingApp.id}
                </span>
                {inspectingApp.source === 'staff_assisted' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-[#E8F8F5] text-xs font-semibold text-[#0E6266]">
                    <Buildings className="w-3 h-3" weight="bold" />
                    <span>Staff-assisted ({inspectingApp.createdByName || 'Staff'})</span>
                  </span>
                )}
              </div>
              <StatusMark status={inspectingApp.status} size="sm" />
            </div>

            {/* Photos (Simulated Uploads) */}
            {(inspectingApp.formData?.photoUrl || inspectingApp.formData?.idPhotoUrl) && (
              <div className="p-4 rounded-[8px] bg-white space-y-3">
                <div className="flex items-center justify-between pb-2">
                  <h4 className="font-display text-base font-bold text-ink-primary">
                    Uploaded verification images
                  </h4>
                  <span className="text-[13px] font-semibold text-role-manager bg-role-managerLight/30 px-2 py-0.5 rounded-[4px]">
                    Admissions secure view
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {inspectingApp.formData?.photoUrl && (
                    <div className="space-y-1">
                      <span className="text-[13px] font-semibold text-ink-tertiary block">
                        Volunteer profile photo
                      </span>
                      <div className="w-24 h-24 rounded-[6px] bg-canvas-subdued overflow-hidden">
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
                      <span className="text-[13px] font-semibold text-ink-tertiary block">
                        Kebele / National ID card
                      </span>
                      <div className="w-36 h-24 rounded-[6px] bg-canvas-subdued overflow-hidden">
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
            <div className="p-4 rounded-[8px] bg-white space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[13px] font-semibold text-ink-tertiary block">Mobile phone</span>
                  <span className="font-mono text-[13px] font-semibold text-ink-primary">{inspectingApp.formData?.phone || '—'}</span>
                </div>
                <div>
                  <span className="text-[13px] font-semibold text-ink-tertiary block">Date of birth</span>
                  <span className="font-mono text-[13px] font-semibold text-ink-primary">{inspectingApp.formData?.dateOfBirth || '—'}</span>
                </div>
              </div>

              <div>
                <span className="text-[13px] font-semibold text-ink-tertiary block">Community area</span>
                <span className="text-[13px] font-semibold text-ink-primary">{inspectingApp.formData?.area || '—'}</span>
              </div>

              <div>
                <span className="text-[13px] font-semibold text-ink-tertiary block">Languages</span>
                <span className="text-[13px] text-ink-secondary">{inspectingApp.formData?.languages?.join(', ') || '—'}</span>
              </div>

              <div>
                <span className="text-[13px] font-semibold text-ink-tertiary block">Motivation statement</span>
                <p className="text-[13px] text-ink-secondary leading-relaxed bg-canvas-subdued/30 p-3 rounded-[6px] mt-1 italic">
                  "{inspectingApp.formData?.motivation || 'No motivation statement provided.'}"
                </p>
              </div>

              <div>
                <span className="text-[13px] font-semibold text-ink-tertiary block">Skills & capacities</span>
                <div className="flex flex-wrap gap-1 pt-1">
                  {inspectingApp.formData?.skills?.map((s) => (
                    <span key={s} className="px-2 py-0.5 bg-canvas-subdued/50 rounded-[4px] text-[13px] font-sans text-ink-primary">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {inspectingApp.formData?.emergencyContact && (
                <div className="pt-2">
                  <span className="text-[13px] font-semibold text-ink-tertiary block">Emergency contact</span>
                  <span className="text-ink-secondary font-medium">
                    {inspectingApp.formData.emergencyContact.name} ({inspectingApp.formData.emergencyContact.relationship}) •{' '}
                    <span className="font-mono">{inspectingApp.formData.emergencyContact.phone}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Internal Staff Notes */}
            <div className="p-4 rounded-[8px] bg-canvas-subdued/30 space-y-3">
              <div className="flex items-center justify-between pb-2">
                <h4 className="font-display text-sm font-bold text-ink-primary">
                  Internal private notes
                </h4>
                <span className="text-[13px] text-ink-tertiary">
                  Visible to managers only
                </span>
              </div>

              {inspectingApp.notes?.length === 0 ? (
                <p className="text-[13px] text-ink-tertiary">No private notes recorded yet.</p>
              ) : (
                <div className="space-y-2">
                  {inspectingApp.notes?.map((n) => (
                    <div key={n.id} className="p-2.5 bg-white rounded-[6px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-ink-primary">{n.authorName}</span>
                        <span className="font-mono text-[13px] text-ink-tertiary">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[13px] text-ink-secondary">{n.content}</p>
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
                  className="flex-1 bg-white text-[13px] rounded-[8px] p-2 focus:outline-none focus:ring-2 focus:ring-ink-primary/20"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleAddPrivateNote}
                  isLoading={isProcessing}
                >
                  Add note
                </Button>
              </div>
            </div>

            {/* Decision Actions */}
            <div className="rounded-[8px] bg-white p-5 space-y-4 shadow-sm">
              <h4 className="font-display text-lg font-bold text-ink-primary">
                Admissions board action
              </h4>

              {/* Expired case: Reopen option */}
              {inspectingApp.status === 'expired' && (
                <div className="p-3 bg-role-applicantLight/30 rounded-[6px] space-y-2">
                  <p className="text-[13px] text-ink-primary font-medium">
                    This applicant's payment deadline has expired. You can reopen the window with a fresh 7-day period.
                  </p>
                  <Button
                    variant="telebirr"
                    size="sm"
                    onClick={handleReopen}
                    isLoading={isProcessing}
                    leftIcon={<ArrowsClockwise className="w-4 h-4" />}
                  >
                    Reopen acceptance (7-day extension)
                  </Button>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[13px] font-medium text-ink-primary">
                  Decision message (included in notice email to applicant)
                </label>
                <textarea
                  rows={2}
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  placeholder="e.g. Strong youth outreach background in Bole; candidate profile confirmed..."
                  className="w-full bg-white text-ink-primary font-sans text-[13px] rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-ink-primary/20"
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
                  Accept & send Telebirr invite (ETB 200)
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  isLoading={isProcessing}
                  onClick={() => handleDecision('more_info_needed')}
                  leftIcon={<Warning className="w-4 h-4" />}
                >
                  Request more info
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  isLoading={isProcessing}
                  onClick={() => handleDecision('rejected')}
                  leftIcon={<X className="w-4 h-4" />}
                >
                  Reject application
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
        title={`Reject ${selectedIds.length} applications?`}
      >
        <div className="space-y-4 text-[13px] font-sans text-left">
          <p className="text-ink-secondary leading-relaxed">
            Please provide a respectful, transparent reason for declining these applications. This text will be included in the automated notice email sent to each candidate.
          </p>

          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-ink-primary">
              Rejection reason (required)
            </label>
            <textarea
              rows={3}
              value={bulkRejectReason}
              onChange={(e) => setBulkRejectReason(e.target.value)}
              placeholder="e.g. Volunteer quotas for this cycle have reached full capacity..."
              className="w-full bg-white text-[13px] rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-ink-primary/20"
              required
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2">
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
              Confirm bulk reject
            </Button>
          </div>
        </div>
      </SheetModal>
    </div>
  );
};
