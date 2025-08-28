#!/usr/bin/env node

/**
 * Newsela Educational Platform - Critical Path Smoke Tests
 * 
 * Purpose: Verify core educational functionality - run first, fail fast
 * Frequency: Every deployment
 * Timeout: 5 minutes max
 * 
 * Tests the absolutely critical educational user journeys that must work
 * for the learning platform to function. If these fail, block deployment.
 */

import { BaseTestFramework } from '../../framework/base-test-framework.js';
import { NewselaHomePage } from '../../page-objects/homepage.js';
import { NewselaContactPage } from '../../page-objects/contact-page.js';

class NewselaCriticalPathSmokeTests extends BaseTestFramework {
  constructor() {
    super();
    this.homePage = null;
    this.contactPage = null;
  }

  async initializePageObjects() {
    this.homePage = new NewselaHomePage(this.client);
    this.contactPage = new NewselaContactPage(this.client);
  }

  /**
   * SMOKE TEST 1: Educational Platform Availability
   * Critical: Learning platform must be accessible
   */
  async testWebsiteAvailability() {
    await this.executeTest('Educational Platform Availability Check', async () => {
      await this.homePage.navigate();
      
      // Simple check - if we can navigate and get educational content, platform is accessible
      const title = await this.homePage.getHeroTitle();
      if (!title || title.length < 3) {
        throw new Error('Educational platform not accessible - no content loaded');
      }
      
      await this.logger.business(`✓ Educational platform accessible and responsive`);
      await this.logger.business(`✓ Content loaded: ${title}`);
    }, { timeout: 10000 });
  }

  /**
   * SMOKE TEST 2: Educational Homepage Core Elements
   * Critical: Educational branding and learning functionality
   */
  async testHomepageCoreElements() {
    await this.executeTest('Educational Homepage Core Elements', async () => {
      await this.homePage.navigate();
      
      // Check educational title/branding
      const title = await this.homePage.getHeroTitle();
      if (!title || title.length < 3) {
        throw new Error('Educational title missing or too short');
      }
      
      // Check educational navigation exists
      const navigation = await this.homePage.validateNavigation();
      if (!navigation || navigation.length === 0) {
        throw new Error('Educational navigation not found');
      }
      
      // Check for grade level filters (critical for educational platform)
      const gradeLevels = await this.homePage.validateGradeLevels();
      
      await this.logger.business(`✓ Educational title found: ${title}`);
      await this.logger.business(`✓ Navigation elements: ${navigation.length}`);
      await this.logger.business(`✓ Grade level filters: ${gradeLevels ? 'Found' : 'Not detected'}`);
    }, { timeout: 8000 });
  }

  /**
   * SMOKE TEST 3: Educational Content Access
   * Critical: Students must be able to access articles and content
   */
  async testEducationalContentAccess() {
    await this.executeTest('Educational Content Access', async () => {
      // Check for article elements on homepage
      const articles = await this.homePage.validateArticleElements();
      if (!articles || articles.length === 0) {
        throw new Error('No educational articles found - critical learning impact');
      }
      
      // Check for subject categories
      const subjects = await this.homePage.validateSubjectCategories();
      if (!subjects || subjects.length === 0) {
        throw new Error('No subject categories found - critical curriculum impact');
      }
      
      // Verify search functionality for educational content
      const searchFunctional = await this.homePage.validateSearchFunctionality();
      if (!searchFunctional) {
        throw new Error('Search functionality not working - critical student impact');
      }
      
      await this.logger.business(`✓ Educational articles found: ${articles.length}`);
      await this.logger.business(`✓ Subject categories: ${subjects.length}`);
      await this.logger.business(`✓ Search functionality: Working`);
    }, { timeout: 10000 });
  }

  /**
   * SMOKE TEST 4: Educational Contact Support
   * Critical: Teachers/educators must be able to get support
   */
  async testEducationalContactSupport() {
    await this.executeTest('Educational Contact Support', async () => {
      // Navigate to contact page
      await this.contactPage.navigate();
      
      // Verify educator support form structure
      const formStructure = await this.contactPage.validateFormStructure();
      if (!formStructure.hasForm) {
        throw new Error('Educator support form not found - critical support impact');
      }
      
      // Verify educational support information
      const supportInfo = await this.contactPage.validateSupportInfo();
      if (!supportInfo.hasEmail && !supportInfo.hasPhone) {
        throw new Error('No educational support contact found - critical support impact');
      }
      
      await this.logger.business(`✓ Educator support form found with ${formStructure.fieldCount} fields`);
      await this.logger.business(`✓ Support info: Email=${supportInfo.hasEmail}, Phone=${supportInfo.hasPhone}`);
    }, { timeout: 10000 });
  }

  /**
   * Run all critical educational path smoke tests
   */
  async runSmokeTests() {
    try {
      await this.initialize('Newsela Educational Critical Path Smoke Tests', 'chromium');
      await this.initializePageObjects();
      
      // Run tests in order of educational criticality
      await this.testWebsiteAvailability();
      await this.testHomepageCoreElements();
      await this.testEducationalContentAccess();
      await this.testEducationalContactSupport();
      
      const summary = this.getTestSummary();
      await this.logger.suiteEnd('Educational Critical Path Smoke Tests Complete', summary);
      
      // Critical: All educational smoke tests must pass
      if (summary.failed > 0) {
        throw new Error(`CRITICAL: ${summary.failed}/${summary.total} educational smoke tests failed - BLOCK DEPLOYMENT`);
      }
      
      await this.logger.success('🎉 All educational critical path smoke tests PASSED - Deployment approved');
      
    } catch (error) {
      await this.logger.error(`💥 EDUCATIONAL CRITICAL FAILURE: ${error.message}`);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Execute educational smoke tests
async function main() {
  const smokeTests = new NewselaCriticalPathSmokeTests();
  
  // Set a timeout for the entire educational smoke test suite
  const timeoutId = setTimeout(() => {
    console.error('⏰ CRITICAL: Educational smoke tests timed out after 5 minutes');
    process.exit(1);
  }, 300000); // 5 minutes
  
  try {
    await smokeTests.runSmokeTests();
    clearTimeout(timeoutId);
    console.log('✅ EDUCATIONAL SMOKE TESTS PASSED - Safe to deploy Newsela');
    process.exit(0);
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('❌ EDUCATIONAL SMOKE TESTS FAILED - DO NOT DEPLOY NEWSELA');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ CRITICAL EDUCATIONAL SMOKE TEST FAILURE:', error);
  process.exit(1);
});
