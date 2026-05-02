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

const router = Router();

// ── Type Definitions ─────────────────────────────────────────────────────────

interface GeneratePatternRequest {
  patternId: string;
  count: number;
  examProfile?: GeneratorOptions["examProfile"];
  targetDifficulty?: number;
  difficultyTolerance?: number;
  difficultyDistribution?: GeneratorOptions["difficultyDistribution"];
  targetAverageDifficulty?: number;
  setProfile?: GeneratorOptions["setProfile"];
}

interface GeneratePatternResponse {
  success: boolean;
  questions?: GeneratorResult["questions"];
  error?: string;
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

  return {
    id: dbPattern.id,
    type:
      dbPattern.type as Pattern["type"],
    section: dbPattern.section,
    topic: dbPattern.topic,
    subtopic: dbPattern.subtopic,
    difficulty:
      dbPattern.difficulty as Pattern["difficulty"],
    templateVariants:
      dbPattern.templateVariants as string[],
    variables:
      dbPattern.variables as Pattern["variables"],
    diPattern:
      dbPattern.diPattern as Pattern["diPattern"],
    formula:
      dbPattern.formula ?? undefined,
    explanationTemplate:
      dbPattern.explanationTemplate ??
      undefined,
    distractorStrategy:
      dbPattern.distractorStrategy as Pattern["distractorStrategy"],
  };
}

// ── POST /api/generator/pattern ───────────────────────────────────────────────

router.post("/pattern", async (req: Request, res: Response) => {
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

    res.status(200).json({
      success: true,
      questions: result.questions,
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
      targetDifficulty,
      difficultyTolerance,
      difficultyDistribution,
      targetAverageDifficulty,
      setProfile,
    } = req.body as {
      pattern: Pattern;
      count: number;
      targetDifficulty?: number;
      difficultyTolerance?: number;
      difficultyDistribution?: GeneratorOptions["difficultyDistribution"];
      targetAverageDifficulty?: number;
      setProfile?: GeneratorOptions["setProfile"];
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
      generateFromPattern(
        pattern,
        count,
        {
          targetDifficulty,
          difficultyTolerance,
          difficultyDistribution,
          targetAverageDifficulty,
          setProfile,
        } satisfies GeneratorOptions,
      );

    res.status(200).json({
      success: true,
      questions: result.questions,
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
