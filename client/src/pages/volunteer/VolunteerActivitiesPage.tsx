import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as api from '../../api';
import { Activity, ActivityType } from '../../types';
import { Input, Select, Button, StatusMark, Skeleton, EmptyState } from '../../components/ui';
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
  { value: 'member', label: 'Member' },
  { value: 'senior_member', label: 'Senior member' },
  { value: 'team_lead', label: 'Team lead' },
];

export const VolunteerActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<ActivityType | 'all'>('all');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [selectedRank, setSelectedRank] = useState('all');
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

  // Client-side date and rank filter
  const filteredActivities = useMemo(() => {
    let result = activities;

    if (selectedRank !== 'all') {
      result = result.filter((a) => !a.minRank || a.minRank === selectedRank);
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
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="border-b border-[#D5DAE1] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="font-sans text-[13px] font-semibold text-role-volunteer block">
            Field roster & assignments
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink-primary leading-tight mt-1">
            Browse volunteer activities
          </h1>
          <p className="font-sans text-[13px] sm:text-sm text-ink-secondary mt-1 max-w-2xl">
            Find community initiatives in your city, join duty rosters, and earn verified service hours.
          </p>
        </div>

        {/* View Switcher: List vs Calendar */}
        <div className="flex items-center gap-1 bg-canvas-subdued/40 p-1 border border-[#D5DAE1] rounded-[8px] self-start sm:self-end">
          <button
            onClick={() => {
              setViewMode('list');
              setSelectedCalendarDate(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] font-sans text-[13px] font-medium cursor-pointer transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-ink-primary shadow-sm border border-[#D5DAE1]'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            <ListDashes className="w-4 h-4" weight="bold" />
            <span>List view</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] font-sans text-[13px] font-medium cursor-pointer transition-colors ${
              viewMode === 'calendar'
                ? 'bg-white text-ink-primary shadow-sm border border-[#D5DAE1]'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            <CalendarBlank className="w-4 h-4" weight="bold" />
            <span>Calendar view</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="border border-[#D5DAE1] rounded-[10px] bg-white p-4 shadow-sm space-y-3">
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

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#D5DAE1] text-[13px]">
          <div className="flex items-center gap-3">
            <span className="font-sans font-medium text-ink-tertiary">Filter by rank:</span>
            <div className="flex flex-wrap gap-1.5">
              {RANK_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedRank(opt.value)}
                  className={`px-2.5 py-1 rounded-[6px] font-sans text-[13px] font-medium cursor-pointer border transition-colors ${
                    selectedRank === opt.value
                      ? 'border-role-volunteer bg-role-volunteer text-white'
                      : 'border-[#D5DAE1] bg-white hover:border-ink-secondary text-ink-secondary'
                  }`}
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
        <div className="border border-[#D5DAE1] rounded-[10px] bg-white p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D5DAE1] pb-3">
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-ink-primary">
                Activity calendar: November 2026
              </h3>
              <p className="font-sans text-[13px] text-ink-secondary">
                Click any highlighted date to filter scheduled activities.
              </p>
            </div>
            {selectedCalendarDate && (
              <div className="flex items-center gap-2 bg-canvas-subdued/50 px-3 py-1 border border-[#D5DAE1] rounded-[6px]">
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
              <div key={`empty-${i}`} className="h-16 bg-canvas-subdued/20 border border-[#D5DAE1]/40 rounded-[6px] opacity-40" />
            ))}

            {calendarDays.map((d) => {
              const isSelected = selectedCalendarDate === d.dateStr;
              return (
                <button
                  key={d.dateStr}
                  onClick={() => setSelectedCalendarDate(isSelected ? null : d.dateStr)}
                  className={`h-16 border rounded-[6px] p-1.5 flex flex-col justify-between text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-role-volunteer bg-role-volunteerLight/30 ring-2 ring-role-volunteer'
                      : d.hasActivities
                      ? 'border-[#D5DAE1] bg-white hover:bg-canvas-subdued/20'
                      : 'border-[#D5DAE1]/50 bg-canvas-subdued/10 text-ink-tertiary'
                  }`}
                >
                  <span className="font-mono text-[13px] font-medium">{d.dayNumber}</span>
                  {d.hasActivities && (
                    <div className="flex items-center gap-1 font-mono text-[12px] font-medium text-white bg-role-volunteer px-1.5 py-0.5 rounded-[4px] self-start">
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
            <Skeleton key={i} variant="rect" className="h-28 rounded-[10px]" />
          ))}
        </div>
      ) : filteredActivities.length === 0 ? (
        <EmptyState
          icon={<CalendarIcon className="w-8 h-8 text-ink-secondary" weight="bold" />}
          title="No activities match your filters"
          description="Try broadening your city or activity type selections to explore more open opportunities."
          actionLabel="Reset filters"
          onAction={resetFilters}
        />
      ) : (
        <div className="space-y-4">
          {filteredActivities.map((act) => (
            <div
              key={act.id}
              className="border border-[#D5DAE1] rounded-[10px] bg-white p-5 sm:p-6 shadow-sm hover:border-ink-secondary transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[13px] font-medium px-2 py-0.5 bg-canvas-subdued/50 border border-[#D5DAE1] rounded-[4px] text-ink-primary">
                    {act.type.replace('_', ' ')}
                  </span>
                  <StatusMark status={act.status} size="sm" />
                  {act.minRank && (
                    <span className="font-mono text-[13px] text-ink-tertiary flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-role-volunteer" weight="bold" />
                      <span>{act.minRank.replace('_', ' ')} required</span>
                    </span>
                  )}
                </div>

                <Link
                  to={`/volunteer/activities/${act.id}`}
                  className="font-display text-xl sm:text-2xl font-bold text-ink-primary hover:text-role-volunteer transition-colors block leading-tight"
                >
                  {act.title}
                </Link>

                <p className="font-sans text-[13px] sm:text-sm text-ink-secondary line-clamp-2 max-w-3xl leading-relaxed">
                  {act.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-[13px] font-mono text-ink-secondary pt-1">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-ink-tertiary" />
                    <span>
                      {new Date(act.startsAt).toLocaleString('en-US', {
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
                    <span>{act.place}, {act.area}</span>
                  </span>

                  <span className="flex items-center gap-1.5">
                    <UsersThree className="w-4 h-4 text-ink-tertiary" />
                    <span>Capacity: <strong>{act.capacity} volunteers</strong></span>
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#D5DAE1] flex items-center justify-end">
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" weight="bold" />}
                  onClick={() => navigate(`/volunteer/activities/${act.id}`)}
                >
                  View details & join
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
