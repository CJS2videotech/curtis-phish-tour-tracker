const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Replace SEED_TEXT
content = content.replace(/const SEED_TEXT = `[\s\S]*?2021\nOctober 22, 2021:  Ak-Chin Pavilion – Phoenix, AZ`;/, 'const SEED_TEXT = ``;');

// Replace DEFAULT_STASH_SHOWS
content = content.replace(/const DEFAULT_STASH_SHOWS = \[[\s\S]*?];/, 'const DEFAULT_STASH_SHOWS = [];');

// Replace DEFAULT_YOUTUBE_SHOWS
content = content.replace(/const DEFAULT_YOUTUBE_SHOWS = \[[\s\S]*?];/, 'const DEFAULT_YOUTUBE_SHOWS = [];');

// Replace window.onload block
const searchBlock = `const stored = localStorage.getItem('phish_shows');
            let parsedStored = null;
            try {
                parsedStored = stored ? JSON.parse(stored) : null;
            } catch (e) {}

            if (parsedStored && Array.isArray(parsedStored) && parsedStored.length > 25) {
                shows = parsedStored;
                shows.forEach(s => {
                    if (s.date === "1993-08-06" && s.venue.includes("PNC Bank Arts Center")) {
                        s.venue = "Peacock Pavilion, Cincinnati Zoo";
                        s.location = "Cincinnati, OH";
                        s.community_rating = 4.42;
                    }
                });
                const hasDayton94 = shows.some(s => s.date === "1994-11-17");
                if (!hasDayton94) {
                    shows.push({
                        id: Date.now() + Math.random(),
                        date: "1994-11-17",
                        venue: "Hara Arena",
                        location: "Dayton, OH",
                        notes: "Special acoustic guest set with Rev. Jeff Mosier! Added via database migration.",
                        community_rating: 4.65,
                        era: "1.0",
                        source: "Database Migration",
                        is_milestone: 1
                    });
                }
                const hasHollywood13 = shows.some(s => s.date === "2013-08-05");
                if (!hasHollywood13) {
                    shows.push({
                        id: Date.now() + Math.random(),
                        date: "2013-08-05",
                        venue: "Hollywood Bowl",
                        location: "Hollywood, CA",
                        notes: "Legendary show with no ticket stub! Added via database migration.",
                        community_rating: 4.35,
                        era: "3.0",
                        source: "Database Migration",
                        is_milestone: 0
                    });
                }
            } else {
                shows = parseRawText(SEED_TEXT);
                saveState();
            }`;

const replaceBlock = `const stored = localStorage.getItem('phish_shows');
            let parsedStored = null;
            try {
                parsedStored = stored ? JSON.parse(stored) : null;
            } catch (e) {}

            if (parsedStored && Array.isArray(parsedStored)) {
                shows = parsedStored;
            } else {
                shows = parseRawText(SEED_TEXT);
                saveState();
            }`;

if (content.includes(searchBlock)) {
    content = content.replace(searchBlock, replaceBlock);
    fs.writeFileSync('index.html', content);
    console.log("Success");
} else {
    console.log("Search block not found!");
}
