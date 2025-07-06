# CaliberFS Playwright MCP Testing Framework

QA automation framework demonstrating both traditional Playwright and AI-enhanced MCP testing approaches for financial services websites.

## Features

- **Traditional Playwright** - Standard browser automation
- **MCP-Enhanced Testing** - AI-assisted automation via Model Context Protocol  
- **API Testing** - Server-side validation with Postman/Newman
- **Multi-browser Support** - Chromium, Firefox, WebKit
- **Comprehensive Coverage** - Functional, performance, accessibility, mobile testing

## Quick Start

```bash
# Install and build
npm install && npm run build

# Run demos
npm run demo:playwright    # Traditional Playwright
npm run demo:mcp          # MCP-enhanced
npm run test:api          # API tests

# Run test suites
npm run test:comprehensive # Full test suite (15 tests)
```

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

```bash
# Demos
npm run demo:playwright      # Traditional Playwright demo
npm run demo:mcp            # MCP-enhanced demo
npm run demo                # Alias for MCP demo

# Test Suites  
npm run test                # Traditional Playwright tests
npm run test:headed         # Tests with visible browser
npm run test:professional   # Full MCP test suite
npm run test:comprehensive  # Advanced 15-test suite
npm run test:api           # API tests via Newman
npm run test:api-detailed  # API tests with HTML reports

# Build
npm run build              # Build MCP server
npm start                  # Start MCP server
```

## Test Capabilities

### Traditional Playwright Tests
- Multi-browser testing (Chromium, Firefox, WebKit)
- Contact information validation and navigation testing
- Built-in Playwright reporting with screenshots

### MCP-Enhanced Tests  
- **Simple Demo** - Basic website validation
- **Professional Suite** - Business-focused scenarios with detailed reporting
- **Comprehensive Suite** - 15-test suite covering:
  - 🔧 **Functional (6)** - Core functionality, navigation, forms
  - ⚡ **Performance (2)** - Load times, navigation speed  
  - ♿ **Accessibility (3)** - WCAG compliance, keyboard navigation
  - 📱 **Mobile (2)** - Responsive design, touch interfaces
  - 🔍 **Edge Cases (2)** - Error handling, network resilience

### API Testing
- **Postman/Newman** - Server-side validation, security, performance
- **Detailed Reports** - HTML reports with charts and metrics

## Technology Stack

- **Playwright** - Browser automation engine
- **MCP (Model Context Protocol)** - AI-browser integration
- **TypeScript/JavaScript** - Implementation languages  
- **Postman/Newman** - API testing and reporting
- **Node.js** - Runtime environment
- **GitHub Actions** - CI/CD pipeline with automated testing

## CI/CD Pipeline

Comprehensive GitHub Actions workflow featuring:
- **Multi-browser testing** - Chromium, Firefox, WebKit
- **Parallel test execution** - Traditional Playwright, MCP-enhanced, API tests
- **Security scanning** - npm audit and dependency checks
- **Performance monitoring** - Load time and responsiveness validation
- **Automated reporting** - Test results deployed to GitHub Pages
- **Artifact management** - Screenshots, reports, and metrics retention

## Use Cases

- **Traditional Playwright**: Standard automation, CI/CD integration, fast parallel execution
- **MCP-Enhanced**: AI-assisted validation, financial compliance testing, advanced reporting
- **API Testing**: Server-side validation, security testing, performance monitoring

---

**Artifacts**: Screenshots in `e2e/artifacts/`, test reports in `e2e/reports/`, API reports in `postman/reports/`
