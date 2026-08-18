import { evaluateFiniteDomainPair } from "../../../foundation/index.ts";
import type { SufficiencyClass, TwoStatementSufficiencyEvaluation } from "../../../foundation/index.ts";
import { exactRankSet } from "../../../../../Ranking-and-Order/RNK-001/RNK-CP-007/cp007-partial-order-position-adapter-v1.ts";

export const DSF_RNK_PROTOTYPE_IDS = [
  "DSF-RNK-PROT-I-ONLY",
  "DSF-RNK-PROT-II-ONLY",
  "DSF-RNK-PROT-EACH-ALONE",
  "DSF-RNK-PROT-BOTH-ONLY",
  "DSF-RNK-PROT-NEITHER",
] as const;

export type DsfRnkPrototypeId = (typeof DSF_RNK_PROTOTYPE_IDS)[number];

interface RankingComparison {
  readonly higher: string;
  readonly lower: string;
}

interface RankingStatement {
  readonly id: string;
  readonly text: string;
  readonly comparisons: readonly RankingComparison[];
}

interface RankingProblem {
  readonly entities: readonly string[];
  readonly targetEntity: string;
  readonly targetKind: "RANK_FROM_TOP";
}

interface RankingPrototypeSpec {
  readonly prototypeId: DsfRnkPrototypeId;
  readonly statementI: RankingStatement;
  readonly statementII: RankingStatement;
  readonly expectedClass: SufficiencyClass;
}

export interface RankingDsPrototypeResult {
  readonly prototypeId: DsfRnkPrototypeId;
  readonly permanentQlId: null;
  readonly sourceChapter: "Ranking and Order";
  readonly sourceCapability: "RNK-CP-007/exactRankSet";
  readonly statementI: RankingStatement;
  readonly statementII: RankingStatement;
  readonly evaluation: TwoStatementSufficiencyEvaluation<number>;
}

const problem: RankingProblem = {
  entities: ["A", "B", "C", "D"],
  targetEntity: "A",
  targetKind: "RANK_FROM_TOP",
};

function comparison(higher: string, lower: string): RankingComparison {
  return { higher, lower };
}

function statement(id: string, comparisons: readonly RankingComparison[]): RankingStatement {
  return {
    id,
    comparisons,
    text: comparisons.map((item) => `${item.higher} ranks above ${item.lower}`).join("; ") + ".",
  };
}

const A_ABOVE_B = statement("A_ABOVE_B", [comparison("A", "B")]);
const A_ABOVE_C = statement("A_ABOVE_C", [comparison("A", "C")]);
const A_ABOVE_C_D = statement("A_ABOVE_C_D", [comparison("A", "C"), comparison("A", "D")]);
const A_ABOVE_ALL = statement("A_ABOVE_ALL", [comparison("A", "B"), comparison("A", "C"), comparison("A", "D")]);
const ALT_A_TOP = statement("ALT_A_TOP", [comparison("A", "B"), comparison("A", "C"), comparison("B", "D")]);

const SPECS: readonly RankingPrototypeSpec[] = [
  {
    prototypeId: "DSF-RNK-PROT-I-ONLY",
    statementI: A_ABOVE_ALL,
    statementII: A_ABOVE_B,
    expectedClass: "STATEMENT_I_ONLY",
  },
  {
    prototypeId: "DSF-RNK-PROT-II-ONLY",
    statementI: A_ABOVE_B,
    statementII: A_ABOVE_ALL,
    expectedClass: "STATEMENT_II_ONLY",
  },
  {
    prototypeId: "DSF-RNK-PROT-EACH-ALONE",
    statementI: A_ABOVE_ALL,
    statementII: ALT_A_TOP,
    expectedClass: "EACH_STATEMENT_ALONE",
  },
  {
    prototypeId: "DSF-RNK-PROT-BOTH-ONLY",
    statementI: A_ABOVE_B,
    statementII: A_ABOVE_C_D,
    expectedClass: "BOTH_TOGETHER_ONLY",
  },
  {
    prototypeId: "DSF-RNK-PROT-NEITHER",
    statementI: A_ABOVE_B,
    statementII: A_ABOVE_C,
    expectedClass: "INSUFFICIENT_EVEN_TOGETHER",
  },
];

function permutations(values: readonly string[]): readonly (readonly string[])[] {
  if (values.length <= 1) return [values];
  const result: string[][] = [];
  for (let index = 0; index < values.length; index += 1) {
    const head = values[index]!;
    const tail = [...values.slice(0, index), ...values.slice(index + 1)];
    for (const remainder of permutations(tail)) result.push([head, ...remainder]);
  }
  return result;
}

function holds(order: readonly string[], statementValue: RankingStatement): boolean {
  const index = new Map(order.map((entity, position) => [entity, position]));
  return statementValue.comparisons.every((item) => index.get(item.higher)! < index.get(item.lower)!);
}

const adapter = {
  adapterId: "DSF-ADAPTER-RANKING-ORDER-PROTOTYPE-V1",
  domainFamily: "REASONING" as const,
  sourceChapterId: "RNK-001",
  enumerateBaseWorlds(input: RankingProblem): readonly (readonly string[])[] {
    return permutations(input.entities);
  },
  statementHolds(_problem: RankingProblem, order: readonly string[], statementValue: RankingStatement): boolean {
    return holds(order, statementValue);
  },
  evaluateTarget(input: RankingProblem, order: readonly string[]): number {
    const index = order.indexOf(input.targetEntity);
    if (index < 0) throw new Error(`Target entity ${input.targetEntity} is missing from order.`);
    return index + 1;
  },
  normalizeAnswer(answer: number): string {
    return String(answer);
  },
};

function specFor(prototypeId: DsfRnkPrototypeId): RankingPrototypeSpec {
  const spec = SPECS.find((candidate) => candidate.prototypeId === prototypeId);
  if (!spec) throw new Error(`Unknown DSF Ranking prototype: ${prototypeId}`);
  return spec;
}

function sourceRankKeys(orders: readonly (readonly string[])[]): readonly string[] {
  return exactRankSet(orders, problem.targetEntity).map(String);
}

export function runRankingDsPrototype(prototypeId: DsfRnkPrototypeId): RankingDsPrototypeResult {
  const spec = specFor(prototypeId);
  const baseOrders = adapter.enumerateBaseWorlds(problem);
  const ordersI = baseOrders.filter((order) => holds(order, spec.statementI));
  const ordersII = baseOrders.filter((order) => holds(order, spec.statementII));
  const ordersTogether = baseOrders.filter((order) => holds(order, spec.statementI) && holds(order, spec.statementII));
  const evaluation = evaluateFiniteDomainPair(adapter, problem, spec.statementI, spec.statementII);

  if (evaluation.classification !== spec.expectedClass) {
    throw new Error(`${prototypeId} classified as ${evaluation.classification}; expected ${spec.expectedClass}.`);
  }
  if (sourceRankKeys(ordersI).join("|") !== evaluation.statementI.normalizedTargetAnswers.join("|")) {
    throw new Error(`${prototypeId} Statement I disagrees with RNK-CP-007 exactRankSet.`);
  }
  if (sourceRankKeys(ordersII).join("|") !== evaluation.statementII.normalizedTargetAnswers.join("|")) {
    throw new Error(`${prototypeId} Statement II disagrees with RNK-CP-007 exactRankSet.`);
  }
  if (sourceRankKeys(ordersTogether).join("|") !== evaluation.together.normalizedTargetAnswers.join("|")) {
    throw new Error(`${prototypeId} conjunction disagrees with RNK-CP-007 exactRankSet.`);
  }

  return {
    prototypeId,
    permanentQlId: null,
    sourceChapter: "Ranking and Order",
    sourceCapability: "RNK-CP-007/exactRankSet",
    statementI: spec.statementI,
    statementII: spec.statementII,
    evaluation,
  };
}

export function buildRankingDsDiscoveryCorpus(): readonly RankingDsPrototypeResult[] {
  return DSF_RNK_PROTOTYPE_IDS.map(runRankingDsPrototype);
}
