import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../../api';
import { Activity, ActivityStatus, Enrollment, User, VolunteerProfile } from '../../types';
import { LedgerTable, LedgerColumn, Input, Select, Button, StatusMark, SheetModal, Skeleton } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { 
  Calendar, 
  Plus, 
  UsersThree, 
  Key, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Funnel 
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
      header: 'Activity & Field Location',
      cell: (act) => (
        <div className="space-y-1">
          <span className="font-sans font-bold text-ink-primary text-sm block">
            {act.title}
          </span>
          <div className="flex items-center gap-2 text-xs text-ink-secondary">
            <MapPin className="w-3.5 h-3.5 text-ink-tertiary" />
            <span>{act.place}, {act.area}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Start Schedule',
      cell: (act) => (
        <div className="space-y-0.5 font-mono text-xs text-ink-primary">
          <span>{new Date(act.startsAt).toLocaleDateString()}</span>
          <span className="text-ink-tertiary text-[13px] block">
            {new Date(act.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      ),
    },
    {
      header: 'Field Leader',
      cell: (act) => (
        <span className="font-sans text-xs font-semibold text-ink-primary">
          {act.leadName || 'Assigned Lead'}
        </span>
      ),
    },
    {
      header: 'Check-In Code',
      cell: (act) => (
        <span className="font-mono text-xs font-bold px-2 py-0.5 bg-canvas-subdued border border-border text-ink-primary">
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
      <div
        className="border-4 border-ink-primary bg-white p-6 sm:p-8 space-y-4 shadow-ticket"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-ink-primary pb-5">
          <div className="space-y-1">
            <span className="font-sans text-xs font-bold text-role-manager tracking-tight block">
              Central Field Coordination
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tight text-ink-primary leading-none">
              All Field Activities
            </h1>
            <p className="font-sans text-xs sm:text-sm text-ink-secondary mt-1">
              Supervise all volunteer deployments, inspect team rosters, verify muster codes, and update activity states.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="teal"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" weight="bold" />}
              onClick={() => navigate('/team-lead/create-activity')}
            >
              Create Activity
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
              { value: 'all', label: 'All Statuses' },
              { value: 'open', label: 'Open for Registration' },
              { value: 'in_progress', label: 'In Progress (Active Now)' },
              { value: 'full', label: 'Roster Full' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
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
        data={activities}
        columns={columns}
        keyExtractor={(act) => act.id}
        isLoading={isLoading}
      />

      {/* Activity Roster Drawer */}
      <SheetModal
        isOpen={selectedActivity !== null}
        onClose={() => setSelectedActivity(null)}
        title={selectedActivity?.title || 'Activity Roster'}
        subtitle={`Check-In Code: ${selectedActivity?.checkInCode || ''} • Capacity: ${selectedActivity?.capacity || 0} volunteers`}
        mode="sheet"
      >
        {selectedActivity && (
          <div className="space-y-6 text-left font-sans text-xs">
            {/* Status & Control Banner */}
            <div className="p-4 border-2 border-ink-primary bg-white shadow-ticket space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[13px] text-ink-tertiary block">Current State</span>
                  <StatusMark status={selectedActivity.status} size="md" />
                </div>
                <div className="flex items-center gap-2">
                  {selectedActivity.status !== 'completed' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleStatusChange(selectedActivity.id, 'completed')}
                      leftIcon={<CheckCircle className="w-3.5 h-3.5 text-civic-green" weight="bold" />}
                    >
                      Mark Completed
                    </Button>
                  )}
                  {selectedActivity.status !== 'cancelled' && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleStatusChange(selectedActivity.id, 'cancelled')}
                      leftIcon={<XCircle className="w-3.5 h-3.5" />}
                    >
                      Cancel Activity
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-ink-secondary text-xs">
                {selectedActivity.description}
              </p>
            </div>

            {/* Enrolled Volunteers List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b-2 border-border pb-2">
                <span className="font-display text-lg font-black text-ink-primary">
                  Enrolled Roster ({roster.length} / {selectedActivity.capacity})
                </span>
              </div>

              {isLoadingRoster ? (
                <div className="space-y-2 py-4">
                  <Skeleton variant="text" className="h-6 w-full" />
                  <Skeleton variant="text" className="h-6 w-full" />
                </div>
              ) : roster.length === 0 ? (
                <p className="text-ink-tertiary py-8 text-center text-xs">
                  No volunteers currently enrolled for this shift.
                </p>
              ) : (
                <div className="divide-y divide-border border-2 border-border bg-white">
                  {roster.map(({ enrollment, profile, user }) => (
                    <div key={enrollment.id} className="p-3 flex items-center justify-between gap-3">
                      <div>
                        <span className="font-bold text-ink-primary text-sm block">
                          {profile?.fullName || user?.username || 'Enrolled Volunteer'}
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
