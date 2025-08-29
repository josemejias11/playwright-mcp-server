import { expect } from 'expect';
/// <reference types="@wdio/globals" />

// Very fast canary to ensure site core renders
describe('Smoke: Home', () => {
  it('renders title & hero quickly', async () => {
    await browser.url('https://newsela.com');
    const title = await browser.getTitle();
    expect(title.toLowerCase()).toContain('newsela');
    const h1 = await $('h1');
    expect(await h1.isExisting()).toBe(true);
  });
});
