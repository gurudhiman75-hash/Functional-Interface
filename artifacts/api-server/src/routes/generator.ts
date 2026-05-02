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

const router = Router();

router.get(
  "/patterns",
  async (_req, res) => {
    try {
      const rows = await db
        .select()
        .from(patterns);

      return res.json({
        patterns: rows,
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
          dbPattern.type as Pattern["type"],
        section: dbPattern.section,
        topic: dbPattern.topic,
        subtopic:
          dbPattern.subtopic,
        difficulty:
          dbPattern.difficulty as Pattern["difficulty"],
        templateVariants:
          dbPattern.templateVariants as string[],
        variables:
          dbPattern.variables as Pattern["variables"],
        diPattern:
          dbPattern.diPattern as Pattern["diPattern"],
        formula:
          dbPattern.formula ??
          undefined,
        explanationTemplate:
          dbPattern.explanationTemplate ??
          undefined,
        distractorStrategy:
          dbPattern.distractorStrategy as Pattern["distractorStrategy"],
      };

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

export default router;
