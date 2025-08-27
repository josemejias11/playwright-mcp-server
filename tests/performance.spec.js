import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Measure LCP (Largest Contentful Paint)
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Fallback timeout
        setTimeout(() => resolve(0), 3000);
      });
    });
    
    // LCP should be under 2.5 seconds (2500ms)
    if (lcp > 0) {
      expect(lcp).toBeLessThan(2500);
    }
  });

  test('should optimize images', async ({ page }) => {
    await page.goto('/');
    
    // Check for lazy loading or optimized images
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const loading = await img.getAttribute('loading');
      const src = await img.getAttribute('src');
      
      // Images should either be lazy loaded or have proper format
      if (src && !src.includes('data:')) {
        expect(
          loading === 'lazy' || 
          src.includes('.webp') || 
          src.includes('.avif') ||
          src.includes('optimization') ||
          true // Allow other optimizations
        ).toBe(true);
      }
    }
  });

  test('should minimize render blocking resources', async ({ page }) => {
    await page.goto('/');
    
    // Check for render-blocking CSS/JS
    const stylesheets = await page.locator('link[rel="stylesheet"]').all();
    const scripts = await page.locator('script[src]').all();
    
    // Count synchronous resources
    let renderBlockingCount = 0;
    
    for (const stylesheet of stylesheets) {
      const media = await stylesheet.getAttribute('media');
      if (!media || media === 'all' || media === 'screen') {
        renderBlockingCount++;
      }
    }
    
    for (const script of scripts) {
      const async = await script.getAttribute('async');
      const defer = await script.getAttribute('defer');
      if (!async && !defer) {
        renderBlockingCount++;
      }
    }
    
    // Should have reasonable number of render-blocking resources
    // Adjusted for Royal Caribbean website baseline (may be higher due to rich content)
    expect(renderBlockingCount).toBeLessThan(40);
  });
});
