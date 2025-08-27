#!/usr/bin/env node

/**
 * Royal Caribbean Test Runner
 * Quick test to validate the flexible framework with Royal Caribbean
 */

import { BaseTestFramework } from './framework/base-test-framework.js';
import { createHomePage } from './page-objects/homepage-factory.js';
import { TestConfig } from './config/test-config.js';

class RoyalCaribbeanQuickTest extends BaseTestFramework {
  constructor() {
    super();
    this.homePage = null;
  }

  async runQuickTest() {
    await this.startTesting('Royal Caribbean Quick Validation');
    
    try {
      // Initialize page objects
      this.homePage = createHomePage(this.client);
      
      await this.logger.business(`🚢 Testing ${TestConfig.website.name} (${TestConfig.website.type})`);
      await this.logger.business(`🌐 URL: ${TestConfig.baseUrl}`);
      
      // Navigate to homepage
      await this.homePage.navigate();
      await this.homePage.waitForPageReady();
      
      // Validate we're on Royal Caribbean
      const validation = await this.homePage.validateRoyalCaribbeanPage();
      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.reason}`);
      }
      
      await this.logger.business(`✅ Successfully loaded Royal Caribbean`);
      if (validation.indicators) {
        await this.logger.business(`🔍 Found indicators: ${validation.indicators.join(', ')}`);
      }
      
      // Get hero content
      const title = await this.homePage.getHeroTitle();
      await this.logger.business(`📝 Hero title: "${title}"`);
      
      // Check for cruise search
      const hasSearch = await this.homePage.isCruiseSearchVisible();
      await this.logger.business(`🔍 Cruise search form: ${hasSearch ? 'Found' : 'Not found'}`);
      
      // Get destinations
      const destinations = await this.homePage.getDestinations();
      if (destinations.length > 0) {
        await this.logger.business(`🗺️ Available destinations: ${destinations.slice(0, 5).join(', ')}`);
      }
      
      // Get featured deals
      const deals = await this.homePage.getFeaturedDeals();
      if (deals.length > 0) {
        await this.logger.business(`💰 Featured deals found: ${deals.length}`);
        deals.slice(0, 2).forEach((deal, index) => {
          this.logger.business(`   ${index + 1}. ${deal.title}${deal.price ? ` - ${deal.price}` : ''}`);
        });
      }
      
      // Take screenshot
      await this.homePage.captureScreenshot('royal-caribbean-homepage');
      
      // Test navigation to different sections
      await this.logger.business(`🧪 Testing navigation...`);
      
      // Try to navigate to deals
      try {
        await this.homePage.navigateToDeals();
        await new Promise(resolve => setTimeout(resolve, 3000));
        await this.homePage.captureScreenshot('royal-caribbean-deals');
        await this.logger.business(`✅ Successfully navigated to deals page`);
      } catch (e) {
        await this.logger.business(`⚠️ Could not navigate to deals: ${e.message}`);
      }
      
      await this.logger.summary(`🎉 Royal Caribbean quick test completed successfully!`);
      
    } catch (error) {
      await this.logger.error(`❌ Royal Caribbean test failed: ${error.message}`);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Execute test if run directly
if (import.meta.url === new URL(process.argv[1], 'file://').href) {
  const test = new RoyalCaribbeanQuickTest();
  await test.runQuickTest();
}

export { RoyalCaribbeanQuickTest };
