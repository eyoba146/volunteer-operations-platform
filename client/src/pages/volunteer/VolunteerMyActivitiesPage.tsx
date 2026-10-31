import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Activity, Enrollment } from '../../types';
import { Tabs, StatusMark, Button, Skeleton, EmptyState } from '../../components/ui';
import { Calendar, Clock, MapPin, QrCode, ArrowRight } from '@phosphor-icons/react';

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
        <Skeleton variant="row" className="h-24" />
        <Skeleton variant="row" className="h-24" />
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
    (item) =>
      item.enrollment.status === 'joined' ||
      item.enrollment.status === 'waiting'
  );

  const past = enrolledActivities.filter(
    (item) =>
      item.enrollment.status === 'attended' ||
      item.activity.status === 'completed'
  );

  const currentList = activeTab === 'upcoming' ? upcoming : past;

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-5 space-y-1">
        <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary block">
          PERSONAL ROSTER
        </span>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-primary">
          My Civic Activities
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink-secondary">
          Track assignments you have registered for, check in to recorded shifts, and inspect past verified attendance.
        </p>
      </div>

      <Tabs
        tabs={[
          { id: 'upcoming', label: 'Upcoming & Active', count: upcoming.length },
          { id: 'past', label: 'Past & Attended', count: past.length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {currentList.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-6 h-6" />}
          title={activeTab === 'upcoming' ? 'No upcoming assignments' : 'No past activity records'}
          description={
            activeTab === 'upcoming'
              ? 'You have not joined any upcoming field rosters yet. Explore open assignments in your area.'
              : 'Activities you attend and check into will be permanently cataloged here.'
          }
          actionLabel="Browse Available Activities"
          onAction={() => navigate('/volunteer/activities')}
        />
      ) : (
        <div className="border border-border bg-canvas-raised divide-y divide-border">
          {currentList.map(({ activity, enrollment }) => (
            <div
              key={enrollment.id}
              className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-canvas-subdued/40 transition-colors"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 bg-canvas-subdued border border-border text-ink-secondary">
                    {activity.type.replace('_', ' ')}
                  </span>
                  <StatusMark status={enrollment.status as any} size="sm" />
                </div>

                <Link
                  to={`/volunteer/activities/${activity.id}`}
                  className="font-serif text-lg font-bold text-ink-primary hover:underline block"
                >
                  {activity.title}
                </Link>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-ink-tertiary">
                  <span className="flex items-center gap-1.5 text-ink-secondary">
                    <Clock className="w-3.5 h-3.5" />
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
                  <span className="flex items-center gap-1.5 text-ink-secondary">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{activity.place}, {activity.area}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                {enrollment.status === 'joined' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/volunteer/check-in')}
                    leftIcon={<QrCode className="w-4 h-4" />}
                  >
                    Check In
                  </Button>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/volunteer/activities/${activity.id}`)}
                >
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

