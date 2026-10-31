import React, { useState, useEffect } from 'react';
import * as api from '../../api';
import { VolunteerFeedback } from '../../types';
import { Input, Select, Button, Skeleton, EmptyState } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { 
  Star, 
  ChatCircleText, 
  CheckCircle, 
  Eye, 
  MapPin, 
  Calendar 
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
        <Skeleton variant="rect" className="h-32" />
        <Skeleton variant="rect" className="h-64" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div
        className="border-4 border-ink-primary bg-white p-6 sm:p-8 space-y-4 shadow-ticket"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-ink-primary pb-5">
          <div className="space-y-1">
            <span className="font-sans text-xs font-bold text-role-manager tracking-tight block">
              Volunteer Experience & Satisfaction
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tight text-ink-primary leading-none">
              Activity Feedback Inbox
            </h1>
            <p className="font-sans text-xs sm:text-sm text-ink-secondary mt-1">
              Read direct debrief comments from volunteers after completing assignments and track satisfaction metrics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-white bg-role-manager px-3 py-1.5 shadow-sm">
              Unreviewed: {unreviewedCount}
            </span>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 border-2 border-border bg-canvas-subdued space-y-0.5">
            <span className="text-[13px] text-ink-tertiary font-mono block">Average Rating</span>
            <span className="font-display text-3xl font-black text-[#784E0B] leading-none block">
              {avgScore} <span className="text-xs font-mono font-normal text-ink-tertiary">/ 5.0</span>
            </span>
            <span className="text-[13px] text-ink-secondary">Overall volunteer sentiment</span>
          </div>

          <div className="p-3 border-2 border-border bg-canvas-subdued space-y-0.5">
            <span className="text-[13px] text-ink-tertiary font-mono block">Total Debriefs</span>
            <span className="font-display text-3xl font-black text-ink-primary leading-none block">
              {feedbackList.length}
            </span>
            <span className="text-[13px] text-ink-secondary">Post-activity submissions</span>
          </div>

          <div className="p-3 border-2 border-border bg-canvas-subdued space-y-0.5 col-span-2 sm:col-span-1">
            <span className="text-[13px] text-ink-tertiary font-mono block">Action Required</span>
            <span className="font-display text-3xl font-black text-role-applicant leading-none block">
              {unreviewedCount}
            </span>
            <span className="text-[13px] text-ink-secondary">Awaiting manager review</span>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            options={[
              { value: 'all', label: 'All Review States' },
              { value: 'new', label: 'Unreviewed Only' },
              { value: 'reviewed', label: 'Reviewed Only' },
            ]}
          />

          <Select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Star Ratings' },
              { value: '5', label: '5 Stars Only' },
              { value: '4', label: '4 Stars Only' },
              { value: '3', label: '3 Stars Only' },
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
              className="border-2 border-ink-primary bg-white p-6 space-y-4 shadow-ticket text-left"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)',
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b-2 border-border pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display text-xl font-black text-ink-primary">
                      {fb.userName}
                    </span>
                    {fb.userArea && (
                      <span className="font-mono text-[13px] text-ink-tertiary px-1.5 py-0.5 bg-canvas-subdued border border-border">
                        {fb.userArea}
                      </span>
                    )}
                    <span className={`font-mono text-[13px] font-bold px-2 py-0.5 uppercase ${
                      fb.status === 'new' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-canvas-subdued text-ink-tertiary border border-border'
                    }`}>
                      {fb.status === 'new' ? 'Unreviewed' : 'Reviewed'}
                    </span>
                  </div>

                  <span className="font-sans text-xs font-semibold text-role-manager block">
                    {fb.activityTitle}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Star Rating */}
                  <div className="flex items-center gap-0.5 bg-canvas-subdued px-2.5 py-1 border border-border">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-3.5 h-3.5 ${
                          idx < fb.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
                        }`}
                        weight={idx < fb.rating ? 'fill' : 'regular'}
                      />
                    ))}
                    <span className="font-mono text-xs font-bold text-ink-primary ml-1.5">
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
              <p className="font-sans text-xs sm:text-sm text-ink-primary leading-relaxed bg-canvas-subdued p-4 border border-border italic">
                "{fb.comment}"
              </p>

              <div className="flex items-center justify-between text-[13px] font-mono text-ink-tertiary pt-1">
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

