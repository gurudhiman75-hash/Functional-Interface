import { Router, Request, Response } from "express";
import { eq } from "drizzle-orm";

import { db } from "../lib/db";

import {
  patterns,
  questions as questionsTable,
} from "@workspace/db";

import {
  generateQuestionBatch,
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
import { ALL_PATTERNS } from "../lib/patterns";
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

const router = Router();
const REGISTERED_PATTERNS =
  ALL_PATTERNS as Pattern[];

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
          error: "Internal server error",
        });
    }
  },
);

router.get(
  "/patterns",
  async (_req, res) => {
    try {
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
            name:
              `${pattern.topic} - ${pattern.subtopic}`,
          });
        }
      }

      return res.json({
        patterns: mergedRows,
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
        .status(500)
        .json({
          error: "Internal server error",
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
        patternId,
        count,
        seed,
        examProfile,
        targetDifficulty,
        difficultyTolerance,
        difficultyDistribution,
        targetAverageDifficulty,
        setProfile,
      } = req.body;

      if (
        !patternId ||
        typeof count !== "number"
      ) {
        return res
          .status(400)
          .json({
            error: "Invalid input",
          });
      }

      const rows = await db
        .select()
        .from(patterns)
        .where(
          eq(
            patterns.id,
            patternId,
          ),
        );

      const dbPattern = rows[0];
      const registeredPattern =
        getRegisteredPattern(patternId);

      if (
        !dbPattern &&
        !registeredPattern
      ) {
        return res
          .status(404)
          .json({
            error:
              "Pattern not found",
          });
      }

      const pattern: Pattern =
        normalizeStoredPattern(
          (dbPattern ??
            registeredPattern) as Record<
            string,
            unknown
          >,
        );

      if (
        pattern.type === "di" &&
        !pattern.diPattern
      ) {
        return res
          .status(400)
          .json({
            error:
              "DI pattern configuration is missing. Edit and save this pattern again with DI Pattern JSON.",
          });
      }

      const result =
        await generateFromPattern(
          pattern,
          count,
          {
            seed,
            examProfile,
            targetDifficulty,
            difficultyTolerance,
            difficultyDistribution,
            targetAverageDifficulty,
            setProfile,
          } satisfies GeneratorOptions,
        );

      return res.json(result);
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
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const {
        patternId,
        count,
        seed,
        examProfile,
        targetDifficulty,
        difficultyTolerance,
        difficultyDistribution,
        targetAverageDifficulty,
        setProfile,
      } = req.body;

      if (
        !patternId ||
        !validateAsyncJobCount(count)
      ) {
        return res
          .status(400)
          .json({
            error:
              "Invalid input. patternId is required and count must be an integer between 1 and 10000.",
          });
      }

      const rows = await db
        .select()
        .from(patterns)
        .where(
          eq(
            patterns.id,
            patternId,
          ),
        );
      const dbPattern = rows[0];
      const registeredPattern =
        getRegisteredPattern(patternId);

      if (
        !dbPattern &&
        !registeredPattern
      ) {
        return res
          .status(404)
          .json({
            error:
              "Pattern not found",
          });
      }

      const pattern: Pattern =
        normalizeStoredPattern(
          (dbPattern ??
            registeredPattern) as Record<
            string,
            unknown
          >,
        );
      const job =
        await enqueueGenerationJob(
          {
            patternId,
            pattern,
            count,
            options: {
              seed,
              examProfile,
              targetDifficulty,
              difficultyTolerance,
              difficultyDistribution,
              targetAverageDifficulty,
              setProfile,
            } satisfies GeneratorOptions,
            source: "pattern",
          },
        );

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
          error: "Internal server error",
        });
    }
  },
);

router.post(
  "/pattern/manual/jobs",
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const {
        pattern,
        count,
        seed,
        examProfile,
        targetDifficulty,
        difficultyTolerance,
        difficultyDistribution,
        targetAverageDifficulty,
        setProfile,
      } = req.body ?? {};

      if (
        !pattern ||
        typeof pattern !== "object" ||
        !validateAsyncJobCount(count)
      ) {
        return res
          .status(400)
          .json({
            error:
              "Invalid input. pattern must be an object and count must be an integer between 1 and 10000.",
          });
      }

      const job =
        await enqueueGenerationJob(
          {
            pattern:
              pattern as Pattern,
            count,
            options: {
              seed,
              examProfile,
              targetDifficulty,
              difficultyTolerance,
              difficultyDistribution,
              targetAverageDifficulty,
              setProfile,
            } satisfies GeneratorOptions,
            source: "manual",
          },
        );

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
          error: "Internal server error",
        });
    }
  },
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
      const { questions } =
        req.body;

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
            globalTopicId:
              "generator-topic",
            text: q.text,
            options: q.options,
            correct: q.correct,
            explanation:
              q.explanation ?? "",
            section:
              q.section ?? "general",
            topic:
              q.topic ?? "General",
            difficulty:
              q.difficulty ?? "Easy",
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
