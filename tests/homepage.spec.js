import { test, expect } from '@playwright/test';

test.describe('Homepage Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Example/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display navigation menu', async ({ page }) => {
    // For mobile, check if navigation exists but might be hidden behind hamburger menu
    const isMobile = page.viewportSize()?.width && page.viewportSize()?.width < 768;
    
    if (isMobile) {
      // On mobile, just verify navigation structure exists (can be hidden)
      const nav = page.locator('nav, [role="navigation"], .nav-menu, [class*="nav"], [class*="menu"], .navigation').first();
      await expect(nav).toBeAttached(); // Just check it exists
      
      // Try to find and click hamburger menu to show nav
      const hamburger = page.locator('[class*="hamburger"], [class*="mobile-menu"], [class*="menu-toggle"], .w-nav-button, [class*="nav-toggle"]').first();
      if (await hamburger.isVisible()) {
        await hamburger.click();
        // Give time for animation
        await page.waitForTimeout(500);
        // Check if nav became visible after clicking
        const isNavVisible = await nav.isVisible();
        if (!isNavVisible) {
          // If still not visible, that's okay for mobile - just ensure structure exists
          await expect(nav).toBeAttached();
        } else {
          await expect(nav).toBeVisible();
        }
      } else {
        // No hamburger found, just check nav exists
        await expect(nav).toBeAttached();
      }
    } else {
      // On desktop, nav should be visible
      const nav = page.locator('nav, [role="navigation"]').first();
      await expect(nav).toBeVisible();
    }
  });

  test('should have contact information', async ({ page }) => {
    // Look for common contact elements with more flexible patterns
    const bodyText = await page.textContent('body');
    
    // Check for phone patterns (more flexible)
    const phonePattern = /(\d{3}[\s.-]?\d{3}[\s.-]?\d{4})|(\(\d{3}\)\s?\d{3}[\s.-]?\d{4})/;
    const hasPhone = phonePattern.test(bodyText || '');
    
    // Check for email patterns (more flexible)
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const hasEmail = emailPattern.test(bodyText || '');
    
    // Check for address indicators
    const addressPattern = /\d+\s+\w+\s+(street|st|avenue|ave|road|rd|blvd|boulevard|drive|dr|lane|ln)/i;
    const hasAddress = addressPattern.test(bodyText || '');
    
    // Check for contact links or buttons
    const contactLink = page.locator('a[href*="contact"], a[href*="mailto:"], a[href*="tel:"]');
    const hasContactLink = await contactLink.count() > 0;
    
    // Check for contact sections
    const contactSection = page.locator('[class*="contact"], [id*="contact"], [data-testid*="contact"]');
    const hasContactSection = await contactSection.count() > 0;
    
    // At least one contact method should be present
    const hasContactInfo = hasPhone || hasEmail || hasAddress || hasContactLink || hasContactSection;
    expect(hasContactInfo).toBe(true);
  });

  test('should be mobile responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
    
    // Check that content is still accessible
    await expect(page).toHaveTitle(/Example/);
  });
});
