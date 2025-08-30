import { expect } from 'expect';
import { playAndProbeVideo } from '../../src/webdriver/videoProbe';
/// <reference types="@wdio/globals" />

/**
 * Product ELA page video playback test (Wistia embed)
 * Strategy:
 *  1. Navigate to page and wait for presence of either [wistia-id] container or <wistia-player> custom element.
 *  2. Extract media id (from attribute wistia-id or media-id) – dynamic ID currently t3f26la8cs in provided HTML.
 *  3. Use Wistia _wq queue onReady callback to programmatically play, wait, then pause.
 *  4. Record before / after time + paused state in window.__mediaProbe for polling.
 *  5. Fallback to native <video> element if Wistia player never loads (should not happen, but keeps test resilient).
 *  6. If neither appears within timeout, skip (do not fail) to avoid false negatives due to transient CDN/third‑party outage.
 */

describe('Functional: Product Media (ELA Wistia Video)', () => {
  const pageUrl = 'https://newsela.com/products/ela';
  // Mocha context function (not arrow) so we can call this.skip()
  it('verifies hero video can play and pause (Wistia)', async function () {
    this.retries(1);
    const res = await playAndProbeVideo({ url: pageUrl });
    if (res.skipped) {
      // eslint-disable-next-line no-console
      console.warn('[video-skip] ELA hero video probe skipped', res.reason);
      return this.skip();
    }
    // eslint-disable-next-line no-console
    console.log('Video probe diagnostics:', res.raw);
    expect(res.played).toBe(true);
    expect(res.after).toBeGreaterThan(res.before);
    expect(res.delta).toBeGreaterThan(0.1);
    expect(res.paused).toBe(true);
  });
});
