export const RNK_CP006_EQUALITY_DISCOVERY_VERSION =
  "RNK_CP006_EQUALITY_DISCOVERY_V1" as const;

export const RNK_CP006_DISCOVERY_PROTOTYPES = [
  "EQUAL_PAIR_IDENTIFICATION",
  "PAIR_RELATION_WITH_EQUALITY",
  "ENDPOINT_ENTITY_WITH_INTERNAL_TIE",
  "COMPLETE_WEAK_ORDER",
] as const;

export type RnkCp006Prototype =
  (typeof RNK_CP006_DISCOVERY_PROTOTYPES)[number];

export type RnkCp006Context =
  | "HEIGHT"
  | "SCORES"
  | "SPEED"
  | "SENIORITY"
  | "PERFORMANCE";

export interface RnkCp006State {
  readonly entities: readonly string[];
  readonly orderedGroups: readonly (readonly string[])[];
  readonly tieGroupIndex: number;
  readonly context: RnkCp006Context;
}

export interface RnkCp006Question {
  readonly checkpointId: "RNK-CP-006";
  readonly discoveryVersion: typeof RNK_CP006_EQUALITY_DISCOVERY_VERSION;
  readonly prototype: RnkCp006Prototype;
  readonly seed: number;
  readonly context: RnkCp006Context;
  readonly state: RnkCp006State;
  readonly clues: readonly string[];
  readonly stem: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly explanation: readonly string[];
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

const CONTEXTS: readonly RnkCp006Context[] = [
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

function relationText(
  context: RnkCp006Context,
  higher: string,
  lower: string,
  variant: number,
): string {
  const variants: Record<RnkCp006Context, readonly string[]> = {
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
  return variants[context][variant % variants[context].length]!;
}

function equalityText(
  context: RnkCp006Context,
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
      return `${first} and ${second} received the same performance rank.`;
  }
}

function orderLabel(groups: readonly (readonly string[])[]): string {
  return groups.map((group) => group.join(" = ")).join(" > ");
}

function buildState(seed: number): RnkCp006State {
  const entityCount = 5 + (seed % 3);
  const entities = shuffled(NAMES, 91001 + seed * 17).slice(0, entityCount);
  const levelCount = entityCount - 1;
  const tieGroupIndex = 1 + (seed % Math.max(1, levelCount - 2));
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
  return {
    entities,
    orderedGroups,
    tieGroupIndex,
    context: CONTEXTS[seed % CONTEXTS.length]!,
  };
}

function buildClues(state: RnkCp006State, seed: number): string[] {
  const clues: string[] = [];
  const tie = state.orderedGroups[state.tieGroupIndex]!;
  clues.push(equalityText(state.context, tie[0]!, tie[1]!));
  for (let index = 0; index + 1 < state.orderedGroups.length; index += 1) {
    const higher = state.orderedGroups[index]![
      (seed + index) % state.orderedGroups[index]!.length
    ]!;
    const lower = state.orderedGroups[index + 1]![
      (seed + index + 1) % state.orderedGroups[index + 1]!.length
    ]!;
    clues.push(relationText(state.context, higher, lower, seed + index));
  }
  return shuffled(clues, 92003 + seed * 13);
}

function rankGroupIndex(state: RnkCp006State, entity: string): number {
  return state.orderedGroups.findIndex((group) => group.includes(entity));
}

function pairRelation(
  state: RnkCp006State,
  first: string,
  second: string,
): "FIRST_HIGHER" | "SECOND_HIGHER" | "EQUAL" {
  const firstRank = rankGroupIndex(state, first);
  const secondRank = rankGroupIndex(state, second);
  if (firstRank === secondRank) return "EQUAL";
  return firstRank < secondRank ? "FIRST_HIGHER" : "SECOND_HIGHER";
}

function makeEqualPairQuestion(
  state: RnkCp006State,
  seed: number,
): Pick<RnkCp006Question, "stem" | "options" | "correctIndex" | "answer" | "explanation"> {
  const tie = state.orderedGroups[state.tieGroupIndex]!;
  const correct = `${tie[0]} and ${tie[1]}`;
  const distractors: string[] = [];
  for (let index = 0; index + 1 < state.orderedGroups.length; index += 1) {
    const a = state.orderedGroups[index]![0]!;
    const b = state.orderedGroups[index + 1]![0]!;
    const label = `${a} and ${b}`;
    if (label !== correct && !distractors.includes(label)) distractors.push(label);
  }
  for (const entity of state.entities) {
    const label = `${tie[0]} and ${entity}`;
    if (!tie.includes(entity) && !distractors.includes(label)) distractors.push(label);
  }
  const raw = [correct, ...distractors.slice(0, 3)];
  const desired = seed % 4;
  const options = [...raw];
  const [picked] = options.splice(0, 1);
  options.splice(desired, 0, picked!);
  return {
    stem: "Which pair is tied at the same position in the ranking?",
    options,
    correctIndex: desired,
    answer: correct,
    explanation: [
      `The equality clue joins ${tie[0]} and ${tie[1]} into one ranking level.`,
      `Combined weak order: ${orderLabel(state.orderedGroups)}.`,
      `Therefore, ${correct} are tied at the same position.`,
    ],
  };
}

function makePairRelationQuestion(
  state: RnkCp006State,
  seed: number,
): Pick<RnkCp006Question, "stem" | "options" | "correctIndex" | "answer" | "explanation"> {
  const desiredRelation = seed % 3;
  let first: string;
  let second: string;
  if (desiredRelation === 0) {
    const tie = state.orderedGroups[state.tieGroupIndex]!;
    [first, second] = [tie[0]!, tie[1]!];
  } else {
    const upper = state.orderedGroups[0]![0]!;
    const lower = state.orderedGroups[state.orderedGroups.length - 1]![0]!;
    [first, second] = desiredRelation === 1 ? [upper, lower] : [lower, upper];
  }
  const relation = pairRelation(state, first, second);
  const labels = {
    FIRST_HIGHER: `${first} is ranked higher than ${second}`,
    SECOND_HIGHER: `${second} is ranked higher than ${first}`,
    EQUAL: `${first} and ${second} are tied at the same position`,
  } as const;
  const correct = labels[relation];
  const raw = [
    labels.FIRST_HIGHER,
    labels.EQUAL,
    labels.SECOND_HIGHER,
    "The relation cannot be determined",
  ];
  const correctSourceIndex = raw.indexOf(correct);
  const desired = seed % 4;
  const options = [...raw];
  const [picked] = options.splice(correctSourceIndex, 1);
  options.splice(desired, 0, picked!);
  return {
    stem: `What is the relation between ${first} and ${second}?`,
    options,
    correctIndex: desired,
    answer: correct,
    explanation: [
      `Combined weak order: ${orderLabel(state.orderedGroups)}.`,
      relation === "EQUAL"
        ? `${first} and ${second} belong to the same equality group.`
        : `${first} and ${second} belong to different ordered groups, so their direction is fixed.`,
      `Therefore, ${correct}.`,
    ],
  };
}

function makeEndpointQuestion(
  state: RnkCp006State,
  seed: number,
): Pick<RnkCp006Question, "stem" | "options" | "correctIndex" | "answer" | "explanation"> {
  const askHighest = seed % 2 === 0;
  const correct = askHighest
    ? state.orderedGroups[0]![0]!
    : state.orderedGroups[state.orderedGroups.length - 1]![0]!;
  const distractors = state.entities.filter((entity) => entity !== correct).slice(0, 3);
  const raw = [correct, ...distractors];
  const desired = seed % 4;
  const options = [...raw];
  const [picked] = options.splice(0, 1);
  options.splice(desired, 0, picked!);
  return {
    stem: askHighest
      ? "Who is ranked highest among the given people?"
      : "Who is ranked lowest among the given people?",
    options,
    correctIndex: desired,
    answer: correct,
    explanation: [
      `Combine equality first, then read the strict order between ranking levels: ${orderLabel(state.orderedGroups)}.`,
      `${correct} is the ${askHighest ? "top" : "bottom"} endpoint.`,
    ],
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
  state: RnkCp006State,
  seed: number,
): Pick<RnkCp006Question, "stem" | "options" | "correctIndex" | "answer" | "explanation"> {
  const correct = orderLabel(state.orderedGroups);
  const tie = state.orderedGroups[state.tieGroupIndex]!;
  const splitTie = state.orderedGroups
    .flatMap((group) => group.map((entity) => [entity] as string[]));
  const wrongSplit = orderLabel(splitTie);
  const swapTop = swapGroups(state.orderedGroups, 0, 1);
  const last = state.orderedGroups.length - 1;
  const swapBottom = swapGroups(state.orderedGroups, last - 1, last);
  const wrongTiePartnerGroups = state.orderedGroups.map((group) => [...group]);
  if (state.tieGroupIndex + 1 < wrongTiePartnerGroups.length) {
    const moved = tie[1]!;
    wrongTiePartnerGroups[state.tieGroupIndex] = [tie[0]!];
    wrongTiePartnerGroups[state.tieGroupIndex + 1] = [
      moved,
      ...wrongTiePartnerGroups[state.tieGroupIndex + 1]!,
    ];
  }
  const candidates = [wrongSplit, swapTop, swapBottom, orderLabel(wrongTiePartnerGroups)]
    .filter((value, index, all) => value !== correct && all.indexOf(value) === index)
    .slice(0, 3);
  const raw = [correct, ...candidates];
  while (raw.length < 4) raw.push(swapGroups(state.orderedGroups, 0, last));
  const desired = seed % 4;
  const options = [...raw];
  const [picked] = options.splice(0, 1);
  options.splice(desired, 0, picked!);
  return {
    stem: "Which option shows the complete ranking correctly?",
    options,
    correctIndex: desired,
    answer: correct,
    explanation: [
      `Treat the equality statement as one shared ranking level, not as an unknown order.`,
      `The complete weak order is ${correct}.`,
      `The symbol “=” means the two people share the same level; “>” separates strictly ordered levels.`,
    ],
  };
}

function buildQuestion(prototype: RnkCp006Prototype, seed: number): RnkCp006Question {
  const state = buildState(seed);
  const clues = buildClues(state, seed);
  const rendered = prototype === "EQUAL_PAIR_IDENTIFICATION"
    ? makeEqualPairQuestion(state, seed)
    : prototype === "PAIR_RELATION_WITH_EQUALITY"
      ? makePairRelationQuestion(state, seed)
      : prototype === "ENDPOINT_ENTITY_WITH_INTERNAL_TIE"
        ? makeEndpointQuestion(state, seed)
        : makeCompleteOrderQuestion(state, seed);
  const mathematicalFingerprint = [
    RNK_CP006_EQUALITY_DISCOVERY_VERSION,
    prototype,
    state.context,
    state.orderedGroups.map((group) => group.length).join("-"),
    state.orderedGroups.map((group) => group.join("=")).join(">"),
    rendered.stem,
    rendered.answer,
  ].join("|");
  return {
    checkpointId: "RNK-CP-006",
    discoveryVersion: RNK_CP006_EQUALITY_DISCOVERY_VERSION,
    prototype,
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

export function buildRnkCp006EqualityDiscovery(): readonly RnkCp006Question[] {
  const questions: RnkCp006Question[] = [];
  for (const prototype of RNK_CP006_DISCOVERY_PROTOTYPES) {
    for (let ordinal = 0; ordinal < 32; ordinal += 1) {
      const seed = ordinal + RNK_CP006_DISCOVERY_PROTOTYPES.indexOf(prototype) * 1000;
      questions.push(buildQuestion(prototype, seed));
    }
  }
  return questions;
}
