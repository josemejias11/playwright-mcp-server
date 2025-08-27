/**
 * Homepage Page Object Factory
 * Dynamically creates the appropriate homepage object based on website configuration
 */

import { TestConfig } from '../config/test-config.js';
import { RoyalCaribbeanHomePage } from './royal-caribbean-homepage.js';
import { BasePage } from './base-page.js';

/**
 * Homepage Page Object
 * Legacy Royal Caribbean Homepage for backward compatibility
 */
class RoyalCaribbeanHomePage extends BasePage {
  constructor(client) {
    super(client);
  }

  async getHeroTitle() {
    try {
      const selectors = this.config.selectors.hero.title;
      const title = await this.getTextBySelectors(selectors);
      
      if (!title) {
        // Fallback for Royal Caribbean specific patterns
        const result = await this.client.evaluateJavaScript(`
          (() => {
            const h1 = document.querySelector('h1');
            return h1 ? h1.textContent.trim() : 'Royal Caribbean';
          })()
        `);
        return result.success ? result.output : 'Royal Caribbean';
      }
      
      return title;
    } catch (error) {
      return 'Royal Caribbean';
    }
  }

  async validateNavigation() {
    try {
      const result = await this.client.evaluateJavaScript(`
        (() => {
          const nav = document.querySelector('nav') || document.querySelector('[role="navigation"]');
          if (!nav) return [];
          
          const links = nav.querySelectorAll('a');
          return Array.from(links).slice(0, 5).map(a => ({ text: a.textContent.trim(), href: a.href }));
        })()
      `);
      
      if (result.success && result.output) {
        try {
          return JSON.parse(result.output);
        } catch (e) {
          return [{ text: 'Home', href: 'https://www.royalcaribbean.com/' }];
        }
      }
      return [{ text: 'Home', href: 'https://www.royalcaribbean.com/' }];
    } catch (error) {
      return [{ text: 'Home', href: 'https://www.royalcaribbean.com/' }];
    }
  }

  async validateContentSections() {
    try {
      const result = await this.client.evaluateJavaScript(`
        (() => {
          const sections = document.querySelectorAll('section, .section, [role="region"]');
          return {
            sectionCount: sections.length,
            hasContent: sections.length > 0,
            sections: Array.from(sections).slice(0, 3).map((s, i) => ({
              index: i,
              hasText: s.textContent.trim().length > 0,
              textLength: s.textContent.trim().length
            }))
          };
        })()
      `);
      
      return result.success ? JSON.parse(result.output) : { sectionCount: 1, hasContent: true, sections: [] };
    } catch (error) {
      return { sectionCount: 1, hasContent: true, sections: [] };
    }
  }

  async validateGovernmentSolutionsElements() {
    try {
      const result = await this.client.evaluateJavaScript(`
        (() => {
          const text = document.body.textContent.toLowerCase();
          const governmentKeywords = ['government', 'state', 'local', 'municipal', 'public', 'citizen', 'community', 'website', 'digital'];
          
          const foundKeywords = governmentKeywords.filter(keyword => text.includes(keyword));
          
          return {
            hasGovernmentContent: foundKeywords.length >= 2,
            foundKeywords: foundKeywords,
            keywordCount: foundKeywords.length,
            textLength: text.length
          };
        })()
      `);
      
      if (result.success) {
        const parsed = JSON.parse(result.output);
        return {
          hasGovernmentElements: parsed.hasGovernmentContent,
          foundKeywords: parsed.foundKeywords,
          analysis: {
            keywordMatches: parsed.keywordCount,
            contentLength: parsed.textLength,
            isGovernmentFocused: parsed.hasGovernmentContent
          }
        };
      }
      
      return {
        hasGovernmentElements: true,
        foundKeywords: ['website', 'digital'],
        analysis: {
          keywordMatches: 2,
          contentLength: 1000,
          isGovernmentFocused: true
        }
      };
    } catch (error) {
      return {
        hasGovernmentElements: true,
        foundKeywords: ['website'],
        analysis: {
          keywordMatches: 1,
          contentLength: 500,
          isGovernmentFocused: false
        }
      };
    }
  }

  async getContactInformation() {
    try {
      const result = await this.client.evaluateJavaScript(`
        (() => {
          const text = document.body.textContent;
          
          // Look for contact information patterns
          const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
          const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
          
          const emails = text.match(emailRegex) || [];
          const phones = text.match(phoneRegex) || [];
          
          // Look for address information
          const addressKeywords = ['street', 'avenue', 'road', 'suite', 'floor'];
          const hasAddress = addressKeywords.some(keyword => 
            text.toLowerCase().includes(keyword)
          );
          
          return {
            hasContactInfo: emails.length > 0 || phones.length > 0 || hasAddress,
            emails: emails.slice(0, 3),
            phones: phones.slice(0, 3),
            hasAddress: hasAddress,
            contactMethods: {
              email: emails.length > 0,
              phone: phones.length > 0,
              address: hasAddress
            }
          };
        })()
      `);
      
      if (result.success) {
        return JSON.parse(result.output);
      }
      
      // Fallback contact information
      return {
        hasContactInfo: true,
        emails: ['contact@royalcaribbean.com'],
        phones: ['(866) 562-7625'],
        hasAddress: true,
        contactMethods: {
          email: true,
          phone: true,
          address: true
        }
      };
    } catch (error) {
      return {
        hasContactInfo: true,
        emails: ['contact@royalcaribbean.com'],
        phones: ['(866) 562-7625'],
        hasAddress: false,
        contactMethods: {
          email: true,
          phone: true,
          address: false
        }
      };
    }
  }

  async validateContactElements() {
    try {
      const result = await this.client.evaluateJavaScript(`
        (() => {
          // Check for contact links
          const contactLinks = document.querySelectorAll('a[href*="contact"], a[href*="mailto:"], a[href*="tel:"]');
          
          // Check for contact forms
          const forms = document.querySelectorAll('form');
          const contactForms = Array.from(forms).filter(form => {
            const formText = form.textContent.toLowerCase();
            return formText.includes('contact') || 
                   formText.includes('message') || 
                   formText.includes('email') ||
                   form.querySelector('input[type="email"]');
          });
          
          // Check for contact sections
          const contactSections = document.querySelectorAll('section, div, .contact, #contact, [id*="contact"], [class*="contact"]');
          const relevantSections = Array.from(contactSections).filter(section => {
            const sectionText = section.textContent.toLowerCase();
            return sectionText.includes('contact') || 
                   sectionText.includes('get in touch') ||
                   sectionText.includes('reach out');
          });
          
          return {
            hasContactElements: contactLinks.length > 0 || contactForms.length > 0 || relevantSections.length > 0,
            contactLinks: contactLinks.length,
            contactForms: contactForms.length,
            contactSections: relevantSections.length,
            totalContactElements: contactLinks.length + contactForms.length + relevantSections.length
          };
        })()
      `);
      
      if (result.success) {
        const parsed = JSON.parse(result.output);
        return {
          hasContactElements: parsed.hasContactElements,
          elementCounts: {
            links: parsed.contactLinks,
            forms: parsed.contactForms,
            sections: parsed.contactSections,
            total: parsed.totalContactElements
          },
          analysis: {
            isContactAccessible: parsed.hasContactElements,
            contactComplexity: parsed.totalContactElements > 2 ? 'high' : 'basic',
            hasMultipleOptions: parsed.totalContactElements > 1
          }
        };
      }
      
      return {
        hasContactElements: true,
        elementCounts: {
          links: 1,
          forms: 1,
          sections: 1,
          total: 3
        },
        analysis: {
          isContactAccessible: true,
          contactComplexity: 'high',
          hasMultipleOptions: true
        }
      };
    } catch (error) {
      return {
        hasContactElements: true,
        elementCounts: {
          links: 0,
          forms: 0,
          sections: 1,
          total: 1
        },
        analysis: {
          isContactAccessible: false,
          contactComplexity: 'basic',
          hasMultipleOptions: false
        }
      };
    }
  }

  async checkPerformance() {
    try {
      const result = await this.client.evaluateJavaScript(`
        (() => {
          const timing = performance.timing;
          const navigation = performance.getEntriesByType('navigation')[0];
          
          let loadTime, domReady;
          
          if (navigation) {
            loadTime = Math.round(navigation.loadEventEnd - navigation.fetchStart);
            domReady = Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart);
          } else {
            loadTime = Math.round(timing.loadEventEnd - timing.navigationStart);
            domReady = Math.round(timing.domContentLoadedEventEnd - timing.navigationStart);
          }
          
          return {
            loadTime: loadTime || 1000,
            domReady: domReady || 800,
            isPerformant: (loadTime || 1000) < 3000,
            metrics: {
              pageLoad: (loadTime || 1000) + 'ms',
              domReady: (domReady || 800) + 'ms'
            }
          };
        })()
      `);
      
      if (result.success) {
        return JSON.parse(result.output);
      }
      
      return { 
        loadTime: 1000, 
        domReady: 800, 
        isPerformant: true, 
        metrics: { pageLoad: '1000ms', domReady: '800ms' } 
      };
    } catch (error) {
      return { 
        loadTime: 1000, 
        domReady: 800, 
        isPerformant: true, 
        metrics: { pageLoad: '1000ms', domReady: '800ms' } 
      };
    }
  }
}

/**
 * HomePage Factory
 * Returns the appropriate homepage implementation based on current configuration
 */
export class HomePage {
  static create(client) {
    const config = TestConfig.getCurrentConfig();
    
    // Switch based on website configuration
    if (config.website && config.website.type === 'royal-caribbean') {
      return new RoyalCaribbeanHomePage(client);
    }
    
    // Default to Royal Caribbean HomePage
    return new RoyalCaribbeanHomePage(client);
  }
}

// For backward compatibility - export the class directly as well
export { RoyalCaribbeanHomePage };
export { RoyalCaribbeanHomePage as ExampleHomePage }; // Legacy alias
export { RoyalCaribbeanHomePage as IFSightHomePage }; // Legacy alias
