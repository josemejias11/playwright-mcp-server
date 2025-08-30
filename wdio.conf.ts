/// <reference types="@wdio/globals" />
import type { Options } from '@wdio/types';

// - Multi-browser via BROWSERS=chrome,firefox,safari
// - 1440x900 window size (headed) enforced in a single place
// - Headless only if HEADLESS=1 (Chrome: --headless=new, Firefox: -headless)
// - Minimal hooks, only screenshot on failure

// Allow selecting browsers via env var, e.g. BROWSERS=chrome,firefox,safari
const requestedBrowsers = (process.env.BROWSERS || 'chrome')
  .split(',')
  .map((b) => b.trim().toLowerCase())
  .filter(Boolean);

// Define canonical per-browser capability templates (adjusted dynamically for OBSERVE / VISIBLE modes)
interface BrowserCaps {
  [k: string]: any;
}
const HEADLESS = process.env.HEADLESS === '1';

const capabilityCatalog: Record<string, BrowserCaps> = {
  chrome: {
    browserName: 'chrome',
    acceptInsecureCerts: true,
    'goog:chromeOptions': {
      args: ['--window-size=1440,900', ...(HEADLESS ? ['--headless=new'] : [])],
    },
    maxInstances: 1,
  },
  firefox: {
    browserName: 'firefox',
    acceptInsecureCerts: true,
    'moz:firefoxOptions': HEADLESS
      ? { args: ['-headless', '-width', '1440', '-height', '900'] }
      : {},
    maxInstances: 1,
  },
  safari: {
    browserName: 'safari',
    ...(process.env.SAFARI_TP ? { 'safari.options': { technologyPreview: true } } : {}),
    acceptInsecureCerts: true,
    maxInstances: 1,
  },
};

const resolvedCapabilities = requestedBrowsers
  .map((name) => capabilityCatalog[name])
  .filter(Boolean);

export const config: Options.Testrunner = {
  runner: 'local',

  // Hybrid approach: specs live in top-level tests/; shared code & page objects in src/
  specs: ['./tests/**/*.spec.ts'],
  // Exclude legacy root-level duplicates that should have been removed
  exclude: ['./tests/landing.spec.ts', './tests/site-functional.spec.ts'],
  autoCompileOpts: {
    tsNodeOpts: {
      transpileOnly: true,
      files: true,
    },
  },

  maxInstances: 1,
  // Dynamically generated capability list based on BROWSERS env var
  capabilities: resolvedCapabilities.length ? resolvedCapabilities : [capabilityCatalog.chrome],

  // Allow overriding log level (e.g. LOG_LEVEL=debug) for CI troubleshooting
  logLevel: (process.env.LOG_LEVEL as Options.Testrunner['logLevel']) || 'info',
  bail: 0,
  baseUrl: 'https://newsela.com',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  // Centralize all outputs to reports folder
  outputDir: './reports/wdio',

  services: [
    // Start only the services we actually need to avoid startup noise / failures
    ...(requestedBrowsers.includes('chrome')
      ? [['chromedriver', { outputDir: './reports/chromedriver' }]]
      : []),
    ...(requestedBrowsers.includes('firefox')
      ? [['geckodriver', { outputDir: './reports/geckodriver' }]]
      : []),
    // Safari: uses built-in safaridriver (no separate NPM service). Enable once via: `safaridriver --enable` and in Safari > Settings > Advanced > Allow Remote Automation.
    // No service entry required; WebDriver agent bundled with macOS.
  ] as any,

  framework: 'mocha',
  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: './reports/allure-results',
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
      },
    ],
    [
      'json',
      {
        outputDir: './reports/json',
        outputFileFormat: function (options: any) {
          return `results-${new Date().toISOString().split('T')[0]}.json`;
        },
      },
    ],
    [
      'junit',
      {
        outputDir: './reports/junit',
        outputFileFormat: function (options: any) {
          return `results-${new Date().toISOString().split('T')[0]}.xml`;
        },
      },
    ],
  ],

  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },

  // Retry flaky specs in CI once to mitigate transient network/content issues
  specFileRetries: process.env.CI ? 1 : 0,
  specFileRetriesDelay: 2,
  specFileRetriesDeferred: true,

  beforeTest: async function () {},

  // Optional observe pauses to help visually confirm Chrome/Firefox windows appear.
  // Enable with OBSERVE=1. Adjust start/end durations with OBSERVE_AT_START_MS / OBSERVE_END_MS.
  before: async function () {
    try {
      await browser.setWindowSize(1440, 900);
    } catch {}
  },

  after: async function () {},

  afterTest: async function (test, context, { error }) {
    if (error) {
      try {
        await browser.saveScreenshot(`./reports/screenshots/FAIL_${Date.now()}_${test.title}.png`);
      } catch (_) {
        /* ignore */
      }
    }
  },
};
