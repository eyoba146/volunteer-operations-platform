import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Promotion } from '../../types';
import { Button, StatusMark, SheetModal, Skeleton, EmptyState } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { 
  ChartLineUp, 
  Check, 
  X, 
  Sparkle, 
  Star, 
  Clock, 
  Certificate as CertIcon, 
  CheckCircle 
} from '@phosphor-icons/react';

export const ManagerPromotionsPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Decision Modal
  const [targetPromotion, setTargetPromotion] = useState<Promotion | null>(null);
  const [decisionNote, setDecisionNote] = useState('');
  const [modalMode, setModalMode] = useState<'approve' | 'decline'>('approve');

  const toast = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const list = await api.getEligiblePromotions();
      setPromotions(list);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDecisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !targetPromotion) return;

    setIsProcessing(true);
    try {
      await api.decidePromotion(
        targetPromotion.id,
        modalMode === 'approve' ? 'approved' : 'declined',
        decisionNote.trim(),
        user.id,
        profile?.fullName || user.username
      );

      toast.success(
        modalMode === 'approve'
          ? `Promotion approved! ${targetPromotion.userName} is now elevated to ${targetPromotion.toRank.replace('_', ' ').toUpperCase()}. Certificate generated.`
          : `Promotion nomination declined for ${targetPromotion.userName}.`
      );

      setTargetPromotion(null);
      setDecisionNote('');
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Could not process promotion decision.');
    } finally {
      setIsProcessing(false);
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

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-border pb-5 space-y-1">
        <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary block">
          ADVANCEMENT & MERIT BOARD
        </span>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-primary">
          Volunteer Promotion Board
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink-secondary">
          Review candidates nominated for Senior Member and Team Lead. Confirm verified service evidence before awarding credentials.
        </p>
      </div>

      {promotions.length === 0 ? (
        <EmptyState
          icon={<CheckCircle className="w-6 h-6 text-civic-green" />}
          title="No promotions pending decision"
          description="All volunteer nominations have been reviewed and decided by the governance board."
        />
      ) : (
        <div className="space-y-6">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="border-2 border-border-strong bg-canvas-raised p-6 md:p-8 space-y-6 shadow-subtle"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary">
                      NOMINATION RECORD
                    </span>
                    <StatusMark status={promo.status} size="sm" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-ink-primary">
                    {promo.userName}
                  </h3>
                  <p className="font-sans text-xs text-ink-secondary">
                    Recommended by <strong className="text-ink-primary">{promo.recommendedByName || 'Team Lead'}</strong> for advancement to{' '}
                    <strong className="font-mono uppercase text-civic-green">{promo.toRank.replace('_', ' ')}</strong>.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    onClick={() => {
                      setTargetPromotion(promo);
                      setModalMode('approve');
                      setDecisionNote('Exemplary field leadership and hours satisfaction confirmed.');
                    }}
                    leftIcon={<Check className="w-4 h-4" weight="bold" />}
                  >
                    Approve Promotion
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setTargetPromotion(promo);
                      setModalMode('decline');
                      setDecisionNote('');
                    }}
                    leftIcon={<X className="w-4 h-4" />}
                  >
                    Decline
                  </Button>
                </div>
              </div>

              {/* Justification note */}
              {promo.note && (
                <div className="p-3.5 bg-canvas-subdued border border-border text-xs font-sans text-ink-secondary italic">
                  "{promo.note}"
                </div>
              )}

              {/* Verified Evidence Summary (FR-PRM-02) */}
              {promo.evidence && (
                <div className="space-y-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary block">
                    Verified Evidence Summary (Live Registry Audit)
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                    <div className="p-3 border border-border bg-canvas-subdued/50 space-y-0.5">
                      <span className="text-[10px] uppercase text-ink-tertiary block">Approved Hours</span>
                      <span className="text-lg font-bold text-civic-green">{promo.evidence.approvedHours} hrs</span>
                    </div>

                    <div className="p-3 border border-border bg-canvas-subdued/50 space-y-0.5">
                      <span className="text-[10px] uppercase text-ink-tertiary block">Activities Led/Done</span>
                      <span className="text-lg font-bold text-ink-primary">{promo.evidence.completedActivities}</span>
                    </div>

                    <div className="p-3 border border-border bg-canvas-subdued/50 space-y-0.5">
                      <span className="text-[10px] uppercase text-ink-tertiary block">Average Rating</span>
                      <span className="text-lg font-bold text-[#784E0B]">{promo.evidence.averageRating} / 5.0</span>
                    </div>

                    <div className="p-3 border border-border bg-canvas-subdued/50 space-y-0.5">
                      <span className="text-[10px] uppercase text-ink-tertiary block">Active Tenure</span>
                      <span className="text-lg font-bold text-ink-primary">{promo.evidence.monthsActive} months</span>
                    </div>
                  </div>

                  {promo.evidence.completedTraining && promo.evidence.completedTraining.length > 0 && (
                    <div className="pt-2 text-xs font-sans text-ink-secondary flex items-center gap-2">
                      <CertIcon className="w-4 h-4 text-civic-green" weight="fill" />
                      <span>
                        Verified Qualifications: <strong>{promo.evidence.completedTraining.join(', ')}</strong>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Decision Confirmation Modal */}
      <SheetModal
        isOpen={targetPromotion !== null}
        onClose={() => setTargetPromotion(null)}
        title={modalMode === 'approve' ? 'Approve Promotion' : 'Decline Promotion'}
        subtitle={`Candidate: ${targetPromotion?.userName || ''} $\rightarrow$ ${targetPromotion?.toRank.replace('_', ' ').toUpperCase() || ''}`}
        mode="modal"
        maxWidth="md"
      >
        <form onSubmit={handleDecisionSubmit} className="space-y-4 text-left">
          <p className="font-sans text-xs text-ink-secondary leading-relaxed">
            {modalMode === 'approve'
              ? 'Approving this nomination will upgrade the volunteer’s account role at next sign in, issue their official rank certificate with verification code, and permanently record this promotion in the activity history.'
              : 'Please provide a clear written explanation. The volunteer will be notified and given guidance on how to satisfy remaining requirements.'}
          </p>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-secondary">
              Board Minute / Written Note
            </label>
            <textarea
              rows={3}
              value={decisionNote}
              onChange={(e) => setDecisionNote(e.target.value)}
              placeholder="e.g. Promotion approved based on outstanding service records..."
              className="w-full bg-canvas-raised text-ink-primary font-sans text-sm rounded border border-border p-2.5 focus:border-ink-primary focus:ring-1 focus:ring-ink-primary outline-none"
              required
            />
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setTargetPromotion(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={modalMode === 'approve' ? 'primary' : 'danger'}
              isLoading={isProcessing}
            >
              {modalMode === 'approve' ? 'Confirm and Issue Credential' : 'Confirm Decline'}
            </Button>
          </div>
        </form>
      </SheetModal>
    </div>
  );
};

