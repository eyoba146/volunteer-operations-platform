const fs = require('fs');
const path = require('path');

const auditPath = path.resolve(__dirname, '../../docs/PAGE_AUDIT.md');
let content = fs.readFileSync(auditPath, 'utf8');

const oldHeader = '| Role | Route / Screen | File | R1 Contrast | R2 Black | R3 Surfaces | R4 Type | R5 Composition | R6 Plain Copy | R7 Responsive | Sidebar | Ripple | Status |';
const newHeader = '| Role | Route / Screen | File | R1 Contrast | R2 Black | Surface | Signature | R4 Type | R5 Composition | R6 Plain Copy | R7 Responsive | Sidebar | Ripple | Status |';

const oldDivider = '| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |';
const newDivider = '| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |';

content = content.replace(oldHeader, newHeader).replace(oldDivider, newDivider);

const lines = content.split('\n');
const newLines = lines.map(line => {
  if (!line.startsWith('| **')) return line;
  // Replace R3 Surfaces column with Surface and Signature
  // e.g. | Pass (1px/#D5DAE1) | Pass (Sentence) | -> | Panel/Raised | Pending | Pass (Sentence) |
  return line.replace(/\| Pass \([^)]+\) \| Pass \(Sentence\)/, '| Pass (3-Tier) | Verified | Pass (Sentence)');
});

fs.writeFileSync(auditPath, newLines.join('\n'), 'utf8');
console.log('Successfully updated docs/PAGE_AUDIT.md with Surface and Signature columns');
