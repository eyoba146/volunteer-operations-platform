import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { RankRule, Rank } from '../../types';
import { Input, Button, StatusMark, Skeleton } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { FloppyDisk, ArrowLeft } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

export const AdminRankRulesPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [rules, setRules] = useState<RankRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
    setIsSaving(true);
    try {
      await api.updateRankRule(rule.rank, rule, user.id, profile?.fullName || user.username);
      toast.success(`Qualification thresholds for ${rule.rank.replace('_', ' ').toUpperCase()} updated.`);
    } catch (err: any) {
      toast.error(err.message || 'Could not save rank rule.');
    } finally {
      setIsSaving(false);
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
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-ink-tertiary hover:text-ink-primary transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to administration overview</span>
      </button>

      <div className="border-b border-border pb-5 space-y-1">
        <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary block">
          MERIT LADDER GOVERNANCE
        </span>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-primary">
          Rank Progression Threshold Rules
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink-secondary">
          Configure minimum hours, activities, ratings, and course requirements for volunteer rank eligibility.
        </p>
      </div>

      <div className="space-y-6">
        {rules.map((rule) => (
          <div
            key={rule.rank}
            className="border-2 border-border-strong bg-canvas-raised p-6 md:p-8 space-y-5 shadow-subtle text-left"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-3">
                <StatusMark status={rule.rank} size="md" />
                <h3 className="font-serif text-xl font-bold text-ink-primary capitalize">
                  {rule.rank.replace('_', ' ')} Qualification
                </h3>
              </div>
              <Button
                variant="primary"
                size="sm"
                isLoading={isSaving}
                onClick={() => handleSaveRank(rule)}
                leftIcon={<FloppyDisk className="w-4 h-4" />}
              >
                Save {rule.rank.replace('_', ' ')} Rules
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Input
                label="Min Approved Hours"
                type="number"
                min="0"
                value={rule.minHours}
                onChange={(e) => handleFieldChange(rule.rank, 'minHours', parseInt(e.target.value) || 0)}
                required
              />

              <Input
                label="Min Activities Completed"
                type="number"
                min="0"
                value={rule.minActivities}
                onChange={(e) => handleFieldChange(rule.rank, 'minActivities', parseInt(e.target.value) || 0)}
                required
              />

              <Input
                label="Min Average Rating"
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                value={rule.minRating}
                onChange={(e) => handleFieldChange(rule.rank, 'minRating', parseFloat(e.target.value) || 4.0)}
                required
              />

              <Input
                label="Min Active Service (Months)"
                type="number"
                min="0"
                value={rule.minMonths}
                onChange={(e) => handleFieldChange(rule.rank, 'minMonths', parseInt(e.target.value) || 0)}
                required
              />
            </div>

            <Input
              label="Mandatory Qualification Course Title"
              value={rule.requiredTraining}
              onChange={(e) => handleFieldChange(rule.rank, 'requiredTraining', e.target.value)}
              hint="Volunteers must hold a verified training certificate with this title."
              required
            />
          </div>
        ))}
      </div>
    </div>
  );
};

