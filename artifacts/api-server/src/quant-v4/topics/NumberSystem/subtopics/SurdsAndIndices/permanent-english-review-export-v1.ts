import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { SRI_PERMANENT_ALLOCATION_V1 } from "./permanent-allocation-v1";
import {
  SRI_PERMANENT_ENGLISH_REVIEW_MEMBERS_V1,
  buildSriPermanentEnglishReviewCorpusV1,
} from "./permanent-english-review-v1";
import { SRI_R1_UNRESOLVED_SOURCE_GATES } from "./source-gate-resolution-r1";

const SEEDS_PER_MEMBER = 2;
const rows = buildSriPermanentEnglishReviewCorpusV1(SEEDS_PER_MEMBER);
const outputDirectory = resolve(process.cwd(), "dist/quant-v4/sri");
mkdirSync(outputDirectory, { recursive: true });

const jsonPath = resolve(outputDirectory, "sri-permanent-english-review-v1.json");
const csvPath = resolve(outputDirectory, "sri-permanent-english-review-v1.csv");
const markdownPath = resolve(outputDirectory, "sri-permanent-english-review-v1.md");

const jsonRows = rows.map((row) => ({
  permanentQlId: row.qlId,
  permanentSolveModeId: row.solveModeId,
  packageId: row.packageId,
  checkpointId: row.checkpointId,
  retainedGroupId: row.retainedGroupId,
  qlTitle: row.qlTitle,
  prototypeAncestryMember: row.memberCandidateId,
  reviewSeedIndex: row.reviewSeedIndex,
  seed: row.question.seed,
  state: row.question.state,
  stem: row.question.stem,
  options: row.question.options.map((option, index) => ({
    label: String.fromCharCode(65 + index),
    text: option.text,
    isCorrect: index === row.question.correctIndex,
    misconceptionId: option.misconceptionId,
  })),
  answer: row.question.answer.text,
  explanation: row.question.explanation,
  verification: row.question.verification,
}));

writeFileSync(jsonPath, `${JSON.stringify({
  status: "SRI_PERMANENT_ENGLISH_REVIEW_V1_CORPUS",
  lifecycle: "PERMANENT_IDS_ALLOCATED_ENGLISH_FREEZE_PENDING",
  permanentQlCount: SRI_PERMANENT_ALLOCATION_V1.length,
  permanentReviewMembers: SRI_PERMANENT_ENGLISH_REVIEW_MEMBERS_V1.length,
  seedsPerMember: SEEDS_PER_MEMBER,
  reviewQuestionCount: rows.length,
  frozenSolveModeCount: 0,
  englishFrozen: false,
  unresolvedHoldAppendix: SRI_R1_UNRESOLVED_SOURCE_GATES,
  rows: jsonRows,
}, null, 2)}\n`, "utf8");

const csvEscape = (value: unknown) => `"${String(value).replaceAll('"', '""').replaceAll("\n", " ")}"`;
const csv = [
  [
    "permanentQlId", "permanentSolveModeId", "packageId", "checkpointId", "retainedGroupId", "qlTitle",
    "prototypeAncestryMember", "reviewSeedIndex", "seed", "stem", "optionA", "optionB", "optionC", "optionD",
    "correctOption", "answer", "given", "asked", "method", "working",
  ].join(","),
  ...rows.map((row) => [
    row.qlId,
    row.solveModeId,
    row.packageId,
    row.checkpointId,
    row.retainedGroupId,
    row.qlTitle,
    row.memberCandidateId,
    row.reviewSeedIndex,
    row.question.seed,
    row.question.stem,
    row.question.options[0].text,
    row.question.options[1].text,
    row.question.options[2].text,
    row.question.options[3].text,
    String.fromCharCode(65 + row.question.correctIndex),
    row.question.answer.text,
    row.question.explanation.given,
    row.question.explanation.asked,
    row.question.explanation.method,
    row.question.explanation.working.join(" | "),
  ].map(csvEscape).join(",")),
].join("\n");
writeFileSync(csvPath, `${csv}\n`, "utf8");

const markdown: string[] = [
  "# SRI — Permanent-ID English Review V1",
  "",
  `**Permanent QLs:** ${SRI_PERMANENT_ALLOCATION_V1.length}`,
  "",
  `**Prototype ancestry members represented:** ${SRI_PERMANENT_ENGLISH_REVIEW_MEMBERS_V1.length}`,
  "",
  `**Review questions:** ${rows.length} (${SEEDS_PER_MEMBER} per prototype ancestry member)` ,
  "",
  "**Lifecycle:** permanent identities allocated; English fingerprints and solve-mode freeze pending; all product release gates remain OFF.",
  "",
];

let currentQl = "";
for (const row of rows) {
  if (row.qlId !== currentQl) {
    currentQl = row.qlId;
    markdown.push(
      "---",
      "",
      `# ${row.qlId} — ${row.qlTitle}`,
      "",
      `**Solve mode:** ${row.solveModeId}`,
      "",
      `**Package / checkpoint:** ${row.packageId} / ${row.checkpointId}`,
      "",
      `**Retained ancestry:** ${row.retainedGroupId}`,
      "",
    );
  }

  markdown.push(
    `## ${row.memberCandidateId} / seed ${row.reviewSeedIndex + 1}`,
    "",
    "### Question",
    "",
    row.question.stem,
    "",
    ...row.question.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option.text}${index === row.question.correctIndex ? " **✓**" : ""}`),
    "",
    `**Correct answer:** ${row.question.answer.text}`,
    "",
    "### Explanation",
    "",
    `**Given:** ${row.question.explanation.given}`,
    "",
    `**Asked:** ${row.question.explanation.asked}`,
    "",
    `**Method:** ${row.question.explanation.method}`,
    "",
    ...row.question.explanation.working.map((line, index) => `${index + 1}. ${line}`),
    "",
    `**Final answer:** ${row.question.explanation.answer}`,
    "",
  );
}

markdown.push(
  "---",
  "",
  "# HOLD appendix — not permanently allocated",
  "",
  ...SRI_R1_UNRESOLVED_SOURCE_GATES.flatMap((item) => [
    `## ${item.retainedGroupId} / ${item.candidateId}`,
    "",
    `**Disposition:** ${item.status}`,
    "",
    `**Reason:** ${item.note}`,
    "",
  ]),
);
writeFileSync(markdownPath, `${markdown.join("\n")}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS_SRI_PERMANENT_ENGLISH_REVIEW_V1_EXPORT",
  permanentQls: SRI_PERMANENT_ALLOCATION_V1.length,
  reviewMembers: SRI_PERMANENT_ENGLISH_REVIEW_MEMBERS_V1.length,
  questions: rows.length,
  jsonPath,
  csvPath,
  markdownPath,
}, null, 2));
