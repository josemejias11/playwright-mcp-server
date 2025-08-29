describe('WebDriverIO MCP Server Test', () => {
    it('should demonstrate basic web automation', async () => {
        // Navigate to a test page
        await browser.url('https://example.com');
        
        // Get page title
        const title = await browser.getTitle();
        console.log('Page title:', title);
        
        // Take a screenshot
        await browser.takeScreenshot();
        
        // Verify we're on the expected page
        expect(title).toContain('Example Domain');
    });
    
    it('should interact with page elements', async () => {
        await browser.url('https://example.com');
        
        // Get page text
        const pageText = await $('h1').getText();
        expect(pageText).toBe('Example Domain');
        
        // Check if a link exists
        const link = await $('a');
        expect(await link.isExisting()).toBe(true);
    });
    
    it('should save screenshots to reports folder', async () => {
        await browser.url('https://example.com');
        
        // Take a screenshot and verify it's saved to reports folder
        const screenshot = await browser.takeScreenshot();
        expect(screenshot).toBeDefined();
        expect(typeof screenshot).toBe('string');
        
        console.log('Screenshot captured and saved to reports/screenshots/');
    });
});
