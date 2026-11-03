const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(full));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(full);
    }
  });
  return results;
}

const files = walk('client/src');

const checks = [
  { name: 'border-black', regex: /border-black/g },
  { name: 'border-slate-8', regex: /border-slate-8\d\d/g },
  { name: 'border-slate-9', regex: /border-slate-9\d\d/g },
  { name: 'border-neutral-8', regex: /border-neutral-8\d\d/g },
  { name: 'border-neutral-9', regex: /border-neutral-9\d\d/g },
  { name: 'border-2', regex: /\bborder-2\b/g },
  { name: 'border-b-2', regex: /\bborder-b-2\b/g },
  { name: 'bg-gray-', regex: /bg-gray-\d+/g },
  { name: 'bg-slate-100', regex: /bg-slate-100/g },
  { name: 'bg-slate-50', regex: /bg-slate-50/g },
  { name: 'bg-neutral-100', regex: /bg-neutral-100/g },
  { name: 'offset shadows', regex: /shadow-\[\d+px_\d+px_0/g },
  { name: 'eyebrow', regex: /\beyebrow\b/gi },
  { name: 'v2.0', regex: /v2\.0/g },
  { name: 'Source:', regex: /Source:/g },
  { name: 'text-xs', regex: /\btext-xs\b/g },
  { name: 'Minute displays (e.g. 120m)', regex: /\(\d+m\)/g },
];

console.log('--- PATTERN AUDIT RESULTS ---');
checks.forEach(check => {
  let total = 0;
  let matches = [];
  files.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    const m = content.match(check.regex);
    if (m) {
      total += m.length;
      matches.push({ file: path.relative('client/src', f), count: m.length });
    }
  });
  console.log(`[${check.name}]: count = ${total}`);
  if (matches.length > 0 && total <= 15) {
    matches.forEach(m => console.log(`   - ${m.file} (${m.count})`));
  } else if (matches.length > 0) {
    console.log(`   (across ${matches.length} files)`);
  }
});

