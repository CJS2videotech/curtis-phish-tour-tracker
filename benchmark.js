const { performance } = require('perf_hooks');

// Simulating the environment
let shows = [];
// Create a large number of existing shows
for (let i = 0; i < 10000; i++) {
    shows.push({ date: `2023-01-${i % 31}`, name: `Show ${i}` });
}

const parsed = [];
// Create a large number of parsed shows
for (let i = 0; i < 5000; i++) {
    parsed.push({ date: `2023-01-${i % 31}`, name: `Parsed Show ${i}` });
}

// O(N^2) Original Approach
const showsCopy1 = [...shows];
const start1 = performance.now();
parsed.forEach(parsedShow => {
    const duplicateIndex = showsCopy1.findIndex(s => s.date === parsedShow.date);
    if (duplicateIndex > -1) {
        showsCopy1[duplicateIndex] = parsedShow; // Update existing
    } else {
        showsCopy1.push(parsedShow); // Add new
    }
});
const end1 = performance.now();
console.log(`Original approach took ${end1 - start1} milliseconds.`);

// O(N) Optimized Approach
const showsCopy2 = [...shows];
const start2 = performance.now();

// 1. Build an index map for quick lookup
const dateToIndex = new Map();
showsCopy2.forEach((s, index) => {
    dateToIndex.set(s.date, index);
});

// 2. Iterate through parsed and update/push using the map
parsed.forEach(parsedShow => {
    const duplicateIndex = dateToIndex.get(parsedShow.date);
    if (duplicateIndex !== undefined) {
        showsCopy2[duplicateIndex] = parsedShow; // Update existing
    } else {
        showsCopy2.push(parsedShow); // Add new
        dateToIndex.set(parsedShow.date, showsCopy2.length - 1); // update map in case there are duplicates in parsed itself?
    }
});

const end2 = performance.now();
console.log(`Optimized approach took ${end2 - start2} milliseconds.`);
