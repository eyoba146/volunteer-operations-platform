const fs = require('fs');
const file = 'client/src/api/seedData.ts';
let seed = fs.readFileSync(file, 'utf8');

const actMatches = [...seed.matchAll(/id:\s*'(act-\d+)'[\s\S]*?startsAt:\s*'([^']+)'[\s\S]*?endsAt:\s*'([^']+)'/g)];
const actMap = {};
actMatches.forEach(m => {
  const dur = Math.round((new Date(m[3]).getTime() - new Date(m[2]).getTime()) / 60000);
  actMap[m[1]] = dur;
});

const lines = seed.split('\n');
let currentHrId = null;
let currentActId = null;
let modifiedCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const idMatch = line.match(/id:\s*'(hrs-[^']+)'/);
  if (idMatch) currentHrId = idMatch[1];
  const actMatch = line.match(/activityId:\s*'(act-\d+)'/);
  if (actMatch) currentActId = actMatch[1];
  const minMatch = line.match(/minutes:\s*(\d+)/);
  if (minMatch && currentHrId && currentActId) {
    const min = parseInt(minMatch[1], 10);
    const actDur = actMap[currentActId];
    if (actDur && min > actDur + 60) {
      const capped = actDur + 60;
      console.log(`Line ${i+1}: ${currentHrId} (${currentActId}) min=${min} -> capped=${capped}`);
      lines[i] = line.replace(/minutes:\s*\d+/, `minutes: ${capped}`);
      modifiedCount++;
    }
    currentHrId = null;
    currentActId = null;
  }
}

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log(`Modified ${modifiedCount} entries in seedData.ts!`);
