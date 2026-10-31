import React, { useState, useEffect } from 'react';
import * as api from '../../api';
import { VolunteerFeedback } from '../../types';
import { Select, Button, Skeleton, EmptyState } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { 
  Star, 
  ChatCircleText, 
  CheckCircle
} from '@phosphor-icons/react';

export const ManagerFeedbackPage: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<VolunteerFeedback[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'reviewed'>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const toast = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const list = await api.getVolunteerFeedback();
      setFeedbackList(list);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkReviewed = async (id: string) => {
    setIsProcessing(id);
    try {
      await api.markFeedbackReviewed(id);
      toast.success('Feedback marked as reviewed.');
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Could not update feedback.');
    } finally {
      setIsProcessing(null);
    }
  };

  const filtered = feedbackList.filter((f) => {
    if (statusFilter !== 'all' && f.status !== statusFilter) return false;
    if (ratingFilter !== 'all' && f.rating !== parseInt(ratingFilter)) return false;
    return true;
  });

  const unreviewedCount = feedbackList.filter((f) => f.status === 'new').length;
  const avgScore =
    feedbackList.length > 0
      ? (feedbackList.reduce((sum, f) => sum + f.rating, 0) / feedbackList.length).toFixed(1)
      : '5.0';

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="rect" className="h-32 rounded-[10px]" />
        <Skeleton variant="rect" className="h-64 rounded-[10px]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="border border-[#D5DAE1] rounded-[10px] bg-white p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D5DAE1] pb-5">
          <div className="space-y-1">
            <span className="font-sans text-[13px] font-semibold text-role-manager block">
              Volunteer experience & satisfaction
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink-primary leading-tight">
              Activity feedback inbox
            </h1>
            <p className="font-sans text-[13px] sm:text-sm text-ink-secondary mt-1">
              Read direct debrief comments from volunteers after completing assignments and track satisfaction metrics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[13px] font-semibold text-role-manager bg-role-managerLight/30 border border-role-manager/30 px-3 py-1.5 rounded-[6px]">
              Unreviewed: {unreviewedCount}
            </span>
          </div>
        </div>

        {/* Metric Strip */}
        <div className="border border-[#D5DAE1] rounded-[8px] bg-white divide-x divide-[#D5DAE1] grid grid-cols-1 sm:grid-cols-3 overflow-hidden">
          <div className="p-3 text-center space-y-0.5">
            <span className="text-[12px] text-ink-tertiary font-mono block">Average rating</span>
            <span className="font-display text-2xl sm:text-3xl font-bold text-role-applicant leading-none block">
              {avgScore} <span className="text-[12px] font-mono font-normal text-ink-tertiary">/ 5.0</span>
            </span>
            <span className="text-[12px] text-ink-secondary">Overall volunteer sentiment</span>
          </div>

          <div className="p-3 text-center space-y-0.5">
            <span className="text-[12px] text-ink-tertiary font-mono block">Total debriefs</span>
            <span className="font-display text-2xl sm:text-3xl font-bold text-ink-primary leading-none block">
              {feedbackList.length}
            </span>
            <span className="text-[12px] text-ink-secondary">Post-activity submissions</span>
          </div>

          <div className="p-3 text-center space-y-0.5">
            <span className="text-[12px] text-ink-tertiary font-mono block">Action required</span>
            <span className="font-display text-2xl sm:text-3xl font-bold text-role-teamlead leading-none block">
              {unreviewedCount}
            </span>
            <span className="text-[12px] text-ink-secondary">Awaiting manager review</span>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            options={[
              { value: 'all', label: 'All review states' },
              { value: 'new', label: 'Unreviewed only' },
              { value: 'reviewed', label: 'Reviewed only' },
            ]}
          />

          <Select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All star ratings' },
              { value: '5', label: '5 Stars only' },
              { value: '4', label: '4 Stars only' },
              { value: '3', label: '3 Stars only' },
            ]}
          />
        </div>
      </div>

      {/* Feedback Feed */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<ChatCircleText className="w-8 h-8 text-ink-tertiary" />}
          title="No feedback matching filter"
          description="Try selecting different filters to inspect all volunteer reviews."
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((fb) => (
            <div
              key={fb.id}
              className="border border-[#D5DAE1] rounded-[10px] bg-white p-6 space-y-4 shadow-sm text-left"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#D5DAE1] pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display text-xl font-bold text-ink-primary">
                      {fb.userName}
                    </span>
                    {fb.userArea && (
                      <span className="font-mono text-[12px] text-ink-tertiary px-1.5 py-0.5 bg-canvas-subdued/50 border border-[#D5DAE1] rounded-[4px]">
                        {fb.userArea}
                      </span>
                    )}
                    <span className={`font-mono text-[12px] font-semibold px-2 py-0.5 rounded-[4px] ${
                      fb.status === 'new' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-canvas-subdued/50 text-ink-tertiary border border-[#D5DAE1]'
                    }`}>
                      {fb.status === 'new' ? 'Unreviewed' : 'Reviewed'}
                    </span>
                  </div>

                  <span className="font-sans text-[13px] font-semibold text-role-manager block">
                    {fb.activityTitle}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Star Rating */}
                  <div className="flex items-center gap-0.5 bg-canvas-subdued/40 px-2.5 py-1 border border-[#D5DAE1] rounded-[6px]">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-3.5 h-3.5 ${
                          idx < fb.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
                        }`}
                        weight={idx < fb.rating ? 'fill' : 'regular'}
                      />
                    ))}
                    <span className="font-mono text-[13px] font-bold text-ink-primary ml-1.5">
                      {fb.rating}.0
                    </span>
                  </div>

                  {fb.status === 'new' && (
                    <Button
                      variant="teal"
                      size="sm"
                      isLoading={isProcessing === fb.id}
                      onClick={() => handleMarkReviewed(fb.id)}
                      leftIcon={<CheckCircle className="w-3.5 h-3.5" weight="bold" />}
                    >
                      Acknowledge
                    </Button>
                  )}
                </div>
              </div>

              {/* Comment Body */}
              <p className="font-sans text-[13px] text-ink-primary leading-relaxed bg-canvas-subdued/30 p-4 border border-[#D5DAE1] rounded-[8px] italic">
                "{fb.comment}"
              </p>

              <div className="flex items-center justify-between text-[12px] font-mono text-ink-tertiary pt-1">
                <span>Submitted: {new Date(fb.submittedAt).toLocaleDateString()}</span>
                <span>Feedback ID: {fb.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
