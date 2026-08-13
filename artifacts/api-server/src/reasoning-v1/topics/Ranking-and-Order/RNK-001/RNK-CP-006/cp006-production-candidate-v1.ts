import { createHash } from "node:crypto";

import type {
  RnkCp006EditorialContext,
  RnkCp006EditorialSourceForm,
} from "./cp006-equality-ranking-editorial-v2";
import type { RnkCp006ProvisionalAuthorityId } from "./cp006-authority-consolidation-v1";

export const RNK_CP006_PRODUCTION_CANDIDATE_VERSION =
  "RNK_CP006_PRODUCTION_CANDIDATE_V1" as const;

export const RNK_CP006_EXPECTED_CANDIDATE_PROJECTION_SHA256 =
  "UNPINNED" as const;

export const RNK_CP006_CANDIDATE_AUTHORITY_ASSIGNMENTS = [
  {
    authorityId: "EQUALITY_AWARE_PAIR_RELATION",
    sourceForm: "PAIR_RELATION_THROUGH_EQUALITY",
  },
  {
    authorityId: "EQUALITY_AWARE_ENDPOINT",
    sourceForm: "ENDPOINT_ENTITY_THROUGH_EQUALITY",
  },
  {
    authorityId: "COMPLETE_WEAK_ORDER",
    sourceForm: "COMPLETE_WEAK_ORDER",
  },
] as const satisfies readonly {
  readonly authorityId: RnkCp006ProvisionalAuthorityId;
  readonly sourceForm: RnkCp006EditorialSourceForm;
}[];

export type RnkCp006CandidateMode =
  | "PAIR_LOCAL_BRIDGE"
  | "PAIR_FULL_CHAIN"
  | "ENDPOINT_HIGHEST"
  | "ENDPOINT_LOWEST"
  | "COMPLETE_WEAK_ORDER";

export type RnkCp006CandidateDifficulty = "MEDIUM" | "HARD";

export interface RnkCp006CandidateStrictEdge {
  readonly higher: string;
  readonly lower: string;
}

export interface RnkCp006CandidateState {
  readonly entities: readonly string[];
  readonly orderedGroups: readonly (readonly string[])[];
  readonly tieGroupIndex: number;
  readonly context: RnkCp006EditorialContext;
  readonly equalityBridge: Readonly<{
    aboveEntity: string;
    entryTieMember: string;
    exitTieMember: string;
    belowEntity: string;
  }>;
  readonly strictEdges: readonly RnkCp006CandidateStrictEdge[];
  readonly mathematicalStateKey: string;
}

export interface RnkCp006ProductionCandidateQuestion {
  readonly checkpointId: "RNK-CP-006";
  readonly candidateVersion: typeof RNK_CP006_PRODUCTION_CANDIDATE_VERSION;
  readonly sourceForm: RnkCp006EditorialSourceForm;
  readonly authorityId: RnkCp006ProvisionalAuthorityId;
  readonly authorityOrdinal: number;
  readonly seed: number;
  readonly mode: RnkCp006CandidateMode;
  readonly context: RnkCp006EditorialContext;
  readonly difficulty: RnkCp006CandidateDifficulty;
  readonly state: RnkCp006CandidateState;
  readonly clues: readonly string[];
  readonly stem: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly explanation: readonly string[];
  readonly learnerFingerprint: string;
  readonly candidateRuntimeFingerprint: string;
  readonly candidateProfile: Readonly<{
    questionsPerAuthority: 192;
    permanentQlId: null;
    finalOwnershipApproved: false;
    englishFreezeApproved: false;
    projectionDigestPinned: boolean;
  }>;
  readonly lifecycle: Readonly<{
    permanentQlAllocated: false;
    questionStudio: "DISABLED";
    persistence: "DISABLED";
    questionBank: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
    hindiPunjabi: "NOT_STARTED";
  }>;
}

const NAMES = [
  "Aman",
  "Ananya",
  "Arjun",
  "Gurleen",
  "Harleen",
  "Ishaan",
  "Jaspreet",
  "Karan",
  "Mehak",
  "Navdeep",
  "Pooja",
  "Riya",
  "Simran",
  "Tanvi",
] as const;

const CONTEXTS: readonly RnkCp006EditorialContext[] = [
  "HEIGHT",
  "SCORES",
  "SPEED",
  "SENIORITY",
  "PERFORMANCE",
];

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value), "utf8")
    .digest("hex");
}

function rng(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(values: readonly T[], seed: number): T[] {
  const output = [...values];
  const random = rng(seed);
  for (let index = output.length - 1; index > 0; index -= 1) {
    const swapWith = Math.floor(random() * (index + 1));
    [output[index], output[swapWith]] = [output[swapWith]!, output[index]!];
  }
  return output;
}

function orderLabel(groups: readonly (readonly string[])[]): string {
  return groups.map((group) => group.join(" = ")).join(" > ");
}

function buildState(
  authorityIndex: number,
  ordinalZeroBased: number,
): RnkCp006CandidateState {
  const entityCount = 5 + (ordinalZeroBased % 3);
  const seed = 700001 + authorityIndex * 100000 + ordinalZeroBased * 7919;
  const entities = shuffled(NAMES, seed).slice(0, entityCount);
  const levelCount = entityCount - 1;
  const tieGroupIndex =
    1 + ((Math.floor(ordinalZeroBased / 3) + authorityIndex) % (levelCount - 2));
  const orderedGroups: string[][] = [];
  let cursor = 0;

  for (let level = 0; level < levelCount; level += 1) {
    if (level === tieGroupIndex) {
      orderedGroups.push([entities[cursor]!, entities[cursor + 1]!]);
      cursor += 2;
    } else {
      orderedGroups.push([entities[cursor]!]);
      cursor += 1;
    }
  }

  const tie = orderedGroups[tieGroupIndex]!;
  const entryIndex = (ordinalZeroBased + authorityIndex) % 2;
  const equalityBridge = {
    aboveEntity: orderedGroups[tieGroupIndex - 1]![0]!,
    entryTieMember: tie[entryIndex]!,
    exitTieMember: tie[1 - entryIndex]!,
    belowEntity: orderedGroups[tieGroupIndex + 1]![0]!,
  } as const;

  const strictEdges: RnkCp006CandidateStrictEdge[] = [];
  for (let level = 0; level + 1 < orderedGroups.length; level += 1) {
    if (level === tieGroupIndex - 1) {
      strictEdges.push({
        higher: equalityBridge.aboveEntity,
        lower: equalityBridge.entryTieMember,
      });
    } else if (level === tieGroupIndex) {
      strictEdges.push({
        higher: equalityBridge.exitTieMember,
        lower: equalityBridge.belowEntity,
      });
    } else {
      strictEdges.push({
        higher: orderedGroups[level]![0]!,
        lower: orderedGroups[level + 1]![0]!,
      });
    }
  }

  const mathematicalStateKey = [
    orderLabel(orderedGroups),
    `entry=${equalityBridge.entryTieMember}`,
    `exit=${equalityBridge.exitTieMember}`,
  ].join("|");

  return {
    entities,
    orderedGroups,
    tieGroupIndex,
    context: CONTEXTS[(ordinalZeroBased + authorityIndex) % CONTEXTS.length]!,
    equalityBridge,
    strictEdges,
    mathematicalStateKey,
  };
}

function strictText(
  context: RnkCp006EditorialContext,
  higher: string,
  lower: string,
  variant: number,
): string {
  switch (context) {
    case "HEIGHT":
      return variant % 2 === 0
        ? `${higher} is taller than ${lower}.`
        : `${lower} is shorter than ${higher}.`;
    case "SCORES":
      return variant % 2 === 0
        ? `${higher} scored more marks than ${lower}.`
        : `${lower} scored fewer marks than ${higher}.`;
    case "SPEED":
      return variant % 2 === 0
        ? `${higher} completed the race faster than ${lower}.`
        : `${lower} took longer than ${higher} to complete the race.`;
    case "SENIORITY":
      return variant % 2 === 0
        ? `${higher} is senior to ${lower}.`
        : `${lower} is junior to ${higher}.`;
    case "PERFORMANCE":
      return variant % 2 === 0
        ? `${higher} ranked above ${lower} in the performance review.`
        : `${lower} ranked below ${higher} in the performance review.`;
  }
}

function equalityText(
  context: RnkCp006EditorialContext,
  first: string,
  second: string,
): string {
  switch (context) {
    case "HEIGHT":
      return `${first} and ${second} are equally tall.`;
    case "SCORES":
      return `${first} and ${second} scored equal marks.`;
    case "SPEED":
      return `${first} and ${second} completed the race in the same time.`;
    case "SENIORITY":
      return `${first} and ${second} are at the same seniority level.`;
    case "PERFORMANCE":
      return `${first} and ${second} were placed at the same level in the performance review.`;
  }
}

function buildClues(state: RnkCp006CandidateState, seed: number): readonly string[] {
  const tie = state.orderedGroups[state.tieGroupIndex]!;
  const clues = [
    equalityText(state.context, tie[0]!, tie[1]!),
    ...state.strictEdges.map((edge, index) =>
      strictText(state.context, edge.higher, edge.lower, seed + index),
    ),
  ];
  return shuffled(clues, seed + 43009);
}

function contextOrderSentence(
  context: RnkCp006EditorialContext,
  order: string,
): string {
  switch (context) {
    case "HEIGHT":
      return `Putting all the statements together, the order from tallest to shortest is ${order}.`;
    case "SCORES":
      return `Putting all the statements together, the order from highest to lowest score is ${order}.`;
    case "SPEED":
      return `Putting all the statements together, the order from fastest to slowest is ${order}.`;
    case "SENIORITY":
      return `Putting all the statements together, the order from most senior to most junior is ${order}.`;
    case "PERFORMANCE":
      return `Putting all the statements together, the performance order from highest to lowest is ${order}.`;
  }
}

function bridgeSentence(state: RnkCp006CandidateState): string {
  const { aboveEntity, entryTieMember, exitTieMember, belowEntity } =
    state.equalityBridge;
  switch (state.context) {
    case "HEIGHT":
      return `${aboveEntity} is taller than ${entryTieMember}; ${entryTieMember} and ${exitTieMember} are equally tall; and ${exitTieMember} is taller than ${belowEntity}. Therefore, ${aboveEntity} is taller than ${belowEntity}.`;
    case "SCORES":
      return `${aboveEntity} scored more marks than ${entryTieMember}; ${entryTieMember} and ${exitTieMember} scored equal marks; and ${exitTieMember} scored more marks than ${belowEntity}. Therefore, ${aboveEntity} scored more marks than ${belowEntity}.`;
    case "SPEED":
      return `${aboveEntity} is faster than ${entryTieMember}; ${entryTieMember} and ${exitTieMember} are equally fast; and ${exitTieMember} is faster than ${belowEntity}. Therefore, ${aboveEntity} is faster than ${belowEntity}.`;
    case "SENIORITY":
      return `${aboveEntity} is senior to ${entryTieMember}; ${entryTieMember} and ${exitTieMember} are at the same seniority level; and ${exitTieMember} is senior to ${belowEntity}. Therefore, ${aboveEntity} is senior to ${belowEntity}.`;
    case "PERFORMANCE":
      return `${aboveEntity} is ranked above ${entryTieMember}; ${entryTieMember} and ${exitTieMember} are at the same level; and ${exitTieMember} is ranked above ${belowEntity}. Therefore, ${aboveEntity} is ranked above ${belowEntity}.`;
  }
}

function pairStem(
  context: RnkCp006EditorialContext,
  first: string,
  second: string,
): string {
  switch (context) {
    case "HEIGHT":
      return `What can be concluded about the heights of ${first} and ${second}?`;
    case "SCORES":
      return `What can be concluded about the scores of ${first} and ${second}?`;
    case "SPEED":
      return `What can be concluded about the speeds of ${first} and ${second}?`;
    case "SENIORITY":
      return `What can be concluded about the seniority of ${first} and ${second}?`;
    case "PERFORMANCE":
      return `What can be concluded about the relative positions of ${first} and ${second} in the performance review?`;
  }
}

function pairLabel(
  context: RnkCp006EditorialContext,
  first: string,
  second: string,
  outcome: "FIRST_HIGHER" | "SECOND_HIGHER" | "EQUAL" | "UNKNOWN",
): string {
  switch (context) {
    case "HEIGHT":
      if (outcome === "FIRST_HIGHER") return `${first} is taller than ${second}`;
      if (outcome === "SECOND_HIGHER") return `${second} is taller than ${first}`;
      if (outcome === "EQUAL") return `${first} and ${second} are equally tall`;
      return `Their relative heights cannot be determined`;
    case "SCORES":
      if (outcome === "FIRST_HIGHER") return `${first} scored more marks than ${second}`;
      if (outcome === "SECOND_HIGHER") return `${second} scored more marks than ${first}`;
      if (outcome === "EQUAL") return `${first} and ${second} scored equal marks`;
      return `Their score relation cannot be determined`;
    case "SPEED":
      if (outcome === "FIRST_HIGHER") return `${first} is faster than ${second}`;
      if (outcome === "SECOND_HIGHER") return `${second} is faster than ${first}`;
      if (outcome === "EQUAL") return `${first} and ${second} are equally fast`;
      return `Their relative speeds cannot be determined`;
    case "SENIORITY":
      if (outcome === "FIRST_HIGHER") return `${first} is senior to ${second}`;
      if (outcome === "SECOND_HIGHER") return `${second} is senior to ${first}`;
      if (outcome === "EQUAL") return `${first} and ${second} are at the same seniority level`;
      return `Their seniority relation cannot be determined`;
    case "PERFORMANCE":
      if (outcome === "FIRST_HIGHER") return `${first} is ranked above ${second}`;
      if (outcome === "SECOND_HIGHER") return `${second} is ranked above ${first}`;
      if (outcome === "EQUAL") return `${first} and ${second} are placed at the same level`;
      return `Their relative positions in the performance review cannot be determined`;
  }
}

function placeCorrect(
  raw: readonly string[],
  correct: string,
  correctIndex: number,
): readonly string[] {
  const options = raw.filter((option) => option !== correct);
  options.splice(correctIndex, 0, correct);
  return options;
}

function buildPairSurface(
  state: RnkCp006CandidateState,
  ordinalZeroBased: number,
): Pick<
  RnkCp006ProductionCandidateQuestion,
  "mode" | "difficulty" | "stem" | "options" | "correctIndex" | "answer" | "explanation"
> {
  const local = ordinalZeroBased % 2 === 0;
  const higher = local
    ? state.equalityBridge.aboveEntity
    : state.orderedGroups[0]![0]!;
  const lower = local
    ? state.equalityBridge.belowEntity
    : state.orderedGroups[state.orderedGroups.length - 1]![0]!;
  const reverseQuery = Math.floor(ordinalZeroBased / 2) % 2 === 1;
  const first = reverseQuery ? lower : higher;
  const second = reverseQuery ? higher : lower;
  const correct = reverseQuery
    ? pairLabel(state.context, first, second, "SECOND_HIGHER")
    : pairLabel(state.context, first, second, "FIRST_HIGHER");
  const correctIndex = ordinalZeroBased % 4;
  const options = placeCorrect(
    [
      pairLabel(state.context, first, second, "FIRST_HIGHER"),
      pairLabel(state.context, first, second, "SECOND_HIGHER"),
      pairLabel(state.context, first, second, "EQUAL"),
      pairLabel(state.context, first, second, "UNKNOWN"),
    ],
    correct,
    correctIndex,
  );
  const explanation = local
    ? [bridgeSentence(state)]
    : [
        bridgeSentence(state),
        contextOrderSentence(state.context, orderLabel(state.orderedGroups)),
        `Therefore, ${correct}.`,
      ];
  return {
    mode: local ? "PAIR_LOCAL_BRIDGE" : "PAIR_FULL_CHAIN",
    difficulty:
      !local && state.entities.length === 7 ? "HARD" : "MEDIUM",
    stem: pairStem(state.context, first, second),
    options,
    correctIndex,
    answer: correct,
    explanation,
  };
}

function endpointStem(
  context: RnkCp006EditorialContext,
  highest: boolean,
): string {
  switch (context) {
    case "HEIGHT":
      return highest ? "Who is the tallest?" : "Who is the shortest?";
    case "SCORES":
      return highest ? "Who scored the highest marks?" : "Who scored the lowest marks?";
    case "SPEED":
      return highest ? "Who is the fastest?" : "Who is the slowest?";
    case "SENIORITY":
      return highest ? "Who is the most senior?" : "Who is the most junior?";
    case "PERFORMANCE":
      return highest
        ? "Who is ranked highest in the performance review?"
        : "Who is ranked lowest in the performance review?";
  }
}

function endpointConclusion(
  context: RnkCp006EditorialContext,
  answer: string,
  highest: boolean,
): string {
  switch (context) {
    case "HEIGHT":
      return `${answer} is therefore the ${highest ? "tallest" : "shortest"}.`;
    case "SCORES":
      return `${answer} therefore has the ${highest ? "highest" : "lowest"} score.`;
    case "SPEED":
      return `${answer} is therefore the ${highest ? "fastest" : "slowest"}.`;
    case "SENIORITY":
      return `${answer} is therefore the ${highest ? "most senior" : "most junior"}.`;
    case "PERFORMANCE":
      return `${answer} is therefore ranked ${highest ? "highest" : "lowest"}.`;
  }
}

function buildEndpointSurface(
  state: RnkCp006CandidateState,
  ordinalZeroBased: number,
): Pick<
  RnkCp006ProductionCandidateQuestion,
  "mode" | "difficulty" | "stem" | "options" | "correctIndex" | "answer" | "explanation"
> {
  const highest = ordinalZeroBased % 2 === 0;
  const answer = highest
    ? state.orderedGroups[0]![0]!
    : state.orderedGroups[state.orderedGroups.length - 1]![0]!;
  const tie = state.orderedGroups[state.tieGroupIndex]!;
  const preferred = [
    ...tie,
    highest ? state.equalityBridge.aboveEntity : state.equalityBridge.belowEntity,
    ...state.entities,
  ].filter((entity, index, all) => entity !== answer && all.indexOf(entity) === index);
  const correctIndex = ordinalZeroBased % 4;
  const options = placeCorrect([answer, ...preferred.slice(0, 3)], answer, correctIndex);
  return {
    mode: highest ? "ENDPOINT_HIGHEST" : "ENDPOINT_LOWEST",
    difficulty: state.entities.length === 7 ? "HARD" : "MEDIUM",
    stem: endpointStem(state.context, highest),
    options,
    correctIndex,
    answer,
    explanation: [
      bridgeSentence(state),
      contextOrderSentence(state.context, orderLabel(state.orderedGroups)),
      endpointConclusion(state.context, answer, highest),
    ],
  };
}

function completeOrderStem(context: RnkCp006EditorialContext): string {
  switch (context) {
    case "HEIGHT":
      return `Which option shows the correct order from tallest to shortest? In the options, "=" indicates equal height.`;
    case "SCORES":
      return `Which option shows the correct order from highest to lowest score? In the options, "=" indicates equal scores.`;
    case "SPEED":
      return `Which option shows the correct order from fastest to slowest? In the options, "=" indicates equal speed.`;
    case "SENIORITY":
      return `Which option shows the correct order from most senior to most junior? In the options, "=" indicates the same seniority level.`;
    case "PERFORMANCE":
      return `Which option shows the correct performance order from highest to lowest? In the options, "=" indicates the same level.`;
  }
}

function splitTieOrder(state: RnkCp006CandidateState): string {
  return orderLabel(
    state.orderedGroups.flatMap((group) => group.map((entity) => [entity] as string[])),
  );
}

function falseEqualityOrder(
  state: RnkCp006CandidateState,
  ordinalZeroBased: number,
): string {
  const groups = state.orderedGroups.map((group) => [...group]);
  const tie = groups[state.tieGroupIndex]!;
  if (ordinalZeroBased % 2 === 0) {
    const moved = tie.pop()!;
    groups[state.tieGroupIndex + 1] = [moved, ...groups[state.tieGroupIndex + 1]!];
  } else {
    const moved = tie.shift()!;
    groups[state.tieGroupIndex - 1] = [...groups[state.tieGroupIndex - 1]!, moved];
  }
  return orderLabel(groups);
}

function strictSwapOrder(
  state: RnkCp006CandidateState,
  ordinalZeroBased: number,
): string {
  const groups = state.orderedGroups.map((group) => [...group]);
  const last = groups.length - 1;
  let left = ordinalZeroBased % 2 === 0 ? 0 : last - 1;
  let right = left + 1;
  if (left === state.tieGroupIndex || right === state.tieGroupIndex) {
    if (state.tieGroupIndex + 2 <= last) {
      left = state.tieGroupIndex + 1;
      right = left + 1;
    } else {
      right = state.tieGroupIndex - 1;
      left = right - 1;
    }
  }
  [groups[left], groups[right]] = [groups[right]!, groups[left]!];
  return orderLabel(groups);
}

function buildCompleteSurface(
  state: RnkCp006CandidateState,
  ordinalZeroBased: number,
): Pick<
  RnkCp006ProductionCandidateQuestion,
  "mode" | "difficulty" | "stem" | "options" | "correctIndex" | "answer" | "explanation"
> {
  const answer = orderLabel(state.orderedGroups);
  const distractors = [
    splitTieOrder(state),
    falseEqualityOrder(state, ordinalZeroBased),
    strictSwapOrder(state, ordinalZeroBased),
  ];
  if (new Set([answer, ...distractors]).size !== 4) {
    throw new Error(`CP006 candidate complete-order ordinal ${ordinalZeroBased}: duplicate option`);
  }
  const correctIndex = ordinalZeroBased % 4;
  const options = [...distractors];
  options.splice(correctIndex, 0, answer);
  const tie = state.orderedGroups[state.tieGroupIndex]!;
  return {
    mode: "COMPLETE_WEAK_ORDER",
    difficulty: state.entities.length === 7 ? "HARD" : "MEDIUM",
    stem: completeOrderStem(state.context),
    options,
    correctIndex,
    answer,
    explanation: [
      `${tie[0]} and ${tie[1]} must remain together at one comparison level because the statements say they are equal.`,
      contextOrderSentence(state.context, answer),
      `So the correct option is ${String.fromCharCode(65 + correctIndex)}.`,
    ],
  };
}

function normalizeLearnerText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function buildQuestion(
  authorityIndex: number,
  ordinalZeroBased: number,
): RnkCp006ProductionCandidateQuestion {
  const assignment = RNK_CP006_CANDIDATE_AUTHORITY_ASSIGNMENTS[authorityIndex]!;
  const authorityOrdinal = ordinalZeroBased + 1;
  const seed = 900001 + authorityIndex * 100000 + ordinalZeroBased * 7919;
  const state = buildState(authorityIndex, ordinalZeroBased);
  const clues = buildClues(state, seed);
  const rendered = assignment.sourceForm === "PAIR_RELATION_THROUGH_EQUALITY"
    ? buildPairSurface(state, ordinalZeroBased)
    : assignment.sourceForm === "ENDPOINT_ENTITY_THROUGH_EQUALITY"
      ? buildEndpointSurface(state, ordinalZeroBased)
      : buildCompleteSurface(state, ordinalZeroBased);

  const learnerFingerprint = sha256(
    normalizeLearnerText([
      ...clues,
      rendered.stem,
      ...rendered.options,
      ...rendered.explanation,
    ].join(" | ")),
  );

  const candidateRuntimeFingerprint = sha256({
    version: RNK_CP006_PRODUCTION_CANDIDATE_VERSION,
    authorityId: assignment.authorityId,
    authorityOrdinal,
    sourceForm: assignment.sourceForm,
    mode: rendered.mode,
    mathematicalStateKey: state.mathematicalStateKey,
    context: state.context,
    clues,
    stem: rendered.stem,
    options: rendered.options,
    correctIndex: rendered.correctIndex,
    answer: rendered.answer,
    explanation: rendered.explanation,
  });

  return {
    checkpointId: "RNK-CP-006",
    candidateVersion: RNK_CP006_PRODUCTION_CANDIDATE_VERSION,
    sourceForm: assignment.sourceForm,
    authorityId: assignment.authorityId,
    authorityOrdinal,
    seed,
    mode: rendered.mode,
    context: state.context,
    difficulty: rendered.difficulty,
    state,
    clues,
    stem: rendered.stem,
    options: rendered.options,
    correctIndex: rendered.correctIndex,
    answer: rendered.answer,
    explanation: rendered.explanation,
    learnerFingerprint,
    candidateRuntimeFingerprint,
    candidateProfile: {
      questionsPerAuthority: 192,
      permanentQlId: null,
      finalOwnershipApproved: false,
      englishFreezeApproved: false,
      projectionDigestPinned:
        RNK_CP006_EXPECTED_CANDIDATE_PROJECTION_SHA256 !== "UNPINNED",
    },
    lifecycle: {
      permanentQlAllocated: false,
      questionStudio: "DISABLED",
      persistence: "DISABLED",
      questionBank: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      hindiPunjabi: "NOT_STARTED",
    },
  };
}

export function buildRnkCp006ProductionCandidate(): readonly RnkCp006ProductionCandidateQuestion[] {
  const questions: RnkCp006ProductionCandidateQuestion[] = [];
  RNK_CP006_CANDIDATE_AUTHORITY_ASSIGNMENTS.forEach((_, authorityIndex) => {
    for (let ordinal = 0; ordinal < 192; ordinal += 1) {
      questions.push(buildQuestion(authorityIndex, ordinal));
    }
  });
  if (questions.length !== 576) {
    throw new Error(`CP006 production candidate produced ${questions.length}/576 questions`);
  }
  return questions;
}

function projectionRecord(question: RnkCp006ProductionCandidateQuestion): unknown {
  return {
    authorityId: question.authorityId,
    authorityOrdinal: question.authorityOrdinal,
    sourceForm: question.sourceForm,
    mode: question.mode,
    context: question.context,
    difficulty: question.difficulty,
    mathematicalStateKey: question.state.mathematicalStateKey,
    orderedGroups: question.state.orderedGroups,
    equalityBridge: question.state.equalityBridge,
    strictEdges: question.state.strictEdges,
    clues: question.clues,
    stem: question.stem,
    options: question.options,
    correctIndex: question.correctIndex,
    answer: question.answer,
    explanation: question.explanation,
    learnerFingerprint: question.learnerFingerprint,
    candidateRuntimeFingerprint: question.candidateRuntimeFingerprint,
  };
}

export function rnkCp006ProductionCandidateProjectionSha256(
  questions: readonly RnkCp006ProductionCandidateQuestion[],
): string {
  return sha256(questions.map(projectionRecord));
}
