const core = require('@actions/core');
const github = require('@actions/github');

const main = require('./main.js');

const filename = core.getInput('changelog-file');
const verbose = core.getInput('verbose');

console.log(`Processing file: ${filename}...`);

results = main.run(github.context, filename);

console.log(results);

core.setOutput('changelog', results);