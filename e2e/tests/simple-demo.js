#!/usr/bin/env node

/**
 * Simple CaliberFS Demo Test
 * A focused example showing core QA automation capabilities
 */

import { BaseTestFramework } from '../framework/base-test-framework.js';
import { CaliberFSHomePage } from '../page-objects/homepage.js';

class SimpleCaliberFSDemo extends BaseTestFramework {
  constructor() {
    super();
    this.homePage = null;
  }

  async initializePageObjects() {
    this.homePage = new CaliberFSHomePage(this.client);
  }

  /**
   * Demo Test 1: Basic Website Validation
   */
  async testBasicWebsiteValidation() {
    await this.executeTest('Basic Website Validation', async () => {
      // Navigate to homepage
      await this.homePage.navigate();
      
      // Check basic page properties
      const pageInfo = await this.client.getPageInfo();
      await this.logger.business(`✓ Page loaded: ${pageInfo.url}`);
      await this.logger.business(`✓ Page title: ${pageInfo.title}`);
      
      // Take a screenshot
      await this.homePage.captureScreenshot('homepage-demo');
      await this.logger.business('✓ Screenshot captured');
    });
  }

  /**
   * Demo Test 2: Contact Information Check
   */
  async testContactInformationCheck() {
    await this.executeTest('Contact Information Check', async () => {
      await this.homePage.navigate();
      
      // Simple check for contact information
      const hasContact = await this.client.evaluateJavaScript(`
        (() => {
          const text = document.body.textContent;
          const hasPhone = /\\d{3}[\\s.-]\\d{3}[\\s.-]\\d{4}/.test(text);
          const hasEmail = /@\\w+\\.\\w+/.test(text);
          return JSON.stringify({ hasPhone, hasEmail, text: text.substring(0, 100) + '...' });
        })()
      `);
      
      const result = JSON.parse(hasContact.output || hasContact.result || '{}');
      await this.logger.business(`✓ Phone found: ${result.hasPhone}`);
      await this.logger.business(`✓ Email found: ${result.hasEmail}`);
    });
  }

  /**
   * Demo Test 3: Navigation Test
   */
  async testBasicNavigation() {
    await this.executeTest('Basic Navigation Test', async () => {
      await this.homePage.navigate();
      
      // Find and test a navigation link
      const navTest = await this.client.evaluateJavaScript(`
        (() => {
          const links = document.querySelectorAll('a[href]');
          const validLinks = Array.from(links)
            .filter(link => link.href && !link.href.startsWith('javascript:'))
            .slice(0, 3);
          
          return JSON.stringify({
            totalLinks: links.length,
            validLinks: validLinks.length,
            sampleLinks: validLinks.map(link => ({ text: link.textContent.trim(), href: link.href }))
          });
        })()
      `);
      
      const nav = JSON.parse(navTest.output || navTest.result || '{}');
      await this.logger.business(`✓ Total links found: ${nav.totalLinks}`);
      await this.logger.business(`✓ Valid navigation links: ${nav.validLinks}`);
    });
  }

  /**
   * Run the simple demo
   */
  async runDemo() {
    try {
      await this.initialize('Simple CaliberFS Demo', 'chromium');
      await this.initializePageObjects();
      
      // Run 3 simple tests
      await this.testBasicWebsiteValidation();
      await this.testContactInformationCheck();
      await this.testBasicNavigation();
      
      // Show results
      const summary = this.getTestSummary();
      await this.logger.suiteEnd('Simple Demo Complete', summary);
      
      // Generate simple report
      const report = {
        demo: 'CaliberFS QA Automation Demo',
        timestamp: new Date().toISOString(),
        results: summary,
        message: 'This demonstrates basic QA automation capabilities using Playwright + MCP'
      };
      
      console.log('\n=== DEMO RESULTS ===');
      console.log(JSON.stringify(report, null, 2));
      
    } catch (error) {
      await this.logger.error(`Demo failed: ${error.message}`);
    } finally {
      await this.cleanup();
      console.log('Demo complete - browser closed');
    }
  }
}

// Run the demo
async function main() {
  const demo = new SimpleCaliberFSDemo();
  await demo.runDemo();
}

main().catch(error => {
  console.error('Demo error:', error);
  process.exit(1);
});
