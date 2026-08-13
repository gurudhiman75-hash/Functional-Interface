import { createHash } from "node:crypto";

import {
  buildRnkCp005PartialOrderState,
  generateRnkCp005DiscoveryQuestion,
  type RnkCp005DiscoveryQuestion,
  type RnkCp005PartialOrderState,
  type RnkCp005PrototypeId,
} from "./cp005-partial-order-runtime";

export const RNK_CP005_PARTIAL_ORDER_EDITORIAL_VERSION =
  "RNK_CP005_PARTIAL_ORDER_EDITORIAL_V1" as const;

export const RNK_CP005_EDITORIAL_CANDIDATE_IDS = [
  "DEFINITELY_TRUE_RELATION",
  "POSSIBLE_RELATION",
  "IMPOSSIBLE_RELATION",
  "PAIR_RELATION_CANNOT_BE_DETERMINED",
  "MINIMUM_POSSIBLE_RANK",
  "MAXIMUM_POSSIBLE_RANK",
  "DEFINITE_RANK_OR_INDETERMINATE",
] as const satisfies readonly RnkCp005PrototypeId[];

export const RNK_CP005_REJECTED_DISCOVERY_IDS = [
  "ORDER_UNIQUENESS_STATUS",
] as const satisfies readonly RnkCp005PrototypeId[];

export type RnkCp005EditorialCandidateId =
  (typeof RNK_CP005_EDITORIAL_CANDIDATE_IDS)[number];

interface RelationPair {
  readonly first: string;
  readonly second: string;
}

function parseAboveRelation(value: string): RelationPair | undefined {
  const match = value.match(/^(.+?) (?:is ranked above|can rank above) (.+)$/i);
  if (!match) return undefined;
  return { first: match[1]!.trim(), second: match[2]!.trim() };
}

function parseImpossibleRelation(value: string): RelationPair | undefined {
  const match = value.match(/^(.+?) cannot rank above (.+)$/i);
  if (!match) return undefined;
  return { first: match[1]!.trim(), second: match[2]!.trim() };
}

function parseTarget(stem: string): string | undefined {
  const match = stem.match(/(?:rank of|possible rank of) (.+?)\?$/i);
  return match?.[1]?.trim();
}

function shortestPath(
  state: RnkCp005PartialOrderState,
  start: string,
  end: string,
): readonly string[] | undefined {
  const adjacency = new Map<string, string[]>(
    state.entities.map((entity) => [entity, []]),
  );
  for (const edge of state.edges) adjacency.get(edge.higher)!.push(edge.lower);
  const queue: string[][] = [[start]];
  const visited = new Set<string>([start]);
  while (queue.length > 0) {
    const path = queue.shift()!;
    const current = path.at(-1)!;
    if (current === end) return path;
    for (const next of adjacency.get(current) ?? []) {
      if (visited.has(next)) continue;
      visited.add(next);
      queue.push([...path, next]);
    }
  }
  return undefined;
}

function relationFrequency(
  state: RnkCp005PartialOrderState,
  first: string,
  second: string,
): number {
  return state.validOrders.filter(
    (order) => order.indexOf(first) < order.indexOf(second),
  ).length;
}

function rankSet(
  state: RnkCp005PartialOrderState,
  entity: string,
): readonly number[] {
  return [...new Set(state.validOrders.map((order) => order.indexOf(entity) + 1))]
    .sort((a, b) => a - b);
}

function isStrongCandidate(
  question: RnkCp005DiscoveryQuestion,
  state: RnkCp005PartialOrderState,
  ordinal: number,
): boolean {
  if (question.prototypeId === "DEFINITELY_TRUE_RELATION") {
    const pair = parseAboveRelation(question.answer);
    if (!pair) return false;
    const path = shortestPath(state, pair.first, pair.second);
    return Boolean(path && path.length >= 3);
  }
  if (question.prototypeId === "IMPOSSIBLE_RELATION") {
    const pair = parseImpossibleRelation(question.answer);
    if (!pair) return false;
    const path = shortestPath(state, pair.second, pair.first);
    return Boolean(path && path.length >= 3);
  }
  if (question.prototypeId === "DEFINITE_RANK_OR_INDETERMINATE") {
    const target = parseTarget(question.stem);
    if (!target) return false;
    const isIndeterminate = /cannot be determined/i.test(question.answer);
    if (ordinal % 2 === 1) return isIndeterminate;
    if (isIndeterminate) return false;
    return !state.fixedRanks.some((item) => item.entity === target);
  }
  return true;
}

function relationLabel(label: string): string {
  return label
    .replace(/^It is definitely true that /i, "")
    .replace(/^It is possible that /i, "")
    .replace(/^It is impossible that /i, "")
    .replace(/\.$/, ".");
}

function polishedStem(question: RnkCp005DiscoveryQuestion): string {
  if (question.prototypeId === "DEFINITELY_TRUE_RELATION") {
    return "Which of the following must be true?";
  }
  if (question.prototypeId === "POSSIBLE_RELATION") {
    return "Which of the following could be true?";
  }
  if (question.prototypeId === "IMPOSSIBLE_RELATION") {
    return "Which of the following cannot be true?";
  }
  if (question.prototypeId === "MINIMUM_POSSIBLE_RANK") {
    return question.stem.replace(
      "What is the best (minimum-numbered) possible rank of",
      "What is the highest possible rank of",
    );
  }
  if (question.prototypeId === "MAXIMUM_POSSIBLE_RANK") {
    return question.stem.replace(
      "What is the lowest (maximum-numbered) possible rank of",
      "What is the lowest possible rank of",
    );
  }
  return question.stem;
}

function witnessFor(
  state: RnkCp005PartialOrderState,
  first: string,
  second: string,
  firstAbove: boolean,
): readonly string[] | undefined {
  return state.validOrders.find((order) =>
    firstAbove
      ? order.indexOf(first) < order.indexOf(second)
      : order.indexOf(second) < order.indexOf(first),
  );
}

function conciseExplanation(
  question: RnkCp005DiscoveryQuestion,
  state: RnkCp005PartialOrderState,
): readonly string[] {
  if (question.prototypeId === "DEFINITELY_TRUE_RELATION") {
    const pair = parseAboveRelation(question.answer)!;
    const path = shortestPath(state, pair.first, pair.second)!;
    return [
      `Link the comparisons: ${path.join(" > ")}.`,
      `Therefore ${pair.first} must rank above ${pair.second}, irrespective of how the unrelated names are placed.`,
    ];
  }
  if (question.prototypeId === "POSSIBLE_RELATION") {
    const pair = parseAboveRelation(question.answer)!;
    const witness = witnessFor(state, pair.first, pair.second, true)!;
    return [
      `One ranking that satisfies every statement is ${witness.join(" > ")}.`,
      `In this valid ranking, ${pair.first} is above ${pair.second}; therefore the relation could be true.`,
    ];
  }
  if (question.prototypeId === "IMPOSSIBLE_RELATION") {
    const pair = parseImpossibleRelation(question.answer)!;
    const path = shortestPath(state, pair.second, pair.first)!;
    return [
      `The statements force ${path.join(" > ")}.`,
      `Hence ${pair.first} can never be placed above ${pair.second}.`,
    ];
  }
  if (question.prototypeId === "PAIR_RELATION_CANNOT_BE_DETERMINED") {
    const match = question.stem.match(/relative ranks of (.+?) and (.+?)\?/i)!;
    const first = match[1]!.trim();
    const second = match[2]!.trim();
    const firstWitness = witnessFor(state, first, second, true)!;
    const secondWitness = witnessFor(state, first, second, false)!;
    return [
      `${firstWitness.join(" > ")} satisfies all statements and places ${first} above ${second}.`,
      `${secondWitness.join(" > ")} also satisfies all statements but places ${second} above ${first}.`,
      `Since both orders are possible, their relative ranks cannot be determined uniquely.`,
    ];
  }
  const target = parseTarget(question.stem)!;
  const ranks = rankSet(state, target);
  if (question.prototypeId === "MINIMUM_POSSIBLE_RANK") {
    const best = ranks[0]!;
    const witness = state.validOrders.find((order) => order.indexOf(target) + 1 === best)!;
    return [
      `${target} cannot move above the people who are necessarily ahead of ${target}.`,
      `The valid ranking ${witness.join(" > ")} places ${target} at rank ${best}, so this highest possible rank is attainable.`,
    ];
  }
  if (question.prototypeId === "MAXIMUM_POSSIBLE_RANK") {
    const lowest = ranks.at(-1)!;
    const witness = state.validOrders.find((order) => order.indexOf(target) + 1 === lowest)!;
    return [
      `${target} cannot be placed below the people who are necessarily behind ${target}.`,
      `The valid ranking ${witness.join(" > ")} places ${target} at rank ${lowest}, so this lowest possible rank is attainable.`,
    ];
  }
  if (ranks.length === 1) {
    const examples = state.validOrders.slice(0, 2).map((order) => order.join(" > "));
    return [
      `Although the complete ranking is not unique, ${target} occupies rank ${ranks[0]} in every valid order.`,
      `For example: ${examples.join(" | ")}.`,
    ];
  }
  const firstOrder = state.validOrders.find(
    (order) => order.indexOf(target) + 1 === ranks[0],
  )!;
  const lastOrder = state.validOrders.find(
    (order) => order.indexOf(target) + 1 === ranks.at(-1),
  )!;
  return [
    `${firstOrder.join(" > ")} places ${target} at rank ${ranks[0]}.`,
    `${lastOrder.join(" > ")} places ${target} at rank ${ranks.at(-1)}.`,
    `Both satisfy all statements, so ${target}'s exact rank cannot be determined uniquely.`,
  ];
}

function polishedOptionExplanation(
  question: RnkCp005DiscoveryQuestion,
  state: RnkCp005PartialOrderState,
  label: string,
  fallback: string,
): string {
  if (
    question.prototypeId === "DEFINITELY_TRUE_RELATION" ||
    question.prototypeId === "POSSIBLE_RELATION" ||
    question.prototypeId === "IMPOSSIBLE_RELATION"
  ) {
    const pairMatch = label.match(/^(.+?) ranks above (.+?)\.?$/i);
    if (!pairMatch) return fallback;
    const first = pairMatch[1]!.trim();
    const second = pairMatch[2]!.replace(/\.$/, "").trim();
    const frequency = relationFrequency(state, first, second);
    if (frequency === state.validOrders.length) return "This relation holds in every valid ranking.";
    if (frequency === 0) return "This relation cannot occur in any valid ranking.";
    return "This relation occurs in some valid rankings but not in all of them.";
  }
  return fallback;
}

function editorialDifficulty(
  question: RnkCp005DiscoveryQuestion,
  state: RnkCp005PartialOrderState,
): RnkCp005DiscoveryQuestion["difficulty"] {
  if (
    question.prototypeId === "DEFINITELY_TRUE_RELATION" ||
    question.prototypeId === "IMPOSSIBLE_RELATION"
  ) {
    const pair = question.prototypeId === "DEFINITELY_TRUE_RELATION"
      ? parseAboveRelation(question.answer)!
      : parseImpossibleRelation(question.answer)!;
    const path = question.prototypeId === "DEFINITELY_TRUE_RELATION"
      ? shortestPath(state, pair.first, pair.second)!
      : shortestPath(state, pair.second, pair.first)!;
    return path.length <= 3 && state.entities.length <= 6 ? "MEDIUM" : "HARD";
  }
  if (state.entities.length <= 5 && state.edges.length <= 5) return "MEDIUM";
  return "HARD";
}

function moveCorrectOption(
  question: RnkCp005DiscoveryQuestion,
  desiredIndex: number,
): Pick<RnkCp005DiscoveryQuestion, "options" | "correctIndex"> {
  const options = [...question.options];
  const currentIndex = options.findIndex((option) => option.truth);
  const [correct] = options.splice(currentIndex, 1);
  options.splice(desiredIndex, 0, correct!);
  return { options, correctIndex: desiredIndex };
}

export function generateRnkCp005EditorialCandidate(
  prototypeId: RnkCp005EditorialCandidateId,
  ordinal: number,
): RnkCp005DiscoveryQuestion {
  const prototypeIndex = RNK_CP005_EDITORIAL_CANDIDATE_IDS.indexOf(prototypeId);
  const startSeed = prototypeIndex * 100_000 + ordinal * 100;
  let selected: RnkCp005DiscoveryQuestion | undefined;
  let state: RnkCp005PartialOrderState | undefined;

  for (let offset = 0; offset < 100; offset += 1) {
    const seed = startSeed + offset;
    const candidate = generateRnkCp005DiscoveryQuestion(prototypeId, seed);
    const candidateState = buildRnkCp005PartialOrderState(seed);
    if (!isStrongCandidate(candidate, candidateState, ordinal)) continue;
    selected = candidate;
    state = candidateState;
    break;
  }
  if (!selected || !state) {
    throw new Error(`${prototypeId}:${ordinal}: no strong editorial candidate found`);
  }

  const stem = polishedStem(selected);
  const labels = selected.options.map((option) => relationLabel(option.label));
  const optionsWithLabels = selected.options.map((option, index) => ({
    ...option,
    label: labels[index]!,
    explanation: polishedOptionExplanation(
      selected!,
      state!,
      labels[index]!,
      option.explanation,
    ),
  }));
  const positioned = moveCorrectOption(
    { ...selected, options: optionsWithLabels },
    ordinal % 4,
  );
  const explanation = conciseExplanation(selected, state);
  const mathematicalFingerprint = createHash("sha256")
    .update(
      JSON.stringify({
        base: selected.mathematicalFingerprint,
        editorialVersion: RNK_CP005_PARTIAL_ORDER_EDITORIAL_VERSION,
        stem,
        options: positioned.options.map((option) => option.label),
        explanation,
      }),
      "utf8",
    )
    .digest("hex");

  return {
    ...selected,
    difficulty: editorialDifficulty(selected, state),
    stem,
    options: positioned.options,
    correctIndex: positioned.correctIndex,
    explanation,
    mathematicalFingerprint,
  };
}

export function buildRnkCp005EditorialCorpus(
  questionsPerPrototype = 24,
): readonly RnkCp005DiscoveryQuestion[] {
  return RNK_CP005_EDITORIAL_CANDIDATE_IDS.flatMap((prototypeId) =>
    Array.from({ length: questionsPerPrototype }, (_, ordinal) =>
      generateRnkCp005EditorialCandidate(prototypeId, ordinal),
    ),
  );
}
