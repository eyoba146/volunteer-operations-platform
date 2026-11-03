const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.resolve(__dirname, '../src/pages');
const COMPONENTS_DIR = path.resolve(__dirname, '../src/components');

function cleanClassString(classStr) {
  const tokens = classStr.split(/\s+/);
  let hasDivideY = false;
  let hasSpaceY = false;

  tokens.forEach(t => {
    if (t.includes('space-y-')) hasSpaceY = true;
    if (t.includes('divide-y')) hasDivideY = true;
  });

  const cleaned = [];

  for (const token of tokens) {
    if (!token) continue;

    // Keep focus rings for accessibility
    if (token.includes('focus-visible:') || token.includes('focus:')) {
      cleaned.push(token);
      continue;
    }

    // Keep table border-collapse
    if (token === 'border-collapse') {
      cleaned.push(token);
      continue;
    }

    // Check base token without responsive/state prefixes (e.g., md:border-t-0, last:border-b-0, hover:border-...)
    const parts = token.split(':');
    const base = parts[parts.length - 1];

    if (
      base.startsWith('border') ||
      base.startsWith('divide-') ||
      base.startsWith('ring') ||
      base.startsWith('outline')
    ) {
      // Remove any border, divide, ring or outline
      continue;
    }

    cleaned.push(token);
  }

  // If divide-y was removed and there's no space-y, add space-y-2
  if (hasDivideY && !hasSpaceY) {
    cleaned.push('space-y-2');
  }

  return cleaned.join(' ');
}

function processContent(content) {
  // 1. Remove divider divs like <div className="w-px h-8 bg-[#EDEFF2] hidden sm:block" />
  let res = content.replace(/<div className="w-px h-8 bg-\[[^\]]+\] hidden sm:block"\s*\/>\s*/g, '');
  res = res.replace(/<div className="w-px h-8 bg-\[[^\]]+\] hidden sm:block"><\/div>\s*/g, '');

  // 2. Replace className strings
  // Handle className="..."
  res = res.replace(/className="([^"]+)"/g, (match, classes) => {
    return `className="${cleanClassString(classes)}"`;
  });

  // Handle className={`...`}
  res = res.replace(/className=\{`([^`]+)`\}/g, (match, classes) => {
    const parts = classes.split(/(\$\{[^}]+\})/);
    const cleanedParts = parts.map(part => {
      if (part.startsWith('${')) return part;
      return cleanClassString(part);
    });
    return `className={\`${cleanedParts.join(' ')}\`}`;
  });

  // Handle className={'...'}
  res = res.replace(/className=\{'([^']+)'\}/g, (match, classes) => {
    return `className={'${cleanClassString(classes)}'}`;
  });

  return res;
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (/\.(tsx|ts)$/.test(entry.name)) {
      const original = fs.readFileSync(fullPath, 'utf8');
      const processed = processContent(original);
      if (processed !== original) {
        fs.writeFileSync(fullPath, processed, 'utf8');
        console.log(`Updated: ${path.relative(process.cwd(), fullPath)}`);
      }
    }
  }
}

console.log('Stripping borders from client/src/pages...');
walkDir(PAGES_DIR);

console.log('Stripping remaining borders from client/src/components...');
walkDir(COMPONENTS_DIR);

console.log('Done stripping borders.');
