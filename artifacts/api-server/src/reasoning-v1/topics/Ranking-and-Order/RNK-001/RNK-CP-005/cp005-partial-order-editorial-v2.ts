import { createHash } from "node:crypto";

import {
  buildRnkCp005PartialOrderState,
  enumerateRnkCp005ValidOrders,
  generateRnkCp005DiscoveryQuestion,
  type RnkCp005Difficulty,
  type RnkCp005DiscoveryQuestion,
  type RnkCp005Option,
  type RnkCp005PartialOrderState,
  type RnkCp005PrototypeId,
} from "./cp005-partial-order-runtime";

export const RNK_CP005_PARTIAL_ORDER_EDITORIAL_V2_VERSION =
  "RNK_CP005_PARTIAL_ORDER_EDITORIAL_V2" as const;

export const RNK_CP005_EDITORIAL_V2_SOURCE_FORMS = [
  "DEFINITELY_TRUE_RELATION",
  "POSSIBLE_RELATION",
  "IMPOSSIBLE_RELATION",
  "PAIR_RELATION_CANNOT_BE_DETERMINED",
  "MINIMUM_POSSIBLE_RANK",
  "MAXIMUM_POSSIBLE_RANK",
  "DEFINITE_RANK_OR_INDETERMINATE",
] as const satisfies readonly RnkCp005PrototypeId[];

export const RNK_CP005_EDITORIAL_V2_REJECTED_SOURCE_FORMS = [
  "ORDER_UNIQUENESS_STATUS",
] as const satisfies readonly RnkCp005PrototypeId[];

export const RNK_CP005_AUTHORITY_CANDIDATE_IDS = [
  "RELATION_TRUTH_STATUS",
  "RELATIVE_RANK_DETERMINACY",
  "POSSIBLE_RANK_BOUND",
  "EXACT_RANK_DETERMINACY",
] as const;

export type RnkCp005EditorialV2SourceForm =
  (typeof RNK_CP005_EDITORIAL_V2_SOURCE_FORMS)[number];
export type RnkCp005AuthorityCandidateId =
  (typeof RNK_CP005_AUTHORITY_CANDIDATE_IDS)[number];

export interface RnkCp005EditorialV2Question extends RnkCp005DiscoveryQuestion {
  readonly authorityCandidateId: RnkCp005AuthorityCandidateId;
}

type RelationClass = "DEFINITE" | "VARIABLE" | "IMPOSSIBLE";
type RelationQuery = "MUST" | "COULD" | "CANNOT";

interface OrderedRelation {
  readonly first: string;
  readonly second: string;
  readonly frequency: number;
  readonly classification: RelationClass;
}

function ordinalSuffix(value: number): string {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return "th";
  if (value % 10 === 1) return "st";
  if (value % 10 === 2) return "nd";
  if (value % 10 === 3) return "rd";
  return "th";
}

function formatNames(names: readonly string[]): string {
  if (names.length === 0) return "no one";
  if (names.length === 1) return names[0]!;
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names.at(-1)}`;
}

function rotate<T>(items: readonly T[], amount: number): readonly T[] {
  if (items.length === 0) return [];
  const shift = ((amount % items.length) + items.length) % items.length;
  return [...items.slice(shift), ...items.slice(0, shift)];
}

function relationFrequency(
  orders: readonly (readonly string[])[],
  first: string,
  second: string,
): number {
  return orders.filter((order) => order.indexOf(first) < order.indexOf(second)).length;
}

function relationClass(
  orders: readonly (readonly string[])[],
  first: string,
  second: string,
): RelationClass {
  const frequency = relationFrequency(orders, first, second);
  if (frequency === 0) return "IMPOSSIBLE";
  if (frequency === orders.length) return "DEFINITE";
  return "VARIABLE";
}

function orderedRelations(state: RnkCp005PartialOrderState): readonly OrderedRelation[] {
  const output: OrderedRelation[] = [];
  for (const first of state.entities) {
    for (const second of state.entities) {
      if (first === second) continue;
      const frequency = relationFrequency(state.validOrders, first, second);
      output.push({
        first,
        second,
        frequency,
        classification:
          frequency === 0
            ? "IMPOSSIBLE"
            : frequency === state.validOrders.length
              ? "DEFINITE"
              : "VARIABLE",
      });
    }
  }
  return output;
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

function rankSet(
  state: RnkCp005PartialOrderState,
  entity: string,
): readonly number[] {
  return [...new Set(state.validOrders.map((order) => order.indexOf(entity) + 1))]
    .sort((a, b) => a - b);
}

function mandatoryAbove(
  state: RnkCp005PartialOrderState,
  entity: string,
): readonly string[] {
  return state.entities.filter(
    (other) =>
      other !== entity &&
      relationClass(state.validOrders, other, entity) === "DEFINITE",
  );
}

function mandatoryBelow(
  state: RnkCp005PartialOrderState,
  entity: string,
): readonly string[] {
  return state.entities.filter(
    (other) =>
      other !== entity &&
      relationClass(state.validOrders, entity, other) === "DEFINITE",
  );
}

function fixedOnlyClass(
  state: RnkCp005PartialOrderState,
  first: string,
  second: string,
): RelationClass {
  const fixedOnlyOrders = enumerateRnkCp005ValidOrders(
    state.entities,
    [],
    state.fixedRanks,
  );
  return relationClass(fixedOnlyOrders, first, second);
}

function witness(
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

function directEdge(
  state: RnkCp005PartialOrderState,
  first: string,
  second: string,
): boolean {
  return state.edges.some(
    (edge) => edge.higher === first && edge.lower === second,
  );
}

function relationMatchesQuery(
  relation: OrderedRelation,
  query: RelationQuery,
): boolean {
  if (query === "MUST") return relation.classification === "DEFINITE";
  if (query === "COULD") return relation.classification !== "IMPOSSIBLE";
  return relation.classification === "IMPOSSIBLE";
}

function relationOptionSetIsBalanced(
  relations: readonly OrderedRelation[],
): boolean {
  if (relations.length !== 4) return false;
  const orderedPairs = new Set(relations.map((item) => `${item.first}>${item.second}`));
  const unorderedPairs = new Set(
    relations.map((item) => [item.first, item.second].sort().join("|")),
  );
  const people = relations.flatMap((item) => [item.first, item.second]);
  const frequency = new Map<string, number>();
  for (const person of people) frequency.set(person, (frequency.get(person) ?? 0) + 1);
  return (
    orderedPairs.size === 4 &&
    unorderedPairs.size === 4 &&
    frequency.size >= 4 &&
    [...frequency.values()].every((count) => count <= 2)
  );
}

function chooseBalancedRelationOptions(
  correct: OrderedRelation,
  distractors: readonly OrderedRelation[],
  seed: number,
): readonly OrderedRelation[] | undefined {
  const pool = rotate(
    distractors.filter(
      (item) => !(item.first === correct.first && item.second === correct.second),
    ),
    seed,
  );
  const selected: OrderedRelation[] = [correct];

  const visit = (start: number): boolean => {
    if (selected.length === 4) return relationOptionSetIsBalanced(selected);
    for (let index = start; index < pool.length; index += 1) {
      const candidate = pool[index]!;
      const provisional = [...selected, candidate];
      const people = provisional.flatMap((item) => [item.first, item.second]);
      const counts = new Map<string, number>();
      for (const person of people) counts.set(person, (counts.get(person) ?? 0) + 1);
      if ([...counts.values()].some((count) => count > 2)) continue;
      selected.push(candidate);
      if (visit(index + 1)) return true;
      selected.pop();
    }
    return false;
  };

  return visit(0) ? selected : undefined;
}

function moveCorrectOption(
  options: readonly RnkCp005Option[],
  desiredIndex: number,
): { readonly options: readonly RnkCp005Option[]; readonly correctIndex: number } {
  const output = [...options];
  const currentIndex = output.findIndex((option) => option.truth);
  if (currentIndex < 0 || output.filter((option) => option.truth).length !== 1) {
    throw new Error("Expected exactly one correct option");
  }
  const [correct] = output.splice(currentIndex, 1);
  output.splice(desiredIndex, 0, correct!);
  return { options: output, correctIndex: desiredIndex };
}

function relationOptionExplanation(
  state: RnkCp005PartialOrderState,
  relation: OrderedRelation,
  query: RelationQuery,
): string {
  if (query === "MUST") {
    if (relation.classification === "DEFINITE") {
      const path = shortestPath(state, relation.first, relation.second);
      return path
        ? `${path.join(" > ")} forces this relation.`
        : "This relation holds in every valid ranking.";
    }
    if (relation.classification === "VARIABLE") {
      const counterexample = witness(state, relation.first, relation.second, false)!;
      return `${counterexample.join(" > ")} is a valid counterexample, so the relation is not compulsory.`;
    }
    const path = shortestPath(state, relation.second, relation.first);
    return path
      ? `${path.join(" > ")} forces the opposite relation.`
      : "This relation cannot occur.";
  }

  if (query === "COULD") {
    if (relation.classification !== "IMPOSSIBLE") {
      const example = witness(state, relation.first, relation.second, true)!;
      return `${example.join(" > ")} is one valid ranking in which this relation holds.`;
    }
    const path = shortestPath(state, relation.second, relation.first);
    return path
      ? `${path.join(" > ")} forces the opposite relation.`
      : "No valid ranking permits this relation.";
  }

  if (relation.classification === "IMPOSSIBLE") {
    const path = shortestPath(state, relation.second, relation.first);
    return path
      ? `${path.join(" > ")} makes this relation impossible.`
      : "No valid ranking permits this relation.";
  }
  const example = witness(state, relation.first, relation.second, true)!;
  return `${example.join(" > ")} is a valid ranking in which this relation occurs.`;
}

function relationDifficulty(
  state: RnkCp005PartialOrderState,
  relation: OrderedRelation,
  query: RelationQuery,
): RnkCp005Difficulty {
  if (query === "MUST") {
    const path = shortestPath(state, relation.first, relation.second)!;
    return path.length >= 5 || state.entities.length === 7 ? "HARD" : "MEDIUM";
  }
  if (query === "CANNOT") {
    const path = shortestPath(state, relation.second, relation.first)!;
    return path.length >= 5 || state.entities.length === 7 ? "HARD" : "MEDIUM";
  }
  return state.entities.length <= 5 && state.edges.length <= 4 ? "EASY" : state.entities.length === 7 ? "HARD" : "MEDIUM";
}

function buildRelationTruthQuestion(
  prototypeId: Extract<
    RnkCp005EditorialV2SourceForm,
    "DEFINITELY_TRUE_RELATION" | "POSSIBLE_RELATION" | "IMPOSSIBLE_RELATION"
  >,
  state: RnkCp005PartialOrderState,
  ordinal: number,
): Pick<
  RnkCp005EditorialV2Question,
  "authorityCandidateId" | "stem" | "options" | "correctIndex" | "answer" | "explanation" | "difficulty"
> | undefined {
  const query: RelationQuery =
    prototypeId === "DEFINITELY_TRUE_RELATION"
      ? "MUST"
      : prototypeId === "POSSIBLE_RELATION"
        ? "COULD"
        : "CANNOT";
  const relations = orderedRelations(state);
  const correctCandidates = relations.filter((relation) => {
    if (!relationMatchesQuery(relation, query)) return false;
    if (query === "MUST") {
      const path = shortestPath(state, relation.first, relation.second);
      return Boolean(
        path &&
        path.length >= 3 &&
        !directEdge(state, relation.first, relation.second) &&
        fixedOnlyClass(state, relation.first, relation.second) !== "DEFINITE"
      );
    }
    if (query === "COULD") {
      return relation.classification === "VARIABLE";
    }
    const reversePath = shortestPath(state, relation.second, relation.first);
    return Boolean(
      reversePath &&
      reversePath.length >= 3 &&
      !directEdge(state, relation.second, relation.first) &&
      fixedOnlyClass(state, relation.first, relation.second) !== "IMPOSSIBLE"
    );
  });

  for (const correct of rotate(correctCandidates, state.seed + ordinal)) {
    const distractors = relations.filter(
      (relation) => !relationMatchesQuery(relation, query),
    );
    const selected = chooseBalancedRelationOptions(
      correct,
      distractors,
      state.seed + ordinal * 17,
    );
    if (!selected) continue;
    const options = selected.map((relation) => ({
      label: `${relation.first} ranks above ${relation.second}.`,
      truth: relation.first === correct.first && relation.second === correct.second,
      explanation: relationOptionExplanation(state, relation, query),
    }));
    const positioned = moveCorrectOption(options, ordinal % 4);
    const path =
      query === "MUST"
        ? shortestPath(state, correct.first, correct.second)
        : query === "CANNOT"
          ? shortestPath(state, correct.second, correct.first)
          : undefined;
    const possibleWitness =
      query === "COULD"
        ? witness(state, correct.first, correct.second, true)
        : undefined;
    const stem =
      query === "MUST"
        ? "Which of the following must be true?"
        : query === "COULD"
          ? "Which of the following could be true?"
          : "Which of the following cannot be true?";
    const explanation =
      query === "MUST"
        ? [
            `Link the comparisons: ${path!.join(" > ")}.`,
            `Therefore ${correct.first} must rank above ${correct.second}.`,
          ]
        : query === "COULD"
          ? [
              `${possibleWitness!.join(" > ")} satisfies every statement.`,
              `This valid ranking places ${correct.first} above ${correct.second}, so the relation could be true.`,
            ]
          : [
              `The statements force ${path!.join(" > ")}.`,
              `Therefore ${correct.first} can never rank above ${correct.second}.`,
            ];
    return {
      authorityCandidateId: "RELATION_TRUTH_STATUS",
      stem,
      options: positioned.options,
      correctIndex: positioned.correctIndex,
      answer: `${correct.first} ranks above ${correct.second}`,
      explanation,
      difficulty: relationDifficulty(state, correct, query),
    };
  }
  return undefined;
}

function pairDistanceSet(
  state: RnkCp005PartialOrderState,
  first: string,
  second: string,
): readonly number[] {
  return [...new Set(
    state.validOrders.map((order) =>
      Math.abs(order.indexOf(first) - order.indexOf(second)),
    ),
  )].sort((a, b) => a - b);
}

function buildPairDeterminacyQuestion(
  state: RnkCp005PartialOrderState,
  ordinal: number,
): Pick<
  RnkCp005EditorialV2Question,
  "authorityCandidateId" | "stem" | "options" | "correctIndex" | "answer" | "explanation" | "difficulty"
> | undefined {
  const variablePairs: { first: string; second: string }[] = [];
  for (let index = 0; index < state.entities.length; index += 1) {
    for (let other = index + 1; other < state.entities.length; other += 1) {
      const first = state.entities[index]!;
      const second = state.entities[other]!;
      if (relationClass(state.validOrders, first, second) === "VARIABLE") {
        variablePairs.push({ first, second });
      }
    }
  }
  const pair = rotate(variablePairs, state.seed + ordinal)[0];
  if (!pair) return undefined;
  const firstWitness = witness(state, pair.first, pair.second, true)!;
  const secondWitness = witness(state, pair.first, pair.second, false)!;
  const distances = pairDistanceSet(state, pair.first, pair.second);
  const distanceClaim = ordinal % 2 === 0
    ? {
        label: `${pair.first} and ${pair.second} must be consecutive in the ranking.`,
        truth: distances.length === 1 && distances[0] === 1,
        explanation: `A valid ranking places ${distances[0] === 1 ? "a different" : distances[0]} rank gap between them, so consecutiveness is not forced.`,
      }
    : {
        label: `Exactly one person must rank between ${pair.first} and ${pair.second}.`,
        truth: distances.length === 1 && distances[0] === 2,
        explanation: `Their separation is not fixed at exactly one intervening person.`,
      };
  if (distanceClaim.truth) return undefined;
  const options: RnkCp005Option[] = [
    {
      label: `${pair.first} must rank above ${pair.second}.`,
      truth: false,
      explanation: `${secondWitness.join(" > ")} is a valid ranking with ${pair.second} above ${pair.first}.`,
    },
    {
      label: `${pair.second} must rank above ${pair.first}.`,
      truth: false,
      explanation: `${firstWitness.join(" > ")} is a valid ranking with ${pair.first} above ${pair.second}.`,
    },
    {
      label: "Their relative ranks cannot be determined uniquely.",
      truth: true,
      explanation: "Both relative orders occur in valid rankings.",
    },
    distanceClaim,
  ];
  const positioned = moveCorrectOption(options, ordinal % 4);
  return {
    authorityCandidateId: "RELATIVE_RANK_DETERMINACY",
    stem: `What can be concluded about the relative ranks of ${pair.first} and ${pair.second}?`,
    options: positioned.options,
    correctIndex: positioned.correctIndex,
    answer: "Their relative ranks cannot be determined uniquely",
    explanation: [
      `${firstWitness.join(" > ")} satisfies every statement and places ${pair.first} above ${pair.second}.`,
      `${secondWitness.join(" > ")} also satisfies every statement but places ${pair.second} above ${pair.first}.`,
      "Since both orders are possible, their relative ranks cannot be determined uniquely.",
    ],
    difficulty:
      state.entities.length <= 5 && state.edges.length <= 4
        ? "EASY"
        : state.entities.length === 7
          ? "HARD"
          : "MEDIUM",
  };
}

function numericOptions(answer: number, minimum: number, maximum: number): readonly number[] {
  const values = [answer];
  for (let delta = 1; values.length < 4; delta += 1) {
    for (const candidate of [answer - delta, answer + delta]) {
      if (
        candidate >= minimum &&
        candidate <= maximum &&
        !values.includes(candidate)
      ) {
        values.push(candidate);
      }
      if (values.length === 4) break;
    }
  }
  return values;
}

function boundDifficulty(
  state: RnkCp005PartialOrderState,
  compulsoryCount: number,
): RnkCp005Difficulty {
  if (compulsoryCount === 2 && state.entities.length <= 5) return "EASY";
  if (compulsoryCount >= 4 || state.entities.length === 7) return "HARD";
  return "MEDIUM";
}

function buildRankBoundQuestion(
  prototypeId: Extract<
    RnkCp005EditorialV2SourceForm,
    "MINIMUM_POSSIBLE_RANK" | "MAXIMUM_POSSIBLE_RANK"
  >,
  state: RnkCp005PartialOrderState,
  ordinal: number,
): Pick<
  RnkCp005EditorialV2Question,
  "authorityCandidateId" | "stem" | "options" | "correctIndex" | "answer" | "explanation" | "difficulty"
> | undefined {
  const highest = prototypeId === "MINIMUM_POSSIBLE_RANK";
  const targets = state.entities
    .filter((entity) => !state.fixedRanks.some((item) => item.entity === entity))
    .map((entity) => ({
      entity,
      ranks: rankSet(state, entity),
      above: mandatoryAbove(state, entity),
      below: mandatoryBelow(state, entity),
    }))
    .filter((item) => {
      if (item.ranks.length < 2) return false;
      if (highest) {
        return (
          item.above.length >= 2 &&
          item.ranks[0] === item.above.length + 1
        );
      }
      return (
        item.below.length >= 2 &&
        item.ranks.at(-1) === state.entities.length - item.below.length
      );
    });
  const target = rotate(targets, state.seed + ordinal)[0];
  if (!target) return undefined;
  const answerValue = highest ? target.ranks[0]! : target.ranks.at(-1)!;
  const witnessOrder = state.validOrders.find(
    (order) => order.indexOf(target.entity) + 1 === answerValue,
  )!;
  const values = numericOptions(answerValue, 1, state.entities.length);
  const options = values.map((value) => ({
    label: `${value}${ordinalSuffix(value)}`,
    truth: value === answerValue,
    explanation:
      value === answerValue
        ? `This is the required boundary rank and it is attainable.`
        : target.ranks.includes(value)
          ? `${target.entity} can occupy this rank, but it is not the ${highest ? "highest" : "lowest"} possible rank.`
          : `${target.entity} cannot occupy this rank in any valid order.`,
  }));
  const positioned = moveCorrectOption(options, ordinal % 4);
  const compulsory = highest ? target.above : target.below;
  const proof = highest
    ? `${formatNames(compulsory)} must all rank above ${target.entity}. Therefore at least ${compulsory.length} people must precede ${target.entity}, so ${target.entity} cannot rank higher than ${answerValue}${ordinalSuffix(answerValue)}.`
    : `${formatNames(compulsory)} must all rank below ${target.entity}. Therefore at least ${compulsory.length} people must follow ${target.entity}, so ${target.entity} cannot rank lower than ${answerValue}${ordinalSuffix(answerValue)}.`;
  return {
    authorityCandidateId: "POSSIBLE_RANK_BOUND",
    stem: `What is the ${highest ? "highest" : "lowest"} possible rank of ${target.entity}?`,
    options: positioned.options,
    correctIndex: positioned.correctIndex,
    answer: `${answerValue}${ordinalSuffix(answerValue)}`,
    explanation: [
      proof,
      `${witnessOrder.join(" > ")} is a valid ranking with ${target.entity} at rank ${answerValue}. Therefore the boundary is attainable.`,
    ],
    difficulty: boundDifficulty(state, compulsory.length),
  };
}

function buildExactRankQuestion(
  state: RnkCp005PartialOrderState,
  ordinal: number,
): Pick<
  RnkCp005EditorialV2Question,
  "authorityCandidateId" | "stem" | "options" | "correctIndex" | "answer" | "explanation" | "difficulty"
> | undefined {
  const wantIndeterminate = ordinal % 2 === 1;
  const profiles = state.entities
    .filter((entity) => !state.fixedRanks.some((item) => item.entity === entity))
    .map((entity) => ({
      entity,
      ranks: rankSet(state, entity),
      above: mandatoryAbove(state, entity),
      below: mandatoryBelow(state, entity),
    }));
  const candidates = profiles.filter((item) => {
    if (wantIndeterminate) return item.ranks.length >= 2;
    return (
      item.ranks.length === 1 &&
      item.above.length >= 2 &&
      item.below.length >= 2 &&
      item.above.length + item.below.length === state.entities.length - 1
    );
  });
  const target = rotate(candidates, state.seed + ordinal)[0];
  if (!target) return undefined;
  const isDefinite = target.ranks.length === 1;
  const answerValue = target.ranks[0]!;
  const numericValues = numericOptions(answerValue, 1, state.entities.length).slice(0, 3);
  const options: RnkCp005Option[] = [
    ...numericValues.map((value) => ({
      label: `${value}${ordinalSuffix(value)}`,
      truth: isDefinite && value === answerValue,
      explanation: isDefinite
        ? value === answerValue
          ? `${target.entity} has this rank in every valid order.`
          : `${target.entity} never has this rank.`
        : target.ranks.includes(value)
          ? `${target.entity} can have this rank, but another valid order gives a different rank.`
          : `${target.entity} never has this rank.`,
    })),
    {
      label: "Cannot be determined uniquely",
      truth: !isDefinite,
      explanation: isDefinite
        ? `${target.entity}'s exact rank is fixed.`
        : `${target.entity} has different ranks in different valid orders.`,
    },
  ];
  const positioned = moveCorrectOption(options, ordinal % 4);
  let explanation: readonly string[];
  let difficulty: RnkCp005Difficulty;
  if (isDefinite) {
    explanation = [
      `${formatNames(target.above)} must rank above ${target.entity}, while ${formatNames(target.below)} must rank below ${target.entity}.`,
      `These account for all other ${state.entities.length - 1} people, so ${target.entity} must be ranked ${answerValue}${ordinalSuffix(answerValue)}.`,
    ];
    difficulty = state.entities.length === 7 ? "HARD" : "MEDIUM";
  } else {
    const firstRank = target.ranks[0]!;
    const lastRank = target.ranks.at(-1)!;
    const firstOrder = state.validOrders.find(
      (order) => order.indexOf(target.entity) + 1 === firstRank,
    )!;
    const lastOrder = state.validOrders.find(
      (order) => order.indexOf(target.entity) + 1 === lastRank,
    )!;
    explanation = [
      `${firstOrder.join(" > ")} places ${target.entity} at rank ${firstRank}.`,
      `${lastOrder.join(" > ")} also satisfies every statement but places ${target.entity} at rank ${lastRank}.`,
      `Therefore ${target.entity}'s exact rank cannot be determined uniquely.`,
    ];
    difficulty =
      state.entities.length <= 5 && target.ranks.length === 2
        ? "EASY"
        : state.entities.length === 7 || target.ranks.length >= 4
          ? "HARD"
          : "MEDIUM";
  }
  return {
    authorityCandidateId: "EXACT_RANK_DETERMINACY",
    stem: `What is the rank of ${target.entity}?`,
    options: positioned.options,
    correctIndex: positioned.correctIndex,
    answer: isDefinite
      ? `${answerValue}${ordinalSuffix(answerValue)}`
      : "Cannot be determined uniquely",
    explanation,
    difficulty,
  };
}

function genericInstruction(state: RnkCp005PartialOrderState): string {
  return `${state.entities.length} people are ranked from highest rank to lowest rank.`;
}

function genericClues(state: RnkCp005PartialOrderState): readonly string[] {
  return [
    ...state.edges.map(
      (edge) => `${edge.higher} is ranked above ${edge.lower}.`,
    ),
    ...state.fixedRanks.map(
      (item) => `${item.entity} is ranked ${item.rank}${ordinalSuffix(item.rank)}.`,
    ),
  ];
}

function buildQuestionForState(
  prototypeId: RnkCp005EditorialV2SourceForm,
  state: RnkCp005PartialOrderState,
  ordinal: number,
) {
  if (
    prototypeId === "DEFINITELY_TRUE_RELATION" ||
    prototypeId === "POSSIBLE_RELATION" ||
    prototypeId === "IMPOSSIBLE_RELATION"
  ) {
    return buildRelationTruthQuestion(prototypeId, state, ordinal);
  }
  if (prototypeId === "PAIR_RELATION_CANNOT_BE_DETERMINED") {
    return buildPairDeterminacyQuestion(state, ordinal);
  }
  if (
    prototypeId === "MINIMUM_POSSIBLE_RANK" ||
    prototypeId === "MAXIMUM_POSSIBLE_RANK"
  ) {
    return buildRankBoundQuestion(prototypeId, state, ordinal);
  }
  return buildExactRankQuestion(state, ordinal);
}

export function generateRnkCp005EditorialV2Question(
  prototypeId: RnkCp005EditorialV2SourceForm,
  ordinal: number,
): RnkCp005EditorialV2Question {
  const prototypeIndex = RNK_CP005_EDITORIAL_V2_SOURCE_FORMS.indexOf(prototypeId);
  const startSeed = prototypeIndex * 1_000_000 + ordinal * 10_000;
  for (let offset = 0; offset < 10_000; offset += 1) {
    const seed = startSeed + offset;
    const state = buildRnkCp005PartialOrderState(seed);
    const built = buildQuestionForState(prototypeId, state, ordinal);
    if (!built) continue;
    const base = generateRnkCp005DiscoveryQuestion(prototypeId, seed);
    const fingerprint = createHash("sha256")
      .update(
        JSON.stringify({
          version: RNK_CP005_PARTIAL_ORDER_EDITORIAL_V2_VERSION,
          prototypeId,
          authorityCandidateId: built.authorityCandidateId,
          seed,
          stem: built.stem,
          options: built.options.map((option) => option.label),
          answer: built.answer,
          explanation: built.explanation,
        }),
        "utf8",
      )
      .digest("hex");
    return {
      ...base,
      authorityCandidateId: built.authorityCandidateId,
      difficulty: built.difficulty,
      instruction: genericInstruction(state),
      clues: genericClues(state),
      stem: built.stem,
      options: built.options,
      correctIndex: built.correctIndex,
      answer: built.answer,
      explanation: built.explanation,
      mathematicalFingerprint: fingerprint,
    };
  }
  throw new Error(`${prototypeId}:${ordinal}: no V2 editorial candidate found`);
}

export function buildRnkCp005EditorialV2Corpus(
  questionsPerSourceForm = 24,
): readonly RnkCp005EditorialV2Question[] {
  return RNK_CP005_EDITORIAL_V2_SOURCE_FORMS.flatMap((prototypeId) =>
    Array.from({ length: questionsPerSourceForm }, (_, ordinal) =>
      generateRnkCp005EditorialV2Question(prototypeId, ordinal),
    ),
  );
}
