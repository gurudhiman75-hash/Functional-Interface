import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  SRI_ENGLISH_REVIEW_HOLD_GROUPS_R1,
  SRI_ENGLISH_REVIEW_READY_GROUPS_R1,
  buildSriEnglishReviewCorpusR1,
} from "./english-review-r1";
import { SRI_R1_UNRESOLVED_SOURCE_GATES } from "./source-gate-resolution-r1";

const SEEDS_PER_MEMBER = 3;
const rows = buildSriEnglishReviewCorpusR1(SEEDS_PER_MEMBER);
const outputDirectory = resolve(process.cwd(), "dist/quant-v4/sri");
mkdirSync(outputDirectory, { recursive: true });

const jsonPath = resolve(outputDirectory, "sri-english-review-r1.json");
const csvPath = resolve(outputDirectory, "sri-english-review-r1.csv");
const markdownPath = resolve(outputDirectory, "sri-english-review-r1.md");

const jsonRows = rows.map((row) => ({
  retainedGroupId: row.retainedGroupId,
  ownerCheckpointId: row.ownerCheckpointId,
  groupTitle: row.groupTitle,
  memberCandidateId: row.memberCandidateId,
  reviewSeedIndex: row.reviewSeedIndex,
  discoveryCheckpointId: row.question.checkpointId,
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
  verification: {
    solverVerifierAgree: row.question.verification.solverVerifierAgree,
    exactlyOneCorrectOption: row.question.verification.exactlyOneCorrectOption,
    domainValid: row.question.verification.domainValid,
  },
}));

writeFileSync(jsonPath, `${JSON.stringify({
  status: "SRI_ENGLISH_REVIEW_R1_CORPUS",
  lifecycle: "PRE_PERMANENT_REVIEW_ONLY",
  reviewReadyRetainedGroups: SRI_ENGLISH_REVIEW_READY_GROUPS_R1.length,
  reviewPrototypeMembers: new Set(rows.map((row) => row.memberCandidateId)).size,
  seedsPerMember: SEEDS_PER_MEMBER,
  reviewQuestionCount: rows.length,
  permanentQlCount: 0,
  frozenSolveModeCount: 0,
  holdAppendix: SRI_R1_UNRESOLVED_SOURCE_GATES,
  rows: jsonRows,
}, null, 2)}\n`, "utf8");

const csvEscape = (value: unknown) => `"${String(value).replaceAll('"', '""').replaceAll("\n", " ")}"`;
const csv = [
  [
    "retainedGroupId", "ownerCheckpointId", "groupTitle", "memberCandidateId", "reviewSeedIndex",
    "discoveryCheckpointId", "seed", "stem", "optionA", "optionB", "optionC", "optionD",
    "correctOption", "answer", "given", "asked", "method", "working",
  ].join(","),
  ...rows.map((row) => [
    row.retainedGroupId,
    row.ownerCheckpointId,
    row.groupTitle,
    row.memberCandidateId,
    row.reviewSeedIndex,
    row.question.checkpointId,
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
  "# SRI — Adversarial English Review Corpus R1",
  "",
  `**Review-ready retained contracts:** ${SRI_ENGLISH_REVIEW_READY_GROUPS_R1.length}`,
  "",
  `**Prototype members represented:** ${new Set(rows.map((row) => row.memberCandidateId)).size}`,
  "",
  `**Questions:** ${rows.length} (${SEEDS_PER_MEMBER} deterministic review questions per source-supported prototype member)` ,
  "",
  "**Lifecycle:** pre-permanent review only; no Question Studio, Question Bank, test or public eligibility.",
  "",
  "> Retained-group IDs and prototype IDs below are reviewer metadata only. They are not learner-facing and are not permanent QL IDs.",
  "",
];

let currentGroup = "";
for (const row of rows) {
  if (row.retainedGroupId !== currentGroup) {
    currentGroup = row.retainedGroupId;
    markdown.push(
      "---",
      "",
      `# ${row.retainedGroupId} — ${row.groupTitle}`,
      "",
      `**Owner checkpoint:** ${row.ownerCheckpointId}`,
      "",
    );
  }

  markdown.push(
    `## ${row.memberCandidateId} / review seed ${row.reviewSeedIndex + 1}`,
    "",
    `**Discovery checkpoint:** ${row.question.checkpointId}`,
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
  "# HOLD appendix — excluded from freeze-ready English review",
  "",
  ...SRI_ENGLISH_REVIEW_HOLD_GROUPS_R1.flatMap((group) => {
    const resolution = SRI_R1_UNRESOLVED_SOURCE_GATES.find((item) => item.retainedGroupId === group.retainedGroupId);
    return [
      `## ${group.retainedGroupId} — ${group.title}`,
      "",
      `**Members:** ${group.memberCandidateIds.join(", ")}`,
      "",
      `**Reason:** ${resolution?.note ?? "Unresolved source gate."}`,
      "",
      "**Disposition:** HOLD — executable discovery evidence only; not counted in the 58 review-ready contracts.",
      "",
    ];
  }),
);

writeFileSync(markdownPath, `${markdown.join("\n")}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS_SRI_ENGLISH_REVIEW_R1_EXPORT",
  reviewReadyGroups: SRI_ENGLISH_REVIEW_READY_GROUPS_R1.length,
  reviewMembers: new Set(rows.map((row) => row.memberCandidateId)).size,
  questions: rows.length,
  jsonPath,
  csvPath,
  markdownPath,
}, null, 2));
