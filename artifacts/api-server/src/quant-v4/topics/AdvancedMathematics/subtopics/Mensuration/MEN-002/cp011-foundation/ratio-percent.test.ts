import assert from "node:assert/strict";
import { exactEquals, exactKey } from "../foundation/exact";
import {
  MEN_CP011_RATIO_PERCENT_AUTHORITY,
  auditMenCp011RatioPercentBatch,
  generateMenCp011RatioPercentQuestion,
  generateMenCp011RatioPercentReviewBatch,
  getMenCp011RatioPercentPrototypeIds,
} from "./ratio-percent";

const seedsPerPrototype = 128;
let runtimePackageCount = 0;
const seenUnits = new Set<string>();

for (const prototypeId of getMenCp011RatioPercentPrototypeIds()) {
  for (let index = 0; index < seedsPerPrototype; index += 1) {
    const question = generateMenCp011RatioPercentQuestion(
      prototypeId,
      `ratio-percent-runtime-proof:${prototypeId}:${index}`,
    );

    assert.equal(
      question.validation.valid,
      true,
      `${prototypeId} failed ratio/percent validation for seed ${index}: ${question.validation.checks
        .filter((check) => !check.passed)
        .map((check) => `${check.name}: ${check.message}`)
        .join(" | ")}`,
    );
    assert.equal(question.verification.valid, true);
    assert.equal(
      question.ratioPercentAuthority,
      MEN_CP011_RATIO_PERCENT_AUTHORITY,
    );
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
    assert.equal(exactEquals(question.exactAnswer, question.state.exactAnswer), true);
    assert.equal(question.exactAnswer.kind, "RATIONAL");
    assert.ok(question.exactAnswer.numerator > 0n);
    assert.ok(question.exactAnswer.denominator > 0n);
    assert.match(question.diagram.svg, /data-diagram-role="PROMPT"/);
    assert.match(question.solutionDiagram.svg, /data-diagram-role="SOLUTION"/);
    assert.doesNotMatch(question.diagram.svg, /<svg[^>]+\bwidth="\d+/);
    assert.doesNotMatch(question.stem, /\$\([^$]*\$/);
    assert.ok(
      question.learnerSolution.wrongOptionAnalysis.every(
        (line) => !/\[USED_/.test(line),
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
      prototypeId === "MEN-CP011-PROT-MATERIAL-VOLUME-RATIO"
    ) {
      assert.equal(question.target, "RATIO");
      assert.equal(question.unit, "times");
      assert.match(question.answer, /^\$\d+:\d+\$$/);
      assert.match(
        question.diagram.svg,
        /data-diagram-version="PIPE_MATERIAL_RATIO_V1"/,
      );
      assert.match(question.diagram.svg, /data-role="cancellation-note"/);
      assert.match(question.learnerSolution.formula, /h_A\(R_A\^2-r_A\^2\)/);
      assert.match(question.learnerSolution.shortcut, /R\^2-r\^2=\(R-r\)\(R\+r\)/);
      assert.match(question.explanation.keyRule, /\\pi.*cancels/i);
      assert.ok(
        question.options.some(
          (option) => option.misconceptionId === "USED_OUTER_SOLID_VOLUME_RATIO",
        ),
      );
    } else {
      assert.equal(question.target, "PERCENT_CHANGE");
      assert.equal(question.unit, "%");
      assert.match(question.answer, /\\%\$$/);
      assert.match(
        question.diagram.svg,
        /data-diagram-version="PIPE_BORE_CHANGE_PERCENT_V1"/,
      );
      assert.match(question.diagram.svg, /data-role="fixed-state-note"/);
      assert.ok(question.state.newInnerRadius! > question.state.oldInnerRadius!);
      assert.equal(
        question.state.decreaseCoefficient,
        question.state.oldMaterialCoefficient! -
          question.state.newMaterialCoefficient!,
      );
      assert.match(question.learnerSolution.formula, /V_\{old\}-V_\{new\}/);
      assert.match(question.learnerSolution.shortcut, /r_\{new\}\^2-r_\{old\}\^2/);
      assert.match(question.explanation.keyRule, /\\pi h.*cancels/i);
      assert.ok(
        question.options.some(
          (option) =>
            option.misconceptionId === "USED_LINEAR_INNER_RADIUS_PERCENT_CHANGE",
        ),
      );
    }

    seenUnits.add(question.state.unit);
    runtimePackageCount += 1;
  }
}

assert.equal(
  runtimePackageCount,
  getMenCp011RatioPercentPrototypeIds().length * seedsPerPrototype,
);
assert.deepEqual([...seenUnits].sort(), ["cm", "m"]);

const review = generateMenCp011RatioPercentReviewBatch();
const audit = auditMenCp011RatioPercentBatch(review.records);

assert.equal(review.records.length, 32);
assert.equal(audit.authority, MEN_CP011_RATIO_PERCENT_AUTHORITY);
assert.equal(audit.prototypeCount, 2);
assert.equal(audit.recordCount, 32);
assert.equal(audit.exactStemCount, 32);
assert.equal(audit.exactQuestionOptionCount, 32);
assert.ok(audit.maximumNormalizedStemRepetition <= 8);
assert.equal(audit.uniquePhysicalStateCount, 32);
assert.deepEqual(audit.unitCounts, { cm: 16, m: 16 });
assert.deepEqual(audit.answerPositionCounts, { A: 8, B: 8, C: 8, D: 8 });
assert.ok(
  Object.values(audit.prototypeUnitCounts).every((count) => count === 8),
);
assert.equal(audit.publicationEligible, false);
assert.deepEqual(audit.resolvedDiscoveryCandidates, [
  "MEN-CP011-PROT-MATERIAL-VOLUME-RATIO",
  "MEN-CP011-PROT-MATERIAL-VOLUME-PERCENT-CHANGE",
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
  `MEN-CP-011 ratio and percentage Wave 01 passed for ${runtimePackageCount} deterministic runtime packages and a 32-record balanced review matrix. The initial 20-candidate list is now fully implemented, equivalent or reassigned; permanent QLs remain 0.`,
);
