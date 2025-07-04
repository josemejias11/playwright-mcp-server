import { test, expect } from '@playwright/test';

test.describe('CaliberFS Security Tests', () => {
  test('should use HTTPS', async ({ page }) => {
    await page.goto('/');
    expect(page.url()).toMatch(/^https:/);
  });

  test('should have secure headers', async ({ page, request }) => {
    const response = await request.get('/');
    const headers = response.headers();
    
    // Check for security headers
    expect(headers['strict-transport-security']).toBeDefined();
    expect(headers['x-content-type-options']).toBe('nosniff');
  });

  test('should not expose sensitive information', async ({ page }) => {
    await page.goto('/');
    
    // Check that sensitive server info is not exposed
    const content = await page.content();
    expect(content).not.toMatch(/Server: Apache|nginx|IIS/i);
    expect(content).not.toMatch(/X-Powered-By/i);
  });

  test('should validate SSL certificate', async ({ page, request }) => {
    const response = await request.get('/');
    expect(response.status()).toBe(200);
    
    // If we can make the request without SSL errors, the cert is valid
    expect(response.ok()).toBe(true);
  });
});
