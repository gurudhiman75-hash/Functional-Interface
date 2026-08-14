import {
  generateRnkCp008RelationalSideCountQuestion as generateV1RelationalSideCountQuestion,
  routeRnkCp008NumericConstraintRankQuery as routeV1NumericConstraintRankQuery,
  type RnkCp008NumericConstraintSolution,
  type RnkCp008NumericRankQuery,
  type RnkCp008RelationalSideCountQuestion,
} from "./cp008-adapter-caselet-closure-v1";

export * from "./cp008-adapter-caselet-closure-v1";

export const RNK_CP008_ADAPTER_CASELET_CLOSURE_V1_1 =
  "RNK_CP008_ADAPTER_CASELET_CLOSURE_V1_1" as const;

/**
 * V1 accidentally kept the total population only in normalizedState.
 * The Q66-style equation therefore lacked enough learner-visible evidence.
 * V1.1 preserves the ownership decision but makes the numeric anchor explicit
 * in the stem, so the displayed evidence alone determines x.
 */
export function generateRnkCp008RelationalSideCountQuestionV1_1(
  seed: number,
): RnkCp008RelationalSideCountQuestion {
  const base = generateV1RelationalSideCountQuestion(seed);
  const sourceMatch = base.stem.match(/ahead of ([^ ]+)/);
  const targetMatch = base.stem.match(/ahead of ([^ ]+) is equal/);
  const source = sourceMatch?.[1] ?? "the first person";
  const target = targetMatch?.[1] ?? "the second person";
  const { total, multiplier } = base.normalizedState;

  return {
    ...base,
    stem: `In a queue of ${total} people, the number of people ahead of ${source} is ${multiplier} times the number behind ${source}. The number of people ahead of ${target} is equal to the number behind ${source}. How many people are behind ${target}?`,
  };
}

export interface RnkCp008NumericRankRouteV1_1 {
  readonly adapterVersion: typeof RNK_CP008_ADAPTER_CASELET_CLOSURE_V1_1;
  readonly mappedQlId:
    | "RNK-QL-028"
    | "RNK-QL-029"
    | "RNK-QL-030"
    | "RNK-QL-031"
    | "RNK-QL-036"
    | "RNK-QL-038";
  readonly answer: string | number | readonly string[];
  readonly normalizedOrderCount: number;
  readonly permanentQlAllocated: false;
}

/**
 * V1 correctly routed exact-rank invariants in multi-order states to QL038,
 * but an invariant pair relation in several valid orders is a relation-truth
 * question and belongs to QL036. V1.1 makes that ownership boundary explicit.
 */
export function routeRnkCp008NumericConstraintRankQueryV1_1(
  solution: RnkCp008NumericConstraintSolution,
  query: RnkCp008NumericRankQuery,
): RnkCp008NumericRankRouteV1_1 {
  const orders = solution.uniqueOrdersFromHighest;
  if (query.kind === "RELATIVE_ORDER" && orders.length > 1) {
    const relations = new Set(orders.map((order) =>
      order.indexOf(query.first) < order.indexOf(query.second)
        ? "FIRST_ABOVE"
        : "SECOND_ABOVE",
    ));
    if (relations.size !== 1) throw new Error("Pair relation is not invariant");
    return {
      adapterVersion: RNK_CP008_ADAPTER_CASELET_CLOSURE_V1_1,
      mappedQlId: "RNK-QL-036",
      answer: [...relations][0]!,
      normalizedOrderCount: orders.length,
      permanentQlAllocated: false,
    };
  }

  const base = routeV1NumericConstraintRankQuery(solution, query);
  return {
    ...base,
    adapterVersion: RNK_CP008_ADAPTER_CASELET_CLOSURE_V1_1,
  };
}
