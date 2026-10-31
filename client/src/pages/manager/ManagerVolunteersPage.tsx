import React, { useState, useEffect } from 'react';
import * as api from '../../api';
import { User, VolunteerProfile } from '../../types';
import { LedgerTable, LedgerColumn, Input, Select, Button, StatusMark, SheetModal, Avatar, Skeleton } from '../../components/ui';
import { MagnifyingGlass, UserCircle, Eye, DownloadSimple } from '@phosphor-icons/react';

export const ManagerVolunteersPage: React.FC = () => {
  const [volunteers, setVolunteers] = useState<Array<{ user: User; profile: VolunteerProfile }>>([]);
  const [search, setSearch] = useState('');
  const [rankFilter, setRankFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [inspecting, setInspecting] = useState<{ user: User; profile: VolunteerProfile } | null>(null);

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

  const columns: LedgerColumn<{ user: User; profile: VolunteerProfile }>[] = [
    {
      header: 'Volunteer ID & Name',
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
            <span className="font-sans font-bold text-ink-primary block">
              {profile.fullName}
            </span>
            <span className="font-mono text-[11px] text-ink-tertiary block">
              {profile.volunteerNumber || 'VTS-2026'}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'City / Area',
      cell: ({ profile }) => (
        <span className="font-sans text-xs text-ink-secondary">
          {profile.area}
        </span>
      ),
    },
    {
      header: 'Rank',
      cell: ({ profile }) => (
        <StatusMark status={profile.rank || 'member'} size="sm" />
      ),
    },
    {
      header: 'Member Since',
      cell: ({ profile }) => (
        <span className="font-mono text-xs text-ink-tertiary">
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
          onClick={() => setInspecting(item)}
          leftIcon={<Eye className="w-3.5 h-3.5" />}
        >
          View Record
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
            CENTRAL CORPS REGISTER
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-primary">
            Active Volunteer Directory
          </h1>
          <p className="font-sans text-xs sm:text-sm text-ink-secondary">
            Authorized index of all registered community volunteers across Ethiopian regional sectors.
          </p>
        </div>

        <span className="font-mono text-xs text-ink-tertiary bg-canvas-raised border border-border px-3 py-1.5 self-start sm:self-auto">
          Total in Registry: <strong className="text-ink-primary font-bold">{volunteers.length}</strong>
        </span>
      </div>

      {/* Search and Filters */}
      <div className="border border-border bg-canvas-raised p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
              { value: 'all', label: 'All Ranks' },
              { value: 'member', label: 'Member' },
              { value: 'senior_member', label: 'Senior Member' },
              { value: 'team_lead', label: 'Team Lead' },
              { value: 'manager', label: 'Manager' },
            ]}
          />

          <Select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Operational Areas' },
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
      <LedgerTable
        data={volunteers}
        columns={columns}
        keyExtractor={(item) => item.profile.userId}
        isLoading={isLoading}
      />

      {/* Volunteer Profile Drawer */}
      <SheetModal
        isOpen={inspecting !== null}
        onClose={() => setInspecting(null)}
        title={inspecting?.profile.fullName || 'Volunteer Record'}
        subtitle={`Volunteer ID: ${inspecting?.profile.volunteerNumber || ''}`}
        mode="sheet"
      >
        {inspecting && (
          <div className="space-y-6 text-left font-sans text-xs">
            <div className="flex items-center gap-4 p-4 border border-border bg-canvas-subdued">
              <Avatar
                name={inspecting.profile.fullName}
                photoUrl={inspecting.profile.photoUrl}
                rank={inspecting.profile.rank}
                size="lg"
                showRankBadge
              />
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-ink-primary">
                  {inspecting.profile.fullName}
                </h3>
                <StatusMark status={inspecting.profile.rank || 'member'} size="sm" />
                <p className="font-mono text-[11px] text-ink-tertiary">
                  Member since {inspecting.profile.memberSince || '2026-08'}
                </p>
              </div>
            </div>

            <div className="p-4 border border-border bg-canvas-raised space-y-3">
              <span className="font-mono text-[10px] uppercase text-ink-tertiary block font-bold">
                Contact & Regional Data
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="font-mono text-[10px] text-ink-tertiary block">Phone</span>
                  <span className="font-mono text-sm text-ink-primary font-bold">{inspecting.profile.phone}</span>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-ink-tertiary block">Email</span>
                  <span className="font-mono text-xs text-ink-primary truncate block">{inspecting.user.email}</span>
                </div>
              </div>
              <div>
                <span className="font-mono text-[10px] text-ink-tertiary block">Operating Area</span>
                <span className="text-sm font-medium text-ink-primary">{inspecting.profile.area}</span>
              </div>
            </div>

            <div className="p-4 border border-border bg-canvas-raised space-y-2">
              <span className="font-mono text-[10px] uppercase text-ink-tertiary block font-bold">
                Bio & Service Background
              </span>
              <p className="text-xs text-ink-secondary leading-relaxed">
                {inspecting.profile.bio}
              </p>
            </div>

            <div className="p-4 border border-border bg-canvas-raised space-y-2">
              <span className="font-mono text-[10px] uppercase text-ink-tertiary block font-bold">
                Skills Catalog
              </span>
              <div className="flex flex-wrap gap-1.5">
                {inspecting.profile.skills.map((s) => (
                  <span key={s} className="px-2 py-0.5 bg-canvas-subdued border border-border font-mono text-[11px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {inspecting.profile.emergencyContact && (
              <div className="p-4 border border-border bg-canvas-raised space-y-1">
                <span className="font-mono text-[10px] uppercase text-ink-tertiary block font-bold">
                  Emergency Contact
                </span>
                <p className="text-ink-secondary">
                  {inspecting.profile.emergencyContact.name} ({inspecting.profile.emergencyContact.relationship}) •{' '}
                  <span className="font-mono text-ink-primary">{inspecting.profile.emergencyContact.phone}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </SheetModal>
    </div>
  );
};
