# QA Automation Stack

Simple TypeScript WebDriverIO + MCP server project for multi-browser UI, accessibility, links, forms, video, and smoke testing with Allure reporting.

## Tech

- TypeScript
- WebdriverIO (Mocha)
- Allure Reports (JSON + JUnit + Screenshots on failure)
- MCP server (Model Context Protocol) endpoint
- Axe-core (basic accessibility scan)
- Chromedriver / Geckodriver services
- Video playback testing (Wistia integration)

## Quick Start

Install & build:

```bash
npm run setup
```

Run all tests (all browsers):

```bash
npm test
```

Run smoke tests only:

```bash
npm run test:smoke
```

Run video playback tests:

```bash
npm run test:video
```

Single browser test:

```bash
npm run test:chrome
```

Headless run:

```bash
HEADLESS=1 npm test
```

Accessibility testing:

```bash
npm run test:a11y
```

Skip report auto-open (CI):

```bash
SKIP_ALLURE_OPEN=1 npm test
```

## Video Testing

The project includes comprehensive video playback testing for Newsela product pages:

- **Wistia Integration**: Detects and validates Wistia video players
- **Cross-Browser**: Tests video functionality across Chrome, Firefox, and Safari
- **Smart Detection**: Identifies video infrastructure and validates playback capability
- **Product Coverage**: Tests all main product pages (ELA, Social Studies, Science, Writing, Formative)

Run video tests:

```bash
npm run test:video
```

## MCP Server

Start locally (compiled):

```bash
npm run build && npm start
```

Or direct TS execution:

```bash
npm run mcp:server
```

## Scripts

### Core Development

- `build`: compile TypeScript
- `start`: run compiled MCP server
- `dev`: run MCP server in development mode (live tsx)
- `setup`: install dependencies and build
- `clean`: remove build + report artifacts
- `clean:reports`: clear report folders but keep .gitkeep

### Code Quality

- `lint`: check code style
- `lint:fix`: fix code style issues
- `format`: format code with Prettier
- `format:check`: check code formatting

### Testing

- `test`: full test suite on all browsers (Chrome, Firefox, Safari) + generate & open Allure
- `test:chrome`: run tests on Chrome only
- `test:firefox`: run tests on Firefox only
- `test:safari`: run tests on Safari only
- `test:observe`: headed multi-browser with observe pauses (set OBSERVE=1 / OBSERVE_END=1)

### Specific Test Suites

- `test:smoke`: smoke spec only
- `test:a11y`: accessibility spec only
- `test:links`: link health spec
- `test:forms`: form spec
- `test:video`: video playback validation across all browsers

### Reporting

- `allure:generate`: build static report from allure-results
- `allure:open`: serve an existing report
- `allure:regen-open`: generate then open (auto run after every test script)

### Utilities

- `mcp:server`: run MCP server directly
- `demo`: run sample script in examples/
- `validate:workflow`: YAML workflow validator script

## Environment Variables

- `BROWSERS=chrome,firefox,safari` (default: chrome)
- `HEADLESS=1` (force headless for chrome/firefox)
- `OBSERVE=1` (slow start & end pauses) + `OBSERVE_END=1`
- `LOG_LEVEL=debug` (override WDIO log level)
- `SAFARI_TP=1` (use Safari Technology Preview)
- `SKIP_ALLURE_OPEN=1` (suppress auto-open of report)
- `CI` (enables single retry for flaky specs)

## Reports

Generated under `reports/`:

- `allure-results` / `allure-report`
- `json` (daily aggregated JSON file)
- `junit` (daily XML)
- `wdio` (runner logs)
- `chromedriver` / `geckodriver` logs
- `screenshots` (only on failure)

## Directory Layout

- `src/` : MCP server code & utilities
- `tests/` : spec files grouped by domain
  - `smoke/` : basic functionality tests
  - `accessibility/` : a11y validation tests
  - `links/` : link health checks
  - `forms/` : form interaction tests
  - `functional/` : advanced feature tests (e.g., video playback)
  - `helpers/` : reusable test utilities
- `scripts/` : utility scripts (clean-reports, validate-workflow)
- `examples/` : demo usage
- `reports/` : output artifacts (gitignored except keep files)

## Failure Artifacts

On test failure a PNG screenshot is saved under `reports/screenshots/` with a timestamp + test title.

## Cleaning

- Fast cleanup (keep folders): `npm run clean:reports`
- Full cleanup: `npm run clean`

## License

MIT
