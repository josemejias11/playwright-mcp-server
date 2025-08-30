export interface VideoProbeResult {
  url: string;
  mode: string;
  played: boolean;
  delta: number;
  before: number;
  after: number;
  paused: boolean;
  skipped: boolean;
  reason?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  raw?: any;
}
export interface VideoProbeOptions {
  url?: string;
  waitForPlayerMs?: number;
  strict?: boolean;
}
export function playAndProbeVideo(opts?: VideoProbeOptions): Promise<VideoProbeResult>;
