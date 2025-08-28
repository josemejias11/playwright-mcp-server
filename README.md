# Playwright MCP Server QA Automation Framework

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![API Tests](https://img.shields.io/badge/API%20Tests-100%25%20Success-brightgreen.svg)](https://github.com/josemejias11/playwright-mcp-server)
[![CI Pipeline](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue.svg)](https://github.com/josemejias11/playwright-mcp-server/actions)
[![Branch Strategy](https://img.shields.io/badge/Branch%20Strategy-Website%20Specific-orange.svg)](https://github.com/josemejias11/playwright-mcp-server/branches)

## 🚀 Pure Core Framework Architecture

A **branch-per-website** automation framework that maintains a **pure core framework** on the main branch, with website-specific implementations isolated in dedicated branches. This approach ensures clean separation of concerns, independent development, and maximum reusability.

### 🌟 Branch Strategy Overview

```
📁 Repository Structure:
├── 🏠 main      → Pure Core Framework (no website-specific code)
├── 🚢 RRCL      → Royal Caribbean specific tests
├── 📚 newsela   → Newsela educational platform tests
├── 🏀 nba       → NBA.com sports testing (example implementation)
└── 🌐 [future]  → Additional websites as new branches
```

### ✨ Core Framework Benefits

- **🧩 Pure Separation**: Main branch contains only reusable framework components
- **🎯 Focused Development**: Each branch is optimized for its specific website
- **🚀 Easy Scaling**: Add new websites by creating branches from main
- **🔄 Independent Updates**: Website teams work without conflicts
- **📋 Consistent Patterns**: Same framework structure, different implementations
- **🛡️ Clean Maintenance**: Core improvements benefit all branches

## Quick Start Guide

### 🎯 Choose Your Path

**Option 1: Core Framework Development**
```bash
git checkout main               # Work on core framework
node demo.js                   # See framework guide
```

**Option 2: Website-Specific Testing**
```bash
# Royal Caribbean
git checkout RRCL               # Switch to Royal Caribbean branch
node demo.js                   # Run RRCL-specific demo

# Newsela Educational Platform  
git checkout newsela            # Switch to Newsela branch
node demo.js                   # Run Newsela-specific demo

# NBA.com (Example Implementation)
git checkout nba                # Switch to NBA branch
node demo.js                   # Run NBA-specific demo
```

**Option 3: Create New Website Implementation**
```bash
git checkout main               # Start from core framework
git checkout -b espn            # Create new branch for ESPN.com
# Follow the framework extension patterns
# Update .env with ESPN-specific configuration
# Create ESPN page objects and test suites
```

### 🚀 Framework Features by Branch

#### 🏠 Main Branch (Core Framework)
- **Pure Framework Components**: Base classes, utilities, reporting
- **Generic Configurations**: Reusable patterns and structures  
- **Documentation**: CORE_FRAMEWORK.md with detailed architecture
- **Template Guide**: Branch creation and extension instructions

#### 🚢 RRCL Branch (Royal Caribbean)
- **Cruise-Specific Tests**: Booking flows, ship information, destinations
- **Travel Industry Focus**: Vacation packages, loyalty programs, mobile booking
- **Maritime Selectors**: Cruise-specific UI elements and navigation patterns

#### 📚 Newsela Branch (Educational Platform)  
- **Educational Content**: Article reading, comprehension assessments
- **Learning Management**: Student progress, teacher dashboards, assignments
- **Accessibility Focus**: Educational accessibility standards and compliance

#### 🏀 NBA Branch (Sports Content)
- **Sports-Specific Tests**: Team pages, player statistics, game scores
- **Real-time Data**: Live game updates, standings, performance metrics
- **Mobile-First**: Optimized for sports content consumption patterns

### 🛠️ Installation & Setup

```bash
# Clone repository and install dependencies
git clone https://github.com/josemejias11/playwright-mcp-server
cd playwright-mcp-server
npm install
npx playwright install
npm run build

# Choose your branch and start testing
git checkout RRCL               # Royal Caribbean testing
git checkout newsela            # Educational platform testing  
git checkout nba                # Sports content testing
git checkout main               # Core framework development
```

### 🐳 Docker Support (Recommended)

```bash
# Clone and run with Docker (isolated environment)
git clone https://github.com/josemejias11/playwright-mcp-server
cd playwright-mcp-server

# Switch to desired website branch
git checkout RRCL               # or newsela, nba, etc.

# Build and run tests in Docker
./docker-test.sh build          # Build Docker image
./docker-test.sh smoke          # Quick validation (3-5 min)
./docker-test.sh test           # Comprehensive test suite
```
./docker-test.sh api           # API tests (78/78 assertions)  
./docker-test.sh accessibility # WCAG 2.1 AA compliance (25/25 tests)
./docker-test.sh test          # Comprehensive test suite
```

## 🧪 Testing Commands

### Branch-Specific Test Execution

**Note**: Switch to the appropriate branch before running website-specific tests.

```bash
# Core Framework Testing (main branch)
git checkout main
npm run test:framework         # Test core framework components
npm run build                  # Build MCP server

# Website-Specific Testing (any website branch)
git checkout RRCL              # or newsela, nba, etc.
npm run smoke                  # Critical path validation  
npm run functional             # Content and functionality tests
npm run accessibility          # WCAG 2.1 AA compliance
npm run performance            # Load time validation
npm run security               # Security validation
```

### Docker Testing (Cross-Platform Consistency)

```bash
# Docker testing maintains consistency across all environments
./docker-test.sh smoke          # Smoke tests in isolated container
./docker-test.sh accessibility  # Accessibility compliance (25/25 tests)
./docker-test.sh functional     # Functional tests
./docker-test.sh api            # API tests (78/78 assertions)
./docker-test.sh performance    # Performance benchmarks
./docker-test.sh security       # Security validation
./docker-test.sh test           # Comprehensive test suite
./docker-test.sh clean          # Clean up containers
```

### Combined Test Strategies

```bash
npm run suite:quick             # Smoke + Functional (8-13 min)
npm run suite:quality           # Performance + Accessibility + Security (7-11 min)  
npm run suite:all               # All test suites (25-35 min)
```

### Report Management
```bash
# Clean all generated reports and artifacts
./clean-reports.sh              # Interactive cleanup script
npm run reports:clean-all       # Same as above via npm

# Other report utilities
npm run reports:clean           # Clean via report manager
npm run reports:status          # Check report status
npm run reports:archive         # Archive current reports
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

## 🏗️ Framework Architecture

### Core Framework Design (Main Branch)

```
📁 Core Framework Components:
├── 🧪 e2e/framework/base-test-framework.js    # Base testing utilities
├── 📄 e2e/page-objects/base-page.js           # Base page object class  
├── ⚙️  e2e/config/test-config.js               # Generic configuration
├── 📊 e2e/utils/                               # Reporting and logging
├── 🐳 docker-compose.yml                       # Container orchestration
├── 📋 playwright.config.js                     # Playwright setup
└── 📖 CORE_FRAMEWORK.md                        # Architecture documentation
```

### Website-Specific Extensions (Branch Pattern)

Each website branch extends the core framework with:

```
📁 Website Branch Structure:
├── ⚙️  .env                                    # Website-specific environment
├── 🎯 e2e/config/[website]-config.js          # Extended configuration  
├── 📄 e2e/page-objects/[website]-pages.js     # Website page objects
├── 🧪 e2e/test-suites/                        # Website test suites
├── 🎬 demo.js                                  # Website-specific demo
└── 📋 Updated package.json scripts             # Website-specific commands
```

### 🎯 Framework Benefits

- **🔄 Reusable Core**: All branches inherit proven framework utilities
- **🎯 Focused Development**: Each branch optimized for specific website needs  
- **🚀 Fast Onboarding**: New websites follow established patterns
- **🛡️ Isolated Changes**: Website changes don't affect other implementations
- **📈 Scalable Growth**: Easy to add new websites and team members
- **🔧 Consistent Tooling**: Same reporting, Docker, and CI/CD across all branches

### Adding New Websites

1. **Create Branch**: `git checkout main && git checkout -b [website-name]`
2. **Configure Environment**: Update `.env` with website-specific settings
3. **Extend Configuration**: Create `[website]-config.js` extending core config
4. **Build Page Objects**: Create website-specific page object classes
5. **Write Test Suites**: Implement test scenarios using framework patterns
6. **Customize Demo**: Update `demo.js` to showcase website functionality

The framework automatically handles browser management, reporting, Docker integration, and CI/CD pipeline configuration! 🚀

## 📁 Project Structure

```
playwright-mcp-server/
├── 🏠 Main Branch (Core Framework)
│   ├── src/                    # MCP Server (TypeScript)
│   ├── e2e/framework/          # Core framework utilities
│   ├── e2e/page-objects/       # Base page object classes
│   ├── e2e/config/             # Generic configuration templates
│   ├── e2e/utils/              # Reporting and logging utilities
│   ├── docker-compose.yml      # Container orchestration
│   ├── playwright.config.js    # Base Playwright configuration  
│   ├── CORE_FRAMEWORK.md       # Architecture documentation
│   └── demo.js                 # Core framework guide
│
├── 🚢 RRCL Branch (Royal Caribbean)
│   ├── .env                    # Royal Caribbean environment
│   ├── e2e/config/rccl-config.js      # Cruise-specific configuration
│   ├── e2e/page-objects/       # Cruise booking page objects
│   ├── e2e/test-suites/        # Cruise industry test scenarios
│   └── demo.js                 # Royal Caribbean demo
│
├── 📚 Newsela Branch (Educational)
│   ├── .env                    # Educational platform environment
│   ├── e2e/config/newsela-config.js   # Educational content configuration
│   ├── e2e/page-objects/       # Learning management page objects  
│   ├── e2e/test-suites/        # Educational platform test scenarios
│   └── demo.js                 # Newsela educational demo
│
├── 🏀 NBA Branch (Sports)
│   ├── .env                    # Sports content environment
│   ├── e2e/config/nba-config.js       # Sports-specific configuration
│   ├── e2e/page-objects/       # Sports content page objects
│   ├── e2e/test-suites/        # Sports content test scenarios
│   └── demo.js                 # NBA sports demo
│
└── 📊 Shared Across All Branches
    ├── .github/workflows/       # CI/CD Pipeline (adapts to active branch)
    ├── postman/                # API Testing Suites
    ├── reports/                # Test reports and artifacts
    ├── docker-test.sh          # Docker test runner
    └── clean-*.sh              # Cleanup utilities
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

## 🔄 Branch Workflow Guide

### For QA Engineers

```bash
# Working on Royal Caribbean tests
git checkout RRCL
node demo.js                    # See RRCL-specific capabilities
npm run smoke                   # Run Royal Caribbean smoke tests
npm run functional              # Test cruise booking flows

# Working on Educational Platform tests  
git checkout newsela
node demo.js                    # See Newsela-specific capabilities
npm run accessibility           # Educational accessibility compliance
npm run functional              # Test learning management features

# Working on Sports Content tests
git checkout nba  
node demo.js                    # See NBA-specific capabilities
npm run performance             # Test sports content load times
npm run functional              # Test team/player navigation
```

### For Framework Developers

```bash
# Working on core framework improvements
git checkout main
node demo.js                    # See core framework guide
npm run build                   # Build MCP server updates
npm run test:framework          # Test framework components

# Creating new website implementation
git checkout main               # Start from clean core
git checkout -b espn            # Create ESPN branch
# Follow framework extension patterns from existing branches
```

### For DevOps/CI Engineers

```bash
# Each branch automatically triggers appropriate CI/CD
git push origin RRCL            # Triggers Royal Caribbean pipeline
git push origin newsela         # Triggers Newsela pipeline  
git push origin nba             # Triggers NBA pipeline
git push origin main            # Triggers core framework pipeline
```

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

## 🛠️ Technology Stack

- **🎭 Playwright** - Cross-browser automation engine (Chromium, Firefox, WebKit)
- **🤖 MCP (Model Context Protocol)** - AI-assisted testing and intelligent automation
- **🐳 Docker** - Containerized testing environment for consistency across platforms
- **📡 Postman/Newman** - API testing and comprehensive reporting (78/78 assertions)
- **⚡ GitHub Actions** - Branch-aware CI/CD automation with matrix testing
- **📝 TypeScript/JavaScript** - Type-safe implementation with ES6+ features
- **🎯 Branch Strategy** - Website-specific isolation with shared core framework

## 📊 Success Metrics & Quality Gates

### Branch-Specific Quality Standards

| Branch | Focus Area | Success Rate | Quality Gate |
|--------|------------|--------------|--------------|
| **🏠 main** | Core Framework | 100% | Block deployment on framework failures |
| **🚢 RRCL** | Cruise Booking | 95%+ | Business-critical path validation |
| **📚 newsela** | Educational Accessibility | 100% | WCAG 2.1 AA compliance required |
| **🏀 nba** | Sports Content Performance | 90%+ | Performance thresholds for real-time data |

### Universal Quality Requirements

| Test Level | Target | Action on Failure | Applied to All Branches |
|------------|--------|------------------|------------------------|
| **Smoke Tests** | 100% | Block deployment | ✅ Critical path validation |
| **Accessibility** | 100% | Block deployment | ✅ WCAG 2.1 AA compliance |
| **Security** | 95%+ | Address immediately | ✅ HTTPS, headers, data protection |
| **Performance** | 90%+ | Monitor trends | ✅ Page load, network, responsiveness |
| **API Tests** | 100% | Block deployment | ✅ 78/78 assertions across 8 categories |

### Cross-Browser Support

- **Desktop**: Chromium, Firefox, WebKit
- **Mobile**: Chrome Mobile, Safari Mobile  
- **Accessibility**: Screen readers, keyboard navigation
- **Performance**: Core Web Vitals, network analysis

---

## 🎉 Framework Summary

**Pure Core Framework Architecture** with **Branch-per-Website Strategy**

- **🏠 1 Core Framework** → Reusable components, utilities, and patterns
- **🌐 4+ Website Branches** → RRCL, Newsela, NBA, and growing
- **📊 200+ Tests** → Traditional Playwright + MCP + API validation
- **🎯 100% Success Rate** → API tests (78/78) and accessibility compliance (25/25)
- **🔄 Independent Development** → Teams work in isolation without conflicts
- **🚀 Easy Scaling** → Add new websites by branching from main

### 🏆 Key Achievements

✅ **Pure Separation of Concerns** - Clean core framework with focused website implementations  
✅ **Cross-Browser Excellence** - 5+ browsers with full accessibility compliance  
✅ **AI-Enhanced Testing** - Model Context Protocol integration for intelligent automation  
✅ **Enterprise CI/CD** - Branch-aware pipelines with matrix testing strategies  
✅ **100% API Success** - 8 categorized test suites with comprehensive validation  
✅ **Docker Excellence** - Consistent containerized testing across all environments  

**Ready for any website, any team, any scale! 🚀**
