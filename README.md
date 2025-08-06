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

---

## Enhanced CI/CD Integration

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

### **API Testing Suite** - Organized by Test Methodology (78 Passing Assertions, 100% Success Rate)

**🔗 Professional Test Organization:**
The API test suite has been completely reorganized into 8 professional categories based on testing methodology:

#### **1. 🔥 Smoke Tests** (14 assertions)
**Purpose:** Critical path validation - system availability and core functionality
- Homepage Availability & Branding Validation
- Basic Navigation and Essential Content Verification  
- Contact Information Accuracy and Accessibility
- Core Website Functionality Assessment

#### **2. ⚡ Functional Tests** (15 assertions)  
**Purpose:** Content accuracy and feature functionality validation
- About Page Content Validation (/about-if endpoint)
- Services Page Content Verification (/solutions-and-services endpoint)
- Career Content and Information Validation  
- Contact Form Structure and Functionality Testing
- Navigation and Link Validation

#### **3. 🛡️ Security Tests** (12 assertions)
**Purpose:** HTTPS enforcement and security header validation  
- SSL Certificate Validation and HTTPS Enforcement
- Security Headers Analysis (CSP, X-Frame-Options, etc.)
- Secure Connection Verification
- Data Protection and Privacy Compliance

#### **4. 🏃 Performance Tests** (10 assertions)
**Purpose:** Response time benchmarks and optimization validation
- Homepage Performance Benchmarking (< 3000ms)
- Secondary Page Load Time Validation
- Response Size Optimization Assessment  
- Compression and Caching Validation (gzip/brotli)

#### **5. 🎯 SEO Tests** (9 assertions)
**Purpose:** Search engine optimization and metadata validation
- Title Tag Optimization and Length Validation
- Meta Description Quality and Length Assessment
- Heading Structure Analysis (H1, H2 hierarchy)
- Viewport and Mobile-Friendly Configuration
- Sitemap.xml and Robots.txt Validation

#### **6. 📝 Contact Form Tests** (8 assertions)
**Purpose:** Form functionality and parameter handling validation
- Contact Form GET Request Structure Validation
- Form Field Presence and Accessibility Verification
- Parameter Handling and Error Response Testing
- Form Security and Validation Assessment

#### **7. 📱 Cross-Platform Tests** (6 assertions)  
**Purpose:** Mobile and desktop compatibility validation
- Mobile User Agent Simulation and Responsiveness
- Desktop Browser Experience Validation
- Cross-Device Navigation and Functionality Testing
- Responsive Design and Layout Verification

#### **8. 🎖️ Business Compliance Tests** (4 assertions)
**Purpose:** Professional website standards and business validation
- IFSight.com Professional Branding Verification
- Business Solutions Content Validation
- Professional Standards Assessment
- Trust Indicators and Credibility Validation

**📊 Test Execution Results:**
- **Total Tests:** 78 assertions across 19 requests  
- **Success Rate:** 100% (78/78 passing)
- **Average Response Time:** 68ms
- **Total Execution Time:** 1,705ms
- **Categories:** 8 organized test suites

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
- **Business Context:** Professional website solutions compliance validation
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
| Business Information | Address/phone validation | IFSight professional solutions verified |
| Trust Indicators | SSL, contact info, address | ≥ 2/3 indicators present |
| Professional Keywords | Content analysis | ≥ 3 professional website keywords |

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
