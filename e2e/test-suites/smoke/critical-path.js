#!/usr/bin/env node

/**
 * Critical Path Smoke Tests
 * 
 * Purpose: Verify core functionality - run first, fail fast
 * Frequency: Every deployment
 * Timeout: 5 minutes max
 * 
 * Tests the absolutely critical user journeys that must work
 * for the business to function. If these fail, block deployment.
 */

import { BaseTestFramework } from '../../framework/base-test-framework.js';
import { ExampleHomePage } from '../../page-objects/homepage.js';
import { ExampleContactPage } from '../../page-objects/contact-page.js';

class CriticalPathSmokeTests extends BaseTestFramework {
  constructor() {
    super();
    this.homePage = null;
    this.contactPage = null;
  }

  async initializePageObjects() {
    this.homePage = new ExampleHomePage(this.client);
    this.contactPage = new ExampleContactPage(this.client);
  }

  /**
   * SMOKE TEST 1: Website Availability
   * Critical: Site must be accessible
   */
  async testWebsiteAvailability() {
    await this.executeTest('Website Availability Check', async () => {
      await this.homePage.navigate();
      
      // Simple check - if we can navigate and get page content, the site is accessible
      const title = await this.homePage.getHeroTitle();
      if (!title || title.length < 3) {
        throw new Error('Website not accessible - no content loaded');
      }
      
      await this.logger.business(`✓ Website accessible and responsive`);
      await this.logger.business(`✓ Content loaded: ${title}`);
    }, { timeout: 10000 });
  }

  /**
   * SMOKE TEST 2: Homepage Core Elements
   * Critical: Brand presence and basic functionality
   */
  async testHomepageCoreElements() {
    await this.executeTest('Homepage Core Elements', async () => {
      await this.homePage.navigate();
      
      // Check hero title/branding
      const title = await this.homePage.getHeroTitle();
      if (!title || title.length < 3) {
        throw new Error('Hero title missing or too short');
      }
      
      // Check navigation exists
      const navigation = await this.homePage.validateNavigation();
      if (!navigation || navigation.length === 0) {
        throw new Error('Navigation not found');
      }
      
      await this.logger.business(`✓ Hero title found: ${title}`);
      await this.logger.business(`✓ Navigation elements: ${navigation.length}`);
    }, { timeout: 8000 });
  }

  /**
   * SMOKE TEST 3: Contact Path Accessibility
   * Critical: Lead generation pathway must work
   */
  async testContactPathAccessibility() {
    await this.executeTest('Contact Path Accessibility', async () => {
      // Navigate to contact page
      await this.contactPage.navigate();
      
      // Verify contact form structure
      const formStructure = await this.contactPage.validateFormStructure();
      if (!formStructure.hasForm) {
        throw new Error('Contact form not found - critical business impact');
      }
      
      // Verify basic contact information
      const companyInfo = await this.contactPage.validateCompanyInfo();
      if (!companyInfo.hasEmail && !companyInfo.hasPhone) {
        throw new Error('No contact information found - critical business impact');
      }
      
      await this.logger.business(`✓ Contact form found with ${formStructure.fieldCount} fields`);
      await this.logger.business(`✓ Contact info: Email=${companyInfo.hasEmail}, Phone=${companyInfo.hasPhone}`);
    }, { timeout: 10000 });
  }

  /**
   * Run all critical path smoke tests
   */
  async runSmokeTests() {
    try {
      await this.initialize('Critical Path Smoke Tests', 'chromium');
      await this.initializePageObjects();
      
      // Run tests in order of criticality
      await this.testWebsiteAvailability();
      await this.testHomepageCoreElements();
      await this.testContactPathAccessibility();
      
      const summary = this.getTestSummary();
      await this.logger.suiteEnd('Critical Path Smoke Tests Complete', summary);
      
      // Critical: All smoke tests must pass
      if (summary.failed > 0) {
        throw new Error(`CRITICAL: ${summary.failed}/${summary.total} smoke tests failed - BLOCK DEPLOYMENT`);
      }
      
      await this.logger.success('🎉 All critical path smoke tests PASSED - Deployment approved');
      
    } catch (error) {
      await this.logger.error(`💥 CRITICAL FAILURE: ${error.message}`);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Execute smoke tests
async function main() {
  const smokeTests = new CriticalPathSmokeTests();
  
  // Set a timeout for the entire smoke test suite
  const timeoutId = setTimeout(() => {
    console.error('⏰ CRITICAL: Smoke tests timed out after 5 minutes');
    process.exit(1);
  }, 300000); // 5 minutes
  
  try {
    await smokeTests.runSmokeTests();
    clearTimeout(timeoutId);
    console.log('✅ SMOKE TESTS PASSED - Safe to deploy');
    process.exit(0);
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('❌ SMOKE TESTS FAILED - DO NOT DEPLOY');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ CRITICAL SMOKE TEST FAILURE:', error);
  process.exit(1);
});
