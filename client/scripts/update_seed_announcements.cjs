const fs = require('fs');
const file = 'client/src/api/seedData.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "title: 'Welcome to the New Volunteering Season: Community Priorities & Expansion',",
  "title: 'A new season starts, and here is what is next',"
);
code = code.replace(
  "body: 'We are proud to announce the launch of our updated Volunteer Tracking System. This year, we are expanding organized field operations into Hawassa, Bishoftu, and Bahir Dar, while reinforcing our transparent service verification standards.',",
  "body: 'Welcome to the new volunteering season. We are opening field activities across our community areas and keeping our service records simple, accurate and open to everyone.',"
);

fs.writeFileSync(file, code, 'utf8');
console.log('seedData.ts updated with warm plain copy!');

