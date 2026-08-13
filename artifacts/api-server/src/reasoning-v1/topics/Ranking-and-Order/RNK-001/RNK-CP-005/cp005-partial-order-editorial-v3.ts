import { createHash } from "node:crypto";

import {
  buildRnkCp005PartialOrderState,
  enumerateRnkCp005ValidOrders,
  generateRnkCp005DiscoveryQuestion,
  type RnkCp005Context,
  type RnkCp005Difficulty,
  type RnkCp005DiscoveryQuestion,
  type RnkCp005Edge,
  type RnkCp005Option,
  type RnkCp005PrototypeId,
} from "./cp005-partial-order-runtime";

export const RNK_CP005_PARTIAL_ORDER_EDITORIAL_V3_VERSION =
  "RNK_CP005_PARTIAL_ORDER_EDITORIAL_V3" as const;

export const RNK_CP005_EDITORIAL_V3_SOURCE_FORMS = [
  "DEFINITELY_TRUE_RELATION",
  "POSSIBLE_RELATION",
  "IMPOSSIBLE_RELATION",
  "PAIR_RELATION_CANNOT_BE_DETERMINED",
  "MINIMUM_POSSIBLE_RANK",
  "MAXIMUM_POSSIBLE_RANK",
  "DEFINITE_RANK_OR_INDETERMINATE",
] as const satisfies readonly RnkCp005PrototypeId[];

export const RNK_CP005_EDITORIAL_V3_REJECTED_SOURCE_FORMS = [
  "ORDER_UNIQUENESS_STATUS",
] as const satisfies readonly RnkCp005PrototypeId[];

export const RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS = [
  "RELATION_TRUTH_STATUS",
  "POSSIBLE_RANK_BOUND",
  "EXACT_RANK_DETERMINACY",
] as const;

export const RNK_CP005_V3_TOPOLOGIES = [
  "DIAMOND_TAIL",
  "TWO_CHAINS_BRIDGE",
  "ASYMMETRIC_FORK",
  "STAGGERED_MERGE",
  "CHAIN_PLUS_BRANCH",
  "DOUBLE_FORK",
  "WIDE_MERGE",
  "CROSS_LINKED",
] as const;

export type RnkCp005EditorialV3SourceForm =
  (typeof RNK_CP005_EDITORIAL_V3_SOURCE_FORMS)[number];
export type RnkCp005V3AuthorityCandidateId =
  (typeof RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS)[number];
export type RnkCp005V3Topology =
  (typeof RNK_CP005_V3_TOPOLOGIES)[number];
export type RnkCp005PairStatusMode =
  | "FIRST_ABOVE"
  | "SECOND_ABOVE"
  | "INDETERMINATE";

type RelationClass = "DEFINITE" | "VARIABLE" | "IMPOSSIBLE";
type RelationQuery = "MUST" | "COULD" | "CANNOT";

export interface RnkCp005EditorialV3State {
  readonly seed: number;
  readonly topology: RnkCp005V3Topology;
  readonly context: RnkCp005Context;
  readonly entities: readonly string[];
  readonly edges: readonly RnkCp005Edge[];
  readonly fixedRanks: readonly [];
  readonly validOrders: readonly (readonly string[])[];
}

export interface RnkCp005EditorialV3Question extends RnkCp005DiscoveryQuestion {
  readonly authorityCandidateId: RnkCp005V3AuthorityCandidateId;
  readonly v3Topology: RnkCp005V3Topology;
  readonly pairStatusMode?: RnkCp005PairStatusMode;
}

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

function quantifiedComparison(
  names: readonly string[],
  direction: "above" | "below",
  target: string,
): string {
  const verb = names.length === 2 ? "must both rank" : "must rank";
  return `${formatNames(names)} ${verb} ${direction} ${target}`;
}

function rotate<T>(items: readonly T[], amount: number): readonly T[] {
  if (items.length === 0) return [];
  const shift = ((amount % items.length) + items.length) % items.length;
  return [...items.slice(shift), ...items.slice(0, shift)];
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

function buildV3Edges(
  entities: readonly string[],
  topology: RnkCp005V3Topology,
): readonly RnkCp005Edge[] {
  const edges: RnkCp005Edge[] = [];
  const add = (higherIndex: number, lowerIndex: number) => {
    if (higherIndex >= entities.length || lowerIndex >= entities.length) return;
    edges.push({
      higher: entities[higherIndex]!,
      lower: entities[lowerIndex]!,
    });
  };

  if (topology === "DIAMOND_TAIL") {
    add(0, 1);
    add(0, 2);
    add(1, 3);
    add(2, 3);
    add(3, 4);
    add(3, 5);
    add(5, 6);
  } else if (topology === "TWO_CHAINS_BRIDGE") {
    add(0, 2);
    add(2, 4);
    add(4, 6);
    add(1, 3);
    add(3, 5);
    add(2, 5);
    add(3, 6);
  } else if (topology === "ASYMMETRIC_FORK") {
    add(0, 2);
    add(1, 2);
    add(2, 3);
    add(2, 4);
    add(3, 5);
    add(4, 6);
  } else if (topology === "STAGGERED_MERGE") {
    add(0, 2);
    add(1, 3);
    add(2, 4);
    add(3, 4);
    add(1, 5);
    add(4, 6);
    add(5, 6);
  } else if (topology === "CHAIN_PLUS_BRANCH") {
    add(0, 1);
    add(1, 3);
    add(2, 3);
    add(2, 4);
    add(3, 5);
    add(4, 6);
  } else if (topology === "DOUBLE_FORK") {
    add(0, 2);
    add(1, 2);
    add(2, 4);
    add(3, 4);
    add(2, 5);
    add(3, 5);
    add(4, 6);
    add(5, 6);
  } else if (topology === "WIDE_MERGE") {
    add(0, 3);
    add(1, 3);
    add(2, 3);
    add(3, 5);
    add(4, 5);
    add(5, 6);
  } else {
    add(0, 2);
    add(0, 3);
    add(1, 3);
    add(2, 4);
    add(3, 5);
    add(4, 6);
    add(5, 6);
  }

  return uniqueEdges(edges);
}

export function buildRnkCp005EditorialV3State(
  seed: number,
  topology: RnkCp005V3Topology,
): RnkCp005EditorialV3State | undefined {
  const base = buildRnkCp005PartialOrderState(seed);
  const edges = buildV3Edges(base.entities, topology);
  const validOrders = enumerateRnkCp005ValidOrders(
    base.entities,
    edges,
    [],
  );
  if (validOrders.length < 2) return undefined;
  return {
    seed,
    topology,
    context: base.context,
    entities: base.entities,
    edges,
    fixedRanks: [],
    validOrders,
  };
}

function relationFrequency(
  orders: readonly (readonly string[])[],
  first: string,
  second: string,
): number {
  return orders.filter(
    (order) => order.indexOf(first) < order.indexOf(second),
  ).length;
}

export function classifyRnkCp005EditorialV3Relation(
  state: RnkCp005EditorialV3State,
  first: string,
  second: string,
): RelationClass {
  const frequency = relationFrequency(state.validOrders, first, second);
  if (frequency === 0) return "IMPOSSIBLE";
  if (frequency === state.validOrders.length) return "DEFINITE";
  return "VARIABLE";
}

function orderedRelations(
  state: RnkCp005EditorialV3State,
): readonly OrderedRelation[] {
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

export function shortestRnkCp005EditorialV3Path(
  state: RnkCp005EditorialV3State,
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

function directEdge(
  state: RnkCp005EditorialV3State,
  first: string,
  second: string,
): boolean {
  return state.edges.some(
    (edge) => edge.higher === first && edge.lower === second,
  );
}

function isTransitiveDefinite(
  state: RnkCp005EditorialV3State,
  relation: OrderedRelation,
): boolean {
  if (relation.classification !== "DEFINITE") return false;
  const path = shortestRnkCp005EditorialV3Path(
    state,
    relation.first,
    relation.second,
  );
  return Boolean(
    path &&
    path.length >= 3 &&
    !directEdge(state, relation.first, relation.second)
  );
}

function isTransitiveImpossible(
  state: RnkCp005EditorialV3State,
  relation: OrderedRelation,
): boolean {
  if (relation.classification !== "IMPOSSIBLE") return false;
  const reversePath = shortestRnkCp005EditorialV3Path(
    state,
    relation.second,
    relation.first,
  );
  return Boolean(
    reversePath &&
    reversePath.length >= 3 &&
    !directEdge(state, relation.second, relation.first)
  );
}

function witness(
  state: RnkCp005EditorialV3State,
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

function rankSet(
  state: RnkCp005EditorialV3State,
  entity: string,
): readonly number[] {
  return [...new Set(
    state.validOrders.map((order) => order.indexOf(entity) + 1),
  )].sort((a, b) => a - b);
}

function mandatoryAbove(
  state: RnkCp005EditorialV3State,
  entity: string,
): readonly string[] {
  return state.entities.filter(
    (other) =>
      other !== entity &&
      classifyRnkCp005EditorialV3Relation(state, other, entity) === "DEFINITE",
  );
}

function mandatoryBelow(
  state: RnkCp005EditorialV3State,
  entity: string,
): readonly string[] {
  return state.entities.filter(
    (other) =>
      other !== entity &&
      classifyRnkCp005EditorialV3Relation(state, entity, other) === "DEFINITE",
  );
}

function containsIncomparablePair(
  state: RnkCp005EditorialV3State,
  entities: readonly string[],
): boolean {
  for (let index = 0; index < entities.length; index += 1) {
    for (let other = index + 1; other < entities.length; other += 1) {
      if (
        classifyRnkCp005EditorialV3Relation(
          state,
          entities[index]!,
          entities[other]!,
        ) === "VARIABLE"
      ) {
        return true;
      }
    }
  }
  return false;
}

function incidentDegree(
  state: RnkCp005EditorialV3State,
  entity: string,
): number {
  return state.edges.filter(
    (edge) => edge.higher === entity || edge.lower === entity,
  ).length;
}

function relationOptionSetIsBalanced(
  relations: readonly OrderedRelation[],
): boolean {
  if (relations.length !== 4) return false;
  const orderedPairs = new Set(
    relations.map((item) => `${item.first}>${item.second}`),
  );
  const unorderedPairs = new Set(
    relations.map((item) => [item.first, item.second].sort().join("|")),
  );
  const people = relations.flatMap((item) => [item.first, item.second]);
  const counts = new Map<string, number>();
  for (const person of people) {
    counts.set(person, (counts.get(person) ?? 0) + 1);
  }
  return (
    orderedPairs.size === 4 &&
    unorderedPairs.size === 4 &&
    counts.size >= 4 &&
    [...counts.values()].every((count) => count <= 2)
  );
}

function chooseRelationOptions(
  correct: OrderedRelation,
  distractors: readonly OrderedRelation[],
  seed: number,
  finalPredicate: (items: readonly OrderedRelation[]) => boolean,
): readonly OrderedRelation[] | undefined {
  const pool = rotate(
    distractors.filter(
      (item) => !(item.first === correct.first && item.second === correct.second),
    ),
    seed,
  );
  const selected: OrderedRelation[] = [correct];

  const visit = (start: number): boolean => {
    if (selected.length === 4) {
      return relationOptionSetIsBalanced(selected) && finalPredicate(selected);
    }
    for (let index = start; index < pool.length; index += 1) {
      const candidate = pool[index]!;
      const provisional = [...selected, candidate];
      const people = provisional.flatMap((item) => [item.first, item.second]);
      const counts = new Map<string, number>();
      for (const person of people) {
        counts.set(person, (counts.get(person) ?? 0) + 1);
      }
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
): {
  readonly options: readonly RnkCp005Option[];
  readonly correctIndex: number;
} {
  const output = [...options];
  const currentIndex = output.findIndex((option) => option.truth);
  if (
    currentIndex < 0 ||
    output.filter((option) => option.truth).length !== 1
  ) {
    throw new Error("Expected exactly one correct option");
  }
  const [correct] = output.splice(currentIndex, 1);
  output.splice(desiredIndex, 0, correct!);
  return { options: output, correctIndex: desiredIndex };
}

function relationOptionExplanation(
  state: RnkCp005EditorialV3State,
  relation: OrderedRelation,
  query: RelationQuery,
): string {
  if (query === "MUST") {
    if (relation.classification === "DEFINITE") {
      const path = shortestRnkCp005EditorialV3Path(
        state,
        relation.first,
        relation.second,
      );
      return path
        ? `${path.join(" > ")} forces this relation.`
        : "This relation holds in every valid ranking.";
    }
    if (relation.classification === "VARIABLE") {
      const counterexample = witness(
        state,
        relation.first,
        relation.second,
        false,
      )!;
      return `${counterexample.join(" > ")} is a valid counterexample, so the relation is not compulsory.`;
    }
    const path = shortestRnkCp005EditorialV3Path(
      state,
      relation.second,
      relation.first,
    );
    return `${path!.join(" > ")} forces the opposite relation.`;
  }

  if (query === "COULD") {
    if (relation.classification === "VARIABLE") {
      const example = witness(
        state,
        relation.first,
        relation.second,
        true,
      )!;
      return `${example.join(" > ")} is a valid ranking in which this relation holds.`;
    }
    const path = shortestRnkCp005EditorialV3Path(
      state,
      relation.second,
      relation.first,
    );
    return `${path!.join(" > ")} forces the opposite relation, so this option is impossible.`;
  }

  if (relation.classification === "IMPOSSIBLE") {
    const path = shortestRnkCp005EditorialV3Path(
      state,
      relation.second,
      relation.first,
    );
    return `${path!.join(" > ")} makes this relation impossible.`;
  }
  const example = witness(
    state,
    relation.first,
    relation.second,
    true,
  )!;
  return `${example.join(" > ")} is a valid ranking in which this relation occurs, so it cannot be the impossible option.`;
}

function relationDifficulty(
  state: RnkCp005EditorialV3State,
  relation: OrderedRelation,
  query: RelationQuery,
): RnkCp005Difficulty {
  if (query === "MUST") {
    const path = shortestRnkCp005EditorialV3Path(
      state,
      relation.first,
      relation.second,
    )!;
    return path.length >= 5 ? "HARD" : "MEDIUM";
  }
  if (query === "CANNOT") {
    const path = shortestRnkCp005EditorialV3Path(
      state,
      relation.second,
      relation.first,
    )!;
    return path.length >= 5 ? "HARD" : "MEDIUM";
  }
  return "MEDIUM";
}

function buildRelationTruthQuestion(
  prototypeId: Extract<
    RnkCp005EditorialV3SourceForm,
    "DEFINITELY_TRUE_RELATION" | "POSSIBLE_RELATION" | "IMPOSSIBLE_RELATION"
  >,
  state: RnkCp005EditorialV3State,
  ordinal: number,
): Pick<
  RnkCp005EditorialV3Question,
  | "authorityCandidateId"
  | "stem"
  | "options"
  | "correctIndex"
  | "answer"
  | "explanation"
  | "difficulty"
> | undefined {
  const query: RelationQuery =
    prototypeId === "DEFINITELY_TRUE_RELATION"
      ? "MUST"
      : prototypeId === "POSSIBLE_RELATION"
        ? "COULD"
        : "CANNOT";
  const relations = orderedRelations(state);
  const correctCandidates = relations.filter((relation) => {
    if (query === "MUST") return isTransitiveDefinite(state, relation);
    if (query === "COULD") {
      return (
        relation.classification === "VARIABLE" &&
        incidentDegree(state, relation.first) > 0 &&
        incidentDegree(state, relation.second) > 0
      );
    }
    return isTransitiveImpossible(state, relation);
  });

  for (const correct of rotate(correctCandidates, state.seed + ordinal)) {
    let distractors: readonly OrderedRelation[];
    let predicate: (items: readonly OrderedRelation[]) => boolean;

    if (query === "MUST") {
      distractors = relations.filter(
        (relation) =>
          relation.classification === "VARIABLE" ||
          isTransitiveImpossible(state, relation),
      );
      predicate = (items) =>
        items
          .filter((item) => item !== correct)
          .filter((item) => item.classification === "VARIABLE")
          .length >= 2;
    } else if (query === "COULD") {
      distractors = relations.filter((relation) =>
        isTransitiveImpossible(state, relation),
      );
      predicate = (items) =>
        items
          .filter((item) => item !== correct)
          .every((item) => isTransitiveImpossible(state, item));
    } else {
      distractors = relations.filter(
        (relation) => relation.classification === "VARIABLE",
      );
      predicate = (items) =>
        items
          .filter((item) => item !== correct)
          .every((item) => item.classification === "VARIABLE");
    }

    const selected = chooseRelationOptions(
      correct,
      distractors,
      state.seed + ordinal * 17,
      predicate,
    );
    if (!selected) continue;

    const options = selected.map((relation) => ({
      label: `${relation.first} ranks above ${relation.second}.`,
      truth:
        relation.first === correct.first &&
        relation.second === correct.second,
      explanation: relationOptionExplanation(state, relation, query),
    }));
    const positioned = moveCorrectOption(options, ordinal % 4);
    const path =
      query === "MUST"
        ? shortestRnkCp005EditorialV3Path(
            state,
            correct.first,
            correct.second,
          )
        : query === "CANNOT"
          ? shortestRnkCp005EditorialV3Path(
              state,
              correct.second,
              correct.first,
            )
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
  state: RnkCp005EditorialV3State,
  first: string,
  second: string,
): readonly number[] {
  return [...new Set(
    state.validOrders.map((order) =>
      Math.abs(order.indexOf(first) - order.indexOf(second)),
    ),
  )].sort((a, b) => a - b);
}

function buildPairStatusQuestion(
  state: RnkCp005EditorialV3State,
  ordinal: number,
): Pick<
  RnkCp005EditorialV3Question,
  | "authorityCandidateId"
  | "pairStatusMode"
  | "stem"
  | "options"
  | "correctIndex"
  | "answer"
  | "explanation"
  | "difficulty"
> | undefined {
  const desiredMode: RnkCp005PairStatusMode =
    (["FIRST_ABOVE", "SECOND_ABOVE", "INDETERMINATE"] as const)[
      ordinal % 3
    ]!;
  const pairs: { first: string; second: string }[] = [];

  for (let index = 0; index < state.entities.length; index += 1) {
    for (let other = index + 1; other < state.entities.length; other += 1) {
      let first = state.entities[index]!;
      let second = state.entities[other]!;
      if (desiredMode === "SECOND_ABOVE") {
        [first, second] = [second, first];
      }
      const classification = classifyRnkCp005EditorialV3Relation(
        state,
        first,
        second,
      );
      const distances = pairDistanceSet(state, first, second);
      const consecutiveForced = distances.length === 1 && distances[0] === 1;
      if (consecutiveForced) continue;

      if (desiredMode === "INDETERMINATE") {
        if (classification === "VARIABLE") pairs.push({ first, second });
        continue;
      }

      if (classification !== "DEFINITE") continue;
      const path = shortestRnkCp005EditorialV3Path(state, first, second);
      if (!path || path.length < 3 || directEdge(state, first, second)) continue;
      pairs.push({ first, second });
    }
  }

  const pair = rotate(pairs, state.seed + ordinal)[0];
  if (!pair) return undefined;
  const firstClass = classifyRnkCp005EditorialV3Relation(
    state,
    pair.first,
    pair.second,
  );
  const distances = pairDistanceSet(state, pair.first, pair.second);
  const options: RnkCp005Option[] = [
    {
      label: `${pair.first} must rank above ${pair.second}.`,
      truth: firstClass === "DEFINITE",
      explanation:
        firstClass === "DEFINITE"
          ? `${shortestRnkCp005EditorialV3Path(state, pair.first, pair.second)!.join(" > ")} forces this order.`
          : `${witness(state, pair.first, pair.second, false)!.join(" > ")} is a valid ranking with the opposite order.`,
    },
    {
      label: `${pair.second} must rank above ${pair.first}.`,
      truth: firstClass === "IMPOSSIBLE",
      explanation:
        firstClass === "IMPOSSIBLE"
          ? `${shortestRnkCp005EditorialV3Path(state, pair.second, pair.first)!.join(" > ")} forces this order.`
          : `${witness(state, pair.first, pair.second, true)!.join(" > ")} is a valid ranking with the opposite order.`,
    },
    {
      label: "Their relative ranks cannot be determined uniquely.",
      truth: firstClass === "VARIABLE",
      explanation:
        firstClass === "VARIABLE"
          ? "Both relative orders occur in valid rankings."
          : "The comparison chain fixes their relative order.",
    },
    {
      label: `${pair.first} and ${pair.second} must be consecutive in the ranking.`,
      truth: false,
      explanation:
        distances.length === 1
          ? `Their fixed separation is ${distances[0]} rank places, not consecutive.`
          : "Their separation changes across valid rankings, so consecutiveness is not compulsory.",
    },
  ];
  if (options.filter((option) => option.truth).length !== 1) return undefined;
  const positioned = moveCorrectOption(options, ordinal % 4);

  let explanation: readonly string[];
  let answer: string;
  let difficulty: RnkCp005Difficulty;

  if (firstClass === "DEFINITE") {
    const path = shortestRnkCp005EditorialV3Path(
      state,
      pair.first,
      pair.second,
    )!;
    explanation = [
      `Link the comparisons: ${path.join(" > ")}.`,
      `Therefore ${pair.first} must rank above ${pair.second}.`,
    ];
    answer = `${pair.first} must rank above ${pair.second}`;
    difficulty = path.length >= 5 ? "HARD" : "MEDIUM";
  } else if (firstClass === "IMPOSSIBLE") {
    const path = shortestRnkCp005EditorialV3Path(
      state,
      pair.second,
      pair.first,
    )!;
    explanation = [
      `Link the comparisons: ${path.join(" > ")}.`,
      `Therefore ${pair.second} must rank above ${pair.first}.`,
    ];
    answer = `${pair.second} must rank above ${pair.first}`;
    difficulty = path.length >= 5 ? "HARD" : "MEDIUM";
  } else {
    const firstWitness = witness(
      state,
      pair.first,
      pair.second,
      true,
    )!;
    const secondWitness = witness(
      state,
      pair.first,
      pair.second,
      false,
    )!;
    explanation = [
      `${firstWitness.join(" > ")} satisfies every statement and places ${pair.first} above ${pair.second}.`,
      `${secondWitness.join(" > ")} also satisfies every statement but places ${pair.second} above ${pair.first}.`,
      "Since both orders are possible, their relative ranks cannot be determined uniquely.",
    ];
    answer = "Their relative ranks cannot be determined uniquely";
    difficulty = "MEDIUM";
  }

  return {
    authorityCandidateId: "RELATION_TRUTH_STATUS",
    pairStatusMode: desiredMode,
    stem: `What can be concluded about the relative ranks of ${pair.first} and ${pair.second}?`,
    options: positioned.options,
    correctIndex: positioned.correctIndex,
    answer,
    explanation,
    difficulty,
  };
}

function numericOptions(
  answer: number,
  minimum: number,
  maximum: number,
): readonly number[] {
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
  state: RnkCp005EditorialV3State,
  compulsoryCount: number,
  compulsory: readonly string[],
): RnkCp005Difficulty {
  if (
    compulsoryCount >= 5 &&
    containsIncomparablePair(state, compulsory)
  ) {
    return "HARD";
  }
  return "MEDIUM";
}

function buildRankBoundQuestion(
  prototypeId: Extract<
    RnkCp005EditorialV3SourceForm,
    "MINIMUM_POSSIBLE_RANK" | "MAXIMUM_POSSIBLE_RANK"
  >,
  state: RnkCp005EditorialV3State,
  ordinal: number,
): Pick<
  RnkCp005EditorialV3Question,
  | "authorityCandidateId"
  | "stem"
  | "options"
  | "correctIndex"
  | "answer"
  | "explanation"
  | "difficulty"
> | undefined {
  const highest = prototypeId === "MINIMUM_POSSIBLE_RANK";
  const targets = state.entities
    .map((entity) => ({
      entity,
      ranks: rankSet(state, entity),
      above: mandatoryAbove(state, entity),
      below: mandatoryBelow(state, entity),
    }))
    .filter((item) => {
      if (item.ranks.length < 2) return false;
      const compulsory = highest ? item.above : item.below;
      if (compulsory.length < 3) return false;
      if (!containsIncomparablePair(state, compulsory)) return false;
      if (highest) {
        return item.ranks[0] === item.above.length + 1;
      }
      return (
        item.ranks.at(-1) ===
        state.entities.length - item.below.length
      );
    });
  const target = rotate(targets, state.seed + ordinal)[0];
  if (!target) return undefined;

  const answerValue = highest
    ? target.ranks[0]!
    : target.ranks.at(-1)!;
  const witnessOrder = state.validOrders.find(
    (order) => order.indexOf(target.entity) + 1 === answerValue,
  )!;
  const values = numericOptions(answerValue, 1, state.entities.length);
  const options = values.map((value) => ({
    label: `${value}${ordinalSuffix(value)}`,
    truth: value === answerValue,
    explanation:
      value === answerValue
        ? "This is the required boundary rank and it is attainable."
        : target.ranks.includes(value)
          ? `${target.entity} can occupy this rank, but it is not the ${highest ? "highest" : "lowest"} possible rank.`
          : `${target.entity} cannot occupy this rank in any valid order.`,
  }));
  const positioned = moveCorrectOption(options, ordinal % 4);
  const compulsory = highest ? target.above : target.below;
  const comparison = quantifiedComparison(
    compulsory,
    highest ? "above" : "below",
    target.entity,
  );
  const proof = highest
    ? `${comparison}. Therefore at least ${compulsory.length} people must precede ${target.entity}, so ${target.entity} cannot rank higher than ${answerValue}${ordinalSuffix(answerValue)}.`
    : `${comparison}. Therefore at least ${compulsory.length} people must follow ${target.entity}, so ${target.entity} cannot rank lower than ${answerValue}${ordinalSuffix(answerValue)}.`;

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
    difficulty: boundDifficulty(state, compulsory.length, compulsory),
  };
}

function buildExactRankQuestion(
  state: RnkCp005EditorialV3State,
  ordinal: number,
): Pick<
  RnkCp005EditorialV3Question,
  | "authorityCandidateId"
  | "stem"
  | "options"
  | "correctIndex"
  | "answer"
  | "explanation"
  | "difficulty"
> | undefined {
  const wantIndeterminate = ordinal % 2 === 1;
  const profiles = state.entities.map((entity) => ({
    entity,
    ranks: rankSet(state, entity),
    above: mandatoryAbove(state, entity),
    below: mandatoryBelow(state, entity),
  }));
  const candidates = profiles.filter((item) => {
    if (wantIndeterminate) {
      return (
        item.ranks.length >= 2 &&
        item.above.length >= 1 &&
        item.below.length >= 1
      );
    }
    return (
      item.ranks.length === 1 &&
      item.above.length >= 2 &&
      item.below.length >= 2 &&
      item.above.length + item.below.length ===
        state.entities.length - 1 &&
      (
        containsIncomparablePair(state, item.above) ||
        containsIncomparablePair(state, item.below)
      )
    );
  });
  const target = rotate(candidates, state.seed + ordinal)[0];
  if (!target) return undefined;

  const isDefinite = target.ranks.length === 1;
  const answerValue = target.ranks[0]!;
  const numericValues = numericOptions(
    answerValue,
    1,
    state.entities.length,
  ).slice(0, 3);
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
      `${quantifiedComparison(target.above, "above", target.entity)}, while ${quantifiedComparison(target.below, "below", target.entity)}.`,
      `These account for all other ${state.entities.length - 1} people, so ${target.entity} must be ranked ${answerValue}${ordinalSuffix(answerValue)}.`,
    ];
    difficulty =
      target.above.length >= 4 && target.below.length >= 2
        ? "HARD"
        : "MEDIUM";
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
      target.ranks.length >= 4 && state.edges.length >= 6
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

function genericInstruction(state: RnkCp005EditorialV3State): string {
  return `${state.entities.length} people are ranked from highest rank to lowest rank.`;
}

function genericClues(
  state: RnkCp005EditorialV3State,
): readonly string[] {
  return state.edges.map(
    (edge) => `${edge.higher} is ranked above ${edge.lower}.`,
  );
}

function buildQuestionForState(
  prototypeId: RnkCp005EditorialV3SourceForm,
  state: RnkCp005EditorialV3State,
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
    return buildPairStatusQuestion(state, ordinal);
  }
  if (
    prototypeId === "MINIMUM_POSSIBLE_RANK" ||
    prototypeId === "MAXIMUM_POSSIBLE_RANK"
  ) {
    return buildRankBoundQuestion(prototypeId, state, ordinal);
  }
  return buildExactRankQuestion(state, ordinal);
}

function topologySchedule(
  prototypeIndex: number,
  ordinal: number,
): readonly RnkCp005V3Topology[] {
  const preferredIndex = (prototypeIndex * 3 + ordinal) % RNK_CP005_V3_TOPOLOGIES.length;
  return rotate(RNK_CP005_V3_TOPOLOGIES, preferredIndex);
}

export function generateRnkCp005EditorialV3Question(
  prototypeId: RnkCp005EditorialV3SourceForm,
  ordinal: number,
): RnkCp005EditorialV3Question {
  const prototypeIndex = RNK_CP005_EDITORIAL_V3_SOURCE_FORMS.indexOf(
    prototypeId,
  );
  const startSeed = prototypeIndex * 10_000_000 + ordinal * 100_000;

  for (const topology of topologySchedule(prototypeIndex, ordinal)) {
    for (let offset = 0; offset < 20_000; offset += 1) {
      const seed = startSeed + offset;
      const state = buildRnkCp005EditorialV3State(seed, topology);
      if (!state) continue;
      const built = buildQuestionForState(prototypeId, state, ordinal);
      if (!built) continue;
      const base = generateRnkCp005DiscoveryQuestion(prototypeId, seed);
      const fingerprint = createHash("sha256")
        .update(
          JSON.stringify({
            version: RNK_CP005_PARTIAL_ORDER_EDITORIAL_V3_VERSION,
            prototypeId,
            authorityCandidateId: built.authorityCandidateId,
            topology,
            pairStatusMode:
              "pairStatusMode" in built ? built.pairStatusMode : undefined,
            seed,
            edges: state.edges,
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
        v3Topology: topology,
        ...("pairStatusMode" in built
          ? { pairStatusMode: built.pairStatusMode }
          : {}),
        context: state.context,
        difficulty: built.difficulty,
        instruction: genericInstruction(state),
        clues: genericClues(state),
        stem: built.stem,
        options: built.options,
        correctIndex: built.correctIndex,
        answer: built.answer,
        explanation: built.explanation,
        validOrderCount: state.validOrders.length,
        exampleValidOrders: state.validOrders.slice(0, 3),
        mathematicalFingerprint: fingerprint,
      };
    }
  }

  throw new Error(`${prototypeId}:${ordinal}: no V3 editorial candidate found`);
}

export function buildRnkCp005EditorialV3Corpus(
  questionsPerSourceForm = 24,
): readonly RnkCp005EditorialV3Question[] {
  return RNK_CP005_EDITORIAL_V3_SOURCE_FORMS.flatMap((prototypeId) =>
    Array.from({ length: questionsPerSourceForm }, (_, ordinal) =>
      generateRnkCp005EditorialV3Question(prototypeId, ordinal),
    ),
  );
}
