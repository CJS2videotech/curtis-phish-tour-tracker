const fs = require('fs');
const path = require('path');

describe('formatISODate', () => {
    let formatISODate;

    beforeAll(() => {
        const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

        // Extract the function string from the HTML
        const functionMatch = html.match(/function formatISODate\(dateObj\)\s*\{[\s\S]*?return `\$\{y\}-\$\{m\}-\$\{d\}`;[\s\S]*?\}/);
        if (functionMatch) {
            const fnCode = functionMatch[0];
            const getFn = new Function('return ' + fnCode);
            formatISODate = getFn();
        } else {
            throw new Error('formatISODate function not found in index.html');
        }
    });

    test('should format standard date correctly', () => {
        const date = new Date(2023, 9, 15); // October 15, 2023
        expect(formatISODate(date)).toBe('2023-10-15');
    });

    test('should format single digit month correctly (pads with 0)', () => {
        const date = new Date(2024, 0, 5); // January 5, 2024
        expect(formatISODate(date)).toBe('2024-01-05');
    });

    test('should format single digit day correctly (pads with 0)', () => {
        const date = new Date(2023, 11, 9); // December 9, 2023
        expect(formatISODate(date)).toBe('2023-12-09');
    });

    test('should format leap year date correctly', () => {
        const date = new Date(2024, 1, 29); // February 29, 2024
        expect(formatISODate(date)).toBe('2024-02-29');
    });
});
