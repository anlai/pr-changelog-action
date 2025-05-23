const github = require('@actions/github');
const fs = require('fs');

function run(context, filepath, verbose) {
    let existingContents = fs.existsSync(filepath) ?
        fs.readFileSync(filepath, 'UTF8').trim().split('\n') :
        [];

    // TODO: detect pending changes

    return existingContents.map(line => line.trim()).join('\n');
}

module.exports = { run };