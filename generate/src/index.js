const github = require('@actions/github');
const main = require('./main.js');

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