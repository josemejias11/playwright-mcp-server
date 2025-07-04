#!/usr/bin/env node

/**
 * Simple MCP Client Test
 * Test the fixed MCP client implementation
 */

import { McpClient } from './mcp-client.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testMcpClient() {
  console.log('Testing MCP Client Implementation...\n');
  
  const client = new McpClient(join(__dirname, '../build/index.js'));
  
  try {
    // Test 1: Launch browser
    console.log('1. Testing browser launch...');
    const launchResult = await client.launchBrowser('chromium', false);
    console.log('✓ Browser launched:', launchResult.output);
    
    // Test 2: Navigate to CaliberFS
    console.log('\n2. Testing navigation...');
    const navResult = await client.navigateTo('https://www.caliberfs.com');
    console.log('✓ Navigation successful:', navResult.output);
    
    // Test 3: Get page info
    console.log('\n3. Testing page info...');
    const pageResult = await client.getPageInfo();
    console.log('✓ Page info:', pageResult.output);
    
    // Test 4: Take screenshot
    console.log('\n4. Testing screenshot...');
    const screenshotResult = await client.takeScreenshot('e2e/artifacts/test-screenshot.png', true);
    console.log('✓ Screenshot taken:', screenshotResult.output);
    
    // Test 5: Close browser
    console.log('\n5. Testing browser close...');
    const closeResult = await client.closeBrowser();
    console.log('✓ Browser closed:', closeResult.output);
    
    console.log('\nAll MCP client tests passed!');
    
  } catch (error) {
    console.error('✗ Test failed:', error.message);
    try {
      await client.closeBrowser();
    } catch (closeError) {
      console.error('Failed to close browser:', closeError.message);
    }
    process.exit(1);
  }
}

testMcpClient();
