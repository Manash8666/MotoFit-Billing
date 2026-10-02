const fs = require('node:fs');
let data = fs.readFileSync('app/settings/page.tsx', 'utf8');

// Replace all defaultValue="..." with defaultValue=""
data = data.replace(/defaultValue="[^"]*"/g, 'defaultValue=""');
data = data.replace(/defaultValue=\{[^}]*\}/g, 'defaultValue=""');

// Remove hardcoded users in the table
const hardcodedUsersRegex = /<tr className="hover:bg-white\/5 transition-colors">[\s\S]*?<\/tr>\s*<tr className="hover:bg-white\/5 transition-colors">[\s\S]*?<\/tr>/;
data = data.replace(hardcodedUsersRegex, `<tr><td colSpan={4} className="p-4 text-center text-gray-500">No users found. Go to main User Management tab to add users.</td></tr>`);

fs.writeFileSync('app/settings/page.tsx', data);
console.log("Cleaned app/settings/page.tsx");
