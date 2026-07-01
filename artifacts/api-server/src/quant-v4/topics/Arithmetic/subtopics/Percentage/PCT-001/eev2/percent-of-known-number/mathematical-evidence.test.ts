import { strict as assert } from "node:assert";
import { solvePct001 } from "../../solver";
import {
  PCT_001_ARCHETYPE_ID,
  type Pct001AnswerType,
  type Pct001Parameters,
  type Pct001SemanticEntity,
} from "../../types";

type EvidenceCase = {
  name: string;
  knownRate: number;
  knownValue: number;
  targetRate: number;
  answerType?: Pct001AnswerType;
  entity?: Pct001SemanticEntity;
  expectedUnit?: string;
  expectedCountIntegrity?: "required" | "not-required";
};

function parametersFor(testCase: EvidenceCase): Pct001Parameters {
  return {
    archetypeId: PCT_001_ARCHETYPE_ID,
    canonicalProblemId: "PCT-CP-002",
    questionId: `ENG-002:${testCase.name}`,
    questionLanguageId: "PCT-QL-017",
    explanationId: "PCT-ES-002",
    language: "en",
    difficultyBand: "Easy",
    taskKind: "percentOfKnownNumber",
    answerType: testCase.answerType ?? "ABSOLUTE",
    requiredVariables: ["rate1", "value1", "rate2"],
    variables: {
      rate1: testCase.knownRate,
      value1: testCase.knownValue,
      rate2: testCase.targetRate,
    },
    semanticContext: testCase.entity
      ? {
          scenario: "eng-002",
          entities: { quantity: testCase.entity },
        }
      : undefined,
    sourceTrace: {
      questionLanguageSource: "ENG-002",
      explanationSource: "ENG-002",
      variableRangeSource: "ENG-002",
    },
  };
}

function assertClose(actual: number, expected: number, label: string) {
  const tolerance = Math.max(1, Math.abs(actual), Math.abs(expected)) * 1e-12;
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label}: expected ${expected}, received ${actual}`,
  );
}

const cases: EvidenceCase[] = [
  {
    name: "requested-greater-integer",
    knownRate: 20,
    knownValue: 600,
    targetRate: 25,
  },
  {
    name: "requested-smaller",
    knownRate: 40,
    knownValue: 200,
    targetRate: 10,
  },
  {
    name: "equal-rates",
    knownRate: 30,
    knownValue: 450,
    targetRate: 30,
  },
  {
    name: "terminating-decimal",
    knownRate: 8,
    knownValue: 10,
    targetRate: 12,
  },
  {
    name: "large-values",
    knownRate: 25,
    knownValue: 2_500_000,
    targetRate: 80,
  },
  {
    name: "count-context",
    knownRate: 20,
    knownValue: 120,
    targetRate: 30,
    answerType: "COUNT",
    entity: {
      id: "students",
      en: "students",
      hi: "students-hi",
      pa: "students-pa",
      numberType: "countable",
    },
    expectedUnit: "students",
    expectedCountIntegrity: "required",
  },
  {
    name: "currency-context",
    knownRate: 25,
    knownValue: 1_250,
    targetRate: 40,
    entity: {
      id: "rupees",
      en: "rupees",
      hi: "rupees-hi",
      pa: "rupees-pa",
      numberType: "uncountable",
    },
    expectedUnit: "rupees",
    expectedCountIntegrity: "not-required",
  },
  {
    name: "abstract-context",
    knownRate: 15,
    knownValue: 90,
    targetRate: 35,
    expectedUnit: "abstract-number",
    expectedCountIntegrity: "not-required",
  },
];

for (const testCase of cases) {
  const result = solvePct001(parametersFor(testCase));
  const evidence = result.educationalEvidence;
  assert.ok(evidence, `${testCase.name}: missing educational evidence`);
  assert.equal(evidence.taskKind, "percentOfKnownNumber");
  assert.equal(evidence.methodFamily, "UNIT_VALUE");
  assert.equal(evidence.sourceValues.knownUnitCount, testCase.knownRate);
  assert.equal(evidence.sourceValues.knownQuantity, testCase.knownValue);
  assert.equal(evidence.sourceValues.targetUnitCount, testCase.targetRate);
  assert.equal(
    evidence.units.targetQuantity,
    testCase.expectedUnit ?? "abstract-number",
  );
  assert.equal(
    evidence.metadata.countIntegrity,
    testCase.expectedCountIntegrity ?? "not-required",
  );

  assertClose(
    evidence.derivedValues.singleUnitValue *
      evidence.sourceValues.knownUnitCount,
    evidence.sourceValues.knownQuantity,
    `${testCase.name}: known relation`,
  );
  assertClose(
    evidence.derivedValues.singleUnitValue *
      evidence.sourceValues.targetUnitCount,
    evidence.derivedValues.targetQuantity,
    `${testCase.name}: target relation`,
  );
  assertClose(
    evidence.derivedValues.targetQuantity,
    result.numericAnswer ?? Number.NaN,
    `${testCase.name}: solver parity`,
  );
}

assert.throws(
  () =>
    solvePct001(
      parametersFor({
        name: "zero-denominator",
        knownRate: 0,
        knownValue: 100,
        targetRate: 25,
      }),
    ),
  /positive known unit count/,
);

assert.throws(
  () =>
    solvePct001(
      parametersFor({
        name: "non-finite",
        knownRate: 20,
        knownValue: Number.POSITIVE_INFINITY,
        targetRate: 25,
      }),
    ),
  /finite source values/,
);

const unrelatedTask = solvePct001({
  ...parametersFor({
    name: "unrelated-task",
    knownRate: 20,
    knownValue: 100,
    targetRate: 25,
  }),
  canonicalProblemId: "PCT-CP-001",
  questionLanguageId: "PCT-QL-001",
  taskKind: "percentOf",
  requiredVariables: ["percentageRate", "baseValue"],
  variables: {
    percentageRate: 20,
    baseValue: 100,
  },
});
assert.equal(
  unrelatedTask.educationalEvidence,
  undefined,
  "Non-target task kinds must not receive UNIT_VALUE evidence.",
);

console.log(`ENG-002 mathematical evidence tests passed (${cases.length} cases).`);
