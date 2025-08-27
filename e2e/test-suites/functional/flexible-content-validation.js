#!/usr/bin/env node

/**
 * Flexible Content Validation Tests
 * 
 * Purpose: Verify business requirements and content accuracy for any website
 * Frequency: Daily CI/CD
 * Timeout: 15 minutes max
 * 
 * Adaptable framework that tests content based on website type and configuration
 */

import { BaseTestFramework } from '../../framework/base-test-framework.js';
import { createHomePage } from '../../page-objects/homepage-factory.js';
import { TestConfig } from '../../config/test-config.js';

class FlexibleContentValidationTests extends BaseTestFramework {
  constructor() {
    super();
    this.homePage = null;
    this.websiteConfig = TestConfig.website;
  }

  async initializePageObjects() {
    this.homePage = createHomePage(this.client);
  }

  /**
   * CONTENT TEST 1: Homepage Brand Messaging (Adaptive)
   */
  async testHomepageBrandMessaging() {
    await this.executeTest(`${this.websiteConfig.name} Homepage Brand Messaging`, async () => {
      await this.homePage.navigate();
      await this.homePage.waitForPageReady();
      
      // Validate page is correct website
      const validation = await this.homePage.validateWebsite();
      if (!validation) {
        throw new Error(`Not on expected website: ${this.websiteConfig.name}`);
      }
      
      // Get hero content
      const title = await this.homePage.getHeroTitle();
      
      // Website-specific validations
      if (this.websiteConfig.type === 'cruise-booking') {
        await this.validateCruiseContent(title);
      }
      
      await this.logger.business(`✓ ${this.websiteConfig.name} brand messaging validated: ${title}`);
    });
  }

  /**
   * Validate cruise-specific content
   */
  async validateCruiseContent(title) {
    const cruiseKeywords = ['cruise', 'vacation', 'ship', 'sail', 'caribbean', 'royal'];
    const hasRelevantContent = cruiseKeywords.some(keyword => 
      title.toLowerCase().includes(keyword)
    );
    
    if (!hasRelevantContent) {
      await this.logger.business(`⚠️ Title may not be cruise-related: ${title}`);
    }
    
    // Check for cruise search functionality
    const hasSearch = await this.homePage.isCruiseSearchVisible();
    if (hasSearch) {
      await this.logger.business('✓ Cruise search functionality detected');
    }
    
    // Get featured destinations
    const destinations = await this.homePage.getDestinations();
    if (destinations.length > 0) {
      await this.logger.business(`✓ Found destinations: ${destinations.slice(0, 3).join(', ')}`);
    }
  }

  /**
   * CONTENT TEST 2: Navigation Structure (Adaptive)
   */
  async testNavigationStructure() {
    await this.executeTest(`${this.websiteConfig.name} Navigation Structure`, async () => {
      const navItems = await this.homePage.getTextBySelectors(
        this.websiteConfig.selectors.navigation.menuItems
      );
      
      if (!navItems || navItems.length === 0) {
        throw new Error('No navigation items found');
      }
      
      await this.logger.business(`✓ Navigation structure validated with ${navItems.length} items`);
      
      // Website-specific navigation checks
      if (this.websiteConfig.type === 'cruise-booking') {
        await this.validateCruiseNavigation(navItems);
      }
    });
  }

  async validateCruiseNavigation(navItems) {
    const expectedItems = ['cruise', 'destination', 'ship', 'deal', 'plan'];
    const foundItems = expectedItems.filter(item => 
      navItems.some(nav => nav.toLowerCase().includes(item))
    );
    
    await this.logger.business(`✓ Found cruise navigation items: ${foundItems.join(', ')}`);
  }

  /**
   * CONTENT TEST 3: Interactive Elements (Adaptive)
   */
  async testInteractiveElements() {
    await this.executeTest(`${this.websiteConfig.name} Interactive Elements`, async () => {
      if (this.websiteConfig.type === 'cruise-booking') {
        await this.testCruiseInteractions();
      }
      
      // Take screenshot of interactive state
      await this.homePage.captureScreenshot('interactive-elements');
    });
  }

  async testCruiseInteractions() {
    // Test main CTA
    const ctaResult = await this.homePage.clickMainCTA();
    if (ctaResult.success) {
      await this.logger.business('✓ Main CTA clickable');
      
      // Wait a moment for any loading
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Test search functionality if available
    const searchResult = await this.homePage.searchForCruises({
      destination: 'Caribbean',
      guests: 2
    });
    
    if (searchResult.destination || searchResult.search) {
      await this.logger.business('✓ Search functionality working');
    }
  }

  /**
   * CONTENT TEST 4: Performance and Accessibility Basics
   */
  async testBasicPerformance() {
    await this.executeTest(`${this.websiteConfig.name} Basic Performance`, async () => {
      const pageInfo = await this.homePage.getPageInfo();
      
      await this.logger.performance(`Page load completed for ${this.websiteConfig.name}`);
      await this.logger.performance(`URL: ${pageInfo.url}`);
      await this.logger.performance(`Title: ${pageInfo.title}`);
      
      // Basic accessibility check
      const hasH1 = await this.homePage.findElementBySelectors(['h1']);
      if (hasH1.success) {
        await this.logger.accessibility('✓ H1 heading found');
      } else {
        await this.logger.accessibility('⚠️ No H1 heading found');
      }
    });
  }

  /**
   * Run all content validation tests
   */
  async runAllTests() {
    await this.startTesting(`${this.websiteConfig.name} Content Validation Suite`);
    
    try {
      await this.initializePageObjects();
      
      await this.testHomepageBrandMessaging();
      await this.testNavigationStructure();
      await this.testInteractiveElements();
      await this.testBasicPerformance();
      
      await this.logger.summary(`✅ ${this.websiteConfig.name} content validation completed successfully`);
      
    } catch (error) {
      await this.logger.error(`❌ Content validation failed: ${error.message}`);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Execute tests if run directly
if (import.meta.url === new URL(process.argv[1], 'file://').href) {
  const tests = new FlexibleContentValidationTests();
  await tests.runAllTests();
}
