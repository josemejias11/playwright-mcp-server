# Playwright MCP Server QA Automation Framework

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
A comprehensive QA automation framework featuring traditional Playwright tests, advanced MCP testing, and complete API validation.

## Framework Overview

### **Multi-Layer Testing Strategy**
- **Traditional Playwright** - 5 comprehensive test suites across 3 browsers (Chromium, Firefox, WebKit)
- **Advanced MCP Testing** - Intelligent automation via Model Context Protocol with 32 organized tests
- **API Validation** - Server-side testing with Postman/Newman (15 tests)
- **Security & Compliance** - Government website requirements and WCAG accessibility

### **Key Features**
- **Organized Test Suites** - 32 MCP tests organized into 5 categories (Smoke, Functional, Performance, Accessibility, Security)
- **Multi-Browser Support** - Traditional Playwright tests across Chromium, Firefox, and WebKit
- **Flexible Execution** - Multiple strategies from quick smoke tests (3-5 min) to comprehensive validation (35-45 min)
- **Advanced Integration** - Model Context Protocol for intelligent test adaptation and self-healing
- **Government Focus** - Government website solutions validation and professional testing
- **Comprehensive Reporting** - HTML reports, JSON data, performance metrics, and business insights
- **CI/CD Integration** - Automated testing pipeline with GitHub Actions

---

## Project Structure

```
playwright-mcp-server/
├── 📁 src/                        # MCP Server (TypeScript)
│   └── index.ts                   # MCP server implementation
├── 📁 build/                      # Compiled MCP server
├── 📁 tests/                      # Traditional Playwright Tests
│   ├── homepage.spec.js           # Homepage validation tests
│   ├── accessibility.spec.js     # WCAG compliance tests
│   ├── performance.spec.js       # Performance monitoring tests
│   ├── security.spec.js          # Security validation tests
│   └── traditional-playwright.spec.js # Cross-browser test suite
├── 📁 e2e/                        # Advanced MCP Framework
│   ├── 📁 test-plan/              # Test strategy and documentation
│   │   └── COMPREHENSIVE_TEST_PLAN.md # Complete test strategy
│   ├── 📁 test-suites/            # Organized test execution
│   │   ├── smoke/                 # Critical path (4 tests, 3-5 min)
│   │   ├── functional/            # Business logic (15 tests, 14-21 min)
│   │   ├── performance/           # Load times (4 tests, 4-6 min)
│   │   ├── accessibility/         # WCAG compliance (3 tests, 3-5 min)
│   │   └── security/              # Data protection (6 tests, 6-8 min)
│   ├── 📁 framework/              # Test framework infrastructure
│   │   ├── base-test-framework.js # Core MCP framework
│   │   ├── logger.js              # Structured logging
│   │   └── reporter.js            # Report generation
│   ├── 📁 page-objects/           # Page Object Models
│   │   ├── homepage.js            # Homepage interactions
│   │   └── contact-page.js        # Contact page interactions
│   ├── 📁 config/                 # Test configuration
│   ├── 📁 artifacts/              # Screenshots and test evidence (generated)
│   ├── 📁 reports/                # Test reports (generated)
│   └── mcp-client.js              # MCP communication layer
├── 📁 postman/                    # API Testing Suite
│   ├── API-Tests.postman_collection.json # 15 API tests
│   ├── Environment.postman_environment.json # Test environment
│   └── reports/                   # API test reports (generated)
├── 📁 .github/workflows/          # CI/CD Pipeline
├── test-runner.js                 # Master test orchestrator
├── playwright.config.js           # Playwright configuration
└── package.json                   # Dependencies and scripts
```

---

## Quick Start

### **Installation & Setup**
```bash
# Clone and install
git clone https://github.com/josemejias11/playwright-mcp-server
cd playwright-mcp-server
npm install

# Install Playwright browsers
npx playwright install

# Build MCP server
npm run build

# Verify installation
npm run smoke     # Quick validation (3-5 min)
```

### **Quick Test Commands** 🚀
```bash
# Individual test suites (clean, simple names)
npm run smoke          # Critical path validation (3-5 min)
npm run functional     # Standard content validation (5-8 min) 
npm run functional:advanced  # Advanced content validation (4-6 min)
npm run performance    # Load time validation (4-6 min)
npm run accessibility  # WCAG compliance (3-5 min)
npm run security       # Data protection (6-8 min)
```

### **Test Suite Combinations** 📊
```bash
# Logical groupings for common scenarios
npm run suite:quick    # Smoke + Functional for rapid feedback (8-13 min)
npm run suite:content  # Both content validation tests (9-14 min)
npm run suite:quality  # Performance + Accessibility (7-11 min) 
npm run suite:all      # All individual test suites (25-35 min)
```

### **Advanced Orchestrated Testing** ⚡
```bash
# Master test runner with enhanced reporting and coordination
npm run orchestrated:smoke           # Quick validation (3-5 min)
npm run orchestrated:functional      # Business logic validation (14-21 min)
npm run orchestrated:quality         # Performance + Accessibility + Security (13-19 min)
npm run orchestrated:comprehensive   # Full system validation (35-45 min)
```

### **Complete Test Strategies**
```bash
# Advanced Orchestrated Testing (with master test runner)
npm run orchestrated:smoke           # Quick validation (3-5 min)
npm run orchestrated:functional      # Business logic validation (14-21 min)
npm run orchestrated:quality         # Performance + Accessibility + Security (13-19 min)
npm run orchestrated:comprehensive   # Full system validation (35-45 min)

# Direct Test Suite Combinations
npm run suite:quick                   # Smoke + Functional for rapid feedback (8-13 min)
npm run suite:content                 # Both content validation tests (9-14 min)
npm run suite:quality                 # Performance + Accessibility (7-11 min)
npm run suite:all                     # All test suites (25-35 min)

# Traditional Playwright tests (cross-browser)
npm run test                # All browsers (Chromium, Firefox, WebKit)
npm run test:headed         # Visible browser execution
npx playwright test --project=chromium  # Single browser

# API testing
npm run api            # Basic API validation
npm run api:detailed   # API tests with HTML reports
```

---

## CI/CD Integration

### **GitHub Actions Workflow**
The framework includes a comprehensive CI/CD pipeline that automatically runs on:
- **Push to main/develop branches**
- **Pull requests to main**
- **Daily scheduled runs** (2 AM UTC)

### **Automated Test Execution**
The CI pipeline includes:
- **Lint & Build validation** - TypeScript compilation and code quality
- **Traditional Playwright tests** - Cross-browser testing (Chromium, Firefox, WebKit)
- **Advanced MCP test suites** - Intelligent testing across 4 categories
- **API validation tests** - Server-side endpoint testing
- **Security scanning** - Dependency vulnerabilities and security validation
- **Performance testing** - Load time and performance metrics

### **Automated Reporting**
- **Test artifacts** uploaded for each run with 30-day retention
- **HTML reports** generated and deployed to GitHub Pages
- **Test summaries** with pass/fail status for each suite
- **Performance metrics** and accessibility compliance tracking

### **Pipeline Jobs**
1. **lint-and-build** - TypeScript validation and MCP server build
2. **test-traditional-playwright** - Cross-browser testing matrix
3. **test-advanced-mcp** - Intelligent test execution
4. **test-api** - Server-side validation
5. **security-scan** - Dependency and security validation
6. **performance-test** - Load time and performance metrics
7. **test-summary** - Consolidated results dashboard
8. **deploy-reports** - GitHub Pages deployment (main branch only)

---

## Test Coverage & Organization

### **Test Categories** (32 Advanced MCP Tests + Traditional Playwright Suite)

#### 1. **Smoke Tests** (4 tests, 3-5 min)
**Purpose:** Critical path validation - must pass before deployment
**Success Criteria:** 100% pass rate (blocks deployment if failed)

- Homepage Load Verification
- Critical Navigation Links
- Contact Form Accessibility  
- Basic Website Validation

#### 2. **Functional Tests** (15 tests, 14-21 min)
**Purpose:** Core business logic and user workflow validation
**Success Criteria:** 95% pass rate

**Content Validation (5 tests):**
- Hero Section CTAs
- Content Sections (focus, promise, mission)
- About Page Content (company info, values, vision)
- Services Page Content (6 service categories)
- Careers Page Content

**Navigation & UX (3 tests):**
- Navigation Menu Functionality
- Basic Navigation Test
- Page-to-Page Navigation

**Contact Forms (7 tests):**
- Form Structure Validation
- Valid Form Submission
- Empty Form Validation
- Email Format Validation
- Form Security Check
- Contact Form Functionality
- Invalid Form Submission Handling

#### 3. **Performance Tests** (4 tests, 4-6 min)
**Purpose:** Load times and performance optimization
**Success Criteria:** 90% pass rate

- Homepage Performance (< 5000ms)
- Services Page Performance (< 3000ms)
- Page-to-Page Navigation Performance
- Extended Performance Metrics

#### 4. **Accessibility Tests** (3 tests, 3-5 min)
**Purpose:** WCAG 2.1 AA compliance validation
**Success Criteria:** 85% pass rate

- Keyboard Navigation Accessibility
- Focus Management
- ARIA and Semantic HTML Validation

#### 5. **Security Tests** (6 tests, 6-8 min)
**Purpose:** Business validation, trust indicators, data protection
**Success Criteria:** 95% pass rate

- Company Information Accuracy (Tulsa, OK validation)
- Contact Information Check
- Financial Services Elements
- Professional Trust Indicators
- Services Content Business Validation
- Form Security Check

### **Traditional Playwright Tests** (100+ tests)
**Multi-browser coverage:** Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari

- **Homepage Validation (20 tests):** Loading, navigation, contact info, mobile responsiveness
- **Accessibility Compliance (20 tests):** WCAG standards, keyboard navigation, alt text
- **Performance Monitoring (20 tests):** Load times, Core Web Vitals, optimization
- **Security Validation (20 tests):** HTTPS, headers, SSL certificates
- **Cross-browser Suite (20 tests):** Multi-browser compatibility

### **API Testing Suite** (15 tests)
**Comprehensive server-side validation with Postman/Newman**

**Website Health & Performance (5 tests):**
- Homepage Availability - Basic availability and branding validation
- About Page Accessibility - Corporate information and tribal connection verification  
- Services Page Validation - Service offerings and content verification
- Contact Page Form Validation - Contact form structure and information verification
- Careers Page Validation - Career content and accessibility validation

**Security & Performance (3 tests):**
- SSL Certificate Validation - HTTPS enforcement and secure connections
- Security Headers Check - Content security and caching headers validation
- Performance Baseline - Response time, size, and compression validation

**Contact Form API (2 tests):**
- Contact Form GET Request - Form structure and accessibility verification
- Contact Form Validation Test - Parameter handling and error validation

**SEO & Metadata (3 tests):**
- Homepage SEO Validation - Title tags, meta descriptions, and heading structure
- Sitemap Accessibility - XML sitemap validation and structure
- Robots.txt Validation - SEO directives and crawler instructions

**Cross-Device Testing (2 tests):**
- Mobile User Agent Test - Mobile responsiveness and viewport validation
- Desktop Chrome Simulation - Desktop experience and performance validation

---

## Execution Strategies

### **Strategy 1: Quick Smoke** (3-5 minutes)
```bash
npm run run:smoke
```
- **Purpose:** Pre-deployment validation
- **When:** Every pull request, before deployment
- **Success:** 100% pass rate required
- **Blocks:** Deployment if any test fails

### **Strategy 2: Functional Validation** (14-21 minutes)
```bash
npm run run:functional
```
- **Purpose:** Feature validation after code changes
- **When:** Daily CI runs, feature development
- **Success:** 95% pass rate target
- **Includes:** Smoke + All functional tests

### **Strategy 3: Quality Assurance** (13-19 minutes)
```bash
npm run run:quality
```
- **Purpose:** Performance + Accessibility + Security validation
- **When:** Weekly QA validation, pre-release
- **Success:** 90% pass rate target
- **Focus:** Non-functional requirements

### **Strategy 4: Comprehensive** (35-45 minutes)
```bash
npm run run:comprehensive
```
- **Purpose:** Full system validation
- **When:** Release candidates, monthly regression
- **Success:** 85% pass rate target
- **Coverage:** All test categories

---

## Advanced MCP Testing

### **Model Context Protocol Integration**
- **Intelligent Analysis:** Advanced analysis of website structure and adaptive test scenarios
- **Self-Healing:** Tests automatically adjust to UI changes
- **Business Focus:** Validates functionality rather than brittle element selectors
- **Smart Reporting:** Provides business-meaningful insights and recommendations

### **Enhanced Capabilities**
- **Intelligent Error Handling:** Robust JSON parsing and fallback strategies
- **Dynamic Test Adaptation:** Advanced test scenario generation
- **Business Context:** Government website solutions compliance validation
- **Advanced Analytics:** Performance trends and accessibility compliance tracking

---

## API Testing with Postman/Newman

### **Test Categories Explained**

**Website Health Tests**
Validate that all main pages are accessible, load correctly, and contain expected content:
- HTTP status codes (200 OK)
- Response times (< 3 seconds)
- Core content presence
- Basic HTML structure validation

**Security & Performance**
Ensure the website follows security best practices and performs well:
- HTTPS enforcement
- Security headers (X-Content-Type-Options, etc.)
- Response compression (gzip/br)
- Response size optimization

**Contact Form Testing**
Validate the contact form functionality without actually submitting:
- Form structure validation
- Input field presence
- Parameter handling
- Error handling validation

**SEO & Metadata**
Check search engine optimization and metadata:
- Title tag optimization
- Meta descriptions
- Viewport configuration
- Heading structure (H1, H2, etc.)
- Sitemap.xml and robots.txt

**Cross-Device Testing**
Simulate different devices and browsers:
- Mobile user agent simulation
- Desktop browser simulation
- Responsive design validation

### **API Configuration**
- **Base URL:** https://www.ifsight.com/
- **User Agent:** API-Tests/1.0
- **Timeout:** 5000ms
- **Test Email:** test@ifsight.com

### **Performance Benchmarks**
- Homepage: < 3 seconds response time
- All pages: < 5 seconds response time
- Response size: < 1MB per page
- Compression: gzip/deflate/brotli enabled

### **CI/CD Integration**
```bash
# Run Postman tests in CI/CD pipeline
newman run API-Tests.postman_collection.json \
  -e Environment.postman_environment.json \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export reports/api-test-report.html
```

---

## Performance & Compliance Benchmarks

### **Performance Thresholds**
| Metric | Threshold | Test Source |
|--------|-----------|-------------|
| Homepage Load | < 5000ms | Professional/Comprehensive |
| Secondary Pages | < 3000ms | Professional |
| Navigation | < 3000ms per page | Comprehensive |
| Touch Targets | ≥ 44px | Comprehensive |

### **Accessibility Standards**
| Standard | Method | Validation |
|----------|--------|------------|
| WCAG 2.1 AA | Semantic HTML validation | Comprehensive |
| Keyboard Navigation | Tab sequence testing | Comprehensive |
| Focus Management | Interactive element focus | Comprehensive |
| Touch Accessibility | Minimum target size | Comprehensive |

### **Security & Business Validation**
| Requirement | Validation Method | Success Criteria |
|-------------|------------------|------------------|
| HTTPS Enforcement | Form security check | 100% secure protocols |
| Government Information | Address/phone validation | IFSight government solutions verified |
| Trust Indicators | SSL, contact info, address | ≥ 2/3 indicators present |
| Government Keywords | Content analysis | ≥ 3 government website keywords |

---

## Test Results & Reporting

### **Generated Reports**
- **HTML Reports:** Visual test execution results with screenshots
- **JSON Data:** Structured test results for analysis and trending
- **Performance Metrics:** Load times, Core Web Vitals, optimization suggestions
- **Accessibility Reports:** WCAG compliance scores and recommendations
- **Business Validation:** Government website information accuracy and trust indicators

### **Report Locations**
- **E2E Reports:** `e2e/reports/` - MCP test results
- **Playwright Reports:** `playwright-report/` - Traditional test results  
- **API Reports:** `postman/reports/` - API test results
- **Artifacts:** `e2e/artifacts/` - Screenshots and evidence

### **CI/CD Integration**
- **GitHub Actions:** Automated test execution on pull requests and deployments
- **Multi-Strategy Execution:** Different test levels based on trigger
- **Artifact Management:** Automatic report and screenshot archiving
- **Failure Notifications:** Slack integration for immediate failure alerts

---

## Configuration & Setup

### **Environment Configuration**
- **Test Configuration:** `e2e/config/test-config.js` - Environment settings, URLs, timeouts
- **Browser Settings:** `playwright.config.js` - Multi-browser configuration
- **API Environment:** `postman/Environment.postman_environment.json` - API test settings

### **Timeouts & Thresholds**
- **Smoke Tests:** 5 minutes total, 10 seconds per test
- **Functional Tests:** 15 minutes total, 15 seconds per test
- **Performance Tests:** 10 minutes total, 15 seconds per test
- **Accessibility Tests:** 10 minutes total, 8 seconds per test
- **Security Tests:** 15 minutes total, 8 seconds per test

### **Browser Configuration**
- **Default:** Chromium (headless)
- **Supported:** Chrome, Firefox, Safari/WebKit
- **Mobile:** Responsive testing with device simulation

---

## Technology Stack

### **Core Technologies**
- **Playwright** - Browser automation engine with multi-browser support
- **MCP (Model Context Protocol)** - Advanced browser integration for enhanced testing
- **TypeScript/JavaScript** - Implementation languages for framework and tests
- **Node.js** - Runtime environment and dependency management

### **Testing Tools**
- **Postman/Newman** - API testing, validation, and HTML reporting
- **GitHub Actions** - CI/CD pipeline with automated testing workflows
- **VS Code Extensions** - Playwright test runner and debugging tools

### **Quality Assurance**
- **WCAG 2.1 AA** - Accessibility compliance validation
- **Performance Monitoring** - Core Web Vitals and load time tracking
- **Security Validation** - HTTPS, headers, SSL certificate verification
- **Government Compliance** - Government website solutions requirements validation

---

## Success Criteria & KPIs

### **Test Level Success Rates**
| Test Level | Pass Rate | Action on Failure |
|------------|-----------|------------------|
| Smoke | 100% | Block deployment |
| Functional | 95% | Report and investigate |
| Performance | 90% | Monitor trends, optimize |
| Accessibility | 85% | Track compliance, improve |
| Security | 95% | Address immediately |

### **Business Metrics**
- **Critical Path Availability:** Homepage load success rate
- **Lead Generation Health:** Contact form submission success rate  
- **Performance Compliance:** Page load time adherence to thresholds
- **Accessibility Score:** WCAG compliance percentage
- **Security Validation:** Trust indicator and HTTPS compliance

### **Operational Metrics**
- **Test Execution Time:** Strategy completion within target timeframes
- **Flaky Test Rate:** Test reliability and consistency measurement
- **Coverage Analysis:** Feature and business requirement coverage
- **Maintenance Effort:** Framework updates and test maintenance time

---

## Test Coverage Matrix

### Current Coverage Analysis

| Test Area | Smoke | Functional | Performance | Accessibility | Security | API |
|-----------|-------|------------|-------------|---------------|----------|-----|
| Homepage | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| About Page | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Services Page | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Contact Page | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Careers Page | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Forms | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Navigation | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Mobile | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ |
| SEO/Metadata | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## E2E Framework Details

### **Test Suite Architecture**
The e2e framework is organized into focused, maintainable test suites:

```
e2e/test-suites/
├── smoke/critical-path.js          # Core functionality verification
├── functional/content-validation.js # Content accuracy and completeness
├── performance/load-times.js       # Core web vitals and performance
├── accessibility/wcag-compliance.js # Accessibility standards validation
└── security/data-protection.js     # Financial services security requirements
```

### **Framework Infrastructure**
- **Base Test Framework:** `e2e/framework/base-test-framework.js` - Core MCP framework with AI integration
- **Page Objects:** `e2e/page-objects/` - Reusable components for homepage and contact page interactions
- **Configuration:** `e2e/config/test-config.js` - Environment settings, URLs, and thresholds
- **Utilities:** `e2e/utils/` - Helper functions and common operations

### **Benefits of Reorganization**
- **Clear Separation of Concerns:** Each test suite has specific purpose and scope
- **Improved Reliability:** Appropriate timeouts and error handling for each test type
- **Faster Feedback:** Quick smoke tests for rapid deployment validation
- **Better Maintainability:** Modular structure with consistent patterns
- **Enhanced Reporting:** Detailed results with business context and recommendations

---

## Maintenance & Updates

### **Regular Schedule**
- **Daily:** Test execution results review and trend analysis
- **Weekly:** Performance and accessibility monitoring
- **Monthly:** Test coverage analysis and framework optimization
- **Quarterly:** Complete framework review and technology updates

### **Continuous Improvement**
- **Test Reliability:** Monitor and improve flaky test identification
- **Performance Optimization:** Enhance test execution speed and efficiency
- **Coverage Expansion:** Add new test scenarios based on production issues
- **Framework Evolution:** Update tools and integrate new testing capabilities

### **Best Practices**
1. **Test Execution Strategy**
   - Always run smoke tests first
   - Run functional tests for feature development
   - Run quality tests weekly for monitoring
   - Run comprehensive tests before major releases

2. **Failure Handling**
   - Smoke test failures block deployment
   - Functional test failures need immediate attention
   - Performance/accessibility failures require investigation
   - Security failures require immediate remediation

3. **Maintenance Guidelines**
   - Review test results weekly
   - Update test expectations as business requirements change
   - Monitor test execution times and optimize as needed
   - Keep documentation current with framework changes

---

## Future Enhancements

### **Planned Improvements**
1. **Cross-browser Testing:** Enhanced Firefox and Safari support
2. **API Integration Testing:** Backend service validation
3. **Visual Regression Testing:** UI consistency validation
4. **Load Testing:** Performance under stress conditions
5. **Automated Test Selection:** Smart test execution based on code changes

### **CI/CD Evolution**
- Enhanced GitHub Actions workflows
- Automated test result notifications
- Intelligent deployment decisions
- Performance trend monitoring and alerting

### **Framework Evolution**
- **Clean Architecture** - Consolidated testing capabilities without terminology bloat
- **Unified Page Objects** - Single comprehensive homepage.js with all methods
- **Advanced Testing** - Intelligent test adaptation and government website validation
- **Streamlined Execution** - Both standard and advanced content validation available

### **Recent Updates (August 2025)**
- **Consolidated Framework** - Merged advanced testing capabilities into clean, maintainable structure
- **Removed Redundancy** - Eliminated duplicate files and terminology while preserving all functionality
- **Enhanced Page Objects** - Complete homepage.js with government website testing methods
- **Streamlined Test Suites** - Both content-validation.js and content-validation-advanced.js with 100% success rates
- **Target Focus** - All tests now properly configured for IFSight.com government website solutions
- **Test Results** - Content Validation: 4/4 passing, Advanced Content Validation: 4/4 passing, Smoke Tests: 3/3 passing
- **Reorganized Scripts** - Clean, intuitive script organization with logical groupings and clear naming

---

## Support & Documentation

### **Getting Help**
- **Framework Documentation:** Detailed guides in `e2e/test-plan/COMPREHENSIVE_TEST_PLAN.md`
- **Test Examples:** Reference implementations in `e2e/test-suites/`
- **Configuration:** Environment setup in `e2e/config/`
- **Troubleshooting:** Common issues and solutions in test reports

### **Contributing**
- **Test Development:** Follow existing patterns in organized test suites
- **Framework Enhancement:** Extend framework components in `e2e/framework/`
- **Documentation:** Update comprehensive test plan for new features
- **CI/CD:** Enhance GitHub Actions workflows for new test strategies

### **Resources**
- **Playwright Documentation:** https://playwright.dev/
- **Model Context Protocol:** https://modelcontextprotocol.io/
- **Postman API Testing:** https://learning.postman.com/
- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/

---

**Results Summary:** 47+ total tests (5 traditional test suites + 32 advanced MCP + 15 API) | Comprehensive coverage | Intelligent validation | Government website solutions compliance | CI/CD integration
