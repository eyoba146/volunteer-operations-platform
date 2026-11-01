import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Activity, Enrollment } from '../../types';
import { Tabs, StatusMark, Button, Skeleton, EmptyState, TicketCard, PageShell } from '../../components/ui';
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
      <PageShell page="volunteer/my-activities" signature="TicketCard">
        <div className="space-y-6">
          <Skeleton variant="text" className="h-8 w-1/3" />
          <Skeleton variant="rect" className="h-28 rounded-[10px]" />
          <Skeleton variant="rect" className="h-28 rounded-[10px]" />
        </div>
      </PageShell>
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
    <PageShell page="volunteer/my-activities" signature="TicketCard">
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4">
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink-primary leading-tight mt-1">
          My volunteer roster
        </h1>
        <p className="font-sans text-[13px] sm:text-sm text-ink-secondary mt-1">
          Track assignments you have registered for, check in to recorded shifts, and inspect past verified attendance.
        </p>
      </div>

      <Tabs
        tabs={[
          { id: 'upcoming', label: 'Upcoming & active', count: upcoming.length },
          { id: 'waiting', label: 'Waiting list', count: waiting.length },
          { id: 'past', label: 'Past & attended', count: past.length },
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
          actionLabel="Browse available activities"
          onAction={() => navigate('/volunteer/activities')}
        />
      ) : (
        <div className="space-y-4">
          {currentList.map(({ activity, enrollment }) => (
            <TicketCard
              key={enrollment.id}
              activity={activity}
              enrolledStatus={
                enrollment.status === 'joined'
                  ? 'Enrolled'
                  : enrollment.status === 'waiting'
                  ? 'Waiting list'
                  : 'Attended'
              }
              actionSlot={
                enrollment.status === 'joined' ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<QrCode className="w-3.5 h-3.5 text-role-volunteer" weight="bold" />}
                    onClick={() => navigate('/volunteer/check-in')}
                  >
                    Check-in code
                  </Button>
                ) : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
    </PageShell>
  );
};
