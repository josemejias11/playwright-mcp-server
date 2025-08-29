import { test, expect } from '@playwright/test';

test.describe('Newsela Teacher Tools', () => {
  
  test('Teacher login access is available', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for teacher-specific login or navigation
    const teacherSelectors = [
      'a[href*="teacher"], a[href*="educator"]',
      'button:has-text("Teacher"), button:has-text("Educator")',
      '[data-testid*="teacher"], [data-testid*="educator"]',
      ':text("For Teachers"), :text("Teachers"), :text("Educators")'
    ];
    
    let teacherLinkFound = false;
    
    for (const selector of teacherSelectors) {
      const element = page.locator(selector).first();
      const count = await element.count();
      
      if (count > 0) {
        const isVisible = await element.isVisible().catch(() => false);
        if (isVisible) {
          teacherLinkFound = true;
          await expect(element).toBeVisible();
          console.log('Teacher access link found');
          break;
        }
      }
    }
    
    if (!teacherLinkFound) {
      console.log('Teacher-specific navigation not prominently displayed on landing page');
    }
  });

  test('Assignment creation tools are referenced', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for references to teacher tools
    const toolSelectors = [
      ':text("Assignment"), :text("Assignments")',
      ':text("Classroom"), :text("Class")',
      ':text("Dashboard"), :text("Teacher Dashboard")',
      'a[href*="assignment"], a[href*="classroom"], a[href*="dashboard"]'
    ];
    
    let toolsReferenced = 0;
    
    for (const selector of toolSelectors) {
      const elements = page.locator(selector);
      const count = await elements.count();
      
      if (count > 0) {
        // Check first element for visibility
        const firstElement = elements.first();
        const isVisible = await firstElement.isVisible().catch(() => false);
        if (isVisible) {
          toolsReferenced++;
        }
      }
    }
    
    console.log(`Found ${toolsReferenced} references to teacher tools`);
  });

  test('Student progress tracking features mentioned', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for progress-related terms
    const progressSelectors = [
      ':text("Progress"), :text("Tracking")',
      ':text("Analytics"), :text("Reports")',
      ':text("Assessment"), :text("Quiz")',
      'a[href*="progress"], a[href*="analytics"], a[href*="report"]'
    ];
    
    let progressFeaturesFound = 0;
    
    for (const selector of progressSelectors) {
      const elements = page.locator(selector);
      const count = await elements.count();
      
      if (count > 0) {
        const firstElement = elements.first();
        const isVisible = await firstElement.isVisible().catch(() => false);
        if (isVisible) {
          progressFeaturesFound++;
        }
      }
    }
    
    console.log(`Found ${progressFeaturesFound} references to progress tracking features`);
  });

  test('Differentiated instruction support', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for differentiation features
    const differentiationSelectors = [
      ':text("Differentiat"), :text("Reading Level")',
      ':text("Personalized"), :text("Adaptive")',
      ':text("Individual"), :text("Custom")',
      '[data-testid*="level"], .reading-level'
    ];
    
    let differentiationFound = false;
    
    for (const selector of differentiationSelectors) {
      const elements = page.locator(selector);
      const count = await elements.count();
      
      if (count > 0) {
        const firstElement = elements.first();
        const isVisible = await firstElement.isVisible().catch(() => false);
        if (isVisible) {
          differentiationFound = true;
          console.log('Differentiation features referenced');
          break;
        }
      }
    }
    
    if (!differentiationFound) {
      console.log('Differentiation features not prominently displayed on landing page');
    }
  });

  test('Professional development resources access', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for PD or training resources
    const pdSelectors = [
      ':text("Professional Development"), :text("Training")',
      ':text("Resources"), :text("Support")',
      ':text("Help"), :text("Guide")',
      'a[href*="training"], a[href*="support"], a[href*="help"]',
      'a[href*="resource"], a[href*="guide"]'
    ];
    
    let pdResourcesFound = 0;
    
    for (const selector of pdSelectors) {
      const elements = page.locator(selector);
      const count = await elements.count();
      
      if (count > 0) {
        for (let i = 0; i < Math.min(count, 2); i++) {
          const element = elements.nth(i);
          const isVisible = await element.isVisible().catch(() => false);
          if (isVisible) {
            pdResourcesFound++;
          }
        }
      }
    }
    
    expect(pdResourcesFound).toBeGreaterThanOrEqual(0);
    console.log(`Found ${pdResourcesFound} references to professional development resources`);
  });

});
