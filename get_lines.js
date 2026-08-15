const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8').split('\n');

const seedTextStart = content.findIndex(l => l.includes('const SEED_TEXT = `'));
const seedTextEnd = content.findIndex((l, i) => i > seedTextStart && l.includes('`;'));

const windowOnloadStart = content.findIndex(l => l.includes('window.onload = function() {'));
let windowOnloadEnd = -1;
let braces = 0;
for(let i = windowOnloadStart; i < content.length; i++) {
  if (content[i].includes('{')) braces += (content[i].match(/\{/g) || []).length;
  if (content[i].includes('}')) braces -= (content[i].match(/\}/g) || []).length;
  if (braces === 0 && windowOnloadStart !== -1) {
    windowOnloadEnd = i;
    break;
  }
}

const stashStart = content.findIndex(l => l.includes('const DEFAULT_STASH_SHOWS = ['));
const stashEnd = content.findIndex((l, i) => i > stashStart && l.includes('];'));

const youtubeStart = content.findIndex(l => l.includes('const DEFAULT_YOUTUBE_SHOWS = ['));
const youtubeEnd = content.findIndex((l, i) => i > youtubeStart && l.includes('];'));


console.log(`SEED_TEXT: ${seedTextStart} - ${seedTextEnd}`);
console.log(`window.onload: ${windowOnloadStart} - ${windowOnloadEnd}`);
console.log(`DEFAULT_STASH_SHOWS: ${stashStart} - ${stashEnd}`);
console.log(`DEFAULT_YOUTUBE_SHOWS: ${youtubeStart} - ${youtubeEnd}`);
