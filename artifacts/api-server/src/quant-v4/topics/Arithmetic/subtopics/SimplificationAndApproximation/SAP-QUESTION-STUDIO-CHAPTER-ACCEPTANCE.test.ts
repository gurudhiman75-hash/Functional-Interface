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

const STATES_PER_QL = 3;
const COCKPIT_COUNT = 50;
const OUTPUT_DIRECTORY = resolve(process.cwd(), "dist/quant-v4/sap-question-studio-chapter-acceptance");
mkdirSync(OUTPUT_DIRECTORY, { recursive: true });

const packageCard = listQuantV4Packages().find((entry: any) => entry.packageId === "SAP") as any;
assert.ok(packageCard, "SAP is missing from the shared Question Studio registry.");
assert.equal(packageCard.enabled, true);
assert.equal(packageCard.subtopic, "Simplification & Approximation");
assert.deepEqual(packageCard.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual(packageCard.cpIds, [...SAP_QUESTION_STUDIO_CP_IDS]);
assert.equal(packageCard.questionBankStatus, "NOT_STORED");
assert.equal(packageCard.testEligibility, "INELIGIBLE");
assert.equal(packageCard.publiclyPublishable, false);

assert.equal(SAP_QUESTION_STUDIO_CP_IDS.length, 12);
assert.equal(SAP_QUESTION_STUDIO_QLS.length, 211);
assert.deepEqual(
  SAP_QUESTION_STUDIO_QLS.map((entry) => entry.qlId),
  Array.from({ length: 211 }, (_, index) => `SAP-QL-${String(index + 1).padStart(3, "0")}`),
);

const explicitQuestions: any[] = [];
const questionIds = new Set<string>();
const fullQuestionFingerprints = new Map<string, string[]>();
const stemGroups = new Map<string, string[]>();
const cpCounts: Record<string, number> = {};
const difficultyCounts: Record<string, number> = {};
const correctIndexCounts = [0, 0, 0, 0];

function normalizedStem(value: unknown) {
  return String(value ?? "").trim().replace(/\s+/gu, " ");
}

function learnerFingerprint(question: any) {
  return JSON.stringify({
    stem: normalizedStem(question.stem),
    options: question.options.map((option: unknown) => String(option).trim()),
  });
}

function auditLearnerQuestion(question: any, label: string) {
  assert.equal(question.packageId, "SAP", `${label}: wrong package.`);
  assert.ok(normalizedStem(question.stem).length > 0, `${label}: empty stem.`);
  assert.equal(question.options.length, 4, `${label}: expected four options.`);
  assert.equal(new Set(question.options.map(String)).size, 4, `${label}: duplicate options.`);
  assert.ok(Number.isInteger(question.correctIndex) && question.correctIndex >= 0 && question.correctIndex < 4, `${label}: invalid correctIndex.`);
  assert.equal(question.options[question.correctIndex], question.answer, `${label}: answer/index mismatch.`);
  assert.ok(Array.isArray(question.explanation?.lines) && question.explanation.lines.length >= 1, `${label}: explanation missing.`);
  assert.ok(question.explanation.lines.some((line: unknown) => String(line).trim().length >= 8), `${label}: explanation is not substantive.`);
  assert.equal(question.validation?.ok, true, `${label}: source validation failed: ${(question.validation?.errors ?? []).join(" | ")}`);
  assert.equal(question.questionBankStatus, "NOT_STORED", `${label}: Question Bank gate drifted.`);
  assert.equal(question.testEligibility, "INELIGIBLE", `${label}: test gate drifted.`);
  assert.equal(question.publiclyPublishable, false, `${label}: public gate drifted.`);

  const learnerText = [question.stem, ...question.options, ...question.explanation.lines].join("\n");
  assert.ok(!/\b(?:undefined|TODO|TBD|PLACEHOLDER)\b/iu.test(learnerText), `${label}: placeholder/undefined leaked.`);
  assert.ok(!learnerText.includes("[object Object]"), `${label}: object serialization leaked.`);
  assert.ok(!/\$\$/u.test(learnerText), `${label}: display delimiters leaked.`);
  assert.ok(!/\b(?:AST|RPN|canonical evaluator|independent verifier)\b/iu.test(learnerText), `${label}: internal engineering language leaked.`);
  assert.ok(
    question.options.every((option: unknown) => !/^\s*(?:alternative|option)\s*[A-D1-4]?\s*$/iu.test(String(option))),
    `${label}: generic placeholder option leaked.`,
  );

  assert.ok(!questionIds.has(question.questionId), `${label}: duplicate questionId ${question.questionId}.`);
  questionIds.add(question.questionId);

  const fingerprint = learnerFingerprint(question);
  const fingerprintLabels = fullQuestionFingerprints.get(fingerprint) ?? [];
  fingerprintLabels.push(label);
  fullQuestionFingerprints.set(fingerprint, fingerprintLabels);

  const stem = normalizedStem(question.stem);
  const stemLabels = stemGroups.get(stem) ?? [];
  stemLabels.push(label);
  stemGroups.set(stem, stemLabels);

  cpCounts[question.canonicalProblemId] = (cpCounts[question.canonicalProblemId] ?? 0) + 1;
  difficultyCounts[question.difficultyBand] = (difficultyCounts[question.difficultyBand] ?? 0) + 1;
  correctIndexCounts[question.correctIndex] += 1;
}

for (const descriptor of SAP_QUESTION_STUDIO_QLS) {
  assert.equal(inferSapQuestionStudioCpFromQl(descriptor.qlId), descriptor.checkpointId, `${descriptor.qlId}: QL ownership drifted.`);
  const usedSourceSeeds = new Set<number>();

  for (let state = 1; state <= STATES_PER_QL; state += 1) {
    let question: any | undefined;
    for (let candidate = 1; candidate <= 100; candidate += 1) {
      const generated = runSapQuestionStudioPipeline(descriptor.checkpointId, {
        language: "en",
        questionLanguageId: descriptor.qlId,
        seed: `sap-chapter-acceptance:${descriptor.qlId}:state-${state}:candidate-${candidate}`,
      }) as any;
      const sourceSeed = Number(generated.traceability?.sourceSeed);
      if (!Number.isInteger(sourceSeed)) throw new Error(`${descriptor.qlId}: sourceSeed missing.`);
      if (usedSourceSeeds.has(sourceSeed)) continue;
      usedSourceSeeds.add(sourceSeed);
      question = generated;
      break;
    }
    if (!question) throw new Error(`${descriptor.qlId}: unable to obtain ${STATES_PER_QL} distinct source states.`);

    const label = `${descriptor.qlId}/state-${state}/source-${question.traceability.sourceSeed}`;
    assert.equal(question.canonicalProblemId, descriptor.checkpointId, `${label}: CP ownership drifted.`);
    assert.equal(question.questionLanguageId, descriptor.qlId, `${label}: QL identity drifted.`);
    auditLearnerQuestion(question, label);
    explicitQuestions.push({
      reviewKind: "QL_EXPLICIT",
      state,
      qlTitle: descriptor.title,
      sourceIdentity: descriptor.sourceIdentity,
      specialist: descriptor.specialist,
      ...question,
    });
  }
}

const duplicateFullQuestions = [...fullQuestionFingerprints.entries()]
  .filter(([, labels]) => labels.length > 1)
  .map(([fingerprint, labels]) => ({ fingerprint: JSON.parse(fingerprint), labels }));
assert.equal(
  duplicateFullQuestions.length,
  0,
  `Duplicate full learner questions found: ${JSON.stringify(duplicateFullQuestions.slice(0, 10))}`,
);

const repeatedStemGroups = [...stemGroups.entries()]
  .filter(([, labels]) => labels.length > 1)
  .map(([stem, labels]) => ({ stem, count: labels.length, labels }));

const ql180 = SAP_QUESTION_STUDIO_QLS.find((entry) => entry.qlId === "SAP-QL-180");
assert.ok(ql180?.title.toLowerCase().includes("power"));
assert.ok(!ql180?.title.toLowerCase().includes("root or power"));
const ql180States = explicitQuestions.filter((question) => question.questionLanguageId === "SAP-QL-180");
assert.equal(ql180States.length, STATES_PER_QL);
assert.ok(ql180States.every((question) => /power/iu.test(`${question.traceability?.qlTitle ?? ""} ${question.traceability?.sourceIdentity ?? ""}`)));

const ql185 = SAP_QUESTION_STUDIO_QLS.find((entry) => entry.qlId === "SAP-QL-185");
assert.ok(ql185);
assert.equal(ql185.defaultWeight, 0);
assert.equal(ql185.specialist, true);

const mixedResult = await generateQuestion({
  packageId: "SAP",
  topic: "Arithmetic",
  subtopic: "Simplification & Approximation",
  language: "en",
  count: COCKPIT_COUNT,
  seed: "sap-chapter-acceptance-mixed",
});
assert.equal(mixedResult.questions.length, COCKPIT_COUNT);
assert.ok(mixedResult.questions.every((question: any) => question.packageId === "SAP"));
assert.equal(mixedResult.generationContext.questionBankStatus, "NOT_STORED");
assert.equal(mixedResult.generationContext.testEligibility, "INELIGIBLE");
assert.equal(mixedResult.generationContext.publiclyPublishable, false);

const cockpitQuestions: any[] = [];
const cockpitDifficultyCounts: Record<string, number> = {};
for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const result = await generateQuestion({
    packageId: "SAP",
    topic: "Arithmetic",
    subtopic: "Simplification & Approximation",
    language: "en",
    difficulty,
    count: COCKPIT_COUNT,
    seed: `sap-chapter-acceptance-${difficulty.toLowerCase()}`,
  });
  assert.equal(result.questions.length, COCKPIT_COUNT, `${difficulty}: shared Cockpit batch under-filled.`);
  assert.ok(result.questions.every((question: any) => question.packageId === "SAP"));
  assert.ok(result.questions.every((question: any) => question.difficultyLabel === difficulty), `${difficulty}: requested difficulty not preserved.`);
  assert.ok(result.questions.every((question: any) => question.questionBankStatus === "NOT_STORED"));
  assert.ok(result.questions.every((question: any) => question.testEligibility === "INELIGIBLE"));
  assert.ok(result.questions.every((question: any) => question.publiclyPublishable === false));
  cockpitDifficultyCounts[difficulty] = result.questions.length;
  cockpitQuestions.push(...result.questions.map((question: any, index: number) => ({
    reviewKind: "COCKPIT_BATCH",
    requestedDifficulty: difficulty,
    batchIndex: index + 1,
    ...question,
  })));
}

const cpCoverage = Object.fromEntries(SAP_QUESTION_STUDIO_CP_IDS.map((cpId) => [cpId, cpCounts[cpId] ?? 0]));
assert.ok(Object.values(cpCoverage).every((count) => Number(count) >= 3), "Every SAP checkpoint must be represented in the explicit corpus.");

const summary = {
  status: "PASS_SAP_CHAPTER_WIDE_ENGLISH_ACCEPTANCE",
  qlCount: SAP_QUESTION_STUDIO_QLS.length,
  checkpointCount: SAP_QUESTION_STUDIO_CP_IDS.length,
  distinctStatesPerQl: STATES_PER_QL,
  explicitQuestionCount: explicitQuestions.length,
  mixedQuestionCount: mixedResult.questions.length,
  cockpitQuestionCount: cockpitQuestions.length,
  totalGenerated: explicitQuestions.length + mixedResult.questions.length + cockpitQuestions.length,
  cpCoverage,
  difficultyCounts,
  correctIndexCounts,
  repeatedStemGroupCount: repeatedStemGroups.length,
  duplicateFullQuestionCount: duplicateFullQuestions.length,
  cockpitDifficultyCounts,
  ql180PowerOnly: true,
  ql185DefaultMixExcluded: true,
  questionBankStatus: mixedResult.generationContext.questionBankStatus,
  testEligibility: mixedResult.generationContext.testEligibility,
  publiclyPublishable: mixedResult.generationContext.publiclyPublishable,
};

const jsonPath = resolve(OUTPUT_DIRECTORY, "sap-question-studio-chapter-acceptance.json");
const csvPath = resolve(OUTPUT_DIRECTORY, "sap-question-studio-chapter-acceptance.csv");
const markdownPath = resolve(OUTPUT_DIRECTORY, "sap-question-studio-chapter-acceptance.md");

writeFileSync(jsonPath, `${JSON.stringify({
  summary,
  repeatedStemGroups,
  explicitQuestions,
  mixedQuestions: mixedResult.questions,
  cockpitQuestions,
}, null, 2)}\n`, "utf8");

const csvEscape = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const csvHeader = ["qlId", "cpId", "difficulty", "sourceSeed", "stem", "A", "B", "C", "D", "correctIndex", "answer", "explanation", "qlTitle", "sourceIdentity"].join(",");
const csvRows = explicitQuestions.map((question) => [
  question.questionLanguageId,
  question.canonicalProblemId,
  question.difficultyBand,
  question.traceability?.sourceSeed,
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
writeFileSync(csvPath, `${csvHeader}\n${csvRows.join("\n")}\n`, "utf8");

const specialQlIds = new Set([
  "SAP-QL-001", "SAP-QL-016", "SAP-QL-017", "SAP-QL-033",
  "SAP-QL-034", "SAP-QL-052", "SAP-QL-053", "SAP-QL-071",
  "SAP-QL-072", "SAP-QL-091", "SAP-QL-092", "SAP-QL-101",
  "SAP-QL-112", "SAP-QL-113", "SAP-QL-128", "SAP-QL-129",
  "SAP-QL-146", "SAP-QL-147", "SAP-QL-165", "SAP-QL-180",
  "SAP-QL-183", "SAP-QL-184", "SAP-QL-185", "SAP-QL-186",
  "SAP-QL-187", "SAP-QL-198", "SAP-QL-199", "SAP-QL-211",
]);
const samples = new Map<string, any>();
for (const cpId of SAP_QUESTION_STUDIO_CP_IDS) {
  const cpRows = explicitQuestions.filter((question) => question.canonicalProblemId === cpId);
  for (const question of [cpRows[0], cpRows[Math.floor(cpRows.length / 2)], cpRows.at(-1)]) {
    if (question) samples.set(question.questionId, question);
  }
}
for (const question of explicitQuestions) {
  if (specialQlIds.has(question.questionLanguageId) && question.state === 1) samples.set(question.questionId, question);
}

const markdown = [
  "# SAP Chapter-Wide English Acceptance Review",
  "",
  `Status: **${summary.status}**`,
  "",
  `- Permanent QLs: ${summary.qlCount}`,
  `- Checkpoints: ${summary.checkpointCount}`,
  `- Explicit review questions: ${summary.explicitQuestionCount} (${STATES_PER_QL} distinct source states per QL)`,
  `- Shared mixed questions: ${summary.mixedQuestionCount}`,
  `- Shared Cockpit Easy/Medium/Hard questions: ${summary.cockpitQuestionCount}`,
  `- Total generated: ${summary.totalGenerated}`,
  `- Duplicate full learner questions: ${summary.duplicateFullQuestionCount}`,
  `- Repeated instruction/stem groups with different options: ${summary.repeatedStemGroupCount}`,
  `- Correct-index distribution: A ${correctIndexCounts[0]}, B ${correctIndexCounts[1]}, C ${correctIndexCounts[2]}, D ${correctIndexCounts[3]}`,
  "",
  "## Checkpoint coverage",
  "",
  ...Object.entries(cpCoverage).map(([cpId, count]) => `- ${cpId}: ${count}`),
  "",
  "## Repeated stem groups",
  "",
  ...(repeatedStemGroups.length
    ? repeatedStemGroups.flatMap((group) => [`- ${group.count}× ${group.stem}`, `  - ${group.labels.join("; ")}`])
    : ["- None"]),
  "",
  "## Human-review samples",
  "",
  ...[...samples.values()].flatMap((question) => [
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
