import { rename, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import type { SupportedStaticGkRenderVisualId } from "../render-job-contract";
import { compileStaticGkAiShotPrompts } from "./prompt-compiler";
import { RunwayStaticGkAiVideoProvider } from "./providers/runway";
import { getStaticGkAiShotPlan } from "./shot-plans";
import type {
  StaticGkAiVideoGenerationReceipt,
  StaticGkAiVideoProvider,
  StaticGkAiVideoProviderId,
  StaticGkAiVideoShotReceipt,
} from "./types";

export interface StaticGkAiVideoCapability {
  enabled: boolean;
  ready: boolean;
  provider: StaticGkAiVideoProviderId;
  configured: {
    apiSecret: boolean;
    model: boolean;
  };
  blockers: string[];
}

function takesPerShot(): number {
  const raw = process.env.STATIC_GK_AI_VIDEO_TAKES_PER_SHOT?.trim();
  if (!raw) return 2;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1 || value > 4) {
    throw new Error("STATIC_GK_AI_VIDEO_TAKES_PER_SHOT must be an integer from 1 to 4");
  }
  return value;
}

function selectedProviderId(): StaticGkAiVideoProviderId {
  const raw = process.env.STATIC_GK_AI_VIDEO_PROVIDER?.trim().toLocaleLowerCase("en-US") || "runway";
  if (raw !== "runway") throw new Error(`Unsupported Static GK AI video provider '${raw}'`);
  return raw;
}

export function staticGkAiVideoEnabled(): boolean {
  return process.env.STATIC_GK_AI_VIDEO_ENABLED?.trim() === "1";
}

export function getStaticGkAiVideoCapability(): StaticGkAiVideoCapability {
  const enabled = staticGkAiVideoEnabled();
  const provider = selectedProviderId();
  const apiSecret = Boolean(process.env.STATIC_GK_RUNWAY_API_SECRET?.trim() || process.env.RUNWAYML_API_SECRET?.trim());
  const model = Boolean(process.env.STATIC_GK_RUNWAY_MODEL?.trim() || "gen4.5");
  const blockers: string[] = [];
  if (enabled && !apiSecret) blockers.push("Runway API secret is not configured");
  return { enabled, ready: enabled && blockers.length === 0, provider, configured: { apiSecret, model }, blockers };
}

function createProvider(): StaticGkAiVideoProvider {
  const provider = selectedProviderId();
  if (provider === "runway") return new RunwayStaticGkAiVideoProvider();
  throw new Error(`No implementation for AI video provider '${provider}'`);
}

async function writeJsonAtomic(path: string, value: unknown): Promise<void> {
  const temp = `${path}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(temp, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temp, path);
}

export async function generateStaticGkAiVideoPlates(
  visualId: SupportedStaticGkRenderVisualId,
  outputDirectoryArg: string,
  provider: StaticGkAiVideoProvider = createProvider(),
): Promise<StaticGkAiVideoGenerationReceipt> {
  const capability = getStaticGkAiVideoCapability();
  if (!capability.enabled) throw new Error("Static GK AI video generation is disabled");
  if (!capability.ready) throw new Error(`Static GK AI video generation is not ready: ${capability.blockers.join("; ")}`);

  const outputDirectory = resolve(outputDirectoryArg);
  const shots = getStaticGkAiShotPlan(visualId);
  const prompts = compileStaticGkAiShotPrompts(shots);
  const takeCount = takesPerShot();
  const generatedAt = new Date().toISOString();
  await writeJsonAtomic(join(outputDirectory, `${visualId}.ai-shot-prompts.json`), {
    schemaVersion: 1,
    visualId,
    generatedAt,
    prompts: prompts.map(({ promptText, ...rest }) => ({ ...rest, promptText })),
  });

  const shotReceipts: StaticGkAiVideoShotReceipt[] = [];
  const partialPath = join(outputDirectory, `${visualId}.ai-generation.partial.json`);
  for (let shotIndex = 0; shotIndex < prompts.length; shotIndex += 1) {
    const prompt = prompts[shotIndex];
    const shot = shots[shotIndex];
    const takes = [];
    for (let takeNumber = 1; takeNumber <= takeCount; takeNumber += 1) {
      process.stdout.write(`[static-gk-ai-video] generating ${prompt.shotId} take ${takeNumber}/${takeCount}\n`);
      takes.push(await provider.generateTake({ prompt, takeNumber, outputDirectory }));
      await writeJsonAtomic(partialPath, {
        schemaVersion: 1,
        visualId,
        provider: provider.id,
        model: provider.model,
        generatedAt,
        completedShots: shotReceipts,
        activeShot: { shotId: prompt.shotId, takes },
      });
    }
    shotReceipts.push({
      shotId: prompt.shotId,
      order: prompt.order,
      purpose: shot.purpose,
      promptSha256: prompt.promptSha256,
      takes,
      selectedTakeNumber: takes[0].takeNumber,
      selectionStrategy: "first-successful-v1",
    });
    await writeJsonAtomic(partialPath, {
      schemaVersion: 1,
      visualId,
      provider: provider.id,
      model: provider.model,
      generatedAt,
      completedShots: shotReceipts,
    });
  }

  const receipt: StaticGkAiVideoGenerationReceipt = {
    schemaVersion: 1,
    visualId,
    kind: "ai-video-plates",
    provider: provider.id,
    model: provider.model,
    ratio: "720:1280",
    takesPerShot: takeCount,
    generatedAt,
    shots: shotReceipts,
  };
  await writeJsonAtomic(join(outputDirectory, `${visualId}.ai-generation-receipt.json`), receipt);
  process.stdout.write(`[static-gk-ai-video] generated ${shotReceipts.length} AI plates with ${takeCount} take(s) each\n`);
  return receipt;
}
