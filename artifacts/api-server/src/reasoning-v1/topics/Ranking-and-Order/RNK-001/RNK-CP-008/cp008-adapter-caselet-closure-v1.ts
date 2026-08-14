import { selectRnkPeople } from "../foundation/rnk-object-pool-v2";
import {
  generateRnkCp007DerivedQuantityQuestion,
  type RnkCp007DerivedQuantityMode,
  type RnkCp007DerivedQuantityQuestion,
} from "../RNK-CP-007/cp007-derived-quantity-discovery-v1";

export const RNK_CP008_ADAPTER_CASELET_CLOSURE_VERSION =
  "RNK_CP008_ADAPTER_CASELET_CLOSURE_V1" as const;

export const RNK_CP008_PERMANENT_QLS_ALLOCATED = 0 as const;
export const RNK_CP008_NEXT_AVAILABLE_QL = "RNK-QL-043" as const;

export type RnkExistingQlId =
  | "RNK-QL-004"
  | "RNK-QL-027"
  | "RNK-QL-028"
  | "RNK-QL-029"
  | "RNK-QL-030"
  | "RNK-QL-031"
  | "RNK-QL-033"
  | "RNK-QL-034"
  | "RNK-QL-038";

export const RNK_CP008_LIFECYCLE = Object.freeze({
  permanentQlAllocated: false,
  questionStudio: "DISABLED" as const,
  persistence: "DISABLED" as const,
  questionBank: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false,
  hindiPunjabi: "NOT_STARTED" as const,
});

function mix32(value: number): number {
  let x = value >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return x >>> 0;
}

function pickInt(seed: number, salt: number, min: number, max: number): number {
  return min + (mix32(seed ^ salt) % (max - min + 1));
}

function answerIndexFor(seed: number, salt = 0): 0 | 1 | 2 | 3 {
  return (mix32(seed ^ salt) % 4) as 0 | 1 | 2 | 3;
}

function placeOptions<T>(answer: T, distractors: readonly T[], answerIndex: 0 | 1 | 2 | 3): readonly T[] {
  const unique = [...new Set(distractors)].filter((value) => value !== answer);
  if (unique.length < 3) throw new Error("Need three unique distractors");
  const output: T[] = [];
  let cursor = 0;
  for (let index = 0; index < 4; index += 1) {
    output.push(index === answerIndex ? answer : unique[cursor++]!);
  }
  if (new Set(output).size !== 4) throw new Error("Option collision");
  return output;
}

function permutations<T>(values: readonly T[]): T[][] {
  if (values.length <= 1) return [[...values]];
  const result: T[][] = [];
  values.forEach((value, index) => {
    const rest = values.filter((_, restIndex) => restIndex !== index);
    for (const tail of permutations(rest)) result.push([value, ...tail]);
  });
  return result;
}

// ---------------------------------------------------------------------------
// Numeric-value-constrained order adapter (source Q27-Q28 family)
// ---------------------------------------------------------------------------

export type RnkCp008NumericConstraint =
  | Readonly<{ kind: "GREATER_THAN"; left: string; right: string }>
  | Readonly<{ kind: "BETWEEN"; middle: string; first: string; second: string }>
  | Readonly<{ kind: "EXACT_DIFFERENCE"; higher: string; lower: string; difference: number }>
  | Readonly<{ kind: "NOT_VALUE"; entity: string; value: number }>;

export interface RnkCp008NumericConstraintState {
  readonly entities: readonly string[];
  readonly minValue: number;
  readonly maxValue: number;
  readonly constraints: readonly RnkCp008NumericConstraint[];
  readonly higherValueMeansHigherRank: true;
}

export interface RnkCp008NumericConstraintSolution {
  readonly assignments: readonly Readonly<Record<string, number>>[];
  readonly validOrdersFromHighest: readonly (readonly string[])[];
  readonly uniqueOrdersFromHighest: readonly (readonly string[])[];
}

function numericConstraintHolds(
  assignment: Readonly<Record<string, number>>,
  constraint: RnkCp008NumericConstraint,
): boolean {
  if (constraint.kind === "GREATER_THAN") {
    return assignment[constraint.left]! > assignment[constraint.right]!;
  }
  if (constraint.kind === "BETWEEN") {
    const middle = assignment[constraint.middle]!;
    const first = assignment[constraint.first]!;
    const second = assignment[constraint.second]!;
    return (middle > first && middle < second) || (middle > second && middle < first);
  }
  if (constraint.kind === "EXACT_DIFFERENCE") {
    return assignment[constraint.higher] === assignment[constraint.lower]! + constraint.difference;
  }
  return assignment[constraint.entity] !== constraint.value;
}

export function solveRnkCp008NumericValueConstrainedOrder(
  state: RnkCp008NumericConstraintState,
): RnkCp008NumericConstraintSolution {
  const { entities, minValue, maxValue } = state;
  if (entities.length < 2 || entities.length > 8) {
    throw new Error("Numeric-value order adapter supports 2..8 entities");
  }
  if (new Set(entities).size !== entities.length) throw new Error("Duplicate numeric-order entity");
  if (maxValue - minValue + 1 !== entities.length) {
    throw new Error("Numeric-value order adapter requires one consecutive value per entity");
  }
  const values = Array.from({ length: entities.length }, (_, index) => minValue + index);
  const assignments: Record<string, number>[] = [];
  for (const permutation of permutations(values)) {
    const assignment = Object.fromEntries(
      entities.map((entity, index) => [entity, permutation[index]!] as const),
    ) as Record<string, number>;
    if (state.constraints.every((constraint) => numericConstraintHolds(assignment, constraint))) {
      assignments.push(assignment);
    }
  }
  if (assignments.length === 0) throw new Error("Numeric-value constraints have no valid assignment");
  const validOrdersFromHighest = assignments.map((assignment) =>
    [...entities].sort((a, b) => assignment[b]! - assignment[a]! || a.localeCompare(b)),
  );
  const seen = new Set<string>();
  const uniqueOrdersFromHighest = validOrdersFromHighest.filter((order) => {
    const key = order.join(">");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return { assignments, validOrdersFromHighest, uniqueOrdersFromHighest };
}

export function buildRnkCp008Q27Q28CanonicalState(): RnkCp008NumericConstraintState {
  return {
    entities: ["A", "B", "C", "D", "E", "F"],
    minValue: 17,
    maxValue: 22,
    higherValueMeansHigherRank: true,
    constraints: [
      { kind: "BETWEEN", middle: "F", first: "B", second: "D" },
      { kind: "GREATER_THAN", left: "A", right: "B" },
      { kind: "GREATER_THAN", left: "C", right: "D" },
      { kind: "EXACT_DIFFERENCE", higher: "A", lower: "C", difference: 1 },
      { kind: "NOT_VALUE", entity: "D", value: 17 },
      { kind: "NOT_VALUE", entity: "B", value: 17 },
      { kind: "NOT_VALUE", entity: "B", value: 18 },
    ],
  };
}

export type RnkCp008NumericRankQuery =
  | Readonly<{ kind: "COMPLETE_ORDER" }>
  | Readonly<{ kind: "ENTITY_AT_POSITION"; rankFromTop: number }>
  | Readonly<{ kind: "RANK_OF_ENTITY"; entity: string }>
  | Readonly<{ kind: "RELATIVE_ORDER"; first: string; second: string }>;

export interface RnkCp008NumericRankRoute {
  readonly adapterVersion: typeof RNK_CP008_ADAPTER_CASELET_CLOSURE_VERSION;
  readonly mappedQlId: "RNK-QL-028" | "RNK-QL-029" | "RNK-QL-030" | "RNK-QL-031" | "RNK-QL-038";
  readonly answer: string | number | readonly string[];
  readonly normalizedOrderCount: number;
  readonly permanentQlAllocated: false;
}

export function routeRnkCp008NumericConstraintRankQuery(
  solution: RnkCp008NumericConstraintSolution,
  query: RnkCp008NumericRankQuery,
): RnkCp008NumericRankRoute {
  const orders = solution.uniqueOrdersFromHighest;
  if (query.kind === "COMPLETE_ORDER") {
    if (orders.length !== 1) throw new Error("Complete order is not unique");
    return {
      adapterVersion: RNK_CP008_ADAPTER_CASELET_CLOSURE_VERSION,
      mappedQlId: "RNK-QL-030",
      answer: orders[0]!,
      normalizedOrderCount: orders.length,
      permanentQlAllocated: false,
    };
  }
  if (query.kind === "ENTITY_AT_POSITION") {
    const occupants = new Set(orders.map((order) => order[query.rankFromTop - 1]));
    if (occupants.size !== 1 || occupants.has(undefined)) throw new Error("Position is not invariant");
    return {
      adapterVersion: RNK_CP008_ADAPTER_CASELET_CLOSURE_VERSION,
      mappedQlId: orders.length === 1 ? "RNK-QL-028" : "RNK-QL-038",
      answer: [...occupants][0]!,
      normalizedOrderCount: orders.length,
      permanentQlAllocated: false,
    };
  }
  if (query.kind === "RANK_OF_ENTITY") {
    const ranks = new Set(orders.map((order) => order.indexOf(query.entity) + 1));
    if (ranks.has(0) || ranks.size !== 1) throw new Error("Entity rank is not invariant");
    return {
      adapterVersion: RNK_CP008_ADAPTER_CASELET_CLOSURE_VERSION,
      mappedQlId: orders.length === 1 ? "RNK-QL-029" : "RNK-QL-038",
      answer: [...ranks][0]!,
      normalizedOrderCount: orders.length,
      permanentQlAllocated: false,
    };
  }
  const relations = new Set(orders.map((order) =>
    order.indexOf(query.first) < order.indexOf(query.second) ? "FIRST_ABOVE" : "SECOND_ABOVE",
  ));
  if (relations.size !== 1) throw new Error("Pair relation is not invariant");
  return {
    adapterVersion: RNK_CP008_ADAPTER_CASELET_CLOSURE_VERSION,
    mappedQlId: orders.length === 1 ? "RNK-QL-031" : "RNK-QL-038",
    answer: [...relations][0]!,
    normalizedOrderCount: orders.length,
    permanentQlAllocated: false,
  };
}

export type RnkCp008NumericSourceSurface = "EXACT_ENTITY_VALUE" | "VALID_ORDER_COUNT";

export function classifyRnkCp008NumericSourceSurface(surface: RnkCp008NumericSourceSurface) {
  return Object.freeze({
    surface,
    disposition: "REDIRECT_MIXED_NUMERIC_CONSTRAINT" as const,
    reason:
      surface === "EXACT_ENTITY_VALUE"
        ? "The requested answer is a numeric attribute value, not a rank/order answer semantic."
        : "The requested answer counts satisfying models rather than asking a rank/order relation.",
    permanentQlAllocated: false,
    nextAvailableQl: RNK_CP008_NEXT_AVAILABLE_QL,
  });
}

// ---------------------------------------------------------------------------
// Relational side-count equation adapter (source Q66 family)
// ---------------------------------------------------------------------------

export interface RnkCp008RelationalSideCountQuestion {
  readonly adapterVersion: typeof RNK_CP008_ADAPTER_CASELET_CLOSURE_VERSION;
  readonly sourceForm: "RELATIONAL_SIDE_COUNT_EQUATION";
  readonly mappedQlId: "RNK-QL-004";
  readonly seed: number;
  readonly stem: string;
  readonly options: readonly number[];
  readonly correctIndex: 0 | 1 | 2 | 3;
  readonly answer: number;
  readonly explanation: string;
  readonly normalizedState: Readonly<{
    sourceBehind: number;
    sourceFront: number;
    total: number;
    targetFront: number;
    targetBehind: number;
    multiplier: number;
  }>;
  readonly lifecycle: typeof RNK_CP008_LIFECYCLE;
}

export function generateRnkCp008RelationalSideCountQuestion(seed: number): RnkCp008RelationalSideCountQuestion {
  const people = selectRnkPeople(seed ^ 0x51463636, 2, { genderMode: "BALANCED" });
  const source = people[0]!.names.en;
  const target = people[1]!.names.en;
  const sourceBehind = pickInt(seed, 0x42454849, 2, 8);
  const multiplier = pickInt(seed, 0x4d554c54, 2, 3);
  const sourceFront = multiplier * sourceBehind;
  const total = sourceFront + sourceBehind + 1;
  const targetFront = sourceBehind;
  const targetBehind = total - targetFront - 1;
  const answer = targetBehind;
  const distractorPool = [
    sourceBehind,
    sourceFront,
    Math.max(1, targetBehind - 1),
    targetBehind + 1,
    total - targetFront,
    total - sourceBehind - 1,
  ];
  const uniqueDistractors = [...new Set(distractorPool)].filter((value) => value !== answer);
  let fallback = 1;
  while (uniqueDistractors.length < 3) {
    const value = answer + fallback + 1;
    if (value !== answer && !uniqueDistractors.includes(value)) uniqueDistractors.push(value);
    fallback += 1;
  }
  const correctIndex = answerIndexFor(seed, 0x51414e53);
  const options = placeOptions(answer, uniqueDistractors, correctIndex) as readonly number[];
  return {
    adapterVersion: RNK_CP008_ADAPTER_CASELET_CLOSURE_VERSION,
    sourceForm: "RELATIONAL_SIDE_COUNT_EQUATION",
    mappedQlId: "RNK-QL-004",
    seed,
    stem: `In a queue, the number of people ahead of ${source} is ${multiplier} times the number behind ${source}. The number of people ahead of ${target} is equal to the number behind ${source}. How many people are behind ${target}?`,
    options,
    correctIndex,
    answer,
    explanation: `Let the number behind ${source} be x. Then the number ahead is ${multiplier}x, so total people = ${multiplier}x + x + 1. Here x = ${sourceBehind}, hence total = ${total}. ${target} has ${targetFront} people ahead, so ${target}'s rank from the front is ${targetFront + 1}. Therefore people behind ${target} = ${total} - ${targetFront + 1} = ${targetBehind}. The equation layer only derives the ordinary total-and-rank state owned by RNK-QL-004.`,
    normalizedState: {
      sourceBehind,
      sourceFront,
      total,
      targetFront,
      targetBehind,
      multiplier,
    },
    lifecycle: RNK_CP008_LIFECYCLE,
  };
}

// ---------------------------------------------------------------------------
// Explicit adapters for the CP007 derived-order discovery (Q35 / Q68)
// ---------------------------------------------------------------------------

export interface RnkCp008DerivedOrderAdapterQuestion {
  readonly adapterVersion: typeof RNK_CP008_ADAPTER_CASELET_CLOSURE_VERSION;
  readonly mappedQlId: "RNK-QL-027" | "RNK-QL-028" | "RNK-QL-034" | "RNK-QL-038";
  readonly sourceQuestion: RnkCp007DerivedQuantityQuestion;
  readonly permanentQlAllocated: false;
  readonly lifecycle: typeof RNK_CP008_LIFECYCLE;
}

export function adaptRnkCp007DerivedOrderToExistingQl(
  mode: RnkCp007DerivedQuantityMode,
  seed: number,
  answerIndex: 0 | 1 | 2 | 3 = answerIndexFor(seed, 0x44525644),
): RnkCp008DerivedOrderAdapterQuestion {
  const sourceQuestion = generateRnkCp007DerivedQuantityQuestion(mode, seed, answerIndex);
  let mappedQlId: RnkCp008DerivedOrderAdapterQuestion["mappedQlId"];
  if (sourceQuestion.sourceForm === "SCALED_OBJECT_ORDER") {
    mappedQlId = "RNK-QL-038";
  } else if (mode === "HIGHEST_BALANCE" || mode === "LOWEST_BALANCE") {
    mappedQlId = "RNK-QL-027";
  } else if (mode === "SECOND_HIGHEST_BALANCE") {
    mappedQlId = "RNK-QL-028";
  } else {
    mappedQlId = "RNK-QL-034";
  }
  return {
    adapterVersion: RNK_CP008_ADAPTER_CASELET_CLOSURE_VERSION,
    mappedQlId,
    sourceQuestion,
    permanentQlAllocated: false,
    lifecycle: RNK_CP008_LIFECYCLE,
  };
}

// ---------------------------------------------------------------------------
// Shared ranking caselet assembly — delivery infrastructure, never a new QL
// ---------------------------------------------------------------------------

export interface RnkCp008CaseletClue {
  readonly before: string;
  readonly after: string;
  readonly text: string;
}

export interface RnkCp008CaseletChild {
  readonly mappedQlId: "RNK-QL-027" | "RNK-QL-028" | "RNK-QL-031" | "RNK-QL-033";
  readonly stem: string;
  readonly options: readonly string[];
  readonly correctIndex: 0 | 1 | 2 | 3;
  readonly answer: string;
  readonly explanation: string;
}

export interface RnkCp008SharedCaselet {
  readonly adapterVersion: typeof RNK_CP008_ADAPTER_CASELET_CLOSURE_VERSION;
  readonly infrastructureKind: "SHARED_RANKING_CASELET";
  readonly seed: number;
  readonly context: "MERIT_LIST" | "RACE_FINISH" | "PERFORMANCE_RANKING";
  readonly entities: readonly string[];
  readonly hiddenOrder: readonly string[];
  readonly clues: readonly RnkCp008CaseletClue[];
  readonly children: readonly RnkCp008CaseletChild[];
  readonly permanentQlAllocated: false;
  readonly lifecycle: typeof RNK_CP008_LIFECYCLE;
}

function caseletContext(seed: number): RnkCp008SharedCaselet["context"] {
  const values = ["MERIT_LIST", "RACE_FINISH", "PERFORMANCE_RANKING"] as const;
  return values[mix32(seed ^ 0x434f4e54) % values.length]!;
}

function relationText(
  context: RnkCp008SharedCaselet["context"],
  before: string,
  after: string,
  index: number,
): string {
  if (context === "RACE_FINISH") {
    return index % 2 === 0
      ? `${before} finished ahead of ${after}.`
      : `${after} finished after ${before}.`;
  }
  if (context === "PERFORMANCE_RANKING") {
    return index % 2 === 0
      ? `${before} ranked higher than ${after}.`
      : `${after} ranked below ${before}.`;
  }
  return index % 2 === 0
    ? `${before} is above ${after} in the merit list.`
    : `${after} is below ${before} in the merit list.`;
}

export function solveRnkCp008CaseletOrders(
  entities: readonly string[],
  clues: readonly Pick<RnkCp008CaseletClue, "before" | "after">[],
): readonly (readonly string[])[] {
  return permutations(entities).filter((order) =>
    clues.every((clue) => order.indexOf(clue.before) < order.indexOf(clue.after)),
  );
}

function nameOptions(
  answer: string,
  entities: readonly string[],
  correctIndex: 0 | 1 | 2 | 3,
  salt: number,
): readonly string[] {
  const candidates = entities
    .filter((entity) => entity !== answer)
    .map((entity, index) => ({ entity, key: mix32(salt ^ Math.imul(index + 1, 0x9e3779b1)) }))
    .sort((a, b) => a.key - b.key || a.entity.localeCompare(b.entity))
    .slice(0, 3)
    .map(({ entity }) => entity);
  return placeOptions(answer, candidates, correctIndex) as readonly string[];
}

export function generateRnkCp008SharedCaselet(seed: number): RnkCp008SharedCaselet {
  const people = selectRnkPeople(seed ^ 0x43415345, 6, { genderMode: "BALANCED" });
  const entities = people.map((person) => person.names.en);
  const hiddenOrder = entities
    .map((entity, index) => ({ entity, key: mix32(seed ^ Math.imul(index + 1, 0x4f524445)) }))
    .sort((a, b) => a.key - b.key || a.entity.localeCompare(b.entity))
    .map(({ entity }) => entity);
  const context = caseletContext(seed);
  const rawClues = hiddenOrder.slice(0, -1).map((before, index) => ({
    before,
    after: hiddenOrder[index + 1]!,
    text: relationText(context, before, hiddenOrder[index + 1]!, index),
  }));
  const clues = rawClues
    .map((clue, index) => ({ clue, key: mix32(seed ^ Math.imul(index + 1, 0x434c5545)) }))
    .sort((a, b) => a.key - b.key)
    .map(({ clue }) => clue);
  const resolved = solveRnkCp008CaseletOrders(entities, clues);
  if (resolved.length !== 1 || resolved[0]!.join("|") !== hiddenOrder.join("|")) {
    throw new Error("Shared caselet clue set is not uniquely solvable");
  }
  const orderText = hiddenOrder.join(" > ");
  const child0Index = answerIndexFor(seed, 0x43483030);
  const child1Index = answerIndexFor(seed, 0x43483031);
  const child2Index = answerIndexFor(seed, 0x43483032);
  const child3Index = answerIndexFor(seed, 0x43483033);
  const first = hiddenOrder[0]!;
  const third = hiddenOrder[2]!;
  const pairFirst = hiddenOrder[1]!;
  const pairSecond = hiddenOrder[4]!;
  const neighbourTarget = hiddenOrder[3]!;
  const neighbourAnswer = hiddenOrder[4]!;
  const pairAnswer = pairFirst;
  const pairDistractors = [pairSecond, "Cannot be determined", "Both have the same rank"];
  const children: RnkCp008CaseletChild[] = [
    {
      mappedQlId: "RNK-QL-027",
      stem: context === "RACE_FINISH" ? "Who finished first?" : "Who is ranked first?",
      options: nameOptions(first, entities, child0Index, seed ^ 0x4f303030),
      correctIndex: child0Index,
      answer: first,
      explanation: `The common clues give the unique order ${orderText}. Therefore ${first} is first.`,
    },
    {
      mappedQlId: "RNK-QL-028",
      stem: "Who is third in the order?",
      options: nameOptions(third, entities, child1Index, seed ^ 0x4f303031),
      correctIndex: child1Index,
      answer: third,
      explanation: `The common clues give the unique order ${orderText}. The third position is occupied by ${third}.`,
    },
    {
      mappedQlId: "RNK-QL-031",
      stem: `Who is ranked higher, ${pairFirst} or ${pairSecond}?`,
      options: placeOptions(pairAnswer, pairDistractors, child2Index) as readonly string[],
      correctIndex: child2Index,
      answer: pairAnswer,
      explanation: `The common clues give the unique order ${orderText}. ${pairFirst} appears before ${pairSecond}, so ${pairFirst} is ranked higher.`,
    },
    {
      mappedQlId: "RNK-QL-033",
      stem: `Who is immediately below ${neighbourTarget}?`,
      options: nameOptions(neighbourAnswer, entities, child3Index, seed ^ 0x4f303033),
      correctIndex: child3Index,
      answer: neighbourAnswer,
      explanation: `The common clues give the unique order ${orderText}. ${neighbourAnswer} is immediately below ${neighbourTarget}.`,
    },
  ];
  return {
    adapterVersion: RNK_CP008_ADAPTER_CASELET_CLOSURE_VERSION,
    infrastructureKind: "SHARED_RANKING_CASELET",
    seed,
    context,
    entities,
    hiddenOrder,
    clues,
    children,
    permanentQlAllocated: false,
    lifecycle: RNK_CP008_LIFECYCLE,
  };
}
