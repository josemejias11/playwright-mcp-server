#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { chromium, firefox, webkit, Browser, Page, BrowserContext } from "playwright";

// Server configuration
const server = new McpServer({
  name: "playwright-automation",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Global browser management
let currentBrowser: Browser | null = null;
let currentContext: BrowserContext | null = null;
let currentPage: Page | null = null;

// Helper function to ensure browser is launched
async function ensureBrowser(browserType: "chromium" | "firefox" | "webkit" = "chromium"): Promise<Browser> {
  if (currentBrowser && currentBrowser.isConnected()) {
    return currentBrowser;
  }

  try {
    switch (browserType) {
      case "firefox":
        currentBrowser = await firefox.launch({ headless: false });
        break;
      case "webkit":
        currentBrowser = await webkit.launch({ headless: false });
        break;
      default:
        currentBrowser = await chromium.launch({ headless: false });
    }
    
    console.error(`Launched ${browserType} browser`);
    return currentBrowser;
  } catch (error) {
    throw new Error(`Failed to launch ${browserType} browser: ${error}`);
  }
}

// Helper function to ensure page is available
async function ensurePage(): Promise<Page> {
  if (currentPage && !currentPage.isClosed()) {
    return currentPage;
  }

  const browser = await ensureBrowser();
  
  if (!currentContext) {
    currentContext = await browser.newContext();
  }
  
  currentPage = await currentContext.newPage();
  console.error("Created new page");
  return currentPage;
}

// Cleanup function
async function cleanup() {
  try {
    if (currentPage && !currentPage.isClosed()) {
      await currentPage.close();
    }
    if (currentContext) {
      await currentContext.close();
    }
    if (currentBrowser && currentBrowser.isConnected()) {
      await currentBrowser.close();
    }
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
}

// Register browser management tools
server.tool(
  "launch-browser",
  "Launch a browser instance",
  {
    browserType: z.enum(["chromium", "firefox", "webkit"]).optional().describe("Browser type to launch"),
    headless: z.boolean().optional().describe("Run browser in headless mode"),
  },
  async ({ browserType = "chromium", headless = false }) => {
    try {
      // Close existing browser if any
      await cleanup();

      let browser: Browser;
      switch (browserType) {
        case "firefox":
          browser = await firefox.launch({ headless });
          break;
        case "webkit":
          browser = await webkit.launch({ headless });
          break;
        default:
          browser = await chromium.launch({ headless });
      }

      currentBrowser = browser;
      currentContext = await browser.newContext();
      currentPage = await currentContext.newPage();

      return {
        content: [
          {
            type: "text",
            text: `Successfully launched ${browserType} browser (headless: ${headless})`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to launch browser: ${error}`,
          },
        ],
      };
    }
  }
);

server.tool(
  "navigate-to",
  "Navigate to a URL",
  {
    url: z.string().url().describe("The URL to navigate to"),
    waitUntil: z.enum(["load", "domcontentloaded", "networkidle"]).optional().describe("When to consider navigation finished"),
  },
  async ({ url, waitUntil = "load" }) => {
    try {
      const page = await ensurePage();
      await page.goto(url, { waitUntil });

      const title = await page.title();
      const currentUrl = page.url();

      return {
        content: [
          {
            type: "text",
            text: `Successfully navigated to: ${currentUrl}\nPage title: ${title}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to navigate to ${url}: ${error}`,
          },
        ],
      };
    }
  }
);

server.tool(
  "take-screenshot",
  "Take a screenshot of the current page",
  {
    path: z.string().optional().describe("Path to save the screenshot"),
    fullPage: z.boolean().optional().describe("Capture full page"),
  },
  async ({ path, fullPage = false }) => {
    try {
      const page = await ensurePage();
      const screenshot = await page.screenshot({ 
        path, 
        fullPage,
        type: 'png'
      });

      return {
        content: [
          {
            type: "text",
            text: path 
              ? `Screenshot saved to: ${path}` 
              : "Screenshot captured (buffer returned)",
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to take screenshot: ${error}`,
          },
        ],
      };
    }
  }
);

server.tool(
  "click-element",
  "Click on an element by selector",
  {
    selector: z.string().describe("CSS selector or text to find the element"),
    timeout: z.number().optional().describe("Timeout in milliseconds"),
  },
  async ({ selector, timeout = 30000 }) => {
    try {
      const page = await ensurePage();
      await page.click(selector, { timeout });

      return {
        content: [
          {
            type: "text",
            text: `Successfully clicked element: ${selector}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to click element ${selector}: ${error}`,
          },
        ],
      };
    }
  }
);

server.tool(
  "fill-input",
  "Fill an input field with text",
  {
    selector: z.string().describe("CSS selector for the input field"),
    text: z.string().describe("Text to fill in the input"),
    timeout: z.number().optional().describe("Timeout in milliseconds"),
  },
  async ({ selector, text, timeout = 30000 }) => {
    try {
      const page = await ensurePage();
      await page.fill(selector, text, { timeout });

      return {
        content: [
          {
            type: "text",
            text: `Successfully filled input ${selector} with: ${text}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to fill input ${selector}: ${error}`,
          },
        ],
      };
    }
  }
);

server.tool(
  "get-text",
  "Get text content from an element",
  {
    selector: z.string().describe("CSS selector for the element"),
    timeout: z.number().optional().describe("Timeout in milliseconds"),
  },
  async ({ selector, timeout = 30000 }) => {
    try {
      const page = await ensurePage();
      const text = await page.textContent(selector, { timeout });

      return {
        content: [
          {
            type: "text",
            text: `Text from ${selector}: ${text || '(no text found)'}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to get text from ${selector}: ${error}`,
          },
        ],
      };
    }
  }
);

server.tool(
  "wait-for-element",
  "Wait for an element to appear",
  {
    selector: z.string().describe("CSS selector for the element to wait for"),
    state: z.enum(["attached", "detached", "visible", "hidden"]).optional().describe("State to wait for"),
    timeout: z.number().optional().describe("Timeout in milliseconds"),
  },
  async ({ selector, state = "visible", timeout = 30000 }) => {
    try {
      const page = await ensurePage();
      await page.waitForSelector(selector, { state, timeout });

      return {
        content: [
          {
            type: "text",
            text: `Element ${selector} is now ${state}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to wait for element ${selector}: ${error}`,
          },
        ],
      };
    }
  }
);

server.tool(
  "evaluate-javascript",
  "Execute JavaScript code in the browser context",
  {
    code: z.string().describe("JavaScript code to execute"),
  },
  async ({ code }) => {
    try {
      const page = await ensurePage();
      const result = await page.evaluate(code);

      return {
        content: [
          {
            type: "text",
            text: `JavaScript execution result: ${JSON.stringify(result)}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to execute JavaScript: ${error}`,
          },
        ],
      };
    }
  }
);

server.tool(
  "close-browser",
  "Close the current browser instance",
  {},
  async () => {
    try {
      await cleanup();
      currentBrowser = null;
      currentContext = null;
      currentPage = null;

      return {
        content: [
          {
            type: "text",
            text: "Browser closed successfully",
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to close browser: ${error}`,
          },
        ],
      };
    }
  }
);

server.tool(
  "get-page-info",
  "Get information about the current page",
  {},
  async () => {
    try {
      const page = await ensurePage();
      const title = await page.title();
      const url = page.url();
      const viewport = page.viewportSize();

      return {
        content: [
          {
            type: "text",
            text: `Page Information:
Title: ${title}
URL: ${url}
Viewport: ${viewport?.width}x${viewport?.height}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to get page info: ${error}`,
          },
        ],
      };
    }
  }
);

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.error('Received SIGINT, cleaning up...');
  await cleanup();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.error('Received SIGTERM, cleaning up...');
  await cleanup();
  process.exit(0);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Playwright MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
