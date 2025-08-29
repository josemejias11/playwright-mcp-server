import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { WebDriverManager } from './webdriver/manager.js';
import { registerWebAutomationTools } from './tools/index.js';

class MCPWebDriverServer {
  private server: Server;
  private webDriverManager: WebDriverManager;

  constructor() {
    this.server = new Server({
      name: 'webdriver-mcp-server',
      version: '1.0.0',
    });

    this.webDriverManager = new WebDriverManager();
    this.setupToolHandlers();
  }

  private setupToolHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: registerWebAutomationTools(),
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'navigate':
            return await this.handleNavigate(args as { url: string });
          
          case 'click':
            return await this.handleClick(args as { selector: string });
          
          case 'type':
            return await this.handleType(args as { selector: string; text: string });
          
          case 'screenshot':
            return await this.handleScreenshot();
          
          case 'get_text':
            return await this.handleGetText(args as { selector: string });
          
          case 'wait_for_element':
            return await this.handleWaitForElement(args as { selector: string; timeout?: number });
          
          case 'fill_form':
            return await this.handleFillForm(args as { fields: Array<{ selector: string; value: string }> });
          
          case 'select_option':
            return await this.handleSelectOption(args as { selector: string; value: string });
          
          case 'hover':
            return await this.handleHover(args as { selector: string });
          
          case 'scroll_to':
            return await this.handleScrollTo(args as { selector?: string; x?: number; y?: number });
          
          case 'get_page_title':
            return await this.handleGetPageTitle();
          
          case 'get_current_url':
            return await this.handleGetCurrentUrl();
          
          case 'refresh_page':
            return await this.handleRefreshPage();
          
          case 'go_back':
            return await this.handleGoBack();
          
          case 'go_forward':
            return await this.handleGoForward();
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Tool execution failed: ${errorMessage}`);
      }
    });
  }

  private async handleNavigate(args: { url: string }) {
    const driver = await this.webDriverManager.getDriver();
    await driver.url(args.url);
    
    return {
      content: [
        {
          type: 'text',
          text: `Successfully navigated to ${args.url}`,
        },
      ],
    };
  }

  private async handleClick(args: { selector: string }) {
    const driver = await this.webDriverManager.getDriver();
    const element = await driver.$(args.selector);
    await element.click();
    
    return {
      content: [
        {
          type: 'text',
          text: `Successfully clicked element with selector: ${args.selector}`,
        },
      ],
    };
  }

  private async handleType(args: { selector: string; text: string }) {
    const driver = await this.webDriverManager.getDriver();
    const element = await driver.$(args.selector);
    await element.setValue(args.text);
    
    return {
      content: [
        {
          type: 'text',
          text: `Successfully typed "${args.text}" into element: ${args.selector}`,
        },
      ],
    };
  }

  private async handleScreenshot() {
    const screenshotPath = await this.webDriverManager.takeScreenshot();
    const driver = await this.webDriverManager.getDriver();
    const screenshot = await driver.takeScreenshot();
    
    return {
      content: [
        {
          type: 'text',
          text: `Screenshot captured successfully and saved to: ${screenshotPath}`,
        },
        {
          type: 'image',
          data: screenshot,
          mimeType: 'image/png',
        },
      ],
    };
  }

  private async handleGetText(args: { selector: string }) {
    const driver = await this.webDriverManager.getDriver();
    const element = await driver.$(args.selector);
    const text = await element.getText();
    
    return {
      content: [
        {
          type: 'text',
          text: `Text from ${args.selector}: ${text}`,
        },
      ],
    };
  }

  private async handleWaitForElement(args: { selector: string; timeout?: number }) {
    const driver = await this.webDriverManager.getDriver();
    const element = await driver.$(args.selector);
    await element.waitForDisplayed({ timeout: args.timeout || 30000 });
    
    return {
      content: [
        {
          type: 'text',
          text: `Element ${args.selector} is now visible`,
        },
      ],
    };
  }

  private async handleFillForm(args: { fields: Array<{ selector: string; value: string }> }) {
    const driver = await this.webDriverManager.getDriver();
    
    for (const field of args.fields) {
      const element = await driver.$(field.selector);
      await element.setValue(field.value);
    }
    
    return {
      content: [
        {
          type: 'text',
          text: `Successfully filled ${args.fields.length} form fields`,
        },
      ],
    };
  }

  private async handleSelectOption(args: { selector: string; value: string }) {
    const driver = await this.webDriverManager.getDriver();
    const element = await driver.$(args.selector);
    await element.selectByVisibleText(args.value);
    
    return {
      content: [
        {
          type: 'text',
          text: `Successfully selected option "${args.value}" in ${args.selector}`,
        },
      ],
    };
  }

  private async handleHover(args: { selector: string }) {
    const driver = await this.webDriverManager.getDriver();
    const element = await driver.$(args.selector);
    await element.moveTo();
    
    return {
      content: [
        {
          type: 'text',
          text: `Successfully hovered over element: ${args.selector}`,
        },
      ],
    };
  }

  private async handleScrollTo(args: { selector?: string; x?: number; y?: number }) {
    const driver = await this.webDriverManager.getDriver();
    
    if (args.selector) {
      const element = await driver.$(args.selector);
      await element.scrollIntoView();
      return {
        content: [
          {
            type: 'text',
            text: `Successfully scrolled to element: ${args.selector}`,
          },
        ],
      };
    } else if (args.x !== undefined && args.y !== undefined) {
      await driver.scroll(args.x, args.y);
      return {
        content: [
          {
            type: 'text',
            text: `Successfully scrolled to coordinates: (${args.x}, ${args.y})`,
          },
        ],
      };
    } else {
      throw new Error('Either selector or coordinates (x, y) must be provided');
    }
  }

  private async handleGetPageTitle() {
    const driver = await this.webDriverManager.getDriver();
    const title = await driver.getTitle();
    
    return {
      content: [
        {
          type: 'text',
          text: `Page title: ${title}`,
        },
      ],
    };
  }

  private async handleGetCurrentUrl() {
    const driver = await this.webDriverManager.getDriver();
    const url = await driver.getUrl();
    
    return {
      content: [
        {
          type: 'text',
          text: `Current URL: ${url}`,
        },
      ],
    };
  }

  private async handleRefreshPage() {
    const driver = await this.webDriverManager.getDriver();
    await driver.refresh();
    
    return {
      content: [
        {
          type: 'text',
          text: 'Page refreshed successfully',
        },
      ],
    };
  }

  private async handleGoBack() {
    const driver = await this.webDriverManager.getDriver();
    await driver.back();
    
    return {
      content: [
        {
          type: 'text',
          text: 'Navigated back to previous page',
        },
      ],
    };
  }

  private async handleGoForward() {
    const driver = await this.webDriverManager.getDriver();
    await driver.forward();
    
    return {
      content: [
        {
          type: 'text',
          text: 'Navigated forward to next page',
        },
      ],
    };
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MCP WebDriver Server running on stdio');
  }
}

// Start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new MCPWebDriverServer();
  server.run().catch(console.error);
}

export { MCPWebDriverServer };
