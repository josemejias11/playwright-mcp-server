# WebDriverIO MCP Server

A Model Context Protocol (MCP) server that provides web automation capabilities using WebDriverIO. This server allows AI assistants to perform web browser automation tasks through a standardized protocol.

## Features

- **Browser Navigation**: Navigate to URLs, go back/forward, refresh pages
- **Element Interactions**: Click, type, hover, scroll to elements
- **Form Automation**: Fill forms, select dropdown options
- **Information Extraction**: Get text content, page titles, current URLs
- **Screenshots**: Capture page screenshots
- **Element Waiting**: Wait for elements to become visible

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd webdriverio-mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Usage

### Running the MCP Server

```bash
# Development mode
npm run dev

# Production mode
npm run start
```

### Available Tools

The server provides the following tools for web automation:

#### Navigation Tools
- `navigate`: Navigate to a specific URL
- `go_back`: Navigate back to the previous page
- `go_forward`: Navigate forward to the next page
- `refresh_page`: Refresh the current page
- `get_current_url`: Get the current page URL
- `get_page_title`: Get the current page title

#### Element Interaction Tools
- `click`: Click on an element specified by CSS selector
- `type`: Type text into an input field
- `hover`: Hover over an element
- `scroll_to`: Scroll to an element or specific coordinates

#### Form Tools
- `fill_form`: Fill multiple form fields at once
- `select_option`: Select an option from a dropdown menu

#### Information Extraction Tools
- `get_text`: Get text content from an element
- `screenshot`: Take a screenshot of the current page

#### Utility Tools
- `wait_for_element`: Wait for an element to become visible

### Example Tool Usage

```javascript
// Navigate to a website
{
  "name": "navigate",
  "arguments": {
    "url": "https://example.com"
  }
}

// Click a button
{
  "name": "click",
  "arguments": {
    "selector": "#submit-button"
  }
}

// Fill a form
{
  "name": "fill_form",
  "arguments": {
    "fields": [
      {
        "selector": "#username",
        "value": "testuser"
      },
      {
        "selector": "#password",
        "value": "testpass"
      }
    ]
  }
}

// Take a screenshot
{
  "name": "screenshot",
  "arguments": {}
}
```

## Configuration

The WebDriverIO configuration is in `wdio.conf.ts`. You can modify browser settings, timeouts, and other options there.

Default configuration:
- Browser: Chrome
- Headless mode: Enabled
- Window size: 1920x1080
- Wait timeout: 10 seconds

## Development

### Scripts

- `npm run build`: Build the TypeScript project
- `npm run dev`: Run in development mode with hot reload
- `npm run start`: Run the built version
- `npm run test`: Run WebDriverIO tests
- `npm run clean`: Clean build artifacts

### Project Structure

```
src/
├── mcp-server.ts          # Main MCP server implementation
├── webdriver/
│   └── manager.ts         # WebDriver session management
└── tools/
    └── index.ts           # Tool definitions and schemas
```

## Browser Requirements

This server requires Chrome/Chromium to be installed on the system. The ChromeDriver will be automatically managed by the `wdio-chromedriver-service`.

## License

MIT
