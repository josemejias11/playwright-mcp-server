/// <reference types="@wdio/globals" />
import type { Options } from '@wdio/types';

// GOAL: Always show real browser windows by default.
// Headless will ONLY be enabled if you explicitly set HEADLESS=1.
// Use BROWSERS=chrome,firefox,safari (comma separated) to choose browsers.

// Allow selecting browsers via env var, e.g. BROWSERS=chrome,firefox,safari
const requestedBrowsers = (process.env.BROWSERS || 'chrome')
  .split(',')
  .map((b) => b.trim().toLowerCase())
  .filter(Boolean);

// Define canonical per-browser capability templates (adjusted dynamically for OBSERVE / VISIBLE modes)
interface BrowserCaps { [k: string]: any }

const HEADLESS = process.env.HEADLESS === '1';
const SHOW_DEVTOOLS = !!process.env.OBSERVE; // reuse OBSERVE flag to also open devtools

const uniqueRunId = Date.now();

const capabilityCatalog: Record<string, BrowserCaps> = {
  chrome: (() => {
    // Explicit window size for consistent viewport
    const args: string[] = ['--window-size=1920,1080', '--new-window'];
    if (HEADLESS) args.push('--headless=new');
    if (SHOW_DEVTOOLS && !HEADLESS) args.push('--auto-open-devtools-for-tabs');
    return {
      browserName: 'chrome',
      acceptInsecureCerts: true,
      'goog:chromeOptions': { args },
      maxInstances: 1, // sequential to keep focus
    };
  })(),
  firefox: (() => {
    const ffArgs: string[] = [];
    if (HEADLESS) {
      ffArgs.push('-headless', '-width', '1920', '-height', '1080');
    }
    return {
      browserName: 'firefox',
      acceptInsecureCerts: true,
      'moz:firefoxOptions': ffArgs.length ? { args: ffArgs } : {},
      maxInstances: 1,
    };
  })(),
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

  maxInstances: 1, // force sequential so each window shows in foreground
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

  beforeTest: async function (test) {
    if ((browser as any).__firstTestHandled !== true) {
      (browser as any).__firstTestHandled = true;
      console.log('[visibility] First test: giving 1200ms for window to fully paint at 1920x1080.');
      await browser.pause(1200);
      try {
        const size = await browser.getWindowSize();
        console.log(`[visibility] Actual window size: ${size.width}x${size.height}`);
        // Take a screenshot even if passing to prove we had a window
        await browser.saveScreenshot(`./reports/screenshots/FIRST_${Date.now()}_${test.title}.png`);
      } catch {}
    } else {
      await browser.pause(150);
    }
  },

  // Optional observe pauses to help visually confirm Chrome/Firefox windows appear.
  // Enable with OBSERVE=1. Adjust start/end durations with OBSERVE_AT_START_MS / OBSERVE_END_MS.
  before: async function () {
    console.log('[debug] Requested browsers:', requestedBrowsers);
    console.log('[debug] Headless mode:', process.env.HEADLESS === '1');
    // Navigate to blank so we always create a foreground tab, then enforce 1920x1080 size
    try {
      await browser.url('about:blank');
      await browser.pause(100); // allow window to appear
      await browser.setWindowSize(1920, 1080);
    } catch (e) {
      // non-fatal
    }
    // Fallback retry if session seems not ready
    try {
      if (!(await browser.getTitle())) {
        console.log('[visibility] Blank title after first load, retrying navigation.');
        await browser.url('about:blank');
        await browser.pause(300);
      }
    } catch {}
    if (SHOW_DEVTOOLS && !HEADLESS) {
      const ms = Number(process.env.OBSERVE_AT_START_MS || 4000);
      console.log(`[observe] Pause ${ms}ms for manual inspection.`);
      await browser.pause(ms);
    }
  },

  after: async function () {
    if (SHOW_DEVTOOLS && process.env.OBSERVE_END) {
      const ms = Number(process.env.OBSERVE_END_MS || 5000);
      console.log(`[observe] End pause ${ms}ms before quit.`);
      await browser.pause(ms);
    }
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
