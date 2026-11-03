const fs = require('fs');
const path = require('path');

const SRC_DIR = path.resolve(__dirname, '../src');

const BANNED_WORDS = [
  'directorate',
  'audit',
  'dynamic',
  'qualification',
  'official',
  'civic',
  'institutional',
  'altitude',
  'basecamp',
  'summit',
  'elevation',
  'workspace',
  'insurance',
  'regional hubs',
  'webhook',
  'token',
  'encrypted',
  '\\bapi\\b',
  '\\botp\\b',
  'brevo',
];

function getAllFiles(dir, exts = ['.ts', '.tsx', '.html', '.css']) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, exts));
    } else {
      if (exts.includes(path.extname(fullPath))) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

const files = getAllFiles(SRC_DIR);

console.log(`Found ${files.length} source files to inspect.\n`);

// 1. Uppercase check
let uppercaseMatches = [];
files.forEach((f) => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    // Check for class uppercase or style text-transform: uppercase
    if (/\buppercase\b/.test(line) || /text-transform:\s*uppercase/i.test(line)) {
      uppercaseMatches.push({ file: path.relative(SRC_DIR, f), line: idx + 1, text: line.trim() });
    }
  });
});

console.log(`=== 1. UPPERCASE CHECK === (${uppercaseMatches.length} matches)`);
uppercaseMatches.slice(0, 20).forEach((m) => console.log(`  ${m.file}:${m.line}: ${m.text}`));
if (uppercaseMatches.length > 20) console.log(`  ... and ${uppercaseMatches.length - 20} more`);
console.log('');

// 2. Tiny text check
let tinyTextMatches = [];
files.forEach((f) => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (/\btext-xs\b/.test(line) || /\btext-\[(?:[1-9]|1[0-2])px\]/.test(line)) {
      tinyTextMatches.push({ file: path.relative(SRC_DIR, f), line: idx + 1, text: line.trim() });
    }
  });
});

console.log(`=== 2. TINY TEXT (<13px) CHECK === (${tinyTextMatches.length} matches)`);
tinyTextMatches.slice(0, 20).forEach((m) => console.log(`  ${m.file}:${m.line}: ${m.text}`));
if (tinyTextMatches.length > 20) console.log(`  ... and ${tinyTextMatches.length - 20} more`);
console.log('');

// 3. Hard offset shadows
let hardShadowMatches = [];
files.forEach((f) => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (/shadow-\[\d+px_\d+px_0/.test(line)) {
      hardShadowMatches.push({ file: path.relative(SRC_DIR, f), line: idx + 1, text: line.trim() });
    }
  });
});

console.log(`=== 3. HARD OFFSET SHADOWS CHECK === (${hardShadowMatches.length} matches)`);
hardShadowMatches.forEach((m) => console.log(`  ${m.file}:${m.line}: ${m.text}`));
console.log('');

// 4. Banned words check
let bannedWordMatches = [];
files.forEach((f) => {
  // skip router or api imports if purely variable name or comment
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    // Ignore import * as api from ...
    const lineWithoutImport = line.replace(/import\s+.*from\s+['"].*['"]/, '');
    for (const w of BANNED_WORDS) {
      const reg = new RegExp(`\\b${w}\\b`, 'i');
      if (reg.test(lineWithoutImport)) {
        bannedWordMatches.push({ file: path.relative(SRC_DIR, f), line: idx + 1, word: w, text: line.trim() });
        break;
      }
    }
  });
});

console.log(`=== 4. BANNED WORDS CHECK === (${bannedWordMatches.length} matches)`);
bannedWordMatches.slice(0, 30).forEach((m) => console.log(`  ${m.file}:${m.line} [${m.word}]: ${m.text}`));
if (bannedWordMatches.length > 30) console.log(`  ... and ${bannedWordMatches.length - 30} more`);
console.log('');

// 5. Grid-cols-4 check
let gridCols4Matches = [];
files.forEach((f) => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (/grid-cols-4/.test(line)) {
      gridCols4Matches.push({ file: path.relative(SRC_DIR, f), line: idx + 1, text: line.trim() });
    }
  });
});

console.log(`=== 5. GRID-COLS-4 CHECK === (${gridCols4Matches.length} matches)`);
gridCols4Matches.forEach((m) => console.log(`  ${m.file}:${m.line}: ${m.text}`));
console.log('');

