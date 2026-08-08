import assert from "node:assert/strict";
import { exactEquals, exactKey, rational } from "../foundation/exact";
import {
  MEN_CP011_HOLLOW_BOXES_AUTHORITY,
  auditMenCp011HollowBoxBatch,
  generateMenCp011HollowBoxQuestion,
  generateMenCp011HollowBoxReviewBatch,
  getMenCp011HollowBoxPrototypeIds,
} from "./hollow-boxes";

const seedsPerPrototype = 128;
let runtimePackageCount = 0;
const seenUnits = new Set<string>();

for (const prototypeId of getMenCp011HollowBoxPrototypeIds()) {
  for (let index = 0; index < seedsPerPrototype; index += 1) {
    const question = generateMenCp011HollowBoxQuestion(
      prototypeId,
      `hollow-box-runtime-proof:${prototypeId}:${index}`,
    );

    assert.equal(
      question.validation.valid,
      true,
      `${prototypeId} failed hollow-box validation for seed ${index}: ${question.validation.checks
        .filter((check) => !check.passed)
        .map((check) => `${check.name}: ${check.message}`)
        .join(" | ")}`,
    );
    assert.equal(question.verification.valid, true);
    assert.equal(question.hollowBoxAuthority, MEN_CP011_HOLLOW_BOXES_AUTHORITY);
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
    assert.equal(
      exactEquals(question.exactAnswer, rational(question.state.materialVolume)),
      true,
    );
    assert.match(
      question.diagram.svg,
      /data-diagram-version="HOLLOW_BOX_EXAMTREE_V1"/,
    );
    assert.match(question.diagram.svg, /data-diagram-role="PROMPT"/);
    assert.match(question.solutionDiagram.svg, /data-diagram-role="SOLUTION"/);
    assert.match(question.diagram.svg, /data-topology="HOLLOW"/);
    assert.match(question.diagram.svg, /data-region="inner-void"/);
    assert.match(question.diagram.svg, /data-dimension="wall-thickness"/);
    assert.match(question.diagram.svg, /data-alignment="two-sided"/);
    assert.doesNotMatch(question.diagram.svg, /<svg[^>]+\bwidth="\d+/);
    assert.match(
      question.solutionDiagram.svg,
      new RegExp(
        question.state.shape === "CUBE"
          ? `inner side = ${question.state.innerLength} ${question.state.unit}`
          : `inner = ${question.state.innerLength} × ${question.state.innerBreadth} × ${question.state.innerHeight} ${question.state.unit}`,
      ),
    );
    assert.match(question.explanation.keyRule, /minus \$2t\$/);
    assert.match(
      question.learnerSolution.steps.join("\n"),
      /outer volume minus inner void volume/i,
    );
    assert.ok(
      question.options
        .filter((option) => !option.isCorrect)
        .every((option) => option.misconceptionId !== null),
    );
    assert.ok(
      question.learnerSolution.wrongOptionAnalysis.every(
        (line) => !/\[(?:USED_|CALCULATED_)/.test(line),
      ),
    );

    if (
      prototypeId === "MEN-CP011-PROT-HOLLOW-CUBE-MATERIAL-VOLUME"
    ) {
      assert.equal(question.state.outerLength, question.state.outerBreadth);
      assert.equal(question.state.outerBreadth, question.state.outerHeight);
      assert.match(question.learnerSolution.formula, /a\^3-\(a-2t\)\^3/);
      assert.match(question.learnerSolution.shortcut, /difference of cubes/i);
    } else {
      assert.match(
        question.learnerSolution.formula,
        /LBH-\(L-2t\)\(B-2t\)\(H-2t\)/,
      );
      assert.match(question.learnerSolution.shortcut, /factor \$2t\$/i);
    }

    seenUnits.add(question.state.unit);
    runtimePackageCount += 1;
  }
}

assert.equal(
  runtimePackageCount,
  getMenCp011HollowBoxPrototypeIds().length * seedsPerPrototype,
);
assert.deepEqual([...seenUnits].sort(), ["cm", "m"]);

const review = generateMenCp011HollowBoxReviewBatch();
const audit = auditMenCp011HollowBoxBatch(review.records);

assert.equal(review.records.length, 32);
assert.equal(audit.authority, MEN_CP011_HOLLOW_BOXES_AUTHORITY);
assert.equal(audit.prototypeCount, 2);
assert.equal(audit.recordCount, 32);
assert.equal(audit.exactStemCount, 32);
assert.equal(audit.exactQuestionOptionCount, 32);
assert.ok(audit.maximumNormalizedStemRepetition <= 4);
assert.equal(audit.uniquePhysicalStateCount, 32);
assert.deepEqual(audit.unitCounts, { cm: 16, m: 16 });
assert.deepEqual(audit.answerPositionCounts, { A: 8, B: 8, C: 8, D: 8 });
assert.ok(
  Object.values(audit.prototypeUnitCounts).every((count) => count === 8),
);
assert.equal(audit.publicationEligible, false);
assert.deepEqual(audit.resolvedDiscoveryCandidates, [
  "MEN-CP011-PROT-HOLLOW-CUBE-MATERIAL-VOLUME",
  "MEN-CP011-PROT-HOLLOW-CUBOID-MATERIAL-VOLUME",
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
  `MEN-CP-011 hollow cube/cuboid material-volume Wave 01 passed for ${runtimePackageCount} deterministic runtime packages and a 32-record balanced review matrix. Permanent QLs remain 0 and all delivery surfaces remain disabled.`,
);
