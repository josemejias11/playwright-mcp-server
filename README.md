# WebDriverIO MCP Server

Automation test harness using WebdriverIO + TypeScript with multi-browser support (Chrome, Firefox, Safari) and Model Context Protocol server utilities.

## Quick Start

1. Install & build:
   npm install
   npm run build
2. Run default (Chrome only):
   npm test
3. Run specific browsers:
   # Chrome
   npm run test:chrome
   # Firefox
   npm run test:firefox
   # Safari (after enabling Remote Automation)
   npm run test:safari
   # Chrome + Firefox
   npm run test:cross
   # All 3 (requires Safari setup below)
   npm run test:all-browsers
4. Run individual suites (Chrome default unless BROWSERS is set):
   # Smoke
   npm run test:smoke
   # Accessibility
   npm run test:a11y
   # Links
   npm run test:links
   # Forms
   npm run test:forms
5. Generate & open Allure report (aggregates last run):
   npm run test:report
   npm run allure:open

## Code Quality (ESLint & Prettier)

Lint the codebase:

   npm run lint

Auto-fix lint issues where possible:

   npm run lint:fix

Check formatting (no changes written):

   npm run format:check

Write formatting changes:

   npm run format

Integrate locally via a pre-commit hook (optional example using Husky):

   npx husky add .husky/pre-commit "npm run lint && npm run format:check"

Current policy: lint warnings allowed in tests; errors blocked in core src. Prettier ensures consistent style across contributors.

## Selecting Browsers Dynamically

Use env var BROWSERS (comma separated):

BROWSERS=chrome,firefox,safari npx wdio run ./wdio.conf.ts

If omitted it defaults to chrome.

Environment variables summary:

- BROWSERS: comma separated list of browser keys (chrome,firefox,safari)
- HEADLESS: set to 1 to request headless Firefox (others can be extended similarly)
- SAFARI_TP: set to 1 to request Safari Technology Preview (if installed)

## Safari (WebKit) Setup (macOS)

Safari uses the built-in safaridriver (no npm service). One-time steps:

1. Enable the driver (Terminal):
   safaridriver --enable
2. Open Safari > Settings > Advanced: check "Show features for web developers" (if not already).
3. Menu Bar > Develop (appears) > Enable "Allow Remote Automation".
4. (Optional) For Safari Technology Preview: export SAFARI_TP=1 before running to request tech preview via capabilities.

If you see the error: You must enable 'Allow remote automation' ... it means step 3 is incomplete.

## Headless Firefox

Set HEADLESS=1 to run Firefox headless:

HEADLESS=1 BROWSERS=firefox npx wdio run ./wdio.conf.ts

You can also combine:

HEADLESS=1 BROWSERS=chrome,firefox,safari npx wdio run ./wdio.conf.ts (Firefox headless; others normal)

## Reports

All outputs land under reports/:

- allure-results (generate HTML: npm run allure:generate && npm run allure:open)
- json, junit, wdio logs, screenshots

Convenience script:

- npm run test:report -> runs full default test then generates Allure HTML into reports/allure-report

## Test Suites

- smoke: ./tests/smoke/\*
- accessibility: ./tests/accessibility/\* (axe-core)
- links: ./tests/links/\*
- forms: ./tests/forms/\*
- functional: ./tests/functional/\*
- landing: ./tests/landing/\*

Script mapping (Chrome by default unless BROWSERS provided):

- npm run test:smoke -> smoke suite
- npm run test:a11y -> accessibility suite
- npm run test:links -> link health suite
- npm run test:forms -> forms suite
  (Functional & landing covered inside full run; add targeted scripts similarly if needed.)

## Adding Another Browser

Add its capability template in capabilityCatalog inside wdio.conf.ts, then include it in BROWSERS env var.

Tip: Keep capability objects minimal & deterministic; prefer adding browser-specific flags (like headless) via environment-driven conditionals inside the catalog to avoid duplicated spec code.

## CI Recommendation

- PR: Chrome full + smoke on Firefox & Safari
- Nightly: all-browsers full suite

Suggested matrix example (GitHub Actions pseudo):
strategy:
matrix:
browser: [chrome, firefox, safari]
steps: - run: BROWSERS=${{ matrix.browser }} npm test - run: npm run allure:generate

For a nightly comprehensive job run: BROWSERS=chrome,firefox,safari npm test

## MCP Server

Entry point: src/mcp-server.ts (run with npm run mcp:server)

## Troubleshooting

| Symptom                                              | Fix                                                                     |
| ---------------------------------------------------- | ----------------------------------------------------------------------- |
| Safari session not created / remote automation error | Enable Develop > Allow Remote Automation in Safari                      |
| Geckodriver not starting                             | Ensure geckodriver version matches installed Firefox; reinstall deps    |
| Flaky network-dependent tests                        | Increase waitforTimeout or add explicit waits                           |
| Element not interactable (esp. Safari)               | Use resilient helper (safeSetValue / safeClick) to scroll, focus, retry |

## License

MIT
