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
for (const f of files) {
  const content = fs.readFileSync(f, "utf8");
  const lines = content.split("\n");
  lines.forEach((l, i) => {
    if (/<h1[\s>]/.test(l) && i > 0) {
      console.log(`--- ${f}:${i+1} ---`);
      for (let j = Math.max(0, i - 4); j <= i + 1; j++) {
        console.log(`  ${j+1}: ${lines[j].trim()}`);
      }
    }
  });
}
