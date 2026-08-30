import type { StaticGkRenderableVisualId } from "../render-job-contract";

export const STATIC_GK_AI_VIDEO_PROVIDER_IDS = ["runway"] as const;
export type StaticGkAiVideoProviderId = (typeof STATIC_GK_AI_VIDEO_PROVIDER_IDS)[number];

export type StaticGkAiShotId = `${StaticGkRenderableVisualId}:shot-${number}`;

export interface StaticGkAiShotPlan {
  visualId: StaticGkRenderableVisualId;
  shotId: StaticGkAiShotId;
  order: number;
  durationSeconds: 5;
  purpose: string;
  subject: string;
  environment: string;
  camera: string;
  lighting: string;
  composition: string;
  continuity: string;
}

export interface CompiledStaticGkAiShotPrompt {
  visualId: StaticGkRenderableVisualId;
  shotId: StaticGkAiShotId;
  order: number;
  durationSeconds: 5;
  promptText: string;
  promptSha256: string;
}

export interface StaticGkAiVideoTakeReceipt {
  provider: StaticGkAiVideoProviderId;
  model: string;
  providerTaskId: string;
  shotId: StaticGkAiShotId;
  takeNumber: number;
  durationSeconds: 5;
  ratio: "720:1280";
  promptSha256: string;
  outputFileName: string;
  createdAt: string;
  completedAt: string;
}

export interface StaticGkAiVideoShotReceipt {
  shotId: StaticGkAiShotId;
  order: number;
  purpose: string;
  promptSha256: string;
  takes: StaticGkAiVideoTakeReceipt[];
  selectedTakeNumber: number;
  selectionStrategy: "first-successful-v1";
}

export interface StaticGkAiVideoGenerationReceipt {
  schemaVersion: 1;
  visualId: StaticGkRenderableVisualId;
  kind: "ai-video-plates";
  provider: StaticGkAiVideoProviderId;
  model: string;
  ratio: "720:1280";
  takesPerShot: number;
  generatedAt: string;
  shots: StaticGkAiVideoShotReceipt[];
}

export interface StaticGkAiVideoProviderGenerationRequest {
  prompt: CompiledStaticGkAiShotPrompt;
  takeNumber: number;
  outputDirectory: string;
}

export interface StaticGkAiVideoProvider {
  readonly id: StaticGkAiVideoProviderId;
  readonly model: string;
  generateTake(request: StaticGkAiVideoProviderGenerationRequest): Promise<StaticGkAiVideoTakeReceipt>;
}
