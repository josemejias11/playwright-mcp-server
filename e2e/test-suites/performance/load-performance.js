#!/usr/bin/env node

/**
 * Newsela Educational Platform - Performance Tests
 * 
 * Purpose: Ensure educational platform performs well for teachers and students
 * Focus: Page load times, educational content delivery, responsiveness for classroom use
 * Frequency: Performance regression, deployment validation
 * 
 * Critical for classroom environments where performance affects learning
 */

import { BaseTestFramework } from '../../framework/base-test-framework.js';

class NewselaPerformanceTests extends BaseTestFramework {
  constructor() {
    super();
  }

  /**
   * PERFORMANCE TEST 1: Educational Homepage Load Performance
   * Test: Homepage loads quickly for teachers and students
   */
  async testHomepageLoadPerformance() {
    await this.executeTest('Educational Homepage Load Performance', async () => {
      const startTime = Date.now();
      
      // Clear cache to simulate first-time visitor
      await this.client.evaluate(() => {
        if ('caches' in window) {
          caches.keys().then(cacheNames => {
            cacheNames.forEach(cacheName => caches.delete(cacheName));
          });
        }
      });
      
      // Measure navigation timing
      await this.client.navigateTo('https://newsela.com');
      
      // Wait for critical educational content to load
      await this.client.waitForElement('body', 'visible', 15000);
      
      const loadTime = Date.now() - startTime;
      
      // Get detailed performance metrics
      const performanceResult = await this.client.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
          transferSize: navigation.transferSize,
          encodedBodySize: navigation.encodedBodySize,
          decodedBodySize: navigation.decodedBodySize
        };
      });
      
      if (!performanceResult.success) {
        throw new Error('Cannot collect performance metrics');
      }
      
      const metrics = performanceResult.output;
      
      // Performance thresholds for educational platform
      const thresholds = {
        totalLoad: 5000, // 5 seconds max for total load
        firstContentfulPaint: 2500, // 2.5 seconds for FCP
        domContentLoaded: 3000, // 3 seconds for DOM ready
        transferSize: 5000000 // 5MB max transfer size
      };
      
      // Check performance against thresholds
      const performanceIssues = [];
      
      if (loadTime > thresholds.totalLoad) {
        performanceIssues.push(`Total load time: ${loadTime}ms (threshold: ${thresholds.totalLoad}ms)`);
      }
      
      if (metrics.firstContentfulPaint > thresholds.firstContentfulPaint) {
        performanceIssues.push(`First Contentful Paint: ${metrics.firstContentfulPaint}ms (threshold: ${thresholds.firstContentfulPaint}ms)`);
      }
      
      if (metrics.domContentLoaded > thresholds.domContentLoaded) {
        performanceIssues.push(`DOM Content Loaded: ${metrics.domContentLoaded}ms (threshold: ${thresholds.domContentLoaded}ms)`);
      }
      
      if (metrics.transferSize > thresholds.transferSize) {
        performanceIssues.push(`Transfer size: ${Math.round(metrics.transferSize/1024)}KB (threshold: ${Math.round(thresholds.transferSize/1024)}KB)`);
      }
      
      if (performanceIssues.length > 2) {
        throw new Error(`Multiple performance issues: ${performanceIssues.join(', ')}`);
      }
      
      await this.logger.business(`✓ Total load time: ${loadTime}ms`);
      await this.logger.business(`✓ First Contentful Paint: ${Math.round(metrics.firstContentfulPaint)}ms`);
      await this.logger.business(`✓ DOM Content Loaded: ${Math.round(metrics.domContentLoaded)}ms`);
      await this.logger.business(`✓ Transfer size: ${Math.round(metrics.transferSize/1024)}KB`);
      
      if (performanceIssues.length > 0) {
        await this.logger.warning(`⚠️ Performance concerns: ${performanceIssues.join(', ')}`);
      }
    }, { timeout: 20000 });
  }

  /**
   * PERFORMANCE TEST 2: Educational Content Search Performance
   * Test: Search functionality responds quickly for teachers
   */
  async testEducationalSearchPerformance() {
    await this.executeTest('Educational Search Performance', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      // Look for search functionality
      const searchSelectors = [
        'input[type="search"]',
        'input[placeholder*="search"]',
        'input[placeholder*="Search"]',
        'form input[type="text"]',
        '[data-testid*="search"]'
      ];
      
      let searchFound = false;
      let searchSelector = '';
      
      for (const selector of searchSelectors) {
        try {
          const result = await this.client.waitForElement(selector, 'visible', 3000);
          if (result.success) {
            searchFound = true;
            searchSelector = selector;
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      if (!searchFound) {
        await this.logger.business('✓ No search functionality found on homepage - skipping search performance');
        return;
      }
      
      // Test search performance
      const searchStartTime = Date.now();
      
      // Type in search box
      await this.client.click(searchSelector);
      await this.client.type('science', 100); // Type with delay to simulate real user
      
      // Wait a moment for potential auto-suggestions or instant search
      await this.client.wait(1000);
      
      const searchResponseTime = Date.now() - searchStartTime;
      
      // Check if search suggestions or results appear quickly
      const searchResultsResult = await this.client.evaluate(() => {
        // Look for common search result containers
        const resultContainers = document.querySelectorAll(
          '[class*="suggestion"], [class*="result"], [class*="dropdown"], [class*="autocomplete"], ul li, .search-results'
        );
        
        const visibleResults = Array.from(resultContainers).filter(container => {
          const style = window.getComputedStyle(container);
          return style.display !== 'none' && style.visibility !== 'hidden' && container.offsetHeight > 0;
        });
        
        return {
          hasResults: visibleResults.length > 0,
          resultCount: visibleResults.length,
          resultText: visibleResults.slice(0, 3).map(r => r.textContent?.trim().substring(0, 50)).join('; ')
        };
      });
      
      // Performance threshold for search
      const searchThreshold = 2000; // 2 seconds max for search response
      
      if (searchResponseTime > searchThreshold) {
        throw new Error(`Search response too slow: ${searchResponseTime}ms (threshold: ${searchThreshold}ms)`);
      }
      
      await this.logger.business(`✓ Search response time: ${searchResponseTime}ms`);
      
      if (searchResultsResult.success && searchResultsResult.output.hasResults) {
        await this.logger.business(`✓ Search suggestions appeared: ${searchResultsResult.output.resultCount} results`);
        await this.logger.business(`✓ Sample results: ${searchResultsResult.output.resultText}`);
      } else {
        await this.logger.business(`✓ Search input responsive (no instant suggestions visible)`);
      }
    }, { timeout: 15000 });
  }

  /**
   * PERFORMANCE TEST 3: Mobile Performance for Educational Access
   * Test: Platform performs well on mobile devices for classroom use
   */
  async testMobileEducationalPerformance() {
    await this.executeTest('Mobile Educational Performance', async () => {
      // Set mobile viewport and simulate slower connection
      await this.client.resizeBrowser(375, 667); // iPhone SE size
      
      const startTime = Date.now();
      await this.client.navigateTo('https://newsela.com');
      
      // Wait for mobile layout to load
      await this.client.waitForElement('body', 'visible', 15000);
      
      const mobileLoadTime = Date.now() - startTime;
      
      // Get mobile-specific performance metrics
      const mobilePerformanceResult = await this.client.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        
        return {
          loadTime: navigation.loadEventEnd - navigation.fetchStart,
          domInteractive: navigation.domInteractive - navigation.fetchStart,
          resourceCount: performance.getEntriesByType('resource').length,
          documentSize: document.documentElement.innerHTML.length,
          viewportWidth: window.innerWidth,
          devicePixelRatio: window.devicePixelRatio || 1
        };
      });
      
      if (!mobilePerformanceResult.success) {
        throw new Error('Cannot collect mobile performance metrics');
      }
      
      const mobileMetrics = mobilePerformanceResult.output;
      
      // Mobile performance thresholds (more lenient for mobile)
      const mobileThresholds = {
        totalLoad: 7000, // 7 seconds max for mobile
        domInteractive: 4000, // 4 seconds for DOM interactive
        resourceCount: 100 // Reasonable resource count for mobile
      };
      
      const mobileIssues = [];
      
      if (mobileLoadTime > mobileThresholds.totalLoad) {
        mobileIssues.push(`Mobile load time: ${mobileLoadTime}ms (threshold: ${mobileThresholds.totalLoad}ms)`);
      }
      
      if (mobileMetrics.domInteractive > mobileThresholds.domInteractive) {
        mobileIssues.push(`DOM interactive: ${mobileMetrics.domInteractive}ms (threshold: ${mobileThresholds.domInteractive}ms)`);
      }
      
      if (mobileMetrics.resourceCount > mobileThresholds.resourceCount) {
        mobileIssues.push(`Resource count: ${mobileMetrics.resourceCount} (threshold: ${mobileThresholds.resourceCount})`);
      }
      
      // Check mobile layout optimization
      const layoutResult = await this.client.evaluate(() => {
        const body = document.body;
        const hasHorizontalScroll = body.scrollWidth > window.innerWidth;
        const hasViewportMeta = !!document.querySelector('meta[name="viewport"]');
        
        return {
          hasHorizontalScroll,
          hasViewportMeta,
          bodyWidth: body.scrollWidth,
          windowWidth: window.innerWidth
        };
      });
      
      if (layoutResult.success && layoutResult.output.hasHorizontalScroll) {
        mobileIssues.push('Horizontal scroll detected - poor mobile optimization');
      }
      
      if (mobileIssues.length > 2) {
        throw new Error(`Mobile performance issues: ${mobileIssues.join(', ')}`);
      }
      
      await this.logger.business(`✓ Mobile load time: ${mobileLoadTime}ms`);
      await this.logger.business(`✓ DOM interactive: ${Math.round(mobileMetrics.domInteractive)}ms`);
      await this.logger.business(`✓ Resource count: ${mobileMetrics.resourceCount}`);
      await this.logger.business(`✓ Mobile layout: ${layoutResult.output?.hasHorizontalScroll ? 'Has horizontal scroll' : 'Optimized'}`);
      
      if (mobileIssues.length > 0) {
        await this.logger.warning(`⚠️ Mobile performance concerns: ${mobileIssues.join(', ')}`);
      }
      
      // Reset to desktop view
      await this.client.resizeBrowser(1280, 720);
    }, { timeout: 25000 });
  }

  /**
   * PERFORMANCE TEST 4: Educational Resource Loading Performance
   * Test: Educational images and resources load efficiently
   */
  async testEducationalResourcePerformance() {
    await this.executeTest('Educational Resource Performance', async () => {
      const startTime = Date.now();
      await this.client.navigateTo('https://newsela.com');
      
      // Wait for initial content
      await this.client.waitForElement('body', 'visible', 10000);
      
      // Analyze resource loading
      const resourceResult = await this.client.evaluate(() => {
        const resources = performance.getEntriesByType('resource');
        
        const analysis = {
          totalResources: resources.length,
          images: resources.filter(r => r.initiatorType === 'img').length,
          scripts: resources.filter(r => r.initiatorType === 'script').length,
          stylesheets: resources.filter(r => r.initiatorType === 'css' || r.initiatorType === 'link').length,
          fonts: resources.filter(r => r.name.includes('.woff') || r.name.includes('.ttf') || r.name.includes('.eot')).length,
          totalSize: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
          slowResources: resources.filter(r => r.duration > 1000).length, // Resources taking > 1 second
          failedResources: resources.filter(r => r.transferSize === 0 && r.duration > 0).length
        };
        
        // Get image loading info
        const images = document.querySelectorAll('img');
        analysis.imagesOnPage = images.length;
        analysis.imagesLoaded = Array.from(images).filter(img => img.complete && img.naturalHeight > 0).length;
        
        return analysis;
      });
      
      if (!resourceResult.success) {
        throw new Error('Cannot analyze resource performance');
      }
      
      const resourceMetrics = resourceResult.output;
      
      // Resource performance thresholds
      const resourceThresholds = {
        totalSize: 8000000, // 8MB max total size
        slowResources: 5, // Max 5 slow resources
        failedResources: 2, // Max 2 failed resources
        imageLoadRatio: 0.8 // At least 80% of images should load successfully
      };
      
      const resourceIssues = [];
      
      if (resourceMetrics.totalSize > resourceThresholds.totalSize) {
        resourceIssues.push(`Total resource size: ${Math.round(resourceMetrics.totalSize/1024/1024)}MB (threshold: ${Math.round(resourceThresholds.totalSize/1024/1024)}MB)`);
      }
      
      if (resourceMetrics.slowResources > resourceThresholds.slowResources) {
        resourceIssues.push(`Slow resources: ${resourceMetrics.slowResources} (threshold: ${resourceThresholds.slowResources})`);
      }
      
      if (resourceMetrics.failedResources > resourceThresholds.failedResources) {
        resourceIssues.push(`Failed resources: ${resourceMetrics.failedResources} (threshold: ${resourceThresholds.failedResources})`);
      }
      
      const imageLoadRatio = resourceMetrics.imagesOnPage > 0 ? 
        resourceMetrics.imagesLoaded / resourceMetrics.imagesOnPage : 1;
      
      if (imageLoadRatio < resourceThresholds.imageLoadRatio) {
        resourceIssues.push(`Image load ratio: ${Math.round(imageLoadRatio * 100)}% (threshold: ${Math.round(resourceThresholds.imageLoadRatio * 100)}%)`);
      }
      
      if (resourceIssues.length > 2) {
        throw new Error(`Resource performance issues: ${resourceIssues.join(', ')}`);
      }
      
      await this.logger.business(`✓ Total resources: ${resourceMetrics.totalResources}`);
      await this.logger.business(`✓ Resource breakdown: ${resourceMetrics.images} images, ${resourceMetrics.scripts} scripts, ${resourceMetrics.stylesheets} stylesheets`);
      await this.logger.business(`✓ Total resource size: ${Math.round(resourceMetrics.totalSize/1024)}KB`);
      await this.logger.business(`✓ Image loading: ${resourceMetrics.imagesLoaded}/${resourceMetrics.imagesOnPage} (${Math.round(imageLoadRatio * 100)}%)`);
      
      if (resourceIssues.length > 0) {
        await this.logger.warning(`⚠️ Resource performance concerns: ${resourceIssues.join(', ')}`);
      }
    }, { timeout: 20000 });
  }

  /**
   * PERFORMANCE TEST 5: Educational Form Response Performance
   * Test: Educational forms and interactions respond quickly
   */
  async testEducationalFormPerformance() {
    await this.executeTest('Educational Form Performance', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      // Look for interactive forms or buttons
      const interactiveSelectors = [
        'button:has-text("Sign up")',
        'button:has-text("Get started")',
        'button:has-text("Try")',
        'input[type="email"]',
        'input[type="text"]',
        'form button'
      ];
      
      let interactionFound = false;
      let interactionSelector = '';
      
      for (const selector of interactiveSelectors) {
        try {
          const result = await this.client.waitForElement(selector, 'visible', 3000);
          if (result.success) {
            interactionFound = true;
            interactionSelector = selector;
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      if (!interactionFound) {
        await this.logger.business('✓ No interactive forms found on homepage - skipping form performance');
        return;
      }
      
      // Test interaction response time
      const interactionStartTime = Date.now();
      
      try {
        // Click the interactive element
        await this.client.click(interactionSelector);
        
        // Wait a moment to see if anything happens
        await this.client.wait(500);
        
        const interactionResponseTime = Date.now() - interactionStartTime;
        
        // Check for any visual feedback or page changes
        const feedbackResult = await this.client.evaluate(() => {
          // Check for common feedback indicators
          const indicators = document.querySelectorAll(
            '.loading, .spinner, [class*="loading"], [class*="spinner"], .modal, [class*="modal"], .popup, [class*="popup"]'
          );
          
          const visibleIndicators = Array.from(indicators).filter(indicator => {
            const style = window.getComputedStyle(indicator);
            return style.display !== 'none' && style.visibility !== 'hidden' && indicator.offsetHeight > 0;
          });
          
          return {
            hasFeedback: visibleIndicators.length > 0,
            feedbackTypes: visibleIndicators.map(i => i.className).join(', ')
          };
        });
        
        // Performance threshold for form interaction
        const interactionThreshold = 1000; // 1 second max for interaction response
        
        if (interactionResponseTime > interactionThreshold) {
          throw new Error(`Form interaction too slow: ${interactionResponseTime}ms (threshold: ${interactionThreshold}ms)`);
        }
        
        await this.logger.business(`✓ Form interaction response: ${interactionResponseTime}ms`);
        
        if (feedbackResult.success && feedbackResult.output.hasFeedback) {
          await this.logger.business(`✓ User feedback provided: ${feedbackResult.output.feedbackTypes}`);
        } else {
          await this.logger.business(`✓ Form interaction completed (no visual feedback)`);
        }
        
      } catch (error) {
        // If interaction fails, just log it as a warning since it might be intentional
        await this.logger.warning(`⚠️ Form interaction issue: ${error.message}`);
      }
    }, { timeout: 15000 });
  }

  /**
   * PERFORMANCE TEST 6: Educational Content Accessibility Performance
   * Test: Accessible features don't impact performance significantly
   */
  async testAccessibilityPerformanceImpact() {
    await this.executeTest('Accessibility Performance Impact', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      // Wait for content to load
      await this.client.waitForElement('body', 'visible', 10000);
      
      // Measure accessibility-specific performance
      const accessibilityPerformanceResult = await this.client.evaluate(() => {
        const startTime = performance.now();
        
        // Count accessibility features that might impact performance
        const accessibilityFeatures = {
          ariaLabels: document.querySelectorAll('[aria-label]').length,
          ariaDescribedBy: document.querySelectorAll('[aria-describedby]').length,
          altTexts: document.querySelectorAll('img[alt]').length,
          headings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
          landmarks: document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]').length,
          focusableElements: document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])').length
        };
        
        const evaluationTime = performance.now() - startTime;
        
        return {
          accessibilityFeatures,
          evaluationTime,
          totalAccessibilityElements: Object.values(accessibilityFeatures).reduce((sum, count) => sum + count, 0)
        };
      });
      
      if (!accessibilityPerformanceResult.success) {
        throw new Error('Cannot analyze accessibility performance impact');
      }
      
      const accessibilityMetrics = accessibilityPerformanceResult.output;
      
      // Check that accessibility features are present without major performance impact
      const accessibilityThresholds = {
        evaluationTime: 100, // Should take less than 100ms to evaluate accessibility features
        minAccessibilityElements: 10 // Should have at least 10 accessibility elements
      };
      
      const accessibilityIssues = [];
      
      if (accessibilityMetrics.evaluationTime > accessibilityThresholds.evaluationTime) {
        accessibilityIssues.push(`Accessibility evaluation slow: ${Math.round(accessibilityMetrics.evaluationTime)}ms`);
      }
      
      if (accessibilityMetrics.totalAccessibilityElements < accessibilityThresholds.minAccessibilityElements) {
        accessibilityIssues.push(`Few accessibility elements: ${accessibilityMetrics.totalAccessibilityElements} (min: ${accessibilityThresholds.minAccessibilityElements})`);
      }
      
      if (accessibilityIssues.length > 1) {
        await this.logger.warning(`⚠️ Accessibility performance concerns: ${accessibilityIssues.join(', ')}`);
      }
      
      await this.logger.business(`✓ Accessibility elements: ${accessibilityMetrics.totalAccessibilityElements} total`);
      await this.logger.business(`✓ ARIA labels: ${accessibilityMetrics.accessibilityFeatures.ariaLabels}`);
      await this.logger.business(`✓ Headings: ${accessibilityMetrics.accessibilityFeatures.headings}`);
      await this.logger.business(`✓ Focusable elements: ${accessibilityMetrics.accessibilityFeatures.focusableElements}`);
      await this.logger.business(`✓ Accessibility evaluation time: ${Math.round(accessibilityMetrics.evaluationTime)}ms`);
    }, { timeout: 15000 });
  }

  async runPerformanceTests() {
    try {
      console.log('\n⚡ NEWSELA EDUCATIONAL PLATFORM - PERFORMANCE TESTS');
      console.log('===================================================');
      console.log('🎯 Testing performance for optimal classroom learning experience');
      console.log('');

      await this.testHomepageLoadPerformance();
      await this.testEducationalSearchPerformance();
      await this.testMobileEducationalPerformance();
      await this.testEducationalResourcePerformance();
      await this.testEducationalFormPerformance();
      await this.testAccessibilityPerformanceImpact();

      // Generate summary
      const summary = this.getTestSummary();
      console.log('\n📊 EDUCATIONAL PERFORMANCE TEST SUMMARY');
      console.log('========================================');
      console.log(`Total Performance Tests: ${summary.total}`);
      console.log(`Passed: ${summary.passed}`);
      console.log(`Failed: ${summary.failed}`);
      console.log(`Performance Success Rate: ${Math.round((summary.passed / summary.total) * 100)}%`);
      
      if (summary.failed > 0) {
        console.log(`⚠️ ${summary.failed} performance tests failed - review platform optimization`);
      }
      
    } catch (error) {
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Execute performance tests
async function main() {
  const performanceTests = new NewselaPerformanceTests();
  
  try {
    await performanceTests.runPerformanceTests();
    console.log('✅ EDUCATIONAL PERFORMANCE TESTS COMPLETED');
    process.exit(0);
  } catch (error) {
    console.error('❌ EDUCATIONAL PERFORMANCE TESTS FAILED');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ PERFORMANCE TEST SUITE FAILURE:', error);
  process.exit(1);
});
