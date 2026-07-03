import { Router, Request, Response } from "express";
import { readFile } from "node:fs/promises";
import { eq } from "drizzle-orm";

import { db } from "../lib/db";

import {
  patterns,
  questions as questionsTable,
  topicsGlobal,
} from "@workspace/db";

import {
  generateQuestionBatch,
  generateBatch,
  generateFromPattern,
  refineGeneratedQuestion,
  listTopicConfigs,
  type BulkGenerationRequest,
  type GeneratorOptions,
  type Pattern,
} from "../lib/generator";
import {
  enqueueGenerationJob,
  getGenerationJobById,
  listGenerationJobs,
  retryFailedGenerationJob,
  type GenerationJobStatus,
} from "../lib/generation-jobs";
import {
  getCorpusAuditJob,
  listCorpusAuditJobs,
  startCorpusAuditExportJob,
} from "../quant-v2/corpus-audit/corpus-audit-exporter";
import {
  CORPUS_AUDIT_PRESETS,
  isCorpusAuditPresetId,
} from "../quant-v2/corpus-audit/corpus-audit-presets";
import {
  CORPUS_AUDIT_EXPORT_PROFILES,
  estimateCorpusAuditExportSizeMb,
  isCorpusAuditExportProfileId,
} from "../quant-v2/corpus-audit/corpus-audit-profiles";
import {
  resolveMigratedQuantV2Domain,
  validateQuantV2SchedulerProfileForPreset,
  validateQuantV2TopologyForPreset,
} from "../lib/quant-v2/migrated-quant-topics";
import type {
  CorpusAuditExportOptions,
} from "../quant-v2/corpus-audit/corpus-audit-types";
import { ALL_PATTERNS } from "../lib/patterns";
import {
  listQuestionPatterns,
  normalizeExamStyle,
  resolveQuestionPatternToPattern,
} from "../lib/pattern-registry";
import { getQuestionColumnState } from "../lib/question-columns";
import {
  buildQuestionFingerprint,
  bulkUpsertQAReviews,
  getQAAnalyticsSummary,
  listQAReviews,
  upsertQAReview,
  type QAReviewRecord,
  type QAReviewAction,
} from "../lib/generator-qa-store";
import {
  applyNativeRealizations,
  getNativeRealizationCoverage,
} from "../lib/realizers";
import {
  parseSeatingGenerationBody,
} from "../lib/parse-seating-generation";
import {
  generateQuestion as generateQuantV4Questions,
  listQuantV4Packages,
} from "../quant-v4/generation-engine";

const router = Router();
const REGISTERED_PATTERNS =
  ALL_PATTERNS as Pattern[];

function getQuantV4RequestStatusCode(
  error: unknown,
) {
  if (
    error &&
    typeof error === "object" &&
    "statusCode" in error &&
    typeof (error as { statusCode?: unknown }).statusCode === "number"
  ) {
    return (error as { statusCode: number }).statusCode;
  }

  return 500;
}

router.post(
  "/generate",
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const {
        patternId,
        packageId,
        archetypeId,
        domain,
        topic,
        subtopic,
        canonicalProblemId,
        cpId,
        count = 5,
        languages,
        seed,
        difficulty,
        targetDifficulty,
        questionLanguageId,
      } = req.body as {
        patternId?: string;
        packageId?: string;
        archetypeId?: string;
        domain?: string;
        topic?: string;
        subtopic?: string;
        canonicalProblemId?: string;
        cpId?: string;
        count?: number;
        languages?: unknown;
        seed?: string;
        difficulty?: unknown;
        targetDifficulty?: number;
        questionLanguageId?: string;
      };

      if (
        !(patternId || packageId || archetypeId) &&
        !(typeof topic === "string" && typeof subtopic === "string")
      ) {
        return res.status(400).json({
          error:
            "patternId, packageId, archetypeId, or topic/subtopic is required",
        });
      }

      const safeCount = Math.min(
        1000,
        Math.max(
          1,
          Math.floor(Number(count) || 5),
        ),
      );
      const language =
        Array.isArray(languages) &&
        typeof languages[0] === "string"
          ? languages[0]
          : typeof languages === "string"
            ? languages
            : "en";
      const result = await generateQuantV4Questions({
        patternId,
        packageId: packageId as any,
        archetypeId: archetypeId as any,
        domain,
        topic,
        subtopic,
        canonicalProblemId,
        cpId,
        count: safeCount,
        language: language as any,
        seed,
        difficulty:
          difficulty ?? targetDifficulty,
        questionLanguageId,
      });

      return res.json({
        ...result,
        generationSystem: "quant-v4",
      });
    } catch (error) {
      console.error(error);

      return res.status(getQuantV4RequestStatusCode(error)).json({
        error:
          error instanceof Error
            ? error.message
            : "Internal server error",
      });
    }
  },
);

function getRegisteredPattern(
  patternId: string,
) : Pattern | undefined {
  return REGISTERED_PATTERNS.find(
    (pattern) => pattern.id === patternId,
  );
}

function mergePatternSources(
  dbPattern: Record<string, unknown>,
  registeredPattern?: Pattern,
) : Record<string, unknown> {
  const preferRegisteredScalar = (
    key: keyof Pattern,
  ) =>
    registeredPattern?.[key] ??
    dbPattern[key as string];
  const preferRegisteredArray = (
    key: keyof Pattern,
  ) =>
    Array.isArray(registeredPattern?.[key])
      ? registeredPattern?.[key]
      : dbPattern[key as string];

  return {
    ...registeredPattern,
    ...dbPattern,
    id:
      String(
        dbPattern["id"] ??
          registeredPattern?.id ??
          "",
      ) || registeredPattern?.id,
    name: String(
      dbPattern["name"] ??
        [
          registeredPattern?.topic,
          registeredPattern?.subtopic,
        ]
          .filter(Boolean)
          .join(" - ") ??
        registeredPattern?.id ??
        "",
    ),
    templateVariants: Array.isArray(
      dbPattern["templateVariants"],
    )
      ? (dbPattern["templateVariants"] as string[])
      : registeredPattern?.templateVariants,
    generationDomain:
      preferRegisteredScalar(
        "generationDomain",
      ),
    arrangementType:
      preferRegisteredScalar(
        "arrangementType",
      ),
    arrangementTypes:
      preferRegisteredArray(
        "arrangementTypes",
      ),
    orientationType:
      preferRegisteredScalar(
        "orientationType",
      ),
    orientationTypes:
      preferRegisteredArray(
        "orientationTypes",
      ),
    participantCount:
      preferRegisteredScalar(
        "participantCount",
      ),
    clueTypes: preferRegisteredArray(
      "clueTypes",
    ),
    inferenceDepth:
      preferRegisteredScalar(
        "inferenceDepth",
      ),
    supportedMotifs:
      preferRegisteredArray(
        "supportedMotifs",
      ),
    variables:
      dbPattern["variables"] &&
      typeof dbPattern["variables"] ===
        "object" &&
      !Array.isArray(
        dbPattern["variables"],
      )
        ? (dbPattern["variables"] as Pattern["variables"])
        : registeredPattern?.variables,
    diPattern:
      dbPattern["diPattern"] &&
      typeof dbPattern["diPattern"] ===
        "object" &&
      !Array.isArray(
        dbPattern["diPattern"],
      )
        ? (dbPattern["diPattern"] as Pattern["diPattern"])
        : registeredPattern?.diPattern,
    distractorStrategy:
      dbPattern["distractorStrategy"] &&
      typeof dbPattern["distractorStrategy"] ===
        "object" &&
      !Array.isArray(
        dbPattern["distractorStrategy"],
      )
        ? (dbPattern["distractorStrategy"] as Pattern["distractorStrategy"])
        : registeredPattern?.distractorStrategy,
  };
}

type FinalizedLanguage =
  | "en"
  | "hi"
  | "pa";

function asFourOptions(
  value: unknown,
): string[] | null {
  return Array.isArray(value) &&
    value.length === 4
    ? value.map((item) =>
        String(item ?? ""),
      )
    : null;
}

function buildFinalizedLanguages(
  question: any,
) {
  const languages: Partial<
    Record<
      FinalizedLanguage,
      {
        question: string;
        options: string[];
        explanation: string;
      }
    >
  > = {};

  const baseOptions =
    asFourOptions(question.options) ?? [];
  const candidates: Array<{
    lang: FinalizedLanguage;
    text?: unknown;
    options?: unknown;
    explanation?: unknown;
  }> = [
    {
      lang: "en",
      text: question.text,
      options: question.options,
      explanation: question.explanation,
    },
    {
      lang: "hi",
      text: question.textHi,
      options: question.optionsHi,
      explanation: question.explanationHi,
    },
    {
      lang: "pa",
      text: question.textPa,
      options: question.optionsPa,
      explanation: question.explanationPa,
    },
  ];

  for (const candidate of candidates) {
    const text =
      typeof candidate.text === "string"
        ? candidate.text.trim()
        : "";
    if (!text) continue;

    languages[candidate.lang] = {
      question: text,
      options:
        asFourOptions(candidate.options) ??
        baseOptions,
      explanation:
        typeof candidate.explanation ===
        "string"
          ? candidate.explanation.trim()
          : "",
    };
  }

  return languages;
}

function extractProceduralLogic(
  question: any,
) {
  return (
    question.proceduralLogic ??
    question.logic ??
    question.proceduralScenario ??
    question.debugMetadata
      ?.proceduralScenario ??
    null
  );
}

function extractMotifs(question: any) {
  return (
    question.motifs ??
    question.extractedPatternIntelligence
      ?.motifs ??
    (question.debugMetadata
      ?.selectedMotif
      ? [
          question.debugMetadata
            .selectedMotif,
        ]
      : null)
  );
}

function normalizeBankDifficulty(
  value: unknown,
) {
  if (typeof value === "number") {
    if (value >= 4) return "Hard";
    if (value >= 2) return "Medium";
    return "Easy";
  }

  const text = String(value ?? "")
    .trim()
    .toLowerCase();

  if (text === "hard") return "Hard";
  if (text === "medium") return "Medium";
  if (text === "easy") return "Easy";

  return "Easy";
}

function normalizeUuidOrNull(
  value: unknown,
) {
  const text = String(value ?? "")
    .trim()
    .toLowerCase();

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
    text,
  )
    ? text
    : null;
}

function questionFromFilingPayload(
  payload: any,
) {
  const content = payload?.content ?? {};
  const en = content.en ?? {};
  const hi = content.hi ?? null;
  const pa = content.pa ?? null;
  const metadata = payload?.metadata ?? {};
  const logic = payload?.logic ?? null;

  return {
    text: String(en.question ?? ""),
    options: Array.isArray(en.options)
      ? en.options
      : [],
    correct:
      typeof en.correct === "number"
        ? en.correct
        : typeof payload.correct ===
            "number"
          ? payload.correct
          : 0,
    explanation: String(
      en.explanation ?? "",
    ),
    section:
      metadata.sectionName ??
      payload.subject_label ??
      payload.subject_id ??
      "general",
    sectionId:
      metadata.sectionId ??
      payload.subject_id ??
      null,
    topic:
      metadata.topicName ??
      payload.topic_label ??
      payload.topic_id ??
      "General",
    globalTopicId:
      metadata.topicId ??
      payload.topic_id ??
      null,
    subtopic:
      metadata.subTopicName ??
      payload.sub_topic_label ??
      payload.sub_topic_id ??
      null,
    difficulty:
      normalizeBankDifficulty(
        payload.difficulty,
      ),
    patternId:
      payload.pattern_id ?? null,
    proceduralLogic: {
      ...(logic && typeof logic === "object"
        ? logic
        : { source: logic }),
      filing: {
        subject_id:
          payload.subject_id ?? null,
        topic_id:
          payload.topic_id ?? null,
        sub_topic_id:
          payload.sub_topic_id ?? null,
        metadata,
      },
    },
    motifs:
      logic?.motifs ??
      payload.motifs ??
      [],
    languages: content,
    textHi: hi?.question ?? null,
    optionsHi: Array.isArray(hi?.options)
      ? hi.options
      : null,
    explanationHi:
      hi?.explanation ?? null,
    textPa: pa?.question ?? null,
    optionsPa: Array.isArray(pa?.options)
      ? pa.options
      : null,
    explanationPa:
      pa?.explanation ?? null,
    debugMetadata: {
      filingPayload: payload,
      targetExams:
        metadata.exams ?? [],
      systemTags:
        metadata.tags ?? [],
      isVerified:
        metadata.is_verified === true,
    },
  };
}

function normalizeStoredPattern(
  dbPattern: Record<string, unknown>,
): Pattern {
  const registeredPattern =
    getRegisteredPattern(
      String(dbPattern["id"] ?? ""),
    );
  const source = mergePatternSources(
    dbPattern,
    registeredPattern,
  );

  return {
    id: String(source["id"] ?? ""),
    type:
      (source["type"] as Pattern["type"]) ??
      "formula",
    section: String(
      source["section"] ?? "",
    ),
    topic: String(
      source["topic"] ?? "",
    ),
    subtopic: String(
      source["subtopic"] ?? "",
    ),
    difficulty:
      (source["difficulty"] as Pattern["difficulty"]) ??
      "Medium",
    generationDomain:
      (source["generationDomain"] as Pattern["generationDomain"]) ??
      undefined,
    arrangementType:
      (source["arrangementType"] as string | null) ??
      undefined,
    arrangementTypes: Array.isArray(
      source["arrangementTypes"],
    )
      ? (source["arrangementTypes"] as string[])
      : undefined,
    orientationType:
      (source["orientationType"] as string | null) ??
      undefined,
    orientationTypes: Array.isArray(
      source["orientationTypes"],
    )
      ? (source["orientationTypes"] as string[])
      : undefined,
    participantCount:
      typeof source["participantCount"] === "number"
        ? Number(source["participantCount"])
        : undefined,
    clueTypes: Array.isArray(
      source["clueTypes"],
    )
      ? (source["clueTypes"] as string[])
      : undefined,
    inferenceDepth:
      typeof source["inferenceDepth"] === "number"
        ? Number(source["inferenceDepth"])
        : undefined,
    templateVariants: Array.isArray(
      source["templateVariants"],
    )
      ? (source["templateVariants"] as string[])
      : [],
    variables:
      source["variables"] &&
      typeof source["variables"] ===
        "object" &&
      !Array.isArray(
        source["variables"],
      )
        ? (source["variables"] as Pattern["variables"])
        : {},
    diPattern:
      source["diPattern"] &&
      typeof source["diPattern"] ===
        "object" &&
      !Array.isArray(
        source["diPattern"],
      )
        ? (source["diPattern"] as Pattern["diPattern"])
        : undefined,
    formula:
      (source["formula"] as string | null) ??
      undefined,
    distractorStrategy:
      source["distractorStrategy"] &&
      typeof source["distractorStrategy"] ===
        "object" &&
      !Array.isArray(
        source["distractorStrategy"],
      )
        ? (source["distractorStrategy"] as Pattern["distractorStrategy"])
        : undefined,
    explanationTemplate:
      (source["explanationTemplate"] as string | null) ??
      undefined,
  };
}

function validateAsyncJobCount(
  count: unknown,
) {
  return (
    typeof count === "number" &&
    Number.isInteger(count) &&
    count >= 1 &&
    count <= 10000
  );
}

function validateCorpusAuditCount(
  count: unknown,
) {
  return (
    typeof count === "number" &&
    Number.isInteger(count) &&
    count >= 1 &&
    count <= 20000
  );
}

router.get(
  "/realization-coverage",
  async (_req, res) => {
    try {
      return res.json({
        languages: [
          getNativeRealizationCoverage("en"),
          getNativeRealizationCoverage("hi"),
          getNativeRealizationCoverage("pa"),
        ],
      });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          error:
            process.env.NODE_ENV ===
              "development" &&
            error instanceof Error
              ? error.message
              : "Internal server error",
        });
    }
  },
);

router.post(
  "/realize",
  async (req: Request, res: Response) => {
    try {
      const {
        question,
        logic,
        patternId,
        languages,
      } = req.body ?? {};

      const realized =
        applyNativeRealizations(
          {
            text:
              typeof question?.text ===
              "string"
                ? question.text
                : "",
            options: Array.isArray(
              question?.options,
            )
              ? question.options.map(
                  (option: unknown) =>
                    String(option ?? ""),
                )
              : ["", "", "", ""],
            correct:
              typeof question?.correct ===
              "number"
                ? question.correct
                : 0,
            explanation:
              typeof question
                ?.explanation === "string"
                ? question.explanation
                : "",
            proceduralLogic: logic,
            logic,
            patternId:
              typeof patternId ===
              "string"
                ? patternId
                : undefined,
          } as any,
          {
            languages:
              Array.isArray(languages)
                ? languages
                : ["en"],
            patternId:
              typeof patternId ===
              "string"
                ? patternId
                : undefined,
          },
        );

      return res.json({
        status: "success",
        question: realized,
        nativeRealization:
          (realized as any)
            .nativeRealization ?? null,
      });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          error:
            process.env.NODE_ENV ===
              "development" &&
            error instanceof Error
              ? error.message
              : "Internal server error",
        });
    }
  },
);

router.get(
  "/topic-configs",
  async (_req, res) => {
    try {
      return res.json({
        topicConfigs:
          listTopicConfigs(),
      });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          error:
            process.env.NODE_ENV ===
              "development" &&
            error instanceof Error
              ? error.message
              : "Internal server error",
        });
    }
  },
);

router.get(
  "/patterns",
  async (_req, res) => {
    try {
      return res.json({
        patterns: listQuantV4Packages(),
        generationSystem: "quant-v4",
      });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          error:
            process.env.NODE_ENV ===
              "development" &&
            error instanceof Error
              ? error.message
              : "Internal server error",
        });
    }
  },
);

router.get(
  "/question-patterns",
  async (_req, res) => {
    return res.json({
      patterns: listQuantV4Packages(),
      generationSystem: "quant-v4",
    });
  },
);

router.post(
  "/patterns",
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const pattern = req.body;

      if (
        !pattern.id ||
        !pattern.name
      ) {
        return res
          .status(400)
          .json({
            error:
              "Missing required fields",
          });
      }

      const rows = await db
        .insert(patterns)
        .values({
          id: pattern.id,
          name: pattern.name,
          section: pattern.section,
          topic: pattern.topic,
          subtopic: pattern.subtopic,
          type:
            pattern.type ?? "formula",
          difficulty:
            pattern.difficulty ?? "Easy",
          templateVariants:
            pattern.templateVariants,
          variables: pattern.variables,
          diPattern:
            pattern.diPattern,
          formula: pattern.formula,
          distractorStrategy:
            pattern.distractorStrategy,
          explanationTemplate:
            pattern.explanationTemplate,
        })
        .returning();

      return res.json({
        success: true,
        pattern: rows[0],
      });
    } catch (error) {
      console.error(error);

      return res
        .status(getQuantV4RequestStatusCode(error))
        .json({
          error:
            error instanceof Error
              ? error.message
              : "Internal server error",
        });
    }
  },
);

router.put(
  "/patterns/:id",
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { id } = req.params;
      const pattern = req.body;

      const rows = await db
        .update(patterns)
        .set({
          name: pattern.name,
          section: pattern.section,
          topic: pattern.topic,
          subtopic: pattern.subtopic,
          type: pattern.type,
          difficulty:
            pattern.difficulty,
          formula: pattern.formula,
          templateVariants:
            pattern.templateVariants,
          variables:
            pattern.variables,
          diPattern:
            pattern.diPattern,
          distractorStrategy:
            pattern.distractorStrategy,
          explanationTemplate:
            pattern.explanationTemplate,
        })
        .where(
          eq(patterns.id, id),
        )
        .returning();

      return res.json({
        success: true,
        pattern: rows[0],
      });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          error: "Internal server error",
        });
    }
  },
);

router.delete(
  "/patterns/:id",
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { id } = req.params;

      await db
        .delete(patterns)
        .where(
          eq(patterns.id, id),
        );

      return res.json({
        success: true,
      });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          error: "Internal server error",
        });
    }
  },
);

router.post(
  "/batch",
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const {
        batchSize,
        filters,
        options,
        maxAttempts,
      } =
        (req.body ??
          {}) as BulkGenerationRequest;

      if (
        typeof batchSize !==
          "number" ||
        !Number.isInteger(batchSize) ||
        batchSize < 1 ||
        batchSize > 10000
      ) {
        return res
          .status(400)
          .json({
            error:
              "batchSize must be an integer between 1 and 10000.",
          });
      }

      const rows = await db
        .select()
        .from(patterns);

      const mergedRows = [
        ...rows.map((row) =>
          mergePatternSources(
            row as unknown as Record<
              string,
              unknown
            >,
            getRegisteredPattern(row.id),
          ),
        ),
      ];

      for (const pattern of REGISTERED_PATTERNS) {
        if (
          !mergedRows.some(
            (row) => row.id === pattern.id,
          )
        ) {
          mergedRows.push({
            ...pattern,
          });
        }
      }

      const availablePatterns =
        mergedRows.map((row) =>
          normalizeStoredPattern(row),
        );
      const batch =
        await generateQuestionBatch(
          availablePatterns,
          {
            batchSize,
            filters,
            options,
            maxAttempts,
          },
        );

      return res.json(batch);
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          error: "Internal server error",
        });
    }
  },
);

router.post(
  "/pattern",
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const {
        domain,
        topic,
        subtopic,
        pattern: frontendPattern,
        patternId,
        count,
        seed,
        examProfile,
        examStyle,
        languages,
        difficulty,
        targetDifficulty,
        difficultyTolerance,
        difficultyDistribution,
        targetAverageDifficulty,
        setProfile,
        enableNameClash,
        useScheduler,
        schedulerProfile,
      } = req.body;

      if (typeof count !== "number") {
        return res
          .status(400)
          .json({
            error: "Invalid input",
          });
      }

      const language =
        Array.isArray(languages) &&
        typeof languages[0] === "string"
          ? languages[0]
          : "en";
      const quantV4Result =
        await generateQuantV4Questions({
          patternId:
            patternId ?? String(frontendPattern ?? ""),
          packageId:
            typeof frontendPattern === "string"
              ? (frontendPattern as any)
              : undefined,
          archetypeId:
            typeof frontendPattern === "string"
              ? (frontendPattern as any)
              : undefined,
          domain:
            typeof domain === "string"
              ? domain
              : undefined,
          topic:
            typeof topic === "string"
              ? topic
              : undefined,
          subtopic:
            typeof subtopic === "string"
              ? subtopic
              : undefined,
          count,
          language: language as any,
          seed,
          difficulty:
            difficulty ?? targetDifficulty,
        });

      return res.json({
        ...quantV4Result,
        generationSystem: "quant-v4",
      });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          error: "Internal server error",
        });
    }
  },
);

router.post(
  "/pattern/jobs",
  async (_req: Request, res: Response) =>
    res.status(410).json({
      success: false,
      error:
        "Async legacy generation jobs have been removed from Question Studio. Use Quant V4 package runtime generation only.",
      generationSystem: "quant-v4",
    }),
);

router.post(
  "/pattern/jobs",
  async (_req: Request, res: Response) =>
    res.status(410).json({
      success: false,
      error:
        "Async legacy generation jobs have been removed from Question Studio. Use Quant V4 package runtime generation only.",
      generationSystem: "quant-v4",
    }),
);

router.post(
  "/pattern/manual/jobs",
  async (_req: Request, res: Response) =>
    res.status(410).json({
      success: false,
      error:
        "Manual legacy generation jobs have been removed from Question Studio. Use Quant V4 package runtime generation only.",
      generationSystem: "quant-v4",
    }),
);

router.get(
  "/jobs",
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const status =
        typeof req.query["status"] ===
        "string"
          ? (req.query[
              "status"
            ] as GenerationJobStatus)
          : undefined;
      const limit = Number(
        req.query["limit"] ?? "",
      );
      const jobs =
        await listGenerationJobs({
          status,
          limit:
            Number.isFinite(limit) &&
            limit > 0
              ? limit
              : undefined,
        });

      return res.json({
        jobs,
      });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          error: "Internal server error",
        });
    }
  },
);

router.get(
  "/jobs/:id",
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const job =
        await getGenerationJobById(
          req.params.id,
        );

      if (!job) {
        return res
          .status(404)
          .json({
            error: "Job not found",
          });
      }

      return res.json({ job });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          error: "Internal server error",
        });
    }
  },
);

router.use(
  "/corpus-audit",
  async (_req: Request, res: Response) =>
    res.status(410).json({
      success: false,
      error:
        "Corpus generation infrastructure has been removed from Question Studio. Use Quant V4 package runtime generation only.",
      generationSystem: "quant-v4",
    }),
);

router.get(
  "/corpus-audit/presets",
  async (_req: Request, res: Response) => {
    return res.json({
      presets: CORPUS_AUDIT_PRESETS,
    });
  },
);

router.post(
  "/corpus-audit/exports",
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const {
        count,
        presetId,
        seed,
        outDir,
        includeSvg,
        includeFullQuestion,
        languages,
        topologySelection,
        realismProfile,
        compactnessProfile,
        difficultyMix,
        formats,
        exportProfile,
        includeMultilingualExplanations,
        useScheduler,
        schedulerProfile,
      } = req.body ?? {};

      if (!validateCorpusAuditCount(count)) {
        return res
          .status(400)
          .json({
            error:
              "Invalid corpus audit count. Use an integer between 1 and 20000.",
          });
      }

      if (
        typeof presetId === "string" &&
        !isCorpusAuditPresetId(presetId)
      ) {
        return res
          .status(400)
          .json({
            error:
              "Invalid corpus audit preset.",
          });
      }

      if (
        typeof exportProfile === "string" &&
        !isCorpusAuditExportProfileId(exportProfile)
      ) {
        return res
          .status(400)
          .json({
            error:
              "Invalid corpus audit export profile.",
          });
      }

      const resolvedPresetId =
        typeof presetId === "string"
          ? presetId
          : undefined;
      const topologyValidation =
        validateQuantV2TopologyForPreset(
          resolvedPresetId ??
            "ssc_percentage_audit",
          topologySelection,
        );

      if (!topologyValidation.valid) {
        return res
          .status(400)
          .json({
            error:
              topologyValidation.error ??
              "Invalid corpus audit topology.",
          });
      }

      const schedulerProfileValidation =
        validateQuantV2SchedulerProfileForPreset(
          resolvedPresetId ??
            "ssc_percentage_audit",
          schedulerProfile,
        );

      if (!schedulerProfileValidation.valid) {
        return res
          .status(400)
          .json({
            error:
              schedulerProfileValidation.error ??
              "Invalid corpus audit scheduler profile.",
          });
      }

      const job =
        startCorpusAuditExportJob({
          count,
          presetId: resolvedPresetId,
          seed:
            typeof seed === "string"
              ? seed
              : undefined,
          outDir:
            typeof outDir === "string"
              ? outDir
              : undefined,
          includeSvg:
            typeof includeSvg === "boolean"
              ? includeSvg
              : undefined,
          includeFullQuestion:
            typeof includeFullQuestion === "boolean"
              ? includeFullQuestion
              : undefined,
          languages:
            Array.isArray(languages)
              ? languages.filter(
                  (language) =>
                    language === "en" ||
                    language === "hi" ||
                    language === "pa",
                )
              : undefined,
          topologySelection:
            topologyValidation.topology,
          realismProfile:
            realismProfile === "pyq" ||
            realismProfile === "stress" ||
            realismProfile === "balanced"
              ? realismProfile
              : undefined,
          compactnessProfile:
            compactnessProfile === "ultra_compact" ||
            compactnessProfile === "compact" ||
            compactnessProfile === "balanced"
              ? compactnessProfile
              : undefined,
          difficultyMix:
            difficultyMix === "easy" ||
            difficultyMix === "medium" ||
            difficultyMix === "hard" ||
            difficultyMix === "balanced"
              ? difficultyMix
              : undefined,
          formats:
            Array.isArray(formats)
              ? formats.filter(
                  (format) =>
                    format === "json" ||
                    format === "txt" ||
                    format === "summary" ||
                    format === "pdf",
                )
              : undefined,
          exportProfile:
            typeof exportProfile === "string"
              ? exportProfile
              : undefined,
          includeMultilingualExplanations:
            typeof includeMultilingualExplanations === "boolean"
              ? includeMultilingualExplanations
              : undefined,
          useScheduler:
            typeof useScheduler === "boolean"
              ? useScheduler
              : undefined,
          schedulerProfile:
            schedulerProfileValidation.schedulerProfile,
        } satisfies CorpusAuditExportOptions);

      return res
        .status(202)
        .json({
          success: true,
          job,
        });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          error:
            error instanceof Error
              ? error.message
              : "Internal server error",
        });
    }
  },
);

router.get(
  "/corpus-audit/profiles",
  async (req: Request, res: Response) => {
    const count = Math.max(
      1,
      Math.min(
        20000,
        Number(req.query["count"] ?? 1000) ||
          1000,
      ),
    );

    return res.json({
      profiles: CORPUS_AUDIT_EXPORT_PROFILES.map(
        (profile) => ({
          ...profile,
          estimatedSizeMb:
            estimateCorpusAuditExportSizeMb({
              count,
              exportProfile: profile.id,
            }),
        }),
      ),
    });
  },
);

router.get(
  "/corpus-audit/exports",
  async (_req: Request, res: Response) => {
    return res.json({
      jobs: listCorpusAuditJobs(),
    });
  },
);

router.get(
  "/corpus-audit/exports/:id/samples",
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const job = getCorpusAuditJob(
        req.params.id,
      );

      if (!job?.files?.preview) {
        return res
          .status(404)
          .json({
            error:
              "Corpus audit sample preview is not available yet",
          });
      }

      const raw = await readFile(
        job.files.preview,
        "utf8",
      );
      const samples = JSON.parse(raw);
      const limit = Math.min(
        Math.max(
          Number(req.query["limit"] ?? 10) ||
            10,
          1,
        ),
        25,
      );

      return res.json({
        samples: Array.isArray(samples)
          ? samples.slice(0, limit)
          : [],
      });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          error: "Internal server error",
        });
    }
  },
);

router.get(
  "/corpus-audit/exports/:id/download/:artifact",
  async (
    req: Request,
    res: Response,
  ) => {
    const job = getCorpusAuditJob(
      req.params.id,
    );
    const artifact =
      req.params.artifact;

    if (!job?.files) {
      return res
        .status(404)
        .json({
          error:
            "Corpus audit export artifacts are not available yet",
        });
    }

    const filePath =
      artifact === "json"
        ? job.files.json
        : artifact === "txt"
          ? job.files.txt
          : artifact === "summary"
            ? job.files.summary
            : artifact === "preview"
              ? job.files.preview
              : artifact === "pdf"
                ? job.files.pdf
                : undefined;

    if (!filePath) {
      return res
        .status(404)
        .json({
          error:
            "Requested corpus audit artifact does not exist",
        });
    }

    return res.download(filePath);
  },
);

router.get(
  "/corpus-audit/exports/:id",
  async (
    req: Request,
    res: Response,
  ) => {
    const job = getCorpusAuditJob(
      req.params.id,
    );

    if (!job) {
      return res
        .status(404)
        .json({
          error:
            "Corpus audit export job not found",
        });
    }

    return res.json({ job });
  },
);

router.post(
  "/jobs/:id/retry",
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const job =
        await retryFailedGenerationJob(
          req.params.id,
        );

      if (!job) {
        return res
          .status(404)
          .json({
            error:
              "Failed job not found",
          });
      }

      return res.json({
        success: true,
        job,
      });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          error: "Internal server error",
        });
    }
  },
);

router.post(
  "/save",
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const filingPayloads =
        Array.isArray(
          req.body?.filingPayloads,
        )
          ? req.body.filingPayloads
          : req.body?.filingPayload
            ? [req.body.filingPayload]
            : null;
      const questions =
        filingPayloads
          ? filingPayloads.map(
              questionFromFilingPayload,
            )
          : req.body.questions;

      if (
        !Array.isArray(questions)
      ) {
        return res
          .status(400)
          .json({
            error:
              "questions must be array",
          });
      }

      const inserted = [];
      const questionColumns =
        await getQuestionColumnState();
      const bankGlobalTopicId =
        "generator-topic";

      if (
        questionColumns.hasGlobalTopicId
      ) {
        await db
          .insert(topicsGlobal)
          .values({
            id: bankGlobalTopicId,
            name: "Generator Bank",
          })
          .onConflictDoNothing();
      }

      for (const q of questions) {
        if (
          !q.text ||
          !Array.isArray(q.options)
        ) {
          continue;
        }

        const existing =
          await db
            .select()
            .from(questionsTable)
            .where(
              eq(
                questionsTable.text,
                q.text,
              ),
            );

        if (existing.length) {
          continue;
        }

        const rows = await db
          .insert(questionsTable)
          .values({
            clientId: "generator",
            testId: "__bank__",
            text: q.text,
            options: q.options,
            correct: q.correct,
            explanation:
              q.explanation ?? "",
            section:
              q.section ?? "general",
            ...(questionColumns.hasSectionId
              ? {
                  sectionId:
                    q.sectionId ?? null,
                }
              : {}),
            topic:
              q.topic ?? "General",
            ...(questionColumns.hasGlobalTopicId
              ? {
                globalTopicId:
                    q.globalTopicId ??
                    bankGlobalTopicId,
                }
              : {}),
            difficulty:
              q.difficulty ?? "Easy",
            ...(questionColumns.hasTextHi
              ? {
                  textHi:
                    q.textHi ?? null,
                }
              : {}),
            ...(questionColumns.hasOptionsHi
              ? {
                  optionsHi:
                    q.optionsHi ?? null,
                }
              : {}),
            ...(questionColumns.hasExplanationHi
              ? {
                  explanationHi:
                    q.explanationHi ??
                    null,
                }
              : {}),
            ...(questionColumns.hasTextPa
              ? {
                  textPa:
                    q.textPa ?? null,
                }
              : {}),
            ...(questionColumns.hasOptionsPa
              ? {
                  optionsPa:
                    q.optionsPa ?? null,
                }
              : {}),
            ...(questionColumns.hasExplanationPa
              ? {
                  explanationPa:
                    q.explanationPa ??
                    null,
                }
              : {}),
            ...(questionColumns.hasPatternId
              ? {
                  patternId:
                    normalizeUuidOrNull(
                      q.patternId ??
                        q.debugMetadata
                          ?.patternId,
                    ),
                }
              : {}),
            ...(questionColumns.hasProceduralLogic
              ? {
                  proceduralLogic:
                    extractProceduralLogic(q),
                }
              : {}),
            ...(questionColumns.hasMotifs
              ? {
                  motifs: extractMotifs(q),
                }
              : {}),
            ...(questionColumns.hasLanguages
              ? {
                  languages:
                    q.languages ??
                    buildFinalizedLanguages(q),
                }
              : {}),
            ...(questionColumns.hasSeatingDiagram
              ? {
                  seatingDiagram:
                    q.seatingDiagram ??
                    q.debugMetadata
                      ?.seatingDiagram ??
                    null,
                }
              : {}),
            ...(questionColumns.hasSeatingExplanationFlow
              ? {
                  seatingExplanationFlow:
                    q.seatingExplanationFlow ??
                    q.debugMetadata
                      ?.seatingExplanationFlow ??
                    null,
                }
              : {}),
          })
          .returning();

        inserted.push(rows[0]);
      }

      return res.json({
        success: true,
        count: inserted.length,
        questions: inserted,
      });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          error: "Internal server error",
        });
    }
  },
);

router.get(
  "/qa/reviews",
  async (_req, res) => {
    try {
      const reviews =
        await listQAReviews();

      return res.json({
        reviews,
      });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          error: "Internal server error",
        });
    }
  },
);

router.post(
  "/qa/reviews",
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const {
        fingerprint,
        status,
        action,
        topic,
        generationDomain,
        motif,
        archetype,
        arrangementType,
        reviewerNotes,
        validationStatus,
        issueTags,
        seed,
        topologyType,
        inferenceDepth,
        clueCount,
        redundancyScore,
        realismScore,
        structuralDiversityScore,
        difficultyConfidence,
        generationLatencyMs,
        uniquenessStatus,
        bookmarked,
        question,
      } = req.body ?? {};

      const resolvedFingerprint =
        typeof fingerprint ===
          "string" &&
        fingerprint.length
          ? fingerprint
          : buildQuestionFingerprint({
            text: question?.text,
            options:
              question?.options,
            topic:
              topic ??
              question?.topic,
            selectedMotif:
              motif ??
              question
                ?.debugMetadata
                ?.selectedMotif,
            selectedArchetype:
              archetype ??
              question
                ?.debugMetadata
                ?.selectedArchetype,
          });

      if (
        typeof status !== "string" ||
        typeof action !== "string"
      ) {
        return res
          .status(400)
          .json({
            error:
              "status and action are required",
          });
      }

      const review =
        await upsertQAReview({
          fingerprint:
            resolvedFingerprint,
          status:
            status as QAReviewRecord["status"],
          action:
            action as QAReviewAction,
          topic,
          generationDomain,
          motif,
          archetype,
          arrangementType,
          reviewerNotes,
          validationStatus,
          issueTags: Array.isArray(
            issueTags,
          )
            ? issueTags.filter(
              (tag): tag is string =>
                typeof tag ===
                "string" &&
                tag.length > 0,
            )
            : undefined,
          seed:
            typeof seed ===
              "string" &&
            seed.length
              ? seed
              : undefined,
          topologyType:
            typeof topologyType ===
              "string" &&
            topologyType.length
              ? topologyType
              : undefined,
          inferenceDepth:
            typeof inferenceDepth ===
            "number"
              ? inferenceDepth
              : undefined,
          clueCount:
            typeof clueCount ===
            "number"
              ? clueCount
              : undefined,
          redundancyScore:
            typeof redundancyScore ===
            "number"
              ? redundancyScore
              : undefined,
          realismScore:
            typeof realismScore ===
            "number"
              ? realismScore
              : undefined,
          structuralDiversityScore:
            typeof structuralDiversityScore ===
            "number"
              ? structuralDiversityScore
              : undefined,
          difficultyConfidence:
            typeof difficultyConfidence ===
            "number"
              ? difficultyConfidence
              : undefined,
          generationLatencyMs:
            typeof generationLatencyMs ===
            "number"
              ? generationLatencyMs
              : undefined,
          uniquenessStatus:
            typeof uniquenessStatus ===
              "string" &&
            uniquenessStatus.length
              ? uniquenessStatus
              : undefined,
          bookmarked:
            typeof bookmarked ===
            "boolean"
              ? bookmarked
              : undefined,
        });

      return res.json({
        success: true,
        review,
      });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          error: "Internal server error",
        });
    }
  },
);

router.post(
  "/qa/reviews/bulk",
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const reviews = Array.isArray(
        req.body?.reviews,
      )
        ? req.body.reviews
        : [];

      if (!reviews.length) {
        return res
          .status(400)
          .json({
            error:
              "reviews must be a non-empty array",
          });
      }

      const updated =
        await bulkUpsertQAReviews(
          reviews.map((entry: any) => ({
            fingerprint:
              typeof entry.fingerprint ===
                "string" &&
              entry.fingerprint.length
                ? entry.fingerprint
                : buildQuestionFingerprint({
                  text:
                    entry.question
                      ?.text,
                  options:
                    entry.question
                      ?.options,
                  topic:
                    entry.topic ??
                    entry.question
                      ?.topic,
                  selectedMotif:
                    entry.motif ??
                    entry.question
                      ?.debugMetadata
                      ?.selectedMotif,
                  selectedArchetype:
                    entry.archetype ??
                    entry.question
                      ?.debugMetadata
                      ?.selectedArchetype,
                }),
            status:
              entry.status as QAReviewRecord["status"],
            action:
              entry.action as QAReviewAction,
            topic: entry.topic,
            generationDomain:
              entry.generationDomain,
            motif: entry.motif,
            archetype:
              entry.archetype,
            arrangementType:
              entry.arrangementType,
            reviewerNotes:
              entry.reviewerNotes,
            validationStatus:
              entry.validationStatus,
            issueTags: Array.isArray(
              entry.issueTags,
            )
              ? entry.issueTags.filter(
                (tag: unknown): tag is string =>
                  typeof tag ===
                  "string" &&
                  tag.length > 0,
              )
              : undefined,
            seed:
              typeof entry.seed ===
                "string" &&
              entry.seed.length
                ? entry.seed
                : undefined,
            topologyType:
              typeof entry.topologyType ===
                "string" &&
              entry.topologyType.length
                ? entry.topologyType
                : undefined,
            inferenceDepth:
              typeof entry.inferenceDepth ===
              "number"
                ? entry.inferenceDepth
                : undefined,
            clueCount:
              typeof entry.clueCount ===
              "number"
                ? entry.clueCount
                : undefined,
            redundancyScore:
              typeof entry.redundancyScore ===
              "number"
                ? entry.redundancyScore
                : undefined,
            realismScore:
              typeof entry.realismScore ===
              "number"
                ? entry.realismScore
                : undefined,
            structuralDiversityScore:
              typeof entry.structuralDiversityScore ===
              "number"
                ? entry.structuralDiversityScore
                : undefined,
            difficultyConfidence:
              typeof entry.difficultyConfidence ===
              "number"
                ? entry.difficultyConfidence
                : undefined,
            generationLatencyMs:
              typeof entry.generationLatencyMs ===
              "number"
                ? entry.generationLatencyMs
                : undefined,
            uniquenessStatus:
              typeof entry.uniquenessStatus ===
                "string" &&
              entry.uniquenessStatus.length
                ? entry.uniquenessStatus
                : undefined,
            bookmarked:
              typeof entry.bookmarked ===
              "boolean"
                ? entry.bookmarked
                : undefined,
          })),
        );

      return res.json({
        success: true,
        reviews: updated,
      });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          error: "Internal server error",
        });
    }
  },
);

router.get(
  "/qa/analytics",
  async (_req, res) => {
    try {
      const analytics =
        await getQAAnalyticsSummary();

      return res.json({
        analytics,
      });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          error: "Internal server error",
        });
    }
  },
);

router.post(
  "/refine",
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const question =
        req.body?.question;
      const patternId =
        typeof req.body?.patternId ===
        "string" &&
        req.body.patternId.length
          ? req.body.patternId
          : undefined;
      const qualityThresholds =
        req.body?.qualityThresholds &&
        typeof req.body
          .qualityThresholds ===
          "object"
          ? req.body
              .qualityThresholds
          : undefined;

      if (
        !question ||
        typeof question !== "object"
      ) {
        return res
          .status(400)
          .json({
            error:
              "question payload is required",
          });
      }

      const refinedQuestion =
        refineGeneratedQuestion(
          question,
          {
            pattern: patternId
              ? getRegisteredPattern(
                patternId,
              )
              : undefined,
            qualityThresholds,
          },
        );

      return res.json({
        success: true,
        question: refinedQuestion,
      });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          error: "Internal server error",
        });
    }
  },
);

export default router;
