const fs = require('fs');
const file = 'client/src/pages/volunteer/VolunteerRankProgressPage.tsx';
let code = fs.readFileSync(file, 'utf8');

// Replace card borders with Tier 2 Raised
code = code.replace(/border border-\[#D5DAE1\] bg-white rounded-\[10px\]/g, 'rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] border-none');
code = code.replace('border border-[#D5DAE1] bg-canvas-subdued/50 rounded-[10px]', 'rounded-[16px] bg-[#F7F8FA] border-none');
code = code.replace('p-4 border border-[#D5DAE1] rounded-[8px] bg-canvas-subdued', 'p-4 rounded-[12px] bg-[#F7F8FA] border-none');

// Replace dividers
code = code.replace(/border-b border-\[#D5DAE1\]/g, 'border-b border-[#EDEFF2]');
code = code.replace(/border-t border-\[#D5DAE1\]/g, 'border-t border-[#EDEFF2]');
code = code.replace(/divide-\[#D5DAE1\]\/50/g, 'divide-[#EDEFF2]');

// Banners
code = code.replace('border border-role-applicant bg-role-applicantLight rounded-[10px]', 'rounded-[16px] bg-[#FFFBEB] border-none');
code = code.replace('border border-role-volunteer bg-role-volunteerLight rounded-[10px]', 'rounded-[16px] bg-[#ECFDF5] border-none');

fs.writeFileSync(file, code, 'utf8');
console.log('VolunteerRankProgressPage.tsx updated successfully!');

