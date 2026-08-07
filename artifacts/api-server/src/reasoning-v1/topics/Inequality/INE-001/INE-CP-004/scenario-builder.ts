import { SeededRandom, stableHash } from "../foundation/prng";
import { createComparisonConstraint } from "../foundation/relations";
import type {
  ComparisonConstraint,
  ComparisonRelation,
} from "../foundation/types";
import { getIneCp004PrototypeContract } from "./contracts";
import { evaluateComplementaryPair } from "./complementary";
import type {
  IneCp004ConclusionPair,
  IneCp004PairStatus,
  IneCp004PrototypeId,
  IneCp004Scenario,
} from "./types";

const NAMES = ["A", "B", "C", "D", "P", "Q", "R", "S"] as const;
const RELATIONS: readonly ComparisonRelation[] = [
  "GREATER_THAN",
  "LESS_THAN",
  "EQUAL_TO",
  "GREATER_THAN_OR_EQUAL",
  "LESS_THAN_OR_EQUAL",
];

function c(
  leftId: string,
  relation: ComparisonRelation,
  rightId: string,
  sourceStatementId: string,
): ComparisonConstraint {
  return createComparisonConstraint(
    leftId,
    relation,
    rightId,
    sourceStatementId,
  );
}

function reverseOrientation(
  statement: ComparisonConstraint,
): ComparisonConstraint {
  const relation: ComparisonRelation =
    statement.relation === "GREATER_THAN"
      ? "LESS_THAN"
      : statement.relation === "LESS_THAN"
        ? "GREATER_THAN"
        : statement.relation === "GREATER_THAN_OR_EQUAL"
          ? "LESS_THAN_OR_EQUAL"
          : statement.relation === "LESS_THAN_OR_EQUAL"
            ? "GREATER_THAN_OR_EQUAL"
            : "EQUAL_TO";
  return c(
    statement.rightId,
    relation,
    statement.leftId,
    statement.sourceStatementId,
  );
}

interface BaseGraph {
  baseId: string;
  topologyId: string;
  statements: readonly ComparisonConstraint[];
  query: { leftId: string; rightId: string };
  definiteConclusion: ComparisonConstraint;
}

function baseGraphFor(seed: number): BaseGraph {
  const bases: readonly BaseGraph[] = [
    {
      baseId: "DIRECT_FORWARD_INCLUSIVE",
      topologyId: "DIRECT_GTE_WITH_INDEPENDENT_STRICT",
      statements: [
        c("E1", "GREATER_THAN_OR_EQUAL", "E2", "S1"),
        c("E3", "GREATER_THAN", "E4", "S2"),
      ],
      query: { leftId: "E1", rightId: "E2" },
      definiteConclusion: c("E3", "GREATER_THAN", "E4", "C1"),
    },
    {
      baseId: "DIRECT_REVERSE_INCLUSIVE",
      topologyId: "DIRECT_LTE_WITH_STRICT_CHAIN",
      statements: [
        c("E1", "LESS_THAN_OR_EQUAL", "E2", "S1"),
        c("E3", "GREATER_THAN_OR_EQUAL", "E4", "S2"),
        c("E4", "GREATER_THAN", "E5", "S3"),
      ],
      query: { leftId: "E1", rightId: "E2" },
      definiteConclusion: c("E3", "GREATER_THAN", "E5", "C1"),
    },
    {
      baseId: "SHARED_UPPER_BRANCH",
      topologyId: "SHARED_UPPER_BRANCH_WITH_FREE_ENDPOINTS",
      statements: [
        c("E3", "GREATER_THAN", "E1", "S1"),
        c("E3", "GREATER_THAN", "E2", "S2"),
        c("E4", "GREATER_THAN", "E5", "S3"),
      ],
      query: { leftId: "E1", rightId: "E2" },
      definiteConclusion: c("E4", "GREATER_THAN", "E5", "C1"),
    },
    {
      baseId: "SHARED_LOWER_BRANCH",
      topologyId: "SHARED_LOWER_BRANCH_WITH_EQUALITY_PROOF",
      statements: [
        c("E1", "GREATER_THAN", "E3", "S1"),
        c("E2", "GREATER_THAN", "E3", "S2"),
        c("E4", "EQUAL_TO", "E5", "S3"),
        c("E5", "GREATER_THAN", "E6", "S4"),
      ],
      query: { leftId: "E1", rightId: "E2" },
      definiteConclusion: c("E4", "GREATER_THAN", "E6", "C1"),
    },
    {
      baseId: "INCLUSIVE_THROUGH_EQUALITY",
      topologyId: "GTE_CHAIN_THROUGH_EQUALITY",
      statements: [
        c("E1", "GREATER_THAN_OR_EQUAL", "E3", "S1"),
        c("E3", "EQUAL_TO", "E2", "S2"),
        c("E4", "GREATER_THAN", "E5", "S3"),
      ],
      query: { leftId: "E1", rightId: "E2" },
      definiteConclusion: c("E4", "GREATER_THAN", "E5", "C1"),
    },
    {
      baseId: "REVERSE_INCLUSIVE_THROUGH_EQUALITY",
      topologyId: "LTE_CHAIN_THROUGH_EQUALITY",
      statements: [
        c("E1", "LESS_THAN_OR_EQUAL", "E3", "S1"),
        c("E3", "EQUAL_TO", "E2", "S2"),
        c("E4", "GREATER_THAN_OR_EQUAL", "E5", "S3"),
        c("E5", "GREATER_THAN", "E6", "S4"),
      ],
      query: { leftId: "E1", rightId: "E2" },
      definiteConclusion: c("E4", "GREATER_THAN", "E6", "C1"),
    },
    {
      baseId: "TWO_ARMS_TO_COMMON_BOUND",
      topologyId: "INCLUSIVE_ARMS_TO_COMMON_LOWER_BOUND",
      statements: [
        c("E1", "GREATER_THAN_OR_EQUAL", "E3", "S1"),
        c("E2", "GREATER_THAN_OR_EQUAL", "E3", "S2"),
        c("E4", "GREATER_THAN", "E5", "S3"),
      ],
      query: { leftId: "E1", rightId: "E2" },
      definiteConclusion: c("E4", "GREATER_THAN", "E5", "C1"),
    },
    {
      baseId: "LONG_WEAK_QUERY_CHAIN",
      topologyId: "TWO_EDGE_GTE_QUERY_CHAIN",
      statements: [
        c("E1", "GREATER_THAN_OR_EQUAL", "E3", "S1"),
        c("E3", "GREATER_THAN_OR_EQUAL", "E2", "S2"),
        c("E4", "GREATER_THAN", "E5", "S3"),
      ],
      query: { leftId: "E1", rightId: "E2" },
      definiteConclusion: c("E4", "GREATER_THAN", "E5", "C1"),
    },
    {
      baseId: "THREE_EDGE_GTE_EQUALITY_CHAIN",
      topologyId: "THREE_EDGE_GTE_QUERY_WITH_LONG_STRICT_PROOF",
      statements: [
        c("E1", "GREATER_THAN_OR_EQUAL", "E3", "S1"),
        c("E3", "EQUAL_TO", "E4", "S2"),
        c("E4", "GREATER_THAN_OR_EQUAL", "E2", "S3"),
        c("E4", "GREATER_THAN_OR_EQUAL", "E5", "S4"),
        c("E5", "GREATER_THAN", "E6", "S5"),
      ],
      query: { leftId: "E1", rightId: "E2" },
      definiteConclusion: c("E3", "GREATER_THAN", "E6", "C1"),
    },
    {
      baseId: "LONG_SHARED_UPPER_FREE_ENDPOINTS",
      topologyId: "LONG_SHARED_UPPER_BRANCH_WITH_FREE_ENDPOINTS",
      statements: [
        c("E3", "GREATER_THAN", "E4", "S1"),
        c("E4", "EQUAL_TO", "E5", "S2"),
        c("E5", "GREATER_THAN", "E1", "S3"),
        c("E5", "GREATER_THAN", "E2", "S4"),
        c("E4", "GREATER_THAN", "E6", "S5"),
      ],
      query: { leftId: "E1", rightId: "E2" },
      definiteConclusion: c("E3", "GREATER_THAN", "E2", "C1"),
    },
    {
      baseId: "TWO_LONG_ARMS_TO_COMMON_BOUND",
      topologyId: "TWO_LONG_ARMS_WITH_FREE_ENDPOINTS",
      statements: [
        c("E1", "GREATER_THAN", "E3", "S1"),
        c("E3", "GREATER_THAN_OR_EQUAL", "E5", "S2"),
        c("E2", "GREATER_THAN", "E4", "S3"),
        c("E4", "GREATER_THAN_OR_EQUAL", "E5", "S4"),
        c("E3", "EQUAL_TO", "E4", "S5"),
      ],
      query: { leftId: "E1", rightId: "E2" },
      definiteConclusion: c("E1", "GREATER_THAN", "E5", "C1"),
    },
    {
      baseId: "THREE_EDGE_LTE_EQUALITY_CHAIN",
      topologyId: "THREE_EDGE_LTE_QUERY_WITH_EQUALITY_PROOF",
      statements: [
        c("E1", "LESS_THAN_OR_EQUAL", "E3", "S1"),
        c("E3", "EQUAL_TO", "E4", "S2"),
        c("E4", "LESS_THAN_OR_EQUAL", "E2", "S3"),
        c("E4", "GREATER_THAN_OR_EQUAL", "E5", "S4"),
        c("E5", "GREATER_THAN", "E6", "S5"),
      ],
      query: { leftId: "E1", rightId: "E2" },
      definiteConclusion: c("E3", "GREATER_THAN", "E6", "C1"),
    },
  ];
  return bases[((seed % bases.length) + bases.length) % bases.length]!;
}

function pairKey(pair: IneCp004ConclusionPair): string {
  const key = (entry: ComparisonConstraint) =>
    `${entry.leftId}:${entry.relation}:${entry.rightId}`;
  return `${key(pair.first)}|${key(pair.second)}`;
}

const PAIR_POOL_CACHE = new Map<
  string,
  Readonly<Record<IneCp004PairStatus, readonly IneCp004ConclusionPair[]>>
>();

function pairPool(
  base: BaseGraph,
): Readonly<Record<IneCp004PairStatus, readonly IneCp004ConclusionPair[]>> {
  const cached = PAIR_POOL_CACHE.get(base.baseId);
  if (cached) return cached;
  const candidates: IneCp004ConclusionPair[] = [];
  for (const firstRelation of RELATIONS) {
    for (const secondRelation of RELATIONS) {
      if (firstRelation === secondRelation) continue;
      candidates.push({
        first: c(base.query.leftId, firstRelation, base.query.rightId, "C1"),
        second: c(base.query.leftId, secondRelation, base.query.rightId, "C2"),
      });
    }
  }
  const byStatus: Record<IneCp004PairStatus, IneCp004ConclusionPair[]> = {
    VALID_EITHER_OR: [],
    NOT_EXHAUSTIVE: [],
    NOT_EXCLUSIVE: [],
  };
  for (const pair of candidates) {
    const status = evaluateComplementaryPair(base.statements, pair).status;
    if (status) byStatus[status].push(pair);
  }
  for (const status of Object.keys(byStatus) as IneCp004PairStatus[]) {
    if (byStatus[status].length === 0) {
      throw new Error(`${base.baseId} has no ${status} conclusion pair.`);
    }
  }
  PAIR_POOL_CACHE.set(base.baseId, byStatus);
  return byStatus;
}

function maybeReverseSecond(
  pair: IneCp004ConclusionPair,
  reverse: boolean,
): IneCp004ConclusionPair {
  return reverse
    ? { first: pair.first, second: reverseOrientation(pair.second) }
    : pair;
}

function pickValidPair(
  base: BaseGraph,
  pairs: readonly IneCp004ConclusionPair[],
  random: SeededRandom,
): IneCp004ConclusionPair {
  const domain = evaluateComplementaryPair(
    base.statements,
    pairs[0]!,
  ).validAtomicRelations;
  const preferred = pairs.filter((pair) => {
    const relations = [pair.first.relation, pair.second.relation];
    if (domain.length === 2) {
      return (
        relations.includes("EQUAL_TO") &&
        relations.some(
          (relation) => relation === "GREATER_THAN" || relation === "LESS_THAN",
        )
      );
    }
    return (
      relations.some(
        (relation) => relation === "GREATER_THAN" || relation === "LESS_THAN",
      ) &&
      relations.some(
        (relation) =>
          relation === "GREATER_THAN_OR_EQUAL" ||
          relation === "LESS_THAN_OR_EQUAL",
      )
    );
  });
  return random.pick(preferred.length > 0 ? preferred : pairs);
}

function namesFor(
  entityIds: readonly string[],
  random: SeededRandom,
): Readonly<Record<string, string>> {
  const names = random.shuffle(NAMES).slice(0, entityIds.length);
  return Object.fromEntries(
    entityIds.map((entityId, index) => [entityId, names[index]!]),
  );
}

export function buildIneCp004Scenario(
  prototypeId: IneCp004PrototypeId,
  seed: number,
): IneCp004Scenario {
  const contract = getIneCp004PrototypeContract(prototypeId);
  const base = baseGraphFor(seed);
  const pool = pairPool(base);
  const random = new SeededRandom(
    seed ^ Number.parseInt(stableHash([prototypeId, "scenario-v2"]), 16),
  );
  let conclusions: readonly ComparisonConstraint[] = [];
  let candidatePairs: readonly IneCp004ConclusionPair[] | undefined;
  let expectedPairStatus: IneCp004PairStatus | undefined;

  if (contract.taskKind === "CLASSIFY_PAIR") {
    const statuses: readonly IneCp004PairStatus[] = [
      "VALID_EITHER_OR",
      "NOT_EXHAUSTIVE",
      "NOT_EXCLUSIVE",
    ];
    expectedPairStatus = statuses[((seed % 3) + 3) % 3]!;
    const pair = maybeReverseSecond(
      expectedPairStatus === "VALID_EITHER_OR"
        ? pickValidPair(base, pool.VALID_EITHER_OR, random)
        : random.pick(pool[expectedPairStatus]),
      Math.abs(seed) % 2 === 1,
    );
    conclusions = [pair.first, pair.second];
  } else if (contract.taskKind === "SELECT_PAIR") {
    const selected = [
      pickValidPair(base, pool.VALID_EITHER_OR, random),
      ...random.shuffle(pool.NOT_EXHAUSTIVE).slice(0, 2),
      random.pick(pool.NOT_EXCLUSIVE),
    ];
    const seen = new Set<string>();
    candidatePairs = random
      .shuffle(selected)
      .filter((pair) => {
        const key = pairKey(pair);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((pair, index) => maybeReverseSecond(pair, (seed + index) % 2 === 1));
    if (candidatePairs.length !== 4) {
      throw new Error(`${base.baseId} could not build four unique pairs.`);
    }
  } else {
    const pair = maybeReverseSecond(
      pickValidPair(base, pool.VALID_EITHER_OR, random),
      Math.abs(seed) % 2 === 1,
    );
    conclusions =
      contract.taskKind === "EVALUATE_THREE_CONCLUSIONS"
        ? [base.definiteConclusion, pair.first, pair.second]
        : [pair.first, pair.second];
  }

  const orientRandom = new SeededRandom(
    seed ^ Number.parseInt(stableHash([prototypeId, "orientation-v1"]), 16),
  );
  const orient = (statement: ComparisonConstraint): ComparisonConstraint =>
    orientRandom.int(2) === 0 ? statement : reverseOrientation(statement);
  const statements = random.shuffle(base.statements.map(orient));
  conclusions = conclusions.map(orient);
  candidatePairs = candidatePairs?.map((pair) => ({
    first: orient(pair.first),
    second: orient(pair.second),
  }));
  const entityIds = [
    ...new Set([
      ...statements.flatMap((entry) => [entry.leftId, entry.rightId]),
      ...conclusions.flatMap((entry) => [entry.leftId, entry.rightId]),
      ...(candidatePairs?.flatMap((pair) => [
        pair.first.leftId,
        pair.first.rightId,
        pair.second.leftId,
        pair.second.rightId,
      ]) ?? []),
    ]),
  ].sort();

  return {
    scenarioId: `${base.baseId}_${contract.taskKind}_${expectedPairStatus ?? "EITHER_OR"}`,
    topologyId: base.topologyId,
    taskKind: contract.taskKind,
    statements,
    conclusions,
    candidatePairs,
    expectedPairStatus,
    entityNames: namesFor(entityIds, random),
  };
}
