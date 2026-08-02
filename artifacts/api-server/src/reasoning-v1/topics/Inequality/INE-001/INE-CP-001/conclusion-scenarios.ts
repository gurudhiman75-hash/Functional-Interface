import { SeededRandom, stableHash } from "../foundation/prng";
import { createComparisonConstraint } from "../foundation/relations";
import type {
  ComparisonConstraint,
  ComparisonRelation,
} from "../foundation/types";
import type { IneCp001ConclusionPrototypeId } from "./types";

export interface IneCp001ConclusionScenario {
  scenarioId: string;
  statements: readonly ComparisonConstraint[];
  conclusions: readonly ComparisonConstraint[];
  entityNames: Readonly<Record<string, string>>;
}

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

function namesFor(
  entityIds: readonly string[],
  random: SeededRandom,
): Readonly<Record<string, string>> {
  const names = random.shuffle(NAMES).slice(0, entityIds.length);
  return Object.fromEntries(
    entityIds.map((id, index) => [id, names[index]!]),
  ) as Readonly<Record<string, string>>;
}

export function buildIneCp001ConclusionScenario(
  prototypeId: IneCp001ConclusionPrototypeId,
  seed: number,
): IneCp001ConclusionScenario {
  const random = new SeededRandom(
    seed ^ Number.parseInt(stableHash([prototypeId]), 16),
  );
  let scenarioId: string;
  let statements: readonly ComparisonConstraint[];
  let conclusions: readonly ComparisonConstraint[];

  if (prototypeId === "INE-CP001-PROT-EVALUATE-SINGLE-CONCLUSION") {
    const mode = seed % 3;
    statements =
      mode === 0
        ? [
            c("E1", "GREATER_THAN_OR_EQUAL", "E2", "S1"),
            c("E2", "GREATER_THAN", "E3", "S2"),
          ]
        : mode === 1
          ? [c("E1", "GREATER_THAN_OR_EQUAL", "E2", "S1")]
          : [c("E1", "GREATER_THAN", "E2", "S1")];
    conclusions =
      mode === 0
        ? [c("E1", "GREATER_THAN", "E3", "C1")]
        : mode === 1
          ? [c("E1", "GREATER_THAN", "E2", "C1")]
          : [c("E1", "LESS_THAN_OR_EQUAL", "E2", "C1")];
    scenarioId = ["SINGLE_DEFINITE", "SINGLE_POSSIBLE", "SINGLE_IMPOSSIBLE"][
      mode
    ]!;
  } else if (prototypeId === "INE-CP001-PROT-SELECT-VALID-CONCLUSION") {
    statements = [
      c("E1", "GREATER_THAN_OR_EQUAL", "E2", "S1"),
      c("E2", "GREATER_THAN", "E3", "S2"),
    ];
    conclusions = [
      c("E1", "GREATER_THAN", "E3", "C1"),
      c("E3", "GREATER_THAN", "E1", "C2"),
      c("E1", "EQUAL_TO", "E2", "C3"),
      c("E2", "LESS_THAN_OR_EQUAL", "E3", "C4"),
    ];
    scenarioId = "SELECT_ONE_DEFINITE";
  } else {
    statements = [
      c("E1", "GREATER_THAN", "E2", "S1"),
      c("E2", "GREATER_THAN", "E3", "S2"),
      c("E1", "EQUAL_TO", "E4", "S3"),
    ];
    conclusions = [
      c("E1", "GREATER_THAN", "E3", "C1"),
      c("E3", "LESS_THAN", "E2", "C2"),
      c("E4", "GREATER_THAN", "E2", "C3"),
      c("E2", "GREATER_THAN_OR_EQUAL", "E1", "C4"),
    ];
    scenarioId = "SELECT_ONE_INVALID";
  }

  const entityIds = [
    ...new Set([
      ...statements.flatMap((entry) => [entry.leftId, entry.rightId]),
      ...conclusions.flatMap((entry) => [entry.leftId, entry.rightId]),
    ]),
  ].sort();
  return {
    scenarioId,
    statements: random.shuffle(statements),
    conclusions,
    entityNames: namesFor(entityIds, random),
  };
}
