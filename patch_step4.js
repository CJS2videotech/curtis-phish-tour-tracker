const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const searchTextArea = `<textarea id="bulk-input-area" rows="10" class="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-200"></textarea>`;
const replaceTextArea = `<textarea id="bulk-input-area" rows="10" placeholder="e.g., December 3, 1992: Bogart's – Cincinnati, OH" class="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-200"></textarea>`;

content = content.replace(searchTextArea, replaceTextArea);
fs.writeFileSync('index.html', content);
console.log("Success");
