const fs = require("fs");
const path = require("path");

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const f of list) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) results = results.concat(walk(full));
    else if (f.endsWith(".tsx")) results.push(full);
  }
  return results;
}

const files = walk("./client/src/pages");
let cleanedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  const original = content;

  // Pattern: <span className="...text-[13px]...">(eyebrow text)</span> before <h1
  // Can be multi-line
  const regex = /<span\s+className=["'][^"']*(?:text-\[13px\]|text-xs|tracking-tight)[^"']*["'][^>]*>\s*([A-Za-z0-9\s&,–—\(\)]+?)\s*<\/span>\s*(?=<h1)/gs;

  content = content.replace(regex, "");

  if (content !== original) {
    fs.writeFileSync(file, content, "utf8");
    console.log(`Cleaned eyebrows in: ${file}`);
    cleanedCount++;
  }
}

console.log(`Total files cleaned: ${cleanedCount}`);

