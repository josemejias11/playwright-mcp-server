# CaliberFS Playwright MCP Server

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue.svg)](https://www.typescriptlang.org/)

A professional Model Context Protocol (MCP) server providing browser automation capabilities using Playwright, designed for financial services testing with CaliberFS (https://www.caliberfs.com).

## Purpose

This project demonstrates QA engineering skills through:
- **Financial Services Testing** - Compliance, security, and business validation
- **Test Automation Framework** - Enterprise architecture and best practices  
- **MCP Integration** - Modern tooling for automated testing workflows
- **Business-Focused Scenarios** - Real-world financial services test cases

## Architecture

```
├── src/                    # MCP Server Implementation
│   └── index.ts           # Main MCP server with Playwright tools
├── e2e/                   # Professional Test Framework
│   ├── framework/         # Core framework components
│   ├── config/           # Centralized configuration
│   ├── utils/            # Logging and reporting utilities
│   ├── page-objects/     # Page Object Models for CaliberFS
│   ├── tests/            # Comprehensive test suites
│   ├── artifacts/        # Screenshots and test evidence
│   └── reports/          # HTML/JSON test reports
└── .vscode/              # MCP development configuration
```

## Features

### MCP Server
- Multi-browser support (Chromium, Firefox, WebKit)
- Browser lifecycle management
- Web element interaction and content extraction
- JavaScript execution and screenshot capture
- Robust waiting strategies and error handling

### Test Framework
- Modular architecture with Page Object Model
- Financial services domain patterns
- Comprehensive reporting (HTML/JSON)
- Performance monitoring and compliance validation
- CI/CD integration ready

### CaliberFS Integration
- Complete user journey testing
- Financial compliance automation
- Business credential validation
- Multi-device responsive testing
- Performance benchmarking

## Quick Start

### Prerequisites
- Node.js 20 or higher
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/caliberfs-playwright-mcp-server.git
   cd caliberfs-playwright-mcp-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

### Running Tests

```bash
# Run the comprehensive CaliberFS professional test suite
npm run test:professional

# Run the simple CaliberFS test
npm run test:caliber

# Test the MCP client functionality
node e2e/test-mcp-client.js
```

## Test Framework

### Test Categories
- **Smoke Tests** - Critical functionality verification
- **Functional Tests** - Business workflow validation  
- **Security Testing** - OWASP compliance and security validation
- **Performance Testing** - Load time and SLA validation
- **Compliance Auditing** - HTTPS, GDPR, and financial regulations

### Architecture
- **BaseTestFramework** - Core test execution with error handling
- **TestLogger** - Structured logging with business context
- **TestReporter** - HTML/JSON reports with analytics
- **Page Objects** - Maintainable page models
- **Configuration Management** - Environment-specific settings

### Sample Professional Test Output
```
🚀 CaliberFS Enterprise Test Suite - Financial Services Excellence
================================================================================
🎯 [2025-07-04 15:30:15] SUITE: Professional Financial Services Validation
💼 [2025-07-04 15:30:15] TARGET: Caliber Financial Services (caliberfs.com)
🔍 [2025-07-04 15:30:15] SCOPE: Full business workflow + compliance validation

⚡ [2025-07-04 15:30:16] Starting intelligent smoke test battery...
✅ [2025-07-04 15:30:18] ✅ PASSED: Homepage Business Intelligence (2.1s)
   💼 Brand validation: PASSED | Trust indicators: VERIFIED | Performance: 98/100
   📸 Evidence captured: smoke-homepage-business-validation.png

� [2025-07-04 15:30:19] Starting security & compliance validation...
✅ [2025-07-04 15:30:22] ✅ PASSED: Security & HTTPS Compliance (3.2s)
   🛡️ SSL Grade: A+ | OWASP: COMPLIANT | Data Protection: VERIFIED

📊 [2025-07-04 15:30:23] Performance Analysis Complete
   ⚡ Load Time: 1.8s (Industry Benchmark: 3.0s) - EXCELLENT
   🎯 Core Web Vitals: PASSED | SEO Score: 95/100 | Accessibility: AAA

📈 SUITE SUMMARY: 15/15 tests PASSED | Business Value: HIGH | Compliance: 100%
================================================================================
```

## Development Scripts

- **`npm run build`** - Compile TypeScript and prepare executable
- **`npm start`** - Build and start the MCP server
- **`npm run dev`** - Development mode with watch compilation
- **`npm run test:professional`** - Full professional test suite
- **`npm run test:caliber`** - Simple CaliberFS test

## MCP Server Integration

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "playwright-automation": {
      "command": "node",
      "args": ["/path/to/caliberfs-playwright-mcp-server/build/index.js"]
    }
  }
}
```

## Project Goals

This project demonstrates:
1. **QA Engineering Skills** for financial services
2. **Modern Test Automation** with MCP integration
3. **Business-Focused Testing** that validates real user value
4. **Enterprise Code Quality** with proper architecture and documentation

## Contributing

This project demonstrates QA engineering capabilities for financial services companies.

## License

ISC License

---

**Built for professional QA engineering excellence**
