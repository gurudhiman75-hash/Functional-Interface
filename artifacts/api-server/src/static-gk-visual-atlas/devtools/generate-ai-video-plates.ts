import { generateStaticGkAiVideoPlates } from "../ai-video/orchestrator";
import { normalizeStaticGkRenderableVisualId } from "../render-job-contract";

async function main(): Promise<void> {
  const [, , visualArg, outputDirectory] = process.argv;
  if (!visualArg || !outputDirectory) throw new Error("Usage: generate-ai-video-plates <tropic|standard-meridian|visual-id> <output-directory>");
  const visualId = normalizeStaticGkRenderableVisualId(visualArg);
  await generateStaticGkAiVideoPlates(visualId, outputDirectory);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`[static-gk-ai-video] generation failed: ${message}\n`);
  process.exitCode = 1;
});
