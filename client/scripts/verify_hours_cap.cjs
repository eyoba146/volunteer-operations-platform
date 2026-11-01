const fs = require("fs");

const content = fs.readFileSync("client/src/api/seedData.ts", "utf8");

// Parse activities
const actRegex = /id:\s*['"](act-\d+)['"][\s\S]*?startsAt:\s*['"]([^'"]+)['"][\s\S]*?endsAt:\s*['"]([^'"]+)['"]/g;
let m;
const acts = {};
while ((m = actRegex.exec(content)) !== null) {
  const [_, id, start, end] = m;
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const durMins = Math.round((e - s) / (1000 * 60));
  acts[id] = { start, end, durMins };
}

// Check hours
const hoursBlock = content.match(/export const SEED_HOURS: HoursEntry\[\] = \[([\s\S]*?)\n\];/)[1];
const itemRegex = /id:\s*['"](hrs-[\w-]+)['"][\s\S]*?activityId:\s*['"](act-\d+)['"][\s\S]*?minutes:\s*(\d+)/g;
let hm;
while ((hm = itemRegex.exec(hoursBlock)) !== null) {
  const [_, hid, aid, minsStr] = hm;
  const mins = parseInt(minsStr, 10);
  const act = acts[aid];
  if (act && !isNaN(act.durMins)) {
    const maxAllowed = act.durMins + 60;
    if (mins > maxAllowed) {
      console.log(`EXCEEDED: ${hid} (act ${aid}): mins=${mins} > maxAllowed=${maxAllowed} (act dur=${act.durMins})`);
    } else {
      console.log(`OK: ${hid} (act ${aid}): mins=${mins} <= maxAllowed=${maxAllowed}`);
    }
  } else {
    console.log(`NO ACT INFO for ${hid} (act ${aid}): mins=${mins}`);
  }
}
