const fs = require("fs");
const path = require("path");

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (!["node_modules", "dist", ".git", "scripts"].includes(file)) results = results.concat(walk(full));
    } else if (/\.(tsx|ts|css|html)$/.test(file)) {
      results.push(full);
    }
  }
  return results;
}

const files = walk("./client/src");
const patterns = [
  /border-2/,
  /border-r-(?!none|0)/,
  /border-b-2/,
  /bg-gray-\d+/,
  /shadow-\[\d+px_\d+px_0/
];

for (const f of files) {
  const content = fs.readFileSync(f, "utf8");
  const lines = content.split("\n");
  lines.forEach((line, idx) => {
    for (const p of patterns) {
      if (p.test(line)) {
        console.log(`${f}:${idx+1} [${p}]: ${line.trim().slice(0, 80)}`);
        break;
      }
    }
  });
}

