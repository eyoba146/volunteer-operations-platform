const fs = require('fs');
const file = 'client/src/pages/team-lead/TeamLeadApproveHoursPage.tsx';
let code = fs.readFileSync(file, 'utf8');

// Add MomentOverlay import
code = code.replace(
  "import { LedgerTable, LedgerColumn, Button, SheetModal, Skeleton, EmptyState } from '../../components/ui';",
  "import { LedgerTable, LedgerColumn, Button, SheetModal, Skeleton, EmptyState, MomentOverlay } from '../../components/ui';"
);

// Add showMoment state
code = code.replace(
  "const [declineError, setDeclineError] = useState('');",
  "const [declineError, setDeclineError] = useState('');\n  const [showMoment, setShowMoment] = useState(false);\n  const [momentText, setMomentText] = useState('');"
);

// Trigger moment in handleApproveSingle
code = code.replace(
  "await api.approveHours(hoursId, user.id);\n      toast.success('Hours approved and added to volunteer service record.');",
  "await api.approveHours(hoursId, user.id);\n      setMomentText('1 volunteer service session verified');\n      setShowMoment(true);\n      toast.success('Hours approved and added to volunteer service record.');"
);

// Trigger moment in handleBulkApprove
code = code.replace(
  "await api.bulkApproveHours(selectedIds, user.id);\n      toast.success(`Successfully approved ${selectedIds.length} volunteer service records.`);",
  "await api.bulkApproveHours(selectedIds, user.id);\n      setMomentText(`${selectedIds.length} volunteer service sessions verified`);\n      setShowMoment(true);\n      toast.success(`Successfully approved ${selectedIds.length} volunteer service records.`);"
);

// Replace Source: lines
code = code.replace(
  "Source: {entry.source === 'manual' ? 'Manual claim' : 'On-site code scan'}",
  "{entry.source === 'manual' ? 'Self-reported manual claim' : 'Checked in with the activity code'}"
);
code = code.replace(
  "<div>Source: {declineTarget.source === 'manual' ? 'Manual submission' : 'Session check-in'}</div>",
  "<div>Check-in: {declineTarget.source === 'manual' ? 'Self-reported manual claim' : 'Checked in with the activity code'}</div>"
);

// Top header border
code = code.replace('border-b border-[#D5DAE1] pb-4', 'border-b border-[#EDEFF2] pb-4');

// Add MomentOverlay in JSX return
code = code.replace(
  'return (\n    <div className="space-y-6">',
  `return (
    <div className="space-y-6">
      <MomentOverlay
        show={showMoment}
        onDismiss={() => setShowMoment(false)}
        type="hours"
        title="Hours approved!"
        subtitle={\`\${momentText || 'Service hours verified'} and credited toward trail advancement.\`}
        primaryActionLabel="Continue reviewing →"
        onPrimaryAction={() => setShowMoment(false)}
      />`
);

fs.writeFileSync(file, code, 'utf8');
console.log('TeamLeadApproveHoursPage.tsx updated successfully!');

