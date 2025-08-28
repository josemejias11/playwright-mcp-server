#!/usr/bin/env node

/**
 * Newsela Educational Content & Reading Comprehension Tests
 * 
 * Purpose: Validate educational content quality and learning features
 * Frequency: Daily CI/CD for educational platform
 * Timeout: 20 minutes max
 * 
 * Educational Features:
 * - Article reading level validation
 * - Grade-appropriate content filtering
 * - Reading comprehension features
 * - Student progress tracking
 * - Teacher dashboard functionality
 * - Curriculum standards alignment
 */

import { BaseTestFramework } from '../../framework/base-test-framework.js';
import { NewselaHomePage } from '../../page-objects/homepage.js';
import { NewselaContactPage } from '../../page-objects/contact-page.js';

class NewselaEducationalContentTests extends BaseTestFramework {
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
   * EDUCATIONAL TEST 1: Article Content Validation
   * Validates educational articles are present and accessible
   */
  async testArticleContentValidation() {
    await this.executeTest('Educational Article Content Validation', async () => {
      await this.homePage.navigate();
      
      // Check for educational articles
      const articles = await this.homePage.validateEducationalArticles();
      if (!articles || articles.length === 0) {
        throw new Error('No educational articles found on homepage');
      }
      
      // Validate article structure
      for (let i = 0; i < Math.min(articles.length, 5); i++) {
        const article = articles[i];
        const hasTitle = await article.hasTitle();
        const hasGradeLevel = await article.hasGradeLevel();
        const hasSubject = await article.hasSubject();
        
        if (!hasTitle) {
          throw new Error(`Article ${i + 1} missing title`);
        }
        
        await this.logger.business(`✓ Article ${i + 1}: Title=${hasTitle}, Grade=${hasGradeLevel}, Subject=${hasSubject}`);
      }
      
      await this.logger.business(`✓ Found ${articles.length} educational articles`);
    }, { timeout: 15000 });
  }

  /**
   * EDUCATIONAL TEST 2: Grade Level Filtering
   * Validates grade level filtering functionality
   */
  async testGradeLevelFiltering() {
    await this.executeTest('Grade Level Filtering Validation', async () => {
      await this.homePage.navigate();
      
      // Check for grade level filters
      const gradeLevels = await this.homePage.validateGradeLevelFilters();
      if (!gradeLevels || gradeLevels.length === 0) {
        throw new Error('No grade level filters found - critical for educational platform');
      }
      
      // Test filtering functionality
      for (const gradeLevel of gradeLevels.slice(0, 3)) {
        const filterResult = await this.homePage.applyGradeLevelFilter(gradeLevel);
        if (!filterResult.success) {
          throw new Error(`Grade level filter '${gradeLevel}' not working`);
        }
        
        await this.logger.business(`✓ Grade level filter '${gradeLevel}': ${filterResult.articleCount} articles`);
      }
      
      await this.logger.business(`✓ Grade level filtering working for ${gradeLevels.length} levels`);
    }, { timeout: 12000 });
  }

  /**
   * EDUCATIONAL TEST 3: Subject Category Navigation
   * Validates educational subject organization
   */
  async testSubjectCategoryNavigation() {
    await this.executeTest('Subject Category Navigation', async () => {
      await this.homePage.navigate();
      
      // Check for subject categories
      const subjects = await this.homePage.validateSubjectCategories();
      if (!subjects || subjects.length === 0) {
        throw new Error('No subject categories found - critical for curriculum organization');
      }
      
      // Expected educational subjects
      const expectedSubjects = ['Science', 'Social Studies', 'ELA', 'Math', 'Arts'];
      let foundSubjects = 0;
      
      for (const expectedSubject of expectedSubjects) {
        const subjectExists = subjects.some(subject => 
          subject.toLowerCase().includes(expectedSubject.toLowerCase())
        );
        if (subjectExists) {
          foundSubjects++;
          await this.logger.business(`✓ Found ${expectedSubject} subject category`);
        }
      }
      
      if (foundSubjects < 3) {
        throw new Error(`Only found ${foundSubjects}/${expectedSubjects.length} expected educational subjects`);
      }
      
      await this.logger.business(`✓ Educational subjects validated: ${foundSubjects}/${expectedSubjects.length}`);
    }, { timeout: 10000 });
  }

  /**
   * EDUCATIONAL TEST 4: Reading Level Assessment
   * Validates reading level indicators and lexile levels
   */
  async testReadingLevelAssessment() {
    await this.executeTest('Reading Level Assessment', async () => {
      await this.homePage.navigate();
      
      // Check for reading level indicators
      const readingLevels = await this.homePage.validateReadingLevelIndicators();
      if (!readingLevels || readingLevels.length === 0) {
        await this.logger.business('⚠️ Reading level indicators not found - may impact differentiated instruction');
        return; // Non-critical, continue testing
      }
      
      // Validate lexile level ranges
      const lexileRanges = await this.homePage.validateLexileLevels();
      if (lexileRanges && lexileRanges.length > 0) {
        await this.logger.business(`✓ Lexile levels available: ${lexileRanges.length} ranges`);
      }
      
      await this.logger.business(`✓ Reading level assessment features validated`);
    }, { timeout: 8000 });
  }

  /**
   * EDUCATIONAL TEST 5: Search for Educational Content
   * Validates educational content search functionality
   */
  async testEducationalContentSearch() {
    await this.executeTest('Educational Content Search', async () => {
      await this.homePage.navigate();
      
      // Test educational search terms
      const educationalTerms = ['science', 'history', 'mathematics', 'literature'];
      
      for (const term of educationalTerms) {
        const searchResults = await this.homePage.searchEducationalContent(term);
        
        if (!searchResults.success) {
          throw new Error(`Search failed for educational term: ${term}`);
        }
        
        if (searchResults.articleCount === 0) {
          await this.logger.business(`⚠️ No results for '${term}' - may indicate content gaps`);
        } else {
          await this.logger.business(`✓ Search '${term}': ${searchResults.articleCount} educational articles`);
        }
      }
      
      await this.logger.business(`✓ Educational content search functionality validated`);
    }, { timeout: 15000 });
  }

  /**
   * EDUCATIONAL TEST 6: Teacher Support Resources
   * Validates teacher tools and support materials
   */
  async testTeacherSupportResources() {
    await this.executeTest('Teacher Support Resources', async () => {
      // Check contact page for educator support
      await this.contactPage.navigate();
      
      // Look for teacher-specific support
      const teacherSupport = await this.contactPage.validateTeacherSupport();
      if (!teacherSupport.hasEducatorResources) {
        await this.logger.business('⚠️ Teacher support resources not prominently displayed');
      }
      
      // Check for professional development information
      const professionalDev = await this.contactPage.validateProfessionalDevelopment();
      if (professionalDev.hasTraining) {
        await this.logger.business(`✓ Professional development resources available`);
      }
      
      await this.logger.business(`✓ Teacher support validation completed`);
    }, { timeout: 10000 });
  }

  /**
   * Run all educational content tests
   */
  async runEducationalTests() {
    try {
      await this.initialize('Newsela Educational Content Validation Tests', 'chromium');
      await this.initializePageObjects();
      
      // Run educational tests in logical order
      await this.testArticleContentValidation();
      await this.testGradeLevelFiltering();
      await this.testSubjectCategoryNavigation();
      await this.testReadingLevelAssessment();
      await this.testEducationalContentSearch();
      await this.testTeacherSupportResources();
      
      const summary = this.getTestSummary();
      await this.logger.suiteEnd('Educational Content Validation Tests Complete', summary);
      
      // Educational content standards
      if (summary.failed > 0) {
        const failureRate = (summary.failed / summary.total) * 100;
        if (failureRate > 10) { // Allow up to 10% failures for non-critical educational features
          throw new Error(`Educational quality threshold exceeded: ${summary.failed}/${summary.total} tests failed (${failureRate.toFixed(1)}%)`);
        } else {
          await this.logger.business(`⚠️ Some educational features need attention: ${summary.failed}/${summary.total} failed (${failureRate.toFixed(1)}%)`);
        }
      }
      
      await this.logger.success('🎓 Educational content validation completed successfully');
      
    } catch (error) {
      await this.logger.error(`💥 Educational content validation failed: ${error.message}`);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Execute educational content tests
async function main() {
  const educationalTests = new NewselaEducationalContentTests();
  
  try {
    await educationalTests.runEducationalTests();
    console.log('✅ EDUCATIONAL CONTENT TESTS PASSED');
    process.exit(0);
  } catch (error) {
    console.error('❌ EDUCATIONAL CONTENT TESTS FAILED');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ CRITICAL EDUCATIONAL TEST FAILURE:', error);
  process.exit(1);
});
