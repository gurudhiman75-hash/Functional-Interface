import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  generateQuestion,
  listQuantV4Packages,
} from "../../../../question-studio-generation-engine";
import {
  SAP_QUESTION_STUDIO_CP_IDS,
  SAP_QUESTION_STUDIO_QLS,
  inferSapQuestionStudioCpFromQl,
  runSapQuestionStudioPipeline,
} from "./question-studio-adapter";

const REVIEW_SEEDS_PER_QL = 3;
const COCKPIT_BATCH_PER_DIFFICULTY = 50;
const OUTPUT_DIRECTORY = resolve(
  process.cwd(),
  "dist/quant-v4/sap-question-studio-chapter-review",
);

mkdirSync(OUTPUT_DIRECTORY, { recursive: true });

assert.equal(SAP_QUESTION_STUDIO_CP_IDS.length, 12);
assert.equal(SAP_QUESTION_STUDIO_QLS.length, 211);
assert.equal(new Set(SAP_QUESTION_STUDIO_QLS.map((entry) => entry.qlId)).size, 211);
assert.deepEqual(
  SAP_QUESTION_STUDIO_QLS.map((entry) => entry.qlId),
  Array.from({ length: 211 }, (_, index) => `SAP-QL-${String(index + 1).padStart(3, "0")}`),
);
assert.deepEqual(
  SAP_QUESTION_STUDIO_CP_IDS,
  Array.from({ length: 12 }, (_, index) => `SAP-CP-${String(index + 1).padStart(3, "0")}`),
);

const packageCard = listQuantV4Packages().find((entry: any) => entry.packageId === "SAP") as any;
assert.ok(packageCard, "SAP was not discovered by the central Question Studio package registry.");
assert.equal(packageCard.subtopic, "Simplification & Approximation");
assert.deepEqual(packageCard.supportedLanguages, ["en"]);
assert.deepEqual(packageCard.cpIds, [...SAP_QUESTION_STUDIO_CP_IDS]);
assert.equal(packageCard.enabled, true);
assert.equal(packageCard.runtimeMode, "QUESTION_STUDIO_ACTIVE");
assert.equal(packageCard.questionBankStatus, "NOT_STORED");
assert.equal(packageCard.testEligibility, "INELIGIBLE");
assert.equal(packageCard.publiclyPublishable, false);

const reviewQuestions: any[] = [];
const cpCounts: Record<string, number> = {};
const difficultyCounts: Record<string, number> = {};
const correctIndexCounts = [0, 0, 0, 0];
const stemCounts = new Map<string, number>();
const questionIds = new Set<string>();
const exactDuplicateStems: string[] = [];
const suspiciousText: string[] = [];

function auditQuestion(question: any, label: string) {
  assert.equal(question.packageId, "SAP", `${label}: wrong package.`);
  assert.ok(String(question.stem ?? "").trim().length > 0, `${label}: empty stem.`);
  assert.equal(question.options.length, 4, `${label}: expected four options.`);
  assert.equal(new Set(question.options).size, 4, `${label}: duplicate options.`);
  assert.ok(question.correctIndex >= 0 && question.correctIndex < 4, `${label}: invalid correct index.`);
  assert.equal(question.options[question.correctIndex], question.answer, `${label}: answer binding mismatch.`);
  assert.ok(question.explanation.lines.length >= 1, `${label}: missing explanation.`);
  assert.equal(question.validation.ok, true, `${label}: source validation failed: ${question.validation.errors.join(" | ")}`);
  assert.equal(question.questionBankStatus, "NOT_STORED", `${label}: Question Bank gate drifted.`);
  assert.equal(question.testEligibility, "INELIGIBLE", `${label}: test eligibility gate drifted.`);
  assert.equal(question.publiclyPublishable, false, `${label}: public publication gate drifted.`);
  assert.ok(!questionIds.has(question.questionId), `${label}: duplicate questionId ${question.questionId}.`);
  questionIds.add(question.questionId);

  const learnerText = [question.stem, ...question.options, ...question.explanation.lines].join("\n");
  assert.ok(!learnerText.includes("undefined"), `${label}: learner text contains undefined.`);
  assert.ok(!learnerText.includes("[object Object]"), `${label}: learner text contains [object Object].`);
  assert.ok(!/\b(?:TODO|TBD|PLACEHOLDER)\b/iu.test(learnerText), `${label}: learner text contains placeholder marker.`);
  assert.ok(!/\$\$/u.test(learnerText), `${label}: learner text contains display-math delimiters.`);
  assert.ok(
    question.options.every((option: string) => !/^\s*(?:alternative|option)\s*[A-D1-4]?\s*$/iu.test(option)),
    `${label}: learner option contains a generic placeholder label.`,
  );

  const stem = String(question.stem).trim().replace(/\s+/gu, " ");
  stemCounts.set(stem, (stemCounts.get(stem) ?? 0) + 1);
  cpCounts[question.canonicalProblemId] = (cpCounts[question.canonicalProblemId] ?? 0) + 1;
  difficultyCounts[question.difficultyBand] = (difficultyCounts[question.difficultyBand] ?? 0) + 1;
  correctIndexCounts[question.correctIndex] += 1;

  if (/\b(?:alternative|dummy|placeholder)\b/iu.test(learnerText)) {
    suspiciousText.push(`${label}: ${learnerText}`);
  }
}

for (const descriptor of SAP_QUESTION_STUDIO_QLS) {
  assert.equal(
    inferSapQuestionStudioCpFromQl(descriptor.qlId),
    descriptor.checkpointId,
    `${descriptor.qlId}: QL ownership drifted.`,
  );

  for (let state = 1; state <= REVIEW_SEEDS_PER_QL; state += 1) {
    const question = runSapQuestionStudioPipeline(descriptor.checkpointId, {
      language: "en",
      questionLanguageId: descriptor.qlId,
      seed: `sap-chapter-review:${descriptor.qlId}:state-${state}`,
    });
    const label = `${descriptor.qlId}/state-${state}`;
    assert.equal(question.canonicalProblemId, descriptor.checkpointId, `${label}: CP ownership drifted.`);
    assert.equal(question.questionLanguageId, descriptor.qlId, `${label}: QL identity drifted.`);
    auditQuestion(question, label);
    reviewQuestions.push({
      reviewKind: "QL_EXPLICIT",
      state,
      qlTitle: descriptor.title,
      sourceIdentity: descriptor.sourceIdentity,
      specialist: descriptor.specialist,
      ...question,
    });
  }
}

for (const [stem, count] of stemCounts.entries()) {
  if (count > 1) exactDuplicateStems.push(`${count}× ${stem}`);
}
assert.equal(exactDuplicateStems.length, 0, `Exact duplicate stems found in QL review corpus:\n${exactDuplicateStems.slice(0, 20).join("\n")}`);
assert.equal(suspiciousText.length, 0, `Suspicious learner text found:\n${suspiciousText.slice(0, 20).join("\n")}`);

const specialist = SAP_QUESTION_STUDIO_QLS.find((entry) => entry.qlId === "SAP-QL-185");
assert.ok(specialist);
assert.equal(specialist.defaultWeight, 0, "Significant-figure diagnostic should not enter the default mix.");
assert.equal(specialist.specialist, true);

const ql180 = SAP_QUESTION_STUDIO_QLS.find((entry) => entry.qlId === "SAP-QL-180");
assert.ok(ql180?.title.toLowerCase().includes("power"));
assert.ok(!ql180?.title.toLowerCase().includes("root or power"));
const ql180States = reviewQuestions.filter((question) => question.questionLanguageId === "SAP-QL-180");
assert.equal(ql180States.length, REVIEW_SEEDS_PER_QL);
assert.ok(ql180States.every((question) => /power/iu.test(`${question.traceability?.qlTitle ?? ""} ${question.traceability?.sourceIdentity ?? ""}`)));

const sharedResult = await generateQuestion({
  packageId: "SAP",
  topic: "Arithmetic",
  subtopic: "Simplification & Approximation",
  language: "en",
  count: 50,
  seed: "sap-shared-question-studio-contract",
});
assert.equal(sharedResult.questions.length, 50);
assert.ok(sharedResult.questions.every((question: any) => question.packageId === "SAP"));
assert.ok(sharedResult.questions.every((question: any) => question.questionBankStatus === "NOT_STORED"));
assert.ok(sharedResult.questions.every((question: any) => question.testEligibility === "INELIGIBLE"));
assert.ok(sharedResult.questions.every((question: any) => question.publiclyPublishable === false));
assert.equal(sharedResult.generationContext.questionBankStatus, "NOT_STORED");
assert.equal(sharedResult.generationContext.testEligibility, "INELIGIBLE");
assert.equal(sharedResult.generationContext.publiclyPublishable, false);

const difficultyRuns: Record<string, number> = {};
const cockpitQuestions: any[] = [];
for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const result = await generateQuestion({
    packageId: "SAP",
    topic: "Arithmetic",
    subtopic: "Simplification & Approximation",
    language: "en",
    difficulty,
    count: COCKPIT_BATCH_PER_DIFFICULTY,
    seed: `sap-shared-cockpit-${difficulty.toLowerCase()}-chapter-review`,
  });
  assert.equal(result.questions.length, COCKPIT_BATCH_PER_DIFFICULTY, `${difficulty}: shared Cockpit batch under-filled.`);
  assert.ok(result.questions.every((question: any) => question.packageId === "SAP"));
  assert.ok(
    result.questions.every((question: any) => question.difficultyLabel === difficulty),
    `${difficulty}: chapter mix did not honor the existing Cockpit difficulty control.`,
  );
  assert.ok(result.questions.every((question: any) => question.questionBankStatus === "NOT_STORED"));
  assert.ok(result.questions.every((question: any) => question.testEligibility === "INELIGIBLE"));
  assert.ok(result.questions.every((question: any) => question.publiclyPublishable === false));
  difficultyRuns[difficulty] = result.questions.length;
  cockpitQuestions.push(...result.questions.map((question: any, index: number) => ({
    reviewKind: "COCKPIT_BATCH",
    requestedDifficulty: difficulty,
    batchIndex: index + 1,
    ...question,
  })));
}

const cpCoverage = Object.fromEntries(
  SAP_QUESTION_STUDIO_CP_IDS.map((cpId) => [cpId, cpCounts[cpId] ?? 0]),
);
assert.ok(Object.values(cpCoverage).every((count) => Number(count) >= 3), "Every SAP checkpoint must appear in the explicit review corpus.");

const csvEscape = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const csvHeader = [
  "reviewKind",
  "questionLanguageId",
  "canonicalProblemId",
  "difficultyBand",
  "questionId",
  "stem",
  "optionA",
  "optionB",
  "optionC",
  "optionD",
  "correctIndex",
  "answer",
  "explanation",
  "qlTitle",
  "sourceIdentity",
].join(",");
const csvRows = reviewQuestions.map((question) => [
  question.reviewKind,
  question.questionLanguageId,
  question.canonicalProblemId,
  question.difficultyBand,
  question.questionId,
  question.stem,
  question.options[0],
  question.options[1],
  question.options[2],
  question.options[3],
  question.correctIndex,
  question.answer,
  question.explanation.lines.join(" | "),
  question.qlTitle,
  question.sourceIdentity,
].map(csvEscape).join(","));

const byCpSamples = SAP_QUESTION_STUDIO_CP_IDS.flatMap((cpId) => {
  const cpQuestions = reviewQuestions.filter((question) => question.canonicalProblemId === cpId);
  const first = cpQuestions[0];
  const middle = cpQuestions[Math.floor(cpQuestions.length / 2)];
  const last = cpQuestions[cpQuestions.length - 1];
  return [first, middle, last].filter(Boolean);
});
const specialQlIds = [
  "SAP-QL-001",
  "SAP-QL-016",
  "SAP-QL-017",
  "SAP-QL-033",
  "SAP-QL-034",
  "SAP-QL-052",
  "SAP-QL-053",
  "SAP-QL-071",
  "SAP-QL-072",
  "SAP-QL-091",
  "SAP-QL-092",
  "SAP-QL-112",
  "SAP-QL-113",
  "SAP-QL-128",
  "SAP-QL-129",
  "SAP-QL-146",
  "SAP-QL-147",
  "SAP-QL-165",
  "SAP-QL-180",
  "SAP-QL-183",
  "SAP-QL-184",
  "SAP-QL-185",
  "SAP-QL-186",
  "SAP-QL-187",
  "SAP-QL-198",
  "SAP-QL-199",
  "SAP-QL-211",
];
const specialSamples = specialQlIds
  .map((qlId) => reviewQuestions.find((question) => question.questionLanguageId === qlId))
  .filter(Boolean);
const sampleMap = new Map<string, any>();
for (const question of [...byCpSamples, ...specialSamples]) sampleMap.set(question.questionId, question);
const humanSamples = [...sampleMap.values()];

const summary = {
  status: "PASS_SAP_CHAPTER_WIDE_ENGLISH_REVIEW_AUDIT",
  authority: "SAP-SHARED-QUESTION-STUDIO-INTEGRATION",
  qlCount: SAP_QUESTION_STUDIO_QLS.length,
  checkpointCount: SAP_QUESTION_STUDIO_CP_IDS.length,
  reviewSeedsPerQl: REVIEW_SEEDS_PER_QL,
  explicitQlQuestionCount: reviewQuestions.length,
  sharedMixedQuestionCount: sharedResult.questions.length,
  cockpitQuestionCount: cockpitQuestions.length,
  totalGeneratedForAudit: reviewQuestions.length + sharedResult.questions.length + cockpitQuestions.length,
  cpCoverage,
  difficultyCounts,
  correctIndexCounts,
  exactDuplicateStemCount: exactDuplicateStems.length,
  duplicateQuestionIdCount: reviewQuestions.length - questionIds.size,
  suspiciousTextCount: suspiciousText.length,
  difficultyRuns,
  ql180PowerOnly: true,
  ql185DefaultMixExcluded: true,
  questionBankStatus: sharedResult.generationContext.questionBankStatus,
  testEligibility: sharedResult.generationContext.testEligibility,
  publiclyPublishable: sharedResult.generationContext.publiclyPublishable,
};

const jsonPath = resolve(OUTPUT_DIRECTORY, "sap-question-studio-chapter-review.json");
const csvPath = resolve(OUTPUT_DIRECTORY, "sap-question-studio-chapter-review.csv");
const markdownPath = resolve(OUTPUT_DIRECTORY, "sap-question-studio-chapter-review.md");

writeFileSync(jsonPath, `${JSON.stringify({ summary, reviewQuestions, sharedMixedQuestions: sharedResult.questions, cockpitQuestions }, null, 2)}\n`, "utf8");
writeFileSync(csvPath, `${csvHeader}\n${csvRows.join("\n")}\n`, "utf8");

const markdown = [
  "# SAP Chapter-Wide English Review Audit",
  "",
  `Status: **${summary.status}**`,
  "",
  `- Permanent QLs reviewed: ${summary.qlCount}`,
  `- Checkpoints covered: ${summary.checkpointCount}`,
  `- Explicit generated states: ${summary.explicitQlQuestionCount} (${REVIEW_SEEDS_PER_QL} per QL)`,
  `- Shared mixed batch: ${summary.sharedMixedQuestionCount}`,
  `- Existing Cockpit difficulty batches: ${summary.cockpitQuestionCount} (${COCKPIT_BATCH_PER_DIFFICULTY} each Easy/Medium/Hard)`,
  `- Total generated in audit: ${summary.totalGeneratedForAudit}`,
  `- Exact duplicate stems: ${summary.exactDuplicateStemCount}`,
  `- Duplicate question IDs: ${summary.duplicateQuestionIdCount}`,
  `- Suspicious placeholder/generic learner text: ${summary.suspiciousTextCount}`,
  `- Correct-index distribution: A ${correctIndexCounts[0]}, B ${correctIndexCounts[1]}, C ${correctIndexCounts[2]}, D ${correctIndexCounts[3]}`,
  "",
  "## Checkpoint coverage",
  "",
  ...Object.entries(cpCoverage).map(([cpId, count]) => `- ${cpId}: ${count}`),
  "",
  "## Difficulty distribution in explicit QL corpus",
  "",
  ...Object.entries(difficultyCounts).sort().map(([difficulty, count]) => `- ${difficulty}: ${count}`),
  "",
  "## Human-review samples",
  "",
  ...humanSamples.flatMap((question) => [
    `### ${question.questionLanguageId} · ${question.canonicalProblemId} · ${question.difficultyBand}`,
    "",
    `**QL:** ${question.qlTitle}`,
    "",
    `**Question:** ${question.stem}`,
    "",
    ...question.options.map((option: string, index: number) => `${index === question.correctIndex ? "**" : ""}${String.fromCharCode(65 + index)}. ${option}${index === question.correctIndex ? "**" : ""}`),
    "",
    `**Answer:** ${question.answer}`,
    "",
    `**Explanation:** ${question.explanation.lines.join(" ")}`,
    "",
  ]),
].join("\n");
writeFileSync(markdownPath, `${markdown}\n`, "utf8");

console.log(JSON.stringify({ ...summary, jsonPath, csvPath, markdownPath }));
