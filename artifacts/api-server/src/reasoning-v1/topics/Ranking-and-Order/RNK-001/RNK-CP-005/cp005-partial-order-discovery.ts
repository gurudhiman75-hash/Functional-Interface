import { createHash } from "node:crypto";

export const RNK_CP005_PARTIAL_ORDER_DISCOVERY_VERSION =
  "RNK_CP005_PARTIAL_ORDER_DISCOVERY_V1" as const;

export const RNK_CP005_PROTOTYPE_IDS = [
  "DEFINITELY_TRUE_RELATION",
  "POSSIBLE_RELATION",
  "IMPOSSIBLE_RELATION",
  "PAIR_RELATION_CANNOT_BE_DETERMINED",
  "MINIMUM_POSSIBLE_RANK",
  "MAXIMUM_POSSIBLE_RANK",
  "DEFINITE_RANK_OR_INDETERMINATE",
  "ORDER_UNIQUENESS_STATUS",
] as const;

export type RnkCp005PrototypeId = (typeof RNK_CP005_PROTOTYPE_IDS)[number];

export type RnkCp005Context =
  | "MERIT_LIST"
  | "INTERVIEW_SHORTLIST"
  | "PERFORMANCE_REVIEW"
  | "RACE_RESULT"
  | "EXAM_SCORE_ORDER";

export type RnkCp005Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface RnkCp005Edge {
  readonly higher: string;
  readonly lower: string;
}

export interface RnkCp005FixedRank {
  readonly entity: string;
  readonly rank: number;
}

export interface RnkCp005PartialOrderState {
  readonly seed: number;
  readonly topology: "DIAMOND" | "TWO_CHAINS" | "BRANCHED" | "ANCHORED_PARTIAL";
  readonly context: RnkCp005Context;
  readonly entities: readonly string[];
  readonly edges: readonly RnkCp005Edge[];
  readonly fixedRanks: readonly RnkCp005FixedRank[];
  readonly validOrders: readonly (readonly string[])[];
}

export interface RnkCp005Option {
  readonly label: string;
  readonly truth: boolean;
  readonly explanation: string;
}

export interface RnkCp005DiscoveryQuestion {
  readonly discoveryId: string;
  readonly prototypeId: RnkCp005PrototypeId;
  readonly seed: number;
  readonly context: RnkCp005Context;
  readonly difficulty: RnkCp005Difficulty;
  readonly instruction: string;
  readonly clues: readonly string[];
  readonly stem: string;
  readonly options: readonly RnkCp005Option[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly explanation: readonly string[];
  readonly validOrderCount: number;
  readonly exampleValidOrders: readonly (readonly string[])[];
  readonly mathematicalFingerprint: string;
  readonly lifecycle: Readonly<{
    permanentQlAllocated: false;
    questionStudio: "DISABLED";
    questionBank: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
  }>;
}

const NAME_POOL = [
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

const CONTEXTS: readonly RnkCp005Context[] = [
  "MERIT_LIST",
  "INTERVIEW_SHORTLIST",
  "PERFORMANCE_REVIEW",
  "RACE_RESULT",
  "EXAM_SCORE_ORDER",
];

function mulberry32(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(items: readonly T[], seed: number): T[] {
  const output = [...items];
  const random = mulberry32(seed + 1);
  for (let i = output.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [output[i], output[j]] = [output[j]!, output[i]!];
  }
  return output;
}

function uniqueEdges(edges: readonly RnkCp005Edge[]): readonly RnkCp005Edge[] {
  const seen = new Set<string>();
  return edges.filter((edge) => {
    const key = `${edge.higher}>${edge.lower}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildTopology(
  order: readonly string[],
  topology: RnkCp005PartialOrderState["topology"],
  seed: number,
): Pick<RnkCp005PartialOrderState, "edges" | "fixedRanks"> {
  const n = order.length;
  const edge = (higherIndex: number, lowerIndex: number): RnkCp005Edge => ({
    higher: order[higherIndex]!,
    lower: order[lowerIndex]!,
  });
  const edges: RnkCp005Edge[] = [];
  const fixedRanks: RnkCp005FixedRank[] = [];

  if (topology === "DIAMOND") {
    edges.push(edge(0, 1), edge(0, 2), edge(1, 3), edge(2, 3));
    if (n >= 5) edges.push(edge(3, 4));
    if (n >= 6) edges.push(edge(3, 5));
    if (n >= 7) edges.push(edge(5, 6));
  } else if (topology === "TWO_CHAINS") {
    for (let i = 0; i + 2 < n; i += 2) edges.push(edge(i, i + 2));
    for (let i = 1; i + 2 < n; i += 2) edges.push(edge(i, i + 2));
    if (n >= 6 && seed % 2 === 0) edges.push(edge(2, 5));
  } else if (topology === "BRANCHED") {
    edges.push(edge(0, 2), edge(1, 2));
    if (n >= 5) edges.push(edge(2, 4), edge(3, 4));
    if (n >= 6) edges.push(edge(4, 5));
    if (n >= 7) edges.push(edge(4, 6));
  } else {
    edges.push(edge(0, 2), edge(1, 3));
    if (n >= 5) edges.push(edge(2, 4), edge(3, 4));
    if (n >= 6) edges.push(edge(4, 5));
    if (n >= 7) edges.push(edge(4, 6));
    if (seed % 2 === 0) {
      fixedRanks.push({ entity: order[0]!, rank: 1 });
    } else {
      fixedRanks.push({ entity: order[n - 1]!, rank: n });
    }
  }

  return { edges: uniqueEdges(edges), fixedRanks };
}

export function enumerateRnkCp005ValidOrders(
  entities: readonly string[],
  edges: readonly RnkCp005Edge[],
  fixedRanks: readonly RnkCp005FixedRank[],
  maximum = 10_000,
): readonly (readonly string[])[] {
  const predecessors = new Map<string, Set<string>>(
    entities.map((entity) => [entity, new Set<string>()]),
  );
  for (const edge of edges) {
    if (!predecessors.has(edge.higher) || !predecessors.has(edge.lower)) {
      throw new Error(`Unknown entity in edge ${edge.higher}>${edge.lower}`);
    }
    predecessors.get(edge.lower)!.add(edge.higher);
  }
  const fixedByEntity = new Map(fixedRanks.map((item) => [item.entity, item.rank]));
  const entityAtFixedRank = new Map(fixedRanks.map((item) => [item.rank, item.entity]));
  if (fixedByEntity.size !== fixedRanks.length || entityAtFixedRank.size !== fixedRanks.length) {
    throw new Error("Duplicate fixed-rank constraint");
  }

  const output: string[][] = [];
  const used = new Set<string>();
  const partial: string[] = [];

  const visit = () => {
    if (output.length >= maximum) return;
    if (partial.length === entities.length) {
      output.push([...partial]);
      return;
    }
    const rank = partial.length + 1;
    const requiredEntity = entityAtFixedRank.get(rank);
    const candidates = entities.filter((entity) => {
      if (used.has(entity)) return false;
      if (requiredEntity && entity !== requiredEntity) return false;
      const fixedRank = fixedByEntity.get(entity);
      if (fixedRank !== undefined && fixedRank !== rank) return false;
      return [...predecessors.get(entity)!].every((predecessor) => used.has(predecessor));
    });
    for (const candidate of candidates) {
      used.add(candidate);
      partial.push(candidate);
      visit();
      partial.pop();
      used.delete(candidate);
    }
  };

  visit();
  return output;
}

export function buildRnkCp005PartialOrderState(seed: number): RnkCp005PartialOrderState {
  const entityCount = 5 + (seed % 3);
  const names = shuffled(NAME_POOL, seed * 37 + 11).slice(0, entityCount);
  const hiddenOrder = shuffled(names, seed * 53 + 29);
  const topology = (["DIAMOND", "TWO_CHAINS", "BRANCHED", "ANCHORED_PARTIAL"] as const)[
    seed % 4
  ];
  const { edges, fixedRanks } = buildTopology(hiddenOrder, topology, seed);
  const validOrders = enumerateRnkCp005ValidOrders(names, edges, fixedRanks);

  if (validOrders.length < 2) {
    throw new Error(`Seed ${seed} did not produce genuine uncertainty`);
  }

  return {
    seed,
    topology,
    context: CONTEXTS[seed % CONTEXTS.length]!,
    entities: names,
    edges,
    fixedRanks,
    validOrders,
  };
}

function contextIntro(context: RnkCp005Context, count: number): string {
  switch (context) {
    case "MERIT_LIST": return `${count} candidates are placed in a merit list from highest rank to lowest rank.`;
    case "INTERVIEW_SHORTLIST": return `${count} applicants are ranked in an interview shortlist from highest to lowest.`;
    case "PERFORMANCE_REVIEW": return `${count} employees are ranked from best performance to lowest performance.`;
    case "RACE_RESULT": return `${count} runners are ranked from first finisher to last finisher.`;
    case "EXAM_SCORE_ORDER": return `${count} students are ranked from highest score to lowest score.`;
  }
}

function edgeText(edge: RnkCp005Edge, context: RnkCp005Context, variant: number): string {
  const templates: Record<RnkCp005Context, readonly ((a: string, b: string) => string)[]> = {
    MERIT_LIST: [
      (a, b) => `${a} is ranked above ${b}.`,
      (a, b) => `${b} has a lower rank than ${a}.`,
      (a, b) => `${a} appears before ${b} in the merit list.`,
    ],
    INTERVIEW_SHORTLIST: [
      (a, b) => `${a} is placed above ${b} in the shortlist.`,
      (a, b) => `${b} is ranked lower than ${a}.`,
      (a, b) => `${a} has a better interview rank than ${b}.`,
    ],
    PERFORMANCE_REVIEW: [
      (a, b) => `${a} is ranked above ${b} for performance.`,
      (a, b) => `${b} has a lower performance rank than ${a}.`,
      (a, b) => `${a} performed better than ${b}.`,
    ],
    RACE_RESULT: [
      (a, b) => `${a} finished before ${b}.`,
      (a, b) => `${b} finished after ${a}.`,
      (a, b) => `${a} secured a better finishing position than ${b}.`,
    ],
    EXAM_SCORE_ORDER: [
      (a, b) => `${a} is ranked above ${b} by score.`,
      (a, b) => `${b} obtained a lower rank than ${a}.`,
      (a, b) => `${a} scored higher than ${b}.`,
    ],
  };
  const choices = templates[context];
  return choices[variant % choices.length]!(edge.higher, edge.lower);
}

function fixedRankText(item: RnkCp005FixedRank, context: RnkCp005Context): string {
  if (context === "RACE_RESULT") return `${item.entity} finished in position ${item.rank}.`;
  return `${item.entity} is ranked ${item.rank}${ordinalSuffix(item.rank)}.`;
}

function ordinalSuffix(value: number): string {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return "th";
  if (value % 10 === 1) return "st";
  if (value % 10 === 2) return "nd";
  if (value % 10 === 3) return "rd";
  return "th";
}

function relationStats(state: RnkCp005PartialOrderState, first: string, second: string) {
  let firstAbove = 0;
  let secondAbove = 0;
  for (const order of state.validOrders) {
    if (order.indexOf(first) < order.indexOf(second)) firstAbove += 1;
    else secondAbove += 1;
  }
  return { firstAbove, secondAbove };
}

function rankSet(state: RnkCp005PartialOrderState, entity: string): readonly number[] {
  return [...new Set(state.validOrders.map((order) => order.indexOf(entity) + 1))].sort((a, b) => a - b);
}

function pairCandidates(state: RnkCp005PartialOrderState) {
  const pairs: { first: string; second: string; firstAbove: number; secondAbove: number }[] = [];
  for (let i = 0; i < state.entities.length; i += 1) {
    for (let j = i + 1; j < state.entities.length; j += 1) {
      const first = state.entities[i]!;
      const second = state.entities[j]!;
      pairs.push({ first, second, ...relationStats(state, first, second) });
    }
  }
  return pairs;
}

function rotateCorrectOption(
  options: readonly RnkCp005Option[],
  desiredIndex: number,
): { options: readonly RnkCp005Option[]; correctIndex: number } {
  const currentIndex = options.findIndex((option) => option.truth);
  if (currentIndex < 0) throw new Error("No correct option");
  if (options.filter((option) => option.truth).length !== 1) {
    throw new Error("Question must have exactly one correct option");
  }
  const output = [...options];
  const [correct] = output.splice(currentIndex, 1);
  output.splice(desiredIndex % output.length, 0, correct!);
  return { options: output, correctIndex: desiredIndex % output.length };
}

function relationLabel(first: string, second: string): string {
  return `${first} is ranked above ${second}`;
}

function findVariablePair(state: RnkCp005PartialOrderState) {
  return pairCandidates(state).find((pair) => pair.firstAbove > 0 && pair.secondAbove > 0);
}

function findDefinitePairs(state: RnkCp005PartialOrderState) {
  return pairCandidates(state).filter((pair) => pair.firstAbove === 0 || pair.secondAbove === 0);
}

function truthOfRelation(state: RnkCp005PartialOrderState, first: string, second: string) {
  const stats = relationStats(state, first, second);
  return {
    definite: stats.firstAbove === state.validOrders.length,
    possible: stats.firstAbove > 0,
    impossible: stats.firstAbove === 0,
  };
}

function relationOption(
  state: RnkCp005PartialOrderState,
  first: string,
  second: string,
  expected: "DEFINITE" | "POSSIBLE" | "IMPOSSIBLE",
): RnkCp005Option {
  const truth = truthOfRelation(state, first, second);
  const isTrue = expected === "DEFINITE" ? truth.definite : expected === "POSSIBLE" ? truth.possible : truth.impossible;
  const labelPrefix = expected === "DEFINITE" ? "It is definitely true that" : expected === "POSSIBLE" ? "It is possible that" : "It is impossible that";
  return {
    label: `${labelPrefix} ${first} ranks above ${second}.`,
    truth: isTrue,
    explanation: `${first} appears above ${second} in ${relationStats(state, first, second).firstAbove} of ${state.validOrders.length} valid rankings.`,
  };
}

function numericOptions(answer: number, min: number, max: number): number[] {
  const values = [answer];
  for (let delta = 1; values.length < 4; delta += 1) {
    for (const candidate of [answer - delta, answer + delta]) {
      if (candidate >= min && candidate <= max && !values.includes(candidate)) values.push(candidate);
      if (values.length === 4) break;
    }
  }
  return values;
}

function exampleOrders(state: RnkCp005PartialOrderState): readonly (readonly string[])[] {
  if (state.validOrders.length <= 3) return state.validOrders;
  return [state.validOrders[0]!, state.validOrders[Math.floor(state.validOrders.length / 2)]!, state.validOrders.at(-1)!];
}

function buildQuestionSurface(
  prototypeId: RnkCp005PrototypeId,
  state: RnkCp005PartialOrderState,
): Pick<RnkCp005DiscoveryQuestion, "stem" | "options" | "correctIndex" | "answer" | "explanation" | "difficulty"> {
  const desiredIndex = state.seed % 4;
  const variablePair = findVariablePair(state);
  const definitePairs = findDefinitePairs(state);
  if (!variablePair || definitePairs.length < 2) throw new Error(`Seed ${state.seed} lacks required pair diversity`);

  let stem = "";
  let options: RnkCp005Option[] = [];
  let answer = "";
  const explanation: string[] = [];

  if (prototypeId === "DEFINITELY_TRUE_RELATION") {
    const correctPair = definitePairs[state.seed % definitePairs.length]!;
    const first = correctPair.firstAbove > 0 ? correctPair.first : correctPair.second;
    const second = correctPair.firstAbove > 0 ? correctPair.second : correctPair.first;
    const alternatives = pairCandidates(state)
      .filter((pair) => !truthOfRelation(state, pair.first, pair.second).definite)
      .slice(0, 3);
    stem = "Which of the following relations must be true in every valid ranking?";
    options = [
      relationOption(state, first, second, "DEFINITE"),
      ...alternatives.map((pair) => relationOption(state, pair.first, pair.second, "DEFINITE")),
    ];
    answer = relationLabel(first, second);
    explanation.push(
      `There are ${state.validOrders.length} valid rankings. In every one of them, ${first} appears above ${second}.`,
      `The other statements fail in at least one valid ranking, so they are not definite conclusions.`,
    );
  } else if (prototypeId === "POSSIBLE_RELATION") {
    const impossibleRelations = definitePairs.map((pair) => {
      const first = pair.firstAbove === 0 ? pair.first : pair.second;
      const second = pair.firstAbove === 0 ? pair.second : pair.first;
      return { first, second };
    });
    stem = "Which of the following relations is possible in at least one valid ranking?";
    options = [
      relationOption(state, variablePair.first, variablePair.second, "POSSIBLE"),
      ...impossibleRelations.slice(0, 3).map((pair) => relationOption(state, pair.first, pair.second, "POSSIBLE")),
    ];
    answer = `${variablePair.first} can rank above ${variablePair.second}`;
    explanation.push(
      `${variablePair.first} appears above ${variablePair.second} in ${variablePair.firstAbove} valid ranking(s), so the relation is possible.`,
      `Each wrong option contradicts the comparison constraints in every valid ranking.`,
    );
  } else if (prototypeId === "IMPOSSIBLE_RELATION") {
    const impossiblePair = definitePairs[state.seed % definitePairs.length]!;
    const first = impossiblePair.firstAbove === 0 ? impossiblePair.first : impossiblePair.second;
    const second = impossiblePair.firstAbove === 0 ? impossiblePair.second : impossiblePair.first;
    const possiblePairs = pairCandidates(state)
      .filter((pair) => truthOfRelation(state, pair.first, pair.second).possible)
      .slice(0, 3);
    stem = "Which of the following relations is impossible?";
    options = [
      relationOption(state, first, second, "IMPOSSIBLE"),
      ...possiblePairs.map((pair) => relationOption(state, pair.first, pair.second, "IMPOSSIBLE")),
    ];
    answer = `${first} cannot rank above ${second}`;
    explanation.push(
      `${first} appears above ${second} in none of the ${state.validOrders.length} valid rankings.`,
      `Every other option occurs in at least one valid ranking and is therefore not impossible.`,
    );
  } else if (prototypeId === "PAIR_RELATION_CANNOT_BE_DETERMINED") {
    stem = `What can be concluded about the relative ranks of ${variablePair.first} and ${variablePair.second}?`;
    options = [
      {
        label: `${variablePair.first} must rank above ${variablePair.second}.`,
        truth: false,
        explanation: `${variablePair.second} appears above ${variablePair.first} in ${variablePair.secondAbove} valid ranking(s).`,
      },
      {
        label: `${variablePair.second} must rank above ${variablePair.first}.`,
        truth: false,
        explanation: `${variablePair.first} appears above ${variablePair.second} in ${variablePair.firstAbove} valid ranking(s).`,
      },
      {
        label: `Their relative ranks cannot be determined uniquely.`,
        truth: true,
        explanation: `Both relative orders occur among the valid rankings.`,
      },
      {
        label: `The clues are contradictory and no ranking is possible.`,
        truth: false,
        explanation: `${state.validOrders.length} valid rankings satisfy all clues.`,
      },
    ];
    answer = "Their relative ranks cannot be determined uniquely";
    explanation.push(
      `${variablePair.first} is above ${variablePair.second} in ${variablePair.firstAbove} valid ranking(s).`,
      `${variablePair.second} is above ${variablePair.first} in ${variablePair.secondAbove} valid ranking(s). Therefore neither relative order is forced.`,
    );
  } else if (prototypeId === "MINIMUM_POSSIBLE_RANK" || prototypeId === "MAXIMUM_POSSIBLE_RANK") {
    const variableEntities = state.entities
      .map((entity) => ({ entity, ranks: rankSet(state, entity) }))
      .filter((item) => item.ranks.length > 1);
    const target = variableEntities[state.seed % variableEntities.length]!;
    const answerValue = prototypeId === "MINIMUM_POSSIBLE_RANK" ? target.ranks[0]! : target.ranks.at(-1)!;
    stem = `What is the ${prototypeId === "MINIMUM_POSSIBLE_RANK" ? "best (minimum-numbered)" : "lowest (maximum-numbered)"} possible rank of ${target.entity}?`;
    options = numericOptions(answerValue, 1, state.entities.length).map((value) => ({
      label: `${value}${ordinalSuffix(value)}`,
      truth: value === answerValue,
      explanation: target.ranks.includes(value)
        ? `${target.entity} occupies rank ${value} in at least one valid ranking.`
        : `${target.entity} never occupies rank ${value} in any valid ranking.`,
    }));
    answer = `${answerValue}${ordinalSuffix(answerValue)}`;
    explanation.push(
      `Across all valid rankings, ${target.entity} can occupy: ${target.ranks.join(", ")}.`,
      `Therefore the required ${prototypeId === "MINIMUM_POSSIBLE_RANK" ? "minimum" : "maximum"} possible rank is ${answer}.`,
    );
  } else if (prototypeId === "DEFINITE_RANK_OR_INDETERMINATE") {
    const rankProfiles = state.entities.map((entity) => ({ entity, ranks: rankSet(state, entity) }));
    const preferDefinite = state.seed % 3 === 0;
    const candidates = rankProfiles.filter((item) => (preferDefinite ? item.ranks.length === 1 : item.ranks.length > 1));
    const target = (candidates.length > 0 ? candidates : rankProfiles)[state.seed % (candidates.length || rankProfiles.length)]!;
    const isDefinite = target.ranks.length === 1;
    const numericDistractors = numericOptions(target.ranks[0]!, 1, state.entities.length).slice(0, 3);
    options = [
      ...numericDistractors.map((value) => ({
        label: `${value}${ordinalSuffix(value)}`,
        truth: isDefinite && target.ranks[0] === value,
        explanation: target.ranks.includes(value)
          ? `${target.entity} occupies this rank in at least one valid ranking.`
          : `${target.entity} never occupies this rank.`,
      })),
      {
        label: "Cannot be determined uniquely",
        truth: !isDefinite,
        explanation: isDefinite
          ? `${target.entity} has the same rank in every valid ranking.`
          : `${target.entity} can occupy ranks ${target.ranks.join(", ")}.`,
      },
    ];
    if (isDefinite && !options.some((option) => option.truth)) {
      options[0] = {
        label: `${target.ranks[0]}${ordinalSuffix(target.ranks[0]!)}`,
        truth: true,
        explanation: `${target.entity} has this rank in every valid ranking.`,
      };
    }
    stem = `What is the rank of ${target.entity}?`;
    answer = isDefinite ? `${target.ranks[0]}${ordinalSuffix(target.ranks[0]!)}` : "Cannot be determined uniquely";
    explanation.push(
      isDefinite
        ? `${target.entity} occupies rank ${target.ranks[0]} in every valid ranking.`
        : `${target.entity} occupies different ranks across the valid rankings: ${target.ranks.join(", ")}.`,
      `Hence the answer is ${answer}.`,
    );
  } else {
    stem = "What is correct about the complete ranking?";
    options = [
      {
        label: "Exactly one complete ranking is possible.",
        truth: state.validOrders.length === 1,
        explanation: `${state.validOrders.length} complete rankings satisfy all clues.`,
      },
      {
        label: "More than one complete ranking is possible.",
        truth: state.validOrders.length > 1,
        explanation: `${state.validOrders.length} complete rankings satisfy all clues.`,
      },
      {
        label: "No complete ranking is possible.",
        truth: state.validOrders.length === 0,
        explanation: `${state.validOrders.length} complete rankings satisfy all clues.`,
      },
      {
        label: "All candidates can occupy every rank.",
        truth: state.entities.every((entity) => rankSet(state, entity).length === state.entities.length),
        explanation: `The clues restrict the possible ranks of at least one candidate.`,
      },
    ];
    answer = "More than one complete ranking is possible";
    explanation.push(
      `${state.validOrders.length} different complete rankings satisfy every displayed clue.`,
      `Therefore the information defines a valid partial order but not one unique complete ranking.`,
    );
  }

  while (options.length < 4) {
    const entity = state.entities[options.length % state.entities.length]!;
    options.push({
      label: `${entity} must always be ranked first.`,
      truth: rankSet(state, entity).length === 1 && rankSet(state, entity)[0] === 1,
      explanation: `${entity} can occupy rank(s) ${rankSet(state, entity).join(", ")}.`,
    });
  }
  if (options.length > 4) options = options.slice(0, 4);

  const rotated = rotateCorrectOption(options, desiredIndex);
  const complexity = Math.min(3, Math.ceil(Math.log2(state.validOrders.length + 1)) + (state.fixedRanks.length > 0 ? 1 : 0));
  const difficulty: RnkCp005Difficulty = complexity <= 1 ? "EASY" : complexity === 2 ? "MEDIUM" : "HARD";

  return {
    stem,
    options: rotated.options,
    correctIndex: rotated.correctIndex,
    answer,
    explanation,
    difficulty,
  };
}

export function generateRnkCp005DiscoveryQuestion(
  prototypeId: RnkCp005PrototypeId,
  seed: number,
): RnkCp005DiscoveryQuestion {
  const state = buildRnkCp005PartialOrderState(seed);
  const surface = buildQuestionSurface(prototypeId, state);
  const clueItems = [
    ...state.edges.map((edge, index) => edgeText(edge, state.context, seed + index)),
    ...state.fixedRanks.map((item) => fixedRankText(item, state.context)),
  ];
  const clues = shuffled(clueItems, seed * 97 + 7);
  const fingerprintSource = {
    version: RNK_CP005_PARTIAL_ORDER_DISCOVERY_VERSION,
    prototypeId,
    seed,
    context: state.context,
    topology: state.topology,
    entities: state.entities,
    edges: state.edges,
    fixedRanks: state.fixedRanks,
    stem: surface.stem,
    options: surface.options.map((option) => option.label),
    answer: surface.answer,
  };

  return {
    discoveryId: `RNK-CP005-${prototypeId}-S${String(seed).padStart(4, "0")}`,
    prototypeId,
    seed,
    context: state.context,
    difficulty: surface.difficulty,
    instruction: contextIntro(state.context, state.entities.length),
    clues,
    stem: surface.stem,
    options: surface.options,
    correctIndex: surface.correctIndex,
    answer: surface.answer,
    explanation: [
      `The clues allow ${state.validOrders.length} valid complete ranking(s), not an assumed single order.`,
      ...surface.explanation,
      `Example valid rankings: ${exampleOrders(state).map((order) => order.join(" > ")).join(" | ")}.`,
    ],
    validOrderCount: state.validOrders.length,
    exampleValidOrders: exampleOrders(state),
    mathematicalFingerprint: createHash("sha256")
      .update(JSON.stringify(fingerprintSource), "utf8")
      .digest("hex"),
    lifecycle: Object.freeze({
      permanentQlAllocated: false,
      questionStudio: "DISABLED",
      questionBank: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
    }),
  };
}

export function buildRnkCp005DiscoveryCorpus(
  seedsPerPrototype = 32,
): readonly RnkCp005DiscoveryQuestion[] {
  return RNK_CP005_PROTOTYPE_IDS.flatMap((prototypeId, prototypeIndex) =>
    Array.from({ length: seedsPerPrototype }, (_, seedIndex) =>
      generateRnkCp005DiscoveryQuestion(prototypeId, prototypeIndex * 10_000 + seedIndex),
    ),
  );
}
