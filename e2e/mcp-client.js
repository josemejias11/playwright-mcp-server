// MCP Client Helper for E2E Testing
import { spawn } from 'child_process';
import { writeFileSync, readFileSync } from 'fs';

export class McpClient {
  constructor(serverPath) {
    this.serverPath = serverPath;
    this.server = null;
    this.requestId = 0;
    this.pendingRequests = new Map();
  }

  async startServer() {
    if (this.server) return;

    this.server = spawn('node', [this.serverPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: process.cwd()
    });

    let buffer = '';
    this.server.stdout.on('data', (data) => {
      buffer += data.toString();
      
      // Process complete JSON messages
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer
      
      for (const line of lines) {
        if (line.trim()) {
          try {
            const response = JSON.parse(line);
            if (response.id && this.pendingRequests.has(response.id)) {
              const { resolve } = this.pendingRequests.get(response.id);
              this.pendingRequests.delete(response.id);
              resolve(response);
            }
          } catch (error) {
            console.error('Failed to parse response:', line);
          }
        }
      }
    });

    this.server.stderr.on('data', (data) => {
      // Ignore stderr for now (server logs)
    });

    this.server.on('close', (code) => {
      this.server = null;
      // Reject all pending requests
      for (const [id, { reject }] of this.pendingRequests) {
        reject(new Error(`Server closed with code ${code}`));
      }
      this.pendingRequests.clear();
    });

    // Send initialization request
    const initRequest = {
      jsonrpc: "2.0",
      id: ++this.requestId,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: {
          name: "test-client",
          version: "1.0.0"
        }
      }
    };

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(initRequest.id, { resolve, reject });
      this.server.stdin.write(JSON.stringify(initRequest) + '\n');
      
      setTimeout(() => {
        if (this.pendingRequests.has(initRequest.id)) {
          this.pendingRequests.delete(initRequest.id);
          resolve(); // Continue even if init doesn't respond properly
        }
      }, 2000);
    });
  }

  async callTool(toolName, args = {}) {
    await this.startServer();

    const requestId = ++this.requestId;
    const request = {
      jsonrpc: "2.0",
      id: requestId,
      method: "tools/call",
      params: {
        name: toolName,
        arguments: args
      }
    };

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(requestId, { 
        resolve: (response) => {
          if (response.error) {
            reject(new Error(response.error.message || 'Tool call failed'));
          } else {
            // Extract the actual result
            const result = response.result;
            if (result && result.content && result.content[0]) {
              resolve({ 
                success: true, 
                output: result.content[0].text,
                raw: result 
              });
            } else {
              resolve({ 
                success: true, 
                output: JSON.stringify(result),
                raw: result 
              });
            }
          }
        }, 
        reject 
      });

      this.server.stdin.write(JSON.stringify(request) + '\n');
      
      // Add timeout
      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          reject(new Error(`Tool call timeout: ${toolName}`));
        }
      }, 30000);
    });
  }

  async closeServer() {
    if (this.server) {
      this.server.kill();
      this.server = null;
      this.pendingRequests.clear();
    }
  }

  async launchBrowser(browserType = 'chromium', headless = false) {
    return this.callTool('launch-browser', { browserType, headless });
  }

  async navigateTo(url, waitUntil = 'load') {
    return this.callTool('navigate-to', { url, waitUntil });
  }

  async clickElement(selector, timeout = 30000) {
    return this.callTool('click-element', { selector, timeout });
  }

  async fillInput(selector, text, timeout = 30000) {
    return this.callTool('fill-input', { selector, text, timeout });
  }

  async getText(selector, timeout = 30000) {
    return this.callTool('get-text', { selector, timeout });
  }

  async takeScreenshot(path, fullPage = false) {
    return this.callTool('take-screenshot', { path, fullPage });
  }

  async waitForElement(selector, state = 'visible', timeout = 30000) {
    return this.callTool('wait-for-element', { selector, state, timeout });
  }

  async evaluateJavaScript(code) {
    return this.callTool('evaluate-javascript', { code });
  }

  async getPageInfo() {
    return this.callTool('get-page-info');
  }

  async closeBrowser() {
    const result = await this.callTool('close-browser');
    await this.closeServer(); // Close the MCP server as well
    return result;
  }
}
