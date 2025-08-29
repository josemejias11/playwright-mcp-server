# MCP Server with WebDriverIO and TypeScript

A Model Context Protocol (MCP) server implementation for web automation using WebDriverIO and TypeScript.

## Overview

This project provides an MCP server that enables web automation capabilities through WebDriverIO, allowing AI assistants and other MCP clients to interact with web applications programmatically.

## Features

- **MCP Server**: Implements Model Context Protocol for AI assistant integration
- **WebDriverIO**: Cross-browser automation capabilities
- **TypeScript**: Type-safe development environment
- **Cross-browser Support**: Chrome, Firefox, Safari, and Edge
- **Extensible Architecture**: Easy to add new automation tools and capabilities

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Web browsers for testing (Chrome, Firefox, etc.)

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd playwright-mcp-server

# Install dependencies
npm run setup
```

## Configuration

The MCP server can be configured through environment variables or configuration files:

- `MCP_PORT`: Server port (default: 3000)
- `WEBDRIVER_HEADLESS`: Run tests in headless mode (default: true)
- `WEBDRIVER_TIMEOUT`: Default timeout for operations (default: 30000ms)

## Usage

### Starting the MCP Server

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm run build
npm start

# MCP server only
npm run mcp:server
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with browser visible
npm run test:headed

# Debug mode
npm run test:debug
```

## MCP Tools Available

The server exposes the following tools through the MCP protocol:

- `navigate`: Navigate to a specified URL
- `click`: Click on elements using various selectors
- `type`: Input text into form fields
- `screenshot`: Capture page screenshots
- `get_text`: Extract text content from elements
- `wait_for_element`: Wait for elements to appear/disappear

## Development

### Project Structure

```
src/
├── index.ts          # Main application entry
├── mcp-server.ts     # MCP server implementation
├── tools/            # MCP tool implementations
├── webdriver/        # WebDriverIO utilities
└── types/            # TypeScript type definitions

tests/
├── specs/            # Test specifications
└── fixtures/         # Test data and fixtures

dist/                 # Compiled JavaScript output
```

### Building

```bash
# Compile TypeScript
npm run build

# Watch mode for development
npm run dev
```

### Linting

```bash
# Check code style
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

## Integration with AI Assistants

This MCP server can be integrated with AI assistants that support the Model Context Protocol:

1. Start the MCP server
2. Configure your AI assistant to connect to the server
3. Use natural language to request web automation tasks

Example MCP client configuration:
```json
{
  "name": "web-automation",
  "type": "stdio",
  "command": "npm",
  "args": ["run", "mcp:server"]
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Create an issue in the repository
- Check the documentation
- Review existing issues for solutions
