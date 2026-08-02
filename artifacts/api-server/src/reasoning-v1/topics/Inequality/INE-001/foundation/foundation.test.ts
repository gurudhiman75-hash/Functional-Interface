import assert from "node:assert/strict";

import {
  analyzeInequalityGraph,
  assertSolverAgreement,
  createComparisonConstraint,
  evaluateConclusion,
  normalizePhraseKey,
  normalizeRelation,
  relationDomain,
  reverseRelation,
  solvePairRelation,
} from "./index";
import type { ComparisonConstraint } from "./types";

const c = (
  leftId: string,
  relation: Parameters<typeof createComparisonConstraint>[1],
  rightId: string,
  sourceStatementId: string,
): ComparisonConstraint =>
  createComparisonConstraint(leftId, relation, rightId, sourceStatementId);

assert.equal(normalizeRelation(">="), "GREATER_THAN_OR_EQUAL");
assert.equal(normalizeRelation("≤"), "LESS_THAN_OR_EQUAL");
assert.equal(normalizePhraseKey("NOT_LESS_THAN"), "GREATER_THAN_OR_EQUAL");
assert.equal(normalizePhraseKey("NEITHER_GREATER_NOR_EQUAL"), "LESS_THAN");
assert.deepEqual(relationDomain("LESS_THAN_OR_EQUAL"), ["LT", "EQ"]);

for (const relation of [
  "GREATER_THAN",
  "LESS_THAN",
  "EQUAL_TO",
  "GREATER_THAN_OR_EQUAL",
  "LESS_THAN_OR_EQUAL",
] as const) {
  assert.equal(reverseRelation(reverseRelation(relation)), relation);
}

const cases: Array<{
  name: string;
  constraints: readonly ComparisonConstraint[];
  leftId: string;
  rightId: string;
  expectedDomain: readonly string[];
  expectedStrongest?: string;
}> = [
  {
    name: "strict direct",
    constraints: [c("A", ">", "B", "S1")],
    leftId: "A",
    rightId: "B",
    expectedDomain: ["GT"],
    expectedStrongest: "GREATER_THAN",
  },
  {
    name: "reverse direct",
    constraints: [c("A", ">", "B", "S1")],
    leftId: "B",
    rightId: "A",
    expectedDomain: ["LT"],
    expectedStrongest: "LESS_THAN",
  },
  {
    name: "inclusive chain",
    constraints: [c("A", "≥", "B", "S1"), c("B", ">=", "C", "S2")],
    leftId: "A",
    rightId: "C",
    expectedDomain: ["EQ", "GT"],
    expectedStrongest: "GREATER_THAN_OR_EQUAL",
  },
  {
    name: "mixed chain becomes strict",
    constraints: [
      c("A", "≥", "B", "S1"),
      c("B", ">", "C", "S2"),
      c("C", "≥", "D", "S3"),
    ],
    leftId: "A",
    rightId: "D",
    expectedDomain: ["GT"],
    expectedStrongest: "GREATER_THAN",
  },
  {
    name: "equality propagation",
    constraints: [c("A", "=", "B", "S1"), c("B", ">", "C", "S2")],
    leftId: "A",
    rightId: "C",
    expectedDomain: ["GT"],
    expectedStrongest: "GREATER_THAN",
  },
  {
    name: "derived equality from inclusive cycle",
    constraints: [c("A", "≥", "B", "S1"), c("B", "≥", "A", "S2")],
    leftId: "A",
    rightId: "B",
    expectedDomain: ["EQ"],
    expectedStrongest: "EQUAL_TO",
  },
  {
    name: "opposing branches are indeterminate",
    constraints: [c("A", ">", "B", "S1"), c("C", ">", "B", "S2")],
    leftId: "A",
    rightId: "C",
    expectedDomain: ["LT", "EQ", "GT"],
  },
  {
    name: "disconnected entities are indeterminate",
    constraints: [c("A", ">", "B", "S1"), c("C", "=", "D", "S2")],
    leftId: "A",
    rightId: "D",
    expectedDomain: ["LT", "EQ", "GT"],
  },
  {
    name: "less-than direction normalization",
    constraints: [c("A", "<", "B", "S1"), c("B", "≤", "C", "S2")],
    leftId: "A",
    rightId: "C",
    expectedDomain: ["LT"],
    expectedStrongest: "LESS_THAN",
  },
];

for (const testCase of cases) {
  const solved = solvePairRelation(
    testCase.constraints,
    testCase.leftId,
    testCase.rightId,
  );
  assert.deepEqual(
    solved.possibleAtomicRelations,
    testCase.expectedDomain,
    testCase.name,
  );
  assert.equal(
    solved.strongestDefiniteRelation,
    testCase.expectedStrongest,
    testCase.name,
  );
  assert.equal(
    solved.isDefinite,
    testCase.expectedStrongest !== undefined,
    testCase.name,
  );

  const agreement = assertSolverAgreement(
    testCase.constraints,
    testCase.leftId,
    testCase.rightId,
  );
  assert.equal(agreement.agreed, true, testCase.name);
  assert.ok(agreement.modelEvidence.validModelCount > 0, testCase.name);
  for (const order of testCase.expectedDomain) {
    assert.ok(
      agreement.modelEvidence.witnessByRelation[order as "LT" | "EQ" | "GT"],
      `${testCase.name} must retain a ${order} witness.`,
    );
  }
}

const conclusionStatements = [c("A", "≥", "B", "S1")];
assert.equal(
  evaluateConclusion(conclusionStatements, c("A", "≥", "B", "C1")).truth,
  "DEFINITELY_TRUE",
);
assert.equal(
  evaluateConclusion(conclusionStatements, c("A", ">", "B", "C2")).truth,
  "POSSIBLY_TRUE",
);
assert.equal(
  evaluateConclusion(conclusionStatements, c("A", "<", "B", "C3")).truth,
  "IMPOSSIBLE",
);

const equalityAnalysis = analyzeInequalityGraph([
  c("A", "=", "B", "S1"),
  c("B", "=", "C", "S2"),
]);
assert.equal(equalityAnalysis.consistent, true);
assert.deepEqual(equalityAnalysis.equalityComponents, [["A", "B", "C"]]);

const strictSelfContradiction = [
  c("A", "=", "B", "S1"),
  c("A", ">", "B", "S2"),
];
const strictSelfAnalysis = analyzeInequalityGraph(strictSelfContradiction);
assert.equal(strictSelfAnalysis.consistent, false);
assert.ok(
  strictSelfAnalysis.contradictions.some(
    (entry) => entry.code === "STRICT_SELF_RELATION",
  ),
);
assert.equal(
  assertSolverAgreement(strictSelfContradiction, "A", "B").agreed,
  true,
);

const strictCycle = [
  c("A", ">", "B", "S1"),
  c("B", "≥", "C", "S2"),
  c("C", "≥", "A", "S3"),
];
const strictCycleAnalysis = analyzeInequalityGraph(strictCycle);
assert.equal(strictCycleAnalysis.consistent, false);
assert.ok(
  strictCycleAnalysis.contradictions.some(
    (entry) => entry.code === "STRICT_ORDER_CYCLE",
  ),
);
assert.equal(assertSolverAgreement(strictCycle, "A", "C").agreed, true);

const permutable = [
  c("P", "≥", "Q", "S1"),
  c("Q", ">", "R", "S2"),
  c("R", "=", "S", "S3"),
];
assert.deepEqual(
  solvePairRelation(permutable, "P", "S").possibleAtomicRelations,
  solvePairRelation([...permutable].reverse(), "P", "S")
    .possibleAtomicRelations,
);

const exhaustiveEntities = ["A", "B", "C"] as const;
const exhaustivePairs = [
  ["A", "B"],
  ["A", "C"],
  ["B", "C"],
] as const;
const exhaustiveRelations = [
  null,
  "GREATER_THAN",
  "LESS_THAN",
  "EQUAL_TO",
  "GREATER_THAN_OR_EQUAL",
  "LESS_THAN_OR_EQUAL",
] as const;
let exhaustiveStatementSets = 0;
let exhaustiveQueries = 0;

for (const firstRelation of exhaustiveRelations) {
  for (const secondRelation of exhaustiveRelations) {
    for (const thirdRelation of exhaustiveRelations) {
      const relationChoices = [
        firstRelation,
        secondRelation,
        thirdRelation,
      ] as const;
      const statements: ComparisonConstraint[] = [];
      for (
        let pairIndex = 0;
        pairIndex < exhaustivePairs.length;
        pairIndex += 1
      ) {
        const relation = relationChoices[pairIndex];
        if (!relation) continue;
        const [leftId, rightId] = exhaustivePairs[pairIndex]!;
        statements.push(c(leftId, relation, rightId, `E${pairIndex + 1}`));
      }

      exhaustiveStatementSets += 1;
      for (
        let leftIndex = 0;
        leftIndex < exhaustiveEntities.length;
        leftIndex += 1
      ) {
        for (
          let rightIndex = leftIndex + 1;
          rightIndex < exhaustiveEntities.length;
          rightIndex += 1
        ) {
          const agreement = assertSolverAgreement(
            statements,
            exhaustiveEntities[leftIndex]!,
            exhaustiveEntities[rightIndex]!,
          );
          assert.equal(agreement.agreed, true);
          exhaustiveQueries += 1;
        }
      }
    }
  }
}

console.log("INE-001 inequality foundation audit passed.", {
  solvedCases: cases.length,
  contradictionCases: 2,
  exhaustiveStatementSets,
  exhaustiveQueries,
  permanentQlCount: 0,
  questionStudioVisible: false,
});
