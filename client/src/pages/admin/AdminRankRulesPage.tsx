import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { RankRule, Rank } from '../../types';
import { Input, Button, StatusMark, Skeleton } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { FloppyDisk, ArrowLeft, ChartLineUp, ShieldCheck, Lightning } from '@phosphor-icons/react';

export const AdminRankRulesPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [rules, setRules] = useState<RankRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingRank, setSavingRank] = useState<Rank | null>(null);

  const navigate = useNavigate();
  const toast = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const list = await api.getRankRules();
      setRules(list);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFieldChange = (rank: Rank, field: keyof RankRule, val: any) => {
    setRules((prev) =>
      prev.map((r) => (r.rank === rank ? { ...r, [field]: val } : r))
    );
  };

  const handleSaveRank = async (rule: RankRule) => {
    if (!user) return;
    setSavingRank(rule.rank);
    try {
      await api.updateRankRule(rule.rank, rule, user.id, profile?.fullName || user.username);
      toast.success(
        `Thresholds for ${rule.rank.replace('_', ' ')} updated. Volunteer progress meters recalculate automatically.`
      );
    } catch (err: any) {
      toast.error(err.message || 'Could not save rank rule.');
    } finally {
      setSavingRank(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="rect" className="h-48" />
        <Skeleton variant="rect" className="h-48" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      <button
        onClick={() => navigate('/admin/overview')}
        className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-ink-tertiary hover:text-ink-primary transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to administration overview</span>
      </button>

      {/* Header */}
      <div
        className="border-4 border-ink-primary bg-white p-6 sm:p-8 space-y-4 shadow-ticket"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-ink-primary pb-5">
          <div className="space-y-1">
            <span className="font-sans text-xs font-bold text-amber-600 tracking-tight block">
              Merit Ladder Calibration
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tight text-ink-primary leading-none">
              Rank Progression Rules
            </h1>
            <p className="font-sans text-xs sm:text-sm text-ink-secondary mt-1">
              Configure minimum verified service hours, completed activities, leader ratings, and required training courses.
            </p>
          </div>
        </div>

        {/* Live recalculation callout */}
        <div className="p-3 bg-emerald-50 border-2 border-emerald-300 flex items-center gap-3 text-xs text-emerald-900 font-sans">
          <Lightning className="w-5 h-5 text-emerald-600 shrink-0" weight="fill" />
          <span>
            <strong>Live Rules Engine:</strong> Any change saved below immediately recalculates volunteer rank progress routes, percentage completion bars, and Manager promotion board eligibility across the entire platform in real time.
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {rules.map((rule) => (
          <div
            key={rule.rank}
            className="border-2 border-ink-primary bg-white p-6 sm:p-8 space-y-5 shadow-ticket text-left"
            style={{
              clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
            }}
          >
            <div className="flex items-center justify-between border-b-2 border-border pb-3">
              <div className="flex items-center gap-3">
                <StatusMark status={rule.rank} size="md" />
                <h3 className="font-display text-2xl font-black tracking-tight text-ink-primary">
                  {rule.rank.replace('_', ' ')} Criteria Thresholds
                </h3>
              </div>
              <Button
                variant="primary"
                size="sm"
                isLoading={savingRank === rule.rank}
                onClick={() => handleSaveRank(rule)}
                leftIcon={<FloppyDisk className="w-3.5 h-3.5" weight="bold" />}
              >
                Save {rule.rank.replace('_', ' ')} Rules
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="Minimum Approved Hours"
                type="number"
                value={rule.minHours}
                onChange={(e) => handleFieldChange(rule.rank, 'minHours', parseFloat(e.target.value) || 0)}
                required
              />

              <Input
                label="Minimum Completed Activities"
                type="number"
                value={rule.minActivities}
                onChange={(e) => handleFieldChange(rule.rank, 'minActivities', parseInt(e.target.value) || 0)}
                required
              />

              <Input
                label="Minimum Average Rating (1–5)"
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                value={rule.minRating}
                onChange={(e) => handleFieldChange(rule.rank, 'minRating', parseFloat(e.target.value) || 1.0)}
                required
              />

              <Input
                label="Minimum Months Active"
                type="number"
                value={rule.minMonths}
                onChange={(e) => handleFieldChange(rule.rank, 'minMonths', parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-1">
              <Input
                label="Mandatory Training Course Title"
                value={rule.requiredTraining}
                onChange={(e) => handleFieldChange(rule.rank, 'requiredTraining', e.target.value)}
                hint="Must match course certificates issued to volunteers for promotion eligibility."
                required
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
