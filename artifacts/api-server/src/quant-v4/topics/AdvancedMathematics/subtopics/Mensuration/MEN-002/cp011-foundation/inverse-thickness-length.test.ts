import assert from "node:assert/strict";
import { exactEquals, exactKey, rational } from "../foundation/exact";
import {
  MEN_CP011_INVERSE_THICKNESS_LENGTH_AUTHORITY,
  auditMenCp011InverseBatch,
  generateMenCp011InverseQuestion,
  generateMenCp011InverseReviewBatch,
  getMenCp011InversePrototypeIds,
} from "./inverse-thickness-length";
import { getMenCp011MeasurementProfiles } from "./measurement-profiles";
import { MEN_CP011_STATE_POOL_AUTHORITY } from "./state-pool";

const seedsPerPrototype = 128;
let runtimePackageCount = 0;
const seenProfiles = new Set<string>();
const seenPiPolicies = new Set<string>();

for (const prototypeId of getMenCp011InversePrototypeIds()) {
  for (let index = 0; index < seedsPerPrototype; index += 1) {
    const question = generateMenCp011InverseQuestion(
      prototypeId,
      `inverse-runtime-proof:${prototypeId}:${index}`,
    );

    assert.equal(
      question.validation.valid,
      true,
      `${prototypeId} failed inverse validation for seed ${index}: ${question.validation.checks
        .filter((check) => !check.passed)
        .map((check) => `${check.name}: ${check.message}`)
        .join(" | ")}`,
    );
    assert.equal(question.verification.valid, true);
    assert.equal(
      question.inverseAuthority,
      MEN_CP011_INVERSE_THICKNESS_LENGTH_AUTHORITY,
    );
    assert.equal(question.statePoolAuthority, MEN_CP011_STATE_POOL_AUTHORITY);
    assert.equal(question.permanentQlId, null);
    assert.equal(question.questionBankStatus, "NOT_STORED");
    assert.equal(question.testEligibility, "INELIGIBLE");
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.questionStudioDiscoverable, false);
    assert.equal(question.renderSurfaces.attempt.diagram, null);
    assert.equal(
      question.renderSurfaces.responsiveDiagramPolicy.minWidthPx,
      0,
    );
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
    assert.match(question.diagram.svg, /data-diagram-version="TUBE_EXAMTREE_INVERSE_V1"/);
    assert.match(question.diagram.svg, /data-diagram-role="PROMPT"/);
    assert.match(question.solutionDiagram.svg, /data-diagram-role="SOLUTION"/);
    assert.match(question.diagram.svg, /data-role="top-centre"/);
    assert.match(question.diagram.svg, /data-orientation="centre-connected"/);
    assert.match(question.diagram.svg, /data-label-placement="detached"/);
    assert.doesNotMatch(question.diagram.svg, /radius-vertical-guide/);
    assert.doesNotMatch(question.diagram.svg, /<svg[^>]+\bwidth="\d+/);
    assert.doesNotMatch(question.learnerSolution.formula, /\\pih/);
    assert.ok(
      question.learnerSolution.steps.every(
        (step) => (step.match(/\$/g) ?? []).length % 2 === 0,
      ),
    );

    if (prototypeId ===
      "MEN-CP011-PROT-PIPE-THICKNESS-FROM-MATERIAL-VOLUME") {
      assert.equal(
        exactEquals(question.exactAnswer, rational(question.state.thickness)),
        true,
      );
      assert.match(question.diagram.svg, />t = \?</);
      assert.doesNotMatch(
        question.diagram.svg,
        new RegExp(`t = ${question.state.thickness} ${question.state.radialUnit}`),
      );
      assert.match(
        question.solutionDiagram.svg,
        new RegExp(`t = ${question.state.thickness} ${question.state.radialUnit}`),
      );
      assert.match(question.learnerSolution.formula, /t=R-r/);
    } else {
      assert.equal(
        exactEquals(question.exactAnswer, rational(question.state.height)),
        true,
      );
      assert.match(question.diagram.svg, />h = \?</);
      assert.doesNotMatch(
        question.diagram.svg,
        new RegExp(`h = ${question.state.height} ${question.state.heightUnit}`),
      );
      assert.match(
        question.solutionDiagram.svg,
        new RegExp(`h = ${question.state.height} ${question.state.heightUnit}`),
      );
      assert.match(question.learnerSolution.formula, /R\^2-r\^2/);
    }

    if (question.state.measurementProfile.mixedUnits) {
      assert.match(question.learnerSolution.steps.join("\n"), /Convert|converted/i);
    }

    seenProfiles.add(question.state.measurementProfileId);
    seenPiPolicies.add(question.piPolicy);
    runtimePackageCount += 1;
  }
}

assert.equal(
  runtimePackageCount,
  getMenCp011InversePrototypeIds().length * seedsPerPrototype,
);
assert.deepEqual(
  [...seenProfiles].sort(),
  getMenCp011MeasurementProfiles().map((profile) => profile.id).sort(),
);
assert.deepEqual([...seenPiPolicies].sort(), ["EXACT_PI", "PI_22_OVER_7"]);

const review = generateMenCp011InverseReviewBatch();
const audit = auditMenCp011InverseBatch(review.records);

assert.equal(review.records.length, 32);
assert.equal(audit.authority, MEN_CP011_INVERSE_THICKNESS_LENGTH_AUTHORITY);
assert.equal(audit.prototypeCount, 2);
assert.equal(audit.exactStemCount, 32);
assert.equal(audit.exactQuestionOptionCount, 32);
assert.ok(audit.maximumNormalizedStemRepetition <= 4);
assert.equal(audit.uniquePhysicalStateCount, 32);
assert.deepEqual(audit.answerPositionCounts, { A: 8, B: 8, C: 8, D: 8 });
assert.ok(
  Object.values(audit.measurementProfileCounts).every((count) => count === 8),
);
assert.deepEqual(audit.piPolicyCounts, {
  EXACT_PI: 16,
  PI_22_OVER_7: 16,
});
assert.ok(
  Object.values(audit.prototypeProfilePiCounts).every((count) => count === 2),
);
assert.equal(audit.publicationEligible, false);
assert.deepEqual(audit.resolvedDiscoveryCandidates, [
  "MEN-CP011-PROT-PIPE-THICKNESS-FROM-MATERIAL-VOLUME",
  "MEN-CP011-PROT-PIPE-LENGTH-FROM-MATERIAL-VOLUME",
]);
assert.ok(review.records.every((question) =>
  question.validation.valid && question.verification.valid
));
assert.ok(review.records.every((question) =>
  question.permanentQlId === null &&
  question.questionBankStatus === "NOT_STORED" &&
  question.testEligibility === "INELIGIBLE" &&
  !question.publiclyPublishable &&
  !question.questionStudioDiscoverable
));

console.log(
  `MEN-CP-011 inverse thickness/length Wave 01 passed for ${runtimePackageCount} deterministic runtime packages and a 32-record balanced all-state review matrix. Permanent QLs remain 0 and all delivery surfaces remain disabled.`,
);
