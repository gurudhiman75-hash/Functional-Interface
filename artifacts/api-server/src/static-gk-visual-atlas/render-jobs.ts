import { spawn } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { closeSync, openSync } from "node:fs";
import { access, mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";

import {
  assertStaticGkRenderJobId,
  isActiveStaticGkRenderStatus,
  normalizeStaticGkRenderableVisualId,
  staticGkRenderArtifactContentType,
  staticGkRenderArtifactFileName,
  STATIC_GK_RENDERABLE_VISUAL_IDS,
  type StaticGkRenderArtifactKey,
  type StaticGkRenderableVisualId,
  type StaticGkRenderJobStatus,
} from "./render-job-contract";

export interface StaticGkRenderJob {
  schemaVersion: "1.0";
  id: string;
  visualId: StaticGkRenderableVisualId;
  status: StaticGkRenderJobStatus;
  progress: number;
  activePhase: string;
  requestedAt: string;
  startedAt: string | null;
  renderCompletedAt: string | null;
  approvedAt: string | null;
  updatedAt: string;
  requestedBy: { userId: string; email: string; displayName: string };
  approvedBy: { userId: string; email: string; displayName: string } | null;
  error: string | null;
  artifacts: string[];
}

export interface StaticGkRenderCapability {
  enabled: boolean;
  ready: boolean;
  supportedVisualIds: readonly StaticGkRenderableVisualId[];
  geometryConfigured: boolean;
  ttsConfigured: boolean;
  jobRootConfigured: boolean;
  toolRunnerAvailable: boolean;
  blockers: string[];
}

export class StaticGkRenderJobError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "StaticGkRenderJobError";
  }
}

function configuredRoot(): string | null {
  const value = process.env.STATIC_GK_ATLAS_RENDER_JOB_ROOT?.trim();
  return value ? resolve(value) : null;
}

export function staticGkAtlasApiServerRoot(): string {
  const configured = process.env.STATIC_GK_ATLAS_API_SERVER_ROOT?.trim();
  if (configured) return resolve(configured);
  const cwd = process.cwd();
  return basename(cwd) === "api-server" ? cwd : resolve(cwd, "artifacts", "api-server");
}

export function staticGkAtlasToolRunnerPath(): string {
  const configured = process.env.STATIC_GK_ATLAS_TOOL_RUNNER_PATH?.trim();
  return configured ? resolve(configured) : join(staticGkAtlasApiServerRoot(), "static-gk-atlas-tool.mjs");
}

function requireRoot(): string {
  const root = configuredRoot();
  if (!root) {
    throw new StaticGkRenderJobError(
      "STATIC_GK_RENDER_JOB_ROOT_REQUIRED",
      "STATIC_GK_ATLAS_RENDER_JOB_ROOT must be configured before admin render jobs can run.",
      503,
    );
  }
  return root;
}

function jobDirectory(jobId: string): string {
  return join(requireRoot(), assertStaticGkRenderJobId(jobId));
}

function jobFile(jobId: string): string {
  return join(jobDirectory(jobId), "job.json");
}

export function staticGkRenderJobOutputDirectory(jobId: string): string {
  return join(jobDirectory(jobId), "output");
}

function sha256(bytes: Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex");
}

async function writeJsonAtomic(path: string, value: unknown): Promise<void> {
  const temp = `${path}.${randomUUID()}.tmp`;
  await writeFile(temp, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temp, path);
}

function parseJob(value: unknown): StaticGkRenderJob {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Render job state must be an object.");
  const raw = value as Record<string, unknown>;
  const id = assertStaticGkRenderJobId(String(raw.id ?? ""));
  const visualId = normalizeStaticGkRenderableVisualId(raw.visualId);
  const status = String(raw.status ?? "") as StaticGkRenderJobStatus;
  if (![
    "queued", "rendering", "synthesizing-audio", "assembling", "automated-qa", "review-ready", "approved", "failed",
  ].includes(status)) throw new Error("Render job has an invalid status.");
  return { ...raw, id, visualId, status } as unknown as StaticGkRenderJob;
}

export async function getStaticGkRenderCapability(): Promise<StaticGkRenderCapability> {
  const blockers: string[] = [];
  const enabled = process.env.STATIC_GK_ATLAS_RENDER_JOBS_ENABLED?.trim() === "1";
  const root = configuredRoot();
  const geometryPath = process.env.STATIC_GK_ATLAS_ADMIN_GEOMETRY_PATH?.trim();
  const geometryUrl = process.env.STATIC_GK_ATLAS_ADMIN_GEOMETRY_URL?.trim();
  const geometryConfigured = Number(Boolean(geometryPath)) + Number(Boolean(geometryUrl)) === 1;
  const ttsConfigured = Boolean(
    (process.env.STATIC_GK_ATLAS_OPENAI_API_KEY?.trim() || process.env.OPENAI_API_KEY?.trim()) &&
    process.env.STATIC_GK_ATLAS_TTS_MODEL?.trim() &&
    process.env.STATIC_GK_ATLAS_TTS_VOICE?.trim(),
  );
  let toolRunnerAvailable = false;
  try {
    await access(staticGkAtlasToolRunnerPath());
    toolRunnerAvailable = true;
  } catch {
    toolRunnerAvailable = false;
  }

  if (!enabled) blockers.push("Admin render jobs are disabled. Set STATIC_GK_ATLAS_RENDER_JOBS_ENABLED=1.");
  if (!root) blockers.push("STATIC_GK_ATLAS_RENDER_JOB_ROOT is not configured.");
  if (!geometryConfigured) blockers.push("Configure exactly one validated runtime geometry path or HTTPS URL.");
  if (!ttsConfigured) blockers.push("Static GK TTS model, voice and API key are not fully configured.");
  if (!toolRunnerAvailable) blockers.push("Static GK tool runner is not available to the API runtime.");

  return {
    enabled,
    ready: blockers.length === 0,
    supportedVisualIds: STATIC_GK_RENDERABLE_VISUAL_IDS,
    geometryConfigured,
    ttsConfigured,
    jobRootConfigured: Boolean(root),
    toolRunnerAvailable,
    blockers,
  };
}

export async function getStaticGkRenderJob(jobId: string): Promise<StaticGkRenderJob> {
  try {
    return parseJob(JSON.parse(await readFile(jobFile(jobId), "utf8")) as unknown);
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code === "ENOENT") {
      throw new StaticGkRenderJobError("STATIC_GK_RENDER_JOB_NOT_FOUND", "Static GK render job not found.", 404);
    }
    throw error;
  }
}

export async function listStaticGkRenderJobs(limit = 12): Promise<StaticGkRenderJob[]> {
  const root = configuredRoot();
  if (!root) return [];
  let entries;
  try {
    entries = await readdir(root, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code === "ENOENT") return [];
    throw error;
  }
  const jobs: StaticGkRenderJob[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    try {
      jobs.push(await getStaticGkRenderJob(entry.name));
    } catch {
      // Ignore partial/unrelated directories in the configured job root.
    }
  }
  return jobs
    .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt))
    .slice(0, Math.max(1, Math.min(limit, 50)));
}

export async function updateStaticGkRenderJob(
  jobId: string,
  patch: Partial<Omit<StaticGkRenderJob, "id" | "visualId" | "schemaVersion" | "requestedAt" | "requestedBy">>,
): Promise<StaticGkRenderJob> {
  const current = await getStaticGkRenderJob(jobId);
  const next: StaticGkRenderJob = {
    ...current,
    ...patch,
    progress: Math.max(0, Math.min(100, Number(patch.progress ?? current.progress))),
    updatedAt: new Date().toISOString(),
  };
  await writeJsonAtomic(jobFile(jobId), next);
  return next;
}

export async function createStaticGkRenderJob(input: {
  visualId: unknown;
  requestedBy: StaticGkRenderJob["requestedBy"];
}): Promise<StaticGkRenderJob> {
  const capability = await getStaticGkRenderCapability();
  if (!capability.ready) {
    throw new StaticGkRenderJobError(
      "STATIC_GK_RENDER_JOBS_NOT_READY",
      capability.blockers.join(" "),
      503,
    );
  }
  const visualId = normalizeStaticGkRenderableVisualId(input.visualId);
  const existing = (await listStaticGkRenderJobs(50)).find(
    (job) => job.visualId === visualId && isActiveStaticGkRenderStatus(job.status),
  );
  if (existing) {
    throw new StaticGkRenderJobError(
      "STATIC_GK_RENDER_ALREADY_ACTIVE",
      `A render job is already active for ${visualId}.`,
      409,
    );
  }

  const id = randomUUID();
  const directory = jobDirectory(id);
  await mkdir(staticGkRenderJobOutputDirectory(id), { recursive: true });
  const now = new Date().toISOString();
  const job: StaticGkRenderJob = {
    schemaVersion: "1.0",
    id,
    visualId,
    status: "queued",
    progress: 0,
    activePhase: "Queued for pre-publication render",
    requestedAt: now,
    startedAt: null,
    renderCompletedAt: null,
    approvedAt: null,
    updatedAt: now,
    requestedBy: input.requestedBy,
    approvedBy: null,
    error: null,
    artifacts: [],
  };
  await writeJsonAtomic(join(directory, "job.json"), job);

  const logFd = openSync(join(directory, "worker.log"), "a");
  try {
    const child = spawn(
      process.execPath,
      [staticGkAtlasToolRunnerPath(), "run-prepublication-job", visualId, id],
      {
        cwd: staticGkAtlasApiServerRoot(),
        env: process.env,
        stdio: ["ignore", logFd, logFd],
        detached: false,
      },
    );
    child.once("error", (error) => {
      void updateStaticGkRenderJob(id, {
        status: "failed",
        activePhase: "Worker failed to start",
        error: error.message,
        renderCompletedAt: new Date().toISOString(),
      }).catch(() => undefined);
    });
    child.unref();
  } finally {
    closeSync(logFd);
  }
  return job;
}

export async function approveStaticGkRenderJob(input: {
  jobId: string;
  approvedBy: NonNullable<StaticGkRenderJob["approvedBy"]>;
}): Promise<StaticGkRenderJob> {
  const job = await getStaticGkRenderJob(input.jobId);
  if (job.status !== "review-ready") {
    throw new StaticGkRenderJobError(
      "STATIC_GK_RENDER_NOT_REVIEW_READY",
      "Only a review-ready Static GK render can be approved.",
      409,
    );
  }
  const outputDirectory = staticGkRenderJobOutputDirectory(job.id);
  const qaPath = join(outputDirectory, staticGkRenderArtifactFileName(job.visualId, "qa-receipt"));
  const qaBytes = await readFile(qaPath);
  const approvedAt = new Date().toISOString();
  const approvalReceipt = {
    schemaVersion: "1.0",
    jobId: job.id,
    visualId: job.visualId,
    status: "approved-for-publication",
    publishReady: true,
    qaReceiptSha256: sha256(qaBytes),
    reviewedGates: [
      "Human narration intelligibility and pronunciation review",
      "Final rendered-video visual and factual QA against locked facts and authoritative geometry",
    ],
    approvedAt,
    approvedBy: input.approvedBy,
    note: "Approval marks this master ready for a separate publication action; it does not publish automatically.",
  };
  await writeJsonAtomic(
    join(outputDirectory, staticGkRenderArtifactFileName(job.visualId, "approval-receipt")),
    approvalReceipt,
  );
  return updateStaticGkRenderJob(job.id, {
    status: "approved",
    activePhase: "Approved for publication",
    approvedAt,
    approvedBy: input.approvedBy,
    artifacts: Array.from(new Set([...job.artifacts, "approval-receipt"])),
  });
}

export async function getStaticGkRenderArtifact(input: {
  jobId: string;
  artifactKey: string;
}): Promise<{ path: string; fileName: string; contentType: string }> {
  const job = await getStaticGkRenderJob(input.jobId);
  const allowed: StaticGkRenderArtifactKey[] = ["video", "thumbnail", "captions", "qa-receipt", "approval-receipt"];
  if (!allowed.includes(input.artifactKey as StaticGkRenderArtifactKey)) {
    throw new StaticGkRenderJobError("STATIC_GK_RENDER_ARTIFACT_NOT_FOUND", "Unknown render artifact.", 404);
  }
  const key = input.artifactKey as StaticGkRenderArtifactKey;
  if (key === "approval-receipt" && job.status !== "approved") {
    throw new StaticGkRenderJobError("STATIC_GK_RENDER_ARTIFACT_NOT_FOUND", "Approval receipt is not available.", 404);
  }
  const fileName = staticGkRenderArtifactFileName(job.visualId, key);
  const path = join(staticGkRenderJobOutputDirectory(job.id), fileName);
  try {
    await access(path);
  } catch {
    throw new StaticGkRenderJobError("STATIC_GK_RENDER_ARTIFACT_NOT_FOUND", "Render artifact is not available.", 404);
  }
  return { path, fileName, contentType: staticGkRenderArtifactContentType(key) };
}
