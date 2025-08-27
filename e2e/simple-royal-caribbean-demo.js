#!/usr/bin/env node

/**
 * Simple Royal Caribbean Demo
 * Basic visual and functionality testing for demo purposes
 */

import { BaseTestFramework } from './framework/base-test-framework.js';

class SimpleRoyalCaribbeanDemo extends BaseTestFramework {
  constructor() {
    super();
    this.baseUrl = 'https://www.royalcaribbean.com';
  }

  /**
   * Demo Test: Royal Caribbean Homepage
   */
  async testRoyalCaribbeanHomepage() {
    await this.executeTest('Royal Caribbean Homepage Demo', async () => {
      // Navigate to Royal Caribbean
      await this.logger.business('🚢 Navigating to Royal Caribbean...');
      await this.client.navigateTo(this.baseUrl);
      
      // Wait for page to load
      await this.client.waitForElement('body');
      await this.sleep(3000);
      
      // Take screenshot
      await this.logger.business('📸 Capturing homepage screenshot...');
      await this.client.takeScreenshot('e2e/artifacts/royal-caribbean-demo.png', true);
      
      // Get page info
      const pageInfo = await this.client.getPageInfo();
      const title = pageInfo?.title || 'Page title not accessible';
      const url = pageInfo?.url || this.baseUrl;
      
      await this.logger.business(`📄 Page Title: ${title}`);
      await this.logger.business(`🌐 Current URL: ${url}`);
      
      // Check for Royal Caribbean branding
      const titleLower = title.toLowerCase();
      const hasRoyalCaribbean = titleLower.includes('royal caribbean') || titleLower.includes('cruise');
      await this.logger.business(`🏷️ Royal Caribbean Branding: ${hasRoyalCaribbean ? '✅ Found' : '⚠️ Not detected'}`);
      
      // Look for main heading
      const headingResult = await this.client.getText('h1');
      if (headingResult.success && headingResult.output) {
        await this.logger.business(`📝 Main Heading: "${headingResult.output}"`);
      } else {
        await this.logger.business('📝 Main Heading: Not found or not accessible');
      }
      
      // Check for navigation
      const navResult = await this.client.waitForElement('nav');
      await this.logger.business(`🧭 Navigation: ${navResult.success ? '✅ Found' : '❌ Not found'}`);
      
      // Look for cruise-related content
      const cruiseContent = await this.client.evaluateJavaScript(`
        (() => {
          const content = document.body.textContent.toLowerCase();
          const keywords = ['cruise', 'ship', 'destination', 'vacation', 'caribbean'];
          const found = keywords.filter(keyword => content.includes(keyword));
          const buttonCount = document.querySelectorAll('button, .btn, [type="submit"]').length;
          return { keywords: found, buttons: buttonCount };
        })()
      `);
      
      if (cruiseContent.success && cruiseContent.output) {
        const data = cruiseContent.output;
        const keywords = data.keywords || [];
        await this.logger.business(`🔑 Cruise Keywords: ${keywords.join(', ') || 'None detected'}`);
        await this.logger.business(`🔘 Interactive Elements: ${data.buttons || 0} buttons found`);
      } else {
        await this.logger.business('🔑 Content analysis: Unable to analyze page content');
      }
      
      // Test basic interaction
      await this.logger.business('🎯 Testing basic interactions...');
      try {
        const clickResult = await this.clickElement('button, .btn, [type="submit"]', { timeout: 2000 });
        if (clickResult.success) {
          await this.logger.business('✅ Successfully interacted with page element');
          await this.sleep(2000);
          await this.client.takeScreenshot('e2e/artifacts/royal-caribbean-interaction.png', false);
        } else {
          await this.logger.business('⚠️ No interactive elements found or clickable');
        }
      } catch (error) {
        await this.logger.business('⚠️ Interaction test skipped - continuing demo');
      }
      
      await this.logger.business('🎉 Royal Caribbean demo completed successfully!');
    });
  }

  /**
   * Run the demo
   */
  async runDemo() {
    await this.initialize('Royal Caribbean Demo');
    
    try {
      await this.logger.business('🎬 Starting Royal Caribbean Demo...');
      await this.logger.business(`🎯 Target: ${this.baseUrl}`);
      
      await this.testRoyalCaribbeanHomepage();
      
      await this.logger.business('✅ Demo completed! Check e2e/artifacts/ for screenshots.');
      
    } catch (error) {
      await this.logger.error(`❌ Demo failed: ${error.message}`);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Execute demo if run directly
if (import.meta.url === new URL(process.argv[1], 'file://').href) {
  const demo = new SimpleRoyalCaribbeanDemo();
  await demo.runDemo();
}

export { SimpleRoyalCaribbeanDemo };
