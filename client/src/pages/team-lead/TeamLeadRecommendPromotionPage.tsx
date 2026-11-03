import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { VolunteerProfile, Rank } from '../../types';
import { Select, Button, Skeleton } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { formatRank } from '../../utils/format';
import { ChartLineUp, Warning } from '@phosphor-icons/react';

export const TeamLeadRecommendPromotionPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [volunteers, setVolunteers] = useState<VolunteerProfile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [targetRank, setTargetRank] = useState<Rank>('senior_volunteer');
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
          // Default to Dawit or Selam if available
          const preferred = profiles.find((p) => p.fullName.includes('Dawit') || p.fullName.includes('Selam'));
          const chosen = preferred || profiles[0];
          setSelectedUserId(chosen.userId);
          setTargetRank(chosen.rank === 'senior_volunteer' || chosen.rank === 'senior_member' ? 'team_lead' : 'senior_volunteer');
          setRecommendationNote(
            'Demonstrated remarkable reliability, initiative, and team safety awareness during multiple community field missions.'
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
      toast.success('Promotion recommendation submitted to Program Manager.');
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
        <Skeleton variant="rect" className="h-96 rounded-[10px]" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-4">
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink-primary leading-tight mt-1">
          Recommend volunteer for promotion
        </h1>
        <p className="font-sans text-[13px] sm:text-sm text-ink-secondary mt-1">
          Team Leads may nominate dedicated volunteers who exhibit exemplary community reliability and initiative before normal thresholds.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-[10px] bg-white p-6 sm:p-8 space-y-6 shadow-sm text-left"
      >
        {errorMsg && (
          <div className="p-3 rounded-[8px] bg-role-teamleadLight/20 text-role-teamlead text-[13px] font-sans font-medium flex items-center gap-2">
            <Warning className="w-4 h-4 shrink-0" weight="bold" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="space-y-4">
          <Select
            label="Candidate volunteer"
            value={selectedUserId}
            onChange={(e) => {
              setSelectedUserId(e.target.value);
              const v = volunteers.find((item) => item.userId === e.target.value);
              if (v?.rank === 'senior_volunteer' || v?.rank === 'senior_member') setTargetRank('team_lead');
              else setTargetRank('senior_volunteer');
            }}
            options={volunteers.map((v) => ({
              value: v.userId,
              label: `${v.fullName} (Current: ${formatRank(v.rank)})`,
            }))}
            required
          />

          {selectedVol && (
            <div className="p-3 bg-canvas-subdued/30 rounded-[8px] text-[13px] font-mono text-ink-secondary space-y-1">
              <div>Area: <strong className="text-ink-primary font-sans">{selectedVol.area}</strong></div>
              <div>Volunteer number: <strong className="text-ink-primary">{selectedVol.volunteerNumber}</strong></div>
            </div>
          )}

          <Select
            label="Target rank for promotion"
            value={targetRank}
            onChange={(e) => setTargetRank(e.target.value as Rank)}
            options={[
              { value: 'senior_volunteer', label: 'Senior volunteer' },
              { value: 'team_lead', label: 'Team lead' },
            ]}
            required
          />

          <div className="space-y-1.5 text-left">
            <label className="block text-[13px] font-medium text-ink-primary">
              Justification & performance evidence
            </label>
            <textarea
              rows={4}
              value={recommendationNote}
              onChange={(e) => setRecommendationNote(e.target.value)}
              placeholder="State specific community activities, leadership reliability, and evidence of exemplary performance..."
              className="w-full bg-white text-ink-primary font-sans text-[13px] rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-role-teamlead"
              required
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            leftIcon={<ChartLineUp className="w-4 h-4" weight="bold" />}
          >
            Submit promotion recommendation
          </Button>
        </div>
      </form>
    </div>
  );
};
