import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import { generateQuestion as generateQuantV4Questions } from "../quant-v4/generation-engine";

const router = Router();

type Difficulty = "Easy" | "Medium" | "Hard";
type Distribution = Record<Difficulty, number>;

const PRESETS: Record<string, Distribution> = {
  balanced: { Easy: 30, Medium: 50, Hard: 20 },
  "easy-heavy": { Easy: 50, Medium: 40, Hard: 10 },
  "exam-level": { Easy: 20, Medium: 55, Hard: 25 },
  "hard-heavy": { Easy: 10, Medium: 40, Hard: 50 },
};

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asPositiveInteger(value: unknown, fallback: number, max: number) {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function hash(value: string) {
  let output = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    output ^= value.charCodeAt(index);
    output = Math.imul(output, 16777619);
  }
  return output >>> 0;
}

function deterministicShuffle<T>(items: readonly T[], seed: string) {
  const next = [...items];
  let state = hash(seed) || 1;
  for (let index = next.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [next[index], next[swapIndex]] = [next[swapIndex]!, next[index]!];
  }
  return next;
}

function readDistribution(value: unknown, preset: string): Distribution {
  if (preset !== "custom") return PRESETS[preset] ?? PRESETS.balanced;
  const record = value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
  const distribution: Distribution = {
    Easy: Number(record.Easy),
    Medium: Number(record.Medium),
    Hard: Number(record.Hard),
  };
  const values = Object.values(distribution);
  if (values.some((entry) => !Number.isFinite(entry) || entry < 0 || entry > 100)) {
    throw Object.assign(new Error("Difficulty percentages must be numbers between 0 and 100"), {
      statusCode: 400,
      code: "INVALID_DIFFICULTY_DISTRIBUTION",
    });
  }
  const total = values.reduce((sum, entry) => sum + entry, 0);
  if (Math.abs(total - 100) > 0.001) {
    throw Object.assign(new Error(`Difficulty percentages must total 100, received ${total}`), {
      statusCode: 400,
      code: "DIFFICULTY_DISTRIBUTION_TOTAL_INVALID",
    });
  }
  return distribution;
}

function allocateDifficultyCounts(count: number, weights: Distribution): Record<Difficulty, number> {
  const entries = (Object.entries(weights) as Array<[Difficulty, number]>).map(([difficulty, weight]) => {
    const exact = (count * weight) / 100;
    return { difficulty, value: Math.floor(exact), remainder: exact - Math.floor(exact) };
  });
  let remaining = count - entries.reduce((sum, entry) => sum + entry.value, 0);
  entries
    .sort((left, right) => right.remainder - left.remainder || right.value - left.value)
    .forEach((entry) => {
      if (remaining > 0) {
        entry.value += 1;
        remaining -= 1;
      }
    });
  return Object.fromEntries(entries.map((entry) => [entry.difficulty, entry.value])) as Record<Difficulty, number>;
}

function publicRunCode() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();
  return `GEN-${date}-${suffix}`;
}

router.use(authenticate);

router.post("/runs", requireAdminPermission("content.generation.run"), async (req, res, next) => {
  if (asString(req.body?.difficulty).toLowerCase() !== "mixed") {
    next();
    return;
  }

  const count = asPositiveInteger(req.body?.count, 5, 50);
  const packageId = asString(req.body?.packageId) || undefined;
  const patternId = asString(req.body?.patternId) || undefined;
  const topic = asString(req.body?.topic) || "Arithmetic";
  const subtopic = asString(req.body?.subtopic) || "Percentage";
  const exam = asString(req.body?.exam) || "SSC CGL";
  const subject = asString(req.body?.subject) || "Quantitative Aptitude";
  const languageRaw = asString(req.body?.language).toLowerCase();
  const language = languageRaw === "hi" || languageRaw === "pa" ? languageRaw : "en";
  const baseSeed = asString(req.body?.seed) || `mixed:${Date.now()}:${randomUUID()}`;
  const difficultyPreset = asString(req.body?.difficultyPreset).toLowerCase() || "balanced";
  const runId = randomUUID();
  const code = publicRunCode();
  const timestamp = new Date().toISOString();

  if (!packageId && !patternId && !(topic && subtopic)) {
    res.status(400).json({ error: "A package, pattern, or topic/subtopic selection is required" });
    return;
  }

  try {
    const difficultyDistribution = readDistribution(req.body?.difficultyDistribution, difficultyPreset);
    const difficultyCounts = allocateDifficultyCounts(count, difficultyDistribution);
    const generatedByDifficulty = await Promise.all(
      (Object.keys(difficultyCounts) as Difficulty[]).map(async (difficulty) => {
        const bandCount = difficultyCounts[difficulty];
        if (bandCount === 0) return [];
        try {
          const result = await generateQuantV4Questions({
            packageId: packageId as never,
            patternId,
            topic,
            subtopic,
            difficulty,
            language,
            seed: `${baseSeed}:${difficulty.toLowerCase()}`,
            count: bandCount,
          });
          return (Array.isArray(result.questions) ? result.questions : []).map((question) => ({
            ...question,
            difficulty,
            difficultyLabel: difficulty,
            mixedDifficulty: true,
            difficultyPreset,
          }));
        } catch (error) {
          throw Object.assign(new Error(`${difficulty} generation is not supported by the selected package: ${error instanceof Error ? error.message : "generation failed"}`), {
            statusCode: 422,
            code: "MIXED_DIFFICULTY_BAND_UNSUPPORTED",
            details: { difficulty, packageId, requestedCount: bandCount },
          });
        }
      }),
    );

    const generatedQuestions = deterministicShuffle(generatedByDifficulty.flat(), `${baseSeed}:mixed-order`);
    if (generatedQuestions.length !== count) {
      res.status(422).json({
        error: `Mixed generation returned ${generatedQuestions.length} of ${count} requested questions`,
        code: "MIXED_GENERATION_COUNT_MISMATCH",
        details: { requested: count, generated: generatedQuestions.length, difficultyCounts },
      });
      return;
    }

    const requestSnapshot = {
      exam,
      subject,
      difficulty: "Mixed",
      difficultyPreset,
      difficultyDistribution,
      difficultyCounts,
      count,
      packageId,
      patternId,
      topic,
      subtopic,
      language,
      seed: baseSeed,
      requestedByFirebaseUid: req.user?.id,
    };

    await sqlClient.begin(async (tx) => {
      await tx`
        INSERT INTO content.generation_runs (
          id, public_code, status, attempt_number, prompt_snapshot, request_snapshot,
          provider, model, prompt_tokens, completion_tokens, estimated_cost_paise,
          actual_cost_paise, started_at, completed_at, created_at, updated_at
        ) VALUES (
          ${runId}::uuid, ${code}, 'review'::generation_run_status, 1,
          ${JSON.stringify(requestSnapshot)}, ${JSON.stringify(requestSnapshot)},
          'examtree', 'quant-v4-mixed', 0, 0, 0, 0,
          ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}
        )
      `;

      for (let index = 0; index < generatedQuestions.length; index += 1) {
        const itemId = randomUUID();
        const versionId = randomUUID();
        const question = generatedQuestions[index] as Record<string, unknown>;
        const payload = {
          ...question,
          generationContext: {
            generationDomain: "quant-v4",
            mode: "mixed-difficulty",
            seed: baseSeed,
            difficultyPreset,
            difficultyDistribution,
            difficultyCounts,
          },
          validationResult: "pending",
        };
        await tx`
          INSERT INTO content.generation_run_items (
            id, generation_run_id, item_number, status, current_version_number, created_at, updated_at
          ) VALUES (
            ${itemId}::uuid, ${runId}::uuid, ${index + 1},
            'unreviewed'::generation_item_status, 1, ${timestamp}, ${timestamp}
          )
        `;
        await tx`
          INSERT INTO content.generation_item_versions (
            id, generation_item_id, version_number, payload, provider_item_id, created_at
          ) VALUES (
            ${versionId}::uuid, ${itemId}::uuid, 1, ${JSON.stringify(payload)},
            ${asString(question.questionId) || null}, ${timestamp}
          )
        `;
      }

      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id, reason, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type,
          ${req.adminSession?.user.id ?? null}::uuid,
          'question_studio.generation_run.created', 'generation_run', ${runId}::uuid,
          'Admin generated a mixed-difficulty Question Studio batch',
          ${`Generated ${generatedQuestions.length} ${difficultyPreset} mixed-difficulty Quant V4 questions in ${code}`},
          ${JSON.stringify({ difficultyPreset, difficultyDistribution, difficultyCounts, packageId, topic, subtopic })}
        )
      `;
    });

    res.status(201).json({
      id: runId,
      publicCode: code,
      status: "review",
      itemCount: generatedQuestions.length,
      generationSystem: "quant-v4",
      difficulty: "Mixed",
      difficultyPreset,
      difficultyDistribution,
      difficultyCounts,
    });
  } catch (error) {
    console.error("Mixed-difficulty Question Studio generation failed", error);
    const statusCode = Number((error as { statusCode?: unknown })?.statusCode);
    res.status(Number.isFinite(statusCode) ? statusCode : 500).json({
      error: error instanceof Error ? error.message : "Unable to generate mixed-difficulty questions",
      code: asString((error as { code?: unknown })?.code) || "MIXED_DIFFICULTY_GENERATION_FAILED",
      details: (error as { details?: unknown })?.details,
    });
  }
});

export default router;
