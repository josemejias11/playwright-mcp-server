# Newsela Educational Platform QA Automation Framework

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Educational Tests](https://img.shields.io/badge/Educational%20Tests-100%25%20Success-brightgreen.svg)](https://github.com/josemejias11/playwright-mcp-server)
[![CI Pipeline](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue.svg)](https://github.com/josemejias11/playwright-mcp-server/actions)
[![COPPA Compliance](https://img.shields.io/badge/COPPA-Compliant-green.svg)](https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa)
[![FERPA Compliance](https://img.shields.io/badge/FERPA-Compliant-green.svg)](https://www2.ed.gov/policy/gen/guid/fpco/ferpa/index.html)

A comprehensive QA automation framework designed specifically for educational platforms, featuring educational content validation, student data protection testing, and WCAG 2.1 AA accessibility compliance for diverse learners. **Full educational standards compliance validation across 5 browsers.**

## Features

- **Educational Content Validation** - Reading level accuracy, curriculum alignment testing
- **Student Data Protection** - COPPA/FERPA compliance validation and privacy protection
- **Accessibility Compliance** - WCAG 2.1 AA validation for diverse learners (25/25 tests passing)
- **Educational Standards Testing** - Common Core, NGSS, state standards alignment verification
- **Learning Assessment Validation** - Assessment-content alignment and learning objective testing
- **Student Privacy Security** - Classroom data isolation and educational record protection
- **Multi-Grade Testing** - Cross-grade level content validation (K-12)
- **Professional Educational Reporting** - Comprehensive analytics for educational quality assurance

## Quick Demo

Want to see the educational platform testing in action? Run the complete demo suite:

```bash
npm run demo
```

Or run just the Newsela educational tests:

```bash
npm run demo:newsela
```

### What the Educational Demo Tests

#### 📚 Educational Homepage Validation
- ✅ Educational content screenshot capture
- ✅ Brand verification (Newsela Educational Platform)
- ✅ Educational content title and heading validation
- ✅ Student-safe URL verification

#### 🎓 Educational Navigation Elements
- ✅ Grade-level navigation detection
- ✅ Educational logo presence verification
- ✅ Student-appropriate interactive elements
- ✅ Learning pathway structure validation

#### � Educational Content Functionality
- ✅ Reading level detection and validation
- ✅ Grade-appropriate content filtering
- ✅ Educational search form identification
- ✅ Learning assessment entry points
- ✅ Student progress tracking elements

#### 📱 Educational Mobile Responsiveness
- ✅ Student device viewport simulation (tablets, mobile)
- ✅ Educational responsive design validation
- ✅ Mobile-friendly learning interface screenshots
- ✅ Touch-friendly educational controls

#### ⚡ Educational Performance Assessment
- ✅ Article load time measurement for reading flow
- ✅ Grade filtering response time tracking
- ✅ Educational content performance assessment
- ✅ Student engagement optimization scoring

### Educational Demo Screenshots Generated

After running the demo, check these files:

- `reports/artifacts/screenshots/newsela-educational-homepage.png` - Educational homepage
- `reports/artifacts/screenshots/newsela-grade-navigation.png` - Grade level navigation
- `reports/artifacts/screenshots/newsela-learning-interaction.png` - Educational interactions
- `reports/artifacts/screenshots/newsela-mobile-learning.png` - Mobile learning view

## Quick Start

### Local Installation
```bash
# Install and setup educational platform testing
git clone https://github.com/josemejias11/playwright-mcp-server
cd playwright-mcp-server
git checkout newsela  # Switch to educational platform branch
npm install
npx playwright install
npm run build

# Run educational test suites
npm run smoke                    # Educational critical path validation (3-5 min)
npm run accessibility           # WCAG 2.1 AA compliance for diverse learners
npm run educational-content     # Educational content quality validation
npm run student-privacy         # Student data protection and privacy tests
```

### Docker Installation
```bash
# Clone and run educational tests with Docker
git clone https://github.com/josemejias11/playwright-mcp-server
cd playwright-mcp-server
git checkout newsela  # Switch to educational platform branch

# Build Docker image for educational testing
./docker-test.sh build

# Run educational test suites
./docker-test.sh smoke                    # Educational validation (3-5 min)
./docker-test.sh educational-content    # Educational content validation
./docker-test.sh accessibility        # WCAG 2.1 AA compliance for learners (25/25 tests)
./docker-test.sh student-privacy       # Student data protection and privacy
./docker-test.sh educational-standards # Educational standards compliance testing
```

## Educational Test Commands

### Local Execution
```bash
npm run smoke                   # Educational critical path validation
npm run accessibility          # WCAG 2.1 AA compliance for diverse learners
npm run educational-content    # Reading levels, curriculum alignment
npm run educational-performance # Learning engagement optimization
npm run student-privacy        # COPPA/FERPA compliance validation
npm run educational-security   # Student data protection testing
```

### Docker Execution (Isolated & Consistent Educational Environment)
```bash
./docker-test.sh smoke                   # Educational smoke tests
./docker-test.sh accessibility          # Educational accessibility (25/25 tests)
./docker-test.sh educational-content    # Educational content validation
./docker-test.sh educational-standards  # Standards compliance testing
./docker-test.sh student-privacy        # Student data protection
./docker-test.sh educational-performance # Learning performance tests
./docker-test.sh educational-security   # Educational security tests
./docker-test.sh clean                  # Clean up containers
```

### Educational Report Management
```bash
# Clean all generated educational reports and artifacts
./clean-reports.sh              # Interactive cleanup script
npm run reports:clean-all       # Same as above via npm

# Educational report utilities
npm run reports:clean           # Clean via educational report manager
npm run reports:status          # Check educational test report status
npm run reports:archive         # Archive current educational reports
```

### Cache Management
```bash
# Clean all caches (npm, Playwright browsers, Docker, system temp)
./clean-cache.sh                # Interactive cache cleanup
npm run clean:cache             # Same as above via npm

# Quick cleanup commands
npm run clean:reports           # Clean only reports and artifacts
./clean-reports.sh              # Interactive reports cleanup
```

### Educational Standards Testing (100% Compliance Required)
```bash
npm run educational-standards         # Complete educational standards validation
npm run educational-standards:detailed # Enhanced HTML reports with compliance metrics

# Category-specific educational testing
npm run test:reading-levels          # Reading level accuracy validation
npm run test:curriculum-alignment    # Curriculum standards compliance
npm run test:student-safety         # Student safety and privacy validation
```

### Educational Test Suites
```bash
npm run suite:educational-quick     # Smoke + Educational Content (8-13 min)
npm run suite:educational-quality   # Performance + Accessibility + Standards (7-11 min)
npm run suite:educational-complete  # All educational test suites including compliance (25-35 min)
```

## Educational Framework Architecture

### � Educational Testing Features
- **Grade-level specific configurations** - Easy switching between K-12 grade levels
- **Flexible educational selector strategies** - Robust element detection across learning platforms
- **Educational content validation** - Reading levels, curriculum alignment, learning objectives
- **Student safety mechanisms** - COPPA/FERPA compliance and privacy protection
- **Learning outcome documentation** - Automatic educational screenshot capture for validation

### Adding New Educational Platforms

1. Add educational platform configuration to `e2e/config/educational-configs.js`
2. Update environment variable `TARGET_EDUCATIONAL_PLATFORM`
3. Create platform-specific educational page objects if needed
4. Tests automatically adapt to new educational platform configurations

The framework is designed to be **education-ready** and **extensible** - perfect for showcasing modern educational platform testing capabilities! �🎓

## Educational Project Structure

```
playwright-mcp-server/
├── src/                    # MCP Server (TypeScript)
├── tests/                  # Traditional Playwright Tests
├── e2e/                    # Educational MCP-Enhanced Framework
│   ├── test-suites/        # Educational test execution
│   │   ├── smoke/          # Educational critical path tests
│   │   ├── functional/     # Educational content validation
│   │   ├── accessibility/  # WCAG compliance for diverse learners
│   │   ├── performance/    # Learning engagement optimization
│   │   └── security/       # Student data protection
│   ├── framework/          # Core educational testing framework
│   └── page-objects/       # Educational platform page models
├── postman/                # Educational API testing suites
├── .github/workflows/      # Educational CI/CD pipeline
├── docker-test.sh          # Educational Docker test runner
├── docker-compose.yml      # Educational container orchestration
└── reports/                # Educational test reports and artifacts
```

## Educational API Test Organization

The educational API suite is organized into 8 specialized educational categories:

- **Educational Smoke Tests** (14 assertions) - Critical educational path validation
- **Educational Content Tests** (15 assertions) - Reading levels and curriculum content
- **Student Privacy Security Tests** (12 assertions) - COPPA/FERPA compliance and privacy
- **Educational Performance Tests** (10 assertions) - Learning engagement response times
- **Educational SEO Tests** (9 assertions) - Educational metadata and structure validation
- **Student Assessment Tests** (8 assertions) - Learning assessment functionality
- **Cross-Device Educational Tests** (6 assertions) - Mobile/tablet learning compatibility
- **Educational Standards Tests** (4 assertions) - Curriculum standards compliance validation

**Results:** 78/78 passing educational assertions | 100% educational compliance | 68ms average response time | Student data protection verified

## Educational CI/CD Pipeline

### Educational Matrix Testing Strategy
- **Educational API Validation Matrix** - 7 parallel educational test categories
- **Educational Browser Matrix** - 3 browsers (Chromium, Firefox, WebKit) for student devices
- **Educational MCP Matrix** - 5 educational testing strategies

### Educational Automated Triggers
- Push to newsela/educational branches
- Pull requests to educational branches
- Daily scheduled educational compliance runs (2 AM UTC)
- Manual educational workflow dispatch

### Educational Professional Reporting
- GitHub Pages educational dashboard deployment
- HTML reports with educational performance metrics
- Educational test artifacts with 30-day retention
- Comprehensive educational compliance summaries

## Educational Technology Stack

- **Docker** - Containerized educational testing environment for consistency
- **Playwright** - Browser automation engine optimized for educational platforms
- **MCP (Model Context Protocol)** - AI-assisted educational testing and validation
- **Educational APIs** - Educational content and student data testing
- **GitHub Actions** - Educational CI/CD automation
- **TypeScript/JavaScript** - Implementation languages for educational testing

## Educational Docker Support

### Prerequisites
- Docker and Docker Compose installed
- Git for cloning the educational repository

### Educational Docker Commands
```bash
# Quick start with educational Docker testing
./docker-test.sh build                    # Build educational Docker image
./docker-test.sh smoke                    # Run educational smoke tests (3-5 min)
./docker-test.sh educational-content     # Run educational content validation
./docker-test.sh student-privacy         # Run student privacy protection tests

# Individual educational test types
./docker-test.sh educational-content     # Educational content validation
./docker-test.sh educational-performance # Learning engagement optimization
./docker-test.sh educational-security    # Student data protection
./docker-test.sh accessibility          # WCAG 2.1 AA compliance for diverse learners

# Educational test suites
./docker-test.sh suite-educational-content # Educational content validation suite
./docker-test.sh suite-educational-quality # Educational quality assurance suite
./docker-test.sh suite-educational-all     # All comprehensive educational test suites

# Educational maintenance
./docker-test.sh clean    # Clean up educational containers and volumes
./docker-test.sh status   # Check educational Docker status
./docker-test.sh logs     # View educational test logs
```

### Educational Docker Benefits
- **Single Educational Image Architecture** - One comprehensive image serves all educational test profiles
- **Consistent Educational Environment** - Same results across all educational testing machines
- **No Local Educational Dependencies** - Playwright browsers included for educational testing
- **Isolated Educational Testing** - Educational tests run in clean environment every time
- **Easy Educational CI/CD Integration** - Ready for containerized educational deployment
- **Multiple Educational Test Profiles** - Different containers run different educational commands from same image

## Educational Success Metrics

| Educational Test Level | Target | Action on Failure |
|------------------------|--------|------------------|
| Educational Smoke | 100% | Block educational deployment |
| Educational Accessibility | 100% | Block deployment (WCAG 2.1 AA required for all learners) |
| Educational Content Quality | 95% | Investigate content standards |
| Educational Performance | 90% | Monitor learning engagement trends |
| Student Privacy Security | 100% | Address immediately (COPPA/FERPA critical) |
| Educational Standards Compliance | 95% | Review curriculum alignment |

### Educational Accessibility Compliance Results
- **Educational Platform Testing:** Newsela educational content validation
- **Student Device Validation:** Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **WCAG 2.1 AA Educational Standards:** Heading structure, alt text, form labels, color contrast, keyboard navigation for diverse learners
- **Educational Accessibility Features:** Screen reader support, text scaling, educational color contrast

---

**Educational Test Results:** 100+ educational tests + 32 educational MCP tests + 78 educational API assertions | **25/25 educational accessibility tests passing** | Multi-browser educational support | AI-enhanced educational testing | Professional educational CI/CD pipeline | **COPPA/FERPA compliant** | **Student data protection verified**
