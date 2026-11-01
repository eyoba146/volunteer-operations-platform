const fs = require('fs');
const file = 'client/src/pages/team-lead/TeamLeadActivitiesPage.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

const startIndex = lines.findIndex(l => l.includes('{activities.map((act) => ('));
const endIndex = lines.findIndex((l, idx) => idx > startIndex && l.trim() === '))}');

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `          {activities.map((act) => (
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

                  <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
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

                    {act.status !== 'completed' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<CheckCircle className="w-4 h-4" weight="bold" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkComplete(act.id);
                        }}
                        isLoading={isUpdating}
                      >
                        Mark complete
                      </Button>
                    )}
                  </div>
                </div>
              }
            />
          ))}`.split('\n');

  lines.splice(startIndex, endIndex - startIndex + 1, ...replacement);
  fs.writeFileSync(file, lines.join('\n'), 'utf8');
  console.log('Successfully replaced activities loop with TicketCard in TeamLeadActivitiesPage.tsx!');
} else {
  console.log('Indices not found:', startIndex, endIndex);
}
