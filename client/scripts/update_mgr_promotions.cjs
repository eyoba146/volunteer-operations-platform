const fs = require('fs');
const file = 'client/src/pages/manager/ManagerPromotionsPage.tsx';
let code = fs.readFileSync(file, 'utf8');

// Add MomentOverlay, TopoBackdrop import
code = code.replace(
  "import { Button, StatusMark, SheetModal, Skeleton, EmptyState } from '../../components/ui';",
  "import { Button, StatusMark, SheetModal, Skeleton, EmptyState, MomentOverlay, TopoBackdrop } from '../../components/ui';"
);

// Add state
code = code.replace(
  "const [modalMode, setModalMode] = useState<'approve' | 'decline'>('approve');",
  `const [modalMode, setModalMode] = useState<'approve' | 'decline'>('approve');
  const [showMoment, setShowMoment] = useState(false);
  const [approvedCandidate, setApprovedCandidate] = useState('');
  const [promotedRank, setPromotedRank] = useState('');`
);

// Trigger moment in handleDecisionSubmit
code = code.replace(
  "toast.success(\n        modalMode === 'approve'",
  `if (modalMode === 'approve') {
        setApprovedCandidate(targetPromotion.userName);
        setPromotedRank(targetPromotion.toRank.replace('_', ' '));
        setShowMoment(true);
      }
      toast.success(
        modalMode === 'approve'`
);

// Update Header card to Raised with TopoBackdrop
code = code.replace(
  'border border-[#D5DAE1] rounded-[10px] bg-white p-6 sm:p-8 space-y-4 shadow-sm',
  'relative overflow-hidden rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] p-6 sm:p-8 space-y-4 border-none'
);

code = code.replace(
  '<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D5DAE1] pb-5">',
  `<TopoBackdrop color="#2563EB" opacity={0.06} />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EDEFF2] pb-5">`
);

// Insert MomentOverlay in return
code = code.replace(
  'return (\n    <div className="space-y-6">',
  `return (
    <div className="space-y-6">
      <MomentOverlay
        show={showMoment}
        onDismiss={() => setShowMoment(false)}
        type="promotion"
        title="Promotion approved!"
        subtitle={\`\${approvedCandidate} advanced to \${promotedRank}. Digital certificate issued.\`}
        primaryActionLabel="Continue review →"
        onPrimaryAction={() => setShowMoment(false)}
      />`
);

// Replace remaining dividers
code = code.replace(/border-b border-\[#D5DAE1\]/g, 'border-b border-[#EDEFF2]');
code = code.replace(/border-t border-\[#D5DAE1\]/g, 'border-t border-[#EDEFF2]');
code = code.replace(/border border-\[#D5DAE1\] rounded-\[10px\]/g, 'rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] border-none');

fs.writeFileSync(file, code, 'utf8');
console.log('ManagerPromotionsPage.tsx updated successfully!');

