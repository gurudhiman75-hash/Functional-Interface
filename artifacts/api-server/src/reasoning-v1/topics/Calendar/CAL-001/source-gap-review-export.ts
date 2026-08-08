import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  CALENDAR_SOURCE_GAP_PROTOTYPES,
  selectCalendarSourceGapReviewQuestions,
  type CalendarSourceGapQuestion,
} from "./source-gap-runtime.ts";

const outputDir = process.env.CAL_REVIEW_OUTPUT_DIR ?? join(process.cwd(), "dist", "reasoning-v1");
mkdirSync(outputDir, { recursive: true });

const rows = CALENDAR_SOURCE_GAP_PROTOTYPES.flatMap((id) => selectCalendarSourceGapReviewQuestions(id));
const jsonPath = join(outputDir, "cal-001-source-gap-english-review-5q.json");
const markdownPath = join(outputDir, "cal-001-source-gap-english-review-5q.md");

writeFileSync(jsonPath, `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  lifecycle: "ENGLISH_IDENTITY_FROZEN_REVIEW_ONLY",
  prototypeCount: CALENDAR_SOURCE_GAP_PROTOTYPES.length,
  questionsPerPrototype: 5,
  totalQuestions: rows.length,
  questionStudioAllowed: false,
  questionBankWriteAllowed: false,
  mockTestAllowed: false,
  publiclyPublishable: false,
  rows,
}, null, 2)}\n`);

const markdown: string[] = [
  "# CAL-001 Source-Gap English Review Pack",
  "",
  "- Source-gap prototypes: 3",
  "- Questions per prototype: 5",
  "- Total questions: 15",
  "- Identity status: English frozen, review-only",
  "- Question Studio, Question Bank, mock-test and publication locks: closed",
  "",
];

function appendQuestion(question: CalendarSourceGapQuestion): void {
  markdown.push(`### Seed ${question.seed}`, "", question.stem, "");
  question.options.forEach((option, index) => {
    markdown.push(`${String.fromCharCode(65 + index)}. ${option}${index === question.answerIndex ? " **(correct)**" : ""}`);
  });
  markdown.push(
    "",
    `**Permanent identity:** ${question.proposedPermanentQlId}`,
    "",
    `**Observation:** ${question.explanation.observation}`,
    "",
    `**Rule:** ${question.explanation.rule}`,
    "",
  );
  question.explanation.working.forEach((step) => markdown.push(`- ${step}`));
  markdown.push("", `**Conclusion:** ${question.explanation.conclusion}`, "", `**Closest trap:** ${question.explanation.closestTrap}`, "");
}

for (const id of CALENDAR_SOURCE_GAP_PROTOTYPES) {
  markdown.push(`## ${id}`, "");
  rows.filter((row) => row.prototypeAuthority === id).forEach(appendQuestion);
}
writeFileSync(markdownPath, `${markdown.join("\n")}\n`);

console.log(JSON.stringify({
  status: "PASS_CAL_001_SOURCE_GAP_REVIEW_EXPORT",
  prototypeCount: CALENDAR_SOURCE_GAP_PROTOTYPES.length,
  questionsPerPrototype: 5,
  totalQuestions: rows.length,
  jsonPath,
  markdownPath,
}, null, 2));
