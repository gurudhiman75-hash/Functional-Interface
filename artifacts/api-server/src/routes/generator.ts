import { Router, Request, Response } from "express";
import { eq } from "drizzle-orm";

import { db } from "../db";

import { patterns } from "../../../lib/db/src";

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

export default router;