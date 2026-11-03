const fs = require('fs');
const file = 'client/src/pages/manager/ManagerActivitiesPage.tsx';
let code = fs.readFileSync(file, 'utf8');

// Update imports
code = code.replace(
  "import { LedgerTable, LedgerColumn, Input, Select, Button, StatusMark, SheetModal } from '../../components/ui';",
  "import { LedgerTable, LedgerColumn, Input, Select, Button, StatusMark, SheetModal, TicketCard } from '../../components/ui';"
);

// Add viewMode state
code = code.replace(
  "const [isLoadingRoster, setIsLoadingRoster] = useState(false);",
  "const [isLoadingRoster, setIsLoadingRoster] = useState(false);\n  const [viewMode, setViewMode] = useState<'tickets' | 'table'>('tickets');"
);

// Update Header card to Raised
code = code.replace(
  'border border-[#D5DAE1] rounded-[10px] bg-white p-6 sm:p-8 space-y-4 shadow-sm',
  'rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] p-6 sm:p-8 space-y-4 border-none'
);

code = code.replace(
  'border-b border-[#D5DAE1] pb-5',
  'border-b border-[#EDEFF2] pb-5'
);

// Update button variant from teal to primary
code = code.replace('variant="teal"', 'variant="primary"');

// Add view mode segmented switch
code = code.replace(
  '</div>\n      </div>\n\n      <LedgerTable',
  `</div>
        <div className="flex items-center gap-2 pt-2 border-t border-[#EDEFF2]">
          <span className="text-[13px] font-sans text-ink-secondary mr-2">Layout:</span>
          <button
            type="button"
            onClick={() => setViewMode('tickets')}
            className={\`px-3 py-1.5 text-xs font-semibold rounded-[6px] transition-colors cursor-pointer \${
              viewMode === 'tickets'
                ? 'bg-role-manager text-white'
                : 'bg-[#F7F8FA] text-ink-secondary hover:text-ink-primary'
            }\`}
          >
            Ticket cards
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={\`px-3 py-1.5 text-xs font-semibold rounded-[6px] transition-colors cursor-pointer \${
              viewMode === 'table'
                ? 'bg-role-manager text-white'
                : 'bg-[#F7F8FA] text-ink-secondary hover:text-ink-primary'
            }\`}
          >
            Ledger table
          </button>
        </div>
      </div>

      {viewMode === 'tickets' ? (
        <div className="space-y-4">
          {activities.map((act) => (
            <TicketCard
              key={act.id}
              activity={act}
              onClick={() => handleOpenRoster(act)}
              actionSlot={
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                  <div className="bg-[#F7F8FA] rounded-[10px] p-2.5 text-center min-w-[100px]">
                    <span className="font-sans text-[12px] font-medium text-ink-tertiary block">
                      Session code
                    </span>
                    <span className="font-mono text-xl font-bold text-ink-primary tracking-widest block">
                      {act.checkInCode}
                    </span>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<UsersThree className="w-4 h-4" weight="bold" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenRoster(act);
                    }}
                  >
                    View roster
                  </Button>
                </div>
              }
            />
          ))}
        </div>
      ) : (
        <LedgerTable`
);

code = code.replace(
  'isLoading={isLoading}\n      />\n\n      {/* Roster Drawer Sheet */}',
  'isLoading={isLoading}\n        />\n      )}\n\n      {/* Roster Drawer Sheet */}'
);

// Replace remaining dividers
code = code.replace(/border-b border-\[#D5DAE1\]/g, 'border-b border-[#EDEFF2]');
code = code.replace(/border-t border-\[#D5DAE1\]/g, 'border-t border-[#EDEFF2]');
code = code.replace(/border border-\[#D5DAE1\]/g, 'border-[#EDEFF2]');

fs.writeFileSync(file, code, 'utf8');
console.log('ManagerActivitiesPage.tsx updated successfully!');

