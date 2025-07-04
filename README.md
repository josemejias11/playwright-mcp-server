# CaliberFS Playwright MCP Server

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue.svg)](https://www.typescriptlang.org/)

A professional-grade Model Context Protocol (MCP) server that provides browser automation capabilities using Playwright, specifically designed for financial services testing with CaliberFS (https://www.caliberfs.com) as the primary target.

## 🎯 Purpose

This project demonstrates enterprise-level QA engineering skills through:
- **Financial Services Testing Expertise** - Tailored for compliance, security, and business validation
- **Professional Test Automation Framework** - Enterprise-grade architecture and best practices  
- **MCP Integration** - Modern tooling for AI-assisted testing workflows
- **Business-Focused Scenarios** - Real-world financial services test cases

## 🏗️ Architecture

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

## ✨ Key Features

### MCP Server Capabilities
- **Multi-browser support**: Chromium, Firefox, and WebKit browsers
- **Browser lifecycle management**: Launch, navigate, and close browsers
- **Web interaction**: Click elements, fill forms, take screenshots
- **Content extraction**: Get text content from web pages
- **JavaScript execution**: Execute custom JavaScript in browser context
- **Element waiting**: Wait for elements to appear or change state
- **Page information**: Get current page title, URL, and viewport information

### Professional Test Framework
- **Enterprise-grade architecture** with base framework and utilities
- **Financial services focus** with compliance and security validation
- **Page Object Model pattern** for maintainable test code
- **Comprehensive reporting** with HTML and JSON outputs
- **Professional logging** with structured, business-context messaging
- **Performance monitoring** with financial services thresholds

### CaliberFS-Specific Testing
- **Homepage validation** - Hero sections, navigation, content verification
- **Contact form testing** - Validation, security, business process verification
- **Company information accuracy** - Address, phone, professional trust indicators
- **Services page validation** - Core business offerings and content
- **Security compliance** - HTTPS, form security, data protection

## 🚀 Quick Start

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

## 💼 Professional Test Framework

The project includes a comprehensive test automation framework designed for financial services:

### Test Categories
- **Smoke Tests** - Critical functionality verification
- **Functional Tests** - Core business workflows  
- **Form Tests** - Contact form validation and security
- **Business Validation** - Company information and trust indicators
- **Performance Tests** - Load time and efficiency validation

### Framework Components
- **BaseTestFramework** - Core test execution engine with error handling
- **TestLogger** - Professional logging with business context
- **TestReporter** - HTML/JSON reports with analytics
- **Page Objects** - Maintainable, reusable page models
- **Test Configuration** - Centralized settings and test data

### Sample Test Output
```
🚀 Starting CaliberFS Professional Test Suite
================================================================================
ℹ️  [2025-07-04 15:30:15] Starting test: Homepage Load Verification
✅ [2025-07-04 15:30:18] ✅ Passed: Homepage Load Verification (2847ms)
💼 [2025-07-04 15:30:18] Homepage loaded with correct branding
📸 [2025-07-04 15:30:19] Screenshot saved: smoke-homepage-2025-07-04T15-30-19.png
================================================================================
```

## 🔧 Development Scripts

- **`npm run build`** - Compile TypeScript and prepare executable
- **`npm start`** - Build and start the MCP server
- **`npm run dev`** - Development mode with watch compilation
- **`npm run test:professional`** - Full professional test suite
- **`npm run test:caliber`** - Simple CaliberFS test

## 📊 Test Reports

The framework generates comprehensive reports in `e2e/reports/`:
- **HTML Reports** - Visual test results with analytics and performance metrics
- **JSON Reports** - Machine-readable data for CI/CD integration  
- **Summary Reports** - Quick overview for stakeholders

## 🏢 CaliberFS Integration

This project specifically targets **Caliber Financial Services** (https://www.caliberfs.com) and includes:

- **Business-specific test scenarios** based on actual website analysis
- **Financial services compliance validation** (HTTPS, security headers, etc.)
- **Professional trust indicator verification** (contact info, certifications)
- **Real-world user journey testing** (contact forms, service exploration)

## 🛠️ MCP Server Integration

### With Claude Desktop

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

### With VS Code MCP

The `.vscode/mcp.json` file is configured for VS Code MCP development and debugging.

## 🎯 Project Goals

This project demonstrates:

1. **Professional QA Engineering Skills** suitable for financial services
2. **Modern Test Automation Practices** with MCP integration
3. **Business-Focused Testing** that validates real user value
4. **Enterprise-Grade Code Quality** with proper architecture and documentation
5. **Financial Services Domain Knowledge** through targeted test scenarios

## 🤝 Contributing

This project is designed as a professional portfolio piece demonstrating QA engineering capabilities for financial services companies like CaliberFS.

## 📝 License

ISC License - See LICENSE file for details.

---

**Built with ❤️ for professional QA engineering excellence**
