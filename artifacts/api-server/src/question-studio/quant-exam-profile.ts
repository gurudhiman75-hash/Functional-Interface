import { randomUUID } from "node:crypto";

import type { QuestionStudioGenerationRequest } from "./engine-types";

export type QuantProfileDifficulty = "Easy" | "Medium" | "Hard";
export type QuantDifficultyDistribution = Record<QuantProfileDifficulty, number>;

export type QuantExamProfile = {
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
  defaultDistribution: QuantDifficultyDistribution;
};

export type QuantExamProfileTrace = {
  examProfileId: string;
  examProfileLabel: string;
  profileVersion: number;
  examFamily: string;
  targetTimeSeconds: number;
  calculationComplexity: QuantExamProfile["calculationComplexity"];
  maxReasoningSteps: number;
  preferredContexts: string[];
  discouragedContexts: string[];
};

export type QuantGenerationAssignment = {
  cpId?: string;
  difficulty: QuantProfileDifficulty;
  count: number;
  seed: string;
};

export type QuantExamProfilePlan = {
  profile: QuantExamProfile;
  trace: QuantExamProfileTrace;
  mixed: boolean;
  requestedDifficulty: QuantProfileDifficulty | "Mixed";
  difficultyPreset: string;
  difficultyDistribution: QuantDifficultyDistribution | null;
  difficultyCounts: QuantDifficultyDistribution;
  cpCounts: Record<string, number>;
  seed: string;
  assignments: QuantGenerationAssignment[];
};

const PROFILES: QuantExamProfile[] = [
  { id: "SSC_CGL_T1", version: 1, aliases: ["ssc cgl", "ssc cgl tier 1", "ssc_cgl_t1"], label: "SSC CGL Tier 1", family: "SSC", targetTimeSeconds: 45, calculationComplexity: "moderate", maxReasoningSteps: 3, preferredContexts: ["marks", "population", "salary", "income", "votes", "students"], discouragedContexts: ["compound investment"], defaultDifficultyPreset: "exam-level", defaultDistribution: { Easy: 20, Medium: 55, Hard: 25 } },
  { id: "SSC_CHSL_T1", version: 1, aliases: ["ssc chsl", "ssc chsl tier 1", "ssc_chsl_t1"], label: "SSC CHSL Tier 1", family: "SSC", targetTimeSeconds: 50, calculationComplexity: "friendly", maxReasoningSteps: 3, preferredContexts: ["marks", "salary", "population", "students", "discount"], discouragedContexts: ["advanced investment"], defaultDifficultyPreset: "balanced", defaultDistribution: { Easy: 30, Medium: 50, Hard: 20 } },
  { id: "SSC_MTS", version: 1, aliases: ["ssc mts", "ssc_mts"], label: "SSC MTS", family: "SSC", targetTimeSeconds: 55, calculationComplexity: "friendly", maxReasoningSteps: 2, preferredContexts: ["students", "population", "price", "marks"], discouragedContexts: ["compound", "successive investment"], defaultDifficultyPreset: "easy-heavy", defaultDistribution: { Easy: 50, Medium: 40, Hard: 10 } },
  { id: "IBPS_PO_PRE", version: 1, aliases: ["ibps po", "ibps po prelims", "ibps_po_pre"], label: "IBPS PO Prelims", family: "Banking", targetTimeSeconds: 38, calculationComplexity: "intensive", maxReasoningSteps: 4, preferredContexts: ["income", "expenditure", "investment", "accounts", "profit", "sales"], discouragedContexts: ["votes"], defaultDifficultyPreset: "hard-heavy", defaultDistribution: { Easy: 10, Medium: 45, Hard: 45 } },
  { id: "IBPS_CLERK_PRE", version: 1, aliases: ["ibps clerk", "ibps clerk prelims", "ibps_clerk_pre"], label: "IBPS Clerk Prelims", family: "Banking", targetTimeSeconds: 42, calculationComplexity: "moderate", maxReasoningSteps: 3, preferredContexts: ["accounts", "salary", "income", "profit", "sales"], discouragedContexts: ["votes"], defaultDifficultyPreset: "exam-level", defaultDistribution: { Easy: 20, Medium: 55, Hard: 25 } },
  { id: "RRB_NTPC_CBT1", version: 1, aliases: ["rrb ntpc", "rrb ntpc cbt 1", "rrb_ntpc_cbt1"], label: "RRB NTPC CBT 1", family: "Railway", targetTimeSeconds: 50, calculationComplexity: "friendly", maxReasoningSteps: 3, preferredContexts: ["passengers", "population", "employees", "production", "marks"], discouragedContexts: ["advanced investment"], defaultDifficultyPreset: "balanced", defaultDistribution: { Easy: 30, Medium: 50, Hard: 20 } },
  { id: "RRB_GROUP_D", version: 1, aliases: ["rrb group d", "rrb_group_d"], label: "RRB Group D", family: "Railway", targetTimeSeconds: 55, calculationComplexity: "friendly", maxReasoningSteps: 2, preferredContexts: ["workers", "passengers", "population", "items"], discouragedContexts: ["compound investment"], defaultDifficultyPreset: "easy-heavy", defaultDistribution: { Easy: 50, Medium: 40, Hard: 10 } },
  { id: "PUNJAB_PSSSB_CLERK", version: 1, aliases: ["punjab psssb clerk", "psssb clerk", "punjab_psssb_clerk"], label: "Punjab PSSSB Clerk", family: "Punjab State", targetTimeSeconds: 50, calculationComplexity: "moderate", maxReasoningSteps: 3, preferredContexts: ["population", "salary", "agriculture", "students", "employees"], discouragedContexts: ["advanced investment"], defaultDifficultyPreset: "balanced", defaultDistribution: { Easy: 30, Medium: 50, Hard: 20 } },
  { id: "PUNJAB_EXCISE_INSP", version: 1, aliases: ["punjab excise inspector", "excise inspector", "punjab_excise_insp"], label: "Punjab Excise Inspector", family: "Punjab State", targetTimeSeconds: 45, calculationComplexity: "moderate", maxReasoningSteps: 3, preferredContexts: ["revenue", "population", "salary", "sales", "employees"], discouragedContexts: ["advanced investment"], defaultDifficultyPreset: "exam-level", defaultDistribution: { Easy: 20, Medium: 55, Hard: 25 } },
];

const FALLBACK_PROFILE = PROFILES[0]!;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalized(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function hash(value: string): number {
  let output = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    output ^= value.charCodeAt(index);
    output = Math.imul(output, 16777619);
  }
  return output >>> 0;
}

export function shuffleQuantProfileItems<T>(items: readonly T[], seed: string): T[] {
  const next = [...items];
  let state = hash(seed) || 1;
  for (let index = next.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swap = state % (index + 1);
    [next[index], next[swap]] = [next[swap]!, next[index]!];
  }
  return next;
}

export function listQuantExamProfiles(): QuantExamProfile[] {
  return PROFILES.map((profile) => ({
    ...profile,
    aliases: [...profile.aliases],
    preferredContexts: [...profile.preferredContexts],
    discouragedContexts: [...profile.discouragedContexts],
    defaultDistribution: { ...profile.defaultDistribution },
  }));
}

export function resolveQuantExamProfile(value: unknown): QuantExamProfile {
  const target = normalized(text(value));
  if (!target) return FALLBACK_PROFILE;
  return PROFILES.find((profile) =>
    profile.aliases.some((alias) => normalized(alias) === target)
    || normalized(profile.id) === target
    || normalized(profile.label) === target
  ) ?? FALLBACK_PROFILE;
}

export function quantExamProfileTrace(profile: QuantExamProfile): QuantExamProfileTrace {
  return {
    examProfileId: profile.id,
    examProfileLabel: profile.label,
    profileVersion: profile.version,
    examFamily: profile.family,
    targetTimeSeconds: profile.targetTimeSeconds,
    calculationComplexity: profile.calculationComplexity,
    maxReasoningSteps: profile.maxReasoningSteps,
    preferredContexts: [...profile.preferredContexts],
    discouragedContexts: [...profile.discouragedContexts],
  };
}

function normalizeDifficulty(value: unknown): QuantProfileDifficulty | "Mixed" {
  const raw = text(value);
  const lower = raw.toLowerCase();
  if (lower === "mixed") return "Mixed";
  if (lower === "easy") return "Easy";
  if (lower === "hard") return "Hard";
  return "Medium";
}

function distribution(
  value: unknown,
  fallback: QuantDifficultyDistribution,
): QuantDifficultyDistribution {
  const input = value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
  const result: QuantDifficultyDistribution = {
    Easy: Number(input.Easy ?? fallback.Easy),
    Medium: Number(input.Medium ?? fallback.Medium),
    Hard: Number(input.Hard ?? fallback.Hard),
  };

  for (const [band, weight] of Object.entries(result)) {
    if (!Number.isFinite(weight) || weight < 0 || weight > 100) {
      throw Object.assign(
        new Error(`${band} percentage must be between 0 and 100`),
        { statusCode: 400, code: "INVALID_DIFFICULTY_DISTRIBUTION" },
      );
    }
  }
  if (Math.abs(result.Easy + result.Medium + result.Hard - 100) > 0.001) {
    throw Object.assign(
      new Error("Difficulty percentages must total 100"),
      { statusCode: 400, code: "INVALID_DIFFICULTY_DISTRIBUTION" },
    );
  }
  return result;
}

export function allocateQuantDifficultyCounts(
  count: number,
  weights: QuantDifficultyDistribution,
): QuantDifficultyDistribution {
  const entries = (Object.entries(weights) as Array<[QuantProfileDifficulty, number]>)
    .map(([difficulty, weight]) => {
      const exact = count * weight / 100;
      return {
        difficulty,
        value: Math.floor(exact),
        remainder: exact - Math.floor(exact),
      };
    });

  let remaining = count - entries.reduce((sum, entry) => sum + entry.value, 0);
  entries
    .sort((left, right) =>
      right.remainder - left.remainder
      || right.value - left.value
      || left.difficulty.localeCompare(right.difficulty),
    )
    .forEach((entry) => {
      if (remaining > 0) {
        entry.value += 1;
        remaining -= 1;
      }
    });

  return Object.fromEntries(
    entries.map((entry) => [entry.difficulty, entry.value]),
  ) as QuantDifficultyDistribution;
}

function allocateCpCounts(count: number, cpIds: readonly string[]): Record<string, number> {
  if (cpIds.length === 0) return { "__chapter_mix__": count };
  const base = Math.floor(count / cpIds.length);
  const remainder = count % cpIds.length;
  return Object.fromEntries(
    cpIds.map((cpId, index) => [cpId, base + (index < remainder ? 1 : 0)]),
  );
}

function buildAssignments(
  count: number,
  selectedCpIds: readonly string[],
  difficultyCounts: QuantDifficultyDistribution,
  seed: string,
  profileId: string,
): { assignments: QuantGenerationAssignment[]; cpCounts: Record<string, number> } {
  const cpCounts = allocateCpCounts(count, selectedCpIds);
  const cpSlots = Object.entries(cpCounts).map(([key, capacity]) => ({
    key,
    cpId: key === "__chapter_mix__" ? undefined : key,
    remaining: capacity,
  }));

  const difficultySlots = shuffleQuantProfileItems(
    (Object.entries(difficultyCounts) as Array<[QuantProfileDifficulty, number]>)
      .flatMap(([difficulty, amount]) => Array.from({ length: amount }, () => difficulty)),
    `${seed}:${profileId}:difficulty-slots`,
  );

  const grouped = new Map<string, { cpId?: string; difficulty: QuantProfileDifficulty; count: number }>();
  let cpCursor = 0;

  for (const difficulty of difficultySlots) {
    let selectedIndex = -1;
    for (let offset = 0; offset < cpSlots.length; offset += 1) {
      const index = (cpCursor + offset) % cpSlots.length;
      if (cpSlots[index]!.remaining > 0) {
        selectedIndex = index;
        break;
      }
    }
    if (selectedIndex < 0) {
      throw new Error("Quant profile allocation exhausted CP capacity before difficulty slots");
    }

    const slot = cpSlots[selectedIndex]!;
    slot.remaining -= 1;
    cpCursor = (selectedIndex + 1) % cpSlots.length;

    const groupKey = `${slot.cpId ?? "__chapter_mix__"}::${difficulty}`;
    const current = grouped.get(groupKey);
    if (current) current.count += 1;
    else grouped.set(groupKey, { cpId: slot.cpId, difficulty, count: 1 });
  }

  const assignments = [...grouped.values()].map((entry, index) => ({
    ...entry,
    seed: `${seed}:${profileId}:${entry.cpId ?? "chapter-mix"}:${entry.difficulty}:slot:${index + 1}`,
  }));

  return { assignments, cpCounts };
}

export function buildQuantExamProfilePlan(input: {
  exam?: unknown;
  examProfileId?: unknown;
  requestedDifficulty?: unknown;
  difficultyPreset?: unknown;
  difficultyDistribution?: unknown;
  count: number;
  seed?: string;
  selectedCpIds?: readonly string[];
}): QuantExamProfilePlan {
  const profile = resolveQuantExamProfile(input.examProfileId ?? input.exam);
  const requestedDifficulty = normalizeDifficulty(input.requestedDifficulty);
  const mixed = requestedDifficulty === "Mixed";
  const difficultyPreset = text(input.difficultyPreset)
    || (mixed ? profile.defaultDifficultyPreset : requestedDifficulty.toLowerCase());
  const difficultyDistribution = mixed
    ? distribution(input.difficultyDistribution, profile.defaultDistribution)
    : null;
  const difficultyCounts: QuantDifficultyDistribution = mixed
    ? allocateQuantDifficultyCounts(input.count, difficultyDistribution!)
    : {
        Easy: requestedDifficulty === "Easy" ? input.count : 0,
        Medium: requestedDifficulty === "Medium" ? input.count : 0,
        Hard: requestedDifficulty === "Hard" ? input.count : 0,
      };
  const seed = text(input.seed)
    || `${profile.id}:${Date.now()}:${randomUUID()}`;
  const selectedCpIds = [...new Set((input.selectedCpIds ?? []).map((value) => text(value)).filter(Boolean))];

  if (selectedCpIds.length > input.count) {
    throw Object.assign(
      new Error(`Question count must be at least the number of selected CPs (${selectedCpIds.length})`),
      { statusCode: 400, code: "COUNT_BELOW_SELECTED_CP_COUNT" },
    );
  }

  const { assignments, cpCounts } = buildAssignments(
    input.count,
    selectedCpIds,
    difficultyCounts,
    seed,
    profile.id,
  );

  return {
    profile,
    trace: quantExamProfileTrace(profile),
    mixed,
    requestedDifficulty,
    difficultyPreset,
    difficultyDistribution,
    difficultyCounts,
    cpCounts,
    seed,
    assignments,
  };
}

export function quantQuestionText(question: Record<string, unknown>): string {
  return text(question.text ?? question.stem).toLowerCase();
}

export function scoreQuantQuestionForProfile(
  question: Record<string, unknown>,
  profile: QuantExamProfile,
): number {
  const body = quantQuestionText(question);
  let value = profile.preferredContexts.reduce(
    (sum, term) => sum + (body.includes(term) ? 5 : 0),
    0,
  );
  value -= profile.discouragedContexts.reduce(
    (sum, term) => sum + (body.includes(term) ? 8 : 0),
    0,
  );

  const numbers = body.match(/\d+(?:\.\d+)?/g) ?? [];
  const decimals = numbers.filter((token) => token.includes(".")).length;
  const large = numbers.filter((token) => Number(token) >= 10000).length;

  if (profile.calculationComplexity === "friendly") {
    value -= decimals * 3 + large * 2;
  }
  if (profile.calculationComplexity === "intensive") {
    value += Math.min(4, numbers.length) + decimals;
  }
  return value;
}


function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

export async function generateProfiledQuantBatch(input: {
  request: QuestionStudioGenerationRequest;
  count: number;
  selectedCpIds: readonly string[];
  examProfileId?: unknown;
  difficultyPreset?: unknown;
  difficultyDistribution?: unknown;
  generateCandidateBatch: (
    request: QuestionStudioGenerationRequest,
  ) => Promise<unknown>;
}): Promise<{
  questions: Array<Record<string, unknown>>;
  generationContexts: Array<{
    cpId?: string;
    difficulty: QuantProfileDifficulty;
    context: Record<string, unknown>;
  }>;
  plan: QuantExamProfilePlan;
}> {
  const plan = buildQuantExamProfilePlan({
    exam: input.request.exam,
    examProfileId: input.examProfileId,
    requestedDifficulty: input.request.difficulty,
    difficultyPreset: input.difficultyPreset,
    difficultyDistribution: input.difficultyDistribution,
    count: input.count,
    seed: input.request.seed,
    selectedCpIds: input.selectedCpIds,
  });

  const generatedQuestions: Array<Record<string, unknown>> = [];
  const generationContexts: Array<{
    cpId?: string;
    difficulty: QuantProfileDifficulty;
    context: Record<string, unknown>;
  }> = [];

  for (const assignment of plan.assignments) {
    const candidateCount = Math.min(100, assignment.count * 2);
    const result = await input.generateCandidateBatch({
      ...input.request,
      engineId: "quant-v4",
      difficulty: assignment.difficulty,
      seed: assignment.seed,
      count: candidateCount,
      canonicalProblemId: assignment.cpId,
    });

    const resultRecord = asRecord(result);
    const resultContext = asRecord(resultRecord.generationContext);
    const candidates = (Array.isArray(resultRecord.questions) ? resultRecord.questions : [])
      .map((question) => question as Record<string, unknown>)
      .sort((left, right) =>
        scoreQuantQuestionForProfile(right, plan.profile)
        - scoreQuantQuestionForProfile(left, plan.profile)
        || text(left.questionId).localeCompare(text(right.questionId)),
      );

    if (candidates.length < assignment.count) {
      throw Object.assign(
        new Error(
          `Profile generation returned ${candidates.length} of ${assignment.count} requested ${assignment.difficulty} questions`,
        ),
        {
          statusCode: 422,
          code: "EXAM_PROFILE_GENERATION_COUNT_MISMATCH",
          details: {
            requested: assignment.count,
            generated: candidates.length,
            difficulty: assignment.difficulty,
            cpId: assignment.cpId,
            examProfileId: plan.profile.id,
          },
        },
      );
    }

    const selected = candidates.slice(0, assignment.count);
    for (const question of selected) {
      const body = quantQuestionText(question);
      const appliedRules = {
        preferredContextMatches: plan.profile.preferredContexts.filter((term) => body.includes(term)),
        discouragedContextMatches: plan.profile.discouragedContexts.filter((term) => body.includes(term)),
        candidateScore: scoreQuantQuestionForProfile(question, plan.profile),
      };
      const generationContext = {
        ...resultContext,
        engineId: "quant-v4",
        generationDomain: "quant-v4",
        mode: plan.mixed ? "mixed-difficulty-exam-profile" : "exam-profile",
        seed: plan.seed,
        assignmentSeed: assignment.seed,
        difficultyPreset: plan.difficultyPreset,
        difficultyDistribution: plan.difficultyDistribution,
        difficultyCounts: plan.difficultyCounts,
        cpCounts: plan.cpCounts,
        ...plan.trace,
        appliedRules,
      };

      generatedQuestions.push({
        ...question,
        canonicalProblemId:
          text(question.canonicalProblemId)
          || assignment.cpId,
        selectedCpId: assignment.cpId,
        engineId: "quant-v4",
        difficulty: assignment.difficulty,
        difficultyLabel: assignment.difficulty,
        mixedDifficulty: plan.mixed,
        examProfile: plan.trace,
        generationContext,
      });
    }

    generationContexts.push({
      cpId: assignment.cpId,
      difficulty: assignment.difficulty,
      context: {
        ...resultContext,
        engineId: "quant-v4",
        seed: assignment.seed,
        examProfileId: plan.profile.id,
        requestedCount: assignment.count,
      },
    });
  }

  const questions = shuffleQuantProfileItems(
    generatedQuestions,
    `${plan.seed}:${plan.profile.id}:order`,
  );

  if (questions.length !== input.count) {
    throw Object.assign(
      new Error(
        `Profile generation returned ${questions.length} of ${input.count} requested questions`,
      ),
      {
        statusCode: 422,
        code: "EXAM_PROFILE_GENERATION_COUNT_MISMATCH",
        details: {
          requested: input.count,
          generated: questions.length,
          difficultyCounts: plan.difficultyCounts,
          cpCounts: plan.cpCounts,
          examProfileId: plan.profile.id,
        },
      },
    );
  }

  return { questions, generationContexts, plan };
}
