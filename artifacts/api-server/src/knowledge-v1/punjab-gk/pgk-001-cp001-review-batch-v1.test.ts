import assert from "node:assert/strict";
import {
  PGK_001_CP001_REQUIRED_FACTS_V1,
  PGK_001_CP001_REVIEW_BATCH_V1,
  auditPgk001Cp001ReviewBatchV1,
} from "./pgk-001-cp001-review-batch-v1";
import { PGK_001_CP001_FACTS_V1 } from "./pgk-001-cp001-facts";

const audit = auditPgk001Cp001ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join(" | "));
assert.equal(PGK_001_CP001_REVIEW_BATCH_V1.length, 36);
assert.equal(PGK_001_CP001_REQUIRED_FACTS_V1.length, PGK_001_CP001_FACTS_V1.length);
assert.equal(audit.usedFactCount, audit.requiredFactCount);

const historicalRiverQuestions = PGK_001_CP001_REVIEW_BATCH_V1.filter((question) =>
  question.factIds.includes("historical-five-rivers"),
);
assert.ok(historicalRiverQuestions.length > 0);
for (const question of historicalRiverQuestions) {
  const lower = `${question.stem} ${question.explanation}`.toLowerCase();
  if (lower.includes("chenab") || lower.includes("jhelum") || lower.includes("five")) {
    assert.ok(
      lower.includes("histor") || lower.includes("tradition") || lower.includes("present"),
      `${question.questionId} must preserve the historical/present-day river distinction`,
    );
  }
}

const districtQuestions = PGK_001_CP001_REVIEW_BATCH_V1.filter((question) =>
  question.factIds.includes("district-count-2022"),
);
assert.ok(districtQuestions.length > 0);
for (const question of districtQuestions) {
  assert.ok(
    `${question.stem} ${question.explanation}`.includes("2022"),
    `${question.questionId} must keep the district count versioned to 2022`,
  );
}

const bannedStemPhrases = [
  "which of the following is associated with",
  "with reference to punjab",
  "in the punjab gk engine",
  "review batch",
  "generator",
  "source fact",
];
for (const question of PGK_001_CP001_REVIEW_BATCH_V1) {
  const lowerStem = question.stem.toLowerCase();
  for (const banned of bannedStemPhrases) {
    assert.equal(lowerStem.includes(banned), false, `${question.questionId} contains banned learner-facing terminology: ${banned}`);
  }
}

const bannedLearnerSourcePhrases = [
  "state government profile",
  "government of punjab gives",
  "punjab government profile",
  "official punjab profile",
  "punjab at a glance",
  "envis reference",
  "official statistical profile",
  "cited 2022 statistical snapshot",
];
for (const question of PGK_001_CP001_REVIEW_BATCH_V1) {
  const learnerText = `${question.stem} ${question.explanation} ${question.options.join(" ")}`.toLowerCase();
  for (const banned of bannedLearnerSourcePhrases) {
    assert.equal(
      learnerText.includes(banned),
      false,
      `${question.questionId} leaks source/provenance wording to learner text: ${banned}`,
    );
  }
}
