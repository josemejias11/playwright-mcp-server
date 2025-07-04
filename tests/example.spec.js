import { test, expect } from '@playwright/test';

test.describe('Example Tests', () => {
  test('basic test example', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);
  });
});
