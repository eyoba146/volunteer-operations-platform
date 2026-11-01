const fs = require('fs');

const seedContent = fs.readFileSync('client/src/api/seedData.ts', 'utf8');

// Helper to evaluate a time expression
function parseTime(expr) {
  expr = expr.trim().replace(/,$/, '');
  if (expr.startsWith("'") && expr.endsWith("'")) {
    return new Date(expr.slice(1, -1)).getTime();
  }
  // todayAt(8, 0)
  const mToday = expr.match(/todayAt\((\d+),\s*(\d+)\)/);
  if (mToday) {
    const d = new Date('2026-11-01T00:00:00Z');
    d.setUTCHours(parseInt(mToday[1], 10), parseInt(mToday[2], 10), 0, 0);
    return d.getTime();
  }
  // daysAhead(7, 8, 0)
  const mDaysAhead = expr.match(/daysAhead\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (mDaysAhead) {
    const d = new Date('2026-11-01T00:00:00Z');
    d.setUTCDate(d.getUTCDate() + parseInt(mDaysAhead[1], 10));
    d.setUTCHours(parseInt(mDaysAhead[2], 10), parseInt(mDaysAhead[3], 10), 0, 0);
    return d.getTime();
  }
  // daysAgo(7, 8, 0)
  const mDaysAgo = expr.match(/daysAgo\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (mDaysAgo) {
    const d = new Date('2026-11-01T00:00:00Z');
    d.setUTCDate(d.getUTCDate() - parseInt(mDaysAgo[1], 10));
    d.setUTCHours(parseInt(mDaysAgo[2], 10), parseInt(mDaysAgo[3], 10), 0, 0);
    return d.getTime();
  }
  return null;
}

// Extract activities
const actDurations = {};
const actBlocks = seedContent.split(/\{\s*id:\s*'(act-\d+)'/);
for (let i = 1; i < actBlocks.length; i += 2) {
  const actId = actBlocks[i];
  const block = actBlocks[i + 1] || '';
  const startsMatch = block.match(/startsAt:\s*([^\n]+)/);
  const endsMatch = block.match(/endsAt:\s*([^\n]+)/);
  if (startsMatch && endsMatch) {
    const tStart = parseTime(startsMatch[1]);
    const tEnd = parseTime(endsMatch[1]);
    if (tStart && tEnd) {
      const dur = Math.round((tEnd - tStart) / 60000);
      actDurations[actId] = dur;
    }
  }
}

console.log('Activity Durations (min):', actDurations);

// Now inspect SEED_HOURS
const hoursIdx = seedContent.indexOf('SEED_HOURS:');
const hoursText = seedContent.slice(hoursIdx);

const hourMatches = [...hoursText.matchAll(/id:\s*'(hrs-[^']+)'[\s\S]*?activityId:\s*'(act-\d+)'[\s\S]*?minutes:\s*(\d+)/g)];
console.log(`Found ${hourMatches.length} hour records`);

const exceeding = [];
for (const m of hourMatches) {
  const hrId = m[1];
  const actId = m[2];
  const minutes = parseInt(m[3], 10);
  const actDur = actDurations[actId];
  if (actDur !== undefined) {
    const maxAllowed = actDur + 60;
    if (minutes > maxAllowed) {
      exceeding.push({ hrId, actId, minutes, actDur, maxAllowed });
    }
  } else {
    console.warn(`No duration found for activity ${actId} in record ${hrId}`);
  }
}

console.log('Exceeding records count:', exceeding.length);
if (exceeding.length > 0) {
  console.log(exceeding);
}
