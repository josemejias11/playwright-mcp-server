#!/usr/bin/env node

/**
 * Demo Runner - Multi-Website Testing Framework
 * Command-line interface supporting Royal Caribbean and Newsela
 */

import { RoyalCaribbeanDemo } from './e2e/royal-caribbean-demo.js';
import { NewselaDemo } from './e2e/newsela-demo.js';
import dotenv from 'dotenv';

dotenv.config();

// Determine which website to test
const websiteType = process.env.TARGET_WEBSITE || 'royalcaribbean';

const websiteConfigs = {
  royalcaribbean: {
    emoji: '🚢',
    name: 'Royal Caribbean',
    demo: RoyalCaribbeanDemo,
    description: 'Cruise booking and vacation planning',
    features: [
      '✅ Test homepage visuals and branding',
      '✅ Validate navigation elements',
      '✅ Check cruise functionality',
      '✅ Test mobile responsiveness',
      '✅ Assess basic performance'
    ],
    screenshots: [
      'royal-caribbean-homepage.png',
      'royal-caribbean-navigation.png',
      'royal-caribbean-interaction.png',
      'royal-caribbean-mobile.png'
    ]
  },
  newsela: {
    emoji: '📚',
    name: 'Newsela',
    demo: NewselaDemo,
    description: 'Educational content and reading platform',
    features: [
      '✅ Test educational homepage content',
      '✅ Validate educational navigation',
      '✅ Check grade level functionality',
      '✅ Analyze educational content',
      '✅ Assess platform performance'
    ],
    screenshots: [
      'newsela-homepage.png',
      'newsela-navigation.png',
      'newsela-interaction.png'
    ]
  }
};

const config = websiteConfigs[websiteType] || websiteConfigs.royalcaribbean;

console.log(`
${config.emoji} ${config.name} Testing Framework Demo
${'='.repeat(config.name.length + 35)}

Testing: ${config.description}

This demo will:
${config.features.join('\n')}

Screenshots will be saved to reports/artifacts/screenshots/

Starting demo in 3 seconds...
`);

// Add a short delay for demo effect
await new Promise(resolve => setTimeout(resolve, 3000));

try {
  const DemoClass = config.demo;
  const demo = new DemoClass();
  await demo.runDemo();
  
  console.log(`
🎉 Demo Completed Successfully!
==============================

Check the following files:
${config.screenshots.map(file => `📸 reports/artifacts/screenshots/${file}`).join('\n')}

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

Current target: ${config.name} (${websiteType})
To test a different website, set TARGET_WEBSITE environment variable:
- TARGET_WEBSITE=royalcaribbean
- TARGET_WEBSITE=newsela
`);
  process.exit(1);
}
