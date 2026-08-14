const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Replace resetToSeeds with wipeAllShows
const searchFunc = `function resetToSeeds() {
            shows = parseRawText(SEED_TEXT);
            refreshAll();
        }`;
const replaceFunc = `function wipeAllShows() {
            shows = [];
            localStorage.removeItem('phish_shows');
            refreshAll();
        }`;
content = content.replace(searchFunc, replaceFunc);

// Replace Wipe & Reload Default Seeds button
const searchBtn1 = `<i class="fa-solid fa-trash-can mr-1.5"></i>Wipe & Reload Default Seeds`;
const replaceBtn1 = `<i class="fa-solid fa-trash-can mr-1.5"></i>Wipe All Shows`;
content = content.replace(searchBtn1, replaceBtn1);
content = content.replace(`onclick="resetToSeeds()"`, `onclick="wipeAllShows()"`);

// Replace Restore 52 Attended Shows button
const searchBtn2 = `<i class="fa-solid fa-rotate-left mr-1.5"></i>Restore 52 Attended Shows`;
const replaceBtn2 = `<i class="fa-solid fa-rotate-left mr-1.5"></i>Wipe All Shows`;
content = content.replace(searchBtn2, replaceBtn2);
content = content.replace(`onclick="resetToSeeds()"`, `onclick="wipeAllShows()"`);

fs.writeFileSync('index.html', content);
console.log("Success");
