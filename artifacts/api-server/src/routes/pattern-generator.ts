import { Router, type Request, type Response } from "express";
import { eq } from "drizzle-orm";

import { db } from "../lib/db";
import { patterns } from "@workspace/db";
import {
  generateFromPattern,
  type GeneratorOptions,
  type GeneratorResult,
  type Pattern,
} from "../lib/generator";
import { ALL_PATTERNS } from "../lib/patterns";

const router = Router();
const REGISTERED_PATTERNS =
  ALL_PATTERNS as Pattern[];

// ── Type Definitions ─────────────────────────────────────────────────────────

interface GeneratePatternRequest {
  patternId: string;
  count: number;
  seed?: string;
  examProfile?: GeneratorOptions["examProfile"];
  targetDifficulty?: number;
  difficultyTolerance?: number;
  difficultyDistribution?: GeneratorOptions["difficultyDistribution"];
  targetAverageDifficulty?: number;
  setProfile?: GeneratorOptions["setProfile"];
  enableNameClash?: boolean;
}

interface GeneratePatternResponse {
  success: boolean;
  questions?: GeneratorResult["questions"];
  generationContext?: GeneratorResult["generationContext"];
  error?: string;
}

function normalizeStoredPattern(
  dbPattern: Record<string, unknown>,
): Pattern {
  const registeredPattern =
    REGISTERED_PATTERNS.find(
      (pattern) =>
        pattern.id ===
        String(dbPattern["id"] ?? ""),
    );
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
    id: String(dbPattern["id"] ?? ""),
    type:
      (dbPattern["type"] as Pattern["type"]) ??
      "formula",
    section: String(
      dbPattern["section"] ?? "",
    ),
    topic: String(
      dbPattern["topic"] ?? "",
    ),
    subtopic: String(
      dbPattern["subtopic"] ?? "",
    ),
    difficulty:
      (dbPattern["difficulty"] as Pattern["difficulty"]) ??
      "Medium",
    generationDomain:
      preferRegisteredScalar(
        "generationDomain",
      ) as Pattern["generationDomain"],
    arrangementType:
      (preferRegisteredScalar(
        "arrangementType",
      ) as string | null) ?? undefined,
    arrangementTypes:
      Array.isArray(
        preferRegisteredArray(
          "arrangementTypes",
        ),
      )
        ? (preferRegisteredArray(
            "arrangementTypes",
          ) as string[])
        : undefined,
    orientationType:
      (preferRegisteredScalar(
        "orientationType",
      ) as string | null) ?? undefined,
    orientationTypes:
      Array.isArray(
        preferRegisteredArray(
          "orientationTypes",
        ),
      )
        ? (preferRegisteredArray(
            "orientationTypes",
          ) as string[])
        : undefined,
    participantCount:
      typeof preferRegisteredScalar(
        "participantCount",
      ) === "number"
        ? Number(
            preferRegisteredScalar(
              "participantCount",
            ),
          )
        : undefined,
    clueTypes: Array.isArray(
      preferRegisteredArray(
        "clueTypes",
      ),
    )
      ? (preferRegisteredArray(
          "clueTypes",
        ) as string[])
      : undefined,
    inferenceDepth:
      typeof preferRegisteredScalar(
        "inferenceDepth",
      ) === "number"
        ? Number(
            preferRegisteredScalar(
              "inferenceDepth",
            ),
          )
        : undefined,
    templateVariants: Array.isArray(
      dbPattern["templateVariants"],
    )
      ? (dbPattern["templateVariants"] as string[])
      : [],
    variables:
      dbPattern["variables"] &&
      typeof dbPattern["variables"] ===
        "object" &&
      !Array.isArray(
        dbPattern["variables"],
      )
        ? (dbPattern["variables"] as Pattern["variables"])
        : {},
    diPattern:
      dbPattern["diPattern"] &&
      typeof dbPattern["diPattern"] ===
        "object" &&
      !Array.isArray(
        dbPattern["diPattern"],
      )
        ? (dbPattern["diPattern"] as Pattern["diPattern"])
        : undefined,
    formula:
      (dbPattern["formula"] as string | null) ??
      undefined,
    explanationTemplate:
      (dbPattern["explanationTemplate"] as string | null) ??
      undefined,
    distractorStrategy:
      dbPattern["distractorStrategy"] &&
      typeof dbPattern["distractorStrategy"] ===
        "object" &&
      !Array.isArray(
        dbPattern["distractorStrategy"],
      )
        ? (dbPattern["distractorStrategy"] as Pattern["distractorStrategy"])
        : undefined,
  };
}

async function getPatternById(
  patternId: string,
): Promise<Pattern | undefined> {
  const rows = await db
    .select()
    .from(patterns)
    .where(
      eq(patterns.id, patternId),
    );

  const dbPattern = rows[0];

  if (!dbPattern) {
    return undefined;
  }

  return normalizeStoredPattern(
    dbPattern,
  );
}

// ── POST /api/generator/pattern ───────────────────────────────────────────────

router.post("/pattern", async (req: Request, res: Response) => {
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
    } = req.body as GeneratePatternRequest;

    // Validate input
    if (!patternId || typeof patternId !== "string") {
      res.status(400).json({
        success: false,
        error: "patternId is required and must be a string",
      } satisfies GeneratePatternResponse);
      return;
    }

    if (!count || typeof count !== "number" || count < 1 || count > 50) {
      res.status(400).json({
        success: false,
        error: "count is required and must be a number between 1 and 50",
      } satisfies GeneratePatternResponse);
      return;
    }

    // Fetch pattern from database
    const pattern = await getPatternById(patternId);

    if (!pattern) {
      res.status(404).json({
        success: false,
        error: `Pattern with id '${patternId}' not found`,
      } satisfies GeneratePatternResponse);
      return;
    }

    // Generate questions
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
          enableNameClash:
            Boolean(
              req.body.enableNameClash,
            ),
          distractorArchetypes:
            req.body.enableNameClash
              ? ["NameClash"]
              : undefined,
        } satisfies GeneratorOptions,
      );

    res.status(200).json({
      success: true,
      questions: result.questions,
      generationContext:
        result.generationContext,
    } satisfies GeneratePatternResponse);
  } catch (error) {
    console.error("Error in /api/generator/pattern:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    } satisfies GeneratePatternResponse);
  }
});

// ── POST /api/generator/pattern/manual (for testing without DB) ───────────────

router.post("/pattern/manual", async (req: Request, res: Response) => {
  try {
    const {
      pattern,
      count,
      seed,
      targetDifficulty,
      difficultyTolerance,
      difficultyDistribution,
      targetAverageDifficulty,
      setProfile,
    } = req.body as {
      pattern: Pattern;
      count: number;
      seed?: string;
      targetDifficulty?: number;
      difficultyTolerance?: number;
      difficultyDistribution?: GeneratorOptions["difficultyDistribution"];
      targetAverageDifficulty?: number;
      setProfile?: GeneratorOptions["setProfile"];
      enableNameClash?: boolean;
    };

    // Validate input
    if (!pattern || typeof pattern !== "object") {
      res.status(400).json({
        success: false,
        error: "pattern is required and must be an object",
      } satisfies GeneratePatternResponse);
      return;
    }

    if (!count || typeof count !== "number" || count < 1 || count > 50) {
      res.status(400).json({
        success: false,
        error: "count is required and must be a number between 1 and 50",
      } satisfies GeneratePatternResponse);
      return;
    }

    // Generate questions
    const result =
      await generateFromPattern(
        pattern,
        count,
        {
          seed,
          targetDifficulty,
          difficultyTolerance,
          difficultyDistribution,
          targetAverageDifficulty,
          setProfile,
          enableNameClash:
            Boolean(enableNameClash),
          distractorArchetypes:
            enableNameClash
              ? ["NameClash"]
              : undefined,
        } satisfies GeneratorOptions,
      );

    res.status(200).json({
      success: true,
      questions: result.questions,
      generationContext:
        result.generationContext,
    } satisfies GeneratePatternResponse);
  } catch (error) {
    console.error("Error in /api/generator/pattern/manual:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    } satisfies GeneratePatternResponse);
  }
});

export default router;
