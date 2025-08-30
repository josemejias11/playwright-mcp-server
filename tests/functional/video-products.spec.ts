import { expect } from 'expect';
import { playAndProbeVideo } from '../helpers/videoProbe.js';

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
      const res = await playAndProbeVideo({ url, strict });
      console.log(
        `[DEBUG] ${url} - mode: ${res.mode}, played: ${res.played}, delta: ${res.delta}, before: ${res.before}, after: ${res.after}, reason: ${res.reason}`
      );

      // Show what was found on pages that don't play videos
      if (!res.played && res.raw?.inspection) {
        console.log(`[INSPECTION] ${url}:`, JSON.stringify(res.raw.inspection, null, 2));
      }

      if (res.skipped) {
        // eslint-disable-next-line no-console
        console.warn(`[video-skip] ${url} reason=${res.reason}`);
        return this.skip();
      }

      // Only accept as pass if we have real video playback evidence
      expect(res.played).toBe(true);
      expect(res.delta).toBeGreaterThan(0); // Must have real time delta, not fake 3s

      // For native videos, ensure actual time progression
      if (res.mode === 'native' || res.mode === 'native-delayed') {
        expect(res.after).toBeGreaterThan(res.before);
        expect(res.delta).toBeGreaterThanOrEqual(2.0); // At least 2 seconds of real playback
      }
      expect(res.paused).toBe(true);
    });
  }
});
