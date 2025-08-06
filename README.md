# Playwright MCP Server QA Automation Framework

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![API Tests](https://img.shields.io/badge/API%20Tests-100%25%20Success-brightgreen.svg)](https://github.com/josemejias11/playwright-mcp-server)
[![CI Pipeline](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue.svg)](https://github.com/josemejias11/playwright-mcp-server/actions)

A comprehensive QA automation framework featuring traditional Playwright tests, advanced MCP testing, and organized API validation with 100% success rate.

## Features

- **🎭 Traditional Playwright Tests** - Cross-browser testing (Chromium, Firefox, WebKit)
- **🤖 MCP-Enhanced Testing** - AI-assisted test automation with Model Context Protocol
- **🔗 Organized API Testing** - 8 categorized test suites with 78 passing assertions (100% success)
- **🔄 Matrix CI/CD Pipeline** - Parallel test execution with GitHub Actions
- **📊 Professional Reporting** - GitHub Pages dashboard with comprehensive analytics

## Quick Start

```bash
# Install and setup
git clone https://github.com/josemejias11/playwright-mcp-server
cd playwright-mcp-server
npm install
npx playwright install
npm run build

# Run tests
npm run smoke         # Quick validation (3-5 min)
npm run api           # API test suite (100% success rate)
npm run test          # Traditional Playwright tests
```

## Test Commands

### Core Test Suites
```bash
npm run smoke          # Critical path validation
npm run functional     # Content and functionality tests  
npm run performance    # Load time validation
npm run accessibility  # WCAG compliance
npm run security       # Security validation
```

### API Testing (100% Success Rate)
```bash
npm run api            # Complete API test suite
npm run api:detailed   # Enhanced HTML reports

# Category-specific testing
newman run postman/API-Tests.postman_collection.json \
  -e postman/Environment.postman_environment.json \
  --folder "Smoke Tests"
```

### Combined Strategies
```bash
npm run suite:quick    # Smoke + Functional (8-13 min)
npm run suite:quality  # Performance + Accessibility (7-11 min)
npm run suite:all      # All test suites (25-35 min)
```

## Project Structure

```
playwright-mcp-server/
├── src/                    # MCP Server (TypeScript)
├── tests/                  # Traditional Playwright Tests
├── e2e/                    # MCP-Enhanced Framework
│   ├── test-suites/        # Organized test execution
│   ├── framework/          # Core MCP framework
│   └── page-objects/       # Page Object Models
├── postman/                # API Testing Suites (8 categories)
├── .github/workflows/      # CI/CD Pipeline
└── reports/                # Test reports and artifacts
```

## API Test Organization

The API suite is organized into 8 professional categories:

- **🔥 Smoke Tests** (14 assertions) - Critical path validation
- **⚡ Functional Tests** (15 assertions) - Content and functionality
- **🛡️ Security Tests** (12 assertions) - HTTPS and security headers  
- **🏃 Performance Tests** (10 assertions) - Response time benchmarks
- **🎯 SEO Tests** (9 assertions) - Metadata and structure validation
- **📝 Contact Form Tests** (8 assertions) - Form functionality
- **📱 Cross-Platform Tests** (6 assertions) - Mobile/desktop compatibility
- **🎖️ Business Tests** (4 assertions) - Professional standards validation

**Results:** 78/78 passing assertions | 100% success rate | 68ms average response time

## CI/CD Pipeline

### Matrix Testing Strategy
- **API Validation Matrix** - 7 parallel test categories
- **Playwright Matrix** - 3 browsers (Chromium, Firefox, WebKit)  
- **MCP Matrix** - 5 test strategies

### Automated Triggers
- Push to main/develop branches
- Pull requests to main
- Daily scheduled runs (2 AM UTC)
- Manual workflow dispatch

### Professional Reporting
- GitHub Pages dashboard deployment
- HTML reports with performance metrics
- Test artifacts with 30-day retention
- Comprehensive test summaries

## Technology Stack

- **Playwright** - Browser automation engine
- **MCP (Model Context Protocol)** - AI-assisted testing
- **Postman/Newman** - API testing and reporting
- **GitHub Actions** - CI/CD automation
- **TypeScript/JavaScript** - Implementation languages

## Success Metrics

| Test Level | Target | Action on Failure |
|------------|--------|------------------|
| Smoke | 100% | Block deployment |
| Functional | 95% | Investigate |
| Performance | 90% | Monitor trends |
| Security | 95% | Address immediately |

## Getting Help

- **Documentation:** `e2e/test-plan/COMPREHENSIVE_TEST_PLAN.md`
- **Examples:** Reference implementations in `e2e/test-suites/`
- **Issues:** [GitHub Issues](https://github.com/josemejias11/playwright-mcp-server/issues)

---

**Test Results:** 100+ traditional tests + 32 MCP tests + 78 API assertions | Multi-browser support | AI-enhanced testing | Professional CI/CD pipeline
