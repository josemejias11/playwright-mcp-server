import { test, expect } from '@playwright/test';

test.describe('Newsela Platform - Smoke Tests', () => {
  
  test('Landing page loads successfully', async ({ page }) => {
    await page.goto('/');
    
    // Verify page title
    await expect(page).toHaveTitle(/Newsela/);
    
    // Check for the main Luna heading which should be visible across all devices
    await expect(page.getByRole('heading', { name: 'Introducing Luna!' })).toBeVisible();
    
    // On desktop/tablet, check navigation buttons
    const viewportSize = page.viewportSize();
    if (viewportSize && viewportSize.width >= 768) {
      // Desktop/tablet navigation
      await expect(page.getByRole('link', { name: 'Newsela large logo' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Products' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Resources' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Solutions' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'About' })).toBeVisible();
    } else {
      // Mobile - just check that page content is accessible
      await expect(page.getByText('Save time and drive student outcomes')).toBeVisible();
    }
    
    // Verify page is fully loaded
    await page.waitForLoadState('domcontentloaded');
  });

  test('Main navigation elements are accessible', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('domcontentloaded');
    
    // Check viewport size to determine navigation type
    const viewportSize = page.viewportSize();
    if (viewportSize && viewportSize.width >= 768) {
      // Desktop/tablet navigation
      await expect(page.getByRole('button', { name: 'Products' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Resources' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Solutions' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'About' })).toBeVisible();
      
      // Check auth/signup links (using first() for duplicates)
      await expect(page.getByRole('link', { name: 'Sign Up' }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Log in' }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Contact us' })).toBeVisible();
      
      // Check state finder link (using first() for strict mode)
      await expect(page.getByRole('link', { name: 'Find your state' }).first()).toBeVisible();
    } else {
      // Mobile navigation - check that key content is accessible instead
      await expect(page.getByRole('heading', { name: 'Introducing Luna!' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Discover Luna' })).toBeVisible();
    }
  });

  test('Footer contains required information', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('domcontentloaded');
    
    // Check footer navigation links (using actual footer structure from site)
    await expect(page.getByRole('link', { name: 'Newsela ELA' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Professional Learning' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Our Story' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact Sales' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Careers' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Privacy' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Terms' }).first()).toBeVisible();
    
    // Check footer sections are present
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Resources' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'About' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible();
  });

  test('Page is responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('domcontentloaded');
    
    // Verify page loads without horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20); // 20px tolerance
    
    // On mobile, check for the page title instead of specific navigation
    await expect(page).toHaveTitle(/Newsela/);
    
    // Check that Luna content is still accessible on mobile
    await expect(page.getByRole('heading', { name: 'Introducing Luna!' })).toBeVisible();
    
    // Verify that key content is present
    await expect(page.getByText('Save time and drive student outcomes')).toBeVisible();
  });

  test('Luna AI content is featured prominently', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Check for Luna announcement banner
    await expect(page.getByRole('link', { name: /Luna.*AI-powered teaching assistant/ })).toBeVisible();
    
    // Check for main Luna heading
    await expect(page.getByRole('heading', { name: 'Introducing Luna!' })).toBeVisible();
    
    // Check for Luna action buttons
    await expect(page.getByRole('link', { name: 'Discover Luna' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Read Luna\'s story' })).toBeVisible();
  });

});
