import { answerClassForCoaActions, assertCoaActionAuthorityConsistent, evaluateCoaAction } from "./action-validity-model.ts";
import { coaEnglishAuthoritiesForQl } from "./english-authorities.ts";
import { COA_CP008_EITHER_AUTHORITIES, COA_CP008_THREE_ACTION_AUTHORITIES } from "./cp008-profile-authorities.ts";
import type { CoaActionAuthority, CoaAnswerClass, CoaQlId } from "./types.ts";

export const COA_CP008_CHECKPOINT_ID = "COA-CP-008" as const;

export const COA_CP008_FIVE_WAY_OPTIONS = Object.freeze([
  "Only Course of Action I follows",
  "Only Course of Action II follows",
  "Either Course of Action I or II follows",
  "Neither Course of Action I nor II follows",
  "Both Courses of Action I and II follow",
] as const);

export type CoaCp008FiveWayAnswerClass = CoaAnswerClass | "EITHER";

const FIVE_WAY_INDEX: Readonly<Record<CoaCp008FiveWayAnswerClass, number>> = Object.freeze({
  ONLY_I: 0,
  ONLY_II: 1,
  EITHER: 2,
  NEITHER: 3,
  BOTH: 4,
});

const TWO_ACTION_INSTRUCTIONS = Object.freeze([
  "Which of the above courses of action logically follow?",
  "Which course or courses of action should be taken?",
  "Decide which of the suggested courses of action follow from the statement.",
] as const);

const THREE_ACTION_INSTRUCTIONS = Object.freeze([
  "Which of the above courses of action logically follow?",
  "Which combination of the suggested courses of action should be taken?",
  "Decide which of Courses I, II and III follow from the statement.",
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

function maskForActions(actions: readonly CoaActionAuthority[]): number {
  return actions.reduce((mask, action, index) => evaluateCoaAction(action) === "FOLLOWS" ? mask | (1 << index) : mask, 0);
}

function maskLabel(mask: number): string {
  const labels = ["I", "II", "III"].filter((_, index) => Boolean(mask & (1 << index)));
  if (labels.length === 0) return "None of Courses I, II and III follows";
  if (labels.length === 3) return "Courses I, II and III follow";
  if (labels.length === 1) return `Only Course ${labels[0]} follows`;
  return `Only Courses ${labels.join(" and ")} follow`;
}

export function generateCoaCp008FiveWayQuestion(input: {
  readonly seed: number;
  readonly qlId?: CoaQlId;
  readonly mode?: "AUTO" | "ORDINARY" | "EITHER";
}) {
  const seed = normalizeSeed(input.seed);
  const mode = input.mode ?? "AUTO";
  const useEither = mode === "EITHER" || (mode === "AUTO" && seed % 5 === 0);

  if (useEither) {
    const scenario = COA_CP008_EITHER_AUTHORITIES[Math.floor(seed / 5) % COA_CP008_EITHER_AUTHORITIES.length]!;
    scenario.actions.forEach(assertCoaActionAuthorityConsistent);
    if (answerClassForCoaActions(scenario.actions) !== "BOTH") {
      throw new Error(`${scenario.id}: exclusive-alternative actions must each be independently valid before pair relation is applied`);
    }
    const instruction = TWO_ACTION_INSTRUCTIONS[Math.floor(seed / COA_CP008_EITHER_AUTHORITIES.length) % TWO_ACTION_INSTRUCTIONS.length]!;
    return Object.freeze({
      chapterId: "COA-001" as const,
      checkpointId: COA_CP008_CHECKPOINT_ID,
      presentationProfile: "TWO_ACTION_FIVE_CODE" as const,
      sourceStatus: "SOURCE_SUPPORTED_MEMORY_BASED" as const,
      semanticAuthorityId: scenario.id,
      difficulty: scenario.difficulty,
      domain: scenario.domain,
      statement: scenario.statement,
      instruction,
      courses: Object.freeze([
        Object.freeze({ label: "I" as const, text: scenario.actions[0].text, semanticActionId: scenario.actions[0].id }),
        Object.freeze({ label: "II" as const, text: scenario.actions[1].text, semanticActionId: scenario.actions[1].id }),
      ]),
      answerOptions: COA_CP008_FIVE_WAY_OPTIONS,
      answerClass: "EITHER" as const,
      correctIndex: FIVE_WAY_INDEX.EITHER,
      explanation: `${scenario.actions[0].explanation} ${scenario.actions[1].explanation} ${scenario.exclusiveRelationReason} Therefore, either Course I or Course II should be chosen, not both together.`,
      pairRelation: "MUTUALLY_EXCLUSIVE_ALTERNATIVES" as const,
      semanticFingerprint: `${scenario.id}|EITHER|${scenario.actions[0].id}|${scenario.actions[1].id}`,
      seed,
    });
  }

  const qlId = input.qlId ?? "COA-QL-001";
  if (qlId === "COA-QL-007") throw new Error("COA-QL-007 is a legacy presentation identifier and cannot supply ordinary CP008 five-way authority");
  const authorities = coaEnglishAuthoritiesForQl(qlId);
  if (authorities.length === 0) throw new Error(`${qlId}: no current English authority available`);
  const scenario = authorities[seed % authorities.length]!;
  const swap = Math.floor(seed / authorities.length) % 2 === 1;
  const actions = swap
    ? Object.freeze([scenario.actions[1], scenario.actions[0]]) as readonly [CoaActionAuthority, CoaActionAuthority]
    : scenario.actions;
  const answerClass = answerClassForCoaActions(actions);
  const expected = swap ? swapAnswerClass(scenario.expectedAnswerClass) : scenario.expectedAnswerClass;
  if (answerClass !== expected) throw new Error(`${scenario.id}: five-way ordinary rendering drifted from semantic authority`);
  const instruction = TWO_ACTION_INSTRUCTIONS[Math.floor(seed / (authorities.length * 2)) % TWO_ACTION_INSTRUCTIONS.length]!;
  return Object.freeze({
    chapterId: "COA-001" as const,
    checkpointId: COA_CP008_CHECKPOINT_ID,
    presentationProfile: "TWO_ACTION_FIVE_CODE" as const,
    sourceStatus: "SOURCE_SUPPORTED_MEMORY_BASED" as const,
    semanticQlId: qlId,
    semanticAuthorityId: scenario.id,
    difficulty: scenario.difficulty,
    domain: scenario.domain,
    statement: scenario.statement,
    instruction,
    courses: Object.freeze([
      Object.freeze({ label: "I" as const, text: actions[0].text, semanticActionId: actions[0].id }),
      Object.freeze({ label: "II" as const, text: actions[1].text, semanticActionId: actions[1].id }),
    ]),
    answerOptions: COA_CP008_FIVE_WAY_OPTIONS,
    answerClass,
    correctIndex: FIVE_WAY_INDEX[answerClass],
    explanation: `${actions[0].expectedVerdict === "FOLLOWS" ? "Course I follows" : "Course I does not follow"}: ${actions[0].explanation} ${actions[1].expectedVerdict === "FOLLOWS" ? "Course II follows" : "Course II does not follow"}: ${actions[1].explanation}`,
    pairRelation: "INDEPENDENT_VERDICTS" as const,
    semanticFingerprint: `${qlId}|${scenario.id}|${actions[0].id}>${actions[1].id}|${answerClass}`,
    seed,
  });
}

export function generateCoaCp008ThreeActionQuestion(input: { readonly seed: number }) {
  const seed = normalizeSeed(input.seed);
  const scenario = COA_CP008_THREE_ACTION_AUTHORITIES[seed % COA_CP008_THREE_ACTION_AUTHORITIES.length]!;
  scenario.actions.forEach(assertCoaActionAuthorityConsistent);
  const actualMask = maskForActions(scenario.actions);
  if (actualMask !== scenario.correctMask) throw new Error(`${scenario.id}: three-action semantic mask drifted from authority`);
  if (!scenario.optionMasks.includes(scenario.correctMask)) throw new Error(`${scenario.id}: correct combination is absent from authored options`);
  const instruction = THREE_ACTION_INSTRUCTIONS[Math.floor(seed / COA_CP008_THREE_ACTION_AUTHORITIES.length) % THREE_ACTION_INSTRUCTIONS.length]!;
  const options = Object.freeze(scenario.optionMasks.map(maskLabel) as [string, string, string, string]);
  const correctIndex = scenario.optionMasks.indexOf(scenario.correctMask);
  return Object.freeze({
    chapterId: "COA-001" as const,
    checkpointId: COA_CP008_CHECKPOINT_ID,
    presentationProfile: "THREE_ACTION_COMBINATION" as const,
    sourceStatus: "SOURCE_SUPPORTED_OFFICIAL_PAPER_REPRODUCTIONS" as const,
    semanticAuthorityId: scenario.id,
    difficulty: scenario.difficulty,
    domain: scenario.domain,
    statement: scenario.statement,
    instruction,
    courses: Object.freeze(scenario.actions.map((action, index) => Object.freeze({
      label: (["I", "II", "III"] as const)[index],
      text: action.text,
      semanticActionId: action.id,
    }))),
    answerOptions: options,
    answerMask: scenario.correctMask,
    correctIndex,
    explanation: scenario.actions.map((action, index) => `Course ${(["I", "II", "III"] as const)[index]} ${action.expectedVerdict === "FOLLOWS" ? "follows" : "does not follow"}: ${action.explanation}`).join(" "),
    semanticFingerprint: `${scenario.id}|MASK:${scenario.correctMask}`,
    seed,
  });
}
