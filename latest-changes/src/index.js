const core = require('@actions/core');
const github = require('@actions/github');
const main = require('./main.js');

const os = require('os');
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

const results = main.run(github.context, filename, verbose);

core.setOutput('changelog', results);
