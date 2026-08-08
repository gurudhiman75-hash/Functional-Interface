import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { CALENDAR_PROTOTYPES } from "./registry.ts";
import { generateCalendarQuestion } from "./runtime.ts";
import { toCalendarQuestionStudioReviewRecord } from "./question-studio-contract.ts";

const outputDir = process.env.CAL_REVIEW_OUTPUT_DIR ?? join(process.cwd(), "dist", "reasoning-v1");
mkdirSync(outputDir, { recursive: true });

const rows = CALENDAR_PROTOTYPES.flatMap((definition) =>
  Array.from({ length: 12 }, (_, seed) => toCalendarQuestionStudioReviewRecord(generateCalendarQuestion(definition.id, seed, "en-IN"))),
);

const jsonPath = join(outputDir, "cal-001-english-prototype-review.json");
writeFileSync(jsonPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), lifecycle: "DISCOVERY_NOT_FROZEN", permanentQlCount: 0, rows }, null, 2)}\n`);

function csvCell(value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return `"${text.replaceAll('"', '""')}"`;
}

const headers = [
  "checkpoint", "prototypeAuthority", "seed", "difficulty", "stem", "options", "answerIndex",
  "canonicalAnswer", "explanation", "distractors", "coverageFlags", "lifecycle",
];
const csvLines = [headers.map(csvCell).join(",")];
for (const row of rows) {
  const studentView = row.studentView as Record<string, unknown>;
  csvLines.push([
    row.checkpoint, row.prototypeAuthority, row.seed, row.difficulty, studentView.stem,
    studentView.options, studentView.answerIndex, row.canonicalAnswer, studentView.explanation,
    row.distractors, row.coverageFlags, row.lifecycle,
  ].map(csvCell).join(","));
}
const csvPath = join(outputDir, "cal-001-english-prototype-review.csv");
writeFileSync(csvPath, `${csvLines.join("\n")}\n`);

const markdown: string[] = [
  "# CAL-001 English Prototype Review Pack",
  "",
  "- Lifecycle: executable discovery; not frozen",
  "- Permanent QLs: 0",
  `- Prototypes: ${CALENDAR_PROTOTYPES.length}`,
  "- English candidates per prototype: 12",
  `- Total candidates: ${rows.length}`,
  "- Question Bank/test/publication locks: closed",
  "",
];
for (const definition of CALENDAR_PROTOTYPES) {
  const samples = rows.filter((row) => row.prototypeAuthority === definition.id).slice(0, 2);
  markdown.push(`## ${definition.id} — ${definition.title}`, "", `Checkpoint: \`${definition.checkpoint}\``, "");
  for (const sample of samples) {
    const studentView = sample.studentView as { stem: string; options: string[]; answerIndex: number; explanation: unknown };
    markdown.push(`### Seed ${sample.seed}`, "", studentView.stem, "");
    studentView.options.forEach((option, index) => markdown.push(`${String.fromCharCode(65 + index)}. ${option}${index === studentView.answerIndex ? " **(correct)**" : ""}`));
    markdown.push("", "```json", JSON.stringify(studentView.explanation, null, 2), "```", "");
  }
}
const markdownPath = join(outputDir, "cal-001-english-prototype-review.md");
writeFileSync(markdownPath, `${markdown.join("\n")}\n`);

console.log(JSON.stringify({
  status: "PASS_CAL_001_REVIEW_EXPORT",
  rows: rows.length,
  prototypeCount: CALENDAR_PROTOTYPES.length,
  permanentQlCount: 0,
  jsonPath,
  csvPath,
  markdownPath,
}, null, 2));
