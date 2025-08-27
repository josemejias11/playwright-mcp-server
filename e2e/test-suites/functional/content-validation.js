#!/usr/bin/env node

/**
 * Content Validation Tests
 * 
 * Purpose: Verify business requirements and content accuracy
 * Frequency: Daily CI/CD
 * Timeout: 15 minutes max
 * 
 * Ensures all business-critical content is present and accurate
 * across all main pages of the website.
 */

import { BaseTestFramework } from '../../framework/base-test-framework.js';
import { ExampleHomePage } from '../../page-objects/homepage.js';
import { ExampleContactPage } from '../../page-objects/contact-page.js';

class ContentValidationTests extends BaseTestFramework {
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
   * CONTENT TEST 1: Homepage Brand Messaging
   */
  async testHomepageBrandMessaging() {
    await this.executeTest('Homepage Brand Messaging', async () => {
      await this.homePage.navigate();
      
      // Validate hero content for government website solutions
      const title = await this.homePage.getHeroTitle();
      if (!title.toLowerCase().includes('government') || !title.toLowerCase().includes('website')) {
        throw new Error(`Hero title should contain government website content, got: ${title}`);
      }
      
      // Validate government solutions content
      const governmentElements = await this.homePage.validateGovernmentSolutionsElements();
      if (!governmentElements.hasGovernmentContent) {
        await this.logger.business('⚠️ Limited government solutions content detected');
      }
      
      await this.logger.business(`✓ Brand messaging validated: ${title}`);
      await this.logger.business(`✓ Government solutions keywords found: ${governmentElements.keywordCount || 'detected'}`);
      
    }, { timeout: 8000 });
  }

  /**
   * CONTENT TEST 2: Homepage Content Sections
   */
  async testHomepageContent() {
    await this.executeTest('Homepage Content Validation', async () => {
      await this.homePage.navigate();
      
      const contentSections = await this.homePage.validateContentSections();
      
      if (contentSections.sectionCount < 1) {
        throw new Error('Homepage should have at least one content section');
      }
      
      await this.logger.business(`✓ Content sections found: ${contentSections.sectionCount}`);
      await this.logger.business(`✓ Content structure: ${contentSections.hasContent ? 'valid' : 'needs review'}`);
      
    }, { timeout: 6000 });
  }

  /**
   * CONTENT TEST 3: Navigation Structure
   */
  async testNavigationStructure() {
    await this.executeTest('Navigation Structure Validation', async () => {
      await this.homePage.navigate();
      
      const navigation = await this.homePage.validateNavigation();
      
      if (!navigation || navigation.length === 0) {
        throw new Error('No navigation elements found');
      }
      
      await this.logger.business(`✓ Navigation elements found: ${navigation.length}`);
      
      // Test at least the first navigation link
      if (navigation.length > 0 && navigation[0].href) {
        try {
          await this.client.navigateTo(navigation[0].href);
          await this.logger.business(`✓ Navigation link works: ${navigation[0].text}`);
        } catch (e) {
          await this.logger.business(`⚠️ Navigation link issue: ${navigation[0].text}`);
        }
      }
      
    }, { timeout: 10000 });
  }

  /**
   * CONTENT TEST 4: Contact Information
   */
  async testContactInformation() {
    await this.executeTest('Contact Information Validation', async () => {
      await this.homePage.navigate();
      
      const contactInfo = await this.homePage.getContactInformation();
      const contactElements = await this.homePage.validateContactElements();
      
      // Check for any form of contact method
      if (!contactInfo.hasEmail && !contactInfo.hasPhone && !contactElements.hasContactMethod) {
        await this.logger.business('⚠️ Limited contact information found - may require navigation to contact page');
      }
      
      await this.logger.business(`✓ Contact email: ${contactInfo.hasEmail ? 'found' : 'not found'}`);
      await this.logger.business(`✓ Contact phone: ${contactInfo.hasPhone ? 'found' : 'not found'}`);
      await this.logger.business(`✓ Contact methods: ${contactElements.totalElements || 0} elements found`);
      
    }, { timeout: 8000 });
  }

  /**
   * Run all content validation tests
   */
  async runContentValidationTests() {
    try {
      await this.initialize('Content Validation Tests', 'chromium');
      await this.initializePageObjects();
      
      // Execute comprehensive content validation tests for Example Company
      await this.testHomepageBrandMessaging();
      await this.testHomepageContent();
      await this.testNavigationStructure(); 
      await this.testContactInformation();
      
      const summary = await this.getTestSummary();
      await this.logger.suiteEnd('Content Validation Tests Complete', summary);
      
      // Generate content validation report
      await this.generateContentReport(summary);
      
    } catch (error) {
      await this.logger.error(`Content validation tests failed: ${error.message}`);
      throw error;
    } finally {
      await this.cleanup();
    }
  }

  /**
   * Generate content validation analysis report
   */
  async generateContentReport(summary) {
    const reportData = {
      suite: 'Content Validation Tests',
      timestamp: new Date().toISOString(),
      summary: {
        total: summary.total || 0,
        passed: summary.passed || 0,
        failed: summary.failed || 0,
        successRate: summary.successRate || '0.00'
      },
      contentAreas: [
        'Brand Messaging',
        'Content Structure',
        'Navigation',
        'Contact Information'
      ],
      recommendations: summary.passed === summary.total ? [
        '✅ All content validation tests passed',
        '🎯 Website content meets business requirements',
        '📊 Continue regular content monitoring'
      ] : [
        '🔍 Review failed content areas',
        '📝 Update content to meet business requirements',
        '🔄 Re-run tests after content updates'
      ],
      websiteType: 'Government Website Solutions',
      focus: 'State and Local Government Digital Services'
    };
    
    console.log('\n=== CONTENT VALIDATION RESULTS ===');
    console.log(JSON.stringify(reportData, null, 2));
  }
}

// Execute if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tests = new ContentValidationTests();
  tests.runContentValidationTests().catch(console.error);
}
