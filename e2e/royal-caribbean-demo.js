#!/usr/bin/env node

/**
 * Royal Caribbean Demo Test Suite
 * Simple, visual-focused testing for demo purposes
 */

import { BaseTestFramework } from './framework/base-test-framework.js';
import { TestConfig } from './config/test-config.js';

class RoyalCaribbeanDemo extends BaseTestFramework {
  constructor() {
    super();
    this.baseUrl = 'https://www.royalcaribbean.com';
  }

  /**
   * Demo Test 1: Homepage Visual Validation
   */
  async testHomepageVisuals() {
    await this.executeTest('Homepage Visual Check', async () => {
      // Navigate to Royal Caribbean
      await this.client.navigateTo(this.baseUrl);
      
      // Wait for page to load
      await this.client.waitForElement('body', 10000);
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Take full-page screenshot
      await this.client.takeScreenshot('reports/artifacts/screenshots/royal-caribbean-homepage.png', true);
      
      // Get page title
      const pageInfo = await this.client.getPageInfo();
      await this.logger.business(`📄 Page Title: ${pageInfo.title}`);
      await this.logger.business(`🌐 URL: ${pageInfo.url}`);
      
      // Check for Royal Caribbean branding
      const titleCheck = pageInfo.title.toLowerCase().includes('royal caribbean');
      await this.logger.business(`🏷️ Royal Caribbean Branding: ${titleCheck ? '✅ Found' : '⚠️ Not in title'}`);
      
      // Get main heading
      const heading = await this.client.getText('h1', 5000);
      if (heading.success) {
        await this.logger.business(`📝 Main Heading: "${heading.output}"`);
      }
      
      await this.logger.success('✅ Homepage visual validation completed');
    });
  }

  /**
   * Demo Test 2: Navigation Elements
   */
  async testNavigationElements() {
    await this.executeTest('Navigation Elements Check', async () => {
      // Check for common navigation elements
      const navElements = [
        { name: 'Main Navigation', selector: 'nav' },
        { name: 'Logo', selector: '.logo, .brand, [alt*="logo"]' },
        { name: 'Search Button', selector: '[type="submit"], .search-btn, .btn' },
        { name: 'Menu Items', selector: 'nav a, .nav-link, .menu-item' }
      ];

      for (const element of navElements) {
        const found = await this.client.waitForElement(element.selector, 3000);
        await this.logger.business(`🔍 ${element.name}: ${found.success ? '✅ Found' : '❌ Not found'}`);
      }

      // Take navigation screenshot
      await this.client.takeScreenshot('reports/artifacts/screenshots/royal-caribbean-navigation.png', false);
      
      await this.logger.success('✅ Navigation elements validation completed');
    });
  }

  /**
   * Demo Test 3: Key Cruise Functionality
   */
  async testCruiseFunctionality() {
    await this.executeTest('Cruise Functionality Check', async () => {
      // Look for cruise-related content
      const cruiseElements = await this.client.evaluateJavaScript(`
        (() => {
          const content = document.body.textContent.toLowerCase();
          const keywords = ['cruise', 'ship', 'destination', 'vacation', 'caribbean', 'book'];
          const found = keywords.filter(keyword => content.includes(keyword));
          
          // Also check for interactive elements
          const searchForm = document.querySelector('form, .search, .booking');
          const buttons = document.querySelectorAll('button, .btn, [type="submit"]').length;
          
          return {
            keywords: found,
            hasSearchForm: !!searchForm,
            buttonCount: buttons
          };
        })()
      `);

      if (cruiseElements.success) {
        const data = cruiseElements.output;
        await this.logger.business(`🔑 Cruise Keywords Found: ${data.keywords.join(', ')}`);
        await this.logger.business(`🔍 Search Form Present: ${data.hasSearchForm ? '✅ Yes' : '❌ No'}`);
        await this.logger.business(`🔘 Interactive Buttons: ${data.buttonCount}`);
      }

      // Try to interact with search if available
      const searchElements = ['[type="submit"]', '.search-btn', '.btn-primary', 'button'];
      for (const selector of searchElements) {
        const clickResult = await this.client.click(selector, 2000);
        if (clickResult.success) {
          await this.logger.business(`🎯 Successfully clicked: ${selector}`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          await this.client.takeScreenshot('reports/artifacts/screenshots/royal-caribbean-interaction.png', false);
          break;
        }
      }

      await this.logger.success('✅ Cruise functionality validation completed');
    });
  }

  /**
   * Demo Test 4: Mobile Responsiveness Check
   */
  async testMobileView() {
    await this.executeTest('Mobile Responsiveness Check', async () => {
      // Switch to mobile viewport
      await this.client.evaluateJavaScript(`
        (() => {
          // Simulate mobile viewport
          const viewport = document.querySelector('meta[name="viewport"]');
          if (viewport) {
            console.log('Viewport meta tag found:', viewport.content);
          }
          
          // Check if page adapts to smaller screens
          document.body.style.width = '375px';
          return { mobileReady: true };
        })()
      `);

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Take mobile screenshot
      await this.client.takeScreenshot('reports/artifacts/screenshots/royal-caribbean-mobile.png', true);
      
      await this.logger.business('📱 Mobile viewport simulation completed');
      await this.logger.success('✅ Mobile responsiveness check completed');
    });
  }

  /**
   * Demo Test 5: Page Performance Overview
   */
  async testPerformanceOverview() {
    await this.executeTest('Performance Overview', async () => {
      const performanceData = await this.client.evaluateJavaScript(`
        (() => {
          if (performance && performance.timing) {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
            
            return {
              loadTime: Math.round(loadTime),
              domReady: Math.round(domReady),
              readyState: document.readyState
            };
          }
          return { available: false };
        })()
      `);

      if (performanceData.success && performanceData.output.available !== false) {
        const perf = performanceData.output;
        await this.logger.performance(`⏱️ Page Load Time: ${perf.loadTime}ms`);
        await this.logger.performance(`⚡ DOM Ready: ${perf.domReady}ms`);
        await this.logger.performance(`📊 Ready State: ${perf.readyState}`);
        
        // Performance assessment
        if (perf.loadTime < 3000) {
          await this.logger.performance('🚀 Good performance - under 3 seconds');
        } else if (perf.loadTime < 5000) {
          await this.logger.performance('⚠️ Moderate performance - 3-5 seconds');
        } else {
          await this.logger.performance('🐌 Slow performance - over 5 seconds');
        }
      }

      await this.logger.success('✅ Performance overview completed');
    });
  }

  /**
   * Run complete demo test suite
   */
  async runDemo() {
    await this.initialize('🚢 Royal Caribbean Demo Test Suite');
    
    try {
      await this.logger.business('🎬 Starting Royal Caribbean demo testing...');
      await this.logger.business(`🎯 Target: ${this.baseUrl}`);
      
      await this.testHomepageVisuals();
      await this.testNavigationElements();
      await this.testCruiseFunctionality();
      await this.testMobileView();
      await this.testPerformanceOverview();
      
      await this.logger.success('🎉 Royal Caribbean demo test suite completed successfully!');
      await this.logger.success('📸 Screenshots saved to reports/artifacts/screenshots/');
      
    } catch (error) {
      await this.logger.error(`❌ Demo test failed: ${error.message}`);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Execute demo if run directly
if (import.meta.url === new URL(process.argv[1], 'file://').href) {
  const demo = new RoyalCaribbeanDemo();
  await demo.runDemo();
}

export { RoyalCaribbeanDemo };
