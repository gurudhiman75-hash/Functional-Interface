import assert from "node:assert/strict";
import { exactEquals, exactKey } from "../foundation/exact";
import {
  MEN_CP011_SPHERICAL_SHELLS_AUTHORITY,
  auditMenCp011ShellBatch,
  generateMenCp011ShellQuestion,
  generateMenCp011ShellReviewBatch,
  getMenCp011ShellPrototypeIds,
} from "./spherical-shells";

const seedsPerPrototype = 192;
let runtimePackageCount = 0;
const seenUnits = new Set<string>();
const seenPiPolicies = new Set<string>();

for (const prototypeId of getMenCp011ShellPrototypeIds()) {
  for (let index = 0; index < seedsPerPrototype; index += 1) {
    const question = generateMenCp011ShellQuestion(
      prototypeId,
      `shell-runtime-proof:${prototypeId}:${index}`,
    );

    assert.equal(
      question.validation.valid,
      true,
      `${prototypeId} failed shell validation for seed ${index}: ${question.validation.checks
        .filter((check) => !check.passed)
        .map((check) => `${check.name}: ${check.message}`)
        .join(" | ")}`,
    );
    assert.equal(question.verification.valid, true);
    assert.equal(question.shellAuthority, MEN_CP011_SPHERICAL_SHELLS_AUTHORITY);
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
    assert.equal(exactEquals(question.exactAnswer, question.state.materialVolume), true);
    assert.ok(question.state.outerRadius > question.state.innerRadius);
    assert.equal(
      question.state.cubeDifference,
      question.state.outerRadius ** 3n - question.state.innerRadius ** 3n,
    );
    assert.match(
      question.diagram.svg,
      /data-diagram-version="SPHERICAL_SHELL_EXAMTREE_V1"/,
    );
    assert.match(question.diagram.svg, /data-diagram-role="PROMPT"/);
    assert.match(question.solutionDiagram.svg, /data-diagram-role="SOLUTION"/);
    assert.match(question.diagram.svg, /data-topology="HOLLOW"/);
    assert.match(question.diagram.svg, /data-region="inner-void"/);
    assert.match(question.diagram.svg, /data-dimension="outer-radius"/);
    assert.match(question.diagram.svg, /data-dimension="inner-radius"/);
    assert.match(question.diagram.svg, /data-orientation="centre-connected"/);
    assert.doesNotMatch(question.diagram.svg, /<svg[^>]+\bwidth="\d+/);
    assert.match(question.explanation.keyRule, /outer volume minus the inner void/i);
    assert.match(question.learnerSolution.formula, /R\^3-r\^3/);
    assert.match(question.learnerSolution.shortcut, /R\^3-r\^3=\(R-r\)/);
    assert.ok(
      question.learnerSolution.wrongOptionAnalysis.every(
        (line) => !/\[(?:USED_|CALCULATED_|ADDED_)/.test(line),
      ),
    );

    if (
      prototypeId === "MEN-CP011-PROT-SPHERICAL-SHELL-MATERIAL-VOLUME"
    ) {
      assert.equal(question.state.shape, "SPHERE");
      assert.equal(question.state.formulaFactorNumerator, 4n);
      assert.match(question.learnerSolution.formula, /\\frac\{4\}\{3\}/);
    } else {
      assert.equal(question.state.shape, "HEMISPHERE");
      assert.equal(question.state.formulaFactorNumerator, 2n);
      assert.match(question.learnerSolution.formula, /\\frac\{2\}\{3\}/);
    }

    if (question.piPolicy === "EXACT_PI") {
      assert.equal(question.exactAnswer.kind, "PI");
      assert.match(question.stem, /Leave \$\\pi\$ in exact form/);
    } else {
      assert.equal(question.exactAnswer.kind, "RATIONAL");
      if (question.piPolicy === "PI_22_OVER_7") {
        assert.match(question.stem, /\\frac\{22\}\{7\}/);
      } else {
        assert.match(question.stem, /3\.14/);
        assert.match(question.learnerSolution.steps.join("\n"), /157\}\{50/);
      }
    }

    seenUnits.add(question.state.unit);
    seenPiPolicies.add(question.piPolicy);
    runtimePackageCount += 1;
  }
}

assert.equal(
  runtimePackageCount,
  getMenCp011ShellPrototypeIds().length * seedsPerPrototype,
);
assert.deepEqual([...seenUnits].sort(), ["cm", "m"]);
assert.deepEqual([...seenPiPolicies].sort(), [
  "EXACT_PI",
  "PI_22_OVER_7",
  "PI_3_14",
]);

const review = generateMenCp011ShellReviewBatch();
const audit = auditMenCp011ShellBatch(review.records);

assert.equal(review.records.length, 48);
assert.equal(audit.authority, MEN_CP011_SPHERICAL_SHELLS_AUTHORITY);
assert.equal(audit.prototypeCount, 2);
assert.equal(audit.recordCount, 48);
assert.equal(audit.exactStemCount, 48);
assert.equal(audit.exactQuestionOptionCount, 48);
assert.ok(audit.maximumNormalizedStemRepetition <= 6);
assert.equal(audit.uniquePhysicalStateCount, 48);
assert.deepEqual(audit.unitCounts, { cm: 24, m: 24 });
assert.deepEqual(audit.piPolicyCounts, {
  EXACT_PI: 16,
  PI_22_OVER_7: 16,
  PI_3_14: 16,
});
assert.deepEqual(audit.answerPositionCounts, { A: 12, B: 12, C: 12, D: 12 });
assert.ok(
  Object.values(audit.prototypeUnitPiCounts).every((count) => count === 4),
);
assert.equal(audit.publicationEligible, false);
assert.deepEqual(audit.resolvedDiscoveryCandidates, [
  "MEN-CP011-PROT-SPHERICAL-SHELL-MATERIAL-VOLUME",
  "MEN-CP011-PROT-HEMISPHERICAL-SHELL-MATERIAL-VOLUME",
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
  `MEN-CP-011 spherical/hemispherical shell Wave 01 passed for ${runtimePackageCount} deterministic runtime packages and a 48-record balanced review matrix. Exact pi, declared 22/7 and declared 3.14 are covered; permanent QLs remain 0.`,
);
