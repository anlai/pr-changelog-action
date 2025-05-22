const github = require('@actions/github');
const main = require('./main.js');

// import { run } from './main.js';

// import run from './main.js';

// // output_file = corsCheck.getInput('output-file');

// run(github.context);

const fs = require('fs');
const path = require('path');

// Get arguments starting from index 2 (skip node and script path)
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error("Usage: node index.js <filename> [--verbose]");
  process.exit(1);
}

const filename = args[0];
const verbose = args.includes('--verbose');

if (verbose) {
  console.log("Verbose mode is ON");
}

console.log(`Processing file: ${filename}...`);

main.run(github.context, filename, verbose);


// process.argv.forEach((val, index) => {
//     console.log(`${index}: ${val}`);
// });

// console.log(path.resolve(__dirname));

// const changelogPath = `${process.argv[2]}`;
// console.log(fs.readFileSync(changelogPath, 'UTF8').trim().split('\n'));

// console.log(github.context);
// console.log(github);