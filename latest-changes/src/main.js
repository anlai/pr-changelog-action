const fs = require('fs');
const utils = require('../../utils/changelog-utils.js');

function run(context, filepath, verbose) {
    let existingContents = fs.existsSync(filepath) ?
        fs.readFileSync(filepath, 'UTF8').trim().split('\n') :
        [];

    existingContents = utils.correct_existing(existingContents);

    const parsed = utils.parse_changelog(existingContents);
    return parsed.pending.join('\n');
}

module.exports = { run };