import { evaluateConclusion } from "../foundation/conclusion-evaluator";
import { SeededRandom, stableHash } from "../foundation/prng";
import { createComparisonConstraint } from "../foundation/relations";
import type {
  ComparisonConstraint,
  ComparisonRelation,
  ConclusionTruth,
} from "../foundation/types";
import { getIneCp003PrototypeContract } from "./contracts";
import type { IneCp003PrototypeId, IneCp003Scenario } from "./types";

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
  const variant = ((seed % 6) + 6) % 6;
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
