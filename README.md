# CaliberFS Playwright MCP Testing Framework

A demonstration of QA automation using both traditional Playwright and MCP-enhanced testing approaches for financial services website testing.

## Overview

This project demonstrates two testing approaches:
- **Traditional Playwright** - Standard browser automation
- **MCP-Enhanced Testing** - AI-assisted browser automation via Model Context Protocol

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
npm install
npm run build
```

### Run Demos

#### **Traditional Playwright** (Standard approach)
```bash
npm run demo:playwright
```

#### **MCP-Enhanced** (AI-assisted approach)
```bash
npm run demo:mcp
```

Both test the same CaliberFS website with:
1. Basic website validation
2. Contact information detection  
3. Navigation link analysis

## Project Structure

```
caliberfs-playwright-mcp-server/
├── src/index.ts               # MCP server source (TypeScript)
├── build/index.js             # Compiled MCP server
├── tests/
│   └── traditional-playwright.spec.js  # Standard Playwright tests
├── e2e/                       # MCP-enhanced framework
│   ├── mcp-client.js          # MCP communication layer
│   ├── framework/             # Test framework base
│   ├── page-objects/          # Page Object Models
│   ├── config/                # Test configuration
│   ├── utils/                 # Logging and reporting
│   ├── tests/
│   │   ├── simple-demo.js     # Simple MCP demo
│   │   ├── caliber-professional-test-suite.js # Professional test suite
│   │   └── comprehensive-caliber-test-suite.js # Advanced comprehensive tests
│   ├── artifacts/             # Screenshots
│   └── reports/               # Test reports
├── postman/                   # API testing with Postman
│   ├── CaliberFS-API-Tests.postman_collection.json # API test collection
│   ├── CaliberFS-Environment.postman_environment.json # Test environment
│   ├── README.md              # Postman testing documentation
│   └── reports/               # API test reports
├── .vscode/                   # VS Code configuration
├── playwright.config.js       # Playwright configuration
└── package.json
```

## Available Scripts

### Working Demo Scripts
- `npm run demo:playwright` - Traditional Playwright tests ✅
- `npm run demo:mcp` - MCP-enhanced tests ✅
- `npm run demo` - Alias for MCP demo ✅

### Working Test Scripts  
- `npm run test` - Traditional Playwright tests ✅
- `npm run test:headed` - Tests with visible browser ✅
- `npm run test:professional` - Full MCP test suite ✅
- `npm run test:comprehensive` - Advanced comprehensive test suite ✅
- `npm run test:api` - Postman API tests via Newman CLI ✅
- `npm run test:api-detailed` - API tests with detailed HTML reports ✅

### Build Scripts
- `npm run build` - Build MCP server ✅
- `npm start` - Start MCP server ✅

## What Works

### ✅ Traditional Playwright Tests
- Multi-browser testing (Chromium, Firefox, WebKit)
- Screenshot capture
- Contact information validation
- Navigation testing
- Built-in Playwright reporting

### ✅ MCP-Enhanced Tests  
- **Simple Demo** - Basic website validation and content checks
- **Professional Suite** - Business-focused test scenarios with detailed reporting
- **Comprehensive Suite** - Advanced 15-test suite covering:
  - 🔧 **Functional Tests (6)** - Core website functionality, navigation, forms
  - ⚡ **Performance Tests (2)** - Load time validation, navigation speed
  - ♿ **Accessibility Tests (3)** - Keyboard navigation, ARIA compliance, focus management
  - 📱 **Mobile Tests (2)** - Responsive design, touch-friendly interfaces
  - 🔍 **Edge Case Tests (2)** - Error handling, network resilience

### ✅ Core Features
- **Browser Automation**: Real browser control via Playwright
- **Multi-browser Support**: Chromium, Firefox, WebKit
- **Screenshot Capture**: Visual test evidence with timestamps
- **Professional Reporting**: Multiple output formats (JSON, HTML, TXT)
- **Performance Monitoring**: Real browser performance metrics
- **Accessibility Testing**: WCAG compliance validation
- **Mobile Responsiveness**: Touch target and layout validation
- **Error Handling**: Graceful failure management with auto-screenshots
- **API Testing**: Comprehensive server-side validation with Postman/Newman
- **Security Testing**: SSL, headers, and security compliance validation
- **SEO Testing**: Metadata, sitemap, and search optimization validation

## Technology Stack

- **Playwright** - Browser automation engine
- **TypeScript/JavaScript** - Implementation languages  
- **MCP (Model Context Protocol)** - AI-browser integration
- **Node.js** - Runtime environment
- **VS Code** - Development environment with extensions

## Use Cases

### Traditional Playwright Best For:
- Standard web application testing
- CI/CD integration
- Fast, parallel test execution
- Teams familiar with Playwright

### MCP-Enhanced Best For:
- **Simple Demo**: Quick validation and learning MCP concepts
- **Professional Suite**: Business-focused scenarios with detailed logging
- **Comprehensive Suite**: Full-scale testing including performance, accessibility, and mobile
- Financial services compliance testing
- AI-assisted content validation
- Advanced reporting requirements

## Getting Started

1. **Install dependencies**: `npm install`
2. **Build MCP server**: `npm run build`
3. **Run traditional demo**: `npm run demo:playwright`
4. **Run simple MCP demo**: `npm run demo:mcp`
5. **Run comprehensive tests**: `npm run test:comprehensive`
6. **Check artifacts**: `e2e/artifacts/` for screenshots
7. **Check reports**: `e2e/reports/` for MCP test reports

### Test Suite Comparison:
- **`demo:playwright`** - Traditional approach, built-in Playwright reporting
- **`demo:mcp`** - Simple MCP demo, basic website validation
- **`test:professional`** - Business-focused MCP testing with custom reports
- **`test:comprehensive`** - Advanced 15-test suite covering functionality, performance, accessibility, mobile, and edge cases
- **`test:api`** - Postman API tests for server-side validation, security, and performance
- **`test:api-detailed`** - API tests with detailed HTML reports and charts

---

**Note**: This demonstrates both traditional and modern AI-enhanced QA automation approaches working on the same financial services website.
