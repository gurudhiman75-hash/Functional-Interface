import { answerClassForCoaActions } from "./action-validity-model.ts";
import { coaEnglishAuthoritiesForQl } from "./english-authorities.ts";
import type { CoaActionAuthority, CoaAnswerClass, CoaQlId, CoaScenarioAuthority } from "./types.ts";

export const COA_CP005_CHECKPOINT_ID = "COA-CP-005" as const;

export const COA_CP005_SEMANTIC_QL_IDS = [
  "COA-QL-001",
  "COA-QL-002",
  "COA-QL-003",
  "COA-QL-004",
  "COA-QL-005",
  "COA-QL-006",
] as const;

export type CoaCp005SemanticQlId = (typeof COA_CP005_SEMANTIC_QL_IDS)[number];

export const COA_CP005_FOUR_WAY_PROFILES = [
  {
    id: "TWO_ACTION_FOUR_WAY_STANDARD",
    sourceStatus: "PROVISIONAL_NOT_SOURCE_CERTIFIED",
    options: [
      "Only Course of Action I follows",
      "Only Course of Action II follows",
      "Both Courses of Action I and II follow",
      "Neither Course of Action I nor II follows",
    ] as const,
    indexes: { ONLY_I: 0, ONLY_II: 1, BOTH: 2, NEITHER: 3 } as const,
  },
  {
    id: "TWO_ACTION_FOUR_WAY_NEITHER_BEFORE_BOTH",
    sourceStatus: "INTERNAL_VARIATION_ONLY",
    options: [
      "Only Course of Action I follows",
      "Only Course of Action II follows",
      "Neither Course of Action I nor II follows",
      "Both Courses of Action I and II follow",
    ] as const,
    indexes: { ONLY_I: 0, ONLY_II: 1, BOTH: 3, NEITHER: 2 } as const,
  },
  {
    id: "TWO_ACTION_FOUR_WAY_BOTH_FIRST",
    sourceStatus: "INTERNAL_VARIATION_ONLY",
    options: [
      "Both Courses of Action I and II follow",
      "Only Course of Action I follows",
      "Only Course of Action II follows",
      "Neither Course of Action I nor II follows",
    ] as const,
    indexes: { ONLY_I: 1, ONLY_II: 2, BOTH: 0, NEITHER: 3 } as const,
  },
] as const;

export type CoaCp005FourWayProfileId = (typeof COA_CP005_FOUR_WAY_PROFILES)[number]["id"];

/**
 * Capability declaration only. It is deliberately blocked from generation until
 * a Course-of-Action source audit proves that an exclusive "Either I or II"
 * answer is genuinely used and semantically appropriate for this chapter.
 */
export const COA_CP005_FIVE_WAY_PROFILE = Object.freeze({
  id: "TWO_ACTION_FIVE_CODE" as const,
  status: "BLOCKED_PENDING_SOURCE_AUDIT" as const,
  options: Object.freeze([
    "Only Course of Action I follows",
    "Only Course of Action II follows",
    "Either Course of Action I or II follows",
    "Neither Course of Action I nor II follows",
    "Both Courses of Action I and II follow",
  ] as const),
});

const INSTRUCTIONS = Object.freeze([
  "Which of the above courses of action should be taken?",
  "Which course or courses of action follow from the situation?",
  "Which of the above courses of action logically follow?",
  "Which is the correct decision regarding the courses of action?",
] as const);

function normalizeSeed(seed: number): number {
  if (!Number.isFinite(seed)) return 0;
  return Math.abs(Math.trunc(seed));
}

function swapAnswerClass(answerClass: CoaAnswerClass): CoaAnswerClass {
  if (answerClass === "ONLY_I") return "ONLY_II";
  if (answerClass === "ONLY_II") return "ONLY_I";
  return answerClass;
}

function orderedActions(
  scenario: CoaScenarioAuthority,
  swap: boolean,
): readonly [CoaActionAuthority, CoaActionAuthority] {
  return swap
    ? Object.freeze([scenario.actions[1], scenario.actions[0]]) as readonly [CoaActionAuthority, CoaActionAuthority]
    : scenario.actions;
}

function explanationFor(actions: readonly [CoaActionAuthority, CoaActionAuthority], answerClass: CoaAnswerClass): string {
  const firstVerdict = actions[0].expectedVerdict === "FOLLOWS" ? "Course I follows" : "Course I does not follow";
  const secondVerdict = actions[1].expectedVerdict === "FOLLOWS" ? "Course II follows" : "Course II does not follow";
  return `${firstVerdict}: ${actions[0].explanation} ${secondVerdict}: ${actions[1].explanation}`;
}

export function generateCoaCp005PairedQuestion(input: {
  readonly qlId: CoaCp005SemanticQlId;
  readonly seed: number;
  readonly profileId?: CoaCp005FourWayProfileId;
}) {
  const seed = normalizeSeed(input.seed);
  const authorities = coaEnglishAuthoritiesForQl(input.qlId);
  if (authorities.length === 0) throw new Error(`${input.qlId}: no English authority available`);

  const scenario = authorities[seed % authorities.length]!;
  const swap = Math.floor(seed / authorities.length) % 2 === 1;
  const actions = orderedActions(scenario, swap);
  const answerClass = answerClassForCoaActions(actions);
  const expectedAnswerClass = swap ? swapAnswerClass(scenario.expectedAnswerClass) : scenario.expectedAnswerClass;
  if (answerClass !== expectedAnswerClass) {
    throw new Error(`${scenario.id}: paired presentation drifted from semantic authority`);
  }

  const chosenProfile = input.profileId
    ? COA_CP005_FOUR_WAY_PROFILES.find((entry) => entry.id === input.profileId)
    : COA_CP005_FOUR_WAY_PROFILES[Math.floor(seed / (authorities.length * 2)) % COA_CP005_FOUR_WAY_PROFILES.length];
  if (!chosenProfile) throw new Error(`Unknown CP005 presentation profile: ${input.profileId}`);

  const instruction = INSTRUCTIONS[Math.floor(seed / (authorities.length * 2 * COA_CP005_FOUR_WAY_PROFILES.length)) % INSTRUCTIONS.length]!;
  const correctIndex = chosenProfile.indexes[answerClass];

  return Object.freeze({
    chapterId: "COA-001" as const,
    checkpointId: COA_CP005_CHECKPOINT_ID,
    semanticQlId: input.qlId as CoaQlId,
    semanticAuthorityId: scenario.id,
    difficulty: scenario.difficulty,
    domain: scenario.domain,
    statement: scenario.statement,
    instruction,
    courses: Object.freeze([
      Object.freeze({ label: "I" as const, text: actions[0].text, semanticActionId: actions[0].id }),
      Object.freeze({ label: "II" as const, text: actions[1].text, semanticActionId: actions[1].id }),
    ]),
    presentationProfile: chosenProfile.id,
    sourceStatus: chosenProfile.sourceStatus,
    answerOptions: chosenProfile.options,
    answerClass,
    correctIndex,
    explanation: explanationFor(actions, answerClass),
    semanticFingerprint: `${input.qlId}|${scenario.id}|${actions[0].id}>${actions[1].id}|${answerClass}`,
    presentationFingerprint: `${chosenProfile.id}|${correctIndex}|${instruction}`,
    seed,
  });
}

export function generateCoaCp005FiveWayQuestion(): never {
  throw new Error("COA TWO_ACTION_FIVE_CODE is blocked pending source audit; do not synthesize an Either I/II class from four-way semantic authorities.");
}
