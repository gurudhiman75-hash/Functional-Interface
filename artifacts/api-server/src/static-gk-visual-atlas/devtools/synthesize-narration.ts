import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import {
  compileNarrationWindows,
  renderNarrationWindowsSrt,
  renderNarrationWindowsVtt,
  type StaticGkNarrationWindow,
} from "../audio/narration-timeline";
import {
  staticGkTtsConfigFromEnv,
  synthesizeStaticGkSpeech,
} from "../audio/openai-tts-provider";
import { readWavAudioMetadata } from "../audio/wav-duration";
import { TROPIC_OF_CANCER_FACT_LOCK } from "../fact-packs/SGK-VIS-IND-GEO-001";
import { STANDARD_MERIDIAN_FACT_LOCK } from "../fact-packs/SGK-VIS-IND-GEO-002";
import { TROPIC_OF_CANCER_LESSON_MANIFEST } from "../lesson-manifests/SGK-VIS-IND-GEO-001.manifest";
import { STANDARD_MERIDIAN_LESSON_MANIFEST } from "../lesson-manifests/SGK-VIS-IND-GEO-002.manifest";

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

function measuredCaptionWindow(window: StaticGkNarrationWindow, durationMs: number): StaticGkNarrationWindow {
  return {
    ...window,
    endMs: window.startMs + durationMs,
    windowDurationMs: durationMs,
  };
}

async function main(): Promise<void> {
  const [, , visualArg, outputDirectoryArg] = process.argv;
  if (!visualArg || !outputDirectoryArg) {
    throw new Error("Usage: synthesize-narration <tropic|standard-meridian|visual-id> <output-directory>");
  }

  const visualId = resolveVisualId(visualArg);
  const config = staticGkTtsConfigFromEnv();
  const windows = visualId === "SGK-VIS-IND-GEO-001"
    ? compileNarrationWindows(TROPIC_OF_CANCER_LESSON_MANIFEST, TROPIC_OF_CANCER_FACT_LOCK)
    : compileNarrationWindows(STANDARD_MERIDIAN_LESSON_MANIFEST, STANDARD_MERIDIAN_FACT_LOCK);

  const editorialTimingIssues = windows.filter((window) => window.speedQa === "review");
  if (editorialTimingIssues.length > 0) {
    throw new Error(
      `Narration timing is not editorially ready: ${editorialTimingIssues.map((window) => window.id).join(", ")}`,
    );
  }

  const outputDirectory = resolve(outputDirectoryArg);
  const audioDirectory = join(outputDirectory, `${visualId}.narration`);
  await mkdir(audioDirectory, { recursive: true });

  const items: Array<Record<string, unknown>> = [];
  const measuredWindows: StaticGkNarrationWindow[] = [];
  let timingRejected = false;

  for (const window of windows) {
    process.stdout.write(`[static-gk-visual-atlas] synthesizing ${window.id}\n`);
    const result = await synthesizeStaticGkSpeech(window.text, config);
    const metadata = readWavAudioMetadata(result.audio);
    const audioFile = `${window.id}.wav`;
    await writeFile(join(audioDirectory, audioFile), result.audio);

    const fitsWindow = metadata.durationMs <= window.windowDurationMs;
    if (!fitsWindow) timingRejected = true;
    if (fitsWindow) measuredWindows.push(measuredCaptionWindow(window, metadata.durationMs));

    items.push({
      id: window.id,
      text: window.text,
      factIds: window.factIds,
      startMs: window.startMs,
      approvedEndMs: window.endMs,
      approvedWindowDurationMs: window.windowDurationMs,
      measuredDurationMs: metadata.durationMs,
      fitsWindow,
      audioFile: `${visualId}.narration/${audioFile}`,
      audioSha256: sha256(result.audio),
      sampleRate: metadata.sampleRate,
      channels: metadata.channels,
      bitsPerSample: metadata.bitsPerSample,
    });
  }

  const manifest = {
    schemaVersion: "1.0",
    visualId,
    locale: "en-IN",
    status: timingRejected ? "timing-rejected" : "audio-ready",
    provider: config.provider,
    model: config.model,
    voice: config.voice,
    speed: config.speed,
    instructions: config.instructions ?? null,
    responseFormat: "wav",
    items,
  };
  await writeFile(
    join(outputDirectory, `${visualId}.tts-manifest.json`),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );

  if (timingRejected) {
    throw new Error(
      `One or more synthesized narration clips exceed their approved visual windows. See ${visualId}.tts-manifest.json.`,
    );
  }

  await writeFile(
    join(outputDirectory, `${visualId}.captions.measured.vtt`),
    renderNarrationWindowsVtt(measuredWindows),
    "utf8",
  );
  await writeFile(
    join(outputDirectory, `${visualId}.captions.measured.srt`),
    renderNarrationWindowsSrt(measuredWindows),
    "utf8",
  );
  process.stdout.write(
    `[static-gk-visual-atlas] synthesized ${items.length} narration clips for ${visualId}; all fit approved windows\n`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`[static-gk-visual-atlas] narration synthesis failed: ${message}\n`);
  process.exitCode = 1;
});
