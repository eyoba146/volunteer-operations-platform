import React, { useState, useEffect } from 'react';
import * as api from '../../api';
import { User, VolunteerProfile, RankHistoryMilestone } from '../../types';
import { LedgerTable, LedgerColumn, Input, Select, Button, StatusMark, SheetModal, Avatar } from '../../components/ui';
import { MagnifyingGlass, Eye, ChartLineUp, Phone, EnvelopeSimple } from '@phosphor-icons/react';

export const ManagerVolunteersPage: React.FC = () => {
  const [volunteers, setVolunteers] = useState<Array<{ user: User; profile: VolunteerProfile }>>([]);
  const [search, setSearch] = useState('');
  const [rankFilter, setRankFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [inspecting, setInspecting] = useState<{ user: User; profile: VolunteerProfile } | null>(null);
  const [rankHistory, setRankHistory] = useState<RankHistoryMilestone[]>([]);
  const [volunteerStats, setVolunteerStats] = useState<{ hours: number; activities: number; rating: number }>({
    hours: 0,
    activities: 0,
    rating: 5.0,
  });

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const list = await api.getAllVolunteers({
          rank: rankFilter,
          area: areaFilter,
          search: search || undefined,
        });
        setVolunteers(list);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [rankFilter, areaFilter, search]);

  const handleInspect = async (item: { user: User; profile: VolunteerProfile }) => {
    setInspecting(item);
    // Derive rank milestones & service stats
    const state = api.store.getState();
    const userHours = state.hours
      .filter((h) => h.userId === item.user.id && h.status === 'approved')
      .reduce((sum, h) => sum + h.minutes, 0);
    const userActs = state.enrollments.filter(
      (e) => e.userId === item.user.id && e.status === 'attended'
    ).length;
    const userRatings = state.ratings.filter((r) => r.userId === item.user.id);
    const avgRating =
      userRatings.length > 0
        ? Math.round((userRatings.reduce((s, r) => s + r.score, 0) / userRatings.length) * 10) / 10
        : 5.0;

    setVolunteerStats({
      hours: Math.round((userHours / 60) * 10) / 10,
      activities: userActs,
      rating: avgRating,
    });

    // Build timeline milestones
    const milestones: RankHistoryMilestone[] = [];
    if (item.profile.rankHistory && item.profile.rankHistory.length > 0) {
      milestones.push(...item.profile.rankHistory);
    } else {
      // Synthesize from profile & seed promotions
      if (item.profile.rank === 'team_lead' || item.profile.rank === 'manager') {
        milestones.push({
          rank: 'team_lead',
          rankTitle: 'Team Lead Credential',
          achievedAt: '2026-06-15',
          hoursRecorded: 168,
          approvedBy: 'Marta Girma',
          certificateCode: 'VTS-CERT-5104-ET',
          note: 'Exemplary leadership demonstrated in regional clean-up and trail restoration.',
        });
      }
      if (item.profile.rank === 'senior_member' || item.profile.rank === 'team_lead' || item.profile.rank === 'manager') {
        milestones.push({
          rank: 'senior_member',
          rankTitle: 'Senior Member Promotion',
          achievedAt: '2026-04-10',
          hoursRecorded: 64,
          approvedBy: 'Marta Girma',
          certificateCode: 'VTS-CERT-2190-ET',
          note: 'Satisfied 60+ verified field service hours and completed Community Safety & Ethics course.',
        });
      }
      milestones.push({
        rank: 'member',
        rankTitle: 'Corps Induction & Membership',
        achievedAt: item.profile.memberSince || '2026-01-15',
        hoursRecorded: 0,
        approvedBy: 'Admissions Desk',
        certificateCode: 'VTS-CERT-1002-ET',
        note: 'Completed application, Telebirr registration fee verified, orientation attended.',
      });
    }

    setRankHistory(milestones);
  };

  const columns: LedgerColumn<{ user: User; profile: VolunteerProfile }>[] = [
    {
      header: 'Volunteer ID & name',
      cell: ({ profile }) => (
        <div className="flex items-center gap-3">
          <Avatar
            name={profile.fullName}
            photoUrl={profile.photoUrl}
            rank={profile.rank}
            size="sm"
            showRankBadge
          />
          <div>
            <span className="font-sans font-semibold text-ink-primary block">
              {profile.fullName}
            </span>
            <span className="font-mono text-[13px] text-ink-tertiary block">
              {profile.volunteerNumber || 'VTS-2026'}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Operating area',
      cell: ({ profile }) => (
        <span className="font-sans text-[13px] text-ink-secondary">
          {profile.area}
        </span>
      ),
    },
    {
      header: 'Current rank',
      cell: ({ profile }) => (
        <StatusMark status={profile.rank || 'member'} size="sm" />
      ),
    },
    {
      header: 'Member since',
      cell: ({ profile }) => (
        <span className="font-mono text-[13px] text-ink-tertiary">
          {profile.memberSince || '2026-10-31'}
        </span>
      ),
    },
    {
      header: 'Action',
      align: 'right',
      cell: (item) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleInspect(item)}
          leftIcon={<Eye className="w-3.5 h-3.5" />}
        >
          View record
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="border border-[#D5DAE1] rounded-[10px] bg-white p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D5DAE1] pb-5">
          <div className="space-y-1">
            <span className="font-sans text-[13px] font-semibold text-role-manager block">
              Volunteer operations directory
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink-primary leading-tight">
              Volunteer directory & records
            </h1>
            <p className="font-sans text-[13px] sm:text-sm text-ink-secondary mt-1">
              Search active community volunteers, inspect verified field hours, and examine promotion trail histories.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[13px] font-semibold text-role-manager bg-role-managerLight/30 border border-role-manager/30 px-3 py-1.5 rounded-[6px]">
              Total volunteers: {volunteers.length}
            </span>
          </div>
        </div>

        {/* Filter Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <Input
            placeholder="Search by name, ID number, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftAddon={<MagnifyingGlass className="w-4 h-4" />}
          />

          <Select
            value={rankFilter}
            onChange={(e) => setRankFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All ranks' },
              { value: 'member', label: 'Member' },
              { value: 'senior_member', label: 'Senior member' },
              { value: 'team_lead', label: 'Team lead' },
              { value: 'manager', label: 'Manager' },
            ]}
          />

          <Select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All operational areas' },
              { value: 'Addis Ababa', label: 'Addis Ababa' },
              { value: 'Adama', label: 'Adama' },
              { value: 'Bishoftu', label: 'Bishoftu' },
              { value: 'Hawassa', label: 'Hawassa' },
              { value: 'Bahir Dar', label: 'Bahir Dar' },
            ]}
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="border border-[#D5DAE1] rounded-[10px] bg-white shadow-sm overflow-hidden">
        <LedgerTable
          data={volunteers}
          columns={columns}
          keyExtractor={(item) => item.profile.userId}
          isLoading={isLoading}
        />
      </div>

      {/* Volunteer Profile Drawer with Full Rank History */}
      <SheetModal
        isOpen={inspecting !== null}
        onClose={() => setInspecting(null)}
        title={inspecting?.profile.fullName || 'Volunteer record'}
        subtitle={`ID: ${inspecting?.profile.volunteerNumber || ''} • Area: ${inspecting?.profile.area || ''}`}
      >
        {inspecting && (
          <div className="space-y-6 text-left font-sans text-[13px]">
            {/* Header Badge */}
            <div className="flex items-center gap-4 p-4 border border-[#D5DAE1] rounded-[8px] bg-white shadow-sm">
              <Avatar
                name={inspecting.profile.fullName}
                photoUrl={inspecting.profile.photoUrl}
                rank={inspecting.profile.rank}
                size="lg"
                showRankBadge
              />
              <div className="space-y-1">
                <h3 className="font-display text-xl font-bold tracking-tight text-ink-primary">
                  {inspecting.profile.fullName}
                </h3>
                <div className="flex items-center gap-2">
                  <StatusMark status={inspecting.profile.rank || 'member'} size="sm" />
                  <span className="font-mono text-ink-tertiary text-[13px]">
                    Since {inspecting.profile.memberSince || '2026-08'}
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Metric Strip */}
            <div className="border border-[#D5DAE1] rounded-[8px] bg-white divide-x divide-[#D5DAE1] grid grid-cols-3 overflow-hidden">
              <div className="p-3 text-center space-y-0.5">
                <span className="text-[13px] font-medium text-ink-tertiary block">Approved hours</span>
                <span className="font-display text-2xl font-bold text-ink-primary block leading-none">
                  {volunteerStats.hours}
                </span>
                <span className="text-[13px] text-ink-secondary">hrs verified</span>
              </div>
              <div className="p-3 text-center space-y-0.5">
                <span className="text-[13px] font-medium text-ink-tertiary block">Activities done</span>
                <span className="font-display text-2xl font-bold text-ink-primary block leading-none">
                  {volunteerStats.activities}
                </span>
                <span className="text-[13px] text-ink-secondary">sessions</span>
              </div>
              <div className="p-3 text-center space-y-0.5">
                <span className="text-[13px] font-medium text-ink-tertiary block">Rating score</span>
                <span className="font-display text-2xl font-bold text-role-applicant block leading-none">
                  {volunteerStats.rating}
                </span>
                <span className="text-[13px] text-ink-secondary">out of 5.0</span>
              </div>
            </div>

            {/* Permanent Rank History Trail */}
            <div className="p-4 border border-[#D5DAE1] rounded-[8px] bg-white space-y-3">
              <div className="flex items-center gap-2 border-b border-[#D5DAE1] pb-2">
                <ChartLineUp className="w-4 h-4 text-role-manager" weight="bold" />
                <h4 className="font-display text-base font-bold tracking-tight text-ink-primary">
                  Promotion & rank advancement trail
                </h4>
              </div>

              <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#EDEFF2]">
                {rankHistory.map((m, idx) => (
                  <div key={idx} className="relative space-y-1">
                    {/* Milestone Node */}
                    <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-role-manager ring-2 ring-white" />

                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-bold text-ink-primary text-[13px] font-display">
                        {m.rankTitle || m.rank.replace('_', ' ')}
                      </span>
                      <span className="font-mono text-[13px] text-ink-tertiary">
                        {m.achievedAt}
                      </span>
                    </div>

                    <p className="text-[13px] text-ink-secondary">
                      {m.note || 'Milestone verified and recorded.'}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 font-mono text-[13px] text-ink-tertiary pt-0.5">
                      {m.hoursRecorded !== undefined && (
                        <span>Hours: <strong>{m.hoursRecorded} hrs</strong></span>
                      )}
                      {m.approvedBy && (
                        <span>• Evaluated by: <strong>{m.approvedBy}</strong></span>
                      )}
                      {m.certificateCode && (
                        <span>• Certificate: <strong>{m.certificateCode}</strong></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="p-4 border border-[#D5DAE1] rounded-[8px] bg-canvas-subdued/30 space-y-3">
              <span className="font-semibold text-[13px] text-ink-primary block">
                Contact details & area
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-ink-tertiary" />
                  <span className="font-mono text-[13px] font-semibold text-ink-primary">{inspecting.profile.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <EnvelopeSimple className="w-3.5 h-3.5 text-ink-tertiary" />
                  <span className="font-mono text-[13px] text-ink-primary truncate">{inspecting.user.email}</span>
                </div>
              </div>
              <div>
                <span className="text-[13px] text-ink-tertiary block">Registered area</span>
                <span className="text-[13px] font-medium text-ink-primary">{inspecting.profile.area}</span>
              </div>
            </div>

            {/* Bio & Background */}
            <div className="p-4 border border-[#D5DAE1] rounded-[8px] bg-canvas-subdued/30 space-y-1.5">
              <span className="font-semibold text-[13px] text-ink-primary block">
                Bio & motivation
              </span>
              <p className="text-[13px] text-ink-secondary leading-relaxed">
                {inspecting.profile.bio}
              </p>
            </div>

            {/* Skills Catalog */}
            <div className="p-4 border border-[#D5DAE1] rounded-[8px] bg-canvas-subdued/30 space-y-2">
              <span className="font-semibold text-[13px] text-ink-primary block">
                Verified skills
              </span>
              <div className="flex flex-wrap gap-1.5">
                {inspecting.profile.skills.map((s) => (
                  <span key={s} className="px-2 py-0.5 bg-white border border-[#D5DAE1] rounded-[4px] font-mono text-[13px] font-medium text-ink-primary">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
            {inspecting.profile.emergencyContact && (
              <div className="p-4 border border-[#D5DAE1] rounded-[8px] bg-canvas-subdued/30 space-y-1">
                <span className="font-semibold text-[13px] text-ink-primary block">
                  Emergency contact
                </span>
                <p className="text-ink-secondary text-[13px]">
                  {inspecting.profile.emergencyContact.name} ({inspecting.profile.emergencyContact.relationship}) •{' '}
                  <span className="font-mono font-semibold text-ink-primary">{inspecting.profile.emergencyContact.phone}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </SheetModal>
    </div>
  );
};
