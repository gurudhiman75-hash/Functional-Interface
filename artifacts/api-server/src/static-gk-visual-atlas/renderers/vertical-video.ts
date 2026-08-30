import type { StaticGkSceneCue, StaticGkSceneViewport } from "../scenes/types";

export const DEFAULT_VERTICAL_VIDEO_FPS = 30;
export const MAX_VERTICAL_VIDEO_DURATION_MS = 60_000;

export interface StaticGkVerticalVideoRenderPlan {
  width: 1080;
  height: 1920;
  aspectRatio: "9:16";
  fps: number;
  durationMs: number;
  frameCount: number;
}

export function sceneDurationMs(cues: readonly StaticGkSceneCue[]): number {
  if (cues.length === 0) throw new Error("Cannot render a scene without timeline cues");
  let durationMs = 0;
  for (const cue of cues) {
    if (!Number.isInteger(cue.startMs) || !Number.isInteger(cue.endMs) || cue.startMs < 0 || cue.endMs <= cue.startMs) {
      throw new Error(`Invalid scene cue timing: ${cue.id}`);
    }
    durationMs = Math.max(durationMs, cue.endMs);
  }
  if (durationMs > MAX_VERTICAL_VIDEO_DURATION_MS) {
    throw new Error(`Static GK short exceeds ${MAX_VERTICAL_VIDEO_DURATION_MS / 1000}s render limit`);
  }
  return durationMs;
}

export function createVerticalVideoRenderPlan(
  viewport: StaticGkSceneViewport,
  cues: readonly StaticGkSceneCue[],
  fps = DEFAULT_VERTICAL_VIDEO_FPS,
): StaticGkVerticalVideoRenderPlan {
  if (viewport.aspectRatio !== "9:16" || viewport.width !== 1080 || viewport.height !== 1920) {
    throw new Error("Static GK vertical master must use the canonical 1080x1920 9:16 viewport");
  }
  if (!Number.isInteger(fps) || fps < 1 || fps > 60) throw new Error("Render FPS must be an integer from 1 to 60");

  const durationMs = sceneDurationMs(cues);
  return {
    width: viewport.width,
    height: viewport.height,
    aspectRatio: viewport.aspectRatio,
    fps,
    durationMs,
    frameCount: Math.ceil((durationMs * fps) / 1000),
  };
}

export function frameTimeMs(plan: StaticGkVerticalVideoRenderPlan, frameIndex: number): number {
  if (!Number.isInteger(frameIndex) || frameIndex < 0 || frameIndex >= plan.frameCount) {
    throw new Error(`Frame index ${frameIndex} is outside render plan`);
  }
  return Math.min(plan.durationMs - 1, Math.floor((frameIndex * 1000) / plan.fps));
}

export function frameFileName(frameIndex: number): string {
  if (!Number.isInteger(frameIndex) || frameIndex < 0) throw new Error("Frame index must be a non-negative integer");
  return `frame-${String(frameIndex).padStart(6, "0")}.svg`;
}

export function buildFfmpegSilentMasterArgs(
  plan: StaticGkVerticalVideoRenderPlan,
  inputPattern: string,
  outputPath: string,
): string[] {
  return [
    "-hide_banner",
    "-loglevel",
    "warning",
    "-y",
    "-framerate",
    String(plan.fps),
    "-start_number",
    "0",
    "-i",
    inputPattern,
    "-frames:v",
    String(plan.frameCount),
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "18",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-r",
    String(plan.fps),
    outputPath,
  ];
}
