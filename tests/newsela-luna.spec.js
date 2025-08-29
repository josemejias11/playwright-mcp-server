import { test, expect } from '@playwright/test';

test.describe('Newsela Luna AI Assistant - Functional Tests', () => {
  test('should interact with Luna AI features', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to Luna
    await page.getByRole('link', { name: /luna/i }).click();
    
    // Look for AI interaction elements
    const chatInput = page.getByRole('textbox', { name: /message|chat|ask/i });
    const aiButton = page.getByRole('button', { name: /ask|send|chat/i });
    
    if (await chatInput.isVisible()) {
      await chatInput.fill('How can Luna help teachers?');
      if (await aiButton.isVisible()) {
        await aiButton.click();
        
        // Wait for AI response
        await expect(page.getByText(/help|assist|teach/i)).toBeVisible({ timeout: 10000 });
      }
    }
  });

  test('should explore lesson planning with Luna', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to Luna or lesson planning
    await page.getByRole('link', { name: /luna|lesson|plan/i }).first().click();
    
    // Look for lesson planning features
    await expect(page.getByText(/lesson|plan|curriculum/i)).toBeVisible();
    
    // Try to interact with planning tools
    const planButton = page.getByRole('button', { name: /create|plan|start/i }).first();
    if (await planButton.isVisible()) {
      await planButton.click();
      await expect(page.getByText(/grade|subject|standard/i)).toBeVisible();
    }
  });

  test('should check differentiation features', async ({ page }) => {
    await page.goto('/');
    
    // Look for differentiation options
    await page.getByRole('link', { name: /differentiat|level|adapt/i }).first().click();
    
    // Verify differentiation content
    await expect(page.getByText(/reading level|lexile|adapt/i)).toBeVisible();
  });
});
