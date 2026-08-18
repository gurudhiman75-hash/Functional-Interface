import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import { generateQuestion as generateQuantV4Questions } from "../quant-v4/generation-engine";
import {
  generateQuestion as generateSharedQuestionStudioQuestions,
  isRnk001QuestionStudioRequest,
} from "../question-studio/shared-generation-engine";

const router = Router();

type Difficulty = "Easy" | "Medium" | "Hard";
type Distribution = Record<Difficulty, number>;
type ExamProfile = {
  id: string;
  version: number;
  aliases: string[];
  label: string;
  family: string;
  targetTimeSeconds: number;
  calculationComplexity: "friendly" | "moderate" | "intensive";
  maxReasoningSteps: number;
  preferredContexts: string[];
  discouragedContexts: string[];
  defaultDifficultyPreset: string;
  defaultDistribution: Distribution;
};

const PROFILES: ExamProfile[] = [
  { id: "SSC_CGL_T1", version: 1, aliases: ["ssc cgl", "ssc cgl tier 1", "ssc_cgl_t1"], label: "SSC CGL Tier 1", family: "SSC", targetTimeSeconds: 45, calculationComplexity: "moderate", maxReasoningSteps: 3, preferredContexts: ["marks", "population", "salary", "income", "votes", "students"], discouragedContexts: ["compound investment"], defaultDifficultyPreset: "exam-level", defaultDistribution: { Easy: 20, Medium: 55, Hard: 25 } },
  { id: "SSC_CHSL_T1", version: 1, aliases: ["ssc chsl", "ssc chsl tier 1", "ssc_chsl_t1"], label: "SSC CHSL Tier 1", family: "SSC", targetTimeSeconds: 50, calculationComplexity: "friendly", maxReasoningSteps: 3, preferredContexts: ["marks", "salary", "population", "students", "discount"], discouragedContexts: ["advanced investment"], defaultDifficultyPreset: "balanced", defaultDistribution: { Easy: 30, Medium: 50, Hard: 20 } },
  { id: "SSC_MTS", version: 1, aliases: ["ssc mts", "ssc_mts"], label: "SSC MTS", family: "SSC", targetTimeSeconds: 55, calculationComplexity: "friendly", maxReasoningSteps: 2, preferredContexts: ["students", "population", "price", "marks"], discouragedContexts: ["compound", "successive investment"], defaultDifficultyPreset: "easy-heavy", defaultDistribution: { Easy: 50, Medium: 40, Hard: 10 } },
  { id: "IBPS_PO_PRE", version: 1, aliases: ["ibps po", "ibps po prelims", "ibps_po_pre"], label: "IBPS PO Prelims", family: "Banking", targetTimeSeconds: 38, calculationComplexity: "intensive", maxReasoningSteps: 4, preferredContexts: ["income", "expenditure", "investment", "accounts", "profit", "sales"], discouragedContexts: ["votes"], defaultDifficultyPreset: "hard-heavy", defaultDistribution: { Easy: 10, Medium: 45, Hard: 45 } },
  { id: "IBPS_CLERK_PRE", version: 1, aliases: ["ibps clerk", "ibps clerk prelims", "ibps_clerk_pre"], label: "IBPS Clerk Prelims", family: "Banking", targetTimeSeconds: 42, calculationComplexity: "moderate", maxReasoningSteps: 3, preferredContexts: ["accounts", "salary", "income", "profit", "sales"], discouragedContexts: ["votes"], defaultDifficultyPreset: "exam-level", defaultDistribution: { Easy: 20, Medium: 55, Hard: 25 } },
  { id: "RRB_NTPC_CBT1", version: 1, aliases: ["rrb ntpc", "rrb ntpc cbt 1", "rrb_ntpc_cbt1"], label: "RRB NTPC CBT 1", family: "Railway", targetTimeSeconds: 50, calculationComplexity: "friendly", maxReasoningSteps: 3, preferredContexts: ["passengers", "population", "employees", "production", "marks"], discouragedContexts: ["advanced investment"], defaultDifficultyPreset: "balanced", defaultDistribution: { Easy: 30, Medium: 50, Hard: 20 } },
  { id: "RRB_GROUP_D", version: 1, aliases: ["rrb group d", "rrb_group_d"], label: "RRB Group D", family: "Railway", targetTimeSeconds: 55, calculationComplexity: "friendly", maxReasoningSteps: 2, preferredContexts: ["workers", "passengers", "population", "items"], discouragedContexts: ["compound investment"], defaultDifficultyPreset: "easy-heavy", defaultDistribution: { Easy: 50, Medium: 40, Hard: 10 } },
  { id: "PUNJAB_PSSSB_CLERK", version: 1, aliases: ["punjab psssb clerk", "psssb clerk", "punjab_psssb_clerk"], label: "Punjab PSSSB Clerk", family: "Punjab State", targetTimeSeconds: 50, calculationComplexity: "moderate", maxReasoningSteps: 3, preferredContexts: ["population", "salary", "agriculture", "students", "employees"], discouragedContexts: ["advanced investment"], defaultDifficultyPreset: "balanced", defaultDistribution: { Easy: 30, Medium: 50, Hard: 20 } },
  { id: "PUNJAB_EXCISE_INSP", version: 1, aliases: ["punjab excise inspector", "excise inspector", "punjab_excise_insp"], label: "Punjab Excise Inspector", family: "Punjab State", targetTimeSeconds: 45, calculationComplexity: "moderate", maxReasoningSteps: 3, preferredContexts: ["revenue", "population", "salary", "sales", "employees"], discouragedContexts: ["advanced investment"], defaultDifficultyPreset: "exam-level", defaultDistribution: { Easy: 20, Medium: 55, Hard: 25 } },
  { id: "PUNJAB_POLICE", version: 1, aliases: ["punjab police", "punjab police constable", "punjab_police"], label: "Punjab Police", family: "Punjab State", targetTimeSeconds: 50, calculationComplexity: "friendly", maxReasoningSteps: 3, preferredContexts: ["students", "queue", "race", "merit", "candidates"], discouragedContexts: ["advanced investment"], defaultDifficultyPreset: "balanced", defaultDistribution: { Easy: 35, Medium: 50, Hard: 15 } },
];

const FALLBACK_PROFILE = PROFILES[0]!;
const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
const normalized = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

function resolveProfile(value: unknown) {
  const target = normalized(text(value));
  return PROFILES.find((profile) =>
    profile.aliases.some((alias) => normalized(alias) === target)
    || normalized(profile.id) === target
    || normalized(profile.label) === target,
  ) ?? FALLBACK_PROFILE;
}

function positiveInt(value: unknown, fallback: number, max: number) {
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

function shuffle<T>(items: readonly T[], seed: string) {
  const next = [...items];
  let state = hash(seed) || 1;
  for (let index = next.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swap = state % (index + 1);
    [next[index], next[swap]] = [next[swap]!, next[index]!];
  }
  return next;
}

function distribution(value: unknown, fallback: Distribution): Distribution {
  const input = value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
  const result = {
    Easy: Number(input.Easy ?? fallback.Easy),
    Medium: Number(input.Medium ?? fallback.Medium),
    Hard: Number(input.Hard ?? fallback.Hard),
  };
  for (const [band, weight] of Object.entries(result)) {
    if (!Number.isFinite(weight) || weight < 0 || weight > 100) {
      throw Object.assign(new Error(`${band} percentage must be between 0 and 100`), {
        statusCode: 400,
        code: "INVALID_DIFFICULTY_DISTRIBUTION",
      });
    }
  }
  if (Math.abs(result.Easy + result.Medium + result.Hard - 100) > 0.001) {
    throw Object.assign(new Error("Difficulty percentages must total 100"), {
      statusCode: 400,
      code: "INVALID_DIFFICULTY_DISTRIBUTION",
    });
  }
  return result;
}

function allocate(count: number, weights: Distribution): Record<Difficulty, number> {
  const entries = (Object.entries(weights) as Array<[Difficulty, number]>).map(([difficulty, weight]) => {
    const exact = count * weight / 100;
    return { difficulty, value: Math.floor(exact), remainder: exact - Math.floor(exact) };
  });
  let remaining = count - entries.reduce((sum, entry) => sum + entry.value, 0);
  entries
    .sort((a, b) => b.remainder - a.remainder || b.value - a.value)
    .forEach((entry) => {
      if (remaining > 0) {
        entry.value += 1;
        remaining -= 1;
      }
    });
  return Object.fromEntries(entries.map((entry) => [entry.difficulty, entry.value])) as Record<Difficulty, number>;
}

function questionText(question: Record<string, unknown>) {
  return text(question.text ?? question.stem).toLowerCase();
}

function score(question: Record<string, unknown>, profile: ExamProfile) {
  const body = questionText(question);
  let value = profile.preferredContexts.reduce((sum, term) => sum + (body.includes(term) ? 5 : 0), 0);
  value -= profile.discouragedContexts.reduce((sum, term) => sum + (body.includes(term) ? 8 : 0), 0);
  const numbers = body.match(/\d+(?:\.\d+)?/g) ?? [];
  const decimals = numbers.filter((token) => token.includes(".")).length;
  const large = numbers.filter((token) => Number(token) >= 10000).length;
  if (profile.calculationComplexity === "friendly") value -= decimals * 3 + large * 2;
  if (profile.calculationComplexity === "intensive") value += Math.min(4, numbers.length) + decimals;
  return value;
}

function runCode() {
  return `GEN-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

router.use(authenticate);

router.get("/exam-profiles", requireAdminPermission("content.generation.read"), (_req, res) => {
  res.json({ profileVersion: 1, profiles: PROFILES });
});

router.post("/runs", requireAdminPermission("content.generation.run"), async (req, res) => {
  const count = positiveInt(req.body?.count, 5, 50);
  const packageId = text(req.body?.packageId) || undefined;
  const patternId = text(req.body?.patternId) || undefined;
  const topic = text(req.body?.topic) || "Arithmetic";
  const subtopic = text(req.body?.subtopic) || "Percentage";
  const exam = text(req.body?.exam) || "SSC CGL Tier 1";
  const profile = resolveProfile(req.body?.examProfileId ?? exam);
  const reasoningRnk = isRnk001QuestionStudioRequest({ packageId, patternId, topic, subtopic });
  const subject = text(req.body?.subject) || (reasoningRnk ? "Reasoning Ability" : "Quantitative Aptitude");
  const languageText = text(req.body?.language).toLowerCase();
  const language = languageText === "hi" || languageText === "pa" ? languageText : "en";
  const requestedDifficulty = text(req.body?.difficulty) || "Medium";
  const mixed = requestedDifficulty.toLowerCase() === "mixed";
  const preset = text(req.body?.difficultyPreset) || (mixed ? profile.defaultDifficultyPreset : requestedDifficulty.toLowerCase());
  const weights = mixed ? distribution(req.body?.difficultyDistribution, profile.defaultDistribution) : null;
  const counts: Record<Difficulty, number> = mixed
    ? allocate(count, weights!)
    : {
        Easy: requestedDifficulty === "Easy" ? count : 0,
        Medium: requestedDifficulty === "Hard" || requestedDifficulty === "Easy" ? 0 : count,
        Hard: requestedDifficulty === "Hard" ? count : 0,
      };
  const seed = text(req.body?.seed) || `${profile.id}:${Date.now()}:${randomUUID()}`;
  const id = randomUUID();
  const code = runCode();
  const timestamp = new Date().toISOString();
  const generationSystem = reasoningRnk ? "reasoning-v1" : "quant-v4";

  if (!packageId && !patternId && !(topic && subtopic)) {
    res.status(400).json({ error: "A package, pattern, or topic/subtopic selection is required" });
    return;
  }

  try {
    const batches = await Promise.all(
      (Object.keys(counts) as Difficulty[]).map(async (difficulty) => {
        const requested = counts[difficulty];
        if (!requested) return [];

        if (reasoningRnk) {
          const result = await generateSharedQuestionStudioQuestions({
            packageId,
            patternId,
            topic,
            subtopic,
            difficulty,
            language,
            seed: `${seed}:${profile.id}:${difficulty}`,
            count: requested,
            examProfileId: profile.id,
          });
          const candidates = (Array.isArray(result.questions) ? result.questions : [])
            .map((question) => question as Record<string, unknown>);
          return candidates.map((question) => ({
            ...question,
            difficulty,
            difficultyLabel: difficulty,
            mixedDifficulty: mixed,
          }));
        }

        const candidateCount = Math.min(100, requested * 2);
        const result = await generateQuantV4Questions({
          packageId: packageId as never,
          patternId,
          topic,
          subtopic,
          difficulty,
          language,
          seed: `${seed}:${profile.id}:${difficulty}`,
          count: candidateCount,
        });
        const candidates = (Array.isArray(result.questions) ? result.questions : [])
          .map((question) => question as Record<string, unknown>);
        return candidates
          .sort((left, right) =>
            score(right, profile) - score(left, profile)
            || text(left.questionId).localeCompare(text(right.questionId)),
          )
          .slice(0, requested)
          .map((question) => ({
            ...question,
            difficulty,
            difficultyLabel: difficulty,
            mixedDifficulty: mixed,
          }));
      }),
    );

    const questions = shuffle(batches.flat(), `${seed}:${profile.id}:order`);
    if (questions.length !== count) {
      res.status(422).json({
        error: `Profile generation returned ${questions.length} of ${count} requested questions`,
        code: "EXAM_PROFILE_GENERATION_COUNT_MISMATCH",
        details: { requested: count, generated: questions.length, counts, examProfileId: profile.id },
      });
      return;
    }

    const trace = {
      examProfileId: profile.id,
      examProfileLabel: profile.label,
      profileVersion: profile.version,
      examFamily: profile.family,
      targetTimeSeconds: profile.targetTimeSeconds,
      calculationComplexity: profile.calculationComplexity,
      maxReasoningSteps: profile.maxReasoningSteps,
      preferredContexts: profile.preferredContexts,
      discouragedContexts: profile.discouragedContexts,
    };
    const snapshot = {
      exam,
      subject,
      difficulty: mixed ? "Mixed" : requestedDifficulty,
      difficultyPreset: preset,
      difficultyDistribution: weights,
      difficultyCounts: counts,
      count,
      packageId,
      patternId,
      topic,
      subtopic,
      language,
      seed,
      generationSystem,
      ...trace,
      requestedByFirebaseUid: req.user?.id,
    };

    await sqlClient.begin(async (tx) => {
      await tx`INSERT INTO content.generation_runs (id, public_code, status, attempt_number, prompt_snapshot, request_snapshot, provider, model, prompt_tokens, completion_tokens, estimated_cost_paise, actual_cost_paise, started_at, completed_at, created_at, updated_at) VALUES (${id}::uuid, ${code}, 'review'::generation_run_status, 1, ${JSON.stringify(snapshot)}, ${JSON.stringify(snapshot)}, 'examtree', ${reasoningRnk ? 'reasoning-v1-exam-profile' : 'quant-v4-exam-profile'}, 0, 0, 0, 0, ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp})`;

      for (let index = 0; index < questions.length; index += 1) {
        const itemId = randomUUID();
        const versionId = randomUUID();
        const question = questions[index] as Record<string, unknown>;
        const sourceGenerationContext = question.generationContext && typeof question.generationContext === "object"
          ? question.generationContext as Record<string, unknown>
          : {};
        const appliedRules = reasoningRnk
          ? { profileAuthority: "RNK_001_EXAM_DELIVERY_POLICY_V1", candidateScore: null }
          : {
              preferredContextMatches: profile.preferredContexts.filter((term) => questionText(question).includes(term)),
              discouragedContextMatches: profile.discouragedContexts.filter((term) => questionText(question).includes(term)),
              candidateScore: score(question, profile),
            };
        const payload = {
          ...question,
          examProfile: trace,
          generationContext: {
            ...sourceGenerationContext,
            generationDomain: generationSystem,
            mode: mixed ? "mixed-difficulty-exam-profile" : "exam-profile",
            seed,
            difficultyPreset: preset,
            difficultyDistribution: weights,
            difficultyCounts: counts,
            ...trace,
            appliedRules,
          },
          validationResult: "pending",
        };

        await tx`INSERT INTO content.generation_run_items (id, generation_run_id, item_number, status, current_version_number, created_at, updated_at) VALUES (${itemId}::uuid, ${id}::uuid, ${index + 1}, 'unreviewed'::generation_item_status, 1, ${timestamp}, ${timestamp})`;
        await tx`INSERT INTO content.generation_item_versions (id, generation_item_id, version_number, payload, provider_item_id, created_at) VALUES (${versionId}::uuid, ${itemId}::uuid, 1, ${JSON.stringify(payload)}, ${text(question.questionId) || null}, ${timestamp})`;
      }

      await tx`INSERT INTO platform.audit_events (id, actor_type, actor_user_id, action_key, entity_type, entity_id, reason, summary, metadata) VALUES (${randomUUID()}::uuid, 'user'::audit_actor_type, ${req.adminSession?.user.id ?? null}::uuid, 'question_studio.generation_run.created', 'generation_run', ${id}::uuid, 'Admin generated an exam-profile Question Studio batch', ${`Generated ${questions.length} ${profile.label} ${reasoningRnk ? 'RNK-001 Reasoning' : 'Quant V4'} questions in ${code}`}, ${JSON.stringify({ ...trace, difficultyPreset: preset, difficultyDistribution: weights, difficultyCounts: counts, packageId, topic, subtopic, generationSystem })})`;
    });

    res.status(201).json({
      id,
      publicCode: code,
      status: "review",
      itemCount: questions.length,
      generationSystem,
      difficulty: mixed ? "Mixed" : requestedDifficulty,
      difficultyPreset: preset,
      difficultyDistribution: weights,
      difficultyCounts: counts,
      examProfile: trace,
    });
  } catch (error) {
    console.error("Exam-profile Question Studio generation failed", error);
    const statusCode = Number((error as { statusCode?: unknown })?.statusCode);
    res.status(Number.isFinite(statusCode) ? statusCode : 500).json({
      error: error instanceof Error ? error.message : "Unable to generate exam-profile questions",
      code: text((error as { code?: unknown })?.code) || "EXAM_PROFILE_GENERATION_FAILED",
      details: { examProfileId: profile.id },
    });
  }
});

export default router;
