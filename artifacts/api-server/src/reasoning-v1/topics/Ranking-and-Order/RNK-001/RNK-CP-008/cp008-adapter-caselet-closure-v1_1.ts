import { selectRnkPeople } from "../foundation/rnk-object-pool-v2";
import {
  generateRnkCp008RelationalSideCountQuestion as generateV1RelationalSideCountQuestion,
  generateRnkCp008SharedCaselet as generateV1SharedCaselet,
  routeRnkCp008NumericConstraintRankQuery as routeV1NumericConstraintRankQuery,
  type RnkCp008NumericConstraintSolution,
  type RnkCp008NumericRankQuery,
  type RnkCp008RelationalSideCountQuestion,
  type RnkCp008SharedCaselet,
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
  const people = selectRnkPeople(seed ^ 0x51463636, 2, { genderMode: "BALANCED" });
  const source = people[0]!.names.en;
  const target = people[1]!.names.en;
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
 * but pair-relation status in several valid orders belongs to QL036.
 * V1.1 covers first-above, second-above and indeterminate pair status.
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
    return {
      adapterVersion: RNK_CP008_ADAPTER_CASELET_CLOSURE_V1_1,
      mappedQlId: "RNK-QL-036",
      answer: relations.size === 1 ? [...relations][0]! : "INDETERMINATE",
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

/**
 * Shared passages do not own QLs. V1.1 only adapts the child wording to the
 * selected context while retaining the existing child QL identities.
 */
export function generateRnkCp008SharedCaseletV1_1(seed: number): RnkCp008SharedCaselet {
  const base = generateV1SharedCaselet(seed);
  const second = base.hiddenOrder[1]!;
  const third = base.hiddenOrder[2]!;
  const fifth = base.hiddenOrder[4]!;
  const fourth = base.hiddenOrder[3]!;

  const children = base.children.map((child) => {
    if (child.mappedQlId === "RNK-QL-028") {
      const stem = base.context === "RACE_FINISH"
        ? "Who finished third?"
        : base.context === "MERIT_LIST"
          ? "Who is third in the merit list?"
          : "Who is ranked third for performance?";
      return { ...child, stem };
    }
    if (child.mappedQlId === "RNK-QL-031") {
      const stem = base.context === "RACE_FINISH"
        ? `Who finished ahead, ${second} or ${fifth}?`
        : `Who is ranked higher, ${second} or ${fifth}?`;
      return { ...child, stem };
    }
    if (child.mappedQlId === "RNK-QL-033") {
      const stem = base.context === "RACE_FINISH"
        ? `Who finished immediately after ${fourth}?`
        : base.context === "MERIT_LIST"
          ? `Who is immediately below ${fourth} in the merit list?`
          : `Who is ranked immediately below ${fourth} for performance?`;
      return { ...child, stem };
    }
    return child;
  });

  if (children[1]?.answer !== third) {
    throw new Error("Caselet third-position child lost its canonical answer");
  }

  return { ...base, children };
}
