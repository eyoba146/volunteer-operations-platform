import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Promotion } from '../../types';
import { Button, StatusMark, SheetModal, Skeleton, EmptyState, MomentOverlay, TopoBackdrop } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { 
  Check, 
  X, 
  Certificate as CertIcon, 
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
  const [showMoment, setShowMoment] = useState(false);
  const [approvedCandidate, setApprovedCandidate] = useState('');
  const [promotedRank, setPromotedRank] = useState('');

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

      if (modalMode === 'approve') {
        setApprovedCandidate(targetPromotion.userName || 'Volunteer');
        setPromotedRank(targetPromotion.toRank ? targetPromotion.toRank.replace('_', ' ') : 'next rank');
        setShowMoment(true);
      }
      toast.success(
        modalMode === 'approve'
          ? `Promotion approved! ${targetPromotion.userName} is advanced to ${targetPromotion.toRank.replace('_', ' ')}. Certificate generated.`
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
        <Skeleton variant="rect" className="h-64 rounded-[10px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MomentOverlay
        show={showMoment}
        onDismiss={() => setShowMoment(false)}
        type="promotion"
        title="Promotion approved!"
        subtitle={`${approvedCandidate} advanced to ${promotedRank}. Digital certificate issued.`}
        primaryActionLabel="Continue review →"
        onPrimaryAction={() => setShowMoment(false)}
      />
      {/* Editorial Header */}
      <div className="relative overflow-hidden rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] p-6 sm:p-8 space-y-4">
        <TopoBackdrop color="#2563EB" opacity={0.06} />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5">
          <div className="space-y-1">
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink-primary leading-tight">
              Volunteer promotion board
            </h1>
            <p className="font-sans text-[13px] sm:text-sm text-ink-secondary mt-1">
              Review candidates nominated for Senior Volunteer and Team Lead. Confirm verified service evidence before awarding credentials.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[13px] font-semibold text-role-manager bg-role-managerLight/30 px-3 py-1.5 rounded-[6px]">
              Pending decisions: {promotions.length}
            </span>
          </div>
        </div>
      </div>

      {promotions.length === 0 ? (
        <EmptyState
          icon={<ShieldCheck className="w-8 h-8 text-role-volunteer" weight="fill" />}
          title="No promotions pending decision"
          description="All volunteer nominations have been reviewed and decided by the operations desk."
        />
      ) : (
        <div className="space-y-6">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] bg-white p-6 sm:p-8 space-y-6 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-sans text-[13px] font-semibold text-role-teamlead">
                      Nominated candidate
                    </span>
                    <StatusMark status={promo.status} size="sm" />
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink-primary leading-tight">
                    {promo.userName}
                  </h3>
                  <p className="font-sans text-[13px] text-ink-secondary mt-1">
                    Recommended by <strong className="text-ink-primary font-semibold">{promo.recommendedByName || 'Team Lead'}</strong> for promotion to{' '}
                    <strong className="font-mono font-semibold text-role-teamlead">{promo.toRank.replace('_', ' ')}</strong>.
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
                    Approve promotion
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
                <div className="p-4 bg-canvas-subdued/30 rounded-[8px] text-[13px] font-sans text-ink-primary italic">
                  "{promo.note}"
                </div>
              )}

              {/* Verified Evidence Summary (Lead Numeral + Inline List) */}
              {promo.evidence && (
                <div className="space-y-3">
                  <span className="font-sans text-[13px] font-semibold tracking-tight text-ink-primary block">
                    Verified service evidence summary
                  </span>

                  <div className="rounded-[8px] bg-canvas-subdued/20 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-baseline gap-3">
                      <span className="font-display font-bold text-4xl text-role-volunteer leading-none">
                        {promo.evidence.approvedHours}
                      </span>
                      <div>
                        <span className="text-[13px] font-semibold text-ink-primary block leading-tight">
                          Verified service hours
                        </span>
                        <span className="text-[13px] text-ink-secondary font-mono">
                          Eligible threshold satisfied
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[13px] pt-2 md:pt-0">
                      <div className="space-y-0.5">
                        <span className="text-[13px] text-ink-secondary block">Completed sessions</span>
                        <span className="text-lg font-bold text-ink-primary">
                          {promo.evidence.completedActivities}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[13px] text-ink-secondary block">Average rating</span>
                        <span className="text-lg font-bold text-role-applicant">
                          {promo.evidence.averageRating} / 5.0
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[13px] text-ink-secondary block">Active tenure</span>
                        <span className="text-lg font-bold text-ink-primary">
                          {promo.evidence.monthsActive} mos
                        </span>
                      </div>
                    </div>
                  </div>

                  {promo.evidence.completedTraining && promo.evidence.completedTraining.length > 0 && (
                    <div className="pt-2 text-[13px] font-sans text-ink-secondary flex items-center gap-2">
                      <CertIcon className="w-4 h-4 text-role-volunteer" weight="fill" />
                      <span>
                        Verified training courses: <strong className="text-ink-primary font-semibold">{promo.evidence.completedTraining.join(', ')}</strong>
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
        title={modalMode === 'approve' ? 'Approve promotion' : 'Decline promotion'}
        subtitle={`Candidate: ${targetPromotion?.userName || ''} promotion to ${targetPromotion?.toRank.replace('_', ' ') || ''}`}
      >
        <form onSubmit={handleDecisionSubmit} className="space-y-4 text-left font-sans text-[13px]">
          <p className="text-ink-secondary leading-relaxed">
            {modalMode === 'approve'
              ? 'Approving this nomination updates the volunteer’s rank at next sign in, generates their digital rank certificate with verification code, and permanently records this milestone.'
              : 'Please provide a clear written explanation. The volunteer will be notified and given guidance on how to satisfy remaining requirements.'}
          </p>

          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-ink-primary">
              Written board minute / reason
            </label>
            <textarea
              rows={3}
              value={decisionNote}
              onChange={(e) => setDecisionNote(e.target.value)}
              placeholder="e.g. Promotion approved based on outstanding field leadership and verified hours..."
              className="w-full bg-white text-ink-primary font-sans text-[13px] rounded-[8px] p-2.5 focus:ring-1 focus:ring-ink-primary"
              required
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
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
              {modalMode === 'approve' ? 'Confirm and grant rank' : 'Confirm decline'}
            </Button>
          </div>
        </form>
      </SheetModal>
    </div>
  );
};
