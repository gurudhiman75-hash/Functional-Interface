import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type {
  StaticGkAiVideoProvider,
  StaticGkAiVideoProviderGenerationRequest,
  StaticGkAiVideoTakeReceipt,
} from "../types";

const RUNWAY_API_BASE_URL = "https://api.dev.runwayml.com/v1";
const DEFAULT_RUNWAY_API_VERSION = "2024-11-06";
const DEFAULT_RUNWAY_MODEL = "gen4.5";
const DEFAULT_TASK_TIMEOUT_MS = 12 * 60 * 1000;
const MIN_POLL_INTERVAL_MS = 5_000;

interface RunwayTaskResponse {
  id: string;
  status: "PENDING" | "THROTTLED" | "RUNNING" | "SUCCEEDED" | "FAILED" | "CANCELED";
  createdAt?: string;
  output?: string[];
  failure?: string;
  failureCode?: string;
}

export interface RunwayGenerationBody {
  model: string;
  promptText: string;
  ratio: "720:1280";
  duration: 5;
}

export function buildRunwayGenerationBody(promptText: string, model = DEFAULT_RUNWAY_MODEL): RunwayGenerationBody {
  if (!promptText.trim()) throw new Error("Runway prompt must not be empty");
  return { model, promptText, ratio: "720:1280", duration: 5 };
}

function positiveIntegerFromEnv(name: string, fallback: number, minimum: number, maximum: number): number {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new Error(`${name} must be an integer from ${minimum} to ${maximum}`);
  }
  return value;
}

function apiSecret(): string {
  const value = process.env.STATIC_GK_RUNWAY_API_SECRET?.trim() || process.env.RUNWAYML_API_SECRET?.trim();
  if (!value) throw new Error("Runway API secret is not configured");
  return value;
}

function headers(): Record<string, string> {
  return {
    Authorization: `Bearer ${apiSecret()}`,
    "Content-Type": "application/json",
    "X-Runway-Version": process.env.STATIC_GK_RUNWAY_API_VERSION?.trim() || DEFAULT_RUNWAY_API_VERSION,
  };
}

async function parseRunwayResponse(response: Response): Promise<RunwayTaskResponse> {
  const text = await response.text();
  let body: unknown;
  try { body = text ? JSON.parse(text) : {}; } catch { body = { raw: text.slice(0, 500) }; }
  if (!response.ok) {
    const detail = typeof body === "object" && body !== null ? JSON.stringify(body) : String(body);
    throw new Error(`Runway API ${response.status}: ${detail.slice(0, 900)}`);
  }
  if (typeof body !== "object" || body === null) throw new Error("Runway returned an invalid JSON response");
  const task = body as Partial<RunwayTaskResponse>;
  if (!task.id || !task.status) throw new Error("Runway response is missing task id or status");
  return task as RunwayTaskResponse;
}

async function createTask(body: RunwayGenerationBody): Promise<RunwayTaskResponse> {
  const response = await fetch(`${RUNWAY_API_BASE_URL}/image_to_video`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });
  return parseRunwayResponse(response);
}

async function retrieveTask(taskId: string): Promise<RunwayTaskResponse> {
  const response = await fetch(`${RUNWAY_API_BASE_URL}/tasks/${encodeURIComponent(taskId)}`, {
    method: "GET",
    headers: headers(),
  });
  return parseRunwayResponse(response);
}

function sleep(ms: number): Promise<void> { return new Promise((resolve) => setTimeout(resolve, ms)); }

async function waitForTask(taskId: string): Promise<RunwayTaskResponse> {
  const timeoutMs = positiveIntegerFromEnv("STATIC_GK_RUNWAY_TASK_TIMEOUT_MS", DEFAULT_TASK_TIMEOUT_MS, 60_000, 30 * 60 * 1000);
  const pollMs = positiveIntegerFromEnv("STATIC_GK_RUNWAY_POLL_INTERVAL_MS", MIN_POLL_INTERVAL_MS, MIN_POLL_INTERVAL_MS, 60_000);
  const deadline = Date.now() + timeoutMs;
  let transientFailures = 0;
  while (Date.now() < deadline) {
    try {
      const task = await retrieveTask(taskId);
      transientFailures = 0;
      if (task.status === "SUCCEEDED") return task;
      if (task.status === "FAILED") {
        throw new Error(`Runway task ${taskId} failed${task.failureCode ? ` (${task.failureCode})` : ""}: ${task.failure ?? "no failure detail"}`);
      }
      if (task.status === "CANCELED") throw new Error(`Runway task ${taskId} was canceled`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes("failed") || message.includes("canceled")) throw error;
      transientFailures += 1;
      if (transientFailures >= 5) throw new Error(`Runway polling failed repeatedly for ${taskId}: ${message}`);
    }
    const jitter = Math.floor(Math.random() * 900);
    await sleep(pollMs + jitter);
  }
  throw new Error(`Runway task ${taskId} exceeded ${timeoutMs}ms timeout`);
}

async function downloadVideo(url: string, outputPath: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not download Runway output: HTTP ${response.status}`);
  const contentType = response.headers.get("content-type")?.toLocaleLowerCase("en-US") ?? "";
  if (contentType && !contentType.includes("video") && !contentType.includes("octet-stream")) {
    throw new Error(`Runway output had unexpected content type '${contentType}'`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 16_384) throw new Error("Runway output video is unexpectedly small");
  await writeFile(outputPath, bytes);
}

export class RunwayStaticGkAiVideoProvider implements StaticGkAiVideoProvider {
  readonly id = "runway" as const;
  readonly model: string;

  constructor(model = process.env.STATIC_GK_RUNWAY_MODEL?.trim() || DEFAULT_RUNWAY_MODEL) {
    this.model = model;
  }

  async generateTake(request: StaticGkAiVideoProviderGenerationRequest): Promise<StaticGkAiVideoTakeReceipt> {
    if (!Number.isInteger(request.takeNumber) || request.takeNumber < 1 || request.takeNumber > 9) {
      throw new Error("AI video take number must be an integer from 1 to 9");
    }
    await mkdir(request.outputDirectory, { recursive: true });
    const createdAt = new Date().toISOString();
    const task = await createTask(buildRunwayGenerationBody(request.prompt.promptText, this.model));
    const completed = task.status === "SUCCEEDED" ? task : await waitForTask(task.id);
    const outputUrl = completed.output?.[0];
    if (!outputUrl) throw new Error(`Runway task ${task.id} succeeded without an output URL`);
    const safeShotId = request.prompt.shotId.replaceAll(":", "-");
    const outputFileName = `${safeShotId}.take-${request.takeNumber}.mp4`;
    await downloadVideo(outputUrl, join(request.outputDirectory, outputFileName));
    return {
      provider: this.id,
      model: this.model,
      providerTaskId: task.id,
      shotId: request.prompt.shotId,
      takeNumber: request.takeNumber,
      durationSeconds: 5,
      ratio: "720:1280",
      promptSha256: request.prompt.promptSha256,
      outputFileName,
      createdAt,
      completedAt: new Date().toISOString(),
    };
  }
}
