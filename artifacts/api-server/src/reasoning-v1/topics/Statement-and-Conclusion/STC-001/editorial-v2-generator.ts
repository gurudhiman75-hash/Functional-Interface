import { STC_V2_EDITORIAL_AUTHORITIES } from "./editorial-v2-authorities.ts";
import type { StcQlId } from "./types.ts";
import type { GeneratedStcV2EditorialQuestion, StcV2AnswerClass } from "./editorial-v2-types.ts";

const OPTIONS = [
  "Only conclusion I follows",
  "Only conclusion II follows",
  "Both conclusions I and II follow",
  "Neither conclusion I nor II follows",
] as const;

function indexForAnswer(answerClass: StcV2AnswerClass): number {
  switch (answerClass) {
    case "ONLY_I": return 0;
    case "ONLY_II": return 1;
    case "BOTH": return 2;
    case "NEITHER": return 3;
  }
}

function followsFlags(answerClass: StcV2AnswerClass): readonly [boolean, boolean] {
  switch (answerClass) {
    case "ONLY_I": return [true, false];
    case "ONLY_II": return [false, true];
    case "BOTH": return [true, true];
    case "NEITHER": return [false, false];
  }
}

function checkpointFor(qlId: StcQlId): "STC-CP-001" | "STC-CP-002" | "STC-CP-003" {
  if (qlId === "STC-QL-001" || qlId === "STC-QL-002") return "STC-CP-001";
  if (qlId === "STC-QL-003" || qlId === "STC-QL-004") return "STC-CP-002";
  return "STC-CP-003";
}

function positiveModulo(value: number, divisor: number): number {
  const integer = Number.isFinite(value) ? Math.trunc(value) : 0;
  return ((integer % divisor) + divisor) % divisor;
}

export function generateStcV2EditorialQuestion(input: {
  readonly qlId: StcQlId;
  readonly locale: "en-IN";
  readonly seed: number;
}): GeneratedStcV2EditorialQuestion {
  const pool = STC_V2_EDITORIAL_AUTHORITIES.filter((authority) => authority.qlId === input.qlId);
  if (pool.length !== 8) {
    throw new Error(`STC V2 requires exactly 8 editorial authorities for ${input.qlId}; found ${pool.length}.`);
  }

  const authority = pool[positiveModulo(input.seed, pool.length)]!;
  const [firstFollows, secondFollows] = followsFlags(authority.answerClass);
  const explanation = [
    `I ${firstFollows ? "follows" : "does not follow"}: ${authority.explanation[0]}`,
    `II ${secondFollows ? "follows" : "does not follow"}: ${authority.explanation[1]}`,
  ].join(" ");

  return {
    chapterId: "STC-001",
    version: "V2",
    checkpointId: checkpointFor(input.qlId),
    qlId: input.qlId,
    scenarioId: authority.id,
    locale: input.locale,
    seed: input.seed,
    difficulty: authority.difficulty,
    surfaceArchetype: authority.surfaceArchetype,
    stem: authority.statement,
    conclusions: authority.conclusions,
    options: OPTIONS,
    correctIndex: indexForAnswer(authority.answerClass),
    answerClass: authority.answerClass,
    explanation,
    metadata: {
      authority: "CURATED_EDITORIAL_ENTAILMENT_V2",
      surfaceArchetype: authority.surfaceArchetype,
      repeatedInstructionEmbeddedInStem: false,
      reviewOnly: true,
      questionBankWritable: false,
      testEligible: false,
      mockEligible: false,
      publicEligible: false,
      automaticPublication: false,
    },
  };
}
