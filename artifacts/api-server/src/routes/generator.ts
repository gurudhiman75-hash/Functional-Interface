import { Router, Request, Response } from "express";
import { eq } from "drizzle-orm";

import { db } from "../lib/db";

import {
  patterns,
  questions as questionsTable,
} from "@workspace/db";

import {
  generateFromPattern,
  type Pattern,
} from "../lib/generator";

const router = Router();

router.post(
  "/pattern",
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { patternId, count } =
        req.body;

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

      if (!dbPattern) {
        return res
          .status(404)
          .json({
            error:
              "Pattern not found",
          });
      }

      const pattern: Pattern = {
        id: dbPattern.id,

        type:
          dbPattern.type as
            | "formula"
            | "logic",

        section:
          dbPattern.section,

        topic: dbPattern.topic,

        subtopic:
          dbPattern.subtopic,

        difficulty:
          dbPattern.difficulty as
            | "Easy"
            | "Medium"
            | "Hard"
            | undefined,

        templateVariants:
          dbPattern.templateVariants as string[],

        variables:
          dbPattern.variables as Record<
            string,
            {
              min: number;
              max: number;
            }
          >,

        formula:
          dbPattern.formula ??
          undefined,

        distractorStrategy:
          dbPattern.distractorStrategy as any,
      };

      const questions =
        generateFromPattern(
          pattern,
          count,
        );

      return res.json({
        questions,
      });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          error:
            "Internal server error",
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

      for (const q of questions) {
        if (
          !q.text ||
          !Array.isArray(q.options)
        ) {
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
              q.explanation ??
              "",

            section:
              q.section ??
              "general",

            topic:
              q.topic ??
              "General",

            difficulty:
              q.difficulty ??
              "Easy",
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
          error:
            "Internal server error",
        });
    }
  },
);

export default router;