# CaliberFS Playwright MCP Testing Framework

QA automation framework demonstrating traditional Playwright and AI-enhanced MCP testing for financial services websites.

## Features

- **Traditional Playwright** - Standard browser automation with 100 tests across 5 browsers
- **MCP-Enhanced Testing** - AI-assisted automation via Model Context Protocol  
- **API Testing** - Server-side validation with Postman/Newman
- **Comprehensive Coverage** - Homepage, accessibility, performance, security testing

## MCP-Enhanced Testing

Model Context Protocol integrates with GitHub Copilot for intelligent test automation:

- **AI Analysis** - Copilot analyzes website structure and generates adaptive test scenarios
- **Self-Healing** - Tests automatically adjust to UI changes
- **Business Focus** - Validates functionality rather than brittle element selectors
- **Smart Reporting** - Provides business-meaningful insights and results

## Quick Start

```bash
# Install and build
npm install && npm run build

# Run tests
npm run test              # Traditional Playwright (100 tests)
npm run demo:mcp          # MCP-enhanced demo
npm run test:api          # API tests
npm run test:comprehensive # MCP comprehensive suite (15 tests)
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
# Test Execution
npm run test                # Traditional Playwright (100 tests)
npm run test:headed         # Tests with visible browser
npm run demo:mcp           # MCP demo (simple)
npm run test:professional   # MCP professional suite
npm run test:comprehensive  # MCP comprehensive (15 tests)
npm run test:api           # API tests via Newman
npm run test:api-detailed  # API tests with HTML reports

# Development
npm run build              # Build MCP server
npm start                  # Start MCP server
```

## Test Capabilities

### Traditional Playwright Tests (100 tests)
- **Multi-browser** - Chromium, Firefox, WebKit, mobile-chrome, mobile-safari
- **Homepage validation** - Loading, navigation, contact info, mobile responsiveness
- **Accessibility compliance** - WCAG standards, keyboard navigation, alt text
- **Performance monitoring** - Load times, Core Web Vitals, optimization
- **Security validation** - HTTPS, headers, SSL certificates

### MCP-Enhanced Tests (15 tests)
- **AI-powered scenarios** - Intelligent test generation and adaptation
- **Business logic focus** - Functional validation beyond element testing
- **Self-healing tests** - Automatic adaptation to UI changes
- **Advanced reporting** - Business context and insights

### API Testing
- **Postman/Newman** - Server-side validation, security, performance
- **Detailed reports** - HTML charts and metrics

## Technology Stack

- **Playwright** - Browser automation engine
- **MCP (Model Context Protocol)** - AI-browser integration
- **TypeScript/JavaScript** - Implementation languages  
- **Postman/Newman** - API testing and reporting
- **GitHub Actions** - CI/CD pipeline with automated testing

## Use Cases

- **Traditional Playwright**: Standard automation, CI/CD integration, comprehensive coverage
- **MCP-Enhanced**: AI-assisted validation, financial compliance, intelligent reporting
- **API Testing**: Server-side validation, security testing, performance monitoring

---

**Results**: 100 traditional tests + 15 MCP tests + API validation | Reports in `e2e/reports/`, artifacts in `e2e/artifacts/`
