import { Router, Request, Response } from "express";
import { eq } from "drizzle-orm";

import { db } from "../lib/db";

import {
  patterns,
  questions as questionsTable,
} from "@workspace/db";

import {
  generateFromPattern,
  type GeneratorOptions,
  type Pattern,
} from "../lib/generator";
import { ALL_PATTERNS } from "../lib/patterns";
import { getQuestionColumnState } from "../lib/question-columns";
import {
  buildQuestionFingerprint,
  bulkUpsertQAReviews,
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
  "/pattern",
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const {
        patternId,
        count,
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
        generateFromPattern(
          pattern,
          count,
          {
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

export default router;
