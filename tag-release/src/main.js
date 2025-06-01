const fs = require('fs');
const utils = require('../../utils/changelog-utils.js');

function run(tag, filepath, verbose) {
    let existingContents = fs.existsSync(filepath) ?
        fs.readFileSync(filepath, 'UTF8').trim().split('\n') :
        [];

    existingContents = utils.correct_existing(existingContents);
}

module.exports = { run };