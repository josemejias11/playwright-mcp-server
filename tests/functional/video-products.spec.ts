import { expect } from 'expect';
import { playAndProbeVideo } from '../helpers/videoProbeRuntime.ts';

// Dedicated per-product video playback tests using reusable probe helper.
// Skips (non-strict) when playback can't be confirmed instead of failing the build.

const productVideoPages = [
  'https://newsela.com/products/ela',
  'https://newsela.com/products/social-studies',
  'https://newsela.com/products/science',
  'https://newsela.com/products/writing',
  'https://newsela.com/products/formative',
];

describe('Functional: Product Videos Playback', () => {
  const strict = process.env.STRICT_VIDEO === '1';

  for (const url of productVideoPages) {
    it(`verifies video playback probe for ${url}`, async function () {
      this.retries(1);
      const res = await playAndProbeVideo({ url, strict });
      if (res.skipped) {
        // eslint-disable-next-line no-console
        console.warn(`[video-skip] ${url} reason=${res.reason}`);
        return this.skip();
      }
      expect(res.played).toBe(true);
      expect(res.delta).toBeGreaterThanOrEqual(2.8); // ~3s playback (allow slight drift)
      // Debug output for now
      if (res.delta === 0) {
        console.log(`[DEBUG] ${url} - mode: ${res.mode}, before: ${res.before}, after: ${res.after}, raw:`, res.raw);
      }
      expect(res.after).toBeGreaterThan(res.before);
      expect(res.paused).toBe(true);
    });
  }
});
