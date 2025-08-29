#!/usr/bin/env node

/**
 * Newsela Educational Content & Curriculum - Functional Tests
 * 
 * Purpose: Test educational content delivery, curriculum alignment, and subject area coverage
 * Focus: ELA, Social Studies, Science content; grade-level differentiation; curriculum standards
 * Frequency: Full regression, content updates
 * 
 * Tests the core educational content that makes Newsela valuable to educators
 */

import { BaseTestFramework } from '../../framework/base-test-framework.js';

class NewselaEducationalContentTests extends BaseTestFramework {
  constructor() {
    super();
  }

  /**
   * FUNCTIONAL TEST 1: Subject Area Coverage
   * Test: All major subject areas are prominently featured
   */
  async testSubjectAreaCoverage() {
    await this.executeTest('Educational Subject Area Coverage', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      const contentResult = await this.client.getText('body', 10000);
      if (!contentResult.success) {
        throw new Error('Cannot access content for subject area analysis');
      }
      
      const content = contentResult.output.toLowerCase();
      
      // Core subject areas that should be featured
      const subjectAreas = {
        'ELA (English Language Arts)': content.includes('ela') || content.includes('english language arts') || content.includes('reading') || content.includes('literacy'),
        'Social Studies': content.includes('social studies') || content.includes('history') || content.includes('civics'),
        'Science': content.includes('science') || content.includes('stem'),
        'Current Events': content.includes('current') || content.includes('news') || content.includes('events'),
        'Reading Comprehension': content.includes('comprehension') || content.includes('reading') || content.includes('literacy')
      };
      
      const availableSubjects = Object.entries(subjectAreas).filter(([name, available]) => available);
      
      if (availableSubjects.length < 4) {
        throw new Error(`Insufficient subject area coverage - only ${availableSubjects.length} subjects found`);
      }
      
      // Look for subject-specific navigation or sections
      const subjectNavSelectors = [
        'a:has-text("ELA")',
        'a:has-text("Social Studies")',
        'a:has-text("Science")',
        'nav a:has-text("Subjects")',
        'a[href*="subject"]'
      ];
      
      let subjectNavFound = false;
      for (const selector of subjectNavSelectors) {
        try {
          const result = await this.client.waitForElement(selector, 'visible', 2000);
          if (result.success) {
            subjectNavFound = true;
            await this.logger.business(`✓ Subject navigation found: ${selector}`);
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      await this.logger.business(`✓ Subject areas available: ${availableSubjects.map(([name]) => name).join(', ')}`);
      await this.logger.business(`✓ Subject navigation: ${subjectNavFound ? 'Available' : 'Text mentions only'}`);
    }, { timeout: 10000 });
  }

  /**
   * FUNCTIONAL TEST 2: Grade Level Differentiation
   * Test: Content is available for different grade levels
   */
  async testGradeLevelDifferentiation() {
    await this.executeTest('Grade Level Differentiation', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      const contentResult = await this.client.getText('body', 10000);
      if (!contentResult.success) {
        throw new Error('Cannot access content for grade level analysis');
      }
      
      const content = contentResult.output.toLowerCase();
      
      // Check for grade level indicators
      const gradeLevelFeatures = {
        'Elementary': content.includes('elementary') || content.includes('k-5') || content.includes('grades 1') || content.includes('grades 2'),
        'Middle School': content.includes('middle') || content.includes('6-8') || content.includes('grades 6') || content.includes('grades 7'),
        'High School': content.includes('high school') || content.includes('9-12') || content.includes('grades 9') || content.includes('secondary'),
        'K-12 Range': content.includes('k-12') || content.includes('k12') || content.includes('all grades'),
        'Lexile Levels': content.includes('lexile') || content.includes('reading level') || content.includes('level'),
        'Differentiated Text': content.includes('differentiat') || content.includes('adapt') || content.includes('multiple levels')
      };
      
      const availableGradeLevels = Object.entries(gradeLevelFeatures).filter(([name, available]) => available);
      
      if (availableGradeLevels.length < 3) {
        throw new Error(`Limited grade level differentiation - only ${availableGradeLevels.length} features found`);
      }
      
      // Look for specific grade selectors or level indicators
      const levelSelectors = [
        'select[name*="grade"]',
        'button:has-text("Grade")',
        'a:has-text("Level")',
        '[data-testid*="grade"]',
        '[data-testid*="level"]'
      ];
      
      let levelSelectorFound = false;
      for (const selector of levelSelectors) {
        try {
          const result = await this.client.waitForElement(selector, 'visible', 2000);
          if (result.success) {
            levelSelectorFound = true;
            await this.logger.business(`✓ Grade level selector found: ${selector}`);
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      await this.logger.business(`✓ Grade level features: ${availableGradeLevels.map(([name]) => name).join(', ')}`);
      await this.logger.business(`✓ Interactive level selection: ${levelSelectorFound ? 'Available' : 'Not found'}`);
    }, { timeout: 10000 });
  }

  /**
   * FUNCTIONAL TEST 3: Curriculum Standards Alignment
   * Test: Content aligns with educational standards
   */
  async testCurriculumStandardsAlignment() {
    await this.executeTest('Curriculum Standards Alignment', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      const contentResult = await this.client.getText('body', 10000);
      if (!contentResult.success) {
        throw new Error('Cannot access content for standards analysis');
      }
      
      const content = contentResult.output.toLowerCase();
      
      // Check for curriculum standards mentions
      const standardsFeatures = {
        'Common Core': content.includes('common core') || content.includes('ccss'),
        'State Standards': content.includes('state standard') || content.includes('standards'),
        'NGSS (Science)': content.includes('ngss') || content.includes('next generation science'),
        'C3 Framework (Social Studies)': content.includes('c3') || content.includes('c3 framework'),
        'Curriculum Alignment': content.includes('curriculum') || content.includes('align'),
        'Standards-Based': content.includes('standards-based') || content.includes('standard')
      };
      
      const availableStandards = Object.entries(standardsFeatures).filter(([name, available]) => available);
      
      if (availableStandards.length < 2) {
        await this.logger.warning(`⚠️ Limited standards alignment visible - only ${availableStandards.length} features found`);
      }
      
      // Look for standards-related navigation or information
      const standardsSelectors = [
        'a:has-text("Standards")',
        'a:has-text("Curriculum")',
        'a:has-text("Alignment")',
        'a[href*="standard"]',
        'a[href*="curriculum"]'
      ];
      
      let standardsNavFound = false;
      for (const selector of standardsSelectors) {
        try {
          const result = await this.client.waitForElement(selector, 'visible', 2000);
          if (result.success) {
            standardsNavFound = true;
            await this.logger.business(`✓ Standards navigation found: ${selector}`);
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      await this.logger.business(`✓ Standards alignment: ${availableStandards.map(([name]) => name).join(', ')}`);
      await this.logger.business(`✓ Standards information access: ${standardsNavFound ? 'Available' : 'Limited'}`);
    }, { timeout: 8000 });
  }

  /**
   * FUNCTIONAL TEST 4: Content Library & Article Access
   * Test: Teachers can preview and access educational content
   */
  async testContentLibraryAccess() {
    await this.executeTest('Educational Content Library Access', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      // Look for content library access points
      const librarySelectors = [
        'a:has-text("Library")',
        'a:has-text("Articles")',
        'a:has-text("Content")',
        'a:has-text("Browse")',
        'button:has-text("Explore")',
        'a[href*="library"]',
        'a[href*="article"]',
        'a[href*="content"]'
      ];
      
      let libraryAccessFound = false;
      let librarySelector = '';
      
      for (const selector of librarySelectors) {
        try {
          const result = await this.client.waitForElement(selector, 'visible', 2000);
          if (result.success) {
            libraryAccessFound = true;
            librarySelector = selector;
            await this.logger.business(`✓ Content library access: ${selector}`);
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      // Check for content preview or sample availability
      const contentResult = await this.client.getText('body', 10000);
      if (contentResult.success) {
        const content = contentResult.output.toLowerCase();
        
        const contentFeatures = {
          'Article Library': content.includes('article') || content.includes('library'),
          'Content Preview': content.includes('preview') || content.includes('sample'),
          'Search Functionality': content.includes('search') || content.includes('find'),
          'Content Categories': content.includes('category') || content.includes('topic'),
          'Recent Content': content.includes('recent') || content.includes('new') || content.includes('latest')
        };
        
        const availableContentFeatures = Object.entries(contentFeatures).filter(([name, available]) => available);
        
        await this.logger.business(`✓ Content features: ${availableContentFeatures.map(([name]) => name).join(', ')}`);
      }
      
      if (!libraryAccessFound) {
        await this.logger.warning('⚠️ Content library access not clearly visible - may affect content discovery');
      }
      
      await this.logger.business(`✓ Content library accessibility: ${libraryAccessFound ? 'Clear access point' : 'Limited visibility'}`);
    }, { timeout: 10000 });
  }

  /**
   * FUNCTIONAL TEST 5: Reading Comprehension & Literacy Features
   * Test: Platform supports reading comprehension and literacy development
   */
  async testReadingComprehensionFeatures() {
    await this.executeTest('Reading Comprehension Features', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      const contentResult = await this.client.getText('body', 10000);
      if (!contentResult.success) {
        throw new Error('Cannot access content for reading comprehension analysis');
      }
      
      const content = contentResult.output.toLowerCase();
      
      // Check for reading comprehension features
      const readingFeatures = {
        'Reading Comprehension': content.includes('comprehension') || content.includes('reading'),
        'Literacy Development': content.includes('literacy') || content.includes('reading skills'),
        'Text Complexity': content.includes('complex') || content.includes('lexile') || content.includes('level'),
        'Vocabulary Support': content.includes('vocabulary') || content.includes('vocab'),
        'Text Analysis': content.includes('analysis') || content.includes('analyze'),
        'Close Reading': content.includes('close reading') || content.includes('annotation')
      };
      
      const availableReadingFeatures = Object.entries(readingFeatures).filter(([name, available]) => available);
      
      if (availableReadingFeatures.length < 3) {
        throw new Error(`Limited reading comprehension features - only ${availableReadingFeatures.length} found`);
      }
      
      // Look for reading-specific tools or mentions
      const readingTools = ['annotation', 'highlight', 'note', 'quiz', 'question', 'assessment'];
      const availableTools = readingTools.filter(tool => content.includes(tool));
      
      await this.logger.business(`✓ Reading features: ${availableReadingFeatures.map(([name]) => name).join(', ')}`);
      await this.logger.business(`✓ Reading tools: ${availableTools.join(', ') || 'General reading support'}`);
    }, { timeout: 8000 });
  }

  /**
   * FUNCTIONAL TEST 6: Authentic & Current Content
   * Test: Content is authentic, current, and engaging for students
   */
  async testAuthenticCurrentContent() {
    await this.executeTest('Authentic & Current Content', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      const contentResult = await this.client.getText('body', 10000);
      if (!contentResult.success) {
        throw new Error('Cannot access content for authenticity analysis');
      }
      
      const content = contentResult.output.toLowerCase();
      
      // Check for authentic content indicators
      const authenticityFeatures = {
        'Current Events': content.includes('current') || content.includes('news') || content.includes('today'),
        'Real-World Content': content.includes('real') || content.includes('authentic') || content.includes('actual'),
        'Primary Sources': content.includes('primary') || content.includes('source'),
        'Updated Content': content.includes('updated') || content.includes('recent') || content.includes('latest'),
        'Student Engagement': content.includes('engage') || content.includes('interest') || content.includes('relevant'),
        'Diverse Perspectives': content.includes('diverse') || content.includes('perspective') || content.includes('multicultural')
      };
      
      const availableAuthenticityFeatures = Object.entries(authenticityFeatures).filter(([name, available]) => available);
      
      if (availableAuthenticityFeatures.length < 3) {
        await this.logger.warning(`⚠️ Limited authentic content features - only ${availableAuthenticityFeatures.length} found`);
      }
      
      // Look for content freshness indicators
      const freshnessKeywords = ['daily', 'weekly', 'new', 'updated', 'latest', 'recent'];
      const contentFreshness = freshnessKeywords.filter(keyword => content.includes(keyword));
      
      await this.logger.business(`✓ Authenticity features: ${availableAuthenticityFeatures.map(([name]) => name).join(', ')}`);
      await this.logger.business(`✓ Content freshness: ${contentFreshness.join(', ') || 'Not emphasized'}`);
    }, { timeout: 8000 });
  }

  async runEducationalContentTests() {
    try {
      console.log('\n📚 NEWSELA EDUCATIONAL CONTENT & CURRICULUM - FUNCTIONAL TESTS');
      console.log('===============================================================');
      console.log('🎯 Testing educational content delivery and curriculum alignment');
      console.log('');

      await this.testSubjectAreaCoverage();
      await this.testGradeLevelDifferentiation();
      await this.testCurriculumStandardsAlignment();
      await this.testContentLibraryAccess();
      await this.testReadingComprehensionFeatures();
      await this.testAuthenticCurrentContent();

      // Generate summary
      const summary = this.getTestSummary();
      console.log('\n📊 EDUCATIONAL CONTENT FUNCTIONAL TEST SUMMARY');
      console.log('===============================================');
      console.log(`Total Content Tests: ${summary.total}`);
      console.log(`Passed: ${summary.passed}`);
      console.log(`Failed: ${summary.failed}`);
      console.log(`Educational Content Success Rate: ${Math.round((summary.passed / summary.total) * 100)}%`);
      
      if (summary.failed > 0) {
        console.log(`⚠️ ${summary.failed} educational content tests failed - review curriculum presentation`);
      }
      
    } catch (error) {
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Execute educational content tests
async function main() {
  const contentTests = new NewselaEducationalContentTests();
  
  try {
    await contentTests.runEducationalContentTests();
    console.log('✅ EDUCATIONAL CONTENT FUNCTIONAL TESTS COMPLETED');
    process.exit(0);
  } catch (error) {
    console.error('❌ EDUCATIONAL CONTENT FUNCTIONAL TESTS FAILED');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ EDUCATIONAL CONTENT TEST SUITE FAILURE:', error);
  process.exit(1);
});
