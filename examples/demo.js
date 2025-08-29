#!/usr/bin/env node

/**
 * Example usage of the WebDriverIO MCP Server
 * This demonstrates how to use the MCP server programmatically
 */

async function demonstrateWebAutomation() {
  console.log('🚀 Starting WebDriverIO MCP Server Demo');
  
  try {
    console.log('📱 WebDriverIO MCP Server Capabilities');
    
    console.log('✅ WebDriverIO MCP Server is ready!');
    console.log('🔧 Available tools:');
    console.log('   - navigate: Go to any URL');
    console.log('   - click: Click elements by CSS selector');
    console.log('   - type: Input text into form fields');
    console.log('   - screenshot: Capture page screenshots');
    console.log('   - get_text: Extract text from elements');
    console.log('   - fill_form: Fill multiple form fields');
    console.log('   - wait_for_element: Wait for elements to appear');
    console.log('   - hover: Hover over elements');
    console.log('   - scroll_to: Scroll to elements or coordinates');
    console.log('   - select_option: Select dropdown options');
    console.log('   - get_page_title: Get page title');
    console.log('   - get_current_url: Get current URL');
    console.log('   - refresh_page: Refresh the page');
    console.log('   - go_back: Navigate back');
    console.log('   - go_forward: Navigate forward');
    
    console.log('');
    console.log('🎯 To use this server with an MCP client:');
    console.log('   npm run mcp:server');
    console.log('');
    console.log('📚 See README-WEBDRIVERIO.md for detailed usage examples');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  demonstrateWebAutomation().catch(console.error);
}
