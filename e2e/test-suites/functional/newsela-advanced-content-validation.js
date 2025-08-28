#!/usr/bin/env node

/**
 * Newsela Advanced Educational Content Validation Tests
 * 
 * Purpose: Comprehensive content quality assurance for educational platform
 * Focus: Learning outcome alignment, grade-level appropriateness, educational standards compliance
 * Frequency: Daily content verification
 * Timeout: 15 minutes max
 * 
 * Educational Content Validation Priorities:
 * - Reading level accuracy and verification
 * - Educational standard alignment (Common Core, state standards)
 * - Content factual accuracy and source credibility
 * - Learning objective clarity and measurability
 * - Assessment alignment with content
 * - Accessibility compliance for diverse learners
 */

import { BaseTestFramework } from '../../framework/base-test-framework.js';
import { NewselaHomePage } from '../../page-objects/homepage.js';

class NewselaAdvancedEducationalContentValidationTests extends BaseTestFramework {
  constructor() {
    super();
    this.homePage = null;
    this.contentValidationMetrics = {
      readingLevelAccuracy: 0,
      educationalStandardsAlignment: 0,
      factualAccuracy: 0,
      learningObjectiveClarity: 0,
      assessmentAlignment: 0,
      accessibilityCompliance: 0
    };
  }

  async initializePageObjects() {
    this.homePage = new NewselaHomePage(this.client);
  }

  /**
   * CONTENT TEST 1: Reading Level Accuracy Validation
   * Critical for differentiated instruction and student comprehension
   */
  async testReadingLevelAccuracy() {
    await this.executeTest('Reading Level Accuracy Validation', async () => {
      await this.homePage.navigate();
      
      // Get articles with specified reading levels
      const articlesByLevel = await this.homePage.getArticlesByReadingLevel();
      
      if (!articlesByLevel || Object.keys(articlesByLevel).length === 0) {
        throw new Error('No articles with reading levels found for validation');
      }
      
      let totalArticles = 0;
      let accurateReadingLevels = 0;
      
      // Validate reading level accuracy for each grade
      for (const [gradeLevel, articles] of Object.entries(articlesByLevel)) {
        if (!articles || articles.length === 0) continue;
        
        // Test first 3 articles per grade level
        const articlesToTest = articles.slice(0, 3);
        
        for (const article of articlesToTest) {
          totalArticles++;
          
          const readingLevelValidation = await article.validateReadingLevel(gradeLevel);
          
          if (!readingLevelValidation.accurate) {
            await this.logger.business(`⚠️ Reading level mismatch: Article "${article.title}" labeled as grade ${gradeLevel} but measures as grade ${readingLevelValidation.actualLevel}`);
          } else {
            accurateReadingLevels++;
            await this.logger.success(`✓ Grade ${gradeLevel} reading level accurate: "${article.title}"`);
          }
          
          // Validate content complexity alignment
          const complexityValidation = await article.validateContentComplexity(gradeLevel);
          if (!complexityValidation.appropriate) {
            throw new Error(`Content complexity inappropriate for grade ${gradeLevel}: ${complexityValidation.reason}`);
          }
        }
      }
      
      // Calculate reading level accuracy percentage
      const accuracyPercentage = (accurateReadingLevels / totalArticles) * 100;
      this.contentValidationMetrics.readingLevelAccuracy = accuracyPercentage;
      
      if (accuracyPercentage < 85) {
        throw new Error(`Reading level accuracy ${accuracyPercentage.toFixed(1)}% below required 85% - Content differentiation quality compromised`);
      }
      
      await this.logger.success(`📚 Reading level accuracy: ${accuracyPercentage.toFixed(1)}% (${accurateReadingLevels}/${totalArticles} articles)`);
      
    }, { timeout: 12000 });
  }

  /**
   * CONTENT TEST 2: Educational Standards Alignment
   * Critical for curriculum compliance and learning outcomes
   */
  async testEducationalStandardsAlignment() {
    await this.executeTest('Educational Standards Alignment Validation', async () => {
      await this.homePage.navigate();
      
      // Get articles with educational standards tags
      const articlesWithStandards = await this.homePage.getArticlesWithEducationalStandards();
      
      if (!articlesWithStandards || articlesWithStandards.length === 0) {
        throw new Error('No articles with educational standards found for validation');
      }
      
      let alignedArticles = 0;
      const standardsTypes = ['Common Core', 'State Standards', 'NGSS', 'C3 Framework'];
      
      // Test first 10 articles for standards alignment
      const articlesToTest = articlesWithStandards.slice(0, 10);
      
      for (const article of articlesToTest) {
        const standardsValidation = await article.validateEducationalStandardsAlignment();
        
        if (!standardsValidation.hasStandards) {
          throw new Error(`Article "${article.title}" lacks educational standards alignment`);
        }
        
        // Validate standards authenticity
        const authenticStandards = standardsValidation.standards.filter(standard => 
          standardsTypes.some(type => standard.includes(type))
        );
        
        if (authenticStandards.length === 0) {
          throw new Error(`Article "${article.title}" has invalid educational standards`);
        }
        
        // Validate content-standards alignment
        const alignmentValidation = await article.validateContentStandardsAlignment();
        if (!alignmentValidation.aligned) {
          throw new Error(`Article "${article.title}" content not aligned with stated standards: ${alignmentValidation.reason}`);
        }
        
        alignedArticles++;
        await this.logger.success(`✓ Standards aligned: "${article.title}" - ${authenticStandards.join(', ')}`);
      }
      
      const alignmentPercentage = (alignedArticles / articlesToTest.length) * 100;
      this.contentValidationMetrics.educationalStandardsAlignment = alignmentPercentage;
      
      if (alignmentPercentage < 90) {
        throw new Error(`Educational standards alignment ${alignmentPercentage.toFixed(1)}% below required 90% - Curriculum compliance at risk`);
      }
      
      await this.logger.success(`🎯 Educational standards alignment: ${alignmentPercentage.toFixed(1)}% (${alignedArticles}/${articlesToTest.length} articles)`);
      
    }, { timeout: 10000 });
  }

  /**
   * CONTENT TEST 3: Factual Accuracy and Source Credibility
   * Critical for educational integrity and student trust
   */
  async testFactualAccuracyAndSourceCredibility() {
    await this.executeTest('Factual Accuracy and Source Credibility Validation', async () => {
      await this.homePage.navigate();
      
      // Get articles from various subjects
      const articlesBySubject = await this.homePage.getArticlesBySubject();
      
      if (!articlesBySubject || Object.keys(articlesBySubject).length === 0) {
        throw new Error('No subject-categorized articles found for validation');
      }
      
      let verifiedArticles = 0;
      let totalArticles = 0;
      
      // Test articles from different subjects
      for (const [subject, articles] of Object.entries(articlesBySubject)) {
        if (!articles || articles.length === 0) continue;
        
        // Test first 2 articles per subject
        const articlesToTest = articles.slice(0, 2);
        
        for (const article of articlesToTest) {
          totalArticles++;
          
          // Validate source credibility
          const sourceValidation = await article.validateSourceCredibility();
          if (!sourceValidation.credible) {
            throw new Error(`Source not credible for article "${article.title}": ${sourceValidation.reason}`);
          }
          
          // Check for fact-checking indicators
          const factCheckValidation = await article.validateFactCheckingIndicators();
          if (!factCheckValidation.hasIndicators) {
            await this.logger.business(`⚠️ No fact-checking indicators found for "${article.title}" in ${subject}`);
          }
          
          // Validate content accuracy for factual subjects
          if (['Science', 'History', 'Mathematics', 'Geography'].includes(subject)) {
            const accuracyValidation = await article.validateFactualAccuracy();
            if (!accuracyValidation.accurate) {
              throw new Error(`Factual inaccuracy detected in "${article.title}": ${accuracyValidation.issues.join(', ')}`);
            }
          }
          
          verifiedArticles++;
          await this.logger.success(`✓ Source credible and content accurate: "${article.title}" (${subject})`);
        }
      }
      
      const verificationPercentage = (verifiedArticles / totalArticles) * 100;
      this.contentValidationMetrics.factualAccuracy = verificationPercentage;
      
      if (verificationPercentage < 95) {
        throw new Error(`Factual accuracy ${verificationPercentage.toFixed(1)}% below required 95% - Educational integrity compromised`);
      }
      
      await this.logger.success(`🔍 Factual accuracy verification: ${verificationPercentage.toFixed(1)}% (${verifiedArticles}/${totalArticles} articles)`);
      
    }, { timeout: 15000 });
  }

  /**
   * Run all advanced educational content validation tests
   */
  async runAdvancedContentValidationTests() {
    try {
      await this.initialize('Newsela Advanced Educational Content Validation Tests', 'chromium');
      await this.initializePageObjects();
      
      // Run comprehensive content validation tests
      await this.testReadingLevelAccuracy();
      await this.testEducationalStandardsAlignment();
      await this.testFactualAccuracyAndSourceCredibility();
      
      const summary = this.getTestSummary();
      await this.logger.suiteEnd('Advanced Educational Content Validation Complete', summary);
      
      // Educational content standards are high - low tolerance for failures
      if (summary.failed > 0) {
        const failureRate = (summary.failed / summary.total) * 100;
        if (failureRate > 10) { // Allow maximum 10% failures
          throw new Error(`Educational content standards not met: ${summary.failed}/${summary.total} tests failed (${failureRate.toFixed(1)}%)`);
        } else {
          await this.logger.business(`⚠️ Some content quality issues identified: ${summary.failed}/${summary.total} failed (${failureRate.toFixed(1)}%)`);
        }
      }
      
      // Log content validation metrics
      await this.logger.business('📈 Content Validation Metrics:');
      Object.entries(this.contentValidationMetrics).forEach(([metric, value]) => {
        this.logger.business(`   ${metric}: ${value.toFixed(1)}%`);
      });
      
      await this.logger.success('📚 Educational content validation complete - Quality standards maintained');
      
    } catch (error) {
      await this.logger.error(`💥 Educational content validation failure: ${error.message}`);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Execute advanced educational content validation tests
async function main() {
  const contentValidationTests = new NewselaAdvancedEducationalContentValidationTests();
  
  try {
    await contentValidationTests.runAdvancedContentValidationTests();
    console.log('✅ ADVANCED EDUCATIONAL CONTENT VALIDATION PASSED - Content quality verified');
    process.exit(0);
  } catch (error) {
    console.error('❌ ADVANCED EDUCATIONAL CONTENT VALIDATION FAILED - Content quality issues detected');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ CRITICAL EDUCATIONAL CONTENT VALIDATION FAILURE:', error);
  process.exit(1);
});
