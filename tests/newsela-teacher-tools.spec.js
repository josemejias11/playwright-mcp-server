import { test, expect } from '@playwright/test';

test.describe('Newsela Teacher Tools - Functional Tests', () => {
  test('should access teacher dashboard features', async ({ page }) => {
    await page.goto('/');
    
    // Find teacher/educator link
    const teacherLink = page.getByRole('link', { name: /teacher|educator|classroom/i }).first();
    await teacherLink.click();
    
    // Verify teacher-specific content
    await expect(page.getByText(/classroom|student|assignment/i)).toBeVisible();
  });

  test('should explore assignment creation', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to teacher tools
    await page.getByRole('link', { name: /teacher|assign/i }).first().click();
    
    // Look for assignment creation
    const createButton = page.getByRole('button', { name: /create|assign|new/i }).first();
    if (await createButton.isVisible()) {
      await createButton.click();
      
      // Verify assignment interface
      await expect(page.getByText(/assignment|due date|student/i)).toBeVisible();
    }
  });

  test('should check student progress tracking', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to teacher tools
    await page.getByRole('link', { name: /teacher|classroom/i }).first().click();
    
    // Look for progress/analytics features
    const progressLink = page.getByRole('link', { name: /progress|analytics|report/i }).first();
    if (await progressLink.isVisible()) {
      await progressLink.click();
      
      // Verify progress tracking interface
      await expect(page.getByText(/student|score|completion/i)).toBeVisible();
    }
  });

  test('should test class management features', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to classroom management
    await page.getByRole('link', { name: /classroom|manage|class/i }).first().click();
    
    // Look for class management options
    await expect(page.getByText(/student|roster|class/i)).toBeVisible();
    
    // Try to add student (if available)
    const addStudentButton = page.getByRole('button', { name: /add student|invite/i }).first();
    if (await addStudentButton.isVisible()) {
      await addStudentButton.click();
      
      // Verify student addition interface
      await expect(page.getByText(/email|name|student/i)).toBeVisible();
    }
  });

  test('should explore differentiation tools for teachers', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to differentiation tools
    await page.getByRole('link', { name: /differentiat|adapt|level/i }).first().click();
    
    // Verify differentiation options
    await expect(page.getByText(/reading level|accommodate|adapt/i)).toBeVisible();
    
    // Test level selection
    const levelSelector = page.getByRole('combobox', { name: /level|grade/i }).first();
    if (await levelSelector.isVisible()) {
      await levelSelector.click();
      await expect(page.getByText(/grade|level/i)).toBeVisible();
    }
  });
});
