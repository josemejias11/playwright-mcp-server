import { remote, RemoteOptions, Browser } from 'webdriverio';

export class WebDriverManager {
  private driver: Browser | null = null;
  private options: RemoteOptions;

  constructor() {
    this.options = {
      logLevel: 'info',
      capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: [
            '--headless',
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--window-size=1920,1080'
          ]
        }
      } as any
    };
  }

  async getDriver(): Promise<Browser> {
    if (!this.driver) {
      this.driver = await remote(this.options);
    }
    return this.driver;
  }

  async closeDriver(): Promise<void> {
    if (this.driver) {
      await this.driver.deleteSession();
      this.driver = null;
    }
  }

  async restartDriver(): Promise<Browser> {
    await this.closeDriver();
    return await this.getDriver();
  }

  isDriverActive(): boolean {
    return this.driver !== null;
  }

  async setHeadlessMode(headless: boolean): Promise<void> {
    const capabilities = this.options.capabilities as any;
    const chromeOptions = capabilities['goog:chromeOptions'];
    if (headless) {
      if (!chromeOptions.args.includes('--headless')) {
        chromeOptions.args.push('--headless');
      }
    } else {
      const index = chromeOptions.args.indexOf('--headless');
      if (index > -1) {
        chromeOptions.args.splice(index, 1);
      }
    }

    if (this.driver) {
      await this.restartDriver();
    }
  }

  async setWindowSize(width: number, height: number): Promise<void> {
    const capabilities = this.options.capabilities as any;
    const chromeOptions = capabilities['goog:chromeOptions'];
    const sizeArgIndex = chromeOptions.args.findIndex((arg: string) => arg.startsWith('--window-size='));
    const newSizeArg = `--window-size=${width},${height}`;
    
    if (sizeArgIndex > -1) {
      chromeOptions.args[sizeArgIndex] = newSizeArg;
    } else {
      chromeOptions.args.push(newSizeArg);
    }

    if (this.driver) {
      await this.driver.setWindowSize(width, height);
    }
  }
}
