import { evaluateConclusion } from "../foundation/conclusion-evaluator";
import { SeededRandom, stableHash } from "../foundation/prng";
import { createComparisonConstraint } from "../foundation/relations";
import type {
  ComparisonConstraint,
  ComparisonRelation,
  ConclusionTruth,
} from "../foundation/types";
import { getIneCp003PrototypeContract } from "./contracts";
import type {
  IneCp003ConclusionMask,
  IneCp003PrototypeId,
  IneCp003Scenario,
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
  relationQuery: { leftId: string; rightId: string };
}

function baseGraphFor(seed: number): BaseGraph {
  const variant = ((seed % 12) + 12) % 12;
  const bases: readonly BaseGraph[] = [
    {
      baseId: "INCLUSIVE_STRICT_CHAIN",
      topologyId: "INCLUSIVE_THEN_STRICT_CHAIN",
      statements: [
        c("E1", "GREATER_THAN_OR_EQUAL", "E2", "S1"),
        c("E2", "GREATER_THAN", "E3", "S2"),
      ],
      relationQuery: { leftId: "E1", rightId: "E2" },
    },
    {
      baseId: "SHARED_UPPER_AND_LOWER_BRANCHES",
      topologyId: "BRANCHES_WITH_SHARED_BOUNDS",
      statements: [
        c("E1", "GREATER_THAN", "E2", "S1"),
        c("E1", "GREATER_THAN", "E3", "S2"),
        c("E2", "GREATER_THAN_OR_EQUAL", "E4", "S3"),
        c("E3", "GREATER_THAN", "E4", "S4"),
      ],
      relationQuery: { leftId: "E2", rightId: "E3" },
    },
    {
      baseId: "EQUALITY_INSIDE_CHAIN",
      topologyId: "EQUALITY_AND_STRICT_CHAIN",
      statements: [
        c("E1", "EQUAL_TO", "E2", "S1"),
        c("E2", "GREATER_THAN_OR_EQUAL", "E3", "S2"),
        c("E3", "GREATER_THAN", "E4", "S3"),
      ],
      relationQuery: { leftId: "E1", rightId: "E2" },
    },
    {
      baseId: "LONG_INCLUSIVE_STRICT_CHAIN",
      topologyId: "FOUR_NODE_MIXED_CHAIN",
      statements: [
        c("E1", "GREATER_THAN_OR_EQUAL", "E2", "S1"),
        c("E2", "EQUAL_TO", "E3", "S2"),
        c("E3", "GREATER_THAN", "E4", "S3"),
      ],
      relationQuery: { leftId: "E1", rightId: "E4" },
    },
    {
      baseId: "TWO_CONFIRMING_ROUTES",
      topologyId: "DIAMOND_WITH_MIXED_STRICTNESS",
      statements: [
        c("E1", "GREATER_THAN_OR_EQUAL", "E2", "S1"),
        c("E2", "GREATER_THAN", "E4", "S2"),
        c("E1", "GREATER_THAN", "E3", "S3"),
        c("E3", "GREATER_THAN_OR_EQUAL", "E4", "S4"),
      ],
      relationQuery: { leftId: "E2", rightId: "E3" },
    },
    {
      baseId: "CHAIN_WITH_DISCONNECTED_EDGE",
      topologyId: "CHAIN_PLUS_DISCONNECTED_COMPONENT",
      statements: [
        c("E1", "GREATER_THAN_OR_EQUAL", "E2", "S1"),
        c("E2", "GREATER_THAN", "E3", "S2"),
        c("E4", "GREATER_THAN", "E5", "S3"),
      ],
      relationQuery: { leftId: "E1", rightId: "E4" },
    },
    {
      baseId: "FIVE_STEP_CHAIN_WITH_SIDE_EDGE",
      topologyId: "FIVE_STEP_CHAIN_WITH_IRRELEVANT_EDGE",
      statements: [
        c("E1", "GREATER_THAN_OR_EQUAL", "E2", "S1"),
        c("E2", "EQUAL_TO", "E3", "S2"),
        c("E3", "GREATER_THAN", "E4", "S3"),
        c("E4", "GREATER_THAN_OR_EQUAL", "E5", "S4"),
        c("E6", "LESS_THAN", "E2", "S5"),
      ],
      relationQuery: { leftId: "E1", rightId: "E5" },
    },
    {
      baseId: "EQUALITY_START_WITH_BRANCH",
      topologyId: "EQUALITY_AT_START_WITH_CONVERGING_BRANCH",
      statements: [
        c("E1", "EQUAL_TO", "E2", "S1"),
        c("E2", "GREATER_THAN_OR_EQUAL", "E3", "S2"),
        c("E3", "GREATER_THAN", "E4", "S3"),
        c("E2", "GREATER_THAN", "E5", "S4"),
        c("E5", "GREATER_THAN_OR_EQUAL", "E4", "S5"),
      ],
      relationQuery: { leftId: "E3", rightId: "E5" },
    },
    {
      baseId: "EQUALITY_END_WITH_IRRELEVANT_COMPONENT",
      topologyId: "LONG_CHAIN_EQUALITY_AT_END",
      statements: [
        c("E1", "GREATER_THAN", "E2", "S1"),
        c("E2", "GREATER_THAN_OR_EQUAL", "E3", "S2"),
        c("E3", "GREATER_THAN_OR_EQUAL", "E4", "S3"),
        c("E4", "EQUAL_TO", "E5", "S4"),
        c("E6", "GREATER_THAN", "E7", "S5"),
      ],
      relationQuery: { leftId: "E1", rightId: "E5" },
    },
    {
      baseId: "TWO_INDEPENDENT_CHAINS",
      topologyId: "TWO_INDEPENDENT_CHAINS",
      statements: [
        c("E1", "GREATER_THAN", "E2", "S1"),
        c("E2", "GREATER_THAN_OR_EQUAL", "E3", "S2"),
        c("E4", "EQUAL_TO", "E5", "S3"),
        c("E5", "GREATER_THAN", "E6", "S4"),
      ],
      relationQuery: { leftId: "E3", rightId: "E4" },
    },
    {
      baseId: "CONVERGING_BRANCH_TO_TAIL",
      topologyId: "CONVERGING_BRANCH_WITH_TAIL",
      statements: [
        c("E1", "GREATER_THAN_OR_EQUAL", "E2", "S1"),
        c("E1", "GREATER_THAN", "E3", "S2"),
        c("E2", "GREATER_THAN", "E4", "S3"),
        c("E3", "GREATER_THAN_OR_EQUAL", "E4", "S4"),
        c("E4", "GREATER_THAN_OR_EQUAL", "E5", "S5"),
      ],
      relationQuery: { leftId: "E2", rightId: "E3" },
    },
    {
      baseId: "LONG_WEAK_CHAIN_WITH_STRICT_BRANCH",
      topologyId: "LONG_INCLUSIVE_CHAIN_WITH_SIDE_BRANCH",
      statements: [
        c("E1", "GREATER_THAN_OR_EQUAL", "E2", "S1"),
        c("E2", "GREATER_THAN_OR_EQUAL", "E3", "S2"),
        c("E3", "EQUAL_TO", "E4", "S3"),
        c("E4", "GREATER_THAN_OR_EQUAL", "E5", "S4"),
        c("E6", "GREATER_THAN", "E2", "S5"),
      ],
      relationQuery: { leftId: "E1", rightId: "E5" },
    },
  ];
  const selected = bases[variant]!;
  if (Math.floor(Math.abs(seed) / 6) % 2 === 0) return selected;
  return {
    ...selected,
    relationQuery: {
      leftId: selected.relationQuery.rightId,
      rightId: selected.relationQuery.leftId,
    },
  };
}

function unorderedPairKey(conclusion: ComparisonConstraint): string {
  return [conclusion.leftId, conclusion.rightId].sort().join(":");
}

function selectTwoConclusions(
  statements: readonly ComparisonConstraint[],
  mask: IneCp003ConclusionMask,
  random: SeededRandom,
  seed: number,
): readonly ComparisonConstraint[] {
  const pool = conclusionPool(statements);
  const nonFollowingTruth: ConclusionTruth =
    Math.abs(seed) % 2 === 0 ? "POSSIBLY_TRUE" : "IMPOSSIBLE";
  const desiredTruths: readonly ConclusionTruth[] =
    mask === "ONLY_I"
      ? ["DEFINITELY_TRUE", nonFollowingTruth]
      : mask === "ONLY_II"
        ? [nonFollowingTruth, "DEFINITELY_TRUE"]
        : mask === "BOTH"
          ? ["DEFINITELY_TRUE", "DEFINITELY_TRUE"]
          : [nonFollowingTruth, nonFollowingTruth];
  const selected: Array<{
    conclusion: ComparisonConstraint;
    truth: ConclusionTruth;
  }> = [];

  for (const truth of desiredTruths) {
    const usedKeys = new Set(
      selected.map((entry) => canonicalConclusionKey(entry.conclusion)),
    );
    const usedPairs = new Set(
      selected.map((entry) => unorderedPairKey(entry.conclusion)),
    );
    const matching = pool.filter(
      (candidate) =>
        candidate.truth === truth &&
        !usedKeys.has(canonicalConclusionKey(candidate.conclusion)),
    );
    const differentPair = matching.filter(
      (candidate) => !usedPairs.has(unorderedPairKey(candidate.conclusion)),
    );
    if (matching.length === 0) {
      throw new Error(`No ${truth} conclusion is available for ${mask}.`);
    }
    selected.push(
      random.pick(differentPair.length > 0 ? differentPair : matching),
    );
  }

  return selected.map((entry, index) => ({
    ...entry.conclusion,
    sourceStatementId: `C${index + 1}`,
  }));
}

function canonicalConclusionKey(conclusion: ComparisonConstraint): string {
  let left = conclusion.leftId;
  let right = conclusion.rightId;
  let relation = conclusion.relation;
  if (relation === "LESS_THAN") {
    [left, right] = [right, left];
    relation = "GREATER_THAN";
  } else if (relation === "LESS_THAN_OR_EQUAL") {
    [left, right] = [right, left];
    relation = "GREATER_THAN_OR_EQUAL";
  } else if (relation === "EQUAL_TO" && right < left) {
    [left, right] = [right, left];
  }
  return `${left}:${relation}:${right}`;
}

function conclusionPool(statements: readonly ComparisonConstraint[]): Array<{
  conclusion: ComparisonConstraint;
  truth: ConclusionTruth;
}> {
  const entities = [
    ...new Set(
      statements.flatMap((statement) => [statement.leftId, statement.rightId]),
    ),
  ].sort();
  const seen = new Set<string>();
  const pool: Array<{
    conclusion: ComparisonConstraint;
    truth: ConclusionTruth;
  }> = [];
  for (let leftIndex = 0; leftIndex < entities.length; leftIndex += 1) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < entities.length;
      rightIndex += 1
    ) {
      for (const relation of RELATIONS) {
        const conclusion = c(
          entities[leftIndex]!,
          relation,
          entities[rightIndex]!,
          "C-POOL",
        );
        const key = canonicalConclusionKey(conclusion);
        if (seen.has(key)) continue;
        seen.add(key);
        pool.push({
          conclusion,
          truth: evaluateConclusion(statements, conclusion).truth,
        });
      }
    }
  }
  return pool;
}

function directlyCompared(
  statements: readonly ComparisonConstraint[],
  conclusion: ComparisonConstraint,
): boolean {
  return statements.some(
    (statement) =>
      (statement.leftId === conclusion.leftId &&
        statement.rightId === conclusion.rightId) ||
      (statement.leftId === conclusion.rightId &&
        statement.rightId === conclusion.leftId),
  );
}

function chooseOne(
  pool: readonly { conclusion: ComparisonConstraint; truth: ConclusionTruth }[],
  truth: ConclusionTruth,
  random: SeededRandom,
  statements: readonly ComparisonConstraint[],
  avoidDirect = false,
): { conclusion: ComparisonConstraint; truth: ConclusionTruth } {
  const matching = pool.filter(
    (candidate) =>
      candidate.truth === truth &&
      (!avoidDirect || !directlyCompared(statements, candidate.conclusion)),
  );
  const fallback = pool.filter((candidate) => candidate.truth === truth);
  return random.pick(matching.length > 0 ? matching : fallback);
}

function selectConclusions(
  statements: readonly ComparisonConstraint[],
  targetTruth: ConclusionTruth,
  random: SeededRandom,
): readonly ComparisonConstraint[] {
  const pool = conclusionPool(statements);
  const desiredTruths: readonly ConclusionTruth[] =
    targetTruth === "DEFINITELY_TRUE"
      ? ["DEFINITELY_TRUE", "POSSIBLY_TRUE", "POSSIBLY_TRUE", "IMPOSSIBLE"]
      : targetTruth === "POSSIBLY_TRUE"
        ? ["POSSIBLY_TRUE", "DEFINITELY_TRUE", "DEFINITELY_TRUE", "IMPOSSIBLE"]
        : ["IMPOSSIBLE", "DEFINITELY_TRUE", "DEFINITELY_TRUE", "POSSIBLY_TRUE"];
  const selected: Array<{
    conclusion: ComparisonConstraint;
    truth: ConclusionTruth;
  }> = [];
  for (const truth of desiredTruths) {
    const used = new Set(
      selected.map((candidate) => canonicalConclusionKey(candidate.conclusion)),
    );
    const available = pool.filter(
      (candidate) => !used.has(canonicalConclusionKey(candidate.conclusion)),
    );
    const candidate = chooseOne(
      available,
      truth,
      random,
      statements,
      truth === targetTruth,
    );
    selected.push(candidate);
  }
  return random.shuffle(selected).map((candidate, index) => ({
    ...candidate.conclusion,
    sourceStatementId: `C${index + 1}`,
  }));
}

function classifyConclusion(
  statements: readonly ComparisonConstraint[],
  desiredTruth: ConclusionTruth,
  random: SeededRandom,
  inclusiveOnly: boolean,
): ComparisonConstraint {
  const pool = conclusionPool(statements).filter(
    (candidate) =>
      candidate.truth === desiredTruth &&
      (!inclusiveOnly ||
        candidate.conclusion.relation === "GREATER_THAN_OR_EQUAL" ||
        candidate.conclusion.relation === "LESS_THAN_OR_EQUAL"),
  );
  if (pool.length === 0) {
    throw new Error(`No ${desiredTruth} conclusion is available.`);
  }
  const inferred = pool.filter(
    (candidate) => !directlyCompared(statements, candidate.conclusion),
  );
  return {
    ...random.pick(inferred.length > 0 ? inferred : pool).conclusion,
    sourceStatementId: "C1",
  };
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

export function buildIneCp003Scenario(
  prototypeId: IneCp003PrototypeId,
  seed: number,
): IneCp003Scenario {
  const contract = getIneCp003PrototypeContract(prototypeId);
  const base = baseGraphFor(seed);
  const random = new SeededRandom(
    seed ^ Number.parseInt(stableHash([prototypeId, "scenario-v1"]), 16),
  );
  const desiredTruth = ["DEFINITELY_TRUE", "POSSIBLY_TRUE", "IMPOSSIBLE"][
    ((seed % 3) + 3) % 3
  ] as ConclusionTruth;
  let conclusions: readonly ComparisonConstraint[] = [];
  let query: IneCp003Scenario["query"];
  let targetTruth = contract.targetTruth;
  let explanationKind: IneCp003Scenario["explanationKind"];

  if (contract.taskKind === "SELECT_CONCLUSION") {
    conclusions = selectConclusions(
      base.statements,
      contract.targetTruth!,
      random,
    );
    explanationKind = "CONCLUSION_AUDIT";
  } else if (contract.taskKind === "SELECT_RELATION_SET") {
    query = base.relationQuery;
    explanationKind = "POSSIBLE_RELATION_SET";
  } else if (contract.taskKind === "EVALUATE_CONCLUSION_SET") {
    const masks: readonly IneCp003ConclusionMask[] = [
      "ONLY_I",
      "ONLY_II",
      "NEITHER",
      "BOTH",
    ];
    const mask = masks[((seed % masks.length) + masks.length) % masks.length]!;
    conclusions = selectTwoConclusions(base.statements, mask, random, seed);
    explanationKind = "CONCLUSION_SET_AUDIT";
  } else {
    const inclusiveOnly =
      prototypeId === "INE-CP003-PROT-EVALUATE-INCLUSIVE-CONCLUSION";
    conclusions = [
      classifyConclusion(base.statements, desiredTruth, random, inclusiveOnly),
    ];
    targetTruth = desiredTruth;
    explanationKind = inclusiveOnly
      ? "INCLUSIVE_TRUTH_CLASSIFICATION"
      : "TRUTH_CLASSIFICATION";
  }

  const orientationRandom = new SeededRandom(
    seed ^ Number.parseInt(stableHash([prototypeId, "orientation-v1"]), 16),
  );
  const orient = (statement: ComparisonConstraint): ComparisonConstraint =>
    orientationRandom.int(2) === 0 ? statement : reverseOrientation(statement);
  const statements = random.shuffle(base.statements.map(orient));
  conclusions = conclusions.map(orient);
  const entityIds = [
    ...new Set([
      ...statements.flatMap((entry) => [entry.leftId, entry.rightId]),
      ...conclusions.flatMap((entry) => [entry.leftId, entry.rightId]),
      ...(query ? [query.leftId, query.rightId] : []),
    ]),
  ].sort();

  return {
    scenarioId: `${base.baseId}_${contract.taskKind}_${targetTruth ?? "RELATION_SET"}`,
    topologyId: base.topologyId,
    taskKind: contract.taskKind,
    explanationKind,
    statements,
    conclusions,
    query,
    targetTruth,
    entityNames: namesFor(entityIds, random),
  };
}
