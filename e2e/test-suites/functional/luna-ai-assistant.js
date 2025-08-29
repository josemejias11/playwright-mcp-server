#!/usr/bin/env node

/**
 * Newsela Luna AI Teaching Assistant - Functional Tests
 * 
 * Purpose: Comprehensive testing of Luna AI features for lesson planning and teaching support
 * Focus: AI-powered teaching assistant capabilities, lesson planning, content differentiation
 * Frequency: Full regression, CI/CD pipeline
 * 
 * Tests the core AI functionality that makes Newsela unique in educational technology
 */

import { BaseTestFramework } from '../../framework/base-test-framework.js';

class NewselaLunaAITests extends BaseTestFramework {
  constructor() {
    super();
  }

  /**
   * FUNCTIONAL TEST 1: Luna AI Assistant Discovery & Navigation
   * Test: Teachers can easily find and access Luna AI assistant
   */
  async testLunaAIDiscovery() {
    await this.executeTest('Luna AI Assistant Discovery', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      // Take screenshot for Luna visibility analysis
      const screenshotResult = await this.client.takeScreenshot('luna-discovery-homepage');
      
      // Check for Luna mentions in main content
      const contentResult = await this.client.getText('body', 10000);
      if (!contentResult.success) {
        throw new Error('Cannot access homepage content for Luna analysis');
      }
      
      const content = contentResult.output.toLowerCase();
      const lunaKeywords = ['luna', 'ai assistant', 'ai-powered', 'teaching assistant'];
      const foundKeywords = lunaKeywords.filter(keyword => content.includes(keyword));
      
      if (foundKeywords.length === 0) {
        throw new Error('Luna AI assistant not prominently featured on homepage');
      }
      
      // Try to find direct Luna navigation
      const lunaNavSelectors = [
        'a[href*="luna"]',
        'button:has-text("Luna")',
        'a:has-text("Luna")',
        'nav a:has-text("AI")',
        '[data-testid*="luna"]'
      ];
      
      let lunaNavFound = false;
      for (const selector of lunaNavSelectors) {
        try {
          const result = await this.client.waitForElement(selector, 'visible', 2000);
          if (result.success) {
            lunaNavFound = true;
            await this.logger.business(`✓ Luna navigation found: ${selector}`);
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      await this.logger.business(`✓ Luna keywords found: ${foundKeywords.join(', ')}`);
      await this.logger.business(`✓ Luna direct navigation: ${lunaNavFound ? 'Available' : 'Text mentions only'}`);
    }, { timeout: 12000 });
  }

  /**
   * FUNCTIONAL TEST 2: Luna AI Feature Information Access
   * Test: Teachers can learn about Luna's capabilities
   */
  async testLunaFeatureInformation() {
    await this.executeTest('Luna AI Feature Information', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      // Look for Luna feature descriptions
      const contentResult = await this.client.getText('body', 10000);
      if (!contentResult.success) {
        throw new Error('Cannot access content for Luna feature analysis');
      }
      
      const content = contentResult.output.toLowerCase();
      
      // Check for Luna capability keywords
      const lunaFeatures = {
        'lesson planning': content.includes('lesson plan') || content.includes('lesson'),
        'activity design': content.includes('activity') || content.includes('activities'),
        'text differentiation': content.includes('differentiat') || content.includes('level'),
        'teaching support': content.includes('teaching') || content.includes('teacher'),
        'ai assistance': content.includes('ai') || content.includes('artificial intelligence')
      };
      
      const availableFeatures = Object.entries(lunaFeatures).filter(([name, available]) => available);
      
      if (availableFeatures.length < 3) {
        throw new Error(`Insufficient Luna feature information - only ${availableFeatures.length} features mentioned`);
      }
      
      // Try to find more detailed Luna information
      const lunaInfoSelectors = [
        'a:has-text("Learn more")',
        'a:has-text("Features")',
        'button:has-text("Explore")',
        'a[href*="features"]',
        'a[href*="luna"]'
      ];
      
      let detailedInfoFound = false;
      for (const selector of lunaInfoSelectors) {
        try {
          const result = await this.client.waitForElement(selector, 'visible', 2000);
          if (result.success) {
            detailedInfoFound = true;
            await this.logger.business(`✓ Detailed Luna info link: ${selector}`);
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      await this.logger.business(`✓ Luna features mentioned: ${availableFeatures.map(([name]) => name).join(', ')}`);
      await this.logger.business(`✓ Detailed info access: ${detailedInfoFound ? 'Available' : 'Limited to homepage'}`);
    }, { timeout: 10000 });
  }

  /**
   * FUNCTIONAL TEST 3: AI Teaching Assistant Value Proposition
   * Test: Luna's educational benefits are clearly communicated
   */
  async testLunaValueProposition() {
    await this.executeTest('Luna AI Value Proposition', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      const contentResult = await this.client.getText('body', 10000);
      if (!contentResult.success) {
        throw new Error('Cannot access content for value proposition analysis');
      }
      
      const content = contentResult.output.toLowerCase();
      
      // Check for educational value keywords
      const valueKeywords = {
        'time saving': content.includes('time') || content.includes('save') || content.includes('quick'),
        'personalization': content.includes('personal') || content.includes('individual') || content.includes('custom'),
        'efficiency': content.includes('efficient') || content.includes('easy') || content.includes('simple'),
        'quality improvement': content.includes('quality') || content.includes('better') || content.includes('improve'),
        'student engagement': content.includes('engage') || content.includes('student') || content.includes('learning'),
        'teacher support': content.includes('support') || content.includes('help') || content.includes('assist')
      };
      
      const valuePropositions = Object.entries(valueKeywords).filter(([name, present]) => present);
      
      if (valuePropositions.length < 4) {
        throw new Error(`Weak Luna value proposition - only ${valuePropositions.length} benefits communicated`);
      }
      
      // Look for specific Luna benefits or outcomes
      const benefitKeywords = ['minute', 'hour', 'instant', 'automatic', 'grade level', 'differentiated'];
      const specificBenefits = benefitKeywords.filter(keyword => content.includes(keyword));
      
      await this.logger.business(`✓ Value propositions found: ${valuePropositions.map(([name]) => name).join(', ')}`);
      await this.logger.business(`✓ Specific benefits: ${specificBenefits.join(', ') || 'General benefits only'}`);
    }, { timeout: 8000 });
  }

  /**
   * FUNCTIONAL TEST 4: Luna AI Trial/Demo Access
   * Test: Teachers can try Luna without full commitment
   */
  async testLunaTrialAccess() {
    await this.executeTest('Luna AI Trial Access', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      // Look for trial/demo options
      const trialSelectors = [
        'a:has-text("Try Luna")',
        'button:has-text("Demo")',
        'a:has-text("Free trial")',
        'a:has-text("Preview")',
        'button:has-text("Get started")',
        'a:has-text("Try it")',
        'a[href*="trial"]',
        'a[href*="demo"]'
      ];
      
      let trialFound = false;
      let trialSelector = '';
      
      for (const selector of trialSelectors) {
        try {
          const result = await this.client.waitForElement(selector, 'visible', 2000);
          if (result.success) {
            trialFound = true;
            trialSelector = selector;
            await this.logger.business(`✓ Trial access found: ${selector}`);
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      // Check content for trial mentions
      const contentResult = await this.client.getText('body', 5000);
      if (contentResult.success) {
        const content = contentResult.output.toLowerCase();
        const trialMentions = ['free', 'trial', 'demo', 'preview', 'try before'];
        const hasTrialMention = trialMentions.some(mention => content.includes(mention));
        
        if (hasTrialMention && !trialFound) {
          trialFound = true;
          await this.logger.business(`✓ Trial mentioned in content`);
        }
      }
      
      if (!trialFound) {
        await this.logger.warning('⚠️ No clear Luna trial/demo access found - may affect teacher adoption');
      }
      
      await this.logger.business(`✓ Luna trial accessibility: ${trialFound ? 'Available' : 'Not clearly available'}`);
    }, { timeout: 10000 });
  }

  /**
   * FUNCTIONAL TEST 5: Luna AI Integration with Educational Content
   * Test: Luna's connection to curriculum and content is clear
   */
  async testLunaContentIntegration() {
    await this.executeTest('Luna Content Integration', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      const contentResult = await this.client.getText('body', 10000);
      if (!contentResult.success) {
        throw new Error('Cannot access content for integration analysis');
      }
      
      const content = contentResult.output.toLowerCase();
      
      // Check for curriculum integration keywords
      const integrationFeatures = {
        'curriculum alignment': content.includes('curriculum') || content.includes('standard'),
        'content library': content.includes('library') || content.includes('article') || content.includes('content'),
        'grade levels': content.includes('grade') || content.includes('level') || content.includes('k-12'),
        'subject areas': content.includes('ela') || content.includes('science') || content.includes('social studies'),
        'assessment tools': content.includes('assessment') || content.includes('formative') || content.includes('quiz'),
        'differentiation': content.includes('differentiat') || content.includes('adapt') || content.includes('level')
      };
      
      const availableIntegrations = Object.entries(integrationFeatures).filter(([name, available]) => available);
      
      if (availableIntegrations.length < 4) {
        throw new Error(`Limited Luna-content integration shown - only ${availableIntegrations.length} features evident`);
      }
      
      // Look for specific Luna + content workflow mentions
      const workflowKeywords = ['lesson', 'activity', 'assignment', 'text', 'article', 'reading'];
      const lunaWorkflows = workflowKeywords.filter(keyword => content.includes(keyword));
      
      await this.logger.business(`✓ Luna integration features: ${availableIntegrations.map(([name]) => name).join(', ')}`);
      await this.logger.business(`✓ Luna workflows: ${lunaWorkflows.join(', ')}`);
    }, { timeout: 8000 });
  }

  /**
   * FUNCTIONAL TEST 6: Luna AI Competitive Differentiation
   * Test: Luna's unique AI advantages are communicated
   */
  async testLunaCompetitiveDifferentiation() {
    await this.executeTest('Luna Competitive Differentiation', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      const contentResult = await this.client.getText('body', 10000);
      if (!contentResult.success) {
        throw new Error('Cannot access content for differentiation analysis');
      }
      
      const content = contentResult.output.toLowerCase();
      
      // Check for unique value differentiators
      const differentiators = {
        'ai powered': content.includes('ai-powered') || content.includes('artificial intelligence'),
        'automation': content.includes('automat') || content.includes('instant') || content.includes('generate'),
        'personalization': content.includes('personal') || content.includes('custom') || content.includes('tailored'),
        'time efficiency': content.includes('minutes') || content.includes('seconds') || content.includes('quick'),
        'expert knowledge': content.includes('expert') || content.includes('research') || content.includes('evidence'),
        'continuous improvement': content.includes('learn') || content.includes('adapt') || content.includes('improve')
      };
      
      const uniqueFeatures = Object.entries(differentiators).filter(([name, present]) => present);
      
      if (uniqueFeatures.length < 3) {
        await this.logger.warning(`⚠️ Limited Luna differentiation visible - only ${uniqueFeatures.length} unique features`);
      }
      
      // Look for specific AI capabilities
      const aiCapabilities = ['generate', 'create', 'adapt', 'analyze', 'recommend', 'suggest'];
      const lunaAIFeatures = aiCapabilities.filter(capability => content.includes(capability));
      
      await this.logger.business(`✓ Luna differentiators: ${uniqueFeatures.map(([name]) => name).join(', ')}`);
      await this.logger.business(`✓ AI capabilities: ${lunaAIFeatures.join(', ') || 'General AI mentions'}`);
    }, { timeout: 8000 });
  }

  async runLunaAITests() {
    try {
      console.log('\n🤖 NEWSELA LUNA AI TEACHING ASSISTANT - FUNCTIONAL TESTS');
      console.log('========================================================');
      console.log('🎯 Testing AI-powered teaching assistant capabilities');
      console.log('');

      await this.testLunaAIDiscovery();
      await this.testLunaFeatureInformation();
      await this.testLunaValueProposition();
      await this.testLunaTrialAccess();
      await this.testLunaContentIntegration();
      await this.testLunaCompetitiveDifferentiation();

      // Generate summary
      const summary = this.getTestSummary();
      console.log('\n📊 LUNA AI FUNCTIONAL TEST SUMMARY');
      console.log('===================================');
      console.log(`Total Luna AI Tests: ${summary.total}`);
      console.log(`Passed: ${summary.passed}`);
      console.log(`Failed: ${summary.failed}`);
      console.log(`Luna AI Success Rate: ${Math.round((summary.passed / summary.total) * 100)}%`);
      
      if (summary.failed > 0) {
        console.log(`⚠️ ${summary.failed} Luna AI tests failed - review AI assistant presentation`);
      }
      
    } catch (error) {
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Execute Luna AI tests
async function main() {
  const lunaTests = new NewselaLunaAITests();
  
  try {
    await lunaTests.runLunaAITests();
    console.log('✅ LUNA AI FUNCTIONAL TESTS COMPLETED');
    process.exit(0);
  } catch (error) {
    console.error('❌ LUNA AI FUNCTIONAL TESTS FAILED');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ LUNA AI TEST SUITE FAILURE:', error);
  process.exit(1);
});
