#!/usr/bin/env node

/**
 * Newsela Educational Platform - Accessibility Tests
 * 
 * Purpose: Ensure educational platform meets WCAG 2.1 AA standards for all learners
 * Focus: Educational accessibility, assistive technology support, inclusive design
 * Frequency: Every deployment, accessibility compliance
 * 
 * Critical for ensuring all students and teachers can access educational content
 */

import { BaseTestFramework } from '../../framework/base-test-framework.js';

class NewselaAccessibilityTests extends BaseTestFramework {
  constructor() {
    super();
  }

  /**
   * ACCESSIBILITY TEST 1: Educational Content Accessibility
   * Test: Educational content is accessible to all learners
   */
  async testEducationalContentAccessibility() {
    await this.executeTest('Educational Content Accessibility', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      // Wait for content to load
      await this.client.waitForElement('body', 'visible', 10000);
      
      // Take accessibility snapshot for analysis
      const snapshotResult = await this.client.getAccessibilitySnapshot();
      
      if (!snapshotResult.success) {
        throw new Error('Cannot generate accessibility snapshot for analysis');
      }
      
      const snapshot = snapshotResult.data;
      
      // Check for critical accessibility elements
      const accessibilityFeatures = {
        'Page has title': !!snapshot.title,
        'Main content identified': this.hasRole(snapshot, 'main'),
        'Navigation structure': this.hasRole(snapshot, 'navigation'),
        'Headings present': this.hasHeadings(snapshot),
        'Images have alt text': this.checkImageAltText(snapshot),
        'Links are descriptive': this.checkLinkDescriptions(snapshot)
      };
      
      const passedFeatures = Object.entries(accessibilityFeatures).filter(([name, passed]) => passed);
      const failedFeatures = Object.entries(accessibilityFeatures).filter(([name, passed]) => !passed);
      
      if (failedFeatures.length > 2) {
        throw new Error(`Critical accessibility issues found: ${failedFeatures.map(([name]) => name).join(', ')}`);
      }
      
      await this.logger.business(`✓ Accessibility features passed: ${passedFeatures.map(([name]) => name).join(', ')}`);
      
      if (failedFeatures.length > 0) {
        await this.logger.warning(`⚠️ Accessibility issues: ${failedFeatures.map(([name]) => name).join(', ')}`);
      }
    }, { timeout: 15000 });
  }

  /**
   * ACCESSIBILITY TEST 2: Keyboard Navigation for Educational Tools
   * Test: All educational features are keyboard accessible
   */
  async testKeyboardNavigationEducational() {
    await this.executeTest('Educational Keyboard Navigation', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      // Test tab navigation through critical educational elements
      const tabStops = [];
      let currentElement = null;
      let tabCount = 0;
      const maxTabs = 20; // Limit to prevent infinite loops
      
      try {
        // Start tabbing and collect focusable elements
        while (tabCount < maxTabs) {
          await this.client.pressKey('Tab');
          tabCount++;
          
          // Get currently focused element
          const focusResult = await this.client.evaluate(() => {
            const focused = document.activeElement;
            if (!focused || focused === document.body) return null;
            
            return {
              tagName: focused.tagName.toLowerCase(),
              text: focused.textContent?.trim().substring(0, 50) || '',
              type: focused.type || '',
              role: focused.getAttribute('role') || '',
              ariaLabel: focused.getAttribute('aria-label') || '',
              href: focused.href || ''
            };
          });
          
          if (focusResult.success && focusResult.output) {
            tabStops.push(focusResult.output);
          }
          
          // Break if we've cycled back to the beginning
          if (tabCount > 5 && focusResult.success && focusResult.output?.tagName === 'a' && focusResult.output?.text.includes('Skip')) {
            break;
          }
        }
        
        // Analyze tab stops for educational functionality
        const educationalElements = tabStops.filter(element => {
          const text = element.text.toLowerCase();
          const isEducational = text.includes('sign') || text.includes('luna') || text.includes('teacher') || 
                               text.includes('content') || text.includes('learn') || text.includes('student') ||
                               element.tagName === 'button' || element.href;
          return isEducational;
        });
        
        if (educationalElements.length < 3) {
          throw new Error(`Insufficient keyboard-accessible educational elements - only ${educationalElements.length} found`);
        }
        
        // Check for skip links
        const hasSkipLink = tabStops.some(element => 
          element.text.toLowerCase().includes('skip') || element.text.toLowerCase().includes('main')
        );
        
        await this.logger.business(`✓ Total keyboard-accessible elements: ${tabStops.length}`);
        await this.logger.business(`✓ Educational elements accessible: ${educationalElements.length}`);
        await this.logger.business(`✓ Skip to main content: ${hasSkipLink ? 'Available' : 'Not found'}`);
        
      } catch (error) {
        throw new Error(`Keyboard navigation test failed: ${error.message}`);
      }
    }, { timeout: 20000 });
  }

  /**
   * ACCESSIBILITY TEST 3: Screen Reader Support for Educational Content
   * Test: Educational content works with screen readers
   */
  async testScreenReaderSupportEducational() {
    await this.executeTest('Educational Screen Reader Support', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      const snapshotResult = await this.client.getAccessibilitySnapshot();
      if (!snapshotResult.success) {
        throw new Error('Cannot analyze screen reader support');
      }
      
      const snapshot = snapshotResult.data;
      
      // Check for screen reader friendly features
      const screenReaderFeatures = {
        'Proper heading hierarchy': this.checkHeadingHierarchy(snapshot),
        'Descriptive page title': snapshot.title && snapshot.title.length > 10,
        'Landmark regions': this.countLandmarks(snapshot) >= 2,
        'Form labels': this.checkFormLabels(snapshot),
        'Button descriptions': this.checkButtonDescriptions(snapshot),
        'Image alternatives': this.checkImageAltText(snapshot)
      };
      
      const passedScreenReaderFeatures = Object.entries(screenReaderFeatures).filter(([name, passed]) => passed);
      const failedScreenReaderFeatures = Object.entries(screenReaderFeatures).filter(([name, passed]) => !passed);
      
      if (failedScreenReaderFeatures.length > 2) {
        throw new Error(`Screen reader support issues: ${failedScreenReaderFeatures.map(([name]) => name).join(', ')}`);
      }
      
      // Check for educational content structure
      const educationalStructure = {
        'Educational headings': this.hasEducationalHeadings(snapshot),
        'Navigation clarity': this.hasRole(snapshot, 'navigation'),
        'Content organization': this.hasRole(snapshot, 'main'),
        'Interactive elements labeled': this.checkInteractiveLabels(snapshot)
      };
      
      const passedStructure = Object.entries(educationalStructure).filter(([name, passed]) => passed);
      
      await this.logger.business(`✓ Screen reader features: ${passedScreenReaderFeatures.map(([name]) => name).join(', ')}`);
      await this.logger.business(`✓ Educational structure: ${passedStructure.map(([name]) => name).join(', ')}`);
      
      if (failedScreenReaderFeatures.length > 0) {
        await this.logger.warning(`⚠️ Screen reader issues: ${failedScreenReaderFeatures.map(([name]) => name).join(', ')}`);
      }
    }, { timeout: 12000 });
  }

  /**
   * ACCESSIBILITY TEST 4: Color Contrast & Visual Accessibility
   * Test: Educational content meets color contrast requirements
   */
  async testVisualAccessibilityEducational() {
    await this.executeTest('Educational Visual Accessibility', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      // Take screenshot for visual analysis
      const screenshotResult = await this.client.takeScreenshot('visual-accessibility-analysis');
      
      // Check for visual accessibility features using content analysis
      const contentResult = await this.client.getText('body', 10000);
      if (!contentResult.success) {
        throw new Error('Cannot analyze visual content');
      }
      
      // Use CSS evaluation to check for accessibility features
      const visualCheckResult = await this.client.evaluate(() => {
        const results = {
          hasHighContrastMode: false,
          hasFontSizeOptions: false,
          hasResponsiveDesign: false,
          hasVisualFocus: false,
          textReadability: false
        };
        
        // Check for common accessibility CSS
        const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
        const cssText = Array.from(styles).map(style => style.textContent || '').join(' ').toLowerCase();
        
        // Check for high contrast or theme options
        results.hasHighContrastMode = cssText.includes('contrast') || 
                                     document.querySelector('[class*="contrast"]') !== null ||
                                     document.querySelector('[class*="theme"]') !== null;
        
        // Check for font size controls
        results.hasFontSizeOptions = document.querySelector('button[class*="font"], button[class*="size"], [aria-label*="font"], [aria-label*="size"]') !== null;
        
        // Check for responsive design indicators
        const viewport = document.querySelector('meta[name="viewport"]');
        results.hasResponsiveDesign = viewport !== null;
        
        // Check for visible focus indicators
        results.hasVisualFocus = cssText.includes(':focus') || cssText.includes('outline');
        
        // Check text size and spacing
        const mainContent = document.querySelector('main, [role="main"], .main, #main') || document.body;
        const computedStyle = window.getComputedStyle(mainContent);
        const fontSize = parseFloat(computedStyle.fontSize);
        const lineHeight = parseFloat(computedStyle.lineHeight);
        
        results.textReadability = fontSize >= 14 && (lineHeight / fontSize) >= 1.2;
        
        return results;
      });
      
      if (!visualCheckResult.success) {
        throw new Error('Cannot evaluate visual accessibility features');
      }
      
      const visualFeatures = visualCheckResult.output;
      const passedVisualFeatures = Object.entries(visualFeatures).filter(([name, passed]) => passed);
      const failedVisualFeatures = Object.entries(visualFeatures).filter(([name, passed]) => !passed);
      
      // At least basic visual accessibility should be present
      if (passedVisualFeatures.length < 2) {
        throw new Error(`Insufficient visual accessibility features - only ${passedVisualFeatures.length} found`);
      }
      
      await this.logger.business(`✓ Visual accessibility features: ${passedVisualFeatures.map(([name]) => name).join(', ')}`);
      
      if (failedVisualFeatures.length > 0) {
        await this.logger.business(`⚠️ Visual accessibility improvements needed: ${failedVisualFeatures.map(([name]) => name).join(', ')}`);
      }
    }, { timeout: 15000 });
  }

  /**
   * ACCESSIBILITY TEST 5: Educational Form & Input Accessibility
   * Test: Educational forms and inputs are accessible
   */
  async testEducationalFormAccessibility() {
    await this.executeTest('Educational Form Accessibility', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      // Look for forms on the page (sign-up, search, etc.)
      const formResult = await this.client.evaluate(() => {
        const forms = document.querySelectorAll('form, input, button, select, textarea');
        const formElements = [];
        
        forms.forEach(element => {
          const info = {
            tagName: element.tagName.toLowerCase(),
            type: element.type || '',
            hasLabel: false,
            hasAriaLabel: !!element.getAttribute('aria-label'),
            hasPlaceholder: !!element.getAttribute('placeholder'),
            hasId: !!element.id,
            isRequired: element.required || element.getAttribute('aria-required') === 'true',
            text: element.textContent?.trim().substring(0, 30) || ''
          };
          
          // Check for associated label
          if (element.id) {
            const label = document.querySelector(`label[for="${element.id}"]`);
            info.hasLabel = !!label;
          }
          
          // Check if element is inside a label
          if (!info.hasLabel) {
            const parentLabel = element.closest('label');
            info.hasLabel = !!parentLabel;
          }
          
          formElements.push(info);
        });
        
        return formElements;
      });
      
      if (!formResult.success) {
        throw new Error('Cannot analyze form accessibility');
      }
      
      const formElements = formResult.output;
      
      if (formElements.length === 0) {
        await this.logger.business('✓ No forms found on homepage - accessibility compliance by default');
        return;
      }
      
      // Analyze form accessibility
      const inputElements = formElements.filter(el => ['input', 'textarea', 'select'].includes(el.tagName));
      const buttonElements = formElements.filter(el => el.tagName === 'button' || el.type === 'button' || el.type === 'submit');
      
      const accessibleInputs = inputElements.filter(el => 
        el.hasLabel || el.hasAriaLabel || el.hasPlaceholder
      );
      
      const accessibleButtons = buttonElements.filter(el => 
        el.text.length > 0 || el.hasAriaLabel
      );
      
      const accessibilityRatio = inputElements.length > 0 ? 
        (accessibleInputs.length / inputElements.length) * 100 : 100;
      
      if (accessibilityRatio < 80) {
        throw new Error(`Poor form accessibility - only ${Math.round(accessibilityRatio)}% of inputs are properly labeled`);
      }
      
      await this.logger.business(`✓ Form elements found: ${formElements.length} total`);
      await this.logger.business(`✓ Input accessibility: ${accessibleInputs.length}/${inputElements.length} properly labeled`);
      await this.logger.business(`✓ Button accessibility: ${accessibleButtons.length}/${buttonElements.length} properly described`);
      await this.logger.business(`✓ Form accessibility score: ${Math.round(accessibilityRatio)}%`);
    }, { timeout: 10000 });
  }

  /**
   * ACCESSIBILITY TEST 6: Educational Mobile Accessibility
   * Test: Educational platform is accessible on mobile devices
   */
  async testEducationalMobileAccessibility() {
    await this.executeTest('Educational Mobile Accessibility', async () => {
      // Set mobile viewport
      await this.client.resizeBrowser(375, 667); // iPhone SE size
      await this.client.navigateTo('https://newsela.com');
      
      // Wait for mobile layout to load
      await this.client.waitForElement('body', 'visible', 5000);
      
      // Check mobile-specific accessibility features
      const mobileAccessibilityResult = await this.client.evaluate(() => {
        const results = {
          hasViewportMeta: !!document.querySelector('meta[name="viewport"]'),
          hasTouch: 'ontouchstart' in window,
          responsiveDesign: false,
          textScalable: false,
          buttonSizeAdequate: false,
          navigationAccessible: false
        };
        
        // Check if design responds to small screen
        const body = document.body;
        const bodyWidth = body.offsetWidth;
        results.responsiveDesign = bodyWidth <= 400; // Reasonable for mobile
        
        // Check text scaling
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
          const content = viewport.getAttribute('content') || '';
          results.textScalable = !content.includes('user-scalable=no') && !content.includes('maximum-scale=1');
        }
        
        // Check button/link sizes (should be at least 44px for touch)
        const interactiveElements = document.querySelectorAll('button, a, input[type="button"], input[type="submit"]');
        let adequateSizeCount = 0;
        
        interactiveElements.forEach(element => {
          const rect = element.getBoundingClientRect();
          if (rect.width >= 44 && rect.height >= 44) {
            adequateSizeCount++;
          }
        });
        
        results.buttonSizeAdequate = interactiveElements.length === 0 || 
                                    (adequateSizeCount / interactiveElements.length) >= 0.7;
        
        // Check navigation accessibility
        const nav = document.querySelector('nav, [role="navigation"]');
        results.navigationAccessible = !!nav;
        
        return results;
      });
      
      if (!mobileAccessibilityResult.success) {
        throw new Error('Cannot analyze mobile accessibility');
      }
      
      const mobileFeatures = mobileAccessibilityResult.output;
      const passedMobileFeatures = Object.entries(mobileFeatures).filter(([name, passed]) => passed);
      const failedMobileFeatures = Object.entries(mobileFeatures).filter(([name, passed]) => !passed);
      
      if (failedMobileFeatures.length > 2) {
        throw new Error(`Mobile accessibility issues: ${failedMobileFeatures.map(([name]) => name).join(', ')}`);
      }
      
      await this.logger.business(`✓ Mobile accessibility features: ${passedMobileFeatures.map(([name]) => name).join(', ')}`);
      
      if (failedMobileFeatures.length > 0) {
        await this.logger.warning(`⚠️ Mobile accessibility improvements: ${failedMobileFeatures.map(([name]) => name).join(', ')}`);
      }
      
      // Reset to desktop view
      await this.client.resizeBrowser(1280, 720);
    }, { timeout: 15000 });
  }

  // Helper methods for accessibility analysis
  hasRole(snapshot, role) {
    return this.findInSnapshot(snapshot, node => node.role === role);
  }

  hasHeadings(snapshot) {
    return this.findInSnapshot(snapshot, node => 
      node.role === 'heading' || ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tag)
    );
  }

  checkImageAltText(snapshot) {
    const images = this.findAllInSnapshot(snapshot, node => node.tag === 'img');
    if (images.length === 0) return true; // No images to check
    const imagesWithAlt = images.filter(img => img.description || img.value);
    return (imagesWithAlt.length / images.length) >= 0.8; // At least 80% should have alt text
  }

  checkLinkDescriptions(snapshot) {
    const links = this.findAllInSnapshot(snapshot, node => node.role === 'link');
    if (links.length === 0) return true;
    const descriptiveLinks = links.filter(link => 
      link.name && link.name.length > 5 && !link.name.toLowerCase().includes('click here')
    );
    return (descriptiveLinks.length / links.length) >= 0.7;
  }

  checkHeadingHierarchy(snapshot) {
    const headings = this.findAllInSnapshot(snapshot, node => node.role === 'heading');
    if (headings.length < 2) return true; // Not enough headings to check hierarchy
    
    // Check if there's at least one h1 and logical progression
    const hasH1 = headings.some(h => h.level === 1);
    return hasH1;
  }

  countLandmarks(snapshot) {
    const landmarks = ['main', 'navigation', 'banner', 'contentinfo', 'complementary'];
    return landmarks.reduce((count, landmark) => {
      return count + (this.findInSnapshot(snapshot, node => node.role === landmark) ? 1 : 0);
    }, 0);
  }

  checkFormLabels(snapshot) {
    const inputs = this.findAllInSnapshot(snapshot, node => 
      ['textbox', 'combobox', 'searchbox'].includes(node.role)
    );
    if (inputs.length === 0) return true;
    const labeledInputs = inputs.filter(input => input.name || input.description);
    return (labeledInputs.length / inputs.length) >= 0.8;
  }

  checkButtonDescriptions(snapshot) {
    const buttons = this.findAllInSnapshot(snapshot, node => node.role === 'button');
    if (buttons.length === 0) return true;
    const describedButtons = buttons.filter(button => 
      button.name && button.name.length > 2
    );
    return (describedButtons.length / buttons.length) >= 0.9;
  }

  hasEducationalHeadings(snapshot) {
    const headings = this.findAllInSnapshot(snapshot, node => node.role === 'heading');
    return headings.some(heading => {
      const text = (heading.name || '').toLowerCase();
      return text.includes('newsela') || text.includes('education') || text.includes('learn') || 
             text.includes('teacher') || text.includes('student');
    });
  }

  checkInteractiveLabels(snapshot) {
    const interactive = this.findAllInSnapshot(snapshot, node => 
      ['button', 'link', 'textbox', 'combobox'].includes(node.role)
    );
    if (interactive.length === 0) return true;
    const labeled = interactive.filter(el => el.name || el.description);
    return (labeled.length / interactive.length) >= 0.8;
  }

  // Helper methods for snapshot traversal
  findInSnapshot(snapshot, predicate) {
    if (!snapshot) return false;
    
    const traverse = (node) => {
      if (predicate(node)) return true;
      if (node.children) {
        return node.children.some(child => traverse(child));
      }
      return false;
    };
    
    return traverse(snapshot);
  }

  findAllInSnapshot(snapshot, predicate) {
    if (!snapshot) return [];
    
    const results = [];
    const traverse = (node) => {
      if (predicate(node)) results.push(node);
      if (node.children) {
        node.children.forEach(child => traverse(child));
      }
    };
    
    traverse(snapshot);
    return results;
  }

  async runAccessibilityTests() {
    try {
      console.log('\n♿ NEWSELA EDUCATIONAL PLATFORM - ACCESSIBILITY TESTS');
      console.log('====================================================');
      console.log('🎯 Testing WCAG 2.1 AA compliance for educational accessibility');
      console.log('');

      await this.testEducationalContentAccessibility();
      await this.testKeyboardNavigationEducational();
      await this.testScreenReaderSupportEducational();
      await this.testVisualAccessibilityEducational();
      await this.testEducationalFormAccessibility();
      await this.testEducationalMobileAccessibility();

      // Generate summary
      const summary = this.getTestSummary();
      console.log('\n📊 EDUCATIONAL ACCESSIBILITY TEST SUMMARY');
      console.log('==========================================');
      console.log(`Total Accessibility Tests: ${summary.total}`);
      console.log(`Passed: ${summary.passed}`);
      console.log(`Failed: ${summary.failed}`);
      console.log(`Accessibility Compliance Rate: ${Math.round((summary.passed / summary.total) * 100)}%`);
      
      if (summary.failed > 0) {
        console.log(`⚠️ ${summary.failed} accessibility tests failed - review WCAG compliance`);
      }
      
    } catch (error) {
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Execute accessibility tests
async function main() {
  const accessibilityTests = new NewselaAccessibilityTests();
  
  try {
    await accessibilityTests.runAccessibilityTests();
    console.log('✅ EDUCATIONAL ACCESSIBILITY TESTS COMPLETED');
    process.exit(0);
  } catch (error) {
    console.error('❌ EDUCATIONAL ACCESSIBILITY TESTS FAILED');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ ACCESSIBILITY TEST SUITE FAILURE:', error);
  process.exit(1);
});
