import { SeededRandom, stableHash } from "../foundation/prng";
import {
  atomicOrderForValues,
  createComparisonConstraint,
  relationAcceptsAtomicOrder,
} from "../foundation/relations";
import type {
  ComparisonConstraint,
  ComparisonRelation,
} from "../foundation/types";
import type {
  IneCp002PairCandidate,
  IneCp002PrototypeId,
  IneCp002Scenario,
} from "./types";

const NAMES = ["A", "B", "C", "D", "P", "Q", "R", "S"] as const;

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

function pair(
  pairId: string,
  leftId: string,
  rightId: string,
): IneCp002PairCandidate {
  return { pairId, leftId, rightId };
}

export function reverseComparisonOrientation(
  statement: ComparisonConstraint,
): ComparisonConstraint {
  const reversedRelation: ComparisonRelation =
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
    reversedRelation,
    statement.leftId,
    statement.sourceStatementId,
  );
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

function assertHiddenState(
  statements: readonly ComparisonConstraint[],
  hiddenValues: Readonly<Record<string, number>>,
): void {
  for (const statement of statements) {
    const left = hiddenValues[statement.leftId];
    const right = hiddenValues[statement.rightId];
    if (
      left === undefined ||
      right === undefined ||
      !relationAcceptsAtomicOrder(
        statement.relation,
        atomicOrderForValues(left, right),
      )
    ) {
      throw new Error(
        `Hidden state does not satisfy ${statement.sourceStatementId}.`,
      );
    }
  }
}

export function buildIneCp002Scenario(
  prototypeId: IneCp002PrototypeId,
  seed: number,
): IneCp002Scenario {
  const random = new SeededRandom(
    seed ^ Number.parseInt(stableHash([prototypeId, "scenario"]), 16),
  );
  let scenario: Omit<IneCp002Scenario, "entityNames">;

  if (prototypeId === "INE-CP002-PROT-LONG-CHAIN") {
    const variant = ((seed % 5) + 5) % 5;
    const variants: readonly Omit<IneCp002Scenario, "entityNames">[] = [
      {
        scenarioId: "SHORT_ALL_INCLUSIVE",
        topologyId: "CHAIN_3_ENTITIES_INCLUSIVE",
        taskKind: "RELATION",
        explanationKind: "LONG_CHAIN",
        hiddenValues: { E1: 3, E2: 2, E3: 1 },
        statements: [
          c("E1", "GREATER_THAN_OR_EQUAL", "E2", "S1"),
          c("E2", "GREATER_THAN_OR_EQUAL", "E3", "S2"),
        ],
        query: { leftId: "E1", rightId: "E3" },
        proofRoutes: [["S1", "S2"]],
        irrelevantStatementIds: [],
      },
      {
        scenarioId: "SHORT_REVERSED_STRICT",
        topologyId: "CHAIN_3_ENTITIES_STRICT",
        taskKind: "RELATION",
        explanationKind: "LONG_CHAIN",
        hiddenValues: { E1: 4, E2: 3, E3: 1 },
        statements: [
          c("E1", "GREATER_THAN_OR_EQUAL", "E2", "S1"),
          c("E2", "GREATER_THAN", "E3", "S2"),
        ],
        query: { leftId: "E3", rightId: "E1" },
        proofRoutes: [["S1", "S2"]],
        irrelevantStatementIds: [],
      },
      {
        scenarioId: "MEDIUM_EQUALITY_IN_CHAIN",
        topologyId: "CHAIN_4_ENTITIES_WITH_EQUALITY",
        taskKind: "RELATION",
        explanationKind: "LONG_CHAIN",
        hiddenValues: { E1: 5, E2: 3, E3: 3, E4: 1 },
        statements: [
          c("E1", "GREATER_THAN", "E2", "S1"),
          c("E2", "EQUAL_TO", "E3", "S2"),
          c("E3", "GREATER_THAN_OR_EQUAL", "E4", "S3"),
        ],
        query: { leftId: "E1", rightId: "E4" },
        proofRoutes: [["S1", "S2", "S3"]],
        irrelevantStatementIds: [],
      },
      {
        scenarioId: "LONG_REVERSED_INCLUSIVE",
        topologyId: "CHAIN_5_ENTITIES_INCLUSIVE_EQUALITY",
        taskKind: "RELATION",
        explanationKind: "LONG_CHAIN",
        hiddenValues: { E1: 6, E2: 5, E3: 3, E4: 3, E5: 2 },
        statements: [
          c("E1", "GREATER_THAN_OR_EQUAL", "E2", "S1"),
          c("E2", "GREATER_THAN_OR_EQUAL", "E3", "S2"),
          c("E3", "EQUAL_TO", "E4", "S3"),
          c("E4", "GREATER_THAN_OR_EQUAL", "E5", "S4"),
        ],
        query: { leftId: "E5", rightId: "E1" },
        proofRoutes: [["S1", "S2", "S3", "S4"]],
        irrelevantStatementIds: [],
      },
      {
        scenarioId: "LONG_LATE_STRICTNESS",
        topologyId: "CHAIN_5_ENTITIES_LATE_STRICT",
        taskKind: "RELATION",
        explanationKind: "LONG_CHAIN",
        hiddenValues: { E1: 6, E2: 5, E3: 4, E4: 3, E5: 1 },
        statements: [
          c("E1", "GREATER_THAN_OR_EQUAL", "E2", "S1"),
          c("E2", "GREATER_THAN_OR_EQUAL", "E3", "S2"),
          c("E3", "GREATER_THAN_OR_EQUAL", "E4", "S3"),
          c("E4", "GREATER_THAN", "E5", "S4"),
        ],
        query: { leftId: "E1", rightId: "E5" },
        proofRoutes: [["S1", "S2", "S3", "S4"]],
        irrelevantStatementIds: [],
      },
    ];
    scenario = variants[variant]!;
  } else if (prototypeId === "INE-CP002-PROT-MULTIPLE-ROUTES") {
    const variant = ((seed % 5) + 5) % 5;
    const variants: readonly Omit<IneCp002Scenario, "entityNames">[] = [
      {
        scenarioId: "TWO_SHORT_INDIRECT_ROUTES",
        topologyId: "INDIRECT_DIAMOND_TWO_ROUTES",
        taskKind: "RELATION",
        explanationKind: "MULTIPLE_ROUTES",
        hiddenValues: { E1: 5, E2: 4, E3: 3, E4: 1 },
        statements: [
          c("E1", "GREATER_THAN_OR_EQUAL", "E2", "S1"),
          c("E2", "GREATER_THAN", "E4", "S2"),
          c("E1", "GREATER_THAN", "E3", "S3"),
          c("E3", "GREATER_THAN_OR_EQUAL", "E4", "S4"),
        ],
        query: { leftId: "E1", rightId: "E4" },
        proofRoutes: [
          ["S1", "S2"],
          ["S3", "S4"],
        ],
        irrelevantStatementIds: [],
      },
      {
        scenarioId: "TWO_CONSISTENT_ROUTES",
        topologyId: "DIAMOND_TWO_ROUTES",
        taskKind: "RELATION",
        explanationKind: "MULTIPLE_ROUTES",
        hiddenValues: { E1: 5, E2: 4, E3: 3, E4: 1 },
        statements: [
          c("E1", "GREATER_THAN", "E2", "S1"),
          c("E2", "GREATER_THAN_OR_EQUAL", "E4", "S2"),
          c("E1", "GREATER_THAN_OR_EQUAL", "E3", "S3"),
          c("E3", "GREATER_THAN", "E4", "S4"),
        ],
        query: { leftId: "E4", rightId: "E1" },
        proofRoutes: [
          ["S1", "S2"],
          ["S3", "S4"],
        ],
        irrelevantStatementIds: [],
      },
      {
        scenarioId: "UNEQUAL_ROUTE_LENGTHS",
        topologyId: "TWO_AND_THREE_EDGE_ROUTES",
        taskKind: "RELATION",
        explanationKind: "MULTIPLE_ROUTES",
        hiddenValues: { E1: 7, E2: 5, E3: 6, E4: 3, E5: 1 },
        statements: [
          c("E1", "GREATER_THAN", "E2", "S1"),
          c("E2", "GREATER_THAN_OR_EQUAL", "E5", "S2"),
          c("E1", "GREATER_THAN_OR_EQUAL", "E3", "S3"),
          c("E3", "GREATER_THAN", "E4", "S4"),
          c("E4", "GREATER_THAN_OR_EQUAL", "E5", "S5"),
        ],
        query: { leftId: "E1", rightId: "E5" },
        proofRoutes: [
          ["S1", "S2"],
          ["S3", "S4", "S5"],
        ],
        irrelevantStatementIds: [],
      },
      {
        scenarioId: "TWO_INCLUSIVE_EQUALITY_ROUTES",
        topologyId: "INCLUSIVE_DIAMOND_WITH_EQUALITY",
        taskKind: "RELATION",
        explanationKind: "MULTIPLE_ROUTES",
        hiddenValues: { E1: 5, E2: 4, E3: 4, E4: 4 },
        statements: [
          c("E1", "GREATER_THAN_OR_EQUAL", "E2", "S1"),
          c("E2", "EQUAL_TO", "E4", "S2"),
          c("E1", "GREATER_THAN_OR_EQUAL", "E3", "S3"),
          c("E3", "GREATER_THAN_OR_EQUAL", "E4", "S4"),
        ],
        query: { leftId: "E1", rightId: "E4" },
        proofRoutes: [
          ["S1", "S2"],
          ["S3", "S4"],
        ],
        irrelevantStatementIds: [],
      },
      {
        scenarioId: "INTERCONNECTED_CONFIRMING_ROUTES",
        topologyId: "TWO_ROUTES_WITH_CROSS_LINK",
        taskKind: "RELATION",
        explanationKind: "MULTIPLE_ROUTES",
        hiddenValues: { E1: 7, E2: 6, E3: 4, E4: 3, E5: 1 },
        statements: [
          c("E1", "GREATER_THAN", "E2", "S1"),
          c("E2", "GREATER_THAN_OR_EQUAL", "E3", "S2"),
          c("E3", "GREATER_THAN_OR_EQUAL", "E5", "S3"),
          c("E1", "GREATER_THAN_OR_EQUAL", "E4", "S4"),
          c("E4", "GREATER_THAN", "E5", "S5"),
          c("E2", "GREATER_THAN", "E4", "S6"),
        ],
        query: { leftId: "E1", rightId: "E5" },
        proofRoutes: [
          ["S1", "S2", "S3"],
          ["S4", "S5"],
        ],
        irrelevantStatementIds: [],
      },
    ];
    scenario = variants[variant]!;
  } else if (prototypeId === "INE-CP002-PROT-ALTERNATE-STRICT-PATH") {
    scenario = {
      scenarioId: "INCLUSIVE_DIRECT_STRICT_ALTERNATE",
      topologyId: "DIRECT_PLUS_LONG_ALTERNATE",
      taskKind: "RELATION",
      explanationKind: "ALTERNATE_STRICT_PATH",
      hiddenValues: { E1: 5, E2: 4, E3: 2, E4: 1 },
      statements: [
        c("E1", "GREATER_THAN_OR_EQUAL", "E4", "S1"),
        c("E1", "GREATER_THAN_OR_EQUAL", "E2", "S2"),
        c("E2", "GREATER_THAN", "E3", "S3"),
        c("E3", "GREATER_THAN_OR_EQUAL", "E4", "S4"),
      ],
      query:
        seed % 2 === 0
          ? { leftId: "E1", rightId: "E4" }
          : { leftId: "E4", rightId: "E1" },
      proofRoutes: [["S1"], ["S2", "S3", "S4"]],
      irrelevantStatementIds: [],
    };
  } else if (prototypeId === "INE-CP002-PROT-BRANCHED-GRAPH") {
    const variant = ((seed % 5) + 5) % 5;
    const variants: readonly Omit<IneCp002Scenario, "entityNames">[] = [
      {
        scenarioId: "COMMON_UPPER_ONLY",
        topologyId: "BRANCHES_COMMON_UPPER_ONLY",
        taskKind: "RELATION",
        explanationKind: "BRANCHED_GRAPH",
        hiddenValues: { E1: 6, E2: 4, E3: 5, E4: 2 },
        statements: [
          c("E1", "GREATER_THAN", "E2", "S1"),
          c("E1", "GREATER_THAN_OR_EQUAL", "E3", "S2"),
          c("E2", "GREATER_THAN", "E4", "S3"),
        ],
        query: { leftId: "E2", rightId: "E3" },
        proofRoutes: [],
        irrelevantStatementIds: [],
      },
      {
        scenarioId: "COMMON_LOWER_ONLY",
        topologyId: "BRANCHES_COMMON_LOWER_ONLY",
        taskKind: "RELATION",
        explanationKind: "BRANCHED_GRAPH",
        hiddenValues: { E1: 6, E2: 4, E3: 5, E4: 2 },
        statements: [
          c("E2", "GREATER_THAN", "E4", "S1"),
          c("E3", "GREATER_THAN_OR_EQUAL", "E4", "S2"),
          c("E1", "GREATER_THAN", "E2", "S3"),
        ],
        query: { leftId: "E2", rightId: "E3" },
        proofRoutes: [],
        irrelevantStatementIds: [],
      },
      {
        scenarioId: "SIBLING_BRANCHES_UNORDERED",
        topologyId: "UPPER_AND_LOWER_SHARED_BOUNDS",
        taskKind: "RELATION",
        explanationKind: "BRANCHED_GRAPH",
        hiddenValues: { E1: 6, E2: 4, E3: 5, E4: 1 },
        statements: [
          c("E1", "GREATER_THAN", "E2", "S1"),
          c("E1", "GREATER_THAN", "E3", "S2"),
          c("E2", "GREATER_THAN_OR_EQUAL", "E4", "S3"),
          c("E3", "GREATER_THAN", "E4", "S4"),
        ],
        query: { leftId: "E2", rightId: "E3" },
        proofRoutes: [],
        irrelevantStatementIds: [],
      },
      {
        scenarioId: "DEEP_LEFT_BRANCH",
        topologyId: "ASYMMETRIC_BRANCH_DEPTH",
        taskKind: "RELATION",
        explanationKind: "BRANCHED_GRAPH",
        hiddenValues: { E1: 6, E2: 4, E3: 3, E4: 2 },
        statements: [
          c("E1", "GREATER_THAN", "E2", "S1"),
          c("E2", "GREATER_THAN_OR_EQUAL", "E4", "S2"),
          c("E1", "GREATER_THAN", "E3", "S3"),
        ],
        query: { leftId: "E4", rightId: "E3" },
        proofRoutes: [],
        irrelevantStatementIds: [],
      },
      {
        scenarioId: "EQUALITY_INSIDE_ONE_BRANCH",
        topologyId: "BRANCH_WITH_EQUALITY_DEPTH",
        taskKind: "RELATION",
        explanationKind: "BRANCHED_GRAPH",
        hiddenValues: { E1: 7, E2: 5, E3: 4, E4: 2, E5: 5 },
        statements: [
          c("E1", "GREATER_THAN", "E2", "S1"),
          c("E2", "EQUAL_TO", "E5", "S2"),
          c("E5", "GREATER_THAN_OR_EQUAL", "E4", "S3"),
          c("E1", "GREATER_THAN", "E3", "S4"),
          c("E3", "GREATER_THAN", "E4", "S5"),
        ],
        query: { leftId: "E2", rightId: "E3" },
        proofRoutes: [],
        irrelevantStatementIds: [],
      },
    ];
    scenario = variants[variant]!;
  } else if (prototypeId === "INE-CP002-PROT-IRRELEVANT-EVIDENCE") {
    const detachedNoise = seed % 2 === 1;
    scenario = {
      scenarioId: detachedNoise
        ? "CHAIN_WITH_DETACHED_NOISE"
        : "CHAIN_WITH_ATTACHED_NOISE",
      topologyId: detachedNoise
        ? "RELEVANT_CHAIN_PLUS_DISCONNECTED_CLUE"
        : "RELEVANT_CHAIN_PLUS_SIDE_BRANCH",
      taskKind: "RELATION",
      explanationKind: "IRRELEVANT_EVIDENCE",
      hiddenValues: { E1: 5, E2: 4, E3: 2, E4: 3, E5: 1 },
      statements: detachedNoise
        ? [
            c("E1", "GREATER_THAN_OR_EQUAL", "E2", "S1"),
            c("E2", "GREATER_THAN", "E3", "S2"),
            c("E4", "GREATER_THAN", "E5", "S3"),
          ]
        : [
            c("E1", "GREATER_THAN_OR_EQUAL", "E2", "S1"),
            c("E2", "GREATER_THAN", "E3", "S2"),
            c("E1", "GREATER_THAN", "E4", "S3"),
            c("E4", "GREATER_THAN", "E5", "S4"),
          ],
      query:
        seed % 2 === 0
          ? { leftId: "E1", rightId: "E3" }
          : { leftId: "E3", rightId: "E1" },
      proofRoutes: [["S1", "S2"]],
      irrelevantStatementIds: detachedNoise ? ["S3"] : ["S3", "S4"],
    };
  } else if (prototypeId === "INE-CP002-PROT-SELECT-DEFINITE-PAIR") {
    const definitePairVariant = ((seed % 5) + 5) % 5;
    if (definitePairVariant === 2) {
      scenario = {
        scenarioId: "MULTI_STEP_EQUALITY_PAIR_AUDIT",
        topologyId: "PAIR_AUDIT_EQUALITY_CHAIN_WITH_DISCONNECTED_EDGE",
        taskKind: "SELECT_DEFINITE_PAIR",
        explanationKind: "PAIR_SELECTION",
        hiddenValues: { E1: 5, E2: 5, E3: 5, E4: 4, E5: 2 },
        statements: [
          c("E1", "EQUAL_TO", "E2", "S1"),
          c("E2", "EQUAL_TO", "E3", "S2"),
          c("E4", "GREATER_THAN", "E5", "S3"),
        ],
        candidatePairs: [
          pair("P1", "E1", "E3"),
          pair("P2", "E1", "E4"),
          pair("P3", "E2", "E5"),
          pair("P4", "E3", "E4"),
        ],
        proofRoutes: [["S1", "S2"]],
        irrelevantStatementIds: ["S3"],
      };
    } else {
      const reversed = definitePairVariant === 1 || definitePairVariant === 4;
      const inclusive = definitePairVariant >= 3;
      scenario = {
        scenarioId: inclusive
          ? "MULTI_STEP_INCLUSIVE_PAIR_AUDIT"
          : "MULTI_STEP_STRICT_PAIR_AUDIT",
        topologyId: "PAIR_AUDIT_CONNECTED_BRANCHES_MULTI_STEP",
        taskKind: "SELECT_DEFINITE_PAIR",
        explanationKind: "PAIR_SELECTION",
        hiddenValues: { E1: 5, E2: 3, E3: 2, E4: 4, E5: 4 },
        statements: [
          c(
            "E1",
            inclusive ? "GREATER_THAN_OR_EQUAL" : "GREATER_THAN",
            "E2",
            "S1",
          ),
          c("E2", "GREATER_THAN_OR_EQUAL", "E3", "S2"),
          c("E4", "GREATER_THAN", "E3", "S3"),
          c("E5", "EQUAL_TO", "E4", "S4"),
        ],
        candidatePairs: [
          reversed ? pair("P1", "E3", "E1") : pair("P1", "E1", "E3"),
          pair("P2", "E2", "E4"),
          pair("P3", "E1", "E4"),
          pair("P4", "E2", "E5"),
        ],
        proofRoutes: [["S1", "S2"]],
        irrelevantStatementIds: [],
      };
    }
  } else if (prototypeId === "INE-CP002-PROT-SELECT-INDETERMINATE-PAIR") {
    scenario = {
      scenarioId: "ONE_INDETERMINATE_AMONG_FOUR_PAIRS",
      topologyId: "PAIR_AUDIT_CONNECTED_GRAPH_SINGLE_UNKNOWN",
      taskKind: "SELECT_INDETERMINATE_PAIR",
      explanationKind: "PAIR_SELECTION",
      hiddenValues: { E1: 5, E2: 4, E3: 2, E4: 2, E5: 3 },
      statements: [
        c("E1", "GREATER_THAN", "E2", "S1"),
        c("E2", "GREATER_THAN_OR_EQUAL", "E3", "S2"),
        c("E3", "EQUAL_TO", "E4", "S3"),
        c("E5", "GREATER_THAN", "E4", "S4"),
      ],
      candidatePairs: [
        pair("P1", "E1", "E3"),
        pair("P2", "E4", "E2"),
        pair("P3", "E1", "E4"),
        pair("P4", "E2", "E5"),
      ],
      proofRoutes: [["S1", "S2", "S3"]],
      irrelevantStatementIds: [],
    };
  } else if (prototypeId === "INE-CP002-PROT-DISCONNECTED-COMPONENTS") {
    const variant = ((seed % 5) + 5) % 5;
    const variants: readonly Omit<IneCp002Scenario, "entityNames">[] = [
      {
        scenarioId: "TWO_SIMPLE_COMPONENTS",
        topologyId: "DISCONNECTED_TWO_EDGES",
        taskKind: "RELATION",
        explanationKind: "DISCONNECTED_COMPONENTS",
        hiddenValues: { E1: 4, E2: 2, E3: 3, E4: 1 },
        statements: [
          c("E1", "GREATER_THAN", "E2", "S1"),
          c("E3", "GREATER_THAN", "E4", "S2"),
        ],
        query: { leftId: "E2", rightId: "E4" },
        proofRoutes: [],
        irrelevantStatementIds: [],
      },
      {
        scenarioId: "CHAIN_AND_EDGE_COMPONENTS",
        topologyId: "DISCONNECTED_CHAIN_PLUS_EDGE",
        taskKind: "RELATION",
        explanationKind: "DISCONNECTED_COMPONENTS",
        hiddenValues: { E1: 5, E2: 4, E3: 2, E4: 3, E5: 1 },
        statements: [
          c("E1", "GREATER_THAN", "E2", "S1"),
          c("E2", "GREATER_THAN_OR_EQUAL", "E3", "S2"),
          c("E4", "GREATER_THAN", "E5", "S3"),
        ],
        query: { leftId: "E2", rightId: "E5" },
        proofRoutes: [],
        irrelevantStatementIds: [],
      },
      {
        scenarioId: "EQUALITY_AND_STRICT_CHAIN_COMPONENTS",
        topologyId: "DISCONNECTED_EQUALITY_PLUS_CHAIN",
        taskKind: "RELATION",
        explanationKind: "DISCONNECTED_COMPONENTS",
        hiddenValues: { E1: 4, E2: 4, E3: 5, E4: 3, E5: 1 },
        statements: [
          c("E1", "EQUAL_TO", "E2", "S1"),
          c("E3", "GREATER_THAN", "E4", "S2"),
          c("E4", "GREATER_THAN", "E5", "S3"),
        ],
        query: { leftId: "E1", rightId: "E4" },
        proofRoutes: [],
        irrelevantStatementIds: [],
      },
      {
        scenarioId: "BRANCH_AND_EDGE_COMPONENTS",
        topologyId: "DISCONNECTED_BRANCH_PLUS_EDGE",
        taskKind: "RELATION",
        explanationKind: "DISCONNECTED_COMPONENTS",
        hiddenValues: { E1: 6, E2: 4, E3: 3, E4: 5, E5: 2 },
        statements: [
          c("E1", "GREATER_THAN", "E2", "S1"),
          c("E1", "GREATER_THAN", "E3", "S2"),
          c("E4", "GREATER_THAN_OR_EQUAL", "E5", "S3"),
        ],
        query: { leftId: "E2", rightId: "E5" },
        proofRoutes: [],
        irrelevantStatementIds: [],
      },
      {
        scenarioId: "EQUALITY_CHAIN_AND_EDGE_COMPONENTS",
        topologyId: "DISCONNECTED_EQUALITY_CHAIN_PLUS_EDGE",
        taskKind: "RELATION",
        explanationKind: "DISCONNECTED_COMPONENTS",
        hiddenValues: { E1: 4, E2: 4, E3: 4, E4: 3, E5: 1 },
        statements: [
          c("E1", "EQUAL_TO", "E2", "S1"),
          c("E2", "EQUAL_TO", "E3", "S2"),
          c("E4", "GREATER_THAN", "E5", "S3"),
        ],
        query: { leftId: "E2", rightId: "E5" },
        proofRoutes: [],
        irrelevantStatementIds: [],
      },
    ];
    scenario = variants[variant]!;
  } else {
    const variant = ((seed % 5) + 5) % 5;
    const variants: readonly Omit<IneCp002Scenario, "entityNames">[] = [
      {
        scenarioId: "DIRECT_EQUALITY_WITH_BRANCH",
        topologyId: "DIRECT_EQUALITY_ONE_BRANCH",
        taskKind: "RELATION",
        explanationKind: "EQUALITY_SPANNING_BRANCHES",
        hiddenValues: { E1: 5, E2: 5, E3: 3 },
        statements: [
          c("E1", "EQUAL_TO", "E2", "S1"),
          c("E1", "GREATER_THAN", "E3", "S2"),
        ],
        query: { leftId: "E1", rightId: "E2" },
        proofRoutes: [["S1"]],
        irrelevantStatementIds: [],
      },
      {
        scenarioId: "THREE_TERM_EQUALITY_CHAIN",
        topologyId: "EQUALITY_CHAIN_ONE_BRANCH",
        taskKind: "RELATION",
        explanationKind: "EQUALITY_SPANNING_BRANCHES",
        hiddenValues: { E1: 5, E2: 5, E3: 5, E4: 3 },
        statements: [
          c("E1", "EQUAL_TO", "E2", "S1"),
          c("E2", "EQUAL_TO", "E3", "S2"),
          c("E3", "GREATER_THAN_OR_EQUAL", "E4", "S3"),
        ],
        query: { leftId: "E1", rightId: "E3" },
        proofRoutes: [["S1", "S2"]],
        irrelevantStatementIds: [],
      },
      {
        scenarioId: "EQUALITY_COMPONENT_WITH_TWO_BRANCHES",
        topologyId: "EQUALITY_HUB_AND_BRANCHES",
        taskKind: "RELATION",
        explanationKind: "EQUALITY_SPANNING_BRANCHES",
        hiddenValues: { E1: 5, E2: 5, E3: 5, E4: 3, E5: 4 },
        statements: [
          c("E2", "EQUAL_TO", "E1", "S1"),
          c("E1", "EQUAL_TO", "E3", "S2"),
          c("E2", "GREATER_THAN", "E4", "S3"),
          c("E3", "GREATER_THAN_OR_EQUAL", "E5", "S4"),
        ],
        query: { leftId: "E2", rightId: "E3" },
        proofRoutes: [["S1", "S2"]],
        irrelevantStatementIds: [],
      },
      {
        scenarioId: "FOUR_TERM_EQUALITY_COMPONENT",
        topologyId: "LONG_EQUALITY_COMPONENT_SHARED_LOWER",
        taskKind: "RELATION",
        explanationKind: "EQUALITY_SPANNING_BRANCHES",
        hiddenValues: { E1: 5, E2: 5, E3: 5, E4: 5, E5: 2 },
        statements: [
          c("E1", "EQUAL_TO", "E2", "S1"),
          c("E2", "EQUAL_TO", "E3", "S2"),
          c("E3", "EQUAL_TO", "E4", "S3"),
          c("E1", "GREATER_THAN", "E5", "S4"),
          c("E4", "GREATER_THAN_OR_EQUAL", "E5", "S5"),
        ],
        query: { leftId: "E2", rightId: "E4" },
        proofRoutes: [["S2", "S3"]],
        irrelevantStatementIds: [],
      },
      {
        scenarioId: "EQUALITY_STAR_WITH_TWO_BRANCHES",
        topologyId: "EQUALITY_STAR_SPLIT_BRANCHES",
        taskKind: "RELATION",
        explanationKind: "EQUALITY_SPANNING_BRANCHES",
        hiddenValues: { E1: 5, E2: 5, E3: 5, E4: 2, E5: 3 },
        statements: [
          c("E1", "EQUAL_TO", "E2", "S1"),
          c("E1", "EQUAL_TO", "E3", "S2"),
          c("E2", "GREATER_THAN", "E4", "S3"),
          c("E3", "GREATER_THAN_OR_EQUAL", "E5", "S4"),
        ],
        query: { leftId: "E2", rightId: "E3" },
        proofRoutes: [["S1", "S2"]],
        irrelevantStatementIds: [],
      },
    ];
    scenario = variants[variant]!;
  }

  assertHiddenState(scenario.statements, scenario.hiddenValues);
  const entityIds = Object.keys(scenario.hiddenValues).sort();
  const orientationRandom = new SeededRandom(
    seed ^
      Number.parseInt(
        stableHash([prototypeId, "statement-orientation-v2"]),
        16,
      ),
  );
  const orientedStatements = scenario.statements.map((statement) =>
    orientationRandom.int(2) === 0
      ? statement
      : reverseComparisonOrientation(statement),
  );
  assertHiddenState(orientedStatements, scenario.hiddenValues);
  return {
    ...scenario,
    statements: random.shuffle(orientedStatements),
    entityNames: namesFor(entityIds, random),
  };
}
