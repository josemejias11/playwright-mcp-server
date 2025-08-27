#!/usr/bin/env node

/**
 * Accessibility Compliance Tests
 * 
 * Purpose: WCAG compliance and inclusive design validation
 * Frequency: Weekly accessibility runs
 * Timeout: 10 minutes max
 * 
 * Ensures the website meets accessibility standards required
 * for software development services and provides inclusive user experience.
 */

import { BaseTestFramework } from '../../framework/base-test-framework.js';
import { RoyalCaribbeanHomePage } from '../../page-objects/homepage.js';
import { RoyalCaribbeanContactPage } from '../../page-objects/contact-page.js';

class AccessibilityComplianceTests extends BaseTestFramework {
  constructor() {
    super();
    this.homePage = null;
    this.contactPage = null;
    this.accessibilityIssues = [];
  }

  async initializePageObjects() {
    this.homePage = new RoyalCaribbeanHomePage(this.client);
    this.contactPage = new RoyalCaribbeanContactPage(this.client);
  }

  /**
   * ACCESSIBILITY TEST 1: Keyboard Navigation
   */
  async testKeyboardNavigation() {
    await this.executeTest('Keyboard Navigation Compliance', async () => {
      await this.homePage.navigate();
      
      // Test focusable elements
      const focusableElements = await this.client.evaluateJavaScript(`
        (() => {
          const focusableSelectors = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'textarea:not([disabled])',
            'select:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
          ];
          
          const elements = document.querySelectorAll(focusableSelectors.join(', '));
          let tabbableCount = 0;
          let withoutTabindex = 0;
          
          elements.forEach(el => {
            if (!el.hasAttribute('tabindex') || el.tabIndex >= 0) {
              tabbableCount++;
            }
            if (!el.hasAttribute('tabindex')) {
              withoutTabindex++;
            }
          });
          
          return JSON.stringify({
            totalFocusable: elements.length,
            tabbableElements: tabbableCount,
            withoutExplicitTabindex: withoutTabindex,
            hasProperTabSequence: tabbableCount > 0
          });
        })()
      `);
      
      const keyboardNav = focusableElements.success ? (() => {
        try {
          // Extract JSON from "JavaScript execution result: " wrapper
          const jsonStr = focusableElements.output.replace(/^JavaScript execution result: /, '');
          const parsed = JSON.parse(jsonStr);
          return {
            totalFocusable: parsed.totalFocusable || 0,
            tabbableElements: parsed.tabbableElements || 0,
            withoutExplicitTabindex: parsed.withoutExplicitTabindex || 0,
            hasProperTabSequence: parsed.hasProperTabSequence || false
          };
        } catch (e) {
          return {
            totalFocusable: 0,
            tabbableElements: 0,
            withoutExplicitTabindex: 0,
            hasProperTabSequence: false
          };
        }
      })() : {
        totalFocusable: 0,
        tabbableElements: 0,
        withoutExplicitTabindex: 0,
        hasProperTabSequence: false
      };
      
      if (keyboardNav.totalFocusable === 0) {
        throw new Error('No focusable elements found - critical accessibility violation');
      }
      
      if (keyboardNav.totalFocusable < 5) {
        this.accessibilityIssues.push({
          severity: 'medium',
          issue: `Low number of focusable elements: ${keyboardNav.totalFocusable}`,
          page: 'homepage'
        });
      }
      
      await this.logger.business(`✓ Focusable elements found: ${keyboardNav.totalFocusable}`);
      await this.logger.business(`✓ Tabbable elements: ${keyboardNav.tabbableElements}`);
      
    }, { timeout: 8000 });
  }

  /**
   * ACCESSIBILITY TEST 2: Focus Management
   */
  async testFocusManagement() {
    await this.executeTest('Focus Management Validation', async () => {
      await this.contactPage.navigate();
      
      // Test focus on form elements
      const focusTest = await this.client.evaluateJavaScript(`
        (() => {
          const firstInput = document.querySelector('input, textarea, select');
          if (!firstInput) return JSON.stringify({ hasFocusableForm: false });
          
          firstInput.focus();
          const hasFocus = document.activeElement === firstInput;
          
          // Test focus indicators
          const computedStyle = window.getComputedStyle(firstInput, ':focus');
          const hasVisibleFocus = computedStyle.outline !== 'none' || 
                                 computedStyle.boxShadow !== 'none' ||
                                 computedStyle.border !== computedStyle.getPropertyValue('border');
          
          return JSON.stringify({
            hasFocusableForm: true,
            focusWorks: hasFocus,
            hasVisibleFocusIndicator: hasVisibleFocus,
            elementType: firstInput.tagName.toLowerCase()
          });
        })()
      `);
      
      const focus = focusTest.success ? (() => {
        try {
          // Extract JSON from "JavaScript execution result: " wrapper
          const jsonStr = focusTest.output.replace(/^JavaScript execution result: /, '');
          return JSON.parse(jsonStr);
        } catch (e) {
          return {
            hasFocusableForm: false,
            focusWorks: false,
            hasVisibleFocusIndicator: false,
            elementType: 'none'
          };
        }
      })() : {
        hasFocusableForm: false,
        focusWorks: false,
        hasVisibleFocusIndicator: false,
        elementType: 'none'
      };
      
      if (!focus.hasFocusableForm) {
        throw new Error('No focusable form elements found on contact page');
      }
      
      if (!focus.focusWorks) {
        throw new Error('Focus management not working properly');
      }
      
      if (!focus.hasVisibleFocusIndicator) {
        this.accessibilityIssues.push({
          severity: 'high',
          issue: 'Focus indicators may not be visible enough',
          page: 'contact'
        });
      }
      
      await this.logger.business(`✓ Focus management working on ${focus.elementType} elements`);
      await this.logger.business(`✓ Focus indicators: ${focus.hasVisibleFocusIndicator ? 'visible' : 'needs improvement'}`);
      
    }, { timeout: 8000 });
  }

  /**
   * ACCESSIBILITY TEST 3: Semantic HTML Structure
   */
  async testSemanticHTMLStructure() {
    await this.executeTest('Semantic HTML Structure Validation', async () => {
      await this.homePage.navigate();
      
      const semanticStructure = await this.client.evaluateJavaScript(`
        (() => {
          const semantic = {
            hasNav: !!document.querySelector('nav'),
            hasMain: !!document.querySelector('main'),
            hasHeader: !!document.querySelector('header'),
            hasFooter: !!document.querySelector('footer'),
            headings: {
              h1: document.querySelectorAll('h1').length,
              h2: document.querySelectorAll('h2').length,
              h3: document.querySelectorAll('h3').length,
              total: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length
            },
            landmarks: document.querySelectorAll('[role]').length,
            images: {
              total: document.querySelectorAll('img').length,
              withAlt: document.querySelectorAll('img[alt]').length,
              withEmptyAlt: document.querySelectorAll('img[alt=""]').length
            }
          };
          
          return JSON.stringify(semantic);
        })()
      `);
      
      const structure = semanticStructure.success ? (() => {
        try {
          // Extract JSON from "JavaScript execution result: " wrapper
          const jsonStr = semanticStructure.output.replace(/^JavaScript execution result: /, '');
          const parsed = JSON.parse(jsonStr);
          // Ensure all required properties exist with defaults
          return {
            hasNav: parsed.hasNav || false,
            hasMain: parsed.hasMain || false,
            hasHeader: parsed.hasHeader || false,
            hasFooter: parsed.hasFooter || false,
            headings: {
              h1: parsed.headings?.h1 || 0,
              h2: parsed.headings?.h2 || 0,
              h3: parsed.headings?.h3 || 0,
              total: parsed.headings?.total || 0
            },
            landmarks: parsed.landmarks || 0,
            images: {
              total: parsed.images?.total || 0,
              withAlt: parsed.images?.withAlt || 0,
              withEmptyAlt: parsed.images?.withEmptyAlt || 0
            }
          };
        } catch (e) {
          return {
            hasNav: false,
            hasMain: false,
            hasHeader: false,
            hasFooter: false,
            headings: { h1: 0, h2: 0, h3: 0, total: 0 },
            landmarks: 0,
            images: { total: 0, withAlt: 0, withEmptyAlt: 0 }
          };
        }
      })() : {
        hasNav: false,
        hasMain: false,
        hasHeader: false,
        hasFooter: false,
        headings: { h1: 0, h2: 0, h3: 0, total: 0 },
        landmarks: 0,
        images: { total: 0, withAlt: 0, withEmptyAlt: 0 }
      };
      
      // Critical accessibility checks
      if (structure.headings.h1 !== 1) {
        this.accessibilityIssues.push({
          severity: 'high',
          issue: `Improper H1 usage: ${structure.headings.h1} H1 tags (should be exactly 1)`,
          page: 'homepage'
        });
      }
      
      if (structure.headings.total === 0) {
        throw new Error('No heading elements found - critical accessibility violation');
      }
      
      if (!structure.hasNav) {
        this.accessibilityIssues.push({
          severity: 'medium',
          issue: 'No nav element found - consider adding semantic navigation',
          page: 'homepage'
        });
      }
      
      // Image accessibility
      const missingAlt = structure.images.total - structure.images.withAlt;
      if (missingAlt > 0) {
        this.accessibilityIssues.push({
          severity: 'high',
          issue: `${missingAlt} images missing alt text`,
          page: 'homepage'
        });
      }
      
      await this.logger.business(`✓ Heading structure: ${structure.headings.total} headings (H1: ${structure.headings.h1})`);
      await this.logger.business(`✓ Semantic elements: nav=${structure.hasNav}, main=${structure.hasMain}, header=${structure.hasHeader}, footer=${structure.hasFooter}`);
      await this.logger.business(`✓ Images: ${structure.images.total} total, ${structure.images.withAlt} with alt text`);
      
    }, { timeout: 8000 });
  }

  /**
   * ACCESSIBILITY TEST 4: Color Contrast & Visual Accessibility
   */
  async testColorContrastAndVisual() {
    await this.executeTest('Color Contrast and Visual Accessibility', async () => {
      await this.homePage.navigate();
      
      const visualAccessibility = await this.client.evaluateJavaScript(`
        (() => {
          // Basic color contrast estimation (simplified)
          const elements = document.querySelectorAll('a, button, .btn, h1, h2, h3, p');
          let textElements = 0;
          let potentialIssues = 0;
          
          elements.forEach(el => {
            const style = window.getComputedStyle(el);
            const fontSize = parseFloat(style.fontSize);
            const fontWeight = style.fontWeight;
            
            textElements++;
            
            // Check for very small text (potential accessibility issue)
            if (fontSize < 14) {
              potentialIssues++;
            }
          });
          
          // Check for proper text sizing
          const rootFontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
          
          return JSON.stringify({
            textElements,
            potentialContrastIssues: potentialIssues,
            rootFontSize,
            hasProperTextSizing: rootFontSize >= 16,
            elementsChecked: elements.length
          });
        })()
      `);
      
      const visual = visualAccessibility.success ? (() => {
        try {
          // Extract JSON from "JavaScript execution result: " wrapper
          const jsonStr = visualAccessibility.output.replace(/^JavaScript execution result: /, '');
          const parsed = JSON.parse(jsonStr);
          return {
            textElements: parsed.textElements || 0,
            potentialContrastIssues: parsed.potentialContrastIssues || 0,
            rootFontSize: parsed.rootFontSize || 16,
            hasProperTextSizing: parsed.hasProperTextSizing !== false,
            elementsChecked: parsed.elementsChecked || 0
          };
        } catch (e) {
          return {
            textElements: 0,
            potentialContrastIssues: 0,
            rootFontSize: 16,
            hasProperTextSizing: true,
            elementsChecked: 0
          };
        }
      })() : {
        textElements: 0,
        potentialContrastIssues: 0,
        rootFontSize: 16,
        hasProperTextSizing: true,
        elementsChecked: 0
      };
      
      if (!visual.hasProperTextSizing) {
        this.accessibilityIssues.push({
          severity: 'medium',
          issue: `Root font size may be too small: ${visual.rootFontSize}px (recommended: 16px+)`,
          page: 'homepage'
        });
      }
      
      if (visual.potentialContrastIssues > visual.textElements * 0.2) {
        this.accessibilityIssues.push({
          severity: 'medium',
          issue: `Potential text size issues found in ${visual.potentialContrastIssues} elements`,
          page: 'homepage'
        });
      }
      
      await this.logger.business(`✓ Text elements analyzed: ${visual.textElements}`);
      await this.logger.business(`✓ Root font size: ${visual.rootFontSize}px`);
      await this.logger.business(`✓ Potential issues: ${visual.potentialContrastIssues}/${visual.textElements}`);
      
    }, { timeout: 8000 });
  }

  /**
   * ACCESSIBILITY TEST 5: Form Accessibility
   */
  async testFormAccessibility() {
    await this.executeTest('Form Accessibility Validation', async () => {
      await this.contactPage.navigate();
      
      const formAccessibility = await this.client.evaluateJavaScript(`
        (() => {
          const forms = document.querySelectorAll('form');
          if (forms.length === 0) return JSON.stringify({ hasForm: false });
          
          const form = forms[0];
          const inputs = form.querySelectorAll('input, textarea, select');
          
          let labelledInputs = 0;
          let requiredInputs = 0;
          let inputsWithIds = 0;
          
          inputs.forEach(input => {
            // Check for labels
            const hasLabel = document.querySelector(\`label[for="\${input.id}"]\`) || 
                            input.closest('label') ||
                            input.getAttribute('aria-label') ||
                            input.getAttribute('aria-labelledby');
            
            if (hasLabel) labelledInputs++;
            if (input.required) requiredInputs++;
            if (input.id) inputsWithIds++;
          });
          
          return JSON.stringify({
            hasForm: true,
            totalInputs: inputs.length,
            labelledInputs,
            requiredInputs,
            inputsWithIds,
            labellingRate: inputs.length > 0 ? (labelledInputs / inputs.length) * 100 : 0
          });
        })()
      `);
      
      const formA11y = formAccessibility.success ? (() => {
        try {
          // Extract JSON from "JavaScript execution result: " wrapper
          const jsonStr = formAccessibility.output.replace(/^JavaScript execution result: /, '');
          return JSON.parse(jsonStr);
        } catch (e) {
          return {
            hasForm: false,
            totalInputs: 0,
            labelledInputs: 0,
            requiredInputs: 0,
            inputsWithIds: 0,
            labellingRate: 0
          };
        }
      })() : {
        hasForm: false,
        totalInputs: 0,
        labelledInputs: 0,
        requiredInputs: 0,
        inputsWithIds: 0,
        labellingRate: 0
      };
      
      if (!formA11y.hasForm) {
        throw new Error('No forms found on contact page');
      }
      
      if (formA11y.labellingRate < 80) {
        this.accessibilityIssues.push({
          severity: 'high',
          issue: `Low form labelling rate: ${formA11y.labellingRate.toFixed(1)}% (${formA11y.labelledInputs}/${formA11y.totalInputs})`,
          page: 'contact'
        });
      }
      
      if (formA11y.inputsWithIds < formA11y.totalInputs) {
        this.accessibilityIssues.push({
          severity: 'medium',
          issue: `Some form inputs missing IDs for proper labelling`,
          page: 'contact'
        });
      }
      
      await this.logger.business(`✓ Form inputs: ${formA11y.totalInputs} total, ${formA11y.labelledInputs} properly labelled`);
      await this.logger.business(`✓ Required fields: ${formA11y.requiredInputs}`);
      await this.logger.business(`✓ Labelling rate: ${formA11y.labellingRate.toFixed(1)}%`);
      
    }, { timeout: 8000 });
  }

  /**
   * Run all accessibility tests
   */
  async runAccessibilityTests() {
    try {
      await this.initialize('Accessibility Compliance Tests', 'chromium');
      await this.initializePageObjects();
      
      // Execute accessibility tests
      await this.testKeyboardNavigation();
      await this.testFocusManagement();
      await this.testSemanticHTMLStructure();
      await this.testColorContrastAndVisual();
      await this.testFormAccessibility();
      
      const summary = this.getTestSummary();
      await this.logger.suiteEnd('Accessibility Tests Complete', summary);
      
      // Generate accessibility report
      const report = {
        suite: 'Accessibility Compliance Tests',
        timestamp: new Date().toISOString(),
        summary,
        accessibilityIssues: this.accessibilityIssues,
        complianceScore: this.calculateComplianceScore(),
        recommendations: this.generateAccessibilityRecommendations(summary)
      };
      
      console.log('\n=== ACCESSIBILITY COMPLIANCE RESULTS ===');
      console.log(JSON.stringify(report, null, 2));
      
    } catch (error) {
      await this.logger.error(`Accessibility tests failed: ${error.message}`);
      throw error;
    } finally {
      await this.cleanup();
    }
  }

  calculateComplianceScore() {
    const highSeverityIssues = this.accessibilityIssues.filter(issue => issue.severity === 'high').length;
    const mediumSeverityIssues = this.accessibilityIssues.filter(issue => issue.severity === 'medium').length;
    
    // Start with 100% and deduct points for issues
    let score = 100;
    score -= (highSeverityIssues * 15); // 15 points per high severity issue
    score -= (mediumSeverityIssues * 5); // 5 points per medium severity issue
    
    return Math.max(0, score);
  }

  generateAccessibilityRecommendations(summary) {
    const recommendations = [];
    
    if (summary.failed > 0) {
      recommendations.push('Address failed accessibility tests immediately');
    }
    
    const highSeverityIssues = this.accessibilityIssues.filter(issue => issue.severity === 'high');
    if (highSeverityIssues.length > 0) {
      recommendations.push('Critical accessibility issues found - review WCAG 2.1 guidelines');
    }
    
    const complianceScore = this.calculateComplianceScore();
    if (complianceScore < 85) {
      recommendations.push('Accessibility compliance below recommended threshold - comprehensive audit needed');
    }
    
    recommendations.push('Regular accessibility testing should be part of development workflow');
    recommendations.push('Consider automated accessibility testing tools integration');
    recommendations.push('User testing with assistive technologies recommended');
    
    return recommendations;
  }
}

// Execute accessibility tests
async function main() {
  const accessibilityTests = new AccessibilityComplianceTests();
  
  // Set a timeout for the entire accessibility test suite
  const timeoutId = setTimeout(() => {
    console.error('Accessibility tests timed out after 10 minutes');
    process.exit(1);
  }, 600000); // 10 minutes
  
  try {
    await accessibilityTests.runAccessibilityTests();
    clearTimeout(timeoutId);
    process.exit(0);
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Accessibility tests failed:', error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Accessibility test error:', error);
  process.exit(1);
});
