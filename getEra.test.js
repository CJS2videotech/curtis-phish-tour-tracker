import { expect, test } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// Read index.html
const htmlContent = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');

// Extract getEra function using regex
// Function looks like:
// function getEra(dateString) { ... return "4.0"; }
const getEraRegex = /function getEra\([^)]*\)\s*\{[\s\S]*?\n\s*\}/;
const match = htmlContent.match(getEraRegex);

if (!match) {
  throw new Error("Could not find getEra function in index.html");
}

const getEraSource = match[0];

// Evaluate the function so we can use it in our tests
const getEra = eval(`(() => { ${getEraSource}; return getEra; })()`);

test('getEra - Falsy dateString', () => {
    expect(getEra("")).toBe("1.0");
    expect(getEra(null)).toBe("1.0");
    expect(getEra(undefined)).toBe("1.0");
});

test('getEra - Invalid dateString resulting in NaN year', () => {
    expect(getEra("not-a-date")).toBe("1.0");
    expect(getEra("unknown")).toBe("1.0");
});

test('getEra - Year <= 2000 (1.0)', () => {
    expect(getEra("2000-12-31")).toBe("1.0");
    expect(getEra("1997-08-16")).toBe("1.0");
    expect(getEra("1983-12-01")).toBe("1.0");
});

test('getEra - Year <= 2004 (2.0)', () => {
    expect(getEra("2001-01-01")).toBe("2.0");
    expect(getEra("2004-12-31")).toBe("2.0");
    expect(getEra("2003-02-14")).toBe("2.0");
});

test('getEra - Year <= 2020 (3.0)', () => {
    expect(getEra("2005-01-01")).toBe("3.0");
    expect(getEra("2020-12-31")).toBe("3.0");
    expect(getEra("2009-10-31")).toBe("3.0");
});

test('getEra - Year > 2020 (4.0)', () => {
    expect(getEra("2021-01-01")).toBe("4.0");
    expect(getEra("2024-05-01")).toBe("4.0");
    expect(getEra("2030-12-31")).toBe("4.0");
});
