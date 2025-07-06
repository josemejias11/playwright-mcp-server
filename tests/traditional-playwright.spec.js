import { test, expect } from '@playwright/test';

/**
 * Traditional Playwright Tests for CaliberFS
 * Demonstrates standard Playwright approach (no MCP)
 */

test.describe('CaliberFS Traditional Playwright Tests', () => {
  
  test('Basic website validation', async ({ page }) => {
    // Navigate to homepage
    await page.goto('https://www.caliberfs.com');
    
    // Check page title
    await expect(page).toHaveTitle(/Caliber/i);
    
    // Check page loads successfully
    await expect(page.locator('body')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'e2e/artifacts/playwright-homepage.png',
      fullPage: true 
    });
  });

  test('Contact information check', async ({ page }) => {
    await page.goto('https://www.caliberfs.com');
    
    // Check for contact elements
    const bodyText = await page.locator('body').textContent();
    
    // Look for phone number pattern
    const hasPhone = /\d{3}[\s.-]\d{3}[\s.-]\d{4}/.test(bodyText ?? '');
    expect(hasPhone).toBe(true);
    
    // Look for email pattern
    const hasEmail = /@\w+\.\w+/.test(bodyText ?? '');
    expect(hasEmail).toBe(true);
  });

  test('Navigation links check', async ({ page }) => {
    await page.goto('https://www.caliberfs.com');
    
    // Count navigation links
    const links = await page.locator('a[href]').count();
    expect(links).toBeGreaterThan(0);
    
    // Check for valid links (not javascript:)
    const validLinks = await page.locator('a[href]:not([href^="javascript:"])').count();
    expect(validLinks).toBeGreaterThan(0);
  });
});
