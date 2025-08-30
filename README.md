# QA Automation Stack

Simple TypeScript WebDriverIO + MCP server project for multi-browser UI, accessibility, links, forms, and smoke testing with Allure reporting.

## Tech

- TypeScript
- WebdriverIO (Mocha)
- Allure Reports (JSON + JUnit + Screenshots on failure)
- MCP server (Model Context Protocol) endpoint
- Axe-core (basic accessibility scan)
- Chromedriver / Geckodriver services
- Postman / Newman (API smoke tests)

## Scripts

Core:

- build: compile TypeScript
- dev / mcp:server: run MCP server (live tsx)
- test: full test run (default chrome unless BROWSERS set) + generate & open Allure
- test:chrome | test:firefox | test:safari | test:cross | test:all-browsers
- test:observe: headed multi-browser with observe pauses (set OBSERVE=1 / OBSERVE_END=1)
- test:smoke: smoke spec only
- test:a11y: accessibility spec only
- test:links: link health spec
- test:forms: form spec
- test:report: alias for test + allure generation
- test:all:stack: run full multi-browser UI suite (chrome,firefox,safari) then Postman Newsela API smoke, then open Allure
  API:
- postman:test: run sample Postman collection (outputs JUnit/XML, JSON, HTML to reports/api)
- postman:test:env: run custom COLLECTION & ENV provided via env vars
  Reporting:
- allure:generate: build static report from allure-results
- allure:open: serve an existing report
- allure:regen-open: generate then open (auto run after every test script)
  Maintenance:
- clean: remove build + report artifacts
- clean:reports: clear report folders but keep .gitkeep
- lint / lint:fix, format / format:check
- validate:workflow: YAML workflow validator script
- demo: run sample script in examples/

## Environment Variables

- BROWSERS=chrome,firefox,safari (default chrome)
- HEADLESS=1 (force headless for chrome/firefox)
- OBSERVE=1 (slow start & end pauses) + OBSERVE_END=1
- LOG_LEVEL=debug (override WDIO log level)
- SAFARI_TP=1 (use Safari Technology Preview)
- SKIP_ALLURE_OPEN=1 (suppress auto-open of report)
- CI (enables single retry for flaky specs)
- COLLECTION (path to a Postman collection for postman:test:env)
- ENV (path to a Postman environment JSON for postman:test:env)

## Reports

Generated under `reports/`:

- allure-results / allure-report
- json (daily aggregated JSON file)
- junit (daily XML)
- wdio (runner logs)
- chromedriver / geckodriver logs
- screenshots (only on failure)

## Directory Layout

- src/ : MCP server code & (future) page objects/utilities
- tests/ : spec files grouped by domain (smoke, accessibility, links, forms, etc.)
- scripts/ : utility scripts (clean-reports, validate-workflow)
- examples/ : demo usage
- reports/ : output artifacts (gitignored except keep files)

## Quick Start

Install & build:

```
npm install
npm run build
```

Run all test:

```
npm run test
```

Run smoke test:

```
npm run test:smoke
```

Cross-browser sample:

```
BROWSERS=chrome,firefox npm test
```

Headless run:

```
HEADLESS=1 npm test
```

Accessibility only:

```
npm run test:a11y
```

Skip report auto-open (CI):

```
SKIP_ALLURE_OPEN=1 npm test
```

## MCP Server

Start locally (compiled):

```
npm run build && npm start
```

Or direct TS execution:

```
npm run mcp:server
```

## Failure Artifacts

On test failure a PNG screenshot is saved under `reports/screenshots/` with a timestamp + test title.

## Cleaning

- Fast cleanup (keep folders): `npm run clean:reports`
- Full cleanup: `npm run clean`

## Postman / Newman API Tests

Newsela public smoke collection: `postman/collections/newsela-public-smoke.postman_collection.json` with environment `postman/environments/newsela-environment.json`.

Run Newsela smoke:

```
npm run postman:test
```

Custom collection + environment:

```
COLLECTION=postman/collections/another.postman_collection.json \
ENV=postman/environments/another-environment.json \
npm run postman:test:env
```

Outputs (created if missing):

- `reports/api/newman-results.xml` (JUnit)
- `reports/api/newman-results.json` (raw summary)
- Converted into Allure as suite "API Smoke" via `scripts/newman-to-allure.ts` (run automatically by `postman:test`).

Unified run (UI + API + Allure):

```
npm run test:all:stack
```

Add custom collection with Allure conversion:

```
COLLECTION=postman/collections/another.postman_collection.json \
ENV=postman/environments/another-environment.json \
npm run postman:test:env
```

Skip opening Allure UI (e.g. CI):

```
SKIP_ALLURE_OPEN=1 npm run test:all:stack
```

## License

MIT
