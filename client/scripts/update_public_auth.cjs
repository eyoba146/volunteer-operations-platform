const fs = require('fs');

// 1. SignInPage.tsx
let signin = fs.readFileSync('client/src/pages/public/SignInPage.tsx', 'utf8');

// Remove eyebrow badge
signin = signin.replace(
  `<div className="inline-block px-3 py-1 bg-canvas-subdued text-ink-primary font-semibold text-[13px] rounded-[6px] border border-[#D5DAE1] mb-2">\n          Operations access\n        </div>`,
  ''
);

// Add TopoBackdrop import
signin = signin.replace(
  "import { Input, Button } from '../../components/ui';",
  "import { Input, Button, TopoBackdrop } from '../../components/ui';"
);

// Form card to Raised with TopoBackdrop
signin = signin.replace(
  '<div className="bg-white border border-[#D5DAE1] rounded-[10px] p-6 sm:p-8 space-y-5">',
  `<div className="relative overflow-hidden rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] p-6 sm:p-8 space-y-5 border-none">
        <TopoBackdrop color="#16A34A" opacity={0.05} />
        <div className="relative z-10 space-y-4">`
);

signin = signin.replace(
  '</form>\n      </div>',
  '</form>\n        </div>\n      </div>'
);

// Demo panel to Panel tier
signin = signin.replace(
  'className="bg-white border border-[#D5DAE1] rounded-[10px] overflow-hidden"',
  'className="rounded-[16px] bg-[#F7F8FA] overflow-hidden border-none"'
);
signin = signin.replace(/border-b border-\[#D5DAE1\]/g, 'border-b border-[#EDEFF2]');
signin = signin.replace(/divide-\[#D5DAE1\]\/60/g, 'divide-[#EDEFF2]');
signin = signin.replace('border border-[#D5DAE1] rounded-[8px]', 'rounded-[8px] border-none bg-white');

fs.writeFileSync('client/src/pages/public/SignInPage.tsx', signin, 'utf8');
console.log('SignInPage.tsx updated!');

// 2. RegisterPage.tsx
let reg = fs.readFileSync('client/src/pages/public/RegisterPage.tsx', 'utf8');

reg = reg.replace(
  "import { Input, Button } from '../../components/ui';",
  "import { Input, Button, TopoBackdrop } from '../../components/ui';"
);

reg = reg.replace(
  '<div className="bg-white border border-[#D5DAE1] rounded-[10px] p-6 sm:p-8 space-y-5">',
  `<div className="relative overflow-hidden rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] p-6 sm:p-8 space-y-5 border-none">
        <TopoBackdrop color="#16A34A" opacity={0.05} />
        <div className="relative z-10 space-y-4">`
);

reg = reg.replace(
  '</form>\n      </div>',
  '</form>\n        </div>\n      </div>'
);

reg = reg.replace(/border-b border-\[#D5DAE1\]/g, 'border-b border-[#EDEFF2]');

fs.writeFileSync('client/src/pages/public/RegisterPage.tsx', reg, 'utf8');
console.log('RegisterPage.tsx updated!');

