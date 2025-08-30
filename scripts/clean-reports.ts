#!/usr/bin/env tsx
/**
 * Clean report / test artifact directories without deleting .gitkeep placeholders.
 * Directories covered:
 *  - reports (Allure raw + generated except keep file)
 *  - test-results (Playwright / WDIO screenshots, etc.)
 *  - playwright-report
 *  - reports/wdio (if present)
 *  - e2e/reports/playwright-report (if present)
 */
import fs from 'fs/promises';
import path from 'path';

type Target = { dir: string; note?: string };

const targets: Target[] = [
  { dir: 'reports' },
  { dir: 'test-results' },
  { dir: 'playwright-report' },
  { dir: 'reports/wdio' },
  { dir: 'e2e/reports/playwright-report' },
];

async function removeContents(dir: string) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    await Promise.all(
      entries.map(async (ent) => {
        if (ent.name === '.gitkeep') return; // preserve placeholder
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) {
          await fs.rm(full, { recursive: true, force: true });
        } else {
          await fs.rm(full, { force: true });
        }
      })
    );
    return { dir, removed: entries.filter((e) => e.name !== '.gitkeep').length };
  } catch (err) {
    if (err?.code === 'ENOENT') {
      return { dir, skipped: true };
    }
    throw err;
  }
}

async function main() {
  const results: Array<{ dir: string; removed?: number; skipped?: boolean }> = [];
  for (const t of targets) {
    results.push(await removeContents(t.dir));
  }
  const removedTotal = results.reduce((sum, r) => sum + (r.removed || 0), 0);
  console.log('Clean reports summary:');
  for (const r of results) {
    if (r.skipped) console.log(` - ${r.dir}: (missing, skipped)`);
    else console.log(` - ${r.dir}: removed ${r.removed} entries`);
  }
  console.log(`Total entries removed: ${removedTotal}`);
}

main().catch((e) => {
  console.error('clean-reports failed:', e);
  process.exit(1);
});
