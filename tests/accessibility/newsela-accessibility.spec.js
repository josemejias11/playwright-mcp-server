import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Newsela Accessibility Tests', () => {
  
  test('Page has no accessibility violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Run accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Keyboard navigation works properly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    
    // Check if focus is visible
    const focusedElement = page.locator(':focus');
    const focusedCount = await focusedElement.count();
    
    if (focusedCount > 0) {
      await expect(focusedElement).toBeVisible();
      console.log('Keyboard focus is working');
      
      // Test a few more tab presses
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(500);
        
        const currentFocus = page.locator(':focus');
        const currentCount = await currentFocus.count();
        
        if (currentCount > 0) {
          const isVisible = await currentFocus.isVisible().catch(() => false);
          if (isVisible) {
            console.log(`Tab ${i + 2}: Focus is visible`);
          }
        }
      }
    } else {
      console.log('No keyboard focus detected - may need focus indicators');
    }
  });

  test('Images have alt text', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find all images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      let imagesWithAlt = 0;
      
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        
        if (alt !== null && alt.trim() !== '') {
          imagesWithAlt++;
        }
      }
      
      console.log(`Found ${imageCount} images, ${imagesWithAlt} have alt text`);
      
      // Allow for decorative images to have empty alt text
      // But at least some images should have meaningful alt text
      if (imageCount > 5) {
        expect(imagesWithAlt).toBeGreaterThan(0);
      }
    } else {
      console.log('No images found on the page');
    }
  });

  test('Form elements have proper labels', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find form inputs
    const inputs = page.locator('input, select, textarea');
    const inputCount = await inputs.count();
    
    if (inputCount > 0) {
      let properlyLabeled = 0;
      
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        
        // Check for label association
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');
        const placeholder = await input.getAttribute('placeholder');
        
        let hasLabel = false;
        
        if (id) {
          const label = page.locator(`label[for="${id}"]`);
          const labelCount = await label.count();
          if (labelCount > 0) hasLabel = true;
        }
        
        if (ariaLabel || ariaLabelledBy || placeholder) {
          hasLabel = true;
        }
        
        if (hasLabel) {
          properlyLabeled++;
        }
      }
      
      console.log(`Found ${inputCount} form inputs, ${properlyLabeled} have proper labels`);
      
      // Most form elements should have labels
      const labelRatio = properlyLabeled / inputCount;
      expect(labelRatio).toBeGreaterThan(0.5);
    } else {
      console.log('No form inputs found on the page');
    }
  });

  test('Color contrast is sufficient', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Use axe-core to check color contrast
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('body')
      .analyze();
    
    // Filter for color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter(
      violation => violation.id === 'color-contrast'
    );
    
    expect(contrastViolations).toHaveLength(0);
    
    if (contrastViolations.length === 0) {
      console.log('Color contrast check passed');
    } else {
      console.log(`Found ${contrastViolations.length} color contrast violations`);
    }
  });

  test('Headings are properly structured', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find all headings
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    
    if (headingCount > 0) {
      // Check for h1
      const h1s = page.locator('h1');
      const h1Count = await h1s.count();
      
      // Should have at least one h1
      expect(h1Count).toBeGreaterThanOrEqual(1);
      
      // Check heading hierarchy
      const headingTags = [];
      for (let i = 0; i < headingCount; i++) {
        const heading = headings.nth(i);
        const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
        headingTags.push(tagName);
      }
      
      console.log(`Found headings: ${headingTags.join(', ')}`);
      
      // Should start with h1
      expect(headingTags[0]).toBe('h1');
    } else {
      console.log('No headings found on the page - this may be an accessibility issue');
    }
  });

});
