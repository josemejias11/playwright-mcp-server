#!/usr/bin/env node

/**
 * Newsela Demo Runner
 * Educational platform testing for Newsela branch
 */

import { NewselaDemo } from './e2e/newsela-demo.js';
import dotenv from 'dotenv';

dotenv.config();

console.log(`
� Newsela Educational Testing Framework
======================================

This is the dedicated Newsela testing branch.

Testing: Educational content and reading platform

This demo will:
✅ Test educational homepage content
✅ Validate educational navigation
✅ Check grade level functionality
✅ Analyze educational content
✅ Assess platform performance

Screenshots will be saved to reports/artifacts/screenshots/

Starting Newsela demo in 3 seconds...
`);

// Add a short delay for demo effect
await new Promise(resolve => setTimeout(resolve, 3000));

try {
  const demo = new NewselaDemo();
  await demo.runDemo();
  
  console.log(`
🎉 Newsela Demo Completed Successfully!
=====================================

Check the following files:
📸 reports/artifacts/screenshots/newsela-homepage.png
📸 reports/artifacts/screenshots/newsela-navigation.png
📸 reports/artifacts/screenshots/newsela-interaction.png

The Newsela framework successfully demonstrated:
🔍 Educational content validation
🧪 Grade level functionality testing
📱 Educational platform responsiveness
⚡ Performance monitoring for learning environments
🎯 Student and teacher focused testing

Ready for educational platform testing! 🚀
`);

} catch (error) {
  console.error(`
❌ Newsela Demo Failed
====================
Error: ${error.message}

This might be due to:
- Network connectivity issues
- Newsela website changes
- Browser compatibility

Please check your internet connection and try again.

Note: This is the Newsela-specific testing branch.
For other websites, switch to the appropriate branch:
- git checkout RRCL (Royal Caribbean)
- git checkout main (Core framework)
`);
  process.exit(1);
}
