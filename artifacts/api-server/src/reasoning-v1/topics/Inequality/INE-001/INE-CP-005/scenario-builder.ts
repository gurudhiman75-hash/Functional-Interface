import { evaluateConclusion } from "../foundation/conclusion-evaluator";
import { SeededRandom, stableHash } from "../foundation/prng";
import { createComparisonConstraint } from "../foundation/relations";
import type {
  ComparisonConstraint,
  ComparisonRelation,
  ConclusionTruth,
} from "../foundation/types";
import { getIneCp005PrototypeContract } from "./contracts";
import {
  renderStructuredStatement,
  reverseConstraint,
} from "./linguistic-renderer";
import type {
  IneCp005ConclusionMask,
  IneCp005Context,
  IneCp005PrototypeId,
  IneCp005Scenario,
} from "./types";

const LETTERS = ["A", "B", "C", "D", "P", "Q"] as const;
const PEOPLE = ["Aman", "Bina", "Charan", "Diya", "Farah", "Gagan"] as const;
const PRODUCTS = [
  "Product A",
  "Product B",
  "Product C",
  "Product D",
  "Product E",
  "Product F",
] as const;
const PLANTS = [
  "Plant A",
  "Plant B",
  "Plant C",
  "Plant D",
  "Plant E",
  "Plant F",
] as const;
const CONTEXTS: readonly IneCp005Context[] = [
  "GENERIC",
  "MARKS",
  "SALARY",
  "HEIGHT",
  "WEIGHT",
  "SCORE",
  "PRICE",
  "PRODUCTION",
];
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

interface BaseGraph {
  baseId: string;
  topologyId: string;
  statements: readonly ComparisonConstraint[];
  query: { leftId: string; rightId: string };
}

function baseGraphFor(seed: number): BaseGraph {
  const bases: readonly BaseGraph[] = [
    {
      baseId: "DIRECT_GT",
      topologyId: "DIRECT_STRICT",
      statements: [c("E1", "GREATER_THAN", "E2", "S1")],
      query: { leftId: "E1", rightId: "E2" },
    },
    {
      baseId: "DIRECT_GTE",
      topologyId: "DIRECT_INCLUSIVE",
      statements: [c("E1", "GREATER_THAN_OR_EQUAL", "E2", "S1")],
      query: { leftId: "E1", rightId: "E2" },
    },
    {
      baseId: "STRICT_CHAIN",
      topologyId: "TWO_EDGE_STRICT_CHAIN",
      statements: [
        c("E1", "GREATER_THAN", "E2", "S1"),
        c("E2", "GREATER_THAN", "E3", "S2"),
      ],
      query: { leftId: "E1", rightId: "E3" },
    },
    {
      baseId: "INCLUSIVE_STRICT_CHAIN",
      topologyId: "INCLUSIVE_STRICT_CHAIN",
      statements: [
        c("E1", "GREATER_THAN_OR_EQUAL", "E2", "S1"),
        c("E2", "GREATER_THAN", "E3", "S2"),
      ],
      query: { leftId: "E1", rightId: "E3" },
    },
    {
      baseId: "EQUALITY_BRIDGE",
      topologyId: "EQUALITY_BRIDGE_CHAIN",
      statements: [
        c("E1", "EQUAL_TO", "E2", "S1"),
        c("E2", "LESS_THAN_OR_EQUAL", "E3", "S2"),
      ],
      query: { leftId: "E1", rightId: "E3" },
    },
    {
      baseId: "WEAK_CHAIN",
      topologyId: "THREE_EDGE_WEAK_CHAIN",
      statements: [
        c("E1", "GREATER_THAN_OR_EQUAL", "E2", "S1"),
        c("E2", "EQUAL_TO", "E3", "S2"),
        c("E3", "GREATER_THAN_OR_EQUAL", "E4", "S3"),
      ],
      query: { leftId: "E1", rightId: "E4" },
    },
    {
      baseId: "SHARED_UPPER",
      topologyId: "SHARED_UPPER_FREE_ENDPOINTS",
      statements: [
        c("E3", "GREATER_THAN", "E1", "S1"),
        c("E3", "GREATER_THAN", "E2", "S2"),
      ],
      query: { leftId: "E1", rightId: "E2" },
    },
    {
      baseId: "DISCONNECTED",
      topologyId: "DISCONNECTED_COMPONENTS",
      statements: [
        c("E1", "GREATER_THAN", "E2", "S1"),
        c("E3", "LESS_THAN", "E4", "S2"),
      ],
      query: { leftId: "E2", rightId: "E3" },
    },
    {
      baseId: "LONG_STRICT",
      topologyId: "FOUR_EDGE_MIXED_CHAIN",
      statements: [
        c("E1", "GREATER_THAN_OR_EQUAL", "E2", "S1"),
        c("E2", "EQUAL_TO", "E3", "S2"),
        c("E3", "GREATER_THAN", "E4", "S3"),
        c("E4", "GREATER_THAN_OR_EQUAL", "E5", "S4"),
      ],
      query: { leftId: "E1", rightId: "E5" },
    },
    {
      baseId: "LONG_WEAK",
      topologyId: "FOUR_EDGE_WEAK_CHAIN",
      statements: [
        c("E1", "LESS_THAN_OR_EQUAL", "E2", "S1"),
        c("E2", "EQUAL_TO", "E3", "S2"),
        c("E3", "LESS_THAN_OR_EQUAL", "E4", "S3"),
        c("E4", "EQUAL_TO", "E5", "S4"),
      ],
      query: { leftId: "E1", rightId: "E5" },
    },
    {
      baseId: "CONVERGING",
      topologyId: "CONVERGING_BRANCH",
      statements: [
        c("E1", "GREATER_THAN", "E3", "S1"),
        c("E2", "GREATER_THAN_OR_EQUAL", "E3", "S2"),
        c("E4", "GREATER_THAN", "E1", "S3"),
      ],
      query: { leftId: "E1", rightId: "E2" },
    },
    {
      baseId: "CHAIN_WITH_SIDE",
      topologyId: "CHAIN_WITH_IRRELEVANT_EDGE",
      statements: [
        c("E1", "GREATER_THAN", "E2", "S1"),
        c("E2", "GREATER_THAN_OR_EQUAL", "E3", "S2"),
        c("E4", "EQUAL_TO", "E5", "S3"),
      ],
      query: { leftId: "E1", rightId: "E3" },
    },
  ];
  return bases[((seed % bases.length) + bases.length) % bases.length]!;
}

function canonicalKey(conclusion: ComparisonConstraint): string {
  const reversed =
    conclusion.relation === "LESS_THAN" ||
    conclusion.relation === "LESS_THAN_OR_EQUAL";
  const left = reversed ? conclusion.rightId : conclusion.leftId;
  const right = reversed ? conclusion.leftId : conclusion.rightId;
  const relation =
    conclusion.relation === "LESS_THAN"
      ? "GREATER_THAN"
      : conclusion.relation === "LESS_THAN_OR_EQUAL"
        ? "GREATER_THAN_OR_EQUAL"
        : conclusion.relation;
  return `${left}:${relation}:${right}`;
}

function pairKey(conclusion: ComparisonConstraint): string {
  return [conclusion.leftId, conclusion.rightId].sort().join(":");
}

function conclusionPool(statements: readonly ComparisonConstraint[]) {
  const entities = [
    ...new Set(statements.flatMap((entry) => [entry.leftId, entry.rightId])),
  ].sort();
  const seen = new Set<string>();
  const pool: Array<{
    conclusion: ComparisonConstraint;
    truth: ConclusionTruth;
  }> = [];
  for (let i = 0; i < entities.length; i += 1) {
    for (let j = i + 1; j < entities.length; j += 1) {
      for (const relation of RELATIONS) {
        const conclusion = c(entities[i]!, relation, entities[j]!, "C-POOL");
        const key = canonicalKey(conclusion);
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

function selectConclusions(
  statements: readonly ComparisonConstraint[],
  mask: IneCp005ConclusionMask,
  random: SeededRandom,
): readonly ComparisonConstraint[] {
  const desiredDefiniteness: readonly boolean[] =
    mask === "ONLY_I"
      ? [true, false]
      : mask === "ONLY_II"
        ? [false, true]
        : mask === "BOTH"
          ? [true, true]
          : [false, false];
  const pool = conclusionPool(statements);
  const selected: Array<{
    conclusion: ComparisonConstraint;
    truth: ConclusionTruth;
  }> = [];
  for (const mustFollow of desiredDefiniteness) {
    const usedKeys = new Set(
      selected.map((entry) => canonicalKey(entry.conclusion)),
    );
    const usedPairs = new Set(
      selected.map((entry) => pairKey(entry.conclusion)),
    );
    const matches = pool.filter(
      (entry) =>
        (entry.truth === "DEFINITELY_TRUE") === mustFollow &&
        !usedKeys.has(canonicalKey(entry.conclusion)),
    );
    const differentPairs = matches.filter(
      (entry) => !usedPairs.has(pairKey(entry.conclusion)),
    );
    const available = differentPairs.length > 0 ? differentPairs : matches;
    if (available.length === 0)
      throw new Error(
        `No ${mustFollow ? "definite" : "non-definite"} conclusion available for ${mask}.`,
      );
    selected.push(random.pick(available));
  }
  return selected.map((entry, index) => ({
    ...entry.conclusion,
    sourceStatementId: `C${index + 1}`,
  }));
}

function namesFor(
  entityIds: readonly string[],
  context: IneCp005Context,
  random: SeededRandom,
): Readonly<Record<string, string>> {
  const source: readonly string[] =
    context === "GENERIC"
      ? LETTERS
      : context === "PRICE"
        ? PRODUCTS
        : context === "PRODUCTION"
          ? PLANTS
          : PEOPLE;
  const names = random.shuffle(source).slice(0, entityIds.length);
  return Object.fromEntries(
    entityIds.map((id, index) => [id, names[index]!]),
  ) as Readonly<Record<string, string>>;
}

export function buildIneCp005Scenario(
  prototypeId: IneCp005PrototypeId,
  seed: number,
): IneCp005Scenario {
  const contract = getIneCp005PrototypeContract(prototypeId);
  let base = baseGraphFor(seed);
  if (
    (contract.taskKind === "SOLVE_MIXED_RELATION" ||
      contract.taskKind === "EVALUATE_CONCLUSIONS") &&
    base.statements.length < 2
  ) {
    base = baseGraphFor(seed + 2);
  }
  const random = new SeededRandom(
    seed ^ Number.parseInt(stableHash([prototypeId, "cp005-scenario-v1"]), 16),
  );
  const context =
    CONTEXTS[((seed % CONTEXTS.length) + CONTEXTS.length) % CONTEXTS.length]!;
  let statements = base.statements;
  let query: IneCp005Scenario["query"] = base.query;
  let conclusions: readonly ComparisonConstraint[] = [];
  let expectedMask: IneCp005ConclusionMask | undefined;

  if (contract.taskKind === "INTERPRET_RELATION") {
    const phraseRelations: readonly ComparisonRelation[] = [
      "GREATER_THAN",
      "LESS_THAN",
      "GREATER_THAN_OR_EQUAL",
      "LESS_THAN_OR_EQUAL",
      "EQUAL_TO",
      "GREATER_THAN",
      "LESS_THAN",
      "EQUAL_TO",
    ];
    statements = [
      c(
        "E1",
        phraseRelations[
          ((seed % phraseRelations.length) + phraseRelations.length) %
            phraseRelations.length
        ]!,
        "E2",
        "S1",
      ),
    ];
    query = { leftId: "E1", rightId: "E2" };
  } else if (contract.taskKind === "EVALUATE_CONCLUSIONS") {
    const masks: readonly IneCp005ConclusionMask[] = [
      "ONLY_I",
      "ONLY_II",
      "BOTH",
      "NEITHER",
    ];
    expectedMask =
      masks[((seed % masks.length) + masks.length) % masks.length]!;
    conclusions = selectConclusions(statements, expectedMask, random);
    query = undefined;
  }

  const orientationRandom = new SeededRandom(
    seed ^
      Number.parseInt(stableHash([prototypeId, "cp005-orientation-v1"]), 16),
  );
  statements = random.shuffle(
    statements.map((entry) =>
      orientationRandom.int(2) === 0 ? entry : reverseConstraint(entry),
    ),
  );
  conclusions = conclusions.map((entry) =>
    orientationRandom.int(2) === 0 ? entry : reverseConstraint(entry),
  );
  if (contract.taskKind === "INTERPRET_RELATION") {
    query = {
      leftId: statements[0]!.leftId,
      rightId: statements[0]!.rightId,
    };
  } else if (query && orientationRandom.int(2) === 1) {
    query = { leftId: query.rightId, rightId: query.leftId };
  }
  const entityIds = [
    ...new Set([
      ...statements.flatMap((entry) => [entry.leftId, entry.rightId]),
      ...conclusions.flatMap((entry) => [entry.leftId, entry.rightId]),
      ...(query ? [query.leftId, query.rightId] : []),
    ]),
  ].sort();
  const entityNames = namesFor(entityIds, context, random);
  const renderedStatements = statements.map((entry, index) => {
    const surfaceKind =
      contract.taskKind === "SOLVE_MIXED_RELATION"
        ? index % 2 === 0
          ? "LINGUISTIC"
          : "SYMBOLIC"
        : "LINGUISTIC";
    return renderStructuredStatement(
      entry,
      entityNames,
      context,
      surfaceKind,
      seed + index,
    );
  });
  const renderedConclusions = conclusions.map((entry, index) =>
    renderStructuredStatement(
      entry,
      entityNames,
      context,
      "LINGUISTIC",
      seed + index + 7,
    ),
  );

  return {
    scenarioId: `${base.baseId}_${contract.taskKind}_${context}_${expectedMask ?? "RELATION"}`,
    topologyId:
      contract.taskKind === "INTERPRET_RELATION"
        ? `PHRASE_${renderedStatements[0]!.phraseKey}`
        : base.topologyId,
    taskKind: contract.taskKind,
    context,
    statements,
    renderedStatements,
    query,
    conclusions,
    renderedConclusions,
    expectedMask,
    entityNames,
  };
}
