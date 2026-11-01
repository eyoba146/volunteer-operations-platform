const fs = require("fs");

let content = fs.readFileSync("client/src/api/seedData.ts", "utf8");

// Let's inspect all SEED_ACTIVITIES startsAt and endsAt
console.log("Analyzing SEED_ACTIVITIES and SEED_HOURS...");
