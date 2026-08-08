import assert from "node:assert/strict";
import { exactEquals, exactKey } from "../foundation/exact";
import {
  MEN_CP011_COST_LINING_AUTHORITY,
  auditMenCp011CostBatch,
  generateMenCp011CostQuestion,
  generateMenCp011CostReviewBatch,
  getMenCp011CostPrototypeIds,
} from "./cost-lining";

const seedsPerPrototype = 128;
let runtimePackageCount = 0;
const seenPiPolicies = new Set<string>();

for (const prototypeId of getMenCp011CostPrototypeIds()) {
  for (let index = 0; index < seedsPerPrototype; index += 1) {
    const question = generateMenCp011CostQuestion(
      prototypeId,
      `cost-runtime-proof:${prototypeId}:${index}`,
    );

    assert.equal(
      question.validation.valid,
      true,
      `${prototypeId} failed cost validation for seed ${index}: ${question.validation.checks
        .filter((check) => !check.passed)
        .map((check) => `${check.name}: ${check.message}`)
        .join(" | ")}`,
    );
    assert.equal(question.verification.valid, true);
    assert.equal(question.costAuthority, MEN_CP011_COST_LINING_AUTHORITY);
    assert.equal(question.permanentQlId, null);
    assert.equal(question.questionBankStatus, "NOT_STORED");
    assert.equal(question.testEligibility, "INELIGIBLE");
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.questionStudioDiscoverable, false);
    assert.equal(question.renderSurfaces.attempt.diagram, null);
    assert.equal(question.renderSurfaces.responsiveDiagramPolicy.minWidthPx, 0);
    assert.equal(question.options.length, 4);
    assert.equal(
      new Set(question.options.map((option) => exactKey(option.value))).size,
      4,
    );
    assert.equal(
      question.options.filter((option) => option.isCorrect).length,
      1,
    );
    assert.equal(question.options[question.correctIndex]?.isCorrect, true);
    assert.equal(exactEquals(question.exactAnswer, question.state.cost), true);
    assert.equal(question.exactAnswer.kind, "RATIONAL");
    assert.ok(question.state.ratePerSquareMetre > 0n);
    assert.equal(
      question.state.includedAreaCoefficient,
      question.state.curvedAreaCoefficient + question.state.baseAreaCoefficient,
    );
    assert.match(
      question.diagram.svg,
      /data-diagram-version="OPEN_CYLINDER_COST_LEDGER_V1"/,
    );
    assert.match(question.diagram.svg, /data-diagram-role="PROMPT"/);
    assert.match(question.solutionDiagram.svg, /data-diagram-role="SOLUTION"/);
    assert.match(question.diagram.svg, /data-region="open-mouth"/);
    assert.match(question.diagram.svg, /data-status="ABSENT_FACE"/);
    assert.match(question.diagram.svg, /data-region="existing-base"/);
    assert.doesNotMatch(question.diagram.svg, /<svg[^>]+\bwidth="\d+/);
    assert.match(question.learnerSolution.formula, /C=A\\times q/);
    assert.match(question.learnerSolution.shortcut, /\\pi r\(2h\+r\)/);
    assert.ok(
      question.learnerSolution.wrongOptionAnalysis.every(
        (line) => !/\[(?:STOPPED_|ADDED_|OMITTED_)/.test(line),
      ),
    );
    const learnerText = [
      question.stem,
      ...question.options.map((option) => option.display),
      question.answer,
      question.learnerSolution.formula,
      ...question.learnerSolution.steps,
      question.learnerSolution.finalAnswer,
      question.learnerSolution.shortcut,
      ...question.learnerSolution.wrongOptionAnalysis,
    ].join("\n");
    assert.equal((learnerText.match(/\$/g) ?? []).length % 2, 0);
    assert.doesNotMatch(learnerText, /\\pih/);

    if (
      prototypeId === "MEN-CP011-PROT-OPEN-CONTAINER-SHEET-COST"
    ) {
      assert.equal(question.state.context, "OPEN_SHEET");
      assert.match(question.stem, /sheet/i);
      assert.match(question.explanation.keyRule, /open top/i);
      assert.ok(
        question.options.some(
          (option) =>
            option.misconceptionId === "STOPPED_AT_SHEET_AREA_WITHOUT_RATE",
        ),
      );
    } else {
      assert.equal(question.state.context, "INNER_LINING");
      assert.match(question.stem, /lin|coat/i);
      assert.match(question.explanation.keyRule, /inside|inner/i);
      assert.ok(
        question.options.some(
          (option) =>
            option.misconceptionId === "OMITTED_INNER_BASE_FROM_LINING",
        ),
      );
    }

    if (question.piPolicy === "PI_22_OVER_7") {
      assert.match(question.stem, /\\frac\{22\}\{7\}/);
    } else {
      assert.match(question.stem, /3\.14/);
      assert.match(question.learnerSolution.steps.join("\n"), /157\}\{50/);
    }

    seenPiPolicies.add(question.piPolicy);
    runtimePackageCount += 1;
  }
}

assert.equal(
  runtimePackageCount,
  getMenCp011CostPrototypeIds().length * seedsPerPrototype,
);
assert.deepEqual([...seenPiPolicies].sort(), ["PI_22_OVER_7", "PI_3_14"]);

const review = generateMenCp011CostReviewBatch();
const audit = auditMenCp011CostBatch(review.records);

assert.equal(review.records.length, 32);
assert.equal(audit.authority, MEN_CP011_COST_LINING_AUTHORITY);
assert.equal(audit.prototypeCount, 2);
assert.equal(audit.recordCount, 32);
assert.equal(audit.exactStemCount, 32);
assert.equal(audit.exactQuestionOptionCount, 32);
assert.ok(audit.maximumNormalizedStemRepetition <= 8);
assert.equal(audit.uniquePhysicalStateCount, 32);
assert.deepEqual(audit.piPolicyCounts, {
  PI_22_OVER_7: 16,
  PI_3_14: 16,
});
assert.deepEqual(audit.answerPositionCounts, { A: 8, B: 8, C: 8, D: 8 });
assert.ok(
  Object.values(audit.prototypePolicyCounts).every((count) => count === 8),
);
assert.equal(audit.publicationEligible, false);
assert.deepEqual(audit.resolvedDiscoveryCandidates, [
  "MEN-CP011-PROT-OPEN-CONTAINER-SHEET-COST",
  "MEN-CP011-PROT-INNER-LINING-COST",
]);
assert.ok(
  review.records.every(
    (question) => question.validation.valid && question.verification.valid,
  ),
);
assert.ok(
  review.records.every(
    (question) =>
      question.permanentQlId === null &&
      question.questionBankStatus === "NOT_STORED" &&
      question.testEligibility === "INELIGIBLE" &&
      !question.publiclyPublishable &&
      !question.questionStudioDiscoverable,
  ),
);

console.log(
  `MEN-CP-011 cost and lining Wave 01 passed for ${runtimePackageCount} deterministic runtime packages and a 32-record balanced review matrix. Permanent QLs remain 0 and all delivery surfaces remain disabled.`,
);
