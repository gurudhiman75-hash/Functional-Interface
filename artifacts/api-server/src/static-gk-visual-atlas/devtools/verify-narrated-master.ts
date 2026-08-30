import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import {
  buildFfmpegLoudnessAnalysisArgs,
  evaluateStaticGkLoudness,
  parseFfmpegLoudnormAnalysis,
  STATIC_GK_LOUDNESS_QA_TOLERANCE,
} from "../audio/loudness-qa";
import { TROPIC_OF_CANCER_LESSON_MANIFEST } from "../lesson-manifests/SGK-VIS-IND-GEO-001.manifest";
import { STANDARD_MERIDIAN_LESSON_MANIFEST } from "../lesson-manifests/SGK-VIS-IND-GEO-002.manifest";
import { STATIC_GK_VOICE_LOUDNESS_POLICY } from "../renderers/narrated-master";
import { buildFfmpegThumbnailArgs, selectStaticGkThumbnailTimeMs } from "../renderers/thumbnail";

const VISUAL_ALIASES = new Map([
  ["tropic", "SGK-VIS-IND-GEO-001"],
  ["tropic-of-cancer", "SGK-VIS-IND-GEO-001"],
  ["SGK-VIS-IND-GEO-001", "SGK-VIS-IND-GEO-001"],
  ["standard-meridian", "SGK-VIS-IND-GEO-002"],
  ["meridian", "SGK-VIS-IND-GEO-002"],
  ["SGK-VIS-IND-GEO-002", "SGK-VIS-IND-GEO-002"],
] as const);

type SupportedVisualId = "SGK-VIS-IND-GEO-001" | "SGK-VIS-IND-GEO-002";

function resolveVisualId(value: string): SupportedVisualId {
  const resolved = VISUAL_ALIASES.get(value as never);
  if (resolved === "SGK-VIS-IND-GEO-001" || resolved === "SGK-VIS-IND-GEO-002") return resolved;
  throw new Error(`Unsupported visual '${value}'. Use tropic or standard-meridian.`);
}

function sha256(bytes: Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex");
}

async function main(): Promise<void> {
  const [, , visualArg, outputDirectoryArg] = process.argv;
  if (!visualArg || !outputDirectoryArg) {
    throw new Error("Usage: verify-narrated-master <tropic|standard-meridian|visual-id> <output-directory>");
  }

  const visualId = resolveVisualId(visualArg);
  const root = resolve(outputDirectoryArg);
  const inputPath = join(root, `${visualId}.narrated-master.mp4`);
  const receiptPath = join(root, `${visualId}.qa-receipt.json`);
  const thumbnailPath = join(root, `${visualId}.thumbnail.png`);
  const audioQaPath = join(root, `${visualId}.audio-qa.json`);
  const ffmpegBinary = process.env.STATIC_GK_ATLAS_FFMPEG_PATH?.trim() || "ffmpeg";

  const analysis = spawnSync(ffmpegBinary, buildFfmpegLoudnessAnalysisArgs(inputPath), {
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  if (analysis.error) throw new Error(`FFmpeg loudness analysis could not start: ${analysis.error.message}`);
  if (analysis.status !== 0) throw new Error(`FFmpeg loudness analysis exited with status ${analysis.status ?? "unknown"}.`);
  const measurement = parseFfmpegLoudnormAnalysis(`${analysis.stdout ?? ""}\n${analysis.stderr ?? ""}`);
  const loudnessQa = evaluateStaticGkLoudness(measurement);
  const audioQa = {
    schemaVersion: "1.0",
    visualId,
    policy: STATIC_GK_VOICE_LOUDNESS_POLICY,
    tolerance: STATIC_GK_LOUDNESS_QA_TOLERANCE,
    ...loudnessQa,
  };
  await writeFile(audioQaPath, `${JSON.stringify(audioQa, null, 2)}\n`, "utf8");
  if (!loudnessQa.passed) {
    throw new Error(`Post-mux loudness QA failed. See ${visualId}.audio-qa.json.`);
  }

  const manifest = visualId === "SGK-VIS-IND-GEO-001"
    ? TROPIC_OF_CANCER_LESSON_MANIFEST
    : STANDARD_MERIDIAN_LESSON_MANIFEST;
  const thumbnailTimeMs = selectStaticGkThumbnailTimeMs(manifest);
  const thumbnail = spawnSync(
    ffmpegBinary,
    buildFfmpegThumbnailArgs(inputPath, thumbnailTimeMs, thumbnailPath),
    { stdio: "inherit" },
  );
  if (thumbnail.error) throw new Error(`FFmpeg thumbnail extraction could not start: ${thumbnail.error.message}`);
  if (thumbnail.status !== 0) throw new Error(`FFmpeg thumbnail extraction exited with status ${thumbnail.status ?? "unknown"}.`);

  const receiptRaw = JSON.parse(await readFile(receiptPath, "utf8")) as Record<string, unknown>;
  if (receiptRaw.visualId !== visualId) throw new Error("QA receipt does not match narrated master.");
  const narratedVideo = await readFile(inputPath);
  const thumbnailBytes = await readFile(thumbnailPath);
  const audioQaBytes = await readFile(audioQaPath);
  receiptRaw.status = "automated-qa-ready";
  receiptRaw.publishReady = false;
  receiptRaw.automatedQa = {
    narratedVideoSha256: sha256(narratedVideo),
    loudness: {
      path: `${visualId}.audio-qa.json`,
      sha256: sha256(audioQaBytes),
      passed: true,
      measurement,
    },
    thumbnail: {
      path: `${visualId}.thumbnail.png`,
      sha256: sha256(thumbnailBytes),
      captureTimeMs: thumbnailTimeMs,
      width: 1080,
      height: 1920,
    },
  };
  receiptRaw.remainingPublishGates = [
    "Human narration intelligibility and pronunciation review",
    "Final rendered-video visual/factual QA",
    "Explicit publish approval",
  ];
  await writeFile(receiptPath, `${JSON.stringify(receiptRaw, null, 2)}\n`, "utf8");
  process.stdout.write(
    `[static-gk-visual-atlas] automated narrated-master QA passed for ${visualId}; thumbnail captured at ${thumbnailTimeMs}ms\n`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`[static-gk-visual-atlas] narrated-master QA failed: ${message}\n`);
  process.exitCode = 1;
});
