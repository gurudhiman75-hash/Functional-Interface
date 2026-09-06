import { strict as assert } from "node:assert";

import type { KnowledgeFact } from "./types";
import {
  resolveKnowledgeCombinationAnswer,
  verifyKnowledgeComposition,
  verifyKnowledgeStatements,
} from "./composition-verifier";

function approvedFact(
  factId: string,
  entity: string,
  value: KnowledgeFact["value"],
): KnowledgeFact {
  return {
    factId,
    entityId: `test:${factId}`,
    subject: "Computer Awareness",
    chapterId: "COM-001",
    cpId: "COM-001-CP-DISCOVERY",
    relation: "test_relation",
    entity: { canonicalName: entity, label: { en: entity } },
    value,
    contextGroupId: "composition-test",
    distractorGroupIds: ["composition-test"],
    difficulty: "Medium",
    examTags: ["SSC"],
    tags: ["test"],
    source: {
      sourceId: "test-source",
      sourceType: "reference",
      title: "Test fixture",
    },
    review: {
      status: "APPROVED",
      confidence: 0.99,
      reviewedBy: "test",
      reviewedAt: "2026-08-23T14:30:00.000Z",
    },
    freshness: { class: "IMMUTABLE" },
  };
}

const facts: KnowledgeFact[] = [
  approvedFact("ram-volatility", "RAM", {
    kind: "text",
    text: { en: "volatile" },
  }),
  approvedFact("rom-volatility", "ROM", {
    kind: "text",
    text: { en: "non-volatile" },
  }),
  approvedFact("byte-bits", "1 byte", {
    kind: "number",
    value: 8,
    unit: "bits",
  }),
  approvedFact("ssd-medium", "SSD", {
    kind: "text",
    text: { en: "solid-state" },
  }),
];

const claims = [
  {
    statementId: "I",
    factId: "ram-volatility",
    claimedValue: { kind: "text" as const, text: { en: "volatile" } },
  },
  {
    statementId: "II",
    factId: "rom-volatility",
    claimedValue: { kind: "text" as const, text: { en: "volatile" } },
  },
  {
    statementId: "III",
    factId: "byte-bits",
    claimedValue: { kind: "number" as const, value: 8, unit: "bits" },
  },
  {
    statementId: "IV",
    factId: "ssd-medium",
    claimedValue: { kind: "text" as const, text: { en: "magnetic" } },
  },
];

const options = [
  { optionId: "A", trueStatementIds: ["I", "II"] },
  { optionId: "B", trueStatementIds: ["I", "III"] },
  { optionId: "C", trueStatementIds: ["II", "IV"] },
  { optionId: "D", trueStatementIds: ["I", "III", "IV"] },
];

const result = verifyKnowledgeComposition(facts, claims, options);
assert.deepEqual(
  result.truths.map((entry) => [entry.statementId, entry.true]),
  [
    ["I", true],
    ["II", false],
    ["III", true],
    ["IV", false],
  ],
);
assert.deepEqual(result.trueStatementIds, ["I", "III"]);
assert.equal(result.correctIndex, 1);
assert.equal(result.correctOptionId, "B");

assert.throws(
  () =>
    verifyKnowledgeStatements(facts, [
      claims[0]!,
      { ...claims[1]!, statementId: "I" },
    ]),
  /Duplicate knowledge composition statementId/,
);

assert.throws(
  () =>
    resolveKnowledgeCombinationAnswer(result.truths, [
      { optionId: "A", trueStatementIds: ["I", "III"] },
      { optionId: "B", trueStatementIds: ["III", "I"] },
    ]),
  /duplicate truth combinations/i,
);

assert.throws(
  () =>
    resolveKnowledgeCombinationAnswer(result.truths, [
      { optionId: "A", trueStatementIds: ["I"] },
      { optionId: "B", trueStatementIds: ["II"] },
    ]),
  /found 0 matching options/,
);
