/**
 * CaliberFS Contact Page Object
 * Demonstrates form handling best practices
 */

export class CaliberFSContactPage {
  constructor(client) {
    this.client = client;
    this.url = 'https://www.caliberfs.com/contact';
  }

  async navigate() {
    return await this.client.navigateTo(this.url);
  }

  async captureScreenshot(name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `e2e/artifacts/${name}-${timestamp}.png`;
    return await this.client.takeScreenshot(filename, true);
  }
}
