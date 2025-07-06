#!/usr/bin/env node

/**
 * CaliberFS Content Validation Tests
 * 
 * Purpose: Verify business requirements and content accuracy
 * Frequency: Daily CI/CD
 * Timeout: 15 minutes max
 * 
 * Ensures all business-critical content is present and accurate
 * across all main pages of the website.
 */

import { BaseTestFramework } from '../../framework/base-test-framework.js';
import { CaliberFSHomePage } from '../../page-objects/homepage.js';
import { CaliberFSContactPage } from '../../page-objects/contact-page.js';

class ContentValidationTests extends BaseTestFramework {
  constructor() {
    super();
    this.homePage = null;
    this.contactPage = null;
  }

  async initializePageObjects() {
    this.homePage = new CaliberFSHomePage(this.client);
    this.contactPage = new CaliberFSContactPage(this.client);
  }

  /**
   * CONTENT TEST 1: Homepage Brand Messaging
   */
  async testHomepageBrandMessaging() {
    await this.executeTest('Homepage Brand Messaging', async () => {
      await this.homePage.navigate();
      
      // Validate hero content
      const title = await this.homePage.getHeroTitle();
      if (!title.toLowerCase().includes('caliber')) {
        throw new Error(`Hero title should contain 'caliber', got: ${title}`);
      }
      
      // Validate financial services content
      const financialElements = await this.homePage.validateFinancialServicesElements();
      if (!financialElements.hasFinancialContent) {
        throw new Error('Homepage missing financial services content');
      }
      
      await this.logger.business(`✓ Brand messaging validated: ${title}`);
      await this.logger.business(`✓ Financial keywords found: ${financialElements.keywordCount}`);
      
    }, { timeout: 8000 });
  }

  /**
   * CONTENT TEST 2: About Page Company Information
   */
  async testAboutPageContent() {
    await this.executeTest('About Page Company Information', async () => {
      await this.navigateToPage('https://www.caliberfs.com/about', 'About');
      
      // Required content for financial services company
      const requiredContent = [
        'Caliber Financial Services',
        'Otoe-Missouria Tribe',
        'Our Values',
        'Our Vision'
      ];

      for (const content of requiredContent) {
        const contentExists = await this.client.evaluateJavaScript(`
          document.body.textContent.includes('${content}')
        `);
        
        if (!contentExists.success || !contentExists.output) {
          throw new Error(`Required company content missing: ${content}`);
        }
        
        await this.logger.business(`✓ Found required content: ${content}`);
      }
      
    }, { timeout: 10000 });
  }

  /**
   * CONTENT TEST 3: Services Page Offerings
   */
  async testServicesPageContent() {
    await this.executeTest('Services Page Content Validation', async () => {
      await this.navigateToPage('https://www.caliberfs.com/our-services', 'Our Services');
      
      // Core service areas that should be present
      const serviceAreas = [
        'Product Development',
        'Compliance',
        'Technology',
        'Marketing',
        'Customer Engagement',
        'Analytics'
      ];

      let foundServices = 0;
      for (const service of serviceAreas) {
        const serviceExists = await this.client.evaluateJavaScript(`
          document.body.textContent.includes('${service}')
        `);
        
        if (serviceExists.success && serviceExists.output) {
          foundServices++;
          await this.logger.business(`✓ Found service area: ${service}`);
        } else {
          await this.logger.warn(`Service area not found: ${service}`);
        }
      }
      
      if (foundServices < 3) {
        throw new Error(`Insufficient service content found: ${foundServices}/${serviceAreas.length}`);
      }
      
      await this.logger.business(`✓ Service content validated: ${foundServices}/${serviceAreas.length} areas found`);
      
    }, { timeout: 10000 });
  }

  /**
   * CONTENT TEST 4: Careers Page Information
   */
  async testCareersPageContent() {
    await this.executeTest('Careers Page Content Validation', async () => {
      await this.navigateToPage('https://www.caliberfs.com/careers', 'Careers');
      
      // Career-related content that should be present
      const careerContent = [
        'hiring',
        'people',
        'Career Development',
        'Culture',
        'Community'
      ];

      let foundCareerContent = 0;
      for (const content of careerContent) {
        const contentExists = await this.client.evaluateJavaScript(`
          document.body.textContent.toLowerCase().includes('${content.toLowerCase()}')
        `);
        
        if (contentExists.success && contentExists.output) {
          foundCareerContent++;
          await this.logger.business(`✓ Found career content: ${content}`);
        } else {
          await this.logger.warn(`Career content not found: ${content}`);
        }
      }
      
      if (foundCareerContent < 2) {
        throw new Error(`Insufficient career content found: ${foundCareerContent}/${careerContent.length}`);
      }
      
      await this.logger.business(`✓ Career content validated: ${foundCareerContent}/${careerContent.length} elements found`);
      
    }, { timeout: 10000 });
  }

  /**
   * CONTENT TEST 5: Contact Information Accuracy
   */
  async testContactInformationAccuracy() {
    await this.executeTest('Contact Information Accuracy', async () => {
      await this.contactPage.navigate();
      
      // Validate company contact information
      const companyInfo = await this.contactPage.validateCompanyInfo();
      
      if (!companyInfo.hasAddress && !companyInfo.hasPhone && !companyInfo.hasEmail) {
        throw new Error('No contact information found on contact page');
      }
      
      // Verify contact form is properly structured
      const formStructure = await this.contactPage.validateFormStructure();
      if (!formStructure.hasForm || formStructure.fieldCount < 2) {
        throw new Error('Contact form missing or insufficient fields');
      }
      
      await this.logger.business(`✓ Contact info: Address=${companyInfo.hasAddress}, Phone=${companyInfo.hasPhone}, Email=${companyInfo.hasEmail}`);
      await this.logger.business(`✓ Contact form: ${formStructure.fieldCount} fields available`);
      
    }, { timeout: 8000 });
  }

  /**
   * CONTENT TEST 6: Content Quality & SEO
   */
  async testContentQualityAndSEO() {
    await this.executeTest('Content Quality and SEO Validation', async () => {
      await this.homePage.navigate();
      
      // Check for proper heading structure
      const headingStructure = await this.client.evaluateJavaScript(`
        (() => {
          const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
          const h1s = document.querySelectorAll('h1');
          
          return {
            totalHeadings: headings.length,
            h1Count: h1s.length,
            hasProperStructure: h1s.length === 1 && headings.length > 0,
            headingTexts: Array.from(headings).slice(0, 3).map(h => h.textContent.trim())
          };
        })()
      `);
      
      const structure = JSON.parse(headingStructure.output);
      
      if (!structure.hasProperStructure) {
        throw new Error(`Improper heading structure: ${structure.h1Count} H1 tags, ${structure.totalHeadings} total headings`);
      }
      
      // Check for meta description
      const metaDescription = await this.client.evaluateJavaScript(`
        (() => {
          const meta = document.querySelector('meta[name="description"]');
          return meta ? meta.content : null;
        })()
      `);
      
      if (!metaDescription.output || metaDescription.output.length < 100) {
        await this.logger.warn('Meta description missing or too short for SEO');
      } else {
        await this.logger.business('✓ Meta description found and adequate length');
      }
      
      await this.logger.business(`✓ Heading structure: ${structure.totalHeadings} headings with ${structure.h1Count} H1`);
      
    }, { timeout: 8000 });
  }

  /**
   * Run all content validation tests
   */
  async runContentValidationTests() {
    try {
      await this.initialize('Content Validation Tests', 'chromium');
      await this.initializePageObjects();
      
      // Execute content validation tests
      await this.testHomepageBrandMessaging();
      await this.testAboutPageContent();
      await this.testServicesPageContent();
      await this.testCareersPageContent();
      await this.testContactInformationAccuracy();
      await this.testContentQualityAndSEO();
      
      const summary = this.getTestSummary();
      await this.logger.suiteEnd('Content Validation Tests Complete', summary);
      
      // Generate content validation report
      const report = {
        suite: 'Content Validation Tests',
        timestamp: new Date().toISOString(),
        summary,
        contentAreas: ['Homepage', 'About', 'Services', 'Careers', 'Contact', 'SEO'],
        recommendations: this.generateContentRecommendations(summary)
      };
      
      console.log('\n=== CONTENT VALIDATION RESULTS ===');
      console.log(JSON.stringify(report, null, 2));
      
    } catch (error) {
      await this.logger.error(`Content validation failed: ${error.message}`);
      throw error;
    } finally {
      await this.cleanup();
    }
  }

  generateContentRecommendations(summary) {
    const recommendations = [];
    
    if (summary.failed > 0) {
      recommendations.push('Review failed content areas and update website content');
    }
    
    if (summary.successRate < 80) {
      recommendations.push('Consider comprehensive content audit and update');
    }
    
    recommendations.push('Regular content review recommended monthly');
    recommendations.push('SEO optimization should be ongoing');
    
    return recommendations;
  }
}

// Execute content validation tests
async function main() {
  const contentTests = new ContentValidationTests();
  
  // Set a timeout for the entire content validation suite
  const timeoutId = setTimeout(() => {
    console.error('Content validation tests timed out after 15 minutes');
    process.exit(1);
  }, 900000); // 15 minutes
  
  try {
    await contentTests.runContentValidationTests();
    clearTimeout(timeoutId);
    process.exit(0);
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Content validation tests failed:', error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Content validation error:', error);
  process.exit(1);
});
