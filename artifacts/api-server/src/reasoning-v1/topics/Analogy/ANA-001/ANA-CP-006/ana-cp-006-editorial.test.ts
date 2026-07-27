import assert from "node:assert/strict";
import { generateClusterAnalogy } from "./generator";
import { ANA_CP006_QLS } from "./question-language.en";

const BANNED_STUDENT_PHRASES = [
  /positional shift vector/i,
  /successive shifts/i,
  /fixed positional pattern/i,
  /the signs alternate/i,
  /read the cluster/i,
  /is read from right to left/i,
  /apply context/i,
  /rule parameter/i,
  /registered family/i,
  /CLUSTER_[A-Z_]+/,
];

const REVIEW_SEEDS = [0, 7, 19, 34, 51, 73] as const;

for (const ql of ANA_CP006_QLS) {
  for (const seed of REVIEW_SEEDS) {
    const question = generateClusterAnalogy(ql.qlId, seed);
    const explanation = [
      question.explanation.ruleStatement,
      question.explanation.sourceDemonstration,
      question.explanation.targetApplication,
      question.explanation.conclusion,
      question.explanation.closestTrapRejection,
    ].join("\n");

    for (const banned of BANNED_STUDENT_PHRASES) {
      assert.equal(
        banned.test(explanation),
        false,
        `${ql.qlId} seed ${seed} contains banned student wording: ${banned}`,
      );
    }

    assert.ok(
      question.explanation.sourceDemonstration.includes(question.source.left),
      `${ql.qlId} seed ${seed} source explanation must name the source input`,
    );
    assert.ok(
      question.explanation.sourceDemonstration.includes(question.source.right),
      `${ql.qlId} seed ${seed} source explanation must show the source result`,
    );
    assert.ok(
      question.explanation.targetApplication.includes(question.target.left),
      `${ql.qlId} seed ${seed} target explanation must name the target input`,
    );
    assert.ok(
      question.explanation.targetApplication.includes(question.target.right),
      `${ql.qlId} seed ${seed} target explanation must show the target result`,
    );

    assert.ok(
      question.explanation.sourceDemonstration.length >= 75,
      `${ql.qlId} seed ${seed} source explanation is too short`,
    );
    assert.ok(
      question.explanation.targetApplication.length >= 75,
      `${ql.qlId} seed ${seed} target explanation is too short`,
    );
    assert.ok(
      question.explanation.closestTrapRejection.length >= 45,
      `${ql.qlId} seed ${seed} trap rejection is too short`,
    );

    if (
      ql.ruleId === "CLUSTER_REVERSE_THEN_SHIFT" ||
      ql.ruleId === "CLUSTER_SHIFT_THEN_REVERSE" ||
      ql.ruleId === "CLUSTER_TWO_STAGE_MIXED"
    ) {
      assert.match(
        question.explanation.sourceDemonstration,
        /First|first/,
        `${ql.qlId} seed ${seed} must identify the first operation`,
      );
      assert.match(
        question.explanation.sourceDemonstration,
        /Then|then/,
        `${ql.qlId} seed ${seed} must identify the second operation`,
      );
    }
  }
}

console.log(
  `ANA-CP-006 editorial audit passed for ${ANA_CP006_QLS.length * REVIEW_SEEDS.length} review questions.`,
);
