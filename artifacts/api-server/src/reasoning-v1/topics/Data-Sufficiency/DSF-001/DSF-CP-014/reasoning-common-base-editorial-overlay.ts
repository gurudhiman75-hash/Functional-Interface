export const DSF_REASONING_COMMON_BASE_EDITORIAL_VERSION = "DSF_REASONING_COMMON_BASE_EDITORIAL_V3" as const;

export type DsfReasoningEditorialLane =
  | "RANKING"
  | "DIRECTION"
  | "BLOOD_RELATIONS"
  | "INEQUALITY"
  | "SEATING"
  | "CODING"
  | "CALENDAR";

type SurfaceQuestion = Readonly<{
  seed: number;
  stem: string;
  explanation: string;
  statements?: readonly unknown[];
  canonicalAnswer?: unknown;
  proof?: unknown;
  sourceChapterId?: unknown;
  sourceCapabilities?: unknown;
  [key: string]: unknown;
}>;

const EVIDENCE_OPENERS = [
  "Treat the two statements as independent pieces of evidence",
  "Read the two numbered statements as separate information records",
  "Use only the facts supplied in the two statements",
  "Examine the two statements without importing any unstated assumption",
  "Take each statement as a separate source of information",
  "Judge the two statements only from the facts they explicitly provide",
  "Work from the two given statements as independent evidence sets",
  "Interpret the two statements strictly as written",
  "Consider the information in each statement on its own terms",
  "Assess the two supplied statements as distinct evidence blocks",
] as const;

const TARGET_PHRASES = [
  "to see whether the requested result has exactly one possible value",
  "to decide whether the target can be fixed without ambiguity",
  "to determine whether the requested answer is uniquely forced",
  "to check whether only one target answer remains possible",
  "to establish whether the required result is determined uniquely",
  "to test whether the target is pinned down to a single answer",
  "to decide whether the requested quantity or relation becomes definite",
  "to verify whether the information forces one and only one result",
  "to determine whether competing target answers can still survive",
  "to check whether the requested result is fully determined",
] as const;

const ORDER_PHRASES = [
  "Check each one alone before using both together.",
  "Test individual sufficiency first, then combined sufficiency.",
  "Consider them separately and only then as a combined set.",
] as const;

const LANE_RULE: Readonly<Record<DsfReasoningEditorialLane, string>> = Object.freeze({
  RANKING: "All rank positions belong to the same completed order.",
  DIRECTION: "Turns and movements retain the route conventions stated in the item.",
  BLOOD_RELATIONS: "Family links keep their ordinary stated relationship meanings.",
  INEQUALITY: "Only relations logically forced by the stated comparisons may be used.",
  SEATING: "Seat positions and left-right relations retain the stated facing convention.",
  CODING: "The one-to-one symbol-to-digit rule remains in force throughout the item.",
  CALENDAR: "Weekday movement follows the seven-day cycle stated in the item.",
});

const EXPLANATION_LANE_CUE: Readonly<Record<DsfReasoningEditorialLane, string>> = Object.freeze({
  RANKING: "In this ranking case,",
  DIRECTION: "In this direction case,",
  BLOOD_RELATIONS: "In this kinship case,",
  INEQUALITY: "In this inequality case,",
  SEATING: "In this seating case,",
  CODING: "In this coding case,",
  CALENDAR: "In this calendar case,",
});

const EXPLANATION_OPENERS = [
  "start by asking whether Statement I leaves a single target answer.",
  "first test the target against Statement I alone, without borrowing Statement II.",
  "begin with Statement I and count how many target outcomes remain possible.",
  "check Statement I in isolation before looking at the second statement.",
  "the sufficiency test starts with the set of outcomes allowed by Statement I.",
  "consider Statement I first and see whether competing target answers survive.",
  "evaluate Statement I independently; uniqueness of the target is the key test.",
  "test the first statement on its own before bringing in any second-statement fact.",
  "for sufficiency, begin by checking whether Statement I fixes the requested result.",
  "inspect Statement I alone and note whether more than one target answer is possible.",
  "now test Statement I as a standalone evidence set for the requested target.",
  "a statement is sufficient only when it leaves one target outcome, so start with I.",
  "use Statement I by itself first and check the remaining target possibilities.",
  "the first check is whether Statement I uniquely determines what the question asks.",
  "assess Statement I alone before comparing its information with Statement II.",
  "begin the decision by testing Statement I for a unique target result.",
  "look at Statement I independently and determine whether ambiguity remains.",
  "test the first information block alone; multiple surviving targets mean insufficiency.",
  "start with the first statement and verify whether its valid cases agree on the target.",
  "check the first statement separately, focusing only on whether the target becomes definite.",
] as const;

function positiveSeed(seed: number): number {
  return Math.abs(Math.trunc(seed));
}

export function reasoningEditorialLead(lane: DsfReasoningEditorialLane, seed: number): string {
  const value = positiveSeed(seed);
  const opener = EVIDENCE_OPENERS[value % EVIDENCE_OPENERS.length]!;
  const target = TARGET_PHRASES[Math.floor(value / EVIDENCE_OPENERS.length) % TARGET_PHRASES.length]!;
  const order = ORDER_PHRASES[Math.floor(value / (EVIDENCE_OPENERS.length * TARGET_PHRASES.length)) % ORDER_PHRASES.length]!;
  return `${opener} ${target}. ${order} ${LANE_RULE[lane]}`;
}

export function reasoningExplanationLead(lane: DsfReasoningEditorialLane, seed: number): string {
  const opener = EXPLANATION_OPENERS[positiveSeed(seed) % EXPLANATION_OPENERS.length]!;
  return `${EXPLANATION_LANE_CUE[lane]} ${opener}`;
}

export function applyReasoningCommonBaseEditorialSurface<T extends SurfaceQuestion>(
  lane: DsfReasoningEditorialLane,
  question: T,
): T & Readonly<{ editorialSurfaceVersion: typeof DSF_REASONING_COMMON_BASE_EDITORIAL_VERSION }> {
  const stem = `${reasoningEditorialLead(lane, question.seed)}\n\n${question.stem}`;
  const explanation = `${reasoningExplanationLead(lane, question.seed)} ${question.explanation}`;
  return Object.freeze({
    ...question,
    stem,
    explanation,
    editorialSurfaceVersion: DSF_REASONING_COMMON_BASE_EDITORIAL_VERSION,
  });
}
