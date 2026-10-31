import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Activity, Enrollment } from '../../types';
import { Button, StatusMark, Skeleton } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  UsersThree, 
  QrCode, 
  UserCircle, 
  ArrowLeft,
  CheckCircle,
  Warning
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

  const handleJoin = async () => {
    if (!user || !activity) return;
    setIsUpdating(true);
    try {
      const enr = await api.joinActivity(user.id, activity.id);
      if (enr.status === 'waiting') {
        toast.info('The roster is currently full. You have been added to the priority waiting list.');
      } else {
        toast.success(`You are officially enrolled in "${activity.title}".`);
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
    if (!window.confirm('Are you sure you want to withdraw from this activity roster?')) return;
    setIsUpdating(true);
    try {
      await api.leaveActivity(user.id, activity.id);
      toast.info('You have withdrawn from this activity.');
      await loadData();
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="rect" className="h-96" />
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="border border-border bg-canvas-raised p-8 text-center text-sm font-sans text-ink-tertiary">
        Activity not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-ink-tertiary hover:text-ink-primary transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to activities roster</span>
      </button>

      <div className="border border-border bg-canvas-raised p-6 md:p-8 space-y-6 shadow-subtle">
        {/* Header */}
        <div className="space-y-3 border-b border-border pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 bg-canvas-subdued border border-border text-ink-secondary">
              {activity.type.replace('_', ' ')}
            </span>
            <StatusMark status={activity.status} size="sm" />
            {activity.minRank && (
              <span className="font-mono text-xs text-ink-tertiary">
                Requires: <strong className="text-ink-primary uppercase">{activity.minRank.replace('_', ' ')}</strong>
              </span>
            )}
          </div>

          <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-primary">
            {activity.title}
          </h1>

          <p className="font-sans text-sm text-ink-secondary leading-relaxed max-w-2xl">
            {activity.description}
          </p>
        </div>

        {/* Operational Attributes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 border border-border bg-canvas-subdued/50 font-sans text-xs">
          <div className="space-y-1">
            <span className="font-mono text-[10px] uppercase text-ink-tertiary block">
              Date & Schedule
            </span>
            <div className="flex items-center gap-1.5 font-semibold text-ink-primary">
              <Calendar className="w-4 h-4 text-ink-tertiary" />
              <span>
                {new Date(activity.startsAt).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <span className="font-mono text-ink-tertiary text-[11px] block">
              {new Date(activity.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} –{' '}
              {new Date(activity.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-[10px] uppercase text-ink-tertiary block">
              Location & Area
            </span>
            <div className="flex items-center gap-1.5 font-semibold text-ink-primary">
              <MapPin className="w-4 h-4 text-ink-tertiary" />
              <span>{activity.area}</span>
            </div>
            <span className="text-ink-secondary text-[11px] block truncate">
              {activity.place}
            </span>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-[10px] uppercase text-ink-tertiary block">
              Roster Capacity
            </span>
            <div className="flex items-center gap-1.5 font-semibold text-ink-primary">
              <UsersThree className="w-4 h-4 text-ink-tertiary" />
              <span>
                {activeParticipants.length} / {activity.capacity} Enrolled
              </span>
            </div>
            <span className="font-mono text-ink-tertiary text-[11px] block">
              {spotsLeft} spots available
            </span>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-[10px] uppercase text-ink-tertiary block">
              Assigned Team Lead
            </span>
            <div className="flex items-center gap-1.5 font-semibold text-ink-primary">
              <UserCircle className="w-4 h-4 text-ink-tertiary" />
              <span>{activity.leadName || 'Team Lead'}</span>
            </div>
            <span className="text-ink-tertiary text-[11px] block">
              Field Coordinator
            </span>
          </div>
        </div>

        {/* Skills Needed */}
        {activity.skills && activity.skills.length > 0 && (
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary block">
              Skills Alignment
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activity.skills.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 bg-canvas-subdued border border-border font-mono text-xs text-ink-secondary"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Join/Leave Action Bar */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-sans text-ink-secondary">
            {isJoined ? (
              <span className="flex items-center gap-2 text-civic-green font-semibold">
                <CheckCircle className="w-4 h-4" weight="fill" />
                <span>You are enrolled in this activity roster.</span>
              </span>
            ) : isWaiting ? (
              <span className="flex items-center gap-2 text-[#784E0B] font-semibold">
                <Clock className="w-4 h-4" weight="bold" />
                <span>You are on the waiting list. We will notify you if a spot opens.</span>
              </span>
            ) : spotsLeft === 0 ? (
              <span className="text-civic-rust font-semibold">
                This activity roster is currently full. Joining adds you to the waiting list.
              </span>
            ) : (
              <span>Registration is open to active volunteers.</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isJoined && (
              <>
                <Button
                  variant="primary"
                  leftIcon={<QrCode className="w-4 h-4" />}
                  onClick={() => navigate('/volunteer/check-in')}
                >
                  Enter Check-In Code
                </Button>
                <Button
                  variant="danger"
                  isLoading={isUpdating}
                  onClick={handleLeave}
                >
                  Leave Activity
                </Button>
              </>
            )}

            {!isJoined && !isWaiting && (
              <Button
                variant="primary"
                isLoading={isUpdating}
                onClick={handleJoin}
              >
                {spotsLeft === 0 ? 'Join Waiting List' : 'Join Activity Roster'}
              </Button>
            )}

            {isWaiting && (
              <Button
                variant="secondary"
                isLoading={isUpdating}
                onClick={handleLeave}
              >
                Cancel Waiting List Spot
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

