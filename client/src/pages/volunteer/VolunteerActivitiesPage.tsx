import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { Activity, ActivityType } from '../../types';
import { Input, Select, Button, StatusMark, Skeleton, EmptyState, TicketCard, PageShell } from '../../components/ui';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  UsersThree, 
  MagnifyingGlass, 
  ArrowRight,
  ListDashes,
  CalendarBlank,
  ShieldCheck,
  X
} from '@phosphor-icons/react';

const ACTIVITY_TYPES: { value: ActivityType | 'all'; label: string }[] = [
  { value: 'all', label: 'All activity types' },
  { value: 'field_task', label: 'Field task (community service)' },
  { value: 'event', label: 'Event marshalling' },
  { value: 'project', label: 'Community project' },
  { value: 'shift', label: 'Field logistics shift' },
  { value: 'training', label: 'Training session' },
];

const AREA_OPTIONS = [
  { value: 'all', label: 'All cities & regions' },
  { value: 'Addis Ababa', label: 'Addis Ababa' },
  { value: 'Adama', label: 'Adama' },
  { value: 'Bishoftu', label: 'Bishoftu' },
  { value: 'Hawassa', label: 'Hawassa' },
  { value: 'Bahir Dar', label: 'Bahir Dar' },
];

const DATE_OPTIONS = [
  { value: 'all', label: 'All upcoming dates' },
  { value: 'today', label: 'Today only' },
  { value: 'this_week', label: 'This week' },
  { value: 'this_month', label: 'This month' },
];

const RANK_OPTIONS = [
  { value: 'all', label: 'All ranks allowed' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'senior_volunteer', label: 'Senior volunteer' },
  { value: 'team_lead', label: 'Team lead' },
];

export const VolunteerActivitiesPage: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [userEnrollments, setUserEnrollments] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<ActivityType | 'all'>('all');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [selectedRank, setSelectedRank] = useState('all');
  const [scopeTab, setScopeTab] = useState<'upcoming' | 'my' | 'past'>('upcoming');
  const [showAll, setShowAll] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const list = await api.getAllActivities({
          type: selectedType,
          area: selectedArea,
          search: search || undefined,
        });
        setActivities(list);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [selectedType, selectedArea, search]);

  useEffect(() => {
    if (user) {
      api.getEnrollmentsForUser(user.id).then((enrs: any[]) => {
        setUserEnrollments(enrs.map((e: any) => e.activityId));
      }).catch(() => {});
    }
  }, [user]);

  // Client-side date and rank filter
  const filteredActivities = useMemo(() => {
    let result = activities;

    if (selectedRank !== 'all') {
      result = result.filter((a) => {
        if (!a.minRank) return true;
        if (selectedRank === 'volunteer') return a.minRank === 'volunteer' || a.minRank === 'member';
        if (selectedRank === 'senior_volunteer') return a.minRank === 'senior_volunteer' || a.minRank === 'senior_member';
        return a.minRank === selectedRank;
      });
    }

    if (selectedDateFilter === 'today') {
      const todayStr = '2026-10-31'; // Baseline demo date
      result = result.filter((a) => a.startsAt.startsWith(todayStr));
    } else if (selectedDateFilter === 'this_week') {
      const start = new Date('2026-10-26').getTime();
      const end = new Date('2026-11-02').getTime();
      result = result.filter((a) => {
        const t = new Date(a.startsAt).getTime();
        return t >= start && t <= end;
      });
    } else if (selectedDateFilter === 'this_month') {
      result = result.filter((a) => a.startsAt.includes('2026-10') || a.startsAt.includes('2026-11'));
    }

    if (selectedCalendarDate) {
      result = result.filter((a) => a.startsAt.startsWith(selectedCalendarDate));
    }

    return result;
  }, [activities, selectedRank, selectedDateFilter, selectedCalendarDate]);

  // Segmented control scope filtering: upcoming (default), my activities, past
  const scopedActivities = useMemo(() => {
    let list = filteredActivities;
    if (scopeTab === 'upcoming') {
      list = list.filter((a) => a.status !== 'completed' && a.status !== 'cancelled');
    } else if (scopeTab === 'my') {
      list = list.filter((a) => userEnrollments.includes(a.id));
    } else if (scopeTab === 'past') {
      list = list.filter((a) => a.status === 'completed');
    }
    return list;
  }, [filteredActivities, scopeTab, userEnrollments]);

  // Grouping for upcoming: This week, Next week, Later
  const groupedUpcoming = useMemo(() => {
    if (scopeTab !== 'upcoming') return null;

    const now = new Date('2026-10-31T08:00:00Z').getTime();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const twoWeeks = 14 * 24 * 60 * 60 * 1000;

    const thisWeek: Activity[] = [];
    const nextWeek: Activity[] = [];
    const later: Activity[] = [];

    scopedActivities.forEach((act) => {
      const actTime = new Date(act.startsAt).getTime();
      const diff = actTime - now;
      if (diff <= oneWeek) {
        thisWeek.push(act);
      } else if (diff <= twoWeeks) {
        nextWeek.push(act);
      } else {
        later.push(act);
      }
    });

    return { thisWeek, nextWeek, later };
  }, [scopedActivities, scopeTab]);

  // Limit to max 8 items unless expanded
  const visibleActivities = useMemo(() => {
    if (showAll || scopedActivities.length <= 8) {
      return scopedActivities;
    }
    return scopedActivities.slice(0, 8);
  }, [scopedActivities, showAll]);

  // Calendar dates generation (November 2026)
  const calendarDays = useMemo(() => {
    const days = [];
    const baseMonth = '2026-11';
    for (let day = 1; day <= 30; day++) {
      const dateStr = `${baseMonth}-${String(day).padStart(2, '0')}`;
      const dayActivities = activities.filter((a) => a.startsAt.startsWith(dateStr));
      days.push({
        dayNumber: day,
        dateStr,
        hasActivities: dayActivities.length > 0,
        count: dayActivities.length,
      });
    }
    return days;
  }, [activities]);

  const resetFilters = () => {
    setSearch('');
    setSelectedType('all');
    setSelectedArea('all');
    setSelectedDateFilter('all');
    setSelectedRank('all');
    setSelectedCalendarDate(null);
  };

  return (
    <PageShell page="volunteer/activities" signature="TicketCard">
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink-primary leading-tight mt-1">
            Browse volunteer activities
          </h1>
          <p className="font-sans text-[13px] sm:text-sm text-ink-secondary mt-1 max-w-2xl">
            Find community initiatives in your city, join duty rosters, and earn verified service hours.
          </p>
        </div>

        {/* View Switcher: List vs Calendar */}
        <div className="flex items-center gap-1 bg-[#F1F3F6] p-1 rounded-[10px] self-start sm:self-end">
          <button
            onClick={() => {
              setViewMode('list');
              setSelectedCalendarDate(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] font-sans text-[13px] font-medium cursor-pointer transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-ink-primary shadow-[0_1px_2px_rgba(16,24,40,0.06)]'
                : 'text-ink-secondary hover:text-ink-primary'
            } `}
          >
            <ListDashes className="w-4 h-4" weight="bold" />
            <span>List view</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] font-sans text-[13px] font-medium cursor-pointer transition-colors ${
              viewMode === 'calendar'
                ? 'bg-white text-ink-primary shadow-[0_1px_2px_rgba(16,24,40,0.06)]'
                : 'text-ink-secondary hover:text-ink-primary'
            } `}
          >
            <CalendarBlank className="w-4 h-4" weight="bold" />
            <span>Calendar view</span>
          </button>
        </div>
      </div>

      {/* Scope Segmented Control: Upcoming (default), My activities, Past */}
      <div className="flex items-center gap-1 bg-[#F1F3F6] p-1 rounded-[10px] w-fit">
        <button
          type="button"
          onClick={() => {
            setScopeTab('upcoming');
            setShowAll(false);
          }}
          className={`px-4 py-2 rounded-[8px] font-sans text-[13px] font-semibold transition-colors cursor-pointer ${
            scopeTab === 'upcoming'
              ? 'bg-white text-ink-primary shadow-[0_1px_2px_rgba(16,24,40,0.06)]'
              : 'text-ink-secondary hover:text-ink-primary'
          } `}
        >
          Upcoming
        </button>
        <button
          type="button"
          onClick={() => {
            setScopeTab('my');
            setShowAll(false);
          }}
          className={`px-4 py-2 rounded-[8px] font-sans text-[13px] font-semibold transition-colors cursor-pointer ${
            scopeTab === 'my'
              ? 'bg-white text-ink-primary shadow-[0_1px_2px_rgba(16,24,40,0.06)]'
              : 'text-ink-secondary hover:text-ink-primary'
          } `}
        >
          My activities {userEnrollments.length > 0 && `(${userEnrollments.length})`}
        </button>
        <button
          type="button"
          onClick={() => {
            setScopeTab('past');
            setShowAll(false);
          }}
          className={`px-4 py-2 rounded-[8px] font-sans text-[13px] font-semibold transition-colors cursor-pointer ${
            scopeTab === 'past'
              ? 'bg-white text-ink-primary shadow-[0_1px_2px_rgba(16,24,40,0.06)]'
              : 'text-ink-secondary hover:text-ink-primary'
          } `}
        >
          Past
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#F7F8FA] rounded-[16px] p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Input
            placeholder="Search title, place, skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftAddon={<MagnifyingGlass className="w-4 h-4" />}
          />

          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            options={ACTIVITY_TYPES}
          />

          <Select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            options={AREA_OPTIONS}
          />

          <Select
            value={selectedDateFilter}
            onChange={(e) => setSelectedDateFilter(e.target.value)}
            options={DATE_OPTIONS}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[13px]">
          <div className="flex items-center gap-3">
            <span className="font-sans font-medium text-ink-tertiary">Filter by rank:</span>
            <div className="flex flex-wrap gap-1.5">
              {RANK_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedRank(opt.value)}
                  className={`px-2.5 py-1 rounded-[6px] font-sans text-[13px] font-medium cursor-pointer transition-colors ${
                    selectedRank === opt.value
                      ? 'bg-ink-primary text-white'
                      : 'bg-[#F1F3F6] hover:bg-[#E8EBEF] text-ink-secondary'
                  } `}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {(search || selectedType !== 'all' || selectedArea !== 'all' || selectedDateFilter !== 'all' || selectedRank !== 'all' || selectedCalendarDate) && (
            <button
              onClick={resetFilters}
              className="text-[13px] font-medium text-role-teamlead hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" weight="bold" />
              <span>Reset all filters</span>
            </button>
          )}
        </div>
      </div>

      {/* CALENDAR VIEW MODE */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-[16px] shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3">
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-ink-primary">
                Activity calendar: November 2026
              </h3>
              <p className="font-sans text-[13px] text-ink-secondary">
                Click any highlighted date to filter scheduled activities.
              </p>
            </div>
            {selectedCalendarDate && (
              <div className="flex items-center gap-2 bg-[#F1F3F6] px-3 py-1 rounded-[6px]">
                <span className="font-mono text-[13px] font-medium text-ink-primary">
                  Selected: {selectedCalendarDate}
                </span>
                <button
                  onClick={() => setSelectedCalendarDate(null)}
                  className="text-ink-tertiary hover:text-ink-primary cursor-pointer text-[13px] font-medium"
                >
                  Show all &times;
                </button>
              </div>
            )}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 pt-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <div key={d} className="text-center font-sans text-[13px] font-medium text-ink-tertiary pb-1">
                {d}
              </div>
            ))}

            {/* Empty slots for month start (November 2026 starts on Sunday, so 6 empty slots for Mon-first) */}
            {[...Array(6)].map((_, i) => (
              <div key={`empty-${i}`} className="h-16 bg-[#F7F8FA] rounded-[8px] opacity-40" />
            ))}

            {calendarDays.map((d) => {
              const isSelected = selectedCalendarDate === d.dateStr;
              return (
                <button
                  key={d.dateStr}
                  onClick={() => setSelectedCalendarDate(isSelected ? null : d.dateStr)}
                  className={`h-16 rounded-[8px] p-1.5 flex flex-col justify-between text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-role-volunteerLight ring-2 ring-role-volunteer'
                      : d.hasActivities
                      ? 'bg-white hover:bg-[#F7F8FA] shadow-[0_1px_2px_rgba(16,24,40,0.04)]'
                      : 'bg-[#F7F8FA] text-ink-tertiary'
                  } `}
                >
                  <span className="font-mono text-[13px] font-medium">{d.dayNumber}</span>
                  {d.hasActivities && (
                    <div className="flex items-center gap-1 font-mono text-[13px] font-medium text-white bg-role-volunteer px-1.5 py-0.5 rounded-[4px] self-start">
                      <span>{d.count} session{d.count > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ACTIVITIES LIST VIEW */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rect" className="h-28 rounded-[16px]" />
          ))}
        </div>
      ) : scopedActivities.length === 0 ? (
        <EmptyState
          icon={<CalendarIcon className="w-8 h-8 text-ink-secondary" weight="bold" />}
          title={
            scopeTab === 'my'
              ? 'No joined activities'
              : scopeTab === 'past'
              ? 'No past completed activities'
              : 'No activities match your filters'
          }
          description={
            scopeTab === 'my'
              ? 'Browse upcoming opportunities and enroll in an activity to join a duty roster.'
              : 'Try broadening your city or activity type selections to explore more open opportunities.'
          }
          actionLabel="Reset filters"
          onAction={resetFilters}
        />
      ) : (
        <div className="space-y-6">
          {scopeTab === 'upcoming' && groupedUpcoming ? (
            <div className="space-y-8">
              {/* Group 1: This week */}
              {groupedUpcoming.thisWeek.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-display text-xl font-bold text-ink-primary">
                    This week
                  </h3>
                  <div className="space-y-3">
                    {groupedUpcoming.thisWeek
                      .filter((act) => visibleActivities.some((v) => v.id === act.id))
                      .map((act) => renderActivityCard(act))}
                  </div>
                </div>
              )}

              {/* Group 2: Next week */}
              {groupedUpcoming.nextWeek.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-display text-xl font-bold text-ink-primary">
                    Next week
                  </h3>
                  <div className="space-y-3">
                    {groupedUpcoming.nextWeek
                      .filter((act) => visibleActivities.some((v) => v.id === act.id))
                      .map((act) => renderActivityCard(act))}
                  </div>
                </div>
              )}

              {/* Group 3: Later */}
              {groupedUpcoming.later.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-display text-xl font-bold text-ink-primary">
                    Later
                  </h3>
                  <div className="space-y-3">
                    {groupedUpcoming.later
                      .filter((act) => visibleActivities.some((v) => v.id === act.id))
                      .map((act) => renderActivityCard(act))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {visibleActivities.map((act) => renderActivityCard(act))}
            </div>
          )}

          {/* Show more button if over 8 items */}
          {scopedActivities.length > 8 && !showAll && (
            <div className="pt-2 text-center">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setShowAll(true)}
              >
                Show all {scopedActivities.length} activities
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
    </PageShell>
  );

  function renderActivityCard(act: Activity) {
    const isEnrolled = userEnrollments.includes(act.id);
    return (
      <TicketCard
        key={act.id}
        activity={act}
        enrolledStatus={isEnrolled ? 'Enrolled' : undefined}
      />
    );
  }
};
