const fs = require('fs');
const path = require('path');
const srcDir = path.resolve(__dirname, '../src');

function isTargetUtility(token) {
  if (!token) return false;
  if (token === 'border-none' || token === 'outline-none' || token === 'ring-0' || token === 'border-0' || token === 'border-collapse') return false;
  if (token.startsWith('border') || token.startsWith('divide-') || token.startsWith('ring') || token.startsWith('outline')) {
    return true;
  }
  return false;
}

let count = 0;
const found = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((l, idx) => {
        const classNameRegex = /className=(?:\{`([^`]+)`\}|"([^"]+)"|'([^']+)')/g;
        let match;
        while ((match = classNameRegex.exec(l)) !== null) {
          const classStr = match[1] || match[2] || match[3] || '';
          const tokens = classStr.split(/\s+/);
          for (const token of tokens) {
            const parts = token.split(':');
            const prefix = parts.length > 1 ? parts.slice(0, -1).join(':') : '';
            const base = parts[parts.length - 1];

            if (prefix.includes('focus-visible') || prefix.includes('focus')) continue;

            if (isTargetUtility(base)) {
              count++;
              found.push(path.relative(process.cwd(), fullPath) + ':' + (idx+1) + ' [' + token + ']');
            }
          }
        }
      });
    }
  }
}
walk(srcDir);
console.log('Remaining border classes in client/src:', count);
found.slice(0, 30).forEach(f => console.log(f));

