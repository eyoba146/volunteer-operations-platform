import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../../api';
import { Activity, ActivityStatus, Enrollment, User, VolunteerProfile } from '../../types';
import { LedgerTable, LedgerColumn, Input, Select, Button, StatusMark, SheetModal } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { 
  Plus, 
  UsersThree, 
  MapPin, 
  CheckCircle, 
  XCircle 
} from '@phosphor-icons/react';

export const ManagerActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [roster, setRoster] = useState<Array<{ enrollment: Enrollment; profile?: VolunteerProfile; user?: User }>>([]);
  const [isLoadingRoster, setIsLoadingRoster] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const loadActivities = async () => {
    setIsLoading(true);
    try {
      const list = await api.getAllActivities({
        status: statusFilter === 'all' ? undefined : (statusFilter as ActivityStatus),
        area: areaFilter === 'all' ? undefined : areaFilter,
        search: search || undefined,
      });
      setActivities(list);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [statusFilter, areaFilter, search]);

  const handleOpenRoster = async (act: Activity) => {
    setSelectedActivity(act);
    setIsLoadingRoster(true);
    try {
      const enrollments = await api.getEnrollmentsForActivity(act.id);
      const state = api.store.getState();
      const enriched = enrollments.map((e: Enrollment) => {
        const user = state.users.find((u) => u.id === e.userId);
        const profile = state.profiles.find((p) => p.userId === e.userId);
        return { enrollment: e, user, profile };
      });
      setRoster(enriched);
    } finally {
      setIsLoadingRoster(false);
    }
  };

  const handleStatusChange = async (activityId: string, nextStatus: ActivityStatus) => {
    try {
      await api.updateActivity(activityId, { status: nextStatus });
      toast.success(`Activity status updated to ${nextStatus}.`);
      if (selectedActivity && selectedActivity.id === activityId) {
        setSelectedActivity((prev) => (prev ? { ...prev, status: nextStatus } : null));
      }
      await loadActivities();
    } catch (err: any) {
      toast.error(err.message || 'Could not update status');
    }
  };

  const columns: LedgerColumn<Activity>[] = [
    {
      header: 'Activity & field location',
      cell: (act) => (
        <div className="space-y-1">
          <span className="font-sans font-semibold text-ink-primary text-sm block">
            {act.title}
          </span>
          <div className="flex items-center gap-2 text-[13px] text-ink-secondary">
            <MapPin className="w-3.5 h-3.5 text-ink-tertiary" />
            <span>{act.place}, {act.area}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Start schedule',
      cell: (act) => (
        <div className="space-y-0.5 font-mono text-[13px] text-ink-primary">
          <span>{new Date(act.startsAt).toLocaleDateString()}</span>
          <span className="text-ink-tertiary text-[13px] block">
            {new Date(act.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      ),
    },
    {
      header: 'Field leader',
      cell: (act) => (
        <span className="font-sans text-[13px] font-semibold text-ink-primary">
          {act.leadName || 'Assigned Lead'}
        </span>
      ),
    },
    {
      header: 'Check-in code',
      cell: (act) => (
        <span className="font-mono text-[13px] font-semibold px-2 py-0.5 bg-canvas-subdued/50 border border-[#D5DAE1] rounded-[4px] text-ink-primary">
          {act.checkInCode}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (act) => <StatusMark status={act.status} size="sm" />,
    },
    {
      header: 'Actions',
      align: 'right',
      cell: (act) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleOpenRoster(act)}
            leftIcon={<UsersThree className="w-3.5 h-3.5" />}
          >
            Roster
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="border border-[#D5DAE1] rounded-[10px] bg-white p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D5DAE1] pb-5">
          <div className="space-y-1">
            <span className="font-sans text-[13px] font-semibold text-role-manager block">
              Central field coordination
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink-primary leading-tight">
              All field activities
            </h1>
            <p className="font-sans text-[13px] sm:text-sm text-ink-secondary mt-1">
              Supervise volunteer deployments, inspect team rosters, verify check-in codes, and update activity states.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="teal"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" weight="bold" />}
              onClick={() => navigate('/team-lead/create-activity')}
            >
              Create activity
            </Button>
          </div>
        </div>

        {/* Filter Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <Input
            placeholder="Search activity by title, venue, place..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All statuses' },
              { value: 'open', label: 'Open for registration' },
              { value: 'in_progress', label: 'In progress (active now)' },
              { value: 'full', label: 'Roster full' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
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
          data={activities}
          columns={columns}
          keyExtractor={(act) => act.id}
          isLoading={isLoading}
        />
      </div>

      {/* Activity Roster Drawer */}
      <SheetModal
        isOpen={selectedActivity !== null}
        onClose={() => setSelectedActivity(null)}
        title={selectedActivity?.title || 'Activity roster'}
        subtitle={`Check-in code: ${selectedActivity?.checkInCode || ''} • Capacity: ${selectedActivity?.capacity || 0} volunteers`}
      >
        {selectedActivity && (
          <div className="space-y-6 text-left font-sans text-[13px]">
            {/* Status & Control Banner */}
            <div className="p-4 border border-[#D5DAE1] rounded-[8px] bg-white space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[13px] text-ink-tertiary block">Current state</span>
                  <StatusMark status={selectedActivity.status} size="md" />
                </div>
                <div className="flex items-center gap-2">
                  {selectedActivity.status !== 'completed' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleStatusChange(selectedActivity.id, 'completed')}
                      leftIcon={<CheckCircle className="w-3.5 h-3.5 text-role-volunteer" weight="bold" />}
                    >
                      Mark completed
                    </Button>
                  )}
                  {selectedActivity.status !== 'cancelled' && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleStatusChange(selectedActivity.id, 'cancelled')}
                      leftIcon={<XCircle className="w-3.5 h-3.5" />}
                    >
                      Cancel activity
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-ink-secondary text-[13px]">
                {selectedActivity.description}
              </p>
            </div>

            {/* Enrolled Volunteers List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#D5DAE1] pb-2">
                <span className="font-display text-base font-bold text-ink-primary">
                  Enrolled roster ({roster.length} / {selectedActivity.capacity})
                </span>
              </div>

              {isLoadingRoster ? (
                <div className="space-y-2 py-4">
                  <div className="h-6 bg-canvas-subdued animate-pulse rounded-[4px]" />
                  <div className="h-6 bg-canvas-subdued animate-pulse rounded-[4px]" />
                </div>
              ) : roster.length === 0 ? (
                <p className="text-ink-tertiary py-8 text-center text-[13px]">
                  No volunteers currently enrolled for this shift.
                </p>
              ) : (
                <div className="divide-y divide-[#D5DAE1] border border-[#D5DAE1] rounded-[8px] bg-white overflow-hidden">
                  {roster.map(({ enrollment, profile, user }) => (
                    <div key={enrollment.id} className="p-3 flex items-center justify-between gap-3">
                      <div>
                        <span className="font-semibold text-ink-primary text-sm block">
                          {profile?.fullName || user?.username || 'Enrolled volunteer'}
                        </span>
                        <div className="flex items-center gap-2 text-[13px] text-ink-secondary">
                          <span className="font-mono text-ink-tertiary">
                            {profile?.volunteerNumber || 'VTS-2026'}
                          </span>
                          <span>•</span>
                          <span>{profile?.phone || 'No phone'}</span>
                        </div>
                      </div>
                      <StatusMark status={enrollment.status} size="sm" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </SheetModal>
    </div>
  );
};
