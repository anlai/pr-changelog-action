const core = require('@actions/core');
const github = require('@actions/github');

const main = require('./main.js');

const filename = core.getInput('changelog-file');
const verbose = core.getInput('verbose');

results = main.run(github.context, filename);

core.setOutput('changelog', results);