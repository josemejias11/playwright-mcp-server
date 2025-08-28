# Core Automated Testing Framework

This is the main branch containing the core automation framework without website-specific implementations.

## 🏗️ Architecture

The framework follows a **branch-per-website** strategy for clean separation of concerns:

```
main branch (Core Framework)
├── 🌟 Framework utilities
├── 🧪 Base test classes  
├── 🔌 MCP server integration
├── 📊 Reporting infrastructure
└── 🛠️ Configuration system

RRCL branch (Royal Caribbean)
├── 🚢 Inherits core framework
├── 🎯 RC-specific page objects
├── ⚙️ Cruise line configurations
└── 🧪 Royal Caribbean demo

newsela branch (Newsela Educational)
├── 📚 Inherits core framework  
├── 🎓 Educational page objects
├── ⚙️ Learning platform configurations
└── 🧪 Newsela educational demo
```

## 🎯 Usage

### Core Framework Development
```bash
git checkout main
# Work on framework utilities, base classes, MCP server
```

### Website-Specific Testing

#### Royal Caribbean Testing
```bash
git checkout RRCL
node demo.js  # Runs Royal Caribbean tests
```

#### Newsela Educational Testing  
```bash
git checkout newsela
node demo.js  # Runs Newsela educational tests
```

## 🔧 Core Components

### Framework Base Classes
- `BaseTestFramework` - Core testing infrastructure
- `BasePage` - Common page object functionality
- `TestConfig` - Multi-website configuration system

### MCP Integration
- Model Context Protocol server for browser automation
- Advanced testing capabilities through AI integration
- Screenshot and artifact management

### Reporting System
- HTML and JSON report generation
- Performance metrics tracking
- Screenshot and video capture
- Test execution summaries

### Configuration Management
- Environment-based configurations
- Website-specific settings
- Timeout and browser management
- Multi-website support

## 🚀 Adding New Websites

1. Create new branch from main:
   ```bash
   git checkout main
   git checkout -b new-website-name
   ```

2. Add website-specific configurations:
   - Update `.env` with website settings
   - Create website-specific page objects
   - Add demo file for the website

3. Update `demo.js` for the new website

4. Test and commit changes

## 📋 Branch Strategy Benefits

- **Clean Separation**: Each website has its isolated environment
- **Maintainable**: Core framework changes don't affect website tests
- **Scalable**: Easy to add new websites without complexity
- **Focused**: Each branch optimized for its specific target
- **Parallel Development**: Teams can work independently

## 🔄 Workflow

1. **Core Development**: Work on main branch for framework improvements
2. **Website Testing**: Switch to specific branch for testing
3. **Feature Addition**: Create new branches from main for new websites
4. **Integration**: Merge core improvements to website branches as needed

This approach ensures the framework remains clean, maintainable, and scalable while providing focused environments for each testing target.
