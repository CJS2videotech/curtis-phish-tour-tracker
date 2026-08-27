import { test, expect, beforeAll } from 'vitest';
import fs from 'fs';
import jsdom from 'jsdom';
const { JSDOM, VirtualConsole } = jsdom;

let isFutureDate;

beforeAll(() => {
    const html = fs.readFileSync('./index.html', 'utf8');
    const virtualConsole = new VirtualConsole();
    virtualConsole.on("error", () => {});
    virtualConsole.on("warn", () => {});
    virtualConsole.on("info", () => {});
    virtualConsole.on("dir", () => {});

    const dom = new JSDOM(html, {
        runScripts: "dangerously",
        url: "http://localhost",
        virtualConsole
    });
    isFutureDate = dom.window.isFutureDate;
});

test('isFutureDate correctly identifies future dates', () => {
    expect(isFutureDate('2099-01-01')).toBe(true);
});

test('isFutureDate returns false for past dates', () => {
    expect(isFutureDate('1999-01-01')).toBe(false);
});

test('isFutureDate returns false for missing or falsy dates', () => {
    expect(isFutureDate('')).toBe(false);
    expect(isFutureDate(null)).toBe(false);
    expect(isFutureDate(undefined)).toBe(false);
});

test('isFutureDate returns false for invalid dates', () => {
    expect(isFutureDate('invalid-date')).toBe(false);
});

test('isFutureDate handles various formats', () => {
    expect(isFutureDate('Dec 31, 2099')).toBe(true);
    expect(isFutureDate('Jan 1, 1999')).toBe(false);
});

test('isFutureDate returns false for today', () => {
    const today = new Date();
    const todayIso = today.toISOString().split('T')[0];
    expect(isFutureDate(todayIso)).toBe(false);
});
