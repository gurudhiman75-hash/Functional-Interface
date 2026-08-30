import { spawnSync } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import { loadValidatedRuntimeAdminGeometry } from "../geometry/runtime-admin-loader";
import { renderStandardMeridianSvgFrame, renderTropicCancerSvgFrame } from "../renderers/svg-map";
import {
  buildFfmpegSilentMasterArgs,
  createVerticalVideoRenderPlan,
  frameFileName,
  frameTimeMs,
} from "../renderers/vertical-video";
import { compileStandardMeridianScene } from "../scenes/compile-standard-meridian";
import { compileTropicCancerScene } from "../scenes/compile-tropic-cancer";
import type { StaticGkMapPathSceneRecipe, StaticGkMeridianSceneRecipe } from "../scenes/types";

const VISUAL_ALIASES = new Map([
  ["tropic", "SGK-VIS-IND-GEO-001"],
  ["tropic-of-cancer", "SGK-VIS-IND-GEO-001"],
  ["SGK-VIS-IND-GEO-001", "SGK-VIS-IND-GEO-001"],
  ["standard-meridian", "SGK-VIS-IND-GEO-002"],
  ["meridian", "SGK-VIS-IND-GEO-002"],
  ["SGK-VIS-IND-GEO-002", "SGK-VIS-IND-GEO-002"],
] as const);

type SupportedVisualId = "SGK-VIS-IND-GEO-001" | "SGK-VIS-IND-GEO-002";
type SupportedScene = StaticGkMapPathSceneRecipe | StaticGkMeridianSceneRecipe;

function resolveVisualId(value: string): SupportedVisualId {
  const resolved = VISUAL_ALIASES.get(value as never);
  if (resolved === "SGK-VIS-IND-GEO-001" || resolved === "SGK-VIS-IND-GEO-002") return resolved;
  throw new Error(`Unsupported visual '${value}'. Use tropic or standard-meridian.`);
}

async function main(): Promise<void> {
  const [, , visualArg, outputDirectoryArg, fpsArg] = process.argv;
  if (!visualArg || !outputDirectoryArg) {
    throw new Error(
      "Usage: render-vertical-video <tropic|standard-meridian|visual-id> <output-directory> [fps]",
    );
  }

  const visualId = resolveVisualId(visualArg);
  const fps = fpsArg ? Number(fpsArg) : undefined;
  const bundle = await loadValidatedRuntimeAdminGeometry();

  let scene: SupportedScene;
  let renderFrame: (timeMs: number) => string;
  if (visualId === "SGK-VIS-IND-GEO-001") {
    const compiled = compileTropicCancerScene(bundle);
    if (compiled.status !== "render-ready") throw new Error(`Tropic scene is ${compiled.status}, not render-ready`);
    scene = compiled;
    renderFrame = (timeMs) => renderTropicCancerSvgFrame(compiled, bundle.geometry, timeMs);
  } else {
    const compiled = compileStandardMeridianScene(bundle);
    if (compiled.status !== "render-ready") {
      throw new Error(`Standard Meridian scene is ${compiled.status}, not render-ready`);
    }
    scene = compiled;
    renderFrame = (timeMs) => renderStandardMeridianSvgFrame(compiled, bundle.geometry, timeMs);
  }

  const plan = createVerticalVideoRenderPlan(scene.viewport, scene.cues, fps);
  const outputDirectory = resolve(outputDirectoryArg);
  const framesDirectory = join(outputDirectory, `${visualId}.frames`);
  const outputPath = join(outputDirectory, `${visualId}.silent-master.mp4`);
  await mkdir(outputDirectory, { recursive: true });
  await rm(framesDirectory, { recursive: true, force: true });
  await mkdir(framesDirectory, { recursive: true });

  for (let frameIndex = 0; frameIndex < plan.frameCount; frameIndex += 1) {
    const timeMs = frameTimeMs(plan, frameIndex);
    const svg = renderFrame(timeMs);
    await writeFile(join(framesDirectory, frameFileName(frameIndex)), `${svg}\n`, "utf8");
    if (frameIndex > 0 && frameIndex % 150 === 0) {
      process.stdout.write(`[static-gk-visual-atlas] rendered ${frameIndex}/${plan.frameCount} SVG frames\n`);
    }
  }

  await writeFile(join(outputDirectory, `${visualId}.scene.json`), `${JSON.stringify(scene, null, 2)}\n`, "utf8");
  await writeFile(
    join(outputDirectory, `${visualId}.render-plan.json`),
    `${JSON.stringify({
      visualId,
      kind: "silent-master",
      ...plan,
      geometryId: scene.geometrySource.geometryId,
      sourceProductCode: scene.geometrySource.sourceProductCode,
      sourceArchiveSha256: scene.geometrySource.sourceArchiveSha256,
      canonicalGeoJsonSha256: scene.geometrySource.canonicalGeoJsonSha256,
    }, null, 2)}\n`,
    "utf8",
  );

  const ffmpegBinary = process.env.STATIC_GK_ATLAS_FFMPEG_PATH?.trim() || "ffmpeg";
  const ffmpegArgs = buildFfmpegSilentMasterArgs(
    plan,
    join(framesDirectory, "frame-%06d.svg"),
    outputPath,
  );
  const result = spawnSync(ffmpegBinary, ffmpegArgs, { stdio: "inherit" });
  if (result.error) {
    throw new Error(`FFmpeg could not start: ${result.error.message}. SVG frames were preserved at ${framesDirectory}`);
  }
  if (result.status !== 0) {
    throw new Error(`FFmpeg exited with status ${result.status ?? "unknown"}. SVG frames were preserved at ${framesDirectory}`);
  }

  if (process.env.STATIC_GK_ATLAS_KEEP_FRAMES !== "1") {
    await rm(framesDirectory, { recursive: true, force: true });
  }

  process.stdout.write(
    `[static-gk-visual-atlas] rendered ${visualId} silent vertical master: ${outputPath} (${plan.durationMs / 1000}s, ${plan.fps}fps, ${plan.frameCount} frames)\n`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`[static-gk-visual-atlas] vertical render failed: ${message}\n`);
  process.exitCode = 1;
});
