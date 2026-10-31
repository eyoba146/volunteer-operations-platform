import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Activity } from '../../types';
import { Button, StatusMark, Skeleton, EmptyState } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { Plus, Calendar, Clock, MapPin, UsersThree, QrCode, CheckCircle } from '@phosphor-icons/react';

export const TeamLeadActivitiesPage: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handleMarkComplete = async (activityId: string) => {
    if (!window.confirm('Mark this activity as completed?')) return;
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
        <Skeleton variant="row" className="h-28" />
        <Skeleton variant="row" className="h-28" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-border pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary block">
            FIELD MANAGEMENT
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-primary">
            Activities Under My Leadership
          </h1>
          <p className="font-sans text-xs sm:text-sm text-ink-secondary">
            Manage your assignments, view live check-in codes, inspect participant rosters, and close completed sessions.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => navigate('/team-lead/create-activity')}
        >
          Create New Activity
        </Button>
      </div>

      {activities.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-6 h-6" />}
          title="No activities created yet"
          description="Create your first volunteer assignment to begin recruiting squad members."
          actionLabel="Create an Activity"
          onAction={() => navigate('/team-lead/create-activity')}
        />
      ) : (
        <div className="border border-border bg-canvas-raised divide-y divide-border">
          {activities.map((act) => (
            <div
              key={act.id}
              className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-canvas-subdued/40 transition-colors"
            >
              <div className="space-y-2.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-canvas-subdued border border-border text-ink-secondary">
                    {act.type.replace('_', ' ')}
                  </span>
                  <StatusMark status={act.status} size="sm" />
                </div>

                <h3 className="font-serif text-xl font-bold text-ink-primary">
                  {act.title}
                </h3>

                <p className="font-sans text-xs text-ink-secondary line-clamp-2 max-w-2xl leading-relaxed">
                  {act.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-ink-tertiary pt-1">
                  <span className="flex items-center gap-1.5 text-ink-secondary">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {new Date(act.startsAt).toLocaleDateString()} (
                      {new Date(act.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                      {new Date(act.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                    </span>
                  </span>

                  <span className="flex items-center gap-1.5 text-ink-secondary">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{act.place}, {act.area}</span>
                  </span>

                  <span className="flex items-center gap-1.5 text-ink-secondary">
                    <UsersThree className="w-3.5 h-3.5" />
                    <span>Capacity: {act.capacity} volunteers</span>
                  </span>
                </div>
              </div>

              {/* Check-In Code Badge & Lead Actions */}
              <div className="shrink-0 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="border border-border bg-canvas-subdued p-3 text-center min-w-[120px]">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-ink-tertiary block">
                    Session Code
                  </span>
                  <span className="font-mono text-xl font-extrabold text-civic-green tracking-widest block">
                    {act.checkInCode}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {act.status !== 'completed' && act.status !== 'cancelled' && (
                    <Button
                      variant="primary"
                      size="sm"
                      isLoading={isUpdating}
                      onClick={() => handleMarkComplete(act.id)}
                      leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                    >
                      Mark Completed
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate('/team-lead/ratings')}
                  >
                    Rate Roster
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

