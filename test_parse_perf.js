    const VENUE_DB = {
        "Bogart's": { coords: [39.1294, -84.5090], avg_rating: 4.15 },
        "Peacock Pavilion, Cincinnati Zoo": { coords: [39.1432, -84.5090], avg_rating: 4.2 },
        "Madison Square Garden": { coords: [40.7505, -73.9934], avg_rating: 4.8 },
        "The Gorge Amphitheatre": { coords: [47.1009, -119.9959], avg_rating: 4.7 },
        "Red Rocks Amphitheatre": { coords: [39.6654, -105.2057], avg_rating: 4.75 },
        "Hampton Coliseum": { coords: [37.0319, -76.3813], avg_rating: 4.6 },
        "Dick's Sporting Goods Park": { coords: [39.8055, -104.8918], avg_rating: 4.5 },
        "Bill Graham Civic Auditorium": { coords: [37.7781, -122.4172], avg_rating: 4.4 },
        "Alpine Valley Music Theatre": { coords: [42.7933, -88.3842], avg_rating: 4.5 },
        "Deer Creek Music Center": { coords: [40.0031, -85.9325], avg_rating: 4.55 }
    };

    const textToParse = Array(1000).fill(
        "1992\nDecember 3, 1992: Bogart's – Cincinnati, OH\n" +
        "1993\nAugust 6, 1993: Peacock Pavilion, Cincinnati Zoo – Cincinnati, OH\n" +
        "1997\nAugust 16-17, 1997: The Great Went (Loring Air Force Base) – Limestone, ME"
    ).join("\n");

    const monthsMap = {
        'january': 1, 'february': 2, 'march': 3, 'april': 4, 'may': 5, 'june': 6,
        'july': 7, 'august': 8, 'september': 9, 'october': 10, 'november': 11, 'december': 12
    };

    function formatISODate(dateObj) {
        const y = dateObj.getFullYear();
        const m = String(dateObj.getMonth() + 1).padStart(2, '0');
        const d = String(dateObj.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    function parseRawText(text) {
        const parsedShows = [];
        let currentYear = null;
        const lines = text.split('\n');

        lines.forEach(line => {
            line = line.trim();
            if (!line) return;

            if (line.match(/^\d{4}$/)) {
                currentYear = parseInt(line);
                return;
            }

            if (line.includes(':')) {
                const parts = line.split(':');
                const dateRaw = parts[0].trim();
                const detailsRaw = parts[1].trim();
                const splitDetails = detailsRaw.split(/[–-]/);
                let venue = splitDetails[0] ? splitDetails[0].trim() : '';
                let location = splitDetails[1] ? splitDetails[1].trim() : '';
                let notes = "";

                const normalizedDateStr = dateRaw.replace(/–/g, '-').replace(/—/g, '-');
                const dateList = [];
                const singleDateMatch = normalizedDateStr.match(/([A-Za-z]+)\s+(\d+),\s*(\d{4})/);

                if (singleDateMatch) {
                    const mName = singleDateMatch[1].toLowerCase();
                    const d = parseInt(singleDateMatch[2]);
                    const y = parseInt(singleDateMatch[3]);
                    const m = monthsMap[mName] || 1;
                    const loopDate = new Date(y, m - 1, d);
                    dateList.push(formatISODate(loopDate));
                } else {
                    dateList.push("1997-08-16");
                    dateList.push("1997-08-17");
                }

                dateList.forEach(showDate => {
                    let commRating = 4.2;
                    let isMilestone = 0;

                    // Connect community details - THIS IS THE SLOW PART
                    let matchedVenueKey = Object.keys(VENUE_DB).find(key =>
                        venue.toLowerCase().includes(key.toLowerCase()) ||
                        key.toLowerCase().includes(venue.toLowerCase())
                    );

                    if (matchedVenueKey) {
                        commRating = VENUE_DB[matchedVenueKey].avg_rating;
                    }

                    parsedShows.push({
                        date: showDate,
                        venue: venue,
                        community_rating: commRating,
                    });
                });
            }
        });

        return parsedShows;
    }

    function parseRawTextOptimized(text) {
        const parsedShows = [];
        let currentYear = null;
        const lines = text.split('\n');

        // OPTIMIZATION: Precompute lowercased keys for VENUE_DB
        const venueKeysLower = Object.keys(VENUE_DB).map(key => ({
            original: key,
            lower: key.toLowerCase()
        }));

        lines.forEach(line => {
            line = line.trim();
            if (!line) return;

            if (line.match(/^\d{4}$/)) {
                currentYear = parseInt(line);
                return;
            }

            if (line.includes(':')) {
                const parts = line.split(':');
                const dateRaw = parts[0].trim();
                const detailsRaw = parts[1].trim();
                const splitDetails = detailsRaw.split(/[–-]/);
                let venue = splitDetails[0] ? splitDetails[0].trim() : '';
                let location = splitDetails[1] ? splitDetails[1].trim() : '';
                let notes = "";

                // ... same parsing logic ...
                const normalizedDateStr = dateRaw.replace(/–/g, '-').replace(/—/g, '-');
                const dateList = [];
                const singleDateMatch = normalizedDateStr.match(/([A-Za-z]+)\s+(\d+),\s*(\d{4})/);

                if (singleDateMatch) {
                    const mName = singleDateMatch[1].toLowerCase();
                    const d = parseInt(singleDateMatch[2]);
                    const y = parseInt(singleDateMatch[3]);
                    const m = monthsMap[mName] || 1;
                    const loopDate = new Date(y, m - 1, d);
                    dateList.push(formatISODate(loopDate));
                } else {
                    dateList.push("1997-08-16");
                    dateList.push("1997-08-17");
                }

                // PRECOMPUTE outside loop to avoid repeated work per date list item
                const venueLower = venue.toLowerCase();
                const matchedVenue = venueKeysLower.find(vk =>
                    venueLower.includes(vk.lower) || vk.lower.includes(venueLower)
                );
                const matchedVenueKey = matchedVenue ? matchedVenue.original : undefined;

                dateList.forEach(showDate => {
                    let commRating = 4.2;
                    let isMilestone = 0;

                    if (matchedVenueKey) {
                        commRating = VENUE_DB[matchedVenueKey].avg_rating;
                    }

                    parsedShows.push({
                        date: showDate,
                        venue: venue,
                        community_rating: commRating,
                    });
                });
            }
        });

        return parsedShows;
    }

    const t0 = performance.now();
    for (let i = 0; i < 100; i++) {
        parseRawText(textToParse);
    }
    const t1 = performance.now();
    console.log(`Original: ${t1 - t0} milliseconds.`);

    const t2 = performance.now();
    for (let i = 0; i < 100; i++) {
        parseRawTextOptimized(textToParse);
    }
    const t3 = performance.now();
    console.log(`Optimized: ${t3 - t2} milliseconds.`);
