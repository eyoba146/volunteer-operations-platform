const fs = require('fs');
const file = 'client/src/pages/finance/FinancePaymentsPage.tsx';
let code = fs.readFileSync(file, 'utf8');

// Update imports
code = code.replace(
  "import { LedgerTable, LedgerColumn, Input, Select, Button, StatusMark, SheetModal } from '../../components/ui';",
  "import { LedgerTable, LedgerColumn, Input, Select, Button, StatusMark, SheetModal, JourneyLog, JourneyItem, TopoBackdrop } from '../../components/ui';"
);

// Add view mode state
code = code.replace(
  "const [inspecting, setInspecting] = useState<Payment | null>(null);",
  "const [inspecting, setInspecting] = useState<Payment | null>(null);\n  const [viewMode, setViewMode] = useState<'table' | 'log'>('log');"
);

// Replace header card
code = code.replace(
  'border border-[#D5DAE1] rounded-[10px] bg-white p-6 space-y-4 shadow-sm',
  'relative overflow-hidden rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] p-6 space-y-4 border-none'
);

code = code.replace(
  '<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D5DAE1] pb-4">',
  `<TopoBackdrop color="#059669" opacity={0.06} />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EDEFF2] pb-4">`
);

// Add view mode segmented switch below filter inputs
const filterBlock = code.match(/<div className="flex flex-col sm:flex-row gap-3 pt-1">[\s\S]*?<\/div>\s*<\/div>/);
if (filterBlock) {
  const updatedFilterBlock = filterBlock[0].replace(
    '</div>\n      </div>',
    `</div>
        <div className="flex items-center gap-2 pt-2 border-t border-[#EDEFF2]">
          <span className="text-[13px] font-sans text-ink-secondary mr-2">Layout:</span>
          <button
            type="button"
            onClick={() => setViewMode('log')}
            className={\`px-3 py-1.5 text-xs font-semibold rounded-[6px] transition-colors cursor-pointer \${
              viewMode === 'log'
                ? 'bg-role-volunteer text-white'
                : 'bg-[#F7F8FA] text-ink-secondary hover:text-ink-primary'
            }\`}
          >
            Journey timeline
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={\`px-3 py-1.5 text-xs font-semibold rounded-[6px] transition-colors cursor-pointer \${
              viewMode === 'table'
                ? 'bg-role-volunteer text-white'
                : 'bg-[#F7F8FA] text-ink-secondary hover:text-ink-primary'
            }\`}
          >
            Ledger table
          </button>
        </div>
      </div>`
  );
  code = code.replace(filterBlock[0], updatedFilterBlock);
}

// In the main render, show JourneyLog or LedgerTable
code = code.replace(
  '<LedgerTable\n        data={payments}\n        columns={columns}\n        keyField="id"\n        emptyMessage="No payments match your current criteria."\n      />',
  `{viewMode === 'log' ? (
        <JourneyLog
          items={payments.map((p) => ({
            id: p.id,
            date: p.createdAt,
            title: p.payerName || 'Applicant',
            subtitle: \`Telebirr \${p.telebirrReference} • Phone: \${p.payerPhone || '—'}\`,
            leadValue: \`ETB \${p.amount}.00\`,
            status: p.status === 'confirmed' ? 'approved' : p.status === 'needs_review' ? 'review' : 'declined',
            statusLabel: p.status === 'confirmed' ? 'Confirmed' : p.status === 'needs_review' ? 'Needs review' : 'Refunded',
            details: {
              notes: p.notes || undefined,
              fields: [
                { label: 'Reference', value: p.telebirrReference },
                { label: 'Receipt number', value: p.receiptNumber || 'None' },
                { label: 'Settlement date', value: new Date(p.createdAt).toLocaleString() },
              ],
            },
          }))}
          leadSummary={\`\${payments.length} registration payments recorded on the financial ledger\`}
        />
      ) : (
        <LedgerTable
          data={payments}
          columns={columns}
          keyField="id"
          emptyMessage="No payments match your current criteria."
        />
      )}`
);

// Replace dividers
code = code.replace(/border-b border-\[#D5DAE1\]/g, 'border-b border-[#EDEFF2]');
code = code.replace(/border-t border-\[#D5DAE1\]/g, 'border-t border-[#EDEFF2]');
code = code.replace(/border border-\[#D5DAE1\] rounded-\[10px\]/g, 'rounded-[16px] bg-white shadow-xs border-none');
code = code.replace(/border border-\[#D5DAE1\]/g, 'border-[#EDEFF2]');

fs.writeFileSync(file, code, 'utf8');
console.log('FinancePaymentsPage.tsx updated successfully!');

