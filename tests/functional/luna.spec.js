import { test, expect } from '@playwright/test';

test.describe('Newsela Luna AI Assistant', () => {
  
  test('Luna AI content is prominently featured', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('domcontentloaded');
    
    // Check for Luna announcement banner
    await expect(page.locator('text=Luna, your new AI-powered teaching assistant')).toBeVisible();
    
    // Check for main Luna heading
    await expect(page.locator('heading:has-text("Introducing Luna!")')).toBeVisible();
    
    // Check for Luna description
    await expect(page.locator('text=Save time and drive student outcomes with your new AI-powered teaching assistant')).toBeVisible();
    
    // Check for Luna action buttons
    await expect(page.locator('link:has-text("Discover Luna")')).toBeVisible();
    await expect(page.locator('link:has-text("Read Luna\'s story")')).toBeVisible();
  });

  test('Luna page navigation works', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Click on "Discover Luna" link
    await page.locator('link:has-text("Discover Luna")').click();
    
    // Verify we navigated to Luna page
    await expect(page).toHaveURL(/.*luna.*/);
    
    // Go back to verify banner link
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    
    // Click on the banner announcement link
    await page.locator('link:has-text("Luna, your new AI-powered teaching assistant")').click();
    
    // Should also navigate to Luna page
    await expect(page).toHaveURL(/.*luna.*/);
  });

  test('Luna marketing content is accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Check that Luna content has proper heading structure
    const lunaHeading = page.locator('heading:has-text("Introducing Luna!")');
    await expect(lunaHeading).toBeVisible();
    
    // Verify it's an h1 heading
    await expect(page.locator('h1:has-text("Introducing Luna!")')).toBeVisible();
    
    // Check for descriptive text about Luna's capabilities
    await expect(page.locator('text=lesson planning, activity design, graphic organizer creation')).toBeVisible();
    
    // Verify the links have proper accessible text
    const discoverLink = page.locator('link:has-text("Discover Luna")');
    await expect(discoverLink).toBeVisible();
    await expect(discoverLink).toHaveAttribute('href', '/luna');
    
    const storyLink = page.locator('link:has-text("Read Luna\'s story")');
    await expect(storyLink).toBeVisible();
    await expect(storyLink).toHaveAttribute('href', /.*blog.*luna.*ai/);
  });

});
