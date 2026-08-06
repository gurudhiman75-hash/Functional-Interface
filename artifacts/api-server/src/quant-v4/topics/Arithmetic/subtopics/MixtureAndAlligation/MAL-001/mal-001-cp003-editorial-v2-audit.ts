import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  generateMalCp003PermanentQuestion,
  MAL_CP003_ENGLISH_RELEASE,
  MAL_CP003_PERMANENT_ALLOCATION,
  MAL_CP003_PERMANENT_QL_IDS,
  MAL_CP003_PERMANENT_RUNTIME_ID,
  runMalCp003EnglishReleasePipeline,
  type MalCp003PermanentQlId,
  type MalCp003ReleasedQuestion,
} from "./foundation/cp003-permanent-runtime";
import { runMal001QuestionStudioPipeline } from "./question-studio-adapter";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) =>
    typeof item === "bigint" ? `${item}n` : item,
  );
}

function increment(map: Map<string, number>, key: string): void {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function maximumEntry(map: Map<string, number>): [string, number] {
  return [...map.entries()].sort((left, right) => right[1] - left[1])[0] ?? ["", 0];
}

function verifyQuestion(question: MalCp003ReleasedQuestion): void {
  assert(question.runtimeId === MAL_CP003_PERMANENT_RUNTIME_ID, "Wrong V2 runtime ID.");
  assert(question.releaseStatus === "APPROVED", "Question is not approved.");
  assert(question.reviewStatus === "APPROVED_EDITORIAL_ENGLISH_V2", "Question is not on editorial V2.");
  assert(question.allocationStatus === "RELEASED_ENGLISH_V2", "Question is not a V2 release package.");
  assert(question.active && question.publiclyPublishable, "Released question is not active/publishable.");
  assert(question.questionStudioDiscoverable && question.questionBankWritable && question.testEligible, "Delivery flags are incomplete.");
  assert(question.validation.ok && question.validation.valid, "Release validation failed.");
  assert(question.validation.errors.length === 0, "Release validation has errors.");
  assert(question.validation.checks.every((check) => check.passed), "A release validation check failed.");
  assert(question.options.length === 4, "Question does not have four options.");
  assert(new Set(question.options).size === 4, "Question options are text duplicates.");
  assert(question.options[question.correctIndex] === question.answer, "Correct option index is wrong.");
  assert(question.optionAudit.filter((option) => option.isCorrect).length === 1, "Option audit correct count is not one.");
  assert(new Set(question.optionAudit.map((option) => option.misconceptionId)).size === 4, "Distractor authorities are not unique.");
  assert(!question.optionAudit.some((option) => /ARITHMETIC_SLIP|PLAUSIBLE|FALLBACK/iu.test(option.misconceptionId)), "Generic distractor authority remains.");
  assert(question.editorialMetadata.version === 2, "Editorial metadata version is wrong.");
  assert(question.editorialMetadata.grammarVerified, "Grammar gate is false.");
  assert(question.editorialMetadata.initialComponentsExplicit, "Initial components are not explicit.");
  assert(question.editorialMetadata.arbitraryPlusMinusOneRejected, "Arbitrary ±1 gate is false.");
  assert(question.editorialMetadata.equivalentOptionsRejected, "Equivalent-option gate is false.");

  const learnerText = stable({
    stem: question.stem,
    options: question.options,
    explanation: question.explanation,
  });
  assert(!/competitive-exam|storekeeper records|technician performs|consider this repeated|during an equal-replacement|for a repeated-replacement calculation/iu.test(question.stem), "Artificial opener remains.");
  assert(!/homogeneous sample|observed retained fraction|exact operation root|stage-specific retained fraction|unique integer exponent/iu.test(learnerText), "Internal technical wording remains.");
  assert(!/\b\d+ litres is removed\b/iu.test(question.stem), "Plural grammar is wrong.");
  assert(!/\b1 operations\b/iu.test(learnerText), "Singular operation grammar is wrong.");
  assert(!/\bA 8\d?-litre\b/u.test(question.stem), "Article before numeric adjective is wrong.");
  assert(!/\b(?:2th|3th) root\b/iu.test(learnerText), "Root ordinal is wrong.");
  assert(!/10-Second Exam Shortcut/iu.test(learnerText), "Old shortcut heading remains.");
  assert(!/Quick check:|Final answer:/iu.test(question.explanation.lines.join("\n")), "Repetitive legacy conclusion labels remain.");
  assert(question.explanation.sectionTitles.concept === "Concept", "Concept heading is wrong.");
  assert(question.explanation.sectionTitles.calculation === "Calculation", "Calculation heading is wrong.");
  assert(question.explanation.sectionTitles.answer === "Answer", "Answer heading is wrong.");
  assert(question.explanation.steps.length >= 3 && question.explanation.steps.length <= 5, "Explanation step count is outside 3–5.");
  assert(question.explanation.steps.some((step) => /\d/u.test(step)), "Explanation is not tied to actual values.");
  assert(!/stage strip|threshold ledger/iu.test(question.explanation.verification), "Unsupported visual reference remains.");
  assert(question.explanation.conclusion.includes(question.answer), "Conclusion omits the answer.");
  assert(question.reasoningGraph.nodes.at(-1)?.kind === "CONCLUSION", "Reasoning graph does not end in an answer.");
  assert(question.sourceEvidenceIds.includes("MAL-CP003-EDITORIAL-REMEDIATION-V2"), "Editorial remediation evidence is missing.");

  if (question.permanentQlId === "MAL-QL-031" || question.permanentQlId === "MAL-QL-036") {
    assert(/square root|cube root|fourth root|\d+(?:st|nd|rd|th) root/iu.test(learnerText), `${question.permanentQlId} does not name the operation root naturally.`);
  }
  if (question.permanentQlId === "MAL-QL-034") {
    assert((question.diagram as any)?.type === "THREE_COMPONENT_STAGE_TABLE", "QL-034 does not use a stage table.");
    assert(!/mathbf|indicator/iu.test(question.explanation.formula), "QL-034 uses advanced indicator notation.");
  }
  if (question.permanentQlId === "MAL-QL-035") {
    assert(question.optionAudit.some((option) => option.misconceptionId === "ratio_reversal"), "QL-035 lacks a ratio-reversal distractor.");
  }
  if (question.permanentQlId === "MAL-QL-037") {
    assert(/previous|operation/u.test(question.explanation.verification), "QL-037 does not verify the previous operation.");
    assert(/strict|below|less than|exceed|more than/iu.test(learnerText), "QL-037 does not explain the strict condition.");
  }
}

assert(MAL_CP003_ENGLISH_RELEASE.releaseId === "MAL-CP003-EN-v2", "V2 release ID is missing.");
assert(MAL_CP003_ENGLISH_RELEASE.supersedesReleaseId === "MAL-CP003-EN-v1", "V1 supersession is missing.");
assert(MAL_CP003_ENGLISH_RELEASE.priorStatus === "CONDITIONAL_PASS_MAL_CP003_EDITORIAL_REMEDIATION_REQUIRED", "Conditional remediation status is not recorded.");
assert(MAL_CP003_ENGLISH_RELEASE.status === "FROZEN", "V2 release is not frozen.");
assert(MAL_CP003_ENGLISH_RELEASE.editorialV2ReviewQuestionCount === 90, "V2 review count is not 90.");
assert(MAL_CP003_PERMANENT_QL_IDS.length === 9, "Expected nine permanent QLs.");
assert(new Set(MAL_CP003_PERMANENT_ALLOCATION.map((entry) => entry.difficulty)).size === 3, "Easy, Medium and Hard are not all represented.");

const seedsPerQl = 200;
let generatedCount = 0;
let deterministicCount = 0;
let studioExplicitCount = 0;
let studioSelectionCount = 0;
const answerPositionCounts = [0, 0, 0, 0];
const openings = new Map<string, number>();
const retainedFractions = new Map<string, number>();
const distractorPatterns = new Map<string, number>();
const skeletons = new Map<string, number>();
const diversityOpenings = new Map<string, number>();
const diversityRetainedFractions = new Map<string, number>();
const diversityDistractorPatterns = new Map<string, number>();
const diversitySkeletons = new Map<string, number>();
const stems = new Set<string>();
const explanations = new Set<string>();
const answersByQl = new Map<MalCp003PermanentQlId, Set<string>>();
const ql034VariantStems = new Set<string>();
const reviewRows: Array<{
  reviewKey: string;
  qlId: MalCp003PermanentQlId;
  familyId: string;
  difficulty: string;
  numericalQuality: string;
  question: MalCp003ReleasedQuestion;
}> = [];

for (const allocation of MAL_CP003_PERMANENT_ALLOCATION) {
  const answers = new Set<string>();
  answersByQl.set(allocation.qlId, answers);
  for (let index = 0; index < seedsPerQl; index += 1) {
    const seed = `mal-cp003-editorial-v2:${allocation.qlId}:${index}`;
    const first = generateMalCp003PermanentQuestion(allocation.qlId, seed);
    const replay = runMalCp003EnglishReleasePipeline({
      questionLanguageId: allocation.qlId,
      seed,
      language: "en",
    });
    assert(stable(first) === stable(replay), `${allocation.qlId}/${seed}: generation is not deterministic.`);
    deterministicCount += 1;
    verifyQuestion(first);
    generatedCount += 1;
    answerPositionCounts[first.correctIndex] += 1;
    stems.add(first.stem);
    explanations.add(stable(first.explanation));
    answers.add(first.answer);
    increment(openings, first.editorialMetadata.openingPatternId);
    increment(retainedFractions, first.editorialMetadata.retainedFractionKey);
    increment(distractorPatterns, first.editorialMetadata.distractorPatternId);
    increment(skeletons, first.editorialMetadata.mathematicalSkeleton);
    if (allocation.qlId === "MAL-QL-034") ql034VariantStems.add(first.stem.replace(/\d+(?:\s+\d+\/\d+)?/gu, "#"));
    if (index < 10) {
      reviewRows.push({
        reviewKey: `${allocation.qlId}:editorial-v2-review-${index + 1}`,
        qlId: allocation.qlId,
        familyId: allocation.familyId,
        difficulty: allocation.difficulty,
        numericalQuality: first.editorialMetadata.numericalQuality,
        question: first,
      });
    }
  }

  const explicit = runMal001QuestionStudioPipeline("MAL-CP-003", {
    questionLanguageId: allocation.qlId,
    seed: `mal-cp003-editorial-v2:studio:${allocation.qlId}`,
    language: "en",
  });
  assert(explicit.permanentQlId === allocation.qlId, "Question Studio explicit QL route failed.");
  assert(explicit.reviewStatus === "APPROVED_EDITORIAL_ENGLISH_V2", "Question Studio did not return editorial V2.");
  studioExplicitCount += 1;
}

for (let index = 0; index < 100; index += 1) {
  const allocation = MAL_CP003_PERMANENT_ALLOCATION[index % MAL_CP003_PERMANENT_ALLOCATION.length]!;
  const question = runMal001QuestionStudioPipeline("MAL-CP-003", {
    questionLanguageId: allocation.qlId,
    seed: `mal-cp003-editorial-v2:diversity-set:${index}`,
    language: "en",
  });
  assert(question.canonicalProblemId === "MAL-CP-003", "Question Studio selected the wrong CP.");
  assert(MAL_CP003_PERMANENT_QL_IDS.includes(question.permanentQlId as MalCp003PermanentQlId), "Question Studio selected a non-CP003 QL.");
  increment(diversityOpenings, question.editorialMetadata.openingPatternId);
  increment(diversityRetainedFractions, question.editorialMetadata.retainedFractionKey);
  increment(diversityDistractorPatterns, question.editorialMetadata.distractorPatternId);
  increment(diversitySkeletons, question.editorialMetadata.mathematicalSkeleton);
  studioSelectionCount += 1;
}

const [largestOpening, largestOpeningCount] = maximumEntry(openings);
const [largestFraction, largestFractionCount] = maximumEntry(retainedFractions);
const [largestDistractorPattern, largestDistractorPatternCount] = maximumEntry(distractorPatterns);
const [largestSkeleton, largestSkeletonCount] = maximumEntry(skeletons);
const [largestDiversityOpening, largestDiversityOpeningCount] = maximumEntry(diversityOpenings);
const [largestDiversityFraction, largestDiversityFractionCount] = maximumEntry(diversityRetainedFractions);
const [largestDiversityDistractorPattern, largestDiversityDistractorPatternCount] = maximumEntry(diversityDistractorPatterns);
const [largestDiversitySkeleton, largestDiversitySkeletonCount] = maximumEntry(diversitySkeletons);

assert(generatedCount === 1800, `Expected 1,800 questions, received ${generatedCount}.`);
assert(deterministicCount === 1800, "Deterministic replay count mismatch.");
assert(reviewRows.length === 90, "Expected 90 review questions.");
assert(studioExplicitCount === 9, "Explicit Question Studio route count mismatch.");
assert(studioSelectionCount === 100, "Question Studio diversity-set count mismatch.");
assert(answerPositionCounts.every((count) => count >= 300), `Answer positions are imbalanced: ${answerPositionCounts.join(", ")}.`);
assert(stems.size >= 500, `Stem diversity is too low: ${stems.size}.`);
assert(explanations.size >= 500, `Explanation diversity is too low: ${explanations.size}.`);
assert(largestDiversityOpeningCount <= 10, `Opening pattern exceeds 10% in the 100-question set: ${largestDiversityOpening} (${largestDiversityOpeningCount}).`);
assert(largestDiversityFractionCount <= 15, `Retained fraction exceeds 15% in the 100-question set: ${largestDiversityFraction} (${largestDiversityFractionCount}).`);
assert(largestDiversityDistractorPatternCount <= 10, `Distractor pattern exceeds 10% in the 100-question set: ${largestDiversityDistractorPattern} (${largestDiversityDistractorPatternCount}).`);
assert(largestDiversitySkeletonCount <= 2, `Mathematical skeleton repeats more than twice in the 100-question set: ${largestDiversitySkeleton} (${largestDiversitySkeletonCount}).`);
assert(ql034VariantStems.size >= 5, `QL-034 output variation is incomplete: ${ql034VariantStems.size}.`);
assert([...answersByQl.values()].every((answers) => answers.size >= 4), "At least one QL has fewer than four distinct answers.");

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const report = {
  status: "PASS_MAL_CP003_EDITORIAL_REMEDIATION_V2",
  priorStatus: MAL_CP003_ENGLISH_RELEASE.priorStatus,
  releaseId: MAL_CP003_ENGLISH_RELEASE.releaseId,
  qlRange: MAL_CP003_ENGLISH_RELEASE.qlRange,
  generatedCount,
  deterministicCount,
  reviewQuestionCount: reviewRows.length,
  studioExplicitCount,
  studioSelectionCount,
  distinctStemCount: stems.size,
  distinctExplanationCount: explanations.size,
  answerPositionCounts,
  largestOpening: { pattern: largestOpening, count: largestOpeningCount },
  largestRetainedFraction: { fraction: largestFraction, count: largestFractionCount },
  largestDistractorPattern: { pattern: largestDistractorPattern, count: largestDistractorPatternCount },
  largestMathematicalSkeletonCount: largestSkeletonCount,
  diversitySet: {
    questionCount: studioSelectionCount,
    largestOpening: { pattern: largestDiversityOpening, count: largestDiversityOpeningCount },
    largestRetainedFraction: { fraction: largestDiversityFraction, count: largestDiversityFractionCount },
    largestDistractorPattern: { pattern: largestDiversityDistractorPattern, count: largestDiversityDistractorPatternCount },
    largestMathematicalSkeleton: { skeleton: largestDiversitySkeleton, count: largestDiversitySkeletonCount },
  },
  ql034VariantCount: ql034VariantStems.size,
  difficultyBands: [...new Set(MAL_CP003_PERMANENT_ALLOCATION.map((entry) => entry.difficulty))],
  reviewRows,
};
writeFileSync(
  resolve(outputDirectory, "mal-cp003-editorial-v2-review.json"),
  stable(report),
  "utf8",
);
const markdown = [
  "# MAL-CP-003 Editorial V2 — 90-Question Review",
  "",
  `Status: **${report.status}**`,
  `Release: **${report.releaseId}**`,
  `Permanent range: **${report.qlRange}**`,
  `Corpus audited: **${generatedCount}**`,
  `Review questions: **${reviewRows.length}**`,
  "",
  ...reviewRows.flatMap((row) => [
    `## ${row.qlId} — ${row.familyId} — ${row.reviewKey}`,
    "",
    row.question.stem,
    "",
    ...row.question.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}${index === row.question.correctIndex ? " **✓**" : ""}`),
    "",
    `**Answer:** ${row.question.answer}`,
    "",
    ...row.question.explanation.lines,
    "",
    `**Distractor authority:** ${row.question.optionAudit.map((option) => option.misconceptionId).join(", ")}`,
    "",
    "---",
    "",
  ]),
].join("\n");
writeFileSync(
  resolve(outputDirectory, "mal-cp003-editorial-v2-review.md"),
  markdown,
  "utf8",
);
console.log(JSON.stringify({ ...report, reviewRows: undefined }, null, 2));
