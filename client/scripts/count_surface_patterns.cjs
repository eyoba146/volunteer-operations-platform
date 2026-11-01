const fs = require('fs');
const path = require('path');

const patterns = [
  { name: 'border-black', regex: /border-black/g },
  { name: 'border-slate-8', regex: /border-slate-8\d\d/g },
  { name: 'border-slate-9', regex: /border-slate-9\d\d/g },
  { name: 'border-neutral-8', regex: /border-neutral-8\d\d/g },
  { name: 'border-neutral-9', regex: /border-neutral-9\d\d/g },
  { name: 'border-2', regex: /\bborder-2\b/g },
  { name: 'border-r-', regex: /\bborder-r-(?!none\b)[a-zA-Z0-9_\-\[\]]+/g },
  { name: 'border-b-2', regex: /\bborder-b-2\b/g },
  { name: 'bg-gray-', regex: /\bbg-gray-\d+/g },
  { name: 'bg-slate-100', regex: /\bbg-slate-100\b/g },
  { name: 'bg-slate-50', regex: /\bbg-slate-50\b/g },
  { name: 'bg-neutral-100', regex: /\bbg-neutral-100\b/g },
  { name: 'zero-blur offset shadow', regex: /shadow-\[[^\]]*0_#|shadow-\[[^\]]*0\s+#|shadow-\[4px_4px_0/g },
];

const files = [];
function scan(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) scan(full);
    else if (/\.(tsx?|css|html)$/.test(f)) files.push(full);
  }
}
scan('client/src');

const counts = {};
patterns.forEach(p => counts[p.name] = 0);

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  patterns.forEach(p => {
    const m = content.match(p.regex);
    if (m) counts[p.name] += m.length;
  });
}

console.log('=== PART 0 SURFACE RESET: INITIAL OCCURRENCE COUNTS ===');
let total = 0;
for (const [name, count] of Object.entries(counts)) {
  console.log(`${name.padEnd(26)} : ${count}`);
  total += count;
}
console.log('----------------------------------------------------');
console.log(`TOTAL DETECTED OCCURRENCES : ${total}`);

