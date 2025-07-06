/**
 * CaliberFS Homepage Page Object
 * Demonstrates Page Object Model best practices
 */

export class CaliberFSHomePage {
  constructor(client) {
    this.client = client;
    this.url = 'https://www.caliberfs.com';
  }

  async navigate() {
    return await this.client.navigateTo(this.url);
  }

  async captureScreenshot(name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `e2e/artifacts/${name}-${timestamp}.png`;
    return await this.client.takeScreenshot(filename, true);
  }

  async getPageInfo() {
    return await this.client.getPageInfo();
  }
}
