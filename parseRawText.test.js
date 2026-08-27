import { describe, it, expect, beforeAll } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

describe('parseRawText', () => {
    let window;

    beforeAll(() => {
        const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        const dom = new JSDOM(html, {
            url: "http://localhost/",
            runScripts: "dangerously",
            beforeParse(window) {
                window.L = {
                    map: () => ({ setView: () => ({}) }),
                    tileLayer: () => ({ addTo: () => {} }),
                    layerGroup: () => ({ addTo: () => ({ clearLayers: () => {}, addLayer: () => {} }) }),
                    divIcon: () => ({}),
                    marker: () => ({ on: () => {}, bindTooltip: () => {} })
                };
                window.fetch = () => Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([])
                });
                window.HTMLCanvasElement.prototype.getContext = () => ({});
                window.Chart = class {
                    constructor() {}
                    destroy() {}
                };
            }
        });
        window = dom.window;
    });

    it('should exist on window', () => {
        expect(typeof window.parseRawText).toBe('function');
    });

    it('should parse single date', () => {
        const text = `December 3, 1992: Bogart's – Cincinnati, OH`;
        const result = window.parseRawText(text);
        expect(result).toHaveLength(1);
        expect(result[0].date).toBe('1992-12-03');
        expect(result[0].venue).toBe("Bogart's");
        expect(result[0].location).toBe("Cincinnati, OH");
    });

    it('should parse multi-day within same month', () => {
        const text = `August 16-17, 1997: The Great Went – Limestone, ME (Festival)`;
        const result = window.parseRawText(text);
        expect(result).toHaveLength(2);
        expect(result[0].date).toBe('1997-08-16');
        expect(result[1].date).toBe('1997-08-17');
        expect(result[0].venue).toBe("The Great Went");
        expect(result[0].location).toBe("Limestone, ME");
        expect(result[0].notes).toBe("Festival");
        expect(result[1].venue).toBe("The Great Went");
    });

    it('should parse multi-day across months', () => {
        const text = `October 30 - November 1, 2009: Festival 8 – Indio, CA (Halloween)`;
        const result = window.parseRawText(text);
        expect(result).toHaveLength(3);
        expect(result[0].date).toBe('2009-10-30');
        expect(result[1].date).toBe('2009-10-31');
        expect(result[2].date).toBe('2009-11-01');
        expect(result[0].venue).toBe("Festival 8");
        expect(result[0].location).toBe("Indio, CA");
        expect(result[0].notes).toBe("Halloween");
    });

    it('should handle missing city but with notes in venue', () => {
        const text = `December 31, 1993: Centrum in Worcester (New Year's Eve)`;
        const result = window.parseRawText(text);
        expect(result).toHaveLength(1);
        expect(result[0].date).toBe('1993-12-31');
        expect(result[0].venue).toBe("Centrum in Worcester");
        expect(result[0].location).toBe("");
        expect(result[0].notes).toBe("New Year's Eve");
    });

    it('should assign correct era', () => {
        const text1 = `December 7, 1997: Ervin J. Nutter Center – Dayton, OH`;
        const result1 = window.parseRawText(text1);
        expect(result1[0].era).toBe('1.0');

        const text2 = `February 14, 2003: The Forum – Inglewood, CA`;
        const result2 = window.parseRawText(text2);
        expect(result2[0].era).toBe('2.0');

        const text3 = `June 26, 2016: Klipsch Music Center – Noblesville, IN`;
        const result3 = window.parseRawText(text3);
        expect(result3[0].era).toBe('3.0');

        const text4 = `April 18, 2024: Sphere - Las Vegas, NV`;
        const result4 = window.parseRawText(text4);
        expect(result4[0].era).toBe('4.0');
    });

    it('should mark milestones based on notes', () => {
        const text = `October 31, 1995: Rosemont Horizon – Rosemont, IL (Quadrophenia Costume)`;
        const result = window.parseRawText(text);
        expect(result[0].is_milestone).toBe(1);
    });

    it('should correctly set community rating based on venue match', () => {
        const text = `August 14, 1993: World Music Theatre – Tinley Park, IL`;
        const result = window.parseRawText(text);
        expect(result[0].community_rating).toBe(4.61);
    });

    it('should fallback community rating if no venue match', () => {
        const text = `August 15, 1993: Unknown Venue – Unknown City`;
        const result = window.parseRawText(text);
        expect(result[0].community_rating).toBe(4.2);
    });

    it('should handle year headers', () => {
        const text = "1999\nJuly 4, 1999: Lakewood Amphitheatre - Atlanta, GA";
        const result = window.parseRawText(text);
        expect(result).toHaveLength(1);
        expect(result[0].date).toBe('1999-07-04');
    });
});
