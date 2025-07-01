const fs = require('fs');
const utils = require('../../utils/changelog-utils.js');

function run(tag, changelog_path, verbose) {
    let existingContents = fs.existsSync(changelog_path) ?
        fs.readFileSync(changelog_path, 'UTF8').trim().split('\n') :
        [];

    if (existingContents.length === 0 || existingContents[0].startsWith('##')) {
        existingContents.unshift('');
        existingContents.unshift('- no changes');
    }

    existingContents.unshift(`## ${tag}`);

    existingContents = utils.correct_existing(existingContents);

    fs.writeFileSync(changelog_path, existingContents.join('\n'));
}

module.exports = { run };