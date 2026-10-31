import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { VolunteerProfile, Rank } from '../../types';
import { Input, Select, Button, Skeleton } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { ChartLineUp, ArrowRight, Star, ShieldCheck } from '@phosphor-icons/react';

export const TeamLeadRecommendPromotionPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [volunteers, setVolunteers] = useState<VolunteerProfile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [targetRank, setTargetRank] = useState<Rank>('senior_member');
  const [recommendationNote, setRecommendationNote] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const list = await api.getAllVolunteers();
        const profiles = list.map((l) => l.profile);
        setVolunteers(profiles);
        if (profiles.length > 0) {
          // default to Selam Alemu or first
          const selam = profiles.find((p) => p.fullName.includes('Selam'));
          setSelectedUserId(selam?.userId || profiles[0].userId);
          setTargetRank('team_lead');
          setRecommendationNote(
            'Demonstrated remarkable field coordination and safety leadership during multiple regional missions. Exceeds all required hours and maintains stellar ratings.'
          );
        }
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user || !selectedUserId || !recommendationNote.trim()) {
      setErrorMsg('Please select a volunteer and provide detailed justification for promotion.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.recommendPromotion(
        selectedUserId,
        targetRank,
        recommendationNote.trim(),
        user.id,
        profile?.fullName || user.username
      );
      toast.success('Promotion recommendation officially submitted to Program Manager.');
      navigate('/team-lead/home');
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not submit recommendation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedVol = volunteers.find((v) => v.userId === selectedUserId);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="rect" className="h-96" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="border-b border-border pb-5 space-y-1">
        <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary block">
          MERIT NOMINATIONS
        </span>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-primary">
          Recommend Volunteer for Promotion
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink-secondary">
          Team Leads may nominate dedicated volunteers who exhibit exemplary civic reliability and initiative.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="border border-border bg-canvas-raised p-6 md:p-8 space-y-6 shadow-subtle text-left">
        {errorMsg && (
          <div className="p-3 border border-civic-rust bg-civic-rustLight text-civic-rust text-xs leading-normal font-sans">
            {errorMsg}
          </div>
        )}

        <div className="space-y-4">
          <Select
            label="Candidate Volunteer"
            value={selectedUserId}
            onChange={(e) => {
              setSelectedUserId(e.target.value);
              const v = volunteers.find((item) => item.userId === e.target.value);
              if (v?.rank === 'senior_member') setTargetRank('team_lead');
              else setTargetRank('senior_member');
            }}
            options={volunteers.map((v) => ({
              value: v.userId,
              label: `${v.fullName} (Current: ${v.rank?.replace('_', ' ') || 'member'})`,
            }))}
            required
          />

          {selectedVol && (
            <div className="p-3 bg-canvas-subdued border border-border text-xs font-mono text-ink-secondary space-y-1">
              <div>Region: <strong className="text-ink-primary font-sans">{selectedVol.area}</strong></div>
              <div>Volunteer Number: <strong className="text-ink-primary">{selectedVol.volunteerNumber}</strong></div>
            </div>
          )}

          <Select
            label="Target Rank for Promotion"
            value={targetRank}
            onChange={(e) => setTargetRank(e.target.value as Rank)}
            options={[
              { value: 'senior_member', label: 'Senior Member' },
              { value: 'team_lead', label: 'Team Lead' },
            ]}
            required
          />

          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-secondary">
              Written Recommendation & Justification (Required)
            </label>
            <textarea
              rows={5}
              value={recommendationNote}
              onChange={(e) => setRecommendationNote(e.target.value)}
              placeholder="Cite specific assignments, demonstrated leadership qualities, and reasons why this candidate is ready for elevated responsibilities..."
              className="w-full bg-canvas-raised text-ink-primary font-sans text-sm rounded border border-border p-3 focus:border-ink-primary focus:ring-1 focus:ring-ink-primary outline-none"
              required
            />
          </div>
        </div>

        <div className="pt-4 border-t border-border flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/team-lead/home')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Submit Recommendation to Manager
          </Button>
        </div>
      </form>
    </div>
  );
};

