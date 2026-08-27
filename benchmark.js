const shows = [];
const VENUE_DB = {};
// generate some fake data
for (let i = 0; i < 1000; i++) {
    VENUE_DB[`Venue_${i}`] = true;
}
for (let i = 0; i < 10000; i++) {
    shows.push({ venue: `venue_${i % 2000}` });
}

console.time("Original");
const uniqueVenues = [...new Set(shows.map(s => {
    return Object.keys(VENUE_DB).find(key =>
        s.venue.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(s.venue.toLowerCase())
    ) || s.venue;
}))].sort();
console.timeEnd("Original");

console.time("Optimized");
const venueDBKeys = Object.keys(VENUE_DB);
const lowerVenueDBKeys = venueDBKeys.map(k => k.toLowerCase());
const uniqueVenuesOpt = [...new Set(shows.map(s => {
    const lowerSVenue = s.venue.toLowerCase();
    const foundIndex = lowerVenueDBKeys.findIndex(lowerKey =>
        lowerSVenue.includes(lowerKey) ||
        lowerKey.includes(lowerSVenue)
    );
    return foundIndex !== -1 ? venueDBKeys[foundIndex] : s.venue;
}))].sort();
console.timeEnd("Optimized");

console.log("Results match:", JSON.stringify(uniqueVenues) === JSON.stringify(uniqueVenuesOpt));
