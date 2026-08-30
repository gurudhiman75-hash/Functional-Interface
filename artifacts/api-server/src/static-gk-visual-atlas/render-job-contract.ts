export const STATIC_GK_RENDERABLE_VISUAL_IDS = [
  "SGK-VIS-IND-GEO-001",
  "SGK-VIS-IND-GEO-002",
] as const;

export type StaticGkRenderableVisualId = (typeof STATIC_GK_RENDERABLE_VISUAL_IDS)[number];

export type StaticGkRenderJobStatus =
  | "queued"
  | "rendering"
  | "synthesizing-audio"
  | "assembling"
  | "automated-qa"
  | "review-ready"
  | "approved"
  | "failed";

export type StaticGkRenderArtifactKey =
  | "video"
  | "thumbnail"
  | "captions"
  | "qa-receipt"
  | "approval-receipt";

const VISUAL_ALIASES = new Map<string, StaticGkRenderableVisualId>([
  ["tropic", "SGK-VIS-IND-GEO-001"],
  ["tropic-of-cancer", "SGK-VIS-IND-GEO-001"],
  ["SGK-VIS-IND-GEO-001", "SGK-VIS-IND-GEO-001"],
  ["standard-meridian", "SGK-VIS-IND-GEO-002"],
  ["meridian", "SGK-VIS-IND-GEO-002"],
  ["SGK-VIS-IND-GEO-002", "SGK-VIS-IND-GEO-002"],
]);

const ACTIVE_STATUSES = new Set<StaticGkRenderJobStatus>([
  "queued",
  "rendering",
  "synthesizing-audio",
  "assembling",
  "automated-qa",
]);

export function normalizeStaticGkRenderableVisualId(value: unknown): StaticGkRenderableVisualId {
  if (typeof value !== "string") throw new Error("visualId must be a string.");
  const resolved = VISUAL_ALIASES.get(value.trim());
  if (!resolved) throw new Error(`Unsupported Static GK render visual '${value}'.`);
  return resolved;
}

export function isActiveStaticGkRenderStatus(status: StaticGkRenderJobStatus): boolean {
  return ACTIVE_STATUSES.has(status);
}

export function assertStaticGkRenderJobId(value: string): string {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    throw new Error("Invalid Static GK render job id.");
  }
  return value;
}

export function staticGkRenderArtifactFileName(
  visualId: StaticGkRenderableVisualId,
  key: StaticGkRenderArtifactKey,
): string {
  switch (key) {
    case "video":
      return `${visualId}.narrated-master.mp4`;
    case "thumbnail":
      return `${visualId}.thumbnail.png`;
    case "captions":
      return `${visualId}.captions.measured.vtt`;
    case "qa-receipt":
      return `${visualId}.qa-receipt.json`;
    case "approval-receipt":
      return `${visualId}.approval-receipt.json`;
  }
}

export function staticGkRenderArtifactContentType(key: StaticGkRenderArtifactKey): string {
  switch (key) {
    case "video": return "video/mp4";
    case "thumbnail": return "image/png";
    case "captions": return "text/vtt; charset=utf-8";
    case "qa-receipt":
    case "approval-receipt":
      return "application/json; charset=utf-8";
  }
}
