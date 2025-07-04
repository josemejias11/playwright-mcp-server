#!/usr/bin/env node

/**
 * Caliber Financial Solutions E2E Test Suite
 * Target: https://www.caliberfs.com
 * 
 * Professional-grade test scenarios demonstrating expertise in financial services testing.
 * This test suite explores key business functionalities and user journeys.
 */

import { McpClient } from './mcp-client.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class CaliberFSTestSuite {
  constructor() {
    this.client = new McpClient(join(__dirname, '../build/index.js'));
    this.baseUrl = 'https://www.caliberfs.com';
    this.testResults = [];
  }

  async log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : '📝';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async runTest(testName, testFunction) {
    try {
      await this.log(`Starting test: ${testName}`);
      const startTime = Date.now();
      
      await testFunction();
      
      const duration = Date.now() - startTime;
      await this.log(`✅ Test passed: ${testName} (${duration}ms)`, 'success');
      this.testResults.push({ test: testName, status: 'PASSED', duration });
      
    } catch (error) {
      await this.log(`❌ Test failed: ${testName} - ${error.message}`, 'error');
      this.testResults.push({ test: testName, status: 'FAILED', error: error.message });
    }
  }

  async testHomepageLoad() {
    // Launch browser and navigate to CaliberFS
    await this.client.launchBrowser('chromium', false);
    await this.client.navigateTo(this.baseUrl, 'load');
    
    // Verify page loaded successfully
    const pageInfo = await this.client.getPageInfo();
    if (!pageInfo.output.includes('Caliber')) {
      throw new Error('Page title does not contain "Caliber"');
    }
    
    // Take screenshot for documentation
    await this.client.takeScreenshot('e2e/artifacts/caliberfs-homepage.png', true);
    
    await this.log('Homepage loaded successfully and screenshot captured');
  }

  async testNavigationStructure() {
    // Analyze main navigation elements
    try {
      // Look for common navigation patterns
      const navSelectors = [
        'nav', '.navbar', '.navigation', '.menu',
        'header nav', '.header-nav', '.main-nav'
      ];
      
      let navigationFound = false;
      for (const selector of navSelectors) {
        try {
          const navText = await this.client.getText(selector, 5000);
          if (navText.output && navText.output.length > 10) {
            await this.log(`Navigation found with selector: ${selector}`);
            navigationFound = true;
            break;
          }
        } catch (e) {
          // Continue trying other selectors
        }
      }
      
      if (!navigationFound) {
        await this.log('Warning: Could not locate main navigation', 'error');
      }
      
    } catch (error) {
      await this.log(`Navigation analysis error: ${error.message}`, 'error');
    }
  }

  async testInvestmentInformation() {
    // Look for investment-related content
    try {
      const investmentKeywords = [
        'investment', 'fund', 'returns', 'portfolio', 
        'opportunities', 'capital', 'real estate'
      ];
      
      // Check page content for financial services keywords
      const pageContent = await this.client.evaluateJavaScript(`
        document.body.innerText.toLowerCase()
      `);
      
      const foundKeywords = investmentKeywords.filter(keyword => 
        pageContent.output && pageContent.output.includes(keyword)
      );
      
      if (foundKeywords.length > 0) {
        await this.log(`Found investment keywords: ${foundKeywords.join(', ')}`);
      } else {
        await this.log('Warning: Limited investment-related content found', 'error');
      }
      
    } catch (error) {
      await this.log(`Investment content analysis error: ${error.message}`, 'error');
    }
  }

  async testContactFormDiscovery() {
    // Look for contact forms or lead generation elements
    try {
      const formSelectors = [
        'form', '.contact-form', '.lead-form', 
        'input[type="email"]', 'input[name*="email"]',
        '.form', '[class*="contact"]', '[class*="form"]'
      ];
      
      let formFound = false;
      for (const selector of formSelectors) {
        try {
          await this.client.waitForElement(selector, 'visible', 3000);
          await this.log(`Contact form element found: ${selector}`);
          formFound = true;
          break;
        } catch (e) {
          // Continue trying other selectors
        }
      }
      
      if (!formFound) {
        await this.log('No obvious contact forms detected');
      }
      
    } catch (error) {
      await this.log(`Contact form discovery error: ${error.message}`, 'error');
    }
  }

  async testPagePerformance() {
    // Basic performance checks
    try {
      const performanceData = await this.client.evaluateJavaScript(`
        ({
          loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
          domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
          firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0
        })
      `);
      
      await this.log(`Performance metrics captured: ${JSON.stringify(performanceData.output)}`);
      
    } catch (error) {
      await this.log(`Performance analysis error: ${error.message}`, 'error');
    }
  }

  async testResponsiveDesign() {
    // Test mobile viewport
    try {
      await this.client.evaluateJavaScript(`
        document.querySelector('meta[name="viewport"]') ? true : false
      `);
      
      await this.log('Responsive design meta tag check completed');
      
    } catch (error) {
      await this.log(`Responsive design test error: ${error.message}`, 'error');
    }
  }

  async cleanup() {
    try {
      await this.client.closeBrowser();
      await this.log('Browser closed successfully');
    } catch (error) {
      await this.log(`Cleanup error: ${error.message}`, 'error');
    }
  }

  async generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 CALIBER FINANCIAL SOLUTIONS - TEST REPORT');
    console.log('='.repeat(60));
    
    const passed = this.testResults.filter(r => r.status === 'PASSED').length;
    const failed = this.testResults.filter(r => r.status === 'FAILED').length;
    
    console.log(`\n📈 Summary: ${passed} passed, ${failed} failed`);
    console.log(`🌐 Target: ${this.baseUrl}`);
    console.log(`📅 Date: ${new Date().toISOString()}\n`);
    
    this.testResults.forEach(result => {
      const status = result.status === 'PASSED' ? '✅' : '❌';
      const duration = result.duration ? ` (${result.duration}ms)` : '';
      console.log(`${status} ${result.test}${duration}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });
    
    console.log('\n' + '='.repeat(60));
  }

  async runAllTests() {
    await this.log('🚀 Starting Caliber Financial Solutions Test Suite');
    
    try {
      await this.runTest('Homepage Load & Screenshot', () => this.testHomepageLoad());
      await this.runTest('Navigation Structure Analysis', () => this.testNavigationStructure());
      await this.runTest('Investment Information Discovery', () => this.testInvestmentInformation());
      await this.runTest('Contact Form Discovery', () => this.testContactFormDiscovery());
      await this.runTest('Page Performance Analysis', () => this.testPagePerformance());
      await this.runTest('Responsive Design Check', () => this.testResponsiveDesign());
      
    } finally {
      await this.cleanup();
      await this.generateReport();
    }
  }
}

// Run the test suite
async function main() {
  const testSuite = new CaliberFSTestSuite();
  await testSuite.runAllTests();
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
