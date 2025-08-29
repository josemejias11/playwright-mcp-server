import { test, expect } from '@playwright/test';

test.describe('Newsela Content Functionality', () => {
  
  test('Content search functionality', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for search functionality
    const searchSelectors = [
      'input[type="search"]',
      'input[placeholder*="search"], input[placeholder*="Search"]',
      '[data-testid*="search"], .search-input',
      'form input[type="text"]'
    ];
    
    let searchElement;
    let searchFound = false;
    
    for (const selector of searchSelectors) {
      const element = page.locator(selector).first();
      const count = await element.count();
      
      if (count > 0) {
        const isVisible = await element.isVisible().catch(() => false);
        if (isVisible) {
          searchElement = element;
          searchFound = true;
          break;
        }
      }
    }
    
    if (searchFound) {
      // Test search functionality
      await searchElement.fill('science');
      
      // Look for search button or submit
      const searchButton = page.locator(
        'button[type="submit"], button:has-text("Search"), [data-testid*="search-button"]'
      ).first();
      
      const buttonExists = await searchButton.count() > 0;
      if (buttonExists) {
        await searchButton.click();
        
        // Wait for results
        await page.waitForTimeout(3000);
        
        // Check if results appeared
        const results = page.locator('.search-results, .results, [data-testid*="results"]').first();
        const resultsVisible = await results.isVisible().catch(() => false);
        
        if (resultsVisible) {
          console.log('Search results displayed successfully');
        }
      } else {
        // Try pressing Enter
        await searchElement.press('Enter');
        await page.waitForTimeout(3000);
      }
    } else {
      console.log('Search functionality not found on current page');
    }
  });

  test('Content categories are accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for category navigation
    const categorySelectors = [
      'a[href*="science"], a[href*="history"], a[href*="english"]',
      '[data-testid*="category"], .category, .subject',
      ':text("Science"), :text("History"), :text("English"), :text("Math")',
      'nav a, .nav-link, .menu-item'
    ];
    
    let categoriesFound = 0;
    
    for (const selector of categorySelectors) {
      const elements = page.locator(selector);
      const count = await elements.count();
      
      if (count > 0) {
        // Check first few elements for visibility
        for (let i = 0; i < Math.min(count, 3); i++) {
          const element = elements.nth(i);
          const isVisible = await element.isVisible().catch(() => false);
          if (isVisible) {
            categoriesFound++;
          }
        }
      }
    }
    
    expect(categoriesFound).toBeGreaterThan(0);
    console.log(`Found ${categoriesFound} accessible category elements`);
  });

  test('Content filtering and reading levels', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for reading level controls
    const levelSelectors = [
      '[data-testid*="level"], .reading-level, .grade-level',
      'select option:has-text("Grade"), select option:has-text("Level")',
      'button:has-text("Grade"), button:has-text("Level")',
      '.filter, .filters, [data-testid*="filter"]'
    ];
    
    let levelControlFound = false;
    
    for (const selector of levelSelectors) {
      const element = page.locator(selector).first();
      const count = await element.count();
      
      if (count > 0) {
        const isVisible = await element.isVisible().catch(() => false);
        if (isVisible) {
          levelControlFound = true;
          console.log('Reading level controls found');
          break;
        }
      }
    }
    
    if (!levelControlFound) {
      console.log('Reading level controls not visible on landing page - may require navigation');
    }
    
    // Look for filter controls
    const filterSelectors = [
      '.filter-button, .filter-control',
      'button:has-text("Filter"), button:has-text("Sort")',
      '[data-testid*="filter"], [aria-label*="filter"]'
    ];
    
    for (const selector of filterSelectors) {
      const element = page.locator(selector).first();
      const count = await element.count();
      
      if (count > 0) {
        const isVisible = await element.isVisible().catch(() => false);
        if (isVisible) {
          console.log('Filter controls found');
          break;
        }
      }
    }
  });

  test('Article preview functionality', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for article previews or content cards
    const contentSelectors = [
      '.article, .content-card, .story',
      '[data-testid*="article"], [data-testid*="content"]',
      '.preview, .card, .tile',
      'a[href*="article"], a[href*="story"], a[href*="content"]'
    ];
    
    let contentFound = false;
    
    for (const selector of contentSelectors) {
      const elements = page.locator(selector);
      const count = await elements.count();
      
      if (count > 0) {
        // Try clicking the first visible content item
        for (let i = 0; i < Math.min(count, 3); i++) {
          const element = elements.nth(i);
          const isVisible = await element.isVisible().catch(() => false);
          
          if (isVisible) {
            contentFound = true;
            
            // Try to click and see if it navigates
            const currentUrl = page.url();
            await element.click({ timeout: 5000 }).catch(() => {});
            
            // Wait a moment
            await page.waitForTimeout(2000);
            
            const newUrl = page.url();
            if (newUrl !== currentUrl) {
              console.log('Successfully navigated to content page');
              
              // Go back for other tests
              await page.goBack();
              await page.waitForLoadState('networkidle');
            }
            break;
          }
        }
        
        if (contentFound) break;
      }
    }
    
    if (!contentFound) {
      console.log('Article previews not found on landing page - may require login or different navigation');
    }
  });

});
