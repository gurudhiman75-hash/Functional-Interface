import { strict as assert } from "node:assert";

import { KnowledgeV1Engine } from "./engine";
import { validateKnowledgeFactEligibility } from "./eligibility";
import type {
  KnowledgeFact,
  KnowledgePackageDefinition,
} from "./types";

const reviewedAt = "2026-08-20T00:00:00.000Z";

function fact(
  factId: string,
  entity: string,
  classification: string,
): KnowledgeFact {
  return {
    factId,
    entityId: `entity:${factId}`,
    subject: "Computer Awareness",
    chapterId: "COM-FIXTURE-001",
    cpId: "COM-CP-FIX-001",
    relation: "classified_as",
    entity: {
      canonicalName: entity,
      label: { en: entity },
    },
    value: {
      kind: "text",
      text: { en: classification },
    },
    contextGroupId: "computer-memory-classification",
    distractorGroupIds: ["memory-and-storage-types"],
    difficulty: "Medium",
    examTags: ["SSC", "BANKING"],
    tags: ["fixture", "memory"],
    source: {
      sourceId: "fixture-source",
      sourceType: "reference",
      title: "Knowledge V1 deterministic fixture",
      locator: factId,
    },
    review: {
      status: "APPROVED",
      confidence: 0.99,
      reviewedBy: "fixture-reviewer",
      reviewedAt,
    },
    freshness: {
      class: "IMMUTABLE",
    },
  };
}

const facts: KnowledgeFact[] = [
  fact("ram", "RAM", "volatile primary memory"),
  fact("rom", "ROM", "non-volatile read-mostly memory"),
  fact("cache", "Cache memory", "small high-speed processor-near memory"),
  fact("ssd", "SSD", "non-volatile solid-state secondary storage"),
  fact("hdd", "Hard disk drive", "magnetic secondary storage"),
  {
    ...fact("unverified-current", "Current device", "temporary current classification"),
    freshness: {
      class: "CURRENT",
      validFrom: "2026-01-01",
    },
  },
];

const pkg: KnowledgePackageDefinition = {
  packageId: "COM-FIXTURE-001",
  subject: "Computer Awareness",
  topic: "Computer Fundamentals",
  subtopic: "Memory and Storage",
  label: "Computer Memory Fixture",
  enabled: true,
  cpIds: ["COM-CP-FIX-001"],
  supportedLanguages: ["en"],
  qls: [
    {
      qlId: "COM-QL-FIX-001",
      name: "Classify a memory or storage component",
      cpId: "COM-CP-FIX-001",
      relation: "classified_as",
      mode: "FORWARD_RECALL",
      answerText: (entry) => {
        assert.equal(entry.value.kind, "text");
        return entry.value.kind === "text" ? entry.value.text.en : "";
      },
      renderStem: (entry) => `${entry.entity.label.en} is best classified as:`,
      renderExplanation: (entry) => {
        assert.equal(entry.value.kind, "text");
        const value = entry.value.kind === "text" ? entry.value.text.en : "";
        return `${entry.entity.label.en} is classified as ${value}.`;
      },
    },
  ],
};

const invalidCurrent = validateKnowledgeFactEligibility(facts[5]!, {
  asOf: "2026-08-23T00:00:00.000Z",
});
assert.equal(invalidCurrent.eligible, false);
assert.equal(
  invalidCurrent.issues.some((issue) => issue.code === "MUTABLE_FACT_NOT_VERIFIED"),
  true,
);

const expiredEvent: KnowledgeFact = {
  ...fact("expired-event", "Expired event", "old event value"),
  freshness: {
    class: "EVENT",
    validFrom: "2025-01-01",
    validUntil: "2025-12-31",
    lastVerifiedAt: "2025-12-31",
  },
};
const expiredResult = validateKnowledgeFactEligibility(expiredEvent, {
  asOf: "2026-08-23T00:00:00.000Z",
});
assert.equal(expiredResult.eligible, false);
assert.equal(
  expiredResult.issues.some((issue) => issue.code === "FACT_EXPIRED"),
  true,
);

const engine = new KnowledgeV1Engine(facts, [pkg]);
const request = {
  packageId: pkg.packageId,
  language: "en" as const,
  difficulty: "Medium" as const,
  count: 20,
  seed: "knowledge-v1-replay-proof",
  asOf: "2026-08-23T00:00:00.000Z",
  canonicalProblemId: "COM-QL-FIX-001",
};

const first = engine.generate(request);
const second = engine.generate(request);
assert.deepEqual(first, second);
assert.equal(first.questions.length, 20);
assert.equal(first.generationContext.engineId, "knowledge-v1");
assert.equal(first.generationContext.reviewStatus, "REVIEW_REQUIRED");
assert.equal(first.generationContext.automaticStudentPublication, false);

for (const question of first.questions) {
  assert.equal(question.engineId, "knowledge-v1");
  assert.equal(question.packageId, pkg.packageId);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
  assert.equal(question.validation.valid, true);
  assert.equal(question.factId === "unverified-current", false);
  assert.equal(question.sourceMetadata.sourceId, "fixture-source");
}

// Correct answers must not be structurally pinned to option A.
assert.equal(
  new Set(first.questions.map((question) => question.correctIndex)).size > 1,
  true,
);

assert.throws(
  () =>
    engine.generate({
      ...request,
      seed: "",
    }),
  /explicit deterministic seed/,
);

assert.throws(
  () =>
    engine.generate({
      ...request,
      asOf: "not-a-date",
    }),
  /valid explicit asOf date/,
);
