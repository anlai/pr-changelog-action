const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const path = require('path');

const CHANGELOG_FILENAME = 'CHANGELOG.md';

const testDir = path.resolve(__dirname);
const changelogPath = path.join(testDir, CHANGELOG_FILENAME);

function sanitize_line(line) {
    line = line.trim();

    if (line.startsWith('#')) {
        return `## ${line.replaceAll('#', '').trim()}`;
    }

    if (line.startsWith('-')) {
        return `- ${line.substring(1).trim()}`;
    }

    return `- ${line.trim()}`;
}

function correct_existing(lines) {
    const results = [];

    lines = lines.filter(line => line.trim() !== '');
    for(let i = 0; i < lines.length; i++) {
        let sanitized = sanitize_line(lines[i]);

        if (sanitized.startsWith('#')) {
            results.push('');
            results.push(sanitized);
        }
        else {
            results.push(sanitized);
        }
    }

    return results;
}

async function run(context) {
    try
    {
        const payload = context.payload;
        
        const labels = payload.pull_request.labels.map(label => label.name);
        console.log('Pull Request Labels:', labels);

        if (payload.pull_request) {
            const description = payload.pull_request.body.trim().split('\n').filter(line => line.trim() !== '').map(line => sanitize_line(line));

            let existingContents = fs.existsSync(changelogPath) ?
                fs.readFileSync(changelogPath, 'UTF8').trim().split('\n') : 
                [];

            existingContents = correct_existing(existingContents);

            const pending = [];
            if (existingContents.length > 0) {
                do {
                    var element = existingContents.shift();

                    if (!element) {
                        existingContents.unshift('');
                        break;
                    }

                    pending.push(element);
                } while(existingContents.length > 0);
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