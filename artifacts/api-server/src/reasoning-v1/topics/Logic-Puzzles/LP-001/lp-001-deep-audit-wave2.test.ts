import assert from "node:assert/strict";
import {
  generateLogicPuzzleQuestionStudioBatchV8,
  listLogicPuzzleQuestionStudioPackagesV8,
} from "./question-studio-v8.ts";
import { LP_001_011_PERMANENT_QL_REGISTRY_V3 } from "./lp-001-011-permanent-ql-registry-v3.ts";
import { generateLp010Batch } from "./lp-010.ts";
import { generateLp011Batch } from "./lp-011.ts";
import { generateLp006ProjectionBatchV2 } from "./lp-006-projection-extension-v2.ts";
import { generateLpCp04BatchV3 } from "./lp-cp04-counterfactual-v3.ts";

const BANNED_LEARNER_TEXT = /associated|solver found|solution count|use all the clues|apply all the clues|candidate state count/iu;

function assertQuestionQuality(question: any, expectedDifficulty?: string) {
  const text = String(question.text ?? "");
  const explanation = String(question.explanation ?? "");
  const options = question.options as string[];
  assert.ok(text.length > 30, "question stem is too short");
  assert.ok(explanation.length > 40, "explanation is too short");
  assert.equal(BANNED_LEARNER_TEXT.test(text + "\n" + explanation), false, text);
  assert.equal(options.length, 4);
  assert.equal(new Set(options).size, 4);
  assert.ok(Number.isInteger(question.correctIndex));
  assert.ok(question.correctIndex >= 0 && question.correctIndex < 4);
  assert.equal(question.answer, options[question.correctIndex]);
  assert.ok(["Easy", "Medium", "Hard"].includes(question.difficulty));
  if (expectedDifficulty) assert.equal(question.difficulty, expectedDifficulty);
  assert.equal(question.runtimeMode, "REVIEW_ONLY");
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.mockTestEligible, false);
  assert.equal(question.publiclyPublishable, false);
}

const packages = listLogicPuzzleQuestionStudioPackagesV8() as any[];
const observedQlIds = new Set<string>();

for (const pkg of packages) {
  const difficulties = [...(pkg.supportedDifficulties ?? [])] as string[];
  assert.ok(difficulties.length > 0, pkg.id + " has no advertised difficulty support");

  for (const difficulty of difficulties) {
    const batch: any = await generateLogicPuzzleQuestionStudioBatchV8({
      packageId: pkg.id,
      language: "en",
      difficulty,
      count: 1,
      seed: "LP-WAVE2-LIVE-" + pkg.id + "-" + difficulty,
    });
    assert.equal(batch.generationContext.requestedDifficulty, difficulty);
    assert.equal(batch.generationContext.difficultyFilterAuthority, "LP_V8_STRUCTURAL_DIFFICULTY_FILTER_V1");
    assert.equal(batch.generationContext.selectedCaseletCount, 1);
    assert.ok(batch.questions.length >= 1);
    for (const question of batch.questions) {
      assertQuestionQuality(question, difficulty);
      observedQlIds.add(question.patternId);
      assert.ok((pkg.permanentQlIds as string[]).includes(question.patternId), pkg.id + " leaked " + question.patternId);
    }
  }

  const parityDifficulty = difficulties.includes("Medium") ? "Medium" : difficulties[0]!;
  const byLanguage = new Map<string, any[]>();
  for (const language of ["en", "hi", "pa"] as const) {
    const batch: any = await generateLogicPuzzleQuestionStudioBatchV8({
      packageId: pkg.id,
      language,
      difficulty: parityDifficulty,
      count: 1,
      seed: "LP-WAVE2-PARITY-" + pkg.id,
    });
    byLanguage.set(language, batch.questions);
    for (const question of batch.questions) assertQuestionQuality(question, parityDifficulty);
  }

  const en = byLanguage.get("en")!;
  const hi = byLanguage.get("hi")!;
  const pa = byLanguage.get("pa")!;
  assert.equal(en.length, hi.length);
  assert.equal(en.length, pa.length);
  for (let index = 0; index < en.length; index += 1) {
    assert.equal(en[index]!.patternId, hi[index]!.patternId);
    assert.equal(en[index]!.patternId, pa[index]!.patternId);
    assert.equal(en[index]!.correctIndex, hi[index]!.correctIndex);
    assert.equal(en[index]!.correctIndex, pa[index]!.correctIndex);
    assert.equal(en[index]!.difficulty, hi[index]!.difficulty);
    assert.equal(en[index]!.difficulty, pa[index]!.difficulty);
  }
}

assert.deepEqual(
  [...observedQlIds].sort(),
  [...LP_001_011_PERMANENT_QL_REGISTRY_V3.permanentQlIds].sort(),
);

// LP-010: Easy retains direct slot anchors; Hard restricts them and requires layered relations.
for (const caselet of generateLp010Batch("LP-WAVE2-DIFF-LP010", 60)) {
  const direct = caselet.clues.filter((clue) => clue.kind === "PERSON_SLOT").length;
  const relations = caselet.clues.filter((clue) =>
    ["BEFORE", "BETWEEN", "IMMEDIATE_BEFORE", "SAME_TIME", "SAME_DAY"].includes(clue.kind),
  ).length;
  if (caselet.difficultyBand === "Easy") assert.equal(direct, 4, caselet.caseletId + " Easy must retain the four designed direct anchors");
  if (caselet.difficultyBand === "Medium") assert.ok(direct >= 1 && relations >= 1, caselet.caseletId + " Medium topology drift");
  if (caselet.difficultyBand === "Hard") {
    assert.ok(direct <= 1, caselet.caseletId + " Hard has too many direct anchors");
    assert.ok(relations >= 2, caselet.caseletId + " Hard lacks layered relations");
  }
}

// LP-011: Hard must remove direct box→attribute anchors; Easy must retain at least one strong direct/adjacent clue.
for (const caselet of generateLp011Batch("LP-WAVE2-DIFF-LP011", 45)) {
  const directAttribute = caselet.clues.filter((clue) => clue.kind === "BOX_HAS_ATTRIBUTE").length;
  const strong = caselet.clues.filter((clue) =>
    ["BOX_HAS_ATTRIBUTE", "BOX_IMMEDIATELY_ABOVE_BOX", "ATTRIBUTE_IMMEDIATELY_ABOVE_BOX", "BOX_IMMEDIATELY_ABOVE_ATTRIBUTE"].includes(clue.kind),
  ).length;
  if (caselet.difficultyBand === "Easy") assert.ok(strong >= 1, caselet.caseletId + " Easy lacks a strong anchor");
  if (caselet.difficultyBand === "Medium") assert.ok(directAttribute <= 1, caselet.caseletId + " Medium has too many direct attribute anchors");
  if (caselet.difficultyBand === "Hard") assert.equal(directAttribute, 0, caselet.caseletId + " Hard leaked a direct attribute anchor");
}

// QL045–046 are projections over LP-006 and must inherit the parent structural difficulty exactly.
for (const caselet of generateLp006ProjectionBatchV2("LP-WAVE2-DIFF-PROJECTION", 36)) {
  assert.equal(caselet.projectionChildren.length, 2);
  for (const child of caselet.projectionChildren) {
    assert.equal(child.difficultyBand, caselet.difficultyBand);
  }
}

// QL047 has explicit Easy/Medium/Hard parent-topology contracts.
const cp04 = generateLpCp04BatchV3("LP-WAVE2-DIFF-QL047", 18);
const difficultyCounts = new Map<string, number>();
for (const caselet of cp04) {
  difficultyCounts.set(caselet.difficultyBand, (difficultyCounts.get(caselet.difficultyBand) ?? 0) + 1);
  if (caselet.difficultyBand === "Hard") {
    assert.equal(caselet.parentTopology, "LP-004_COMMITTEE_SELECTION");
    assert.ok(caselet.counterfactualChild.parentStateCount >= 5);
    assert.ok(caselet.counterfactualChild.conditionedStateCount >= 1);
    assert.ok(caselet.counterfactualChild.conditionedStateCount <= 4);
  } else {
    assert.equal(caselet.parentTopology, "LP-001_GROUPING");
  }
}
assert.deepEqual(difficultyCounts, new Map([["Easy", 6], ["Medium", 6], ["Hard", 6]]));

console.log(JSON.stringify({
  status: "PASS_LP_DEEP_AUDIT_WAVE2",
  permanentQlCount: observedQlIds.size,
  liveV8DifficultyFiltering: true,
  multilingualParity: true,
  lp010StructuralDifficulty: true,
  lp011StructuralDifficulty: true,
  projectionDifficultyInheritance: true,
  ql047DifficultyContract: true,
}, null, 2));
