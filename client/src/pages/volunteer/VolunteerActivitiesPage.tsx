import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as api from '../../api';
import { Activity, ActivityType, ActivityStatus } from '../../types';
import { Input, Select, Button, StatusMark, Skeleton } from '../../components/ui';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  UsersThree, 
  MagnifyingGlass, 
  Plus, 
  ArrowRight,
  ShieldCheck 
} from '@phosphor-icons/react';

const ACTIVITY_TYPES: { value: ActivityType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Activity Types' },
  { value: 'field_task', label: 'Field Task (Community Service)' },
  { value: 'event', label: 'Civic Event / Marshalling' },
  { value: 'project', label: 'Special Project / Workshop' },
  { value: 'shift', label: 'Logistics / Clinic Shift' },
  { value: 'training', label: 'Qualification Training' },
];

const AREA_OPTIONS = [
  { value: 'all', label: 'All Operational Cities' },
  { value: 'Addis Ababa', label: 'Addis Ababa' },
  { value: 'Adama', label: 'Adama' },
  { value: 'Bishoftu', label: 'Bishoftu' },
  { value: 'Hawassa', label: 'Hawassa' },
  { value: 'Bahir Dar', label: 'Bahir Dar' },
];

export const VolunteerActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<ActivityType | 'all'>('all');
  const [selectedArea, setSelectedArea] = useState('all');
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

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-border pb-5 space-y-1">
        <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary block">
          CIVIC SERVICE ROSTER
        </span>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-primary">
          Volunteer Activities & Field Assignments
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink-secondary">
          Browse upcoming civic actions across Ethiopia, sign up for duty rosters, and earn verifiable service credit.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="border border-border bg-canvas-raised p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            placeholder="Search activity title, venue, or keywords..."
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
        </div>
      </div>

      {/* Activity Index Stream */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="row" className="h-24" />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="border border-border bg-canvas-raised p-12 text-center text-sm font-sans text-ink-tertiary">
          No activities match your selected filter criteria.
        </div>
      ) : (
        <div className="border border-border bg-canvas-raised divide-y divide-border">
          {activities.map((act) => (
            <div
              key={act.id}
              className="p-5 md:p-6 transition-colors hover:bg-canvas-subdued/40 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-canvas-subdued border border-border text-ink-secondary">
                    {act.type.replace('_', ' ')}
                  </span>
                  <StatusMark status={act.status} size="sm" />
                  {act.minRank && (
                    <span className="font-mono text-[10px] text-ink-tertiary">
                      Requires: <strong className="text-ink-primary uppercase">{act.minRank.replace('_', ' ')}</strong>
                    </span>
                  )}
                </div>

                <Link
                  to={`/volunteer/activities/${act.id}`}
                  className="font-serif text-lg md:text-xl font-bold text-ink-primary hover:underline block leading-snug"
                >
                  {act.title}
                </Link>

                <p className="font-sans text-xs text-ink-secondary leading-relaxed line-clamp-2 max-w-2xl">
                  {act.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-ink-tertiary pt-1">
                  <span className="flex items-center gap-1.5 text-ink-secondary">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {new Date(act.startsAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </span>

                  <span className="flex items-center gap-1.5 text-ink-secondary">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{act.place}, {act.area}</span>
                  </span>

                  <span className="flex items-center gap-1.5 text-ink-secondary">
                    <UsersThree className="w-3.5 h-3.5" />
                    <span>Capacity: {act.capacity} spots</span>
                  </span>

                  {act.leadName && (
                    <span className="text-ink-tertiary">
                      Lead: <strong className="text-ink-primary">{act.leadName}</strong>
                    </span>
                  )}
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/volunteer/activities/${act.id}`)}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
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

