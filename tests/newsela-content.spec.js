import { test, expect } from '@playwright/test';

test.describe('Newsela Educational Content - Interactive Tests', () => {
  test('should browse and read educational articles', async ({ page }) => {
    await page.goto('/');
    
    // Find content browsing
    await page.getByRole('link', { name: /browse|explore|articles/i }).first().click();
    
    // Select a subject
    const elaLink = page.getByRole('link', { name: /ELA|English|Language Arts/i }).first();
    if (await elaLink.isVisible()) {
      await elaLink.click();
      
      // Select an article
      const article = page.getByRole('link').filter({ hasText: /read|article/i }).first();
      if (await article.isVisible()) {
        await article.click();
        
        // Verify article content
        await expect(page.getByText(/paragraph|sentence/i)).toBeVisible();
        
        // Check for reading level options
        await expect(page.getByText(/level|lexile/i)).toBeVisible();
      }
    }
  });

  test('should interact with quiz features', async ({ page }) => {
    await page.goto('/');
    
    // Look for quiz or assessment features
    await page.getByRole('link', { name: /quiz|test|assessment/i }).first().click();
    
    // Try to start a quiz
    const startQuiz = page.getByRole('button', { name: /start|begin|take/i }).first();
    if (await startQuiz.isVisible()) {
      await startQuiz.click();
      
      // Verify quiz interface
      await expect(page.getByText(/question|answer|choice/i)).toBeVisible();
    }
  });

  test('should test reading level adjustment', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to an article
    await page.getByRole('link', { name: /browse|articles/i }).first().click();
    
    // Find an article
    const articleLink = page.getByRole('link').filter({ hasText: /article|story/i }).first();
    if (await articleLink.isVisible()) {
      await articleLink.click();
      
      // Look for reading level controls
      const levelControl = page.getByRole('button', { name: /level|lexile/i }).first();
      if (await levelControl.isVisible()) {
        await levelControl.click();
        
        // Select different level
        const higherLevel = page.getByText(/higher|advanced/i).first();
        if (await higherLevel.isVisible()) {
          await higherLevel.click();
          
          // Verify content changes
          await page.waitForLoadState('networkidle');
          await expect(page.getByText(/article|content/i)).toBeVisible();
        }
      }
    }
  });

  test('should explore subject-specific content', async ({ page }) => {
    await page.goto('/');
    
    const subjects = ['Science', 'Social Studies', 'ELA'];
    
    for (const subject of subjects) {
      // Navigate to subject
      const subjectLink = page.getByRole('link', { name: new RegExp(subject, 'i') }).first();
      if (await subjectLink.isVisible()) {
        await subjectLink.click();
        
        // Verify subject content
        await expect(page.getByText(new RegExp(subject, 'i'))).toBeVisible();
        
        // Go back to home for next subject
        await page.goto('/');
      }
    }
  });
});
