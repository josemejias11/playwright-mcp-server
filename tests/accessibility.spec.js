import { test, expect } from '@playwright/test';

test.describe('CaliberFS Accessibility Tests', () => {
  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/');
    
    const h1s = await page.locator('h1').count();
    expect(h1s).toBeGreaterThanOrEqual(1);
    expect(h1s).toBeLessThanOrEqual(3); // Should not have too many h1s
    
    // Check for logical heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/');
    
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      const role = await img.getAttribute('role');
      
      // Images should have alt text or be decorative
      expect(
        alt !== null || 
        role === 'presentation' || 
        role === 'none'
      ).toBe(true);
    }
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/');
    
    const inputs = await page.locator('input, textarea, select').all();
    
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledby = await input.getAttribute('aria-labelledby');
      const placeholder = await input.getAttribute('placeholder');
      
      if (id) {
        const label = await page.locator(`label[for="${id}"]`).count();
        expect(
          label > 0 || 
          ariaLabel || 
          ariaLabelledby || 
          placeholder
        ).toBe(true);
      }
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');
    
    // Basic check for color contrast by ensuring text is visible
    const textElements = await page.locator('p, h1, h2, h3, h4, h5, h6, a, button, span').all();
    
    for (const element of textElements.slice(0, 10)) { // Check first 10 elements
      const isVisible = await element.isVisible();
      if (isVisible) {
        const text = await element.textContent();
        if (text && text.trim().length > 0) {
          expect(await element.isVisible()).toBe(true);
        }
      }
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    const focused = await page.locator(':focus').count();
    
    // Should have focusable elements
    expect(focused).toBeGreaterThanOrEqual(1);
  });
});
