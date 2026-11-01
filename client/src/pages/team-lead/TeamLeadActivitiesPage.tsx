import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Activity, Enrollment } from '../../types';
import { Button, StatusMark, Skeleton, EmptyState, SheetModal, TicketCard } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  UsersThree, 
  CheckCircle,
  UserCircle
} from '@phosphor-icons/react';

export const TeamLeadActivitiesPage: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Roster drawer state
  const [rosterTarget, setRosterTarget] = useState<Activity | null>(null);
  const [rosterEnrollments, setRosterEnrollments] = useState<Enrollment[]>([]);
  const [isLoadingRoster, setIsLoadingRoster] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const list = await api.getAllActivities();
      setActivities(list.filter((a) => a.leadId === user.id));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleOpenRoster = async (act: Activity) => {
    setRosterTarget(act);
    setIsLoadingRoster(true);
    try {
      const enrs = await api.getEnrollmentsForActivity(act.id);
      setRosterEnrollments(enrs);
    } finally {
      setIsLoadingRoster(false);
    }
  };

  const handleMarkComplete = async (activityId: string) => {
    if (!window.confirm('Mark this field session as completed?')) return;
    setIsUpdating(true);
    try {
      await api.completeActivity(activityId);
      toast.success('Activity marked as completed. You can now rate participants.');
      await loadData();
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="rect" className="h-28 rounded-[10px]" />
        <Skeleton variant="rect" className="h-28 rounded-[10px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="border-b border-[#EDEFF2] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink-primary leading-tight mt-1">
            Activities under my leadership
          </h1>
          <p className="font-sans text-[13px] sm:text-sm text-ink-secondary mt-1">
            Manage your assignments, view live check-in codes, inspect participant rosters, and mark completed sessions.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" weight="bold" />}
          onClick={() => navigate('/team-lead/create-activity')}
        >
          Create new activity
        </Button>
      </div>

      {activities.length === 0 ? (
        <EmptyState
          icon={<CalendarIcon className="w-8 h-8 text-ink-secondary" weight="bold" />}
          title="No activities created yet"
          description="Create your first field assignment to begin recruiting volunteers."
          actionLabel="Create an activity"
          onAction={() => navigate('/team-lead/create-activity')}
        />
      ) : (
        <div className="space-y-4">
          {activities.map((act) => (
            <TicketCard
              key={act.id}
              activity={act}
              onClick={() => handleOpenRoster(act)}
              actionSlot={
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                  <div className="bg-[#F7F8FA] rounded-[10px] p-2.5 text-center min-w-[100px]">
                    <span className="font-sans text-[12px] font-medium text-ink-tertiary block">
                      Session code
                    </span>
                    <span className="font-mono text-xl font-bold text-ink-primary tracking-widest block">
                      {act.checkInCode}
                    </span>
                  </div>

                  <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<UsersThree className="w-4 h-4" weight="bold" />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenRoster(act);
                      }}
                    >
                      View roster
                    </Button>

                    {act.status !== 'completed' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<CheckCircle className="w-4 h-4" weight="bold" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkComplete(act.id);
                        }}
                        isLoading={isUpdating}
                      >
                        Mark complete
                      </Button>
                    )}
                  </div>
                </div>
              }
            />
          ))}
        </div>
      )}

      {/* Roster Modal Sheet */}
      <SheetModal
        isOpen={Boolean(rosterTarget)}
        onClose={() => setRosterTarget(null)}
        title={rosterTarget ? `Participant roster: ${rosterTarget.title}` : 'Activity roster'}
      >
        {rosterTarget && (
          <div className="space-y-5">
            <div className="border border-[#D5DAE1] rounded-[8px] bg-canvas-subdued/30 p-4 font-mono text-[13px] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-ink-secondary">Schedule:</span>
                <span className="font-semibold text-ink-primary">
                  {new Date(rosterTarget.startsAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-secondary">Capacity:</span>
                <span className="font-semibold text-ink-primary">
                  {rosterEnrollments.length} enrolled / {rosterTarget.capacity} spots
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-secondary">Check-in code:</span>
                <span className="font-bold text-role-teamlead tracking-widest">{rosterTarget.checkInCode}</span>
              </div>
            </div>

            <div className="border border-[#D5DAE1] rounded-[8px] bg-white divide-y divide-[#D5DAE1] overflow-hidden">
              {isLoadingRoster ? (
                <div className="p-4 space-y-2">
                  <Skeleton variant="row" className="h-10" />
                  <Skeleton variant="row" className="h-10" />
                </div>
              ) : rosterEnrollments.length === 0 ? (
                <div className="p-6 text-center font-sans text-[13px] text-ink-secondary">
                  No volunteers enrolled in this session yet.
                </div>
              ) : (
                rosterEnrollments.map((enr) => (
                  <div key={enr.id} className="p-3.5 flex items-center justify-between gap-3 text-[13px]">
                    <div className="flex items-center gap-2.5">
                      <UserCircle className="w-6 h-6 text-ink-secondary" />
                      <div>
                        <span className="font-sans font-semibold text-ink-primary block">
                          Volunteer ID: {enr.userId}
                        </span>
                        <span className="font-mono text-[13px] text-ink-tertiary block">
                          Joined {new Date(enr.joinedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <StatusMark status={enr.status as any} size="sm" />
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 flex justify-between items-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setRosterTarget(null);
                  navigate('/team-lead/ratings');
                }}
              >
                Go to ratings page
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setRosterTarget(null)}
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </SheetModal>
    </div>
  );
};
