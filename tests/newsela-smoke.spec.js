import { test, expect } from '@playwright/test';

test.describe('Newsela Educational Platform - Smoke Tests', () => {
  test('should load homepage and verify educational content', async ({ page }) => {
    await page.goto('/');
    
    // Verify page loads
    await expect(page).toHaveTitle(/Newsela/);
    
    // Check for Luna AI assistant mention
    await expect(page.getByText('Luna', { exact: false })).toBeVisible();
    
    // Verify educational subjects are present
    const subjects = ['ELA', 'Social Studies', 'Science'];
    for (const subject of subjects) {
      await expect(page.getByText(subject, { exact: false })).toBeVisible();
    }
  });

  test('should navigate to Luna AI assistant page', async ({ page }) => {
    await page.goto('/');
    
    // Find and click Luna link
    const lunaLink = page.getByRole('link', { name: /luna/i });
    await expect(lunaLink).toBeVisible();
    await lunaLink.click();
    
    // Verify Luna page loads
    await expect(page.getByText('Luna', { exact: false })).toBeVisible();
    await expect(page.getByText('AI', { exact: false })).toBeVisible();
  });

  test('should access teacher sign up flow', async ({ page }) => {
    await page.goto('/');
    
    // Find teacher sign up
    const signUpLink = page.getByRole('link', { name: /sign up/i });
    await expect(signUpLink).toBeVisible();
    await signUpLink.click();
    
    // Verify sign up page or modal
    await expect(page.getByText('teacher', { exact: false })).toBeVisible();
  });

  test('should browse educational content', async ({ page }) => {
    await page.goto('/');
    
    // Look for content browsing options
    const browseLink = page.getByRole('link', { name: /browse|explore|content/i }).first();
    if (await browseLink.isVisible()) {
      await browseLink.click();
      
      // Verify content page loads
      await expect(page.getByText(/article|content|story/i)).toBeVisible();
    }
  });

  test('should check for formative assessment tools', async ({ page }) => {
    await page.goto('/');
    
    // Look for formative assessment mention
    await expect(page.getByText(/formative|assessment|quiz/i)).toBeVisible();
  });
});
