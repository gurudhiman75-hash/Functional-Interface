import { Router, type Request, type Response } from "express";
import { generateFromPattern, getPatternById, type Pattern } from "../lib/generator";

const router = Router();

// ── Type Definitions ─────────────────────────────────────────────────────────

interface GeneratePatternRequest {
  patternId: string;
  count: number;
}

interface GeneratePatternResponse {
  success: boolean;
  questions?: Array<{
    text: string;
    options: string[];
    correct: number;
    explanation: string;
    section: string;
    topic: string;
  }>;
  error?: string;
}

// ── POST /api/generator/pattern ───────────────────────────────────────────────

router.post("/pattern", async (req: Request, res: Response) => {
  try {
    const { patternId, count } = req.body as GeneratePatternRequest;

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
    const questions = generateFromPattern(pattern, count);

    res.status(200).json({
      success: true,
      questions,
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
    const { pattern, count } = req.body as { pattern: Pattern; count: number };

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
    const questions = generateFromPattern(pattern, count);

    res.status(200).json({
      success: true,
      questions,
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
