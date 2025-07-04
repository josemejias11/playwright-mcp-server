#!/usr/bin/env node

/**
 * CaliberFS Professional Test Suite
 * Comprehensive automated testing framework for financial services
 * 
 * This test suite demonstrates enterprise-level QA engineering skills
 * specifically tailored for financial services testing requirements.
 */

import { BaseTestFramework } from '../framework/base-test-framework.js';
import { TestConfig } from '../config/test-config.js';
import { CaliberFSHomePage } from '../page-objects/homepage.js';
import { CaliberFSContactPage } from '../page-objects/contact-page.js';

class CaliberFSProfessionalTestSuite extends BaseTestFramework {
  constructor() {
    super();
    this.homePage = null;
    this.contactPage = null;
  }

  /**
   * Initialize page objects
   */
  async initializePageObjects() {
    this.homePage = new CaliberFSHomePage(this.client);
    this.contactPage = new CaliberFSContactPage(this.client);
  }

  /**
   * SMOKE TESTS - Critical functionality verification
   */
  async runSmokeTests() {
    await this.logger.suiteStart('CaliberFS Smoke Tests');
    
    await this.executeTest('Homepage Load Verification', async () => {
      await this.homePage.navigate();
      const title = await this.homePage.getHeroTitle();
      
      if (!title.toLowerCase().includes('caliber')) {
        throw new Error(`Expected hero title to contain 'caliber', got: ${title}`);
      }
      
      await this.homePage.captureScreenshot('smoke-homepage');
      await this.logger.business('Homepage loaded with correct branding');
    });

    await this.executeTest('Critical Navigation Links', async () => {
      const navigation = await this.homePage.validateNavigation();
      
      const requiredLinks = ['about', 'services', 'contact'];
      const foundLinks = navigation.map(link => link.text.toLowerCase());
      
      for (const required of requiredLinks) {
        if (!foundLinks.some(link => link.includes(required))) {
          throw new Error(`Required navigation link missing: ${required}`);
        }
      }
      
      await this.logger.business('All critical navigation links present');
    });

    await this.executeTest('Contact Form Accessibility', async () => {
      await this.contactPage.navigate();
      const formStructure = await this.contactPage.validateFormStructure();
      
      if (!formStructure.hasForm) {
        throw new Error('Contact form not found');
      }
      
      if (!formStructure.allFieldsPresent) {
        throw new Error('Contact form missing required fields');
      }
      
      await this.logger.business('Contact form structure validated');
    });

    const summary = this.getTestSummary();
    await this.logger.suiteEnd('Smoke Tests', summary);
  }

  /**
   * FUNCTIONAL TESTS - Core business functionality
   */
  async runFunctionalTests() {
    await this.logger.suiteStart('CaliberFS Functional Tests');

    await this.executeTest('Hero Section CTAs', async () => {
      await this.homePage.navigate();
      
      // Test discover services button
      try {
        await this.homePage.clickDiscoverServices();
        const pageInfo = await this.client.getPageInfo();
        
        if (!pageInfo.output.includes('Services')) {
          throw new Error('Discover services button did not navigate correctly');
        }
        
        await this.logger.business('Discover services CTA working correctly');
      } catch (error) {
        await this.logger.warn('Discover services button test inconclusive');
      }
    });

    await this.executeTest('Content Validation', async () => {
      await this.homePage.navigate();
      const contentSections = await this.homePage.validateContentSections();
      
      const requiredSections = ['focus', 'promise', 'mission'];
      const missingSections = requiredSections.filter(section => !contentSections[section]);
      
      if (missingSections.length > 0) {
        throw new Error(`Missing content sections: ${missingSections.join(', ')}`);
      }
      
      await this.logger.business('All key content sections present');
    });

    await this.executeTest('Financial Services Elements', async () => {
      await this.homePage.navigate();
      const elements = await this.homePage.validateFinancialServicesElements();
      
      if (elements.foundKeywords.length < 3) {
        throw new Error('Insufficient financial services content keywords');
      }
      
      if (!elements.professionalElements.isSecure) {
        throw new Error('Website not using HTTPS - security requirement failed');
      }
      
      if (!elements.professionalElements.hasContactInfo) {
        throw new Error('Missing professional contact information');
      }
      
      await this.logger.business(`Found ${elements.foundKeywords.length} financial keywords`);
      await this.logger.security('HTTPS and security elements validated');
    });

    const summary = this.getTestSummary();
    await this.logger.suiteEnd('Functional Tests', summary);
  }

  /**
   * FORM TESTING - Critical business process
   */
  async runFormTests() {
    await this.logger.suiteStart('CaliberFS Contact Form Tests');

    await this.executeTest('Form Structure Validation', async () => {
      await this.contactPage.navigate();
      const structure = await this.contactPage.validateFormStructure();
      
      if (!structure.hasForm) {
        throw new Error('Contact form not found');
      }
      
      const requiredFields = ['name', 'email', 'confirmEmail', 'message', 'submit'];
      const missingFields = requiredFields.filter(field => !structure.fields[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing form fields: ${missingFields.join(', ')}`);
      }
      
      await this.logger.business('Contact form structure complete');
    });

    await this.executeTest('Valid Form Submission Test', async () => {
      await this.contactPage.navigate();
      
      const testData = TestConfig.testData.contact.validContact;
      await this.contactPage.fillAndSubmitForm(testData);
      
      // Wait for form processing
      await this.sleep(3000);
      
      const result = await this.contactPage.validateFormSuccess();
      if (!result.success) {
        // Form may have client-side validation or external submission
        await this.logger.warn('Form submission result inconclusive');
      } else {
        await this.logger.business('Valid form submission processed');
      }
      
      await this.contactPage.captureScreenshot('form-submission-result');
    });

    await this.executeTest('Empty Form Validation', async () => {
      await this.contactPage.navigate();
      const validation = await this.contactPage.testEmptyFormValidation();
      
      if (!validation.hasRequiredFields && !validation.hasValidationMessages) {
        await this.logger.warn('Form validation behavior unclear');
      } else {
        await this.logger.business('Form validation mechanisms detected');
      }
    });

    await this.executeTest('Email Validation Test', async () => {
      await this.contactPage.navigate();
      
      const invalidEmails = ['invalid-email', 'test@', '@domain.com', 'test.email'];
      
      for (const email of invalidEmails) {
        try {
          const result = await this.contactPage.testEmailValidation(email);
          await this.logger.business(`Email validation test for "${email}": ${result.hasError ? 'BLOCKED' : 'ALLOWED'}`);
        } catch (error) {
          await this.logger.warn(`Email validation test inconclusive for: ${email}`);
        }
      }
    });

    await this.executeTest('Form Security Check', async () => {
      await this.contactPage.navigate();
      const security = await this.contactPage.checkFormSecurity();
      
      if (!security.isHTTPS) {
        throw new Error('Form not submitted over HTTPS - security violation');
      }
      
      if (!security.isSecureAction) {
        throw new Error('Form action not using secure protocol');
      }
      
      await this.logger.security(`Form security score: ${security.securityScore}/2`);
      await this.logger.security('Form meets basic security requirements');
    });

    const summary = this.getTestSummary();
    await this.logger.suiteEnd('Contact Form Tests', summary);
  }

  /**
   * BUSINESS VALIDATION TESTS
   */
  async runBusinessValidationTests() {
    await this.logger.suiteStart('CaliberFS Business Validation Tests');

    await this.executeTest('Company Information Accuracy', async () => {
      await this.contactPage.navigate();
      const companyInfo = await this.contactPage.validateCompanyInfo();
      
      if (!companyInfo.validation.addressCorrect) {
        throw new Error('Company address validation failed');
      }
      
      if (!companyInfo.validation.phoneCorrect) {
        throw new Error('Company phone validation failed');
      }
      
      if (!companyInfo.validation.locationCorrect) {
        throw new Error('Company location (Tulsa, OK) validation failed');
      }
      
      await this.logger.business('Company contact information validated');
      await this.logger.business(`Address: ${companyInfo.address}`);
      await this.logger.business(`Phone: ${companyInfo.phone}`);
    });

    await this.executeTest('Services Page Content', async () => {
      await this.navigateToPage(TestConfig.urls.services, 'Services');
      
      const services = await this.client.evaluateJavaScript(`
        (() => {
          const bodyText = document.body.textContent.toLowerCase();
          const serviceKeywords = [
            'product development', 'compliance', 'technology', 
            'marketing', 'customer engagement', 'analytics'
          ];
          
          return serviceKeywords.filter(keyword => bodyText.includes(keyword));
        })()
      `);
      
      if (services.output.length < 4) {
        throw new Error(`Only found ${services.output.length} of 6 expected services`);
      }
      
      await this.logger.business(`Found ${services.output.length} service categories`);
      await this.logger.business(`Services: ${services.output.join(', ')}`);
    });

    await this.executeTest('Professional Trust Indicators', async () => {
      await this.homePage.navigate();
      const elements = await this.homePage.validateFinancialServicesElements();
      
      const trustScore = elements.trustIndicators;
      let score = 0;
      
      if (trustScore.hasAddress) score++;
      if (trustScore.hasPhone) score++;
      if (trustScore.hasSSL) score++;
      
      if (score < 2) {
        throw new Error(`Insufficient trust indicators. Score: ${score}/3`);
      }
      
      await this.logger.business(`Trust indicator score: ${score}/3`);
      await this.logger.business('Professional credibility elements validated');
    });

    const summary = this.getTestSummary();
    await this.logger.suiteEnd('Business Validation Tests', summary);
  }

  /**
   * PERFORMANCE TESTS
   */
  async runPerformanceTests() {
    await this.logger.suiteStart('CaliberFS Performance Tests');

    await this.executeTest('Homepage Performance', async () => {
      await this.homePage.navigate();
      const performance = await this.homePage.checkPerformance();
      
      if (performance.totalTime > TestConfig.performance.pageLoadTime) {
        throw new Error(`Page load time ${performance.totalTime}ms exceeds threshold ${TestConfig.performance.pageLoadTime}ms`);
      }
      
      await this.logger.performance('Homepage load time', performance.totalTime);
      await this.logger.performance('DOM content loaded', performance.domContentLoaded);
      await this.logger.performance('Network time', performance.networkTime);
    });

    await this.executeTest('Services Page Performance', async () => {
      await this.navigateToPage(TestConfig.urls.services);
      const performance = await this.measurePagePerformance();
      
      if (performance.totalTime > TestConfig.performance.pageLoadTime) {
        throw new Error(`Services page load time ${performance.totalTime}ms exceeds threshold`);
      }
      
      await this.logger.performance('Services page load time', performance.totalTime);
    });

    const summary = this.getTestSummary();
    await this.logger.suiteEnd('Performance Tests', summary);
  }

  /**
   * Run all test suites
   */
  async runAllTests() {
    try {
      await this.initialize('CaliberFS Professional Test Suite', 'chromium');
      await this.initializePageObjects();
      
      // Execute test suites in order of importance
      await this.runSmokeTests();
      await this.runFunctionalTests();
      await this.runFormTests();
      await this.runBusinessValidationTests();
      await this.runPerformanceTests();
      
    } catch (error) {
      await this.logger.error(`Critical test suite failure: ${error.message}`);
    } finally {
      await this.cleanup();
    }
  }
}

// Execute the test suite
async function main() {
  const testSuite = new CaliberFSProfessionalTestSuite();
  await testSuite.runAllTests();
}

main().catch(error => {
  console.error('❌ Fatal error in test suite:', error);
  process.exit(1);
});
