import { strict as assert } from "node:assert";

import {
  COM001_EDITORIALLY_BLOCKED_SOURCE_IDS,
  COM001_EDITORIAL_FACT_DECISIONS,
} from "./com001-editorial-review";
import {
  generateCom001ReviewBatch,
  listCom001ReviewQlIds,
} from "./com001-review-synthesis";

const blockedSources = new Set<string>(COM001_EDITORIALLY_BLOCKED_SOURCE_IDS);
const nonApprovedFactIds = new Set(
  COM001_EDITORIAL_FACT_DECISIONS
    .filter((entry) => entry.disposition !== "APPROVE")
    .map((entry) => entry.factId),
);

const forbiddenEditorialLanguage = [
  /canonical fact/i,
  /canonical relation/i,
  /distractor/i,
  /this QL/i,
  /reviewed device profile/i,
  /solver authority/i,
  /sourceFact/i,
];

let audited = 0;
for (const qlId of listCom001ReviewQlIds()) {
  const batch = generateCom001ReviewBatch(
    qlId,
    40,
    `editorial-audit:${qlId}`,
  );
  const stems = new Set<string>();
  const answers = new Set<string>();
  const positions = new Set<number>();

  for (const question of batch) {
    audited += 1;
    stems.add(question.stem);
    answers.add(question.canonicalAnswer);
    positions.add(question.correctIndex);

    assert.equal(question.reviewOnly, true);
    assert.equal(question.runtimeRegistered, false);
    assert.equal(question.stem.trim().length > 0, true);
    assert.equal(question.explanation.trim().length > 0, true);
    assert.equal(question.explanation.length <= 650, true, `${question.questionId} explanation too long`);

    for (const pattern of forbiddenEditorialLanguage) {
      assert.equal(
        pattern.test(question.stem),
        false,
        `${question.questionId} leaked editorial language in stem: ${pattern}`,
      );
      assert.equal(
        pattern.test(question.explanation),
        false,
        `${question.questionId} leaked editorial language in explanation: ${pattern}`,
      );
    }

    assert.equal(
      question.sourceIds.some((sourceId) => blockedSources.has(sourceId)),
      false,
      `${question.questionId} used an editorially blocked source`,
    );
    assert.equal(
      question.sourceFactIds.some((factId) => nonApprovedFactIds.has(factId)),
      false,
      `${question.questionId} used a held/rejected fact`,
    );
    assert.equal(
      question.sourceFactIds.includes("com001-sram-layer"),
      false,
      `${question.questionId} leaked ambiguous SRAM layer classification`,
    );
  }

  assert.equal(stems.size >= 3, true, `${qlId} needs at least three editorial stem surfaces`);
  assert.equal(answers.size >= 2, true, `${qlId} needs broader answer/object coverage`);
  assert.equal(positions.size >= 3, true, `${qlId} answer position spread is too narrow`);
}

assert.equal(audited, 360);

const capacityBatch = generateCom001ReviewBatch(
  "COM-001-QL-009",
  80,
  "editorial-capacity-convention",
);
for (const question of capacityBatch) {
  if (!/byte/i.test(question.stem) || /one byte|bit-to-byte/i.test(question.stem)) {
    continue;
  }
  assert.equal(
    /SI|IEC|decimal-prefix|binary-prefix/i.test(question.stem),
    true,
    `${question.questionId} must state the capacity-prefix convention`,
  );
}
assert.equal(
  capacityBatch.some((question) => /KB\s*=\s*1024/i.test(question.stem)),
  false,
);
