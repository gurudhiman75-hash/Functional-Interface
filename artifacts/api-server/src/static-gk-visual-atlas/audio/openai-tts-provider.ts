import OpenAI from "openai";

export const STATIC_GK_TTS_VOICES = [
  "alloy",
  "ash",
  "ballad",
  "coral",
  "echo",
  "fable",
  "onyx",
  "nova",
  "sage",
  "shimmer",
  "verse",
  "marin",
  "cedar",
] as const;

export type StaticGkTtsVoice = (typeof STATIC_GK_TTS_VOICES)[number];

export interface StaticGkTtsConfig {
  provider: "openai";
  model: string;
  voice: StaticGkTtsVoice;
  speed: number;
  instructions?: string;
  apiKey: string;
}

export interface StaticGkSpeechResult {
  audio: Uint8Array;
  provider: "openai";
  model: string;
  voice: StaticGkTtsVoice;
  speed: number;
  instructions?: string;
  responseFormat: "wav";
}

export class StaticGkTtsConfigurationError extends Error {}

function required(env: NodeJS.ProcessEnv, key: string): string {
  const value = String(env[key] ?? "").trim();
  if (!value) throw new StaticGkTtsConfigurationError(`${key} is not configured.`);
  return value;
}

function parseVoice(value: string): StaticGkTtsVoice {
  if ((STATIC_GK_TTS_VOICES as readonly string[]).includes(value)) return value as StaticGkTtsVoice;
  throw new StaticGkTtsConfigurationError(
    `STATIC_GK_ATLAS_TTS_VOICE must be one of: ${STATIC_GK_TTS_VOICES.join(", ")}`,
  );
}

function parseSpeed(value: string | undefined): number {
  if (!value?.trim()) return 1;
  const speed = Number(value);
  if (!Number.isFinite(speed) || speed < 0.25 || speed > 4) {
    throw new StaticGkTtsConfigurationError("STATIC_GK_ATLAS_TTS_SPEED must be between 0.25 and 4.0.");
  }
  return speed;
}

export function staticGkTtsConfigFromEnv(env: NodeJS.ProcessEnv = process.env): StaticGkTtsConfig {
  const model = required(env, "STATIC_GK_ATLAS_TTS_MODEL");
  const voice = parseVoice(required(env, "STATIC_GK_ATLAS_TTS_VOICE"));
  const apiKey = String(env.STATIC_GK_ATLAS_OPENAI_API_KEY ?? env.OPENAI_API_KEY ?? "").trim();
  if (!apiKey) {
    throw new StaticGkTtsConfigurationError(
      "Configure STATIC_GK_ATLAS_OPENAI_API_KEY or OPENAI_API_KEY for Static GK narration.",
    );
  }
  const instructions = String(env.STATIC_GK_ATLAS_TTS_INSTRUCTIONS ?? "").trim() || undefined;
  return {
    provider: "openai",
    model,
    voice,
    speed: parseSpeed(env.STATIC_GK_ATLAS_TTS_SPEED),
    ...(instructions ? { instructions } : {}),
    apiKey,
  };
}

export async function synthesizeStaticGkSpeech(
  text: string,
  config: StaticGkTtsConfig = staticGkTtsConfigFromEnv(),
): Promise<StaticGkSpeechResult> {
  const input = text.replace(/\s+/gu, " ").trim();
  if (!input) throw new Error("Static GK TTS input is empty.");
  if (input.length > 4_000) throw new Error("Static GK TTS input exceeds the per-beat safety limit.");

  const client = new OpenAI({ apiKey: config.apiKey });
  const response = await client.audio.speech.create({
    model: config.model,
    voice: config.voice,
    input,
    response_format: "wav",
    speed: config.speed,
    ...(config.instructions ? { instructions: config.instructions } : {}),
  });
  const audio = new Uint8Array(await response.arrayBuffer());
  if (audio.byteLength === 0) throw new Error("OpenAI TTS returned an empty WAV response.");
  return {
    audio,
    provider: "openai",
    model: config.model,
    voice: config.voice,
    speed: config.speed,
    ...(config.instructions ? { instructions: config.instructions } : {}),
    responseFormat: "wav",
  };
}
