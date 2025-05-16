const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const path = require('path');

const CHANGELOG_FILENAME = 'CHANGELOG.md';

const testDir = path.resolve(__dirname);
const changelogPath = path.join(testDir, CHANGELOG_FILENAME);

function sanitize_line(line) {
    line = line.trim();

    if (line.startsWith('-'))
    {
        return `- ${line.substring(1).trim()}`;
    }

    return `- ${line.trim()}`;
}

async function run(context) {
    try
    {
        const payload = context.payload;
        if (payload.pull_request) {

            const description = payload.pull_request.body.trim().split('\n').filter(line => line.trim() !== '').map(line => sanitize_line(line));

            const existingContents = fs.existsSync(changelogPath) ?
                fs.readFileSync(changelogPath, 'UTF8').trim().split('\n') : 
                [];

            const pending = [];

            if (existingContents.length > 0) {
                do {

                    var element = existingContents.shift();

                    if (element[0] === '#') {
                        existingContents.unshift(element);
                        break;
                    }

                    if (element) {
                        pending.push(element);
                    }

                } while(existingContents.length > 0);
            }
                        
            // add a spacing if an existing version exists
            if (existingContents.length > 0) {
                existingContents.unshift('');
            }

            const results = ([...pending, ...description, ...existingContents]);
            fs.writeFileSync(changelogPath, results.join('\n'));
        }
        else {
            console.log('not a pull request');
        }
    } catch(error) {
        core.setFailed(error.message);
    }
}

module.exports = {
    run
};