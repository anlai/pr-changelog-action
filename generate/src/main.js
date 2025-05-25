const core = require('@actions/core');
const fs = require('fs');
const utils = require('../../utils/changelog-utils.js');

async function run(context, changelog_path, verbose) {
    try
    {
        const payload = context.payload;

        if (payload.pull_request) {
            const description = payload.pull_request.body.trim().split('\n').filter(line => line.trim() !== '').map(line => utils.sanitize_line(line));

            let existingContents = fs.existsSync(changelog_path) ?
                fs.readFileSync(changelog_path, 'UTF8').trim().split('\n') : 
                [];

            existingContents = utils.correct_existing(existingContents);

            const parsed = utils.parse_changelog(existingContents);
            const results = [...parsed.pending, ...description, ...parsed.existing];
            fs.writeFileSync(changelog_path, results.join('\n'));
        }
        else {
            console.log('not a pull request');
        }
    } catch(error) {
        core.setFailed(error.message);
    }
}

module.exports = { run };