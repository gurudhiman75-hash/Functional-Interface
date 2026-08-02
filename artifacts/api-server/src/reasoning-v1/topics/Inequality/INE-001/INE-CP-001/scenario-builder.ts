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
  IneCp001PrototypeId,
  IneCp001Scenario,
  IneCp001StructuredPrompt,
} from "./types";

const DISPLAY_NAMES = ["A", "B", "C", "D", "P", "Q", "R", "S"] as const;

interface PartialScenario {
  topologyId: string;
  hiddenValues: Readonly<Record<string, number>>;
  statements: readonly ComparisonConstraint[];
  query: IneCp001StructuredPrompt["query"];
}

function constraint(
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

function assignEntityNames(
  entityIds: readonly string[],
  random: SeededRandom,
): Readonly<Record<string, string>> {
  const names = random.shuffle(DISPLAY_NAMES).slice(0, entityIds.length);
  return Object.fromEntries(
    entityIds.map((entityId, index) => [entityId, names[index]!]),
  ) as Readonly<Record<string, string>>;
}

function assertHiddenStateSatisfies(
  hiddenValues: Readonly<Record<string, number>>,
  statements: readonly ComparisonConstraint[],
): void {
  for (const statement of statements) {
    const order = atomicOrderForValues(
      hiddenValues[statement.leftId]!,
      hiddenValues[statement.rightId]!,
    );
    if (!relationAcceptsAtomicOrder(statement.relation, order)) {
      throw new Error(`Hidden state violates ${statement.sourceStatementId}.`);
    }
  }
}

function maybeReverseQuery(
  query: IneCp001StructuredPrompt["query"],
  random: SeededRandom,
): IneCp001StructuredPrompt["query"] {
  return random.int(2) === 0
    ? query
    : { leftId: query.rightId, rightId: query.leftId };
}

function directScenario(random: SeededRandom): PartialScenario {
  const variants: ReadonlyArray<{
    relation: ComparisonRelation;
    leftValue: number;
    rightValue: number;
  }> = [
    { relation: "GREATER_THAN", leftValue: 2, rightValue: 0 },
    { relation: "LESS_THAN", leftValue: 0, rightValue: 2 },
    { relation: "EQUAL_TO", leftValue: 1, rightValue: 1 },
    {
      relation: "GREATER_THAN_OR_EQUAL",
      leftValue: 2,
      rightValue: random.int(2) === 0 ? 2 : 1,
    },
    {
      relation: "LESS_THAN_OR_EQUAL",
      leftValue: random.int(2) === 0 ? 1 : 0,
      rightValue: 1,
    },
  ];
  const variant = random.pick(variants);
  return {
    topologyId: `DIRECT_${variant.relation}`,
    hiddenValues: { E1: variant.leftValue, E2: variant.rightValue },
    statements: [constraint("E1", variant.relation, "E2", "S1")],
    query: maybeReverseQuery({ leftId: "E1", rightId: "E2" }, random),
  };
}

function transitiveStrictScenario(random: SeededRandom): PartialScenario {
  const variants: readonly (readonly ComparisonRelation[])[] = [
    ["GREATER_THAN", "GREATER_THAN"],
    ["GREATER_THAN_OR_EQUAL", "GREATER_THAN"],
    ["GREATER_THAN", "GREATER_THAN_OR_EQUAL"],
  ];
  const relations = random.pick(variants);
  return {
    topologyId: `LINEAR_STRICT_${relations.join("_")}`,
    hiddenValues: { E1: 3, E2: 2, E3: 0 },
    statements: [
      constraint("E1", relations[0]!, "E2", "S1"),
      constraint("E2", relations[1]!, "E3", "S2"),
    ],
    query: maybeReverseQuery({ leftId: "E1", rightId: "E3" }, random),
  };
}

function strongestInclusiveScenario(random: SeededRandom): PartialScenario {
  const ascending = random.int(2) === 1;
  return {
    topologyId: ascending ? "LINEAR_ALL_LE" : "LINEAR_ALL_GE",
    hiddenValues: ascending ? { E1: 0, E2: 1, E3: 1 } : { E1: 2, E2: 2, E3: 1 },
    statements: ascending
      ? [
          constraint("E1", "LESS_THAN_OR_EQUAL", "E2", "S1"),
          constraint("E2", "LESS_THAN_OR_EQUAL", "E3", "S2"),
        ]
      : [
          constraint("E1", "GREATER_THAN_OR_EQUAL", "E2", "S1"),
          constraint("E2", "GREATER_THAN_OR_EQUAL", "E3", "S2"),
        ],
    query: maybeReverseQuery({ leftId: "E1", rightId: "E3" }, random),
  };
}

function equalityScenario(random: SeededRandom): PartialScenario {
  const inclusive = random.int(3) === 0;
  const finalRelation: ComparisonRelation = inclusive
    ? "GREATER_THAN_OR_EQUAL"
    : "GREATER_THAN";
  return {
    topologyId: inclusive ? "EQUALITY_TO_INCLUSIVE" : "EQUALITY_TO_STRICT",
    hiddenValues: { E1: 2, E2: 2, E3: inclusive ? 2 : 0, E4: 0 },
    statements: random.shuffle([
      constraint("E1", "EQUAL_TO", "E2", "S1"),
      constraint("E2", finalRelation, "E3", "S2"),
      constraint("E4", "LESS_THAN_OR_EQUAL", "E3", "S3"),
    ]),
    query: maybeReverseQuery({ leftId: "E1", rightId: "E3" }, random),
  };
}

function indeterminateScenario(random: SeededRandom): PartialScenario {
  const inclusive = random.int(2) === 0;
  return {
    topologyId: inclusive
      ? "OPPOSING_INCLUSIVE_BRANCH"
      : "OPPOSING_STRICT_BRANCH",
    hiddenValues: { E1: 3, E2: 0, E3: 2, E4: 0 },
    statements: random.shuffle([
      constraint(
        "E1",
        inclusive ? "GREATER_THAN_OR_EQUAL" : "GREATER_THAN",
        "E2",
        "S1",
      ),
      constraint(
        "E3",
        inclusive ? "GREATER_THAN_OR_EQUAL" : "GREATER_THAN",
        "E2",
        "S2",
      ),
      constraint("E4", "EQUAL_TO", "E2", "S3"),
    ]),
    query: maybeReverseQuery({ leftId: "E1", rightId: "E3" }, random),
  };
}

export function buildIneCp001Scenario(
  prototypeId: IneCp001PrototypeId,
  seed: number,
): IneCp001Scenario {
  const random = new SeededRandom(
    seed ^ Number.parseInt(stableHash([prototypeId]), 16),
  );
  let partial: PartialScenario;
  switch (prototypeId) {
    case "INE-CP001-PROT-DIRECT-RELATION":
      partial = directScenario(random);
      break;
    case "INE-CP001-PROT-TRANSITIVE-STRICT":
      partial = transitiveStrictScenario(random);
      break;
    case "INE-CP001-PROT-STRONGEST-INCLUSIVE":
      partial = strongestInclusiveScenario(random);
      break;
    case "INE-CP001-PROT-EQUALITY-PROPAGATION":
      partial = equalityScenario(random);
      break;
    case "INE-CP001-PROT-INDETERMINATE-BRANCH":
      partial = indeterminateScenario(random);
      break;
  }

  assertHiddenStateSatisfies(partial.hiddenValues, partial.statements);
  const entityIds = [
    ...new Set([
      ...Object.keys(partial.hiddenValues),
      ...partial.statements.flatMap((statement) => [
        statement.leftId,
        statement.rightId,
      ]),
      partial.query.leftId,
      partial.query.rightId,
    ]),
  ].sort();
  return {
    topologyId: partial.topologyId,
    hiddenValues: partial.hiddenValues,
    prompt: {
      statements: partial.statements,
      query: partial.query,
      entityNames: assignEntityNames(entityIds, random),
    },
  };
}
