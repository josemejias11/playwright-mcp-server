/**
 * Comprehensive CaliberFS Test Suite
 * Advanced MCP-enhanced testing covering all website functionality
 * 
 * This suite tests:
 * - Homepage functionality and content
 * - Navigation and page accessibility
 * - Contact form submission and validation
 * - Service offerings verification
 * - About page corporate information
 * - Careers section availability
 * - Performance and accessibility checks
 * - Mobile responsiveness
 * - Error handling and edge cases
 */

import { BaseTestFramework } from '../framework/base-test-framework.js';
import { CaliberFSHomePage } from '../page-objects/homepage.js';
import { CaliberFSContactPage } from '../page-objects/contact-page.js';

class ComprehensiveCaliberTestSuite {
  constructor() {
    this.framework = new BaseTestFramework();
    this.homepage = null;
    this.contactPage = null;
    this.testResults = {
      functional: [],
      performance: [],
      accessibility: [],
      mobile: []
    };
  }

  async runAllTests() {
    try {
      await this.framework.initialize('Comprehensive CaliberFS Test Suite', 'chromium');
      
      // Initialize page objects
      this.homepage = new CaliberFSHomePage(this.framework.client);
      this.contactPage = new CaliberFSContactPage(this.framework.client);

      // Core Functional Tests
      await this.runFunctionalTests();
      
      // Performance Tests
      await this.runPerformanceTests();
      
      // Accessibility Tests
      await this.runAccessibilityTests();
      
      // Mobile Responsiveness Tests
      await this.runMobileTests();
      
      // Edge Case and Error Handling Tests
      await this.runEdgeCaseTests();

      // Generate comprehensive report
      await this.generateComprehensiveReport();
      
    } catch (error) {
      await this.framework.logger.error(`Test suite failed: ${error.message}`);
    } finally {
      await this.framework.cleanup();
    }
  }

  /**
   * Core Functional Tests
   */
  async runFunctionalTests() {
    await this.framework.logger.info('🔧 Starting Functional Tests');

    // Test 1: Homepage Core Functionality
    await this.framework.executeTest('Homepage Core Validation', async () => {
      await this.homepage.navigate();
      await this.homepage.getPageInfo();
      
      // Validate core content
      await this.framework.validateText('h1', 'Grow with caliber', { exact: false });
      
      // Take screenshot for documentation
      await this.homepage.captureScreenshot('homepage-functional-test');
    });

    // Test 2: Navigation Menu Functionality
    await this.framework.executeTest('Navigation Menu Validation', async () => {
      await this.validateNavigationLinks();
      await this.validateMenuInteractivity();
    });

    // Test 3: About Page Content Verification
    await this.framework.executeTest('About Page Content Verification', async () => {
      await this.framework.navigateToPage('https://www.caliberfs.com/about', 'About');
      await this.validateAboutPageContent();
      await this.framework.client.takeScreenshot('e2e/artifacts/about-page-test.png', true);
    });

    // Test 4: Services Page Validation
    await this.framework.executeTest('Services Page Validation', async () => {
      await this.framework.navigateToPage('https://www.caliberfs.com/our-services', 'Our Services');
      await this.validateServicesContent();
      await this.framework.client.takeScreenshot('e2e/artifacts/services-page-test.png', true);
    });

    // Test 5: Contact Form Functionality
    await this.framework.executeTest('Contact Form Functionality', async () => {
      await this.contactPage.navigate();
      await this.framework.validateText('h1', 'Contact Us', { exact: false });
      await this.testContactFormSubmission();
      await this.contactPage.captureScreenshot('contact-form-test');
    });

    // Test 6: Careers Page Accessibility
    await this.framework.executeTest('Careers Page Accessibility', async () => {
      await this.framework.navigateToPage('https://www.caliberfs.com/careers', 'Careers');
      await this.validateCareersContent();
      await this.framework.client.takeScreenshot('e2e/artifacts/careers-page-test.png', true);
    });
  }

  /**
   * Performance Tests
   */
  async runPerformanceTests() {
    await this.framework.logger.info('⚡ Starting Performance Tests');

    // Test 7: Homepage Load Performance
    await this.framework.executeTest('Homepage Load Performance', async () => {
      await this.framework.navigateToPage('https://www.caliberfs.com');
      const performance = await this.framework.measurePagePerformance();
      
      // Validate performance metrics
      if (performance.totalTime > 5000) {
        throw new Error(`Page load too slow: ${performance.totalTime}ms (expected < 5000ms)`);
      }
      
      this.testResults.performance.push({
        page: 'homepage',
        metrics: performance,
        timestamp: new Date().toISOString()
      });
    });

    // Test 8: Page-to-Page Navigation Performance
    await this.framework.executeTest('Navigation Performance', async () => {
      const pages = [
        { url: 'https://www.caliberfs.com/about', name: 'About' },
        { url: 'https://www.caliberfs.com/our-services', name: 'Services' },
        { url: 'https://www.caliberfs.com/contact', name: 'Contact' },
        { url: 'https://www.caliberfs.com/careers', name: 'Careers' }
      ];

      for (const page of pages) {
        const startTime = Date.now();
        await this.framework.navigateToPage(page.url);
        const loadTime = Date.now() - startTime;
        
        if (loadTime > 3000) {
          throw new Error(`${page.name} page load too slow: ${loadTime}ms`);
        }
        
        await this.framework.logger.info(`${page.name} page loaded in ${loadTime}ms`);
      }
    });
  }

  /**
   * Accessibility Tests
   */
  async runAccessibilityTests() {
    await this.framework.logger.info('♿ Starting Accessibility Tests');

    // Test 9: Keyboard Navigation
    await this.framework.executeTest('Keyboard Navigation Accessibility', async () => {
      await this.framework.navigateToPage('https://www.caliberfs.com');
      await this.testKeyboardNavigation();
    });

    // Test 10: Focus Management
    await this.framework.executeTest('Focus Management', async () => {
      await this.framework.navigateToPage('https://www.caliberfs.com/contact');
      await this.testFocusManagement();
    });

    // Test 11: ARIA Labels and Semantic HTML
    await this.framework.executeTest('ARIA and Semantic HTML Validation', async () => {
      await this.framework.navigateToPage('https://www.caliberfs.com');
      await this.validateSemanticHTML();
    });
  }

  /**
   * Mobile Responsiveness Tests
   */
  async runMobileTests() {
    await this.framework.logger.info('📱 Starting Mobile Responsiveness Tests');

    // Test 12: Mobile Layout Validation
    await this.framework.executeTest('Mobile Layout Validation', async () => {
      // Set mobile viewport
      await this.framework.client.evaluateJavaScript(`
        window.resizeTo(375, 667); // iPhone SE size
      `);
      
      await this.framework.navigateToPage('https://www.caliberfs.com');
      await this.validateMobileLayout();
      await this.framework.client.takeScreenshot('e2e/artifacts/mobile-homepage-test.png', true);
    });

    // Test 13: Touch-Friendly Interface
    await this.framework.executeTest('Touch-Friendly Interface', async () => {
      await this.validateTouchElements();
    });
  }

  /**
   * Edge Case and Error Handling Tests
   */
  async runEdgeCaseTests() {
    await this.framework.logger.info('🔍 Starting Edge Case Tests');

    // Test 14: Invalid Form Submissions
    await this.framework.executeTest('Invalid Form Submission Handling', async () => {
      await this.framework.navigateToPage('https://www.caliberfs.com/contact');
      await this.testInvalidFormSubmissions();
    });

    // Test 15: Network Resilience
    await this.framework.executeTest('Network Resilience', async () => {
      await this.testNetworkResilience();
    });
  }

  /**
   * Helper Methods for Specific Validations
   */
  async validateNavigationLinks() {
    const navLinks = [
      { selector: 'a[href*="about"]', expectedUrl: 'about' },
      { selector: 'a[href*="our-services"]', expectedUrl: 'our-services' },
      { selector: 'a[href*="contact"]', expectedUrl: 'contact' },
      { selector: 'a[href*="careers"]', expectedUrl: 'careers' }
    ];

    for (const link of navLinks) {
      await this.framework.waitForElement(link.selector);
      await this.framework.clickElement(link.selector);
      
      const currentUrl = await this.framework.client.evaluateJavaScript('window.location.href');
      if (!currentUrl.output.includes(link.expectedUrl)) {
        throw new Error(`Navigation failed for ${link.expectedUrl}`);
      }
      
      await this.framework.logger.info(`✓ Navigation to ${link.expectedUrl} successful`);
      await this.framework.sleep(1000); // Allow page to settle
    }
  }

  async validateMenuInteractivity() {
    // Test mobile menu if present
    const mobileMenuButton = await this.framework.client.evaluateJavaScript(`
      document.querySelector('.menu-button, .hamburger, .mobile-menu-toggle') !== null
    `);

    if (mobileMenuButton.output) {
      await this.framework.clickElement('.menu-button');
      await this.framework.sleep(500);
      await this.framework.logger.info('✓ Mobile menu interaction tested');
    }
  }

  async validateAboutPageContent() {
    // Validate key content sections
    const requiredContent = [
      'Caliber Financial Services',
      'Otoe-Missouria Tribe',
      'Our Values',
      'Our Vision'
    ];

    for (const content of requiredContent) {
      const textExists = await this.framework.client.evaluateJavaScript(`
        document.body.textContent.includes('${content}')
      `);
      
      if (!textExists.output) {
        throw new Error(`Required content missing: ${content}`);
      }
      
      await this.framework.logger.info(`✓ Found required content: ${content}`);
    }
  }

  async validateServicesContent() {
    const serviceAreas = [
      'Product Development',
      'Compliance',
      'Technology',
      'Marketing',
      'Customer Engagement',
      'Analytics'
    ];

    for (const service of serviceAreas) {
      const serviceExists = await this.framework.client.evaluateJavaScript(`
        document.body.textContent.includes('${service}')
      `);
      
      if (!serviceExists.output) {
        await this.framework.logger.warn(`Service area not found: ${service}`);
      } else {
        await this.framework.logger.info(`✓ Found service area: ${service}`);
      }
    }
  }

  async testContactFormSubmission() {
    // Test form validation
    const formData = {
      'input[name="name"]': 'Test User',
      'input[name="Email"]': 'test@example.com',
      'input[name="Confirm-Email"]': 'test@example.com',
      'input[name="Message"]': 'This is a test message for validation purposes.'
    };

    await this.framework.fillForm(formData);
    await this.framework.client.takeScreenshot('e2e/artifacts/contact-form-filled.png', true);
    
    // Note: We don't actually submit to avoid spam
    await this.framework.logger.info('✓ Contact form filling validated (submission skipped)');
  }

  async validateCareersContent() {
    const careerContent = [
      'hiring',
      'people',
      'Career Development',
      'Culture',
      'Community'
    ];

    for (const content of careerContent) {
      const contentExists = await this.framework.client.evaluateJavaScript(`
        document.body.textContent.toLowerCase().includes('${content.toLowerCase()}')
      `);
      
      if (!contentExists.output) {
        await this.framework.logger.warn(`Career content not found: ${content}`);
      } else {
        await this.framework.logger.info(`✓ Found career content: ${content}`);
      }
    }
  }

  async testKeyboardNavigation() {
    // Test tab navigation through interactive elements
    const tabSequence = await this.framework.client.evaluateJavaScript(`
      (() => {
        const focusableElements = document.querySelectorAll(
          'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        return focusableElements.length;
      })()
    `);

    await this.framework.logger.info(`✓ Found ${tabSequence.output} focusable elements`);
    
    if (tabSequence.output === 0) {
      throw new Error('No focusable elements found - accessibility concern');
    }
  }

  async testFocusManagement() {
    // Test focus on form elements
    await this.framework.waitForElement('input[name="name"]');
    await this.framework.clickElement('input[name="name"]');
    
    const hasFocus = await this.framework.client.evaluateJavaScript(`
      document.activeElement === document.querySelector('input[name="name"]')
    `);
    
    if (!hasFocus.output) {
      throw new Error('Focus management not working correctly');
    }
    
    await this.framework.logger.info('✓ Focus management working correctly');
  }

  async validateSemanticHTML() {
    const semanticElements = await this.framework.client.evaluateJavaScript(`
      (() => {
        const semantic = {
          hasNav: !!document.querySelector('nav'),
          hasMain: !!document.querySelector('main'),
          hasHeader: !!document.querySelector('header'),
          hasFooter: !!document.querySelector('footer'),
          hasHeadings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length > 0,
          hasLandmarks: document.querySelectorAll('[role]').length > 0
        };
        return semantic;
      })()
    `);

    const results = semanticElements.output;
    
    if (!results.hasNav) {
      await this.framework.logger.warn('No nav element found');
    }
    if (!results.hasHeadings) {
      throw new Error('No heading elements found - accessibility issue');
    }
    
    await this.framework.logger.info('✓ Basic semantic HTML structure validated');
  }

  async validateMobileLayout() {
    const mobileValidation = await this.framework.client.evaluateJavaScript(`
      (() => {
        return {
          viewportWidth: window.innerWidth,
          hasHorizontalScroll: document.body.scrollWidth > window.innerWidth,
          textReadable: window.getComputedStyle(document.body).fontSize,
          touchTargets: Array.from(document.querySelectorAll('button, a')).every(el => {
            const rect = el.getBoundingClientRect();
            return rect.width >= 44 && rect.height >= 44; // 44px minimum touch target
          })
        };
      })()
    `);

    const results = mobileValidation.output;
    
    if (results.hasHorizontalScroll) {
      throw new Error('Horizontal scrolling detected on mobile - layout issue');
    }
    
    await this.framework.logger.info(`✓ Mobile layout validated (width: ${results.viewportWidth}px)`);
  }

  async validateTouchElements() {
    const touchValidation = await this.framework.client.evaluateJavaScript(`
      (() => {
        const interactiveElements = document.querySelectorAll('button, a, input');
        let minSize = Infinity;
        let tooSmallCount = 0;
        
        interactiveElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          const size = Math.min(rect.width, rect.height);
          minSize = Math.min(minSize, size);
          
          if (size < 44) tooSmallCount++;
        });
        
        return {
          totalElements: interactiveElements.length,
          minSize,
          tooSmallCount,
          averageSize: minSize
        };
      })()
    `);

    const results = touchValidation.output;
    
    if (results.tooSmallCount > 0) {
      await this.framework.logger.warn(`${results.tooSmallCount} elements below 44px touch target size`);
    }
    
    await this.framework.logger.info(`✓ Touch target validation completed (min size: ${results.minSize}px)`);
  }

  async testInvalidFormSubmissions() {
    // Test empty form submission
    await this.framework.clickElement('input[type="submit"]');
    await this.framework.sleep(1000);
    
    // Test mismatched email confirmation
    await this.framework.fillForm({
      'input[name="Email"]': 'test@example.com',
      'input[name="Confirm-Email"]': 'different@example.com'
    });
    
    await this.framework.logger.info('✓ Invalid form submission tests completed');
  }

  async testNetworkResilience() {
    // Test page behavior with simulated slow network
    await this.framework.client.evaluateJavaScript(`
      // Simulate slow network by adding delays to resource loading
      const originalFetch = window.fetch;
      window.fetch = function(...args) {
        return new Promise(resolve => {
          setTimeout(() => resolve(originalFetch.apply(this, args)), 100);
        });
      };
    `);
    
    await this.framework.navigateToPage('https://www.caliberfs.com');
    await this.framework.logger.info('✓ Network resilience test completed');
  }

  async generateComprehensiveReport() {
    const summary = this.framework.getTestSummary();
    const report = {
      suiteName: 'Comprehensive CaliberFS Test Suite',
      timestamp: new Date().toISOString(),
      summary,
      detailedResults: {
        functional: this.testResults.functional,
        performance: this.testResults.performance,
        accessibility: this.testResults.accessibility,
        mobile: this.testResults.mobile
      },
      recommendations: this.generateRecommendations(summary)
    };

    await this.framework.reporter.generateReport(report);
    await this.framework.logger.success('📊 Comprehensive test report generated');
  }

  generateRecommendations(summary) {
    const recommendations = [];
    
    if (summary.failed > 0) {
      recommendations.push('Review failed tests and address underlying issues');
    }
    
    if (summary.successRate < 90) {
      recommendations.push('Consider improving test reliability and website stability');
    }
    
    recommendations.push('Regular performance monitoring recommended');
    recommendations.push('Accessibility audit should be conducted quarterly');
    recommendations.push('Mobile experience testing should be expanded');
    
    return recommendations;
  }
}

// Execute the comprehensive test suite
const testSuite = new ComprehensiveCaliberTestSuite();
testSuite.runAllTests().catch(console.error);
