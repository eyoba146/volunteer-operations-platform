import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Activity, Enrollment } from '../../types';
import { Tabs, StatusMark, Button, Skeleton, EmptyState } from '../../components/ui';
import { Calendar as CalendarIcon, Clock, MapPin, QrCode, ArrowRight } from '@phosphor-icons/react';

export const VolunteerMyActivitiesPage: React.FC = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const [enrs, acts] = await Promise.all([
          api.getEnrollmentsForUser(user.id),
          api.getAllActivities(),
        ]);
        setEnrollments(enrs);
        setActivities(acts);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="rect" className="h-28" />
        <Skeleton variant="rect" className="h-28" />
      </div>
    );
  }

  const enrolledActivities = enrollments
    .map((enr) => {
      const act = activities.find((a) => a.id === enr.activityId);
      return act ? { activity: act, enrollment: enr } : null;
    })
    .filter(Boolean) as Array<{ activity: Activity; enrollment: Enrollment }>;

  const upcoming = enrolledActivities.filter(
    (item) => item.enrollment.status === 'joined'
  );

  const waiting = enrolledActivities.filter(
    (item) => item.enrollment.status === 'waiting'
  );

  const past = enrolledActivities.filter(
    (item) =>
      item.enrollment.status === 'attended' ||
      item.activity.status === 'completed'
  );

  const currentList =
    activeTab === 'upcoming' ? upcoming : activeTab === 'waiting' ? waiting : past;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-2 border-border pb-5">
        <span className="font-sans text-xs font-bold text-role-volunteer uppercase tracking-tight block">
          Personal Assignments
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-ink-primary leading-none mt-1">
          My Volunteer Roster
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink-secondary mt-1">
          Track assignments you have registered for, check in to recorded shifts, and inspect past verified attendance.
        </p>
      </div>

      <Tabs
        tabs={[
          { id: 'upcoming', label: 'Upcoming & Active', count: upcoming.length },
          { id: 'waiting', label: 'Waiting List', count: waiting.length },
          { id: 'past', label: 'Past & Attended', count: past.length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {currentList.length === 0 ? (
        <EmptyState
          icon={<CalendarIcon className="w-8 h-8 text-ink-secondary" weight="bold" />}
          title={
            activeTab === 'upcoming'
              ? 'No upcoming assignments'
              : activeTab === 'waiting'
              ? 'No waiting list enrollments'
              : 'No past activity records'
          }
          description={
            activeTab === 'upcoming'
              ? 'You have not joined any upcoming activities yet. Browse open opportunities in your area.'
              : activeTab === 'waiting'
              ? 'You are not currently waiting for spots in any full activities.'
              : 'Activities you attend and check into will be recorded here.'
          }
          actionLabel="Browse Available Activities"
          onAction={() => navigate('/volunteer/activities')}
        />
      ) : (
        <div className="space-y-4">
          {currentList.map(({ activity, enrollment }) => (
            <div
              key={enrollment.id}
              className="border-2 border-ink-primary bg-white p-5 sm:p-6 shadow-ticket flex flex-col md:flex-row md:items-center justify-between gap-6"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)',
              }}
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase px-2 py-0.5 bg-canvas border border-ink-primary text-ink-primary">
                    {activity.type.replace('_', ' ')}
                  </span>
                  <StatusMark status={enrollment.status as any} size="sm" />
                </div>

                <Link
                  to={`/volunteer/activities/${activity.id}`}
                  className="font-display text-2xl sm:text-3xl font-black uppercase text-ink-primary hover:text-role-volunteer transition-colors block leading-tight"
                >
                  {activity.title}
                </Link>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-ink-secondary pt-1">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-ink-tertiary" />
                    <span>
                      {new Date(activity.startsAt).toLocaleString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-ink-tertiary" />
                    <span>{activity.place}, {activity.area}</span>
                  </span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-3 self-end md:self-center">
                {enrollment.status === 'joined' && (
                  <Button
                    variant="primary"
                    size="md"
                    leftIcon={<QrCode className="w-4 h-4" weight="bold" />}
                    onClick={() => navigate('/volunteer/check-in')}
                  >
                    Check In
                  </Button>
                )}
                <Button
                  variant="secondary"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" weight="bold" />}
                  onClick={() => navigate(`/volunteer/activities/${activity.id}`)}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
