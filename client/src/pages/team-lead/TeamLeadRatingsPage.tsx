import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Activity, Enrollment, VolunteerProfile } from '../../types';
import { Select, Button, Skeleton, EmptyState } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { Star, CheckCircle, UserCircle, FloppyDisk } from '@phosphor-icons/react';

export const TeamLeadRatingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState('');
  const [activityEnrollments, setActivityEnrollments] = useState<Enrollment[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerProfile[]>([]);
  const [ratingsMap, setRatingsMap] = useState<Record<string, { score: number; note: string; saved?: boolean }>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();

  useEffect(() => {
    const loadInitial = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const [acts, volList] = await Promise.all([
          api.getAllActivities(),
          api.getAllVolunteers(),
        ]);
        const myActs = acts.filter((a) => a.leadId === user.id);
        setActivities(myActs);
        setVolunteers(volList.map((v) => v.profile));

        if (myActs.length > 0) {
          setSelectedActivityId(myActs[0].id);
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadInitial();
  }, [user]);

  // Load enrollments for selected activity
  useEffect(() => {
    const loadEnrollments = async () => {
      if (!selectedActivityId) return;
      try {
        const enrs = await api.getEnrollmentsForActivity(selectedActivityId);
        setActivityEnrollments(enrs);
      } catch (err) {
        console.error('Error loading enrollments', err);
      }
    };
    loadEnrollments();
  }, [selectedActivityId]);

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
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="rect" className="h-64 rounded-[10px]" />
      </div>
    );
  }

  // Find volunteers enrolled in this activity
  const enrolledUserIds = activityEnrollments.map((e) => e.userId);
  const enrolledProfiles = volunteers.filter((v) => enrolledUserIds.includes(v.userId));

  // Fallback: If no enrollments exist in mock data for this activity, show available volunteers
  const displayedVolunteers = enrolledProfiles.length > 0 ? enrolledProfiles : volunteers.slice(0, 3);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="border-b border-[#D5DAE1] pb-4">
        <span className="font-sans text-[13px] font-semibold text-role-teamlead block">
          Volunteer evaluations
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink-primary leading-tight mt-1">
          Rate volunteer performance
        </h1>
        <p className="font-sans text-[13px] sm:text-sm text-ink-secondary mt-1">
          Evaluate participant attendance, discipline, and initiative (1 to 5 stars). High ratings build rank advancement eligibility.
        </p>
      </div>

      {/* Select Activity */}
      <div className="max-w-md">
        <Select
          label="Select activity assignment"
          value={selectedActivityId}
          onChange={(e) => setSelectedActivityId(e.target.value)}
          options={activities.map((a) => ({
            value: a.id,
            label: `${a.title} (${a.area})`,
          }))}
        />
      </div>

      {/* Volunteer Ratings List */}
      {displayedVolunteers.length === 0 ? (
        <EmptyState
          icon={<Star className="w-8 h-8 text-ink-secondary" weight="bold" />}
          title="No volunteers enrolled"
          description="Volunteers who enroll or check in to this activity will appear here for evaluation."
        />
      ) : (
        <div className="border border-[#D5DAE1] rounded-[10px] bg-white shadow-sm divide-y divide-[#D5DAE1] overflow-hidden">
          {displayedVolunteers.map((vol) => {
            const currentRating = ratingsMap[vol.userId] || { score: 5, note: '', saved: false };
            return (
              <div key={vol.userId} className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <UserCircle className="w-10 h-10 text-ink-secondary" />
                    <div>
                      <h4 className="font-display text-xl sm:text-2xl font-bold text-ink-primary leading-tight">
                        {vol.fullName}
                      </h4>
                      <span className="font-mono text-[13px] text-ink-secondary">
                        ID: {vol.volunteerNumber} • Rank: {vol.rank?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* 1-5 Star Picker */}
                  <div className="flex items-center gap-1.5 bg-canvas-subdued/40 px-3 py-1.5 border border-[#D5DAE1] rounded-[8px] self-start sm:self-auto">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleScoreChange(vol.userId, star)}
                        className="p-1 cursor-pointer transition-transform hover:scale-125"
                        title={`${star} stars`}
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= currentRating.score
                              ? 'text-role-applicant fill-role-applicant'
                              : 'text-border'
                          }`}
                          weight={star <= currentRating.score ? 'fill' : 'regular'}
                        />
                      </button>
                    ))}
                    <span className="font-mono text-[13px] font-bold text-ink-primary pl-2">
                      {currentRating.score}.0
                    </span>
                  </div>
                </div>

                {/* Optional Note & Submit Row */}
                <div className="flex flex-col sm:flex-row items-end gap-3 pt-2">
                  <div className="w-full sm:flex-1 space-y-1">
                    <label className="block text-[13px] font-medium text-ink-tertiary">
                      Performance feedback (optional)
                    </label>
                    <input
                      type="text"
                      value={currentRating.note}
                      onChange={(e) => handleNoteChange(vol.userId, e.target.value)}
                      placeholder="e.g. Exhibited strong field initiative; assisted arriving community members promptly."
                      className="w-full bg-white text-ink-primary font-sans text-[13px] border-[1.5px] border-[#475569] rounded-[8px] p-2 focus:border-ink-primary focus:outline-none"
                    />
                  </div>

                  <Button
                    variant={currentRating.saved ? 'secondary' : 'primary'}
                    size="sm"
                    className="shrink-0"
                    leftIcon={currentRating.saved ? <CheckCircle className="w-4 h-4 text-role-volunteer" weight="fill" /> : <FloppyDisk className="w-4 h-4" weight="bold" />}
                    onClick={() => handleSaveRating(vol.userId)}
                    isLoading={isSubmitting}
                  >
                    {currentRating.saved ? 'Score saved' : 'Save rating'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
