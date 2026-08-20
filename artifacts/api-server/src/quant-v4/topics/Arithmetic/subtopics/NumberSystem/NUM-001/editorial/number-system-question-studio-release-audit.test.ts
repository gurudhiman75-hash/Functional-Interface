// @ts-nocheck
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { NUMBER_SYSTEM_GENERATOR_V3_CARDS } from "./number-system-generator-v3-review";
import {
  NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE,
  getNum001QuestionStudioQlIds,
} from "./number-system-question-studio-release";
import {
  fixStemGrammar,
  formatStudentValue,
  normaliseTeacherExplanation,
} from "./number-system-v3-presentation";
import {
  NUM_001_QUESTION_STUDIO_CP_IDS,
  NUM_001_QUESTION_STUDIO_LANGUAGES,
  runNum001QuestionStudioPipeline,
} from "../question-studio-adapter";

const auditStartedAt = Date.now();

function stage(name: string, details: Record<string, unknown> = {}) {
  console.log(JSON.stringify({
    audit: "NUM-001 English Question Studio release",
    stage: name,
    elapsedMs: Date.now() - auditStartedAt,
    ...details,
  }));
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function wholeProseSentenceInMath(value: unknown): boolean {
  const text = String(value ?? "").trim();
  if (!/^\$[^$]+\$$/u.test(text)) return false;
  const body = text.slice(1, -1).replace(/\\[A-Za-z]+/gu, "");
  return /[A-Za-z]{2,}/u.test(body) && /\s/u.test(body);
}

function jsonStringify(value: unknown): string {
  return JSON.stringify(
    value,
    (_key, item) => typeof item === "bigint" ? item.toString() : item,
    2,
  );
}

function releaseCard(card: any) {
  const options = card.options.map(formatStudentValue);
  const explanation = normaliseTeacherExplanation(card.explanation);
  return Object.freeze({
    ...card,
    stem: fixStemGrammar(card.stem),
    options: Object.freeze(options),
    correctAnswer: Object.freeze({
      ...card.correctAnswer,
      value: options[card.correctAnswer.label.charCodeAt(0) - 65],
    }),
    explanation,
    lifecycle: Object.freeze({
      environment: "QUESTION_STUDIO",
      status: "ACTIVE_QUESTION_STUDIO",
      questionStudioDiscoverable: true,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    }),
  });
}

stage("editorial-corpus:start");
const releasedEditorialCards = Object.freeze(
  NUMBER_SYSTEM_GENERATOR_V3_CARDS.map(releaseCard),
);
const editorialQlIds = new Set(releasedEditorialCards.map((card) => card.qlId));

assert(releasedEditorialCards.length === 153,
  `Expected 153 editorial release cards, received ${releasedEditorialCards.length}`);
assert(releasedEditorialCards.filter((card) => card.checkpoint === "NUM-CP-003").length === 69,
  "CP-003 release-card count mismatch");
assert(releasedEditorialCards.filter((card) => card.checkpoint === "NUM-CP-004").length === 84,
  "CP-004 release-card count mismatch");
assert(editorialQlIds.size === 45,
  `Expected 45 permanent QLs in editorial evidence, received ${editorialQlIds.size}`);

for (const card of releasedEditorialCards) {
  const text = [
    card.stem,
    ...card.options,
    ...card.explanation.mainRule,
    ...card.explanation.stepByStepSolution,
    ...card.explanation.examSpeedTrick,
    ...card.explanation.commonTraps.flatMap((trap) => [trap.optionValue, trap.message]),
  ].join("\n");
  assert(card.lifecycle.questionStudioDiscoverable === true,
    `${card.qlId}: Question Studio release flag is false`);
  assert(card.lifecycle.questionBankWritable === false,
    `${card.qlId}: Question Bank write flag opened`);
  assert(card.lifecycle.testEligible === false,
    `${card.qlId}: test eligibility opened`);
  assert(card.lifecycle.publiclyPublishable === false,
    `${card.qlId}: publication opened`);
  assert(!/\$\$/u.test(text), `${card.qlId}: display delimiters remain inline`);
  assert(!/\$\d[\d,]*\$\s*[×÷]\s*\$\d[\d,]*\$/u.test(text),
    `${card.qlId}: split multiplication or division remains`);
  assert(card.options.every((option) => !wholeProseSentenceInMath(option)),
    `${card.qlId}: prose option remains entirely inside MathJax`);
  assert(card.options[card.correctAnswer.label.charCodeAt(0) - 65] === card.correctAnswer.value,
    `${card.qlId}: editorial answer differs from the safe option array`);
}
stage("editorial-corpus:complete", {
  editorialCardCount: releasedEditorialCards.length,
  permanentQlCount: editorialQlIds.size,
});

stage("active-registry:start");
const cp003QlIds = [...getNum001QuestionStudioQlIds("NUM-CP-003")];
const cp004QlIds = [...getNum001QuestionStudioQlIds("NUM-CP-004")];
const activeQlIds = [...cp003QlIds, ...cp004QlIds];
assert(JSON.stringify(NUM_001_QUESTION_STUDIO_CP_IDS) === JSON.stringify(["NUM-CP-003", "NUM-CP-004"]),
  "NUM-001 adapter CP registry is incorrect");
assert(JSON.stringify(NUM_001_QUESTION_STUDIO_LANGUAGES) === JSON.stringify(["en"]),
  "NUM-001 adapter language registry is incorrect");
assert(cp003QlIds.length === 17, `Expected 17 active CP-003 QLs, received ${cp003QlIds.length}`);
assert(cp004QlIds.length === 28, `Expected 28 active CP-004 QLs, received ${cp004QlIds.length}`);
assert(activeQlIds.length === 45 && new Set(activeQlIds).size === 45,
  "The Question Studio QL registry does not contain 45 unique identities");
for (const qlId of activeQlIds) {
  assert(editorialQlIds.has(qlId), `${qlId}: active QL lacks approved editorial evidence`);
}
stage("active-registry:complete", {
  cp003QlCount: cp003QlIds.length,
  cp004QlCount: cp004QlIds.length,
});

// Exhaustive mathematical generation remains owned by the existing CP-specific
// workflows. This release proof exercises one bounded adapter route per CP.
const representativeRequests = [
  { cpId: "NUM-CP-003", qlId: "NUM-QL-001" },
  { cpId: "NUM-CP-004", qlId: "NUM-QL-018" },
];

stage("adapter-runtime:start", { count: representativeRequests.length });
const runtimeSamples = representativeRequests.map(({ cpId, qlId }) => {
  stage("adapter-runtime:generate", { cpId, qlId });
  return runNum001QuestionStudioPipeline(cpId, {
    questionLanguageId: qlId,
    seed: `num-001-english-release-proof:${qlId}`,
    language: "en",
  });
});

for (const question of runtimeSamples) {
  assert(activeQlIds.includes(question.questionLanguageId),
    `${question.questionLanguageId}: runtime returned an inactive QL`);
  assert(question.runtimeMode === "QUESTION_STUDIO_ACTIVE",
    `${question.questionLanguageId}: runtime mode is not Question Studio active`);
  assert(question.active === true && question.questionStudioDiscoverable === true,
    `${question.questionLanguageId}: Question Studio release is inactive`);
  assert(question.questionBankWritable === false,
    `${question.questionLanguageId}: Question Bank write gate opened`);
  assert(question.testEligible === false,
    `${question.questionLanguageId}: test gate opened`);
  assert(question.publiclyPublishable === false,
    `${question.questionLanguageId}: publication gate opened`);
  assert(question.validation.ok === true && question.validation.errors.length === 0,
    `${question.questionLanguageId}: release validation failed`);
  assert(question.options.length >= 4 && new Set(question.options).size === question.options.length,
    `${question.questionLanguageId}: invalid learner options`);
  assert(question.options[question.correctIndex] === question.answer,
    `${question.questionLanguageId}: answer does not match the option array`);
  const learnerText = [question.stem, ...question.options, ...question.explanation.lines].join("\n");
  assert(!/\$\$/u.test(learnerText),
    `${question.questionLanguageId}: runtime output contains display delimiters`);
  assert(question.options.every((option) => !wholeProseSentenceInMath(option)),
    `${question.questionLanguageId}: runtime prose option is wholly inside MathJax`);
}
stage("adapter-runtime:complete", { count: runtimeSamples.length });

stage("central-wiring-source:start");
const generationEnginePath = resolve(
  process.cwd(),
  "src/quant-v4/question-studio-generation-engine.ts",
);
const adminRoutePath = resolve(
  process.cwd(),
  "src/routes/admin-question-studio-average.ts",
);
const generationEngineSource = readFileSync(generationEnginePath, "utf8");
const adminRouteSource = readFileSync(adminRoutePath, "utf8");

const engineMarkers = [
  "NUM_001_QUESTION_STUDIO_CP_IDS",
  "NUM_001_QUESTION_STUDIO_LANGUAGES",
  "runNum001QuestionStudioPipeline",
  'packageId: "NUM-001"',
  "isNumberSystemRequest",
  "generateNumberSystemQuestion",
  "QUESTION_STUDIO_ACTIVE",
  "NOT_STORED",
  "INELIGIBLE",
];
for (const marker of engineMarkers) {
  assert(generationEngineSource.includes(marker),
    `Central Question Studio engine is missing NUM-001 marker: ${marker}`);
}

const routeMarkers = [
  "isNumberSystemRequest",
  'requestedNumberSystemPackage === "num 002"',
  '? cp008Request ? "NUM-002" : "NUM-001"',
  'defaultSubtopic = numberSystemRequest ? "Number System" : "Average"',
  'targetCp !== "NUM-CP-001" && targetCp !== "NUM-CP-008"',
  "other currently routed checkpoints remain English-only",
];
for (const marker of routeMarkers) {
  assert(adminRouteSource.includes(marker),
    `Admin Question Studio route is missing Number System routing invariant: ${marker}`);
}
stage("central-wiring-source:complete", {
  engineMarkerCount: engineMarkers.length,
  routeMarkerCount: routeMarkers.length,
});

stage("unsupported-language:start");
let unsupportedLanguageRejected = false;
try {
  runNum001QuestionStudioPipeline("NUM-CP-003", {
    questionLanguageId: "NUM-QL-001",
    language: "hi",
    seed: "num-001-unapproved-language-proof",
  });
} catch {
  unsupportedLanguageRejected = true;
}
assert(unsupportedLanguageRejected, "NUM-001 accepted an unapproved language");
stage("unsupported-language:complete");

stage("evidence-export:start");
const outputDirectory = resolve(
  process.cwd(),
  "dist/quant-v4/number-system-question-studio-release",
);
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(outputDirectory, "num-001-question-studio-release-review.json");
const markdownPath = resolve(outputDirectory, "num-001-question-studio-release-review.md");
const csvPath = resolve(outputDirectory, "num-001-question-studio-release-review.csv");

const releaseRegistry = activeQlIds.map((qlId) => ({
  qlId,
  cpId: cp003QlIds.includes(qlId) ? "NUM-CP-003" : "NUM-CP-004",
  status: "ACTIVE_QUESTION_STUDIO",
  language: "en",
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}));

writeFileSync(jsonPath, `${jsonStringify({
  status: "ACTIVE_QUESTION_STUDIO_NUM_001_ENGLISH_V1",
  release: NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE,
  editorialCardCount: releasedEditorialCards.length,
  activePermanentQlCount: activeQlIds.length,
  runtimeSampleCount: runtimeSamples.length,
  checkpointCounts: { "NUM-CP-003": 69, "NUM-CP-004": 84 },
  centralWiringSourceAudit: {
    generationEnginePath,
    adminRoutePath,
    engineMarkers,
    routeMarkers,
  },
  releaseRegistry,
  editorialCards: releasedEditorialCards,
  runtimeSamples,
})}\n`, "utf8");

const markdown = [
  "# ExamTree NUM-001 — English Question Studio Release Review",
  "",
  `**Release:** \`${NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE.releaseId}\``,
  "",
  "**Lifecycle:** Active in Question Studio. Question Bank writes, test eligibility and public publication remain disabled.",
  "",
  `**Editorial cards:** ${releasedEditorialCards.length}`,
  "",
  `**Active permanent QLs:** ${activeQlIds.length}`,
  "",
  `**Bounded adapter runtime samples:** ${runtimeSamples.length}`,
  "",
  "**Central wiring:** source-audited; production and integrated-admin builds remain executable compile gates.",
  "",
  "## Active QL registry",
  "",
  ...releaseRegistry.map((entry) => `- \`${entry.qlId}\` — \`${entry.cpId}\` — English Question Studio active`),
  "",
  "---",
  "",
  ...runtimeSamples.flatMap((sample) => [
    `## ${sample.questionLanguageId} — ${sample.canonicalProblemId}`,
    "",
    `**Difficulty:** ${sample.difficulty}`,
    "",
    "### Question",
    "",
    sample.stem,
    "",
    ...sample.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`),
    "",
    `**Correct Answer:** ${String.fromCharCode(65 + sample.correctIndex)}. ${sample.answer}`,
    "",
    ...sample.explanation.lines,
    "",
    "---",
    "",
  ]),
].join("\n");
writeFileSync(markdownPath, `${markdown}\n`, "utf8");

const csvEscape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const csv = [
  ["qlId", "cpId", "status", "language", "questionBankWritable", "testEligible", "publiclyPublishable"].join(","),
  ...releaseRegistry.map((entry) => [
    entry.qlId,
    entry.cpId,
    entry.status,
    entry.language,
    entry.questionBankWritable,
    entry.testEligible,
    entry.publiclyPublishable,
  ].map(csvEscape).join(",")),
].join("\n");
writeFileSync(csvPath, `${csv}\n`, "utf8");
stage("evidence-export:complete", { jsonPath, markdownPath, csvPath });

console.log(jsonStringify({
  status: "PASS_NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE",
  releaseId: NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE.releaseId,
  editorialCardCount: releasedEditorialCards.length,
  activePermanentQlCount: activeQlIds.length,
  cp003ActiveQlCount: cp003QlIds.length,
  cp004ActiveQlCount: cp004QlIds.length,
  runtimeSampleCount: runtimeSamples.length,
  centralEngineMarkers: engineMarkers.length,
  adminRouteMarkers: routeMarkers.length,
  questionStudioActive: true,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  unsupportedLanguageRejected,
  elapsedMs: Date.now() - auditStartedAt,
  jsonPath,
  markdownPath,
  csvPath,
}));
