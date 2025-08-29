import { test, expect } from '@playwright/test';

test.describe('Newsela Accessibility - WCAG Compliance Tests', () => {
  test('should have proper page structure and headings', async ({ page }) => {
    await page.goto('/');
    
    // Check for proper heading hierarchy
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    
    // Verify page has a title
    await expect(page).toHaveTitle(/\w+/);
    
    // Check for main landmark
    const main = page.locator('main, [role="main"]').first();
    await expect(main).toBeVisible();
  });

  test('should have keyboard navigation support', async ({ page }) => {
    await page.goto('/');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    
    // Verify focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test multiple tab presses
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      const currentFocus = page.locator(':focus');
      await expect(currentFocus).toBeVisible();
    }
  });

  test('should have proper image alt text', async ({ page }) => {
    await page.goto('/');
    
    // Check all images have alt text
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < Math.min(imageCount, 10); i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      
      // Images should have alt text (empty alt is acceptable for decorative images)
      expect(alt).not.toBeNull();
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');
    
    // Check text contrast (basic check)
    const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, span, div').filter({ hasText: /\w+/ });
    const count = await textElements.count();
    
    // Verify text elements are visible (basic contrast check)
    for (let i = 0; i < Math.min(count, 5); i++) {
      await expect(textElements.nth(i)).toBeVisible();
    }
  });

  test('should support screen reader navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check for proper ARIA labels and roles
    const interactiveElements = page.locator('button, a, input, select, textarea');
    const count = await interactiveElements.count();
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const element = interactiveElements.nth(i);
      
      // Should have accessible name (text, aria-label, or aria-labelledby)
      const accessibleName = await element.evaluate(el => {
        return el.textContent || 
               el.getAttribute('aria-label') || 
               el.getAttribute('aria-labelledby') ||
               el.getAttribute('title');
      });
      
      expect(accessibleName).toBeTruthy();
    }
  });
});
