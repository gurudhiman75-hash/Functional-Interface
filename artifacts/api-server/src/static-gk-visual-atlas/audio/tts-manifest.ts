export interface StaticGkTtsManifestItem {
  id: string;
  text: string;
  factIds: string[];
  startMs: number;
  approvedEndMs: number;
  approvedWindowDurationMs: number;
  measuredDurationMs: number;
  fitsWindow: boolean;
  audioFile: string;
  audioSha256: string;
  sampleRate: number;
  channels: number;
  bitsPerSample: number;
}

export interface StaticGkTtsManifest {
  schemaVersion: "1.0";
  visualId: string;
  locale: "en-IN";
  status: "timing-rejected" | "audio-ready";
  provider: "openai";
  model: string;
  voice: string;
  speed: number;
  instructions: string | null;
  responseFormat: "wav";
  items: StaticGkTtsManifestItem[];
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function stringValue(value: unknown, label: string): string {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${label} must be a non-empty string.`);
  return value;
}

function integer(value: unknown, label: string): number {
  if (!Number.isInteger(value) || Number(value) < 0) throw new Error(`${label} must be a non-negative integer.`);
  return Number(value);
}

function positiveInteger(value: unknown, label: string): number {
  const number = integer(value, label);
  if (number <= 0) throw new Error(`${label} must be positive.`);
  return number;
}

function parseItem(value: unknown, index: number): StaticGkTtsManifestItem {
  const item = record(value, `TTS item ${index}`);
  const factIds = Array.isArray(item.factIds) ? item.factIds.map((factId, factIndex) => stringValue(factId, `TTS item ${index} fact ${factIndex}`)) : [];
  if (factIds.length === 0) throw new Error(`TTS item ${index} must bind at least one fact.`);
  const startMs = integer(item.startMs, `TTS item ${index} startMs`);
  const approvedEndMs = positiveInteger(item.approvedEndMs, `TTS item ${index} approvedEndMs`);
  const approvedWindowDurationMs = positiveInteger(item.approvedWindowDurationMs, `TTS item ${index} approvedWindowDurationMs`);
  const measuredDurationMs = positiveInteger(item.measuredDurationMs, `TTS item ${index} measuredDurationMs`);
  if (approvedEndMs - startMs !== approvedWindowDurationMs) {
    throw new Error(`TTS item ${index} approved timing is internally inconsistent.`);
  }
  const audioSha256 = stringValue(item.audioSha256, `TTS item ${index} audioSha256`).toLowerCase();
  if (!/^[a-f0-9]{64}$/.test(audioSha256)) throw new Error(`TTS item ${index} has an invalid audio SHA-256.`);
  return {
    id: stringValue(item.id, `TTS item ${index} id`),
    text: stringValue(item.text, `TTS item ${index} text`),
    factIds,
    startMs,
    approvedEndMs,
    approvedWindowDurationMs,
    measuredDurationMs,
    fitsWindow: item.fitsWindow === true,
    audioFile: stringValue(item.audioFile, `TTS item ${index} audioFile`),
    audioSha256,
    sampleRate: positiveInteger(item.sampleRate, `TTS item ${index} sampleRate`),
    channels: positiveInteger(item.channels, `TTS item ${index} channels`),
    bitsPerSample: positiveInteger(item.bitsPerSample, `TTS item ${index} bitsPerSample`),
  };
}

export function parseStaticGkTtsManifest(value: unknown): StaticGkTtsManifest {
  const manifest = record(value, "TTS manifest");
  if (manifest.schemaVersion !== "1.0") throw new Error("Unsupported TTS manifest schemaVersion.");
  if (manifest.locale !== "en-IN") throw new Error("Only en-IN TTS manifests are supported in CP005.");
  if (manifest.provider !== "openai") throw new Error("Unsupported TTS provider.");
  if (manifest.responseFormat !== "wav") throw new Error("TTS manifest must use WAV audio.");
  if (manifest.status !== "audio-ready" && manifest.status !== "timing-rejected") {
    throw new Error("Unsupported TTS manifest status.");
  }
  const speed = Number(manifest.speed);
  if (!Number.isFinite(speed) || speed < 0.25 || speed > 4) throw new Error("TTS manifest speed is invalid.");
  if (manifest.instructions !== null && typeof manifest.instructions !== "string") {
    throw new Error("TTS manifest instructions must be a string or null.");
  }
  const items = Array.isArray(manifest.items) ? manifest.items.map(parseItem) : [];
  if (items.length === 0) throw new Error("TTS manifest has no narration clips.");
  const ids = new Set<string>();
  for (const item of items) {
    if (ids.has(item.id)) throw new Error(`Duplicate TTS narration id ${item.id}.`);
    ids.add(item.id);
    if (item.measuredDurationMs > item.approvedWindowDurationMs && item.fitsWindow) {
      throw new Error(`${item.id}: fitsWindow contradicts measured duration.`);
    }
  }
  return {
    schemaVersion: "1.0",
    visualId: stringValue(manifest.visualId, "TTS visualId"),
    locale: "en-IN",
    status: manifest.status,
    provider: "openai",
    model: stringValue(manifest.model, "TTS model"),
    voice: stringValue(manifest.voice, "TTS voice"),
    speed,
    instructions: manifest.instructions as string | null,
    responseFormat: "wav",
    items,
  };
}
