#!/usr/bin/env ts-node
import fs from 'fs';
import yaml from 'yaml';

const WORKFLOW_PATH = '.github/workflows/ci.yml';

interface YamlError extends Error {
  linePos?: unknown;
}

function fail(message: string, error?: unknown): never {
  if (error && typeof error === 'object') {
    const err = error as YamlError;
    console.error(message, '\n', err.message || String(error));
    if (err.linePos) {
      console.error('Line positions:', err.linePos);
    }
  } else {
    console.error(message);
  }
  process.exit(1);
}

try {
  const text = fs.readFileSync(WORKFLOW_PATH, 'utf8');
  yaml.parse(text);
  console.log('Workflow YAML parsed successfully.');
  // Simple structural checks (lightweight, non-exhaustive)
  const docUnknown = yaml.parse(text);
  if (!docUnknown || typeof docUnknown !== 'object') fail('Parsed workflow is not an object.');
  // Narrow type
  const doc = docUnknown as { jobs?: Record<string, { steps?: unknown }> };
  if (!doc.jobs || typeof doc.jobs !== 'object') fail('Workflow missing jobs section.');
  const jobKeys = Object.keys(doc.jobs);
  if (jobKeys.length === 0) fail('Workflow has no jobs defined.');
  for (const jobName of jobKeys) {
    const job = doc.jobs[jobName];
    const steps = job.steps as unknown;
    if (!Array.isArray(steps) || steps.length === 0) {
      fail(`Job "${jobName}" has no steps defined.`);
    }
  }
  console.log('Basic structural validation passed.');
} catch (e) {
  fail('YAML parse/validation error:', e);
}
