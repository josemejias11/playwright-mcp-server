/**
 * Base Test Framework for CaliberFS
 * Professional-grade test automation framework for financial services testing
 */

import { McpClient } from '../mcp-client.js';
import { TestLogger } from '../utils/test-logger.js';
import { TestConfig } from '../config/test-config.js';
import { TestReporter } from '../utils/test-reporter.js';

export class BaseTestFramework {
  constructor() {
    this.client = new McpClient(TestConfig.serverPath);
    this.logger = new TestLogger();
    this.reporter = new TestReporter();
    this.testResults = [];
    this.currentTestSuite = '';
    this.startTime = null;
  }

  /**
   * Initialize test framework and launch browser
   */
  async initialize(testSuiteName, browserType = 'chromium') {
    this.currentTestSuite = testSuiteName;
    this.startTime = Date.now();
    
    await this.logger.info(`Initializing ${testSuiteName} Test Suite`);
    await this.logger.info(`Framework: CaliberFS Professional Testing Framework v1.0`);
    
    try {
      await this.client.launchBrowser(browserType, TestConfig.headless);
      await this.logger.success(`Browser launched: ${browserType}`);
    } catch (error) {
      await this.logger.error(`Failed to launch browser: ${error.message}`);
      throw error;
    }
  }

  /**
   * Execute a test with proper error handling and reporting
   */
  async executeTest(testName, testFunction, options = {}) {
    const testStartTime = Date.now();
    const timeout = options.timeout || TestConfig.defaultTimeout;
    
    try {
      await this.logger.info(`Starting: ${testName}`);
      
      // Execute test with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`Test timeout after ${timeout}ms`)), timeout)
      );
      
      await Promise.race([testFunction(), timeoutPromise]);
      
      const duration = Date.now() - testStartTime;
      await this.logger.success(`Passed: ${testName} (${duration}ms)`);
      
      this.testResults.push({
        name: testName,
        status: 'PASSED',
        duration,
        timestamp: new Date().toISOString(),
        suite: this.currentTestSuite
      });
      
    } catch (error) {
      const duration = Date.now() - testStartTime;
      await this.logger.error(`❌ Failed: ${testName} - ${error.message}`);
      
      // Take screenshot on failure
      try {
        const screenshotPath = `e2e/artifacts/failure-${testName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.png`;
        await this.client.takeScreenshot(screenshotPath, true);
        await this.logger.info(`Failure screenshot saved: ${screenshotPath}`);
      } catch (screenshotError) {
        await this.logger.error(`Failed to capture screenshot: ${screenshotError.message}`);
      }
      
      this.testResults.push({
        name: testName,
        status: 'FAILED',
        duration,
        error: error.message,
        timestamp: new Date().toISOString(),
        suite: this.currentTestSuite
      });
      
      if (options.stopOnFailure) {
        throw error;
      }
    }
  }

  /**
   * Navigate to a page with validation
   */
  async navigateToPage(url, expectedTitle = null) {
    await this.client.navigateTo(url, 'load');
    
    // Validate page load
    const pageInfo = await this.client.getPageInfo();
    
    if (expectedTitle && !pageInfo.output.includes(expectedTitle)) {
      throw new Error(`Expected page title to contain "${expectedTitle}" but got "${pageInfo.output}"`);
    }
    
    await this.logger.info(`📄 Navigated to: ${url}`);
    return pageInfo;
  }

  /**
   * Wait for element with enhanced error reporting
   */
  async waitForElement(selector, state = 'visible', timeout = 30000) {
    try {
      await this.client.waitForElement(selector, state, timeout);
      return true;
    } catch (error) {
      await this.logger.error(`Element not found: ${selector} (state: ${state})`);
      throw new Error(`Element "${selector}" not found in state "${state}" within ${timeout}ms`);
    }
  }

  /**
   * Enhanced click with validation
   */
  async clickElement(selector, options = {}) {
    await this.waitForElement(selector, 'visible');
    
    if (options.validateClickable) {
      // Check if element is clickable
      const isClickable = await this.client.evaluateJavaScript(`
        (() => {
          const element = document.querySelector('${selector}');
          return element && !element.disabled && element.offsetParent !== null;
        })()
      `);
      
      if (!isClickable.output) {
        throw new Error(`Element "${selector}" is not clickable`);
      }
    }
    
    await this.client.clickElement(selector);
    await this.logger.info(`Clicked: ${selector}`);
  }

  /**
   * Enhanced form filling with validation
   */
  async fillForm(formData) {
    for (const [selector, value] of Object.entries(formData)) {
      await this.waitForElement(selector, 'visible');
      await this.client.fillInput(selector, value);
      await this.logger.info(`Filled "${selector}" with: ${value}`);
      
      // Wait a bit for any dynamic validation
      await this.sleep(200);
    }
  }

  /**
   * Validate text content
   */
  async validateText(selector, expectedText, options = {}) {
    const result = await this.client.getText(selector);
    const actualText = result.output;
    
    if (options.exact && actualText !== expectedText) {
      throw new Error(`Expected exact text "${expectedText}" but got "${actualText}"`);
    } else if (!options.exact && !actualText.includes(expectedText)) {
      throw new Error(`Expected text to contain "${expectedText}" but got "${actualText}"`);
    }
    
    await this.logger.info(`✓ Text validation passed: ${selector}`);
    return actualText;
  }

  /**
   * Performance measurement
   */
  async measurePagePerformance() {
    const performance = await this.client.evaluateJavaScript(`
      (() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          totalTime: navigation.loadEventEnd - navigation.fetchStart,
          networkTime: navigation.responseEnd - navigation.fetchStart
        };
      })()
    `);
    
    await this.logger.info(`Performance: ${JSON.stringify(performance.output)}`);
    return performance.output;
  }

  /**
   * Utility sleep function
   */
  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Clean up and generate report
   */
  async cleanup() {
    try {
      await this.client.closeBrowser();
      await this.logger.success('🔒 Browser closed successfully');
    } catch (error) {
      await this.logger.error(`Cleanup error: ${error.message}`);
    }
    
    const totalDuration = Date.now() - this.startTime;
    await this.reporter.generateReport({
      suiteName: this.currentTestSuite,
      results: this.testResults,
      totalDuration,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Get test summary
   */
  getTestSummary() {
    const passed = this.testResults.filter(r => r.status === 'PASSED').length;
    const failed = this.testResults.filter(r => r.status === 'FAILED').length;
    const total = this.testResults.length;
    
    return {
      total,
      passed,
      failed,
      successRate: total > 0 ? ((passed / total) * 100).toFixed(2) : 0
    };
  }
}
