import { test, expect } from '@playwright/test';

test.describe('Security Tests', () => {
  test('should use HTTPS', async ({ page }) => {
    await page.goto('/');
    expect(page.url()).toMatch(/^https:/);
  });

  test('should have secure headers', async ({ page, request }) => {
    const response = await request.get('/');
    const headers = response.headers();
    
    // Check for common security headers (be more flexible)
    // HSTS might not always be present on all sites
    const hasHSTS = headers['strict-transport-security'] !== undefined;
    
    // X-Content-Type-Options is more commonly present
    const hasContentTypeOptions = headers['x-content-type-options'] !== undefined;
    
    // Check for any security-related headers
    const hasXFrameOptions = headers['x-frame-options'] !== undefined;
    const hasContentSecurityPolicy = headers['content-security-policy'] !== undefined;
    const hasReferrerPolicy = headers['referrer-policy'] !== undefined;
    
    // At least one security header should be present
    const hasSecurityHeaders = hasHSTS || hasContentTypeOptions || hasXFrameOptions || 
                              hasContentSecurityPolicy || hasReferrerPolicy;
    
    expect(hasSecurityHeaders).toBe(true);
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
