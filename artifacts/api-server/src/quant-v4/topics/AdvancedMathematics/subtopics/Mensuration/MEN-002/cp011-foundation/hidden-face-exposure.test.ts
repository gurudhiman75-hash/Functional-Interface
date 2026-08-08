import assert from "node:assert/strict";
import { exactEquals, exactKey, rational } from "../foundation/exact";
import {
  MEN_CP011_HIDDEN_FACE_EXPOSURE_AUTHORITY,
  auditMenCp011HiddenFaceBatch,
  generateMenCp011HiddenFaceQuestion,
  generateMenCp011HiddenFaceReviewBatch,
  getMenCp011HiddenFacePrototypeIds,
} from "./hidden-face-exposure";

const seedsPerPrototype = 128;
let runtimePackageCount = 0;
const seenUnits = new Set<string>();

for (const prototypeId of getMenCp011HiddenFacePrototypeIds()) {
  for (let index = 0; index < seedsPerPrototype; index += 1) {
    const question = generateMenCp011HiddenFaceQuestion(
      prototypeId,
      `hidden-face-runtime-proof:${prototypeId}:${index}`,
    );

    assert.equal(
      question.validation.valid,
      true,
      `${prototypeId} failed hidden-face validation for seed ${index}: ${question.validation.checks
        .filter((check) => !check.passed)
        .map((check) => `${check.name}: ${check.message}`)
        .join(" | ")}`,
    );
    assert.equal(question.verification.valid, true);
    assert.equal(
      question.hiddenFaceAuthority,
      MEN_CP011_HIDDEN_FACE_EXPOSURE_AUTHORITY,
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
    assert.equal(
      exactEquals(
        question.exactAnswer,
        rational(question.state.exposedAreaCoefficient),
      ),
      true,
    );
    assert.match(question.diagram.svg, /data-diagram-role="PROMPT"/);
    assert.match(question.solutionDiagram.svg, /data-diagram-role="SOLUTION"/);
    assert.doesNotMatch(question.diagram.svg, /<svg[^>]+\bwidth="\d+/);
    assert.ok(
      question.learnerSolution.wrongOptionAnalysis.every(
        (line) => !/\[(?:COUNTED_|SUBTRACTED_|OMITTED_)/.test(line),
      ),
    );
    const learnerText = [
      question.stem,
      question.answer,
      question.learnerSolution.formula,
      ...question.learnerSolution.steps,
      question.learnerSolution.shortcut,
      ...question.learnerSolution.wrongOptionAnalysis,
    ].join("\n");
    assert.equal((learnerText.match(/\$/g) ?? []).length % 2, 0);
    assert.doesNotMatch(learnerText, /\\pih/);

    if (
      prototypeId === "MEN-CP011-PROT-JOINED-CUBES-EXPOSED-AREA"
    ) {
      assert.equal(question.state.topology, "JOINED");
      assert.ok(question.state.cubeCount! >= 2n);
      assert.equal(
        question.state.exposedFaceCount,
        question.state.separateCubeFaceCount! -
          2n * question.state.internalJoinCount!,
      );
      assert.match(
        question.diagram.svg,
        /data-diagram-version="JOINED_CUBES_ORTHOGRAPHIC_V1"/,
      );
      assert.match(question.diagram.svg, /data-topology="JOINED"/);
      assert.match(question.diagram.svg, /data-role="contact-face-note"/);
      assert.match(question.learnerSolution.formula, /6N-2J/);
      assert.match(question.learnerSolution.shortcut, /xy\+yz\+zx/);
      assert.match(question.verification.method, /bounding-cuboid/i);
    } else {
      assert.equal(question.state.topology, "PLACED");
      assert.equal(
        question.state.exposedAreaCoefficient,
        question.state.topArea! + question.state.sideArea!,
      );
      assert.match(
        question.diagram.svg,
        /data-diagram-version="CUBOID_ON_FLOOR_EXPOSURE_V1"/,
      );
      assert.match(question.diagram.svg, /data-topology="PLACED"/);
      assert.match(question.diagram.svg, /data-region="hidden-floor-contact"/);
      assert.match(question.diagram.svg, /data-status="HIDDEN"/);
      assert.match(question.learnerSolution.formula, /LB\+2LH\+2BH/);
      assert.match(question.learnerSolution.shortcut, /subtract one base/i);
      assert.match(question.verification.method, /top-plus-four-sides/i);
    }

    seenUnits.add(question.state.unit);
    runtimePackageCount += 1;
  }
}

assert.equal(
  runtimePackageCount,
  getMenCp011HiddenFacePrototypeIds().length * seedsPerPrototype,
);
assert.deepEqual([...seenUnits].sort(), ["cm", "m"]);

const review = generateMenCp011HiddenFaceReviewBatch();
const audit = auditMenCp011HiddenFaceBatch(review.records);

assert.equal(review.records.length, 32);
assert.equal(audit.authority, MEN_CP011_HIDDEN_FACE_EXPOSURE_AUTHORITY);
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
  "MEN-CP011-PROT-JOINED-CUBES-EXPOSED-AREA",
  "MEN-CP011-PROT-CUBOID-ON-FLOOR-PAINTED-AREA",
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
  `MEN-CP-011 hidden-face exposure Wave 01 passed for ${runtimePackageCount} deterministic runtime packages and a 32-record balanced review matrix. Permanent QLs remain 0 and all delivery surfaces remain disabled.`,
);
