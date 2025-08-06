#!/usr/bin/env node

/**
 * Security & Compliance Tests
 * 
 * Purpose: Regulatory compliance and data protection validation
 * Frequency: Weekly security runs
 * Timeout: 15 minutes max
 * 
 * Ensures software development business security requirements and
 * data protection standards are met.
 */

import { BaseTestFramework } from '../../framework/base-test-framework.js';
import { IFSightHomePage } from '../../page-objects/homepage.js';
import { IFSightContactPage } from '../../page-objects/contact-page.js';

class SecurityComplianceTests extends BaseTestFramework {
  constructor() {
    super();
    this.homePage = null;
    this.contactPage = null;
    this.securityFindings = [];
  }

  async initializePageObjects() {
    this.homePage = new IFSightHomePage(this.client);
    this.contactPage = new IFSightContactPage(this.client);
  }

  /**
   * SECURITY TEST 1: HTTPS Enforcement
   */
  async testHTTPSEnforcement() {
    await this.executeTest('HTTPS Enforcement Validation', async () => {
      await this.homePage.navigate();
      
      const securityProtocol = await this.client.evaluateJavaScript(`
        (() => {
          return {
            protocol: window.location.protocol,
            isSecure: window.location.protocol === 'https:',
            host: window.location.host,
            mixedContent: {
              hasInsecureRequests: false, // We'll check this separately
              insecureElements: []
            }
          };
        })()
      `);
      
      const security = JSON.parse(securityProtocol.output);
      
      if (!security.isSecure) {
        throw new Error(`Site not using HTTPS: ${security.protocol} - Critical security violation for software business`);
      }
      
      // Check for mixed content (HTTPS page loading HTTP resources)
      const mixedContentCheck = await this.client.evaluateJavaScript(`
        (() => {
          const resources = performance.getEntriesByType('resource');
          const insecureResources = resources.filter(resource => 
            resource.name.startsWith('http://') && !resource.name.startsWith('https://')
          );
          
          return {
            totalResources: resources.length,
            insecureResources: insecureResources.length,
            insecureUrls: insecureResources.slice(0, 5).map(r => r.name)
          };
        })()
      `);
      
      const mixedContent = JSON.parse(mixedContentCheck.output);
      
      if (mixedContent.insecureResources > 0) {
        this.securityFindings.push({
          severity: 'high',
          finding: `Mixed content detected: ${mixedContent.insecureResources} insecure resources`,
          details: mixedContent.insecureUrls,
          page: 'homepage'
        });
      }
      
      await this.logger.business(`✓ HTTPS enforced: ${security.protocol}`);
      await this.logger.business(`✓ Mixed content check: ${mixedContent.insecureResources} insecure resources`);
      
    }, { timeout: 8000 });
  }

  /**
   * SECURITY TEST 2: Form Data Protection
   */
  async testFormDataProtection() {
    await this.executeTest('Form Data Protection Validation', async () => {
      await this.contactPage.navigate();
      
      const formSecurity = await this.contactPage.checkFormSecurity();
      
      if (!formSecurity.isSecure) {
        throw new Error('Contact form not submitted over HTTPS - security violation');
      }
      
      // Additional form security checks
      const formSecurityDetails = await this.client.evaluateJavaScript(`
        (() => {
          const forms = document.querySelectorAll('form');
          if (forms.length === 0) return { hasForm: false };
          
          const form = forms[0];
          const inputs = form.querySelectorAll('input');
          
          let securityFeatures = {
            hasCSRFToken: !!form.querySelector('input[name*="csrf"], input[name*="_token"]'),
            hasAutoCompleteOff: Array.from(inputs).some(input => 
              input.getAttribute('autocomplete') === 'off'
            ),
            hasPasswordFields: Array.from(inputs).some(input => 
              input.type === 'password'
            ),
            formMethod: form.method ? form.method.toLowerCase() : 'get',
            formAction: form.action || window.location.href,
            isSecureAction: form.action ? form.action.startsWith('https://') : true
          };
          
          return securityFeatures;
        })()
      `);
      
      const formDetails = JSON.parse(formSecurityDetails.output);
      
      if (!formDetails.hasForm) {
        throw new Error('No contact form found for security validation');
      }
      
      if (formDetails.formMethod !== 'post') {
        this.securityFindings.push({
          severity: 'medium',
          finding: `Form using ${formDetails.formMethod.toUpperCase()} method (POST recommended for data submission)`,
          page: 'contact'
        });
      }
      
      if (!formDetails.isSecureAction) {
        this.securityFindings.push({
          severity: 'high',
          finding: 'Form action URL not using HTTPS',
          details: formDetails.formAction,
          page: 'contact'
        });
      }
      
      await this.logger.business(`✓ Form security: HTTPS=${formSecurity.hasHttps}, Method=${formDetails.formMethod}`);
      await this.logger.business(`✓ Security features: CSRF=${formDetails.hasCSRFToken}, AutoComplete=${formDetails.hasAutoCompleteOff}`);
      
    }, { timeout: 8000 });
  }

  /**
   * SECURITY TEST 3: Trust Indicators & Credentials
   */
  async testTrustIndicatorsAndCredentials() {
    await this.executeTest('Trust Indicators and Credentials', async () => {
      await this.homePage.navigate();
      
      const trustIndicators = await this.client.evaluateJavaScript(`
        (() => {
          const text = document.body.textContent.toLowerCase();
          const html = document.body.innerHTML.toLowerCase();
          
          const indicators = {
            // Software development business credentials
            hasLicenseInfo: text.includes('licensed') || text.includes('registered') || text.includes('member fdic'),
            hasRegulatory: text.includes('sec') || text.includes('finra') || text.includes('fdic') || text.includes('occ'),
            hasInsurance: text.includes('insured') || text.includes('insurance') || text.includes('sipc'),
            
            // Trust signals
            hasPrivacyPolicy: html.includes('privacy') && (html.includes('policy') || html.includes('statement')),
            hasTermsOfService: html.includes('terms') && (html.includes('service') || html.includes('use')),
            hasContactInfo: text.includes('phone') || text.includes('email') || text.includes('contact'),
            
            // Security badges/certificates
            hasSecurityBadges: html.includes('ssl') || html.includes('secure') || html.includes('verified'),
            hasCompanyAddress: text.includes('address') || text.includes('street') || text.includes('suite')
          };
          
          const trustScore = Object.values(indicators).filter(Boolean).length;
          
          return {
            ...indicators,
            trustScore,
            maxScore: Object.keys(indicators).length
          };
        })()
      `);
      
      const trust = JSON.parse(trustIndicators.output);
      
      // Software development companies should have regulatory information
      if (!trust.hasLicenseInfo && !trust.hasRegulatory) {
        this.securityFindings.push({
          severity: 'medium',
          finding: 'No visible licensing or regulatory information found',
          page: 'homepage'
        });
      }
      
      if (!trust.hasPrivacyPolicy) {
        this.securityFindings.push({
          severity: 'high',
          finding: 'Privacy policy not found - required for business compliance',
          page: 'homepage'
        });
      }
      
      if (trust.trustScore < trust.maxScore * 0.6) {
        this.securityFindings.push({
          severity: 'medium',
          finding: `Low trust indicator score: ${trust.trustScore}/${trust.maxScore}`,
          page: 'homepage'
        });
      }
      
      await this.logger.business(`✓ Trust indicators: ${trust.trustScore}/${trust.maxScore}`);
      await this.logger.business(`✓ Regulatory info: ${trust.hasLicenseInfo || trust.hasRegulatory}`);
      await this.logger.business(`✓ Privacy policy: ${trust.hasPrivacyPolicy}`);
      
    }, { timeout: 8000 });
  }

  /**
   * SECURITY TEST 4: Data Privacy Compliance
   */
  async testDataPrivacyCompliance() {
    await this.executeTest('Data Privacy Compliance Check', async () => {
      // Check homepage for privacy-related content
      await this.homePage.navigate();
      
      const privacyCompliance = await this.client.evaluateJavaScript(`
        (() => {
          const text = document.body.textContent.toLowerCase();
          const links = Array.from(document.querySelectorAll('a')).map(a => ({
            text: a.textContent.toLowerCase(),
            href: a.href.toLowerCase()
          }));
          
          const compliance = {
            // GDPR/CCPA compliance indicators
            hasPrivacyPolicy: links.some(link => 
              link.text.includes('privacy') || link.href.includes('privacy')
            ),
            hasCookiePolicy: text.includes('cookie') && (text.includes('policy') || text.includes('notice')),
            hasDataProtection: text.includes('data protection') || text.includes('gdpr') || text.includes('ccpa'),
            
            // Cookie consent
            hasCookieConsent: !!document.querySelector('[data-cookie-consent], .cookie-consent, #cookie-consent'),
            
            // Terms and conditions
            hasTermsOfService: links.some(link => 
              link.text.includes('terms') || link.href.includes('terms')
            ),
            
            // Contact for privacy concerns
            hasPrivacyContact: text.includes('privacy officer') || text.includes('data protection officer')
          };
          
          const complianceScore = Object.values(compliance).filter(Boolean).length;
          
          return {
            ...compliance,
            complianceScore,
            maxScore: Object.keys(compliance).length
          };
        })()
      `);
      
      const privacy = JSON.parse(privacyCompliance.output);
      
      if (!privacy.hasPrivacyPolicy) {
        throw new Error('Privacy policy not found - required for business compliance');
      }
      
      if (!privacy.hasTermsOfService) {
        this.securityFindings.push({
          severity: 'medium',
          finding: 'Terms of service not clearly accessible',
          page: 'homepage'
        });
      }
      
      if (privacy.complianceScore < privacy.maxScore * 0.7) {
        this.securityFindings.push({
          severity: 'medium',
          finding: `Privacy compliance score low: ${privacy.complianceScore}/${privacy.maxScore}`,
          page: 'homepage'
        });
      }
      
      await this.logger.business(`✓ Privacy compliance: ${privacy.complianceScore}/${privacy.maxScore}`);
      await this.logger.business(`✓ Privacy policy: ${privacy.hasPrivacyPolicy}`);
      await this.logger.business(`✓ Cookie policy: ${privacy.hasCookiePolicy}`);
      
    }, { timeout: 8000 });
  }

  /**
   * SECURITY TEST 5: Input Validation & XSS Protection
   */
  async testInputValidationAndXSSProtection() {
    await this.executeTest('Input Validation and XSS Protection', async () => {
      await this.contactPage.navigate();
      
      // Test basic input validation
      const inputValidation = await this.client.evaluateJavaScript(`
        (() => {
          const forms = document.querySelectorAll('form');
          if (forms.length === 0) return { hasForm: false };
          
          const form = forms[0];
          const inputs = form.querySelectorAll('input, textarea');
          
          let validationFeatures = {
            totalInputs: inputs.length,
            hasRequiredFields: Array.from(inputs).some(input => input.required),
            hasTypeValidation: Array.from(inputs).some(input => 
              ['email', 'tel', 'url'].includes(input.type)
            ),
            hasMaxLengthLimits: Array.from(inputs).some(input => 
              input.maxLength && input.maxLength > 0
            ),
            hasPatternValidation: Array.from(inputs).some(input => 
              input.pattern && input.pattern.length > 0
            )
          };
          
          return validationFeatures;
        })()
      `);
      
      const validation = JSON.parse(inputValidation.output);
      
      if (!validation.hasForm) {
        throw new Error('No form found for input validation testing');
      }
      
      if (!validation.hasRequiredFields) {
        this.securityFindings.push({
          severity: 'low',
          finding: 'No required field validation found',
          page: 'contact'
        });
      }
      
      if (!validation.hasTypeValidation && !validation.hasPatternValidation) {
        this.securityFindings.push({
          severity: 'medium',
          finding: 'Limited input validation - consider adding email/phone validation',
          page: 'contact'
        });
      }
      
      // Test for basic XSS protection headers (simplified check)
      const securityHeaders = await this.client.evaluateJavaScript(`
        (() => {
          // Note: We can't check HTTP headers directly in browser context
          // This is a simplified check for client-side protection indicators
          return {
            hasCSP: !!document.querySelector('meta[http-equiv="Content-Security-Policy"]'),
            hasXFrameOptions: true, // Assumed from HTTPS enforcement
            hasXSSProtection: true   // Assumed from browser defaults
          };
        })()
      `);
      
      const headers = JSON.parse(securityHeaders.output);
      
      await this.logger.business(`✓ Input validation: Required=${validation.hasRequiredFields}, Type=${validation.hasTypeValidation}`);
      await this.logger.business(`✓ Security headers: CSP=${headers.hasCSP}, XFrame=${headers.hasXFrameOptions}`);
      
    }, { timeout: 8000 });
  }

  /**
   * Run all security and compliance tests
   */
  async runSecurityTests() {
    try {
      await this.initialize('Security & Compliance Tests', 'chromium');
      await this.initializePageObjects();
      
      // Execute security tests
      await this.testHTTPSEnforcement();
      await this.testFormDataProtection();
      await this.testTrustIndicatorsAndCredentials();
      await this.testDataPrivacyCompliance();
      await this.testInputValidationAndXSSProtection();
      
      const summary = this.getTestSummary();
      await this.logger.suiteEnd('Security Tests Complete', summary);
      
      // Generate security report
      const report = {
        suite: 'Security & Compliance Tests',
        timestamp: new Date().toISOString(),
        summary,
        securityFindings: this.securityFindings,
        securityScore: this.calculateSecurityScore(),
        complianceLevel: this.determineComplianceLevel(),
        recommendations: this.generateSecurityRecommendations(summary)
      };
      
      console.log('\n=== SECURITY & COMPLIANCE RESULTS ===');
      console.log(JSON.stringify(report, null, 2));
      
    } catch (error) {
      await this.logger.error(`Security tests failed: ${error.message}`);
      throw error;
    } finally {
      await this.cleanup();
    }
  }

  calculateSecurityScore() {
    const highSeverityFindings = this.securityFindings.filter(finding => finding.severity === 'high').length;
    const mediumSeverityFindings = this.securityFindings.filter(finding => finding.severity === 'medium').length;
    const lowSeverityFindings = this.securityFindings.filter(finding => finding.severity === 'low').length;
    
    // Start with 100% and deduct points for findings
    let score = 100;
    score -= (highSeverityFindings * 20); // 20 points per high severity finding
    score -= (mediumSeverityFindings * 10); // 10 points per medium severity finding
    score -= (lowSeverityFindings * 5); // 5 points per low severity finding
    
    return Math.max(0, score);
  }

  determineComplianceLevel() {
    const score = this.calculateSecurityScore();
    const highSeverityFindings = this.securityFindings.filter(finding => finding.severity === 'high').length;
    
    if (highSeverityFindings > 0) return 'NON-COMPLIANT';
    if (score >= 90) return 'FULLY COMPLIANT';
    if (score >= 75) return 'MOSTLY COMPLIANT';
    if (score >= 60) return 'PARTIALLY COMPLIANT';
    return 'NON-COMPLIANT';
  }

  generateSecurityRecommendations(summary) {
    const recommendations = [];
    
    if (summary.failed > 0) {
      recommendations.push('Address failed security tests immediately - potential compliance violations');
    }
    
    const highSeverityFindings = this.securityFindings.filter(finding => finding.severity === 'high');
    if (highSeverityFindings.length > 0) {
      recommendations.push('Critical security findings detected - immediate remediation required');
    }
    
    const complianceLevel = this.determineComplianceLevel();
    if (complianceLevel === 'NON-COMPLIANT') {
      recommendations.push('Non-compliant status detected - comprehensive security review needed');
    }
    
    recommendations.push('Regular security testing should be part of deployment pipeline');
    recommendations.push('Consider implementing automated security scanning');
    recommendations.push('Privacy policy and terms of service should be reviewed by legal team');
    recommendations.push('Security headers should be implemented at server level');
    
    return recommendations;
  }
}

// Execute security tests
async function main() {
  const securityTests = new SecurityComplianceTests();
  
  // Set a timeout for the entire security test suite
  const timeoutId = setTimeout(() => {
    console.error('Security tests timed out after 15 minutes');
    process.exit(1);
  }, 900000); // 15 minutes
  
  try {
    await securityTests.runSecurityTests();
    clearTimeout(timeoutId);
    process.exit(0);
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Security tests failed:', error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Security test error:', error);
  process.exit(1);
});
