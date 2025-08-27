#!/usr/bin/env node

/**
 * Demo Runner - Quick test execution for Royal Caribbean
 * Simple command-line interface for demo purposes
 */

import { RoyalCaribbeanDemo } from './e2e/royal-caribbean-demo.js';

console.log(`
🚢 Royal Caribbean Testing Framework Demo
=========================================

This demo will:
✅ Test homepage visuals and branding
✅ Validate navigation elements  
✅ Check cruise functionality
✅ Test mobile responsiveness
✅ Assess basic performance

Screenshots will be saved to reports/artifacts/screenshots/

Starting demo in 3 seconds...
`);

// Add a short delay for demo effect
await new Promise(resolve => setTimeout(resolve, 3000));

try {
  const demo = new RoyalCaribbeanDemo();
  await demo.runDemo();
  
  console.log(`
🎉 Demo Completed Successfully!
==============================

Check the following files:
📸 reports/artifacts/screenshots/royal-caribbean-homepage.png
📸 reports/artifacts/screenshots/royal-caribbean-navigation.png
📸 reports/artifacts/screenshots/royal-caribbean-interaction.png
📸 reports/artifacts/screenshots/royal-caribbean-mobile.png

The framework successfully demonstrated:
🔍 Visual validation and screenshot capture
🧪 Basic functionality testing
📱 Mobile responsiveness checks
⚡ Performance monitoring
🎯 Adaptive testing approach

Ready for production testing! 🚀
`);

} catch (error) {
  console.error(`
❌ Demo Failed
=============
Error: ${error.message}

This might be due to:
- Network connectivity issues
- Website changes
- Browser compatibility

Please check your internet connection and try again.
`);
  process.exit(1);
}
