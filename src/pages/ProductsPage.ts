/// <reference types="@wdio/globals" />

export class ProductsPage {
  constructor(private baseUrl: string = process.env.QA_BASE_URL || 'https://newsela.com') {}

  async open() {
    await browser.url(this.baseUrl + '/products');
  }

  async productTiles(): Promise<string[]> {
    const selectors = await $$('a[href*="/products/"]');
    const names: string[] = [];
    for (const el of selectors) {
      const txt = (await el.getText()).trim();
      if (txt) names.push(txt);
    }
    return Array.from(new Set(names));
  }
}
