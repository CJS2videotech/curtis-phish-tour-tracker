const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

if (content.includes("My Phish Tour Tracker") &&
    content.includes("const SEED_TEXT = ``;") &&
    content.includes("const DEFAULT_STASH_SHOWS = [];") &&
    content.includes("function wipeAllShows() {") &&
    content.includes(`placeholder="e.g., December 3, 1992: Bogart's – Cincinnati, OH"`)) {
    console.log("All modifications exist!");
} else {
    console.log("Missing modifications");
}
