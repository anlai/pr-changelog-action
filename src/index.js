// const github = require('@actions/github');
// import { run } from './main.js';

// // output_file = corsCheck.getInput('output-file');

// run(github.context);

const fs = require('fs');
const path = require('path');

process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`);
});

console.log(path.resolve(__dirname));

const changelogPath = `${process.argv[2]}`;
console.log(fs.readFileSync(changelogPath, 'UTF8').trim().split('\n'));