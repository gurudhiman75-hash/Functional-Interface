import type { StaticGkLessonManifest } from "../lesson-manifests/types";

export function selectStaticGkThumbnailTimeMs(manifest: StaticGkLessonManifest): number {
  const preferred = manifest.shots.find((shot) => shot.role === "concept")
    ?? manifest.shots.find((shot) => shot.role === "sequence")
    ?? manifest.shots.find((shot) => shot.role === "map-intro");
  if (!preferred) return Math.max(0, Math.min(manifest.durationMs - 1, Math.floor(manifest.durationMs / 4)));
  return Math.floor((preferred.startMs + preferred.endMs) / 2);
}

export function buildFfmpegThumbnailArgs(inputPath: string, timeMs: number, outputPath: string): string[] {
  if (!Number.isInteger(timeMs) || timeMs < 0) throw new Error("Thumbnail time must be a non-negative integer.");
  return [
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-ss",
    (timeMs / 1000).toFixed(3),
    "-i",
    inputPath,
    "-frames:v",
    "1",
    "-vf",
    "scale=1080:1920:flags=lanczos",
    outputPath,
  ];
}
