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
    const inclusive = seed % 4 === 0 || seed % 4 === 2;
    scenario = {
      scenarioId: inclusive ? "LONG_ALL_INCLUSIVE" : "LONG_MIXED_STRICT",
      topologyId: "LONG_CHAIN_5_ENTITIES",
      taskKind: "RELATION",
      explanationKind: "LONG_CHAIN",
      hiddenValues: { E1: 6, E2: 5, E3: 3, E4: 3, E5: 2 },
      statements: [
        c("E1", "GREATER_THAN_OR_EQUAL", "E2", "S1"),
        c(
          "E2",
          inclusive ? "GREATER_THAN_OR_EQUAL" : "GREATER_THAN",
          "E3",
          "S2",
        ),
        c("E3", "EQUAL_TO", "E4", "S3"),
        c("E4", "GREATER_THAN_OR_EQUAL", "E5", "S4"),
      ],
      query:
        seed % 4 >= 2
          ? { leftId: "E5", rightId: "E1" }
          : { leftId: "E1", rightId: "E5" },
      proofRoutes: [["S1", "S2", "S3", "S4"]],
      irrelevantStatementIds: [],
    };
  } else if (prototypeId === "INE-CP002-PROT-MULTIPLE-ROUTES") {
    scenario = {
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
      query:
        seed % 2 === 0
          ? { leftId: "E1", rightId: "E4" }
          : { leftId: "E4", rightId: "E1" },
      proofRoutes: [
        ["S1", "S2"],
        ["S3", "S4"],
      ],
      irrelevantStatementIds: [],
    };
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
    scenario = {
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
    };
  } else if (prototypeId === "INE-CP002-PROT-IRRELEVANT-EVIDENCE") {
    scenario = {
      scenarioId: "CHAIN_WITH_TWO_IRRELEVANT_COMPONENTS",
      topologyId: "RELEVANT_CHAIN_PLUS_NOISE",
      taskKind: "RELATION",
      explanationKind: "IRRELEVANT_EVIDENCE",
      hiddenValues: { E1: 5, E2: 4, E3: 2, E4: 3, E5: 1 },
      statements: [
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
      irrelevantStatementIds: ["S3", "S4"],
    };
  } else if (prototypeId === "INE-CP002-PROT-SELECT-DEFINITE-PAIR") {
    scenario = {
      scenarioId: "ONE_DEFINITE_AMONG_FOUR_PAIRS",
      topologyId: "BRANCH_PLUS_DISCONNECTED_EQUALITY",
      taskKind: "SELECT_DEFINITE_PAIR",
      explanationKind: "PAIR_SELECTION",
      hiddenValues: { E1: 5, E2: 3, E3: 2, E4: 4, E5: 4 },
      statements: [
        c("E1", "GREATER_THAN", "E2", "S1"),
        c("E2", "GREATER_THAN_OR_EQUAL", "E3", "S2"),
        c("E4", "GREATER_THAN", "E3", "S3"),
        c("E5", "EQUAL_TO", "E4", "S4"),
      ],
      candidatePairs: [
        pair("P1", "E1", "E3"),
        pair("P2", "E2", "E4"),
        pair("P3", "E1", "E4"),
        pair("P4", "E2", "E5"),
      ],
      proofRoutes: [["S1", "S2"]],
      irrelevantStatementIds: ["S4"],
    };
  } else if (prototypeId === "INE-CP002-PROT-SELECT-INDETERMINATE-PAIR") {
    scenario = {
      scenarioId: "ONE_INDETERMINATE_AMONG_FOUR_PAIRS",
      topologyId: "CHAIN_PLUS_DISCONNECTED_EQUALITY",
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
      irrelevantStatementIds: ["S4"],
    };
  } else if (prototypeId === "INE-CP002-PROT-DISCONNECTED-COMPONENTS") {
    scenario = {
      scenarioId: "QUERY_ACROSS_TWO_COMPONENTS",
      topologyId: "TWO_NONTRIVIAL_COMPONENTS",
      taskKind: "RELATION",
      explanationKind: "DISCONNECTED_COMPONENTS",
      hiddenValues: { E1: 5, E2: 4, E3: 2, E4: 3, E5: 1 },
      statements: [
        c("E1", "GREATER_THAN", "E2", "S1"),
        c("E2", "GREATER_THAN_OR_EQUAL", "E3", "S2"),
        c("E4", "GREATER_THAN", "E5", "S3"),
        c("E1", "GREATER_THAN", "E3", "S4"),
      ],
      query: { leftId: "E2", rightId: "E5" },
      proofRoutes: [],
      irrelevantStatementIds: [],
    };
  } else {
    scenario = {
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
    };
  }

  assertHiddenState(scenario.statements, scenario.hiddenValues);
  const entityIds = Object.keys(scenario.hiddenValues).sort();
  return {
    ...scenario,
    statements: random.shuffle(scenario.statements),
    entityNames: namesFor(entityIds, random),
  };
}
