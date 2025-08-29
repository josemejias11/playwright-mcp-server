/// <reference types="@wdio/globals" />
import type { Options } from '@wdio/types';

// Allow selecting browsers via env var, e.g. BROWSERS=chrome,firefox,safari
const requestedBrowsers = (process.env.BROWSERS || 'chrome')
  .split(',')
  .map((b) => b.trim().toLowerCase())
  .filter(Boolean);

// Define canonical per-browser capability templates
const capabilityCatalog: Record<string, any> = {
  chrome: {
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: [
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--window-size=1920,1080',
        ...(process.env.HEADLESS ? ['--headless=new'] : []),
      ],
    },
    acceptInsecureCerts: true,
    maxInstances: 5,
  },
  firefox: {
    browserName: 'firefox',
    // Add headless if CI sets HEADLESS=1
    'moz:firefoxOptions': process.env.HEADLESS ? { args: ['-headless'] } : {},
    acceptInsecureCerts: true,
    maxInstances: 3,
  },
  safari: {
    browserName: 'safari',
    // Safari Technology Preview can be toggled with SAFARI_TP=1
    ...(process.env.SAFARI_TP ? { 'safari.options': { technologyPreview: true } } : {}),
    acceptInsecureCerts: true,
    maxInstances: 1, // Safari is less parallel-friendly locally
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

  maxInstances: 10,
  // Dynamically generated capability list based on BROWSERS env var
  capabilities: resolvedCapabilities.length ? resolvedCapabilities : [capabilityCatalog.chrome],

  // Allow overriding log level (e.g. LOG_LEVEL=debug) for CI troubleshooting
  logLevel: (process.env.LOG_LEVEL as any) || 'info',
  bail: 0,
  baseUrl: 'https://newsela.com',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  // Centralize all outputs to reports folder
  outputDir: './reports/wdio',

  services: [
    ['chromedriver', { outputDir: './reports/chromedriver' }],
    // Geckodriver for Firefox (only started if firefox requested)
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

  beforeTest: async function (test, context) {
    // Short defensive wait for network-heavy marketing pages to settle
    await browser.pause(150);
  },

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
