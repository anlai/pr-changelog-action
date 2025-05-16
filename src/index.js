const github = require('@actions/github');
import { run } from './main.js';

run(github.context);