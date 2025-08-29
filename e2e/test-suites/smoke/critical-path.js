#!/usr/bin/env node

/**
 * Newsela Educational Platform - Critical Path Smoke Tests
 * 
 * Purpose: Verify core educational platform functionality - run first, fail fast
 * Frequency: Every deployment
 * Timeout: 5 minutes max
 * 
 * Tests the absolutely critical educational user journeys that must work
 * for the learning platform to function. If these fail, block deployment.
 */

import { BaseTestFramework } from '../../framework/base-test-framework.js';

class NewselaEducationalSmokeTests extends BaseTestFramework {
  constructor() {
    super();
  }

  /**
   * SMOKE TEST 1: Educational Platform Availability
   * Critical: Learning platform must be accessible
   */
  async testEducationalPlatformAvailability() {
    await this.executeTest('Educational Platform Availability Check', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      // Handle cookie consent
      try {
        const cookieResult = await this.client.click('button:has-text("Accept All Cookies")', 3000);
        if (cookieResult.success) {
          await this.logger.info('✓ Cookie consent handled');
        }
      } catch (e) {
        // Continue if no cookie banner
      }
      
      // Check for educational content - main hero message
      const heroResult = await this.client.getText('h1, .hero, [data-testid="hero"]', 10000);
      if (!heroResult.success || !heroResult.output || heroResult.output.length < 10) {
        throw new Error('Educational platform not accessible - no educational content loaded');
      }
      
      await this.logger.business(`✓ Educational platform accessible and responsive`);
      await this.logger.business(`✓ Educational content loaded: ${heroResult.output.substring(0, 100)}...`);
    }, { timeout: 15000 });
  }

  /**
   * SMOKE TEST 2: Luna AI Assistant Availability
   * Critical: AI-powered teaching assistant must be discoverable
   */
  async testLunaAIAvailability() {
    await this.executeTest('Luna AI Teaching Assistant Discovery', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      // Look for Luna mentions on homepage
      const lunaContentResult = await this.client.getText('body', 10000);
      if (!lunaContentResult.success || !lunaContentResult.output.toLowerCase().includes('luna')) {
        throw new Error('Luna AI assistant not prominently featured - critical educational feature missing');
      }
      
      // Try to find Luna-specific link or button
      const lunaLinkResult = await this.client.waitForElement('a[href*="luna"], button:has-text("Luna"), a:has-text("Luna")', 'visible', 5000);
      const hasLunaLink = lunaLinkResult.success;
      
      await this.logger.business(`✓ Luna AI assistant mentioned on homepage`);
      await this.logger.business(`✓ Luna navigation link: ${hasLunaLink ? 'Found' : 'Text mention only'}`);
    }, { timeout: 10000 });
  }

  /**
   * SMOKE TEST 3: Educational Product Navigation
   * Critical: Teachers must be able to access educational products
   */
  async testEducationalProductAccess() {
    await this.executeTest('Educational Product Navigation', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      // Check for main educational products mentioned on the page
      const contentResult = await this.client.getText('body', 10000);
      if (!contentResult.success) {
        throw new Error('Cannot access page content for educational product validation');
      }
      
      const content = contentResult.output.toLowerCase();
      const educationalProducts = {
        'ELA': content.includes('ela') || content.includes('english language arts'),
        'Social Studies': content.includes('social studies'),
        'Science': content.includes('science'),
        'Formative': content.includes('formative')
      };
      
      const availableProducts = Object.entries(educationalProducts).filter(([name, available]) => available);
      
      if (availableProducts.length < 3) {
        throw new Error(`Insufficient educational products visible - only ${availableProducts.length} found`);
      }
      
      await this.logger.business(`✓ Educational products found: ${availableProducts.map(([name]) => name).join(', ')}`);
    }, { timeout: 8000 });
  }

  /**
   * SMOKE TEST 4: Teacher Sign-up Flow
   * Critical: Teachers must be able to access the platform
   */
  async testTeacherSignupAccess() {
    await this.executeTest('Teacher Sign-up Access', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      // Look for sign-up related elements
      const signupSelectors = [
        'a:has-text("Sign up")', 
        'a:has-text("Get started")', 
        'button:has-text("Get started")',
        'a[href*="join"]',
        'a[href*="signup"]'
      ];
      
      let signupFound = false;
      for (const selector of signupSelectors) {
        try {
          const result = await this.client.waitForElement(selector, 'visible', 2000);
          if (result.success) {
            signupFound = true;
            await this.logger.business(`✓ Teacher signup found via: ${selector}`);
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      if (!signupFound) {
        throw new Error('Teacher sign-up access not found - critical onboarding issue');
      }
      
      // Also check for login access
      const loginResult = await this.client.waitForElement('a:has-text("Log in"), a:has-text("Sign in")', 'visible', 3000);
      const hasLogin = loginResult.success;
      
      await this.logger.business(`✓ Teacher login access: ${hasLogin ? 'Found' : 'Not found'}`);
    }, { timeout: 8000 });
  }

  /**
   * SMOKE TEST 5: Educational Content Preview
   * Critical: Content must be accessible for evaluation
   */
  async testEducationalContentPreview() {
    await this.executeTest('Educational Content Preview Access', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      // Look for content preview or demo access
      const previewSelectors = [
        'a:has-text("preview")',
        'a:has-text("demo")', 
        'a:has-text("Try")',
        'a:has-text("Lite")',
        'button:has-text("Explore")'
      ];
      
      let previewFound = false;
      for (const selector of previewSelectors) {
        try {
          const result = await this.client.waitForElement(selector, 'visible', 2000);
          if (result.success) {
            previewFound = true;
            await this.logger.business(`✓ Content preview found via: ${selector}`);
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      // Check page content mentions preview or trial options
      const contentResult = await this.client.getText('body', 5000);
      if (contentResult.success) {
        const content = contentResult.output.toLowerCase();
        const hasPreviewMention = content.includes('preview') || content.includes('lite') || content.includes('free') || content.includes('trial');
        
        if (hasPreviewMention) {
          previewFound = true;
          await this.logger.business(`✓ Content preview mentioned in text`);
        }
      }
      
      if (!previewFound) {
        throw new Error('Educational content preview not accessible - teachers cannot evaluate platform');
      }
    }, { timeout: 8000 });
  }

  async runSmokeTests() {
    try {
      console.log('\n🚨 NEWSELA EDUCATIONAL PLATFORM - CRITICAL PATH SMOKE TESTS');
      console.log('==========================================================');
      console.log('⚠️  If these tests fail, DO NOT DEPLOY EDUCATIONAL PLATFORM');
      console.log('');

      await this.testEducationalPlatformAvailability();
      await this.testLunaAIAvailability();
      await this.testEducationalProductAccess();
      await this.testTeacherSignupAccess();
      await this.testEducationalContentPreview();

      // Generate summary
      const summary = this.getTestSummary();
      console.log('\n📊 EDUCATIONAL SMOKE TEST SUMMARY');
      console.log('=================================');
      console.log(`Total Educational Tests: ${summary.total}`);
      console.log(`Passed: ${summary.passed}`);
      console.log(`Failed: ${summary.failed}`);
      console.log(`Educational Platform Success Rate: ${Math.round((summary.passed / summary.total) * 100)}%`);
      
      if (summary.failed > 0) {
        throw new Error(`${summary.failed} critical educational smoke tests failed`);
      }
      
    } catch (error) {
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Execute educational smoke tests
async function main() {
  const smokeTests = new NewselaEducationalSmokeTests();
  
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
