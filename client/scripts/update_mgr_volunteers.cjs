const fs = require('fs');
const file = 'client/src/pages/manager/ManagerVolunteersPage.tsx';
let code = fs.readFileSync(file, 'utf8');

// Update imports
code = code.replace(
  "import { LedgerTable, LedgerColumn, Input, Select, Button, StatusMark, SheetModal, Avatar } from '../../components/ui';",
  "import { LedgerTable, LedgerColumn, Input, Select, Button, StatusMark, SheetModal, Avatar, TrailMeter, JourneyLog, JourneyItem } from '../../components/ui';"
);

// Replace rank history in drawer with TrailMeter compact + JourneyLog
const oldRankTrail = code.match(/\{\/\* Permanent Rank History Trail \*\/\}[\s\S]*?\{\/\* Contact Information \*\/\}/);
if (oldRankTrail) {
  const newRankTrail = `{/* Permanent Rank History Trail Signature */}
            <div className="p-4 rounded-[14px] bg-[#F7F8FA] space-y-2 border-none">
              <span className="font-sans font-bold text-ink-primary text-sm block">
                Rank advancement trail
              </span>
              <TrailMeter
                currentHours={volunteerStats.hours}
                currentRank={inspecting.profile.rank as any}
                variant="compact"
              />
            </div>

            <div className="space-y-3">
              <span className="font-display font-bold text-ink-primary text-base block">
                Milestone history
              </span>
              <JourneyLog
                items={rankHistory.map((m, idx) => ({
                  id: m.certificateCode || String(idx),
                  date: m.achievedAt,
                  title: m.rankTitle || m.rank.replace('_', ' '),
                  subtitle: m.note || 'Milestone achieved along the trail.',
                  status: 'approved',
                  statusLabel: 'Verified',
                  leadValue: m.hoursRecorded !== undefined ? \`\${m.hoursRecorded} hrs\` : undefined,
                  details: {
                    fields: [
                      ...(m.approvedBy ? [{ label: 'Approved by', value: m.approvedBy }] : []),
                      ...(m.certificateCode ? [{ label: 'Certificate code', value: m.certificateCode }] : []),
                    ],
                  },
                }))}
                leadSummary={\`\${volunteerStats.hours} total approved hours on the trail\`}
              />
            </div>

            {/* Contact Information */}`;
  code = code.replace(oldRankTrail[0], newRankTrail);
}

// Replace dividers and borders
code = code.replace(/border-b border-\[#D5DAE1\]/g, 'border-b border-[#EDEFF2]');
code = code.replace(/border-t border-\[#D5DAE1\]/g, 'border-t border-[#EDEFF2]');
code = code.replace(/border border-\[#D5DAE1\] rounded-\[10px\]/g, 'rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] border-none');
code = code.replace(/border border-\[#D5DAE1\] rounded-\[8px\]/g, 'rounded-[12px] bg-white shadow-xs border-none');

fs.writeFileSync(file, code, 'utf8');
console.log('ManagerVolunteersPage.tsx updated successfully!');

