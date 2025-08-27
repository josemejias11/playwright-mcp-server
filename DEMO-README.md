# Royal Caribbean Testing Framework Demo

A flexible, visual-focused testing framework designed for Royal Caribbean's website with adaptability for future websites.

## Quick Demo

Run the complete demo suite:

```bash
npm run demo
```

Or run just the Royal Caribbean tests:

```bash
npm run demo:royal-caribbean
```

## What the Demo Tests

### 🏠 Homepage Visual Validation
- ✅ Full-page screenshot capture
- ✅ Brand verification (Royal Caribbean)
- ✅ Page title and heading validation
- ✅ URL verification

### 🧭 Navigation Elements
- ✅ Main navigation detection
- ✅ Logo presence verification
- ✅ Interactive buttons and links
- ✅ Menu structure validation

### 🚢 Cruise Functionality
- ✅ Cruise-specific keyword detection
- ✅ Search form identification
- ✅ Interactive element testing
- ✅ Booking flow entry points

### 📱 Mobile Responsiveness
- ✅ Mobile viewport simulation
- ✅ Responsive design validation
- ✅ Mobile-specific screenshots

### ⚡ Performance Overview
- ✅ Page load time measurement
- ✅ DOM ready time tracking
- ✅ Performance assessment
- ✅ Basic performance scoring

## Framework Features

### 🎯 Adaptive Testing
- Website-specific configurations
- Flexible selector strategies
- Fallback mechanisms for reliability

### 📸 Visual Documentation
- Automatic screenshot capture
- Mobile and desktop views
- Interaction state documentation

### 🔧 Easy Configuration
- Environment-based website switching
- Simple configuration files
- Demo-ready out of the box

## Screenshots Generated

After running the demo, check these files:

- `e2e/artifacts/royal-caribbean-homepage.png` - Full homepage
- `e2e/artifacts/royal-caribbean-navigation.png` - Navigation elements
- `e2e/artifacts/royal-caribbean-interaction.png` - User interactions
- `e2e/artifacts/royal-caribbean-mobile.png` - Mobile view

## Adding New Websites

1. Add website configuration to `e2e/config/website-configs.js`
2. Update environment variable `TARGET_WEBSITE`
3. Create website-specific page objects if needed
4. Tests automatically adapt to new configurations

## Architecture Highlights

- **Flexible Page Objects**: Adaptable selectors for different websites
- **Visual-First Approach**: Screenshot-driven validation
- **Demo-Ready**: Simplified for presentation purposes
- **Extensible**: Easy to add new websites and test types

Perfect for demonstrating modern web testing capabilities! 🚀
