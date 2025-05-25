
const fs = require('fs');
const path = require('path');

const main = require('../src/main.js');

const testDir = path.resolve(__dirname);
const changelogPath = path.join(testDir, '../src', 'CHANGELOG.md');

function writeChangelog(contents) {
    fs.writeFileSync(changelogPath, contents);
}

function cleanupChangelog() {
    if (fs.existsSync(changelogPath)) {
        fs.unlinkSync(changelogPath);
    }
}

describe('no existing changelog', () => {
    afterEach(cleanupChangelog);

    test('no pending changes, no previous versions', () => {
        const results = main.run({}, changelogPath, false);
        expect(results).toBe('');
    });

    test('no pending changes, previous versions', () => {
        writeChangelog('## v1.0.0\n- change 1\n-change 2');
        const results = main.run({}, changelogPath, false);
        expect(results).toBe('');
    });

});

describe('existing pending changes', () => {

    afterEach(cleanupChangelog);

    test('no previous versions', () => {
        writeChangelog('- change 1\n- change 2');
        const results = main.run({}, changelogPath, false);
        expect(results).toBe('- change 1\n- change 2');
    });

    test('with previous versions', () => {
        writeChangelog('- change 1\n- change 2\n\n## v1.0.0\n- change 3');
        const results = main.run({}, changelogPath, false);
        expect(results).toBe('- change 1\n- change 2');
    });

});

describe('malformed existing pending', () => {

    afterEach(cleanupChangelog);

    test('missing dashes', () => {
        writeChangelog('change 1\nchange 2');
        const results = main.run({}, changelogPath, false);
        expect(results).toBe('- change 1\n- change 2');
    });

    test('extra spaces', () => {
        writeChangelog('-   change 1\n-  change 2');
        const results = main.run({}, changelogPath, false);
        expect(results).toBe('- change 1\n- change 2');
    });

    test('extra lines', () => {
        writeChangelog('\n- change 1\n\n- change 2\n');
        const results = main.run({}, changelogPath, false);
        expect(results).toBe('- change 1\n- change 2');
    });

});