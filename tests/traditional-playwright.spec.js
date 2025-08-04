import { test, expect } from '@playwright/test';

/**
 * Traditional Playwright Tests
 * Demonstrates basic Playwright testing patterns
 */

test.describe('Traditional Playwright Tests', () => {
  
  test('Basic website validation', async ({ page }) => {
    // Navigate to homepage
    await page.goto('https://applaudo.com/en/');
    
    // Check page title
    await expect(page).toHaveTitle(/Applaudo/i);
    
    // Check page loads successfully
    await expect(page.locator('body')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'e2e/artifacts/playwright-homepage.png',
      fullPage: true 
    });
  });

  test('Contact information check', async ({ page }) => {
    await page.goto('https://applaudo.com/en/');
    
    // Check for contact elements with more flexible patterns
    const bodyText = await page.locator('body').textContent();
    
    // Look for phone number pattern (more flexible)
    const phonePattern = /(\d{3}[\s.-]?\d{3}[\s.-]?\d{4})|(\(\d{3}\)\s?\d{3}[\s.-]?\d{4})/;
    const hasPhone = phonePattern.test(bodyText ?? '');
    
    // Look for email pattern (more flexible)
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const hasEmail = emailPattern.test(bodyText ?? '');
    
    // Check for contact links
    const contactLinks = await page.locator('a[href*="contact"], a[href*="mailto:"], a[href*="tel:"]').count();
    const hasContactLinks = contactLinks > 0;
    
    // At least one contact method should be present
    const hasContactInfo = hasPhone || hasEmail || hasContactLinks;
    expect(hasContactInfo).toBe(true);
  });

  test('Navigation links check', async ({ page }) => {
    await page.goto('https://applaudo.com/en/');
    
    // Count navigation links
    const links = await page.locator('a[href]').count();
    expect(links).toBeGreaterThan(0);
    
    // Check for valid links (not javascript:)
    const validLinks = await page.locator('a[href]:not([href^="javascript:"])').count();
    expect(validLinks).toBeGreaterThan(0);
  });
});
