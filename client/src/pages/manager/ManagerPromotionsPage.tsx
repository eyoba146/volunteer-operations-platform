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
  CheckCircle,
  ThumbsUp,
  ShieldCheck
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
          ? `Promotion approved! ${targetPromotion.userName} is elevated to ${targetPromotion.toRank.replace('_', ' ').toUpperCase()}. Certificate generated.`
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
      <div
        className="border-4 border-ink-primary bg-white p-6 sm:p-8 space-y-4 shadow-ticket"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-ink-primary pb-5">
          <div className="space-y-1">
            <span className="font-sans text-xs font-bold text-role-manager uppercase tracking-tight block">
              Merit Advancement Board
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-ink-primary leading-none">
              Volunteer Promotion Board
            </h1>
            <p className="font-sans text-xs sm:text-sm text-ink-secondary mt-1">
              Review candidates nominated for Senior Member and Team Lead. Confirm verified service evidence before awarding credentials.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-white bg-role-manager px-3 py-1.5 shadow-sm uppercase">
              Pending Decisions: {promotions.length}
            </span>
          </div>
        </div>
      </div>

      {promotions.length === 0 ? (
        <EmptyState
          icon={<ShieldCheck className="w-8 h-8 text-civic-green" weight="fill" />}
          title="No promotions pending decision"
          description="All volunteer nominations have been reviewed and decided by the operations desk."
        />
      ) : (
        <div className="space-y-6">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="border-2 border-ink-primary bg-white p-6 sm:p-8 space-y-6 shadow-ticket"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-border pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-sans text-xs font-bold text-role-teamlead uppercase tracking-tight">
                      Nominated Candidate
                    </span>
                    <StatusMark status={promo.status} size="sm" />
                  </div>
                  <h3 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-ink-primary leading-none">
                    {promo.userName}
                  </h3>
                  <p className="font-sans text-xs text-ink-secondary mt-1">
                    Recommended by <strong className="text-ink-primary font-bold">{promo.recommendedByName || 'Team Lead'}</strong> for elevation to{' '}
                    <strong className="font-mono uppercase font-bold text-role-teamlead">{promo.toRank.replace('_', ' ')}</strong>.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="teal"
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
                <div className="p-4 bg-canvas-subdued border-2 border-border text-xs font-sans text-ink-primary italic">
                  "{promo.note}"
                </div>
              )}

              {/* Verified Evidence Summary */}
              {promo.evidence && (
                <div className="space-y-3">
                  <span className="font-sans text-xs font-bold uppercase tracking-tight text-ink-primary block">
                    Verified Service Evidence Summary
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                    <div className="p-3 border-2 border-border bg-canvas-subdued space-y-0.5">
                      <span className="text-[10px] uppercase text-ink-tertiary block">Approved Hours</span>
                      <span className="font-display text-2xl font-black text-civic-green block leading-none">
                        {promo.evidence.approvedHours} <span className="text-xs font-mono font-normal text-ink-tertiary">hrs</span>
                      </span>
                    </div>

                    <div className="p-3 border-2 border-border bg-canvas-subdued space-y-0.5">
                      <span className="text-[10px] uppercase text-ink-tertiary block">Activities Done</span>
                      <span className="font-display text-2xl font-black text-ink-primary block leading-none">
                        {promo.evidence.completedActivities}
                      </span>
                    </div>

                    <div className="p-3 border-2 border-border bg-canvas-subdued space-y-0.5">
                      <span className="text-[10px] uppercase text-ink-tertiary block">Average Rating</span>
                      <span className="font-display text-2xl font-black text-[#784E0B] block leading-none">
                        {promo.evidence.averageRating} <span className="text-xs font-mono font-normal text-ink-tertiary">/ 5.0</span>
                      </span>
                    </div>

                    <div className="p-3 border-2 border-border bg-canvas-subdued space-y-0.5">
                      <span className="text-[10px] uppercase text-ink-tertiary block">Active Tenure</span>
                      <span className="font-display text-2xl font-black text-ink-primary block leading-none">
                        {promo.evidence.monthsActive} <span className="text-xs font-mono font-normal text-ink-tertiary">mos</span>
                      </span>
                    </div>
                  </div>

                  {promo.evidence.completedTraining && promo.evidence.completedTraining.length > 0 && (
                    <div className="pt-2 text-xs font-sans text-ink-secondary flex items-center gap-2">
                      <CertIcon className="w-4 h-4 text-civic-green" weight="fill" />
                      <span>
                        Verified Qualifications: <strong className="text-ink-primary font-bold">{promo.evidence.completedTraining.join(', ')}</strong>
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
        subtitle={`Candidate: ${targetPromotion?.userName || ''} elevation to ${targetPromotion?.toRank.replace('_', ' ').toUpperCase() || ''}`}
        mode="modal"
        maxWidth="md"
      >
        <form onSubmit={handleDecisionSubmit} className="space-y-4 text-left">
          <p className="font-sans text-xs text-ink-secondary leading-relaxed">
            {modalMode === 'approve'
              ? 'Approving this nomination elevates the volunteer’s account role at next sign in, generates their official rank certificate with verification code, and permanently records this milestone.'
              : 'Please provide a clear written explanation. The volunteer will be notified and given guidance on how to satisfy remaining requirements.'}
          </p>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-tight text-ink-primary">
              Written Board Minute / Reason
            </label>
            <textarea
              rows={3}
              value={decisionNote}
              onChange={(e) => setDecisionNote(e.target.value)}
              placeholder="e.g. Promotion approved based on outstanding field leadership and verified hours..."
              className="w-full bg-white text-ink-primary font-sans text-xs border-2 border-ink-primary p-2.5 focus:ring-1 focus:ring-ink-primary outline-none"
              required
            />
          </div>

          <div className="pt-3 border-t-2 border-border flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setTargetPromotion(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={modalMode === 'approve' ? 'teal' : 'danger'}
              isLoading={isProcessing}
            >
              {modalMode === 'approve' ? 'Confirm and Elevate Rank' : 'Confirm Decline'}
            </Button>
          </div>
        </form>
      </SheetModal>
    </div>
  );
};
