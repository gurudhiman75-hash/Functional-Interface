import {
  and,
  desc,
  eq,
  sql,
} from "drizzle-orm";
import {
  generationJobs,
} from "@workspace/db";
import { db } from "./db";
import { logger } from "./logger";
import type {
  GeneratorOptions,
  GeneratorResult,
  Pattern,
} from "./generator";
import {
  buildReasoningErrorMetadata,
  isReasoningEngineError,
  ReasoningEngineError,
} from "./shared";

export type GenerationJobStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed";

type GenerationJobRequestPayload = {
  count: number;
  options?: GeneratorOptions;
  source: "pattern" | "manual";
};

type GenerationJobMetadata = {
  generationDomain?: string;
  seed?: string;
  requestedCount: number;
  generatedCount?: number;
  generationDurationMs?: number;
  generationContext?: GeneratorResult["generationContext"];
  errorCode?: string;
  errorPhase?: string;
};

export type GenerationJobRecord = {
  id: string;
  status: GenerationJobStatus;
  patternId: string | null;
  patternSnapshot: Pattern;
  requestPayload: GenerationJobRequestPayload;
  resultPayload: GeneratorResult | null;
  generationMetadata: GenerationJobMetadata | null;
  errorMessage: string | null;
  queuedAt: string;
  startedAt: string | null;
  completedAt: string | null;
  updatedAt: string;
};

type GeneratorModule = typeof import("./generator");
let generatorModulePromise: Promise<GeneratorModule> | null = null;

function loadGeneratorModule() {
  generatorModulePromise ??= import("./generator");
  return generatorModulePromise;
}

async function generationDomainFor(pattern: Pattern) {
  const { inferGenerationDomain } = await loadGeneratorModule();
  return inferGenerationDomain(pattern);
}

const JOB_POLL_INTERVAL_MS =
  Number(
    process.env[
      "GENERATION_JOB_POLL_INTERVAL_MS"
    ] ?? "",
  ) || 1500;
const JOB_MAX_CONCURRENCY =
  Math.max(
    1,
    Number(
      process.env[
        "GENERATION_JOB_MAX_CONCURRENCY"
      ] ?? "",
    ) || 1,
  );

let workerStarted = false;
let runningJobs = 0;
let workerDisabled = false;

function isMissingGenerationJobsRelation(
  error: unknown,
) {
  const candidate =
    error as {
      cause?: {
        code?: string;
      };
    };

  return (
    candidate?.cause?.code ===
    "42P01"
  );
}

function createJobId() {
  return `genjob_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function serializeTimestamp(
  value: Date | string | null,
) {
  if (!value) {
    return null;
  }

  return value instanceof Date
    ? value.toISOString()
    : new Date(value).toISOString();
}

function mapJobRow(
  row: typeof generationJobs.$inferSelect,
) : GenerationJobRecord {
  return {
    id: row.id,
    status: row.status,
    patternId: row.patternId,
    patternSnapshot:
      row.patternSnapshot as Pattern,
    requestPayload:
      row.requestPayload as GenerationJobRequestPayload,
    resultPayload:
      (row.resultPayload ??
        null) as GeneratorResult | null,
    generationMetadata:
      (row.generationMetadata ??
        null) as GenerationJobMetadata | null,
    errorMessage:
      row.errorMessage,
    queuedAt:
      serializeTimestamp(
        row.queuedAt,
      ) ?? new Date().toISOString(),
    startedAt:
      serializeTimestamp(
        row.startedAt,
      ),
    completedAt:
      serializeTimestamp(
        row.completedAt,
      ),
    updatedAt:
      serializeTimestamp(
        row.updatedAt,
      ) ?? new Date().toISOString(),
  };
}

function mapClaimedJobRow(
  row: Record<string, unknown>,
) : GenerationJobRecord {
  return {
    id: String(row["id"]),
    status:
      row["status"] as GenerationJobStatus,
    patternId:
      (row["pattern_id"] as string | null) ??
      null,
    patternSnapshot:
      row[
        "pattern_snapshot"
      ] as Pattern,
    requestPayload:
      row[
        "request_payload"
      ] as GenerationJobRequestPayload,
    resultPayload:
      (row[
        "result_payload"
      ] as GeneratorResult | null) ??
      null,
    generationMetadata:
      (row[
        "generation_metadata"
      ] as GenerationJobMetadata | null) ??
      null,
    errorMessage:
      (row[
        "error_message"
      ] as string | null) ?? null,
    queuedAt:
      serializeTimestamp(
        row[
          "queued_at"
        ] as Date | string | null,
      ) ?? new Date().toISOString(),
    startedAt:
      serializeTimestamp(
        row[
          "started_at"
        ] as Date | string | null,
      ),
    completedAt:
      serializeTimestamp(
        row[
          "completed_at"
        ] as Date | string | null,
      ),
    updatedAt:
      serializeTimestamp(
        row[
          "updated_at"
        ] as Date | string | null,
      ) ?? new Date().toISOString(),
  };
}

async function updateJobStatus(
  jobId: string,
  status: GenerationJobStatus,
  patch?: Partial<
    typeof generationJobs.$inferInsert
  >,
) {
  const rows = await db
    .update(generationJobs)
    .set({
      status,
      updatedAt: new Date(),
      ...patch,
    })
    .where(
      eq(generationJobs.id, jobId),
    )
    .returning();

  return rows[0]
    ? mapJobRow(rows[0]!)
    : null;
}

async function claimNextQueuedJob() {
  const claimed = await db.execute(sql`
    WITH next_job AS (
      SELECT id
      FROM generation_jobs
      WHERE status = 'queued'
      ORDER BY queued_at ASC
      LIMIT 1
      FOR UPDATE SKIP LOCKED
    )
    UPDATE generation_jobs
    SET status = 'running',
        started_at = NOW(),
        updated_at = NOW()
    WHERE id IN (SELECT id FROM next_job)
    RETURNING *;
  `);
  const row =
    claimed.rows?.[0] as
      | Record<string, unknown>
      | undefined;

  return row
    ? mapClaimedJobRow(row)
    : null;
}

async function processJob(
  job: GenerationJobRecord,
) {
  const startedAt = Date.now();

  try {
    const {
      generateFromPattern,
      inferGenerationDomain,
    } = await loadGeneratorModule();
    const result =
      await generateFromPattern(
        job.patternSnapshot,
        job.requestPayload.count,
        job.requestPayload.options,
      );
    const generationDurationMs =
      Date.now() - startedAt;
    const generationMetadata: GenerationJobMetadata =
      {
        generationDomain:
          inferGenerationDomain(
            job.patternSnapshot,
          ),
        seed:
          job.requestPayload.options?.seed,
        requestedCount:
          job.requestPayload.count,
        generatedCount:
          result.questions.length,
        generationDurationMs,
        generationContext:
          result.generationContext,
      };

    await updateJobStatus(
      job.id,
      "completed",
      {
        resultPayload: result,
        generationMetadata,
        completedAt: new Date(),
        errorMessage: null,
      },
    );

    logger.info(
      {
        jobId: job.id,
        patternId:
          job.patternId,
        status: "completed",
        generationMetadata,
      },
      "Generation job completed",
    );
  } catch (error) {
    const structuredError =
      isReasoningEngineError(error)
        ? error
        : new ReasoningEngineError({
          code:
            "GENERATION_JOB_FAILED",
          phase: "realization",
          message:
            error instanceof Error
              ? error.message
              : "Unknown generation job failure.",
          metadata:
            buildReasoningErrorMetadata({
              jobId: job.id,
              patternId:
                job.patternId,
              requestedCount:
                job.requestPayload.count,
            }),
          cause: error,
        });
    let generationDomain: string | undefined;
    try {
      generationDomain = await generationDomainFor(job.patternSnapshot);
    } catch {
      generationDomain = job.generationMetadata?.generationDomain;
    }
    const generationMetadata: GenerationJobMetadata =
      {
        generationDomain,
        seed:
          job.requestPayload.options?.seed,
        requestedCount:
          job.requestPayload.count,
        generationDurationMs:
          Date.now() - startedAt,
        errorCode:
          structuredError.code,
        errorPhase:
          structuredError.phase,
      };

    await updateJobStatus(
      job.id,
      "failed",
      {
        generationMetadata,
        completedAt: new Date(),
        errorMessage:
          structuredError.message,
      },
    );

    logger.error(
      {
        jobId: job.id,
        patternId:
          job.patternId,
        code:
          structuredError.code,
        phase:
          structuredError.phase,
        metadata:
          structuredError.metadata,
      },
      "Generation job failed",
    );
  }
}

async function tickWorker() {
  if (workerDisabled) {
    return;
  }

  if (
    runningJobs >=
    JOB_MAX_CONCURRENCY
  ) {
    return;
  }

  const job =
    await claimNextQueuedJob().catch(
      (error) => {
        if (
          isMissingGenerationJobsRelation(
            error,
          )
        ) {
          workerDisabled = true;
          logger.warn(
            "Generation job worker disabled because the generation_jobs table is missing. Run the migration to enable async generation jobs.",
          );
          return null;
        }

        logger.error(
          { error },
          "Generation job worker failed to claim the next queued job",
        );
        return null;
      },
    );

  if (!job) {
    return;
  }

  runningJobs += 1;

  void processJob(job).finally(
    () => {
      runningJobs = Math.max(
        0,
        runningJobs - 1,
      );
      void tickWorker();
    },
  );
}

export function startGenerationJobWorker() {
  if (workerStarted) {
    return;
  }

  workerStarted = true;
  setInterval(() => {
    void tickWorker();
  }, JOB_POLL_INTERVAL_MS);
  void tickWorker();
  logger.info(
    {
      intervalMs:
        JOB_POLL_INTERVAL_MS,
      concurrency:
        JOB_MAX_CONCURRENCY,
    },
    "Generation job worker started",
  );
}

export async function enqueueGenerationJob(
  input: {
    patternId?: string;
    pattern: Pattern;
    count: number;
    options?: GeneratorOptions;
    source?: "pattern" | "manual";
  },
) {
  const id = createJobId();
  const source =
    input.source ?? "pattern";
  const generationMetadata: GenerationJobMetadata =
    {
      generationDomain:
        await generationDomainFor(
          input.pattern,
        ),
      seed:
        input.options?.seed,
      requestedCount:
        input.count,
    };
  const rows = await db
    .insert(generationJobs)
    .values({
      id,
      status: "queued",
      patternId:
        input.patternId ?? null,
      patternSnapshot:
        input.pattern,
      requestPayload: {
        count: input.count,
        options:
          input.options,
        source,
      } satisfies GenerationJobRequestPayload,
      generationMetadata,
    })
    .returning();

  return mapJobRow(rows[0]!);
}

export async function getGenerationJobById(
  id: string,
) {
  const rows = await db
    .select()
    .from(generationJobs)
    .where(
      eq(generationJobs.id, id),
    )
    .limit(1);

  return rows[0]
    ? mapJobRow(rows[0]!)
    : null;
}

export async function listGenerationJobs(
  input?: {
    status?: GenerationJobStatus;
    limit?: number;
  },
) {
  const limit = Math.min(
    Math.max(input?.limit ?? 20, 1),
    100,
  );
  const query = db
    .select()
    .from(generationJobs);
  const rows = await (input?.status
    ? query
        .where(
          eq(
            generationJobs.status,
            input.status,
          ),
        )
        .orderBy(
          desc(generationJobs.queuedAt),
        )
        .limit(limit)
    : query
        .orderBy(
          desc(generationJobs.queuedAt),
        )
        .limit(limit));

  return rows.map(mapJobRow);
}

export async function retryFailedGenerationJob(
  id: string,
) {
  const rows = await db
    .update(generationJobs)
    .set({
      status: "queued",
      resultPayload: null,
      errorMessage: null,
      startedAt: null,
      completedAt: null,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(generationJobs.id, id),
        eq(generationJobs.status, "failed"),
      ),
    )
    .returning();

  return rows[0]
    ? mapJobRow(rows[0]!)
    : null;
}
