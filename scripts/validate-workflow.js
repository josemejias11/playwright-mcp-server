#!/usr/bin/env node
import fs from 'fs';
import yaml from 'yaml';

const file = '.github/workflows/ci.yml';
const text = fs.readFileSync(file, 'utf8');
try {
  yaml.parse(text);
  console.log('Workflow YAML parsed successfully.');
} catch (e) {
  console.error('YAML parse error:', e.message);
  process.exit(1);
}
