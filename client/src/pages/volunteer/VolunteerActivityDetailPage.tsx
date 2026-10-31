import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Activity, Enrollment } from '../../types';
import { Button, StatusMark, Skeleton, EmptyState } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  UsersThree, 
  QrCode, 
  UserCircle, 
  ArrowLeft,
  CheckCircle,
  Warning,
  ShieldCheck,
  Tag,
  Hourglass
} from '@phosphor-icons/react';

export const VolunteerActivityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const loadData = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const [act, enrs] = await Promise.all([
        api.getActivityById(id),
        api.getEnrollmentsForActivity(id),
      ]);
      setActivity(act);
      setEnrollments(enrs);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const myEnrollment = enrollments.find((e) => e.userId === user?.id);
  const isJoined = myEnrollment?.status === 'joined' || myEnrollment?.status === 'attended';
  const isWaiting = myEnrollment?.status === 'waiting';

  const activeParticipants = enrollments.filter(
    (e) => e.status === 'joined' || e.status === 'attended'
  );
  const spotsLeft = activity ? Math.max(0, activity.capacity - activeParticipants.length) : 0;
  const isFull = spotsLeft === 0;

  const handleJoin = async () => {
    if (!user || !activity) return;
    setIsUpdating(true);
    try {
      const enr = await api.joinActivity(user.id, activity.id);
      if (enr.status === 'waiting') {
        toast.info('This activity roster is currently full. You are on the priority waiting list.');
      } else {
        toast.success(`You have joined "${activity.title}".`);
      }
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Could not join activity.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLeave = async () => {
    if (!user || !activity) return;
    const confirmMessage = isWaiting
      ? 'Do you want to leave the waiting list for this activity?'
      : 'Are you sure you want to withdraw from this activity? Leaving close to start time may notify the team lead.';

    if (!window.confirm(confirmMessage)) return;

    setIsUpdating(true);
    try {
      await api.leaveActivity(user.id, activity.id);
      toast.info(isWaiting ? 'Removed from waiting list.' : 'You have withdrawn from this activity.');
      await loadData();
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="rect" className="h-96 rounded-[10px]" />
      </div>
    );
  }

  if (!activity) {
    return (
      <EmptyState
        icon={<Warning className="w-8 h-8 text-role-teamlead" weight="bold" />}
        title="Activity could not be found"
        description="The activity you are looking for may have been rescheduled or removed."
        actionLabel="Return to activities"
        onAction={() => navigate('/volunteer/activities')}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/volunteer/activities')}
        className="inline-flex items-center gap-1.5 font-sans text-[13px] font-medium text-ink-secondary hover:text-ink-primary cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-4 h-4" weight="bold" />
        <span>Back to all activities</span>
      </button>

      {/* Main Card */}
      <div className="border border-[#D5DAE1] rounded-[10px] bg-white p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header Section */}
        <div className="space-y-4 border-b border-[#D5DAE1] pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[13px] font-medium px-2.5 py-0.5 bg-canvas-subdued/50 border border-[#D5DAE1] rounded-[4px] text-ink-primary">
              {activity.type.replace('_', ' ')}
            </span>
            <StatusMark status={activity.status} size="sm" />
            {activity.minRank && (
              <span className="font-mono text-[13px] text-ink-tertiary flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-role-volunteer" weight="bold" />
                <span>{activity.minRank.replace('_', ' ')} required</span>
              </span>
            )}
            {isJoined && (
              <span className="font-mono text-[13px] font-medium px-2.5 py-0.5 bg-role-volunteer text-white rounded-[4px] flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" weight="fill" />
                <span>Enrolled</span>
              </span>
            )}
            {isWaiting && (
              <span className="font-mono text-[13px] font-medium px-2.5 py-0.5 bg-role-applicantLight text-role-applicant rounded-[4px] border border-role-applicant/30 flex items-center gap-1">
                <Hourglass className="w-3.5 h-3.5" weight="fill" />
                <span>On waiting list</span>
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink-primary leading-tight">
            {activity.title}
          </h1>

          <p className="font-sans text-[15px] sm:text-base text-ink-secondary leading-relaxed">
            {activity.description}
          </p>
        </div>

        {/* Operational Attributes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 border border-[#D5DAE1] rounded-[8px] bg-canvas-subdued/30 font-sans text-[13px]">
          <div className="space-y-1">
            <span className="font-sans text-[13px] font-semibold text-ink-tertiary block">
              Schedule & timing
            </span>
            <div className="flex items-center gap-1.5 font-semibold text-ink-primary">
              <CalendarIcon className="w-4 h-4 text-role-volunteer" weight="bold" />
              <span>
                {new Date(activity.startsAt).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <span className="font-mono text-ink-secondary text-[13px] block">
              {new Date(activity.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} –{' '}
              {new Date(activity.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="space-y-1">
            <span className="font-sans text-[13px] font-semibold text-ink-tertiary block">
              Venue location
            </span>
            <div className="flex items-center gap-1.5 font-semibold text-ink-primary">
              <MapPin className="w-4 h-4 text-role-volunteer" weight="bold" />
              <span>{activity.place}</span>
            </div>
            <span className="font-mono text-ink-secondary text-[13px] block">{activity.area}</span>
          </div>

          <div className="space-y-1">
            <span className="font-sans text-[13px] font-semibold text-ink-tertiary block">
              Roster capacity
            </span>
            <div className="flex items-center gap-1.5 font-semibold text-ink-primary">
              <UsersThree className="w-4 h-4 text-role-volunteer" weight="bold" />
              <span>{activeParticipants.length} / {activity.capacity} spots</span>
            </div>
            <span className="font-mono text-ink-secondary text-[13px] block">
              {spotsLeft > 0 ? `${spotsLeft} spots available` : 'Roster is full'}
            </span>
          </div>

          <div className="space-y-1">
            <span className="font-sans text-[13px] font-semibold text-ink-tertiary block">
              Lead coordinator
            </span>
            <div className="flex items-center gap-1.5 font-semibold text-ink-primary">
              <UserCircle className="w-4 h-4 text-role-teamlead" weight="bold" />
              <span>{activity.leadName || 'Assigned Lead'}</span>
            </div>
            <span className="font-mono text-ink-secondary text-[13px] block">Field team lead</span>
          </div>
        </div>

        {/* Required Skills & Equipment */}
        {activity.skills && activity.skills.length > 0 && (
          <div className="space-y-2">
            <span className="font-sans text-[13px] font-semibold text-ink-tertiary block">
              Recommended skills & capabilities
            </span>
            <div className="flex flex-wrap gap-2">
              {activity.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-white border border-[#D5DAE1] rounded-[6px] font-sans text-[13px] font-medium text-ink-primary flex items-center gap-1.5"
                >
                  <Tag className="w-3.5 h-3.5 text-role-volunteer" weight="bold" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Panel */}
        <div className="pt-6 border-t border-[#D5DAE1] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[13px] text-ink-secondary">
            {isJoined ? (
              <p className="text-role-volunteer font-semibold">
                You are confirmed for this assignment. Please check in with the team lead upon arrival.
              </p>
            ) : isWaiting ? (
              <p className="text-role-applicant font-semibold">
                You are on the waiting list. You will be notified if a spot becomes available.
              </p>
            ) : isFull ? (
              <p className="text-ink-secondary font-medium">
                This activity has reached full capacity. You can join the priority waiting list.
              </p>
            ) : (
              <p className="text-ink-secondary font-medium">
                Spots are open. Join this roster to confirm your place on the duty team.
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
            {isJoined ? (
              <>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleLeave}
                  isLoading={isUpdating}
                >
                  Withdraw from activity
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<QrCode className="w-4 h-4" weight="bold" />}
                  onClick={() => navigate('/volunteer/check-in')}
                >
                  Check in now
                </Button>
              </>
            ) : isWaiting ? (
              <Button
                variant="secondary"
                size="md"
                onClick={handleLeave}
                isLoading={isUpdating}
              >
                Leave waiting list
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={handleJoin}
                isLoading={isUpdating}
                disabled={activity.status === 'completed' || activity.status === 'cancelled'}
              >
                {isFull ? 'Join waiting list' : 'Join activity roster'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
