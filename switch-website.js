#!/usr/bin/env node

/**
 * Website Switcher Utility
 * Easy way to switch between different websites for testing
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { WebsiteConfigs, getAllWebsiteConfigs } from './config/website-configs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = path.join(__dirname, '.env');

function updateEnvFile(websiteName) {
  const config = WebsiteConfigs[websiteName];
  if (!config) {
    console.error(`❌ Website '${websiteName}' not found.`);
    console.log(`Available websites: ${Object.keys(WebsiteConfigs).join(', ')}`);
    return false;
  }

  const envContent = `# Environment Configuration for ${config.name} Testing
TARGET_WEBSITE=${websiteName}
BASE_URL=${config.baseUrl}
TEST_ENV=production
HEADLESS=false
DEFAULT_BROWSER=chromium
DEFAULT_TIMEOUT=15000
SHORT_TIMEOUT=5000
LONG_TIMEOUT=30000
LOG_LEVEL=info
ENABLE_SCREENSHOTS=true
ENABLE_PERFORMANCE_LOGGING=true
RUN_ACCESSIBILITY_TESTS=true
RUN_PERFORMANCE_TESTS=true
RUN_SECURITY_TESTS=false

# ${config.name} Specific Settings
${websiteName.toUpperCase()}_TEST_ENABLED=true
`;

  try {
    fs.writeFileSync(envPath, envContent);
    return true;
  } catch (error) {
    console.error(`❌ Failed to update .env file: ${error.message}`);
    return false;
  }
}

function showCurrentWebsite() {
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const targetWebsite = envContent.match(/TARGET_WEBSITE=(.+)/)?.[1];
    
    if (targetWebsite && WebsiteConfigs[targetWebsite]) {
      const config = WebsiteConfigs[targetWebsite];
      console.log(`🌐 Current website: ${config.name}`);
      console.log(`🔗 URL: ${config.baseUrl}`);
      console.log(`📋 Type: ${config.type}`);
      console.log(`✨ Features: ${config.features.join(', ')}`);
    } else {
      console.log(`⚠️ No valid website configured`);
    }
  } catch (error) {
    console.log(`⚠️ No .env file found or error reading it`);
  }
}

function listWebsites() {
  console.log(`\n📋 Available Websites:\n`);
  
  Object.entries(getAllWebsiteConfigs()).forEach(([key, config]) => {
    console.log(`🌐 ${key}`);
    console.log(`   Name: ${config.name}`);
    console.log(`   URL: ${config.baseUrl}`);
    console.log(`   Type: ${config.type}`);
    console.log(`   Features: ${config.features.join(', ')}\n`);
  });
}

function showHelp() {
  console.log(`
🚀 Website Switcher Utility

Usage:
  node switch-website.js [command] [website]

Commands:
  switch <website>  - Switch to a specific website
  current          - Show current website configuration
  list            - List all available websites
  help            - Show this help message

Examples:
  node switch-website.js switch royalcaribbean
  node switch-website.js current
  node switch-website.js list

Available websites: ${Object.keys(WebsiteConfigs).join(', ')}
`);
}

// Main execution
const command = process.argv[2];
const website = process.argv[3];

switch (command) {
  case 'switch':
    if (!website) {
      console.error(`❌ Please specify a website to switch to.`);
      listWebsites();
      process.exit(1);
    }
    
    if (updateEnvFile(website)) {
      const config = WebsiteConfigs[website];
      console.log(`✅ Switched to ${config.name}`);
      console.log(`🔗 URL: ${config.baseUrl}`);
      console.log(`📋 Type: ${config.type}`);
      console.log(`\n🧪 You can now run tests with:`);
      console.log(`   node e2e/royal-caribbean-test.js`);
      console.log(`   node e2e/test-suites/functional/flexible-content-validation.js`);
    }
    break;

  case 'current':
    showCurrentWebsite();
    break;

  case 'list':
    listWebsites();
    break;

  case 'help':
  case undefined:
    showHelp();
    break;

  default:
    console.error(`❌ Unknown command: ${command}`);
    showHelp();
    process.exit(1);
}
