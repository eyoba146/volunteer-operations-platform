const fs = require("fs");

const content = fs.readFileSync("client/src/api/seedData.ts", "utf8");

// Extract activities map
const actMatch = content.match(/export const SEED_ACTIVITIES: Activity\[\] = \[([\s\S]*?)\n\];/);
const activities = {};
if (actMatch) {
  const acts = actMatch[1].split(/\{\s*id:/).filter(Boolean);
  acts.forEach(a => {
    const id = a.match(/['"](act-[\w-]+)['"]/)?.[1];
    const startsAt = a.match(/startsAt:\s*([^,\n]+)/)?.[1]?.trim().replace(/['"]/g, '');
    const endsAt = a.match(/endsAt:\s*([^,\n]+)/)?.[1]?.trim().replace(/['"]/g, '');
    if (id) activities[id] = { startsAt, endsAt };
  });
}

const hoursMatch = content.match(/export const SEED_HOURS: HoursEntry\[\] = \[([\s\S]*?)\n\];/);
if (hoursMatch) {
  const items = hoursMatch[1].split(/\{\s*id:/).filter(Boolean);
  console.log(`Checking ${items.length} hours entries...`);
  items.forEach(item => {
    const id = item.match(/['"](hrs-[\w-]+)['"]/)?.[1];
    const mins = parseInt(item.match(/minutes:\s*(\d+)/)?.[1] || "0", 10);
    const actId = item.match(/activityId:\s*['"]([\w-]+)['"]/)?.[1];
    const user = item.match(/userName:\s*['"]([^'"]+)['"]/)?.[1];
    const checkIn = item.match(/checkIn:\s*([^,\n]+)/)?.[1]?.trim();
    const checkOut = item.match(/checkOut:\s*([^,\n]+)/)?.[1]?.trim();
    const status = item.match(/status:\s*['"]([^'"]+)['"]/)?.[1];

    console.log(`${id} (${user}): act=${actId}, status=${status}, mins=${mins} (${Math.round(mins/60*10)/10}h), checkIn=${checkIn}, checkOut=${checkOut}`);
  });
}

