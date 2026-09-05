import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { DOT_SITUATION_SOURCE_EVIDENCE_V1 } from "../foundation/spatial/dot-situation-source-evidence-v1";
import { DOT_SITUATION_SOURCE_SATURATED_DISCOVERY_V1 } from "../foundation/spatial/dot-situation-source-saturated-discovery-v1";
import { generateDotSituationReviewQuestionV1 } from "../foundation/spatial/dot-situation-review-runtime-v1";
import { DOT_SITUATION_PERMANENT_QL_ALLOCATIONS_V11 } from "../foundation/spatial/spatial-permanent-ql-allocation-v11";

assert.equal(DOT_SITUATION_SOURCE_SATURATED_DISCOVERY_V1.chapterCode, "DOT-001");
assert.equal(DOT_SITUATION_SOURCE_SATURATED_DISCOVERY_V1.canonicalTaskFamilies.length, 1);
assert.equal(DOT_SITUATION_SOURCE_EVIDENCE_V1.conclusion.oneSemanticQlSupported, true);
assert.equal(DOT_SITUATION_SOURCE_EVIDENCE_V1.conclusion.exactExclusionsAreRequired, true);
assert.equal(DOT_SITUATION_PERMANENT_QL_ALLOCATIONS_V11.length, 1);
assert.equal(DOT_SITUATION_PERMANENT_QL_ALLOCATIONS_V11[0]?.permanentQlId, "SPA-QL-054");

const languages = ["en", "hi", "pa"] as const;
const seeds = Array.from({ length: 72 }, (_, index) => `dot-review-${index + 1}`);
const difficulties = new Set<string>();
const dotCounts = new Set<number>();
const shapeCounts = new Set<number>();
const activeShapeSets = new Set<string>();
const reducedBandShapeKinds = new Set<string>();
let hardQuestions = 0;
let multiDotQuestions = 0;
let exactExclusionRows = 0;
let illustratedSolutions = 0;
let nearMissDistractors = 0;

for (const seed of seeds) {
  const english = generateDotSituationReviewQuestionV1({ seed, language: "en" });
  const repeat = generateDotSituationReviewQuestionV1({ seed, language: "en" });
  assert.deepEqual(repeat, english, `seed ${seed} must be exactly deterministic`);
  assert.equal(english.qlId, "SPA-QL-054");
  assert.equal(english.optionSvgs.length, 4);
  assert.equal(new Set(english.optionSvgs).size, 4, `seed ${seed} should not render duplicate options`);
  assert.ok(english.correctIndex >= 0 && english.correctIndex < 4);
  assert.equal(english.answer, english.optionLabels[english.correctIndex]);
  assert.equal(english.solveFacts.requiredSignatures.length, english.solveFacts.dotCount);
  assert.equal(english.explanation.membershipTable.length, english.solveFacts.dotCount);
  assert.equal(english.solveFacts.distractorFailures.length, 3);
  assert.equal(english.solveFacts.distractorMissingCounts.length, 3);
  assert.ok(english.solveFacts.boundarySafetyMargin >= 4.5);
  assert.equal(english.solveFacts.shapeKinds.length, english.solveFacts.shapeCount);
  assert.equal(new Set(english.solveFacts.shapeKinds).size, english.solveFacts.shapeCount);
  assert.equal(english.validation.uniqueAnswer, true);
  assert.equal(english.validation.signaturesRecomputedFromGeometry, true);
  assert.equal(english.validation.completeInsideOutsideSignature, true);
  assert.equal(english.validation.nearMissDistractorsPreferred, true);
  assert.equal(english.validation.exactSquareGeometry, true);
  assert.equal(english.validation.activeShapeSubsetsSupported, true);
  assert.equal(english.validation.solutionIllustrationIncluded, true);
  assert.equal(english.lifecycle.reviewOnly, true);
  assert.equal(english.lifecycle.questionStudioDiscoverable, false);
  assert.equal(english.lifecycle.mockTestEligible, false);
  assert.equal(english.lifecycle.publicReleaseAuthorized, false);

  assert.ok(english.stimulusSvg.includes('stroke-width="1.35"'));
  assert.ok(english.solutionSvg.includes('stroke-width="1.35"'));
  assert.ok(english.solutionSvg.includes('r="2.55"'), `seed ${seed} should illustrate a valid dot placement in the answer`);
  for (const option of english.optionSvgs) {
    assert.equal(option.includes('r="2.55"'), false, `learner option for ${seed} must remain undotted`);
  }
  illustratedSolutions += 1;

  difficulties.add(english.difficulty);
  dotCounts.add(english.solveFacts.dotCount);
  shapeCounts.add(english.solveFacts.shapeCount);
  activeShapeSets.add(english.solveFacts.shapeKinds.join("+"));
  if (english.solveFacts.shapeCount < 4) {
    for (const shapeKind of english.solveFacts.shapeKinds) reducedBandShapeKinds.add(shapeKind);
  }
  if (english.difficulty === "HARD") hardQuestions += 1;
  if (english.solveFacts.dotCount >= 2) multiDotQuestions += 1;
  nearMissDistractors += english.solveFacts.distractorMissingCounts.filter((count) => count === 1).length;
  for (const row of english.explanation.membershipTable) {
    assert.equal(row.signature.length, english.solveFacts.shapeCount);
    assert.ok(row.inside.length >= 1);
    if (row.outside.length >= 1) exactExclusionRows += 1;
  }

  for (const language of languages) {
    const q = generateDotSituationReviewQuestionV1({ seed, language });
    assert.equal(q.geometryFingerprint, english.geometryFingerprint, `geometry must be language-neutral for ${seed}/${language}`);
    assert.equal(q.correctIndex, english.correctIndex, `answer must preserve semantic parity for ${seed}/${language}`);
    assert.deepEqual(q.solveFacts.requiredSignatures, english.solveFacts.requiredSignatures);
    assert.deepEqual(q.solveFacts.shapeKinds, english.solveFacts.shapeKinds);
    assert.equal(q.solutionSvg, english.solutionSvg, `solution illustration must preserve geometry for ${seed}/${language}`);
    assert.ok(q.stem.length > 20);
    assert.ok(q.explanation.observation.length > 15);
    assert.ok(q.explanation.application.length > 20);
    assert.ok(q.explanation.check.length > 20);
  }
}

assert.ok(difficulties.has("EASY"), "review corpus should expose easy questions");
assert.ok(difficulties.has("MODERATE"), "review corpus should expose moderate questions");
assert.ok(difficulties.has("HARD"), "review corpus should expose hard questions");
assert.deepEqual([...dotCounts].sort(), [1, 2, 3], "review corpus must exercise 1, 2 and 3 dots");
assert.deepEqual([...shapeCounts].sort(), [2, 3, 4], "review corpus must exercise 2, 3 and 4 shapes");
assert.ok(hardQuestions >= 10, "review corpus should contain a meaningful hard slice");
assert.ok(multiDotQuestions >= 20, "review corpus should contain a meaningful multi-dot slice");
assert.ok(exactExclusionRows >= 20, "review corpus should materially exercise exact-only exclusions");
assert.equal(illustratedSolutions, seeds.length, "every review question should carry an explanation illustration");
assert.ok(activeShapeSets.size >= 4, "review corpus should not collapse to one fixed shape subset per shape count");
assert.deepEqual([...reducedBandShapeKinds].sort(), ["CIRCLE", "RECTANGLE", "SQUARE", "TRIANGLE"], "2/3-shape bands should exercise every supported primitive");
assert.ok(nearMissDistractors >= 60, "most distractors should be semantic near-misses rather than unrelated layouts");

const evidence = {
  authority: "SPA-DOT-001-REVIEW-V1",
  seeds: seeds.length,
  languages,
  difficulties: [...difficulties],
  dotCounts: [...dotCounts].sort(),
  shapeCounts: [...shapeCounts].sort(),
  activeShapeSets: [...activeShapeSets].sort(),
  reducedBandShapeKinds: [...reducedBandShapeKinds].sort(),
  hardQuestions,
  multiDotQuestions,
  exactExclusionRows,
  illustratedSolutions,
  nearMissDistractors,
  exactSquareGeometry: true,
  releaseGatesRemainClosed: true,
};

const outDir = resolve(process.cwd(), "dist/reasoning-v1/spatial");
await mkdir(outDir, { recursive: true });
await writeFile(resolve(outDir, "dot-001-review-v1-evidence.json"), JSON.stringify(evidence, null, 2), "utf8");
console.log(JSON.stringify(evidence, null, 2));
