# Playwright MCP Server QA Automation Framework

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![API Tests](https://img.shields.io/badge/API%20Tests-100%25%20Success-brightgreen.svg)](https://github.com/josemejias11/playwright-mcp-server)
[![CI Pipeline](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue.svg)](https://github.com/josemejias11/playwright-mcp-server/actions)

A comprehensive QA automation framework featuring traditional Playwright tests, advanced MCP testing, and organized API validation with 100% success rate. **Full WCAG 2.1 AA accessibility compliance validation across 5 browsers.**

## Features

- **Traditional Playwright Tests** - Cross-browser testing (Chromium, Firefox, WebKit)
- **Full Accessibility Compliance** - WCAG 2.1 AA validation across 5 browsers (25/25 tests passing)
- **MCP-Enhanced Testing** - AI-assisted test automation with Model Context Protocol
- **Organized API Testing** - 8 categorized test suites with 78 passing assertions (100% success)
- **Matrix CI/CD Pipeline** - Parallel test execution with GitHub Actions
- **Professional Reporting** - GitHub Pages dashboard with comprehensive analytics

## Quick Demo

Want to see it in action? Run the complete demo suite:

```bash
npm run demo
```

Or run just the Royal Caribbean tests:

```bash
npm run demo:royal-caribbean
```

### What the Demo Tests

#### 🏠 Homepage Visual Validation
- ✅ Full-page screenshot capture
- ✅ Brand verification (Royal Caribbean)
- ✅ Page title and heading validation
- ✅ URL verification

#### 🧭 Navigation Elements
- ✅ Main navigation detection
- ✅ Logo presence verification
- ✅ Interactive buttons and links
- ✅ Menu structure validation

#### 🚢 Cruise Functionality
- ✅ Cruise-specific keyword detection
- ✅ Search form identification
- ✅ Interactive element testing
- ✅ Booking flow entry points

#### 📱 Mobile Responsiveness
- ✅ Mobile viewport simulation
- ✅ Responsive design validation
- ✅ Mobile-specific screenshots

#### ⚡ Performance Overview
- ✅ Page load time measurement
- ✅ DOM ready time tracking
- ✅ Performance assessment
- ✅ Basic performance scoring

### Demo Screenshots Generated

After running the demo, check these files:

- `reports/artifacts/screenshots/royal-caribbean-homepage.png` - Full homepage
- `reports/artifacts/screenshots/royal-caribbean-navigation.png` - Navigation elements
- `reports/artifacts/screenshots/royal-caribbean-interaction.png` - User interactions
- `reports/artifacts/screenshots/royal-caribbean-mobile.png` - Mobile view

## Quick Start

### Local Installation
```bash
# Install and setup
git clone https://github.com/josemejias11/playwright-mcp-server
cd playwright-mcp-server
npm install
npx playwright install
npm run build

# Run tests
npm run smoke         # Quick validation (3-5 min)
npm run accessibility # WCAG 2.1 AA compliance
npm run api           # API test suite
npm run test          # Traditional Playwright tests
```

### Docker Installation
```bash
# Clone and run with Docker
git clone https://github.com/josemejias11/playwright-mcp-server
cd playwright-mcp-server

# Build Docker image
./docker-test.sh build

# Run specific test suites
./docker-test.sh smoke         # Quick validation (3-5 min)
./docker-test.sh api           # API tests (78/78 assertions)  
./docker-test.sh accessibility # WCAG 2.1 AA compliance (25/25 tests)
./docker-test.sh test          # Comprehensive test suite
```

## Test Commands

### Local Execution
```bash
npm run smoke          # Critical path validation
npm run accessibility  # WCAG 2.1 AA compliance
npm run functional     # Content and functionality tests  
npm run performance    # Load time validation
npm run security       # Security validation
```

### Docker Execution (Isolated & Consistent)
```bash
./docker-test.sh smoke          # Smoke tests in Docker
./docker-test.sh accessibility  # Accessibility tests (25/25 tests)
./docker-test.sh functional     # Functional tests in Docker
./docker-test.sh api            # API tests (78/78 assertions)
./docker-test.sh test           # All tests comprehensively
./docker-test.sh performance    # Performance tests
./docker-test.sh security       # Security tests
./docker-test.sh clean          # Clean up containers
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
npm run suite:quality  # Performance + Accessibility + Security (7-11 min)
npm run suite:all      # All test suites including full accessibility (25-35 min)
```

## Framework Architecture

### 🎯 Adaptive Testing Features
- **Website-specific configurations** - Easy switching between different target websites
- **Flexible selector strategies** - Robust element detection across different sites
- **Fallback mechanisms** - Reliable testing even when page structures vary
- **Visual documentation** - Automatic screenshot capture for validation

### Adding New Websites

1. Add website configuration to `e2e/config/website-configs.js`
2. Update environment variable `TARGET_WEBSITE`
3. Create website-specific page objects if needed
4. Tests automatically adapt to new configurations

The framework is designed to be **demo-ready** and **extensible** - perfect for showcasing modern web testing capabilities! 🚀

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
├── docker-test.sh          # Docker test runner script
├── docker-compose.yml      # Container orchestration
└── reports/                # Test reports and artifacts
```

## API Test Organization

The API suite is organized into 8 professional categories:

- **Smoke Tests** (14 assertions) - Critical path validation
- **Functional Tests** (15 assertions) - Content and functionality
- **Security Tests** (12 assertions) - HTTPS and security headers  
- **Performance Tests** (10 assertions) - Response time benchmarks
- **SEO Tests** (9 assertions) - Metadata and structure validation
- **Contact Form Tests** (8 assertions) - Form functionality
- **Cross-Platform Tests** (6 assertions) - Mobile/desktop compatibility
- **Business Tests** (4 assertions) - Professional standards validation

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

- **Docker** - Containerized testing environment for consistency
- **Playwright** - Browser automation engine
- **MCP (Model Context Protocol)** - AI-assisted testing
- **Postman/Newman** - API testing and reporting
- **GitHub Actions** - CI/CD automation
- **TypeScript/JavaScript** - Implementation languages

## Docker Support

### Prerequisites
- Docker and Docker Compose installed
- Git for cloning the repository

### Docker Commands
```bash
# Quick start with Docker
./docker-test.sh build    # Build Docker image
./docker-test.sh smoke    # Run smoke tests (3-5 min)
./docker-test.sh api      # Run API tests (78/78 assertions)
./docker-test.sh test     # Run comprehensive test suite

# Individual test types
./docker-test.sh functional    # Functional tests
./docker-test.sh performance   # Performance tests
./docker-test.sh security      # Security tests
./docker-test.sh accessibility # WCAG 2.1 AA compliance

# Test suites
./docker-test.sh suite-content # Content validation suite
./docker-test.sh suite-quality # Quality assurance suite
./docker-test.sh suite-all     # All comprehensive test suites

# Maintenance
./docker-test.sh clean    # Clean up containers and volumes
./docker-test.sh status   # Check Docker status
./docker-test.sh logs     # View test logs
```

### Docker Benefits
- **Single Image Architecture** - One comprehensive image serves all test profiles
- **Consistent Environment** - Same results across all machines
- **No Local Dependencies** - Playwright browsers included in container
- **Isolated Testing** - Tests run in clean environment every time
- **Easy CI/CD Integration** - Ready for containerized deployment
- **Multiple Test Profiles** - Different containers run different commands from same image

## Success Metrics

| Test Level | Target | Action on Failure |
|------------|--------|------------------|
| Smoke | 100% | Block deployment |
| Accessibility | 100% | Block deployment (WCAG 2.1 AA required) |
| Functional | 95% | Investigate |
| Performance | 90% | Monitor trends |
| Security | 95% | Address immediately |

### Accessibility Compliance Results
- **Traditional Playwright:** 
- **Cross-browser validation:** Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **WCAG 2.1 AA standards:** Heading structure, alt text, form labels, color contrast, keyboard navigation

---

**Test Results:** 100+ traditional tests + 32 MCP tests + 78 API assertions | **25/25 accessibility tests passing** | Multi-browser support | AI-enhanced testing | Professional CI/CD pipeline
