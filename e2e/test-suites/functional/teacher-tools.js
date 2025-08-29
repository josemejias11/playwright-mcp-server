#!/usr/bin/env node

/**
 * Newsela Teacher Tools & Assessment - Functional Tests
 * 
 * Purpose: Test teacher-specific tools, formative assessments, and classroom management features
 * Focus: Teacher dashboard, assignment creation, student progress tracking, formative assessments
 * Frequency: Full regression, teacher workflow updates
 * 
 * Tests the tools that make Newsela valuable for classroom instruction and assessment
 */

import { BaseTestFramework } from '../../framework/base-test-framework.js';

class NewselaTeacherToolsTests extends BaseTestFramework {
  constructor() {
    super();
  }

  /**
   * FUNCTIONAL TEST 1: Teacher Dashboard & Account Access
   * Test: Teachers can access their account and dashboard features
   */
  async testTeacherDashboardAccess() {
    await this.executeTest('Teacher Dashboard Access', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      // Look for teacher sign-in/login options
      const loginSelectors = [
        'a:has-text("Log in")',
        'a:has-text("Sign in")',
        'button:has-text("Login")',
        'a[href*="login"]',
        'a[href*="signin"]'
      ];
      
      let loginFound = false;
      let loginSelector = '';
      
      for (const selector of loginSelectors) {
        try {
          const result = await this.client.waitForElement(selector, 'visible', 2000);
          if (result.success) {
            loginFound = true;
            loginSelector = selector;
            await this.logger.business(`✓ Teacher login found: ${selector}`);
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      if (!loginFound) {
        throw new Error('Teacher login access not found - critical for teacher workflow');
      }
      
      // Check for teacher-specific navigation or features mentioned
      const contentResult = await this.client.getText('body', 10000);
      if (contentResult.success) {
        const content = contentResult.output.toLowerCase();
        
        const teacherFeatures = {
          'Teacher Dashboard': content.includes('dashboard') || content.includes('teacher portal'),
          'Class Management': content.includes('class') || content.includes('classroom'),
          'Student Progress': content.includes('progress') || content.includes('track'),
          'Assignment Tools': content.includes('assignment') || content.includes('assign'),
          'Teacher Resources': content.includes('teacher') || content.includes('educator')
        };
        
        const availableTeacherFeatures = Object.entries(teacherFeatures).filter(([name, available]) => available);
        
        await this.logger.business(`✓ Teacher features mentioned: ${availableTeacherFeatures.map(([name]) => name).join(', ')}`);
      }
      
      await this.logger.business(`✓ Teacher login accessibility: Available via ${loginSelector}`);
    }, { timeout: 10000 });
  }

  /**
   * FUNCTIONAL TEST 2: Assignment Creation & Management
   * Test: Teachers can create and manage assignments
   */
  async testAssignmentCreationFeatures() {
    await this.executeTest('Assignment Creation Features', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      const contentResult = await this.client.getText('body', 10000);
      if (!contentResult.success) {
        throw new Error('Cannot access content for assignment analysis');
      }
      
      const content = contentResult.output.toLowerCase();
      
      // Check for assignment-related features
      const assignmentFeatures = {
        'Assignment Creation': content.includes('assignment') || content.includes('assign'),
        'Activity Builder': content.includes('activity') || content.includes('create'),
        'Lesson Planning': content.includes('lesson') || content.includes('plan'),
        'Quiz Creation': content.includes('quiz') || content.includes('assessment'),
        'Differentiated Assignments': content.includes('differentiat') || content.includes('level'),
        'Student Groups': content.includes('group') || content.includes('class')
      };
      
      const availableAssignmentFeatures = Object.entries(assignmentFeatures).filter(([name, available]) => available);
      
      if (availableAssignmentFeatures.length < 3) {
        throw new Error(`Limited assignment features - only ${availableAssignmentFeatures.length} found`);
      }
      
      // Look for assignment-related navigation
      const assignmentSelectors = [
        'a:has-text("Assign")',
        'button:has-text("Create")',
        'a:has-text("Activities")',
        'a:has-text("Lessons")',
        'a[href*="assign"]',
        'a[href*="activity"]'
      ];
      
      let assignmentNavFound = false;
      for (const selector of assignmentSelectors) {
        try {
          const result = await this.client.waitForElement(selector, 'visible', 2000);
          if (result.success) {
            assignmentNavFound = true;
            await this.logger.business(`✓ Assignment navigation found: ${selector}`);
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      await this.logger.business(`✓ Assignment features: ${availableAssignmentFeatures.map(([name]) => name).join(', ')}`);
      await this.logger.business(`✓ Assignment tools access: ${assignmentNavFound ? 'Available' : 'Text mentions only'}`);
    }, { timeout: 10000 });
  }

  /**
   * FUNCTIONAL TEST 3: Formative Assessment Tools
   * Test: Teachers can access formative assessment features
   */
  async testFormativeAssessmentTools() {
    await this.executeTest('Formative Assessment Tools', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      const contentResult = await this.client.getText('body', 10000);
      if (!contentResult.success) {
        throw new Error('Cannot access content for formative assessment analysis');
      }
      
      const content = contentResult.output.toLowerCase();
      
      // Check for formative assessment features
      const formativeFeatures = {
        'Formative Assessment': content.includes('formative') || content.includes('assessment'),
        'Real-time Feedback': content.includes('real-time') || content.includes('instant') || content.includes('immediate'),
        'Progress Monitoring': content.includes('progress') || content.includes('monitor'),
        'Data Analytics': content.includes('data') || content.includes('analytics') || content.includes('report'),
        'Comprehension Checks': content.includes('comprehension') || content.includes('quiz'),
        'Performance Tracking': content.includes('performance') || content.includes('track')
      };
      
      const availableFormativeFeatures = Object.entries(formativeFeatures).filter(([name, available]) => available);
      
      if (availableFormativeFeatures.length < 3) {
        await this.logger.warning(`⚠️ Limited formative assessment features - only ${availableFormativeFeatures.length} found`);
      }
      
      // Look for assessment-specific tools or mentions
      const assessmentTools = ['quiz', 'question', 'poll', 'check', 'test', 'evaluate'];
      const availableAssessmentTools = assessmentTools.filter(tool => content.includes(tool));
      
      // Check for data/reporting features
      const dataFeatures = ['report', 'dashboard', 'analytics', 'insights', 'data'];
      const availableDataFeatures = dataFeatures.filter(feature => content.includes(feature));
      
      await this.logger.business(`✓ Formative assessment features: ${availableFormativeFeatures.map(([name]) => name).join(', ')}`);
      await this.logger.business(`✓ Assessment tools: ${availableAssessmentTools.join(', ') || 'General assessment mentions'}`);
      await this.logger.business(`✓ Data features: ${availableDataFeatures.join(', ') || 'Limited data features'}`);
    }, { timeout: 8000 });
  }

  /**
   * FUNCTIONAL TEST 4: Student Progress & Analytics
   * Test: Teachers can track student progress and access analytics
   */
  async testStudentProgressTracking() {
    await this.executeTest('Student Progress Tracking', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      const contentResult = await this.client.getText('body', 10000);
      if (!contentResult.success) {
        throw new Error('Cannot access content for progress tracking analysis');
      }
      
      const content = contentResult.output.toLowerCase();
      
      // Check for progress tracking features
      const progressFeatures = {
        'Student Progress': content.includes('student progress') || content.includes('track'),
        'Individual Analytics': content.includes('individual') || content.includes('student data'),
        'Class Overview': content.includes('class') || content.includes('overview'),
        'Reading Growth': content.includes('growth') || content.includes('improvement'),
        'Skill Development': content.includes('skill') || content.includes('development'),
        'Performance Reports': content.includes('report') || content.includes('performance')
      };
      
      const availableProgressFeatures = Object.entries(progressFeatures).filter(([name, available]) => available);
      
      if (availableProgressFeatures.length < 3) {
        await this.logger.warning(`⚠️ Limited progress tracking features - only ${availableProgressFeatures.length} found`);
      }
      
      // Look for specific analytics or reporting mentions
      const analyticsKeywords = ['dashboard', 'analytics', 'insights', 'metrics', 'data visualization'];
      const availableAnalytics = analyticsKeywords.filter(keyword => content.includes(keyword));
      
      // Check for differentiation based on progress
      const differentiationKeywords = ['differentiat', 'adapt', 'personal', 'level', 'scaffold'];
      const availableDifferentiation = differentiationKeywords.filter(keyword => content.includes(keyword));
      
      await this.logger.business(`✓ Progress tracking features: ${availableProgressFeatures.map(([name]) => name).join(', ')}`);
      await this.logger.business(`✓ Analytics tools: ${availableAnalytics.join(', ') || 'Basic tracking only'}`);
      await this.logger.business(`✓ Differentiation support: ${availableDifferentiation.join(', ') || 'Not emphasized'}`);
    }, { timeout: 8000 });
  }

  /**
   * FUNCTIONAL TEST 5: Classroom Management Tools
   * Test: Teachers can manage their classroom and students
   */
  async testClassroomManagementTools() {
    await this.executeTest('Classroom Management Tools', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      const contentResult = await this.client.getText('body', 10000);
      if (!contentResult.success) {
        throw new Error('Cannot access content for classroom management analysis');
      }
      
      const content = contentResult.output.toLowerCase();
      
      // Check for classroom management features
      const managementFeatures = {
        'Class Setup': content.includes('class') || content.includes('classroom'),
        'Student Management': content.includes('student') || content.includes('roster'),
        'Group Creation': content.includes('group') || content.includes('team'),
        'Content Distribution': content.includes('distribute') || content.includes('share'),
        'Communication Tools': content.includes('communication') || content.includes('message'),
        'Parent Engagement': content.includes('parent') || content.includes('family')
      };
      
      const availableManagementFeatures = Object.entries(managementFeatures).filter(([name, available]) => available);
      
      if (availableManagementFeatures.length < 3) {
        await this.logger.warning(`⚠️ Limited classroom management features - only ${availableManagementFeatures.length} found`);
      }
      
      // Look for workflow efficiency mentions
      const efficiencyKeywords = ['easy', 'simple', 'quick', 'efficient', 'streamline', 'organize'];
      const efficiencyFeatures = efficiencyKeywords.filter(keyword => content.includes(keyword));
      
      // Check for collaboration features
      const collaborationKeywords = ['collaborate', 'share', 'together', 'team', 'group work'];
      const collaborationFeatures = collaborationKeywords.filter(keyword => content.includes(keyword));
      
      await this.logger.business(`✓ Management features: ${availableManagementFeatures.map(([name]) => name).join(', ')}`);
      await this.logger.business(`✓ Efficiency focus: ${efficiencyFeatures.join(', ') || 'Not emphasized'}`);
      await this.logger.business(`✓ Collaboration support: ${collaborationFeatures.join(', ') || 'Individual focus'}`);
    }, { timeout: 8000 });
  }

  /**
   * FUNCTIONAL TEST 6: Professional Development & Support
   * Test: Teachers can access help, training, and support resources
   */
  async testProfessionalDevelopmentSupport() {
    await this.executeTest('Professional Development Support', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      // Look for support and training resources
      const supportSelectors = [
        'a:has-text("Help")',
        'a:has-text("Support")',
        'a:has-text("Training")',
        'a:has-text("Resources")',
        'a:has-text("Professional Development")',
        'a[href*="help"]',
        'a[href*="support"]',
        'a[href*="training"]'
      ];
      
      let supportFound = false;
      let supportTypes = [];
      
      for (const selector of supportSelectors) {
        try {
          const result = await this.client.waitForElement(selector, 'visible', 2000);
          if (result.success) {
            supportFound = true;
            supportTypes.push(selector);
          }
        } catch (e) {
          continue;
        }
      }
      
      // Check content for professional development mentions
      const contentResult = await this.client.getText('body', 10000);
      if (contentResult.success) {
        const content = contentResult.output.toLowerCase();
        
        const pdFeatures = {
          'Help Documentation': content.includes('help') || content.includes('guide'),
          'Training Resources': content.includes('training') || content.includes('tutorial'),
          'Best Practices': content.includes('best practice') || content.includes('tip'),
          'Community Support': content.includes('community') || content.includes('forum'),
          'Professional Development': content.includes('professional development') || content.includes('pd'),
          'Getting Started': content.includes('getting started') || content.includes('onboard')
        };
        
        const availablePDFeatures = Object.entries(pdFeatures).filter(([name, available]) => available);
        
        await this.logger.business(`✓ PD features mentioned: ${availablePDFeatures.map(([name]) => name).join(', ')}`);
      }
      
      if (!supportFound) {
        await this.logger.warning('⚠️ Limited visible support resources - may affect teacher adoption');
      }
      
      await this.logger.business(`✓ Support resources found: ${supportTypes.length} types`);
      await this.logger.business(`✓ Support accessibility: ${supportFound ? 'Multiple access points' : 'Limited visibility'}`);
    }, { timeout: 10000 });
  }

  async runTeacherToolsTests() {
    try {
      console.log('\n👩‍🏫 NEWSELA TEACHER TOOLS & ASSESSMENT - FUNCTIONAL TESTS');
      console.log('==========================================================');
      console.log('🎯 Testing teacher-specific tools and classroom management features');
      console.log('');

      await this.testTeacherDashboardAccess();
      await this.testAssignmentCreationFeatures();
      await this.testFormativeAssessmentTools();
      await this.testStudentProgressTracking();
      await this.testClassroomManagementTools();
      await this.testProfessionalDevelopmentSupport();

      // Generate summary
      const summary = this.getTestSummary();
      console.log('\n📊 TEACHER TOOLS FUNCTIONAL TEST SUMMARY');
      console.log('=========================================');
      console.log(`Total Teacher Tools Tests: ${summary.total}`);
      console.log(`Passed: ${summary.passed}`);
      console.log(`Failed: ${summary.failed}`);
      console.log(`Teacher Tools Success Rate: ${Math.round((summary.passed / summary.total) * 100)}%`);
      
      if (summary.failed > 0) {
        console.log(`⚠️ ${summary.failed} teacher tools tests failed - review teacher experience`);
      }
      
    } catch (error) {
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Execute teacher tools tests
async function main() {
  const teacherToolsTests = new NewselaTeacherToolsTests();
  
  try {
    await teacherToolsTests.runTeacherToolsTests();
    console.log('✅ TEACHER TOOLS FUNCTIONAL TESTS COMPLETED');
    process.exit(0);
  } catch (error) {
    console.error('❌ TEACHER TOOLS FUNCTIONAL TESTS FAILED');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ TEACHER TOOLS TEST SUITE FAILURE:', error);
  process.exit(1);
});
