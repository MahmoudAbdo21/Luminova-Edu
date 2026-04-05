const fs = require('fs');
const file = 'd:/Luminova-Edu/js/pages/main-views.js';
let content = fs.readFileSync(file, 'utf8');

// The modal starts with `${selectedStudent && html` inside the main view block
// and ends with closing divs.
// Wait, since I prepended my subview logic to the return statement, the modal is down there.
// Let's split content by `${selectedStudent && html\`` and check.
const parts = content.split("${selectedStudent && html`");
// If there are exactly two occurrences, index 1 and 2. 
// Actually, I can just use a regex that matches from `\${selectedStudent && html\`` block that has `fixed inset-0` inside it.
const modalRegex = /\$\{selectedStudent && html\`\s*\<div className="fixed inset-0 z-50[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*\`\}/g;
content = content.replace(modalRegex, '');

fs.writeFileSync(file, content);
console.log("Done replace3");
