#!/usr/bin/env node

/**
 * Performance Tests
 * 
 * Purpose: Ensure optimal user experience and performance
 * Frequency: Weekly performance runs
 * Timeout: 10 minutes max
 * 
 * Validates core web vitals, page load times, and overall
 * performance metrics critical for user experience.
 */

import { BaseTestFramework } from '../../framework/base-test-framework.js';
import { NewselaHomePage } from '../../page-objects/homepage.js';

class PerformanceTests extends BaseTestFramework {
  constructor() {
    super();
    this.homePage = null;
    this.performanceMetrics = [];
  }

  async initializePageObjects() {
    this.homePage = new NewselaHomePage(this.client);
  }

  /**
   * PERFORMANCE TEST 1: Homepage Load Performance
   */
  async testHomepageLoadPerformance() {
    await this.executeTest('Homepage Load Performance', async () => {
      const startTime = Date.now();
      
      await this.homePage.navigate();
      
      const loadTime = Date.now() - startTime;
      
      // Get detailed performance metrics
      const performance = await this.homePage.checkPerformance();
      
      // Performance thresholds for software development services
      const thresholds = {
        loadTime: 3000,      // 3 seconds max
        domReady: 1500,      // 1.5 seconds max
        networkTime: 2000    // 2 seconds max
      };
      
      if (loadTime > thresholds.loadTime) {
        throw new Error(`Homepage load too slow: ${loadTime}ms (expected < ${thresholds.loadTime}ms)`);
      }
      
      if (performance.domReady > thresholds.domReady) {
        await this.logger.warn(`DOM ready time high: ${performance.domReady}ms (threshold: ${thresholds.domReady}ms)`);
      }
      
      this.performanceMetrics.push({
        page: 'homepage',
        loadTime,
        domReady: performance.domReady,
        totalTime: performance.loadTime,
        timestamp: new Date().toISOString()
      });
      
      await this.logger.performance(`Homepage load time: ${loadTime}ms`);
      await this.logger.performance(`DOM ready: ${performance.domReady}ms`);
      await this.logger.performance(`Performance score: ${performance.isPerformant ? 'PASS' : 'FAIL'}`);
      
    }, { timeout: 15000 });
  }

  /**
   * PERFORMANCE TEST 2: Page Navigation Performance
   */
  async testPageNavigationPerformance() {
    await this.executeTest('Page Navigation Performance', async () => {
      const pages = [
        { url: 'https://newsela.com/about/', name: 'About' },
        { url: 'https://newsela.com/subject/', name: 'Articles' },
        { url: 'https://newsela.com/support/', name: 'Support' },
        { url: 'https://newsela.com/educators/', name: 'Educators' }
      ];

      const navigationMetrics = [];
      
      for (const page of pages) {
        const startTime = Date.now();
        await this.navigateToPage(page.url, page.name);
        const loadTime = Date.now() - startTime;
        
        // Performance threshold for navigation
        if (loadTime > 4000) {
          throw new Error(`${page.name} page load too slow: ${loadTime}ms (expected < 4000ms)`);
        }
        
        navigationMetrics.push({
          page: page.name,
          url: page.url,
          loadTime,
          timestamp: new Date().toISOString()
        });
        
        await this.logger.performance(`${page.name} page loaded in ${loadTime}ms`);
      }
      
      // Calculate average navigation time
      const avgLoadTime = navigationMetrics.reduce((sum, metric) => sum + metric.loadTime, 0) / navigationMetrics.length;
      
      if (avgLoadTime > 3000) {
        await this.logger.warn(`Average navigation time high: ${avgLoadTime.toFixed(0)}ms`);
      }
      
      this.performanceMetrics.push({
        type: 'navigation',
        averageLoadTime: avgLoadTime,
        pages: navigationMetrics,
        timestamp: new Date().toISOString()
      });
      
      await this.logger.performance(`Average navigation time: ${avgLoadTime.toFixed(0)}ms`);
      
    }, { timeout: 30000 });
  }

  /**
   * PERFORMANCE TEST 3: Resource Loading Performance
   */
  async testResourceLoadingPerformance() {
    await this.executeTest('Resource Loading Performance', async () => {
      await this.homePage.navigate();
      
      // Check resource loading metrics
      const resourceMetrics = await this.client.evaluateJavaScript(`
        (() => {
          const resources = performance.getEntriesByType('resource');
          const images = resources.filter(r => r.name.match(/\\.(jpg|jpeg|png|gif|webp|svg)$/i));
          const scripts = resources.filter(r => r.name.match(/\\.js$/i));
          const styles = resources.filter(r => r.name.match(/\\.css$/i));
          
          const getStats = (items) => {
            if (items.length === 0) return { count: 0, avgDuration: 0, maxDuration: 0 };
            const durations = items.map(item => item.duration);
            return {
              count: items.length,
              avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
              maxDuration: Math.max(...durations)
            };
          };
          
          return {
            total: resources.length,
            images: getStats(images),
            scripts: getStats(scripts),
            styles: getStats(styles),
            largestContentfulPaint: performance.getEntriesByType('largest-contentful-paint')[0]?.startTime || 0
          };
        })()
      `);
      
      const metrics = JSON.parse(resourceMetrics.output);
      
      // Performance thresholds for resources
      if (metrics.images.maxDuration > 3000) {
        await this.logger.warn(`Slow image loading detected: ${metrics.images.maxDuration.toFixed(0)}ms`);
      }
      
      if (metrics.scripts.maxDuration > 2000) {
        await this.logger.warn(`Slow script loading detected: ${metrics.scripts.maxDuration.toFixed(0)}ms`);
      }
      
      if (metrics.largestContentfulPaint > 2500) {
        throw new Error(`Largest Contentful Paint too slow: ${metrics.largestContentfulPaint.toFixed(0)}ms (expected < 2500ms)`);
      }
      
      this.performanceMetrics.push({
        type: 'resources',
        metrics,
        timestamp: new Date().toISOString()
      });
      
      await this.logger.performance(`Total resources: ${metrics.total}`);
      await this.logger.performance(`Images: ${metrics.images.count} (avg: ${metrics.images.avgDuration.toFixed(0)}ms)`);
      await this.logger.performance(`Scripts: ${metrics.scripts.count} (avg: ${metrics.scripts.avgDuration.toFixed(0)}ms)`);
      await this.logger.performance(`LCP: ${metrics.largestContentfulPaint.toFixed(0)}ms`);
      
    }, { timeout: 15000 });
  }

  /**
   * PERFORMANCE TEST 4: Mobile Performance
   */
  async testMobilePerformance() {
    await this.executeTest('Mobile Performance', async () => {
      // Set mobile viewport
      await this.client.evaluateJavaScript(`
        // Simulate mobile viewport
        if (window.innerWidth > 768) {
          // Note: This is a simulation since we can't actually resize in headless mode
          console.log('Mobile simulation - would resize to 375x667');
        }
      `);
      
      const startTime = Date.now();
      await this.homePage.navigate();
      const mobileLoadTime = Date.now() - startTime;
      
      // Mobile performance should be optimized
      if (mobileLoadTime > 4000) {
        throw new Error(`Mobile load time too slow: ${mobileLoadTime}ms (expected < 4000ms)`);
      }
      
      // Check mobile-specific performance indicators
      const mobileMetrics = await this.client.evaluateJavaScript(`
        (() => {
          return {
            viewportWidth: window.innerWidth,
            hasTouch: 'ontouchstart' in window,
            connectionType: navigator.connection ? navigator.connection.effectiveType : 'unknown',
            memoryUsage: performance.memory ? {
              used: Math.round(performance.memory.usedJSHeapSize / 1048576),
              total: Math.round(performance.memory.totalJSHeapSize / 1048576)
            } : null
          };
        })()
      `);
      
      const mobile = JSON.parse(mobileMetrics.output);
      
      this.performanceMetrics.push({
        type: 'mobile',
        loadTime: mobileLoadTime,
        metrics: mobile,
        timestamp: new Date().toISOString()
      });
      
      await this.logger.performance(`Mobile load time: ${mobileLoadTime}ms`);
      await this.logger.performance(`Viewport: ${mobile.viewportWidth}px`);
      if (mobile.memoryUsage) {
        await this.logger.performance(`Memory usage: ${mobile.memoryUsage.used}MB / ${mobile.memoryUsage.total}MB`);
      }
      
    }, { timeout: 15000 });
  }

  /**
   * Run all performance tests
   */
  async runPerformanceTests() {
    try {
      await this.initialize('Performance Tests', 'chromium');
      await this.initializePageObjects();
      
      // Execute performance tests
      await this.testHomepageLoadPerformance();
      await this.testPageNavigationPerformance();
      await this.testResourceLoadingPerformance();
      await this.testMobilePerformance();
      
      const summary = this.getTestSummary();
      await this.logger.suiteEnd('Performance Tests Complete', summary);
      
      // Generate performance report
      const report = {
        suite: 'Performance Tests',
        timestamp: new Date().toISOString(),
        summary,
        metrics: this.performanceMetrics,
        recommendations: this.generatePerformanceRecommendations(summary)
      };
      
      console.log('\n=== PERFORMANCE TEST RESULTS ===');
      console.log(JSON.stringify(report, null, 2));
      
    } catch (error) {
      await this.logger.error(`Performance tests failed: ${error.message}`);
      throw error;
    } finally {
      await this.cleanup();
    }
  }

  generatePerformanceRecommendations(summary) {
    const recommendations = [];
    
    if (summary.failed > 0) {
      recommendations.push('Investigate failed performance tests - may indicate performance regression');
    }
    
    // Analyze performance metrics for recommendations
    const homepageMetric = this.performanceMetrics.find(m => m.page === 'homepage');
    if (homepageMetric && homepageMetric.loadTime > 2000) {
      recommendations.push('Homepage load time optimization recommended');
    }
    
    const navigationMetric = this.performanceMetrics.find(m => m.type === 'navigation');
    if (navigationMetric && navigationMetric.averageLoadTime > 2500) {
      recommendations.push('Navigation performance optimization needed');
    }
    
    recommendations.push('Regular performance monitoring should be implemented');
    recommendations.push('Consider implementing performance budgets');
    recommendations.push('Image optimization and lazy loading recommended');
    
    return recommendations;
  }
}

// Execute performance tests
async function main() {
  const performanceTests = new PerformanceTests();
  
  // Set a timeout for the entire performance test suite
  const timeoutId = setTimeout(() => {
    console.error('Performance tests timed out after 10 minutes');
    process.exit(1);
  }, 600000); // 10 minutes
  
  try {
    await performanceTests.runPerformanceTests();
    clearTimeout(timeoutId);
    process.exit(0);
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Performance tests failed:', error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Performance test error:', error);
  process.exit(1);
});
