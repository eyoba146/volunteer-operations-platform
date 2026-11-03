const fs = require('fs');

// 1. JourneyLog.tsx
let jl = fs.readFileSync('client/src/components/signature/JourneyLog.tsx', 'utf8');

jl = jl.replace(
  `export interface JourneyLogItem {
  id: string;
  date: string;
  title: string;
  subtitle?: string;
  status: 'approved' | 'logged' | 'needs_review' | 'declined' | 'confirmed' | 'failed' | string;
  statusLabel?: string;
  primaryNumeral: string;
  details?: JourneyLogDetail[];
  actionSlot?: React.ReactNode;
}`,
  `export type JourneyItem = JourneyLogItem;

export interface JourneyLogItem {
  id: string;
  date: string;
  title: string;
  subtitle?: string;
  status: 'approved' | 'logged' | 'needs_review' | 'declined' | 'confirmed' | 'failed' | 'review' | string;
  statusLabel?: string;
  primaryNumeral?: string;
  leadValue?: string;
  details?: JourneyLogDetail[] | { fields?: Array<{ label: string; value: React.ReactNode }>; notes?: string };
  actionSlot?: React.ReactNode;
}`
);

jl = jl.replace(
  'leadSummary?: JourneyLogLeadSummary;',
  'leadSummary?: JourneyLogLeadSummary | string;'
);

// Lead summary render
jl = jl.replace(
  `      {leadSummary && (
        <div className="rounded-[16px] bg-[#F7F8FA] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-baseline gap-4 sm:gap-6 border-none">
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-5xl sm:text-6xl text-ink-primary tracking-tight leading-none">
              {leadSummary.leadNumeral}
            </span>
            <span className="font-sans text-lg font-semibold text-ink-secondary">
              {leadSummary.label}
            </span>
          </div>
          <div className="font-sans text-[14px] text-ink-secondary border-t sm:border-t-0 sm:border-l border-[#EDEFF2] pt-3 sm:pt-0 sm:pl-6 leading-relaxed">
            {leadSummary.inlineSentence}
          </div>
        </div>
      )}`,
  `      {leadSummary && (
        typeof leadSummary === 'string' ? (
          <div className="rounded-[16px] bg-[#F7F8FA] p-5 sm:p-6 border-none font-sans text-sm text-ink-secondary">
            {leadSummary}
          </div>
        ) : (
          <div className="rounded-[16px] bg-[#F7F8FA] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-baseline gap-4 sm:gap-6 border-none">
            <div className="flex items-baseline gap-2">
              <span className="font-display font-black text-5xl sm:text-6xl text-ink-primary tracking-tight leading-none">
                {leadSummary.leadNumeral}
              </span>
              <span className="font-sans text-lg font-semibold text-ink-secondary">
                {leadSummary.label}
              </span>
            </div>
            <div className="font-sans text-[14px] text-ink-secondary border-t sm:border-t-0 sm:border-l border-[#EDEFF2] pt-3 sm:pt-0 sm:pl-6 leading-relaxed">
              {leadSummary.inlineSentence}
            </div>
          </div>
        )
      )}`
);

// Primary numeral display
jl = jl.replace(
  '{item.primaryNumeral}',
  '{item.primaryNumeral || item.leadValue || \'\'}'
);

// Details render
jl = jl.replace(
  `{item.details && item.details.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px] font-sans">
                            {item.details.map((d, idx) => (`,
  `{(() => {
                          const detailsList: JourneyLogDetail[] = Array.isArray(item.details)
                            ? item.details
                            : item.details?.fields
                            ? item.details.fields
                            : [];
                          return detailsList.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px] font-sans">
                              {detailsList.map((d, idx) => (`
);

jl = jl.replace(
  `                            ))}
                          </div>
                        )}`,
  `                            ))}
                            </div>
                          ) : null;
                        })()}`
);

fs.writeFileSync('client/src/components/signature/JourneyLog.tsx', jl, 'utf8');
console.log('JourneyLog.tsx updated!');

// 2. MomentOverlay.tsx
let mo = fs.readFileSync('client/src/components/signature/MomentOverlay.tsx', 'utf8');

mo = mo.replace(
  `export interface MomentOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  type?: 'payment_success' | 'hours_approved' | 'promotion_approved';
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  detailsSlot?: React.ReactNode;
}`,
  `export interface MomentOverlayProps {
  isOpen?: boolean;
  show?: boolean;
  onClose?: () => void;
  onDismiss?: () => void;
  title: string;
  subtitle?: string;
  type?: 'payment_success' | 'hours_approved' | 'promotion_approved' | 'payment' | 'hours' | 'promotion';
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  detailsSlot?: React.ReactNode;
}`
);

mo = mo.replace(
  `export const MomentOverlay: React.FC<MomentOverlayProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  type = 'payment_success',
  primaryActionLabel = 'Continue →',
  onPrimaryAction,
  detailsSlot,
}) => {
  // ESC key to dismiss
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;`,
  `export const MomentOverlay: React.FC<MomentOverlayProps> = ({
  isOpen,
  show,
  onClose,
  onDismiss,
  title,
  subtitle,
  type = 'payment_success',
  primaryActionLabel = 'Continue →',
  onPrimaryAction,
  detailsSlot,
}) => {
  const isVisible = show ?? isOpen ?? false;
  const handleClose = onDismiss || onClose || (() => {});

  // ESC key to dismiss
  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, handleClose]);

  if (!isVisible) return null;`
);

mo = mo.replace(/onClick=\{onClose\}/g, 'onClick={handleClose}');

fs.writeFileSync('client/src/components/signature/MomentOverlay.tsx', mo, 'utf8');
console.log('MomentOverlay.tsx updated!');

