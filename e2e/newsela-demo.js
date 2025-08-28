#!/usr/bin/env node

/**
 * Newsela Demo Test Suite
 * Educational platform testing for demo purposes
 */

import { BaseTestFramework } from './framework/base-test-framework.js';
import { TestConfig } from './config/test-config.js';

class NewselaDemo extends BaseTestFramework {
  constructor() {
    super();
    this.baseUrl = 'https://newsela.com';
  }

  /**
   * Demo Test 1: Homepage Educational Validation
   */
  async testHomepageEducational() {
    await this.executeTest('Homepage Educational Check', async () => {
      // Navigate to Newsela
      await this.client.navigateTo(this.baseUrl);
      
      // Wait for page to load
      await this.client.waitForElement('body', 'visible', 10000);
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Take full-page screenshot
      await this.client.takeScreenshot('reports/artifacts/screenshots/newsela-homepage.png', true);
      
      // Get page title
      const pageInfo = await this.client.getPageInfo();
      const title = pageInfo?.title || 'Unknown';
      const url = pageInfo?.url || this.baseUrl;
      
      await this.logger.business(`📄 Page Title: ${title}`);
      await this.logger.business(`🌐 URL: ${url}`);
      
      // Check for Newsela branding
      const titleCheck = title.toLowerCase().includes('newsela');
      await this.logger.business(`🏷️ Newsela Branding: ${titleCheck ? '✅ Found' : '⚠️ Not in title'}`);
      
      // Get main heading
      const heading = await this.client.getText('h1', 5000);
      if (heading.success) {
        await this.logger.business(`📝 Main Heading: "${heading.output}"`);
      }
      
      await this.logger.success('✅ Homepage educational validation completed');
    });
  }

  /**
   * Demo Test 2: Educational Navigation Elements
   */
  async testEducationalNavigation() {
    await this.executeTest('Educational Navigation Check', async () => {
      // Check for educational navigation elements
      const navElements = [
        { name: 'Main Navigation', selector: 'nav' },
        { name: 'Logo', selector: '.logo, .brand, [alt*="logo"], [data-testid="logo"]' },
        { name: 'Subject Links', selector: 'nav a, .nav-link, .subject-link' },
        { name: 'Grade Level Filter', selector: '.grade, [data-testid="grade"], .grade-level' },
        { name: 'Search Function', selector: '[type="search"], .search, .search-input' }
      ];

      for (const element of navElements) {
        const found = await this.client.waitForElement(element.selector, 'visible', 3000);
        await this.logger.business(`🔍 ${element.name}: ${found.success ? '✅ Found' : '❌ Not found'}`);
      }

      // Take navigation screenshot
      await this.client.takeScreenshot('reports/artifacts/screenshots/newsela-navigation.png', false);
      
      await this.logger.success('✅ Educational navigation validation completed');
    });
  }

  /**
   * Demo Test 3: Educational Content Analysis
   */
  async testEducationalContent() {
    await this.executeTest('Educational Content Check', async () => {
      // Look for education-related content
      const educationalElements = await this.client.evaluateJavaScript(`
        (() => {
          const content = document.body.textContent.toLowerCase();
          const keywords = [
            'education', 'learning', 'students', 'teachers', 'classroom', 
            'grade', 'reading', 'article', 'curriculum', 'lesson'
          ];
          const found = keywords.filter(keyword => content.includes(keyword));
          
          // Check for educational features
          const gradeFilters = document.querySelectorAll('[class*="grade"], [data-testid*="grade"]').length;
          const articles = document.querySelectorAll('[class*="article"], .content-card, .reading-card').length;
          const subjects = document.querySelectorAll('[class*="subject"], .subject-filter').length;
          
          return {
            keywords: found,
            gradeFilters: gradeFilters,
            articles: articles,
            subjects: subjects
          };
        })()
      `);

      if (educationalElements.success) {
        const data = educationalElements.output;
        const keywords = data.keywords || [];
        await this.logger.business(`📚 Educational Keywords Found: ${keywords.length > 0 ? keywords.join(', ') : 'None detected'}`);
        await this.logger.business(`🎓 Grade Filters: ${data.gradeFilters || 0}`);
        await this.logger.business(`📰 Article Elements: ${data.articles || 0}`);
        await this.logger.business(`📖 Subject Categories: ${data.subjects || 0}`);
      } else {
        await this.logger.business(`⚠️ Could not analyze educational content: ${educationalElements.error || 'Unknown error'}`);
      }

      // Try to interact with educational elements
      const searchElements = ['[type="search"]', '.search-input', '.search-btn', 'button'];
      for (const selector of searchElements) {
        const clickResult = await this.client.clickElement(selector, 2000);
        if (clickResult.success) {
          await this.logger.business(`🎯 Successfully clicked: ${selector}`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          await this.client.takeScreenshot('reports/artifacts/screenshots/newsela-interaction.png', false);
          break;
        }
      }

      await this.logger.success('✅ Educational content validation completed');
    });
  }

  /**
   * Demo Test 4: Grade Level Functionality
   */
  async testGradeLevelFeatures() {
    await this.executeTest('Grade Level Features Check', async () => {
      // Check for grade-level specific functionality
      const gradeLevelData = await this.client.evaluateJavaScript(`
        (() => {
          // Look for grade level selectors
          const gradeElements = document.querySelectorAll(
            '[class*="grade"], [data-testid*="grade"], .grade-level, .grade-filter'
          );
          
          const grades = [];
          gradeElements.forEach(element => {
            const text = element.textContent || element.value || '';
            if (text.match(/\\d+|k-\\d+|kindergarten|pre-k/i)) {
              grades.push(text.trim());
            }
          });
          
          // Look for reading level indicators
          const readingLevels = document.querySelectorAll(
            '[class*="lexile"], [class*="reading"], .reading-level'
          ).length;
          
          return {
            gradeElements: gradeElements.length,
            grades: grades.slice(0, 10),
            readingLevels: readingLevels,
            hasGradeSupport: gradeElements.length > 0
          };
        })()
      `);

      if (gradeLevelData.success) {
        const data = gradeLevelData.output;
        await this.logger.business(`🎓 Grade Elements Found: ${data.gradeElements || 0}`);
        await this.logger.business(`📊 Grade Levels: ${data.grades && data.grades.length > 0 ? data.grades.join(', ') : 'None detected'}`);
        await this.logger.business(`📖 Reading Level Indicators: ${data.readingLevels || 0}`);
        await this.logger.business(`✅ Grade Level Support: ${data.hasGradeSupport ? 'Available' : 'Not detected'}`);
      }

      await this.logger.success('✅ Grade level features validation completed');
    });
  }

  /**
   * Demo Test 5: Page Performance for Educational Platform
   */
  async testEducationalPerformance() {
    await this.executeTest('Educational Platform Performance', async () => {
      const performanceData = await this.client.evaluateJavaScript(`
        (() => {
          if (performance && performance.timing) {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
            
            // Educational platform specific metrics
            const images = document.querySelectorAll('img').length;
            const videos = document.querySelectorAll('video, iframe[src*="youtube"], iframe[src*="vimeo"]').length;
            const interactiveElements = document.querySelectorAll('button, [role="button"], .clickable').length;
            
            return {
              loadTime: Math.round(loadTime),
              domReady: Math.round(domReady),
              readyState: document.readyState,
              images: images,
              videos: videos,
              interactiveElements: interactiveElements
            };
          }
          return { available: false };
        })()
      `);

      if (performanceData.success && performanceData.output.available !== false) {
        const perf = performanceData.output;
        const loadTime = perf.loadTime || 'N/A';
        const domReady = perf.domReady || 'N/A';
        const readyState = perf.readyState || 'unknown';
        const images = perf.images || 0;
        const videos = perf.videos || 0;
        const interactiveElements = perf.interactiveElements || 0;
        
        await this.logger.performance(`⏱️ Page Load Time: ${loadTime}ms`);
        await this.logger.performance(`⚡ DOM Ready: ${domReady}ms`);
        await this.logger.performance(`📊 Ready State: ${readyState}`);
        await this.logger.performance(`🖼️ Images: ${images}`);
        await this.logger.performance(`🎥 Videos: ${videos}`);
        await this.logger.performance(`🔘 Interactive Elements: ${interactiveElements}`);
        
        // Performance assessment for educational content
        const loadTimeNum = typeof loadTime === 'number' ? loadTime : 0;
        if (loadTimeNum > 0 && loadTimeNum < 2000) {
          await this.logger.performance('🚀 Excellent performance for education - under 2 seconds');
        } else if (loadTimeNum > 0 && loadTimeNum < 4000) {
          await this.logger.performance('✅ Good performance for education - 2-4 seconds');
        } else if (loadTimeNum > 0 && loadTimeNum < 6000) {
          await this.logger.performance('⚠️ Moderate performance - may impact learning experience');
        } else if (loadTimeNum > 0) {
          await this.logger.performance('🐌 Slow performance - may frustrate students and teachers');
        } else {
          await this.logger.performance('📊 Performance data not available');
        }
      }

      await this.logger.success('✅ Educational platform performance check completed');
    });
  }

  /**
   * Run complete Newsela demo test suite
   */
  async runDemo() {
    await this.initialize('📚 Newsela Educational Demo Test Suite');
    
    try {
      await this.logger.business('🎬 Starting Newsela educational platform testing...');
      await this.logger.business(`🎯 Target: ${this.baseUrl}`);
      
      await this.testHomepageEducational();
      await this.testEducationalNavigation();
      await this.testEducationalContent();
      await this.testGradeLevelFeatures();
      await this.testEducationalPerformance();
      
      await this.logger.success('🎉 Newsela educational demo test suite completed successfully!');
      await this.logger.success('📸 Screenshots saved to reports/artifacts/screenshots/');
      
    } catch (error) {
      await this.logger.error(`❌ Demo test failed: ${error.message}`);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Execute demo if run directly
if (import.meta.url === new URL(process.argv[1], 'file://').href) {
  const demo = new NewselaDemo();
  await demo.runDemo();
}

export { NewselaDemo };
