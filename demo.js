#!/usr/bin/env node

/**
 * Core Framework Demo Guide
 * Pure core framework - no website-specific code
 */

import dotenv from 'dotenv';

dotenv.config();

const websiteType = process.env.TARGET_WEBSITE || '';

console.log(`
🏗️ Core Automated Testing Framework
==================================

This is the core automation framework without website-specific implementations.

📋 Branch Strategy:
  🌟 main branch    - Core framework (current)
  🚢 RRCL branch    - Royal Caribbean testing
  📚 newsela branch - Newsela educational platform testing

🎯 To run website-specific tests, switch to the appropriate branch:

Royal Caribbean Testing:
  git checkout RRCL
  node demo.js

Newsela Educational Testing:
  git checkout newsela  
  node demo.js

Return to Core Framework:
  git checkout main

💡 Why this approach?
- Clean separation of concerns
- Each branch is focused and optimized for its target
- Core framework remains lightweight and reusable
- Easy to add new websites by creating new branches from main

${websiteType ? `\n⚠️  TARGET_WEBSITE=${websiteType} detected but ignored.
This branch contains only the core framework.
Use dedicated branches for website testing.` : ''}
`);

console.log('🔧 Core framework components available:');
console.log('  📂 Framework utilities');
console.log('  🧪 Base test classes'); 
console.log('  � MCP server integration');
console.log('  📊 Reporting infrastructure');
console.log('  🛠️  Configuration system');

process.exit(0);
