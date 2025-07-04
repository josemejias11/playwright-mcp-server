import { test, expect } from '@playwright/test';

test.describe('CaliberFS Homepage Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Caliber Financial/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display navigation menu', async ({ page }) => {
    const nav = page.locator('nav, [role="navigation"]').first();
    await expect(nav).toBeVisible();
  });

  test('should have contact information', async ({ page }) => {
    // Look for common contact elements
    const hasPhone = page.locator('text=/\\d{3}[-.\\s]?\\d{3}[-.\\s]?\\d{4}/').first();
    const hasEmail = page.locator('text=/@/').first();
    const hasAddress = page.locator('text=/\\d+.*street|avenue|road|blvd|drive/i').first();
    
    // At least one contact method should be present
    await expect(
      hasPhone.or(hasEmail).or(hasAddress)
    ).toBeVisible();
  });

  test('should be mobile responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
    
    // Check that content is still accessible
    await expect(page).toHaveTitle(/Caliber Financial/);
  });
});
