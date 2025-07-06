# CaliberFS Playwright MCP Testing Framework

QA automation framework demonstrating both traditional Playwright and AI-enhanced MCP testing approaches for financial services websites.

## Features

- **Traditional Playwright** - Standard browser automation
- **MCP-Enhanced Testing** - AI-assisted automation via Model Context Protocol  
- **API Testing** - Server-side validation with Postman/Newman
- **Multi-browser Support** - Chromium, Firefox, WebKit
- **Comprehensive Coverage** - Functional, performance, accessibility, mobile testing

## How MCP-Enhanced Testing Works

The Model Context Protocol (MCP) server integrates with GitHub Copilot to create intelligent, AI-driven test automation that goes beyond traditional scripted testing.

### 🤖 AI-Powered Test Generation Process

1. **Website Discovery** - MCP server launches browser and navigates to target website
2. **Intelligent Analysis** - Copilot analyzes page structure, content, and functionality  
3. **Context Understanding** - AI identifies key elements: forms, navigation, business logic
4. **Dynamic Test Creation** - Generates test scenarios based on discovered website features
5. **Adaptive Execution** - Tests adjust to page changes and handle dynamic content

### 🔍 How Copilot Searches and Analyzes Websites

```javascript
// MCP server provides browser context to Copilot
const page = await browser.newPage();
await page.goto('https://caliberfs.com');

// Copilot analyzes page structure and creates intelligent selectors
const contactInfo = await page.locator('[data-testid="contact"]').or(
  page.getByText('Contact').first()
).or(
  page.locator('.contact-section')
);

// AI generates contextual test scenarios
if (await contactInfo.isVisible()) {
  // Test phone number format validation
  // Test email link functionality  
  // Test contact form submission
}
```

### 🧠 Intelligent Test Scenario Creation

**Traditional Approach** (Static):
```javascript
// Fixed, brittle selectors
await page.click('#submit-button');
await expect(page.locator('.success-message')).toBeVisible();
```

**MCP-Enhanced Approach** (Adaptive):
```javascript
// AI-generated, resilient test logic
const submitButton = await mcpClient.findElement({
  role: 'button',
  purpose: 'form submission',
  context: 'contact form'
});

const result = await mcpClient.validateSubmission({
  expectedOutcome: 'success confirmation',
  fallbackValidation: ['url change', 'success message', 'form reset']
});
```

### 🎯 Key Advantages of MCP Testing

- **Self-Healing Tests** - AI adapts to UI changes automatically
- **Business Logic Focus** - Tests validate functionality, not just elements
- **Contextual Understanding** - Knows what elements should do, not just where they are
- **Dynamic Content Handling** - Manages loading states, animations, async operations
- **Intelligent Reporting** - Provides business-meaningful test results and insights

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

## MCP Architecture & Implementation

### 🏗️ Technical Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   GitHub        │    │   MCP Server     │    │   Playwright    │
│   Copilot       │◄──►│   (src/index.ts) │◄──►│   Browser       │
│                 │    │                  │    │   Automation    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌────────▼────────┐              │
         │              │  Test Framework │              │
         │              │ (e2e/framework/) │              │
         │              └─────────────────┘              │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ AI-Generated    │    │ Page Objects     │    │ Test Reports    │
│ Test Scenarios  │    │ & Utilities      │    │ & Artifacts     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 🔧 Core MCP Server Components

**1. MCP Server (`src/index.ts`)**
- Exposes browser automation tools to Copilot
- Handles AI requests for page interaction
- Manages browser lifecycle and context

**2. MCP Client (`e2e/mcp-client.js`)**
- Communicates with MCP server
- Translates AI instructions to browser actions
- Provides intelligent selectors and validation

**3. Test Framework (`e2e/framework/base-test-framework.js`)**
- Manages test execution flow
- Handles errors and retries intelligently
- Generates comprehensive reports

### 🤝 Copilot Integration Workflow

1. **Test Initiation**: MCP client starts test suite
2. **AI Analysis**: Copilot analyzes website structure via MCP server
3. **Dynamic Planning**: AI creates test plan based on discovered features
4. **Adaptive Execution**: Tests run with AI-guided element detection
5. **Intelligent Reporting**: Results include business context and insights

### 📋 Example MCP Test Flow

```javascript
// 1. AI discovers website features
const siteFeatures = await mcpClient.discoverFeatures('https://caliberfs.com');

// 2. Copilot generates test scenarios
const testScenarios = await mcpClient.generateScenarios({
  siteType: 'financial-services',
  features: siteFeatures,
  compliance: ['accessibility', 'performance']
});

// 3. Execute AI-guided tests
for (const scenario of testScenarios) {
  await mcpClient.executeScenario({
    name: scenario.name,
    steps: scenario.steps,
    validation: scenario.expectedOutcomes
  });
}
```

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
