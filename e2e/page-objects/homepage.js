/**
 * CaliberFS Homepage Page Object Model
 * Encapsulates homepage elements and actions for maintainable testing
 */

export class CaliberFSHomePage {
  constructor(mcpClient) {
    this.client = mcpClient;
    this.url = 'https://www.caliberfs.com';
    
    // Selectors based on actual website analysis
    this.selectors = {
      // Navigation
      navigation: 'nav, .nav, .navbar',
      aboutLink: 'a[href="/about"], a[href*="about"]',
      servicesLink: 'a[href="/our-services"], a[href*="services"]',
      contactLink: 'a[href="/contact"], a[href*="contact"]',
      careersLink: 'a[href="/careers"], a[href*="careers"]',
      
      // Hero Section
      heroTitle: 'h1',
      heroSubtitle: 'h2, .hero-subtitle',
      discoverServicesBtn: 'a[href="/our-services"]:contains("discover"), .button:contains("discover")',
      aboutUsBtn: 'a[href="/about"]:contains("about"), .button:contains("about")',
      
      // Content Sections
      focusSection: 'h3:contains("focus"), .focus',
      promiseSection: 'h3:contains("promise"), .promise',
      missionSection: 'h3:contains("mission"), .mission',
      
      // Footer
      footer: 'footer, .footer',
      footerAddress: '.address, [class*="address"]',
      footerPhone: '[href*="tel"], .phone'
    };
  }

  /**
   * Navigate to homepage
   */
  async navigate() {
    await this.client.navigateTo(this.url, 'load');
    await this.waitForPageLoad();
  }

  /**
   * Wait for page to fully load
   */
  async waitForPageLoad() {
    await this.client.waitForElement(this.selectors.heroTitle, 'visible', 10000);
    
    // Verify page title
    const pageInfo = await this.client.getPageInfo();
    if (!pageInfo.output.includes('Caliber Financial Services')) {
      throw new Error('Homepage did not load correctly - title mismatch');
    }
  }

  /**
   * Get hero section text
   */
  async getHeroTitle() {
    const result = await this.client.getText(this.selectors.heroTitle);
    return result.output;
  }

  /**
   * Click discover services button
   */
  async clickDiscoverServices() {
    // Try multiple selectors for the discover services button
    const possibleSelectors = [
      'a[href="/our-services"]',
      '.button:contains("discover")',
      '.button.button-alt',
      'a:contains("discover our services")'
    ];
    
    for (const selector of possibleSelectors) {
      try {
        await this.client.waitForElement(selector, 'visible', 3000);
        await this.client.clickElement(selector);
        return true;
      } catch (error) {
        continue; // Try next selector
      }
    }
    
    throw new Error('Discover services button not found or not clickable');
  }

  /**
   * Click about us button
   */
  async clickAboutUs() {
    const possibleSelectors = [
      'a[href="/about"]',
      '.button:contains("about")',
      'a:contains("about us")'
    ];
    
    for (const selector of possibleSelectors) {
      try {
        await this.client.waitForElement(selector, 'visible', 3000);
        await this.client.clickElement(selector);
        return true;
      } catch (error) {
        continue;
      }
    }
    
    throw new Error('About us button not found or not clickable');
  }

  /**
   * Navigate using main navigation
   */
  async navigateToSection(section) {
    const sectionMap = {
      'about': this.selectors.aboutLink,
      'services': this.selectors.servicesLink,
      'contact': this.selectors.contactLink,
      'careers': this.selectors.careersLink
    };
    
    const selector = sectionMap[section.toLowerCase()];
    if (!selector) {
      throw new Error(`Unknown section: ${section}`);
    }
    
    await this.client.clickElement(selector);
  }

  /**
   * Validate key content sections
   */
  async validateContentSections() {
    const sections = {
      focus: 'our focus',
      promise: 'our promise',
      mission: 'Our Mission'
    };
    
    const results = {};
    
    for (const [key, expectedText] of Object.entries(sections)) {
      try {
        // Look for headings containing the expected text
        const found = await this.client.evaluateJavaScript(`
          (() => {
            const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4'));
            return headings.some(h => h.textContent.toLowerCase().includes('${expectedText.toLowerCase()}'));
          })()
        `);
        
        results[key] = found.output;
      } catch (error) {
        results[key] = false;
      }
    }
    
    return results;
  }

  /**
   * Check navigation links
   */
  async validateNavigation() {
    const navigationLinks = await this.client.evaluateJavaScript(`
      (() => {
        const links = Array.from(document.querySelectorAll('a[href]'));
        return links.map(link => ({
          text: link.textContent.trim(),
          href: link.href,
          visible: link.offsetParent !== null
        })).filter(link => link.text && link.visible);
      })()
    `);
    
    return navigationLinks.output;
  }

  /**
   * Validate page performance
   */
  async checkPerformance() {
    const performance = await this.client.evaluateJavaScript(`
      (() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          totalTime: navigation.loadEventEnd - navigation.fetchStart,
          networkTime: navigation.responseEnd - navigation.fetchStart
        };
      })()
    `);
    
    return performance.output;
  }

  /**
   * Check for required financial services elements
   */
  async validateFinancialServicesElements() {
    const elements = await this.client.evaluateJavaScript(`
      (() => {
        // Check for financial keywords in content
        const bodyText = document.body.textContent.toLowerCase();
        const financialKeywords = [
          'financial', 'investment', 'portfolio', 'fintech', 
          'services', 'solutions', 'compliance', 'analytics'
        ];
        
        const foundKeywords = financialKeywords.filter(keyword => 
          bodyText.includes(keyword)
        );
        
        // Check for professional trust indicators
        const hasAddress = bodyText.includes('tulsa') || bodyText.includes('oklahoma');
        const hasPhone = bodyText.includes('855') || bodyText.includes('phone');
        const hasSSL = location.protocol === 'https:';
        
        return {
          foundKeywords,
          trustIndicators: {
            hasAddress,
            hasPhone,
            hasSSL
          },
          professionalElements: {
            hasContactInfo: hasAddress && hasPhone,
            isSecure: hasSSL,
            hasFinancialContent: foundKeywords.length >= 3
          }
        };
      })()
    `);
    
    return elements.output;
  }

  /**
   * Take screenshot of homepage
   */
  async captureScreenshot(filename = 'homepage') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const path = `e2e/artifacts/${filename}-${timestamp}.png`;
    await this.client.takeScreenshot(path, true);
    return path;
  }
}
