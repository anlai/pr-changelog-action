const fs = require('fs');
const path = require('path');

const main = require('../src/main.js');

const testDir = path.resolve(__dirname);
const changelogPath = path.join(testDir, '../src', 'CHANGELOG.md');

const TAG = 'v1.0.1';

function writeChangelog(contents) {
    fs.writeFileSync(changelogPath, contents);
}

function cleanupChangelog() {
    if (fs.existsSync(changelogPath)) {
        fs.unlinkSync(changelogPath);
    }
}

describe('no pending changes', () => {

    afterEach(cleanupChangelog);

    test('no previous versions', () => {

        main.run(TAG, changelogPath, false);
        
        const results = fs.readFileSync(changelogPath, 'UTF8');
        expect(results).toBe(`\n## ${TAG}\n- no changes`);

    });

    test('previous versions', () => {

        const existing = '## v1.0.0\n- change 1\n- change 2';
        writeChangelog(existing);
        main.run(TAG, changelogPath, false);
        
        const results = fs.readFileSync(changelogPath, 'UTF8');
        expect(results).toBe(`\n## ${TAG}\n- no changes\n\n${existing}`);

    });

});

describe('existing pending changes, well formatted', () => {

    afterEach(cleanupChangelog);

    test('no previous versions', () => {

        const existing = '- change 3\n- change 4';
        writeChangelog(existing);
        main.run(TAG, changelogPath, false);
        
        const results = fs.readFileSync(changelogPath, 'UTF8');
        expect(results).toBe(`\n## ${TAG}\n${existing}`);

    });

    test('previous versions', () => {

        const existing = '- change 3\n- change 4\n\n## v1.0.0\n- change 1\n- change 2';
        writeChangelog(existing);
        main.run(TAG, changelogPath, false);
        
        const results = fs.readFileSync(changelogPath, 'UTF8');
        expect(results).toBe(`\n## ${TAG}\n${existing}`);

    });

});

describe('existing pending changes, malformed', () => {

    afterEach(cleanupChangelog);

    const expectedPending = `\n## ${TAG}\n- change 1\n- change 2`;
    const expectedExisting = '## v1.0.0\n- change 1\n- change 2';

    test('no previous versions, missing dashes', () => {
        writeChangelog('change 1\nchange 2');
        main.run(TAG, changelogPath, false);

        const results = fs.readFileSync(changelogPath, 'UTF8');
        expect(results).toBe(expectedPending);
    });

    test('no previous versions, extra spaces', () => {
        writeChangelog('-   change 1\n-  change 2');
        main.run(TAG, changelogPath, false);

        const results = fs.readFileSync(changelogPath, 'UTF8');
        expect(results).toBe(expectedPending);
    });

    test('no previous versions, extra lines', () => {
        writeChangelog('\n- change 1\n\n- change 2\n');
        main.run(TAG, changelogPath, false);

        const results = fs.readFileSync(changelogPath, 'UTF8');
        expect(results).toBe(expectedPending);
    });

    test('previous versions, missing dashes', () => {
        writeChangelog('change 1\nchange 2\n\n\n## v1.0.0\nchange 1\n- change 2');
        main.run(TAG, changelogPath, false);

        const results = fs.readFileSync(changelogPath, 'UTF8');
        expect(results).toBe(`${expectedPending}\n\n${expectedExisting}`);
    });

    test('previous versions, extra spaces', () => {
        writeChangelog('-   change 1\n-  change 2\n\n## v1.0.0\n- change 1\n-     change 2');
        main.run(TAG, changelogPath, false);

        const results = fs.readFileSync(changelogPath, 'UTF8');
        expect(results).toBe(`${expectedPending}\n\n${expectedExisting}`);
    });

    test('previous versions, extra lines', () => {
        writeChangelog('\n- change 1\n\n- change 2\n\n## v1.0.0\n-change 1\n\n- change 2');
        main.run(TAG, changelogPath, false);

        const results = fs.readFileSync(changelogPath, 'UTF8');
        expect(results).toBe(`${expectedPending}\n\n${expectedExisting}`);
    });

});
