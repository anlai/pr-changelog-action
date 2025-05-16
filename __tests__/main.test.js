
const fs = require('fs');
const path = require('path');

const main = require('../src/main.js');

const testDir = path.resolve(__dirname);
const changelogPath = path.join(testDir, '../src', 'CHANGELOG.md');

describe('no existing changelog', () => {

    afterEach(() => { 
        if (fs.existsSync(changelogPath)) {
            fs.unlinkSync(changelogPath);
        }
    });

    test('well formatted input', () => {
        const context = {
            eventName: 'pull_request',
            payload: {
                pull_request: {
                    title: 'sample pull request',
                    body: '- change 1\n- change 2'
                }
            }
        };

        main.run(context);

        const results = fs.readFileSync(changelogPath, 'UTF8');
        expect(results).toBe('- change 1\n- change 2');
    });

    test('mixed input', () => {
        const context = {
            eventName: 'pull_request',
            payload: {
                pull_request: {
                    title: 'sample pull request',
                    body: '- change 1\nchange 2\n\n-  change 3\n\n\n'
                }
            }
        };

        main.run(context);

        const results = fs.readFileSync(changelogPath, 'UTF8');
        expect(results).toBe('- change 1\n- change 2\n- change 3');
    });

});

describe('existing changelog - no previous versions', () => {

    beforeEach(() => {
        const contents = '- change 1\n- change 2';
        fs.writeFileSync(changelogPath, contents);
    })

    afterEach(() => {
        if (fs.existsSync(changelogPath)) {
            fs.unlinkSync(changelogPath);
        }
    });

    test('well formatted input', () => {
        const context = {
            eventName: 'pull_request',
            payload: {
                pull_request: {
                    title: 'sample pull request',
                    body: '- change 3\n- change 4'
                }
            }
        };

        main.run(context);

        const results = fs.readFileSync(changelogPath, 'UTF8');
        expect(results).toBe('- change 1\n- change 2\n- change 3\n- change 4');
    });

});

describe('existing changelog - previous version, no pending changes', () => {

    const testDir = path.resolve(__dirname);
    const changelogPath = path.join(testDir, '../src', 'CHANGELOG.md');

    beforeEach(() => {
        const contents = '## v1.0.0\n- change 1\n- change 2';
        fs.writeFileSync(changelogPath, contents);
    })

    afterEach(() => {
        if (fs.existsSync(changelogPath)) {
            fs.unlinkSync(changelogPath);
        }
    });

    test('well formatted input', () => {
        const context = {
            eventName: 'pull_request',
            payload: {
                pull_request: {
                    title: 'sample pull request',
                    body: '- change 3\n- change 4'
                }
            }
        };

        main.run(context);

        const results = fs.readFileSync(changelogPath, 'UTF8');
        expect(results).toBe('- change 3\n- change 4\n\n## v1.0.0\n- change 1\n- change 2');
    });

});

describe('existing changelog - previous versions, no pending changes', () => {

    const testDir = path.resolve(__dirname);
    const changelogPath = path.join(testDir, '../src', 'CHANGELOG.md');

    beforeEach(() => {
        const contents = '## v1.0.1\n- change 3\n\n## v1.0.0\n- change 1\n- change 2';
        fs.writeFileSync(changelogPath, contents);
    })

    afterEach(() => {
        if (fs.existsSync(changelogPath)) {
            fs.unlinkSync(changelogPath);
        }
    });

    test('well formatted input', () => {
        const context = {
            eventName: 'pull_request',
            payload: {
                pull_request: {
                    title: 'sample pull request',
                    body: '- change 4\n- change 5'
                }
            }
        };

        main.run(context);

        const results = fs.readFileSync(changelogPath, 'UTF8');
        expect(results).toBe('- change 4\n- change 5\n\n## v1.0.1\n- change 3\n\n## v1.0.0\n- change 1\n- change 2');
    });

});

describe('malformed changelog', () => {

    beforeEach(() => {
        const contents = '- change 1\n- change 2\n\nchange 3\n#v1.0.0\nchange 4\n   change 5\n- change 6\n-change 7\n##  v0.9.0\nchange a\n\n\n';
        fs.writeFileSync(changelogPath, contents);
    })

    afterEach(() => {
        if (fs.existsSync(changelogPath)) {
            fs.unlinkSync(changelogPath);
        }
    });

    test('existing changelog corrected, no new input', () => {
        const context = {
            eventName: 'pull_request',
            payload: {
                pull_request: {
                    title: 'sample pull request',
                    body: ''
                }
            }
        };

        main.run(context);

        const results = fs.readFileSync(changelogPath, 'UTF8');
        expect(results).toBe('- change 1\n- change 2\n- change 3\n\n## v1.0.0\n- change 4\n- change 5\n- change 6\n- change 7\n\n## v0.9.0\n- change a');
    });

});