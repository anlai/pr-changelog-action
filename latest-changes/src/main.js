const github = require('@actions/github');
const fs = require('fs');

function run(context, filepath) {
    let existingContents = fs.existsSync(filepath) ?
        fs.readFileSync(filepath, 'UTF8').trim().split('\n') :
        [];

    console.log(existingContents);

    return existingContents.map(line => line.trim()).join('\n');
}

module.exports = { run };