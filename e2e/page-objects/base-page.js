/**
 * Base Page Object for Flexible Website Testing
 * Provides common functionality and adaptable selector strategies
 */

import { TestConfig } from '../config/test-config.js';

export class BasePage {
  constructor(client) {
    this.client = client;
    this.config = TestConfig.website;
    this.baseUrl = TestConfig.baseUrl;
  }

  /**
   * Try multiple selectors until one works
   * @param {string[]} selectors - Array of CSS selectors to try
   * @param {number} timeout - Timeout for each selector attempt
   * @returns {Promise<Object>} Result with success status and element
   */
  async findElementBySelectors(selectors, timeout = 5000) {
    for (const selector of selectors) {
      try {
        const result = await this.client.waitForElement(selector, timeout / selectors.length);
        if (result.success) {
          return { success: true, selector, element: result.element };
        }
      } catch (e) {
        continue;
      }
    }
    return { success: false, selectors, error: 'No matching selectors found' };
  }

  /**
   * Get text using flexible selector strategy
   * @param {string[]} selectors - Array of selectors to try
   * @param {number} timeout - Total timeout
   * @returns {Promise<string>} Text content
   */
  async getTextBySelectors(selectors, timeout = 5000) {
    for (const selector of selectors) {
      try {
        const result = await this.client.getText(selector, timeout / selectors.length);
        if (result.success && result.output) {
          return result.output.trim();
        }
      } catch (e) {
        continue;
      }
    }
    return null;
  }

  /**
   * Click element using flexible selector strategy
   * @param {string[]} selectors - Array of selectors to try
   * @param {number} timeout - Total timeout
   * @returns {Promise<Object>} Click result
   */
  async clickBySelectors(selectors, timeout = 5000) {
    for (const selector of selectors) {
      try {
        const result = await this.client.click(selector, timeout / selectors.length);
        if (result.success) {
          return { success: true, selector, result };
        }
      } catch (e) {
        continue;
      }
    }
    return { success: false, selectors, error: 'No clickable elements found' };
  }

  /**
   * Navigate to the website
   * @param {string} path - Optional path to append to base URL
   */
  async navigate(path = '') {
    const url = path ? `${this.baseUrl}${path}` : this.baseUrl;
    return await this.client.navigateTo(url);
  }

  /**
   * Take a screenshot with website-specific naming
   * @param {string} name - Screenshot name
   * @param {boolean} fullPage - Take full page screenshot
   */
  async captureScreenshot(name, fullPage = true) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const websiteName = this.config.name.toLowerCase().replace(/\s+/g, '-');
    const filename = `reports/artifacts/screenshots/${websiteName}-${name}-${timestamp}.png`;
    return await this.client.takeScreenshot(filename, fullPage);
  }

  /**
   * Get page info with website context
   */
  async getPageInfo() {
    const info = await this.client.getPageInfo();
    return {
      ...info,
      website: this.config.name,
      type: this.config.type,
      features: this.config.features
    };
  }

  /**
   * Wait for page to be ready based on website type
   */
  async waitForPageReady() {
    // Wait for basic page load
    await this.client.waitForElement('body');
    
    // Website-specific ready checks
    if (this.config.type === 'cruise-booking') {
      // Wait for search form or main content to be ready
      const searchSelectors = this.config.selectors.booking?.searchForm || ['form'];
      await this.findElementBySelectors(searchSelectors, 10000);
    } else if (this.config.type === 'government-solutions') {
      // Wait for hero content
      const heroSelectors = this.config.selectors.hero?.title || ['h1'];
      await this.findElementBySelectors(heroSelectors, 10000);
    }
    
    // Wait a bit more for dynamic content
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  /**
   * Check if current page matches expected website
   */
  async validateWebsite() {
    const currentUrl = await this.client.getCurrentUrl();
    const expectedDomain = new URL(this.baseUrl).hostname;
    const currentDomain = new URL(currentUrl).hostname;
    
    return currentDomain.includes(expectedDomain.replace('www.', ''));
  }
}
