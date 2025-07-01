const github = require('@actions/github');
const main = require('./main.js');

// Get arguments starting from index 2 (skip node and script path)
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error("Usage: node index.js <filename> <tag> [--verbose]");
  process.exit(1);
}

const filename = args[0];
const tag = args[1];
const verbose = args.includes('--verbose');

if (verbose) {
  console.log("Verbose mode is ON");
}

console.log(`Processing file: ${filename}, setting tag ${tag}...`);

main.run(tag, filename, verbose);