import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildSriPermanentEnglishReviewCorpusV1 } from "./permanent-english-review-v1";
import { localizeSriDiscoveryQuestionV1, type SriLocalizedLocaleV1 } from "./permanent-localization-v1";

const LOCALES = ["hi-IN", "pa-IN"] as const satisfies readonly SriLocalizedLocaleV1[];
const rows = buildSriPermanentEnglishReviewCorpusV1(2);
const outputDirectory = resolve(process.cwd(), "dist/quant-v4/sri");
mkdirSync(outputDirectory, { recursive: true });

const jsonPath = resolve(outputDirectory, "sri-permanent-localization-review-v1.json");
const markdownPath = resolve(outputDirectory, "sri-permanent-localization-review-v1.md");

const jsonRows = rows.map((row) => ({
  permanentQlId: row.qlId,
  permanentSolveModeId: row.solveModeId,
  packageId: row.packageId,
  checkpointId: row.checkpointId,
  retainedGroupId: row.retainedGroupId,
  qlTitle: row.qlTitle,
  prototypeAncestryMember: row.memberCandidateId,
  reviewSeedIndex: row.reviewSeedIndex,
  english: learnerProjection(row.question),
  localized: Object.fromEntries(LOCALES.map((locale) => [locale, learnerProjection(localizeSriDiscoveryQuestionV1(row.question, locale))])),
}));

writeFileSync(jsonPath, `${JSON.stringify({
  status: "SRI_PERMANENT_LOCALIZATION_REVIEW_V1",
  lifecycle: "ENGLISH_FROZEN_LOCALIZATION_REVIEW_READY",
  englishReviewRows: rows.length,
  localizedReviewRows: rows.length * LOCALES.length,
  prototypeAncestryMembers: new Set(rows.map((row) => row.memberCandidateId)).size,
  locales: LOCALES,
  multilingualFrozen: false,
  downstreamReleaseEnabled: false,
  rows: jsonRows,
}, null, 2)}\n`, "utf8");

const markdown: string[] = [
  "# SRI — Permanent Localization Review V1",
  "",
  `**English review rows:** ${rows.length}`,
  "",
  `**Localized review rows:** ${rows.length * LOCALES.length}`,
  "",
  `**Prototype ancestry members:** ${new Set(rows.map((row) => row.memberCandidateId)).size}`,
  "",
  "**Lifecycle:** English frozen; Hindi/Punjabi review-ready; multilingual freeze and all downstream release gates remain OFF.",
  "",
];

let currentQl = "";
for (const row of rows) {
  if (row.qlId !== currentQl) {
    currentQl = row.qlId;
    markdown.push("---", "", `# ${row.qlId} — ${row.qlTitle}`, "", `**Solve mode:** ${row.solveModeId}`, "", `**Authority checkpoint:** ${row.checkpointId}`, "", `**Retained group:** ${row.retainedGroupId}`, "");
  }
  const hi = localizeSriDiscoveryQuestionV1(row.question, "hi-IN");
  const pa = localizeSriDiscoveryQuestionV1(row.question, "pa-IN");
  markdown.push(
    `## ${row.memberCandidateId} / review seed ${row.reviewSeedIndex + 1}`,
    "",
    "### English",
    "",
    ...renderQuestion(row.question),
    "### Hindi (hi-IN)",
    "",
    ...renderQuestion(hi),
    "### Punjabi (pa-IN)",
    "",
    ...renderQuestion(pa),
  );
}

writeFileSync(markdownPath, `${markdown.join("\n")}\n`, "utf8");
console.log(JSON.stringify({
  status: "PASS_SRI_PERMANENT_LOCALIZATION_REVIEW_V1_EXPORT",
  englishReviewRows: rows.length,
  localizedReviewRows: rows.length * LOCALES.length,
  jsonPath,
  markdownPath,
}, null, 2));

function learnerProjection(question: ReturnType<typeof localizeSriDiscoveryQuestionV1> | (typeof rows)[number]["question"]): unknown {
  return {
    seed: question.seed,
    candidateId: question.candidateId,
    state: question.state,
    stem: question.stem,
    options: question.options.map((option, index) => ({
      label: String.fromCharCode(65 + index),
      text: option.text,
      isCorrect: index === question.correctIndex,
      canonicalKey: option.canonicalKey,
      misconceptionId: option.misconceptionId,
    })),
    correctIndex: question.correctIndex,
    answer: question.answer,
    explanation: question.explanation,
    verification: question.verification,
  };
}

function renderQuestion(question: ReturnType<typeof localizeSriDiscoveryQuestionV1> | (typeof rows)[number]["question"]): string[] {
  return [
    question.stem,
    "",
    ...question.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option.text}${index === question.correctIndex ? " **✓**" : ""}`),
    "",
    `**Answer:** ${question.answer.text}`,
    "",
    `**Given:** ${question.explanation.given}`,
    "",
    `**Asked:** ${question.explanation.asked}`,
    "",
    `**Method:** ${question.explanation.method}`,
    "",
    ...question.explanation.working.map((line, index) => `${index + 1}. ${line}`),
    "",
    `**Final answer:** ${question.explanation.answer}`,
    "",
  ];
}
