import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Activity, Enrollment, VolunteerProfile } from '../../types';
import { Select, Button, Skeleton, StatusMark } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { Star, CheckCircle, UserCircle } from '@phosphor-icons/react';

export const TeamLeadRatingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState('');
  const [volunteers, setVolunteers] = useState<VolunteerProfile[]>([]);
  const [ratingsMap, setRatingsMap] = useState<Record<string, { score: number; note: string; saved?: boolean }>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const acts = await api.getAllActivities();
        const myActs = acts.filter((a) => a.leadId === user.id);
        setActivities(myActs);
        if (myActs.length > 0) {
          setSelectedActivityId(myActs[0].id);
        }

        const volList = await api.getAllVolunteers();
        setVolunteers(volList.map((v) => v.profile));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user]);

  const handleScoreChange = (userId: string, score: number) => {
    setRatingsMap((prev) => ({
      ...prev,
      [userId]: { ...(prev[userId] || { note: '' }), score },
    }));
  };

  const handleNoteChange = (userId: string, note: string) => {
    setRatingsMap((prev) => ({
      ...prev,
      [userId]: { ...(prev[userId] || { score: 5 }), note },
    }));
  };

  const handleSaveRating = async (userId: string) => {
    if (!user || !selectedActivityId) return;
    const r = ratingsMap[userId] || { score: 5, note: '' };

    setIsSubmitting(true);
    try {
      await api.submitRating(selectedActivityId, userId, user.id, r.score, r.note);
      setRatingsMap((prev) => ({
        ...prev,
        [userId]: { ...r, saved: true },
      }));
      toast.success('Performance evaluation recorded.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="rect" className="h-64" />
      </div>
    );
  }

  // Sample roster for selected activity: 4 volunteers
  const sampleRoster = volunteers.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-border pb-5 space-y-1">
        <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary block">
          MERIT EVALUATION
        </span>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-primary">
          Rate Volunteer Attendance & Conduct
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink-secondary">
          Evaluate participant work from 1 to 5 stars. High evaluations directly build volunteer rank progression.
        </p>
      </div>

      <div className="max-w-md">
        <Select
          label="Select Activity Assignment"
          value={selectedActivityId}
          onChange={(e) => setSelectedActivityId(e.target.value)}
          options={activities.map((a) => ({
            value: a.id,
            label: `${a.title} (${a.area})`,
          }))}
        />
      </div>

      <div className="border border-border bg-canvas-raised divide-y divide-border">
        {sampleRoster.map((vol) => {
          const currentRating = ratingsMap[vol.userId] || { score: 5, note: '', saved: false };
          return (
            <div key={vol.userId} className="p-5 md:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <UserCircle className="w-8 h-8 text-ink-secondary" />
                  <div>
                    <h4 className="font-sans text-base font-bold text-ink-primary">
                      {vol.fullName}
                    </h4>
                    <span className="font-mono text-xs text-ink-tertiary">
                      {vol.volunteerNumber} • Rank: {vol.rank?.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Star Picker */}
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleScoreChange(vol.userId, star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                      title={`${star} stars`}
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= currentRating.score
                            ? 'text-civic-gold'
                            : 'text-border'
                        }`}
                        weight={star <= currentRating.score ? 'fill' : 'regular'}
                      />
                    </button>
                  ))}
                  <span className="font-mono text-xs font-bold text-ink-primary ml-2">
                    {currentRating.score}.0
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  placeholder="Optional note on reliability, leadership, or teamwork..."
                  value={currentRating.note}
                  onChange={(e) => handleNoteChange(vol.userId, e.target.value)}
                  className="w-full bg-canvas-subdued text-ink-primary font-sans text-xs rounded border border-border py-2 px-3 focus:border-ink-primary focus:ring-1 focus:ring-ink-primary outline-none"
                />
                <Button
                  variant={currentRating.saved ? 'secondary' : 'primary'}
                  size="sm"
                  isLoading={isSubmitting}
                  onClick={() => handleSaveRating(vol.userId)}
                  className="shrink-0"
                >
                  {currentRating.saved ? 'Saved ✓' : 'Submit Rating'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
