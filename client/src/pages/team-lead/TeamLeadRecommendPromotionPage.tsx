import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { VolunteerProfile, Rank } from '../../types';
import { Input, Select, Button, Skeleton } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { ChartLineUp, ArrowRight, Star, ShieldCheck, Warning } from '@phosphor-icons/react';

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
          // Default to Dawit or Selam if available
          const preferred = profiles.find((p) => p.fullName.includes('Dawit') || p.fullName.includes('Selam'));
          const chosen = preferred || profiles[0];
          setSelectedUserId(chosen.userId);
          setTargetRank(chosen.rank === 'senior_member' ? 'team_lead' : 'senior_member');
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
      {/* Header */}
      <div className="border-b-2 border-border pb-5">
        <span className="font-sans text-xs font-bold text-role-teamlead uppercase tracking-tight block">
          Advancement Nominations
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-ink-primary leading-none mt-1">
          Recommend Volunteer for Promotion
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink-secondary mt-1">
          Team Leads may nominate dedicated volunteers who exhibit exemplary civic reliability and initiative before normal thresholds.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-2 border-ink-primary bg-white p-6 sm:p-8 space-y-6 shadow-ticket text-left"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
        }}
      >
        {errorMsg && (
          <div className="p-3 border-2 border-role-teamlead bg-role-teamleadLight text-role-teamlead text-xs font-sans font-bold flex items-center gap-2">
            <Warning className="w-4 h-4 shrink-0" weight="bold" />
            <span>{errorMsg}</span>
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
              label: `${v.fullName} (Current: ${v.rank?.replace('_', ' ').toUpperCase() || 'MEMBER'})`,
            }))}
            required
          />

          {selectedVol && (
            <div className="p-3 bg-canvas border-2 border-ink-primary text-xs font-mono text-ink-secondary space-y-1">
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
            <label className="block text-xs font-bold uppercase text-ink-primary">
              Justification & Performance Evidence
            </label>
            <textarea
              rows={4}
              value={recommendationNote}
              onChange={(e) => setRecommendationNote(e.target.value)}
              placeholder="State specific community activities, leadership reliability, and evidence of exemplary performance..."
              className="w-full bg-canvas text-ink-primary font-sans text-xs border-2 border-ink-primary p-2.5 focus:outline-none focus:ring-2 focus:ring-role-teamlead"
              required
            />
          </div>
        </div>

        <div className="pt-4 border-t-2 border-border flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            leftIcon={<ChartLineUp className="w-4 h-4" weight="bold" />}
          >
            Submit Promotion Recommendation
          </Button>
        </div>
      </form>
    </div>
  );
};
