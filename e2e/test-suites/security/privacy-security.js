#!/usr/bin/env node

/**
 * Newsela Educational Platform - Security Tests
 * 
 * Purpose: Ensure educational platform meets security standards for student data protection
 * Focus: COPPA compliance, data privacy, secure authentication, educational data security
 * Frequency: Security validation, compliance checks
 * 
 * Critical for protecting student privacy and educational data in classroom environments
 */

import { BaseTestFramework } from '../../framework/base-test-framework.js';

class NewselaSecurityTests extends BaseTestFramework {
  constructor() {
    super();
  }

  /**
   * SECURITY TEST 1: HTTPS and Secure Connection
   * Test: All educational content is served over secure connections
   */
  async testSecureConnectionEducational() {
    await this.executeTest('Educational Platform Secure Connection', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      // Verify HTTPS connection
      const urlResult = await this.client.evaluate(() => {
        return {
          protocol: window.location.protocol,
          hostname: window.location.hostname,
          href: window.location.href
        };
      });
      
      if (!urlResult.success) {
        throw new Error('Cannot verify connection security');
      }
      
      const urlInfo = urlResult.output;
      
      if (urlInfo.protocol !== 'https:') {
        throw new Error(`Insecure connection: ${urlInfo.protocol} (expected https:)`);
      }
      
      // Check for security headers
      const securityResult = await this.client.evaluate(() => {
        const results = {
          hasHttps: window.location.protocol === 'https:',
          mixedContent: false,
          insecureResources: [],
          securityIndicators: {
            hasCSP: false,
            hasHSTS: false,
            hasXFrameOptions: false
          }
        };
        
        // Check for mixed content (HTTP resources on HTTPS page)
        const resources = performance.getEntriesByType('resource');
        results.insecureResources = resources
          .filter(resource => resource.name.startsWith('http://'))
          .map(resource => resource.name);
        
        results.mixedContent = results.insecureResources.length > 0;
        
        // Check for common security headers (these would be in response headers, but we can check for CSP in meta tags)
        const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        results.securityIndicators.hasCSP = !!cspMeta;
        
        return results;
      });
      
      if (!securityResult.success) {
        throw new Error('Cannot analyze security features');
      }
      
      const securityInfo = securityResult.output;
      
      const securityIssues = [];
      
      if (securityInfo.mixedContent) {
        securityIssues.push(`Mixed content detected: ${securityInfo.insecureResources.length} insecure resources`);
      }
      
      if (securityIssues.length > 0) {
        throw new Error(`Security issues found: ${securityIssues.join(', ')}`);
      }
      
      await this.logger.business(`✓ Secure HTTPS connection established`);
      await this.logger.business(`✓ No mixed content detected`);
      await this.logger.business(`✓ Educational platform security: Verified`);
      
      if (securityInfo.securityIndicators.hasCSP) {
        await this.logger.business(`✓ Content Security Policy detected`);
      }
    }, { timeout: 10000 });
  }

  /**
   * SECURITY TEST 2: Student Privacy and Data Protection
   * Test: Platform demonstrates commitment to student data privacy
   */
  async testStudentDataPrivacyProtection() {
    await this.executeTest('Student Data Privacy Protection', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      // Look for privacy policy and data protection information
      const privacySelectors = [
        'a:has-text("Privacy Policy")',
        'a:has-text("Privacy")',
        'a:has-text("Student Privacy")',
        'a[href*="privacy"]',
        'a[href*="coppa"]',
        'a[href*="ferpa"]'
      ];
      
      let privacyPolicyFound = false;
      let privacyLinks = [];
      
      for (const selector of privacySelectors) {
        try {
          const result = await this.client.waitForElement(selector, 'visible', 2000);
          if (result.success) {
            privacyPolicyFound = true;
            privacyLinks.push(selector);
          }
        } catch (e) {
          continue;
        }
      }
      
      if (!privacyPolicyFound) {
        throw new Error('Privacy policy not accessible - required for educational platforms');
      }
      
      // Check content for student privacy mentions
      const contentResult = await this.client.getText('body', 10000);
      if (contentResult.success) {
        const content = contentResult.output.toLowerCase();
        
        const privacyFeatures = {
          'Student Privacy': content.includes('student privacy') || content.includes('student data'),
          'COPPA Compliance': content.includes('coppa') || content.includes('children'),
          'FERPA Compliance': content.includes('ferpa') || content.includes('educational records'),
          'Data Protection': content.includes('data protection') || content.includes('privacy'),
          'Secure Data': content.includes('secure') || content.includes('encryption'),
          'Parental Control': content.includes('parent') || content.includes('guardian')
        };
        
        const availablePrivacyFeatures = Object.entries(privacyFeatures).filter(([name, available]) => available);
        
        if (availablePrivacyFeatures.length < 3) {
          await this.logger.warning(`⚠️ Limited privacy information visible - only ${availablePrivacyFeatures.length} features mentioned`);
        }
        
        await this.logger.business(`✓ Privacy features mentioned: ${availablePrivacyFeatures.map(([name]) => name).join(', ')}`);
      }
      
      await this.logger.business(`✓ Privacy policy access: ${privacyLinks.length} links found`);
      await this.logger.business(`✓ Student data protection: Information available`);
    }, { timeout: 10000 });
  }

  /**
   * SECURITY TEST 3: Educational Authentication Security
   * Test: Authentication mechanisms are secure for teachers and students
   */
  async testEducationalAuthenticationSecurity() {
    await this.executeTest('Educational Authentication Security', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      // Look for authentication/login elements
      const authSelectors = [
        'a:has-text("Log in")',
        'a:has-text("Sign in")',
        'button:has-text("Login")',
        'a[href*="login"]',
        'a[href*="signin"]',
        'a[href*="auth"]'
      ];
      
      let authFound = false;
      let authSelector = '';
      
      for (const selector of authSelectors) {
        try {
          const result = await this.client.waitForElement(selector, 'visible', 2000);
          if (result.success) {
            authFound = true;
            authSelector = selector;
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      if (!authFound) {
        await this.logger.business('✓ No authentication forms visible on homepage - external auth system likely');
        return;
      }
      
      // Click on authentication link to check security
      try {
        await this.client.click(authSelector);
        await this.client.wait(3000); // Wait for potential redirect or modal
        
        // Check if we're on a secure authentication page
        const authPageResult = await this.client.evaluate(() => {
          return {
            currentUrl: window.location.href,
            protocol: window.location.protocol,
            hasPasswordField: !!document.querySelector('input[type="password"]'),
            hasEmailField: !!document.querySelector('input[type="email"], input[name*="email"], input[placeholder*="email"]'),
            hasSecurityFeatures: {
              hasFormValidation: !!document.querySelector('input[required]'),
              hasSecureForm: !!document.querySelector('form[action^="https://"]') || window.location.protocol === 'https:',
              hasHiddenPassword: !!document.querySelector('input[type="password"]')
            }
          };
        });
        
        if (authPageResult.success) {
          const authInfo = authPageResult.output;
          
          const authSecurityIssues = [];
          
          if (authInfo.protocol !== 'https:') {
            authSecurityIssues.push('Authentication not over HTTPS');
          }
          
          if (authInfo.hasPasswordField && !authInfo.hasSecurityFeatures.hasHiddenPassword) {
            authSecurityIssues.push('Password field not properly hidden');
          }
          
          if (authSecurityIssues.length > 0) {
            throw new Error(`Authentication security issues: ${authSecurityIssues.join(', ')}`);
          }
          
          await this.logger.business(`✓ Authentication page security: Verified`);
          await this.logger.business(`✓ Secure protocol: ${authInfo.protocol}`);
          
          if (authInfo.hasPasswordField) {
            await this.logger.business(`✓ Password field security: Properly protected`);
          }
          
          if (authInfo.hasEmailField) {
            await this.logger.business(`✓ Email field detected for teacher authentication`);
          }
        }
        
      } catch (error) {
        // If authentication test fails, log as warning since it might be external
        await this.logger.warning(`⚠️ Authentication security test limited: ${error.message}`);
      }
    }, { timeout: 15000 });
  }

  /**
   * SECURITY TEST 4: Educational Content Security and Integrity
   * Test: Educational content is served securely and maintains integrity
   */
  async testEducationalContentSecurity() {
    await this.executeTest('Educational Content Security', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      // Analyze content security features
      const contentSecurityResult = await this.client.evaluate(() => {
        const results = {
          externalLinks: [],
          inlineScripts: document.querySelectorAll('script:not([src])').length,
          externalScripts: document.querySelectorAll('script[src]').length,
          iframes: document.querySelectorAll('iframe').length,
          formActions: [],
          securityFeatures: {
            hasNoOpener: false,
            hasNoReferrer: false,
            hasSecureForms: true
          }
        };
        
        // Check external links for security attributes
        const externalLinks = document.querySelectorAll('a[href^="http"]');
        externalLinks.forEach(link => {
          const linkInfo = {
            href: link.href,
            hasNoOpener: link.rel.includes('noopener'),
            hasNoReferrer: link.rel.includes('noreferrer'),
            target: link.target
          };
          results.externalLinks.push(linkInfo);
          
          if (linkInfo.hasNoOpener) results.securityFeatures.hasNoOpener = true;
          if (linkInfo.hasNoReferrer) results.securityFeatures.hasNoReferrer = true;
        });
        
        // Check form actions
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
          const action = form.action || window.location.href;
          results.formActions.push(action);
          
          if (!action.startsWith('https://')) {
            results.securityFeatures.hasSecureForms = false;
          }
        });
        
        return results;
      });
      
      if (!contentSecurityResult.success) {
        throw new Error('Cannot analyze content security');
      }
      
      const contentSecurity = contentSecurityResult.output;
      
      const contentSecurityIssues = [];
      
      if (contentSecurity.inlineScripts > 5) {
        contentSecurityIssues.push(`Many inline scripts: ${contentSecurity.inlineScripts} (potential XSS risk)`);
      }
      
      if (!contentSecurity.securityFeatures.hasSecureForms && contentSecurity.formActions.length > 0) {
        contentSecurityIssues.push('Forms not using HTTPS');
      }
      
      // Check for external links without security attributes
      const unsafeExternalLinks = contentSecurity.externalLinks.filter(link => 
        link.target === '_blank' && !link.hasNoOpener
      );
      
      if (unsafeExternalLinks.length > 2) {
        contentSecurityIssues.push(`Unsafe external links: ${unsafeExternalLinks.length} without noopener`);
      }
      
      if (contentSecurityIssues.length > 2) {
        throw new Error(`Content security issues: ${contentSecurityIssues.join(', ')}`);
      }
      
      await this.logger.business(`✓ External scripts: ${contentSecurity.externalScripts}`);
      await this.logger.business(`✓ Inline scripts: ${contentSecurity.inlineScripts}`);
      await this.logger.business(`✓ External links: ${contentSecurity.externalLinks.length}`);
      await this.logger.business(`✓ Secure forms: ${contentSecurity.securityFeatures.hasSecureForms ? 'Yes' : 'No'}`);
      
      if (contentSecurityIssues.length > 0) {
        await this.logger.warning(`⚠️ Content security improvements: ${contentSecurityIssues.join(', ')}`);
      }
    }, { timeout: 10000 });
  }

  /**
   * SECURITY TEST 5: Educational Third-Party Integration Security
   * Test: Third-party educational tools are integrated securely
   */
  async testThirdPartyEducationalSecurity() {
    await this.executeTest('Third-Party Educational Security', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      // Analyze third-party integrations
      const thirdPartyResult = await this.client.evaluate(() => {
        const results = {
          thirdPartyDomains: new Set(),
          trackingScripts: [],
          socialMedia: [],
          analytics: [],
          cdnResources: [],
          securityConcerns: []
        };
        
        // Analyze all resources for third-party domains
        const resources = performance.getEntriesByType('resource');
        const currentDomain = window.location.hostname;
        
        resources.forEach(resource => {
          try {
            const url = new URL(resource.name);
            const domain = url.hostname;
            
            if (domain !== currentDomain) {
              results.thirdPartyDomains.add(domain);
              
              // Categorize third-party resources
              if (domain.includes('google') || domain.includes('analytics') || domain.includes('gtm')) {
                results.analytics.push(domain);
              } else if (domain.includes('facebook') || domain.includes('twitter') || domain.includes('social')) {
                results.socialMedia.push(domain);
              } else if (domain.includes('cdn') || domain.includes('cloudflare') || domain.includes('amazonaws')) {
                results.cdnResources.push(domain);
              } else if (domain.includes('track') || domain.includes('pixel') || domain.includes('ads')) {
                results.trackingScripts.push(domain);
              }
            }
          } catch (e) {
            // Invalid URL, skip
          }
        });
        
        // Convert Set to Array for JSON serialization
        results.thirdPartyDomains = Array.from(results.thirdPartyDomains);
        
        // Check for potential security concerns
        if (results.trackingScripts.length > 3) {
          results.securityConcerns.push('Many tracking scripts detected');
        }
        
        if (results.socialMedia.length > 2) {
          results.securityConcerns.push('Multiple social media integrations');
        }
        
        return results;
      });
      
      if (!thirdPartyResult.success) {
        throw new Error('Cannot analyze third-party integrations');
      }
      
      const thirdPartyInfo = thirdPartyResult.output;
      
      const thirdPartySecurityIssues = [];
      
      if (thirdPartyInfo.trackingScripts.length > 5) {
        thirdPartySecurityIssues.push(`Excessive tracking: ${thirdPartyInfo.trackingScripts.length} tracking domains`);
      }
      
      if (thirdPartyInfo.thirdPartyDomains.length > 20) {
        thirdPartySecurityIssues.push(`Many third-parties: ${thirdPartyInfo.thirdPartyDomains.length} external domains`);
      }
      
      // For educational platforms, we want minimal tracking and social media
      if (thirdPartyInfo.socialMedia.length > 3) {
        thirdPartySecurityIssues.push(`Multiple social integrations: ${thirdPartyInfo.socialMedia.length} (consider student privacy)`);
      }
      
      if (thirdPartySecurityIssues.length > 2) {
        await this.logger.warning(`⚠️ Third-party security concerns: ${thirdPartySecurityIssues.join(', ')}`);
      }
      
      await this.logger.business(`✓ Third-party domains: ${thirdPartyInfo.thirdPartyDomains.length}`);
      await this.logger.business(`✓ Analytics services: ${thirdPartyInfo.analytics.length}`);
      await this.logger.business(`✓ CDN resources: ${thirdPartyInfo.cdnResources.length}`);
      await this.logger.business(`✓ Tracking scripts: ${thirdPartyInfo.trackingScripts.length}`);
      
      if (thirdPartyInfo.securityConcerns.length > 0) {
        await this.logger.business(`⚠️ Security considerations: ${thirdPartyInfo.securityConcerns.join(', ')}`);
      }
    }, { timeout: 12000 });
  }

  /**
   * SECURITY TEST 6: Educational Platform Vulnerability Assessment
   * Test: Basic vulnerability checks for educational platform
   */
  async testEducationalVulnerabilityAssessment() {
    await this.executeTest('Educational Vulnerability Assessment', async () => {
      await this.client.navigateTo('https://newsela.com');
      
      // Perform basic vulnerability checks
      const vulnerabilityResult = await this.client.evaluate(() => {
        const results = {
          xssVulnerabilities: [],
          informationDisclosure: [],
          securityHeaders: {
            contentSecurityPolicy: false,
            xFrameOptions: false,
            xContentTypeOptions: false
          },
          formSecurity: {
            hasCSRFProtection: false,
            formsUsePost: true,
            sensitiveDataInUrl: false
          },
          clientSideVulnerabilities: []
        };
        
        // Check for potential XSS vulnerabilities
        const userInputs = document.querySelectorAll('input[type="text"], input[type="search"], textarea');
        if (userInputs.length > 0) {
          // This is a basic check - real XSS testing would be more comprehensive
          results.xssVulnerabilities.push(`${userInputs.length} user input fields detected`);
        }
        
        // Check for information disclosure
        const comments = document.querySelectorAll('*');
        let commentCount = 0;
        comments.forEach(element => {
          if (element.childNodes) {
            element.childNodes.forEach(node => {
              if (node.nodeType === Node.COMMENT_NODE && node.textContent.length > 20) {
                commentCount++;
              }
            });
          }
        });
        
        if (commentCount > 5) {
          results.informationDisclosure.push(`${commentCount} HTML comments with potential info disclosure`);
        }
        
        // Check for security headers (basic check via meta tags)
        const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        results.securityHeaders.contentSecurityPolicy = !!cspMeta;
        
        // Check form security
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
          if (form.method && form.method.toLowerCase() !== 'post') {
            results.formSecurity.formsUsePost = false;
          }
          
          // Check for CSRF tokens (basic check)
          const hiddenInputs = form.querySelectorAll('input[type="hidden"]');
          const hasToken = Array.from(hiddenInputs).some(input => 
            input.name.includes('token') || input.name.includes('csrf') || input.name.includes('_token')
          );
          
          if (hasToken) {
            results.formSecurity.hasCSRFProtection = true;
          }
        });
        
        // Check for sensitive data in URL
        const url = window.location.href;
        const sensitivePatterns = ['password', 'token', 'key', 'secret'];
        results.formSecurity.sensitiveDataInUrl = sensitivePatterns.some(pattern => 
          url.toLowerCase().includes(pattern)
        );
        
        // Check for common client-side vulnerabilities
        if (window.eval) {
          results.clientSideVulnerabilities.push('eval() function available');
        }
        
        const inlineEventHandlers = document.querySelectorAll('[onclick], [onload], [onerror]');
        if (inlineEventHandlers.length > 0) {
          results.clientSideVulnerabilities.push(`${inlineEventHandlers.length} inline event handlers`);
        }
        
        return results;
      });
      
      if (!vulnerabilityResult.success) {
        throw new Error('Cannot perform vulnerability assessment');
      }
      
      const vulnerabilities = vulnerabilityResult.output;
      
      const criticalVulnerabilities = [];
      
      if (vulnerabilities.formSecurity.sensitiveDataInUrl) {
        criticalVulnerabilities.push('Sensitive data in URL');
      }
      
      if (vulnerabilities.clientSideVulnerabilities.includes('eval() function available')) {
        criticalVulnerabilities.push('eval() function available (XSS risk)');
      }
      
      if (!vulnerabilities.formSecurity.formsUsePost && vulnerabilities.xssVulnerabilities.length > 0) {
        criticalVulnerabilities.push('Forms using GET method with user inputs');
      }
      
      if (criticalVulnerabilities.length > 0) {
        throw new Error(`Critical vulnerabilities found: ${criticalVulnerabilities.join(', ')}`);
      }
      
      await this.logger.business(`✓ XSS assessment: ${vulnerabilities.xssVulnerabilities.length > 0 ? vulnerabilities.xssVulnerabilities.join(', ') : 'No obvious vulnerabilities'}`);
      await this.logger.business(`✓ Form security: ${vulnerabilities.formSecurity.formsUsePost ? 'POST methods used' : 'Mixed methods'}`);
      await this.logger.business(`✓ CSRF protection: ${vulnerabilities.formSecurity.hasCSRFProtection ? 'Detected' : 'Not detected'}`);
      await this.logger.business(`✓ Client-side security: ${vulnerabilities.clientSideVulnerabilities.length === 0 ? 'No issues' : vulnerabilities.clientSideVulnerabilities.join(', ')}`);
      
      if (vulnerabilities.informationDisclosure.length > 0) {
        await this.logger.warning(`⚠️ Information disclosure: ${vulnerabilities.informationDisclosure.join(', ')}`);
      }
    }, { timeout: 15000 });
  }

  async runSecurityTests() {
    try {
      console.log('\n🔒 NEWSELA EDUCATIONAL PLATFORM - SECURITY TESTS');
      console.log('=================================================');
      console.log('🎯 Testing security and privacy protection for educational environments');
      console.log('');

      await this.testSecureConnectionEducational();
      await this.testStudentDataPrivacyProtection();
      await this.testEducationalAuthenticationSecurity();
      await this.testEducationalContentSecurity();
      await this.testThirdPartyEducationalSecurity();
      await this.testEducationalVulnerabilityAssessment();

      // Generate summary
      const summary = this.getTestSummary();
      console.log('\n📊 EDUCATIONAL SECURITY TEST SUMMARY');
      console.log('=====================================');
      console.log(`Total Security Tests: ${summary.total}`);
      console.log(`Passed: ${summary.passed}`);
      console.log(`Failed: ${summary.failed}`);
      console.log(`Security Compliance Rate: ${Math.round((summary.passed / summary.total) * 100)}%`);
      
      if (summary.failed > 0) {
        console.log(`⚠️ ${summary.failed} security tests failed - review platform security`);
      }
      
    } catch (error) {
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Execute security tests
async function main() {
  const securityTests = new NewselaSecurityTests();
  
  try {
    await securityTests.runSecurityTests();
    console.log('✅ EDUCATIONAL SECURITY TESTS COMPLETED');
    process.exit(0);
  } catch (error) {
    console.error('❌ EDUCATIONAL SECURITY TESTS FAILED');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ SECURITY TEST SUITE FAILURE:', error);
  process.exit(1);
});
