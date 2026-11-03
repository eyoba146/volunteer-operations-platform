const fs = require('fs');
const file = 'client/src/pages/finance/FinanceOverviewPage.tsx';
let code = fs.readFileSync(file, 'utf8');

// Add TopoBackdrop import
code = code.replace(
  "import { Button, StatusMark, Skeleton } from '../../components/ui';",
  "import { Button, StatusMark, Skeleton, TopoBackdrop } from '../../components/ui';"
);

// Update Header card to Raised with TopoBackdrop
code = code.replace(
  'border border-[#D5DAE1] bg-white rounded-[10px] p-6 sm:p-8 space-y-6',
  'relative overflow-hidden rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] p-6 sm:p-8 space-y-6 border-none'
);

code = code.replace(
  '<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#D5DAE1] pb-6">',
  `<TopoBackdrop color="#059669" opacity={0.06} />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#EDEFF2] pb-6">`
);

// Replace cards below
code = code.replace(/border border-\[#D5DAE1\] bg-white rounded-\[10px\]/g, 'rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] border-none');
code = code.replace(/border-b border-\[#D5DAE1\]/g, 'border-b border-[#EDEFF2]');
code = code.replace(/border-t border-\[#D5DAE1\]/g, 'border-t border-[#EDEFF2]');
code = code.replace(/bg-\[#D5DAE1\]/g, 'bg-[#EDEFF2]');
code = code.replace(/divide-\[#D5DAE1\]\/60/g, 'divide-[#EDEFF2]');
code = code.replace(/border border-\[#D5DAE1\]/g, 'border-[#EDEFF2]');

fs.writeFileSync(file, code, 'utf8');
console.log('FinanceOverviewPage.tsx updated successfully!');

