const fs = require('fs');
const file = 'client/src/pages/admin/AdminActivityHistoryPage.tsx';
let code = fs.readFileSync(file, 'utf8');

// Update imports
code = code.replace(
  "import { LedgerTable, LedgerColumn, Input, Select, Skeleton } from '../../components/ui';",
  "import { LedgerTable, LedgerColumn, Input, Select, Skeleton, JourneyLog, JourneyItem } from '../../components/ui';"
);

// Add viewMode state
code = code.replace(
  "const [isLoading, setIsLoading] = useState(true);",
  "const [isLoading, setIsLoading] = useState(true);\n  const [viewMode, setViewMode] = useState<'log' | 'table'>('log');"
);

// Update Header card to Raised
code = code.replace(
  'border border-[#D5DAE1] rounded-[10px] bg-white p-6 sm:p-8 space-y-4 shadow-sm',
  'rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] p-6 sm:p-8 space-y-4 border-none'
);

code = code.replace(
  'border-b border-[#D5DAE1] pb-4',
  'border-b border-[#EDEFF2] pb-4'
);

// Add view mode segmented switch
code = code.replace(
  '</div>\n      </div>\n\n      <LedgerTable',
  `</div>
        <div className="flex items-center gap-2 pt-2 border-t border-[#EDEFF2]">
          <span className="text-[13px] font-sans text-ink-secondary mr-2">Layout:</span>
          <button
            type="button"
            onClick={() => setViewMode('log')}
            className={\`px-3 py-1.5 text-xs font-semibold rounded-[6px] transition-colors cursor-pointer \${
              viewMode === 'log'
                ? 'bg-role-admin text-white'
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
                ? 'bg-role-admin text-white'
                : 'bg-[#F7F8FA] text-ink-secondary hover:text-ink-primary'
            }\`}
          >
            Ledger table
          </button>
        </div>
      </div>

      {viewMode === 'log' ? (
        <JourneyLog
          items={filteredLogs.map((l) => ({
            id: l.id,
            date: l.createdAt,
            title: l.action,
            subtitle: \`Subject: \${l.subject}\`,
            leadValue: l.actorName,
            status: 'approved',
            statusLabel: l.actorRole,
            details: {
              fields: [
                { label: 'Actor role', value: l.actorRole },
                { label: 'Entity affected', value: l.subject },
                { label: 'Exact timestamp', value: new Date(l.createdAt).toLocaleString() },
              ],
            },
          }))}
          leadSummary={\`\${filteredLogs.length} operations recorded along the administrative trail\`}
        />
      ) : (
        <LedgerTable`
);

code = code.replace(
  'isLoading={isLoading}\n      />\n    </div>',
  'isLoading={isLoading}\n        />\n      )}\n    </div>'
);

// Replace remaining dividers
code = code.replace(/border border-\[#D5DAE1\]/g, 'border-[#EDEFF2]');

fs.writeFileSync(file, code, 'utf8');
console.log('AdminActivityHistoryPage.tsx updated successfully!');

