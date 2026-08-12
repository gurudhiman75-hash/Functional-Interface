export const RNK_CP006_EQUALITY_EDITORIAL_VERSION =
  "RNK_CP006_EQUALITY_EDITORIAL_V2" as const;

export const RNK_CP006_EDITORIAL_SOURCE_FORMS = [
  "PAIR_RELATION_THROUGH_EQUALITY",
  "ENDPOINT_ENTITY_THROUGH_EQUALITY",
  "COMPLETE_WEAK_ORDER",
] as const;

export type RnkCp006EditorialSourceForm =
  (typeof RNK_CP006_EDITORIAL_SOURCE_FORMS)[number];

export type RnkCp006EditorialContext =
  | "HEIGHT"
  | "SCORES"
  | "SPEED"
  | "SENIORITY"
  | "PERFORMANCE";

export type RnkCp006Difficulty = "MEDIUM" | "HARD";

export interface RnkCp006EqualityBridge {
  readonly aboveEntity: string;
  readonly entryTieMember: string;
  readonly exitTieMember: string;
  readonly belowEntity: string;
}

export interface RnkCp006EditorialState {
  readonly entities: readonly string[];
  readonly orderedGroups: readonly (readonly string[])[];
  readonly tieGroupIndex: number;
  readonly context: RnkCp006EditorialContext;
  readonly equalityBridge: RnkCp006EqualityBridge;
}

export interface RnkCp006EditorialQuestion {
  readonly checkpointId: "RNK-CP-006";
  readonly editorialVersion: typeof RNK_CP006_EQUALITY_EDITORIAL_VERSION;
  readonly sourceForm: RnkCp006EditorialSourceForm;
  readonly seed: number;
  readonly context: RnkCp006EditorialContext;
  readonly difficulty: RnkCp006Difficulty;
  readonly state: RnkCp006EditorialState;
  readonly clues: readonly string[];
  readonly stem: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly explanation: readonly string[];
  readonly reasoningProfile: Readonly<{
    equalityBridgeRequired: true;
    pairSpan: "LOCAL_BRIDGE" | "FULL_CHAIN" | null;
    proofLevels: number;
    directEqualityLookup: false;
  }>;
  readonly mathematicalFingerprint: string;
  readonly lifecycle: Readonly<{
    permanentQlAllocated: false;
    questionStudio: "DISABLED";
    questionBank: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
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

function strictText(
  context: RnkCp006EditorialContext,
  higher: string,
  lower: string,
  variant: number,
): string {
  const variants: Record<RnkCp006EditorialContext, readonly string[]> = {
    HEIGHT: [
      `${higher} is taller than ${lower}.`,
      `${lower} is shorter than ${higher}.`,
    ],
    SCORES: [
      `${higher} scored more marks than ${lower}.`,
      `${lower} scored fewer marks than ${higher}.`,
    ],
    SPEED: [
      `${higher} completed the race faster than ${lower}.`,
      `${lower} took longer than ${higher} to complete the race.`,
    ],
    SENIORITY: [
      `${higher} is senior to ${lower}.`,
      `${lower} is junior to ${higher}.`,
    ],
    PERFORMANCE: [
      `${higher} ranked above ${lower} in the performance review.`,
      `${lower} ranked below ${higher} in the performance review.`,
    ],
  };
  return variants[context][variant % 2]!;
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
      return `${first} and ${second} received the same performance level.`;
  }
}

function orderLabel(groups: readonly (readonly string[])[]): string {
  return groups.map((group) => group.join(" = ")).join(" > ");
}

function buildState(seed: number): RnkCp006EditorialState {
  const entityCount = 5 + (seed % 3);
  const entities = shuffled(NAMES, 161003 + seed * 23).slice(0, entityCount);
  const levelCount = entityCount - 1;
  const tieGroupIndex = 1 + (seed % (levelCount - 2));
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
  const entryIndex = seed % 2;
  const exitIndex = 1 - entryIndex;
  const equalityBridge: RnkCp006EqualityBridge = {
    aboveEntity: orderedGroups[tieGroupIndex - 1]![0]!,
    entryTieMember: tie[entryIndex]!,
    exitTieMember: tie[exitIndex]!,
    belowEntity: orderedGroups[tieGroupIndex + 1]![0]!,
  };

  return {
    entities,
    orderedGroups,
    tieGroupIndex,
    context: CONTEXTS[seed % CONTEXTS.length]!,
    equalityBridge,
  };
}

function buildClues(state: RnkCp006EditorialState, seed: number): string[] {
  const clues: string[] = [];
  const tie = state.orderedGroups[state.tieGroupIndex]!;
  clues.push(equalityText(state.context, tie[0]!, tie[1]!));

  for (let index = 0; index + 1 < state.orderedGroups.length; index += 1) {
    let higher = state.orderedGroups[index]![0]!;
    let lower = state.orderedGroups[index + 1]![0]!;

    if (index === state.tieGroupIndex - 1) {
      higher = state.equalityBridge.aboveEntity;
      lower = state.equalityBridge.entryTieMember;
    } else if (index === state.tieGroupIndex) {
      higher = state.equalityBridge.exitTieMember;
      lower = state.equalityBridge.belowEntity;
    }

    clues.push(strictText(state.context, higher, lower, seed + index));
  }

  return shuffled(clues, 181021 + seed * 29);
}

function pairLabel(first: string, second: string, kind: "FIRST_HIGHER" | "SECOND_HIGHER" | "EQUAL" | "UNKNOWN"): string {
  switch (kind) {
    case "FIRST_HIGHER":
      return `${first} is ranked higher than ${second}`;
    case "SECOND_HIGHER":
      return `${second} is ranked higher than ${first}`;
    case "EQUAL":
      return `${first} and ${second} are tied at the same level`;
    case "UNKNOWN":
      return `The relation between ${first} and ${second} cannot be determined`;
  }
}

function placeCorrect(raw: readonly string[], correct: string, desiredIndex: number): readonly string[] {
  const output = raw.filter((option) => option !== correct);
  output.splice(desiredIndex, 0, correct);
  return output;
}

function bridgeProof(state: RnkCp006EditorialState): string {
  const bridge = state.equalityBridge;
  return `${bridge.aboveEntity} > ${bridge.entryTieMember}, ${bridge.entryTieMember} = ${bridge.exitTieMember}, and ${bridge.exitTieMember} > ${bridge.belowEntity}; therefore ${bridge.aboveEntity} > ${bridge.belowEntity}.`;
}

function makePairQuestion(
  state: RnkCp006EditorialState,
  seed: number,
): Pick<RnkCp006EditorialQuestion, "stem" | "options" | "correctIndex" | "answer" | "explanation" | "reasoningProfile" | "difficulty"> {
  const span = seed % 2 === 0 ? "LOCAL_BRIDGE" as const : "FULL_CHAIN" as const;
  const higher = span === "LOCAL_BRIDGE"
    ? state.equalityBridge.aboveEntity
    : state.orderedGroups[0]![0]!;
  const lower = span === "LOCAL_BRIDGE"
    ? state.equalityBridge.belowEntity
    : state.orderedGroups[state.orderedGroups.length - 1]![0]!;
  const reverseQuery = Math.floor(seed / 2) % 2 === 1;
  const first = reverseQuery ? lower : higher;
  const second = reverseQuery ? higher : lower;
  const correct = reverseQuery
    ? pairLabel(first, second, "SECOND_HIGHER")
    : pairLabel(first, second, "FIRST_HIGHER");
  const raw = [
    pairLabel(first, second, "FIRST_HIGHER"),
    pairLabel(first, second, "SECOND_HIGHER"),
    pairLabel(first, second, "EQUAL"),
    pairLabel(first, second, "UNKNOWN"),
  ];
  const desiredIndex = seed % 4;
  const proofLevels = span === "LOCAL_BRIDGE"
    ? 3
    : state.orderedGroups.length - 1;
  const difficulty: RnkCp006Difficulty = span === "FULL_CHAIN" && state.entities.length === 7
    ? "HARD"
    : "MEDIUM";
  return {
    stem: `What is the relation between ${first} and ${second}?`,
    options: placeCorrect(raw, correct, desiredIndex),
    correctIndex: desiredIndex,
    answer: correct,
    explanation: [
      `The equality statement must be used as a bridge: ${bridgeProof(state)}`,
      span === "FULL_CHAIN"
        ? `Continue the same strict chain to obtain ${higher} > ${lower}.`
        : `So the two people immediately outside the tied level have a fixed order.`,
      `Therefore, ${correct}.`,
    ],
    reasoningProfile: {
      equalityBridgeRequired: true,
      pairSpan: span,
      proofLevels,
      directEqualityLookup: false,
    },
    difficulty,
  };
}

function makeEndpointQuestion(
  state: RnkCp006EditorialState,
  seed: number,
): Pick<RnkCp006EditorialQuestion, "stem" | "options" | "correctIndex" | "answer" | "explanation" | "reasoningProfile" | "difficulty"> {
  const askHighest = seed % 2 === 0;
  const answer = askHighest
    ? state.orderedGroups[0]![0]!
    : state.orderedGroups[state.orderedGroups.length - 1]![0]!;
  const misconceptions = state.entities.filter((entity) => entity !== answer);
  const tied = state.orderedGroups[state.tieGroupIndex]!;
  const preferred = [
    ...tied,
    askHighest ? state.equalityBridge.aboveEntity : state.equalityBridge.belowEntity,
    ...misconceptions,
  ].filter((entity, index, all) => entity !== answer && all.indexOf(entity) === index);
  const raw = [answer, ...preferred.slice(0, 3)];
  const desiredIndex = seed % 4;
  const options = placeCorrect(raw, answer, desiredIndex);
  const difficulty: RnkCp006Difficulty = state.entities.length === 7 ? "HARD" : "MEDIUM";
  return {
    stem: askHighest
      ? "Who is ranked highest among the given people?"
      : "Who is ranked lowest among the given people?",
    options,
    correctIndex: desiredIndex,
    answer,
    explanation: [
      `Do not split the equal pair into two ranks. Use the equality bridge: ${bridgeProof(state)}`,
      `This joins the comparison chain into ${orderLabel(state.orderedGroups)}.`,
      `${answer} is therefore the unique ${askHighest ? "highest" : "lowest"} person.`,
    ],
    reasoningProfile: {
      equalityBridgeRequired: true,
      pairSpan: null,
      proofLevels: state.orderedGroups.length - 1,
      directEqualityLookup: false,
    },
    difficulty,
  };
}

function swapGroups(
  groups: readonly (readonly string[])[],
  left: number,
  right: number,
): string {
  const copy = groups.map((group) => [...group]);
  [copy[left], copy[right]] = [copy[right]!, copy[left]!];
  return orderLabel(copy);
}

function makeCompleteOrderQuestion(
  state: RnkCp006EditorialState,
  seed: number,
): Pick<RnkCp006EditorialQuestion, "stem" | "options" | "correctIndex" | "answer" | "explanation" | "reasoningProfile" | "difficulty"> {
  const answer = orderLabel(state.orderedGroups);
  const splitTie = orderLabel(state.orderedGroups.flatMap((group) => group.map((entity) => [entity])));
  const reversedTieGroups = state.orderedGroups.map((group) => [...group]);
  const tie = reversedTieGroups[state.tieGroupIndex]!;
  reversedTieGroups[state.tieGroupIndex] = [...tie].reverse();
  const falseEqualityGroups = state.orderedGroups.map((group) => [...group]);
  const moved = falseEqualityGroups[state.tieGroupIndex]!.pop()!;
  falseEqualityGroups[state.tieGroupIndex + 1] = [moved, ...falseEqualityGroups[state.tieGroupIndex + 1]!];
  const last = state.orderedGroups.length - 1;
  const candidateDistractors = [
    splitTie,
    swapGroups(state.orderedGroups, 0, 1),
    swapGroups(state.orderedGroups, last - 1, last),
    orderLabel(falseEqualityGroups),
  ].filter((value, index, all) => value !== answer && all.indexOf(value) === index);
  const distractors = candidateDistractors.slice(0, 3);
  if (distractors.length !== 3) {
    throw new Error(`CP006 complete-order seed ${seed}: unable to create three distinct distractors`);
  }
  const desiredIndex = seed % 4;
  const options = placeCorrect([answer, ...distractors], answer, desiredIndex);
  const difficulty: RnkCp006Difficulty = state.entities.length === 7 ? "HARD" : "MEDIUM";
  return {
    stem: "Which option shows the complete ranking correctly?",
    options,
    correctIndex: desiredIndex,
    answer,
    explanation: [
      `The chain crosses the tied level only after using ${state.equalityBridge.entryTieMember} = ${state.equalityBridge.exitTieMember}.`,
      `Hence the complete ranking is ${answer}.`,
      `The symbol “=” marks one shared comparison level; it does not mean the two people are uncomparable.`,
    ],
    reasoningProfile: {
      equalityBridgeRequired: true,
      pairSpan: null,
      proofLevels: state.orderedGroups.length - 1,
      directEqualityLookup: false,
    },
    difficulty,
  };
}

function buildQuestion(
  sourceForm: RnkCp006EditorialSourceForm,
  seed: number,
): RnkCp006EditorialQuestion {
  const state = buildState(seed);
  const clues = buildClues(state, seed);
  const rendered = sourceForm === "PAIR_RELATION_THROUGH_EQUALITY"
    ? makePairQuestion(state, seed)
    : sourceForm === "ENDPOINT_ENTITY_THROUGH_EQUALITY"
      ? makeEndpointQuestion(state, seed)
      : makeCompleteOrderQuestion(state, seed);
  const mathematicalFingerprint = [
    RNK_CP006_EQUALITY_EDITORIAL_VERSION,
    sourceForm,
    state.context,
    orderLabel(state.orderedGroups),
    state.equalityBridge.entryTieMember,
    state.equalityBridge.exitTieMember,
    rendered.stem,
    rendered.answer,
  ].join("|");

  return {
    checkpointId: "RNK-CP-006",
    editorialVersion: RNK_CP006_EQUALITY_EDITORIAL_VERSION,
    sourceForm,
    seed,
    context: state.context,
    state,
    clues,
    ...rendered,
    mathematicalFingerprint,
    lifecycle: {
      permanentQlAllocated: false,
      questionStudio: "DISABLED",
      questionBank: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
    },
  };
}

export function buildRnkCp006EqualityEditorialV2(): readonly RnkCp006EditorialQuestion[] {
  const questions: RnkCp006EditorialQuestion[] = [];
  RNK_CP006_EDITORIAL_SOURCE_FORMS.forEach((sourceForm, formIndex) => {
    for (let ordinal = 0; ordinal < 48; ordinal += 1) {
      questions.push(buildQuestion(sourceForm, ordinal + formIndex * 1000));
    }
  });
  return questions;
}
