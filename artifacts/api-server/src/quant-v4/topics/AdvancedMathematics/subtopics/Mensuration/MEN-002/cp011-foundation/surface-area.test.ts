import assert from "node:assert/strict";
import { exactKey, pi, rational } from "../foundation/exact";
import type { ExactValue } from "../foundation/types";
import {
  generateMenCp011SurfaceQuestion,
  generateMenCp011SurfaceReviewBatch,
  getMenCp011SurfaceDefinition,
  getMenCp011SurfacePrototypeIds,
  MEN_CP011_SURFACE_AREA_AUTHORITY,
  MEN_CP011_SURFACE_PROTOTYPES,
  type MenCp011SurfacePackage,
  type MenCp011SurfacePrototypeId,
} from "./surface-area-runtime";
import { MEN_CP011_MEASUREMENT_AUTHORITY } from "./measurement-profiles";

function expectedCoefficient(question: MenCp011SurfacePackage) {
  const R = question.state.calculationOuterRadius;
  const r = question.state.calculationInnerRadius;
  const h = question.state.calculationHeight;
  const ring = R ** 2n - r ** 2n;
  switch (question.prototypeId) {
    case "MEN-CP011-PROT-OUTER-CURVED-SURFACE-AREA": return 2n * R * h;
    case "MEN-CP011-PROT-INNER-CURVED-SURFACE-AREA": return 2n * r * h;
    case "MEN-CP011-PROT-BOTH-CURVED-SURFACES-AREA": return 2n * h * (R + r);
    case "MEN-CP011-PROT-ONE-ANNULAR-END-AREA": return ring;
    case "MEN-CP011-PROT-BOTH-ANNULAR-ENDS-AREA": return 2n * ring;
    case "MEN-CP011-PROT-COMPLETE-TUBE-SURFACE-AREA":
      return 2n * h * (R + r) + 2n * ring;
  }
}

function expectedValue(question: MenCp011SurfacePackage): ExactValue {
  const coefficient = expectedCoefficient(question);
  return question.piPolicy === "EXACT_PI"
    ? pi(coefficient)
    : rational(22n * coefficient, 7n);
}

const prototypeIds = getMenCp011SurfacePrototypeIds();
assert.equal(MEN_CP011_SURFACE_PROTOTYPES.length, 6);
assert.equal(prototypeIds.length, 6);
assert.equal(new Set(prototypeIds).size, 6);

let runtimePackageCount = 0;
const allDifficulties = new Set<string>();
const allProfiles = new Set<string>();
const allUnits = new Set<string>();

for (const prototypeId of prototypeIds) {
  const definition = getMenCp011SurfaceDefinition(prototypeId);
  const answerPositions = new Set<number>();
  const profileIds = new Set<string>();
  const exactAnswers = new Set<string>();

  for (let index = 0; index < 32; index += 1) {
    const seed = `men-cp011-phase2c-runtime:${prototypeId}:${index}`;
    const first = generateMenCp011SurfaceQuestion(prototypeId, seed);
    const second = generateMenCp011SurfaceQuestion(prototypeId, seed);
    assert.deepEqual(first, second, `${prototypeId} must regenerate deterministically for ${seed}.`);

    const failures = first.validation.checks
      .filter((check) => !check.passed)
      .map((check) => `${check.name}: ${check.message}`)
      .join("; ");
    assert.equal(first.validation.valid, true, `${prototypeId} ${seed}: ${failures}`);
    assert.equal(first.verification.valid, true);
    assert.equal(first.surfaceAreaAuthority, MEN_CP011_SURFACE_AREA_AUTHORITY);
    assert.equal(first.measurementAuthority, MEN_CP011_MEASUREMENT_AUTHORITY);
    assert.equal(first.packageId, "MEN-002");
    assert.equal(first.canonicalProblemId, "MEN-CP-011");
    assert.equal(first.permanentQlId, null);
    assert.equal(first.waveId, "MEN-CP-011-SURFACE-WAVE-01");
    assert.equal(first.prototypeId, definition.prototypeId);
    assert.equal(first.solveMode, definition.solveMode);
    assert.equal(first.target, "SURFACE_AREA");
    assert.equal(first.difficulty, definition.difficulty);
    assert.deepEqual(first.state.focusSurfaceIds, definition.focusSurfaceIds);

    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options.map((option) => exactKey(option.value))).size, 4);
    assert.equal(new Set(first.options.map((option) => option.display)).size, 4);
    assert.equal(first.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(first.options[first.correctIndex]?.isCorrect, true);
    assert.equal(first.answer, first.options[first.correctIndex]?.display);
    assert.equal(exactKey(first.exactAnswer), exactKey(expectedValue(first)));
    assert.equal(exactKey(first.exactAnswer), exactKey(first.options[first.correctIndex]!.value));

    const ledgerIds = new Set(first.state.surfaceLedger.map((entry) => entry.surfaceId));
    assert.ok(first.state.focusSurfaceIds.every((surfaceId) => ledgerIds.has(surfaceId)));
    assert.ok(first.state.surfaceLedger.every((entry) => entry.status === "EXPOSED"));
    assert.equal(first.state.surfaceLedger.length, 4);

    assert.match(first.diagram.svg, /data-surface-area-authority="MEN-CP011-PHASE2C-SURFACE-AREA-V1"/);
    assert.match(first.diagram.svg, /data-diagram-role="SURFACE_PROMPT"/);
    assert.match(first.solutionDiagram.svg, /data-diagram-role="SURFACE_SOLUTION"/);
    assert.match(first.diagram.svg, /data-surface-focus="[A-Z_,]+"/);
    assert.match(first.diagram.svg, /data-responsive="true"/);
    assert.doesNotMatch(first.diagram.svg, /<svg[^>]+\bwidth="\d+/);
    assert.equal(first.renderSurfaces.attempt.diagram, null);
    assert.equal(first.renderSurfaces.practice.diagram, first.diagram);
    assert.equal(first.renderSurfaces.solution.diagram, first.solutionDiagram);
    assert.equal(first.renderSurfaces.responsiveDiagramPolicy.minWidthPx, 0);
    assert.equal(first.renderSurfaces.solution.exposesInternalCodes, false);
    assert.equal(first.renderSurfaces.admin.exposesInternalCodes, true);
    assert.equal(first.renderSurfaces.admin.trapCodes.length, 3);

    assert.match(first.explanation.keyRule, /outer curved wall/);
    assert.match(first.explanation.keyRule, /inner curved wall/);
    assert.match(first.explanation.keyRule, /annular ends/);
    assert.equal(first.explanation.traps.length, 3);
    assert.ok(first.explanation.traps.every((trap) => /^Option [A-D] \(\$/.test(trap)));
    assert.ok(first.explanation.traps.every((trap) => /\[[A-Z0-9_]+\]$/.test(trap)));
    assert.match(first.explanation.shortcut, /^⚡ Exam speed:/);

    if (first.measurementProfile.mixedUnits) {
      assert.match(
        first.explanation.steps.map((step) => `${step.title} ${step.body}`).join("\n"),
        /Convert/,
      );
    }

    const learnerText = [
      first.stem,
      ...first.options.map((option) => option.display),
      first.learnerSolution.formula,
      ...first.learnerSolution.steps,
      first.learnerSolution.finalAnswer,
      first.learnerSolution.shortcut,
      ...first.learnerSolution.wrongOptionAnalysis,
    ].join("\n");
    assert.doesNotMatch(learnerText, /\[[A-Z0-9_]+\]/);
    assert.doesNotMatch(learnerText, /misconceptionId|surfaceLedger|verification/);
    assert.doesNotMatch(learnerText, /\\pih/);
    assert.equal((learnerText.match(/\$/g) ?? []).length % 2, 0);

    assert.equal(first.reviewStatus, "UNREVIEWED");
    assert.equal(first.questionBankStatus, "NOT_STORED");
    assert.equal(first.testEligibility, "INELIGIBLE");
    assert.equal(first.publiclyPublishable, false);
    assert.equal(first.questionStudioDiscoverable, false);

    answerPositions.add(first.correctIndex);
    profileIds.add(first.measurementProfile.id);
    exactAnswers.add(exactKey(first.exactAnswer));
    allDifficulties.add(first.difficulty);
    allProfiles.add(first.measurementProfile.id);
    allUnits.add(first.unit);
    runtimePackageCount += 1;
  }

  assert.deepEqual([...answerPositions].sort(), [0, 1, 2, 3]);
  assert.equal(profileIds.size, 4);
  assert.ok(exactAnswers.size >= 8, `${prototypeId} needs meaningful numerical variety.`);
}

assert.equal(runtimePackageCount, 6 * 32);
assert.deepEqual([...allDifficulties].sort(), ["Easy", "Hard", "Medium"]);
assert.equal(allProfiles.size, 4);
assert.deepEqual([...allUnits].sort(), ["cm²", "m²"]);

const { records, audit } = generateMenCp011SurfaceReviewBatch(
  "men-cp011-phase2c-review-proof-v1",
  12,
);
assert.equal(records.length, 72);
assert.equal(audit.surfaceAreaAuthority, MEN_CP011_SURFACE_AREA_AUTHORITY);
assert.equal(audit.prototypeCount, 6);
assert.equal(audit.exactStemCount, 72);
assert.equal(audit.exactQuestionOptionCount, 72);
assert.equal(audit.uniquePhysicalStateCount, 72);
assert.equal(audit.mixedUnitRecordCount, 36);
assert.ok(audit.normalizedStemGroupCount >= 30);
assert.ok(audit.maximumNormalizedStemRepetition <= 3);
assert.deepEqual(audit.answerPositionCounts, { A: 18, B: 18, C: 18, D: 18 });
assert.ok(Object.values(audit.measurementProfileCounts).every((count) => count === 18));
assert.equal(Object.keys(audit.prototypeProfileCounts).length, 24);
assert.ok(Object.values(audit.prototypeProfileCounts).every((count) => count === 3));
assert.equal(new Set(Object.values(audit.answerPositionSequences)).size, 6);
assert.equal(audit.publicationEligible, false);
assert.ok(!audit.blockers.includes("UNIT_REPRESENTATION_COVERAGE_INCOMPLETE"));
assert.ok(audit.blockers.includes("CHAPTER_COVERAGE_INCOMPLETE"));
assert.ok(audit.blockers.includes("PERMANENT_QLS_UNALLOCATED"));
assert.ok(audit.blockers.includes("MANUAL_ENGLISH_REVIEW_PENDING"));

const prototypeCounts = new Map<MenCp011SurfacePrototypeId, number>();
for (const record of records) {
  prototypeCounts.set(record.prototypeId, (prototypeCounts.get(record.prototypeId) ?? 0) + 1);
  assert.equal(record.validation.valid, true);
  assert.equal(record.verification.valid, true);
  assert.equal(record.permanentQlId, null);
  assert.equal(record.questionBankStatus, "NOT_STORED");
  assert.equal(record.testEligibility, "INELIGIBLE");
  assert.equal(record.publiclyPublishable, false);
  assert.equal(record.questionStudioDiscoverable, false);
}
assert.ok([...prototypeCounts.values()].every((count) => count === 12));

console.log(
  "MEN-CP-011 Phase 2C passed for six exposure-based surface-area families, 192 deterministic runtime packages and a 72-record all-state balanced review matrix. Permanent QLs remain 0 and all delivery surfaces remain disabled.",
);
