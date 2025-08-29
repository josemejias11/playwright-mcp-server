/// <reference types="@wdio/globals" />
import type { Options } from '@wdio/types';

// Allow selecting browsers via env var, e.g. BROWSERS=chrome,firefox,safari
const requestedBrowsers = (process.env.BROWSERS || 'chrome')
  .split(',')
  .map((b) => b.trim().toLowerCase())
  .filter(Boolean);

// Define canonical per-browser capability templates (adjusted dynamically for OBSERVE / VISIBLE modes)
const capabilityCatalog: Record<string, any> = {
  chrome: (() => {
    const observe = !!process.env.OBSERVE;
    const visible = !!process.env.VISIBLE; // stronger guarantee of a real, foreground window
    const argsBase: string[] = [];

    if (!visible) {
      // Standard stability flags (omit in VISIBLE to avoid any chance of suppression/minimization)
      argsBase.push('--no-sandbox', '--disable-dev-shm-usage');
    }

    // Window sizing / visibility helpers
    argsBase.push(visible ? '--new-window' : '--window-size=1920,1080');

    if (process.env.HEADLESS) argsBase.push('--headless=new');
    if (observe) argsBase.push('--auto-open-devtools-for-tabs', '--start-maximized');
    if (visible) {
      // Create isolated temp profile so Chrome always launches a fresh, showing window
      argsBase.push('--user-data-dir=/tmp/wdio-visible-profile');
      // Remove any GPU disabling in visible mode; ensure accelerated path
    } else if (!observe) {
      // Only disable GPU in fully automated non-observe mode
      argsBase.push('--disable-gpu');
    }

    return {
      browserName: 'chrome',
      'goog:chromeOptions': { args: argsBase },
      acceptInsecureCerts: true,
      maxInstances: visible ? 1 : 5,
    };
  })(),
  firefox: (() => {
    const observe = !!process.env.OBSERVE;
    const visible = !!process.env.VISIBLE;
    const ffArgs: string[] = [];
    if (process.env.HEADLESS) ffArgs.push('-headless');
    if ((observe || visible) && !process.env.HEADLESS) ffArgs.push('-foreground');
    // Force a clean temporary profile in visible mode (prevents restored hidden state)
    if (visible) {
      ffArgs.push('-profile', '/tmp/wdio-visible-ff-profile');
    }
    return {
      browserName: 'firefox',
      'moz:firefoxOptions': ffArgs.length ? { args: ffArgs } : {},
      acceptInsecureCerts: true,
      maxInstances: visible ? 1 : 3,
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

  maxInstances: process.env.VISIBLE ? 1 : 10,
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

  // Optional observe pauses to help visually confirm Chrome/Firefox windows appear.
  // Enable with OBSERVE=1. Adjust start/end durations with OBSERVE_AT_START_MS / OBSERVE_END_MS.
  before: async function () {
    if (process.env.OBSERVE) {
      const ms = Number(process.env.OBSERVE_AT_START_MS || 5000);
      console.log(`[observe] Start pause ${ms}ms so you can see the browser window.`);
      await browser.pause(ms);
    }
    if (process.env.VISIBLE) {
      console.log('[visible] VISIBLE=1 enabled: running sequentially with simplified args to ensure windows appear.');
    }
  },

  after: async function () {
    if (process.env.OBSERVE && process.env.OBSERVE_END) {
      const ms = Number(process.env.OBSERVE_END_MS || 15000);
      console.log(`[observe] End pause ${ms}ms before session quits.`);
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
