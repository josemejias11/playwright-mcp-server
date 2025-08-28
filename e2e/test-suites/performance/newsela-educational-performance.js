#!/usr/bin/env node

/**
 * Newsela Educational Performance Tests
 * 
 * Purpose: Ensure optimal performance for educational content delivery
 * Focus: Student engagement through fast, responsive learning experience
 * Frequency: Daily performance monitoring
 * Timeout: 12 minutes max
 * 
 * Educational Performance Priorities:
 * - Article loading speed for reading flow
 * - Grade level filtering responsiveness
 * - Search performance for content discovery
 * - Image loading for visual learners
 * - Mobile performance for device diversity
 * - Teacher dashboard responsiveness
 */

import { BaseTestFramework } from '../../framework/base-test-framework.js';
import { NewselaHomePage } from '../../page-objects/homepage.js';

class NewselaEducationalPerformanceTests extends BaseTestFramework {
  constructor() {
    super();
    this.homePage = null;
    this.performanceThresholds = {
      pageLoad: 3000,        // 3 seconds for initial page load
      articleLoad: 2000,     // 2 seconds for article content
      gradeFilter: 1000,     // 1 second for grade filtering
      search: 1500,          // 1.5 seconds for search results
      imageLoad: 2500,       // 2.5 seconds for educational images
      mobileLoad: 4000       // 4 seconds for mobile experience
    };
  }

  async initializePageObjects() {
    this.homePage = new NewselaHomePage(this.client);
  }

  /**
   * PERFORMANCE TEST 1: Educational Homepage Loading Speed
   * Critical for first impression and student engagement
   */
  async testHomepageLoadingSpeed() {
    await this.executeTest('Educational Homepage Loading Performance', async () => {
      const startTime = Date.now();
      
      await this.homePage.navigate();
      
      const loadTime = Date.now() - startTime;
      
      // Check if homepage loads within threshold
      if (loadTime > this.performanceThresholds.pageLoad) {
        throw new Error(`Homepage load time ${loadTime}ms exceeds ${this.performanceThresholds.pageLoad}ms threshold - may impact student engagement`);
      }
      
      // Check for educational content visibility
      const contentVisibilityTime = await this.homePage.measureContentVisibilityTime();
      if (contentVisibilityTime > this.performanceThresholds.articleLoad) {
        throw new Error(`Educational content visibility delayed: ${contentVisibilityTime}ms`);
      }
      
      await this.logger.performance(`✓ Homepage load time: ${loadTime}ms (target: <${this.performanceThresholds.pageLoad}ms)`);
      await this.logger.performance(`✓ Educational content visible: ${contentVisibilityTime}ms`);
    }, { timeout: 10000 });
  }

  /**
   * PERFORMANCE TEST 2: Article Loading Performance
   * Critical for reading flow and comprehension
   */
  async testArticleLoadingPerformance() {
    await this.executeTest('Educational Article Loading Performance', async () => {
      await this.homePage.navigate();
      
      // Get first few articles for testing
      const articles = await this.homePage.getEducationalArticles();
      if (!articles || articles.length === 0) {
        throw new Error('No articles found for performance testing');
      }
      
      const articleLoadTimes = [];
      
      // Test loading of first 3 articles
      for (let i = 0; i < Math.min(articles.length, 3); i++) {
        const startTime = Date.now();
        
        const success = await articles[i].clickAndLoad();
        const loadTime = Date.now() - startTime;
        
        if (!success) {
          throw new Error(`Article ${i + 1} failed to load`);
        }
        
        if (loadTime > this.performanceThresholds.articleLoad) {
          throw new Error(`Article ${i + 1} load time ${loadTime}ms exceeds ${this.performanceThresholds.articleLoad}ms - impacts reading flow`);
        }
        
        articleLoadTimes.push(loadTime);
        await this.logger.performance(`✓ Article ${i + 1} load time: ${loadTime}ms`);
        
        // Return to homepage for next test
        await this.homePage.navigate();
      }
      
      const avgLoadTime = articleLoadTimes.reduce((sum, time) => sum + time, 0) / articleLoadTimes.length;
      await this.logger.performance(`✓ Average article load time: ${avgLoadTime.toFixed(0)}ms (target: <${this.performanceThresholds.articleLoad}ms)`);
    }, { timeout: 20000 });
  }

  /**
   * PERFORMANCE TEST 3: Grade Level Filtering Performance
   * Critical for differentiated instruction workflow
   */
  async testGradeLevelFilteringPerformance() {
    await this.executeTest('Grade Level Filtering Performance', async () => {
      await this.homePage.navigate();
      
      // Get available grade levels
      const gradeLevels = await this.homePage.getAvailableGradeLevels();
      if (!gradeLevels || gradeLevels.length === 0) {
        throw new Error('No grade levels found for performance testing');
      }
      
      const filterTimes = [];
      
      // Test filtering performance for different grade levels
      for (let i = 0; i < Math.min(gradeLevels.length, 4); i++) {
        const gradeLevel = gradeLevels[i];
        const startTime = Date.now();
        
        const filterResult = await this.homePage.applyGradeLevelFilter(gradeLevel);
        const filterTime = Date.now() - startTime;
        
        if (!filterResult.success) {
          throw new Error(`Grade level filter '${gradeLevel}' failed to apply`);
        }
        
        if (filterTime > this.performanceThresholds.gradeFilter) {
          throw new Error(`Grade filtering for '${gradeLevel}' took ${filterTime}ms - exceeds ${this.performanceThresholds.gradeFilter}ms threshold`);
        }
        
        filterTimes.push(filterTime);
        await this.logger.performance(`✓ Grade ${gradeLevel} filter: ${filterTime}ms, ${filterResult.articleCount} articles`);
      }
      
      const avgFilterTime = filterTimes.reduce((sum, time) => sum + time, 0) / filterTimes.length;
      await this.logger.performance(`✓ Average grade filtering time: ${avgFilterTime.toFixed(0)}ms (target: <${this.performanceThresholds.gradeFilter}ms)`);
    }, { timeout: 15000 });
  }

  /**
   * PERFORMANCE TEST 4: Educational Content Search Performance
   * Critical for content discovery and research skills
   */
  async testEducationalSearchPerformance() {
    await this.executeTest('Educational Search Performance', async () => {
      await this.homePage.navigate();
      
      // Test search performance with educational terms
      const searchTerms = ['science', 'history', 'literature', 'mathematics'];
      const searchTimes = [];
      
      for (const term of searchTerms) {
        const startTime = Date.now();
        
        const searchResult = await this.homePage.searchEducationalContent(term);
        const searchTime = Date.now() - startTime;
        
        if (!searchResult.success) {
          throw new Error(`Search for '${term}' failed`);
        }
        
        if (searchTime > this.performanceThresholds.search) {
          throw new Error(`Search for '${term}' took ${searchTime}ms - exceeds ${this.performanceThresholds.search}ms threshold`);
        }
        
        searchTimes.push(searchTime);
        await this.logger.performance(`✓ Search '${term}': ${searchTime}ms, ${searchResult.articleCount} results`);
      }
      
      const avgSearchTime = searchTimes.reduce((sum, time) => sum + time, 0) / searchTimes.length;
      await this.logger.performance(`✓ Average search time: ${avgSearchTime.toFixed(0)}ms (target: <${this.performanceThresholds.search}ms)`);
    }, { timeout: 12000 });
  }

  /**
   * PERFORMANCE TEST 5: Educational Image Loading Performance
   * Critical for visual learners and multimedia content
   */
  async testEducationalImageLoadingPerformance() {
    await this.executeTest('Educational Image Loading Performance', async () => {
      await this.homePage.navigate();
      
      // Measure image loading performance
      const imageLoadMetrics = await this.homePage.measureImageLoadingPerformance();
      
      if (imageLoadMetrics.totalImages === 0) {
        await this.logger.performance('⚠️ No images found for performance testing');
        return;
      }
      
      if (imageLoadMetrics.averageLoadTime > this.performanceThresholds.imageLoad) {
        throw new Error(`Image loading average ${imageLoadMetrics.averageLoadTime}ms exceeds ${this.performanceThresholds.imageLoad}ms - impacts visual learning`);
      }
      
      if (imageLoadMetrics.failedImages > 0) {
        throw new Error(`${imageLoadMetrics.failedImages}/${imageLoadMetrics.totalImages} images failed to load`);
      }
      
      await this.logger.performance(`✓ Educational images loaded: ${imageLoadMetrics.totalImages} images`);
      await this.logger.performance(`✓ Average image load time: ${imageLoadMetrics.averageLoadTime}ms`);
      await this.logger.performance(`✓ Largest image: ${imageLoadMetrics.largestImageTime}ms`);
    }, { timeout: 15000 });
  }

  /**
   * PERFORMANCE TEST 6: Mobile Educational Experience Performance
   * Critical for device diversity in classrooms
   */
  async testMobileEducationalPerformance() {
    await this.executeTest('Mobile Educational Performance', async () => {
      // Switch to mobile viewport
      await this.homePage.setMobileViewport();
      
      const startTime = Date.now();
      await this.homePage.navigate();
      const mobileLoadTime = Date.now() - startTime;
      
      if (mobileLoadTime > this.performanceThresholds.mobileLoad) {
        throw new Error(`Mobile load time ${mobileLoadTime}ms exceeds ${this.performanceThresholds.mobileLoad}ms - impacts mobile learning`);
      }
      
      // Test mobile educational interactions
      const mobileInteractionTime = await this.homePage.measureMobileInteractionPerformance();
      if (mobileInteractionTime > 1000) {
        throw new Error(`Mobile interaction delay ${mobileInteractionTime}ms impacts touch learning experience`);
      }
      
      await this.logger.performance(`✓ Mobile homepage load: ${mobileLoadTime}ms (target: <${this.performanceThresholds.mobileLoad}ms)`);
      await this.logger.performance(`✓ Mobile interaction response: ${mobileInteractionTime}ms`);
      
      // Reset to desktop viewport
      await this.homePage.setDesktopViewport();
    }, { timeout: 12000 });
  }

  /**
   * Run all educational performance tests
   */
  async runPerformanceTests() {
    try {
      await this.initialize('Newsela Educational Performance Tests', 'chromium');
      await this.initializePageObjects();
      
      // Run performance tests for educational platform
      await this.testHomepageLoadingSpeed();
      await this.testArticleLoadingPerformance();
      await this.testGradeLevelFilteringPerformance();
      await this.testEducationalSearchPerformance();
      await this.testEducationalImageLoadingPerformance();
      await this.testMobileEducationalPerformance();
      
      const summary = this.getTestSummary();
      await this.logger.suiteEnd('Educational Performance Tests Complete', summary);
      
      // Performance standards for educational content
      if (summary.failed > 0) {
        const failureRate = (summary.failed / summary.total) * 100;
        if (failureRate > 15) { // Allow up to 15% failures for performance tests
          throw new Error(`Educational performance standards not met: ${summary.failed}/${summary.total} tests failed (${failureRate.toFixed(1)}%)`);
        } else {
          await this.logger.business(`⚠️ Some performance optimizations needed: ${summary.failed}/${summary.total} failed (${failureRate.toFixed(1)}%)`);
        }
      }
      
      await this.logger.success('⚡ Educational performance standards met - Platform optimized for learning');
      
    } catch (error) {
      await this.logger.error(`💥 Educational performance failure: ${error.message}`);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Execute educational performance tests
async function main() {
  const performanceTests = new NewselaEducationalPerformanceTests();
  
  try {
    await performanceTests.runPerformanceTests();
    console.log('✅ EDUCATIONAL PERFORMANCE TESTS PASSED - Platform optimized for student engagement');
    process.exit(0);
  } catch (error) {
    console.error('❌ EDUCATIONAL PERFORMANCE TESTS FAILED - Platform may impact learning experience');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ CRITICAL EDUCATIONAL PERFORMANCE FAILURE:', error);
  process.exit(1);
});
