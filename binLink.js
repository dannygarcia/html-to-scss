#!/usr/bin/env node

// Nodejs libs.
var fs = require('fs');
var path = require('path');
// In Nodejs 0.8.0, existsSync moved from path -> fs.
var existsSync = fs.existsSync || path.existsSync;

// Badass internal grunt lib.
var findup = function (dirpath, filename) {
  var filepath = path.join(dirpath, filename);
  // Return file if found.
  if (existsSync(filepath)) { return filepath; }
  // If parentpath is the same as dirpath, we can't go any higher.
  var parentpath = path.resolve(dirpath, '..');
  return parentpath === dirpath ? '' : findup(parentpath, filename);
};

// Where might a locally-installed h2s live?
var dir = path.resolve(findup(process.cwd(), 'h2s.js'), '../node_modules/h2s');

// If h2s is installed locally, use it. Otherwise use this h2s.
if (!existsSync(dir)) { dir = './h2s'; }

// Run!
require(dir).cli();
