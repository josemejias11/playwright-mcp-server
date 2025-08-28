#!/usr/bin/env node

/**
 * Royal Caribbean Demo Runner  
 * Cruise line testing for RRCL branch
 */

import { RoyalCaribbeanDemo } from './e2e/royal-caribbean-demo.js';

console.log(`
🚢 Royal Caribbean Testing Framework
===================================

This is the dedicated Royal Caribbean testing branch.

Testing: Cruise booking and vacation planning platform

This demo will:
✅ Test homepage visuals and branding
✅ Validate navigation elements  
✅ Check cruise functionality
✅ Test mobile responsiveness
✅ Assess basic performance

Screenshots will be saved to reports/artifacts/screenshots/

Starting Royal Caribbean demo in 3 seconds...
`);

// Add a short delay for demo effect
await new Promise(resolve => setTimeout(resolve, 3000));

try {
  const demo = new RoyalCaribbeanDemo();
  await demo.runDemo();
  
  console.log(`
🎉 Royal Caribbean Demo Completed Successfully!
==============================================

Check the following files:
📸 reports/artifacts/screenshots/royal-caribbean-homepage.png
📸 reports/artifacts/screenshots/royal-caribbean-navigation.png
📸 reports/artifacts/screenshots/royal-caribbean-interaction.png
📸 reports/artifacts/screenshots/royal-caribbean-mobile.png

The Royal Caribbean framework successfully demonstrated:
🔍 Visual validation and screenshot capture
🧪 Cruise functionality testing
📱 Mobile responsiveness checks
⚡ Performance monitoring for booking platforms
🎯 Cruise-specific testing approach

Ready for cruise line production testing! 🚀
`);

} catch (error) {
  console.error(`
❌ Royal Caribbean Demo Failed
============================
Error: ${error.message}

This might be due to:
- Network connectivity issues
- Royal Caribbean website changes
- Browser compatibility

Please check your internet connection and try again.

Note: This is the Royal Caribbean-specific testing branch.
For other websites, switch to the appropriate branch:
- git checkout newsela (Newsela educational platform)
- git checkout main (Core framework)
`);
  process.exit(1);
}
