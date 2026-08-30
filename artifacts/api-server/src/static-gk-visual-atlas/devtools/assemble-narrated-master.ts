import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { isAbsolute, join, relative, resolve, sep } from "node:path";

import { parseStaticGkTtsManifest } from "../audio/tts-manifest";
import { readWavAudioMetadata } from "../audio/wav-duration";
import {
  buildFfmpegNarratedMasterArgs,
  STATIC_GK_VOICE_LOUDNESS_POLICY,
} from "../renderers/narrated-master";

const VISUAL_ALIASES = new Map([
  ["tropic", "SGK-VIS-IND-GEO-001"],
  ["tropic-of-cancer", "SGK-VIS-IND-GEO-001"],
  ["SGK-VIS-IND-GEO-001", "SGK-VIS-IND-GEO-001"],
  ["standard-meridian", "SGK-VIS-IND-GEO-002"],
  ["meridian", "SGK-VIS-IND-GEO-002"],
  ["SGK-VIS-IND-GEO-002", "SGK-VIS-IND-GEO-002"],
] as const);

type SupportedVisualId = "SGK-VIS-IND-GEO-001" | "SGK-VIS-IND-GEO-002";

interface RenderPlanFile {
  visualId: string;
  kind: "silent-master";
  width: 1080;
  height: 1920;
  fps: number;
  durationMs: number;
  frameCount: number;
  geometryId: string;
  sourceProductCode: string;
  sourceArchiveSha256?: string;
  canonicalGeoJsonSha256?: string;
}

function resolveVisualId(value: string): SupportedVisualId {
  const resolved = VISUAL_ALIASES.get(value as never);
  if (resolved === "SGK-VIS-IND-GEO-001" || resolved === "SGK-VIS-IND-GEO-002") return resolved;
  throw new Error(`Unsupported visual '${value}'. Use tropic or standard-meridian.`);
}

function sha256(bytes: Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex");
}

async function readJson(path: string): Promise<unknown> {
  return JSON.parse(await readFile(path, "utf8")) as unknown;
}

function parseRenderPlan(value: unknown, visualId: string): RenderPlanFile {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Render plan must be an object.");
  const plan = value as Record<string, unknown>;
  if (plan.visualId !== visualId || plan.kind !== "silent-master") throw new Error("Render plan does not match requested visual.");
  if (plan.width !== 1080 || plan.height !== 1920) throw new Error("Render plan is not the canonical 1080x1920 master.");
  if (!Number.isInteger(plan.durationMs) || Number(plan.durationMs) <= 0) throw new Error("Render plan duration is invalid.");
  if (!Number.isInteger(plan.fps) || Number(plan.fps) <= 0) throw new Error("Render plan FPS is invalid.");
  if (!Number.isInteger(plan.frameCount) || Number(plan.frameCount) <= 0) throw new Error("Render plan frame count is invalid.");
  if (typeof plan.geometryId !== "string" || typeof plan.sourceProductCode !== "string") {
    throw new Error("Render plan geometry provenance is incomplete.");
  }
  return plan as unknown as RenderPlanFile;
}

function resolveManifestFile(root: string, manifestPath: string): string {
  if (isAbsolute(manifestPath)) throw new Error("TTS audioFile must be relative to the render directory.");
  const fullPath = resolve(root, manifestPath);
  const relativePath = relative(root, fullPath);
  if (relativePath === "" || relativePath.startsWith(`..${sep}`) || relativePath === ".." || isAbsolute(relativePath)) {
    throw new Error(`TTS audioFile escapes render directory: ${manifestPath}`);
  }
  return fullPath;
}

async function main(): Promise<void> {
  const [, , visualArg, outputDirectoryArg] = process.argv;
  if (!visualArg || !outputDirectoryArg) {
    throw new Error("Usage: assemble-narrated-master <tropic|standard-meridian|visual-id> <output-directory>");
  }

  const visualId = resolveVisualId(visualArg);
  const root = resolve(outputDirectoryArg);
  const silentMasterPath = join(root, `${visualId}.silent-master.mp4`);
  const renderPlanPath = join(root, `${visualId}.render-plan.json`);
  const ttsManifestPath = join(root, `${visualId}.tts-manifest.json`);
  const captionsPath = join(root, `${visualId}.captions.measured.vtt`);
  const outputPath = join(root, `${visualId}.narrated-master.mp4`);

  const renderPlan = parseRenderPlan(await readJson(renderPlanPath), visualId);
  const ttsManifest = parseStaticGkTtsManifest(await readJson(ttsManifestPath));
  if (ttsManifest.visualId !== visualId) throw new Error("TTS manifest does not match requested visual.");
  if (ttsManifest.status !== "audio-ready") throw new Error(`TTS manifest is ${ttsManifest.status}, not audio-ready.`);
  if (ttsManifest.items.some((item) => !item.fitsWindow)) throw new Error("TTS manifest contains a narration clip outside its approved window.");

  const silentMasterBytes = await readFile(silentMasterPath);
  const ttsManifestBytes = await readFile(ttsManifestPath);
  const captionsBytes = await readFile(captionsPath);
  const clips = [];

  for (const item of ttsManifest.items) {
    const audioPath = resolveManifestFile(root, item.audioFile);
    const audio = await readFile(audioPath);
    if (sha256(audio) !== item.audioSha256) throw new Error(`${item.id}: WAV checksum no longer matches TTS manifest.`);
    const metadata = readWavAudioMetadata(audio);
    if (Math.abs(metadata.durationMs - item.measuredDurationMs) > 2) {
      throw new Error(`${item.id}: measured WAV duration no longer matches TTS manifest.`);
    }
    clips.push({ startMs: item.startMs, audioPath });
  }

  const ffmpegBinary = process.env.STATIC_GK_ATLAS_FFMPEG_PATH?.trim() || "ffmpeg";
  const ffmpegArgs = buildFfmpegNarratedMasterArgs(renderPlan, silentMasterPath, clips, outputPath);
  const result = spawnSync(ffmpegBinary, ffmpegArgs, { stdio: "inherit" });
  if (result.error) throw new Error(`FFmpeg could not start: ${result.error.message}`);
  if (result.status !== 0) throw new Error(`FFmpeg narrated-master assembly exited with status ${result.status ?? "unknown"}.`);

  const finalVideo = await readFile(outputPath);
  const receipt = {
    schemaVersion: "1.0",
    visualId,
    status: "narrated-master-ready",
    publishReady: false,
    video: {
      path: `${visualId}.narrated-master.mp4`,
      sha256: sha256(finalVideo),
      width: renderPlan.width,
      height: renderPlan.height,
      fps: renderPlan.fps,
      durationMs: renderPlan.durationMs,
      codecPolicy: "H.264 visual copy + AAC 192k voice",
    },
    visualMaster: {
      path: `${visualId}.silent-master.mp4`,
      sha256: sha256(silentMasterBytes),
      frameCount: renderPlan.frameCount,
    },
    geometry: {
      geometryId: renderPlan.geometryId,
      sourceProductCode: renderPlan.sourceProductCode,
      sourceArchiveSha256: renderPlan.sourceArchiveSha256 ?? null,
      canonicalGeoJsonSha256: renderPlan.canonicalGeoJsonSha256 ?? null,
    },
    narration: {
      provider: ttsManifest.provider,
      model: ttsManifest.model,
      voice: ttsManifest.voice,
      speed: ttsManifest.speed,
      clipCount: ttsManifest.items.length,
      manifestSha256: sha256(ttsManifestBytes),
      allClipsChecksumVerified: true,
      allClipsFitApprovedWindows: true,
      loudnessNormalization: STATIC_GK_VOICE_LOUDNESS_POLICY,
    },
    captions: {
      path: `${visualId}.captions.measured.vtt`,
      sha256: sha256(captionsBytes),
      status: "sidecar-measured",
    },
    remainingPublishGates: [
      "Measured post-mux loudness/true-peak verification",
      "Human narration intelligibility and pronunciation review",
      "Final visual contact-sheet/video QA",
      "Thumbnail generation",
      "Publish approval",
    ],
  };
  await writeFile(join(root, `${visualId}.qa-receipt.json`), `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
  process.stdout.write(`[static-gk-visual-atlas] assembled narrated master for ${visualId}: ${outputPath}\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`[static-gk-visual-atlas] narrated-master assembly failed: ${message}\n`);
  process.exitCode = 1;
});
