import { answerClassForCoaActions } from "./action-validity-model.ts";
import { coaEnglishAuthoritiesForQl, type CoaCp006OwnedQlId } from "./english-authorities.ts";
import type { CoaActionAuthority, CoaAnswerClass, CoaScenarioAuthority } from "./types.ts";

export const COA_CP006_CHECKPOINT_ID = "COA-CP-006" as const;
export const COA_CP006_AUTHORITY = "COA_CP006_MULTISTEP_ORDERED_ENGLISH_V2" as const;

export const COA_CP006_ANSWER_OPTIONS = Object.freeze([
  "Only Course of Action I follows",
  "Only Course of Action II follows",
  "Both Courses of Action I and II follow",
  "Neither Course of Action I nor II follows",
] as const);

const INSTRUCTIONS = Object.freeze([
  "Which of the above courses of action logically follow?",
  "Which of the proposed courses of action should be taken?",
  "Which course or courses of action follow in the stated sequence?",
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

function answerIndex(answerClass: CoaAnswerClass): number {
  if (answerClass === "ONLY_I") return 0;
  if (answerClass === "ONLY_II") return 1;
  if (answerClass === "BOTH") return 2;
  return 3;
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
  const first = actions[0];
  const second = actions[1];
  const firstLead = first.expectedVerdict === "FOLLOWS" ? "Course I follows" : "Course I does not follow";
  const secondLead = second.expectedVerdict === "FOLLOWS" ? "Course II follows" : "Course II does not follow";
  return `${firstLead}: ${first.explanation} ${secondLead}: ${second.explanation} Therefore, ${COA_CP006_ANSWER_OPTIONS[answerIndex(answerClass)].toLowerCase()}.`;
}

export function generateCoaCp006Question(input: { readonly qlId: CoaCp006OwnedQlId; readonly seed: number }) {
  const seed = normalizeSeed(input.seed);
  const authorities = coaEnglishAuthoritiesForQl(input.qlId);
  if (authorities.length === 0) throw new Error(`${input.qlId}: no English authority available`);

  const scenario = authorities[seed % authorities.length]!;
  const swap = Math.floor(seed / authorities.length) % 2 === 1;
  const instruction = INSTRUCTIONS[Math.floor(seed / (authorities.length * 2)) % INSTRUCTIONS.length]!;
  const actions = orderedActions(scenario, swap);
  const answerClass = answerClassForCoaActions(actions);
  const expectedAnswerClass = swap ? swapAnswerClass(scenario.expectedAnswerClass) : scenario.expectedAnswerClass;
  if (answerClass !== expectedAnswerClass) {
    throw new Error(`${scenario.id}: generated answer drifted from semantic authority`);
  }

  return Object.freeze({
    chapterId: "COA-001" as const,
    checkpointId: COA_CP006_CHECKPOINT_ID,
    authority: COA_CP006_AUTHORITY,
    qlId: input.qlId,
    semanticAuthorityId: scenario.id,
    difficulty: scenario.difficulty,
    domain: scenario.domain,
    statement: scenario.statement,
    instruction,
    courses: Object.freeze([
      Object.freeze({ label: "I" as const, text: actions[0].text, semanticActionId: actions[0].id }),
      Object.freeze({ label: "II" as const, text: actions[1].text, semanticActionId: actions[1].id }),
    ]),
    answerOptions: COA_CP006_ANSWER_OPTIONS,
    answerClass,
    correctIndex: answerIndex(answerClass),
    explanation: explanationFor(actions, answerClass),
    semanticFingerprint: `${input.qlId}|${scenario.id}|${actions[0].id}>${actions[1].id}|${answerClass}`,
    seed,
  });
}
